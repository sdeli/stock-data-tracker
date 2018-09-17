// get3DescendingMaxPointsInData grabs the first and second value from the stock array values.
// we are looking for downvard/bear trends so we are looking for a pattern where the highest val is the oldest,
// the sensond highest is the second oldest. Thatswhy we suply at first the
// whole timeline of data into getMaxPointFromStockdataArr for the highest and we get back the highest value
// whith its datapoint/index. then for the second point the stockDataArr/timeline will be a reduced to start one index after the found highest point, so that we get the descending pattern. 
function get3DescendingMaxPointsInData(stockDataArr, dataPointSign) {
    let twoDescMaxPointsArr = [];

    let highestPoint = getMaxPointFromStockdataArr(stockDataArr, dataPointSign);
    twoDescMaxPointsArr.push(highestPoint);

    let untilTheLastDataPoint = twoDescMaxPointsArr[0].dataPoint - 15;

    if (untilTheLastDataPoint > 0) {
        let stockDataForNextMaxPoint = stockDataArr.slice(0, untilTheLastDataPoint);

        let nextDescHighestPoint = getMaxPointFromStockdataArr(stockDataForNextMaxPoint, dataPointSign);
        twoDescMaxPointsArr.push(nextDescHighestPoint);

        return twoDescMaxPointsArr;    
    } else {
        return 'after first high not enough days';
    }
}

function getMaxPointFromStockdataArr(stockDataArr, dataPointSign) {
    let maxPointObj = stockDataArr.reduce((maxPointObj, stockValue, i) => {
        let currStockValue = parseFloat(stockValue[dataPointSign]);
        if (true) {
            if (maxPointObj.stockValue <= currStockValue) {
                return {
                    stockValue : currStockValue,
                    dataPoint : i
                }
            } else {
                return maxPointObj;
            }
        }
    }, {stockValue : 0});

    return maxPointObj;
}

module.exports = get3DescendingMaxPointsInData