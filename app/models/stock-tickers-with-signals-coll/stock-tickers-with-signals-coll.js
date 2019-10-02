const savePositiveSignalsIntoDb = require("./modules/save-positive-signals-into-db/save-positive-signals-into-db");

function updateStockSignalDocInDb(db, stockTicker, filtersResults) {
    let findQuery = {stockTicker};

    filtersResults.dateOfSignal = new Date();
    let updateQuery = { $push: { signals: filtersResults } }; 

    let opts = { raw: true };


    return new Promise((resolve, reject) => {
        db.collection('stockTtickersWithSignals')
        .updateOne(findQuery, updateQuery, opts)
        .then((updates) => {
            if (updates.result.nModified > 0) {
                return findStockSignalDocInDb(db, stockTicker)
            } else {
                resolve('there has been no such doc in db');
            }
        })
        .then(updatedDoc => {
            resolve(updatedDoc);
        })
        .catch(e => {
            reject(e);
        })
    });
}

function findStockSignalDocInDb(db, stockTicker, opts) {
    opts = opts || {};
    let findQuery = {stockTicker};

    return new Promise((resolve, reject) => {
        db.collection('stockTtickersWithSignals')
        .findOne(findQuery, opts)
        .then((foundDoc) => {
            if (foundDoc) {
                resolve(foundDoc);
            } else {
                reject('no doc has been found in the db with this query');
            }
        }).catch(e => {
            reject(e);
        })
    });   
}

function insertStockSignalObjectIntoDb(db, stockSignalObject) {
    return new Promise((resolve, reject) => {
        db.collection('stockTtickersWithSignals')
        .insertOne(stockSignalObject)
        .then(results => {
            if (results.insertedCount > 0) {
                resolve(results.ops[0])
            } else {
                reject('no docs have been inserted')
            }
        })
    })
}

module.exports = {
    updateStockSignalDocInDb,
    insertStockSignalObjectIntoDb,
    findStockSignalDocInDb,
    savePositiveSignalsIntoDb
};