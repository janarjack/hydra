const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const schedule = require('node-schedule')

const db = require('./db')
const userRouter = require('./routes/user-router')
const plantRouter = require('./routes/plant-router')
const cropRouter = require('./routes/crop-router')
const notifRouter = require('./routes/notif-router')
const departmentRouter = require('./routes/department-router')
const passwordReset = require('./routes/passwordReset')
const job = require('./utils/cronJob')

const app = express()
const apiPort = 3000

//added newly for https
const https = require('https');
const fs = require('fs');

const options = {
 // key: fs.readFileSync('privkey.pem'),
 // cert: fs.readFileSync('certificate.pem'),
 // ca: fs.readFileSync('chain.pem')

  key: fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/fullchain.pem', 'utf8'),
  ca: fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/chain.pem', 'utf8')
};

//const key = fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/privkey.pem', 'utf8');
//const cert = fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/fullchain.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/chain.pem', 'utf8');

//https code ends here


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))


app.use(express.static(path.join(__dirname, 'utils')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use('/utils', express.static(path.join(__dirname, 'utils')));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', userRouter)
app.use('/api', plantRouter)
app.use('/api', cropRouter)
app.use('/api', notifRouter)
app.use('/api', departmentRouter)

app.use("/api/password-reset", passwordReset);
app.use("/images", express.static('images'));

//*/5 * * * * *
schedule.scheduleJob('0 8 * * *', function () {
    job.harvestNotif()
})

//commenting this for https changes
//app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
const server = https.createServer(options, app);
server.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
