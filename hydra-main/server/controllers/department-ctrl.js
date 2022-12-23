const mongoose = require('mongoose')
const Department = require('../models/department-model')


listDepartment = async (req, res) => {
    await Department.find({}, (err, departments) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!departments.length) {
            return res
                .status(404)
                .json({ success: false, error: `Department not found` })
        }
        return res.status(200).json({ success: true, data: departments })
    }).clone().catch(err => console.log(err))
}

module.exports = {
   listDepartment
}
