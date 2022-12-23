const express = require('express')

const NotifCtrl = require('../controllers/notif-ctrl')

const router = express.Router()

router.post('/notif', NotifCtrl.createNotif)
router.put('/notif/:id', NotifCtrl.updateNotif)
router.delete('/notif/:id', NotifCtrl.deleteNotif)
router.get('/notif/:id', NotifCtrl.getNotifById)
router.get('/notifs', NotifCtrl.getNotifs)
router.get('/notifs/clear', NotifCtrl.clearNotifs)

module.exports = router
