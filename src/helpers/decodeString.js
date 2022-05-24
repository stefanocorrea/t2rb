import { decode } from 'html-entities'

export function decodeString(string) {
  if (!string) return false
  return decode(string, { level: 'xml' })
}
