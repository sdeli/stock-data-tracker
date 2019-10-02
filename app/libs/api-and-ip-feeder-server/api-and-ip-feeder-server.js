const http = require('http');

const apiKeyIpPortFeeder = require('./api-and-ip-feeder-obj/api-and-ip-feeder-obj.js');

module.exports = apiAndIpFeederServer;

function apiAndIpFeederServer() {
    http.createServer(function (req, res) {
        const requestedStuff = req.url.replace(/^\/+|\/+$/g, '');

        if (requestedStuff === 'apiAndIpJson') {
            respondWithApiKeyIpAndPort(res);
        } else {
            respondWithInvalidCall(res);
        }
    }).listen(8080);
}

function respondWithApiKeyIpAndPort(res) {
    apiKeyIpPortFeeder.getApiKeyIpPortObj()
    .then(apiKeyIpPortObj => {
        let apiKeyIpPortJson = JSON.stringify(apiKeyIpPortObj);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(apiKeyIpPortJson);
        res.end();
    })
}

function respondWithInvalidCall(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('invalid call');
    res.end();
}