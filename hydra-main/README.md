<!--Hydra Project Version 2 -->
## Hydra Project Version 2

The below steps will help you in building and running the project

### Software
1. NodeJS, version 14.18.1, NPM, version 6.14.15
2. MongoDB, version 5.0.3
3. FFMPEG, version 4.2.4-1ubuntu0.1

###   Codebase
1. API server is located at “code/server”
2. Web app is located at “code/client”
3. Camera streaming server is located at “code/cam1”

### Technology
1. API server is built on ExpressJS
2. Web app is built on ReactJS
3. Database is using MongoDB
4. Runtime platform for web app and API server is NodeJS
5. Camera livestreaming server is built on NodeJS using FFMPEG
  
### Application
1. Create a database named “hydra” in MongoDB
2. Extract the codebase inside “/opt” directory
3. Navigate to “/opt/code/server” directory
4. Execute command “npm install”
5. Execute command “node index.js”
6. Navigate to “opt/code/client” directory
7. Execute command “npm install”
8. Execute command “npm start”
9. Navigate to “opt/code/cam1” directory ##
10. Execute command “npm install”
11. Execute command “node app.js”

### Live URL

Access this from client .env file

REACT_APP_API_URL=https://dev.backend.gericke-psam.com.sg:3000/api
REACT_APP_SERVER_IMAGES=https://dev.backend.gericke-psam.com.sg:3000/images/
REACT_APP_CLIENT_URL=https://www.gericke-psam.com.sg/

### Test URL

Access this from client .env file

REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SERVER_IMAGES=http://localhost:3000/images/
REACT_APP_CLIENT_URL=http://localhost:8000/