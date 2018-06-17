import React  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues, updateAttrSelection } from 'actions'

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
    updateAttrValues: (id, attribute, values) => dispatch(updateAttrValues(id, attribute, values)),
    updateAttrSelection: (id, attribute, value) => dispatch(updateAttrSelection(id, attribute, value))
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
        values: []
      },
      range: {
        type: 'selection',
        values: []
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
      if (!options['selection color'].selected) {
        options['selection color'].selected = options['selection color'].default
      }
      if (!options.size.selected) {
        options.size.selected = options.size.default
      }

      return {...prevState, data: newProps.data, color: options.color.selected, selColor: options['selection color'].selected}
    } else {
      return {...prevState}
    }
  }

  getDomain = () => {
    let minX = Math.min.apply(Math, this.props.data.map((obj) => obj[this.props.options[this.props.blockid].domain.selected]))
    let maxX = Math.max.apply(Math, this.props.data.map((obj) => obj[this.props.options[this.props.blockid].domain.selected]))

    let minY = Math.min.apply(Math, this.props.data.map((obj) => obj[this.props.options[this.props.blockid].range.selected]))
    let maxY = Math.max.apply(Math, this.props.data.map((obj) => obj[this.props.options[this.props.blockid].range.selected]))

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
    const fillStyle = (data, active) => active ? options['selection color'].selected : options.color.selected
    if (this.props.data) {
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
            size={options.size.selected}
            x={options.domain.selected}
            y={options.range.selected}
            data={this.state.data}
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

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlot);
