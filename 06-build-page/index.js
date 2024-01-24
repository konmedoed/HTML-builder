const fs = require ('fs');
const path = require ('path');

fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
  if (err) console.log('folder exist!');
})

const componentFiles = [];
let arrLayoutTemplate = [];

fs.readdir(path.join(__dirname, 'components'), (err, files) => {
  if (err) console.log(err);
  files.forEach(item => componentFiles.push(item));
  readTemplate();
})

function readTemplate(){
  fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
    if (err) console.log(err);
    arrLayoutTemplate = data.toString().split(`\r\n`);
    const components = [];
    arrLayoutTemplate.forEach(item => {
      if (item.includes('{{') && item.includes('}}')) {
        const array = item.split('{{').filter(item => item.includes('}}'));
        const namesOfComp = array.map(item => {
          const index = item.indexOf('}');
          return item.slice(0, index);
        });
        namesOfComp.forEach(item => components.push(item));
      }
    })
    getLayout(components);
  })
}

function getLayout(arr){
  const layDataObj = {};
  arr.forEach((item, index) => {
    const readLay = fs.createReadStream(path.join(__dirname, 'components', (item + '.html')), 'utf-8');
    let data = '';
    let counter = index;
    readLay.on('data', (chunk) => data += chunk);
    readLay.on('end', () => {
      layDataObj[item] = data;
      if (counter === arr.length-1) generateUnionLayout(layDataObj);
    });
  })
}

function generateUnionLayout(data){
  let newTemplate = arrLayoutTemplate.join('\r\n');
  for (let key in data) {
    const strKey = '{{' + key + '}}';
    if (newTemplate.includes(strKey)){
      const correctedTemplate = newTemplate.replace(strKey, data[key]);
      newTemplate = correctedTemplate;
    }
  }
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    newTemplate,
    (err) => {if (err) throw err}
  )
}

//Copy styles

fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', (err) => {
  if (err) throw err;
})

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) throw err;
  let arr = [];
  const styleFiles = files.filter(item => {
    if (path.extname(item) === '.css') return true;
  })
  styleFiles.forEach((item, index) => {
      let style = '';
      let stream = fs.createReadStream(path.join(__dirname, 'styles', item), 'utf-8');
      stream.on('data', (chunk) => {
        style += chunk;
      });
      stream.on('end', () => {
        arr[index] = style;
        if (index === (styleFiles.length - 1)) writeStyles(arr);
      });
  });
})

function writeStyles(data){
  const styleStr = data.join('');
  const stream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  stream.write(styleStr);
}

//Copy assets

fs.cp(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist', 'assets'),
  {recursive: true},
  (err) => {if (err) throw err}
)