import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../actions/authActions'

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errors: {}
        }

        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillReceiveProps(next_props) {
        if (next_props.auth.is_authenticated) {
            localStorage.setItem('email', this.state.email)
            fetch('/getUserSettings/' + this.state.email)
            .then(response => {
              return response.json()})
            .then(data => {
              localStorage.clear()
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
        if (next_props.errors)
            this.setState({ errors: next_props.errors })
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
        return (
            <div className="login">
                <h1>Sign in</h1>
                Don't have an account? <Link to="/register">Register</Link>
                <form id="login_form" onSubmit={this.handleSubmit}>
                    <label>Email</label>
                    <input type="email" name="email" value={this.state.email} onChange={this.handleEmailChange} required/>
                    <label>Password</label>
                    <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange}required/>
                    <input type="submit" value="Log in"/>
                </form>
            </div>
        )
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, { login })(Login)