import { attr } from '../helpers/createXmlAttrString.js'

export class Playlist {
  constructor(name) {
    this.name = name
    this.tracks = []
  }

  addTrack(track) {
    this.tracks.push(track)
  }

  exportAsRekordbox() {
    return (
      `<NODE Type="1" ${attr('Name', this.name)}  KeyType="0" ${attr(
        'Entries',
        this.tracks.length
      )}>` +
      this.tracks.reduce((acum, track) => {
        return acum + track.exportAsRekordboxPlaylistTrack()
      }, '') +
      '</NODE>'
    )
  }

  exportAsTraktor() {
    let output = ''
    output += `<NODE TYPE="PLAYLIST" NAME="${this.name}">`
    output += `<PLAYLIST ENTRIES="${this.tracks.length}" TYPE="LIST" UUID="">`
    this.tracks.map(track => (output += track.exportAsTraktorPlaylistTrack()))
    output += `</PLAYLIST>`
    output += `</NODE>`
    return output
  }
}
