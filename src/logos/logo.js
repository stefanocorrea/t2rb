import React from 'react'

class Logo extends React.Component {
  render() {
    let img
    switch (this.props.id) {
      case 'traktor':
        img =
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIyMzguNDQ3IDI0OS4wOTcgNzMuNjYgNzMuNjYiIHdpZHRoPSI3My42NiIgaGVpZ2h0PSI3My42NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNIDMxMi4xMDcgMjg1LjkyNyBDIDMxMi4xMDcgMzA2LjI2NyAyOTUuNjE3IDMyMi43NTcgMjc1LjI3NyAzMjIuNzU3IEMgMjU0LjkzNyAzMjIuNzU3IDIzOC40NDcgMzA2LjI2NyAyMzguNDQ3IDI4NS45MjcgQyAyMzguNDQ3IDI2NS41ODcgMjU0LjkzNyAyNDkuMDk3IDI3NS4yNzcgMjQ5LjA5NyBDIDI5NS42MTcgMjQ5LjA5NyAzMTIuMTA3IDI2NS41ODcgMzEyLjEwNyAyODUuOTI3IFogTSAyNzUuMjc3IDI1NS44MzEgQyAyNTguNjU2IDI1NS44MzEgMjQ1LjE4MSAyNjkuMzA2IDI0NS4xODEgMjg1LjkyNyBDIDI0NS4xODEgMzAyLjU0OCAyNTguNjU2IDMxNi4wMjMgMjc1LjI3NyAzMTYuMDIzIEMgMjkxLjg5OCAzMTYuMDIzIDMwNS4zNzMgMzAyLjU0OCAzMDUuMzczIDI4NS45MjcgQyAzMDUuMzczIDI2OS4zMDYgMjkxLjg5OCAyNTUuODMxIDI3NS4yNzcgMjU1LjgzMSBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZD0iTSAyOTkuNTcyIDI4NS45MjcgQyAyOTkuNTcyIDI4OS41NzYgMjk4Ljc2OCAyOTMuMDM2IDI5Ny4zMjggMjk2LjE0MiBMIDI4MS4zMjEgMjg1LjkyNyBMIDI5Ny4zMjggMjc1LjcxMiBDIDI5OC43NjggMjc4LjgxOCAyOTkuNTcyIDI4Mi4yNzggMjk5LjU3MiAyODUuOTI3IFogTSAyNzUuMjc3IDMxMC4yMjIgQyAyNjcuODQyIDMxMC4yMjIgMjYxLjE4NiAzMDYuODgzIDI1Ni43MyAzMDEuNjIxIEwgMjY2LjM5IDI5NS40NTUgQyAyNjguNzE4IDI5Ny42MjggMjcxLjg0MiAyOTguOTU3IDI3NS4yNzcgMjk4Ljk1NyBDIDI3OC43MTIgMjk4Ljk1NyAyODEuODM2IDI5Ny42MjcgMjg0LjE2NCAyOTUuNDU1IEwgMjkzLjgyNCAzMDEuNjIgQyAyODkuMzY4IDMwNi44ODMgMjgyLjcxMiAzMTAuMjIyIDI3NS4yNzcgMzEwLjIyMiBaIE0gMjUwLjk4MiAyODUuOTI3IEMgMjUwLjk4MiAyODIuMjc4IDI1MS43ODYgMjc4LjgxOCAyNTMuMjI2IDI3NS43MTIgTCAyNjkuMjM0IDI4NS45MjcgTCAyNTMuMjI2IDI5Ni4xNDIgQyAyNTEuNzg2IDI5My4wMzYgMjUwLjk4MiAyODkuNTc2IDI1MC45ODIgMjg1LjkyNyBaIE0gMjc1LjI3NyAyNjEuNjMyIEMgMjgyLjcxNCAyNjEuNjMyIDI4OS4zNjkgMjY0Ljk3MyAyOTMuODI2IDI3MC4yMzQgTCAyODQuMTYyIDI3Ni40IEMgMjgxLjgzNiAyNzQuMjI5IDI3OC43MTIgMjcyLjkgMjc1LjI3NyAyNzIuOSBDIDI3MS44NDIgMjcyLjkgMjY4LjcxOCAyNzQuMjI5IDI2Ni4zOTIgMjc2LjM5OSBMIDI1Ni43MyAyNzAuMjMzIEMgMjYxLjE4NiAyNjQuOTcxIDI2Ny44NDIgMjYxLjYzMiAyNzUuMjc3IDI2MS42MzIgWiIgc3R5bGU9IiIvPgo8L3N2Zz4='
        break
      case 'rekordbox':
        img =
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIyMzcuODY4IDI0OC40OCA3NS4xIDgyLjcyNSIgd2lkdGg9Ijc1LjEiIGhlaWdodD0iODIuNzI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMjg2Ljg2OCAyOTAuOTA1IEMgMjg2Ljg2OCAyOTcuMjA1IDI4MS43NjggMzAyLjMwNSAyNzUuNDY4IDMwMi4zMDUgQyAyNjkuMTY4IDMwMi4zMDUgMjY0LjA2OCAyOTcuMjA1IDI2NC4wNjggMjkwLjkwNSBDIDI2NC4wNjggMjg0LjYwNSAyNjkuMTY4IDI3OS41MDUgMjc1LjQ2OCAyNzkuNTA1IEMgMjgxLjc2OCAyNzkuNTA1IDI4Ni44NjggMjg0LjYwNSAyODYuODY4IDI5MC45MDUgWiBNIDI3NS4zNjggMjY1LjkwNSBDIDI4Mi4zNjggMjY1LjkwNSAyODkuMDY4IDI2OC45MDUgMjkzLjc2OCAyNzQuMTA1IEwgMzA3LjU2OCAyNjYuMTA1IEwgMjc4LjQ2OCAyNDkuMzA1IEMgMjc2LjU2OCAyNDguMjA1IDI3NC4xNjggMjQ4LjIwNSAyNzIuMjY4IDI0OS4zMDUgTCAyNDMuMTY4IDI2Ni4xMDUgTCAyNTYuOTY4IDI3NC4xMDUgQyAyNjEuNjY4IDI2OC45MDUgMjY4LjM2OCAyNjUuOTA1IDI3NS4zNjggMjY1LjkwNSBaIE0gMjk5LjE2OCAyODMuMzA1IEMgMjk5Ljk2OCAyODUuODA1IDMwMC4zNjggMjg4LjMwNSAzMDAuMzY4IDI5MC45MDUgQyAzMDAuMzY4IDMwMi42MDUgMjkyLjE2OCAzMTIuODA1IDI4MC43NjggMzE1LjMwNSBMIDI4MC43NjggMzMxLjIwNSBMIDMwOS44NjggMzE0LjQwNSBDIDMxMS43NjggMzEzLjMwNSAzMTIuOTY4IDMxMS4zMDUgMzEyLjk2OCAzMDkuMTA1IEwgMzEyLjk2OCAyNzUuNTA1IEwgMjk5LjE2OCAyODMuMzA1IFogTSAyNTAuNDY4IDI5MC45MDUgQyAyNTAuNDY4IDI4OC4zMDUgMjUwLjg2OCAyODUuODA1IDI1MS42NjggMjgzLjMwNSBMIDIzNy44NjggMjc1LjQwNSBMIDIzNy44NjggMzA5LjAwNSBDIDIzNy44NjggMzExLjIwNSAyMzkuMDY4IDMxMy4yMDUgMjQwLjk2OCAzMTQuMzA1IEwgMjcwLjA2OCAzMzEuMTA1IEwgMjcwLjA2OCAzMTUuMjA1IEMgMjU4LjY2OCAzMTIuODA1IDI1MC40NjggMzAyLjYwNSAyNTAuNDY4IDI5MC45MDUgWiIvPgo8L3N2Zz4='

        break
      default:
        img = ''
    }

    return (
      <div
        className="logo"
        style={{
          backgroundColor: this.props.color || 'black',
          WebkitMaskImage: `url(${img})`,

          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center center',

          width: this.props.width || 100,
          height: this.props.height || 100
        }}
      ></div>
    )
  }
}

export class TraktorLogo extends React.Component {
  render() {
    return (
      <Logo
        width={this.props.size || 100}
        height={this.props.size || 100}
        color={this.props.color}
        id="traktor"
      />
    )
  }
}

export class RekordboxLogo extends React.Component {
  render() {
    return (
      <Logo
        width={this.props.size || 100}
        height={this.props.size || 100}
        color={this.props.color}
        id="rekordbox"
      />
    )
  }
}
