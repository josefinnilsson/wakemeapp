import React, { Component } from 'react';
import './sl.css';

class SL extends Component {

  componentDidMount() {
    let station = 'Stockholm'
    let url1 = '/getStationData/' + station
    fetch(url1)
      .then(response => {
        return response.json()})
      .then(data => {
        console.log(data);
        this.setState = {
          stations: data
        }
      })


    let station_id = localStorage.getItem('user_station_id')
    let transport_mode = '/' + localStorage.getItem('user_bus') +
                         '/' + localStorage.getItem('user_metro') +
                         '/' + localStorage.getItem('user_train') +
                         '/' + localStorage.getItem('user_tram') +
                         '/' + localStorage.getItem('user_ship')
    
    //REMOVE next two lines when localStorage is applied
    station_id = 9192
    transport_mode = '/false/true/false/false/false'

    let url2 = '/getRealTime/' + station_id + transport_mode
    fetch(url2)
      .then(response => {
        return response.json()})
      .then(data => {
        console.log(data)
      })
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

export default SL