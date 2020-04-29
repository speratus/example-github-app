const datemath = require('./datemath')
const verifyMessage = require('./verify')

function collectCommits(payload) {
  let authors = {}
  payload.commits.forEach((c) => {
    const username = c.author.username
    if (authors[username])
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
    const data = {
      type,
      pusher,
      commitNumber: authors[pusher]
    };
    console.log(`This is the useful data: ${JSON.stringify(data)}`)
    return data
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