const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

async function copyDirectory() {
  await fsPromises.rm(path.join(__dirname, 'files-copy'), {force: true, recursive: true });
  await fsPromises.mkdir(path.join(__dirname, "files-copy"), {
    recursive: true,
  });
  await fsPromises
    .readdir(path.join(__dirname, "files"), { withFileTypes: true })
    .then((files) => {
      for (let file of files) {
        fsPromises
          .copyFile(
            path.join(__dirname, "files", `${file.name}`),
            path.join(__dirname, "files-copy", `${file.name}`)
          )
          .then(function () {
            console.log(`File ${file.name} is copied`);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
copyDirectory();
