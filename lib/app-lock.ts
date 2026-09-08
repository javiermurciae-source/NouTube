import { settings$ } from '@/states/settings'

const SALT = 'noutube-applock-v1'

export const hashPin = (pin: string) => {
  const input = `${SALT}:${pin}`
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return `${(h2 >>> 0).toString(16)}${(h1 >>> 0).toString(16)}`
}

export const isValidPinFormat = (pin: string) => /^\d{4,8}$/.test(pin)

export const verifyPin = (pin: string) => {
  const hash = settings$.appLockPinHash.get()
  if (!hash) return false
  return hashPin(pin) === hash
}

export const setAppPin = (pin: string) => {
  settings$.assign({ appLockPinHash: hashPin(pin), appLockEnabled: true })
}

export const clearAppLock = () => {
  settings$.assign({ appLockPinHash: '', appLockEnabled: false })
}

export const isAppLockActive = () => {
  const s = settings$.get()
  return Boolean(s.appLockEnabled && s.appLockPinHash)
}
