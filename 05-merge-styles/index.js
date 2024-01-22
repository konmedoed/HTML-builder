const path = require ('path');
const fs = require ('fs');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
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
  const stream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
  stream.write(styleStr);
}