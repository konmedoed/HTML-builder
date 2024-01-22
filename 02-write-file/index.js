const fs = require ('fs');
const path = require ('path');


fs.writeFile(path.join(__dirname, "text.txt"), '', (err) => {
  if (err) throw err;
})

process.stdin.on('data', (data) => {
  if (data.toString().includes('exit')) exit();
  fs.appendFile(path.join(__dirname, "text.txt"), data, (err) => {
    if (err) throw err;
  })
});
process.stdout.write(`Hello! Let's test it!\n`);

process.on('SIGINT', () => exit());

function exit(){
  process.stdout.write('Good riddance!');
  process.exit();
}