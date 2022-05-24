import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import AppContext from '../context/app.context'

export class AppConfigBar extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ goToConfigScreen }) => (
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { sm: 'block' } }}
              >
                T2R
              </Typography>

              <Box sx={{ flexGrow: 1 }} />
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
            </Toolbar>
          </AppBar>
        )}
      </AppContext.Consumer>
    )
  }
}

AppConfigBar.contextType = AppContext
export default AppConfigBar
