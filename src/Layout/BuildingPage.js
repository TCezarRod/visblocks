import React from 'react';
import { connect } from "react-redux";
import { addArrow } from "actions";

import DataBlock from 'Blocks/DataBlock';
import ScatterPlot from 'Blocks/ScatterPlot';
import LineChart from 'Blocks/LineChart';
import Histogram from 'Blocks/Histogram';
import EdgesCanvas from 'Edges/EdgesCanvas';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/AddCircle';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 50;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
});

const mapDispatchToProps = dispatch => {
  return {
    addArrow: arrow => dispatch(addArrow(arrow))
  };
};

class BuildingPage extends React.Component {
  state = {
    width: 300,
    height: 200,
    dataMap: {},
    blocks: [
      {
        id: 'd1',
        type: 'Data',
        data: [
          {"sepalLength": 5.1, "sepalWidth": 3.5, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.9, "sepalWidth": 3.0, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.7, "sepalWidth": 3.2, "petalLength": 1.3, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.6, "sepalWidth": 3.1, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.0, "sepalWidth": 3.6, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.4, "sepalWidth": 3.9, "petalLength": 1.7, "petalWidth": 0.4, "species": "setosa"},
          {"sepalLength": 4.6, "sepalWidth": 3.4, "petalLength": 1.4, "petalWidth": 0.3, "species": "setosa"},
          {"sepalLength": 5.0, "sepalWidth": 3.4, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.4, "sepalWidth": 2.9, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.9, "sepalWidth": 3.1, "petalLength": 1.5, "petalWidth": 0.1, "species": "setosa"},
          {"sepalLength": 5.4, "sepalWidth": 3.7, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.8, "sepalWidth": 3.4, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.8, "sepalWidth": 3.0, "petalLength": 1.4, "petalWidth": 0.1, "species": "setosa"},
          {"sepalLength": 4.3, "sepalWidth": 3.0, "petalLength": 1.1, "petalWidth": 0.1, "species": "setosa"},
          {"sepalLength": 5.8, "sepalWidth": 4.0, "petalLength": 1.2, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.7, "sepalWidth": 4.4, "petalLength": 1.5, "petalWidth": 0.4, "species": "setosa"},
          {"sepalLength": 5.4, "sepalWidth": 3.9, "petalLength": 1.3, "petalWidth": 0.4, "species": "setosa"},
          {"sepalLength": 5.1, "sepalWidth": 3.5, "petalLength": 1.4, "petalWidth": 0.3, "species": "setosa"},
          {"sepalLength": 5.7, "sepalWidth": 3.8, "petalLength": 1.7, "petalWidth": 0.3, "species": "setosa"},
          {"sepalLength": 5.1, "sepalWidth": 3.8, "petalLength": 1.5, "petalWidth": 0.3, "species": "setosa"},
          {"sepalLength": 5.4, "sepalWidth": 3.4, "petalLength": 1.7, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.1, "sepalWidth": 3.7, "petalLength": 1.5, "petalWidth": 0.4, "species": "setosa"},
          {"sepalLength": 4.6, "sepalWidth": 3.6, "petalLength": 1.0, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.1, "sepalWidth": 3.3, "petalLength": 1.7, "petalWidth": 0.5, "species": "setosa"},
          {"sepalLength": 4.8, "sepalWidth": 3.4, "petalLength": 1.9, "petalWidth": 0.6, "species": "setosa"},
          {"sepalLength": 5.0, "sepalWidth": 3.0, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.0, "sepalWidth": 3.4, "petalLength": 1.6, "petalWidth": 0.4, "species": "setosa"},
          {"sepalLength": 5.2, "sepalWidth": 3.5, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.2, "sepalWidth": 3.4, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.7, "sepalWidth": 3.2, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.8, "sepalWidth": 3.1, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.4, "sepalWidth": 3.4, "petalLength": 1.5, "petalWidth": 0.4, "species": "setosa"},
          {"sepalLength": 5.2, "sepalWidth": 4.1, "petalLength": 1.5, "petalWidth": 0.1, "species": "setosa"},
          {"sepalLength": 5.5, "sepalWidth": 4.2, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.9, "sepalWidth": 3.1, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.0, "sepalWidth": 3.2, "petalLength": 1.2, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 5.5, "sepalWidth": 3.5, "petalLength": 1.3, "petalWidth": 0.2, "species": "setosa"},
          {"sepalLength": 4.9, "sepalWidth": 3.6, "petalLength": 1.4, "petalWidth": 0.1, "species": "setosa"},
          {"sepalLength": 4.4, "sepalWidth": 3.0, "petalLength": 1.3, "petalWidth": 0.2, "species": "setosa"}],
        props: {
          position: {
            top: 0,
            left: 0
          },
          size: {
            height: 50,
            width: 50
          }
        }
      },
      {
        id: 'v1',
        type: 'ScatterPlot',
        input: 'd1',
        props: {
          xDimension: 'sepalLength',
          yDimension: 'sepalWidth',
          position: {
            top:  50,
            left: 200
          },
          size: {
            height: 200,
            width: 300
          }
        }
      },
      {
        id: 'v2',
        type: 'LineChart',
        input: 'v1',
        props: {
          xDimension: 'sepalLength',
          yDimension: 'sepalWidth',
          position: {
            top: 0,
            left: 700
          },
          size: {
            height: 200,
            width: 300
          }
        }
      },
      {
        id: 'v3',
        type: 'Histogram',
        input: 'v1',
        props: {
          dimension: 'sepalWidth',
          bins: 10,
          position: {
            top: 300,
            left: 250
          },
          size: {
            height: 200,
            width: 300
          }
        }
      }
    ]
  }

  addBlock = () => {
    this.setState({...this.state, blocks:[...this.state.blocks, {
      id: 'vx',
      type: 'ScatterPlot',
      input: 'd1',
      props: {
        xDimension: 'sepalLength',
        yDimension: 'sepalWidth',
        position: {
          top:  300,
          left: 200
        },
        size: {
          height: 200,
          width: 300
        }
      }
    }]})
  }

  // TODO: check if using victory-shared-events can solve the blocks interaction in a more elegant way
  updateData = (id, data) => {
    this.setState((prevState) => ({
      dataMap: Object.assign(prevState.dataMap, {[id]: data})
    }))
  }

  componentWillMount() {
    let dataMap = {};
    this.state.blocks
      .filter(block => block.type === 'Data')
      .forEach(dataBlock => dataMap[dataBlock.id] = dataBlock.data)

    this.setState((prevState) => ({dataMap: Object.assign(prevState.dataMap, dataMap)}))
  }

  componentDidMount() {
    this.state.blocks.forEach(block => {
      if (block.input) {
        let inputBlock = this.state.blocks.find(b => b.id === block.input)
        this.props.addArrow({
          xi:inputBlock.props.position.left + inputBlock.props.size.width,
          yi:inputBlock.props.position.top + inputBlock.props.size.height/2,
          xe: block.props.position.left,
          ye: block.props.position.top + block.props.size.height/2,
          startBlock: inputBlock.id,
          endBlock: block.id
        })
      }
    })
  }

  getData = (originId) => {
    return this.state.dataMap[originId] || this.getData(this.state.blocks.find(block => block.id === originId).input)
  }

  renderBlock = (block) => {    
    switch(block.type) {
      case 'Data':
        return <DataBlock id={block.id} top={block.props.position.top} left={block.props.position.left} width={block.props.size.width} height={block.props.size.height} data={block.data}/>
      case 'ScatterPlot':
        return <ScatterPlot 
          id={block.id}
          data={this.getData(block.input)} 
          xDimension={block.props.xDimension}
          yDimension={block.props.yDimension} 
          onSelection={this.updateData}
          top={block.props.position.top}
          left={block.props.position.left}
          width={block.props.size.width}
          height={block.props.size.height}/> 
      case 'LineChart':
        return <LineChart 
          id={block.id}
          data={this.getData(block.input)} 
          xDimension={block.props.xDimension}
          yDimension={block.props.yDimension} 
          top={block.props.position.top}
          left={block.props.position.left}
          width={block.props.size.width}
          height={block.props.size.height}/>          
      case 'Histogram':
        return <Histogram 
          id={block.id}
          dimension={block.props.dimension}
          data={this.getData(block.input)} 
          top={block.props.position.top}
          left={block.props.position.left}
          width={block.props.size.width}
          height={block.props.size.height}
          bins={block.props.bins}/>
      
      default:
        return <React.Fragment/>
    }
  }

  renderComponents = () => {        
    return this.state.blocks.map((block) => this.renderBlock(block))
  }

  handleFiles = (files) => {
    console.log('read');
  }

  renderAppBar() {
    const { classes } = this.props;
    return (
    <AppBar position='absolute' color='default' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="title" color="white" noWrap>
          VisBlocks
        </Typography>
      </Toolbar>
    </AppBar>)
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.renderAppBar()}
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          >
          <div className={classes.toolbar} />
          <List>
            <ListItem button disableGutters={true} onClick={this.addBlock}>
              <ListItemIcon>
                <AddIcon style={{fontSize: 40}} />
              </ListItemIcon>
            </ListItem>
          </List>
        </Drawer>
        {/*<ReactFileReader handleFiles={this.handleFiles} fileTypes={[".json"]} base64={true} multipleFiles={false}>
          <IconButton className={'navButton'} color="inherit" aria-label="Menu">
            <Icon>file_upload</Icon>
          </IconButton>
        </ReactFileReader>*/}     
        <main className={classes.content}>
          <div className={classes.toolbar} />  
          <div className="workArea"> 
            {this.renderComponents()}
            <EdgesCanvas/>
          </div>
        </main>
      </div>      
    );
  }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(BuildingPage))
