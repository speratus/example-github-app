const verifyMessage = require('./verify')
const push = require('./pushHook')

exports.parseWebhook = (payload, type, signature, delivery) => {
  switch (type) {
    case 'push':
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
    case 'push':
      push.process(data, context)
      break;
    default:
      console.log('Could not process webhook because it is not defined.')
  }
}

exports.extractHeaders = (request) => {
  const type = request.get('X-GitHub-Event')
  const signature = request.get('X-Hub-Signature')
  const delivery = request.get('X-GitHub-Delivery')
  if (type && signature && delivery) {
    return {
      type,
      signature,
      delivery
    }
  } else
    throw new Error('Invalid Webhook!')
}