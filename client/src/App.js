import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import './App.scss'
import UserSettings from './settings/userSettings'
import Dashboard from './dashboard/dashboard'
import DeparturesExtended from './sl/departures/departuresExtended'
import NewsExtended from './news/newsExtended'
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
import { toast } from 'react-toastify'

library.add(fas)

if (localStorage.jwt_token) {
  const token = localStorage.jwt_token
  setAuthToken(token)
  const decoded = jwt_decode(token)
  store.dispatch(setCurrentUser(decoded))
  const current_time = Date.now() / 1000
  if (decoded.exp < current_time || localStorage.getItem('email') === null) {
    store.dispatch(logout())
    window.location.href = "./login"
  }
}

class App extends Component {
  render() {

    const background_url = localStorage.getItem('background_url')
    let url = ''
    if (background_url)
      url = JSON.parse(background_url)
    if (typeof url === undefined) {
      url = ''
    }

    let auth = false
    const location = window.location.pathname
    if (location === '/login' || location === '/register') {
      auth = true
      url = ''
    }
    if (location === '/cal') {
      toast('Calendar authentication successful!', {
            className: 'success_notification',
            bodyClassName: 'success_notification',
            progressClassName: 'success_notification',
        })
    }
    const header = auth ? '' : <Header/>
    const unsplashStyle = {
      backgroundImage: 'linear-gradient(to bottom, rgba(254, 243, 234, 0.8), rgba(254, 243, 234, 1)),url(' + url +')',
      backgroundRepeat: 'no',
      backgroundSize: 'cover',
      height: '110vh'
    }
    const noStyle = {
      backgroundImage: 'none'
    }

    return (
      <Provider store={store}>
        <div className="App" style={url !== '' ? unsplashStyle : noStyle}>
        {header}
          <header className="App-header">
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <Switch>
                <Authenticated exact path="/cal" component={Dashboard}/>
                <Authenticated path="/departures" component={DeparturesExtended}/>
                <Authenticated path="/userSettings" component={UserSettings}/>
                <Authenticated exact path="/" component={Dashboard}/>
              </Switch>
              <Route path='/privacy' component={PrivacyPolicy}/>
              <Route path='/news/:url' component={NewsExtended}/>
          </header>
        </div>
      </Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
