import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues } from 'actions'

import {
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictorySelectionContainer,
  VictoryLabel,
  VictoryAxis,
  Line
} from 'victory'

const mapDispatchToProps = dispatch => {
  return {
    initOptions: (id, attributes) => dispatch(initOptions(id, attributes)),
    updateAttrValues: (id, attribute, values) => dispatch(updateAttrValues(id, attribute, values))
  };
};

const mapStateToProps = state => {
  return { options: state.controlState.options };
};

const getBinData = (data, options) => {
  let binData = [];
  const dimensionIndex = options.dimension.selected || options.dimension.default
  const selectedDimension = options.dimension.values[dimensionIndex]

  let bins = options.bins.selected || options.bins.default;

  let minX = Math.min.apply(Math, data.map((obj) => Number(obj[selectedDimension])).filter(n => !isNaN(n)))
  let maxX = Math.max.apply(Math, data.map((obj) => Number(obj[selectedDimension])).filter(n => !isNaN(n)))
  let interval = (maxX - minX) / bins

  let last;
  for (let i = minX; i < maxX; i += interval) {
    binData.push({
      [selectedDimension]: i,
      frequency: data.filter((data) => data[selectedDimension]>=i && data[selectedDimension]<(i+interval)).length
    })
    last=i;
  }
  if (last + interval === maxX) {
    binData.find((bin)=>bin[selectedDimension]===last).frequency += data.filter((data) => data[selectedDimension]===maxX).length
  } 
   /*else {
    let ticks = []
    let count = {}
    Object.values(data).forEach(obj => {
      if (!ticks.includes(obj[selectedDimension])) {
        ticks.push(obj[selectedDimension])
        count[obj[selectedDimension]] = 1
      } else {
        count[obj[selectedDimension]] += 1
      }
    })

    binData = Object.keys(count).map(key => {})
  }*/

  return binData
}

class Histogram extends React.Component {
  static propTypes = {
    blockid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    data: [],
    binData: []
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      name: {
        type: 'string',
        default: 'Histogram'
      },
      dimension: {
        type: 'selection',
        values: [],
        default: 0
      },
      bins: {
        type: 'number',
        default: 5
      },
      color: {
        type: 'color',
        default: 'rgb(100, 0, 40)'
      }
    })
  }

  getDomain = () => {
    const options = this.props.options[this.props.blockid]
    const dimensionIndex = options.dimension.selected || options.dimension.default
    const dimension = options.dimension.values[dimensionIndex]
    const bins = options.bins.selected || options.bins.default
    let minX = Math.min.apply(Math, this.state.binData.map((obj) => obj[dimension]))
    let maxX = Math.max.apply(Math, this.state.binData.map((obj) => obj[dimension]))
    let truMaxX = maxX + (maxX-minX)/bins

    let maxY = Math.max.apply(Math, this.state.binData.map((obj) => obj.frequency))

    return {x:[minX, truMaxX], y:[0, maxY]}
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    const options = newProps.options[newProps.blockid]

    if (newProps.data) {
      if (newProps.data !== prevState.data) {
        let dimensionValues = []
        Object.values(newProps.data).forEach(element => {
          Object.keys(element).forEach(key => {
            if (!dimensionValues.includes(key) && !isNaN(element[key])) {
              dimensionValues.push(key)
            }
          })
        })
        newProps.updateAttrValues(newProps.blockid, 'dimension', dimensionValues)

        let binData = getBinData(newProps.data, options)

        return {...prevState, binData: binData, data: newProps.data}
      } else if (options && (options.bins.selected || options.dimension.selected)) {
        let binData = getBinData(newProps.data, options)
        return {...prevState, binData: binData, data: newProps.data}
      } else {
        return {...prevState}
      }       
    } else {
      return {...prevState}
    }
  }

  renderContent = () => {
    const { width, height } = this.props
    const options = this.props.options[this.props.blockid]
    if (this.props.data) {
      const dimensionIndex = options.dimension.selected || options.dimension.default
      return (<VictoryChart 
        theme={VictoryTheme.material}
        domain={this.getDomain()}
        width={width}
        height={height}
        containerComponent={<VictorySelectionContainer selectionDimension="x"/>}
        domainPadding={5}>
            <VictoryLabel text={options.dimension.values[dimensionIndex]} dy={50} dx={width-100} style={{fontSize: 12, fill: 'rgb(69, 90, 100)', fontWeight:'bold'}}/>
            <VictoryBar 
              barRatio={1.1}
              alignment="start"
              x={options.dimension.values[dimensionIndex]}
              y={'frequency'}
              data={this.state.binData}
              style={{data: {fill: options.color.selected || options.color.default}}}/>
            <VictoryAxis  
              gridComponent={<Line style={{display: 'none'}}/>}
              />
            <VictoryAxis dependentAxis 
              axisLabelComponent={<VictoryLabel dy={20}/>} 
              gridComponent={<Line style={{display: 'none'}}/>} 
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(Histogram);
