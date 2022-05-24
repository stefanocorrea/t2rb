import React from 'react'
import AppContext from './app.context'

class ExampleButton extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ exampleStatus, exampleToggleStatus }) => (
          <button onClick={() => exampleToggleStatus('ok')}>
            CLICK ME EXAMPLE
          </button>
        )}
      </AppContext.Consumer>
    )
  }
}

export default ExampleButton
