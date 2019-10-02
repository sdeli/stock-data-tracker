const {updateStockSignalDocInDb, insertStockSignalObjectIntoDb} = require('../../stock-tickers-with-signals-coll.js');

function savePositiveSignalsIntoDb(db, stockTicker, filtersResults) {
    return new Promise((resolve, reject) => {
        removeNegtiveSignalsFromResultsObj(filtersResults);
        
        let hasSignals = Object.keys(filtersResults).length > 1 ;
        if (!hasSignals) {
            reject({errmsg : `for ${stockTicker} no positive signals`});
            return;
        }

        updateStockSignalDocInDb(db, stockTicker, filtersResults)
        .then(updatedStockSignalDoc => {
            if (updatedStockSignalDoc !== 'there has been no such doc in db') {
                process.stdout.write('signal updated to existing doc in db - doc above');
                resolve(updatedStockSignalDoc);
            } else {
                let stockSignalObject = createStockSignalObject(stockTicker, filtersResults);
                return insertStockSignalObjectIntoDb(db, stockSignalObject);
            }
        })
        .then(insertedStockSignalObj => {
            let wasUpdateSuccesfulInPrevPromise = typeof insertedStockSignalObj === 'undefined';
            if (!wasUpdateSuccesfulInPrevPromise) {
                process.stdout.write('signal has been inserted new doc has been created - doc above');
                resolve(insertedStockSignalObj);
            }
        })
        .catch(e => {
            reject(e);
        })
    })
}
  
function removeNegtiveSignalsFromResultsObj(filtersResults) {
    for (let indicator in filtersResults) {
        if (filtersResults.hasOwnProperty(indicator)) {
            if (filtersResults[indicator] === false) {
                delete filtersResults[indicator];
            }
        }
    }
}

function createStockSignalObject(stockTicker, filtersResults) {
    filtersResults.dateOfSignal = new Date();

    return  {
        stockTicker,
        signals : [
            filtersResults
        ]
    };
}

module.exports = savePositiveSignalsIntoDb;