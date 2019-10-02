const request = require('request');

function getAPiKeyIpPortObj() {
    return new Promise((resolve, reject) => {
        request.get('http://localhost:8080/apiAndIpJson', (err, res, body) => {
            if (err) {
                reject({err});
            } else {
                resolve(body)
            }
        })   
    })
}

module.exports = getAPiKeyIpPortObj;
