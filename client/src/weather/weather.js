import React, { Component } from 'react'
import './weather.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Moment from 'react-moment'
import sunrise_icon from '../assets/sunrise.png'
import sunset_icon from '../assets/sunset.png'
import cloudy_icon from '../assets/cloudy.svg'
import drizzle_icon from '../assets/drizzle.svg'
import rainy_icon from '../assets/rainy.svg'
import snowy_icon from '../assets/snowy.svg'
import sunny_icon from '../assets/sunny.svg'
import thunder_icon from '../assets/thunder.svg'
import bright_night_icon from '../assets/bright_night.svg'
import cloudy_night_icon from '../assets/cloudy_night.svg'
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'
import PulseLoader from 'react-spinners/PulseLoader'
import { DragSource, DropTarget } from 'react-dnd'
import _ from 'lodash'
import { Types, CompSource, CompTarget, collectSource, collectTarget } from '../actions/dndActions'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

class Weather extends Component {
	constructor(props) {
		super(props)
		this.state = {
			status: 'INIT',
			latitude: -1,
			longitude: -1,
			rotate: false,
			forecast_loading: false,
			forecast: [],
			error: {code: 0}
		}

		this.handleRefresh = this.handleRefresh.bind(this)
	}

	componentDidMount() {
		this.handleRefresh()
	}

	getLocation() {
		return new Promise(resolve => {
			navigator.geolocation.getCurrentPosition(position => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					status: 'LOADED'
				}, resolve('DONE'))
			}, error => {
				console.log(error)
				this.setState({
					error: error
				})
			})
		})
			.catch(err => {
				console.log(err)
			})
	}

	getWeather(lat, long) {
		fetch('/weather/' + lat + '/' + long)
			.then(response => {
				return response.json()
			})
			.then(data => {
				localStorage.setItem('has_weather_details', true)
				localStorage.setItem('weather', JSON.stringify(data))
				fetch('/getLocationData/' + lat + '/' + long)
					.then(response => {
						return response.json()
					})
					.then(city => {
						localStorage.setItem('current_location', city.name)
						this.setState({
							status: 'LOADED',
							weather: data,
							current_location: city.name
						})
					}).catch(err => {
						console.log("Couldn't fetch current location")
					})
				}).catch(err => {
					console.log("Couldn't fetch weather data")
				})
	}

	getForecast(lat, long) {
		fetch('/weather_forecast/' + lat + '/' + long)
			.then(response => {
				return response.json()
			})
			.then(data => {
				this.setState({
					forecast: data,
					forecast_loading: false
				})
			}).catch(err => {
				console.log("Couldn't fetch forecast")
			})
	}

	handleRefresh(e) {
		// called by refresh button
		if (typeof e !== 'undefined') {
			this.setState({
				rotate: true,
				forecast_loading: true
			})
		} else {
			this.setState({
				forecast_loading: true
			})
		}
		this.getLocation()
			.then(() => {
				const lat = this.state.latitude
				const long = this.state.longitude
				this.getWeather(lat, long)
				this.getForecast(lat, long)
			})
	}

	parseDescription(description) {
		return description.charAt(0).toUpperCase() + description.slice(1)
	}

	isNight(sunset_unix, sunrise_unix) {
		const date = new Date()
		const sunset = new Date(sunset_unix*1000)
		const sunrise = new Date(sunrise_unix*1000)
		if (date.getHours() === sunset.getHours())
			return date.getMinutes() > sunset.getMinutes() ? true : false
		else if (date.getHours() === sunrise.getHours())
			return date.getMinutes() < sunrise.getMinutes() ? true : false
		else
			return date.getHours() > sunset.getHours() || date.getHours() < sunrise.getHours ? true : false
	}

	getIcon(icon, sunset, sunrise) {
		switch(icon) {
		case 'CLOUD':
			if (this.isNight(sunset, sunrise))
				return <img src={cloudy_night_icon} alt="" className="weather_icon"/>
			return <img src={cloudy_icon} alt="" className="weather_icon"/>
		case 'DRIZZLE':
			return <img src={drizzle_icon} alt="" className="weather_icon"/>
		case 'RAIN':
			return <img src={rainy_icon} alt="" className="weather_icon"/>
		case 'SNOW':
			return <img src={snowy_icon} alt="" className="weather_icon"/>
		case 'SUN':
			if (this.isNight(sunset))
				return <img src={bright_night_icon} alt="" className="weather_icon"/>
			return <img src={sunny_icon} alt="" className="sunny_icon"/>
		case 'THUNDER':
			return <img src={thunder_icon} alt="" className="weather_icon"/>
		default:
			break
		}
	}

	render() {
		const RefreshWeather = () => {
			return (<FontAwesomeIcon className={this.state.rotate ? 'refresh refresh_clicked' : 'refresh'} icon='redo' cursor='pointer' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>)
		}
		const CustomTooltip = ({ active, payload }) => {
			if (active) {
				const temp = payload[0].value.toFixed(1) + '\u00b0 C'
				return (
					<div className="custom-tooltip">
						<p className="label">{`${temp}`}</p>
					</div>
				)
			}
			return null
		}
		let weather = localStorage.getItem('weather')
		const location = localStorage.getItem('current_location')
		const data = this.state.forecast

		const { connectDragSource, connectDropTarget } = this.props

		const loading_text = this.state.forecast_loading && <div className="loading_text">Loading forecast, this may take a while...</div>

		const forecast = this.state.forecast_loading &&
		<div className="loading_icon_wrapper">
			<div className="loading_icon">
				<PulseLoader
					sizeUnit={'px'}
					size={15}
					color={'#8AD2A2'}
					loading={this.state.forecast_loading}
				/>
				{loading_text}
			</div>
		</div>

		if (this.state.latitude === -1 || this.state.longitude === -1 || this.state.error.code === 2) {
			return connectDropTarget(connectDragSource(
				<div className="not_authenticated_wrapper">
					<div className="not_authenticated">
						<h6>Your position is not available at the moment</h6>
						<Button onClick={this.handleRefresh}>Refresh</Button>
					</div>
				</div>))
		} else if (localStorage.getItem('has_weather_details') === 'true' && weather !== null) {
			weather = JSON.parse(weather)
			const icon = this.getIcon(weather.icon, weather.sunset, weather.sunrise)
			return connectDropTarget(connectDragSource(
				<div className="weather_drag">
					<div className="coponent_title">
						<h4>Weather in {location}</h4>
						<RefreshWeather/>
					</div>
					<div className="container">
						<div className="row">
							<div className="col-md-5">
								<div className="weather_info">
									<div className="weather_row">
										{icon}
										<h3 className="weather_title">{weather.temp.toFixed(1) + ' \u00b0'}C</h3>
									</div>
									<div className="row sunset_sunrise">
										<div className="col-md-6">
											<div className="sunrise_sunset">
												<img src={sunrise_icon} alt="" className="sunrise_icon"/>
												<h6 className="weather_title"><Moment format="HH:mm" unix>{weather.sunrise}</Moment></h6>
											</div>
										</div>
										<div className="col-md-6">
											<div className="sunrise_sunset">
												<img src={sunset_icon} alt="" className="sunrise_icon"/>
												<h6 className="weather_title"><Moment format="HH:mm" unix>{weather.sunset}</Moment></h6>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-7" id="forecast">
								{forecast}
								{!this.state.forecast_loading && this.state.forecast &&
									<div className="forecast_outer">
										<div className="forecast_inner">
											<ResponsiveContainer>
												<LineChart width={300} height={200} data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>>
													<XAxis minTickGap={1} dataKey="hour"/><YAxis width={40}/>
													<Tooltip content={<CustomTooltip />} />
													<Line type="monotone" dataKey="Temperature" stroke="#8AD2A2" />
												</LineChart>
											</ResponsiveContainer>
										</div>
									</div>
								}
							</div>
						</div>
					</div>
				</div>
			))
		} else {
			return connectDropTarget(connectDragSource(
				<div>
					<RefreshWeather/>
				</div>
			))
		}
	}
}

Weather.propTypes = {
	connectDragSource: PropTypes.func,
	connectDropTarget: PropTypes.func,
}


export default _.flow([DropTarget(Types.COMP, CompTarget, collectTarget),DragSource(Types.COMP, CompSource, collectSource)])(Weather)