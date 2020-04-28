import { Hook } from './Hook'

class Push extends Hook {
  constructor(payload, signature, type, delivery) {
    super(payload, signature, type, delivery)
    this.pusher = this.payload.pusher.name
    this.commitNumber = this.committers()[this.pusher]
    this.data = this.data.bind(this)
  }
  
   committers() {
    let authors = {}
    this.payload.commits.forEach((c) => {
      if (authors[c.committer.username])
        authors[c.committer.username] += 1
      else
        authors[c.committer.username] = 1
    })
    return authors
  }
  
  data() {
    return {
      'pusher': this.pusher,
      'commitNumber': this.commitNumber
    }
  }
}

export default Push