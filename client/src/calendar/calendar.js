import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './calendar.scss'
import ListEvent from './listEvent'
import {Button} from 'react-bootstrap'

class Calendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'INIT',
            events: [],
            authorized: true,
            rotate: false
        }
        this.handleRefresh = this.handleRefresh.bind(this)
        this.isAuth = this.isAuth.bind(this)
    }

    componentDidMount() {
      this.isAuth().then(() => {
        if (this.state.authorized) {
          this.handleRefresh()
        }
      })
    }

    handleRefresh() {
      this.setState({
        rotate: true
      })
      fetch('/calendar/' + localStorage.getItem('email'))
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.url) {
          window.location = data.url
        } else {
          localStorage.setItem('calendar_events', JSON.stringify(data.events))
          if (data.events === 'No events found') {
            localStorage.setItem('has_events', false)
          } else {
            localStorage.setItem('has_events', true)
          }
          if (this.state.status === 'INIT')
            this.props.history.push('/')
          this.setState({
            status: 'LOADED',
            events: data
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }

    isAuth() {
      return new Promise(resolve => {
        fetch('/calendar_authenticated' + localStorage.getItem('email'))
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.authorized === 'NOT_AUTHORIZED') {
            this.setState({ authorized: false })
            resolve('NOT_AUTHORIZED')
          } else {
            this.setState({ authorized: true })
            resolve('AUTHORIZED')
          }
        })
      })
    }

  render() {
    if (this.props.update && this.state.status === 'INIT') {
      this.handleRefresh()
    }

    let events = []
    const calendar_events = localStorage.getItem('calendar_events')
    if (calendar_events !== 'undefined') {
      events = JSON.parse(calendar_events)
    }

    let event_table = []
    if (events !== 'No events found' && events !== null) {
      events.forEach(event => {
        const key = event.start + event.summary
        event_table.push(<ListEvent key={key} start={event.start} end={event.end} location={event.location} summary={event.summary}/>)
      })
    } else {
      event_table.push(<tr key={'no_events'}><td>You have no events today</td></tr>)
    }

    const auth = this.state.authorized
    if (auth) {
      return (
        <div>
          <FontAwesomeIcon className={this.state.rotate ? "refresh refresh_clicked" : "refresh"} icon='redo' cursor='pointer' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>
          <Link to={'/calendar'} style={{textDecoration: 'none', color: 'black'}}>
            <table>
              <tbody>
                {event_table}
              </tbody>
            </table>
          </Link>
        </div>
      )
    } else {
      return (
        <div className="not_authenticated_wrapper">
          <div className="not_authenticated">
            <h6>You haven't authenticated your calendar</h6>
            <Button onClick={this.handleRefresh}>Authenticate</Button>
          </div>
        </div>
      )
    }
  }
}

export default Calendar
