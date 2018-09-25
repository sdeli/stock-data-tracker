const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const get2DescendingMaxPointsInData = require('./modules/get-2-descending-max-points-in-data/get-2-descending-mac-points-in-data.js');
const createTrendlineDataObject = require('./modules/create-trendline-data-object/create-trendline-data-object.js');
const checkIfPointsTouchAStraightLine = require('./modules/check-if-points-touch-a-straight-line/check-if-points-touch-a-straight-line.js');
const {checkForPastBearTrendlinesOfStock} = require('../../../../model/past-trendlines-coll/past-trendlines-coll.js');
const saveCurrTlsIntoColl = require('../../../../model/past-trendlines-coll/save-curr-tls-into-coll/save-curr-tls-into-coll.js');
const bearTrendlineConditions = require('./modules/bear-trendline-conditions/bear-trendline-conditions.js');
// let rsiDataJson = fs.readFileSync('../../../assets/ver-rsi-data.json', 'utf-8');
// let rsiDataObj = JSON.parse(rsiDataJson);

const dbName = 'stock-data';
const dbUrl = `mongodb://localhost:27017/${dbName}`;


// MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
//         if (err) throw err;
//         var db = client.db();

//     runGetBearTrendlines(db, 'VER', 'fasztudjaname', 'RSI', rsiDataObj)
// });

function runGetBearTrendlines(db, stockTicker, stockName, dataPointSign, stockDataObj) {
    return new Promise((resolve, reject) => {
        getBearTrendlines(db, stockTicker, dataPointSign, stockDataObj)
        .then(tls => {
            if (tls.currTrendlinesArr.length > 0) {
                let {currTrendlinesArr} = tls;
                saveCurrTlsIntoColl(db, stockTicker, {
                    stockTicker,
                    pastBearTrendlinesArr : currTrendlinesArr
                }).then(() => {
                    bearTrendlineConditions(tls, stockTicker, stockDataObj, stockName);
                    resolve()
                })
                .catch(e => {
                    process.stderr.write(JSON.stringify(e, null, 2))
                    reject(e)
                })
            } else if (tls.pastBearTrendlinesArr.length <= 0 && tls.currTrendlinesArr.length <= 0){
                process.stdout.write('no trendlines from past and current.... weird')
                resolve()
            } else if (tls.pastBearTrendlinesArr.length > 0 || tls.currTrendlinesArr.length > 0) {
                bearTrendlineConditions(tls, stockTicker, stockDataObj, stockName);
                resolve()
            } else {
                process.stdout.write('sytuation didnt think on');
                bearTrendlineConditions(tls, stockTicker, stockDataObj, stockName);
                resolve()
            }
        })
        .catch(e => {
            process.stderr.write(JSON.stringify(e, null, 2))
        })
    })
    .catch(e => {
        process.stderr.write(JSON.stringify(e, null, 2))
        reject(e);
    })
}

// dataPointSign = 'RSI'
function getBearTrendlines(db, stockTicker, dataPointSign, stockDataObj) {
    const stockDataArr = Object.values(stockDataObj);
    const datesArr = Object.keys(stockDataObj);
    process.stdout.write('trendlines are running');

    return new Promise((resolve, reject) => {
        checkForPastBearTrendlinesOfStock(db, stockTicker)
        .then(pastBearTrendlinesArr => {
            process.stdout.write('trendline stuff runs')
            let stockDataInLast60DataPoints = stockDataArr.slice(0, 150);

            if (pastBearTrendlinesArr !== "no trendlines have been found with this query") {
                var currTrendlinesArr = loopForBearTrendlinesInData(stockDataInLast60DataPoints, datesArr, dataPointSign, pastBearTrendlinesArr); 
            } else {
                var currTrendlinesArr = loopForBearTrendlinesInData(stockDataInLast60DataPoints, datesArr, dataPointSign);
                pastBearTrendlinesArr = []
            }

            let bearTrendlines = {
                pastBearTrendlinesArr,
                currTrendlinesArr
            }

            resolve(bearTrendlines)
        })
        .catch(e => {
            process.stdout.write(JSON.stringify(e, null, 2 ));
            reject(e)
        })
    })
}

// looping for bear trendlines means to check the data from last date to current for 2 highest points, which are descdeningly following each other. We need to search loopingly threw the timeline, but at each iteration reduced the timelines last datapoint (=>stockDataArrForNextTl) to the next datapoint after the prev trendlines second last high. Because the two points of the tl there will be no other highs, which are higher than the original timelines max points. So we can get out all trendlines from the data.  
function loopForBearTrendlinesInData(stockDataArr, datesArr, dataPointSign, pastTrendlines) {
    process.stdout.write('\n' + stockDataArr.length + '\n');
    let currTrendlinesArr = [];

    loop(stockDataArr, datesArr, dataPointSign, pastTrendlines);

    function loop(stockDataArr, datesArr, dataPointSign, pastTrendlines) {
        // trendlineDataObjs structure is at the bottom of the script
        let trendlineDataObj = getBearTrendLine(stockDataArr, datesArr, dataPointSign, pastTrendlines);

        let isUniquetrendline = trendlineDataObj !== 'in this timespan we have a same tl as before';
        let wasEnoughDaysLeft = trendlineDataObj !== 'after first high not enough days';
        wasEnoughDaysLeft &= trendlineDataObj !== 'not enough days';
        let isTrendline = Boolean(trendlineDataObj.slope);

        if (isUniquetrendline && isTrendline && wasEnoughDaysLeft) {
            currTrendlinesArr.push(trendlineDataObj)
            let stockDataArrForNextTl = getStockDataArrForNextTl(currTrendlinesArr, stockDataArr);
            loop(stockDataArrForNextTl, datesArr, dataPointSign, pastTrendlines)
        } else if (!isUniquetrendline) {
            let stockDataArrForNextTl = getStockDataArrForNextTl(pastTrendlines, stockDataArr);
            loop(stockDataArrForNextTl, datesArr, dataPointSign, pastTrendlines)
        } else if(!wasEnoughDaysLeft) {
            return currTrendlinesArr;
        } else {
            return currTrendlinesArr;
        }
    }

    return currTrendlinesArr;
}

function getBearTrendLine(stockData, datesArr, dataPointSign, pastTrendlines) {
    if (stockData.length <= 15) return 'not enough days';
    // twoDescMaxPointsArr means the 2 descending maximum values and their datapoints which are constituting the downvard strightline/bear trendline, we are looking for
    let twoDescMaxPointsArr = get2DescendingMaxPointsInData(stockData, dataPointSign);
    
    let haveProper2DescMaxPoints = twoDescMaxPointsArr !== 'after first high not enough days';
    haveProper2DescMaxPoints &= twoDescMaxPointsArr !== 'second max point is not a proper peak';

    if (haveProper2DescMaxPoints && pastTrendlines) {
        haveTheseTrendlinePointsAlready = checkIfWeHaveAlreadyTheseMaxPoints(pastTrendlines, twoDescMaxPointsArr);

        if (!haveTheseTrendlinePointsAlready) {
            let trendlineDataObj = createTrendlineDataObject(twoDescMaxPointsArr, datesArr);
            return trendlineDataObj;
        } else {
            return 'in this timespan we have a same tl as before';
        }
    } else if (haveProper2DescMaxPoints && !pastTrendlines) {
        let trendlineDataObj = createTrendlineDataObject(twoDescMaxPointsArr, datesArr)
        return trendlineDataObj;
    } else {
        return 'after first high not enough days';
    }
}

function checkIfWeHaveAlreadyTheseMaxPoints(trendlinesArr, twoDescMaxPointsArr) {
    isTrendlineArrNotEmpty = trendlinesArr.length > 0;

    if (isTrendlineArrNotEmpty) {
        let doWeHaveTheseMaxPointsAlready = findIdenticalMaxPoints(trendlinesArr, twoDescMaxPointsArr)
        return doWeHaveTheseMaxPointsAlready;
    } else {
        return false;
    }

}

function findIdenticalMaxPoints(trendlinesArr, twoDescMaxPointsArr) {
    let doWeHaveTheseMaxPointsAlready = trendlinesArr.find(trendlineDatasObj => {
        let prevTwoMaxPointsArr = trendlineDatasObj.twoDescMaxPointsArr;

        let isBiggestValIdentical = prevTwoMaxPointsArr[0].stockValue === twoDescMaxPointsArr[0].stockValue;
        let isSecondBiggestValIdentical = prevTwoMaxPointsArr[1].stockValue === twoDescMaxPointsArr[1].stockValue;

        return isBiggestValIdentical && isSecondBiggestValIdentical;
    })

    return doWeHaveTheseMaxPointsAlready;
}

function getStockDataArrForNextTl(currTrendlinesArr, stockDataArr) {
    if (currTrendlinesArr.length > 0) {
        let lastTrendline = currTrendlinesArr[currTrendlinesArr.length - 1];
        let indexAfterSecondHighestMaxPointOfPrevTl = lastTrendline.twoDescMaxPointsArr[1].dataPoint + 1;

        let stockDataArrForNextTl = stockDataArr.slice(0, indexAfterSecondHighestMaxPointOfPrevTl);

        return stockDataArrForNextTl;
    } else {
        return stockDataArr;
    }
}

module.exports = runGetBearTrendlines;

/*
    trendline obj schema
    array item in the pastBearTrendlinesArr for each ticker in past-trendlines coll
    {
        slope : num,
        twoDescMaxPointsArr : [
            {
                {
                    stockValue,
                    date,
                    dataPoint : i
                },
                {
                    stockValue,
                    date,
                    dataPoint : i
                },
                {
                    stockValue,
                    date,
                    dataPoint : i
                }
            }
        ]    
    }

    pastBearTrendlinesArr = JSON.parse("[{\"slope\":0.5821928571428572,\"twoDescMaxPointsArr\":[{\"stockValue\":65.3891,\"dataPoint\":21,\"date\":\"2018-08-09\"},{\"stockValue\":57.2384,\"dataPoint\":7,\"date\":\"2018-08-29\"}]}]")

    pastBearTrendlinesArr = JSON.parse("[{\"slope\":0.2473296296296294,\"twoDescMaxPointsArr\":[{\"stockValue\":75.3594,\"dataPoint\":33,\"date\":\"2018-07-25\"},{\"stockValue\":68.6815,\"dataPoint\":6,\"date\":\"2018-08-31\"}]}]")
*/