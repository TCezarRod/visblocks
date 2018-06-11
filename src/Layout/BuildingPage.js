import React from 'react';
import { connect } from "react-redux";
import { addArrow, createBlock } from "actions";

//import DataBlock from 'Blocks/DataBlock';
import ScatterPlot from 'Visualizations/ScatterPlot';
import LineChart from 'Visualizations/LineChart';
import Histogram from 'Visualizations/Histogram';
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

import BarChartIcon from 'assets/images/bar_chart.svg'
import ScatterPlotIcon from 'assets/images/scatter_plot.svg'
import LineChartIcon from 'assets/images/line_chart.svg'

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
    createBlock: block => dispatch(createBlock(block))
  };
};

const mapStateToProps = state => {
  return {blocks: state.blocksState.blocks};
};

class BuildingPage extends React.Component {
  state = {
    dataMap: {},
    blocks: []
  }

  addBlock = () => {
    this.props.createBlock({
      type: 'Histogram',
      input: undefined,
      props: {
        dimension: undefined,
        position: {
          top:  300,
          left: 200
        },
        size: {
          height: 200,
          width: 300
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
      default:
        return <React.Fragment/>
    }
  }

  renderBlock = (block) => { 
    // TODO: render different if data 
    return (<VisBlock
      id={block.id}
      dimension={block.props.dimension} 
      top={block.props.position.top}
      left={block.props.position.left}
      width={block.props.size.width}
      height={block.props.size.height}
      minWidth={block.type==='Data'?50:undefined}
      minHeight={block.type==='Data'?50:undefined}>
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
                <img src={LineChartIcon} width={45} alt="LineChart"/>
              </ListItemIcon>
            </ListItem>
            <ListItem button disableGutters={true} onClick={this.addBlock}>
              <ListItemIcon>
                <img src={BarChartIcon} width={45} alt="Histogram"/>
              </ListItemIcon>
            </ListItem>
            <ListItem button disableGutters={true} onClick={this.addBlock}>
              <ListItemIcon>
                <img src={ScatterPlotIcon} width={45} alt="ScatterPlot"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BuildingPage))
