const Store = window.require('electron-store')
const path = window.require('path')
const isDev = window.require('electron-is-dev')

const configSchema = {
  window: {
    type: 'object',
    properties: {
      width: {
        type: 'number',
        default: 800
      },
      height: {
        type: 'number',
        default: 600
      }
    }
  },
  rekordbox: {
    type: 'string',
    default: ''
  },
  traktor: {
    type: 'string',
    default: ''
  },
  djDataConverterDir: {
    type: 'string',
    default: ''
  },
  tempDir: {
    type: 'string',
    default: ''
  },
  lang: {
    type: 'string',
    default: ''
  },
  lang: {
    type: 'bolean',
    default: 'true'
  }
}

export const configObject = new Store({ configSchema })
configObject.set(
  'djDataConverter',
  path.join(
    isDev ? path.resolve('./') : window.process.resourcesPath,
    'extra_resources',
    'dj-data-converter'
  )
)

if (!configObject.get('lang')) {
  configObject.set('lang', 'en')
  configObject.set('needSetLanguage', true)
}

configObject.set(
  'tempDir',
  path.join(isDev ? path.resolve('./') : window.process.resourcesPath, 'temp')
)

export const config = configObject

// export const ok = config.get('rekordbox')
