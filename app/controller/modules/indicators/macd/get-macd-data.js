const getJsonDataFromApi = require('../utils/get-json-data-from-api/get-json-data-from-api.js');

function getMacdData(stockTicker, interval, periodOpts) {
        let macdReqUrl = getMacdReqUrl(stockTicker, interval, periodOpts);

        return getJsonDataFromApi(macdReqUrl, extractMacdDataFromServerRes);
}

function getMacdReqUrl(stockTicker, interval, periodOpts) {
    let macdReqUrl = `https://www.alphavantage.co/query?function=MACD&symbol=${stockTicker}&interval=${interval}&series_type=open&fastperiod=${periodOpts.fast}&slowperiod=${periodOpts.slow}&signalperiod=${periodOpts.signalper}&series_type=${periodOpts.seriesType}&apikey=demo`;

    return macdReqUrl;         
}

function extractMacdDataFromServerRes(responseBodyObj, resolve, reject) {
    if (responseBodyObj["Technical Analysis: MACD"]) {
        let macdDataObj = responseBodyObj["Technical Analysis: MACD"];
        resolve(macdDataObj);
    } else {
        reject(false);
    }
}

module.exports = getMacdData;
