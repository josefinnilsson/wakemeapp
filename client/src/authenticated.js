import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

class Authenticated extends Component {
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
        if (this.stateshould_login)
            return <Redirect to="/login"/>
        return (
            <React.Fragment>
                <Component {...this.props} />
            </React.Fragment>
        )
    }
}

export default Authenticated