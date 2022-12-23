const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, required: true},
        notif: { type: String, required: false},
        password: { type: String, required: true},
        departmentCode:  { type: String, required: false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('users', User)
