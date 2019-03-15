import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './calendar.css'
import Event from './event'

class Calendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'INIT',
            events: [],
        }
        this.handleRefresh = this.handleRefresh.bind(this)
    }

    handleRefresh() {
      fetch('/calendar')
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.url) {
          window.location = data.url
        } else {
          localStorage.setItem('calendar_events', JSON.stringify(data.events))
          localStorage.setItem('has_events', true)
          this.setState({
            status: 'LOADED',
            events: data
          })
        }
      })
    }

    render() {
    const RefreshCalendar = () => {
      return (<button id='refresh_calendar' onClick={this.handleRefresh}>Refresh calendar</button>)
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
        event_table.push(<Event key={key} start={event.start} summary={event.summary}/>)
      })
    } else {
      event_table.push(<tr key={'no_events'}><td>You have no events today</td></tr>)
    }

    return (
      <div>
        <RefreshCalendar/>
        <Link to={'/calendar'} style={{textDecoration: 'none', color: 'black'}}>
          <table>
            <tbody>
              {event_table}
            </tbody>
          </table>
        </Link>
      </div>
    )
  }
}

export default Calendar
