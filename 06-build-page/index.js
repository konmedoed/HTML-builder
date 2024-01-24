const fs = require ('fs');
const path = require ('path');

fs.rm(path.join(__dirname, 'project-dist', 'assets'), { recursive: true, force: true }, (err) => {
  //if (err) throw err;
  build();
});

function build(){
  fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
    if (err) console.log('folder exist!');
  });
  
  const componentFiles = [];
  let arrLayoutTemplate = [];
  
  fs.readdir(path.join(__dirname, 'components'), (err, files) => {
    if (err) console.log(err);
    files.forEach(item => {
      const address = path.join(__dirname, 'components', item);
      if (path.extname(address) === '.html') componentFiles.push(path.basename(address, path.extname(item)));
    });
    readTemplate();
  })
  
  function readTemplate(){
    fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
      if (err) console.log(err);
      arrLayoutTemplate = data.toString().split(`\r\n`);
      getLayout(componentFiles);
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
  
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), (err) => {
    if (err) console.log('folder exist!');
    copyFile(path.join(__dirname, 'assets'), '');
  })
  
  function copyFile(src, subSrc){
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach(item => {
        if (item.isDirectory()) {
          copyFile(path.join(__dirname, 'assets', path.join(subSrc, item.name)), path.join(subSrc, item.name));
          fs.mkdir(path.join(__dirname, 'project-dist', 'assets', path.join(subSrc, item.name)), (err) => {
            if (err) console.log('folder exist!');
          })
        }
        else {
          fs.readFile(path.join(src, item.name), (err, data) => {
            if (err) throw err;
            makeFile(subSrc, item.name, data);
          })
        }
      })
    })
  }
  
  function makeFile(subSrc, fileName, data){
    fs.writeFile(path.join(__dirname, 'project-dist', 'assets', subSrc, fileName), data, (err) => {
      if (err) throw err;
    })
  }
}