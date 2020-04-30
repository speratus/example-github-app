const datemath = require('./datemath')
const verifyMessage = require('./verify')

// extracts the commit data that we will be using from the payload.
function collectCommits(payload) {
  // Create an object to keep track of each individual author's contributions.
  let authors = {}
  // Iterate over the list of commits.
  payload.commits.forEach((c) => {
    // get the username of the commit author.
    const username = c.author.username
    // If the object already has the
    if (authors[username])
      authors[username] += 1
    else
      authors[username] = 1
  })
  return authors
}

// Parses the payload and extracts the relevant data.
function parsePush(payload, type, signature, delivery) {
  // First make sure the webhook is from GitHub.
  if (verifyMessage(payload, signature)) {
    // reduce the the commit info into each different author's number of commits.
    const authors = collectCommits(payload);
    const pusher = payload.pusher.name;
    const data = {
      type,
      pusher,
      commitNumber: authors[pusher]
    };
    console.log(`This is the useful data: ${JSON.stringify(data)}`)
    return data
  } else
    // If the webhook is not from GitHub, throw an error.
    throw new Error("Invalid message Signature!")
}

function returnOrCreateObject(baseObject, key) {
  if (key in baseObject)
    return baseObject[key]
  else
    return baseObject[key] = {}
}

function resetRecord(data) {
  data.days = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0
    }
  data.totalCommits = 0
}

function commitsThisWeek(record) {
  let sum = 0
  for (let day in record.days) {
    sum += record.days[day]
  }
  return sum
}

function doResetIfNeeded(lastModified, data) {
  if (datemath.isDateLastWeek(lastModified))
    resetRecord(data)
}

function processPush(data, context) {
  let time = Date.now()
  const record = returnOrCreateObject(context, data.pusher)
  
  if (record.lastModified)
    doResetIfNeeded(record.lastModified, record)
  else {
    resetRecord(record)
  }
    
  
  let today = datemath.convertDay(time);
  record.days[today] += data.commitNumber;
  record.lastModified = time
  record.totalCommits = commitsThisWeek(record)
}

exports.process = processPush
exports.parse = parsePush