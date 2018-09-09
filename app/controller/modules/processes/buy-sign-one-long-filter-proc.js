const MongoClient = require('mongodb').MongoClient;

const argvExtractor = require('./moduls/argv-extractor/argv-extractor.js');

const buySignOneLongFilter = require('../filters/buy-signal-one-long-filter/buy-signal-one-long-filter.js');
const checkIfStockSignalProperToSend = require('../filters/buy-signal-one-long-filter/moduls/check-if-stock-signal-proper-to-send/check-if-stock-signal-proper-to-send.js');
const savePositiveSignalsIntoDb = require('../../../model/stock-tickers-with-signals-coll/save-positive-signals-into-db/save-positive-signals-into-db.js');
const sendFilteredStockSignalEmailToZoltan = require('../send-email/send-stock-signal-email-to-zoltan/send-stock-signal-email-to-zoltan.js');

const dbName = 'stock-data';
const dbUrl = `mongodb://localhost:27017/${dbName}`;

const processArgs = argvExtractor(process.argv);
const stockTicker = processArgs.stockTicker;
const stockName = processArgs.stockName;

MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;

    var db = client.db('stockTtickersWithSignals')

    runBuySignOneLongFilter(client, stockTicker, stockName)
    .then(() => {
        client.close();
    })
    .catch(() => {
        client.close();
    })
});

function runBuySignOneLongFilter(db, stockTicker, stockName) {
    return new Promise((resolve, reject) => {
        buySignOneLongFilter(stockTicker)
        .then(filtersResults => {
            return savePositiveSignalsIntoDb(db, stockTicker, filtersResults);
        })
        .then(savedStockSignalObj => {
            let isStockSignalProperToSendObj = checkIfStockSignalProperToSend(savedStockSignalObj);

            if (isStockSignalProperToSendObj.isTrue) {
                let {currStockSignalsObj, stockSignalsFromLast5Days} = isStockSignalProperToSendObj;

                sendFilteredStockSignalEmailToZoltan(savedStockSignalObj, currStockSignalsObj, stockSignalsFromLast5Days, stockName)
                process.stdout.write(`success email sent for ${stockTicker}`);
                process.stdout.write('--------------------------');
                resolve()
            } else {
                process.stderr.write(isStockSignalProperToSendObj)
                resolve()
            }
        })
        .catch(e => {
            if (e.message) {
                process.stderr.write(e.message);
                reject()
            } else if (e.errmsg) {
                process.stderr.write(e.errmsg);
                reject()
            } else if (e.errLink) {
                let msg = `wrong link: ${e.errLink}\n-------------------------`
                process.stderr.write(msg);
                reject()
            } else {
                process.stderr.write(JSON.stringify(e, null, 2));
                reject()
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