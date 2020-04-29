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
  const authors = collectCommits(payload)
  const pusher = payload.pusher.name
  return {
    type,
    pusher,
    commitNumber: authors[pusher]
  }
}

exports.parseWebhook = (payload, type, signature, delivery) => {
  switch (type) {
    case 'issue':
      return parsePush(payload, type, signature, delivery)
    default:
      if (verifyMessage(payload, signature)) {
        console.log("Received the following webhook but didn't know what to do with it:")
        console.log(payload)
        return {
          payload,
          type
        }
      } else {
        throw new Error("Received a webhook that either was not from GitHub or was not properly verified!")
      }
  }
}

function convertDay(date) {
  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
  return days[(new Date(date)).getDay()]
}

function processPush(data, commitCountData) {
  let time = Date.now()
}

exports.processData = (data, context) => {
  switch (data.type) {
    case 'issue':
      processPush(data, context)
    default:
      console.log('Could not process webhook because it is not defined.')
  }
}