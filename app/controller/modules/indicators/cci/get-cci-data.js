//prior ULTOSC < 50 && curr ULTOSC > 50

const getJsonDataFromApi = require('../utils/get-json-data-from-api/get-json-data-from-api.js');

function getCciData(stockTicker, interval, options) {
    let cciReqUrl = getCciReqUrl(stockTicker, interval, options)

    return getJsonDataFromApi(cciReqUrl, extractCciDataFromServerRes);
}

function getCciReqUrl(stockTicker, interval, options) {
    let cciReqUrl = `https://www.alphavantage.co/query?function=CCI&symbol=${stockTicker}&interval=${interval}&time_period=${options.timePeriod}&apikey=demo`;

    return cciReqUrl;         
}

function extractCciDataFromServerRes(responseBodyObj, resolve) {
    if (responseBodyObj["Technical Analysis: CCI"]) {
        let cciDataObj = responseBodyObj["Technical Analysis: CCI"];
        resolve(cciDataObj);
    } else {
        reject(false);
    }
}

module.exports = getCciData;


