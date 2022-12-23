const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Nutrients = new Schema(
    {
        cropId: { type: Schema.Types.ObjectId, required: true },
        ph: { type: Number, required: false},
        ec: { type: Number, required: false},
        lux: { type: Number, required: false},
        wc: { type: Number, required: false},
        waterlevel: { type: Number, required: false},
        'nc 1': { type: Number, required: false},
        'nc 2': { type: Number, required: false},
        'nc 3': { type: Number, required: false},
    },
    { timestamps: true },
)

module.exports = mongoose.model('nutrients', Nutrients)
