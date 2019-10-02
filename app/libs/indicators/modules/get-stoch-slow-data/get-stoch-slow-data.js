const getJsonDataFromApi = require('../../../utils/modules/get-json-data-from-api/get-json-data-from-api.js');

function getStochSlowData(stockTicker, interval) {
    let stochSlowReqUrl = `https://www.alphavantage.co/query?function=STOCH&symbol=${stockTicker}&fastkperiod=14&slowkperiod=1&slowdperiod=3&slowkmatype=0&interval=${interval}&apikey=demo`;

    return getJsonDataFromApi(stochSlowReqUrl, extractStochSlowDataFromServerRes);
}

function extractStochSlowDataFromServerRes(responseBodyObj, resolve, reject) {
    if (responseBodyObj["Technical Analysis: STOCH"]) {
        let stochSlowDataObj = responseBodyObj["Technical Analysis: STOCH"];
        resolve(stochSlowDataObj);
    } else {
        reject(false);    
    }
}

module.exports = getStochSlowData;
