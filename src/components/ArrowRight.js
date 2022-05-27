import React from 'react'

export class ArrowRight extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            height: 4,
            background: `linear-gradient(to right, transparent, ${this.props.color})`,
            width: 50
          }}
        />
        <span
          style={{
            width: 0,
            height: 0,
            display: 'block',
            border: '7px solid transparent',
            borderLeftColor: this.props.color,
            borderRight: 0
          }}
        ></span>
      </div>
    )
  }
}
