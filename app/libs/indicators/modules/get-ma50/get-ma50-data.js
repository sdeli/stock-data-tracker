const { getJsonDataFromApi } = require('utils');

function getMa50Data(stockTicker, interval, otpions) {
    let ma50ReqUrl = `https://www.alphavantage.co/query?function=SMA&symbol=${stockTicker}&interval=${interval}&time_period=${otpions.timePeriod}&series_type=${otpions.seriesType}&apikey=demo`;

    return getJsonDataFromApi(ma50ReqUrl, extractMa50DataFromServerRes);
}

function extractMa50DataFromServerRes(responseBodyObj, resolve, reject) {
    if (responseBodyObj["Technical Analysis: SMA"]) {
        let ma50DataObj = responseBodyObj["Technical Analysis: SMA"];
        resolve(ma50DataObj);
    } else {
        reject(false);
    }
}

module.exports = getMa50Data;


