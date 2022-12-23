const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Crop = new Schema(
    {
        plant: { type: String, required: false },
        plot: { type: Number, required: false },
        commence: { type: Date, required: false},

        ph: { type: Number, required: false},
        ec: { type: Number, required: false},
        lux: { type: Number, required: false},
        waterlevel: { type: Number, required: false},

        department: { type: String, required: false },

        status: { type: String, required: false },
        wc: { type: Number, required: false},
        'nc 1': { type: Number, required: false},
        'nc 2': { type: Number, required: false},
        'nc 3': { type: Number, required: false},
    },
    { timestamps: true },
)

module.exports = mongoose.model('crops', Crop)
