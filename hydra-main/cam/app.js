const rtspRelay = require('rtsp-relay');
const express = require('express');
const https = require('https');
const fs = require('fs');

const key = fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/privkey.pem', 'utf8');
const cert = fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/fullchain.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/dev.backend.gericke-psam.com.sg/chain.pem', 'utf8'); // required for iOS 15+

const app = express();
const server = https.createServer({ key, cert, ca }, app);



//added newly for https
//const https = require('https');
//const fs = require('fs');

//const options = {
//  key: fs.readFileSync('privkey.pem'),
//  cert: fs.readFileSync('certificate.pem'),
//  ca: fs.readFileSync('chain.pem')
//};
//https code ends here



const { proxy, scriptUrl } = rtspRelay(app, server);

app.ws('/api/stream/:plot', (ws, req) =>
  proxy({
    url: `rtsp://admin:PSAMhydro01@223.25.74.110:${parseInt(req.params.plot)+1024}/cam/realmonitor?channel=1&subtype=1`,
  })(ws),
);

app.get('/', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'wss://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);



server.listen(543);
//added newly for https
//const server = https.createServer(options, app);
//server.listen(543);


