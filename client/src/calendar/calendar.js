import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './calendar.scss'
import Event from './event'
import { Button } from 'react-bootstrap'
import { DragSource, DropTarget } from 'react-dnd'
import _ from 'lodash'
import { Types, CompSource, CompTarget, collectSource, collectTarget } from '../actions/dndActions'
import PropTypes from 'prop-types'

class Calendar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			status: 'INIT',
			events: [],
			authorized: true,
			rotate: false
		}

		this.handleRefresh = this.handleRefresh.bind(this)
		this.isAuth = this.isAuth.bind(this)
	}

	componentDidMount() {
		this.isAuth().then(auth => {
			if (auth === 'AUTHORIZED')
				this.handleRefresh()
		})
	}

	handleRefresh(e) {
		// called by refresh button
		if (typeof e !== 'undefined') {
			this.setState({
				rotate: true
			})
		}
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
				event_table.push(<Event key={key} start={event.start} end={event.end} longEvent={event.longEvent} location={event.location} summary={event.summary} link={event.link}/>)
			})
		} else {
			event_table.push(<p key='no_event'>You have no events today</p>)
		}

		const { connectDragSource, connectDropTarget } = this.props

		const auth = this.state.authorized
		if (auth) {
			return connectDropTarget(connectDragSource(
				<div>
					<div className="coponent_title">
						<h4>Today&apos;s Events</h4>
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
						<h6>To see today’s events here, authenticate your calendar</h6>
						<Button onClick={this.handleRefresh}>Authenticate</Button>
					</div>
				</div>
			))
		}
	}
}

Calendar.propTypes = {
	connectDragSource: PropTypes.func,
	connectDropTarget: PropTypes.func,
}

export default _.flow([DropTarget(Types.COMP, CompTarget, collectTarget),DragSource(Types.COMP, CompSource, collectSource)])(Calendar)
