const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Notif = require('../models/notif-model')

createNotif = (req, res) => {
    const body = req.body
    console.log(body)

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a notif',
        })
    }

    const notif = new Notif(body)

    if (!notif) {
        return res.status(400).json({ success: false, error: err })
    }

    notif
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: notif._id,
                message: 'Notif created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Notif not created!',
            })
        })
}

updateNotif = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Notif.findOne({ _id: req.params.id }, (err, notif) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Notif not found!',
            })
        }
        notif.ph = body.ph
        notif.ec = body.ec
        notif.lux = body.lux
        notif.waterlevel = body.waterlevel
        notif
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: notif._id,
                    message: 'Notif updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Notif not updated!',
                })
            })
    }).clone()
}

deleteNotif = async (req, res) => {
    await Notif.findOneAndDelete({ _id: req.params.id }, (err, notif) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!notif) {
            return res
                .status(404)
                .json({ success: false, error: `Notif not found` })
        }

        return res.status(200).json({ success: true, data: notif })
    }).catch(err => console.log(err))
}

getNotifById = async (req, res, next) => {
    const pipeline = [
        { $match: { _id: ObjectId(req.params.id) } },
        {
            $lookup: {
                from: "plants",
                localField: "plant",
                foreignField: "name",
                as: "details"
            }
        }
    ]
    await Notif.aggregate(pipeline).exec().then(
        (notifs) => {
            console.log(notifs)
            return res.status(200).json({ success: true, data: notifs })
        }
    ).catch(err => {
        console.log(err)
        next(err);
    });
}

getNotifs = async (req, res) => {
    await Notif.find({ status: 'active' }, (err, notifs) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!notifs.length) {
            return res
                .status(404)
                .json({ success: false, error: `Notifications not found` })
        }
        console.log(notifs)
        return res.status(200).json({ success: true, data: notifs })
    }).sort({ createdAt: -1 }).clone().catch(err => console.log(err))
}

clearNotifs = async (req, res) => {
    await Notif.updateMany(
        { status: {$exists: true, $in: ['active']} },
        { status: 'deleted' }
    ).catch(err => console.log(err))
}

module.exports = {
    createNotif,
    updateNotif,
    deleteNotif,
    getNotifs,
    getNotifById,
    clearNotifs,
}
