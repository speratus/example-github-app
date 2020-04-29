// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const storage = require('./storage')
const webhook = require('./webhooks')

//read in all the stored data when the server starts
const records = storage.readData()

//Make express use pug as the view engine
app.set("view engine", "pug")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//This is the url webhooks will be sent to.
app.post('/webhooks', (request, response) => {
  console.log("received a webhook. Now beginning to process it.");
  try {
    //Get the GitHub headers necessary for processing the webhook.
    const headers = webhook.extractHeaders(request)
    
    //Log the data for debugging purposes
    console.log(
      `received webhook with id: ${headers.delivery} and hash: ${headers.signature}`
    );
    console.log(`It's type is: ${headers.type}`);
    
    //return the data that is relevant for this app.
    const data = webhook.parseWebhook(request.body, headers.type, headers.signature, headers.delivery)
    
    //modifies the record data with the data from the webhook
    webhook.processData(data, records)
    storage.writeData(records)
    response.sendStatus(200)
  } catch(error) {
    console.log(error)
    response.sendStatus(500)
  }
  
})

//This url generates the reports for each user
app.get("/report/:user", (req, res) => {
  //extract the username parameter from the url
  const username = req.params.user
  if (username in records) {
    //If there is a record for this user, get the record
    const record = records[username]
    //format the data for use by the view template.
     const data = {
       user: username,
       commits: record.days,
       total: record.totalCommits
     }
     res.render('report', data)
  } else
    //If there are no records for the user, return a 404 page.
    res.sendStatus(404)
})

//Used for user authorization. Not really necessary for this app.
app.get("/callback", (req, res) => {
  res.sendFile(`${__dirname}/view/callback.html`)
})

// http://expressjs.com/en/starter/basic-routing.html
//Displays a main page
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