const nodemailer = require('nodemailer');
const composeMsgForEmail = require('./modules/compose-msg-for-email/compose-msg-for-email.js');

function sendFilteredStockSignalEmailToZoltan(savedStockSignalObj, currStockSignalsObj, stockSignalsFromLast5Days, stockName) {
    let stockTicker = savedStockSignalObj.stockTicker;

    let subject = `signal for: ${stockTicker} - ${stockName} - buy signal`;
    let msg = composeMsgForEmail(stockTicker, currStockSignalsObj, stockSignalsFromLast5Days);
    msg += `\n\n\nRaw Data: ${JSON.stringify(savedStockSignalObj, null, 2)}`;

    sendEmailToZoltan(subject, msg);
    return msg;
}

function sendEmailToZoltan(subject, msg) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sandor.deli.javascript@gmail.com',
        pass: 'Bgfkszm1234'
      }
    });

    let mailOptions = {
      from: 'sandor.deli.javascript@gmail.com',
      to: 'casagrandehungary@gmail.com ',
      subject: subject,
      text: msg
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

module.exports = sendFilteredStockSignalEmailToZoltan;

// sendFilteredStockSignalEmailToZoltan({
//     stockTicker : 'AAPL',
//     signals : [
//         {
//             dateOfSignal : '2018-08-22 00:40:25.647',
//             cci : {
//                 successMsg : 'majom',
//             },
//             macd : {
//                 successMsg : 'majom',
//             }
//         },
//         {
//             dateOfSignal : '2018-08-26 00:40:25.647',
//             cci : {
//                 successMsg : 'majom',
//             },
//             macd : {
//                 successMsg : 'majom',
//             }
//         },
//         {
//             dateOfSignal : '2018-08-27 10:09:49.881',
//             macd : {
//                 successMsg : 'majom',
//             },
//             cci : {
//                 successMsg : 'majom',
//             }
//         },
//         {
//             dateOfSignal : 'Sat Aug 28 2018 14:14:35',
//             isCurrClOverCurrMa50 : true,
//             macd : {
//                 successMsg : 'majom',
//             },
//             cci : {
//                 successMsg : 'majom',
//             }
//         }
//     ]
// });