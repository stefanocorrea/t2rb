import React from 'react'
import styles from './animation.module.css'

export class AppIconLayout extends React.Component {
  render() {
    return (
      <div
        className={this.props.className}
        style={{
          padding: this.props.size / 10,
          borderRadius: this.props.size / 10,
          position: `relative`,
          overflow: `hidden`
        }}
      >
        <div
          className={this.props.rotateLoop ? styles.rotateLoop : undefined}
          style={{
            background: this.props.color,
            position: 'absolute',
            top: this.props.size * -1,
            left: this.props.size * -1,
            right: this.props.size * -1,
            bottom: this.props.size * -1
          }}
        ></div>

        <div className={this.props.rotateLoop ? styles.rotateLoop : undefined}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
