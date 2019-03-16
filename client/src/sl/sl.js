import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './sl.scss'
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

  componentDidMount() {
    this.handleRefresh()
  }

  handleRefresh() {
    let station_id = localStorage.getItem('user_station_id')
    if (station_id === '-1')
      return

    let transport_mode = '/' + localStorage.getItem('user_bus') +
                         '/' + localStorage.getItem('user_metro') +
                         '/' + localStorage.getItem('user_train') +
                         '/' + localStorage.getItem('user_tram') +
                         '/' + localStorage.getItem('user_ship')
    
    let url2 = '/getRealTime/' + parseInt(station_id) + transport_mode
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
        {localStorage.getItem('user_station_id') === '-1' ? (<p>Update your user settings</p>) : (departures.length <= 0 ? (<p>No departures the coming 30 minutes</p>) : '')}
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