const {checkIfDataisUpToDate, getFormatedDate} = require('../utils/utils.js');
const getJsonDataFromApi = require('../utils/get-json-data-from-api/get-json-data-from-api.js');

function getRsiData(stockTicker, interval, options) {
    let rsiReqUrl = getRsiReqUrl(stockTicker, interval, options)

    return getJsonDataFromApi(rsiReqUrl, extractRsiFromServerRes);
}

function getRsiReqUrl(stockTicker, interval, options) {
    let rsiReqUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${stockTicker}&interval=${interval}&time_period=10&time_period=${options.timePeriod}&series_type=${options.seriesType}&apikey=demo`;
    
    return rsiReqUrl;         
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


