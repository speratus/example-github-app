const verifyMessage = require('./verify')

function collectCommits(payload) {
  payload.commits.forEach((c) => {
    
  })
}

function parsePush(payload, type, signature, delivery) {
  
}

exports.parseWebhook = (payload, type, signature, delivery) => {
  switch (type) {
    case 'issue':
      return parsePush(payload, type, signature, delivery)
    default:
      if (verifyMessage(payload, signature)) {
        console.log("Received the following webhook but didn't know what to do with it:")
        console.log(payload)
      } else {
        throw new Error("Received a webhook that either was not from GitHub or was not properly verified!")
      }
  }
}