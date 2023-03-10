const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')

const router = express.Router()

router.post('/user', UserCtrl.createUser)
router.put('/user/:id', UserCtrl.updateUser)
router.put('/user/notif/:id', UserCtrl.updateNotifSwitch)
router.delete('/user/:id', UserCtrl.deleteUser)
router.get('/user/:id', UserCtrl.getUserById)
router.get('/users', UserCtrl.getUsers)
router.post('/login', UserCtrl.userLogin)
router.post('/search-users', UserCtrl.searchUsers)

module.exports = router
