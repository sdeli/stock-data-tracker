function sendErrMsgToParentProc(err) {
    if (typeof err === 'object') {
        process.stderr.write(JSON.stringify(err, null, 2)) 
    } else {
        process.stderr.write(err) 
    }
}

module.exports = {
    sendErrMsgToParentProc
}