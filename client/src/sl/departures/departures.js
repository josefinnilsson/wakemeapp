import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../sl.scss';

class Departures extends Component {
  render() {
    let transport = ''
    // Later on we will use icons for each transport mode
    switch(this.props.transport) {
              case 'BUS':
                transport = <FontAwesomeIcon icon='bus'/>
                break
              case 'METRO':
                transport = <FontAwesomeIcon icon='subway'/>
                break
              case 'TRAIN':
                transport = <FontAwesomeIcon icon='train'/>
                break
              case 'TRAM':
                transport = <FontAwesomeIcon icon='tram'/>
                break
              case 'SHIP':
                transport = <FontAwesomeIcon icon='ship'/>
                break
              default:
                transport = ''
            }
    return (
      <tr>
        <td>{transport} {this.props.line}</td>
        <td>{this.props.destination}</td>
        <td>{this.props.exp_time}</td>
      </tr>
    )
  }
}

export default Departures