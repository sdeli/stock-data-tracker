const {findStockSignalDocInDb} = require('../../../../../../model/stock-tickers-with-signals-coll/stock-tickers-with-signals-coll.js');

function extractCurrAndPrevClFromOhlcvData(ohlcvDataObj) {
    let ohlcvDataArr = Object.values(ohlcvDataObj);
    let ohlcvDataPointsArr = Object.keys(ohlcvDataObj);

    let currAndPrevCl = {
        curr : parseFloat(ohlcvDataArr[0]['4. close']),
        prev : parseFloat(ohlcvDataArr[1]['4. close'])
    }
    
    return currAndPrevCl;
}

function getPastSignalsIn5DaysForCurrStock(db, stockTicker) {
    let opts = {
        projection : {
            signals : 1,
            _id : 0

        }
    }

    return findStockSignalDocInDb(db, stockTicker, opts);
}

module.exports = {
    extractCurrAndPrevClFromOhlcvData,
    getPastSignalsIn5DaysForCurrStock
};