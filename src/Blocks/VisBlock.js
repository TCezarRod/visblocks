import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock } from 'actions'

import Rnd from 'react-rnd';

class VisBlock extends React.Component {

  renderNoData() {
    return "No Data";
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
      onResize={this.updateSize}
      onResizeStop={this.updatePrevSize}
      onDrag={this.updatePosition}
      bounds= 'parent'
    >
      <div className="container-block">
      <div className="handle">✜</div>
      {this.props.children || this.renderNoData()}
      </div>
    </Rnd>
    );
  }
}

export default VisBlock