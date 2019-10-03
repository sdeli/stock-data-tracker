const userModel = require('models/user-model');
const bcrypt = require('bcryptjs');

module.exports = handleLocalLogin;

function handleLocalLogin(email, currPwd, rememberLoginBox = false, isTmpPwdLogin = false, done) {
    let currUserObj = {
        email,
        password : currPwd,
        rememberLoginBox
    };

    isTmpPwdLogin = Boolean(isTmpPwdLogin);
    if (isTmpPwdLogin) {
        tmpLoginUser(currUserObj, done)
    } else {
        loginUser(currUserObj, done)
    }
}

function tmpLoginUser(currUserObj, done) {
    userModel.getUserWithTmpPwdByEmail(currUserObj.email)
    .then(userInDbObj => {
        if (!userInDbObj) return done(null, false, currUserObj);

        let isTmpPwdExpired = new Date() > userInDbObj.tmpPasswordExpiry;
        if (isTmpPwdExpired) return done(null, false, currUserObj);

        if(checkIfPwdCorrect(currUserObj.password, userInDbObj.tmpPasswordHash)) {
            delete userInDbObj.tmpPasswordHash;
            delete userInDbObj.tmpPasswordExpiry;
            userInDbObj.isTmp = true;
            done(null, userInDbObj);
        } else {
            currUserObj.isTmp = true;
            done(null, false, currUserObj);
        }
    })
    .catch(err => done(err))
}

function loginUser(currUserObj, done) {
    userModel.getUserByEmail(currUserObj.email)
    .then(userInDbObj => {
        if (!userInDbObj) return done(null, false, currUserObj);

        let isUserInactive = !Boolean(userInDbObj.passwordHash);
        if (isUserInactive) return done(null, false, currUserObj);

        let isPasswordCorrect = bcrypt.compareSync(currUserObj.password, userInDbObj.passwordHash);
        if (isPasswordCorrect) {
            userInDbObj.rememberLoginBox = currUserObj.rememberLoginBox;
            done(null, userInDbObj);
        } else {
            done(null, false, currUserObj);
        }
    })
    .catch(err => done(err))
}