import React from 'react'
import { AppConfigBar } from '../components/appBar'
import AppContext from '../context/app.context'

class MainScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ goToWorkingScreen, doTheMagic }) => (
          <>
            <AppConfigBar />
            <button onClick={() => doTheMagic()}>Do the magic</button>
          </>
        )}
      </AppContext.Consumer>
    )
  }
}

MainScreen.contextType = AppContext
export default MainScreen
