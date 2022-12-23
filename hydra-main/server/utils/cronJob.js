const Crop = require('../models/crop-model')
const User = require('../models/user-model')
const Notif = require('../models/notif-model')
const { sendEmail } = require('../utils/sendEmail')

function harvestNotif() {
    const pipeline = [
        { $match: { status: 'active' } },
        {
            $lookup: {
                from: "plants",
                localField: "plant",
                foreignField: "name",
                as: "details"
            }
        }
    ]

    Crop.aggregate(pipeline).exec().then(
        (crops) => {
            crops.forEach(async function (crop) {
                let commence = new Date(crop.commence)
                let daysToHarvest = crop.details[0].daystoharvest
                let remainingDays = parseInt(daysToHarvest) - Math.round((new Date() - commence) / (1000 * 3600 * 24))
                console.log(commence)
                console.log(remainingDays)
                if (remainingDays === 0) {
                    console.log('Ready to Harvest')

                    const notif = new Notif(
                        {
                            type: "readytoharvest",
                            key: crop._id,
                            plant: crop.plant,
                            plot: crop.plot,
                            description: 'Ready to harvest now',
                            status: 'active'
                        }
                    )

                    notif
                        .save()
                        .then(() => {
                            console.log('Notification created')
                        })
                        .catch(error => {
                            console.log('Notification not created')
                        })

                    User.find({ notif : 'true' }, (err, users) => {
                        if (err) {
                            console.log(err)
                        }
                        if (!users.length) {
                            console.log('No users found with notifications enabled')
                        }

                        console.log(users)
                        users.forEach(async user => {
                            await sendEmail(user.email, "Crop Ready to Harvest", crop.plant + ' in plot ' + crop.plot + ' is ready to harvest today.');
                        })
                    }).clone().catch(err => console.log(err))
                } else {
                    console.log('Not Ready to Harvest')
                }
            })
        }
    ).catch(err => {
        console.log(err)
        next(err);
    });
}

module.exports = { harvestNotif }
