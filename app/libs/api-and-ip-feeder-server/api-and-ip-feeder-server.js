const http = require('http');
const config = require('config');
const apiKeyIpPortFeeder = require('./api-and-ip-feeder-obj/api-and-ip-feeder-obj.js');

const LISTEN_PORT = config.apiAndIpFeeder.listen;

apiAndIpFeederServer();

function apiAndIpFeederServer() {
    http.createServer(function (req, res) {
        const requestedStuff = req.url.replace(/^\/+|\/+$/g, '');

        if (requestedStuff === 'apiAndIpJson') {
            respondWithApiKeyIpAndPort(res);
        } else {
            respondWithInvalidCall(res);
        }
    }).listen(LISTEN_PORT);
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