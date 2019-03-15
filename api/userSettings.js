const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const UserSettingsSchema = new mongoose.Schema({
    _id:                { type: ObjectId, required: true },
    stationName:        { type: String, required: false },
    stationId:          { type: Number, required: false },
    bus:                { type: Boolean, required: false },
    metro:              { type: Boolean, required: false },
    train:              { type: Boolean, required: false },
    tram:               { type: Boolean, required: false },
    ship:               { type: Boolean, required: false },
    token:              { type: String, required: false}
})

module.exports = mongoose.model('User_setting', UserSettingsSchema)