module.exports = (() => {
    let req, res, config;

    class Flash {
        constructor ($req, $res, $config) {
            req = $req;
            res = $res;
            config = $config;
        }
        
        get SUCCESS() {
            return config.success;
        }

        get INFO() {
            return config.info;
        }

        get WARNING() {
            return config.warning;
        }

        toNext(type, flasMsg) {
            let moduleIsNotUsedAsMiddleware = typeof req.session.flashMsgs === 'undefined';
            if (moduleIsNotUsedAsMiddleware) return 'not used as middleware';
        
            req.session.flashMsgs.push({
                'msg' : flasMsg,
                'type' : type
            });
        }
        
        toCurr(type, flasMsg) {
            let moduleIsNotUsedAsMiddleware = typeof res.locals.flashMsgs === 'undefined';
            if (moduleIsNotUsedAsMiddleware) return false;
        
            res.locals.flashMsgs.push({
                'msg' : flasMsg,
                'type' : type
            });
        }
    }

    return Flash
})();