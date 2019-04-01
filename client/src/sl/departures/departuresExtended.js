import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { isMobileOnly } from 'react-device-detect'
import '../sl.scss'
import Departures from './departures'


class DeparturesExtended extends Component {
  render() {
    let departure_info = JSON.parse(localStorage.getItem('departure_info'))
    let departures = []
    for(let i = 0; i < departure_info.length; i++) {
      let departure = departure_info[i]
      departures.push(<Departures key={departure.JourneyNumber + i} transport={departure.TransportMode} line={departure.LineNumber}
        destination={departure.Destination} exp_time={departure.DisplayTime}/>)
    }

    let no_real_time = JSON.parse(localStorage.getItem('no_real_time'))
    let no_real_time_departures = []
    for(let i = 0; i < no_real_time.length; i++) {
      let departure = no_real_time[i]
      no_real_time_departures.push(<Departures key={departure.JourneyNumber + i} transport={departure.TransportMode} line={departure.LineNumber}
        destination={departure.Destination} exp_time={departure.DisplayTime}/>)
    }


    const RealTime = () => {
      return (  <div className='departures_extended real_time'>
                  <table>
                  <tbody>
                    {departures}
                  </tbody>
                  </table>
                </div>)
    }

    const NoRealTime = () => {
      return (<div className='departures_extended no_real_time'>
              {no_real_time_departures.length > 0 ? (<div><table>
                <tbody>
                {no_real_time_departures}
                </tbody>
              </table></div>) : (<p>No information available</p>)}
              </div>)
    }

    const MobileView = () => {
      return (<Tabs>
                <TabPanel>
                  <RealTime/>
                </TabPanel>
                <TabPanel>
                  <NoRealTime/>
                </TabPanel>
                <TabList>
                  <Tab>Real Time</Tab>
                  <Tab>No Real Time</Tab>
                </TabList>
              </Tabs>)
    }

    const DesktopView = () => {
      return (<div className='row departures_wrapper'>
            <div className={no_real_time_departures.length > 0 ? 'col-md-6' : 'col-md-12'}>
              <h2>Real Time</h2>
              <RealTime/>
            </div>
            {no_real_time.length > 0 ? (
            <div className='col-md-6'>
              <h2>No Real Time</h2>
              <NoRealTime/>
            </div>) : ''}
          </div>)
    }
    return (
      <div className='container'>
       {isMobileOnly ? <MobileView/> : <DesktopView/>}
      </div>
    )
  }
}

export default DeparturesExtended