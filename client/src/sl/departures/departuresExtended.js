import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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

    return (
      <div className='container'>
        <div>
          <Link to='/'><button>Back to dashboard</button></Link>
          <div className='departures_extended'>
          <h3>Departures</h3>
          <table>
            <tbody>
              {departures}
            </tbody>
          </table>
          <h3>Departures with no real time</h3>
          <table>
            <tbody>
              {no_real_time_departures}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    )
  }
}

export default DeparturesExtended