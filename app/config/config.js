module.exports = {
    // eps: rest end-points
    eps: {
        top: "/",
        app: "/tracker",
        logIn: "/log-in"
    },
    templateConf: {
        tracker: {
            title: "Stock Data Tracker",
            id: "app"
        },
        logIn: {
            title: "Login - Stock Data Tracker",
            id: "login"
        },
        err404: {
            id: "error"
        }
    },
    viewPathes: {
        logIn: "/login.ejs",
        tracker: "/tracker.ejs",
        error: "/error.ejs"
    }
};