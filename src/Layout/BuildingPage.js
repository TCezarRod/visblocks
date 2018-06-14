import React from 'react';
import { connect } from "react-redux";
import { addArrow, createBlock, updateBlockInput, updateBlockData } from "actions";

//import DataBlock from 'Blocks/DataBlock';
import ScatterPlot from 'Visualizations/ScatterPlot';
import LineChart from 'Visualizations/LineChart';
import Histogram from 'Visualizations/Histogram';
import Map from 'Visualizations/MapVis';
import VisBlock from 'Blocks/VisBlock';
import EdgesCanvas from 'Edges/EdgesCanvas';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles } from '@material-ui/core/styles';
import ReactFileReader from 'react-file-reader'

import BarChartIcon from 'assets/images/bar_chart.svg'
import ScatterPlotIcon from 'assets/images/scatter_plot.svg'
import LineChartIcon from 'assets/images/line_chart.svg'
import PinIcon from 'assets/images/map_pin.svg'
import DataIcon from 'assets/images/data.svg'

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
    addArrow: arrow => dispatch(addArrow(arrow)),
    createBlock: block => dispatch(createBlock(block)),
    updateBlockInput: (id, inputId) => dispatch(updateBlockInput(id, inputId)),
    updateBlockData: (id, data) => dispatch(updateBlockData(id, data))
  };
};

const mapStateToProps = state => {
  return {blocks: state.blocksState.blocks, nextId: state.blocksState.lastId};
};

class BuildingPage extends React.Component {
  state = {
    dataMap: {},
    blocks: []
  }

  addBlock = (type, width = 300, height = 200) => {
    this.props.createBlock({
      type: type,
      props: {
        position: {
          top:  300,
          left: 200
        },
        size: {
          height: height,
          width: width
        }
      }
    })
  }

  // TODO: check if using victory-shared-events can solve the blocks interaction in a more elegant way
  updateData = (id, data) => {
    this.setState((prevState) => ({
      dataMap: Object.assign(prevState.dataMap, {[id]: data})
    }))
  }

  componentWillMount() {
    let dataMap = {};

    for (let id in this.props.blocks) {
      let block = this.props.blocks[id]
      if (block.type === 'Data') {
        dataMap[block.id] = block.data;
      }
    }

    this.setState((prevState) => ({dataMap: Object.assign(prevState.dataMap, dataMap)}))
  }

  componentDidMount() {
    for (let id in this.props.blocks) {
      let block = this.props.blocks[id]
    
      if (block.input) {
        let inputBlock = this.props.blocks[block.input]
        this.props.addArrow({
          xi:inputBlock.props.position.left + inputBlock.props.size.width,
          yi:inputBlock.props.position.top + inputBlock.props.size.height/2,
          xe: block.props.position.left,
          ye: block.props.position.top + block.props.size.height/2,
          startBlock: inputBlock.id,
          endBlock: block.id
        })
      }
    }
  }

  // TODO replace dataMap for dataState
  getData = (originId) => {
    let originBlock = this.props.blocks[originId];
    if (originBlock)
      return this.state.dataMap[originId] || this.getData(originBlock.input)
  }

  renderVisualization = (id, type, data, props) => {
    switch(type) {
      case 'Data':
        return(<span>Data</span>)
      case 'ScatterPlot':
        return <ScatterPlot 
          id = {id}
          data={data} 
          xDimension={props.xDimension}
          yDimension={props.yDimension} 
          onSelection={this.updateData}/> 
      case 'LineChart':
        return <LineChart 
          id = {id}
          data={data} 
          xDimension={props.xDimension}
          yDimension={props.yDimension}/>        
      case 'Histogram':
        return <Histogram 
          id = {id}
          data={data}
          dimension={props.dimension}
          bins={props.bins}/>         
      case 'Map':
        return <Map 
          id = {id}
          data={data}/>        
      default:
        return <React.Fragment/>
    }
  }

  addInput = (id, idInput) => {
    console.log(`${id} receives from ${idInput}`)
    let block = this.props.blocks[id]
    let inputBlock = this.props.blocks[idInput]
    this.props.updateBlockInput(id, idInput)

    this.props.addArrow({
      xi:inputBlock.props.position.left + inputBlock.props.size.width,
      yi:inputBlock.props.position.top + inputBlock.props.size.height/2,
      xe: block.props.position.left,
      ye: block.props.position.top + block.props.size.height/2,
      startBlock: inputBlock.id,
      endBlock: block.id
    })
  }

  renderBlock = (block) => { 
    // TODO: render different if data 
    return (<VisBlock
      key={block.id}
      id={block.id}
      dimension={block.props.dimension} 
      top={block.props.position.top}
      left={block.props.position.left}
      width={block.props.size.width}
      height={block.props.size.height}
      minWidth={block.type==='Data'?50:undefined}
      minHeight={block.type==='Data'?50:undefined}
      onUpdate={this.addInput}>
      {this.renderVisualization(block.id, block.type, block.data || this.getData(block.input), block.props)}
      </VisBlock>)    
  }

  renderComponents = () => {
    let blocks = []  
    for (let id in this.props.blocks) {
      blocks.push(this.renderBlock(this.props.blocks[id]));
    }
    return blocks
  }

  handleFiles = (files) => {
    console.log('read');
    let fileReader = new FileReader();
    fileReader.onload = this.handleLoad
    fileReader.readAsText(files.fileList.item(0), 'UTF-8')
  }

  handleLoad = (event) => {
    let content = event.target.result;
    let data = JSON.parse(content);
    let newId = this.props.nextId;
    this.addBlock("Data", 75, 50);
    this.props.updateBlockData(newId, data);
    this.setState({dataMap: {...this.state.dataMap, [newId]:data}})
  }

  renderAppBar() {
    const { classes } = this.props;
    return (
    <AppBar position='absolute' color='default' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="title" color="primary" noWrap>
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
            <ListItem button disableGutters={true}>
              <ReactFileReader handleFiles={this.handleFiles} fileTypes={[".json"]} base64={true} multipleFiles={false}>              
                <ListItemIcon>
                  <img src={DataIcon} width={45} alt="Data"/>
                </ListItemIcon>
              </ReactFileReader> 
            </ListItem>
            <ListItem button disableGutters={true} onClick={() => this.addBlock("LineChart")}>
              <ListItemIcon>
                <img src={LineChartIcon} width={45} alt="LineChart"/>
              </ListItemIcon>
            </ListItem>
            <ListItem button disableGutters={true} onClick={() => this.addBlock("Histogram")}>
              <ListItemIcon>
                <img src={BarChartIcon} width={45} alt="Histogram"/>
              </ListItemIcon>
            </ListItem>
            <ListItem button disableGutters={true} onClick={() => this.addBlock("ScatterPlot")}>
              <ListItemIcon>
                <img src={ScatterPlotIcon} width={45} alt="ScatterPlot"/>
              </ListItemIcon>
            </ListItem>
            <ListItem button disableGutters={true} onClick={() => this.addBlock("Map")}>
              <ListItemIcon>
                <img src={PinIcon} width={45} alt="Map"/>
              </ListItemIcon>
            </ListItem>
          </List>
        </Drawer>  
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BuildingPage))
