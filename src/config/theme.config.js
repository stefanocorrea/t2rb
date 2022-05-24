import React from 'react'
import AppContext from '../context/app.context'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

class Theme extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {this.props.children}
      </ThemeProvider>
    )
  }
}

Theme.contextType = AppContext
export default Theme
