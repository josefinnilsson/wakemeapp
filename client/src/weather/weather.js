import React, { Component } from 'react';
import './weather.css';

class Weather extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'INIT',
      latitude: 0,
      longitude: 0
    }
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        this.handleRefresh()
      }, error => {console.log(error)})
  }

  handleRefresh() {
    let lat = this.state.latitude
    let long = this.state.longitude

    fetch('/weather/' + lat + '/' + long)
      .then(response => {
        return response.json()
      })
      .then(data => {
        localStorage.setItem('has_weather_details', true)
        localStorage.setItem('weather', JSON.stringify(data))
        this.setState({
          status: 'LOADED',
          weather: data
        })
        fetch('/getLocationData/' + lat + '/' + long)
          .then(response => {
            return response.json()
          })
          .then(city => {
            localStorage.setItem('current_location', city.name)
            this.setState({
              current_location: city.name
            })
          })
      })
  }

  render() {
    const RefreshWeather = () => {
      return (<button id='refresh_weather' onClick={this.handleRefresh}>Refresh weather</button>)
    }
    if (localStorage.getItem('weather') === null)
      this.handleRefresh()
    let weather = ''
    if (localStorage.getItem('has_weather_details'))
      weather = JSON.parse(localStorage.getItem('weather'))
    let city = ''
    if (localStorage.getItem('current_location') !== '')
      city = localStorage.getItem('current_location')
    // temp check for when data doesn't exist
    if (weather === '' || weather === null)
      return (<div><RefreshWeather/></div>)

    return (
      <div>
        <RefreshWeather/>
        <div>
          {/*
            How to get weather icons when they exist
            <img src={weather.icon} alt='weather icon' height='25' width='25'></img>
          */}
          <p>{city + ': ' }</p>
          <p>{weather.weather[0].description}</p>
          <p>{weather.main.temp + ' \u00b0C'}</p>
        </div>
      </div>
    )
  }
}

export default Weather