const config = require('config');
const express = require('express');
const passport = require('passport');
const authRouter = express.Router();

const getLoginView = require("./get-log-in-view/get-log-in-view");

const { requireBeAuthenticated, redirectIfLoggedIn} = require('middlewares');

const FAILED_LOGIN__ERR_FLASH = config.flashMsgs.auth.localLogin.err,
    MONTH__MIL_SECS = 3600000 * 24 * 30,
    GET_LOGIN_VIEW_EP = config.eps.auth.logInView;

authRouter.get(config.eps.auth.logInView, getLoginView);

authRouter.post(config.eps.auth.oAuth.local.login, redirectIfLoggedIn, passport.authenticate('local' , {
        successRedirect: config.eps.auth.oAuth.succRed,
        failureRedirect: config.eps.auth.oAuth.failureRed,
        failureUser: true
    })
);


authRouter.get(config.eps.auth.oAuth.failureRed, redirectIfLoggedIn, (req, res) => {
    res.flash.toNext(res.flash.WARNING, FAILED_LOGIN__ERR_FLASH);
    req.session.body = req.session.failedUser;
    delete req.session.failedUser;
    res.redirect(GET_LOGIN_VIEW_EP)
});

authRouter.get(config.eps.auth.oAuth.succRed, requireBeAuthenticated, (req, res) => {
    let shouldRememberLogin = Boolean(req.user.rememberLoginBox);
    if (shouldRememberLogin) {
        req.session.cookie.expires = new Date(Date.now() + MONTH__MIL_SECS)
    }

    let wasRedirectedToLogin = Boolean(req.session.requestedUrl);
    if (wasRedirectedToLogin) {
        let requestedUrl = req.session.requestedUrl;
        delete req.session.requestedUrl;
        res.redirect(requestedUrl);
    } else {
        res.redirect(config.eps.index);
    }
});

authRouter.get(config.eps.auth.logOut, requireBeAuthenticated, (req, res, next) => {
    req.logout();

    req.session.regenerate((err) => {
        if (err) return next(err);
        res.redirect(GET_LOGIN_VIEW__EP);
    });
});

module.exports = authRouter;
