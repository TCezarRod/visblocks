import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock, deleteBlock, startConnect, finishConnect, selectBlock } from 'actions'

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import Rnd from 'react-rnd';

import { CSVLink } from 'react-csv';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit / 2
  },
  input: {
    display: 'none'
  }
});


const mapDispatchToProps = dispatch => {
  return {
    moveBlock: (id, props) => dispatch(moveBlock(id, props)),
    deleteBlock: (id) => dispatch(deleteBlock(id)),
    startConnect: (id) => dispatch(startConnect(id)),
    finishConnect: () => dispatch(finishConnect()),
    selectBlock: (id) => dispatch(selectBlock(id))
  };
};

const mapStateToProps = state => {
  return {
    isConnecting: state.controlState.connecting, 
    connectionSource: state.controlState.sourceId, 
    selectedId: state.controlState.selected,
    options: state.controlState.options 
  };
};

class VisBlock extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    headerVisible: PropTypes.bool
  }

  static defaultProps = {
    minWidth: 150,
    minHeight: 150,
    headerVisible: true
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

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  handleClick = (e) => {
    if (this.node && this.node.contains(e.target) && !this.props.isConnecting) {
      this.props.selectBlock(this.props.id)
    }

    if ((this.node && !(this.node.contains(e.target))) && (this.props.controlRef && !this.props.controlRef.contains(e.target))) {
      this.handleClickOutside()
    }
  }

  handleClickOutside = () =>{
    if (this.props.selectedId === this.props.id) {
      this.props.selectBlock(-1)
    }
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
      React.cloneElement(child, {data:child.props.data, blockid: this.props.id, width: this.state.size.width, height: this.state.size.height }));
  }

  handleBlockClick = (event) => {
    if (!this.props.isConnecting) {
      this.props.selectBlock(this.props.id)
    }

    if (this.props.isConnecting && this.props.id !== this.props.connectionSource) {
      this.props.onUpdate(this.props.id, this.props.connectionSource)
      this.props.finishConnect()
    }
  }

  handleConnectClick = () => {
    this.props.startConnect(this.props.id);
  }

  handleContextMenu = (event) => {
    event.preventDefault();
    // TODO: create context menu
  }

  handleClose = () => {
    this.props.deleteBlock(this.props.id);
  }

  getClassNames = () => {
    let className = `container-block ${this.props.selectedId === this.props.id ? 'container-selected' : ''}`
    return className
  }

  csvLink = (data, name) => props => {
   return <CSVLink filename={name + "_data.csv"} data={data} {...props}/>
  }

  renderDownloadButton = (classes, data) => {
    let options = this.props.options[this.props.id];
    if (data && options) {
      return (
        <ButtonBase className={classes.button} aria-label="Download" component={this.csvLink(data, options.name.selected || options.name.default)}>
          <SaveIcon style={{ fontSize: 15 }}/>
        </ButtonBase>)
    }
  }

  renderHandle = () => {
    const { classes } = this.props;
    const blockOptions = this.props.options[this.props.id]
    const blockName = (blockOptions && blockOptions.name) 
      ? (blockOptions.name.selected !== undefined ? blockOptions.name.selected : blockOptions.name.default) 
      : `Block ${this.props.id}`

    return (
    <div className="handle" >
    <ButtonBase className={classes.button} aria-label="Close" onClick={this.handleClose}>
      <CloseIcon style={{ fontSize: 15 }}/>
    </ButtonBase>
    <ButtonBase className={classes.button} aria-label="Arrow" onClick={this.handleConnectClick}>
      <ArrowForwardIcon style={{ fontSize: 15 }}/>
    </ButtonBase>
    {this.renderDownloadButton(classes, this.props.children.props.data)}
    <div className="blockTitle">
      <Typography variant="subheading" noWrap color="inherit">
        {this.props.headerVisible ? blockName : ''}
      </Typography>
    </div>
    </div>)
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
      style={{zIndex:'1'}}
      className={this.getClassNames()}
    >
      {/*<div className="port port-input"></div>*/}
      <div className={this.getClassNames()} onClick={this.handleBlockClick} onContextMenu={this.handleContextMenu} ref={node => this.node = node}>
        {this.renderHandle()}
        <div className="block-content">
          {this.props.children ? this.renderChildrenWithProps() : this.renderNoData()}
        </div>
      </div>
    </Rnd>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(VisBlock));