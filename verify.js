const crypto = require('crypto')


module.exports = function verifyMessage(message, hash) {
  console.log(`message is: ${typeof message}`)
  console.log(message)
  const hmac = crypto.createHmac('sha1', process.env.WEBHOOK_SECRET)
  hmac.update(JSON.stringify(message))
  const digest = 'sha1=' + hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'utf8'), Buffer.from(digest, 'utf8'))
}