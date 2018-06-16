import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues, updateAttrSelection } from 'actions'

import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictorySelectionContainer,
  VictoryAxis,
  VictoryLabel,
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

class LineChart extends React.Component {
  static propTypes = {
    blockid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    data: []
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      domain: {
        type: 'selection',
        values: []
      },
      range: {
        type: 'selection',
        values: []
      },
      color: {
        type: 'color',
        default: 'rgb(100, 0, 40)'
      }
    })
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    let options = newProps.options[newProps.blockid]

    if (newProps.data && newProps.data !== prevState.data) {
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (!options.domain.values.includes(key)) {
            options.domain.values.push(key)
          }
          if (!options.range.values.includes(key)) {
            options.range.values.push(key)
          }
        })
      })
      newProps.updateAttrValues(newProps.blockid, 'domain', options.domain.values)
      newProps.updateAttrValues(newProps.blockid, 'range', options.range.values)
      if (!options.domain.selected || !options.domain.values.includes(options.domain.selected)) {
        options.domain.selected = options.domain.values[0]
      }
      if (!options.range.selected || !options.range.values.includes(options.range.selected)) {
        options.range.selected = options.range.values[1]
      }
      if (!options.color.selected) {
        options.color.selected = options.color.default
      }

      newProps.updateAttrSelection(newProps.blockid, 'domain', options.domain.selected)
      newProps.updateAttrSelection(newProps.blockid, 'range', options.range.selected)
      newProps.updateAttrSelection(newProps.blockid, 'color', options.color.selected)

      return {...prevState, data: newProps.data}      
    } else {
      return {...prevState}
    }
  }

  getDomainRange = () => {
    let minX = Math.min.apply(Math, this.state.data.map((obj) => obj[this.props.options[this.props.blockid].domain.selected]))
    let maxX = Math.max.apply(Math, this.state.data.map((obj) => obj[this.props.options[this.props.blockid].domain.selected]))

    let minY = Math.min.apply(Math, this.state.data.map((obj) => obj[this.props.options[this.props.blockid].range.selected]))
    let maxY = Math.max.apply(Math, this.state.data.map((obj) => obj[this.props.options[this.props.blockid].range.selected]))

    return {x:[minX, maxX], y:[minY, maxY]}
  }

  render() {
    const options = this.props.options[this.props.blockid]
    if (this.props.data) {
      return (
        <VictoryChart 
          theme={VictoryTheme.material}
          domain={this.getDomainRange()}
          width={this.props.width}
          height={this.props.height}
          containerComponent={<VictorySelectionContainer />}
          domainPadding={5}>
          <VictoryLine
            
            style={{ data: { stroke: /*(d, active) => active ? "rgb(139,195,74)" :*/ options.color.selected } }}
            x={options.domain.selected}
            y={options.range.selected}
            data={this.props.data}       
          />
          <VictoryAxis 
            label={options.domain.selected} 
            gridComponent={<Line style={{display: 'none'}}/>}
            axisLabelComponent={<VictoryLabel dy={15} style={this.labelStyle}/>}/>
          <VictoryAxis dependentAxis 
            label={options.range.selected} 
            axisLabelComponent={<VictoryLabel dy={-10} angle="90" style={this.labelStyle}/>} 
            gridComponent={<Line style={{display: 'none'}}/>} />
        </VictoryChart>
      );
    } else {
      return <div className="content-text"><span>No Data</span></div>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineChart);