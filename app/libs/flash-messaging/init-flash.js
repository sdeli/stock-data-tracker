const config = require('config');
const Flash = require('./moduls/flash-class/flash-class.js');

const SUCCESS = config.flashMsgs.types.success,
    INFO = config.flashMsgs.types.info,
    WARNING = config.flashMsgs.types.warning;

module.exports = initFlash;

function initFlash(req, res, next) {
    let hasFlashFunctionality = typeof req.session.flashMsgs !== 'undefined';
    
    let config = {
        success : SUCCESS,
        info : INFO,
        warning : WARNING
    };

    if (hasFlashFunctionality) {
        setUpFlashMsgsFromPrevReq(req, res, config);
        req.session.flashMsgs = [];
    } else {
        setUpFlashFunctionality(req, res, config);
    }
    
    next();
}

function setUpFlashMsgsFromPrevReq(req, res, config) {
    flashMsgsFromPrevReq = req.session.flashMsgs;
    flashMsgsFromPrevReqByValue = flashMsgsFromPrevReq.splice(0, flashMsgsFromPrevReq.length);
    res.locals.flashMsgs = flashMsgsFromPrevReqByValue;
    res.flash = new Flash(req, res, config);
}

function setUpFlashFunctionality(req, res, config) {
    req.session.flashMsgs = [];
    res.locals.flashMsgs = [];
    res.flash = new Flash(req, res, config);
}

module.exports = initFlash;