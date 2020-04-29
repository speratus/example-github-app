// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const storage = require('./storage')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
// const exists = fs.existsSync(dbFile);
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database(dbFile);

app.post('/webhooks', (request, response) => {
  console.log(`received webhook with id: ${request.get("X-GitHub-Delivery")} and hash: ${request.get("X-Hub-Signature")}`)
  console.log(`It's type is: ${request.get('X-GitHub-Event')}`)
  console.log(request.body)
  response.send('OK')
})

app.get("/callback", (req, res) => {
  res.sendFile(`${__dirname}/view/callback.html`)
})

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});