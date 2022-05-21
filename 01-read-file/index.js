const fs = require('fs');
const path = require('path');
const [,,filename = 'text.txt', encoding] = process.argv;
const basename = path.basename(filename);

const readableStream = fs.createReadStream(`${__dirname}/${basename}`, {
  encoding: encoding || 'UTF-8',
});

readableStream.on('data', function (chunk) {
  console.log(chunk);
});
