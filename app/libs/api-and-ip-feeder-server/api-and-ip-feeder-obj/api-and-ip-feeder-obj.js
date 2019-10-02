const apiKeysIpsPortsArrOfObj = require('./assets/apiKeysIpsPortsArrOfObj.js');

let apiKeyIpPortFeeder = {
    getApiKeyIpPortObj,
    apiKeysIpsPortsArrOfObj
};

function getApiKeyIpPortObj() {
    return new Promise((resolve) => {
        let apiKeyIpPortObj = getapiKeyIpPortObjUsedMoreThan12SecsBefore(this.apiKeysIpsPortsArrOfObj);
        isUsableApiKeyIpPort = Boolean(!apiKeyIpPortObj.errmsg);

        if (isUsableApiKeyIpPort) {
            // let msg = `${JSON.stringify(apiKeyIpPortObj)}\n${new Date()}\n---------------`
            // logMsgIntoLoggingFile(msg)
            // process.stdout.write(apiKeyIpPortObj);
            // process.stdout.write(new Date());
            // process.stdout.write('---------------');
            resolve(apiKeyIpPortObj);
        } else {
            setTimeout(() => {
                // let msg = `${JSON.stringify(apiKeyIpPortObj)}\n${new Date()}\n---------------`
                //logMsgIntoLoggingFile(msg)
                // process.stdout.write(apiKeyIpPortObj.earliestApiIpPortInUse);
                // process.stdout.write(new Date());
                // process.stdout.write('---------------');
                resolve(apiKeyIpPortObj.earliestApiIpPortInUse);
            }, apiKeyIpPortObj.releaseTimeInMs);
        }
    });
}

function getapiKeyIpPortObjUsedMoreThan12SecsBefore(apiKeysIpsPortsArrOfObj) {
    let earliestApiIpPortInUse = {};

    for (let i = 0; i < apiKeysIpsPortsArrOfObj.length; i++) {
        let hasNeverBeenUsed = apiKeyIpPortObj.lastTimeInUse === null;
        if (hasNeverBeenUsed) return createApiKeyIpPortObj(apiKeysIpsPortsArrOfObj[i]);

        isProperApiKeyIpPort = checkIfUsedMoreThan12SecsBefore(apiKeysIpsPortsArrOfObj[i]);
        if (isProperApiKeyIpPort) return createApiKeyIpPortObj(apiKeysIpsPortsArrOfObj[i]);

        earliestApiIpPortInUse = getTheEarlierApiIpPortObj(earliestApiIpPortInUse, apiKeysIpsPortsArrOfObj[i]);
    }

    let releaseTimeInMs = getApiKeyIpPortObjsReleaseTime(earliestApiIpPortInUse);
    
    return {
        errmsg : 'all ips and api keys have been used in 12 second, so we need to wait until the earliest used will be out of the 12 second time restriction',
        releaseTimeInMs,
        earliestApiIpPortInUse : createApiKeyIpPortObj(earliestApiIpPortInUse, releaseTimeInMs)
    }
}

function checkIfUsedMoreThan12SecsBefore(apiKeyIpPortObj) {
    let currTime = new Date();
    return (currTime.getTime() - apiKeyIpPortObj.lastTimeInUse.getTime()) > (19000);
}

function createApiKeyIpPortObj(apiKeyIpPortObj, releaseTimeFromNow) {
    let currTime = new Date();

    if (releaseTimeFromNow) {
        let timeWhenApiKeyAndIpWillBeReleased = new Date(currTime.getTime() + releaseTimeFromNow);
        apiKeyIpPortObj.lastTimeInUse = timeWhenApiKeyAndIpWillBeReleased;
    } else {
        apiKeyIpPortObj.lastTimeInUse = currTime;
    }

    return {
        ip : apiKeyIpPortObj.ip,
        port : apiKeyIpPortObj.port,
        apiKey : apiKeyIpPortObj.apiKey
    } 
}

function getTheEarlierApiIpPortObj(earliestApiIpPortInUse, currApiIpPort) {
    let isJustPlainObject = Boolean(!earliestApiIpPortInUse.lastTimeInUse);
    if (isJustPlainObject) return currApiIpPort;

    let lastTimeInUseOfearliest = earliestApiIpPortInUse.lastTimeInUse.getTime();
    let lastTimeInUseOfCurr = currApiIpPort.lastTimeInUse.getTime();

    let isearlierlierThanCurr = lastTimeInUseOfearliest < lastTimeInUseOfCurr;

    if (isearlierlierThanCurr) {
        return earliestApiIpPortInUse
    } else {
        return currApiIpPort;
    }
}

function getApiKeyIpPortObjsReleaseTime(earliestApiIpPortInUse) {
    let currTime = new Date();
    return 19000 - (currTime.getTime() - earliestApiIpPortInUse.lastTimeInUse.getTime());
}

// function logMsgIntoLoggingFile(msg) {
//     let preparedMsg = `\n${new Date()}:\n${msg}\n`
    
//     fs.appendFileSync('./logging/feeder-log.txt', preparedMsg)
// }
module.exports = apiKeyIpPortFeeder;