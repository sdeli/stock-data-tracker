const { getJsonDataFromApi } = require('utils');

function getRsiData(stockTicker, interval, options) {
    let rsiReqUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${stockTicker}&interval=${interval}&time_period=${options.timePeriod}&series_type=${options.seriesType}&apikey=demo`;

    return getJsonDataFromApi(rsiReqUrl, extractRsiFromServerRes);
}

function extractRsiFromServerRes(responseBodyObj, resolve, reject) {
    if (responseBodyObj["Technical Analysis: RSI"]) {
        let rsiDataObj = responseBodyObj["Technical Analysis: RSI"];
        resolve(rsiDataObj);
    } else {
        reject(false);
    }
}

module.exports = getRsiData;


