const body_parser = require('body-parser')
const express = require('express')
const request = require('request')
const path = require('path')
const User = require('./user.js')
const UserSettings = require('./userSettings.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const authenticate = require('./authentication.js')
const passport = require('passport')
const secure = require('express-force-https')
const sanitize = require('mongo-sanitize')
const CalendarAPI = require('./calendar.js')
const cors = require('cors')

const app = express()
const router = express.Router()
const static_files = express.static(path.join(__dirname, '../../client/build'))
const mongo_uri = 'mongodb://localhost/wakemeapp_db'

app.use(secure)
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))
app.use(router)
app.use(static_files)
app.use(cors())
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/build/index.html'));
})

router.post('/register', (req, res) => {
    const { name, email, password } = sanitize(req.body)
    const user = new User({ name, email, password })
    user.save(function(err, user) {
        const _id = new mongoose.Types.ObjectId(user._id) // same id as corresponding user
        const stationName = ''
        const stationId = -1
        const bus = false
        const metro = false
        const train = false
        const tram = false
        const ship = false
        const token = '-'
        const userSettings = new UserSettings({ _id, stationName, stationId, bus, metro, train, tram, ship, token })
        userSettings.save((err2) => {
            console.log(err2)
        })
        if (err) {
            res.status(500).send("An error occured while registring, please try again.")
        } else {
            res.status(200).send("Welcome to Wake Me App!\n")
        }
    })
})

/*
Get user settings from db
*/
router.get('/getUserSettings/:email', (req, res) => {
    const email = req.params.email
    User.findOne ( { email } , (err, user) => {
        const _id = user._id
        UserSettings.findOne ( { _id }, (err, user_settings) => {
            let data = {}
            data.station_name = user_settings.stationName
            data.station_id = user_settings.stationId
            data.bus = user_settings.bus
            data.metro = user_settings.metro
            data.train = user_settings.train
            data.tram = user_settings.tram
            data.ship = user_settings.ship
            res.json(data)
        })
    })
})

/*
Update user settings in db
*/
router.post('/updateUserSettings/:email', (req, res) => {
    const email = req.params.email

    User.findOne( { email }, (err, user) => {
        const query = {'_id': user._id}
        const { stationName, stationId, bus, metro, train, tram, ship } = sanitize(req.body)
        UserSettings.findOneAndUpdate(query, { stationName, stationId, bus, metro, train, tram, ship }, (err, userSettings) => {
            if (err)
                return res.send(500, {error: err})
            return res.send ('Successfully saved user settings')
        })
    })
})

/*
A promise that gets station information when the user search for a station
*/
router.get('/getStationData/:search_string', (req, res, next) => {
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
        res.json(JSON.parse(body).ResponseData)
    }).catch(error => {
        console.log(error)
    })
})

/*
A promise that gets real time information about a station's departures
*/
router.get('/getRealTime/:station_id/:bus/:metro/:train/:tram/:ship', (req, res, next) => {
    let api_key = process.env.REALTIME
    let station_id = parseInt(req.params.station_id)

    const options = {
        url: 'http://api.sl.se/api2/realtimedeparturesV4.json?key=' + api_key + '&siteid=' + station_id
        + '&timewindow=30&transport' + '&bus=' + req.params.bus + '&metro=' + req.params.metro
        + '&train='+ req.params.train + '&tram=' + req.params.tram + '&ship=' + req.params.ship
    }

    return new Promise(resolve => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    }).then(body => {
        let departures = sortDepartures(body)

        res.json(departures)
    }).catch(error => {
        console.log(error)
    })
})

let sortDepartures = (body) => {
    let data = JSON.parse(body).ResponseData
    let departures = data.Buses
    departures = departures.concat(data.Metros)
    departures = departures.concat(data.Trains)
    departures = departures.concat(data.Trams)
    departures = departures.concat(data.Ships)

    // Sort on display time, e.g. '1 min'
    departures.sort(function (a, b) {
        let a_time = parseInt(a.DisplayTime.split(' ')[0])
        let b_time = parseInt(b.DisplayTime.split(' ')[0])
        return ('' + a_time).localeCompare(b_time, undefined, {numeric: true});
    })

    // Get all departures that are 'Nu'
    let now_departures = []
    for(let i = departures.length - 1; i >= 0; i--) {
        if (departures[i].DisplayTime === 'Nu')
            now_departures.push(departures[i])
        else
            break;
    }

    // Remove all departures that are 'Nu'
    departures = departures.filter((a) => {
        return a.DisplayTime !== 'Nu'
    })

    // Add all 'Nu' departures at beginning of array
    for (let i = 0; i < now_departures.length; i++) {
        departures.unshift(now_departures[i])
    }

    // Display time that lacks real time are handled separately
    let timeRegex = RegExp('[0-9][0-9]:[0-9][0-9]$');
    let no_real_time = []
    let indices = []
    for (let i = 0; i < departures.length; i++) {
        let display_time = departures[i].DisplayTime
        if (timeRegex.test(display_time)) {
            no_real_time.push(departures[i])
            indices.push(i)
        }
    }

    departures = departures.filter((a) => {
        return !timeRegex.test(a.DisplayTime)
    })

    let all_departures = [departures, no_real_time]

    return all_departures
}

/*
A promise of location data for the current location of the client's browser
*/
router.get('/getLocationData/:latitude/:longitude', (req, res, next) => {
    let api_key = process.env.GOOGLE
    const options = {
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.params.latitude +
        ',' + req.params.longitude + '&result_type=sublocality_level_1&key=' + api_key
    }
    return new Promise(resolve => {
        request(options, (err, res, body) => {
            if (err)
                console.log(err)
            resolve(body)
        })
    }).then(body => {
        let data = JSON.parse(body)
        let city = {}
        city.name = data.results[0].address_components[0].long_name
        res.json(city)
    })
})

/*
A promise of weather data for the current location of the client's browser
*/
router.get('/weather/:latitude/:longitude', (req, res, next) => {
    let api_key = process.env.WEATHER
    const options = {
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + req.params.latitude
        + '&lon=' + req.params.longitude + '&units=metric' + '&appid=' + api_key
    }

    return new Promise(resolve => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    }).then(body => {
        let data = JSON.parse(body)
        let id = data.weather[0].id.toString()
        let first_char = id.charAt(0)

        // add icons for each type of weather here
        if (first_char === '2') {
            data.icon = 'path to thunder icon'
        } else if (first_char === '3') {
            data.icon = 'path to drizzle icon'
        } else if (first_char === '5') {
            data.icon = 'path to rain icon'
        } else if (first_char === '6') {
            data.icon = 'path to snow icon'
        } else if (first_char === '8') {
            let third_char = id.charAt(2)
            if (third_char === '0') {
                data.icon = 'path to sun icon'
            } else {
                data.icon = 'path to cloud icon'
            }
        }
        res.json(data)
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

router.get('/signout', (req, res) => {
    CalendarAPI.revoke()
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
        res.json(JSON.parse(body).hdurl)
    }).catch(error => {
        console.log(error)
    })
})

router.get('/unsplash', (req, res) => {
    const collection = '540518/spectrums'
    const url = `https://source.unsplash.com/collection/${collection}/`
    res.json({ url })
})

router.get('/calendar/:email', (req, res) => {
    CalendarAPI.authorize(res, req, req.params.email)
    .then(result => {
        if (result !== 'NO_TOKEN') {
            CalendarAPI.listEvents(result, res)
        }
    })
})

router.get('/calendar_callback', (req, res) => {
    let host = ''
    if (req.headers.host === 'localhost:3001') {
        host = 'http://localhost:3000/cal'
    } else {
        host = 'https://wakemeapp.herokuapp.com'
    }
    const code = req.query.code
    CalendarAPI.createToken(code, req)
    .then(() => {
        res.redirect(host)
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router
