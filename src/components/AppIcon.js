import React from 'react'

import { AppLogo } from '../logos/logo'
import { AppIconLayout } from './AppIconLayout'

export class AppIcon extends React.Component {
  render() {
    return (
      <AppIconLayout
        className={this.props.className}
        color="linear-gradient(to left,  rgb(53 4 17), #061c42)"
        size={this.props.size}
        rotateLoop={this.props.rotateLoop}
      >
        <AppLogo color="white" size={this.props.size} />
      </AppIconLayout>
    )
  }
}
