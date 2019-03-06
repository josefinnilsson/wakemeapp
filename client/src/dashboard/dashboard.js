import React, { Component } from 'react'
import Calendar from '../calendar/calendar'
import SL from '../sl/sl'
import News from '../news/news'
import Weather from '../weather/weather'
import './dashboard.css'

class Dashboard extends Component {

  render() {
    return (
      <div className='container'>
        <div className='dashboard_wrapper'>
          <div className='calendar'>
            <Calendar key={1}/>
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
    )
  }
}

export default Dashboard