import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Box, LinearProgress } from '@mui/material'

export class ProgressBar extends React.Component {
  render() {
    return <LinearProgress value={this.props.value} variant="determinate" />
  }
}
