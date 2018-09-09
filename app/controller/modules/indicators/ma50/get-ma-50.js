const {checkIfDataisUpToDate, getFormatedDate} = require('../utils/utils.js');
const getJsonDataFromApi = require('../utils/get-json-data-from-api/get-json-data-from-api.js');

function getMa50Data(stockTicker, interval, otpions) {
    let ma50ReqUrl = getMa50ReqUrl(stockTicker, interval, otpions)

    return getJsonDataFromApi(ma50ReqUrl, extractMa50DataFromServerRes);
}

function getMa50ReqUrl(stockTicker, interval, otpions) {
    let ma50ReqUrl = `https://www.alphavantage.co/query?function=SMA&symbol=${stockTicker}&interval=${interval}&time_period=${otpions.timePeriod}&series_type=${otpions.seriesType}&apikey=demo`;

    return ma50ReqUrl;         
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


