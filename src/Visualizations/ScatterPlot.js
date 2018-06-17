import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues } from 'actions'

import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
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

class ScatterPlot extends React.Component {
  static propTypes = {
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
        default: 'Scatter Plot'
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
        default: 'rgba(100, 0, 40, 0.7)'
      },
      'selection color': {
        type: 'color',
        default: 'rgba(100, 200, 0, 0.7)'
      },
      size: {
        type: 'number',
        default: 6
      }
    })
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    if (newProps.data && newProps.data !== prevState.data) {
      let domainValues = []
      let rangeValues = []
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (!domainValues.includes(key)) {
            domainValues.push(key)
          }
          if (!rangeValues.includes(key)) {
            rangeValues.push(key)
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

  getDomain = () => {
    const options = this.props.options[this.props.blockid]
    const domainIndex = options.domain.selected || options.domain.default
    const domain = options.domain.values[domainIndex]
    let minX = Math.min.apply(Math, this.state.data.map((obj) => obj[domain]))
    let maxX = Math.max.apply(Math, this.state.data.map((obj) => obj[domain]))

    const rangeIndex = options.range.selected || options.range.default
    const range = options.range.values[rangeIndex]
    let minY = Math.min.apply(Math, this.state.data.map((obj) => obj[range]))
    let maxY = Math.max.apply(Math, this.state.data.map((obj) => obj[range]))

    return {x:[minX, maxX], y:[minY, maxY]}
  }

  updateOutput = (points, bounds, props) => {
    points[0].data.forEach((data) => {
      delete data._x; 
      delete data._y;
      delete data.eventKey;
      delete data.x;
      delete data.y;
    })
    this.props.onSelection(this.props.id, {type: 'selection', data: points[0].data})
  }

  resetOutput = () => {
    this.props.onSelection(this.props.id, {type: 'selection', data: []})
  }

  labelStyle = {
    fill: 'rgb(69, 90, 100)',
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, sans-serif',
    fontSize: '12px',
    stroke: 'transparent', 
    strokeWidth: '0',
    textAnchor: 'middle'
  }

  render() {
    const options = this.props.options[this.props.blockid]
    const fillStyle = (data, active) => active 
      ? (options['selection color'].selected || options['selection color'].default) 
      : (options.color.selected || options.color.default)
    if (this.props.data) {
      const domainIndex = options.domain.selected || options.domain.default
      const rangeIndex = options.range.selected || options.range.default
      return (
        <VictoryChart 
          theme={VictoryTheme.material}
          domain={this.getDomain()}
          width={this.props.width}
          height={this.props.height}
          containerComponent={
            <VictorySelectionContainer 
            onSelection={this.updateOutput} 
            onSelectionCleared={this.resetOutput}
            />}
          domainPadding={15}>
          <VictoryScatter
            padding={150}
            style={{ data: { fill: fillStyle, strokeDasharray: "5,5" } }}
            size={parseInt((options.size.selected || options.size.default), 10)}
            x={options.domain.values[domainIndex]}
            y={options.range.values[rangeIndex]}
            data={this.state.data}
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

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlot);
