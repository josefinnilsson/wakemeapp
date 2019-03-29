import React, { Component } from 'react'
import './staticComponents.scss'
import settings from '../assets/settings.svg'
import logo from '../assets/logo.svg'

class Header extends Component {
  render() {
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <div className="navbar-header">
                    <div className="logo_title_wrapper">
                        <img src={logo} alt="" className="logo_header"/>
                        <a className="navbar-brand title" href="/">Wake Me App</a>
                    </div>
                </div>
                <a href="/userSettings"><img src={settings} alt="settings" className="settings"/></a>
            </div>
        </nav>
    )
 }
}

export default Header