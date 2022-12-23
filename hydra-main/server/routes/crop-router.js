const express = require('express')

const CropCtrl = require('../controllers/crop-ctrl')

const router = express.Router()

router.post('/crop', CropCtrl.createCrop)
router.put('/crop/:id', CropCtrl.updateCrop)
router.delete('/crop/:id', CropCtrl.deleteCrop)
router.get('/crop/:id', CropCtrl.getCropById)
router.get('/crops', CropCtrl.getCrops)
router.put('/crop', CropCtrl.updateCropByPlot)
router.put('/crop/harvest/:id', CropCtrl.harvestCrop)
router.get('/crop/nutrients/:cropId',CropCtrl.getnutrientsAverage)
router.get('/crop/download/pdf/:cropId',CropCtrl.generatePdf)

module.exports = router
