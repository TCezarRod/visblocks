import React  from 'react';
import PropTypes from 'prop-types'

const minLock = 30

class Path extends React.Component {
  static propTypes = {
    xi: PropTypes.number,
    yi: PropTypes.number,
    xe: PropTypes.number,
    ye: PropTypes.number
  }

  static getDerivedStateFromProps(newProps, prevState) {
    return {...prevState, 
      xi: newProps.xi,
      yi: newProps.yi,
      dx:newProps.xe - newProps.xi, 
      dy:newProps.ye - newProps.yi
    }
  }

  state = {
    xi: this.props.xi,
    yi: this.props.yi,
    dx: this.props.xe - this.props.xi,
    dy: this.props.ye - this.props.yi
  }

  renderArrowHead = (x, y) => {
    return (
      <path d={`
        M ${x} ${y}
        l -15 -5
        l 0 10
        Z
      `} stroke='rgb(120,120,120)' fill='rgb(100,100,100)'/>
    )
  }

  renderForwardPath = (xi, yi, dx, dy) => {
    return (
      <path d={`
        M ${xi} ${yi} 
        c ${dx/2} 00 ${dx/2} 00 ${dx/2} ${dy/2} 
        c 00 ${dy/2} 00 ${dy/2} ${dx/2 -5} ${dy/2}
      `} stroke='rgb(120,120,120)' stroke-width='2' fill='none'/>
    )
  }

  renderBackwardsPath = (xi, yi, dx, dy) => {
    return (
        <path d={`
        M ${xi} ${yi} 
        c ${minLock} 00 ${minLock} 00 ${minLock} ${dy/3}
        c 0 ${dy/6} 0 ${dy/6} ${dx/2 - minLock} ${dy/6}
        c ${dx/2 - minLock} 0 ${dx/2 - minLock} 0 ${dx/2 - minLock} ${dy/6}
        c 0 ${dy/3} 0 ${dy/3} ${minLock - 5} ${dy/3}
      `} stroke='rgb(120,120,120)' stroke-width='2' fill='none'/>
    )
  }

  renderPath = (xi, yi, dx, dy) => {
    if (dx < minLock*2) {
      return this.renderBackwardsPath(xi, yi, dx, dy)
    } else {
      return this.renderForwardPath(xi, yi, dx, dy)
    }
  }

  render () {
    const { xi, yi, dx, dy } = this.state
    return(
      <g>
        {this.renderPath(xi, yi, dx, dy)}
        {this.renderArrowHead(xi + dx, yi + dy)}
      </g>
    )
  }

}

export default Path