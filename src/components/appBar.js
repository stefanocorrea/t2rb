import * as React from 'react'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
import SettingsIcon from '@mui/icons-material/Settings'
import { AppContext } from '../context/app.context'
import { screen } from '../config/screens'
import { Button } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import LanguageIconSelect from './LanguageIconSelect'

export class AppConfigBar extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ activeScreen, goToConfigScreen, abortTheMagic, isPreparing }) => (
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { md: 'flex' } }} mx={1}>
              <LanguageIconSelect soft />
            </Box>

            {activeScreen === screen.working ? (
              <Box sx={{ display: { md: 'flex' } }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => abortTheMagic('canceled-by-user')}
                  startIcon={<CancelIcon />}
                >
                  <FormattedMessage id="cancel" />
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: { md: 'flex' } }}>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={() => goToConfigScreen()}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
          // </AppBar>
        )}
      </AppContext.Consumer>
    )
  }
}

AppConfigBar.contextType = AppContext
export default AppConfigBar
