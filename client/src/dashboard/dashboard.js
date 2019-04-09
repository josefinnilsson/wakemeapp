import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { isMobileOnly } from 'react-device-detect'
import Toggle from 'react-toggle'
import Calendar from '../calendar/calendar'
import SL from '../sl/sl'
import News from '../news/news'
import Weather from '../weather/weather'
import './dashboard.scss'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      comps: [
      {
        id: 0,
        name: 'calendar'
      },{
        id: 1,
        name: 'sl'
      },{
        id: 2,
        name: 'news'
      },{
        id: 3,
        name: 'weather'
      }],
      dragAllowed: false
    }

    this.moveComp = this.moveComp.bind(this)
    this.dragAllowed = this.dragAllowed.bind(this)
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
      return "Good Evening"
  }

  dragAllowed() {
    this.setState({
      dragAllowed: !this.state.dragAllowed
    })
  }

  moveComp(id, index) {
    let { comps } = this.state;
    let sourceComp = comps[id].name
    comps[id].name = comps[index].name
    comps[index].name = sourceComp
    this.setState({ comps: comps });
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
                <Calendar id={calendarId} update={update} moveComp={this.moveComp} dragAllowed={this.state.dragAllowed}/>
              </div>
            </div>)
    }
    const SLComp = () => {
      return(<div className="col-md-6">
              <div className="sl">
                <SL id={slId} history={this.props.history} moveComp={this.moveComp} dragAllowed={this.state.dragAllowed}/>
              </div>
            </div>)
    }
    const NewsComp = () => {
      return(<div className="col-md-6">
              <div className="news">
                <News id={newsId} moveComp={this.moveComp} dragAllowed={this.state.dragAllowed}/>
              </div>
            </div>)
    }
    const WeatherComp = () => {
      return(<div className="col-md-6">
              <div className="weather">
                <Weather id={weatherId} moveComp={this.moveComp} dragAllowed={this.state.dragAllowed}/>
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
        return (<WeatherComp/>);
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
        <label><Toggle defaultChecked={this.state.dragAllowed}
                icons={{checked: null,
                        unchecked: null}}
                onChange={this.dragAllowed}/><span>Move components</span></label>

      </div>
    )
  }
}

export default Dashboard