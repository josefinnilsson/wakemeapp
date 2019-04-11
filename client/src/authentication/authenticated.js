import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const Authenticated = ({ component: Component, auth, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			auth.is_authenticated === true ? <Component {...props} /> : <Redirect to="/login"/>
		}
	/>
)

Authenticated.propTypes = {
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth
})

export default connect(mapStateToProps)(Authenticated)