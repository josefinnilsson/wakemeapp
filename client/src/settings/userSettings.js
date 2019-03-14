import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './userSettings.css'
import Dropdown from 'react-bootstrap/Dropdown'
import axios from 'axios'


class UserSettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search_string: '',
      stations: [],
      active_station: localStorage.getItem('user_station_name'),
      active_station_id: 0,
      bus: false,
      metro: false,
      train: false,
      tram: false,
      ship: false
    }

    this.handleSaveSubmit = this.handleSaveSubmit.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleStationChange = this.handleStationChange.bind(this)
  }

  handleSearchSubmit(e) {
    e.preventDefault()
    fetch('/getStationData/' + this.refs.search_string.value)
      .then(response => {
        return response.json()
      })
      .then(stations => {
        let dropdown_items = []
        for (let i = 0; i < stations.length; i++) {
          dropdown_items.push(<Dropdown.Item key={stations[i].SiteId + i} onClick={(name, id) => this.handleStationChange(stations[i].Name, stations[i].SiteId)}>{stations[i].Name}</Dropdown.Item>)
        }
        this.setState({
          stations: dropdown_items
        })
      })
  }

  handleSaveSubmit(e) {
    e.preventDefault()
    let stationName = this.state.active_station
    if (this.state.active_station === '')
      stationName = localStorage.getItem('user_station_name')
    let stationId = this.state.active_station_id
    if (this.state.active_station_id === 0)
      stationId = localStorage.getItem('user_station_id')
    const bus = this.refs.bus.checked
    const metro = this.refs.metro.checked
    const train = this.refs.train.checked
    const tram = this.refs.tram.checked
    const ship = this.refs.ship.checked
    const userSettings = {
      stationName: stationName,
      stationId: stationId,
      bus: bus,
      metro: metro,
      train: train,
      tram: tram,
      ship: ship
    }

    axios.post('/updateUserSettings/' + localStorage.getItem('email'), userSettings)
      .then(res => {
        console.log('Successfully saved user settings')
        localStorage.setItem('user_station_name', stationName)
        localStorage.setItem('user_station_id', stationId)
        localStorage.setItem('user_bus', bus)
        localStorage.setItem('user_metro', metro)
        localStorage.setItem('user_train', train)
        localStorage.setItem('user_tram', tram)
        localStorage.setItem('user_ship', ship)
      })
      .catch(err => {
        console.log(err)
    })
  }

  handleStationChange(name, id) {
    this.setState({
      active_station: name,
      active_station_id: id
    })
  }

  render() {
    const stations = this.state.stations
    const StationDropdown = () => (
        <div>
          <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                    {this.state.active_station}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {stations}
                </Dropdown.Menu>
            </Dropdown>
        </div>
      )
    // AT LEAST SEARCH FOR THREE CHARS
    return (
      <div className='container'>
        <div>
          <Link to='/'><button>Back to dashboard</button></Link>
          <div>
            <h3>Settings</h3>
            <form onSubmit={this.handleSearchSubmit}>
              <label>Search station</label><input type='text' ref='search_string'/>
              <input type='submit' value='search'/>
            </form>
            {localStorage.getItem('user_station_id') !== '-1' || stations.length > 0 ? <StationDropdown/> : ''}
            <form onSubmit={this.handleSaveSubmit}>
              <label>Bus</label><input type='checkbox' value='bus' ref='bus'/><br/>
              <label>Metro</label><input type='checkbox' value='metro' ref='metro'/><br/>
              <label>Train</label><input type='checkbox' value='train' ref='train'/><br/>
              <label>Tram</label><input type='checkbox' value='tram' ref='tram'/><br/>
              <label>Ship</label><input type='checkbox' value='ship' ref='ship'/><br/>
              <input type='submit' value='Save'/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default UserSettings