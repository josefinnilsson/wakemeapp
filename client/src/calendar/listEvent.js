import React, { Component } from 'react'
import './calendar.scss';

class ListEvent extends Component {
  //Send as props
  formatTime(time) {
    let formatted_time = time.substring(
      time.lastIndexOf("T") + 1,
      time.lastIndexOf("+")
    )
    return formatted_time.substring(0, formatted_time.length - 3)
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