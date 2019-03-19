import React, { Component } from 'react'
import './staticComponents.scss'

class Header extends Component {
  render() {

    return (
        <div className="container">
            <div className="col-md-12">
                <h1>Wake Me App</h1>
            </div>
        </div>
    )
  }
}

export default Header