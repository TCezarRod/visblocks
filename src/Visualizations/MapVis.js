import React from 'react';
import PropTypes from 'prop-types'

import { 
  Map, 
  Marker, 
  TileLayer
} from 'react-leaflet'

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'

const DEFAULT_LATLNG = {
  lat: 0,
  lng: 0
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

  renderMarker = (data) => {
    let latLng = this.searchForLatLng(data);
    if (latLng) {
      return (
        <Marker position={latLng} key={data.id}>
          {/*this.props.popup && this.renderPopup(place)*/}
        </Marker>
      )
    }
    
  }

  renderContent = () => {
    const { width, height } = this.props
    if (this.props.data) {  
      const markers = this.props.data.map(data => this.renderMarker(data)).filter(marker => marker !== undefined)
      let mapBounds = this.props.data.map(data => this.searchForLatLng(data)).filter(latlng => latlng !== undefined)
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

export default MapVis;
