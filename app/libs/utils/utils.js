const getJsonDataFromApi = require("./modules/get-json-data-from-api/get-json-data-from-api");
const checkIfJson = require("utils");

function sendErrMsgToParentProc(err) {
    if (typeof err === 'object') {
        process.stderr.write(JSON.stringify(err, null, 2))
    } else {
        process.stderr.write(err)
    }
}

module.exports = {
    checkIfJson,
    getJsonDataFromApi,
    sendErrMsgToParentProc
};