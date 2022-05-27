import { Grid } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { AppConfigBar } from './appBar'
import { AppContext } from '../context/app.context'
import { AppLogo, RekordboxLogo, TraktorLogo } from '../logos/logo'
import { AppIconLayout } from './AppIconLayout'

export class AppIconTraktor extends React.Component {
  render() {
    return (
      <AppIconLayout
        color="linear-gradient(to left bottom, #061c42, #05070a)"
        size={this.props.size}
      >
        <TraktorLogo color="white" size={this.props.size} />
      </AppIconLayout>
    )
  }
}
