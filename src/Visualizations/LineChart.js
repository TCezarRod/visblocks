import React from 'react';
import PropTypes from 'prop-types'

import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictorySelectionContainer,
  VictoryAxis,
  VictoryLabel,
  Line
} from 'victory'

class LineChart extends React.Component {
  static propTypes = {
    xDimension: PropTypes.string,
    yDimension: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    data: []
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    if (newProps.data && newProps.data !== prevState.data) {
      let xDimension = newProps.xDimension
      let yDimension = newProps.yDimension
      if (!xDimension) {
        xDimension = Object.keys(newProps.data[0])[0]
      }
      if (!yDimension) {
        yDimension = Object.keys(newProps.data[0])[1]
      }
      return {...prevState, xDimension: xDimension, yDimension: yDimension}
    } else {
      return {...prevState}
    }
  }

  getDomain = () => {
    let minX = Math.min.apply(Math, this.props.data.map((obj) => obj[this.state.xDimension]))
    let maxX = Math.max.apply(Math, this.props.data.map((obj) => obj[this.state.xDimension]))

    let minY = Math.min.apply(Math, this.props.data.map((obj) => obj[this.state.yDimension]))
    let maxY = Math.max.apply(Math, this.props.data.map((obj) => obj[this.state.yDimension]))

    return {x:[minX, maxX], y:[minY, maxY]}
  }

  render() {

    if (this.props.data) {
      return (
        <VictoryChart 
          theme={VictoryTheme.material}
          domain={this.getDomain()}
          width={this.props.width}
          height={this.props.height}
          containerComponent={<VictorySelectionContainer />}
          domainPadding={5}>
          <VictoryLine
            
            style={{ data: { stroke: (d, active) => active ? "rgb(139,195,74)" : "gray" } }}
            x={this.state.xDimension}
            y={this.state.yDimension}
            data={this.props.data}          
          />
          <VictoryAxis 
            label={this.state.xDimension} 
            gridComponent={<Line style={{display: 'none'}}/>}
            axisLabelComponent={<VictoryLabel dy={15} style={this.labelStyle}/>}/>
          <VictoryAxis dependentAxis 
            label={this.state.yDimension} 
            axisLabelComponent={<VictoryLabel dy={-10} angle="90" style={this.labelStyle}/>} 
            gridComponent={<Line style={{display: 'none'}}/>} />
        </VictoryChart>
      );
    } else {
      return <div className="content-text"><span>No Data</span></div>
    }
  }
}



export default LineChart;
