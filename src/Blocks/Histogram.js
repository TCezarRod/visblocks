import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { moveBlock } from 'actions'

import {
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictorySelectionContainer
} from 'victory'

import Rnd from 'react-rnd';

const mapDispatchToProps = dispatch => {
  return {
    moveBlock: (id, props) => dispatch(moveBlock(id, props))
  };
};

class Histogram extends React.Component {
  static propTypes = {
    dimension: PropTypes.string,
    bins: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    position: {
      top: this.props.top,
      left: this.props.left
    },
    size: {
      width: this.props.width,
      height: this.props.height
    },
    prevSize: {
      width: this.props.width,
      height: this.props.height
    },
    data: []
  }

  getDomain = () => {
    let minX = Math.min.apply(Math, this.state.data.map((obj) => obj[this.props.dimension]))
    let maxX = Math.max.apply(Math, this.state.data.map((obj) => obj[this.props.dimension]))
    let truMaxX = maxX + (maxX-minX)/this.props.bins

    let maxY = Math.max.apply(Math, this.state.data.map((obj) => obj.frequency))

    return {x:[minX, truMaxX], y:[0, maxY]}
  }

  updateSize = (e, dir, ref, delta, position) => {
    this.props.moveBlock(this.props.id, {
      size: {
        width: this.state.prevSize.width + delta.width,
        height: this.state.prevSize.height + delta.height
      },
      position: position
    })
    this.setState({
      size:{
        width: this.state.prevSize.width + delta.width,
        height: this.state.prevSize.height + delta.height
      },
      position: {
        top: position.y,
        left: position.x
      }
    })
  }

  updatePrevSize = (e, dir, ref, delta, position) => {
    this.setState({
    prevSize:{
      width: this.state.size.width,
      height: this.state.size.height
    }
  })
}

  updatePosition = (e, position) => {
    this.props.moveBlock(this.props.id, {
      size: this.state.size,
      position: {
        x: position.x,
        y: position.y
      }
    })
    this.setState({
      position: {
        top: position.y,
        left: position.x
      }
    })
  }

  makeDataBins = (props) => {
    let binData = [];
    let bins = props.bins;
    let minX = Math.min.apply(Math, props.data.map((obj) => obj[props.dimension]))
    let maxX = Math.max.apply(Math, props.data.map((obj) => obj[props.dimension]))

    let interval = (maxX - minX) / bins

    let last;
    for (let i = minX; i < maxX; i += interval) {
      binData.push({
        [props.dimension]: i,
        frequency: props.data.filter((data) => data[props.dimension]>=i && data[props.dimension]<(i+interval)).length
      })
      last=i;
    }
    if (last + interval === maxX) {
      binData.find((bin)=>bin[props.dimension]===last).frequency += props.data.filter((data) => data[props.dimension]===maxX).length
    }

    this.setState({data: binData});
  }

  componentWillMount = () => this.makeDataBins(this.props) 

  componentWillReceiveProps = (nextProps) => this.makeDataBins(nextProps)

  render() {
    return (
      <Rnd
        default={{
          x: this.state.position.left,
          y: this.state.position.top,
          width: this.state.size.width,
          height: this.state.size.height,
        }}
        dragHandleClassName=".handle"
        style={this.style}
        onResize={this.updateSize}
        onResizeStop={this.updatePrevSize}
        onDrag={this.updatePosition}
        bounds= 'parent'
      >
        <div className="container" >
          <div className="handle">✜</div>
          <VictoryChart 
            theme={VictoryTheme.material}
            domain={this.getDomain()}
            width={this.state.size.width}
            height={this.state.size.height}
            containerComponent={<VictorySelectionContainer />}
            domainPadding={5}>
              <VictoryBar 
                barRatio={1.1}
                alignment="start"
                x={this.props.dimension}
                y={'frequency'}
                data={this.state.data}/>
          </VictoryChart>
        </div>
      </Rnd>
    );
  }
}

export default connect(null, mapDispatchToProps)(Histogram);
