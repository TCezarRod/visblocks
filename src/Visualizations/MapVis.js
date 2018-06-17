import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initOptions, updateAttrValues } from 'actions'

import { 
  Map, 
  Marker, 
  TileLayer,
  Popup
} from 'react-leaflet'

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
const DEFAULT_LATLNG = {
  lat: 0,
  lng: 0
}

const mapDispatchToProps = dispatch => {
  return {
    initOptions: (id, attributes) => dispatch(initOptions(id, attributes)),
    updateAttrValues: (id, attribute, values) => dispatch(updateAttrValues(id, attribute, values))
  };
};
  
const mapStateToProps = state => {
  return { options: state.controlState.options };
};

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
    })
  }

  componentDidUpdate = () => {
    if (this.refs.map) {
      var map = this.refs.map.leafletElement;
      map.invalidateSize();
    }
  }

  static getDerivedStateFromProps = (newProps, prevState) => {
    if (newProps.data && newProps.data !== prevState.data) {
      let popupValues = []
      Object.values(newProps.data).forEach(element => {
        Object.keys(element).forEach(key => {
          if (!popupValues.includes(key)) {
            popupValues.push(key)
          }
        })
      })
      newProps.updateAttrValues(newProps.blockid, 'popup', popupValues)

      return {...prevState, data: newProps.data}
    } else {
      return {...prevState}
    }
  }

  searchForLatLng = (data) => {
    if ('lat' in data && 'lng' in data) {
      return {lat: data.lat, lng: data.lng}
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
      return (<Popup><span><strong>{popupAttribute}</strong>: {value ? JSON.stringify(value) : '--'}</span></Popup>)
    }
  }

  renderMarker = (data) => {
    let latLng = this.searchForLatLng(data);
    if (latLng) {
      return (
        <Marker position={latLng} key={data.id}>
          {this.renderPopup(data)}
        </Marker>
      )
    }    
  }

  renderContent = () => {
    const { width, height } = this.props
    if (this.props.data) {  
      const markers = this.state.data.map(data => this.renderMarker(data)).filter(marker => marker !== undefined)
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