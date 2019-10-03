function checkIfStockSignalProperToSend(savedStockSignalObj) {
    let currStockSignalsObj = savedStockSignalObj.signals[savedStockSignalObj.signals.length - 1];

    let isCurrClOverCurrMa50 = Boolean(currStockSignalsObj.supporters.isCurrClOverCurrMa50);
    if (!isCurrClOverCurrMa50) return `closeing price is not over ma 50`;

    let stockSignalsFromLast5Days = getStockSignalsFromLast5days(currStockSignalsObj, savedStockSignalObj);
    let hadTheStockSignalsInLast5Days = Boolean(stockSignalsFromLast5Days);

    if (hadTheStockSignalsInLast5Days) {
        return {
            isTrue : true,
            currStockSignalsObj,
            stockSignalsFromLast5Days
        }
    } else {
        return `closeing price is over ma 50 but there has been not other signal in the last 5 days`
    }

}

function getStockSignalsFromLast5days(currStockSignalsObj, savedStockSignalObj) {
    let currStockSignalsDate = new Date(currStockSignalsObj.dateOfSignal).getTime();
    let fiveDaysBeforeCurrStocksignal = currStockSignalsDate - (1000 * 60 * 60 * 24 * 5);

    let pastStockSignalsObjsArr = savedStockSignalObj.signals.slice(0, savedStockSignalObj.signals.length - 1);
    let stockSignalsIn5days = [];

    for (let i = pastStockSignalsObjsArr.length - 1; i >= 0; i--) {
        let pastStockSignalObj = pastStockSignalsObjsArr[i];    
        let pastStockSignalsdate = new Date(pastStockSignalObj.dateOfSignal).getTime();

        let isPastStockSignalStillIn5Days = pastStockSignalsdate > fiveDaysBeforeCurrStocksignal;

        if (isPastStockSignalStillIn5Days) {
            stockSignalsIn5days.push(pastStockSignalObj);
        }
    }

    let wereThereSignalsInLast5days = stockSignalsIn5days.length > 0;

    if (wereThereSignalsInLast5days) {
        return stockSignalsIn5days;
    } else {
        return false;
    }
}

module.exports = checkIfStockSignalProperToSend;