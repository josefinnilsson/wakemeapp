import { GET_ERRORS } from '../actions/types.js'

const initial_state = {}

export default function(state = initial_state, action) {
	switch (action.type) {
	case GET_ERRORS:
		return action.payload
	default:
		return state
	}
}