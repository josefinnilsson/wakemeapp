import React, { Component } from 'react'
import './calendar.scss';

class Event extends Component {
  render() {
    return (
      <div>
      <h3 className="event_title">{this.props.summary}</h3>
      </div>
    )
  }
}

export default Event