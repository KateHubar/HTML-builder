const fs = require('fs');
const {copyFile, mkdir, readdir} = fs.promises;
const path = require('path');

const [,,basePath = 'files', distPath = 'files-copy' ] = process.argv;

(async () => {
  const dist = path.normalize(`${__dirname}/${distPath}`);
  const src = path.normalize(`${__dirname}/${basePath}`);
 
  const processDirItemsAndCopy = async (src, dist) => {
    await mkdir(dist, { recursive: true });
    const dirItems = await readdir(src, { withFileTypes: true, });
    
    dirItems.forEach(async (item) => {
      const itemSrc = path.normalize(`${src}/${item.name}`);
      const itemDist = path.normalize(`${dist}/${item.name}`);
      if(item.isFile()) {
        await copyFile(itemSrc, itemDist);
      } else {
        await processDirItemsAndCopy(itemSrc, itemDist);
      }
    });
  };

  await processDirItemsAndCopy(src, dist);

  console.log('Сopying completed!');
})();
