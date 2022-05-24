import React from 'react'
import ReactDOM from 'react-dom'
import { AppContextProvider } from './context/app.context'
import Theme from './config/theme.config'

import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <Theme>
        <App></App>
      </Theme>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
