const getVolume50 = require('../../../../indicators/volume50/get-volume-50.js');

function checkIfStocksVolumeIsEnough(ohlcvDataObj) {
    let volume50 = getVolume50(ohlcvDataObj);

    if (volume50 > 1000000) {
        return true;
    } else {
        return false;
    }
}

function checkIfClOver10DollarsInMa20(ohlcvDataObj) {
    let clMa20 = 0;
    let isClMa20Over10;
    let i = 0;

    for (date in ohlcvDataObj) {
        if (i < 20) {
            i++;
            clMa20 += parseFloat(ohlcvDataObj[date]['4. close']);
        } else {
            isClMa20Over10 = (clMa20 / 20) > 10;
            break;
        }
    }

    return isClMa20Over10;
}

function isCurrClOverCurrMa50(currCl, currMa50) {
    if (!currCl || !currMa50) return false;

    try {
        if (currCl > currMa50) {
            let successMsg = `current condition for 'isCurrClOverCurrMa50': \'currCl < currMa50\' was true, please check by the details:\n\ncurrCl: ${currCl}\n\ncurrMa50: ${currMa50}\n\n`

            let conditionsResult = {
                successMsg,
                datas : {
                    currCl,
                    currMa50,
                }
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

function ccisCondition(cciDataObj) {
    if (!cciDataObj) return false;

    try {
        let cciDataArr = Object.values(cciDataObj);
        let cciDataPointsArr = Object.keys(cciDataObj); 

        let currCci = parseFloat(cciDataArr[0]['CCI']);
        let prevCci = parseFloat(cciDataArr[1]['CCI']);

        if (prevCci < 100 && currCci > 100) {
            let successMsg = `current condition: \n\n'prevCci < 100 && currCci > 100\n\n' was true, please check by the details:\n\nprevCci: ${prevCci}\n\ncurrCci: ${currCci}\n`;

            let conditionsResult = {
                successMsg,
                datas : {
                    prevCci,
                    currCci,
                    first6DataPoints : [
                        cciDataPointsArr[0],                       
                        cciDataPointsArr[1],                       
                        cciDataPointsArr[2],                       
                        cciDataPointsArr[3],                       
                        cciDataPointsArr[4],                       
                        cciDataPointsArr[5]                    
                    ]
                }
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

function macdConditionOne(macdDataObj, macdType) {
    if (!macdDataObj) return false;

    try {
        let macdDataArr = Object.values(macdDataObj);
        let macdDataPointsArr = Object.keys(macdDataObj); 

        let currFast = parseFloat(macdDataArr[0]['MACD_Signal']);
        let currSlow = parseFloat(macdDataArr[0]['MACD']);
        let prevFast = parseFloat(macdDataArr[1]['MACD_Signal']);
        let prevSlow = parseFloat(macdDataArr[1]['MACD']);

        if (prevFast < prevSlow && currFast > currSlow) {
            let successMsg = `current condition for ${macdType}: \'prevFast < prevSlow && currFast > currSlow\' was true, please check by the details:\n\nprevFast: ${prevFast}\n\nprevSlow: ${prevSlow}\n\ncurrFast: ${currFast}\currSlow: ${currSlow}\n`;

            let conditionsResult = {
                successMsg,
                datas : {
                    prevFast,
                    prevSlow,
                    currFast,
                    currSlow,
                    first6DataPoints : [
                        macdDataPointsArr[0],                       
                        macdDataPointsArr[1],                       
                        macdDataPointsArr[2],                       
                        macdDataPointsArr[3],                       
                        macdDataPointsArr[4],                       
                        macdDataPointsArr[5]                       
                    ]
                }
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

function macdConditionTwo(macdDataObj, macdType) {
    if (!macdDataObj) return false;

    try {
        let macdDataArr = Object.values(macdDataObj);
        let macdDataPointsArr = Object.keys(macdDataObj);

        let currFast = parseFloat(macdDataArr[0]['MACD_Signal']);
        let prevFast = parseFloat(macdDataArr[1]['MACD_Signal']);

        if (prevFast < 0 && currFast > 0) {
            let successMsg = `current condition for ${macdType}: \n\n'prevFast < 0 && currFast > 0\n\n' was true, please check by the details:\n\nprevFast: ${prevFast}\n\ncurrFast: ${currFast}\n`;

            let conditionsResult = {
                successMsg,
                datas : {
                    prevFast,
                    currFast,
                    first6DataPoints : [
                        macdDataPointsArr[0],                       
                        macdDataPointsArr[1],                       
                        macdDataPointsArr[2],                       
                        macdDataPointsArr[3],                       
                        macdDataPointsArr[4],                       
                        macdDataPointsArr[5]                       
                    ]
                }
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

function ultoscLongsCondition(ultoscDataObj) {
    if (!ultoscDataObj) return false;

    try {
        let ultoscDataArr = Object.values(ultoscDataObj);
        let ultoscDataPointsArr = Object.keys(ultoscDataObj);

        let currUltosc = parseFloat(ultoscDataArr[0]['ULTOSC']);
        let prevUltosc = parseFloat(ultoscDataArr[1]['ULTOSC']);

        if (prevUltosc < 50 && currUltosc > 50) {
            let successMsg = `current condition: \n\n'prevUltosc < 50 && currUltosc > 50\n\n' was true, please check by the details:\n\nprevUltosc: ${prevUltosc}, currUltosc: ${currUltosc}\n`;

            let conditionsResult = {
                successMsg,
                datas : {
                    prevUltosc,
                    currUltosc,
                },
                first6DataPoints : [
                    ultoscDataPointsArr[0],                       
                    ultoscDataPointsArr[1],                       
                    ultoscDataPointsArr[2],                       
                    ultoscDataPointsArr[3],                       
                    ultoscDataPointsArr[4],                       
                    ultoscDataPointsArr[5]                       
                ]
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

function rsisCondition(rsiDataObj) {
    if (!rsiDataObj) return false;

    try {
        let rsiDataArr = Object.values(rsiDataObj);
        let rsiDataPointsArr = Object.keys(rsiDataObj);

        let currRsi = parseFloat(rsiDataArr[0]['RSI']);
        let prevRsi = parseFloat(rsiDataArr[1]['RSI']);

        if (prevRsi < 50 && currRsi > 50) {
            let successMsg = `current condition: \n\n'prevRsi < 50 && currRsi > 50\n\n' was true, please check by the details:\n\nprevRsi: ${prevRsi}\n\ncurrRsi: ${currRsi}\n`;

            let conditionsResult = {
                successMsg,
                datas : {
                    prevRsi,
                    currRsi,
                    first6DataPoints : [
                        rsiDataPointsArr[0],                       
                        rsiDataPointsArr[1],                       
                        rsiDataPointsArr[2],                       
                        rsiDataPointsArr[3],                       
                        rsiDataPointsArr[4],                       
                        rsiDataPointsArr[5]                       
                    ]
                }
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

function stochSlowCondition(stochSlowDataObj) {
    if (!stochSlowDataObj) return false;

    try {
        let stochSlowDataArr = Object.values(stochSlowDataObj);
        let stochSlowDataPointsArr = Object.keys(stochSlowDataObj);

        let currSlowK = parseFloat(stochSlowDataArr[0]['SlowK']);
        let currSlowD = parseFloat(stochSlowDataArr[0]['SlowK']);
        let prevSlowK = parseFloat(stochSlowDataArr[1]['SlowK']);
        let prevSlowD = parseFloat(stochSlowDataArr[1]['SlowK']);
        
        if ((currSlowK < 35) && (prevSlowK < prevSlowD && currSlowK > currSlowD)) {
            let successMsg = `current condition: \n\n'currSlowK < 35) && (prevSlowK < prevSlowD && currSlowK > currSlowD\n\n' was true, please check by the details:\n\ncurrSlowK: ${currSlowK}\n\ncurrSlowD: ${currSlowD}\n\nprevSlowK: ${prevSlowK}\n\nprevSlowD: ${prevSlowD}\n`;

            let conditionsResult = {
                successMsg,
                datas : {
                    currSlowK,
                    currSlowD,
                    prevSlowK,
                    prevSlowD
                },
                first6DataPoints : [
                    stochSlowDataPointsArr[0],                       
                    stochSlowDataPointsArr[1],                       
                    stochSlowDataPointsArr[2],                       
                    stochSlowDataPointsArr[3],                       
                    stochSlowDataPointsArr[4],                       
                    stochSlowDataPointsArr[5]                       
                ]
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

function ma50sCondition(ma50DataObj, currAndPrevClObj) {
    if (!ma50DataObj) return false;
    
    try { 
        let ma50DataArr = Object.values(ma50DataObj);
        let ma50DataPointsArr = Object.keys(ma50DataObj);

        let prevMa50 = parseFloat(ma50DataArr[1]['SMA']);
        let currCl = currAndPrevClObj.curr;
        let prevCl = currAndPrevClObj.prev;

        if (prevCl < prevMa50 && currCl > prevMa50) {
            let successMsg = `current condition: \n\n'prevCl < prevMa50 && currCl > prevMa50\n\n' was true, please check by the details:\n\nprevMa50: ${prevMa50}\n\nprevCl: ${prevCl}\n\ncurrCl: ${currCl}\n`;

            let conditionsResult = {
                successMsg,
                datas : {
                    prevMa50,
                    currCl,
                    prevCl,
                },
                first6Ma50DataPoints : [
                    ma50DataPointsArr[0],                       
                    ma50DataPointsArr[1],                       
                    ma50DataPointsArr[2],                       
                    ma50DataPointsArr[3],                       
                    ma50DataPointsArr[4],                       
                    ma50DataPointsArr[5]                       
                ]
            }

            return conditionsResult;
        } else {
            return false;
        }
    } catch(e) {
        process.stdout.write(JSON.stringify(e, null, 2));
        return false;
    }
}

module.exports = {
    checkIfClOver10DollarsInMa20,
    checkIfStocksVolumeIsEnough,
    macdConditionOne,
    macdConditionTwo,
    ultoscLongsCondition,
    ccisCondition,
    rsisCondition,
    stochSlowCondition,
    ma50sCondition,
    isCurrClOverCurrMa50
};