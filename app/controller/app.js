const fs = require('fs');
const spawn = require('child_process').spawn;

const MongoClient = require('mongodb').MongoClient;

const stocksArr = JSON.parse(fs.readFileSync('./assets/zolis-stock-tickers-for-usa.json', 'UTF-8'));

const dbName = 'stock-data';
const dbUrl = `mongodb://localhost:27017/${dbName}`;

let stockIterator = 0;

function startApp() {
    startApyKeyIpPortfeederServer();
    runFilterOnAllStockTickers(stockIterator);
}

function startApyKeyIpPortfeederServer() {
    let program = 'node';
    let parameters = [
        './modules/api-and-ip-feeder/api-and-ip-feeder-server.js',
    ];

    let child = spawn(program, parameters);

    child.on('exit', () => {
      console.log('server closed');
    });

    child.stdout.on('data', data => {
      console.log(`message from server: ${data.toString()}`);
    });

    child.stderr.on('data', data => {
        console.log(`message from server: ${data.toString()}`);
    });
}

function runFilterOnAllStockTickers(stockIterator) {
    if (stockIterator < stocksArr.length) {
        console.log('------------------');
        console.log(`${stockIterator} - ${stocksArr[stockIterator].stockTicker}  `);
        
        spawnNewProcessForFilter(stocksArr[stockIterator], stockIterator);
    } else {
        console.log('all stocks have been checked');
    }
}


function spawnNewProcessForFilter(stockObj, stockIterator) {
    let {stockTicker, stockName} = stockObj;

    let program = 'node';
    let parameters = [
        // '--inspect-brk',
        './modules/processes/buy-sign-one-long-filter-proc.js',
        `stockTicker=${stockTicker}`,
        `stockName=${stockName}`
    ];

    let child = spawn(program, parameters);

    child.on('exit', () => {
      console.log('process closed');
      stockIterator++
      runFilterOnAllStockTickers(stockIterator)
    });

    child.stdout.on('data', data => {
      console.log(`${stockIterator} msg: ${data.toString()}`);
    });

    child.stderr.on('data', data => {
        console.log(`${stockIterator} err: ${data.toString()}`);
    });
}

startApp();