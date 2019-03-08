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
        + '&timewindow=20&transport' + '&bus=' + req.params.bus + '&metro=' + req.params.metro
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



module.exports = router
