const verifyMessage = require('./verify')
const push = require('./pushHook')

// This method takes a webhook payload and parses out the data
// that is necessary for processing that kind of webhook.
// At the moment the only kind this app deals with are pushes.
exports.parseWebhook = (payload, type, signature, delivery) => {
  switch (type) {
    case 'push':
      // Hand the data off to the push module for parsing and return the result.
      return push.parse(payload, type, signature, delivery)
    default:
      // Make sure the webhook is from GitHub.
      if (verifyMessage(payload, signature)) {
        console.log("Received the following webhook but didn't know what to do with it:")
        console.log(payload)
        return {
          payload,
          type
        }
      } else {
        // Otherwise throw an error. We don't want to process it any further.
        throw new Error("Received a webhook that either was not from GitHub or was not properly verified!")
      }
  }
}

// Perform the actual data processing with the data
// obtained from the webhook.
exports.processData = (data, context) => {
  switch (data.type) {
    case 'push':
      // Hand the relevant data off to the push module.
      push.process(data, context)
      break;
    default:
      // Otherwise, we don't know what to do with it.
      console.log('Could not process webhook because it is not defined.')
  }
}


// Extracts the headers necessary to properly handle the webhook and
// returns them in a object.
exports.extractHeaders = (request) => {
  // Used to determine what kind of webhook it is.
  const type = request.get('X-GitHub-Event')
  // The signature is required to verify that the webhook is from GitHub.
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