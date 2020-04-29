const fs = require('fs')
const filePath = './.data/storage.json'

exports.writeData = (json) => {
  fs.writeFile(filePath, JSON.stringify(json), 'utf-8', (err) => {
    if (err) throw err;
    console.log('storage.json was saved successfully')
  })
}

exports.readData = () => {
  if (fs.existsSync(filePath)) {
    let data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } else {
    return {}
  }
};