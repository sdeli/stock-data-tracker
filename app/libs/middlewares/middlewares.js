const config = require('config');

const GET_LOG_IN_VIEW__EP = config.eps.auth.logInView,
    GET_INDEX_VIEW__EP = config.eps.index,
    REQUIRE_LOG_IN__MSG = config.flashMsgs.auth.requireLogin;

module.exports = {
    requireBeAuthenticated,
    redirectIfLoggedIn,
    logUrl
};

function requireBeAuthenticated(req, res, next) {
    console.log(req.url);
    let isLoggedIn = req.isAuthenticated() && !req.user.isTmp;
    if (isLoggedIn) return next();

    res.flash.toNext(res.flash.WARNING, REQUIRE_LOG_IN__MSG);
    req.session.requestedUrl = req.url;
    res.redirect(GET_LOG_IN_VIEW__EP);
}

function redirectIfLoggedIn(req, res, next) {
    let isLoggedIn = req.isAuthenticated();
    console.log(req.url);
    if (!isLoggedIn) return next();

    res.redirect(GET_INDEX_VIEW__EP);
}

function logUrl(req, res, next) {
    console.log(req.url);
    next();
}