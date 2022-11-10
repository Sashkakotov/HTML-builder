const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

async function createDirectory(directory) {
  await fsPromises.mkdir(path.join(__dirname, `${directory}`), {
    recursive: true,
  });
}

async function copyDirectory(folder, folderCopy) {
  await fsPromises.rm(folderCopy,{force:true,recursive:true})
  await fsPromises.mkdir(folderCopy, { recursive: true });
  const files = await fsPromises.readdir(folder, { withFileTypes: true });
  files.forEach(async (file) => {
    const baseFile = path.join(folder, `${file.name}`);
    const copyFile = path.join(folderCopy, `${file.name}`);
    if (!file.isFile()) {
      copyDirectory(baseFile, copyFile);
    } else {
      await fsPromises.copyFile(baseFile, copyFile);
    }
  });
}

const styleCSS = fs.createWriteStream(
  path.join(__dirname, "project-dist", "style.css")
);

async function mergeStyles() {
  await fsPromises
    .readdir(path.join(__dirname, "styles"), { withFileTypes: true })
    .then(async (filenames) => {
      for await (let filename of filenames) {
        const readFile = fs.createReadStream(
          path.join(__dirname, "styles", `${filename.name}`)
        );
        if (filename.isFile() && filename.name.includes(".css")) {
          readFile.on("data", (data) => styleCSS.write(data));
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function createHTML() {
  await fsPromises
    .readdir(path.join(__dirname, "components"), { withFileTypes: true })
    .then((filenames) => {
      const readTemplate = fs.createReadStream(
        path.join(__dirname, "template.html")
      );
      readTemplate.on("data", async (data) => {
        let template = data.toString();
        for (let filename of filenames) {
          if (filename.isFile() && filename.name.includes(".html")) {
            const readFile = await fsPromises.readFile(
              path.join(__dirname, "components", `${filename.name}`)
            );
            const pattern = path.basename(`${filename.name}`, ".html");
            template = template.replace(`{${pattern}}`, readFile);
          }
        }
        await fsPromises.writeFile(
          path.join(__dirname, "project-dist", "index.html"),
          template
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
async function buildPage() {
  createDirectory("project-dist");
  copyDirectory(
    path.join(__dirname, "assets"),
    path.join(__dirname, "project-dist", "assets")
  );
  createHTML();
  mergeStyles();
}
buildPage();
