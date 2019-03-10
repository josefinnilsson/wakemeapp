import React, {Component} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { register } from '../actions/authActions'
import PropTypes from 'prop-types'

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            errors: {}
        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillReceiveProps(next_props) {
        if (next_props.errors) {
            this.setState({ errors: next_props.errors })
        }
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated)
            this.props.history.push('/')
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value })
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
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }
        this.props.register(user, this.props.history)
    }

    render() {
        return (
            <div className="register">
                <h1>Register</h1>
                Already have an account? <Link to="/login">Log in</Link>
                <form id="register_form" onSubmit={this.handleSubmit}>
                    <label>Name</label>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange} required/>
                    <label>Email</label>
                    <input type="email" name="email" value={this.state.email} onChange={this.handleEmailChange} required/>
                    <label>Password</label>
                    <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} required/>
                    <input type="submit" value="Log in"/>
                </form>
            </div>
        )
    }
}

Register.propTypes = {
    register: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { register })(withRouter(Register))