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
    // If the object already has commits from the author, increment the number of their commits,
    // otherwise, set it equal to 1.
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
    // Reduce the the commit info into each different author's number of commits.
    const authors = collectCommits(payload);
    // Get the username of the pusher.
    const pusher = payload.pusher.name;
    // The only data that we need is the type of webhook,
    // the name of the pusher, and the number of their commits in the push.
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

// Used to make sure that we never have to worry about undefined variables
// somewhere in the object.
function returnOrCreateObject(baseObject, key) {
  if (key in baseObject)
    return baseObject[key]
  else
    return baseObject[key] = {}
}

// Resets the records for a user.
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

// totals up the number of commits the user has made this week.
function commitsThisWeek(record) {
  let sum = 0
  for (let day in record.days) {
    sum += record.days[day]
  }
  return sum
}

// Checks to see if the last commit was made at least a week prior.
// If it was, then it resets the data.
function doResetIfNeeded(lastModified, data) {
  if (datemath.isDateLastWeek(lastModified))
    resetRecord(data)
}

// Handles the actual processing of the data.
// Modifies the context object in place.
function processPush(data, context) {
  // Get the current time for determining whether to reset the data.
  let time = Date.now()
  // Either gets the data or returns an empty object.
  const record = returnOrCreateObject(context, data.pusher)
  
  // If the record has a lastModified attribute, we need to check whether
  // it is time for the data to be reset.
  if (record.lastModified)
    //Check whether the data should be reset.
    doResetIfNeeded(record.lastModified, record)
  else {
    // If there is no lastModified field, then this is presumably
    // the first time this author has pushed code, so reset the data so it is not undefined.
    resetRecord(record)
  }
    
  // Convert the current date into a meaningful name of a day of the week,
  // e. g. "Wednesday"
  let today = datemath.convertDay(time);
  // Add the number of commits in the push to the number of commits that have been pushed today.
  record.days[today] += data.commitNumber;
  // Set lastModified to now so we can determine 
  record.lastModified = time
  record.totalCommits = commitsThisWeek(record)
}

exports.process = processPush
exports.parse = parsePush