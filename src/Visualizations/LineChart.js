import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues } from 'actions'

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
    updateAttrValues: (id, attribute, values) => dispatch(updateAttrValues(id, attribute, values))
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
      name: {
        type: 'string',
        default: 'Line Chart'
      },
      domain: {
        type: 'selection',
        values: [],
        default: 0
      },
      range: {
        type: 'selection',
        values: [],
        default: 1
      },
      color: {
        type: 'color',
        default: 'rgb(100, 0, 40)'
      }
    })
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    if (newProps.data && newProps.data !== prevState.data) {
      let domainValues = []
      let rangeValues = []
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (!isNaN(element[key])) {
            if (!domainValues.includes(key) && element[key]) {
              domainValues.push(key)
            }
            if (!rangeValues.includes(key) && element[key]) {
              rangeValues.push(key)
            }
          }
        })
      })
      newProps.updateAttrValues(newProps.blockid, 'domain', domainValues)
      newProps.updateAttrValues(newProps.blockid, 'range', rangeValues)

      return {...prevState, data: newProps.data}      
    } else {
      return {...prevState}
    }
  }

  getDomainRange = () => {
    const options = this.props.options[this.props.blockid]
    const domainIndex = options.domain.selected || options.domain.default
    const domain = options.domain.values[domainIndex]
    let minX = Math.min.apply(Math, this.state.data.map((obj) => Number(obj[domain])).filter(n => !isNaN(n)))
    let maxX = Math.max.apply(Math, this.state.data.map((obj) => Number(obj[domain])).filter(n => !isNaN(n)))

    const rangeIndex = options.range.selected || options.range.default
    const range = options.range.values[rangeIndex]
    let minY = Math.min.apply(Math, this.state.data.map((obj) => Number(obj[range])).filter(n => !isNaN(n)))
    let maxY = Math.max.apply(Math, this.state.data.map((obj) => Number(obj[range])).filter(n => !isNaN(n)))

    return {x:[minX, maxX], y:[minY, maxY]}
  }

  render() {
    const options = this.props.options[this.props.blockid]
    if (this.props.data) {
      const domainIndex = options.domain.selected || options.domain.default
      const rangeIndex = options.range.selected || options.range.default
      return (
        <VictoryChart 
          theme={VictoryTheme.material}
          domain={this.getDomainRange()}
          width={this.props.width}
          height={this.props.height}
          containerComponent={<VictorySelectionContainer />}
          domainPadding={5}>
          <VictoryLine
            
            style={{ data: { stroke: (d, active) => active ? "rgb(139,195,74)" : (options.color.selected || options.color.default) } }}
            x={options.domain.values[domainIndex]}
            y={options.range.values[rangeIndex]}
            data={this.state.data.map(datum => {
              let normalizedDatum = Object.assign({}, datum)
              const xAttr = options.domain.values[domainIndex]
              const yAttr = options.domain.values[rangeIndex]
              normalizedDatum[xAttr] = Number(datum[xAttr])
              normalizedDatum[yAttr] = Number(datum[yAttr])
              return normalizedDatum
            })}      
          />
          <VictoryAxis 
            label={options.domain.values[domainIndex]} 
            gridComponent={<Line style={{display: 'none'}}/>}
            axisLabelComponent={<VictoryLabel dy={15} style={this.labelStyle}/>}/>
          <VictoryAxis dependentAxis 
            label={options.range.values[rangeIndex]} 
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