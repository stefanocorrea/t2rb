import * as React from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import { languages } from '../config/languages.config'
import styles from './langbtn.module.css'
import { IntlContext } from '../context/intl.context'
import { Button, IconButton } from '@mui/material'

class LanguageIconSelect extends React.Component {
  render() {
    return (
      <IntlContext.Consumer>
        {({ language, setLang, saveLang, modalOpen, toggleModalOpen }) => {
          let lang = languages.reduce((acum, curr) => {
            return curr.id === language ? curr : acum
          }, false)

          return (
            <Button
              className={this.props.soft ? styles.langBtn : undefined}
              size={'small'}
              onClick={() => toggleModalOpen()}
              variant="outlined"
              startIcon={lang.flag}
            >
              {this.props.soft ? lang.id : lang.label}
            </Button>
          )
        }}
      </IntlContext.Consumer>
    )
  }
}

LanguageIconSelect.contextType = IntlContext
export default LanguageIconSelect
