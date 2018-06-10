import React from 'react';
import PropTypes from 'prop-types'

import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictorySelectionContainer
} from 'victory'

class LineChart extends React.Component {
  static propTypes = {
    xDimension: PropTypes.string,
    yDimension: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
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

  render() {
    return (
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
    );
  }
}



export default LineChart;
