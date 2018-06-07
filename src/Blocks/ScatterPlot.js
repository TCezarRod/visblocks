import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock } from 'actions'

import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictorySelectionContainer
} from 'victory'

import Rnd from 'react-rnd';

const mapDispatchToProps = dispatch => {
  return {
    moveBlock: (id, props) => dispatch(moveBlock(id, props))
  };
};

class ScatterPlot extends React.Component {
  static propTypes = {
    xDimension: PropTypes.string,
    yDimension: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    prevSize: {
      width: this.props.width,
      height: this.props.height
    },
    data: []
  }

  getDomain = () => {
    let minX = Math.min.apply(Math, this.props.data.map((obj) => obj[this.props.xDimension]))
    let maxX = Math.max.apply(Math, this.props.data.map((obj) => obj[this.props.xDimension]))

    let minY = Math.min.apply(Math, this.props.data.map((obj) => obj[this.props.yDimension]))
    let maxY = Math.max.apply(Math, this.props.data.map((obj) => obj[this.props.yDimension]))

    return {x:[minX, maxX], y:[minY, maxY]}
  }

  updateSize = (e, dir, ref, delta, position) => {
    /*this.props.moveArrowStart({
      x:position.x + this.state.prevSize.width + delta.width,
      y:position.y + (this.state.prevSize.height + delta.height)/2})*/
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
    /*this.props.moveArrowStart({
      x:position.x + this.state.size.width,
      y:position.y + (this.state.size.height)/2})*/
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

  updateOutput = (points, bounds, props) => {
    points[0].data.forEach((data) => {delete data._x; delete data._y})
    this.props.onSelection(this.props.id, points[0].data)
  }

  resetOutput = () => {
    this.props.onSelection(this.props.id, this.props.data)
  }

  render() {
    return (
      <React.Fragment>
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
          <div className="container-block" >
            <div className="handle">✜</div>
            <VictoryChart 
              theme={VictoryTheme.material}
              domain={this.getDomain()}
              width={this.state.size.width}
              height={this.state.size.height}
              containerComponent={<VictorySelectionContainer onSelection={this.updateOutput} onSelectionCleared={this.resetOutput} selectionBlackList={["eventKey", "x", "y", "sepalLength"]}/>}
              domainPadding={5}>
              <VictoryScatter
                style={{ data: { fill: (d, active) => active ? "rgb(139,195,74)" : "gray" } }}
                size={6}
                x={this.props.xDimension}
                y={this.props.yDimension}
                data={this.props.data}
                animate={{ duration: 1000,  onLoad: { duration: 200 }}}
              />
            </VictoryChart>
          </div>
        </Rnd>
      </React.Fragment>
    );
  }
}

export default connect(null, mapDispatchToProps)(ScatterPlot);
