const fs = require('fs')
const filePath = './.data/storage.json'

// Writes the data out to the storage file.
exports.writeData = (json) => {
  fs.writeFile(filePath, JSON.stringify(json), 'utf-8', (err) => {
    if (err) throw err;
    console.log('storage.json was saved successfully')
  })
}

// Read the data from the storage file.
exports.readData = () => {
  // To simplify how we handle the data, we want to read it synchronously.
  if (fs.existsSync(filePath)) {
    let data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } else {
    // If the file doesn't exist, no worries, we just return an empty object.
    return {}
  }
};