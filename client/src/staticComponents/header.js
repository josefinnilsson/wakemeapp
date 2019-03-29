import React, { Component } from 'react'
import './staticComponents.scss'
import settings from '../assets/settings.svg'

class Header extends Component {
  render() {
    let user_settings = false
    console.log(window.location.pathname)
    if (window.location.pathname === '/userSettings')
        user_settings = true

    const user_settings_wheel = !user_settings ? (<a className="user_settings_wheel" href="/userSettings"><img src={settings} alt="settings" className="settings"/></a>) : ''
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand title" href="/">Wake Me App</a>
                </div>
                {user_settings_wheel}
            </div>
        </nav>
    )
 }
}

export default Header