import React, { Component } from 'react'
import './weather.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Moment from 'react-moment'
import sunrise_icon from '../assets/sunrise.png'
import sunset_icon from '../assets/sunset.png'
import cloudy_icon from '../assets/cloudy.svg'
import drizzle_icon from '../assets/drizzle.svg'
import rainy_icon from '../assets/rainy.svg'
import snowy_icon from '../assets/snowy.svg'
import sunny_icon from '../assets/sunny.svg'
import thunder_icon from '../assets/thunder.svg'
import bright_night_icon from '../assets/bright_night.svg'
import cloudy_night_icon from '../assets/cloudy_night.svg'
import LineChart from 'react-linechart'

class Weather extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'INIT',
      latitude: 0,
      longitude: 0,
      rotate: false,
      forecast_points: [],
      forecast: []
    }
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
    this.handleRefresh()
  }

  getLocation() {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: 'LOADED'
        }, resolve('DONE'))
      }, error => {
        console.log(error)
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  getWeather(lat, long) {
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

  getForecast(lat, long) {
    fetch('/weather_forecast/' + lat + '/' + long)
    .then(response => {
      return response.json()
    })
    .then(data => {
      this.setState({
        forecast_points: data.temperatures,
        forecast: data.hours
      })
    })
  }

  handleRefresh() {
    this.setState({ rotate: true })
    this.getLocation()
    .then(() => {
      const lat = this.state.latitude
      const long = this.state.longitude
      this.getWeather(lat, long)
      this.getForecast(lat, long)
    })
  }

  parseDescription(description) {
    return description.charAt(0).toUpperCase() + description.slice(1)
  }

  isNight(sunset_unix, sunrise_unix) {
    const date = new Date()
    const sunset = new Date(sunset_unix*1000)
    const sunrise = new Date(sunrise_unix*1000)
    if (date.getHours() === sunset.getHours())
      return date.getMinutes() > sunset.getMinutes() ? true : false
    else if (date.getHours() === sunrise.getHours())
      return date.getMinutes() < sunrise.getMinutes() ? true : false
    else
      return date.getHours() > sunset.getHours() || date.getHours() < sunrise.getHours ? true : false
  }

  getIcon(icon, sunset, sunrise) {
    switch(icon) {
      case 'CLOUD':
        if (this.isNight(sunset, sunrise))
          return <img src={cloudy_night_icon} alt="" className="weather_icon"/>
        return <img src={cloudy_icon} alt="" className="weather_icon"/>
      case 'DRIZZLE':
        return <img src={drizzle_icon} alt="" className="weather_icon"/>
      case 'RAIN':
        return <img src={rainy_icon} alt="" className="weather_icon"/>
      case 'SNOW':
        return <img src={snowy_icon} alt="" className="weather_icon"/>
      case 'SUN':
        if (this.isNight(sunset))
          return <img src={bright_night_icon} alt="" className="weather_icon"/>
        return <img src={sunny_icon} alt="" className="sunny_icon"/>
      case 'THUNDER':
        return <img src={thunder_icon} alt="" className="weather_icon"/>
      default:
        break
    }
  }

  render() {
    const RefreshWeather = () => {
      return (<button id='refresh_weather' onClick={this.handleRefresh}>Refresh weather</button>)
    }
    let weather = localStorage.getItem('weather')
    const location = localStorage.getItem('current_location')
    const data = [
      {
        color: '#8AD2A2',
        points: this.state.forecast_points
      }
    ]

    const parseX = (x_coords) => {
      if (x_coords % 4 === 0)
        return this.state.forecast[x_coords].hour
    }

    if (localStorage.getItem('has_weather_details') === 'true' && weather !== null) {
      weather = JSON.parse(weather)
      const icon = this.getIcon(weather.icon, weather.sunset, weather.sunrise)
      return (
        <div>
          <FontAwesomeIcon className={this.state.rotate ? "refresh refresh_clicked" : "refresh"} icon='redo' cursor='pointer' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <div className="weather_row">
                <h5>{location}</h5>
              </div>
              <div className="weather_row">
                {icon}
                <h3 className="weather_title">{weather.temp + " \u00b0"}C</h3>
              </div>
              <div className="weather_row">
                <img src={sunrise_icon} alt="" className="sunrise_icon"/>
                <h6 className="weather_title"><Moment format="HH:mm" unix>{weather.sunrise}</Moment></h6>
              </div>
              <div className="weather_row">
                <img src={sunset_icon} alt="" className="sunrise_icon"/>
                <h6 className="weather_title"><Moment format="HH:mm" unix>{weather.sunset}</Moment></h6>
              </div>
              </div>
              <div className="col-md-7">
                <LineChart
                  width={300}
                  height={200}
                data={data}
                hidePoints={true}
                xDisplay={parseX}
                xLabel={'Hour'}
                yLabel={'\u00b0 C'}
              />
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <RefreshWeather/>
      )
    }
  }
}

export default Weather