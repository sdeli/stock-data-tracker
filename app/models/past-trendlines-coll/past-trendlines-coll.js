function checkForPastBearTrendlinesOfStock(db, stockTicker) {
    let opts = {projection : {pastBearTrendlinesArr: 1, _id : 0}};

    return new Promise((resolve, reject) => {
        findPastTrendlinesDocInDb(db, stockTicker, opts)
        .then(pastBearTrendlinesObj => {
            if (pastBearTrendlinesObj !== 'no trendlines have been found with this query') {
                let {pastBearTrendlinesArr} = pastBearTrendlinesObj;
                resolve(pastBearTrendlinesArr);
            } else {
                resolve('no trendlines have been found with this query');
            }
        })
        .catch(e => {
            reject(e);
        })
    })
}

function updateTrendlineDocInDb(db, stockTicker, trendlinesObj) {
    let findQuery = {stockTicker};

    let foundTrendLines = trendlinesObj.pastBearTrendlinesArr;
    let updateQuery = { $push: { pastBearTrendlinesArr: {$each : [...foundTrendLines]} } }; 

    let opts = { raw: true };

    return new Promise((resolve, reject) => {
        db.collection('past-trendlines')
        .updateOne(findQuery, updateQuery, opts)
        .then((updates) => {
            if (updates.result.nModified > 0) {
                return findPastTrendlinesDocInDb(db, stockTicker)
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

function findPastTrendlinesDocInDb(db, stockTicker, opts) {
    let findQuery = {stockTicker};
    opts = opts || {};

    return new Promise((resolve, reject) => {
        db.collection('past-trendlines')
        .findOne(findQuery, opts)
        .then((foundDoc) => {
            if (foundDoc) {
                resolve(foundDoc);
            } else {
                resolve('no trendlines have been found with this query');
            }
        }).catch(e => {
            reject(e);
        })
    });   
}

function insertTrendlineObjIntoColl(db, trendlineDataObj) {
    return new Promise((resolve, reject) => {
        db.collection('past-trendlines')
        .insertOne(trendlineDataObj)
        .then(results => {
            if (results.insertedCount > 0) {
                resolve(results.ops[0])
            } else {
                reject('no docs have been inserted')
            }
        })
    })
}

function insertTrendlineObjsIntoColl(db, trendlineDataObj) {
    return new Promise((resolve, reject) => {
        db.collection('past-trendlines')
        .insertMany(trendlineDataObj)
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
    findPastTrendlinesDocInDb,
    insertTrendlineObjIntoColl,
    insertTrendlineObjsIntoColl,
    checkForPastBearTrendlinesOfStock,
    updateTrendlineDocInDb
};