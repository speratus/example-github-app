const verifyMessage = require('./verify')
const push = require('./pushHook')

exports.parseWebhook = (payload, type, signature, delivery) => {
  switch (type) {
    case 'issue':
      return push.parse(payload, type, signature, delivery)
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

exports.processData = (data, context) => {
  switch (data.type) {
    case 'issue':
      push.process(data, context)
    default:
      console.log('Could not process webhook because it is not defined.')
  }
}