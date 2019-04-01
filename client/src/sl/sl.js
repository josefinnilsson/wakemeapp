import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './sl.scss'
import Departures from './departures/departures'
import {Button} from 'react-bootstrap'


class SL extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'INIT',
      departures: [],
      departures_no_real_time: [],
      rotate: false
    }

    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
    this.handleRefresh()
  }

  handleRefresh() {
    this.setState({
      rotate: true
    })
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
      departures.push(<Departures key={departure.JourneyNumber + i} transport={departure.TransportMode} line={departure.LineNumber}
        destination={departure.Destination} exp_time={departure.DisplayTime}/>)
    }

    if (localStorage.getItem('user_station_id') === '-1') {
      return (<div className="not_authenticated_wrapper">
              <div className="not_authenticated">
                <h6>Update your user settings</h6>
                <Button onClick={() => {this.props.history.push('/userSettings')}}>Settings</Button>
              </div>
            </div>)
    } else if (departures.length <= 0) {
      return(<div className="not_authenticated_wrapper">
              <div className="not_authenticated">
                <h6>No departures the coming 30 minutes</h6>
                <Button onClick={this.handleRefresh}>Refresh</Button>
              </div>
            </div>)
    } else {
      return (
      <div>
        <FontAwesomeIcon className={this.state.rotate ? 'refresh refresh_clicked' : 'refresh'} icon='redo' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>
        <Link to={'/departures'} style={{textDecoration: 'none', color: 'black'}}>
          <table>
            <tbody>
              {departures.slice(0, 10)}
            </tbody>
          </table>
        </Link>
      </div>)
    }
  }
}

export default SL