const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises

const bundleCSS = fs.createWriteStream(
  path.join(__dirname, "project-dist", "bundle.css")
);
fsPromises.readdir(path.join(__dirname,'styles'),{withFileTypes:true})
.then(filenames=>{
  for(let filename of filenames){
    const readFile=fs.createReadStream(path.join(__dirname,'styles',`${filename.name}`))
    if (filename.isFile() && filename.name.includes('.css')){
      readFile.on('data',(data)=>bundleCSS.write(data))
    }
  }
})
.catch(err=>{
  console.log(err)
})
