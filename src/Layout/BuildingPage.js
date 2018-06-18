import React from 'react';
import { connect } from "react-redux";
import { 
  addArrow, 
  createBlock, 
  updateBlockInput, 
  updateBlockData, 
  updateBlockSelection, 
  updateAttrSelection,
  deleteBlock
} from "actions";

import ScatterPlot from 'Visualizations/ScatterPlot';
import LineChart from 'Visualizations/LineChart';
import Histogram from 'Visualizations/Histogram';
import Map from 'Visualizations/MapVis';
import Data from 'Visualizations/Data';
import Table from 'Visualizations/Table';
import VisBlock from 'Blocks/VisBlock';
import EdgesCanvas from 'Edges/EdgesCanvas';
import BlocksDrawer from 'Layout/BlocksDrawer';
import ControlDrawer from 'Layout/ControlDrawer';

import Papa from 'papaparse';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

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
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar
});

const mapDispatchToProps = dispatch => {
  return {
    addArrow: arrow => dispatch(addArrow(arrow)),
    createBlock: (block, data) => dispatch(createBlock(block, data)),
    deleteBlock: (id) => dispatch(deleteBlock(id)),
    updateBlockInput: (id, inputId) => dispatch(updateBlockInput(id, inputId)),
    updateBlockData: (id, data) => dispatch(updateBlockData(id, data)),
    updateBlockSelection: (id, data) => dispatch(updateBlockSelection(id, data)),
    updateAttrSelection: (id, attribute, value) => dispatch(updateAttrSelection(id, attribute, value)),
  };
};

const mapStateToProps = state => {
  return {
    blocks: state.blocksState.blocks, 
    dataMap: state.dataState.data,
    options: state.controlState.options, 
    selectedId: state.controlState.selected
  };
};

const getData = (originId, dataMap) => {
  const originData = dataMap[originId]

  if (originData) {
    let data
    switch (originData.type) {
      case 'data':
        data = originData.data
        break
      case 'input':
        data = getData(originData.data, dataMap)
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

const csvToJSON = (csv) => {
  const parsedPapa = Papa.parse(csv, {header: true, trimHeaders: true})
  return parsedPapa.data;
}

class BuildingPage extends React.Component {
  state = {
    controlDrawerOpen: false
  }

  static getDerivedStateFromProps = (newProps, oldState) => {
    const selectedId = newProps.selectedId
    if (newProps.blocks[selectedId] && getData(selectedId, newProps.dataMap)) {
      return {...oldState, controlDrawerOpen : true}
    } else {
      return {...oldState, controlDrawerOpen : false}
    }

  }

  componentDidMount = () => {
    //document.addEventListener("keydown", this.handleKeyPress, false)
  }

  handleKeyPress = (event) => {
    /*if (event.keyCode === 46 && this.props.selectedId >= 0) {
      this.props.deleteBlock(this.props.selectedId)
    }*/
  }

  createBlock = (type) => {
    switch(type) {
      case 'Data':
        this.openFileDialog(this.handleDataFiles)
      break
      default:
        this.addBlock(type)
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
    const file = event.target.files.item(0)
    if (file.type === "application/json") {
      fileReader.onload = (this.handleLoadJson)
    } else if (file.type === "text/csv") {
      fileReader.onload = (this.handleLoadCsv)
    }      
    fileReader.readAsText(event.target.files.item(0), 'UTF-8')
  }

  handleLoadCsv = (event) => {
    let content = event.target.result;
    let data = csvToJSON(content);
    this.addBlock("Data", 75, 50, data);
  }

  handleLoadJson = (event) => {
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

  renderVisualization = (id, type, data, props) => {
    switch(type) {
      case 'Data':        
        return(<Data 
          id = {id}
          data = {data}/>)
      case 'ScatterPlot':
        return <ScatterPlot 
          id = {id}
          data={data} 
          onSelection={this.updateData}/> 
      case 'LineChart':
        return <LineChart 
          id = {id}
          data={data} />
      case 'Histogram':
        return <Histogram 
          data={data}/>         
      case 'Map':
        return <Map 
          id = {id}
          data={data}/>
      case 'Table':
        return <Table 
          id = {id}
          data={data}
          onSelection={this.updateData}/>
      default:
        return <React.Fragment/>
    }
  }

  addInput = (id, idInput) => {
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
      headerVisible={block.type!=='Data'}
      onUpdate={this.addInput}
      controlRef={this.refs.controls}>
      {this.renderVisualization(block.id, block.type, block.data || getData(block.input, this.props.dataMap), block.props)}
      </VisBlock>)    
  }

  renderComponents = () => {
    return Object.values(this.props.blocks).map(block => this.renderBlock(block))
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

  handleOptionChange = (attribute, value) => {
    this.props.updateAttrSelection(this.props.selectedId, attribute, value)
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
        <div ref="controls">
          <ControlDrawer
            open={this.state.controlDrawerOpen}
            options={this.props.options[this.props.selectedId]}
            onFieldChange={this.handleOptionChange} />
        </div>
      </div>      
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BuildingPage))
