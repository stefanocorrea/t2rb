import React, { createContext } from 'react'
import { screen } from '../config/screens.js'
import { config } from '../config/config.js'

const AppContext = createContext({})

export class AppContextProvider extends React.Component {
  exampleToggleStatus = e => {
    this.setState({ exampleStatus: e })
  }

  setScreen = screen => {
    this.setState({ activeScreen: screen })
  }

  setTraktorFile = location => {
    this.setState({ traktorFile: location })
  }

  setRekorboxFile = location => {
    this.setState({ rekorboxFile: location })
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

  addNotConvertedTracks = trackObject => {
    this.setState({
      notConvertedTracks: [...this.state.notConvertedTracks, trackObject]
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

  state = {
    exampleStatus: true,
    activeScreen: screen.main,
    traktorFile: config.get('traktor').toString(),
    rekorboxFile: config.get('rekordbox').toString(),
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
    goToMainScreen: () => this.setScreen(screen.main),
    goToConfigScreen: () => this.setScreen(screen.config),
    goToWorkingScreen: () => this.setScreen(screen.working),
    abortTheMagic: () => this.setScreen(screen.main)
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContext
