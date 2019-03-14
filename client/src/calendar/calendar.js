import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import './calendar.css';

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
            events: JSON.stringify(data)
          })
        }
      })
    }

    render() {
    const RefreshCalendar = () => {
      return (<button id='refresh_calendar' onClick={this.handleRefresh}>Refresh calendar</button>)
    }

    return (
      <div>
        <RefreshCalendar/>
        <div>
          <p>{this.state.events}</p>
          <p>{this.state.events}</p>
        </div>
      </div>
    )
  }
}

export default Calendar