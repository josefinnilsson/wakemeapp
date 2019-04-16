import React, { Component } from 'react'
import './calendar.scss'
import PropTypes from 'prop-types'

class Event extends Component {
	formatTime(time) {
		let formatted_time = time.substring(
			time.lastIndexOf('T') + 1,
			time.lastIndexOf('+')
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
		const event = <h6 className="event_time">{this.props.start !== undefined && this.formatTime(this.props.start)} - {this.props.start !== undefined && this.formatTime(this.props.end)}</h6>
		const longEvent = <h6 className="event_time">{this.props.start && 'All day'}</h6>
		return (
			<div className="event_item_wrapper">
				<a href={this.props.link} rel="noopener noreferrer" target="_blank">
					<h5 className="event_title">{this.props.summary}</h5>
					{this.props.longEvent === true ? longEvent : event}
					{this.props.location !== 'NO_LOCATION' && <h6 className="event_location">{this.formatLocation(this.props.location)}</h6>}
				</a>
			</div>
		)
	}
}

Event.propTypes = {
	link: PropTypes.string,
	summary: PropTypes.string,
	start: PropTypes.string,
	end: PropTypes.string,
	location: PropTypes.string,
	longEvent: PropTypes.bool,
}

export default Event