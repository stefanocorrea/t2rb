import { attr } from '../helpers/createXmlAttrString.js'

export class Folder {
  constructor(name = null) {
    this.name = name
    this.playlists = []
    this.folders = []
  }

  addPlaylist(playlist) {
    this.playlists.push(playlist)
  }

  addFolder(folder) {
    this.folders.push(folder)
  }

  exportAsRekordbox() {
    return (
      `<NODE Type="0" ${attr(
        'Name',
        this.name === '$ROOT' ? 'ROOT' : this.name
      )} ${attr('Count', this.folders.length + this.playlists.length)}>` +
      this.folders.reduce((acum, curr) => {
        return acum + curr.exportAsRekordbox()
      }, '') +
      this.playlists.reduce((acum, curr) => {
        return acum + curr.exportAsRekordbox()
      }, '') +
      '</NODE>'
    )
  }

  exportAsTraktor() {
    let output = ''
    output += `<NODE TYPE="FOLDER" ${attr('NAME', this.name)}>`
    output += `<SUBNODES ${attr(
      'COUNT',
      this.folders.length + this.playlists.length
    )} >`
    this.folders.map(folder => (output += folder.exportAsTraktor()))
    this.playlists.map(playlist => (output += playlist.exportAsTraktor()))
    output += `</SUBNODES>`
    output += `</NODE>`

    return output
  }
}
