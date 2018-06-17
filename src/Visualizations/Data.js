import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions } from 'actions'

import Typography from '@material-ui/core/Typography';

const mapDispatchToProps = dispatch => {
  return {
    initOptions: (id, attributes) => dispatch(initOptions(id, attributes))
  };
};
  
const mapStateToProps = state => {
  return { options: state.controlState.options };
};

class Data extends React.Component {
  static propTypes = {
    blockid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object)
  }

  state = {
    data: []
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      name: {
        type: 'string',
        default: 'Data'
      }
    })
  }
  
  renderContent = () => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Data);

