import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../sl.scss';

class Departures extends Component {
  render() {
    let transport = ''
    // Later on we will use icons for each transport mode
    switch(this.props.transport) {
              case 'BUS':
                transport = <FontAwesomeIcon className="transportation" icon='bus'/>
                break
              case 'METRO':
                transport = <FontAwesomeIcon className="transportation" icon='subway'/>
                break
              case 'TRAIN':
                transport = <FontAwesomeIcon className="transportation" icon='train'/>
                break
              case 'TRAM':
                transport = <FontAwesomeIcon className="transportation" icon='tram'/>
                break
              case 'SHIP':
                transport = <FontAwesomeIcon className="transportation" icon='ship'/>
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