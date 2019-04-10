import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from './types'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const register = (user_data, history) => dispatch => {
    axios.post('/register', user_data)
    .then(res => history.push('/login'))
    .then(() => toast('Account created!', {
            className: 'success_notification',
            bodyClassName: 'success_notification',
            progressClassName: 'success_notification',
        }))
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}

export const login = user_data => dispatch => {
    axios.post('/authenticate', user_data)
    .then(res => {
        const { token } = res.data
        localStorage.setItem('jwt_token', token)
        setAuthToken(token)
        const decoded = jwt_decode(token)
        dispatch(setCurrentUser(decoded))
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    }
}

export const logout = () => dispatch => {
    localStorage.removeItem('jwt_token')
    setAuthToken(false)
    dispatch(setCurrentUser({}))
}