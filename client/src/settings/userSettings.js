import React, { Component } from 'react'
import './userSettings.scss'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BackgroundToggle from '../settings/backgroundToggle'
import {Form, Button} from 'react-bootstrap'
import Select from 'react-select'
import Footer from '../staticComponents/footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import { isMobileOnly } from 'react-device-detect'

class UserSettings extends Component {
	constructor(props) {
		super(props)

		this.state = {
			user_saved: false,
			all_stations: [],
			active_station: localStorage.getItem('user_station_name'),
			active_station_id: 0,
			bus: localStorage.getItem('user_bus') === 'true' ? true : false,
			metro: localStorage.getItem('user_metro') === 'true' ? true : false,
			train: localStorage.getItem('user_train') === 'true' ? true : false,
			tram: localStorage.getItem('user_tram') === 'true' ? true : false,
			ship: localStorage.getItem('user_ship') === 'true' ? true : false,
			search: '',
			is_mounted: false
		}

		this.handleSaveSubmit = this.handleSaveSubmit.bind(this)
		this.handleStationChange = this.handleStationChange.bind(this)
		this.handleBusChange = this.handleBusChange.bind(this)
		this.handleMetroChange = this.handleMetroChange.bind(this)
		this.handleTrainChange = this.handleTrainChange.bind(this)
		this.handleShipChange = this.handleShipChange.bind(this)
		this.handleTramChange = this.handleTramChange.bind(this)
	}

	componentDidMount() {
		this.setState({ is_mounted: true })
		fetch('/getAllStations')
			.then(response => {
				return response.json()
			})
			.then(result => {
				if (this.state.is_mounted)
					this.setState({
						all_stations: result
					})
			})
	}

	componentWillUnmount() {
		this.setState({ is_mounted: false })
	}

	changeAccount() {
		fetch('/change_calendar')
			.then(response => {
				return response.json()
			})
			.then(data => {
				console.log(data)
				if (data.url) {
					window.location = data.url
				}
			})
	}

	handleSaveSubmit(e) {
		e.preventDefault()
		let stationName = this.state.active_station
		if (this.state.active_station === '')
			stationName = localStorage.getItem('user_station_name')
		let stationId = this.state.active_station_id
		if (this.state.active_station_id === 0)
			stationId = localStorage.getItem('user_station_id')
		const bus = this.state.bus
		const metro = this.state.metro
		const train = this.state.train
		const tram = this.state.tram
		const ship = this.state.ship
		const userSettings = {
			stationName: stationName,
			stationId: stationId,
			bus: bus,
			metro: metro,
			train: train,
			tram: tram,
			ship: ship
		}

		axios.post('/updateUserSettings/' + localStorage.getItem('email'), userSettings)
			.then(() => {
				toast('Settings saved, visit the dashboard to see your changes!', {
					className: 'success_notification',
					bodyClassName: 'success_notification',
					progressClassName: 'success_notification',
				})
				localStorage.setItem('user_station_name', stationName)
				localStorage.setItem('user_station_id', stationId)
				localStorage.setItem('user_bus', bus)
				localStorage.setItem('user_metro', metro)
				localStorage.setItem('user_train', train)
				localStorage.setItem('user_tram', tram)
				localStorage.setItem('user_ship', ship)
				this.setState({
					user_saved: true
				})
			})
			.catch(err => {
				toast.error('An error occured, try again!')
				console.log(err)
			})
	}

	handleStationChange(e) {
		this.setState({
			active_station: e.label,
			active_station_id: e.value
		})
	}

	handleBusChange() {
		this.setState({ bus: !this.state.bus })
	}

	handleMetroChange() {
		this.setState({ metro: !this.state.metro })
	}

	handleTrainChange() {
		this.setState({ train: !this.state.train })
	}

	handleTramChange() {
		this.setState({ tram: !this.state.tram })
	}

	handleShipChange() {
		this.setState({ ship: !this.state.ship })
	}

	onLogout(e) {
		e.preventDefault()
		this.props.logout()
	}

	render() {
		const colorStyles = {
			control: (base) => ({
				...base,
				boxShadow: 'none',
				border: 'none'
			})
		}

		const back_btn = !isMobileOnly && <a className="back_btn settings_back_btn fa-lg" href="/"><FontAwesomeIcon icon="arrow-left"/></a>
		return (
			<div className="settings_wrapper">
				{back_btn}
				<h2 className="settings_title">Settings</h2>
				<ToastContainer />
				<div className="settings_form_wrapper">
					<div className="settings_form">
						<h4>Theme</h4>
						<BackgroundToggle/>
					</div>
				</div>
				<div className="settings_form_wrapper">
					<div className="settings_form">
						<h4>Calendar</h4>
						<Button variant="primary" type="submit" onClick={this.changeAccount}>Change Account</Button>
					</div>
				</div>
				<div className="settings_form_wrapper">
					<div className="settings_form">
						<h4>Departures</h4>
						<h6>Current station: {this.state.active_station !== '' ? this.state.active_station : ' None'}</h6>

						<Select className="select_station" styles={colorStyles} defaultValue={this.state.active_station} options={this.state.all_stations} onChange={this.handleStationChange}/>
						<div className="transportation_options">
							<Form onSubmit={this.handleSaveSubmit}>
								<div className="check_boxes">
									<Form.Check defaultChecked={this.state.bus} inline label="Bus" type={'checkbox'} id={'bus'} onChange={this.handleBusChange}/>
									<Form.Check defaultChecked={this.state.metro} inline label="Metro" type={'checkbox'} id={'metro'} onChange={this.handleMetroChange}/>
									<Form.Check defaultChecked={this.state.ship} inline label="Ship" type={'checkbox'} id={'ship'} onChange={this.handleShipChange}/>
									<Form.Check defaultChecked={this.state.train} inline label="Train" type={'checkbox'} id={'train'} onChange={this.handleTrainChange}/>
									<Form.Check defaultChecked={this.state.tram} inline label="Tram" type={'checkbox'} id={'tram'} onChange={this.handleTramChange}/>
								</div>
								<Button className="save_btn settings_btn" type="submit">Save</Button>
							</Form>
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		)
	}
}

UserSettings.propTypes = {
	logout: PropTypes.func.isRequired
}

export default UserSettings