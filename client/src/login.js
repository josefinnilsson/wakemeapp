import React, {Component} from 'react'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }

        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value })
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault()
        fetch('/authenticate', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
              'Content-Type': 'application/json'
          }
        })
        .then(res => {
            if (res.status === 200) {
              this.props.history.push('/');
          } else {
              throw new Error(res.error)
          }
        })
        .catch(err => {
            console.error(err);
            alert('Error signing in');
        })
    }

    render() {
        return (
            <div className="login">
            <h1>Sign in</h1>
                <form id="login_form" onSubmit={this.handleSubmit}>
                    <label>Email</label>
                    <input type="emai" name="email" value={this.state.email} onChange={this.handleEmailChange} required/>
                    <label>Password</label>
                    <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange}required/>
                    <input type="submit" value="Log in"/>
                </form>
            </div>

        )
    }
}

export default Login