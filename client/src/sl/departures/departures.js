import React, { Component } from 'react';
import '../sl.css';

class Departures extends Component {
  render() {
    let transport = ''
    // Later on we will use icons for each transport mode
    switch(this.props.transport) {
              case 'BUS':
                transport = 'B'
                break
              case 'METRO':
                transport = 'M'
                break
              case 'TRAIN':
                transport = 'T1'
                break
              case 'TRAM':
                transport = 'T2'
                break
              case 'SHIP':
                transport = 'S'
                break
              default:
                transport = ''
            }
    return (
      <tr>
        <td>{transport}</td>
        <td>{this.props.line}</td>
        <td>{this.props.destination}</td>
        <td>{this.props.exp_time}</td>
      </tr>
    )
  }
}

export default Departures