const datemath = require('./datemath')
const verifyMessage = require('./verify')

function collectCommits(payload) {
  let authors = {}
  payload.commits.forEach((c) => {
    const username = c.author.username
    if (username)
      authors[username] += 1
    else
      authors[username] = 1
  })
  return authors
}


function parsePush(payload, type, signature, delivery) {
  if (verifyMessage(payload, signature)) {
    const authors = collectCommits(payload);
    const pusher = payload.pusher.name;
    return {
      type,
      pusher,
      commitNumber: authors[pusher]
    };
  } else
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
}

function doResetIfNeeded(lastModified, data) {
  if (datemath.isDateLastWeek(lastModified))
    resetRecord(data)
}

function processPush(data, context) {
  let time = Date.now()
  const records = returnOrCreateObject(context, data.pusher)
  
  if (records.lastModified)
    doResetIfNeeded(records.lastModified, records)
  else {
    resetRecord(records)
  }
    
  
  let today = datemath.convertDay(time);
  records.days[today] += data.commitNumber;
  records.lastModified = time
}

exports.process = processPush
exports.parse = parsePush