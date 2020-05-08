const verifyMessage = require('./verify')
const push = require('./pushHook')


const hookTypes = {
  'push': push
}


// This method takes a webhook payload and parses out the data
// that is necessary for processing that kind of webhook.
// At the moment the only kind this app deals with are pushes.
exports.parseWebhook = (payload, type, signature, delivery) => {
  // Get the correct webhook from the hookTypes object.
  let webhook = hookTypes[type]
  
  // If a webhook for that types exists, then return the results of its parse function.
  if (webhook) {
    return webhook.parse(payload, type, signature, delivery)
  } else {
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
  // Get the relevant webhook from the hookTypes object.
  let webhook = hookTypes[data.type]
  
  //If the webhook exists, run its process function, otherwise log an error message.
  if (webhook) {
    webhook.process(data, context)
  } else {
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