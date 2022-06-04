import { HotCue } from './HotCue.class'
import { convertHexToName } from '../helpers/convertHexToName'
import moment from 'moment'
import { getMusicalKey } from '../helpers/getMusicalKey'
import { attr } from '../helpers/createXmlAttrString.js'

export class Track {
  id
  title
  artist
  album
  location
  genre
  type
  size
  duration
  trackNumber
  bpm
  peakDb
  perceivedDb
  analyzedDb
  modifiedDateTime
  producer
  catalog
  importDateTime
  lastPlayedDateTime
  releaseDate
  bitRate
  md5
  comments
  playCount
  rating
  sampleRate
  remixer
  key
  label
  mix
  color
  hotCues
  memoryCues
  gridStart
  modificationDateTime
  originalXml
  md5

  constructor(location) {
    this.location = location
  }

  setId(val) {
    if (val) this.id = val
  }
  setTitle(val) {
    if (val) this.title = val
  }
  setArtist(val) {
    if (val) this.artist = val
  }
  setAlbum(val) {
    if (val) this.album = val
  }
  setLocation(val) {
    if (val) this.location = val
  }
  setGenre(val) {
    if (val) this.genre = val
  }
  setType(val) {
    if (val) this.type = val.replace(' File', '').toLowerCase()
  }
  setSize(val) {
    if (val) this.size = parseFloat(val)
  }
  setDuration(val) {
    if (val) this.duration = parseFloat(val)
  }
  setTrackNumber(val) {
    if (val) this.trackNumber = val
  }
  setBpm(val) {
    if (val) this.bpm = parseFloat(val)
  }
  setPeakDb(val) {
    if (val) this.peakDb = val
  }
  setPerceivedDb(val) {
    if (val) this.perceivedDb = val
  }
  setAnalyzedDb(val) {
    if (val) this.analyzedDb = val
  }
  setModifiedDateTime(val) {
    if (val) this.modificationDateTime = val
  }
  setProducer(val) {
    if (val) this.producer = val
  }
  setCatalog(val) {
    if (val) this.catalog = val
  }
  setImportDateTime(val) {
    if (val) this.importDateTime = val
  }
  setLastPlayedDateTime(val) {
    if (val) this.lastPlayedDateTime = val
  }
  setReleaseDate(val) {
    if (val) this.releaseDate = val
  }
  setBitRate(val) {
    if (val) this.bitRate = val
  }
  setMd5(val) {
    if (val) this.md5 = val
  }
  setComments(val) {
    if (val) this.comments = val
  }
  setPlayCount(val) {
    if (val) this.playCount = parseInt(val)
  }
  setRating(val) {
    if (val) this.rating = parseInt(val)
  }
  setSampleRate(val) {
    if (val) this.sampleRate = val
  }
  setRemixer(val) {
    if (val) this.remixer = val
  }
  setKey(val) {
    if (val) this.key = val
  }
  setLabel(val) {
    if (val) this.label = val
  }
  setMix(val) {
    if (val) this.mix = val
  }
  setColor(val) {
    if (val) this.color = val
  }
  setHotCues(val) {
    if (val) this.hotCues = val
  }
  setMemoryCues(val) {
    if (val) this.memoryCues = val
  }

  setOriginalXml(val) {
    if (val) this.originalXml = val
  }

  setGridStart(val) {
    if (val) this.gridStart = parseFloat(val)
  }

  getLocation() {
    return this.location
  }

  getId() {
    return this.id
  }

  exportAsRekordbox() {
    return (
      `<TRACK ${attr('TrackID', this.id)} ${attr('Name', this.title)} 
          ${attr('Artist', this.artist)} ${attr(
        'Composer',
        this.producer
      )} ${attr('Album', this.album)} ${attr(
        'Grouping',
        convertHexToName(this.color)
      )}  
         ${attr('Genre', this.genre)} ${attr(
        'Kind',
        this.type.toUpperCase() + ' File'
      )} ${attr('Size', this.size)} ${attr('TotalTime', this.duration / 1000)} 
          ${attr('DiscNumber', this.catalog)} ${attr(
        'TrackNumber',
        this.trackNumber
      )} ${
        this.releaseDate
          ? attr('Year', moment(this.releaseDate).format('YYYY'))
          : ''
      } ${attr('AverageBpm', this.bpm)} ${attr(
        'DateAdded',
        this.importDateTime
          ? moment(this.importDateTime).format('YYYY-MM-DD')
          : null
      )} ${attr('BitRate', this.bitRate / 1000)} ${attr(
        'SampleRate',
        this.sampleRate / 1000
      )} ${attr('Comments', this.comments)}
         ${attr('PlayCount', this.playCount)} ${attr(
        'Rating',
        this.rating
      )} ${attr('Location', 'file://localhost/' + this.location)}
          ${attr('Remixer', this.remixer)} ${attr(
        'Tonality',
        getMusicalKey(this.key)
      )} ${attr('Label', this.label)} ${attr('Mix', this.mix)} ${attr(
        'Colour',
        this.color?.replace('#', '0x')
      )}>` +
      (this.gridStart && this.bpm
        ? `<TEMPO Inizio="${this.gridStart}" Bpm="${this.bpm}" Metro="4/4" Battito="1" />`
        : '') +
      (this.hotCues?.length > 0
        ? this.hotCues.reduce((acum, curr) => {
            return acum + curr.exportAsRekordbox()
          }, '')
        : '') +
      (this.memoryCues?.length > 0
        ? this.memoryCues.reduce((acum, curr) => {
            return acum + curr.exportAsRekordbox()
          }, '')
        : '') +
      '</TRACK>'
    )
  }

  exportAsTraktor() {
    let output = ''

    let file = this.location.replace(/.*\//gm, '').replaceAll('', '')
    let volume = this.location.replace(/([/].*)/gm, '').replaceAll('', '')
    let dir = this.location
      .replace(volume, '')
      .replace(file, '')
      .replace('/', '/:')

    let color
    switch (this.color?.toUpperCase()) {
      case '#FF0000':
        color = 0 //red
        break
      case '#FFA500':
        color = 1 //orange
        break
      case '#FFFF00':
        color = 2 //yellow
        break
      case '#008000':
        color = 3 //green
        break
      case '#0000FF':
        color = 4 //blue
        break
      case '#800080':
        color = 5 //violet
        break
      case '#FF00FF':
        color = 6 //magenta
        break
      default:
        color = ''
    }

    let key
    switch (this.key?.toLowerCase()) {
      case '1d':
        key = 0
        break
      case '8d':
        key = 1
        break
      case '3d':
        key = 2
        break
      case '10d':
        key = 3
        break
      case '5d':
        key = 4
        break
      case '12d':
        key = 5
        break
      case '7d':
        key = 6
        break
      case '2d':
        key = 7
        break
      case '9d':
        key = 8
        break
      case '4d':
        key = 9
        break
      case '11d':
        key = 10
        break
      case '6d':
        key = 11
        break
      case '10m':
        key = 12
        break
      case '5m':
        key = 13
        break
      case '12m':
        key = 14
        break
      case '7m':
        key = 15
        break
      case '2m':
        key = 16
        break
      case '9m':
        key = 17
        break
      case '4m':
        key = 18
        break
      case '11m':
        key = 19
        break
      case '6m':
        key = 20
        break
      case '1m':
        key = 21
        break
      case '8m':
        key = 22
        break
      case '3m':
        key = 23
        break
      default:
        key = ''
    }

    output += `<ENTRY MODIFIED_DATE="${moment(this.modifiedDateTime).format(
      'YYYY/M/D'
    )}" MODIFIED_TIME="${moment(this.modifiedDateTime).diff(
      moment(this.modifiedDateTime).startOf('day'),
      'seconds'
    )}" AUDIO_ID="${this.id}" TITLE="${this.title}" ARTIST="${this.artist}">`
    output += `<LOCATION DIR="${dir}" FILE="${file}" VOLUME="${volume}" ></LOCATION>`
    output += `<INFO BITRATE="${this.bitrate}" GENRE="${this.genre}" LABEL="${
      this.label
    }" COMMENT="${this.comment}" KEY_LYRICS="${
      this.lyrics
    }" RATING="" REMIXER="${this.remixer}" PRODUCER="${this.producer}" MIX="${
      this.mix
    }" KEY="${this.key}" PLAYTIME="${parseInt(
      this.duration
    )}" PLAYTIME_FLOAT="${this.duration}" RANKING="${
      this.rating
    }" IMPORT_DATE="${moment(this.importDateTime).format(
      'YYYY/M/D'
    )}" RELEASE_DATE="${moment(this.releaseDate).format(
      'YYYY/M/D'
    )}" FILESIZE="${this.filesize}" COLOR="${color}" ></INFO>`
    output += `<ALBUM TRACK="${this.trackNumber}" TITLE="${this.album}"></ALBUM>`
    output += `<MODIFICATION_INFO AUTHOR_TYPE="user"></MODIFICATION_INFO>`
    output += `<TEMPO BPM="${this.bpm}" BPM_QUALITY="100.000000" ></TEMPO>`
    output += `<LOUDNESS PEAK_DB="${this.peakDb}" PERCEIVED_DB="${this.perceivedDb}" ANALYZED_DB="${this.analyzedDb}"></LOUDNESS>`
    output += `<MUSICAL_KEY VALUE="${key}"></MUSICAL_KEY>`
    this.hotCues.map(hotcue => (output += hotcue.exportAsTraktor()))
    output += `<CUE_V2 NAME="AutoGrid" DISPL_ORDER="0" TYPE="4" START="${this.gridStart}"  REPEATS="-1" HOTCUE="0" ></CUE_V2>`
    output += `</ENTRY>`

    return output
  }

  exportAsRekordboxPlaylistTrack(newKey = false) {
    return `<TRACK ${attr('Key', newKey ? newKey : this.id)}/>`
  }

  exportAsTraktorPlaylistTrack(newKey = false) {
    return `<ENTRY><PRIMARYKEY TYPE="TRACK" ${attr(
      'KEY',
      newKey ? newKey : this.location
    )}></PRIMARYKEY></ENTRY>`
  }
}
