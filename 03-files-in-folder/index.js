const path = require('path');
const fs = require('fs');

fs.readdir(
  path.join(__dirname, "secret-folder"),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    const files = data.filter(item => {
      if (!item.isDirectory()) return true;
    });
    files.forEach(item => {
      const name = path.basename(item.name, path.extname(item.name));
      const extArr = path.extname(item.name).split('');
      extArr.shift();
      const ext = extArr.join('');
      let size = 'kb';
      fs.stat(path.join(__dirname, 'secret-folder', item.name), (err, stats) => {
        if (err) throw err;
        size = stats.size/1000 + size;
        console.log(name + ' - ' + ext + ' - ' + size);
      });
    });
  }
);