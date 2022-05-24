import { attr } from '../helpers/createXmlAttrString.js'

export class MemoryCue {
  start
  end
  label

  constructor(start) {
    this.setStart(start)
  }
  setStart(val) {
    if (val) this.start = parseFloat(val)
  }

  setEnd(val) {
    if (val) this.end = parseFloat(val)
  }

  setLabel(val) {
    if (val) this.label = val
  }

  exportAsRekordbox() {
    return `<POSITION_MARK ${attr('Name', this.label)} ${attr(
      'Type',
      this.end ? 4 : 0
    )} ${attr('Start', this.start ? this.start : false)} ${attr(
      'End',
      this.end ? this.end : false
    )} Num="-1"/>`
  }
}
