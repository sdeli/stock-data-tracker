const config = require('config');

const LOGIN_VIEW__PATH = config.viewPathes.logIn.replace("/", ''),
    LOGIN_VIEW__TITLE = config.templateConf.logIn.title,
    LOGIN_VIEW__ID = config.templateConf.logIn.id,
    LOGIN__EP = config.eps.auth.oAuth.local.login;

module.exports = getLoginView;
    
function getLoginView(req, res) {
    let loginData;

    let isRequestFromPrevValidationErr = Boolean(Object.keys(req.body).length);
    if (isRequestFromPrevValidationErr) {
        loginData = req.body;
    } else {
        loginData = {};
    }

    renderLoginView(res, loginData)
}

function renderLoginView(res, loginData) {
    res.locals.pageTitle = LOGIN_VIEW__TITLE;
    res.locals.pageId = LOGIN_VIEW__ID;
    res.locals.postUserDataTo = LOGIN__EP;
    res.locals.method = 'POST';
    res.locals.loginData = loginData;

    res.render(LOGIN_VIEW__PATH);
}