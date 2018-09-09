const https = require('https');

const request = require('request');

const getApiKeyIpPortObj = require('./modules/get-apikey-ip-port-obj/get-apikey-ip-port-obj.js');
const {checkIfJson} = require('../utils.js');

function getJsonDataFromApi(url, opts, callBack) {
    callBack = (typeof opts === "function") ? opts : callBack;
    opts = opts || {};
    
    return new Promise((resolve, reject) => {
        getApiKeyIpPortObj()
        .then(apiKeyAndIpObj => {
            let {apiKey, ip, port} = JSON.parse(apiKeyAndIpObj);
            // process.stdout.write(apiKey);
            // process.stdout.write(ip);
            // process.stdout.write(port);
            return sendRequest(url, apiKey, ip, port, callBack);
        })
        .then(indicatiorDatasObj => {
            resolve(indicatiorDatasObj);
        })
        .catch(e => {
            reject(e);
        })
    })
}

function sendRequest(url, apiKey, ip, port, callBack) {
    url = url.replace('demo', apiKey);

    var reqWithProxie = request.defaults({'proxy':`http://${ip}:${port}`})

    return new Promise((resolve, reject) => {
        reqWithProxie.get(url, function (error, response, body) {
            if (error) {
                reject({
                    error,
                    errLink : (response) ? response.request.href : 'no repsonse object'
                });

                return;
            } else if (body) {
                var isApiCallLimitReached = body.indexOf('if you would like to have a higher API call volume') > -1;
                var islinkFaulty = body.indexOf('Error Message') > -1;
                var isNotJson = checkIfJson(body);
            } else {
                reject('there has been no body or err object');
                return;
            }
            
            if (islinkFaulty) {
                reject({
                    err : body,
                    errLink : (response) ? response.request.href : 'no repsonse object'
                })
            } else if (isApiCallLimitReached) {
                reject({
                    err : body,
                    errLink : (response) ? response.request.href : 'no repsonse object'
                })
            } else if (!isNotJson) {
                reject({
                    err : body,
                    errLink : (response) ? response.request.href : 'no repsonse object'
                })
            } else {
                let indicatorDatasObj = JSON.parse(body)

                if (callBack) {
                    callBack(indicatorDatasObj, resolve, reject);
                } else {
                    resolve(indicatorDatasObj);    
                }
            }
        })
    });
}

module.exports = getJsonDataFromApi;