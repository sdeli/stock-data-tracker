const {updateTrendlineDocInDb, insertTrendlineObjIntoColl} = require('../past-trendlines-coll.js');

function saveCurrTlsIntoColl(db, stockTicker, trendlinesObj) {
    return new Promise((resolve, reject) => {
        updateTrendlineDocInDb(db, stockTicker, trendlinesObj)
        .then(updateResult => {
            if (updateResult === 'there has been no such doc in db') {
                return insertTrendlineObjIntoColl(db, trendlinesObj)
            } else {
                resolve('updated succesfully')
            }
        })
        .then(insertedDoc => {
            if (insertedDoc === null || insertedDoc === 'no docs have been inserted') {
            } else {
                resolve('inserted succesfully')
            }
        })
        .catch(e => {
            reject(e)
        })
    })
}

module.exports = saveCurrTlsIntoColl;