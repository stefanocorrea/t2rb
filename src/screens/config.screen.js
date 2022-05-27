import React from 'react'
import { AppContext } from '../context/app.context'
import { screen } from '../config/screens'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TraktorLogo, RekordboxLogo } from '../logos/logo.js'
import { FileField } from '../components/FileField'
import { SecondaryScreen } from '../components/SecondaryScreen'
import { FormattedMessage } from 'react-intl'

const open = window.require('open')

const dialog = window.require('electron').remote.dialog

export class ConfigScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({
          traktorFile,
          rekordboxFile,
          activeScreen,
          goToMainScreen,
          setTraktorFile,
          setRekordboxFile,
          validTraktorFile,
          validRekordboxFile,
          descriptionInvalidTraktorFile,
          descriptionInvalidRekordboxFile,
          setLang
        }) => (
          <>
            <SecondaryScreen
              open={
                activeScreen === screen.config ||
                !validTraktorFile ||
                !validRekordboxFile
              }
              title={<FormattedMessage id="config.title" />}
              // description={<FormattedMessage id="config.description" />}
              dontShowClose={!validTraktorFile || !validRekordboxFile}
            >
              <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
                <FileField
                  icon={<TraktorLogo color="white" size={55} />}
                  iconBackground={`linear-gradient(to left bottom, #061c42, #05070a)`}
                  status={validTraktorFile ? 'success' : 'warning'}
                  label={
                    <FormattedMessage id="config.fields.traktor.file.label" />
                  }
                  onChange={() =>
                    setTraktorFile(
                      dialog.showOpenDialogSync({
                        properties: ['openFile'],
                        filters: [
                          {
                            name: 'Traktor Collection File',
                            extensions: ['nml']
                          }
                        ]
                      })
                    )
                  }
                  value={traktorFile}
                  buttonText={
                    <FormattedMessage
                      id={traktorFile ? 'change.file' : 'open.file'}
                    />
                  }
                  description={
                    <FormattedMessage
                      id={
                        descriptionInvalidTraktorFile ||
                        'config.fields.traktor.file.description'
                      }
                    />
                  }
                />
                <FileField
                  icon={<RekordboxLogo color="white" size={55} />}
                  iconBackground={`linear-gradient(to left bottom, rgb(53 4 17), rgb(5 2 3))`}
                  status={validRekordboxFile ? 'success' : 'warning'}
                  label={
                    <FormattedMessage id="config.fields.rekordbox.file.label" />
                  }
                  onChange={() => setRekordboxFile(dialog.showSaveDialogSync())}
                  value={rekordboxFile}
                  buttonText={
                    <FormattedMessage
                      id={rekordboxFile ? 'change.location' : 'set.location'}
                    />
                  }
                  description={
                    <FormattedMessage
                      id={
                        descriptionInvalidRekordboxFile ||
                        'config.fields.rekordbox.file.description'
                      }
                    />
                  }
                />

                <Typography
                  style={{
                    margin: 40,
                    marginLeft: 0,
                    marginRight: 0,
                    opacity: 0.3
                  }}
                  paragraph
                  variant="caption"
                  align="center"
                  gutterBottom={!!this.props.description}
                >
                  <FormattedMessage id="by" />{' '}
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      open('http://deepstefano.com', { wait: true })
                    }}
                  >
                    @deepstefano
                  </span>
                  - v1.0.0 Beta
                </Typography>
              </Box>{' '}
            </SecondaryScreen>
          </>
        )}
      </AppContext.Consumer>
    )
  }
}
ConfigScreen.contextType = AppContext
export default ConfigScreen
