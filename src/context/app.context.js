import React, { createContext } from 'react'
import { screen } from '../config/screens.js'
import { config } from '../config/config.js'
import { Library } from '../class/Library.class.js'
import { createTrackFromRekordboxXML } from '..//helpers/createTrackFromXML.js'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

import moment from 'moment'

const fs = window.require('fs')
const { exec } = window.require('child_process')
const AppContext = createContext({})
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

export class AppContextProvider extends React.Component {
  exampleToggleStatus = e => {
    this.setState({ exampleStatus: e })
  }

  setScreen = screen => {
    this.setState({ activeScreen: screen })
  }

  setTraktorFile = location => {
    if (!location) return

    console.log(location)
    let newLocationName = location[0].replace(/\\/g, '/')
    config.set('traktor', newLocationName)
    this.setState({
      traktorFile: newLocationName,
      snackSuccess: 'Campo Atualizado'
    })
  }

  setRekorboxFile = location => {
    if (!location) return
    let newLocationName = location.replace(/\\/g, '/')
    config.set('rekordbox', newLocationName)
    this.setState({
      rekorboxFile: newLocationName,
      snackSuccess: 'Campo Atualizado'
    })
  }

  setReadyToWork = boolean => {
    this.setState({ readyToWork: boolean })
  }

  setWorkingStatus = boolean => {
    this.setState({ workingStatus: boolean })
  }

  setWorkingMsg = string => {
    this.setState({ workingMsg: string })
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

  addWorkDoneSteps = () => {
    this.setState({
      workDoneSteps: this.state.workDoneSteps + 1
    })
  }

  addNotConvertedTracks = (trackObject, error) => {
    this.setState({
      notConvertedTracks: [
        ...this.state.notConvertedTracks,
        { track: trackObject, error: error }
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
    this.setWorkingMsg('Iniciando sync')
    this.resetWorkInfos()
    this.setWorkingStatus(true)
    this.setState({
      startDateTime: moment()
    })
    setTimeout(() => {
      this.convertTracks()
    }, 500)
  }

  abortTheMagic = msg => {
    this.setScreen(screen.workCanceled)
    this.setWorkingStatus(false)
    this.setWorkingMsg(msg)

    setTimeout(() => {
      this.setScreen(screen.main)

      this.resetWorkInfos()
    }, 3000)
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
    this.setWorkingMsg('Work complete')
    this.setScreen(screen.workComplete)

    setTimeout(() => {
      this.goToMainScreen()
    }, 6000)

    return true
  }

  exportEverythingToRekordboxFile = async () => {
    await fs.writeFileSync(
      this.state.rekorboxFile.replace(/\\/g, '/'),
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
    if (!traktor)
      return this.abortTheMagic('sorry have to cancel... cant import NML file')

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
      this.recursiveConvertMusicIndex(0)
    }

    return true
  }

  recursiveConvertMusicIndex = index => {
    if (!this.state.workingStatus) return

    if (index > this.state.tracksToConvert.length - 1)
      return this.workInPlaylists()

    let nextIndex = index + 1
    let track = this.state.tracksToConvert[index]
    this.setWorkingMsg(
      `${index + 1}/${this.state.tracksToConvert.length} - ${track.artist} - ${
        track.title
      }`
    )
    let tempTrackNmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><NML VERSION="19"><HEAD COMPANY="www.native-instruments.com" PROGRAM="Traktor"></HEAD><COLLECTION Entries="1">${track.originalXml}</COLLECTION></NML>`

    fs.writeFile(tempTrackNmlLocation, tempTrackNmlContent, (error, data) => {
      if (error) {
        this.addWorkDoneSteps()
        this.addNotConvertedTracks(track, error)
        this.recursiveConvertMusicIndex(nextIndex)
      } else {
        let windowsCLI = `cd "${tempDir}" && "${djDataConverterLocation}" "${tempTrackNmlLocation}"`
        exec(windowsCLI, (error, stdout, stderr) => {
          if (error) {
            this.addWorkDoneSteps()
            this.addNotConvertedTracks(track, error)
            this.recursiveConvertMusicIndex(nextIndex)
          } else {
            fs.readFile(
              tempTrackDjDataConverterLocation,
              'utf-8',
              async (error, tempTrackDjDataConverterContentXml) => {
                if (error) {
                  this.addWorkDoneSteps()
                  this.addNotConvertedTracks(track, error)
                  this.recursiveConvertMusicIndex(nextIndex)
                }

                let trackConverted = await createTrackFromRekordboxXML(
                  tempTrackDjDataConverterContentXml
                    .replace(/(.*)(?=\<TRACK)/gim, '')
                    .replace(/(?<=TRACK\>)(.*)/gim, '')
                )

                track.setGridStart(trackConverted.gridStart)
                track.setHotCues(trackConverted.hotCues)
                track.setMemoryCues(trackConverted.memoryCues)
                this.addWorkDoneSteps()
                this.addConvertedTracks(track)
                this.recursiveConvertMusicIndex(nextIndex)
              }
            )
          }
        })
      }
    })
  }

  state = {
    exampleStatus: true,
    activeScreen: screen.main,
    traktorFile: config.get('traktor'),
    rekorboxFile: config.get('rekordbox'),
    readyToWork: false,
    workingStatus: true,
    workingMsg: '',
    tracksToConvert: [],
    convertedTracks: [],
    playlistToConvert: [],
    convertedPlaylist: [],
    workSteps: 0,
    workDoneSteps: 0,
    notConvertedTracks: [],
    notConvertedPlaylists: [],
    snackSuccess: false,
    elapsedTimeSeconds: '',
    startDateTime: '',

    exampleToggleStatus: e => this.exampleToggleStatus(e),
    setScreen: screen => this.setScreen(screen),
    setTraktorFile: location => this.setTraktorFile(location),
    setRekorboxFile: location => this.setRekorboxFile(location),
    setReadyToWork: boolen => this.setReadyToWork(boolen),
    setWorkingStatus: boolen => this.setWorkingStatus(boolen),
    setWorkingMsg: string => this.setWorkingMsg(string),
    addTrackToConvert: trackObject => this.addTrackToConvert(trackObject),
    addConvertedTracks: trackObject => this.addConvertedTracks(trackObject),
    addPlaylistToConvert: playlistObject =>
      this.addPlaylistToConvert(playlistObject),
    addConvertedPlaylist: playlistObject =>
      this.addConvertedPlaylist(playlistObject),
    addWorkSteps: () => this.addWorkSteps(),
    addWorkDoneSteps: () => this.addWorkDoneSteps(),
    addNotConvertedTracks: trackObject =>
      this.addNotConvertedTracks(trackObject),
    addNotConvertedPlaylists: playlistObject =>
      this.addNotConvertedPlaylists(playlistObject),
    goToMainScreen: () => this.goToMainScreen(),
    goToConfigScreen: () => this.setScreen(screen.config),
    goToWorkingScreen: () => this.setScreen(screen.working),
    abortTheMagic: () => this.abortTheMagic(),
    doTheMagic: () => this.doTheMagic()
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
        <Snackbar
          open={this.state.snackSuccess !== false}
          autoHideDuration={6000}
          onClose={() => this.setState({ snackSuccess: false })}
        >
          <MuiAlert
            elevation={6}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {this.state.snackSuccess}
          </MuiAlert>
        </Snackbar>
      </AppContext.Provider>
    )
  }
}

export default AppContext
