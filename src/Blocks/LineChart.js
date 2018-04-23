import React from 'react';
import PropTypes from 'prop-types'

import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictorySelectionContainer
} from 'victory'

import Rnd from 'react-rnd';

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
    data: []
  }

  getDomain = () => {
    let minX = Math.min.apply(Math, this.props.data.map((obj) => obj[this.props.xDimension]))
    let maxX = Math.max.apply(Math, this.props.data.map((obj) => obj[this.props.xDimension]))

    let minY = Math.min.apply(Math, this.props.data.map((obj) => obj[this.props.yDimension]))
    let maxY = Math.max.apply(Math, this.props.data.map((obj) => obj[this.props.yDimension]))

    return {x:[minX, maxX], y:[minY, maxY]}
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



export default LineChart;
