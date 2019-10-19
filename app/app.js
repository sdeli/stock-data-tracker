// ==== Set Up Environment ====
const dotenv = require('dotenv');
let dotenvObj = dotenv.config({ path: './.env.default' });
if (dotenvObj.error) throw new Error(dotenvObj.error);

const path = require("path");
// ==== Third Party Packages ====
const express = require('express');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');

// ==== Local Npm Modules ====
const config = require('config');
const setUpPassportAuth = require('set-up-passport-auth');
const flashMessaging = require('flash-messaging');
const errorHandler = require('error-handler');
const { startApyKeyIpPortfeederServer } = require("utils");
const stockDataTrackerServer = require('stock-data-tracker-server');

const authRouter = require('./routers/auth-router/auth-router');
const applicationRouter = require('./routers/application-router/application-router');
const errorRouter = require('./routers/error-router/error-router');

// ==== Constants ====
const FOUR_O_FOUR__EP = config.eps.fourOfour;

// ==== App Setup ====
let app = express();

app.use(validator());

app.use(session({
    secret: config.expressSession.salt,
    resave: config.expressSession.reSave,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: null },
    saveUninitialized: config.expressSession.saveUninitialized
}));

setUpPassportAuth(app);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use(flashMessaging);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ==== routers ====
app.use(authRouter);
app.use(applicationRouter);
app.use(errorRouter);

app.use((req, res) => {
    console.log(req.url);
    if (req.method === "GET" || req.method === "POST") {
        res.redirect(FOUR_O_FOUR__EP);
    } else {
        // node.js redirect doesnt change the method from DELETE and from PUT to GET.
        // thatswhy if the initial request was put or delete and it gets redirected, then the redirect request
        // will be the same DELTE or PUT and so express wont find the route where it has been redirected.
        // Here I would redirect to /error/404 but due to that is a GET route it wont be found and the request
        // would loop inot here again and again.
        // So I use DELETE OR PUT requests just in ajax and just send the error redirects ep where on the front end will be
        // redirected /error/404.
        res.send(FOUR_O_FOUR__EP);
    }
});

// ==== Err Handling ====
app.use(errorHandler);

startApyKeyIpPortfeederServer();
stockDataTrackerServer();
app.listen(config.listen);
console.log('up & running');