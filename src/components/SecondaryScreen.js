import * as React from 'react'
import { AppContext } from '../context/app.context'
import { Drawer, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/system'
import { ScreenTitle } from './ScreenTitle'
import { Clickable } from './Clickable'
import { screen } from '../config/screens'
import LanguageIconSelect from './LanguageIconSelect'

export class SecondaryScreen extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ goToMainScreen, activeScreen }) => (
          <Drawer
            anchor={'bottom'}
            open={this.props.open}
            onClose={() => goToMainScreen()}
          >
            <div style={{ minHeight: '100vh' }}>
              <>
                <Toolbar
                  style={
                    !this.props.title
                      ? { position: 'absolute', width: '100%' }
                      : {}
                  }
                >
                  <Grid container spacing={0}>
                    <Grid item xs>
                      {this.props.title && (
                        <ScreenTitle
                          text={this.props.title}
                          description={this.props.description}
                        />
                      )}
                    </Grid>
                    <Grid item>
                      <Box my={2} mx={1}>
                        <LanguageIconSelect
                          soft={activeScreen !== screen.config}
                        />
                      </Box>
                    </Grid>

                    {!this.props.dontShowClose && (
                      <Grid item>
                        <Box pt={1}>
                          {this.props.closeComponent ? (
                            this.props.closeComponent
                          ) : (
                            <IconButton
                              size="large"
                              edge="end"
                              color="inherit"
                              onClick={() => goToMainScreen()}
                            >
                              <CloseIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Toolbar>
              </>
              {this.props.children}
            </div>
          </Drawer>
        )}
      </AppContext.Consumer>
    )
  }
}
SecondaryScreen.contextType = AppContext
export default SecondaryScreen
