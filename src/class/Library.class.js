import XMLParseAntigo from 'react-xml-parser'
import { getParseOptions } from '../helpers/parseXmlDefaultOptions'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { Folder } from './Folder.class'
import { Playlist } from './Playlist.class'
import { Track } from './Track.class'
import { HotCue } from './HotCue.class'
import { MemoryCue } from './MemoryCue.class'
import { getOpenKey } from '../helpers/getOpenKey'
import { createTrackFromTraktorXML } from '../helpers/createTrackFromXML'
import { createTrackFromRekordboxXML } from '../helpers/createTrackFromXML'
import { convertRGBToHex } from '../helpers/convertRGBToHex'
import moment from 'moment'
import { decodeString } from '../helpers/decodeString'
import { attr } from '../helpers/createXmlAttrString.js'

const fs = window.require('fs').promises
const os = window.require('os')

export class Library {
  originalLibrary
  origin

  constructor() {
    this.collection = []
    this.playlists = []
  }

  recursiveReadTraktorPlaylistNode(node) {
    /* TODO: organize names */
    let a
    switch (node._TYPE) {
      case 'FOLDER':
        a = new Folder(node._NAME)
        node.SUBNODES?.NODE?.map(subnode => {
          switch (subnode._TYPE) {
            case 'FOLDER':
              a.addFolder(this.recursiveReadTraktorPlaylistNode(subnode))
              break
            case 'PLAYLIST':
              a.addPlaylist(this.recursiveReadTraktorPlaylistNode(subnode))
              break
            default:
          }
          return true
        })
        break
      case 'PLAYLIST':
        a = new Playlist(node._NAME)
        node.PLAYLIST?.ENTRY?.map(subnode => {
          let isMacOS = os.platform() === 'darwin'

          let location = decodeString(
            `${isMacOS ? '/Volumes/' : ''}${
              subnode.PRIMARYKEY._KEY
            }`.replaceAll('/:', '/')
          )
          let track = new Track(location)
          let trackInLibrary = this.getTrackByLocation(location)
          trackInLibrary && track.setId(trackInLibrary.id)

          a.addTrack(track)
          return true
        })
        break
      default:
        a = false
    }

    return a
  }

  importPlaylistsFromTraktor() {
    let originalPlaylists = this.originalLibrary.NML?.PLAYLISTS

    let a = []
    originalPlaylists &&
      a.push(this.recursiveReadTraktorPlaylistNode(originalPlaylists?.NODE))

    this.playlists = a

    // return true
  }

  importCollectionFromTraktor() {
    let libraryTracks = []

    this.originalLibrary.NML.COLLECTION?.ENTRY.map((trackNode, index) => {
      const builder = new XMLBuilder(getParseOptions('traktor'))
      let xmlDataStr = builder.build([trackNode])

      let track = createTrackFromTraktorXML(xmlDataStr, index + 1)

      libraryTracks.push(track)

      return true
    })

    this.collection = libraryTracks
  }

  importPlaylistsFromRekordbox() {
    /* TODO: Read playlists from Rekordbox */
  }

  importCollectionFromRekordbox() {
    this.originalLibrary.DJ_PLAYLISTS?.COLLECTION?.TRACK.map(
      (trackNode, index) => {
        const builder = new XMLBuilder(getParseOptions('rekordbox'))
        let xmlDataStr = builder.build([trackNode])

        let track = createTrackFromRekordboxXML(xmlDataStr, index + 1)

        return this.collection.push(track)
      }
    )
  }

  guessOrigin(xmlLibraryString) {
    let xml = new XMLParser()
    let xmlAsObject = xml.parse(xmlLibraryString)

    if (xmlAsObject.NML) return (this.origin = 'traktor')
    if (xmlAsObject.DJ_PLAYLISTS) return (this.origin = 'rekordbox')
  }

  setOrigin(value) {
    this.origin = value
  }

  setOriginalLibrary(value) {
    if (!value) return false
    this.originalLibrary = value

    return true
  }

  importPlaylists() {
    if (this.origin === 'traktor') return this.importPlaylistsFromTraktor()
    if (this.origin === 'rekordbox') return this.importPlaylistsFromRekordbox()
  }

  importCollection() {
    if (this.origin === 'traktor') return this.importCollectionFromTraktor()
    if (this.origin === 'rekordbox') return this.importCollectionFromRekordbox()
  }

  exportCollectionAsTraktor() {
    if (this.collection.length < 1) return ''
    alert()

    return (
      `<COLLECTION ENTRIES="${this.collection.length}">` +
      this.collection.reduce((acum, track) => {
        return acum + track.exportAsTraktor()
      }, '') +
      '</COLLECTION>'
    )
  }

  exportPlaylistsAsTraktor() {
    if (this.playlists.length < 1) return ''
    let output = ''
    output += `<PLAYLISTS>`
    this.playlists.map(folder => (output += folder.exportAsTraktor()))
    output += `</PLAYLISTS>`
    return output
  }

  exportCollectionAsRekordbox() {
    if (this.collection.length < 1) return ''

    return (
      `<COLLECTION Entries="${this.collection.length}">` +
      this.collection.reduce((acum, curr) => {
        return acum + curr.exportAsRekordbox()
      }, '') +
      '</COLLECTION>'
    )
  }

  exportPlaylistsAsRekordbox() {
    if (this.playlists.length < 1) return ''
    return (
      '<PLAYLISTS>' +
      this.playlists?.reduce((acum, curr) => {
        return acum + curr.exportAsRekordbox()
      }, '') +
      '</PLAYLISTS>'
    )
  }

  exportAsTraktor() {
    let output = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
    output += '<NML VERSION="19">'
    output +=
      '<HEAD COMPANY="www.native-instruments.com" PROGRAM="Traktor"></HEAD>'
    output += this.exportCollectionAsTraktor()
    output += this.exportPlaylistsAsTraktor()
    output += '</NML>'
    return output
  }

  exportAsRekordbox() {
    let output = '<?xml version="1.0" encoding="UTF-8"?>'
    output += '<DJ_PLAYLISTS Version="1.0.0">'
    output +=
      '<PRODUCT Name="rekordbox" Version="6.6.3" Company="AlphaTheta" />'
    output += this.exportCollectionAsRekordbox()
    output += this.exportPlaylistsAsRekordbox()
    output += '</DJ_PLAYLISTS>'

    return output
  }

  exportToFile(program, location) {
    // try {
    //   fs.writeFileSync(location, this.export(program), "utf-8");
    //   alert("salvei");
    // } catch (e) {
    //   alert("Failed to save the file !");
    // }
  }

  export(program) {
    if (program === 'traktor') return this.exportAsTraktor()
    if (program === 'rekordbox') return this.exportAsRekordbox()
  }

  importLibrary(xmlLibraryString) {
    let program = this.guessOrigin(xmlLibraryString)
    this.setOrigin(program)

    let xml = new XMLParser(getParseOptions(program))
    let xmlAsObject = xml.parse(xmlLibraryString)

    this.setOriginalLibrary(xmlAsObject)

    this.importCollection()
    this.importPlaylists()

    return true
  }

  // async importLibraryFile(xmlLibraryLocation) {
  //   /* TODO: extrat xml string from file */
  //   let xmlLibraryString = await fs.readFile(xmlLibraryLocation, 'utf-8')

  //   this.importLibrary(xmlLibraryString)

  //   return true
  // }

  setCollection(newCollection) {
    this.collection = newCollection
  }
  setPlaylists(newPlaylists) {
    this.playlists = newPlaylists
    this.reSetTracksIdsInPlaylists()
  }

  reSetTracksIdsInPlaylists() {
    this.playlists.map(node => {
      return this.recursiveReSetTracksIdsInPlaylists(node)
    })
  }

  getTrackByLocation(fileLocation) {
    let trackFound = this.collection.reduce((acum, track) => {
      return !acum && fileLocation === track.location ? track : acum
    }, false)
    return trackFound
  }

  recursiveReSetTracksIdsInPlaylists(node) {
    node.playlists.map(playlist =>
      playlist.tracks.map(track => {
        let trackInCollection = this.getTrackByLocation(track.location)
        return trackInCollection && track.setId(trackInCollection.id)
      })
    )

    node.folders.map(node => this.recursiveReSetTracksIdsInPlaylists(node))
  }
}
