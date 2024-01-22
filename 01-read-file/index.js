const fs = require("fs");
const path = require('path');

const data = fs.createReadStream(path.join(__dirname, "text.txt"), 'utf-8');
data.on("data", (chunk) => console.log(chunk));