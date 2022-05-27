import React from 'react'
import { Alert, Snackbar } from '@mui/material'
import { AppContext } from '../context/app.context'
import { screen } from '../config/screens'
import { FormattedMessage } from 'react-intl'

export class WorkFailScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ workingMsg, activeScreen, goToMainScreen }) => (
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            open={activeScreen === screen.workFail}
            onClose={this.handleClose}
            autoHideDuration={2000}
            sx={{ bottom: 30 }}
          >
            <Alert severity="error" variant={'outlined'}>
              <FormattedMessage id={workingMsg} />
            </Alert>
          </Snackbar>
        )}
      </AppContext.Consumer>
    )
  }
}
WorkFailScreen.contextType = AppContext
export default WorkFailScreen
