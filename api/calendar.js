const Promise = require('bluebird')
const readline = require('readline');
const {google} = require('googleapis')
const fs = require('fs')
const oAuth = google.auth.OAuth2
const TOKEN_PATH = 'token.json'

const CalendarAPI = {
    authorize: function(callback) {
        const oAuth2Client = new oAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'http://localhost:3001')
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err)
                return CalendarAPI.getAccessToken(oAuth2Client, callback)
            oAuth2Client.setCredentials(JSON.parse(token))
            callback(oAuth2Client)
        })
    },
    getAccessToken: function(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', scope: 'https://www.googleapis.com/auth/calendar.readonly'
        })
        console.log('Authorize by visiting: ', authUrl)
        const input = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        input.question('Enter the code: ', (code) => {
            input.close()
            oAuth2Client.getToken(code, (err, token) => {
                if (err)
                    console.log('Error retrieving access token')
                else {
                    console.log('Authentication success')
                }
                oAuth2Client.setCredentials(token)
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err)
                        console.log(err)
                })
                callback(oAuth2Client)
            })
        })
    },
    listEvents: function(auth) {
        const calendar = google.calendar({ version: 'v3', auth })
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
exports.authorize = (credentials, callback) => {
    const oAuth2Client = new oAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'https://localhost:3000')

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err)
            return getAccessToken(oAuth2Client, callback)
        oAuth2Client.setCredentials(JSON.parse(token))
        callback(oAuth2Client)
    })
}

exports.getAccessToken = (oAuth2Client, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', scope: 'https://www.googleapis.com/auth/calendar.readonly'
    })
    console.log('Authorize by visiting: ', authUrl)
    const input = readline.creaeInterface({
        input: process.stdin,
        output: process.stdout
    })
    input.question('Enter the code: ', (code) => {
        input.close()
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                conosle.log('Error retrieving access token')
            oAuth2Client.setCredentials(token)
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    console.log(err)
            })
            callback(oAuth2Client)
        })
    })
}

module.exports = CalendarAPI