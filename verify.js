//Required for safely verifying the integrity of the webhooks
const crypto = require('crypto')


module.exports = function verifyMessage(message, hash) {
  //See the GitHub guide for securing webhooks to understand this function
  // https://developer.github.com/webhooks/securing/
  const hmac = crypto.createHmac('sha1', process.env.WEBHOOK_SECRET)
  hmac.update(JSON.stringify(message))
  const digest = 'sha1=' + hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'utf8'), Buffer.from(digest, 'utf8'))
}