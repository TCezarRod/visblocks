import React from 'react'
import PropTypes from 'prop-types'

import ColorPicker from 'Layout/ColorPicker'

import Drawer from '@material-ui/core/Drawer'
import TextField from '@material-ui/core/TextField'
import { FormControl, FormLabel, FormControlLabel, FormGroup, Checkbox, Switch } from '@material-ui/core'
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

  handleToggleChange = attribute => event => {
    this.props.onFieldChange(attribute, event.target.checked)     
  }

  handleFieldChange = attribute => event => {
    this.props.onFieldChange(attribute, event.target.value)
  };

  handleColorChange = attribute => color => {
    this.props.onFieldChange(attribute, color)
  }

  handleColorArrayChange = (array, index, attribute) => color => {
    let newArray = array ? array.slice() : []
    newArray[index] = color
    this.props.onFieldChange(attribute, newArray)

  }

  handleSelectChange = (attribute, values) => event => {
    const value = event.target.value
    if (values.includes(value)) {
      let newValues = values
      Object.keys(values).forEach(key => {
        if(values[key] === value) newValues.splice(key, 1)
      })
      this.props.onFieldChange(attribute, newValues)
    } else {
      this.props.onFieldChange(attribute, [...values, value])
    }
  }

  renderControls = () => {
    const { options } = this.props
    let controls = []
    if (options) {
      controls = options.attributes.map(attribute => {
        switch (options[attribute].type) {
          case 'string':
            return (<TextField
              key={attribute}
              label={capitalize(attribute)}
              value={options[attribute].selected !== undefined ? options[attribute].selected  : options[attribute].default}
              onChange={this.handleFieldChange(attribute)}
              margin="normal"
            />)
          case 'selection':
            if(options[attribute].values.length) {
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
                {options[attribute].values.map((option, index) => (
                  <option key={option} value={index}>
                    {option}
                  </option>
                ))}
              </TextField>)
            }
            break
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
          case 'multiple':
            return (
            <FormControl key={attribute} component="fieldset" margin="normal">
              <FormLabel component="legend" style={{transform: 'scale(0.75)',  transformOrigin: 'top left'}}>{capitalize(attribute)}</FormLabel>
                <FormGroup>
                  {options[attribute].values.map(value => 
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={(options[attribute].selected || options[attribute].default).includes(value)}
                          onChange={this.handleSelectChange(attribute, options[attribute].selected || options[attribute].default)}
                          value={value}
                        />
                      }
                      label={value}
                    />)}
              </FormGroup>
            </FormControl>)
          case 'colorArray': 
            if (options[attribute].values.length) {
              return (
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend" style={{transform: 'scale(0.75)',  transformOrigin: 'top left'}}>{capitalize(attribute)}</FormLabel>
                  <FormGroup>
                    {options[attribute].values.map((value, index) => {
                      return (
                        <FormControl key = {value} fullWidth style={{marginTop: '3px'}}>
                            <FormLabel component="legend" style={{transform: 'scale(0.75)',  transformOrigin: 'top left'}}>{value}</FormLabel>
                            <ColorPicker
                              color ={ (options[attribute].selected && options[attribute].selected[index]) || options[attribute].default[index] }
                              onSelect = { this.handleColorArrayChange(options[attribute].selected, index, attribute) }/>
                        </FormControl>)})}
                  </FormGroup>
                </FormControl>)
            }
            break
          case 'toggle':
          if (!options[attribute].hidden) {
            return (
              <FormControl margin="normal" fullWidth>
                <FormLabel component="legend" style={{transform: 'scale(0.75)',  transformOrigin: 'top left'}}>{capitalize(attribute)}</FormLabel>
                <Switch
                  checked={options[attribute].selected !== undefined ? options[attribute].selected : options[attribute].default}
                  onChange={this.handleToggleChange(attribute)}
                  value={attribute}
                />
              </FormControl>)
          }
          break
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