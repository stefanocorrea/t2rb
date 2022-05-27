import * as React from 'react'

import CheckIcon from '@mui/icons-material/Check'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
import SettingsIcon from '@mui/icons-material/Settings'
import { IntlContext } from '../context/intl.context'
import { screen } from '../config/screens'
import { config } from '../config/config'
import { languages } from '../config/languages.config'

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material'
import { FormattedMessage } from 'react-intl'

export class LanguageScreen extends React.Component {
  render() {
    return (
      <IntlContext.Consumer>
        {({
          language,
          setLang,
          saveLang,
          modalOpen,
          setModalClose,
          needSetLang
        }) => (
          <>
            <Dialog
              disableEscapeKeyDown
              open={modalOpen || needSetLang}
              onClose={async () => {
                !needSetLang && (await setModalClose())
                setLang(config.get('lang'))
              }}
            >
              <DialogTitle>
                <FormattedMessage id="language.title" />
              </DialogTitle>
              <DialogContent>
                <Box
                  component="form"
                  sx={{ display: 'flex', flexWrap: 'wrap' }}
                >
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="lang-selector">
                      <FormattedMessage id="language.selected" />
                    </InputLabel>
                    <Select
                      labelId="lang-selector"
                      value={language}
                      onChange={event => setLang(event.target.value)}
                      input={
                        <OutlinedInput
                          label={<FormattedMessage id="language.selected" />}
                        />
                      }
                      renderValue={value => {
                        let selected = languages.reduce((acum, curr) => {
                          return curr.id === value ? curr : acum
                        }, false)

                        return (
                          <Grid container spacing={1}>
                            <Grid item>{selected.flag}</Grid>
                            <Grid item>{selected.label}</Grid>
                          </Grid>
                        )
                      }}
                      // MenuProps={MenuProps}
                    >
                      {languages.map((lang, index) => (
                        <MenuItem key={index} value={lang.id}>
                          <ListItemIcon>{lang.flag}</ListItemIcon>
                          <ListItemText primary={lang.label} />
                          {language === lang.id && (
                            <ListItemIcon>
                              <CheckIcon />
                            </ListItemIcon>
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                {!needSetLang && (
                  <Button
                    onClick={async () => {
                      await setModalClose()
                      setLang(config.get('lang'))
                    }}
                  >
                    <FormattedMessage id="cancel" />
                  </Button>
                )}
                <Button
                  onClick={async () => {
                    await setModalClose()
                    saveLang(language)
                  }}
                >
                  <FormattedMessage id="save" />
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </IntlContext.Consumer>
    )
  }
}

LanguageScreen.contextType = IntlContext
export default LanguageScreen
