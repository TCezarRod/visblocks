import React  from 'react';
import PropTypes from 'prop-types'

import Rnd from 'react-rnd';

// TODO: make it actually control data
class ScatterPlot extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    position: {
      top: this.props.top,
      left: this.props.left
    },
    size: {
      width: this.props.width,
      height: this.props.height
    },
    data: []
  }

  updateSize = (e, dir, ref, delta) => {
    this.setState({
      size:{
        width: this.state.size.width + delta.width,
        height: this.state.size.height + delta.height
      }
    })
  }

  render() {
    return (
      <Rnd
        default={{
          x: this.state.position.left,
          y: this.state.position.top,
          width: this.state.size.width,
          height: this.state.size.height,
        }}
        dragHandleClassName=".handle"
        style={this.style}
        onResizeStop={this.updateSize}
      >
        <div className="container" >
          <div className="handle">✜</div>
          Data
        </div>
      </Rnd>
    );
  }
}



export default ScatterPlot;
