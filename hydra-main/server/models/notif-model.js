const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Notif = new Schema(
    {
        type: { type: String, required: true },
        message: { type: String, required: false },
        description: { type: String, required: false},
        key: { type: String, required: false},
        plant: { type: String, required: false},
        plot: { type: Number, required: false},
        status: { type: String, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('notifs', Notif)
