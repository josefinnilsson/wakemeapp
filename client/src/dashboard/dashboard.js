import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { isMobileOnly } from 'react-device-detect'
import axios from 'axios'
import Calendar from '../calendar/calendar'
import SL from '../sl/sl'
import News from '../news/news'
import Weather from '../weather/weather'
import './dashboard.scss'
import { ToastContainer } from 'react-toastify'
import PropTypes from 'prop-types'

class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			comps: [
				{
					id: 0,
					name: localStorage.getItem('firstComp')
				},{
					id: 1,
					name: localStorage.getItem('secondComp')
				},{
					id: 2,
					name: localStorage.getItem('thirdComp')
				},{
					id: 3,
					name: localStorage.getItem('fourthComp')
				}],
			dragAllowed: false
		}

		this.moveComp = this.moveComp.bind(this)
	}

	getGreeting() {
		const hour = new Date().getHours()
		if (hour > 5 && hour < 12)
			return 'Good Morning'
		if (hour >= 12 && hour <= 17)
			return 'Good Afternoon'
		else
			return 'Good Evening'
	}

	moveComp(id, index) {
		let { comps } = this.state
		let sourceComp = comps[id].name
		comps[id].name = comps[index].name
		comps[index].name = sourceComp

		const userSettingsComponents = {
			firstComp: comps[0].name,
			secondComp: comps[1].name,
			thirdComp: comps[2].name,
			fourthComp: comps[3].name
		}
		axios.post('/updateUserSettingsComponents/'+ localStorage.getItem('email'), userSettingsComponents)
			.then(() => {
				localStorage.setItem('firstComp', comps[0].name)
				localStorage.setItem('secondComp', comps[1].name)
				localStorage.setItem('thirdComp', comps[2].name)
				localStorage.setItem('fourthComp', comps[3].name)
				this.setState({ comps: comps })
			})
	}

	render() {
		let update = false
		if (this.props.location.pathname === '/cal')
			update = true

		const comps = this.state.comps
		const calendarId = comps.find(comp => {return comp.name === 'calendar'}).id
		const slId = comps.find(comp => {return comp.name === 'sl'}).id
		const newsId = comps.find(comp => {return comp.name === 'news'}).id
		const weatherId = comps.find(comp => {return comp.name === 'weather'}).id
		const CalendarComp = () => {
			return(<div className="col-md-6">
				<div className="calendar">
					<Calendar id={calendarId} update={update} moveComp={this.moveComp}/>
				</div>
			</div>)
		}
		const SLComp = () => {
			return(<div className="col-md-6">
				<div className="sl">
					<SL id={slId} history={this.props.history} moveComp={this.moveComp}/>
				</div>
			</div>)
		}
		const NewsComp = () => {
			return(<div className="col-md-6">
				<div className="news">
					<News id={newsId} moveComp={this.moveComp}/>
				</div>
			</div>)
		}
		const WeatherComp = () => {
			return(<div className="col-md-6">
				<div className="weather">
					<Weather id={weatherId} moveComp={this.moveComp}/>
				</div>
			</div>)
		}
		const MobileView = () => {
			return (<Tabs>
				<div id="mobile">
					<TabPanel>
						<CalendarComp/>
					</TabPanel>
					<TabPanel>
						<SLComp/>
					</TabPanel>
					<TabPanel>
						<NewsComp/>
					</TabPanel>
					<TabPanel>
						<WeatherComp/>
					</TabPanel>
				</div>
				<TabList>
					<Tab>Calendar</Tab>
					<Tab>SL</Tab>
					<Tab>News</Tab>
					<Tab>Weather</Tab>
				</TabList>
			</Tabs>)
		}

		const renderSwitch = (comp) => {
			switch(comp.name) {
			case 'calendar':
				return (<CalendarComp/>)
			case 'sl':
				return (<SLComp/>)
			case 'news':
				return (<NewsComp/>)
			default:
				return (<WeatherComp/>)
			}
		}
		const DesktopView = () => {
			return(
				<div>
					<div className="row">
						{renderSwitch(comps[0])}
						{renderSwitch(comps[1])}
					</div>
					<div className="row">
						{renderSwitch(comps[2])}
						{renderSwitch(comps[3])}
					</div>
				</div>)
		}
		const greeting = this.getGreeting()
		const name = localStorage.getItem('user_name')

		return (
			<div className="dashboard_wrapper" id="dashboard_wrapper">
				<ToastContainer autoClose={10000}/>
				<h2>{greeting} {name}!</h2>
				<div className="container">
					{isMobileOnly ? <MobileView/> : <DesktopView/>}
				</div>
			</div>
		)
	}
}

Dashboard.propTypes = {
	response: PropTypes.object,
	location: PropTypes.object,
	history: PropTypes.object,
}

export default Dashboard