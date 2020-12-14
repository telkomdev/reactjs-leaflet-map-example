import React, { Component } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { 
    Map, 
    TileLayer, 
    Marker, 
    Popup } from 'react-leaflet';
import L from 'leaflet';
import Routing from '../../components/RoutingMachine';

export default class Location extends Component {

    constructor(props) {
        super(props);
        this.state = {
            long: 106.816666,
            lat: -6.200000,
            targetLong:  106.8135452270508,
            targetLat: -6.221449256187597,
            zoom: 13,
            isMapInit: false
        };

        this._mapOnClick = this._mapOnClick.bind(this);

    }

    componentDidMount() {
        this._getCurrentLocation();
    }

    _getCurrentLocation() {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const success = (pos) => {
            const crd = pos.coords;
            const longitude = crd.longitude;
            const latitude = crd.latitude;

            console.log(`longitude : ${longitude}`);
            console.log(`latitude : ${latitude}`);

            this.setState({
                long: longitude, 
                lat: latitude,
                targetLong: longitude + 10,
                targetLat: latitude + 10,
            });
        };

        const error = (err) => {
            console.log('error getting current location');
            console.log(err);
        };

        if (!navigator.geolocation) {
            console.log('browser does not support geolocation');
        } else {
            navigator.geolocation.getCurrentPosition(success, error, options);

            // check if device moved
            navigator.geolocation.watchPosition(success, error, options);
        }
    }

    _mapOnClick(info) {
        console.log('latlng clicked location : ', info.latlng);
        this.setState({
            targetLong: info.latlng.lng,
            targetLat: info.latlng.lat,
        });
    }

    saveMap = map => {
        this.map = map;
        this.setState({
          isMapInit: true
        });
      };

    render() {
        let position = [this.state.lat, this.state.long];
        let target = [this.state.targetLat, this.state.targetLong];

        //const accessToken = 'pk.eyJ1IjoibXl0ZHMiLCJhIjoiY2tpbjltaXR0MGtmZDJ2cXF1aHIzc3JwNSJ9.qYCFe65MBWT13UuXwgRz_Q';
        const attribution = '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
        const tileUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

        const calcDistance = (coords1, coords2) => {
            //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
            var Rkm = 6371;
            var R = 6371000;
            var dLat = toRad(coords2.lat - coords1.lat);
            var dLon = toRad(coords2.lng - coords1.lng);
            var lat1 = toRad(coords1.lat);
            var lat2 = toRad(coords2.lat);
    
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = Math.round(R * c);
    
            return d;
        }
    
        const toRad = (value) => {
            // Converts numeric degrees to radians
            return value * Math.PI / 180;
        }

        let pointOne = L.latLng(this.state.lat, this.state.long);
        let pointTwo = L.latLng(this.state.targetLat, this.state.targetLong); 

        const distance = calcDistance(pointOne, pointTwo);

        return (
            <Container fluid> 
                <Alert key={this.state.long} variant='info'>
                    Longitude : {this.state.long}
                </Alert>

                <Alert key={this.state.lat} variant='success'>
                    Latitude : {this.state.lat}
                </Alert>

                <Map ref={this.saveMap}
                    center={position} 
                    zoom={this.state.zoom} 
                    style={{ width: '1000px', height: '500px'}}
                    onclick={this._mapOnClick}>
                    <TileLayer
                        attribution={attribution}
                        url={tileUrl}
                    />
                    <Marker position={position}>
                        <Popup>
                            My Location <br /> Jarak : {distance} Meter.
                        </Popup>
                    </Marker>
                    {this.state.isMapInit && <Routing map={this.map} pointOne={pointOne} pointTwo={pointTwo} />}
                </Map>
            </Container>
        );
    }
}// BukasaJ4