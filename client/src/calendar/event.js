import React, { Component } from 'react'
import './calendar.scss';

class Event extends Component {
  formatTime(time) {
    return time.substring(
        time.lastIndexOf("T") + 1,
        time.lastIndexOf("+")
    )
  }

  formatLocation(location) {
    const splitted_location = location.split(',')
    if (splitted_location.length > 1) {
        let line_break_location = []
        splitted_location.forEach(i => {
            line_break_location.push(<p className="address">{i}</p>)
        })
        return line_break_location
    } else {
        return location
    }
  }

  render() {
    return (
      <div className="event_item_wrapper">
        <h3 className="event_title">{this.props.summary}</h3>
        <h6 className="event_time">{this.props.start !== undefined && this.formatTime(this.props.start)} - {this.props.start !== undefined && this.formatTime(this.props.end)}</h6>
        <h6 className="event_location">{this.props.location !== 'NO_LOCATION' && this.formatLocation(this.props.location)}</h6>
      </div>
    )
  }
}

export default Event