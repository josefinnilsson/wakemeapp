import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Calendar from '../calendar/calendar'
import SL from '../sl/sl'
import News from '../news/news'
import Weather from '../weather/weather'
import './dashboard.css'
import { logout } from '../actions/authActions'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  auth: state.auth
})

class Dashboard extends Component {
  onLogout = e => {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    return (
      <div className='container'>
      <button onClick={this.onLogout}>Logout</button>
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

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { logout })(Dashboard)