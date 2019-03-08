import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './sl.css'
import Departures from './departures/departures'

class SL extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'INIT',
      departures: [],
      departures_no_real_time: []
    }

    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleRefresh() {
    let station_id = localStorage.getItem('user_station_id')
    let transport_mode = '/' + localStorage.getItem('user_bus') +
                         '/' + localStorage.getItem('user_metro') +
                         '/' + localStorage.getItem('user_train') +
                         '/' + localStorage.getItem('user_tram') +
                         '/' + localStorage.getItem('user_ship')
    
    //REMOVE next two lines when user settings is applied
    station_id = 9192
    transport_mode = '/true/true/false/false/false'

    let url2 = '/getRealTime/' + station_id + transport_mode
    fetch(url2)
      .then(response => {
        return response.json()})
      .then(data => {
        localStorage.setItem('departure_info', JSON.stringify(data[0]))
        localStorage.setItem('no_real_time', JSON.stringify(data[1]))
        localStorage.setItem('has_departures', true)
        this.setState({
          status: 'LOADED',
          departures: data[0],
          departures_no_real_time: data[1]
        })
      })
  }

  render() {
    //Temporary check to make fewer api-calls, should maybe use init status later
    if (localStorage.getItem('has_departures') === null) {
      this.handleRefresh()
    }
    let departure_info = []
    if (localStorage.getItem('has_departures') !== null) {
      departure_info = JSON.parse(localStorage.getItem('departure_info'))
    }
    let departures = []
    for(let i = 0; i < departure_info.length; i++) {
      let departure = departure_info[i]
      departures.push(<Departures key={departure.JourneyNumber} transport={departure.TransportMode} line={departure.LineNumber}
        destination={departure.Destination} exp_time={departure.DisplayTime}/>)
    }
    return (
      <div>
        <button id='refresh_departures' onClick={this.handleRefresh}>Refresh departures</button>
        <Link to={'/departures'} style={{textDecoration: 'none', color: 'black'}}>
          <table>
            <tbody>
              {departures.slice(0, 10)}
            </tbody>
          </table>
        </Link>
      </div>
    )
  }
}

export default SL