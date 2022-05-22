const fs = require('fs');
const path = require('path');
const [, , diraname = 'secret-folder'] = process.argv;

const getDirItems = (dir) => {
  fs.readdir(dir, {
    withFileTypes: true
  },
  (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(item => {      
        if(item.isFile()) {
          fs.stat(`${dir}/${item.name}`, (e, stat) => {
            if(e){
              console.log(err);
            } else {
              console.log(`${item.name}  -  ${path.extname(item.name) || item.name}  -  ${stat.size / 1000} Kb \n`);
            }
          });          
        } else {
          getDirItems(`${dir}/${item.name}`);
        }      
      });
    }    
  });
};

console.log('  Name   -   Ext   -   Size \n');
getDirItems(`${__dirname}/${diraname}`);

