import React from 'react'
import { Drawer } from '@mui/material'
import AppContext from '../context/app.context'
import { screen } from '../config/screens'
import moment from 'moment'

export class WorkCompleteScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({
          workingMsg,
          activeScreen,
          goToMainScreen,
          elapsedTimeSeconds,
          startDateTime
        }) => (
          <Drawer anchor={'bottom'} open={activeScreen === screen.workComplete}>
            <div style={{ width: '100vw', height: '100vh' }}>
              WORK COMPLETE <br />
              Tempor decorrido ={' '}
              {moment
                .duration({ seconds: parseInt(elapsedTimeSeconds) })
                .humanize()}
              <br />
              {workingMsg}
              <br />
              <button onClick={() => goToMainScreen()}>Início</button>
            </div>
          </Drawer>
        )}
      </AppContext.Consumer>
    )
  }
}
WorkCompleteScreen.contextType = AppContext
export default WorkCompleteScreen
