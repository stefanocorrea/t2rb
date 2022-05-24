import { convertHexToRGB } from '../helpers/convertHexToRGB'
import { attr } from '../helpers/createXmlAttrString.js'

export class HotCue {
  start
  end
  color
  label
  num
  type

  constructor(num, start) {
    this.setStart(start)
    this.setNum(num)
    this.setType(0)
  }

  setStart(val) {
    if (val && val !== undefined) this.start = parseFloat(val)
  }

  setEnd(val) {
    if (val) this.end = parseFloat(val)
  }

  setColor(val) {
    if (val) this.color = val
  }

  setLabel(val) {
    if (val) this.label = val
  }

  setNum(val) {
    if (val) this.num = val
  }

  setType(val) {
    if (val) this.label = val
  }

  exportAsRekordbox() {
    let color = convertHexToRGB(this.color)

    return `<POSITION_MARK ${attr('Name', this.label)} ${attr(
      'Type',
      this.type === 5 ? 4 : 0
    )} ${attr('Start', this.start ? this.start : false)} ${attr(
      'End',
      this.end ? this.end : false
    )} ${attr('Num', this.num)} ${attr('Red', color.r)} ${attr(
      'Green',
      color.g
    )} ${attr('Blue', color.b)}  />`
  }

  exportAsTraktor() {
    return `<CUE_V2 ${attr('NAME', this.label)} DISPL_ORDER="0" ${attr(
      'TYPE',
      this.type
    )} ${attr('START', this.start)} ${attr(
      'LEN',
      this.end - this.start
    )} REPEATS="-1" ${attr('HOTCUE', this.num)}></CUE_V2>`
  }
}
