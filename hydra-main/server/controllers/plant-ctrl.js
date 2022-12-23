const Plant = require('../models/plant-model')
const User = require('../models/user-model')
const { sendEmail } = require('../utils/sendEmail')

createPlant = (req, res) => {
    const body = req.body
    body.photo = req.file.filename
    console.log(body)
    console.log(req.file.filename)

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a plant',
        })
    }

    const plant = new Plant(body)

    if (!plant) {
        return res.status(400).json({ success: false, error: err })
    }

    plant
        .save()
        .then(() => {
            console.log('Plant created')

            User.find({ notif: 'true' }, (err, users) => {
                if (err) {
                    console.log(err)
                }
                if (!users.length) {
                    console.log('No users found with notifications enabled')
                }

                console.log(users)
                users.forEach(async user => {
                    await sendEmail(
                        user.email,
                        "Plant Database Updated",
                        plant.name +
                        ' has been added in the database.');
                })
            }).clone().catch(err => console.log(err))

            return res.status(201).json({
                success: true,
                id: plant._id,
                message: 'Plant created!',
            })
        })
        .catch(error => {
            console.log('Plant not created')
            console.log(error)
            return res.status(400).json({
                error,
                message: 'Plant not created!',
            })
        })
}

updatePlant = (req, res) => {
    const body = req.body
    console.log(req.file)
    if (req.file !== 'undefined' && req.file !== undefined)
        body.photo = req.file.filename

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Plant.findOne({ _id: body.id }, (err, plant) => {
        if (err) {
            console.log('Inside Err')
            return res.status(404).json({
                err,
                message: 'Plant not found!',
            })
        }

        plant.name = body.name
        plant.phmin = body.phmin
        plant.phmax = body.phmax
        plant.ecmin = body.ecmin
        plant.ecmax = body.ecmax
        plant.luxmin = body.luxmin
        plant.luxmax = body.luxmax
        plant.daystogerminate = body.daystogerminate
        plant.daystogrow = body.daystogrow
        plant.daystoharvest = body.daystoharvest
        if (req.file !== 'undefined' && req.file !== undefined)
            plant.photo = body.photo
        plant
            .save()
            .then(() => {
                console.log("Plant updated")

                User.find({ notif: 'true' }, (err, users) => {
                    if (err) {
                        console.log(err)
                    }
                    if (!users.length) {
                        console.log('No users found with notifications enabled')
                    }

                    console.log(users)
                    users.forEach(async user => {
                        await sendEmail(
                            user.email,
                            "Plant Database Updated",
                            plant.name +
                            ' has been updated in the database.');
                    })
                }).clone().catch(err => console.log(err))

                return res.status(200).json({
                    success: true,
                    id: plant._id,
                    message: 'Plant updated!',
                })
            })
            .catch(error => {
                console.log("inside catch")
                return res.status(404).json({
                    error,
                    message: 'Plant not updated!',
                })
            })
    }).clone()
}

deletePlant = async (req, res) => {
    await Plant.findOneAndDelete({ _id: req.params.id }, (err, plant) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!plant) {
            return res
                .status(404)
                .json({ success: false, error: `Plant not found` })
        }

        return res.status(200).json({ success: true, data: plant })
    }).catch(err => console.log(err))
}

getPlantById = async (req, res) => {
    await Plant.findOne({ _id: req.params.id }, (err, plant) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!plant) {
            return res
                .status(404)
                .json({ success: false, error: `Plant not found` })
        }
        return res.status(200).json({ success: true, data: plant })
    }).clone().catch(err => console.log(err))
}

getPlants = async (req, res) => {
    await Plant.find({}, (err, plants) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!plants.length) {
            return res
                .status(404)
                .json({ success: false, error: `Plant not found` })
        }
        //console.log(plants)
        return res.status(200).json({ success: true, data: plants })
    }).clone().catch(err => console.log(err))
}

module.exports = {
    createPlant,
    updatePlant,
    deletePlant,
    getPlants,
    getPlantById,
}
