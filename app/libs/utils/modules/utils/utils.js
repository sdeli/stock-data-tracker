module.exports = {
    getMongDbConn,
    checkIfJson
};

function getMongDbConn(dbUrl) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
            if (err) return reject(err);
            resolve(client);
        });
    });
}

function checkIfJson(data) {
    try {
        JSON.stringify(data);
        return true;
    } catch(e) {
        return false;
    }
}