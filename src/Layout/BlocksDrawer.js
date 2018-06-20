import React from 'react';
import PropTypes from 'prop-types'

import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles } from '@material-ui/core/styles';

import BarChartIcon from 'assets/images/bar_chart.svg'
import ScatterPlotIcon from 'assets/images/scatter_plot.svg'
import LineChartIcon from 'assets/images/line_chart.svg'
import PinIcon from 'assets/images/map_pin.svg'
import DataIcon from 'assets/images/data.svg'
import TableIcon from 'assets/images/table.svg'
import PieChartIcon from 'assets/images/pie_chart.svg'

const drawerWidth = 50

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  popper: {
    left: '30px !important',
    top: '10px !important'
  },
  listIcons: {
    margin: '0'
  }
});

class BlocksDrawer extends React.Component {
  static propTypes = {
    onCreateBlock: PropTypes.func
  }

  render() {
    const { classes } = this.props;
    return (
      <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          >
          <div className={classes.toolbar} />
          <List>
            <Tooltip title="Add data" placement="right" classes={{popper: classes.popper}}>
              <ListItem button disableGutters={true} onClick={() => this.props.onCreateBlock("Data")}>             
                <ListItemIcon classes={{root: classes.listIcons}}>
                  <img src={DataIcon} width={45} alt="Data"/>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
            <Tooltip title="Table" placement="right"  classes={{popper: classes.popper}}>
              <ListItem button disableGutters={true} onClick={() => this.props.onCreateBlock("Table")}>
                <ListItemIcon classes={{root: classes.listIcons}}>
                  <img src={TableIcon} width={45} alt="Table"/>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
            <Tooltip title="Pie Chart" placement="right"  classes={{popper: classes.popper}}>
              <ListItem button disableGutters={true} onClick={() => this.props.onCreateBlock("PieChart")}>
                <ListItemIcon classes={{root: classes.listIcons}}>
                  <img src={PieChartIcon} width={45} alt="PieChart"/>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
            <Tooltip title="Line Chart" placement="right"  classes={{popper: classes.popper}}>
              <ListItem button disableGutters={true} onClick={() => this.props.onCreateBlock("LineChart")}>
                <ListItemIcon classes={{root: classes.listIcons}}>
                  <img src={LineChartIcon} width={45} alt="LineChart"/>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
            <Tooltip title="Histogram" placement="right"  classes={{popper: classes.popper}}>
              <ListItem button disableGutters={true} onClick={() => this.props.onCreateBlock("Histogram")}>
                <ListItemIcon classes={{root: classes.listIcons}}>
                  <img src={BarChartIcon} width={45} alt="Histogram"/>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
            <Tooltip title="Scatter Plot" placement="right"  classes={{popper: classes.popper}}>
              <ListItem button disableGutters={true} onClick={() => this.props.onCreateBlock("ScatterPlot")}>
                <ListItemIcon classes={{root: classes.listIcons}}>
                  <img src={ScatterPlotIcon} width={45} alt="ScatterPlot"/>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
            <Tooltip title="Pin Map" placement="right"  classes={{popper: classes.popper}}>
              <ListItem button disableGutters={true} onClick={() => this.props.onCreateBlock("Map")}>
                <ListItemIcon classes={{root: classes.listIcons}}>
                  <img src={PinIcon} width={45} alt="Map"/>
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          </List>
        </Drawer> 
    )
  }
}

export default withStyles(styles)(BlocksDrawer)