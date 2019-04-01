import React, { Component } from 'react'
import './calendar.scss'
import Event from './event'

class CalendarExtended extends Component {
  render() {
    let events = localStorage.getItem('calendar_events')
    let event_components = []
    if (localStorage.getItem('has_events') === true && events !== null) {
      events.forEach(event => {
        const key = event.start + event.summary
        event_components.push(
          <div className="event_wrapper">
            <a href={event.link}>
              <Event key={key} start={event.start} end={event.end} location={event.location} summary={event.summary}/>
            </a>
          </div>
        )
      })
    } else {
      event_components.push(<h3 className="event_title">You have no events today</h3>)
    }
    return (
      <div className="calenadar_extended_wrapper">
        <h2 className="calendar_extended_title">Today's Events</h2>
        {event_components}
      </div>
    )
  }
}

export default CalendarExtended