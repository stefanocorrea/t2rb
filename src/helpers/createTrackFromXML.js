import XMLParser from 'react-xml-parser'
import { Track } from '../class/Track.class'
import { HotCue } from '../class/HotCue.class'
import { MemoryCue } from '../class/MemoryCue.class'
import { convertRGBToHex } from '../helpers/convertRGBToHex'
import { getOpenKey } from '../helpers/getOpenKey'
import { decodeString } from '../helpers/decodeString'

import moment from 'moment'

var os = window.require('os')

export function createTrackFromTraktorXML(xmlString, trackId = false) {
  let trackNode = new XMLParser().parseFromString(xmlString)

  let node = trackNode.attributes

  let locationNode = trackNode.getElementsByTagName('LOCATION')[0].attributes
  let infoNode = trackNode.getElementsByTagName('INFO')[0]?.attributes
  let albumNode = trackNode.getElementsByTagName('ALBUM')[0]?.attributes
  let tempoNode = trackNode.getElementsByTagName('TEMPO')[0]?.attributes
  let cueNodes = trackNode.getElementsByTagName('CUE_V2')
  let loudnessNode = trackNode.getElementsByTagName('LOUDNESS')[0]?.attributes
  let keyNode = trackNode.getElementsByTagName('MUSICAL_KEY')[0]?.attributes

  let isMacOS = os.platform() === 'darwin'

  let track = new Track(
    decodeString(
      `${isMacOS ? '/Volumes/' : ''}${locationNode.VOLUME.replaceAll(
        '/:',
        '/'
      )}${locationNode.DIR.replaceAll('/:', '/')}${locationNode.FILE}`
    )
  )

  track.setOriginalXml(xmlString)

  track.setTitle(decodeString(node.TITLE))
  track.setArtist(decodeString(node.ARTIST))
  track.setAlbum(decodeString(albumNode?.TITLE))
  track.setBpm(parseFloat(tempoNode?.BPM))
  track.setBitRate(parseInt(infoNode?.BITRATE))

  let colorName
  switch (infoNode?.COLOR) {
    case 0:
      colorName = '#FF0000' //red
      break
    case 1:
      colorName = '#FFA500' //orange
      break
    case 2:
      colorName = '#FFFF00' //yellow
      break
    case 3:
      colorName = '#008000' //green
      break
    case 4:
      colorName = '#0000FF' //blue
      break
    case 5:
      colorName = '#800080' //violet
      break
    case 6:
      colorName = '#FF00FF' //magenta
      break
    default:
      colorName = false
  }

  track.setColor(colorName)
  track.setComments(
    decodeString(
      `${infoNode?.COMMENT || ''}${
        infoNode?.RATING ? '/' + infoNode?.RATING : ''
      }`
    )
  )
  track.setProducer(decodeString(infoNode?.PRODUCER))

  infoNode?.IMPORT_DATE &&
    track.setImportDateTime(
      new Date(
        `${infoNode.IMPORT_DATE.replaceAll('/', '-')} 00:00:00`
      ).toISOString()
    )

  track.setGenre(decodeString(infoNode?.GENRE))

  track.setType(/(?:\.([^.]+))?$/.exec(locationNode?.FILE)[1].toLowerCase())

  track.setLabel(decodeString(infoNode?.LABEL))
  // track.setCatalog(node.DiscNumber)

  track.setMix(decodeString(infoNode?.MIX))
  track.setPlayCount(infoNode?.PLAYCOUNT)
  track.setRating(parseInt(infoNode?.RANKING))
  track.setRemixer(decodeString(infoNode?.REMIXER))
  //      track.setSampleRate(node.SampleRate * 1000)
  /** */
  track.setPeakDb(parseFloat(loudnessNode?.PEAK_DB))
  track.setPerceivedDb(parseFloat(loudnessNode?.PERCEIVED_DB))
  track.setAnalyzedDb(parseFloat(loudnessNode?.ANALYZED_DB))
  /** */

  track.setSize(infoNode?.FILESIZE)

  let openKey
  switch (parseInt(keyNode?.VALUE)) {
    case 0:
      openKey = '1d'
      break
    case 1:
      openKey = '8d'
      break
    case 2:
      openKey = '3d'
      break
    case 3:
      openKey = '10d'
      break
    case 4:
      openKey = '5d'
      break
    case 5:
      openKey = '12d'
      break
    case 6:
      openKey = '7d'
      break
    case 7:
      openKey = '2d'
      break
    case 8:
      openKey = '9d'
      break
    case 9:
      openKey = '4d'
      break
    case 10:
      openKey = '11d'
      break
    case 11:
      openKey = '6d'
      break
    case 12:
      openKey = '10m'
      break
    case 13:
      openKey = '5m'
      break
    case 14:
      openKey = '12m'
      break
    case 15:
      openKey = '7m'
      break
    case 16:
      openKey = '2m'
      break
    case 17:
      openKey = '9m'
      break
    case 18:
      openKey = '4m'
      break
    case 19:
      openKey = '11m'
      break
    case 20:
      openKey = '6m'
      break
    case 21:
      openKey = '1m'
      break
    case 22:
      openKey = '8m'
      break
    case 23:
      openKey = '3m'
      break
    default:
      openKey = false
  }

  track.setKey(openKey)

  track.setDuration(
    infoNode?.PLAYTIME_FLOAT ? parseFloat(infoNode?.PLAYTIME_FLOAT) * 1000 : 1
  )

  track.setId(trackId ? trackId : node?.AUDIO_ID)
  track.setTrackNumber(parseInt(albumNode?.TRACK))
  infoNode?.RELEASE_DATE &&
    track.setReleaseDate(moment(infoNode?.RELEASE_DATE).format('YYYY-MM-DD'))

  node?.MODIFIED_DATE &&
    node?.MODIFIED_TIME &&
    track.setModifiedDateTime(
      `${moment(
        `${node.MODIFIED_DATE} ${new Date(node.MODIFIED_TIME * 1000)
          .toISOString()
          .substr(11, 8)}`
      ).toISOString()}`
    )

  track.setHotCues(
    cueNodes.reduce((acum, cue) => {
      let cueAttr = cue.attributes
      let hotcue = new HotCue(
        parseInt(cueAttr?.HOTCUE),
        parseFloat(cueAttr?.START)
      )
      hotcue.setEnd(parseFloat(cueAttr?.START) + parseFloat(cueAttr?.LEN))
      hotcue.setType(parseInt(cueAttr?.TYPE))
      let cueColor
      switch (parseInt(cueAttr?.TYPE)) {
        case 0:
          cueColor = '#0000FF' // cue
          break
        case 1:
          cueColor = '#FFA500' // fade in
          break
        case 2:
          cueColor = '#FFA500' // fade out
          break
        case 3:
          cueColor = '#FFFF00' // load
          break
        case 4:
          track.setGridStart(parseFloat(cueAttr?.START))
          cueColor = '#FFFFFF' // grid
          break
        case 5:
          cueColor = '#FFFF00' // loop
          break
        default:
          cueColor = false
      }
      hotcue.setColor(cueColor)
      hotcue.setLabel(decodeString(cueAttr?.NAME))
      return [...acum, hotcue]
    }, [])
  )

  track.setMemoryCues(
    cueNodes.reduce((acum, cue) => {
      let cueAttr = cue.attributes
      let hotcue = new MemoryCue(parseFloat(cueAttr?.START))
      hotcue.setEnd(parseFloat(cueAttr?.START) + parseFloat(cueAttr?.LEN))
      hotcue.setLabel(decodeString(cueAttr?.NAME))
      return [...acum, hotcue]
    }, [])
  )

  return track
}

export async function createTrackFromRekordboxXML(xmlString, trackId = false) {
  if (!xmlString) return false

  let trackNode = new XMLParser().parseFromString(xmlString)

  let node = trackNode?.attributes
  let track = new Track(
    decodeURIComponent(node.Location?.replace('file://localhost/', ''))
  )

  track.setOriginalXml(xmlString)

  track.setTitle(decodeString(node?.Name))
  track.setArtist(decodeString(node?.Artist))
  track.setAlbum(decodeString(node?.Album))
  track.setBpm(parseFloat(node?.AverageBpm))
  track.setBitRate(parseInt(node?.BitRate * 1000))
  track.setColor(node?.Colour?.replaceAll('0x', '#'))
  track.setComments(decodeString(node?.Comments))
  track.setProducer(decodeString(node?.Composer))
  track.setImportDateTime(
    node?.DateAdded
      ? new Date(`${node.DateAdded} 00:00:00`).toISOString()
      : false
  )
  track.setCatalog(decodeString(node?.DiscNumber))
  track.setGenre(decodeString(node?.Genre))
  track.setColor(node?.Grouping) /* TODO: get hex color name */
  track.setType(node?.Kind)
  track.setLabel(decodeString(node?.Label))
  track.setMix(decodeString(node?.Mix))
  track.setPlayCount(parseInt(node?.PlayCount))
  track.setRating(parseInt(node?.Rating))
  track.setRemixer(decodeString(node?.Remixer))
  track.setSampleRate(parseInt(node?.SampleRate * 1000))
  track.setSize(parseFloat(node?.Size))
  track.setKey(getOpenKey(node?.Tonality))
  track.setDuration(parseFloat(node?.TotalTime * 1000))
  track.setId(trackId ? trackId : decodeString(node?.TrackID))
  track.setTrackNumber(parseInt(node?.TrackNumber))
  track.setReleaseDate(
    node.Year?.toString().length === 4 ? `${node.Year}-01-01` : null
  )
  let firstTempoNode = trackNode.getElementsByTagName('TEMPO')[0]
  if (firstTempoNode) {
    track.setGridStart(parseFloat(firstTempoNode?.attributes.Inizio))
  }
  track.setHotCues(
    trackNode
      .getElementsByTagName('POSITION_MARK')
      .filter(mark => parseInt(mark.attributes.Num) > -1)
      .reduce((acum, node) => {
        let hotcue = new HotCue(node.attributes.Num, node.attributes.Start)
        hotcue.setEnd(parseFloat(node.attributes.End))
        hotcue.setColor(
          convertRGBToHex(
            parseInt(node.attributes.Red),
            parseInt(node.attributes.Green),
            parseInt(node.attributes.Blue)
          )
        )
        hotcue.setType(parseInt(node.attributes.Type === 5 ? 4 : 0))

        hotcue.setLabel(decodeString(node.attributes.Name))
        return [...acum, hotcue]
      }, [])
  )

  track.setMemoryCues(
    trackNode
      .getElementsByTagName('POSITION_MARK')
      .filter(mark => parseInt(mark.attributes.Num) < 0)
      .reduce((acum, node) => {
        let memorycue = new MemoryCue(node.attributes.Start)
        memorycue.setEnd(parseFloat(node.attributes.End))

        memorycue.setLabel(decodeString(node.attributes.Name))
        return [...acum, memorycue]
      }, [])
  )

  return track
}
