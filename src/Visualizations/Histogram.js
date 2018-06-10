import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock } from 'actions'

import {
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictorySelectionContainer
} from 'victory'

const mapDispatchToProps = dispatch => {
  return {
    moveBlock: (id, props) => dispatch(moveBlock(id, props))
  };
};

class Histogram extends React.Component {
  static propTypes = {
    dimension: PropTypes.string,
    bins: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    width: PropTypes.number,
    height: PropTypes.number
  }

  static defaultProps = {
    bins: 5
  }

  state = {
    data: []
  }

  getDomain = () => {
    let minX = Math.min.apply(Math, this.state.data.map((obj) => obj[this.props.dimension]))
    let maxX = Math.max.apply(Math, this.state.data.map((obj) => obj[this.props.dimension]))
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
    if (newProps.data && newProps != prevState.data) {
      let binData = [];
      let bins = newProps.bins;
      let minX = Math.min.apply(Math, newProps.data.map((obj) => obj[newProps.dimension]))
      let maxX = Math.max.apply(Math, newProps.data.map((obj) => obj[newProps.dimension]))

      let interval = (maxX - minX) / bins

      let last;
      for (let i = minX; i < maxX; i += interval) {
        binData.push({
          [newProps.dimension]: i,
          frequency: newProps.data.filter((data) => data[newProps.dimension]>=i && data[newProps.dimension]<(i+interval)).length
        })
        last=i;
      }
      if (last + interval === maxX) {
        binData.find((bin)=>bin[newProps.dimension]===last).frequency += newProps.data.filter((data) => data[newProps.dimension]===maxX).length
      }
      return {...prevState, data: binData
      }
    } else {
      return {...prevState, data:undefined}
    }
  }

  renderContent = () => {
    if (this.props.data) {
      return (<VictoryChart 
        theme={VictoryTheme.material}
        domain={this.getDomain()}
        width={this.props.width}
        height={this.props.height}
        containerComp1onent={<VictorySelectionContainer />}
        domainPadding={5}>
          <VictoryBar 
            barRatio={1.1}
            alignment="start"
            x={this.props.dimension}
            y={'frequency'}
            data={this.state.data}/>
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

export default connect(null, mapDispatchToProps)(Histogram);
