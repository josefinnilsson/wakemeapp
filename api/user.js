const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const salt_rounds = 10

const UserSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true }
})

UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        const document = this
        bcrypt.hash(document.password, salt_rounds, function(err, hashed_password) {
            console.log(hashed_password)
            if (err) {
                console.log("err")
                next(err)
            } else {
                document.password = hashed_password
                next()
            }
        })
    } else {
        next()
    }
})

UserSchema.methods.checkPassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, same) => {
        if (err) {
            callback(err)
        } else {
            callback(err, same)
        }
    })
}

module.exports = mongoose.model('User', UserSchema)