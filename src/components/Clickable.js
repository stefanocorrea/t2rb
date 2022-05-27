import * as React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black
  }
}))

export class Clickable extends React.Component {
  render() {
    return (
      <CustomTooltip
        title={this.props.tooltip}
        arrow
        //followCursor
        placement={'top'}
        onClick={this.props.onClick}
      >
        <div style={{ cursor: `pointer` }}>{this.props.children}</div>
      </CustomTooltip>
    )
  }
}
