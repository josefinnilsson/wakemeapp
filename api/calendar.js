const Promise = require('bluebird')
const google = require('googleapis')
const oAuth = google.auth.OAuth2
const TOKEN_PATH = 'token.json'

function authorize(credentials, callback) {
    const oAuth2Client = new oAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'https://localhost:3001')

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err)
            return getAccessToken(oAuth2Client, callback)
        oAuth2Client.setCredentials(JSON.parse(token))
        callback(oAuth2Client)
    })
}

function getAccessToken(oAuth2Client, callback) {
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

function listEvents(auth) {
    //TODO
}