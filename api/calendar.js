const Promise = require('bluebird')
const readline = require('readline');
const {google} = require('googleapis')
const fs = require('fs')
const oAuth = google.auth.OAuth2
const TOKEN_PATH = 'token.json'
const User = require('./user.js')
const UserSettings = require('./userSettings.js')
let host = ''
let email = ''

let oAuth2Client = null

function setHost(req) {
    if (req.headers.host === 'localhost:3001') {
        host = 'http://localhost:3001'
    } else {
        host = 'https://wakemeapp.herokuapp.com'
    }
    oAuth2Client = new oAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET, `${host}/calendar_callback`)
}

function setEmail(user_email) {
    email = user_email
}

const CalendarAPI = {
    authorize: function(res, req, email) {
        setHost(req)
        setEmail(email)
        return new Promise(resolve => {
            UserToken.getToken()
            .then(token => {
                if (token === '-') {
                    CalendarAPI.getAccessToken(res, oAuth2Client)
                    resolve('NO_TOKEN')
                } else {
                    oAuth2Client.setCredentials(JSON.parse(token))
                    resolve(oAuth2Client)
                }
            })
            .catch(err => {
                console.log(err)
            })
        })
    },
    getAccessToken: function(res, oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', scope: 'https://www.googleapis.com/auth/calendar.readonly', prompt: 'consent'
        })
        res.json({url: authUrl})
    },
    createToken: function(code, req) {
        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (err, tokens) => {
                if (err) {
                    reject(err)
                } else {
                    oAuth2Client.setCredentials(tokens)
                    UserToken.update(tokens)
                    .then(() => {
                        resolve(oAuth2Client)
                    })
                    .catch(err => {
                        console.log(err)
                    })
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
            if (err) {
                console.log(err)
            }
            const events = response.data.items
            if (events.length) {
                let events_json = []
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date
                    const end = event.end.dateTime || event.end.date
                    const location = event.location || 'NO_LOCATION'
                    const link = event.htmlLink
                    const json = {start: start, end: end, location: location, summary: event.summary, link: link}
                    events_json.push(json)
                })
                res.json({events: events_json})
            } else {
                res.json({events: 'No events found'})
            }
        })
    },
    revoke: function(email) {
        setEmail(email)
        if (oAuth2Client !== null) {
            oAuth2Client.revokeCredentials()
        }
        UserToken.update('-')
        .catch(err => {
            console.log(err)
        })
    },
    isAuthorized: function(email) {
        setEmail(email)
        return new Promise(resolve => {
            UserToken.getToken()
            .then(token => {
                if (token === '-') {
                    resolve('NOT_AUTHORIZED')
                } else {
                    resolve('AUTHORIZED')
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
}


const UserToken = {
    update: (token_obj) => {
        return new Promise ((resolve, reject) => {
            User.findOne( { email }, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    const query = {'_id': user._id}
                    let token = token_obj
                    if (token !== '-')
                        token = JSON.stringify(token_obj)
                    UserSettings.findOneAndUpdate(query, { token }, (err, userSettings) => {
                        if (err) {
                            resolve({message: err})
                            return
                        }
                        resolve({message: 'Successful'})
                    })
                }
            })
        })
    },

    getToken: () => {
        return new Promise ((resolve, reject) => {
            User.findOne( { email }, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    const _id = user._id
                    UserSettings.findOne( { _id }, (err, userSettings) => {
                        resolve(userSettings.token)
                    })
                }
            })
        })
    }
}

module.exports = CalendarAPI