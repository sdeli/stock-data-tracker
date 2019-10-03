const URL = require("url");
const querystring = require('querystring');
const MongoClient = require('mongodb').MongoClient;

module.exports = {
    getUrlObjFromUrl,
    getMongDbConn
};

function getMongDbConn(dbUrl) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
            if (err) return reject(err);
            resolve(client);
        });
    });
}

function getUrlObjFromUrl() {
    const urlObj = URL.parse('https://index.hu/majom?segg=fej&ide=oda');
    urlObj.queryObj = querystring.parse(urlObj.query);
    return urlObj;
}