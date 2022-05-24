import React from 'react'
import { Drawer } from '@mui/material'
import AppContext from '../context/app.context'
import { screen } from '../config/screens'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { TraktorLogo, RekordboxLogo } from '../logos/logo.js'
import { config } from '../config/config'

const dialog = window.require('electron').remote.dialog

export class ConfigScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({
          traktorFile,
          rekorboxFile,
          activeScreen,
          goToMainScreen,
          setTraktorFile,
          setRekorboxFile
        }) => (
          <Drawer anchor={'bottom'} open={activeScreen === screen.config}>
            <div style={{ width: '100vw', height: '100vh' }}>
              This is config screen
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TraktorLogo color="white" size={30} />
                <TextField
                  disabled
                  fullWidth
                  onClick={() => {
                    setTraktorFile(
                      dialog.showOpenDialogSync({
                        properties: ['openFile'],
                        filters: [
                          {
                            name: 'Traktor Collection File',
                            extensions: ['nml']
                          },
                          { name: 'All Files', extensions: ['*'] }
                        ]
                      })
                    )
                  }}
                  value={traktorFile}
                  label="Traktor Collection"
                  variant="standard"
                />
              </Box>
              <br />
              <br />
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <RekordboxLogo color="white" size={30} />
                <TextField
                  disabled
                  fullWidth
                  onClick={() => {
                    setRekorboxFile(dialog.showSaveDialogSync())
                  }}
                  value={rekorboxFile}
                  label="Rekordbox Exported"
                  variant="standard"
                />
              </Box>
              <button onClick={() => goToMainScreen()}>
                Close Config Screen
              </button>
            </div>
          </Drawer>
        )}
      </AppContext.Consumer>
    )
  }
}
ConfigScreen.contextType = AppContext
export default ConfigScreen
