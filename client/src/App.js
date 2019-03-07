import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './App.css'
import Dashboard from './dashboard/dashboard'
import DeparturesExtended from './sl/departures/departuresExtended'

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Route exact path='/' component={Dashboard}/>
          <Route path="/departures" component={DeparturesExtended}/>

        </header>
      </div>
    )
  }
}

export default App;
