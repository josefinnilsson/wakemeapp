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
const Validator = require('validator')
const isEmpty = require('is-empty')
const fs = require('fs')

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

const checkUser = function(email) {
    return new Promise(resolve => {
        User.find({ email: email }, (err, docs) => {
            if (docs.length) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

const validateRegisterInput = function(data) {
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : ''

    if (Validator.isEmpty(data.name))
        errors.name = 'Name is required'

    if (Validator.isEmpty(data.email))
        errors.email = 'Email is required'
    else if(!Validator.isEmail(data.email))
        errors.email = 'Invalid email'

    if (Validator.isEmpty(data.password))
        errors.password = 'Password is required'

    if (Validator.isEmpty(data.confirm_password))
        errors.confirm_password = 'Confirm password is required'

    if (!Validator.isLength(data.password, { min: 6 }))
        errors.password = 'Password must be at least 6 characters'
    if (!Validator.equals(data.password, data.confirm_password))
        errors.confirm_password = 'Passwords must match'
    return {
        errors,
        is_valid: isEmpty(errors)
    }
}

router.post('/register', (req, res) => {
    const { errors, is_valid } = validateRegisterInput(req.body)
    if (!is_valid) {
        return res.status(400).json(errors)
    }
    const { name, email, password } = sanitize(req.body)

    checkUser(email)
    .then(user_exists => {
        if (user_exists) {
            return res.status(400).json({ email: 'Email already exists' })
        }
        const user = new User({ name, email, password })
        user.save(function(err, user) {
            if (err) {
                return res.status(500).send({ general: 'An error occured while registring, please try again.' })
            } else {
                const _id = new mongoose.Types.ObjectId(user._id) // same id as corresponding user
                const stationName = ''
                const stationId = -1
                const bus = false
                const metro = false
                const train = false
                const tram = false
                const ship = false
                const token = '-'
                const firstComp = 'calendar'
                const secondComp = 'weather'
                const thirdComp = 'news'
                const fourthComp = 'sl'
                const userSettings = new UserSettings({ _id, stationName, stationId, bus, metro, train, tram,
                                                    ship, token, firstComp, secondComp, thirdComp, fourthComp })
                userSettings.save((err) => {
                    if (err) {
                        return res.status(500).send({ general: 'An error occured while registring, please try again.' })
                    } else {
                        res.status(200).send("Welcome to Wake Me App!\n")
                    }
                })
            }
        })
    })
})

const validateLoginInput = function(data) {
    let errors = {}
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''

    if (Validator.isEmpty(data.email))
        errors.email = 'Email is required'
    else if(!Validator.isEmail(data.email))
        errors.email = 'Invalid email'

    if (Validator.isEmpty(data.password))
        errors.password = 'Password is required'

    return {
        errors,
        is_valid: isEmpty(errors)
    }
}

router.post('/authenticate', (req, res) => {
    const { errors, is_valid } = validateLoginInput(req.body)
    if (!is_valid) {
        return res.status(400).json(errors)
    }
    const { email, password } = req.body
    User.findOne( { email }, (err, user) => {
        if (err) {
            return res.status(500).json({ general: 'Internal server error' })
        } else if (!user) {
            return res.status(401).json({ credentials: 'Incorrect credentials' })
        } else {
            user.checkPassword(password, (err, correct) => {
                if (err) {
                    return res.status(500).json({ general: 'Internal server error' })
                } else if (!correct) {
                    return res.status(400).json({ general: 'Incorrect credentials' })
                } else {
                    const payload = { id: user.id, email: user.email }
                    const token = jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 31556926 //1 year
                    })
                    return res.json({success: true, token: 'Bearer ' + token})
                }
            })
        }
    })
})

router.get('/getUserSettings/:email', (req, res) => {
    const email = req.params.email
    User.findOne ( { email } , (err, user) => {
        const _id = user._id
        UserSettings.findOne ( { _id }, (err, user_settings) => {
            let data = {}
            data.name = user.name
            data.station_name = user_settings.stationName
            data.station_id = user_settings.stationId
            data.bus = user_settings.bus
            data.metro = user_settings.metro
            data.train = user_settings.train
            data.tram = user_settings.tram
            data.ship = user_settings.ship
            data.firstComp = user_settings.firstComp
            data.secondComp = user_settings.secondComp
            data.thirdComp = user_settings.thirdComp
            data.fourthComp = user_settings.fourthComp
            res.json(data)
        })
    })
})

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

router.post('/updateUserSettingsComponents/:email', (req, res) => {
    const email = req.params.email

    User.findOne({ email }, (err, user) => {
        const query = {'_id': user._id}
        const { firstComp, secondComp, thirdComp, fourthComp } = sanitize(req.body)
        UserSettings.findOneAndUpdate(query, { firstComp, secondComp, thirdComp, fourthComp }, (err, userSettings) => {
            if (err)
                return res.send(500, {error: err})
            return res.send('Successfully saved user comps')
        })
    })
})

router.get('/getAllStations', (req, res, next) => {
    return new Promise(resolve => {
        const body = fs.readFileSync('stations.json', 'utf8')
        resolve(body)
    }).then(body => {
        let stations = JSON.parse(body).ResponseData.Result
        let all_stations = []
        stations.forEach(station => {
            all_stations.push({ value: station.SiteId, label: station.SiteName })
        })
        let unique_value = [... new Set(all_stations.map (station => station.value))]
        let unique_stations = unique_value.map(value => {
                return {
                    value: value,
                    label: all_stations.find(station => station.value === value).label
                }
            })
        res.json(unique_stations)
    }).catch(error => {
        console.log(error)
    })
})

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

const sortDepartures = (body) => {
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

router.get('/getLocationData/:latitude/:longitude', (req, res, next) => {
    let api_key = process.env.GOOGLE
    const options = {
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.params.latitude +
        ',' + req.params.longitude + '&key=' + api_key
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
        city.name = data.results[7].address_components[0].long_name
        res.json(city)
    })
})

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
        const data = JSON.parse(body)
        const description = data.weather[0].description
        const temp = data.main.temp
        const pressure = data.main.pressure
        const humidity = data.main.humidity
        const clouds = data.clouds.all
        const sunrise = data.sys.sunrise
        const sunset = data.sys.sunset

        const id = data.weather[0].id.toString()
        const first_char = id.charAt(0)
        let icon = ''
        if (first_char === '2') {
            icon = 'THUNDER'
        } else if (first_char === '3') {
            icon = 'DRIZZLE'
        } else if (first_char === '5') {
            icon = 'RAIN'
        } else if (first_char === '6') {
            icon = 'SNOW'
        } else if (first_char === '8') {
            let third_char = id.charAt(2)
            if (third_char === '0') {
                icon = 'SUN'
            } else {
                icon = 'CLOUD'
            }
        }
        res.json({
            description: description,
            temp: temp,
            pressure: pressure,
            humidity: humidity,
            clouds: clouds,
            sunrise: sunrise,
            sunset: sunset,
            icon: icon
        })
    }).catch(error => {
        console.log(error)
    })
})

router.get('/weather_forecast/:latitude/:longitude', (req, res, next) => {
    let api_key = process.env.WEATHER
    const options = {
        url: 'http://api.openweathermap.org/data/2.5/forecast/hourly?lat=' + req.params.latitude
        + '&lon=' + req.params.longitude + '&units=metric' + '&appid=' + api_key
    }

    return new Promise(resolve => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    }).then(body => {
        const data = JSON.parse(body)
        const list = data.list
        let temperatures = []
        let hours = []
        for (let i = 0; i < 24; i++) {
            const temp = list[i].main.temp
            let dt = list[i].dt_txt
            dt = dt.split(' ')[1].split(':')[0]
            temperatures.push({ index: i, Temperature: temp, hour: dt })
        }
        res.json(temperatures)
    }).catch(error => {
        console.log(error)
    })
})

router.get('/news', (req, res) => {
    let api_key = process.env.SVD
    const options = {
        url: 'https://newsapi.org/v2/everything?sources=svenska-dagbladet&apiKey=' + api_key
    }

    return new Promise(resolve => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    }).then(body => {
        let data = JSON.parse(body)
        res.json(data)
    })
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
    const url = `https://source.unsplash.com/collection/${collection}/daily/`
    res.json({ url })
})

router.get('/calendar/:email', (req, res) => {
    CalendarAPI.authorize(res, req, req.params.email)
    .then(result => {
        if (result !== 'NO_TOKEN') {
            CalendarAPI.listEvents(result, res)
        }
    })
    .catch(err => {
        console.log(err)
        res.json({error_message: err})
    })
})

router.get('/change_calendar', (req, res) => {
    CalendarAPI.switchAccount(res, req)
    .catch(err => {
        console.log(err)
        res.json({error_message: err})
    })
})

router.get('/calendar_callback', (req, res) => {
    let host = ''
    if (req.headers.host === 'localhost:3001') {
        host = 'http://localhost:3000/cal'
    } else {
        host = 'https://wakemeapp.herokuapp.com/cal'
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

router.get('/calendar_authenticated:email', (req, res) => {
    CalendarAPI.isAuthorized(req.params.email)
    .then(auth => {
        res.json({ authorized: auth })
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router
