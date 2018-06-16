import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues, updateAttrSelection } from 'actions'

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
    updateAttrValues: (id, attribute, values) => dispatch(updateAttrValues(id, attribute, values)),
    updateAttrSelection: (id, attribute, value) => dispatch(updateAttrSelection(id, attribute, value))
  };
};

const mapStateToProps = state => {
  return { options: state.controlState.options };
};


class Histogram extends React.Component {
  static propTypes = {
    blockid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    binData: []
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      dimension: {
        type: 'selection',
        values: []
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
    let minX = Math.min.apply(Math, this.state.binData.map((obj) => obj[this.props.options[this.props.blockid].dimension.selected]))
    let maxX = Math.max.apply(Math, this.state.binData.map((obj) => obj[this.props.options[this.props.blockid].dimension.selected]))
    let truMaxX = maxX + (maxX-minX)/this.props.options[this.props.blockid].bins.selected

    let maxY = Math.max.apply(Math, this.state.binData.map((obj) => obj.frequency))

    return {x:[minX, truMaxX], y:[0, maxY]}
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    let options = newProps.options[newProps.blockid]

    if (newProps.data && newProps.data !== prevState.data) {
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (!options.dimension.values.includes(key)) {
            options.dimension.values.push(key)
          }
        })
      })
      newProps.updateAttrValues(newProps.blockid, 'dimension', options.dimension.values)
      if (!options.dimension.selected || !options.dimension.values.includes(options.dimension.selected)) {
        options.dimension.selected = options.dimension.values[1]
      }
      if (!options.bins.selected) {
        options.bins.selected = options.bins.default
      }
      if (!options.color.selected) {
        options.color.selected = options.color.default
      }

      let selectedDimension = options.dimension.selected || prevState.options.dimension.selected

      let binData = [];
      let bins = options.bins.selected;
      let minX = Math.min.apply(Math, newProps.data.map((obj) => obj[selectedDimension]))
      let maxX = Math.max.apply(Math, newProps.data.map((obj) => obj[selectedDimension]))

      let interval = (maxX - minX) / bins

      let last;
      for (let i = minX; i < maxX; i += interval) {
        binData.push({
          [selectedDimension]: i,
          frequency: newProps.data.filter((data) => data[selectedDimension]>=i && data[selectedDimension]<(i+interval)).length
        })
        last=i;
      }
      if (last + interval === maxX) {
        binData.find((bin)=>bin[selectedDimension]===last).frequency += newProps.data.filter((data) => data[selectedDimension]===maxX).length
      }
      newProps.updateAttrSelection(newProps.blockid, 'dimension', options.dimension.selected)
      newProps.updateAttrSelection(newProps.blockid, 'color', options.color.selected)
      newProps.updateAttrSelection(newProps.blockid, 'bins', options.bins.selected)
      return {...prevState, binData: binData, data: newProps.data}
    } else {
      return {...prevState}
    }
  }

  renderContent = () => {
    const { width, height } = this.props
    const options = this.props.options[this.props.blockid]
    if (this.props.data) {
      return (<VictoryChart 
        theme={VictoryTheme.material}
        domain={this.getDomain()}
        width={width}
        height={height}
        containerComponent={<VictorySelectionContainer />}
        domainPadding={5}>
            {/*<VictoryLabel text="Frequency" y={35} x={-5} style={{fontSize: 12, fill: 'rgb(69, 90, 100)'}}/>*/}
            <VictoryLabel text={options.dimension.selected} dy={50} dx={width-100} style={{fontSize: 12, fill: 'rgb(69, 90, 100)', fontWeight:'bold'}}/>
            <VictoryBar 
              barRatio={1.1}
              alignment="start"
              x={options.dimension.selected}
              y={'frequency'}
              data={this.state.binData}
              style={{data: {fill: options.color.selected}}}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Histogram);
