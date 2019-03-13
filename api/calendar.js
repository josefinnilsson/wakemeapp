const Promise = require('bluebird')
const readline = require('readline');
const {google} = require('googleapis')
const fs = require('fs')
const oAuth = google.auth.OAuth2
const TOKEN_PATH = 'token.json'
const oAuth2Client = new oAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'http://localhost:3001/calendar_callback')

const CalendarAPI = {
    authorize: function(res) {
        return new Promise(resolve => {
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    CalendarAPI.getAccessToken(res)
                    resolve('NO_TOKEN')
                } else {
                    oAuth2Client.setCredentials(JSON.parse(token))
                    resolve('TOKEN')
                }
            })
        })
    },
    getAccessToken: function(res) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', scope: 'https://www.googleapis.com/auth/calendar.readonly'
        })
        res.send(authUrl)
    },
    createToken: function(code) {
        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (err, token) => {
                if (err)
                    reject('Error retrieving access token')
                else {
                    oAuth2Client.setCredentials(token)
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err)
                            reject('Token err')
                    })
                    resolve('Created token sucessfully')
                }
            })
        })
    },
    listEvents: function() {
        const calendar = google.calendar('v3')
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        }, (err, res) => {
            if (err)
                return console.log('API error: ', err)
            const events = res.data.items
            if (events.length) {
                console.log('Next 10 events: ')
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date
                    console.log(`${start} - ${event.summary}`)
                })
            } else {
                console.log('No events found')
            }
        })
    }
}

module.exports = CalendarAPI