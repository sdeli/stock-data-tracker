const nodemailer = require('nodemailer');

function bearTrendlineConditions(pastAndCurrTlsObj, stockTicker, stockDataObject, stockName) {
    let {pastBearTrendlinesArr} = pastAndCurrTlsObj;
    let currBearTrendlinesArr = pastAndCurrTlsObj.currTrendlinesArr;
    let allBearTrendlines = [...pastBearTrendlinesArr, ...currBearTrendlinesArr];
    let haveTrendlinesToCheck = allBearTrendlines.length > 0;

    if (haveTrendlinesToCheck) {
        let stockDataArr = getStockDataArrFromObj(stockDataObject);
        let succesfulTls = getTlsWhichBrokenOrNearlyBroken(allBearTrendlines, stockDataArr, stockName);

        if (succesfulTls.length > 0) {
            process.stdout.write('sendingmail')
            sendEmailsForEachSuccesfulTls(succesfulTls, stockName, stockTicker);
        } else {
            process.stdout.write('no succesful trendlines');
        }
    }
}

function getStockDataArrFromObj(stockDataObject) {
    let stockDataArr = [];

    for (dateObj in stockDataObject) {
        for(stockSign in stockDataObject[dateObj]) {
            let currStockValue = stockDataObject[dateObj][stockSign]
            stockDataArr.push(parseFloat(currStockValue));            
        }
    }

    return stockDataArr;
}

function getTlsWhichBrokenOrNearlyBroken(allBearTrendlines, stockDataArr, stockName) {
    let stockValueToday = stockDataArr[0];
    let stockValueYesterday = stockDataArr[1];

    let succesfulTls = [];

    allBearTrendlines.forEach((trendlineObj) => {
        let secondHighIsNotToday = trendlineObj.twoDescMaxPointsArr[1].dataPoint > 0;

        if (secondHighIsNotToday) {
            let {tlValueToday, tlValueYesterday} = getTlsValueTodayAndYesterday(trendlineObj);

            console.log('isTlNearlyBroken');
            let isTlNearlyBroken = tlValueToday <= stockValueToday && tlValueToday >= (stockValueToday * 0.99)

            if (isTlNearlyBroken) {
                trendlineObj.successMSg = `The trendlineCondition for ${stockName}: 'tlValueToday <= stockValueToday && tlValueToday >= (stockValueToday * 0.99)' happend to be true, check the details:\ntlValueToday: ${tlValueToday}\nstockValueToday: ${stockValueToday}\nall details of the trendline: ${JSON.stringify(trendlineObj, null, 2)}`
                succesfulTls.push(trendlineObj)
                return;
            }

            let isTlBroken = tlValueYesterday > stockValueYesterday && tlValueToday < stockValueToday;
            console.log(isTlBroken);
            if (isTlBroken) {
                trendlineObj.successMSg = `The trendlineCondition for ${stockName}: 'tlValueYesterday > stockValueYesterday && tlValueToday < stockValueToday' happend to be true, check the details:\ntlValueYesterday: ${tlValueYesterday}\nstockValueYesterday: ${stockValueYesterday}\ntlValueToday: ${tlValueToday}\nstockValueToday: ${stockValueToday}\nall details of the trendline: ${JSON.stringify(trendlineObj, null, 2)}`
                succesfulTls.push(trendlineObj)
                return;
            }
        } 
    });

    return succesfulTls;
}

function getTlsValueTodayAndYesterday(trendlineObj) {
    tlsLastMaxPointsValue = trendlineObj.twoDescMaxPointsArr[1].stockValue;
    // tlsLastMaxPointsdataPoint = days until today from tlsLastMaxPoint
    daysUntilToday = trendlineObj.twoDescMaxPointsArr[1].dataPoint;
    tlsSlope = trendlineObj.slope;

    let tlValueToday = tlsLastMaxPointsValue - (daysUntilToday * tlsSlope);
    let tlValueYesterday = tlsLastMaxPointsValue - ((daysUntilToday - 1) * tlsSlope);

    return {tlValueToday, tlValueYesterday};
}

function sendEmailsForEachSuccesfulTls(trendlinesArr, stockName, stockTicker) {
    let subject = `succesful TRENDLINES for ${stockName} - ${stockTicker}`;
    let msg = createMSg(trendlinesArr);
process.stdout.write('sending email')
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sandor.deli.javascript@gmail.com',
        pass: 'Bgfkszm1234'
      }
    });

    let mailOptions = {
      from: 'sandor.deli.javascript@gmail.com',
      to: 'casagrandehungary@gmail.com ',
      subject,
      text: msg
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

function createMSg(trendlinesArr) {
    let msg = 'Trendlines:\n';
        msg += '\n';

    trendlinesArr.forEach(trendlineObj => {
        msg += JSON.stringify(trendlineObj, null, 2)
        msg +='\n';
        msg +='\n-------------------------------------\n';
        msg +='\n-------------------------------------\n';
        msg +='\n';
    });

    return msg;
}

module.exports = bearTrendlineConditions;