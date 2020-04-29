const datemath = require('./datemath')


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
  const authors = collectCommits(payload)
  const pusher = payload.pusher.name
  return {
    type,
    pusher,
    commitNumber: authors[pusher]
  }
}

function returnOrCreateObject(baseObject, key) {
  if (baseObject[key])
    return baseObject[key]
  else
    return baseObject[key] = {}
}

function doResetIfNeeded(lastModified, data) {
  if (datemath.isDateLastWeek(lastModified)) {
    data.days = {}
  }
}

function processPush(data, context) {
  let time = Date.now()
  const records = returnOrCreateObject(context, data.pusher)
  if (records.lastModified) {
    doResetIfNeeded(records.lastModified, records)
    
  }
}

exports.process = processPush
exports.parse = parsePush