import XMLParser from 'react-xml-parser'
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

const fs = window.require('fs').promises

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
    switch (node.attributes.TYPE) {
      case 'FOLDER':
        a = new Folder(node.attributes.NAME)
        node.children[0].children.map(subnode => {
          switch (subnode.attributes.TYPE) {
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
        a = new Playlist(node.attributes.NAME)
        node.children[0].children.map(subnode => {
          let location = subnode.children[0].attributes.KEY.replaceAll(
            '/:',
            '/'
          )
          let track = new Track(location)

          //      console.log(location)
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
    let originalPlaylists = this.originalLibrary.getElementsByTagName(
      'PLAYLISTS'
    )

    let a = []
    originalPlaylists.length > 0 &&
      originalPlaylists[0].children?.map(node =>
        a.push(this.recursiveReadTraktorPlaylistNode(node))
      )

    this.playlists = a

    return true
  }

  importCollectionFromTraktor() {
    this.originalLibrary
      .getElementsByTagName('COLLECTION')[0]
      .getElementsByTagName('ENTRY')
      .map((trackNode, index) => {
        let xmlString = new XMLParser().toString(trackNode)
        let track = createTrackFromTraktorXML(xmlString, index + 1)

        return this.collection.push(track)
      })

    //    console.log(a)
  }

  importPlaylistsFromRekordbox() {
    /* TODO: Read playlists from Rekordbox */
  }

  importCollectionFromRekordbox() {
    this.originalLibrary
      .getElementsByTagName('COLLECTION')[0]
      .getElementsByTagName('TRACK')
      .map((trackNode, index) => {
        let xmlString = new XMLParser().toString(trackNode)
        let track = createTrackFromRekordboxXML(xmlString, index + 1)

        return this.collection.push(track)
      })
  }

  guessOrigin() {
    if (this.originalLibrary.name === 'NML') return (this.origin = 'traktor')
    if (this.originalLibrary.name === 'DJ_PLAYLISTS')
      return (this.origin = 'rekordbox')
  }

  setOrigin(value) {
    this.origin = value
  }

  setOriginalLibrary(value) {
    if (!value) return false
    this.originalLibrary = value
    this.setOrigin(this.guessOrigin())

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
    const regex = /AUDIO_ID=\"[^\"]*"/gm
    let xml = new XMLParser().parseFromString(
      xmlLibraryString.replace(regex, ``)
    )

    this.setOriginalLibrary(xml)

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
      return !acum && decodeString(fileLocation).includes(track.location)
        ? track
        : acum
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
