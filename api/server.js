const body_parser = require('body-parser')
const express = require('express')
const request = require('request')
const path = require('path')
const User = require('./user.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const authenticate = require('./authentication.js')
const passport = require('passport')

const app = express()
const router = express.Router()
const static_files = express.static(path.join(__dirname, '../../client/build'))
const mongo_uri = 'mongodb://localhost/wakemeapp_db'

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))
app.use(router)
app.use(static_files)
app.set('port', (process.env.PORT || 3001))
app.use(passport.initialize())
mongoose.connect(process.env.MONGODB_URI || mongo_uri, err => {
    if (err) {
        throw err
    } else {
        console.log(`Successfully connected to ${mongo_uri}`)
    }
})

app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})

app.use(express.static(path.join(__dirname, '/../client/build')));
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../client/public/index.html'))
})

router.post('/register', (req, res) => {
    const { name, email, password } = req.body
    const user = new User({ name, email, password })
    user.save(function(err) {
        if (err) {
            res.status(500).send("An error occured while registring, please try again.")
        } else {
            res.status(200).send("Welcome to Wake Me App!\n")
        }
    })
})

/*
A promise that gets station information when the user search for a station
*/
router.get('/getStationData/:search_string', function(req, res, next) {
	let api_key = process.env.PLATSUPPSLAG
    let search_string = req.params.search_string
    const options = {
        url: 'https://api.sl.se/api2/typeahead.json?key=' + api_key + '&searchstring=' + search_string + '&stationsonly=true&maxresults=10'
    }
    return new Promise(resolve => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    }).then(body => {
        res.json(JSON.stringify(JSON.parse(body).ResponseData))
    }).catch(error => {
        console.log(error)
    })
})

/*
A promise that gets real time information about a station's departures
*/
router.get('/getRealTime/:station_id/:bus/:metro/:train/:tram/:ship', function(req, res, next) {
    let api_key = process.env.REALTIME
    let station_id = parseInt(req.params.station_id)

    const options = {
        url: 'http://api.sl.se/api2/realtimedeparturesV4.json?key=' + api_key + '&siteid=' + station_id
        + '&timewindow=5&transport' + '&bus=' + req.params.bus + '&metro=' + req.params.metro
        + '&train='+ req.params.train + '&tram=' + req.params.tram + '&ship=' + req.params.ship
    }

    return new Promise(resolve => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    }).then(body => {
        res.json(JSON.stringify(JSON.parse(body).ResponseData))
    }).catch(error => {
        console.log(error)
    })
})

router.post('/authenticate', (req, res) => {
    const { errors, isValid, email, password } = req.body
    User.findOne( { email }, (err, user) => {
        if (err) {
            console.log(error)
            res.status(500).json('{ Internal server error }')
        } else if (!user) {
            res.status(401).json('{ Incorrect credentials }')
        } else {
            user.checkPassword(password, (err, correct) => {
                if (err) {
                    console.log(error)
                    res.status(500).json('{ Internal server error }')
                } else if (!correct) {
                    res.status(401).json('{ Incorrent credentials }')
                } else {
                    const payload = { id: user.id, email: user.email }
                    const token = jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 31556926 //1 year
                    })
                    res.json({success: true, token: 'Bearer ' + token})
                }
            })
        }
    })
})

router.post('/signout', (req, res) => {
    console.log(req.body)
})

router.get('/nasa', (req, res) => {
    let api_key = process.env.NASA
    let hd = true

    const options = {
        url: `https://api.nasa.gov/planetary/apod?hd=${hd}&api_key=${api_key}`
    }

    return new Promise(resolve => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    }).then(body => {
        res.json(JSON.stringify(JSON.parse(body).hdurl))
    }).catch(error => {
        console.log(error)
    })
})

module.exports = router
