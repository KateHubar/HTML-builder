
let fs = require('fs');
const { copyFile, writeFile, readFile, mkdir, readdir } = fs.promises;
const path = require('path');

const [, , basePath = '.', distPath = 'project-dist'] = process.argv;

const getAllFiles = async (src) => {
  const dirItems = await readdir(src, { withFileTypes: true, });
  const folders = dirItems.filter((item) => !item.isFile());
  const nestedFiles = (await Promise.all(folders.map((folder) => 
    getAllFiles(path.normalize(`${src}/${folder.name}`))
  ))).reduce((acc,item) => {
    return { ...acc, ...item};
  }, {});
  return {
    ...dirItems.filter(item => item.isFile()).reduce((acc, item) => {
      return { ...acc, [path.normalize(`${src}/${item.name}`)]: item};
    }, {}),
    ...nestedFiles};
};

const bundleCssFiles = async (src, dist) => {
  await mkdir(dist, { recursive: true });
  const folderItemsDic = await getAllFiles(src);

  const data = [];

  for (const filePath in folderItemsDic) {
    const item = folderItemsDic[filePath];
    if (path.extname(item.name) === '.css') {
      const css = await readFile(filePath);
      data.push(css);
    }
  }

  const styleBundle = path.normalize(`${dist}/style.css`);

  await writeFile(styleBundle, data.join(''));
};

const writeHtmlFile = async (dist, templateSrc, componentsSrc, outputFileName) => {
  await mkdir(dist, { recursive: true });
  const folderItemsDic = await getAllFiles(componentsSrc);

  let templateData = (await readFile(templateSrc)).toString();

  for (const filePath in folderItemsDic) {
    const item = folderItemsDic[filePath];
    if (path.extname(item.name) === '.html') {
      const componentHtml = (await readFile(filePath)).toString();
      const regx = new RegExp(`{{${path.parse(item.name).name}}}`, 'g');
      templateData = templateData.replace(regx, componentHtml);
    }
  }

  await writeFile(outputFileName, templateData);
};

const copyDir = async (src, dist) => {
  await mkdir(dist, { recursive: true });
  const dirItems = await readdir(src, { withFileTypes: true, });
  
  dirItems.forEach(async (item) => {
    const itemSrc = path.normalize(`${src}/${item.name}`);
    const itemDist = path.normalize(`${dist}/${item.name}`);
    if(item.isFile()) {
      await copyFile(itemSrc, itemDist);
    } else {
      await copyDir(itemSrc, itemDist);
    }
  });
};

(async () => {
  const dist = path.normalize(`${__dirname}/${distPath}`);
  const src = path.normalize(`${__dirname}/${basePath}`);

  const templateSrc = path.normalize(`${__dirname}/${basePath}/template.html`);
  const indexHtml = path.normalize(`${dist}/index.html`);
  const assetsSrc = path.normalize(`${src}/assets`);
  const assetsDist = path.normalize(`${dist}/assets`);
  const componentSrc = path.normalize(`${src}/components`);
  const styleSrc = path.normalize(`${src}/styles`);

  await writeHtmlFile(dist, templateSrc, componentSrc, indexHtml);
  await bundleCssFiles(styleSrc, dist);
  await copyDir(assetsSrc, assetsDist);

  console.log('Bundling completed!');
})();
