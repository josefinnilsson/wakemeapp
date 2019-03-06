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

router.get('/test', function(req, res, next) {
    const names = [
        {name: "test1"},
        {name: "test2"},
        {name: "test3"},
    ]
    res.json(names)
})

module.exports = router
