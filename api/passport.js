const jwt_strategy = require('passport-jwt').Strategy
const extract_jwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = require('./user.js')

const opts = {}
opts.jwt_from_request = extract_jwt.fromAuthHeaderAsBearerToken()
opts.secret = process.env.SECRET

module.exports = passport => {
    passport.use(
        new jwt_strategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
            .then(user => {
                if (user)
                    return done(null, user)
                return done(null, false)
            })
            .catch(err => {
                console.log(err)
            })
        })
    )
}