import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

export class ScreenTitle extends React.Component {
  render() {
    return (
      <>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6" gutterBottom={!!this.props.description}>
            {this.props.text}
          </Typography>
          {this.props.description && (
            <Typography variant="subtitle1">
              {this.props.description}
            </Typography>
          )}
        </Box>
      </>
    )
  }
}
