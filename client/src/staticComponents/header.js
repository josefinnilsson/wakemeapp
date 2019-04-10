import React, { Component } from 'react'
import './staticComponents.scss'
import settings from '../assets/settings.svg'
import logo from '../assets/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logout } from '../actions/authActions'

const mapStateToProps = state => ({
  auth: state.auth
})

class Header extends Component {
    onLogout = e => {
        console.log('hejhopp')
        e.preventDefault()
        this.props.logout()
    }

  render() {
    let user_settings = false
    if (window.location.pathname === '/userSettings')
        user_settings = true

    const background_url = localStorage.getItem('background_url')
    let backgroundStyle = ''
    if (typeof background_url !== 'undefined' && background_url !== '') {
        backgroundStyle = {
            backgroundColor: 'transparent',
            borderBottom: 'none'
        }
    }
    let noStyle = {
        backgroundColor: 'none',
        borderBottom: 'none'
    }
    const user_settings_wheel = !user_settings ? (<a className="user_settings_wheel" href="/userSettings"><img src={settings} alt="settings" className="settings"/></a>) : ''
    const logout = user_settings && <FontAwesomeIcon className="logout_icon fa-lg" icon='sign-out-alt' onClick={this.onLogout}/>
    return (
        <nav className="navbar" style={backgroundStyle !== '' ? backgroundStyle : noStyle}>
            <div className="container-fluid">
                <div className="navbar-header">
                    <div className="logo_title_wrapper">
                        <img src={logo} alt="" className="logo_header"/>
                        <a className="navbar-brand title" href="/">Wake Me App</a>
                    </div>
                </div>
                {user_settings_wheel}
                {logout}
            </div>
        </nav>
    )
 }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { logout })(Header)