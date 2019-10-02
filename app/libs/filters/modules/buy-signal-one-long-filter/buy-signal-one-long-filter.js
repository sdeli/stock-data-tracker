const {sendErrMsgToParentProc} = require('utils');

const {
    ma50: getPrevAndMa50,
    cci: getCciData,
    macd: getMacdData,
    ohlcv: getOhlcv,
    rsi: getRsiData,
    stochSlow: getStochSlowData,
    // ultosc: getUltoscData,
} = require("indicators");

const {
    checkIfClOver10DollarsInMa20,
    checkIfStocksVolumeIsEnough,
    macdConditionOne,
    macdConditionTwo,
    ccisCondition,
    rsisCondition,
    rsisSecondCondition,
    stochSlowCondition,
    ma50sCondition,
    isCurrClOverCurrMa50
} = require('conditions');

const { savePositiveSignalsIntoDb } = require('stock-tickers-with-signals-coll');

const { extractCurrAndPrevClFromOhlcvData } = require('./modules/helpers/helpers.js');

function buySignOneLongFilter(db, stockTicker, stockName) {
    return new Promise((resolve, reject) => {
        getOhlcv(stockTicker, 'TIME_SERIES_DAILY')
        .then(ohlcvDataObj => {
            let didStockPassPrefilter = preFilterStockData(ohlcvDataObj);

            if (didStockPassPrefilter === true) {
               return startfurtherFilters(db, stockTicker, stockName, ohlcvDataObj);
            } else {
                reject(didStockPassPrefilter);
            }
        })
        .then(filtersResults => {
            return savePositiveSignalsIntoDb(db, stockTicker, filtersResults);
        })
        .then(savedStockSignalObj => {
            resolve(savedStockSignalObj);
        })
        .catch(e => {
            reject(e);
        })
    })
}

function preFilterStockData(ohlcvDataObj) {
    let isStocksVolumeEnough = checkIfStocksVolumeIsEnough(ohlcvDataObj);
    if (!isStocksVolumeEnough) return 'Stock volume is under 1.000.000';

    let isClosingPriceEnough = checkIfClOver10DollarsInMa20(ohlcvDataObj);
    if (!isClosingPriceEnough) return 'Cls ma20 is under 10';

    return true;
}

function startfurtherFilters(db, stockTicker, stockName, ohlcvDataObj) {
    process.stdout.write('start further filters');
    return new Promise((resolve, reject) => {
        let interval = 'daily';

        let cciOptions = {
            timePeriod : 20,
        };

        let macdLongOpts = {
            fast : 13,
            slow : 21,
            signalper : 8,
            seriesType : "close"
        };

        let macdShortOpts = {
            fast : 5,
            slow : 8,
            signalper : 3,
            seriesType : "close"
        };

        let rsiOptions = {
            timePeriod : 14,
            seriesType : 'close'
        };


        let ma50Options = {
            timePeriod : 50,
            seriesType : 'close'
        };

        Promise.all([
            getCciData(stockTicker, interval, cciOptions).catch(e => sendErrMsgToParentProc(e)),
            getMacdData(stockTicker, interval, macdLongOpts).catch(e => sendErrMsgToParentProc(e)),
            getMacdData(stockTicker, interval, macdShortOpts).catch(e => sendErrMsgToParentProce(e)),
            // getUltoscData(stockTicker, interval).catch(e => sendErrMsgToParentProc(e)),
            getRsiData(stockTicker, interval, rsiOptions).catch(e => sendErrMsgToParentProc(e)),
            getStochSlowData(stockTicker, interval).catch(e => sendErrMsgToParentProc(e)),
            getPrevAndMa50(stockTicker, interval, ma50Options).catch(e => sendErrMsgToParentProc(e)),
        ])
        .then(async (results) => {
            let cciDataObj = results[0],
            macdLongDataObj = results[1],
            macdShortDataObj = results[2],
            // ultoscDataObj = results[3],
            rsiDataObj = results[3],
            stochSlowDataObj = results[4],
            ma50DataObj = results[5],
            currMa50 = parseFloat(Object.values(ma50DataObj)[0]['SMA']),
            currAndPrevCl = extractCurrAndPrevClFromOhlcvData(ohlcvDataObj);

            process.stdout.write(`results for: ${stockTicker}:`);
            process.stdout.write(JSON.stringify(currAndPrevCl, null, 2));
            process.stdout.write('---------\n');

            let conditionsResults = {
                supporters : {
                    isCurrClOverCurrMa50 : isCurrClOverCurrMa50(currAndPrevCl.curr, currMa50),
                },
                cci : ccisCondition(cciDataObj),
                macdLongOne : macdConditionOne(macdLongDataObj, 'macd long'),
                macdLongTwo : macdConditionTwo(macdLongDataObj, 'macd long'),
                macdShortOne : macdConditionOne(macdShortDataObj, 'macd short'),
                macdShortTwo : macdConditionTwo(macdShortDataObj, 'macd short'),
                // utlosc : ultoscLongsCondition(ultoscDataObj),
                rsiA : rsisCondition(rsiDataObj),
                rsiB : rsisSecondCondition(rsiDataObj),
                stochSlow : stochSlowCondition(stochSlowDataObj),
                ma50 : ma50sCondition(ma50DataObj, currAndPrevCl),
            };

            process.stdout.write(`conditionsResults for: ${stockTicker}:`);
            process.stdout.write(JSON.stringify(conditionsResults, null, 2));
            process.stdout.write('---------\n');
            resolve(conditionsResults);
        })
        .catch(e => {
            reject(e);
        })
    })
}
        

module.exports = buySignOneLongFilter;
