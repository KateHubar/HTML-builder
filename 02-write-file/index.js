const fs = require('fs');
const path = require('path');
const readline = require('readline');
const [,,filename = 'text.txt', encoding] = process.argv;
const basename = path.basename(filename);

const writableStream = fs.createWriteStream(`${__dirname}/${basename}`, {
  encoding: encoding || 'UTF-8',
});

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getNewLine = function() {
  interface.question('Write the next line: ', line => {
    if(line === 'exit') {
      process.exit(0);
    }

    writableStream.write(`${line}\n`);  
    getNewLine();
  });
}

process.on('exit', function () {
  interface.write('Have a good day!');
  writableStream.close();
  interface.close(); 
});

getNewLine();
