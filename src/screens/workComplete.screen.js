import React from 'react'
import {
  Alert,
  AlertTitle,
  Drawer,
  List,
  ListItem,
  Typography
} from '@mui/material'
import { AppContext } from '../context/app.context'
import { screen } from '../config/screens'
import moment from 'moment'
import SecondaryScreen from '../components/SecondaryScreen'
import { FormattedMessage } from 'react-intl'
import 'moment/locale/pt-br'
import { IntlContext } from '../context/intl.context'

export class WorkCompleteScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({
          workingMsg,
          activeScreen,
          goToMainScreen,
          elapsedTimeSeconds,
          convertedPlaylists,
          convertedTracks,
          startDateTime,
          notConvertedTracks
        }) => (
          <>
            <SecondaryScreen open={activeScreen === screen.workComplete}>
              <Alert
                severity={notConvertedTracks.length > 0 ? 'info' : 'success'}
                sx={{
                  height: '100vh',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2em',
                  backgroundColor:
                    notConvertedTracks.length > 0 ? '#0a1222' : 'rgb(16 33 19)'
                }}
                icon={<></>}
                onClick={() => goToMainScreen()}
              >
                <AlertTitle>
                  <Alert
                    variant="filled"
                    severity={
                      notConvertedTracks.length > 0 ? 'info' : 'success'
                    }
                    sx={{ marginBottom: 2 }}
                  >
                    <AlertTitle>
                      <FormattedMessage id="process-completed" />
                    </AlertTitle>
                  </Alert>
                </AlertTitle>

                <Typography variant={'body1'}>
                  <FormattedMessage id="converted-entire-library-in" />{' '}
                  <IntlContext.Consumer>
                    {({ language }) => {
                      return (
                        moment.locale(language) &&
                        moment
                          .duration({ seconds: parseInt(elapsedTimeSeconds) })
                          .humanize()
                      )
                    }}
                  </IntlContext.Consumer>
                </Typography>
                {notConvertedTracks.length > 0 && (
                  <>
                    <Typography variant={'body1'}>
                      {notConvertedTracks.length}{' '}
                      <FormattedMessage id="not-converted.tracks.title" />
                    </Typography>
                    <List
                      dense
                      sx={{
                        width: '100%',
                        maxWidth: '90vw',
                        maxHeight: 'calc(100vh - 140px)',
                        overflow: 'auto'
                      }}
                    >
                      {notConvertedTracks.map((track, index) => {
                        return (
                          <ListItem key={index} disableGutters>
                            <Typography variant={'body2'}>
                              <FormattedMessage id={track.reason} />
                              {' - '}
                              {track.track.location}
                            </Typography>
                          </ListItem>
                        )
                      })}
                    </List>
                  </>
                )}
              </Alert>
            </SecondaryScreen>
          </>
        )}
      </AppContext.Consumer>
    )
  }
}
WorkCompleteScreen.contextType = AppContext
export default WorkCompleteScreen
