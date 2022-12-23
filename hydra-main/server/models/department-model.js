const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Department = new Schema(
    {
        departmentName: { type: String, required: false },
        departmentCode: { type: String, required: false }
    }
)

module.exports = mongoose.model('department', Department)
