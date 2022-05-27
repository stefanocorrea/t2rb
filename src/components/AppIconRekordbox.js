import React from 'react'

import { RekordboxLogo } from '../logos/logo'
import { AppIconLayout } from './AppIconLayout'

export class AppIconRekordbox extends React.Component {
  render() {
    return (
      <AppIconLayout
        color="linear-gradient(to right bottom, rgb(53 4 17), rgb(5 2 3))"
        size={this.props.size}
      >
        <RekordboxLogo color="white" size={this.props.size} />
      </AppIconLayout>
    )
  }
}
