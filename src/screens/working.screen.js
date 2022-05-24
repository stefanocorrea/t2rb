import React from 'react'
import { Drawer } from '@mui/material'
import AppContext from '../context/app.context'
import { screen } from '../config/screens'
import { Aaaa } from '../App'

export class WorkingScreen extends React.Component {
  state = {}

  render() {
    return (
      <AppContext.Consumer>
        {({
          workingMsg,
          workSteps,
          workDoneSteps,
          activeScreen,
          abortTheMagic
        }) => {
          let percentage = workSteps
            ? `${parseInt((workDoneSteps / workSteps) * 100)}%`
            : '0%'

          return (
            <Drawer anchor={'bottom'} open={activeScreen === screen.working}>
              <div style={{ width: '100vw', height: '100vh' }}>
                <div>HERE GOES ANIMATION OF THE MAGIC</div>
                <ul>
                  <li>{workingMsg}</li>
                  <li>{percentage}</li>
                </ul>
                <button onClick={() => abortTheMagic('Cancelado pelo usuário')}>
                  Cancel
                </button>
              </div>
            </Drawer>
          )
        }}
      </AppContext.Consumer>
    )
  }
}
WorkingScreen.contextType = AppContext
export default WorkingScreen
