const express = require('express')
const bodyParser = require('body-parser');
const { getProfile } = require('./services/getProfile')
const { writeProfile } = require('./services/writeProfile')
const { updateProfileName } = require('./services/update.js')
const { updateProfileHistory } = require('./services/update.js')
const { updateProfileBadge } = require('./services/update.js')
const validateJwt = require('./validateJwt');


const cors = require('cors');
const app = express();

app.use(cors());
app.options('*', cors());

const port = 5000

app.set('port', port)

const server = app.listen(app.settings.port, () =>
    console.log(`Listening on ${app.settings.port}`)
)


app.set('trust proxy', 'loopback, linklocal, uniquelocal')

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }))
app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', '*'); next(); });

app.get('/dbService', (req, res) => {
    res.send('Sift DB Server is Alive!');
})

app.get('/dbService/*', async (req, res, next) => {

    let isValidToken = false;
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token == "undefined") {
        console.log("Token not passed in request")
        res.status(401).setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ AuthError: "Token not passed in request" }));
        // next(); //THIS next should be removed
    }
    else {
        let result = await validateJwt(token);

        if (result && result.iss == "https://accounts.google.com")
            isValidToken = true;

        //IF JWT is valid - DO below
        if (isValidToken) {
            console.log('Token Validated True on:', Date.now())
            next();
        } else {
            console.log('Token Validation falied at:', Date.now())
            res.status(401).setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ AuthError: "Invalid Authentication Token" }));
            // next(); //THIS next should be removed
        }
    }

});

app.post('/dbService/*', async (req, res, next) => {

    let isValidToken = false;
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token == "undefined") {
        console.log("Token not passed in request")
        res.status(401).setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ AuthError: "Token not passed in request" }));
        // next(); //THIS next should be removed
    }
    else {
        let result = await validateJwt(token);

        if (result && result.iss == "https://accounts.google.com")
            isValidToken = true;

        //IF JWT is valid - DO below
        if (isValidToken) {
            console.log('Token Validated True on:', Date.now())
            next();
        } else {
            console.log('Token Validation falied at:', Date.now())
            res.status(401).setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ AuthError: "Invalid Authentication Token" }));
            // next(); //THIS next should be removed
        }
    }

});

app.get('/dbService/getProfile', async (req, res) => {

    const userId = req.query && req.query.id ? req.query.id : "";

    const apiResponse = await getProfile(userId);
    res.json(apiResponse ? apiResponse : { message: "Something went wrong, check DB API - getProfile" });
})

app.post('/dbService/createProfile', async (req, res) => {

    // console.log("Body->", req.body.profileData);

    const apiResponse = await writeProfile(req.body.profileData);
    res.json(apiResponse ? apiResponse : { message: "Something went wrong, check DB API - writeProfile" });
})

app.post('/dbService/updateProfileName', async (req, res) => {

    const userId = req.query && req.query.id ? req.query.id : "";

    const apiResponse = await updateProfileName(userId, req.body.userName);
    res.json(apiResponse ? apiResponse : { message: "Something went wrong, check DB API - updateProfileName" });
})

app.post('/dbService/updateHistory', async (req, res) => {

    const userId = req.query && req.query.id ? req.query.id : "";

    const apiResponse = await updateProfileHistory(userId, req.body.historyItem);
    res.json(apiResponse ? apiResponse : { message: "Something went wrong, check DB API - updateHistory" });
})

app.post('/dbService/updateBadge', async (req, res) => {

    const userId = req.query && req.query.id ? req.query.id : "";

    const apiResponse = await updateProfileBadge(userId, req.body.badgedata);
    res.json(apiResponse ? apiResponse : { message: "Something went wrong, check DB API - updateBadge" });
})



