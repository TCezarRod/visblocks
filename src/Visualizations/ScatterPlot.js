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

const countUnique = (iterable) => {
  return new Set(iterable).size
}

class ScatterPlot extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number,
    onSelection: PropTypes.func
  }

  finishMutation = () => {
    this.props.onSelection(this.props.blockid, {type: 'selection', data: this.props.data})
    this.setState({externalMutations: undefined})
  }

  state = {
    data: [],
    groupBy: 0,
    range: undefined,
    domain: undefined,
    externalMutations: undefined,
    finishMutation: this.finishMutation
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
      size: {
        type: 'number',
        default: 6
      },
      'use default color': {
        type: 'toggle',
        default: true,
        hidden: false 
      },
      color: {
        type: 'color',
        default: 'rgba(100, 0, 40, 0.7)'
      },
      'selection color': {
        type: 'color',
        default: 'rgba(100, 200, 0, 0.7)'
      },
      'group by': {
        type: 'selection',
        values: [],
        default: 0
      },
      'group color': {
        type: 'colorArray',
        default: ['#ff0029AA','#377eb8AA', '#66a61eAA', '#984ea3AA', '#00d2d5AA', '#ff7f00AA', '#af8d00AA', '#7f80cdAA', '#b3e900AA', '#c42e60AA'],
        values: []
      }
    })
  }

  removeMutation = () => {
    this.setState({
      externalMutations: undefined
    });
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    const options = newProps.options[newProps.blockid]

    let mutations = [{
      childName: "ScatterPlot",
      target: ["data"],
      eventKey: "all",
      mutation: (a,b,c,d) => {
        a.active = false
        console.log("mutation")
        return {active: false}
      },
      callback: prevState.finishMutation
    }]
    if (newProps.data && newProps.data !== prevState.data) {
      let domainValues = []
      let rangeValues = []
      let NaNFields = []
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (isNaN(element[key])) {
            if (!NaNFields.includes(key) && element[key]) {
              NaNFields.push(key)
            }
          } else {
            if (!domainValues.includes(key) && element[key]) {
              domainValues.push(key)
            }
            if (!rangeValues.includes(key) && element[key]) {
              rangeValues.push(key)
            }
          }
        })
      })
      for(let i=0; i<NaNFields.length; i++) {
        if(countUnique(newProps.data.map(obj => obj[NaNFields[i]])) > 10) {
          NaNFields.splice(i, 1)
          i--;
        }
      }
      newProps.updateAttrValues(newProps.blockid, 'domain', domainValues)
      newProps.updateAttrValues(newProps.blockid, 'range', rangeValues)
      newProps.updateAttrValues(newProps.blockid, 'group by', NaNFields)

      return {...prevState, data: newProps.data, externalMutations: mutations, range: options['range'].default, domain: options['domain'].default}
    } else if (newProps.data && options && options['group by'] && options['group by'].selected !== prevState.groupBy) {
      const values = new Set(newProps.data.map(obj => obj[options['group by'].values[options['group by'].selected || options['group by'].default]]))
      values.delete(undefined)
      if (!values) options['use default color'].hidden = true
      const colors = options['group color'].default.slice()

      newProps.updateAttrValues(newProps.blockid, 'group color', Array.from(values))
      newProps.updateAttrSelection(newProps.blockid, 'group color', colors)

      return {...prevState, 
        data: newProps.data, 
        groupBy: options['group by'].selected, 
        externalMutations: mutations, 
        range: options['range'].selected || options['range'].default, 
        domain: options['domain'].selected || options['domain'].default}
    } else if (newProps.data && options 
      && options['domain'] && options['range'] 
      && ((options['domain'].selected && options['domain'].selected !== prevState.domain) || (options['range'].selected && options['range'].selected !== prevState.range))
    ) {
      return {...prevState, 
        externalMutations: mutations, 
        range: options['range'].selected || options['range'].default, 
        domain: options['domain'].selected || options['domain'].default}
    } else {
      return {...prevState, externalMutations: undefined}
    }
  }

  getDomain = () => {
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

  updateOutput = (points, bounds, props) => {
    points[0].data.forEach((data) => {
      delete data._x; 
      delete data._y;
      delete data.eventKey;
      delete data.x;
      delete data.y;
    })
    if (this.props.onSelection) {
      this.props.onSelection(this.props.blockid, {type: 'selection', data: points[0].data})
    }
  }

  resetOutput = () => {
    if (this.props.onSelection) {
      this.props.onSelection(this.props.blockid, {type: 'selection', data: []})
    }
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
    const fillStyle = (data, active) => {
      const selectionColor = (options['selection color'].selected || options['selection color'].default) 
      const baseColor = (options.color.selected || options.color.default)
      const groupByOptions = options['group by']
      const useDefault = options['use default color'].selected !== undefined 
      ? options['use default color'].selected
      : options['use default color'].default
      if (active) {
        return selectionColor
      } else if (groupByOptions && !useDefault) {
        const attrIndex = groupByOptions.selected || groupByOptions.default
        const value = data[groupByOptions.values[attrIndex]]
        if (value) {
          const index = options['group color'].values.indexOf(value)
          if (index >= 0)
            return options['group color'].selected[index]
          else 
            return options['group color'].default
        } else {
          return baseColor
        }
      } else {
        return baseColor
      }
    }
    if (this.props.data) {
      const domainIndex = options.domain.selected || options.domain.default
      const rangeIndex = options.range.selected || options.range.default
      return (
        <VictoryChart 
          externalEventMutations= {this.state.externalMutations}
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
            name="ScatterPlot"
            externalEventMutations={this.externalMutations}
            padding={150}
            style={{ data: { fill: fillStyle, strokeDasharray: "5,5" } }}
            size={parseInt((options.size.selected || options.size.default), 10)}
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
            tickCount={5}
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
