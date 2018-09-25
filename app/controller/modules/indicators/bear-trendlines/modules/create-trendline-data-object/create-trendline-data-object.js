function createTrendlineDataObject(twoDescMaxPointsArr, datesArr) {
    let slope = getSlope(twoDescMaxPointsArr[0], twoDescMaxPointsArr[1]);
    let lastDataPontInSet = datesArr[0];

    twoDescMaxPointsArr[0].date = datesArr[twoDescMaxPointsArr[0].dataPoint];
    twoDescMaxPointsArr[1].date = datesArr[twoDescMaxPointsArr[1].dataPoint];

    let trendlineDataObj = {
        slope,
        lastDataPontInSet,
        twoDescMaxPointsArr
    }

    return trendlineDataObj;
}

function getSlope(biggestPointObj, seccondBiggestPointObj) {
    let numOfdaysBetweenDataPoints = biggestPointObj.dataPoint - seccondBiggestPointObj.dataPoint;
    let valDiffBetweenDataPoints = biggestPointObj.stockValue - seccondBiggestPointObj.stockValue;

    let slope = valDiffBetweenDataPoints / numOfdaysBetweenDataPoints;

    return slope;
}

module.exports = createTrendlineDataObject;