module.exports = {
    checkIfJson
};

function checkIfJson(data) {
    try {
        JSON.stringify(data);
        return true;
    } catch(e) {
        return false;
    }
}