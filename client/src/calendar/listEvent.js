import React, { Component } from 'react'
import './calendar.scss';

class ListEvent extends Component {
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
        <td>{this.props.start !== undefined && this.formatTime(this.props.start)}</td>
        <td>{this.props.end !== undefined && this.formatTime(this.props.end)}</td>
      </tr>
    )
  }
}

export default ListEvent