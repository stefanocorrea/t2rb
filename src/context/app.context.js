import React, { createContext } from 'react'
import { screen } from '../config/screens.js'
import { config } from '../config/config.js'
import { Library } from '../class/Library.class.js'
import { createTrackFromRekordboxXML } from '..//helpers/createTrackFromXML.js'
import { IntlContext } from '../context/intl.context'
import { FormattedMessage, injectIntl } from 'react-intl'
import { IntlProvider, useIntl } from 'react-intl'

import moment from 'moment'

const fs = window.require('fs')
const { exec } = window.require('child_process')
export const AppContext = createContext({})
const path = window.require('path')
const tempDir = config.get('tempDir').replace(/\\/g, '/')
const tempTrackNmlLocation = path
  .join(tempDir, 'TraktorSingleEntry.nml')
  .replace(/\\/g, '/')
const tempTrackDjDataConverterLocation = path
  .join(tempDir, 'rekordbox.xml')
  .replace(/\\/g, '/')

const djDataConverterLocation = config
  .get('djDataConverter')
  .replace(/\\/g, '/')

export class App extends React.Component {
  componentDidMount() {
    this.setTraktorFile(config.get('traktor'))
    this.setRekordboxFile(config.get('rekordbox'))
  }

  exampleToggleStatus = e => {
    this.setState({ exampleStatus: e })
  }

  setScreen = screen => {
    this.setState({ activeScreen: screen })
  }

  validateTraktorFile = () => {
    let isValid = true
    let invalidMsg = ''

    if (!/.nml$/gims.exec(this.state.traktorFile)) {
      isValid = false
      invalidMsg = 'config.fields.traktor.file.invalid-file'
    }

    /* Validade if the NML file content is valid */
    if (false) {
    }

    this.setState({
      validTraktorFile: isValid,
      descriptionInvalidTraktorFile: invalidMsg
    })
    this.configValid()
  }

  validateRekordboxFile = () => {
    let isValid = true
    let invalidMsg = ''

    if (!/.xml$/gims.exec(this.state.rekordboxFile)) {
      isValid = false
      invalidMsg = 'config.fields.rekordbox.file.invalid-file'
    }

    /* Validade if the NML file content is valid */
    if (false) {
    }

    /* TODO validade rekordbox file */
    this.setState({
      validRekordboxFile: isValid,
      descriptionInvalidRekordboxFile: invalidMsg
    })
    this.configValid()
  }

  setTraktorFile = async location => {
    if (!location) return this.validateTraktorFile()

    let newLocationName = location.toString().replace(/\\/g, '/')

    config.set('traktor', newLocationName)
    await this.setState({
      traktorFile: newLocationName
    })

    this.validateTraktorFile()
  }

  setRekordboxFile = async location => {
    if (!location) return this.validateRekordboxFile()
    let newLocationName = location.replace(/\\/g, '/')

    config.set('rekordbox', newLocationName)
    await this.setState({
      rekordboxFile: newLocationName
    })

    this.validateRekordboxFile()
  }

  setReadyToWork = boolean => {
    this.setState({ readyToWork: boolean })
  }

  setWorkingStatus = boolean => {
    this.setState({ workingStatus: boolean })
  }

  setWorkingMsg = msgId => {
    this.setState({ workingMsg: msgId })
  }

  setWorkingTrack = string => {
    this.setState({ workingTrack: string })
  }

  addTrackToConvert = trackObject => {
    this.setState({
      tracksToConvert: [...this.state.tracksToConvert, trackObject]
    })
  }

  addConvertedTracks = trackObject => {
    this.setState({
      convertedTracks: [...this.state.convertedTracks, trackObject]
    })
  }

  addPlaylistToConvert = playlistObject => {
    this.setState({
      playlistToConvert: [...this.state.playlistToConvert, playlistObject]
    })
  }

  addConvertedPlaylist = playlistObject => {
    this.setState({
      convertedPlaylist: [...this.state.convertedPlaylist, playlistObject]
    })
  }

  addWorkSteps = () => {
    this.setState({
      workSteps: this.state.workSteps + 1
    })
  }

  addWorkDoneSteps = async () => {
    await this.setState({
      workDoneSteps: this.state.workDoneSteps + 1
    })
  }

  addNotConvertedTracks = (trackObject, reason) => {
    this.setState({
      notConvertedTracks: [
        ...this.state.notConvertedTracks,
        { track: trackObject, reason: reason }
      ]
    })
  }

  addNotConvertedPlaylists = playlistObject => {
    this.setState({
      notConvertedPlaylists: [
        ...this.state.notConvertedPlaylists,
        playlistObject
      ]
    })
  }

  resetWorkInfos = () => {
    this.setState({
      tracksToConvert: [],
      convertedTracks: [],
      playlistToConvert: [],
      convertedPlaylist: [],
      workSteps: 0,
      workDoneSteps: 0,
      notConvertedTracks: [],
      notConvertedPlaylists: []
    })

    this.setWorkingStatus(true)
  }

  doTheMagic = () => {
    this.setScreen(screen.working)
    this.setWorkingMsg('preparing-to-start')
    this.resetWorkInfos()
    this.setWorkingStatus(true)

    this.setState({
      // startDateTime: moment(),
      isPreparing: true
    })
    setTimeout(() => {
      this.convertTracks()
    }, 500)
  }

  abortTheMagic = msgId => {
    this.setScreen(screen.workCanceled)

    this.setWorkingStatus(false)
    this.setWorkingMsg(msgId)
  }

  workInPlaylists = () => {
    let library = this.state.library

    library.setCollection(this.state.convertedTracks)
    library.setPlaylists(this.state.library.playlists)
    library.reSetTracksIdsInPlaylists()

    this.addWorkDoneSteps()

    this.setState({
      library: library
    })
    return this.exportEverythingToRekordboxFile()
  }

  goToMainScreen = () => {
    this.resetWorkInfos()
    this.setScreen(screen.main)
  }

  endConvert = () => {
    this.setState({
      finishDateTime: moment(),
      elapsedTimeSeconds: moment().diff(this.state.startDateTime, 'seconds')
    })
    this.setWorkingMsg('process-completed')

    setTimeout(() => {
      this.setScreen(screen.workComplete)
    }, 1000)

    return true
  }

  exportEverythingToRekordboxFile = async () => {
    await fs.writeFileSync(
      this.state.rekordboxFile.replace(/\\/g, '/'),
      this.state.library.export('rekordbox')
    )
    this.addWorkDoneSteps()
    this.endConvert()
  }

  async convertTracks() {
    let traktorFile = this.state.traktorFile.replace(/\\/g, '/')
    let traktor = new Library()

    let xmlLibraryString = fs.readFileSync(traktorFile, 'utf-8')
    traktor.importLibrary(xmlLibraryString)
    if (!traktor) return this.abortTheMagic('invalid-traktor-file')

    /* add step of work for every track. Since tracks takes long to convert */
    traktor.collection.map(() => this.addWorkSteps())

    /* add a single step for all playlists. Since playlists is converted very fast */
    this.addWorkSteps()

    /* add a single step for export the result. */
    this.addWorkSteps()

    this.setState({
      tracksToConvert: traktor.collection,
      library: traktor,
      workStartDateTime: moment()
    })

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }

    if (traktor.collection.length) {
      this.setState({
        startDateTime: moment(),
        isPreparing: false
      })
      this.recursiveConvertMusicIndex(0)
    }

    return true
  }

  recursiveConvertMusicIndex = index => {
    this.setState({
      elapsedTimeSeconds: moment().diff(this.state.startDateTime, 'seconds')
    })
    if (!this.state.workingStatus) return

    if (index > this.state.tracksToConvert.length - 1)
      return this.workInPlaylists()

    let nextIndex = index + 1
    let track = this.state.tracksToConvert[index]
    this.setWorkingMsg(false)
    this.setWorkingTrack(
      track.title
        ? `${track.artist ? track.artist + ' - ' : ''}${track.title}`
        : track.location.replace(/.*\//gims, '')
    )

    fs.readFile(track.location, 'utf-8', async error => {
      if (error) {
        this.addWorkDoneSteps()

        this.addNotConvertedTracks(
          track,
          'not-converted.tracks.reasons.not-found'
        )
        this.recursiveConvertMusicIndex(nextIndex)
      } else {
        let tempTrackNmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><NML VERSION="19"><HEAD COMPANY="www.native-instruments.com" PROGRAM="Traktor"></HEAD><COLLECTION Entries="1">${track.originalXml}</COLLECTION></NML>`

        fs.writeFile(
          tempTrackNmlLocation,
          tempTrackNmlContent,
          (error, data) => {
            if (error) {
              this.addWorkDoneSteps()
              this.addNotConvertedTracks(
                track,
                'not-converted.tracks.reasons.analysis'
              )
              this.recursiveConvertMusicIndex(nextIndex)
            } else {
              let cli = `cd "${tempDir}" && "${djDataConverterLocation}" "${tempTrackNmlLocation}"`
              exec(cli, (error, stdout, stderr) => {
                if (error) {
                  this.addWorkDoneSteps()
                  this.addNotConvertedTracks(
                    track,
                    'not-converted.tracks.reasons.analysis'
                  )
                  this.recursiveConvertMusicIndex(nextIndex)
                } else {
                  fs.readFile(
                    tempTrackDjDataConverterLocation,
                    'utf-8',
                    async (error, tempTrackDjDataConverterContentXml) => {
                      if (error) {
                        this.addWorkDoneSteps()
                        this.addNotConvertedTracks(
                          track,
                          'not-converted.tracks.reasons.analysis'
                        )
                        this.recursiveConvertMusicIndex(nextIndex)
                      } else {
                        let trackConverted = await createTrackFromRekordboxXML(
                          tempTrackDjDataConverterContentXml
                            .replace(/(.*)(?=\<TRACK)/gim, '')
                            .replace(/(?<=TRACK\>)(.*)/gim, '')
                        )

                        if (trackConverted.location) {
                          track.setGridStart(trackConverted.gridStart)
                          track.setHotCues(trackConverted.hotCues)
                          track.setLocation(trackConverted.location)
                          track.setMemoryCues(trackConverted.memoryCues)
                          this.addConvertedTracks(track)
                        } else {
                          this.addNotConvertedTracks(
                            track,
                            'not-converted.tracks.reasons.analysis'
                          )
                        }
                        this.addWorkDoneSteps()
                        this.recursiveConvertMusicIndex(nextIndex)
                      }
                    }
                  )
                }
              })
            }
          }
        )
      }
    })
  }

  configValid = () => {
    if (!this.state.validTraktorFile || !this.state.validRekordboxFile) {
      this.setScreen(screen.config)
    }

    if (this.state.validTraktorFile && this.state.validRekordboxFile) {
      this.setScreen(screen.main)
    }
  }

  state = {
    exampleStatus: true,
    activeScreen: screen.main,
    isPreparing: true,
    traktorFile: '',
    rekordboxFile: '',
    readyToWork: false,
    workingStatus: true,
    workingMsg: '',
    workingTrack: '',
    tracksToConvert: [],
    convertedTracks: [],
    playlistToConvert: [],
    convertedPlaylist: [],
    workSteps: 0,
    workDoneSteps: 0,
    notConvertedTracks: [],
    notConvertedPlaylists: [],
    snackSuccess: false,
    elapsedTimeSeconds: 0,
    startDateTime: '',
    validTraktorFile: true,
    validRekordboxFile: true,
    descriptionInvalidTraktorFile: false,
    descriptionInvalidRekordboxFile: false,

    exampleToggleStatus: e => this.exampleToggleStatus(e),
    setScreen: screen => this.setScreen(screen),
    setTraktorFile: location => this.setTraktorFile(location),
    setRekordboxFile: location => this.setRekordboxFile(location),
    setReadyToWork: boolen => this.setReadyToWork(boolen),
    setWorkingStatus: boolen => this.setWorkingStatus(boolen),
    setWorkingMsg: string => this.setWorkingMsg(string),
    setWorkingTrack: string => this.setWorkingTrack(string),
    addTrackToConvert: trackObject => this.addTrackToConvert(trackObject),
    addConvertedTracks: trackObject => this.addConvertedTracks(trackObject),
    addPlaylistToConvert: playlistObject =>
      this.addPlaylistToConvert(playlistObject),
    addConvertedPlaylist: playlistObject =>
      this.addConvertedPlaylist(playlistObject),
    addWorkSteps: () => this.addWorkSteps(),
    addWorkDoneSteps: () => this.addWorkDoneSteps(),
    addNotConvertedTracks: (trackObject, reason) =>
      this.addNotConvertedTracks(trackObject, reason),
    addNotConvertedPlaylists: (playlistObject, reason) =>
      this.addNotConvertedPlaylists(playlistObject, reason),
    goToMainScreen: () => this.goToMainScreen(),
    goToConfigScreen: () => this.setScreen(screen.config),
    goToWorkingScreen: () => this.setScreen(screen.working),
    abortTheMagic: msgId => this.abortTheMagic(msgId),
    doTheMagic: () => this.doTheMagic()
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}
App.contextType = IntlContext
export default injectIntl(App)
