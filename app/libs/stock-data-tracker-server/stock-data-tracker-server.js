const config = require('config');
const http = require('http');
const spawn = require('child_process').spawn;
const { getUrlObjFromUrl } = require("stock-data-tracker-server-utils");

const RUN_STOCK_TRACKING = config.stockDataTracker.eps.runStockTracking;
const USER_HAS_RUNNING_PROCESS__ERR_MSG = config.stockDataTracker.msgs.userHasRunnigStockTracking;
const REGION_IS_NOT_VALID__ERR_MSG = config.stockDataTracker.msgs.regionIsNotValid;
const STOCKS_OBJ = config.stockDataTracker.sotckTickers;
const NODE_EXECUTABLE = config.nodeExecutable;
const LISTEN = config.stockDataTracker.listen;

let hasRunningStockTarcking = false;

module.exports = stockDataTrackerServer();

function stockDataTrackerServer() {
    http.createServer((req, res) => {
        let loggedIn = Boolean(req.session.user);
        const {pathname, queryObj} = getUrlObjFromUrl(req.url);

        if (pathname === RUN_STOCK_TRACKING && loggedIn && !hasRunningStockTarcking) {
            let hasValidRegion = Boolean(STOCKS_OBJ[queryObj.region]);
            if (hasValidRegion) {
                res.writeHead(204, { 'Content-Type': 'text/plain' });
                res.end();
                runFilterOnAllStockTickers(0, queryObj.region);
            } else {
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end(REGION_IS_NOT_VALID__ERR_MSG);
            }

            return;
        }

        if (pathname === !RUN_STOCK_TRACKING && loggedIn  && hasRunningStockTarcking) {
            res.writeHead(409, { 'Content-Type': 'text/plain' });
            res.end(USER_HAS_RUNNING_PROCESS__ERR_MSG);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("not found");
        }
    }).listen(LISTEN);
}

async function runFilterOnAllStockTickers(stockIterator, region) {
    const stocksArr = STOCKS_OBJ[region];

    if (stockIterator < stocksArr.length) {
        console.log('------------------');
        console.log(`${stockIterator} - ${stocksArr[stockIterator].stockTicker}  `);

        await spawnNewProcessForFilter(stocksArr[stockIterator]);
        stockIterator++;
        runFilterOnAllStockTickers(stockIterator, region);
    } else {
        console.log('all stocks have been checked');
    }
}


function spawnNewProcessForFilter(stockObj) {
    return new Promise((resolve) => {
        let {stockTicker, stockName} = stockObj;

        let parameters = [
            //'--inspect-brk',
            './modules/processes/buy-sign-one-long-filter-proc.js',
            `stockTicker=${stockTicker}`,
            `stockName=${stockName}`
        ];

        let child = spawn(NODE_EXECUTABLE, parameters);

        child.on('exit', () => {
          console.log('process closed');
          resolve();
        });

        child.stdout.on('data', data => {
          console.log(`${stockIterator} msg: ${data.toString()}`);
        });

        child.stderr.on('data', data => {
            console.log(`${stockIterator} err: ${data.toString()}`);
        });
    });
}