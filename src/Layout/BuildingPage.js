import React from 'react';
import { connect } from "react-redux";
import { addArrow, createBlock, updateBlockInput, updateBlockData, updateBlockSelection } from "actions";

import ScatterPlot from 'Visualizations/ScatterPlot';
import LineChart from 'Visualizations/LineChart';
import Histogram from 'Visualizations/Histogram';
import Map from 'Visualizations/MapVis';
import VisBlock from 'Blocks/VisBlock';
import EdgesCanvas from 'Edges/EdgesCanvas';
import BlocksDrawer from 'Layout/BlocksDrawer';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
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
  listIcons: {
    margin: '0'
  }
});

const mapDispatchToProps = dispatch => {
  return {
    addArrow: arrow => dispatch(addArrow(arrow)),
    createBlock: (block, data) => dispatch(createBlock(block, data)),
    updateBlockInput: (id, inputId) => dispatch(updateBlockInput(id, inputId)),
    updateBlockData: (id, data) => dispatch(updateBlockData(id, data)),
    updateBlockSelection: (id, data) => dispatch(updateBlockSelection(id, data))
  };
};

const mapStateToProps = state => {
  return {blocks: state.blocksState.blocks, nextId: state.blocksState.lastId, dataMap: state.dataState.data};
};

class BuildingPage extends React.Component {
  componentWillMount = () => {
    document.addEventListener("keydown", this.handleKeyPress, false)
  }

  handleKeyPress = (event) => {
    if (event.keyCode === 46)
      console.log("Delete")
  }

  createBlock = (type) => {
    switch(type) {
      case 'Data':
        this.openFileDialog(this.handleDataFiles)
      break
      case 'LineChart':
      case 'ScatterPlot':
      case 'Histogram':
      case 'Map':
        this.addBlock(type)
      break
      default:
      break
    }
  }

  openFileDialog = (handleFiles) => {
    let f=document.createElement('input');
    f.style.display='none';
    f.type='file';
    f.name='file';
    f.accept=".json, .csv"
    f.onchange=handleFiles
    f.click();
    f.remove();
  }

  handleDataFiles = (event) => {
    let fileReader = new FileReader();
    fileReader.onload = (this.handleLoad)
    fileReader.readAsText(event.target.files.item(0), 'UTF-8')
  }

  handleLoad = (event) => {
    let content = event.target.result;
    let data = JSON.parse(content);
    this.addBlock("Data", 75, 50, data);
  }

  addBlock = (type, width = 300, height = 200, data) => {
    this.props.createBlock({
      type: type,
      props: {
        position: {
          top:  25,
          left: 25
        },
        size: {
          height: height,
          width: width
        }
      }
    }, data)
  }

  updateData = (id, data) => {
    switch (data.type) {
      case 'input':
        this.props.updateBlockInput(id, data.data)
        break
      case 'data':
        this.props.updateBlockData(id, data.data)
        break
      case 'selection':
        this.props.updateBlockSelection(id, data.data)
        break
      default:
        return
    }
  }

  getData = (originId) => {
    const originData = this.props.dataMap[originId]

    if (originData) {
      let data
      switch (originData.type) {
        case 'data':
          data = originData.data
          break
        case 'input':
          data = this.getData(originData.data)
          break
        default:
          data = []
          break
      }
      if (data && data.length && originData.selection && originData.selection.length > 0) {
        data = originData.selection 
      }
      return data
    }
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
    this.addBlock("Data", 75, 50, data);
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
        <BlocksDrawer onCreateBlock={this.createBlock}/>
        <main className={classes.content}>
          <div className={classes.toolbar} />  
          <div className="workArea"> 
            {this.renderComponents()}
            <EdgesCanvas/>
          </div>
        </main>
        <Drawer
          anchor="right"
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          >
          <div className={classes.toolbar} />
        </Drawer> 
      </div>      
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BuildingPage))
