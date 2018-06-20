import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues, updateAttrSelection } from 'actions'

import {
  VictoryPie
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

const getSliceData = (data, dimension) => {
  let sliceData = []
  let slices = {'others': 0}

  data.forEach(datum => {
    let elem = datum[dimension]
    if (elem === undefined) slices.others++
    if (slices[elem] !== undefined) {
      slices[elem]++
    } else {
      slices[elem] = 1
    }
  })
  if (slices.others===0) delete slices.others
  Object.keys(slices).forEach(key => {
    sliceData.push({'x': key, 'y': slices[key]})
  })

  return sliceData
}

const countUnique = (iterable) => {
  return new Set(iterable).size
}

class PieChart extends React.Component {
  static propTypes = {
    blockid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    data: [],
    sliceData: [],
    dimension: undefined,
    selectedData: []
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      name: {
        type: 'string',
        default: 'Pie Chart'
      },
      dimension: {
        type: 'selection',
        values: [],
        default: 0
      },
      'group color': {
        type: 'colorArray',
        default: ['#ff0029','#377eb8', '#66a61e', '#984ea3', '#00d2d5', '#ff7f00', '#af8d00', '#7f80cd', '#b3e900', '#c42e60'],
        values: []
      }
    })
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    const options = newProps.options[newProps.blockid]

    if (newProps.data) {
      if (newProps.data !== prevState.data) {
        let dimensionValues = []
        Object.values(newProps.data).forEach(element => {
          Object.keys(element).forEach(key => {
            if (!dimensionValues.includes(key) && isNaN(element[key]) && element[key]) {
              dimensionValues.push(key)
            }
          })
        })
        for(let i=0; i<dimensionValues.length; i++) {
          if(countUnique(newProps.data.map(obj => obj[dimensionValues[i]])) > 10) {
            dimensionValues.splice(i, 1)
            i--;
          }
        }

        let sliceData = getSliceData(newProps.data, dimensionValues[options.dimension.default])
        const values = Object.values(sliceData).map(data => data.x)

        newProps.updateAttrValues(newProps.blockid, 'dimension', dimensionValues)
        newProps.updateAttrValues(newProps.blockid, 'group color', Array.from(values))
        newProps.updateAttrSelection(newProps.blockid, 'group color', options['group color'].default)

        return {...prevState, sliceData: sliceData, data: newProps.data, dimension: options.dimension.default}
      } else if (options && options.dimension.selected && options.dimension.selected !== prevState.dimension) {
        let dimensionValues = []
        Object.values(newProps.data).forEach(element => {
          Object.keys(element).forEach(key => {
            if (!dimensionValues.includes(key) && isNaN(element[key]) && element[key]) {
              dimensionValues.push(key)
            }
          })
        })
        for(let i=0; i<dimensionValues.length; i++) {
          if(countUnique(newProps.data.map(obj => obj[dimensionValues[i]])) > 10) {
            dimensionValues.splice(i, 1)
            i--;
          }
        }
        let sliceData = getSliceData(newProps.data, dimensionValues[options.dimension.selected])

        const values = Object.values(sliceData).map(data => data.x)

        newProps.updateAttrValues(newProps.blockid, 'group color', Array.from(values))
        return {...prevState, sliceData: sliceData, data: newProps.data, dimension: options.dimension.selected}
      } else {
        return {...prevState}
      }       
    } else {
      return {...prevState}
    }
  }

  getCurrentDimension = () => {
    const options = this.props.options[this.props.blockid]
    const dimensionIndex = options.dimension.selected || options.dimension.selected.default
    return options.dimension.values[dimensionIndex]
   }

  addSelected = (value) => {
    const dimension = this.getCurrentDimension()
    const selectedData = this.props.data.filter(datum => datum[dimension] === value)
    const newSelected = this.state.selected.concat[selectedData]
    this.setState({selected: newSelected})
  }

  removeSelected = (value) => {
    const dimension = this.getCurrentDimension()
    const newSelected = this.state.selected.filter(datum => datum[dimension] !== value)
    this.setState({selected: newSelected})
  }
  
  renderContent = () => {
    const options = this.props.options[this.props.blockid]
    if (this.props.data) {
      return (
            <VictoryPie
              colorScale={options['group color'].selected || options['group color'].default}
              data={this.state.sliceData}
            />
      )
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

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
