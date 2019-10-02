const $puppeteer = require('puppeteer');
const $stockTrackerPageUrl = 'https://www.investing.com/charts/stocks-charts';
const $signInBtnSel = '.topBarText a.login';
const {clickBtn} = require('../../utils/utils.js');

async function scrapingLogic () {
    const browser = await $puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1350, height: 800});
    await page.setExtraHTTPHeaders({Referer: 'https://www.google.com/search?source=hp&ei=2f9zW86WBsnSgAbC2p7oDA&q=https%3A%2F%2Fwww.investing.com%2F&oq=https%3A%2F%2Fwww.investing.com%2F&gs_l=psy-ab.12..0i10k1j0l9.928.928.0.2402.3.2.0.0.0.0.70.70.1.2.0....0...1c.1.64.psy-ab..1.2.158.6..35i39k1.88.FGJIwNlqrlk'});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36');
    await page.goto($stockTrackerPageUrl)
    page.waitForSelector($signInBtnSel, {timeout : 1000 * 60 * 10});

    await signIn(page);
    await getToFullScreenChart(page, browser);

    //process.stdout.write(JSON.stringify('signed in cool'));
}

async function signIn(page) {
    let signInEmailInputsSel = '#loginFormUser_email';
    let signInpasswInputsSel = '#loginForm_password';
    
    let credentialEmail = 'lozi@freemail.hu'; 
    let credentialPassw = 'vamtarifa';

    let secondSignInBtnsSel = 'a[onclick=\"loginFunctions.submitLogin();\"]'

    await clickBtn(page, $signInBtnSel);
    await page.waitForSelector(signInEmailInputsSel);
    await page.type(signInEmailInputsSel, credentialEmail);
    await page.type(signInpasswInputsSel, credentialPassw)
    await clickBtn(page, secondSignInBtnsSel);
}

async function getToFullScreenChart(page, browser) {
    let pageLoadedWhenThisSelLoaded = '#userImg';
    let pageLoadedWhenThisSelLoadedSecond = 'canvas';
    let loadChartLayoutBtn = '.load.button.first.apply-common-tooltip';
    let chartTofullScreenBtnsSel = 'span.button.fullscreen.iconed';
    const page2 = await browser.newPage();
    await page2.setViewport({width: 1350, height: 800});
    await page2.goto($stockTrackerPageUrl)
    await page2.waitForSelector(pageLoadedWhenThisSelLoaded, {timeout : 1000 * 60 * 10});
    console.log('majom');
    setTimeout(function() {
        console.log('indul');
        page2.mouse.click(760, 348);
    }, 5000)

    setTimeout(function() {
        console.log('indul');
        page2.mouse.click(860, 348);
    }, 5000)
    // await page.waitForSelector(TypeStocksNameInputsSel, {timeout : 1000 * 60 * 10});
    // console.log('1majom');
    //await mouse.click(x, y, [options])
    // await clickBtn(page, chartTofullScreenBtnsSel);

    //await page.type(TypeStocksNameInputsSel, currentStocktToChecksInnerText);
}

scrapingLogic ();

/*
function getStockDataFromSite() {
    return new Promise(resolve => {
        let getStockDataFromSiteChProcess = spawn('node', ['./modules/get-data-from-site/get-data-from-site.js']);
        
        let hasAlreadyBeenAnError = false;

        getStockDataFromSiteChProcess.stdout.on('data', (stockDataJson) => {
            let stockDataObj = JSON.parse(stockDataJson);
            resolve(stockDataObj);
        });

        getStockDataFromSiteChProcess.stderr.on('data', (data) => {
          console.log(`getStockDataFromSiteChProcess ERR: ${data}`);
          console.log('------------------------------------');
          
          if (!hasAlreadyBeenAnError) {
                hasAlreadyBeenAnError = true;
                getStockDataFromSiteChProcess.kill();
                getStockDataFromSite();
                return;   
          } else {
              return;
          }
        });

        getStockDataFromSiteChProcess.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });
    })
}


*/