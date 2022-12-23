const express = require('express')

const DepartmentCtrl = require('../controllers/department-ctrl')

const router = express.Router()

router.get('/departments', DepartmentCtrl.listDepartment)

module.exports = router
