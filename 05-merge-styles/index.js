const fs = require('fs');
const {mkdir, readdir, writeFile, readFile} = fs.promises;
const path = require('path');

const [,,basePath = 'styles', distPath = 'project-dist' ] = process.argv;

(async () => {
  const dist = path.normalize(`${__dirname}/${distPath}`);
  const src = path.normalize(`${__dirname}/${basePath}`);
  const itemDist = path.normalize(`${dist}/bundle.css`);

 
  const processDirItemsAnnCreateBundle = async (src, dist) => {
    await mkdir(dist, { recursive: true });
    const dirItems = await readdir(src, { withFileTypes: true, });
    
    const data = await Promise.all(dirItems.map(async (item) => {
      const itemSrc = path.normalize(`${src}/${item.name}`);
      
      if(item.isFile() && path.extname(item.name) === '.css') {
        return readFile(itemSrc);
      }
    }));

    await writeFile(itemDist, data.join(''));
  };

  await processDirItemsAnnCreateBundle(src, dist);

  console.log('Bundling completed!');
})();
