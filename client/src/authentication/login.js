import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../actions/authActions'
import './authentication.scss'
import logo from '../assets/logo.svg'
import {Form, Button} from 'react-bootstrap'
import classnames from 'classnames'

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

const items_to_remove = ['email', 'user_station_name', 'user_station_id', 'user_bus', 'user_metro', 'user_train',
            'user_tram', 'user_ship', 'departure_info', 'has_departures', 'no_real_time', 'calendar_events',
            'has_event', 'news']

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errors: '',
        }

        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillReceiveProps(next_props) {
        if (next_props.errors) {
            console.log('propr errors ' + next_props.errors)
            this.setState({ errors: next_props.errors })
        }
        if (next_props.auth.is_authenticated) {

            for (let i = 0; i < items_to_remove.length; i++) {
                localStorage.removeItem(items_to_remove[i])
            }

            localStorage.setItem('email', this.state.email)
            fetch('/getUserSettings/' + this.state.email)
            .then(response => {
              return response.json()})
            .then(data => {
              localStorage.setItem('user_name', data.name)
              localStorage.setItem('user_station_name', data.station_name)
              localStorage.setItem('user_station_id', data.station_id)
              localStorage.setItem('user_bus', data.bus)
              localStorage.setItem('user_metro', data.metro)
              localStorage.setItem('user_train', data.train)
              localStorage.setItem('user_tram', data.tram)
              localStorage.setItem('user_ship', data.ship)
              this.props.history.push('/')
          })
        }
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value })
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault()
        const user = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.login(user)
    }

    render() {
        const { errors } = this.state
        return (
            <div className="login">
                <h1 className="title">Wake Me App</h1>
                <div className="login_form_wrapper">
                    <img src={logo} alt="" className="logo"/>
                    <div className="login_form">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="form_email">
                                <Form.Control type="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} className={classnames("", {invalid: errors.email})}/>
                                <div className="error_wrap">
                                    <p className="error small">{errors.email}</p>
                                </div>
                            </Form.Group>
                            <Form.Group controlId="form_password" className="bottom">
                                <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} className={classnames("", {invalid: errors.password})}/>
                                <div className="error_wrap">
                                    <p className="error small">{errors.password}</p>
                                    <p className="error small">{errors.credentials}</p>
                                    <p className="error small">{errors.general}</p>
                                </div>
                            </Form.Group>
                            <div className="login_button">
                                <Button variant="primary" type="submit">Login</Button>
                            </div>
                            <div className="register_text">
                                <p><Link to="/register">Don't have an account? Create one!</Link></p>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, { login })(Login)