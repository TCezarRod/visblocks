import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues } from 'actions'

import HotTable from 'react-handsontable';
import Typography from '@material-ui/core/Typography';

const mapDispatchToProps = dispatch => {
  return {
    initOptions: (id, attributes) => dispatch(initOptions(id, attributes)),
    updateAttrValues: (id, attribute, values) => dispatch(updateAttrValues(id, attribute, values))
  };
};
  
const mapStateToProps = state => {
  return { options: state.controlState.options };
};

const getHeadersFromData = (data) => {
  let headers = []
  Object.values(data).forEach(element => {
    Object.keys(element).forEach(key => {
      if (!headers.includes(key)) {
        headers.push(key)
      }
    })
  })
  return headers
}

class Table extends React.Component {
  static propTypes = {
    blockid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object),
    onSelection: PropTypes.func
  }

  state = {
    tableData: [],
    data: [],
    headers: []
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      name: {
        type: 'string',
        default: 'Table'
      },
      'hidden columns': {
        type: 'multiple',
        values: [],
        default: []
      }
    })
  }

  handleSelection = (startRow, startColumn, endRow, endColumn) => {
    this.props.onSelection(this.props.id, {type: 'selection', data: this.props.data.slice(startRow, endRow + 1)})
  }

  clearSelection = () => {
    this.props.onSelection(this.props.id, {type: 'selection', data: []})
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    const options = newProps.options[newProps.blockid]
    if (newProps.data && newProps.data !== prevState.data) {
      let headers = getHeadersFromData(newProps.data)
      newProps.updateAttrValues(newProps.blockid, 'hidden columns', headers.slice(0))

      return {...prevState, data: newProps.data, tableData: newProps.data, headers: headers}
    } else if (options && options['hidden columns'].selected) {
      let newHeaders = getHeadersFromData(newProps.data)
      let data = Object.values(newProps.data).map(datum => {
        let newDatum = Object.assign({}, datum)
        options['hidden columns'].selected.forEach(col => {
          delete newDatum[col]
          newHeaders.forEach((header, index) => {
            if(header === col) newHeaders.splice(index, 1)
          })
        })
        return newDatum
      })

      return {...prevState, data: newProps.data, tableData: data, headers: newHeaders}
    } else {
      return {...prevState}
    }
  }
  
  renderContent = () => {
    if (this.props.data) {
      const data = this.state.tableData.map(datum => {
        let newDatum = Object.assign({}, datum)
        Object.keys(newDatum).forEach(key => {
          if (newDatum[key] !== null && typeof newDatum[key] === 'object')
          newDatum[key] = JSON.stringify(newDatum[key])
        })
        return newDatum
      })
      return (<HotTable ref= "table"  
        root={`table-${this.props.blockid}`}        
        data = {data}
        colHeaders = {this.state.headers}
        rowHeaders = {true}
        stretchH = "all"
        afterSelectionEnd = {this.handleSelection}
        afterDeselect = {this.clearSelection}
        readOnly = {true}
        />)
    }

    const blockOptions = this.props.options[this.props.blockid]
    const dataText = (blockOptions && blockOptions.name) 
      ? (blockOptions.name.selected !== undefined ? blockOptions.name.selected : blockOptions.name.default) 
      : `Data`

    return <div className="content-text"><Typography variant="body2" >{dataText}</Typography></div>
  }

  render() {
    return (      
      this.renderContent()        
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);

