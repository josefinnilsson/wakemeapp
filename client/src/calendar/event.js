import React, { Component } from 'react'
import './calendar.scss';

class Event extends Component {
  //Send as props
  formatTime(time) {
    let formatted_time = time.substring(
        time.lastIndexOf("T") + 1,
        time.lastIndexOf("+")
    )
    return formatted_time.substring(0, formatted_time.length - 3)
  }

  formatLocation(location) {
    const splitted_location = location.split(',')
    if (splitted_location.length > 1) {
        let line_break_location = []
        splitted_location.forEach(i => {
            line_break_location.push(<p key={i} className="address">{i}</p>)
        })
        return line_break_location
    } else {
        return location
    }
  }

  render() {
    return (
      <div className="event_item_wrapper">
        <a href={this.props.link} rel="noopener noreferrer" target="_blank">
          <h5 className="event_title">{this.props.summary}</h5>
          <h6 className="event_time">{this.props.start !== undefined && this.formatTime(this.props.start)} - {this.props.start !== undefined && this.formatTime(this.props.end)}</h6>
          {this.props.location !== 'NO_LOCATION' && <h6 className="event_location">{this.formatLocation(this.props.location)}</h6>}
        </a>
      </div>
    )
  }
}

export default Event