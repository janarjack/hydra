const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Crop = require('../models/crop-model')
const User = require('../models/user-model')
const Notif = require('../models/notif-model')
const Nutrients = require('../models/nutrients-model')
const { sendEmail, sendEmailAttchment } = require('../utils/sendEmail')
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");


createCrop = (req, res) => {
    const body = req.body
    console.log(body)

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a crop',
        })
    }

    const crop = new Crop(body)

    if (!crop) {
        return res.status(400).json({ success: false, error: err })
    }

    crop
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: crop._id,
                message: 'Crop created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Crop not created!',
            })
        })
}

updateCrop = async (req, res, next) => {
    const body = req.body
    const cropId = req.params.id;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

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

    Crop.findOne({ _id: req.params.id }, (err, crop) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Crop not found!',
            })
        }
        crop.ph = body.ph
        crop.ec = body.ec
        crop.lux = body.lux ? body.lux : 0
        crop.wc = body.wc ?  body.wc :0
        crop['nc 1'] = body['nc 1'] ? body['nc 1'] : 0
        crop['nc 2'] = body['nc 2'] ? body['nc 2'] : 0
        crop['nc 3'] = body['nc 3'] ? body['nc 3'] : 0
        crop.waterlevel = body.waterlevel
        crop
            .save()
            .then(async () => {
                try {
                    await updateCropNutrient({ ...body, cropId });
                } catch (err) {
                    console.log('Error updating crop details', err);
                    throw err;
                }
                Crop.aggregate(pipeline).exec().then(
                    (crops) => {
                        console.log(crops[0])
                        let warning = false
                        let description = ''

                        if (body.ph < crops[0].details[0].phmin) {
                            warning = true
                            description = 'pH low'
                        }
                        if (body.ph > crops[0].details[0].phmax) {
                            warning = true
                            description = description + ' pH high'
                        }
                        if (body.ec < crops[0].details[0].ecmin) {
                            warning = true
                            description = description + ' EC low'
                        }
                        if (body.ec > crops[0].details[0].ecmax) {
                            warning = true
                            description = description + ' EC high'
                        }
                        if (body.lux < crops[0].details[0].luxmin || body.lux > crops[0].details[0].luxmax) {
                            warning = true
                            description = description + ' DLI low'
                        }
                        if (body.lux > crops[0].details[0].luxmax) {
                            warning = true
                            description = description + ' DLI high'
                        }
                        if (body.waterlevel === 0) {
                            warning = true
                            description = description + ' Water level low'
                        }

                        if (warning) {
                            // Prepare payload for creating a Notification
                            data = {
                                type: "sensorwarning",
                                key: req.params.id,
                                plant: crops[0].plant,
                                plot: crops[0].plot,
                                description: description,
                                status: 'active'
                            }
                            console.log(data)

                            // Create notification object
                            const notif = new Notif(data)

                            if (notif) {
                                notif
                                    .save()
                                    .then(() => {
                                        console.log("Notification for Sensor Warning created!")
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
                                                    "Sensor Warning",
                                                    crop.plant +
                                                    ' in plot ' +
                                                    crop.plot +
                                                    ' has received a sensor warning with description: "' +
                                                    description + ' ".');
                                            })
                                        }).clone().catch(err => console.log(err))
                                    })
                                    .catch(error => {
                                        console.log("Notification for Sensor Warning failed!")
                                    })
                            }
                        }
                    }
                ).catch(err => {
                    console.log(err)
                    next(err);
                });

                return res.status(200).json({
                    success: true,
                    id: crop._id,
                    message: 'Crop updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Crop not updated!',
                })
            })
    }).clone()
}

async function updateCropNutrient(body) {
    console.log(body)
    try {
        const nutrientDetail = {};
        nutrientDetail.cropId = body.cropId;
        nutrientDetail.ph = body.ph
        nutrientDetail.ec = body.ec
        nutrientDetail.lux = body.lux ? body.lux : 0
        nutrientDetail.waterlevel = body.waterlevel ? body.waterlevel : 0;
        nutrientDetail.wc = body.wc ? body.wc : 0;
        nutrientDetail['nc 1'] = body['nc 1'] ? body['nc 1']: 0;
        nutrientDetail['nc 2'] = body['nc 2'] ? body['nc 2']: 0;
        nutrientDetail['nc 3'] = body['nc 3'] ? body['nc 3']: 0;
        const nutrient = new Nutrients(nutrientDetail);
        nutrient
            .save()
            .then(() => {
                return true;
            })
            .catch(error => {
                throw error;
            })
    } catch (err) {
       console.log(`Error updating crop nutrient details for `, body);
        throw err;
    }
}

updateCropByPlot = async (req, res, next) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const pipeline = [
        { $match: { plot: body.plot } },
        {
            $lookup: {
                from: "plants",
                localField: "plant",
                foreignField: "name",
                as: "details"
            }
        }
    ]

    Crop.findOne({ plot: body.plot }, (err, crop) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Crop not found!',
            })
        }
        crop.ph = body.ph
        crop.ec = body.ec
        crop.lux = body.lux
        crop.waterlevel = body.waterlevel
        crop
            .save()
            .then(() => {
                Crop.aggregate(pipeline).exec().then(
                    (crops) => {
                        console.log(crops[0])
                        let warning = false
                        let description = ''

                        if (body.ph < crops[0].details[0].phmin) {
                            warning = true
                            description = 'pH low'
                        }
                        if (body.ph > crops[0].details[0].phmax) {
                            warning = true
                            description = description + ' pH high'
                        }
                        if (body.ec < crops[0].details[0].ecmin) {
                            warning = true
                            description = description + ' EC low'
                        }
                        if (body.ec > crops[0].details[0].ecmax) {
                            warning = true
                            description = description + ' EC high'
                        }
                        if (body.lux < crops[0].details[0].luxmin || body.lux > crops[0].details[0].luxmax) {
                            warning = true
                            description = description + ' DLI low'
                        }
                        if (body.lux > crops[0].details[0].luxmax) {
                            warning = true
                            description = description + ' DLI high'
                        }
                        if (body.waterlevel == 0) {
                            warning = true
                            description = description + ' Water level low'
                        }

                        if (warning) {
                            // Prepare payload for creating a Notification
                            data = {
                                type: "sensorwarning",
                                key: crops[0]._id,
                                plant: crops[0].plant,
                                plot: crops[0].plot,
                                description: description,
                                status: 'active'
                            }
                            console.log(data)

                            // Create notification object
                            const notif = new Notif(data)

                            if (notif) {
                                notif
                                    .save()
                                    .then(() => {
                                        console.log("Notification for Sensor Warning created!")

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
                                                    "Sensor Warning",
                                                    crop.plant +
                                                    ' in plot ' +
                                                    crop.plot +
                                                    ' has received a sensor warning with description: "' +
                                                    description + ' ".');
                                            })
                                        }).clone().catch(err => console.log(err))
                                    })
                                    .catch(error => {
                                        console.log("Notification for Sensor Warning failed!")
                                    })
                            }
                        }
                    }
                ).catch(err => {
                    console.log(err)
                    next(err);
                });

                return res.status(200).json({
                    success: true,
                    id: crop._id,
                    message: 'Crop updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Crop not updated!',
                })
            })
    }).clone()
}

deleteCrop = async (req, res) => {
    await Crop.findOneAndDelete({ _id: req.params.id }, (err, crop) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!crop) {
            return res
                .status(404)
                .json({ success: false, error: `Crop not found` })
        }

        return res.status(200).json({ success: true, data: crop })
    }).clone().catch(err => console.log(err))
}

getCropById = async (req, res, next) => {
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
    await Crop.aggregate(pipeline).exec().then(
        (crops) => {
            console.log(crops)
            return res.status(200).json({ success: true, data: crops })
        }
    ).catch(err => {
        console.log(err)
        next(err);
    });
}

getCrops = async (req, res, next) => {
    const pipeline = [
        { $sort: { plot: 1 } },
        {
            $lookup: {
                from: "plants",
                localField: "plant",
                foreignField: "name",
                as: "details"
            }
        }
    ]
    await Crop.aggregate(pipeline).exec().then(
        (crops) => {
            console.log(crops)
            let cropsList = []
            crops.forEach(function (crop) {
                if (crop.status === 'active') {
                    let cropObj = {}
                    let percent = 0

                    let harvestDate = new Date(crop.commence)

                    if (crop.details[0]) {
                        let daysToHarvest = crop.details[0].daystoharvest
                        harvestDate.setDate(harvestDate.getDate() + (parseInt(daysToHarvest) - 1))
                        let remainingDays = ((harvestDate - new Date()) / (1000 * 3600 * 24)) + 1

                        if (remainingDays < 0) {
                            percent = 100
                        } else {
                            percent = (parseInt(daysToHarvest) - parseInt(remainingDays)) / parseInt(daysToHarvest) * 100
                        }

                        cropObj = {
                            _id: crop._id,
                            plant: crop.plant,
                            plot: crop.plot,
                            commence: crop.commence,
                            department: crop.department,
                            status: crop.status,
                            percent: Math.round(percent),
                            details: crop.details,
                            ph: crop.ph,
                            ec: crop.ec,
                            lux: crop.lux,
                            waterlevel: crop.waterlevel,
                            remainingDays: Math.round(remainingDays)
                        }
                        cropsList.push(cropObj)
                    }
                }
            });

            console.log(cropsList)
            return res.status(200).json({ success: true, data: cropsList })
        }
    ).catch(err => {
        console.log(err)
        next(err);
    });
}

harvestCrop = async (req, res) => {
    Crop.findOne({ _id: ObjectId(req.params.id) }, (err, crop) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Crop not found!',
            })
        }
        crop.status = 'harvested'

        crop
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: crop._id,
                    message: 'Crop updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Crop not updated!',
                })
            })
    }).clone()
}

getnutrientsAverage = async (req, res) => {
    const { cropId } = req.params
    if (!cropId) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a crop Id',
        })
    }
    console.log(cropId)
    await Nutrients.aggregate([
        { $match: { cropId: ObjectId(cropId) } },
        {
            $group:
            {
                _id: "$cropId",
                avgLux: { $avg: '$lux' },
                avgWc: { $avg: "$wc" },
                avgWaterLevel: { $avg: "$waterlevel" },
                avgNc: { $avg: { $sum: ['$nc 2', '$nc 3'] } }
            }
        },
        {
            $project: {
                avgLux: { $trunc: ["$avgLux", 1] },
                avgWaterLevel: { $trunc: ["$avgWaterLevel", 1] },
                avgWc: { $trunc: ["$avgWc", 1] },
                avgNc: { $trunc: ["$avgNc", 1] }
            }
        }
    ]).exec().then(
        (document) => {
            console.log(document)
            if (document && document.length > 0) {
                return res.status(200).json({
                    success: true, data: document[0]
                })
            } else {
                return res.status(404).json({
                    success: false, error: 'No Crop found'
                })
            }
        }).catch(err => {
            console.log(`Error getting average nutrients value for crop id `, cropId);
            throw err;
        })
}

getnutrientsAverageLocal = async (cropId) => {
    try {
        const document = await Nutrients.aggregate([
            { $match: { cropId: ObjectId(cropId) } },
            {
                $group:
                {
                    _id: "$cropId",
                    avgLux: { $avg: '$lux' },
                    avgWc: { $avg: "$wc" },
                    avgWaterLevel: { $avg: "$waterlevel" },
                    avgNc: { $avg: { $sum: ['$nc 2', '$nc 3'] } }
                }
            },
            {
                $project: {
                    avgLux: { $trunc: ["$avgLux", 1] },
                    avgWaterLevel: { $trunc: ["$avgWaterLevel", 1] },
                    avgWc: { $trunc: ["$avgWc", 1] },
                    avgNc: { $trunc: ["$avgNc", 1] }
                }
            }
        ]);
        if (document && document.length > 0) {
            return document[0];
        } else {
            return null;
        }
    } catch (err) {
        console.log(`Error getting average nutrients value for crop id `, cropId);
        throw err;
    }
}

const generatePdf = async (req, res, next) => {
    const { cropId } = req.params;
    const { email, fileName } = req.query;
    if (!cropId) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a crop id',
        })
    }
    try {
        const data = await getnutrientsAverageLocal(cropId);
        if (data) {
            const html = fs.readFileSync(path.join(__dirname, '../utils/templates/template.html'), 'utf-8');
            const filename = fileName + '.pdf';
            let array = [];
            const manureLogo = fs.readFileSync(path.join(__dirname, '../images/manure.png')).toString('base64');
            const sunLogo = fs.readFileSync(path.join(__dirname, '../images/unnamed.png')).toString('base64');
            const waterLogo = fs.readFileSync(path.join(__dirname, '../images/water.png')).toString('base64');
            const document = {
                html: html,
                data: {
                    users: data,
                    manureLogo: manureLogo,
                    sunLogo: sunLogo,
                    waterLogo: waterLogo,
                    stylesheet: req.protocol + '://' + req.get('host') + '/utils/templates/template.css'
                },
                path: './docs/' + filename
            }
            const options = {
                format: 'A4',
                orientation: 'landscape',
                border: '2mm'
            }
            pdf.create(document, options)
                .then(async (data) => {
                    res.contentType('application/pdf');
                    await sendEmailAttchment(email,filename,path.join(__dirname + '/../docs/' + filename),
                    'Please find the attachment','Crop Label - ' + fileName)
                    fs.readFile(__dirname + '/../docs/' + filename, (err, dataPDF) => {
                        if (err) {res.status(500).send(err);}
                        res.send(`data:application/pdf;base64,${new Buffer.from(dataPDF).toString('base64')}`);
                    });
                }).catch(error => {
                    console.log(error);
                    res.status(422).json({ error: true, message: 'Failed to generate PDF' })
                });
        } else {
            res.status(404).json({ error: true, message: 'no data found' })
        }
    } catch (err) {
        return res.status(422).json({
            success: false,
            error: `Error fetching nutrient value for crop id ${cropId} ${err}`
        })
    }

}

module.exports = {
    createCrop,
    updateCrop,
    deleteCrop,
    getCrops,
    getCropById,
    updateCropByPlot,
    harvestCrop,
    getnutrientsAverage,
    generatePdf
}
