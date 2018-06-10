import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock } from 'actions'

import Rnd from 'react-rnd';

const mapDispatchToProps = dispatch => {
  return {
    moveBlock: (id, props) => dispatch(moveBlock(id, props))
  };
};

class VisBlock extends React.Component {
  static propTypes = {
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number
  }

  static defaultProps = {
    minWidth: 150,
    minHeight: 150
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
    prevSize: {
      width: this.props.width,
      height: this.props.height
    }
  }

  renderNoData() {
    return <span>Empty</span>;
  }

  updateSize = (e, dir, ref, delta, position) => {
    this.props.moveBlock(this.props.id, {
      size: {
        width: this.state.prevSize.width + delta.width,
        height: this.state.prevSize.height + delta.height
      },
      position: position
    })
    this.setState({
      size:{
        width: this.state.prevSize.width + delta.width,
        height: this.state.prevSize.height + delta.height
      },
      position: {
        top: position.y,
        left: position.x
      }
    })
  }

  updatePrevSize = (e, dir, ref, delta, position) => {
    this.setState({
      prevSize:{
        width: this.state.size.width,
        height: this.state.size.height
      }
    })
  }

  updatePosition = (e, position) => {
    this.props.moveBlock(this.props.id, {
      size: this.state.size,
      position: {
        x: position.x,
        y: position.y
      }
    })
    this.setState({
      position: {
        top: position.y,
        left: position.x
      }
    })
  }

  renderChildrenWithProps = () => {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {data:child.props.data, width: this.state.size.width, height: this.state.size.height }));
  }
  
  render() {
    const { position, size } = this.state;
    const { minWidth, minHeight } = this.props;
    return (
    <Rnd 
      default={{
      x: position.left,
      y: position.top,
      width: (size.width > minWidth ? size.width : minWidth),
      height: (size.height > minHeight ? size.height : minHeight),
      }}
      dragHandleClassName=".handle"
      onResize={this.updateSize}
      onResizeStop={this.updatePrevSize}
      onDrag={this.updatePosition}
      bounds= 'parent'
      minWidth={minWidth}
      minHeight={minHeight}
    >
      <div className="port port-input">.</div>
      <div className="container-block">
        <div className="handle"></div>
        <div className="block-content">
          {this.props.children ? this.renderChildrenWithProps() : this.renderNoData()}
        </div>
      </div>
    </Rnd>
    );
  }
}

export default connect(null, mapDispatchToProps)(VisBlock);