import React from 'react'
import { XMLParser } from 'fast-xml-parser'
import XMLParserAntigo from 'react-xml-parser'
import { getParseOptions } from './helpers/parseXmlDefaultOptions'
const fs = window.require('fs')

export class TestModule extends React.Component {
  render() {
    let parser = new XMLParser(getParseOptions('traktor'))

    let stringXML = fs.readFileSync(
      'D:/www/t2rb/github/t2rb/src/test-collections/traktor/test.nml',
      'utf-8'
    )

    let jObj = parser.parse(stringXML)

    let parseAntigo = new XMLParserAntigo().parseFromString(stringXML)

    console.log('new', jObj.NML.COLLECTION.ENTRY[0].CUE_V2)

    return 'TEST'
  }
}
export default TestModule
