import React  from 'react';
import PropTypes from 'prop-types'

import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictorySelectionContainer
} from 'victory'

class ScatterPlot extends React.Component {
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

  updateOutput = (points, bounds, props) => {
    points[0].data.forEach((data) => {delete data._x; delete data._y})
    this.props.onSelection(this.props.id, points[0].data)
  }

  resetOutput = () => {
    this.props.onSelection(this.props.id, this.props.data)
  }

  render() {
    return (
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
    );
  }
}

export default ScatterPlot;
