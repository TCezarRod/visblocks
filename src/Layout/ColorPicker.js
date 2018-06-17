import React from 'react'
import PropTypes from 'prop-types'
import reactCSS from 'reactcss'

import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    onSelect: PropTypes.func
  }

  state = {
    displayColorPicker: false
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    const rgb = color.rgb
    this.props.onSelect(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`);
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.props.color,
        },
        swatch: {
          width: 'fit-content',
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <React.Fragment>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.props.color } onChange={ this.handleChange } />
        </div> : null }
      </React.Fragment>
    )
  }
}

export default ColorPicker