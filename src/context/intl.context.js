import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl'
import messages_en from '../translations/en.json'
import messages_ptbr from '../translations/pt-br.json'
import { AppContext } from './app.context'
import { config } from '../config/config'
import moment from 'moment'
import 'moment/locale/pt-br'

// Translated messages in French with matching IDs to what you declared
export const IntlContext = createContext({})

const messages = {
  en: messages_en,
  'pt-BR': messages_ptbr
}

function flattenMessages(nestedMessages, prefix = '') {
  if (!nestedMessages) return {}
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key]
    let prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      messages[prefixedKey] = value
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey))
    }

    return messages
  }, {})
}

export class Intl extends React.Component {
  setLang = newLang => {
    this.setState({
      language: newLang
    })
  }

  state = {
    language: config.get('lang'),
    modalOpen: false,
    needSetLang: config.get('needSetLanguage'),

    setLang: newLang => this.setLang(newLang),
    saveLang: newLang => {
      config.set('lang', newLang)
      config.set('needSetLanguage', false)
      this.setState({ needSetLang: false, language: newLang })
    },
    toggleModalOpen: () =>
      this.setState({ modalOpen: !this.state.modalOpen, needSetLang: false }),
    setModalClose: () => this.setState({ modalOpen: false, needSetLang: false })
  }

  render() {
    return (
      <IntlContext.Provider value={this.state}>
        <IntlProvider
          locale={this.state.language}
          messages={flattenMessages(messages[this.state.language])}
          //defaultLocale="en"
        >
          {this.props.children}
        </IntlProvider>
      </IntlContext.Provider>
    )
  }
}
