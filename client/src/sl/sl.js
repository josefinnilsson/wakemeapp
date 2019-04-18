import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './sl.scss'
import Departures from './departures/departures'
import {Button} from 'react-bootstrap'
import { isMobileOnly } from 'react-device-detect'
import { DragSource, DropTarget } from 'react-dnd'
import _ from 'lodash'
import { Types, CompSource, CompTarget, collectSource, collectTarget } from '../actions/dndActions'
import PropTypes from 'prop-types'

class SL extends Component {
	constructor(props) {
		super(props)
		this.state = {
			status: 'INIT',
			departures: [],
			departures_no_real_time: [],
			rotate: false
		}

		this.handleRefresh = this.handleRefresh.bind(this)
	}

	componentDidMount() {
		this.handleRefresh()
	}

	handleRefresh(e) {
		// called by refresh button
		if (typeof e !== 'undefined') {
			this.setState({
				rotate: true
			})
		}
		let station_id = localStorage.getItem('user_station_id')
		if (station_id === '-1')
			return

		let transport_mode = '/' + localStorage.getItem('user_bus') +
                         '/' + localStorage.getItem('user_metro') +
                         '/' + localStorage.getItem('user_train') +
                         '/' + localStorage.getItem('user_tram') +
                         '/' + localStorage.getItem('user_ship')

		let url2 = '/getRealTime/' + parseInt(station_id) + transport_mode
		fetch(url2)
			.then(response => {
				return response.json()})
			.then(data => {
				localStorage.setItem('departure_info', JSON.stringify(data[0]))
				localStorage.setItem('no_real_time', JSON.stringify(data[1]))
				localStorage.setItem('has_departures', true)
				this.setState({
					status: 'LOADED',
					departures: data[0],
					departures_no_real_time: data[1]
				})
			})
			.catch(err => {
				console.log("Couldn't fetch departures")
			})
	}

	render() {
		//Temporary check to make fewer api-calls, should maybe use init status later
		let departure_info = []
		if (localStorage.getItem('has_departures') !== null) {
			departure_info = JSON.parse(localStorage.getItem('departure_info'))
		}
		let departures = []
		for(let i = 0; i < departure_info.length; i++) {
			let departure = departure_info[i]
			departures.push(<Departures key={departure.JourneyNumber + i} transport={departure.TransportMode} line={departure.LineNumber}
				destination={departure.Destination} exp_time={departure.DisplayTime}/>)
		}

		const { connectDragSource, connectDropTarget } = this.props
		if (localStorage.getItem('user_station_id') === '-1') {
			return connectDropTarget(connectDragSource(<div className="not_authenticated_wrapper">
				<div className="not_authenticated">
					<h6>To see coming departures, update your settings</h6>
					<a href="/userSettings"><Button>Settings</Button></a>
				</div>
			</div>))
		} else if (departures.length <= 0) {
			return connectDropTarget(connectDragSource(<div className="not_authenticated_wrapper">
				<div className="not_authenticated">
					<h6>No departures the coming 30 minutes</h6>
					<Button onClick={this.handleRefresh}>Refresh</Button>
				</div>
			</div>))
		} else {
			return connectDropTarget(connectDragSource(
				<div>
					<div className="coponent_title">
						<h4>Next Departures at {localStorage.getItem('user_station_name')}</h4>
						<FontAwesomeIcon className={this.state.rotate ? 'refresh refresh_clicked' : 'refresh'} icon='redo' cursor='pointer' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>
					</div>
						<table>
							<tbody>
								{isMobileOnly ? departures.slice(0, 10) : departures.slice(0, 6)}
							</tbody>
						</table>
					<div className="more_departures">
						<Link className="more_departures_button" to={'/departures'}>More departures</Link>
					</div>
				</div>))
		}
	}
}

SL.propTypes = {
	connectDragSource: PropTypes.func,
	connectDropTarget: PropTypes.func,
	history: PropTypes.object.isRequired,
}

export default _.flow([DropTarget(Types.COMP, CompTarget, collectTarget),DragSource(Types.COMP, CompSource, collectSource)])(SL)