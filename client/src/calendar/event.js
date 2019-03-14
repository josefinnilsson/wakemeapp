import React, { Component } from 'react'
import './calendar.css';

class Event extends Component {
  formatTime(time) {
    return time.substring(
      time.lastIndexOf("T") + 1,
      time.lastIndexOf("+")
    )
  }

  render() {
    return (
      <tr>
        <td>{this.props.summary}</td>
        <td>{this.formatTime(this.props.start)}</td>
      </tr>
    )
  }
}

export default Event