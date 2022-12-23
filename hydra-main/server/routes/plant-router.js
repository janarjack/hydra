const express = require('express')
const router = express.Router()
const PlantCtrl = require('../controllers/plant-ctrl')

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

router.post('/plant', upload.single('photo'), PlantCtrl.createPlant)
router.put('/plant', upload.single('photo'), PlantCtrl.updatePlant)
router.delete('/plant/:id', PlantCtrl.deletePlant)
router.get('/plant/:id', PlantCtrl.getPlantById)
router.get('/plants', PlantCtrl.getPlants)

module.exports = router
