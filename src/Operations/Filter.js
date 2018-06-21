import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues, updateAttrSelection } from 'actions'

import Typography from '@material-ui/core/Typography';

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

class Filter extends React.Component {
  static propTypes = {
    blockid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object),
    onSelection: PropTypes.func
  }

  state = {
    data: [],
    filterBy: undefined,
    selectedFilters: undefined
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      name: {
        type: 'string',
        default: 'Filter'
      },
      'filter by': {
        type: 'selection',
        values: [],
        default: 0
      },
      'filters': {
        type:'multiple',
        values: [],
        default: []
      }
    })
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    const options = newProps.options[newProps.blockid]
    if (newProps.data && newProps.data !== prevState.data) {
      let filterByValues = []
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (isNaN(element[key])) {
            if (!filterByValues.includes(key) && element[key]) {
              filterByValues.push(key)
            }
          }
        })
      })
      let filterValues = []
      let defaultSelection = filterByValues[options['filter by'].default]
      Object.values(newProps.data).forEach(element => {
        if (!filterValues.includes(element[defaultSelection])) {
          filterValues.push(element[defaultSelection])
        }
      })

      let selectedFilters = filterValues.slice()
      newProps.updateAttrValues(newProps.blockid, 'filter by', filterByValues)
      newProps.updateAttrValues(newProps.blockid, 'filters', filterValues)
      newProps.updateAttrSelection(newProps.blockid, 'filters', selectedFilters)      

      return {...prevState, data: newProps.data, filterBy: options['filter by'].default, selectedFilters: selectedFilters.slice()}
    } else if (newProps.data && options && options['filter by'].selected && options['filter by'].selected !== prevState.filterBy) {
      let filterValues = []
      let selection = options['filter by'].values[options['filter by'].selected || options['filter by'].default]
      Object.values(newProps.data).forEach(element => {
        if (!filterValues.includes(element[selection])) {
          filterValues.push(element[selection])
        }
      })

      let selectedFilters = filterValues.slice()
      newProps.updateAttrValues(newProps.blockid, 'filters', filterValues)
      newProps.updateAttrSelection(newProps.blockid, 'filters', selectedFilters)
      newProps.onSelection(newProps.blockid, {type: 'selection', data: newProps.data})
      return {...prevState, data: newProps.data, filterBy: options['filter by'].selected, selectedFilters: selectedFilters.slice()}
    } else if (
      newProps.data 
      && options && options['filters'].selected 
      && (options['filters'].selected.some(filter => !prevState.selectedFilters.includes(filter))
      || prevState.selectedFilters.some(filter => !options['filters'].selected.includes(filter)))) {
      let dimension = options['filter by'].values[options['filter by'].selected || options['filter by'].default]
      let filteredValues = options['filters'].selected || options['filters'].default
      let filteredData = newProps.data.filter(datum => filteredValues.includes(datum[dimension]))
      newProps.onSelection(newProps.blockid, {type: 'selection', data: filteredData})
      return {...prevState, selectedFilters: filteredValues.slice()}
    } else {
      return {...prevState}
    }
  }
  
  renderContent = () => {
    const blockOptions = this.props.options[this.props.blockid]
    const dataText = (blockOptions && blockOptions.name) 
      ? (blockOptions.name.selected !== undefined ? blockOptions.name.selected : blockOptions.name.default) 
      : `Filter`

    return <div className="content-text"><Typography variant="body2" >{dataText}</Typography></div>
  }

  render() {
    return (      
      this.renderContent()        
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

