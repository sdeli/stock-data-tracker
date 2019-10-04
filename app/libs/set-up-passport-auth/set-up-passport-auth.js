/* DESCRIPTION:
    For this module to work you need to have rewrited the node_modules/passport/lib/middleware/authenticate.js file, and the node_modules/passport-local/lib/strategy.js file
*/
const config = require('config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let handleLocalLogin = require('./modules/handle-local-login/handle-local-login.js');

const USER_EMAIL = config.dukatZoltan.email,
    USER_PWD_HASH = config.dukatZoltan.pwdHash;

handleLocalLogin = handleLocalLogin({
    USER_EMAIL,
    USER_PWD_HASH
});

module.exports = setUpPassportAuth;
    
function setUpPassportAuth(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            rememberLogin: 'rememberLogin',
            isTmpPwdLogin: 'isTmpPwdLogin'
    }, handleLocalLogin));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}