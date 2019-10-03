const argvExtractor = require('./modules/argv-extractor/argv-extractor.js');
const { sendErrMsgToParentProc } = require('utils');

const { buySignOneLongFilter } = require('filters');
const checkIfStockSignalProperToSend = require('./modules/check-if-stock-signal-proper-to-send/check-if-stock-signal-proper-to-send.js');
const { sendFilteredStockSignalEmailToZoltan } = require('send-email');

const dbUrl = `${process.env.DB_URL}/${process.env.DB_NAME}`;

const processArgs = argvExtractor(process.argv);
const stockTicker = processArgs.stockTicker;
const stockName = processArgs.stockName;

(async () => {
    const client = await getMongDbConn(dbUrl);
    const db = client.db('stock-data');

    runBuySignOneLongFilter(db, stockTicker, stockName)
    .then(() => {
        client.close();
    })
    .catch(() => {
        client.close();
    });
})();

function runBuySignOneLongFilter(db, stockTicker, stockName) {
    return new Promise((resolve, reject) => {
        buySignOneLongFilter(db, stockTicker, stockName)
        .then(savedStockSignalObj => {
            let isStockSignalProperToSendObj = checkIfStockSignalProperToSend(savedStockSignalObj);

            if (isStockSignalProperToSendObj.isTrue) {
                let {currStockSignalsObj, stockSignalsFromLast5Days} = isStockSignalProperToSendObj;

                sendFilteredStockSignalEmailToZoltan(savedStockSignalObj, currStockSignalsObj, stockSignalsFromLast5Days, stockName);
                process.stdout.write(`success email sent for ${stockTicker}`);
                process.stdout.write('--------------------------');
                resolve();
            } else {
                sendErrMsgToParentProc(isStockSignalProperToSendObj);
                resolve();
            }
        })
        .catch(e => {
            if (e.message) {
                sendErrMsgToParentProc(e.message);
                reject();
            } else if (e.errmsg) {
                sendErrMsgToParentProc(e.errmsg);
                reject();
            } else if (e.errLink) {
                let msg = `wrong link: ${e.errLink}\n-------------------------`;
                sendErrMsgToParentProc(msg);
                reject();
            } else {
                sendErrMsgToParentProc(e);
                reject();
            }

            process.stderr.write('--------------------------');
        })
    })
}



/*
function logMsgIntoLoggingFile(msg, logFile, shouldPrepareMsg) {
    let preparedMsg = '';

    if (shouldPrepareMsg) {
        preparedMsg = `\n${new Date()}:\n${msg}\n`
    } else {
        preparedMsg = msg;
    }

    logFile = logFile || './logging/logging.txt';

    fs.appendFile(logFile, preparedMsg, 'utf8', (err) => {
        if (err) process.stdout.write(err);
        process.stdout.write('msg loged');
    });
}*/