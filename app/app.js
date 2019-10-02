// ==== Set up module linking ====
const path = require('path');

// ==== Npm Third Party Packages ====
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// ==== Set Up Environment ====
const config = require('config');

let err = dotenv.config({ path: './.env.default' });
if (err) throw new Error(err);

// ==== Local Npm Modules ====
const validator = require('express-validator');
const setUpPassportAuth = require('set-up-passport-auth');
const flashMessaging = require('flash-messaging');
const errorHandler = require('error-handler');
const apiAndIpFeeder = require('api-and-ip-feeder-server');

// ==== Constants ====
const FOUR_O_FOUR__ID = config.templateConf.fourOFour.id;
const FOUR_O_FOUR__EP = config.restEndpoints.error.replace(/(.*\/)(:\w+)/, `$1${FOUR_O_FOUR__ID}`);

// ==== Routers ====
const runIsWorthForInvestmentForAllStocks = require('./controllers/run-is-worth-for-investment-for-all-stocks/run-is-worth-for-investment-for-all-stocks.js');

// ==== App Setup ====
let app = express();
app.use(validator());

const options = {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    clearExpired: true,
};

const sessionStore = new MySQLStore(options);

app.use(session({
    secret: config.expressSession.salt,
    resave: config.expressSession.resave,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: null },
    store: sessionStore,
    saveUninitialized: config.expressSession.saveUninitialized
}));

setUpPassportAuth(app);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use(flashMessaging);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(runIsWorthForInvestmentForAllStocks);
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

apiAndIpFeeder();
app.listen(4000);
