const path = require ('path');
const fs = require ('fs');

fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
  if (err) console.log('folder exist!');
  fs.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true }, (err, data) => {
      if (err) throw err
      for (let i=0; i<data.length; i++){
        fs.unlink(path.join(__dirname, 'files-copy', data[i].name), (err) => {
            if (err) throw err;
        });
      }
      copyFiles();
    }
  );
});

function copyFiles(){
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) throw err;
    files.forEach(item => {
      fs.readFile(path.join(__dirname, 'files', item), (err, data) => {
        if (err) throw err;
        makeFile(item, data);
      })
    })
  })
}

function makeFile(fileName, data){
  fs.writeFile(path.join(__dirname, 'files-copy', fileName), data, (err) => {
    if (err) throw err;
  })
}