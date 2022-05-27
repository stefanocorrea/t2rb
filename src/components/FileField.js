import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import ErrorIcon from '@mui/icons-material/Error'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Typography from '@mui/material/Typography'

import { orange } from '@mui/material/colors'

export class FileField extends React.Component {
  render() {
    let basename = this.props.value?.replace(/.*\//gims, '/')
    let dir = this.props.value?.replace(basename, '')

    return (
      <Paper
        sx={{
          my: 1,
          mx: 'auto',
          p: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <Badge
              onClick={() => this.props.onChange()}
              overlap="circular"
              badgeContent={
                <Avatar
                  style={{
                    background: 'black',
                    width: 18,
                    height: 18
                  }}
                >
                  {
                    {
                      success: <CheckCircleIcon color="success" />,
                      warning: <ErrorIcon color={'warning'} />
                    }[this.props.status]
                  }
                </Avatar>
              }
            >
              <div
                style={{
                  background: this.props.iconBackground || 'none',
                  padding: 5,
                  borderRadius: 6
                }}
              >
                {this.props.icon}
              </div>
            </Badge>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="button">{this.props.label}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  //    justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => this.props.onChange()}
                    >
                      {this.props.buttonText}
                    </Button>
                  </Grid>
                  <Grid item xs style={{ position: 'relative' }}>
                    <Box>
                      <Typography
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          left: 16,
                          right: 0,
                          top: 5,
                          opacity: 0.3
                        }}
                      >
                        <span
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                          }}
                        >
                          {dir}
                        </span>
                        <span>{basename}</span>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              {this.props.description && (
                <Grid item xs={12}>
                  <Typography
                    variant="caption"
                    style={{
                      opacity: this.props.status === 'warning' ? 1 : 0.3
                    }}
                    color={this.props.status === 'warning' && orange[500]}
                  >
                    {this.props.description}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}
