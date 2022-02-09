import { EventEmitter2 } from 'eventemitter2'
import {
  USER_EMAIL_CONFIRMATION,
  userEmailConfirmationEvent,
} from './mail.event'

export const emitter = new EventEmitter2({
  wildcard: false,
  delimiter: '.',
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: false,
  ignoreErrors: false,
})

export function initEvents(): void {
  emitter.on(USER_EMAIL_CONFIRMATION, userEmailConfirmationEvent)
}
