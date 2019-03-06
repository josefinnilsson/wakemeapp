import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Dashboard from './dashboard/dashboard'
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Route path='/' component={Dashboard}/>
        </header>
      </div>
    )
  }
}

export default App;
