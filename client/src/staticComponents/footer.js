import React, { Component } from 'react'
import './staticComponents.scss'

class Footer extends Component {
  render() {
    return (
      <div className="page-footer font-small teal pt-4 fixed-bottom">
        <div className="container-fluid text-center text-md-left">
          <div className="row">
            <div className="col-md-6 mt-md-0 mt-3">
              <h5>About</h5>
              <p className="small">Wake Me App was developed by Helena Alinder & Josefin Nilsson as project for DH2642 Interaction Programming and the Dynamic Web.</p>
            </div>
            <hr className="clearfix w-100 d-md-none pb-3"/>
            <div className="col-md-6 mb-md-0 mb-3">
              <h5>Acknowledgements</h5>
              <p className="small">The application uses the following APIs:&nbsp;
              <a href="https://developers.google.com/calendar/">Google Calendar</a>,&nbsp;
              <a href="https://developers.google.com/maps/documentation/geocoding/start">Google Geocoding</a>,&nbsp;
              <a href="https://newsapi.org/s/svenska-dagbladet-api">News API</a>,&nbsp;
              <a href="https://openweathermap.org/api">Open Weather Map</a>,&nbsp;
              <a href="https://www.trafiklab.se/">Trafiklab</a>,&nbsp;
              <a href="https://source.unsplash.com/">Unsplash</a>.
              Other resources:&nbsp;
              <a href="https://icons8.com/">Icons8 icons</a></p>
            </div>
          </div>
        </div>
      </div>
    )
 }
}

export default Footer