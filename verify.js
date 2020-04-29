const crypto = require('crypto')


module.exports = function verifyMessage(message, hash) {
  const hmac = crypto.createHmac('sha1', process.env.WEBHOOK_SECRET)
  hmac.update(message)
  const digest = 'sha1=' + hmac.digest('hex')
  return crypto.timingSafeEqual(hash, digest)
}