# Wake Me App

## About
Wake Me App is an application that shows you the information you need in the morning: your events for the day, the current weather, the status of your favourite SL station and the latest news.

### Try It Out
Go to [wakemeapp.herokuapp.com](https://wakemeapp.herokuapp.com) and start by creating a user (your password is stored hashed and salted). Then authenticate your calendar and configure your desired SL stations by clicking the buttons on the dashboard and after that you're all set. If you want to customise your dashboard you can move the components around by dragging and dropping them.

### What We Have Done
- Created user creation- and authentication functionality connected to a MongoDB database.
- Created a calendar component that uses OAuth to authorise usage of the users Google Calendar and then shows the users' calendar events.
- Created a SL component that shows the next departures on a station chosen by the user. The stations and types of transportation can be configured on the settings page.
- Created a weather component that, if the user have allowed the application to know current location, shows the weather were the user is located right now along with a chart that shows the temperature the next hours.
- Created a news component that shows the latest news from Svenska Dagbladet.
- Created a functionality that allows the user to switch between two different themes: minimalistic and Unsplash.
- Created static components such as header and footer.
- Created a drag-and-drop functionality to the dashboard compoenents.
- Created error- and information messages to the user interface.
- Styled the whole application.
- Styled mobile view.

## Project structure
This repository holds both the frontend and backend for Wake Me App. The application consists of a React frontend which can be found in the `/client` directory and a express backend which can be found in the `/api` directory.

## Running Locally
First, [install Node](https://docs.npmjs.com/getting-started/installing-node). Then standing in the root directory run:
* `npm install` to install the frontend and backend dependencies.
* `npm run start-dev` to start the server and client. The application can be visited at [localhost:3000](https://localhost:3000) and the server at [localhost:3001](https://localhost:3001).  

*Note: Running the application locally requires you to have the correct environmental variables set up and in order to get the SL stations your local database has to be configured.*

### API
The application uses the following APIs:
- [Google Calendar](https://developers.google.com/calendar/)
- [Google Geocoding](https://developers.google.com/maps/documentation/geocoding/start)
- [News API](https://newsapi.org/s/svenska-dagbladet-api)
- [Open Weather Map (Current weather)](https://openweathermap.org/current)
- [Trafiklab - SL Realtidsinformation 4](https://www.trafiklab.se/api/sl-realtidsinformation-4)
- [Trafiklab - SL Hållplatser och Linjer 2](https://www.trafiklab.se/api/sl-hallplatser-och-linjer-2)
- [Unsplash](https://source.unsplash.com/)

## Deploying
The app is hosted on [Heroku](https://heroku.com) and uses automatic deploys that tracks the master branch of this repository. So in order to deploy the app, just push to master and the code will be visible at [wakemeapp.herokuapp.com](https://wakemeapp.herokuapp.com).