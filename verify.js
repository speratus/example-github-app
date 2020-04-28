const crypto = require('crypto')


export function verify_message(message, hash) {
  const hmac = crypto.createHmac('sha1', process.env.WEBHOOK_SECRET)
  hmac.update(message)
  const digest = 'sha1=' + hmac.digest('hex')
  return crypto.timingSafeEqual(hash, digest)
}