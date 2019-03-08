const body_parser = require('body-parser')
const express = require('express')
const request = require('request')
const path = require('path')

const app = express()
const router = express.Router()
const static_files = express.static(path.join(__dirname, '../../client/build'))

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))
app.use(router)
app.use(static_files)
app.set('port', (process.env.PORT || 3001))

app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})

router.get('/', function(req, res, next) {
    res.json('Server up and running')
})

router.get('/test', function(req, res, next) {
    const names = [
        {name: "test1"},
        {name: "test2"},
        {name: "test3"},
    ]
    res.json(names)
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
        res.json(JSON.stringify(JSON.parse(body).ResponseData))
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



module.exports = router
