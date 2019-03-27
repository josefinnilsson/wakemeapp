import React, {Component} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { register } from '../actions/authActions'
import PropTypes from 'prop-types'
import {Form, Button} from 'react-bootstrap'

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
                <h1 className="title">Wake Me App</h1>
                <div className="login_form_wrapper">
                    <div className="login_form">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="form_name">
                                <Form.Control type="text" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} required/>
                            </Form.Group>
                            <Form.Group controlId="form_email">
                                <Form.Control type="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} required/>
                            </Form.Group>
                            <Form.Group controlId="form_password">
                                <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}required/>
                            </Form.Group>
                            <div className="login_button">
                                <Button variant="primary" type="submit">Register</Button>
                            </div>
                            <div className="register_text">
                                <p><Link to="/login">Already have an account? Log in!</Link></p>
                            </div>
                        </Form>
                    </div>
                </div>
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