import React  from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types'

import Path from 'Edges/Path'

const mapStateToProps = state => {
  return {arrows: state.arrowsState.arrows};
};

class EdgesCanvas extends React.Component {
  render() {
    return (
      <svg style={{ width: '100%', height: '100%'}}>
        {
          Object.keys(this.props.arrows)
            .filter(id => this.props.arrows.hasOwnProperty(id))
            .map(id => {            
              return (
                <Path 
                  xi={this.props.arrows[id].xi} 
                  yi={this.props.arrows[id].yi}
                  xe={this.props.arrows[id].xe - 16} 
                  ye={this.props.arrows[id].ye}/>
              )
            }
          )
        })}
      </svg>
    )
  }

}

export default connect(mapStateToProps)(EdgesCanvas)