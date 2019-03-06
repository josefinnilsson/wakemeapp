import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

export default function Authenticated(Component) {
    return class extends Component {
        constructor(props) {
            super(props)
            this.state = {
                loading: true,
                should_login: false,
            }
        }

        componentDidMount() {
            fetch('/validToken')
            .then(res => {
                if (res.status === 200) {
                    this.setState({ loading: false })
                } else {
                    throw new Error(res.error)
                }
            }).catch(err => {
                console.error(err)
                this.setState({ loading: false, should_login: true})
            })
        }

        render() {
            if (this.state.loading)
                return null
            if (this.state.should_login)
                return <Redirect to="/login"/>
            else {
                return (
                    <React.Fragment>
                    <Component {...this.props} />
                    </React.Fragment>
                )
            }
        }
    }
}