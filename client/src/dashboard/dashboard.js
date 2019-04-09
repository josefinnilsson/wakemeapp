import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { isMobileOnly } from 'react-device-detect'
import Calendar from '../calendar/calendar'
import SL from '../sl/sl'
import News from '../news/news'
import Weather from '../weather/weather'
import './dashboard.scss'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  componentDidMount() {
    const background_url = localStorage.getItem('background_url')
    let url = ''
    if (background_url)
      url = JSON.parse(background_url)
    if (typeof url === undefined) {
      url = ''
    }
    this.setState({
      url: url
    })
  }

  getGreeting() {
    const hour = new Date().getHours()
    if (hour > 5 && hour < 12)
      return "Good Morning"
    if (hour >= 12 && hour <= 17)
      return "Good Afternoon"
    else
      return "Good Night"
  }

  render() {
    let update = false
    if (this.props.location.pathname === '/cal')
      update = true

    const CalendarComp = () => {
      return(<div className="col-md-6">
              <div className="calendar">
                <Calendar update={update}/>
              </div>
            </div>)
    }
    const SLComp = () => {
      return(<div className="col-md-6">
              <div className="sl">
                <SL history={this.props.history}/>
              </div>
            </div>)
    }
    const NewsComp = () => {
      return(<div className="col-md-6">
              <div className="news">
                <News/>
              </div>
            </div>)
    }
    const WeatherComp = () => {
      return(<div className="col-md-6">
              <div className="weather">
                <Weather/>
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

    const DesktopView = () => {
      return(
        <div>
          <div className="row">
            <CalendarComp/>
            <SLComp/>
          </div>
          <div className="row">
            <NewsComp/>
            <WeatherComp/>
          </div>
        </div>)
    }
    const greeting = this.getGreeting()
    const name = localStorage.getItem('user_name')
    const unsplashStyle = {
      backgroundImage: 'linear-gradient(to bottom, rgba(250, 250, 250, 0.52), rgba(254, 243, 234, 1)),url(' + this.state.url +')',
      backgroundRepeat: 'no',
      backgroundSize: 'cover'
    }
    const noStyle = {
      backgroundImage: 'none'
    }

    return (
      <div className="dashboard_wrapper" id="dashboard_wrapper" style={this.state.url !== '' ? unsplashStyle : noStyle}>
        <h2>{greeting} {name}!</h2>
        <div className="container">
          {isMobileOnly ? <MobileView/> : <DesktopView/>}
        </div>
      </div>
    )
  }
}
export default Dashboard