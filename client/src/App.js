import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Dashboard from './dashboard/dashboard'
import './App.css';
import Login from './login'
import Authenticated from './authenticated'

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <Route path='/' component={Dashboard}/>
            <Route path="/login" component={Authenticated(Login)}/>
        </header>
      </div>
    )
  }
}

export default App;
