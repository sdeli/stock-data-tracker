const fs = require('fs');

function checkIfJson(data) {
    try {
        JSON.stringify(data);
        return true;
    } catch(e) {
        return false;
    }
}

module.exports = {
    checkIfJson,
}