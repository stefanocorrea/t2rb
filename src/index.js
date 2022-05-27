import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './context/app.context'
import { Intl } from './context/intl.context'
import { Theme } from './context/theme.context'
import MainScreen from './screens/main.screen'
import ConfigScreen from './screens/config.screen'
import WorkCompleteScreen from './screens/workComplete.screen'
import WorkCanceledScreen from './screens/workCanceled.screen'
import WorkFailScreen from './screens/workFail.screen'
import LanguageScreen from './screens/language.screen'
import LanguageIconSelect from './components/LanguageIconSelect'
import { Box } from '@mui/material'

ReactDOM.render(
  <React.StrictMode>
    <Intl>
      <App>
        <Theme>
          <MainScreen />
          <ConfigScreen />
          <WorkCompleteScreen />
          <WorkCanceledScreen />
          <WorkFailScreen />
          <LanguageScreen />
        </Theme>
      </App>
    </Intl>
  </React.StrictMode>,
  document.getElementById('root')
)
