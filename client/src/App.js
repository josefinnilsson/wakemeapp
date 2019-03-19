import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.scss'
import UserSettings from './settings/userSettings'
import Dashboard from './dashboard/dashboard'
import DeparturesExtended from './sl/departures/departuresExtended'
import jwt_decode from 'jwt-decode'
import Login from './authentication/login'
import Register from './authentication/register'
import Authenticated from './authentication/authenticated'
import PrivacyPolicy from './staticPages/privacyPolicy'
import { setCurrentUser, logout } from './actions/authActions'
import setAuthToken from './utils/setAuthToken'
import { Provider } from 'react-redux'
import store from './store'
import Header from './staticComponents/header'
import Footer from './staticComponents/footer'

if (localStorage.jwt_token) {
  const token = localStorage.jwt_token
  setAuthToken(token)
  const decoded = jwt_decode(token)
  store.dispatch(setCurrentUser(decoded))
  const current_time = Date.now() / 1000
  if (decoded.exp < current_time) {
    store.dispatch(logout())
    window.location.href = "./login"
  }
}

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <div className="App">
        <Header/>
          <header className="App-header">
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <Switch>
                <Authenticated exact path='/cal' component={Dashboard}/>
                <Authenticated path="/departures" component={DeparturesExtended}/>
                <Authenticated path="/userSettings" component={UserSettings}/>
                <Authenticated exact path="/" component={Dashboard}/>
              </Switch>
              <Route path='/privacy' component={PrivacyPolicy}/>
          </header>
          <Footer/>
        </div>
      </Provider>
    )
  }
}

export default App;
