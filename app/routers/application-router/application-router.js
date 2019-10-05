const config = require('config');
const express = require('express');
const authRouter = express.Router();

const getIndexPage = require("./get-index-page/get-index-page");

authRouter.get(config.eps.index, getIndexPage);

module.exports = authRouter;