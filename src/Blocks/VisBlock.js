import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock, deleteBlock, startConnect, finishConnect } from 'actions'
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';

import Rnd from 'react-rnd';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit / 2,
  },
  input: {
    display: 'none',
  },
});


const mapDispatchToProps = dispatch => {
  return {
    moveBlock: (id, props) => dispatch(moveBlock(id, props)),
    deleteBlock: (id) => dispatch(deleteBlock(id)),
    startConnect: (id) => dispatch(startConnect(id)),
    finishConnect: () => dispatch(finishConnect())
  };
};

const mapStateToProps = state => {
  return {isConnecting: state.controlState.connecting, connectionSource: state.controlState.sourceId};
};

class VisBlock extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

  handleBlockClick = () => {
    console.log(`click on ${this.props.id}`);
    if (this.props.isConnecting && this.props.id !== this.props.connectionSource) {
      this.props.onUpdate(this.props.id, this.props.connectionSource)
      this.props.finishConnect()
    }
  }

  handleConnectClick = () => {
    console.log(`connect from ${this.props.id}`);
    this.props.startConnect(this.props.id);
  }

  handleContextMenu = (event) => {
    event.preventDefault();
    // TODO: create context menu
  }

  handleClose = () => {
    this.props.deleteBlock(this.props.id);
  }
  
  render() {
    const { position, size } = this.state;
    const { minWidth, minHeight, classes} = this.props;
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
      style={{zIndex:'1'}}
    >
      {/*<div className="port port-input"></div>*/}
      <div className="container-block" onClick={this.handleBlockClick} onContextMenu={this.handleContextMenu}>
        <div className="handle" >
        <ButtonBase className={classes.button} aria-label="Close" onClick={this.handleClose}>
          <CloseIcon style={{ fontSize: 15 }}/>
        </ButtonBase>
        <ButtonBase className={classes.button} aria-label="Arrow" onClick={this.handleConnectClick}>
          <ArrowForwardIcon style={{ fontSize: 15 }}/>
        </ButtonBase>
        </div>
        <div className="block-content">
          {this.props.children ? this.renderChildrenWithProps() : this.renderNoData()}
        </div>
      </div>
    </Rnd>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(VisBlock));