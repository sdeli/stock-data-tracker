const config = require('config');
const express = require('express');
const errorRouter = express.Router();

errorRouter.get(config.eps.fiveOOne, (req, res) => {
    res.send("<h1>Internal Server Error</h1>")
});

errorRouter.get(config.eps.fourOfour, (req, res) => {
    res.send("<h1>Page Not Found</h1>")
});

module.exports = errorRouter;