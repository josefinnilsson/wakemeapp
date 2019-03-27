import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './userSettings.scss'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logout } from '../actions/authActions'
import BackgroundToggle from '../settings/backgroundToggle'
import {Form, Button} from 'react-bootstrap'

const mapStateToProps = state => ({
  auth: state.auth
})

class UserSettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user_saved: false,
      stations: [],
      active_station: localStorage.getItem('user_station_name'),
      active_station_id: 0,
      bus: false,
      metro: false,
      train: false,
      tram: false,
      ship: false,
      search: '',
    }

    this.handleSaveSubmit = this.handleSaveSubmit.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleStationChange = this.handleStationChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleBusChange = this.handleBusChange.bind(this)
    this.handleMetroChange = this.handleMetroChange.bind(this)
    this.handleTrainChange = this.handleTrainChange.bind(this)
    this.handleShipChange = this.handleShipChange.bind(this)
    this.handleTramChange = this.handleTramChange.bind(this)
  }

  componentDidMount() {
    const background_url = localStorage.getItem('backgronud_url')
    let url = ''
    if (background_url)
      url = JSON.parse(background_url)
    if (typeof url === undefined) {
      url = ''
    }
    document.body.style.backgroundImage = `url(${url})`
  }

  handleSearchSubmit(e) {
    e.preventDefault()
    fetch('/getStationData/' + this.state.search)
      .then(response => {
        return response.json()
      })
      .then(stations => {
        let dropdown_items = []
        for (let i = 0; i < stations.length; i++) {
          dropdown_items.push(<h6 className="list_item" key={stations[i].SiteId + i} onClick={(name, id) => this.handleStationChange(stations[i].Name, stations[i].SiteId)}>{stations[i].Name}</h6>)
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
    const bus = this.state.bus
    const metro = this.state.metro
    const train = this.state.train
    const tram = this.state.tram
    const ship = this.state.ship
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
        this.setState({
          user_saved: true
        })
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

  handleSearchChange(e) {
    this.setState({ search: e.target.value })
  }

  handleBusChange(e) {
    this.setState({ bus: !this.state.bus })
  }

  handleMetroChange(e) {
    this.setState({ metro: !this.state.metro })
  }

  handleTrainChange(e) {
    this.setState({ train: !this.state.train })
  }

  handleTramChange(e) {
    this.setState({ tram: !this.state.tram })
  }

  handleShipChange(e) {
    this.setState({ ship: !this.state.ship })
  }

  onLogout = e => {
    e.preventDefault()
    this.props.logout()

  }

  render() {
    const stations = this.state.stations

    return (
      <div>
        <h2>Settings</h2>
        <div className="settings_form_wrapper">
          <div className="settings_form">
            <h3>Departures</h3>
            <h6>Current station: {this.state.active_station !== '' ? this.state.active_station : ' None'}</h6>
            <Form onSubmit={this.handleSearchSubmit}>
              <Form.Group controlId="form_search">
                <Form.Control type="text" placeholder="Station" minLength="3" value={this.state.search} onChange={this.handleSearchChange}/>
              </Form.Group>
              <Button variant="primary" type="submit">Search</Button>
            </Form>
            {stations}
            <div className="transportation_options">
              <Form onSubmit={this.handleSaveSubmit}>
                <Form.Check inline label="Bus" type={'checkbox'} id={'bus'} onChange={this.handleBusChange}/>
                <Form.Check inline label="Metro" type={'checkbox'} id={'metro'} onChange={this.handleMetroChange}/>
                <Form.Check inline label="Train" type={'checkbox'} id={'train'} onChange={this.handleTrainChange}/>
                <Form.Check inline label="Tram" type={'checkbox'} id={'tram'} onChange={this.handleTramChange}/>
                <Form.Check inline label="Ship" type={'checkbox'} id={'ship'} onChange={this.handleShipChange}/>
                <Button variant="primary" type="submit">Save</Button>
              </Form>
            </div>

            <h3>Theme</h3>
            <BackgroundToggle/>
          </div>
        </div>
        <button onClick={this.onLogout}>Logout</button>
        <Link to='/'><button>Back to dashboard</button></Link>
      </div>
    )
  }
}

UserSettings.propTypes = {
  logout: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { logout })(UserSettings)