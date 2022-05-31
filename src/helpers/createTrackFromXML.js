import XMLParseAntigo from 'react-xml-parser'
import { Track } from '../class/Track.class'
import { HotCue } from '../class/HotCue.class'
import { MemoryCue } from '../class/MemoryCue.class'
import { convertRGBToHex } from './convertRGBToHex'
import { getOpenKey } from './getOpenKey'
import { decodeString } from './decodeString'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { getParseOptions } from './parseXmlDefaultOptions'

import moment from 'moment'

var os = window.require('os')

export function createTrackFromTraktorXML(xmlString, trackId = false) {
  const regex = /AUDIO_ID=\"[^\"]*"/gm
  let xml = new XMLParser(getParseOptions('traktor')).parse(
    xmlString.replace(regex, ``)
  )

  let isMacOS = os.platform() === 'darwin'

  let track = new Track(
    decodeString(
      `${isMacOS ? '/Volumes/' : ''}${xml.ENTRY.LOCATION._VOLUME}${
        xml.ENTRY.LOCATION._DIR
      }${xml.ENTRY.LOCATION._FILE}`.replaceAll('/:', '/')
    )
  )

  track.setOriginalXml(xmlString)

  track.setTitle(decodeString(xml.ENTRY._TITLE))
  track.setArtist(decodeString(xml.ENTRY._ARTIST))
  track.setAlbum(decodeString(xml.ENTRY.ALBUM?._TITLE))
  track.setBpm(parseFloat(xml.ENTRY.TEMPO?._BPM))
  track.setBitRate(parseInt(xml.ENTRY.INFO?._BITRATE))

  let colorName
  switch (parseInt(xml.ENTRY.INFO?._COLOR)) {
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
      `${xml.ENTRY.INFO?._COMMENT || ''}${
        xml.ENTRY.INFO?._RATING ? '/' + xml.ENTRY.INFO?._RATING : ''
      }`
    )
  )
  track.setProducer(decodeString(xml.ENTRY.INFO?._PRODUCER))

  xml.ENTRY.INFO?._IMPORT_DATE &&
    track.setImportDateTime(
      new Date(
        `${xml.ENTRY.INFO?._IMPORT_DATE.replaceAll('/', '-')} 00:00:00`
      ).toISOString()
    )

  track.setGenre(decodeString(xml.ENTRY.INFO?._GENRE))

  track.setType(
    /(?:\.([^.]+))?$/.exec(xml.ENTRY.LOCATION._FILE)[1].toLowerCase()
  )

  track.setLabel(decodeString(xml.ENTRY.INFO?._LABEL))

  track.setMix(decodeString(xml.ENTRY.INFO?._MIX))
  track.setPlayCount(xml.ENTRY.INFO?._PLAYCOUNT)
  track.setRating(parseInt(xml.ENTRY.INFO?._RANKING))
  track.setRemixer(decodeString(xml.ENTRY.INFO?._REMIXER))

  // /** */
  track.setPeakDb(parseFloat(xml.ENTRY.LOUDNESS?._PEAK_DB))
  track.setPerceivedDb(parseFloat(xml.ENTRY.LOUDNESS?._PERCEIVED_DB))
  track.setAnalyzedDb(parseFloat(xml.ENTRY.LOUDNESS?._ANALYZED_DB))
  // /** */

  track.setSize(xml.ENTRY.INFO?._FILESIZE)

  let openKey
  switch (parseInt(xml.ENTRY.MUSICAL_KEY?._VALUE)) {
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
    xml.ENTRY.INFO?._PLAYTIME_FLOAT
      ? parseFloat(xml.ENTRY.INFO?._PLAYTIME_FLOAT) * 1000
      : 1
  )

  track.setId(trackId ? trackId : xml.ENTRY._AUDIO_ID)
  track.setTrackNumber(parseInt(xml.ENTRY.ALBUM?._TRACK))
  xml.ENTRY.INFO?._RELEASE_DATE &&
    track.setReleaseDate(
      moment(xml.ENTRY.INFO?._RELEASE_DATE).format('YYYY-MM-DD')
    )

  xml.ENTRY._MODIFIED_DATE &&
    xml.ENTRY._MODIFIED_TIME &&
    track.setModifiedDateTime(
      `${moment(
        `${xml.ENTRY._MODIFIED_DATE} ${new Date(xml.ENTRY._MODIFIED_TIME * 1000)
          .toISOString()
          .substr(11, 8)}`
      ).toISOString()}`
    )

  track.setHotCues(
    xml.ENTRY.CUE_V2?.reduce((acum, cue) => {
      let hotcue = new HotCue(parseInt(cue._HOTCUE), parseFloat(cue._START))
      hotcue.setEnd(parseFloat(cue._START) + parseFloat(cue._LEN))
      hotcue.setType(parseInt(cue._TYPE))
      let cueColor
      switch (parseInt(cue._TYPE)) {
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
          track.setGridStart(parseFloat(cue._START))
          cueColor = '#FFFFFF' // grid
          break
        case 5:
          cueColor = '#FFFF00' // loop
          break
        default:
          cueColor = false
      }
      hotcue.setColor(cueColor)
      hotcue.setLabel(decodeString(cue._NAME))
      return [...acum, hotcue]
    }, [])
  )

  track.setMemoryCues(
    xml.ENTRY.CUE_V2?.reduce((acum, cue) => {
      let hotcue = new MemoryCue(parseFloat(cue._START))
      hotcue.setEnd(parseFloat(cue._START) + parseFloat(cue._LEN))
      hotcue.setLabel(decodeString(cue._NAME))
      return [...acum, hotcue]
    }, [])
  )

  return track
}

export async function createTrackFromRekordboxXML(xmlString, trackId = false) {
  if (!xmlString) return false

  let xml = new XMLParser(getParseOptions('rekordbox')).parse(xmlString)

  //let trackNode = new XMLParseAntigo().parseFromString(xmlString)

  // let node = trackNode?.attributes
  let track = new Track(
    decodeURIComponent(xml.TRACK?._Location.replace('file://localhost/', ''))
  )

  // track.setOriginalXml(xmlString)

  // track.setTitle(decodeString(node?.Name))
  // track.setArtist(decodeString(node?.Artist))
  // track.setAlbum(decodeString(node?.Album))
  // track.setBpm(parseFloat(node?.AverageBpm))
  // track.setBitRate(parseInt(node?.BitRate * 1000))
  // track.setColor(node?.Colour?.replaceAll('0x', '#'))
  // track.setComments(decodeString(node?.Comments))
  // track.setProducer(decodeString(node?.Composer))
  // track.setImportDateTime(
  //   node?.DateAdded
  //     ? new Date(`${node.DateAdded} 00:00:00`).toISOString()
  //     : false
  // )
  // track.setCatalog(decodeString(node?.DiscNumber))
  // track.setGenre(decodeString(node?.Genre))
  // track.setColor(node?.Grouping) /* TODO: get hex color name */
  // track.setType(node?.Kind)
  // track.setLabel(decodeString(node?.Label))
  // track.setMix(decodeString(node?.Mix))
  // track.setPlayCount(parseInt(node?.PlayCount))
  // track.setRating(parseInt(node?.Rating))
  // track.setRemixer(decodeString(node?.Remixer))
  // track.setSampleRate(parseInt(node?.SampleRate * 1000))
  // track.setSize(parseFloat(node?.Size))
  // track.setKey(getOpenKey(node?.Tonality))
  // track.setDuration(parseFloat(node?.TotalTime * 1000))
  // track.setId(trackId ? trackId : decodeString(node?.TrackID))
  // track.setTrackNumber(parseInt(node?.TrackNumber))
  // track.setReleaseDate(
  //   node.Year?.toString().length === 4 ? `${node.Year}-01-01` : null
  // )
  // let firstTempoNode = trackNode.getElementsByTagName('TEMPO')[0]
  // if (firstTempoNode) {
  //   track.setGridStart(parseFloat(firstTempoNode?.attributes.Inizio))
  // }
  // track.setHotCues(
  //   trackNode
  //     .getElementsByTagName('POSITION_MARK')
  //     .filter(mark => parseInt(mark.attributes.Num) > -1)
  //     .reduce((acum, node) => {
  //       let hotcue = new HotCue(node.attributes.Num, node.attributes.Start)
  //       hotcue.setEnd(parseFloat(node.attributes.End))
  //       hotcue.setColor(
  //         convertRGBToHex(
  //           parseInt(node.attributes.Red),
  //           parseInt(node.attributes.Green),
  //           parseInt(node.attributes.Blue)
  //         )
  //       )
  //       hotcue.setType(parseInt(node.attributes.Type === 5 ? 4 : 0))

  //       hotcue.setLabel(decodeString(node.attributes.Name))
  //       return [...acum, hotcue]
  //     }, [])
  // )

  // track.setMemoryCues(
  //   trackNode
  //     .getElementsByTagName('POSITION_MARK')
  //     .filter(mark => parseInt(mark.attributes.Num) < 0)
  //     .reduce((acum, node) => {
  //       let memorycue = new MemoryCue(node.attributes.Start)
  //       memorycue.setEnd(parseFloat(node.attributes.End))

  //       memorycue.setLabel(decodeString(node.attributes.Name))
  //       return [...acum, memorycue]
  //     }, [])
  // )

  return track
}
