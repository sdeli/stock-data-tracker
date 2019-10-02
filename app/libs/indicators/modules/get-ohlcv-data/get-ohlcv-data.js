let getJsonDataFromApi = require('../../../utils/modules/get-json-data-from-api/get-json-data-from-api.js');

function getOhlcvData(stockTicker, interval) {
    let apiReqUrl = `https://www.alphavantage.co/query?function=${interval}&symbol=${stockTicker}&outputsize=compact&apikey=demo`;

    return new Promise((resolve, reject) => {
        getJsonDataFromApi(apiReqUrl)
        .then(ohlcvDataObj => {
            resolveRejectOhlcvData(ohlcvDataObj, resolve, reject)
        })
        .catch(e => {
            reject(e);
        });
    });
}

function resolveRejectOhlcvData(responseBodyObj, resolve, reject) {
    if (responseBodyObj['Time Series (Daily)']) {
        let ohlcvDataObj = responseBodyObj['Time Series (Daily)'];
        resolve(ohlcvDataObj);
    } else {
        reject(false);    
    }
}

module.exports = getOhlcvData;