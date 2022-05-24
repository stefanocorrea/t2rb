import { encode } from 'html-entities'

export function attr(name, value) {
  if (!value && value !== 0) return ''
  return `${name}="${encode(value, {
    mode: 'nonAsciiPrintable',
    level: 'xml'
  })}"`
}
