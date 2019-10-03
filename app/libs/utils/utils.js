const config = require("config");
const getJsonDataFromApi = require("./modules/get-json-data-from-api/get-json-data-from-api");
const checkIfJson = require("utils");

const API_AND_IP_FEEDER_MAIN_FILE__PATH = config.apiAndIpFeeder.mainFilesPath;

function sendErrMsgToParentProc(err) {
    if (typeof err === 'object') {
        process.stderr.write(JSON.stringify(err, null, 2))
    } else {
        process.stderr.write(err)
    }
}

function startApyKeyIpPortfeederServer() {
    let program = 'node';
    let parameters = [
        API_AND_IP_FEEDER_MAIN_FILE__PATH,
    ];

    let child = spawn(program, parameters);

    child.on('exit', () => {
      console.log('server closed');
    });

    child.stdout.on('data', data => {
      console.log(`message from server: ${data.toString()}`);
    });

    child.stderr.on('data', data => {
        console.log(`message from server: ${data.toString()}`);
    });
}

module.exports = {
    checkIfJson,
    getJsonDataFromApi,
    sendErrMsgToParentProc,
    startApyKeyIpPortfeederServer
};