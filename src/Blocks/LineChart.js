import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock } from 'actions'

import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictorySelectionContainer
} from 'victory'

import Rnd from 'react-rnd';

const mapDispatchToProps = dispatch => {
  return {
    moveBlock: (id, props) => dispatch(moveBlock(id, props))
  };
};

class LineChart extends React.Component {
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
        <div className="container-block" >
          <div className="handle">✜</div>
      <VictoryChart 
        theme={VictoryTheme.material}
        domain={this.getDomain()}
        width={this.state.size.width}
        height={this.state.size.height}
        containerComponent={<VictorySelectionContainer />}
        domainPadding={5}>
        <VictoryLine
          
          style={{ data: { stroke: (d, active) => active ? "rgb(139,195,74)" : "gray" } }}
          x={this.props.xDimension}
          y={this.props.yDimension}
          data={this.props.data}
          
        />
      </VictoryChart>
      </div>
      </Rnd>
    );
  }
}



export default connect(null, mapDispatchToProps)(LineChart);
