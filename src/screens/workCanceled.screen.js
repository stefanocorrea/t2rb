import React from 'react'
import { Drawer } from '@mui/material'
import AppContext from '../context/app.context'
import { screen } from '../config/screens'

export class WorkCanceledScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ workingMsg, activeScreen, goToMainScreen }) => (
          <Drawer anchor={'bottom'} open={activeScreen === screen.workCanceled}>
            <div style={{ width: '100vw', height: '100vh' }}>
              CANCELADO <br />
              <button onClick={() => goToMainScreen()}>Início</button>
            </div>
          </Drawer>
        )}
      </AppContext.Consumer>
    )
  }
}
WorkCanceledScreen.contextType = AppContext
export default WorkCanceledScreen
