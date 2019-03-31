import React, { Component } from 'react'
import './calendar.scss'
import Event from './event'

class CalendarExtended extends Component {
  render() {
    let events = localStorage.getItem('calendar_events')
    let event_components = []
    if (events !== 'No events found' && events !== null) {
      events = JSON.parse(events)
      events.forEach(event => {
        console.log(event)
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
      event_components.push(<h3>You have no events today</h3>)
    }
    return (
      <div>
        <h2>Today's Events</h2>
        {event_components}
      </div>
    )
  }
}

export default CalendarExtended