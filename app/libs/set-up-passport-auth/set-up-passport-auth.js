/* DESCRIPTION:
    For this module to work you need to have rewrited the node_modules/passport/lib/middleware/authenticate.js file, and the node_modules/passport-local/lib/strategy.js file
*/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const handleLocalLogin = require('./modules/handle-local-login/handle-local-login.js');

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