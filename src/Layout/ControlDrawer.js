import React from 'react'
import PropTypes from 'prop-types'

import ColorPicker from 'Layout/ColorPicker'

import Drawer from '@material-ui/core/Drawer'
import TextField from '@material-ui/core/TextField'
import { FormControl, FormLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const drawerWidth = 250

const styles = theme => ({
  drawerPaper: {
    width: drawerWidth,
    padding: '10px'
  },
  toolbar: theme.mixins.toolbar
});

const capitalize = (str) => {
  return str && str[0].toUpperCase() + str.slice(1);
}

class ControlDrawer extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    options: PropTypes.object,
    onFieldChange: PropTypes.func
  }

  handleFieldChange = attribute => event => {
    this.props.onFieldChange(attribute, event.target.value)
  };

  handleColorChange = attribute => color => {
    this.props.onFieldChange(attribute, color)
  }

  renderControls = () => {
    const { options } = this.props
    let controls = []
    if (options) {
      controls = options.attributes.map(attribute => {
        switch (options[attribute].type) {
          case 'selection':
            return (<TextField
              key={attribute}
              select
              fullWidth
              label={capitalize(attribute)}
              value={options[attribute].selected || options[attribute].default}
              onChange={this.handleFieldChange(attribute)}
              SelectProps={{
                native: true
              }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            >
              {options[attribute].values.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>)
          case 'color':
              return (
              <FormControl key = {attribute} fullWidth margin="normal">
                  <FormLabel component="legend" style={{transform: 'scale(0.75)',  transformOrigin: 'top left'}}>{capitalize(attribute)}</FormLabel>
                  <ColorPicker
                    color ={ options[attribute].selected || options[attribute].default }
                    onSelect = { this.handleColorChange(attribute) }/>
              </FormControl>)
          case 'number':
              return (<TextField
                key={attribute}
                fullWidth
                label={capitalize(attribute)}
                value={options[attribute].selected || options[attribute].default}
                onChange={this.handleFieldChange(attribute)}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />)
          default:
              return null
        }
      })
      return controls
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Drawer
        open={this.props.open}
        anchor="right"
        variant="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.toolbar} />
        <div style={{height: '100%'}}>
          {this.renderControls()}
        </div>
      </Drawer> 
    )
  }
}

export default withStyles(styles)(ControlDrawer)