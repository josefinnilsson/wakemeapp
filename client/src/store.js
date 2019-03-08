import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'

const initialState = {}

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
        applyMiddleware(thunk)
    )
)

export default store