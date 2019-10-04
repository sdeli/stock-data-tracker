const bcrypt = require('bcryptjs');

module.exports = (config) => {
    const {
        USER_EMAIL,
        USER_PWD_HASH
    } = config;

    return handleLocalLogin;

    function handleLocalLogin(email, currPwd, rememberLoginBox = false, isTmpPwdLogin = false, done) {
        let currUserObj = {
            email,
            password : currPwd
        };

        loginUser(currUserObj, done);
    }

    function loginUser(currUserObj, done) {
        let isEmailCorrect = currUserObj.email === USER_EMAIL;
        if (!isEmailCorrect) return done(null, false, currUserObj);

        let isPasswordCorrect = bcrypt.compareSync(currUserObj.password, USER_PWD_HASH);
        if (!isPasswordCorrect) return done(null, false, currUserObj);

        done(null, currUserObj);
    }
};

