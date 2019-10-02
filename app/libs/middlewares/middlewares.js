const config = require('config');

const GET_LOG_IN_VIEW__EP = config.restEndpoints.admin.auth.logInView.replace(/(.*\/)(:\w+\?)/, '$1'),
    GET_ADMIN_INDEX_VIEW__EP = config.restEndpoints.admin.index,
    GET_CHANGE_TMP_PWD_VIEW__EP = config.restEndpoints.admin.auth.changeTmpPwdView,
    REQUIRE_LOG_IN__MSG = config.flashMsgs.auth.requireLogin;

module.exports = {
    requireBeAuthenticated,
    redirectIfLoggedIn,
    logUrl
};

function requireBeAuthenticated(epMount) {
    // epMount is the route to which the middleware is mounted to
    return (req, res, next) => {
        console.log(req.url);
        let isLoggedIn = req.isAuthenticated() && !req.user.isTmp;
        if (isLoggedIn) return next();

        let isTemporarilyLoggedIn = req.isAuthenticated() && req.user.isTmp;
        if (isTemporarilyLoggedIn) return res.redirect(GET_CHANGE_TMP_PWD_VIEW__EP);

        res.flash.toNext(res.flash.WARNING, REQUIRE_LOG_IN__MSG);
        req.session.requestedUrl = `${epMount}${req.url}`;
        res.redirect(GET_LOG_IN_VIEW__EP);
    }
}

function redirectIfLoggedIn(req, res, next) {
    let isLoggedIn = req.isAuthenticated();
    console.log(req.url);
    if (!isLoggedIn) return next();

    let isTmpLoggedIn = isLoggedIn && req.user.isTmp;
    if (isTmpLoggedIn) return res.redirect(GET_CHANGE_TMP_PWD_VIEW__EP);

    res.redirect(GET_ADMIN_INDEX_VIEW__EP);
}

function logUrl(req, res, next) {
    console.log(req.url);
    next();
}