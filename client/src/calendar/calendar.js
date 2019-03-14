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
          window.open(data.url, '_blank')
        } else {
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

    const events = this.state.events
    let event_table = []
    events.forEach(event => {
      const key = event.start + event.summary
      event_table.push(<Event key={key} start={event.start} summary={event.summary}/>)
    })

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