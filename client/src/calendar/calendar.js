import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './calendar.scss'
import Event from './event'
import { Button } from 'react-bootstrap'
import { DragSource, DropTarget } from 'react-dnd'
import _ from 'lodash'

const Types = {
  COMP: 'comp',
}

const CompSource = {
   beginDrag(props, monitor, component) {
    const item = { id: props.id }
    return item
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
    const sourceComp = monitor.getItem()
    const dropComp = monitor.getDropResult()
    moveComp(sourceComp.id, dropComp.id)
  }
}

const CompTarget = {
  drop(props) {
    return {
      id: props.id
    }
  }
}

let moveComp = () => {}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

class Calendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'INIT',
            events: [],
            authorized: true,
            rotate: false
        }

        moveComp = this.props.moveComp
        this.handleRefresh = this.handleRefresh.bind(this)
        this.isAuth = this.isAuth.bind(this)
    }

    componentDidMount() {
      this.isAuth().then(auth => {
        if (auth === 'AUTHORIZED')
          this.handleRefresh()
      })
    }

    handleRefresh() {
      this.setState({
        rotate: true
      })
      fetch('/calendar/' + localStorage.getItem('email'))
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.url) {
          window.location = data.url
        } else {
          localStorage.setItem('calendar_events', JSON.stringify(data.events))
          if (data.events === 'No events found') {
            localStorage.setItem('has_events', false)
          } else {
            localStorage.setItem('has_events', true)
          }

          this.setState({
            status: 'LOADED',
            events: data
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }

    isAuth() {
      return new Promise(resolve => {
        fetch('/calendar_authenticated' + localStorage.getItem('email'))
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.authorized === 'NOT_AUTHORIZED') {
            this.setState({ authorized: false })
            resolve('NOT_AUTHORIZED')
          } else {
            this.setState({ authorized: true })
            resolve('AUTHORIZED')
          }
        })
      })
    }

  render() {
    let events = []
    const calendar_events = localStorage.getItem('calendar_events')
    if (calendar_events !== 'undefined') {
      events = JSON.parse(calendar_events)
    }

    let event_table = []
    if (events !== 'No events found' && events !== null) {
      events.forEach(event => {
        const key = event.start + event.summary
        event_table.push(<Event key={key} start={event.start} end={event.end} location={event.location} summary={event.summary} link={event.link}/>)
      })
    } else {
      event_table.push(<tr key={'no_events'}><td>You have no events today</td></tr>)
    }

    const { connectDragSource, connectDropTarget } = this.props

    const auth = this.state.authorized
    if (auth) {
      return connectDropTarget(connectDragSource(
        <div>
          <div className="coponent_title">
            <h4>Today's Events</h4>
            <FontAwesomeIcon className={this.state.rotate ? 'refresh refresh_clicked' : 'refresh'} icon='redo' cursor='pointer' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>
          </div>
          <div className="calendar_wrapper">
            {event_table}
          </div>
        </div>
      ))
    } else {
      return connectDropTarget(connectDragSource(
        <div className="not_authenticated_wrapper">
          <div className="not_authenticated">
            <h6>You haven't authenticated your calendar</h6>
            <Button onClick={this.handleRefresh}>Authenticate</Button>
          </div>
        </div>
      ))
    }
  }
}

export default _.flow([DropTarget(Types.COMP, CompTarget, collectTarget),DragSource(Types.COMP, CompSource, collectSource)])(Calendar)
