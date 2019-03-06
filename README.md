#Wake Me App
## About
TODO

## Project structure
This repository holds both the frontend and backend for Wake Me App. The application consists of a React frontend which can be found in the `/client` directory and a express backend which can be found in the `/api` directory.

## Running Locally
First, [install Node](https://docs.npmjs.com/getting-started/installing-node). Then standing in the root directory run:
* `npm run build` to build the frontend and backend.
* `npm install` to install the frontend and backend dependencies.
* `npm start` to start the server and client. The application can be visited at [localhost:3000](https://localhost:3000) and the server at [localhost:3001](https://localhost:3001).

## Deploying
The app is hosted on [Heroku](https://heroku.com) and uses automatic deploys that tracks the master branch of this repository. So in order to deploy the app, just push to master and the code will be visible at [wakemeapp.herokuapp.com](https://wakemeapp.herokuapp.com).