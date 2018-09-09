const {checkIfDataisUpToDate, getFormatedDate} = require('../utils/utils.js');
const getJsonDataFromApi = require('../utils/get-json-data-from-api/get-json-data-from-api.js');

function getUltoscData(stockTicker, interval) {
    let ultoscReqUrl = getUltoscReqUrl(stockTicker, interval);

    return getJsonDataFromApi(ultoscReqUrl, extractUltoscFromServerRes);
}

function getUltoscReqUrl(stockTicker, interval) {
    let ultoscReqUrl = `https://www.alphavantage.co/query?function=ULTOSC&symbol=${stockTicker}&timeperiod1=7&timeperiod2=14&timeperiod3=28&interval=${interval}&apikey=demo`;

    return ultoscReqUrl;         
}

function extractUltoscFromServerRes(responseBodyObj, resolve, reject) {
    if (responseBodyObj["Technical Analysis: ULTOSC"]) {
        let ultoscDataObj = responseBodyObj["Technical Analysis: ULTOSC"];
        resolve(ultoscDataObj);
    } else {
        reject(false);
    }
}

module.exports = getUltoscData;


