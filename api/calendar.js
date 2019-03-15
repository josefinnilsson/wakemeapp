const Promise = require('bluebird')
const readline = require('readline');
const {google} = require('googleapis')
const fs = require('fs')
const oAuth = google.auth.OAuth2
const TOKEN_PATH = 'token.json'

const CalendarAPI = {
    authorize: function(res) {
        const oAuth2Client = new oAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'http://localhost:3001/calendar_callback')
        return new Promise(resolve => {
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    CalendarAPI.getAccessToken(res, oAuth2Client)
                    resolve('NO_TOKEN')
                } else {
                    oAuth2Client.setCredentials(JSON.parse(token))
                    resolve(oAuth2Client)
                }
            })
        })
    },
    getAccessToken: function(res, oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', scope: 'https://www.googleapis.com/auth/calendar.readonly'
        })
        res.json({url: authUrl})
    },
    createToken: function(code, oAuth2Client) {
        const oAuth2Client2 = new oAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'http://localhost:3001/calendar_callback')
        return new Promise((resolve, reject) => {
            oAuth2Client2.getToken(code, (err, token) => {
                if (err)
                    reject(err)
                else {
                    oAuth2Client2.setCredentials(token)
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err)
                            reject('Token err')
                    })
                    resolve(oAuth2Client2)
                }
            })
        })
    },
    listEvents: function(auth, res) {
        const calendar = google.calendar({ version: 'v3', auth: auth})
        const today = new Date()
        const end = `${today.getYear()+1900}-0${today.getMonth()+1}-${today.getDate()}T23:59:59Z`
        const start = `${today.getYear()+1900}-0${today.getMonth()+1}-${today.getDate()}T00:00:00Z`
        calendar.events.list({
            calendarId: 'primary',
            singleEvents: true,
            timeMin: start,
            timeMax: end,
            orderBy: 'startTime'
        }, (err, response) => {
            if (err)
                res.status(500).send('API error: ', err)
            const events = response.data.items
            if (events.length) {
                let events_json = []
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date
                    const json = {start: start, summary: event.summary}
                    events_json.push(json)
                })
                res.json({events: events_json})
            } else {
                res.json({events: 'No events found'})
            }
        })
    }
}

module.exports = CalendarAPI