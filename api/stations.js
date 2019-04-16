const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const StationsSchema = new mongoose.Schema({
    _id:                { type: ObjectId, required: true },
    document_id:        { type: String, required: true },
    responseData:       { type: String, required: false }
})

module.exports = mongoose.model('Stations', StationsSchema)