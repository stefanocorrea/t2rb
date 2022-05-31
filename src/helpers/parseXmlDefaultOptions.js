import React from 'react'
import { XMLParser } from 'fast-xml-parser'
const fs = window.require('fs')

export function getParseOptions(program) {
  let regexNodesThatAlwaysArrays
  switch (program) {
    case 'traktor':
      regexNodesThatAlwaysArrays = [
        'subnodes.node$',
        'collection.entry$',
        'playlist.entry$',
        'entry.cue_v2$'
      ]
      break
    case 'rekordbox':
      regexNodesThatAlwaysArrays = ['collection.track$']
      break
    default:
      regexNodesThatAlwaysArrays = []
  }

  return {
    ignoreAttributes: false,
    attributeNamePrefix: '_',
    alwaysCreateTextNode: true,
    suppressBooleanAttributes: true,
    suppressEmptyNode: false,
    ignorePiTags: true,
    format: true,
    arrayNodeName: 'ENTRY',
    allowBooleanAttributes: true.valueOf,
    trimValues: true,
    isArray: (name, jpath, isLeafNode, isAttribute) => {
      return regexNodesThatAlwaysArrays.reduce((acum, curr) => {
        let bate = acum
        var re = new RegExp(curr, 'gim')
        // same as
        if (re.exec(jpath)) {
          bate = true
        }

        return bate
      }, false)
    }
  }
}
