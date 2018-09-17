  function checkIfPointsTouchAStraightLine(threeMaxPointsObj) {
    let slope = getSlope(threeMaxPointsObj[0], threeMaxPointsObj[1]);

    isThirdPointOnSameLineObj = checkIfThirdDataPointIsOnsameLine(slope, threeMaxPointsObj[1], threeMaxPointsObj[2]);

    return isThirdPointOnSameLineObj;
}

function getSlope(biggestPointObj, seccondBiggestPointObj) {
    let numOfdaysBetweenDataPoints = biggestPointObj.dataPoint - seccondBiggestPointObj.dataPoint;
    let valDiffBetweenDataPoints = biggestPointObj.stockValue - seccondBiggestPointObj.stockValue;

    let slope = valDiffBetweenDataPoints / numOfdaysBetweenDataPoints;

    return slope;
}

function checkIfThirdDataPointIsOnsameLine(slope, seccondBiggestPointObj, thirdBiggestPointObj) {
    let numOfdaysBetweenDataPoints = seccondBiggestPointObj.dataPoint - thirdBiggestPointObj.dataPoint;
    let trendLineValueAtThirdDataPoint = seccondBiggestPointObj.stockValue - (numOfdaysBetweenDataPoints * slope);

    let thirdBiggestPointsVal = thirdBiggestPointObj.stockValue;
    let isThirdPointOnSameLineObj = {
        isTrue : undefined,
        trendLineValueAtThirdDataPoint,
        slope
    }

    if (trendLineValueAtThirdDataPoint === thirdBiggestPointsVal) {
        isThirdPointOnSameLineObj.isTrue = true;
        return isThirdPointOnSameLineObj;
    } else if ((trendLineValueAtThirdDataPoint <= thirdBiggestPointsVal * 1.04) && (trendLineValueAtThirdDataPoint > thirdBiggestPointsVal)) {
        isThirdPointOnSameLineObj.isTrue = true;
        return isThirdPointOnSameLineObj;
    } else if ((trendLineValueAtThirdDataPoint >= thirdBiggestPointsVal * 0.95) && (trendLineValueAtThirdDataPoint < thirdBiggestPointsVal)) {
        isThirdPointOnSameLineObj.isTrue = true;
        return isThirdPointOnSameLineObj;
    } else {
        isThirdPointOnSameLineObj.isTrue = false;
        return isThirdPointOnSameLineObj;
    }
}


module.exports = checkIfPointsTouchAStraightLine;