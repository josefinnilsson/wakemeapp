import React, { Component } from 'react'
import Calendar from '../calendar/calendar'
import SL from '../sl/sl'
import News from '../news/news'
import Weather from '../weather/weather'
import './dashboard.scss'

class Dashboard extends Component {
  render() {
    let update = false
    if (this.props.location.pathname === '/cal')
      update = true
    return (
      <div className='container'>
      <div>
        <div className='dashboard_wrapper'>
          <div className='calendar'>
            <Calendar key={1} update={update} history={this.props.history}/>
          </div>
          <div className='sl'>
            <SL key={2}/>
          </div>
          <div className='news'>
            <News key={3}/>
          </div>
          <div className='weather'>
            <Weather key={4}/>
          </div>
        </div>
      </div>
      </div>
    )
  }
}
export default Dashboard