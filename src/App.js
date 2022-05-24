import React from 'react'
import AppContext from './context/app.context'
import MainScreen from './screens/main.screen'
import ConfigScreen from './screens/config.screen'
import WorkingScreen from './screens/working.screen'
import WorkCompleteScreen from './screens/workComplete.screen'
import WorkCanceledScreen from './screens/workCanceled.screen'
import WorkFailScreen from './screens/workFail.screen'

class App extends React.Component {
  render() {
    return (
      <>
        <MainScreen />
        <ConfigScreen />
        <WorkingScreen />
        <WorkCompleteScreen />
        <WorkCanceledScreen />
        <WorkFailScreen />
      </>
    )
  }
}

App.contextType = AppContext
export default App
