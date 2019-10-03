const config = require('config');
const fs = require('fs');

const ERR_LOG_FILE__PATH = config.logs.errPath,
    NODE_ENV = process.env.NODE_ENV,
    FIVE_O_ONE__EP = config.eps.fiveOOne;

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    let notErrWith404View = !Boolean(err.fourOfourErr);

    if (NODE_ENV === 'development' && req && res && notErrWith404View) {
        console.log(err.name);
        console.log(err.stack);
        res.status(500).json(err);
    } else if (NODE_ENV === 'development' && req  && !res && notErrWith404View) {
        console.log(err.stack);
    } else if (NODE_ENV === 'production' && req  && !res && notErrWith404View) {
        let errText = getErrorText(req, err);
        logErr(errText);
    } else if (NODE_ENV === 'production' && req  && res && notErrWith404View) {
        let errText = getErrorText(req, err);
        logErr(errText);
        redirectTo501(req, res);
    } else {
        let errText = JSON.stringify(err);
        logErr(errText);
    }
}

function getErrorText(req, err) {
    let currHeaders = JSON.stringify(req.headers, null, 2);
    let currReqBody = JSON.stringify(req.body, null, 2);
    let flashMsgsFromPrevCall = JSON.stringify(req.session.flashMsgs, null, 2);
    let currCookies = JSON.stringify(req.cookies, null, 2);
    let currParams = JSON.stringify(req.params, null, 2);

    let errorLogMsg = `\n\n//////////////// NEW ERROR ////////////////`
        + `\nERROR AT: ${getTimestamp()}`;

    let isErrorString = typeof err === 'string';
    if (isErrorString) {
        errorLogMsg += ''
            + '\n\n================= ERR MESSAGE =================\n'
            + err;
    } else {
        errorLogMsg += ''
            + '\n\n================= STACK TRACE =================\n'
            + err.stack
            + '\n\n================= ERR MESSAGE =================\n'
            + err.message;
    }
    
    errorLogMsg += ''
        + '\n\n================= HEADERS =================\n'
        + currHeaders
        + '\n\n================= REQ BODY =================\n'
        + currReqBody
        + '\n\n================= REQ PARAMS =================\n'
        + currCookies
        + '\n\n================= COOKIES =================\n'
        + flashMsgsFromPrevCall
        + '\n\n================= FLASH MESSAGES FROM PREV CALL =================\n'
        + currParams
        + `\n////////////////////////////////////////////////`;

    return errorLogMsg;
}

function getTimestamp() {
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    return `${date.getFullYear()}-${month}-${day} ${hour}:${min}:${sec}`;
}

function redirectTo501(req, res) {
    if (req.method === "GET" || req.method === "POST") {
        res.redirect(FIVE_O_ONE__EP);
    } else {
        // node.js redirect doesnt change the method from DELETE and from PUT to GET. thatswhy if the initial request was put or delete and it gets redirected, then the redirect request will be the same DELTE or PUT and so express wont find the route where it has been redirected. Here I would redirect to /error/501 but due to that is a GET route, it wont be found and the request would loop into /error/401 again and again. So I decided to use DELETE OR PUT requests just in ajax and just send the error redirects ep where on the frontend will be redirected to the sent ep.
        res.send(FIVE_O_ONE__EP);
    }
}

function logErr(errText) {
    fs.appendFile(ERR_LOG_FILE__PATH, errText, (err) => {
        if (err) console.log(err);
    });
}