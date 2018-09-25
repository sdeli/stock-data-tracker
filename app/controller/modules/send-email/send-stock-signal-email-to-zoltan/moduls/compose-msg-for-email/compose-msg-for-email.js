function composeMsgForEmail(stockTicker, currStockSignalsObj, stockSignalsFromLast5Days) {
    let msg = `Signals for: ${stockTicker}\ncurrent signals:`;

    msg += getAllIndicatorsSuccessMsgs(currStockSignalsObj);
    msg += getAllIndicatorSuccessMsgsFromPastSignals(stockSignalsFromLast5Days);

    return msg;
}

function getAllIndicatorsSuccessMsgs(stockSignalsObj) {
    let successMsg = '';
    let dateOfSignal;

    for (indicatorName in stockSignalsObj) {
        if (stockSignalsObj[indicatorName]['successMsg']) {
            successMsg += `\n${indicatorName}: ${stockSignalsObj[indicatorName]['successMsg']}\n-----------------------\n`;
        } else if (indicatorName === 'dateOfSignal') {
            dateOfSignal = stockSignalsObj[indicatorName];
        }
    }

    return `\n------------------------------\non ${dateOfSignal} we got these signals:\n${successMsg}`;
}

function getAllIndicatorSuccessMsgsFromPastSignals(stockSignalsFromLast5Days) {
    let msg = '\n==========================\nSignals In last 5 days:\n\n';

    for (let i = 0; i < stockSignalsFromLast5Days.length; i++) {
        let stockSignalFromLast5Days = stockSignalsFromLast5Days[i];    

        msg += getAllIndicatorsSuccessMsgs(stockSignalFromLast5Days);
    }

    return msg;
}

module.exports = composeMsgForEmail;