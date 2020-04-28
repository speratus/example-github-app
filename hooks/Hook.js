import verifySignature from '../verify'

export default class Hook {
  constructor(payload, signature, type, delivery) {
    this.payload = payload
    this.signature = signature
    this.type = type
    this.delivery = delivery
    
    const good = verifySignature(this.payload, this.signature)
    this.status = good ? 200 : 500
    this.message = good ? 'OK' : 'Invalid Signature'
  }
  
  data() {
    return {}
  }
  
}