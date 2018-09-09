const fs = require('fs');
const spawn = require('child_process').spawn;

const MongoClient = require('mongodb').MongoClient;

const stocksArr = JSON.parse(fs.readFileSync('./assets/zolis-stock-tickers-for-usa.json', 'UTF-8'));

const dbName = 'stock-data';
const dbUrl = `mongodb://localhost:27017/${dbName}`;

let i = 2;

function runFilterOnAllStockTickers() {
    if (i < stocksArr.length) {
        console.log('------------------');
        console.log('i: ' + i);
        
        i++;
        spawnNewProcessForFilter(stocksArr[i]);
    } else {
        console.log('all stocks have been checked');
    }
}

function spawnNewProcessForFilter(stockObj) {
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
      runFilterOnAllStockTickers()
    });

    child.stdout.on('data', data => {
      console.log(data.toString());
    });

    child.stderr.on('data', data => {
        console.log(data.toString());
    });
}

runFilterOnAllStockTickers(0);