import React from 'react';
import PropTypes from 'prop-types'

class Map extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    data: []
  }

  renderContent = () => {
    const { width, height } = this.props
    if (false/*this.props.data*/) {
      
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

export default Map;
