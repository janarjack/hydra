const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Plant = new Schema(
    {
        name: { type: String, required: true },
        phmin: { type: Number, required: true },
        phmax: { type: Number, required: true},
        ecmin: { type: Number, required: true},
        ecmax: { type: Number, required: true},
        luxmin: { type: Number, required: true},
        luxmax: { type: Number, required: true},
        daystogerminate: { type: Number, required: true},
        daystogrow: { type: Number, required: true},
        daystoharvest: { type: Number, required: true},
        photo: { type: String, required: false},
    },
    { timestamps: true },
)

module.exports = mongoose.model('plants', Plant)
