import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './App.css'
import SL from './sl/sl'

class App extends Component {


  render() {
    return (
      <div className="App">
        <header className="App-header">

          <Route path='/sl' component={SL}/>
        </header>
      </div>
    )
  }
}

export default App;
