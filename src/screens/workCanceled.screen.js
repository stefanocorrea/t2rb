import React from 'react'
import { Alert, Snackbar } from '@mui/material'
import { AppContext } from '../context/app.context'
import { screen } from '../config/screens'
import { FormattedMessage } from 'react-intl'

export class WorkCanceledScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ workingMsg, activeScreen, goToMainScreen }) => (
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            open={activeScreen === screen.workCanceled}
            onClose={this.handleClose}
            autoHideDuration={2000}
            sx={{ bottom: 30 }}
          >
            <Alert
              severity="warning"
              variant={'outlined'}
              sx={{ backgroundColor: '#ff6e000f' }}
            >
              <FormattedMessage id={workingMsg || 'canceled'} />
            </Alert>
          </Snackbar>
        )}
      </AppContext.Consumer>
    )
  }
}
WorkCanceledScreen.contextType = AppContext
export default WorkCanceledScreen
