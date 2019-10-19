const config = require('config');
const express = require('express');
const authRouter = express.Router();
const {requireBeAuthenticated} = require('middlewares');
const getIndexPage = require("./get-index-page/get-index-page");

authRouter.get(config.eps.index, requireBeAuthenticated, getIndexPage);

module.exports = authRouter;