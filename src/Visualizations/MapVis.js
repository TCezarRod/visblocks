import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues, updateAttrSelection } from 'actions'

import { 
  Map, 
  Marker, 
  TileLayer,
  Popup
} from 'react-leaflet'

import L from 'leaflet';

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
const DEFAULT_LATLNG = {
  lat: 0,
  lng: 0
}

const mapDispatchToProps = dispatch => {
  return {
    initOptions: (id, attributes) => dispatch(initOptions(id, attributes)),
    updateAttrValues: (id, attribute, values) => dispatch(updateAttrValues(id, attribute, values)),
    updateAttrSelection: (id, attribute, value) => dispatch(updateAttrSelection(id, attribute, value))
  };
};
  
const mapStateToProps = state => {
  return { options: state.controlState.options };
};

const countUnique = (iterable) => {
  return new Set(iterable).size
}

const marker = (size, color) => {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 40">
    <path fill={color} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" transform="translate(0, -2)"/>
    <path fill="none" d="M0 0h24v20H0z"/>
  </svg>)
}

class MapVis extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
  }

  state = {
    data: [],
    zoom: 2
  }

  componentDidMount = () => {
    this.props.initOptions(this.props.blockid, {
      name: {
        type: 'string',
        default: 'Map'
      },
      popup: {
        type: 'selection',
        values: [],
        default: 0
      },
      'pin size': {
        type: 'number',
        default: 25
      },
      'use default color': {
        type: 'toggle',
        default: true,
        hidden: false 
      },
      'default pin color': {
        type: 'color',
        default: '#0E1C3F'
      },
      'group by': {
        type: 'selection',
        values: [],
        default: 0
      },
      'group color': {
        type: 'colorArray',
        default: ['#ff0029AA','#377eb8AA', '#66a61eAA', '#984ea3AA', '#00d2d5AA', '#ff7f00AA', '#af8d00AA', '#7f80cdAA', '#b3e900AA', '#c42e60AA'],
        values: []
      }
    })
  }

  componentDidUpdate = () => {
    if (this.refs.map) {
      var map = this.refs.map.leafletElement;
      map.invalidateSize();
    }
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    const options = newProps.options[newProps.blockid]
    if (newProps.data && newProps.data !== prevState.data) {
      let popupValues = []
      let NaNFields = []
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (isNaN(element[key])) {
            if (!NaNFields.includes(key) && element[key]) {
              NaNFields.push(key)
            }
          }
          if (!popupValues.includes(key)) {
            popupValues.push(key)
          }
        })
      })
      for(let i=0; i<NaNFields.length; i++) {
        if(countUnique(newProps.data.map(obj => obj[NaNFields[i]])) > 10) {
          NaNFields.splice(i, 1)
          i--;
        }
      }
      const values = new Set(newProps.data.map(obj => obj[NaNFields[options['group by'].default]]))
      values.delete(undefined)
      if (!values) options['use default color'].hidden = true
      const colors = options['group color'].default.slice()

      newProps.updateAttrValues(newProps.blockid, 'group by', NaNFields)
      newProps.updateAttrValues(newProps.blockid, 'popup', popupValues)
      newProps.updateAttrValues(newProps.blockid, 'group color', Array.from(values))
      newProps.updateAttrSelection(newProps.blockid, 'group color', colors)

      return {...prevState, data: newProps.data}
    } else if (newProps.data && options && options['group by'] && options['group by'].selected !== prevState.groupBy) {
      const values = new Set(newProps.data.map(obj => obj[options['group by'].values[options['group by'].selected || options['group by'].default]]))
      values.delete(undefined)
      if (!values) options['use default color'].hidden = true
      const colors = options['group color'].default.slice()

      newProps.updateAttrValues(newProps.blockid, 'group color', Array.from(values))
      newProps.updateAttrSelection(newProps.blockid, 'group color', colors)
      return {...prevState, data: newProps.data, groupBy: options['group by'].selected}
    } else {
      return {...prevState}
    }
  }

  findProp = (obj, prop) => {
    for(let key in obj) {
      if (key.toLowerCase() === prop.toLowerCase()) {
        return obj[key]
      }
    }
  }

  searchForLatLng = (data) => {
    let lat = this.findProp(data, 'lat') || this.findProp(data, 'latitude')
    let lng = this.findProp(data, 'lng') || this.findProp(data, 'longitude')
    if (lat && lng) {
      return {lat: lat, lng: lng}
    } else {
      let latLng;
      Object.values(data).forEach(value => {
        if (value !== null && typeof value === 'object' && !latLng) {
          latLng = this.searchForLatLng(value);
        }
      })
      if (latLng) return latLng
    }    
  }

  renderPopup = (data) => {
    const options = this.props.options[this.props.blockid]
    if (options) {
      const popupIndex = options.popup.selected || options.popup.default
      const popupAttribute = options.popup.values[popupIndex]
      const value = data[popupAttribute]
      const pinSize = options['pin size'].selected || options['pin size'].default;
      return (<Popup offset={new L.Point(0, (0 - pinSize/2))} ><span><strong>{popupAttribute}</strong>: {value ? JSON.stringify(value) : '--'}</span></Popup>)
    }
  }  

  renderMarker = (data, key) => {
    let options = this.props.options[this.props.blockid]
    let color;
    if (options['use default color'].selected !== undefined ? options['use default color'].selected : options['use default color'].default ) {
      color = options['default pin color'].selected || options['default pin color'].default
    } else {
      let dimension = options['group by'].values[options['group by'].selected || options['group by'].default]
      if (data[dimension]) {
        let colorIndex = options['group color'].values.indexOf(data[dimension])
        color = (options['group color'].selected && options['group color'].selected[colorIndex]) 
        || options['group color'].default[colorIndex]
      } else {
        color = options['default pin color'].selected || options['default pin color'].default
      }      
    }
    let size = options['pin size'].selected || options['pin size'].default
    let icon = L.divIcon({
      html: ReactDOMServer.renderToStaticMarkup(marker(size, color)),
      iconSize: new L.Point(size, size)
    })
    let latLng = this.searchForLatLng(data);
    if (latLng) {
      return (
        <Marker position={latLng} key={`${key}-${size}`} icon={icon}>
          {this.renderPopup(data)}
        </Marker>
      )
    }    
  }

  renderContent = () => {
    const { width, height } = this.props
    if (this.props.data) {  
      const markers = this.state.data.map((data, index) => this.renderMarker(data, index)).filter(marker => marker !== undefined)
      let mapBounds = this.state.data.map(data => this.searchForLatLng(data)).filter(latlng => latlng !== undefined)
      return (
      <Map 
        ref="map" 
        center={DEFAULT_LATLNG}
        zoom={this.state.zoom}
        minZoom={1} 
        bounds={mapBounds.length ? mapBounds : undefined}
        zoomControl={true}
        height={height}
        width={width}>
        <TileLayer url={OSM_URL} attribution={OSM_ATTRIBUTION} />
        {markers}
      </Map>
    )  
    } else {
      return <div className="content-text"><span>No Data</span></div>
    }
  }

  render() {
    return (      
      this.renderContent()        
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapVis);