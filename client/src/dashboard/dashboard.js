import React, { Component } from 'react'
import Calendar from '../calendar/calendar'
import SL from '../sl/sl'
import News from '../news/news'
import Weather from '../weather/weather'
import './dashboard.scss'

class Dashboard extends Component {
  componentDidMount() {
    const background_url = localStorage.getItem('background_url')
    let url = ''
    if (background_url)
      url = JSON.parse(background_url)
    if (typeof url === undefined) {
      url = ''
    }
    document.body.style.backgroundImage = `url(${url})`
  }

  getGreeting() {
    const hour = new Date().getHours()
    if (hour > 5 && hour < 12)
      return "Good Morning"
    if (hour >= 12 && hour <= 17)
      return "Good Afternoon"
    else
      return "Good Night"

  }

  render() {
    let update = false
    if (this.props.location.pathname === '/cal')
      update = true
    const greeting = this.getGreeting()
    const name = localStorage.getItem('user_name')
    return (
      <div className="dashboard_wrapper">
        <h2>{greeting} {name}!</h2>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="calendar">
                <Calendar update={update} history={this.props.history}/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="sl">
                <SL history={this.props.history}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="news">
                <News/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="weather">
                <Weather/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Dashboard