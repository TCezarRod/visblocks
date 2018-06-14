import React from 'react';
import PropTypes from 'prop-types'

import {
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictorySelectionContainer,
  VictoryLabel,
  VictoryAxis,
  Line
} from 'victory'

class Histogram extends React.Component {
  static propTypes = {
    dimension: PropTypes.string,
    bins: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
  }

  static defaultProps = {
    bins: 5
  }

  state = {
    data: [],
    dimension: this.props.dimension
  }

  getDomain = () => {
    let minX = Math.min.apply(Math, this.state.data.map((obj) => obj[this.state.dimension]))
    let maxX = Math.max.apply(Math, this.state.data.map((obj) => obj[this.state.dimension]))
    let truMaxX = maxX + (maxX-minX)/this.props.bins

    let maxY = Math.max.apply(Math, this.state.data.map((obj) => obj.frequency))

    return {x:[minX, truMaxX], y:[0, maxY]}
  }

  makeDataBins = (props) => {
    let binData = [];
    let bins = props.bins;
    let minX = Math.min.apply(Math, props.data.map((obj) => obj[props.dimension]))
    let maxX = Math.max.apply(Math, props.data.map((obj) => obj[props.dimension]))

    let interval = (maxX - minX) / bins

    let last;
    for (let i = minX; i < maxX; i += interval) {
      binData.push({
        [props.dimension]: i,
        frequency: props.data.filter((data) => data[props.dimension]>=i && data[props.dimension]<(i+interval)).length
      })
      last=i;
    }
    if (last + interval === maxX) {
      binData.find((bin)=>bin[props.dimension]===last).frequency += props.data.filter((data) => data[props.dimension]===maxX).length
    }

    return binData
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    if (newProps.data && newProps.data !== prevState.data) {
      let dimension = newProps.dimension
      if (!dimension) {
        dimension = Object.keys(newProps.data[0])[0]
      }

      let binData = [];
      let bins = newProps.bins;
      let minX = Math.min.apply(Math, newProps.data.map((obj) => obj[dimension]))
      let maxX = Math.max.apply(Math, newProps.data.map((obj) => obj[dimension]))

      let interval = (maxX - minX) / bins

      let last;
      for (let i = minX; i < maxX; i += interval) {
        binData.push({
          [dimension]: i,
          frequency: newProps.data.filter((data) => data[dimension]>=i && data[dimension]<(i+interval)).length
        })
        last=i;
      }
      if (last + interval === maxX) {
        binData.find((bin)=>bin[dimension]===last).frequency += newProps.data.filter((data) => data[dimension]===maxX).length
      }
      return {...prevState, data: binData, dimension: dimension}
    } else {
      return {...prevState}
    }
  }

  renderContent = () => {
    const { width, height } = this.props
    if (this.props.data) {
      return (<VictoryChart 
        theme={VictoryTheme.material}
        domain={this.getDomain()}
        width={width}
        height={height}
        containerComponent={<VictorySelectionContainer />}
        domainPadding={5}>
            {/*<VictoryLabel text="Frequency" y={35} x={-5} style={{fontSize: 12, fill: 'rgb(69, 90, 100)'}}/>*/}
            <VictoryLabel text={this.state.dimension} dy={50} dx={width-100} style={{fontSize: 12, fill: 'rgb(69, 90, 100)', fontWeight:'bold'}}/>
            <VictoryBar 
              barRatio={1.1}
              alignment="start"
              x={this.state.dimension}
              y={'frequency'}
              data={this.state.data}/>
            <VictoryAxis  
              gridComponent={<Line style={{display: 'none'}}/>}/>
            <VictoryAxis dependentAxis 
              axisLabelComponent={<VictoryLabel dy={20}/>} 
              gridComponent={<Line style={{display: 'none'}}/>} />
      </VictoryChart>)
    } else {
      return <div className="content-text"><span>No Data</span></div>
    }
  }

  render() {
    return (      
      this.renderContent()        
    );
  }
}

export default Histogram;
