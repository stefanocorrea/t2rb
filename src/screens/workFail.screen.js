import React from 'react'
import { Drawer } from '@mui/material'
import AppContext from '../context/app.context'
import { screen } from '../config/screens'

export class WorkFailScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ workingMsg, activeScreen, goToMainScreen }) => (
          <Drawer anchor={'bottom'} open={activeScreen === screen.workFail}>
            <div style={{ width: '100vw', height: '100vh' }}>
              WORK FAIL <br />
              <button onClick={() => goToMainScreen()}>Início</button>
            </div>
          </Drawer>
        )}
      </AppContext.Consumer>
    )
  }
}
WorkFailScreen.contextType = AppContext
export default WorkFailScreen
