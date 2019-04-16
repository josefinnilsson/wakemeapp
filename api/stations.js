const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const StationsSchema = new mongoose.Schema({
    _id:                { type: String, required: true },
    all_stations:       { type: String, required: false }
})

module.exports = mongoose.model('Stations', StationsSchema)