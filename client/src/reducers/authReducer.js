import { SET_CURRENT_USER, USER_LOADING } from '../actions/types.js'

const is_empty = require('is-empty')

const initial_state = {
	is_authenticated: false,
	user: {},
	loading: false
}

export default function(state = initial_state, action) {
	switch (action.type) {
	case SET_CURRENT_USER:
		return {
			...state,
			is_authenticated: !is_empty(action.payload),
			user: action.payload
		}
	case USER_LOADING:
		return {
			...state,
			loading: true
		}
	default:
		return state
	}

}