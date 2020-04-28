import Hook from './Hook'
import Push from './Push'

export default function createHook(payload, signature, type, delivery) {
  switch (type) {
    case 'push':
      return new Push(payload, signature, type, delivery)
    default:
      return new Hook(payload, signature, type, delivery)
  }
}