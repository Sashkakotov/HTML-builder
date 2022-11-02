const { stdin, stdout, exit } = require("process");
const fs = require("fs");
const path = require("path");
const EventEmitter = require('events');
const emitter = new EventEmitter();


const output = fs.createWriteStream(path.join(__dirname, "text.txt"));

stdout.write("Напиши что-нибудь\n");
stdin.on("data", (data) => {
  const string = data.toString().trim();
  if(string==='exit'){emitter.emit('exit')}
  output.write(data);
});
emitter.on('exit', ()=>{
  stdout.write('Давай, до свидания!\n')
  exit()
})
process.on('SIGINT', ()=>{
  stdout.write('Давай, до свидания!\n')
  exit()
})