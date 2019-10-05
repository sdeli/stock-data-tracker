const config = require('config');

const INDEX_VIEW__PATH = config.viewPathes.index.replace("/", ''),
    INDEX_VIEW__TITLE = config.templateConf.index.title,
    INDEX_VIEW__ID = config.templateConf.index.id;

module.exports = getTrackerPView;

function getTrackerPView(req, res) {
    res.locals.user = req.user;
    res.locals.pageTitle = INDEX_VIEW__TITLE;
    res.locals.pageId = INDEX_VIEW__ID;

    res.render(INDEX_VIEW__PATH);
}