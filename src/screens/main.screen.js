import { Box, Grid, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { AppConfigBar } from '../components/appBar'
import { AppIcon } from '../components/AppIcon'
import { AppIconRekordbox } from '../components/AppIconRekordbox'
import { AppIconTraktor } from '../components/AppIconTraktor'
import { ArrowRight } from '../components/ArrowRight'
import { AppContext } from '../context/app.context'
import { screen } from '../config/screens'
import { config } from '../config/config'
import { Clickable } from '../components/Clickable'
import { ProgressBar } from '../components/ProgressBar'
import { FormattedMessage, injectIntl } from 'react-intl'
import { IntlContext } from '../context/intl.context'

import moment from 'moment'
import 'moment/locale/pt-br'

import styles from '../components/logos.module.css'

class MainScreen extends React.Component {
  render() {
    const { formatMessage } = this.props.intl
    return (
      <AppContext.Consumer>
        {({
          workingMsg,
          workingTrack,
          convertedTracks,
          workDoneSteps,
          workSteps,
          activeScreen,
          goToWorkingScreen,
          tracksToConvert,
          doTheMagic,
          startDateTime,
          elapsedTimeSeconds,
          abortTheMagic,
          isPreparing,
          notConvertedTracks,
          workingStatus
        }) => (
          <>
            <Grid
              container
              direction={'column'}
              justifyContent={'space-between'}
              style={{ minHeight: '100vh' }}
            >
              <Grid item>
                <AppConfigBar />
              </Grid>
              <Grid
                item
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  marginTop: activeScreen === screen.working ? -140 : -100,
                  transition: '0.3s'
                }}
              >
                <Container maxWidth="sm">
                  <Grid
                    container
                    alignItems="center"
                    justifyContent={'center'}
                    spacing={3}
                    flexWrap={'nowrap'}
                  >
                    <Grid item>
                      <AppIconTraktor size={64} />
                    </Grid>
                    <Grid item>
                      <ArrowRight color={'rgba(255,255,255,0.2)'} />
                    </Grid>
                    <Grid item>
                      <Clickable
                        tooltip={
                          activeScreen === screen.working
                            ? formatMessage({ id: 'cancel' })
                            : formatMessage({ id: 'convert-library' })
                        }
                        onClick={() =>
                          activeScreen === screen.working
                            ? abortTheMagic('canceled-by-user')
                            : doTheMagic()
                        }
                      >
                        <AppIcon
                          className={styles.appIcon}
                          size={128}
                          loading={true}
                          rotateLoop={activeScreen === screen.working}
                        />
                      </Clickable>
                    </Grid>
                    <Grid item>
                      <ArrowRight color={'rgba(255,255,255,0.2)'} />
                    </Grid>
                    <Grid item>
                      <AppIconRekordbox size={64} />
                    </Grid>
                  </Grid>
                </Container>
              </Grid>

              <Grid
                item
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  marginTop: activeScreen === screen.working ? 110 : 140,
                  opacity: activeScreen === screen.working ? 1 : 0,
                  left: 0,
                  height: 80,
                  transition: '0.3s'
                }}
              >
                {activeScreen === screen.working && (
                  <Container maxWidth="lg">
                    <Grid container>
                      <Grid item style={{ position: `relative`, flexGrow: 1 }}>
                        <Typography
                          variant="body1"
                          textAlign={'center'}
                          gutterBottom
                          style={{
                            position: `absolute`,
                            left: 0,
                            right: 0,
                            overflow: `hidden`,
                            textAlign: `left`,
                            textOverflow: `ellipsis`,
                            whiteSpace: `nowrap`
                          }}
                        >
                          {workingMsg ? (
                            <FormattedMessage id={workingMsg} />
                          ) : (
                            workingTrack
                          )}
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Typography
                          variant="body1"
                          textAlign={'center'}
                          gutterBottom
                          style={{
                            transition: '2s',
                            opacity: isPreparing ? 0 : 1
                          }}
                        >
                          {((workDoneSteps / workSteps) * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box mb={1}>
                      <ProgressBar
                        value={
                          isPreparing ? 0 : (workDoneSteps / workSteps) * 100
                        }
                      />
                    </Box>
                    <Grid container>
                      <Grid item>
                        <Typography
                          variant="body1"
                          textAlign={'center'}
                          gutterBottom
                          style={{
                            transition: '2s',
                            opacity: isPreparing ? 0 : 1
                          }}
                        >
                          {`${formatMessage({ id: 'music' })} ${
                            convertedTracks.length + notConvertedTracks.length
                          } ${formatMessage({ id: 'of' })} ${
                            tracksToConvert.length
                          }`}
                        </Typography>
                      </Grid>
                      <Grid item xs></Grid>

                      <Grid item>
                        <Typography
                          variant="body1"
                          textAlign={'center'}
                          gutterBottom
                          style={{
                            transition: '2s',
                            transitionDelay: '5s',
                            opacity: isPreparing ? 0 : 1
                          }}
                        >
                          {' '}
                          <IntlContext.Consumer>
                            {({ language }) => {
                              return (
                                moment.locale(language) &&
                                moment
                                  .duration({
                                    seconds: parseInt(
                                      elapsedTimeSeconds /
                                        (workDoneSteps / workSteps) -
                                        elapsedTimeSeconds
                                    )
                                  })
                                  .humanize()
                              )
                            }}
                          </IntlContext.Consumer>{' '}
                          <FormattedMessage id="remaining" />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </AppContext.Consumer>
    )
  }
}

MainScreen.contextType = AppContext
export default injectIntl(MainScreen)
