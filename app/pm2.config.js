module.exports = {
    apps : [{
        name: "test.stock-data-tracker.com",
        script: "./app.js",
        watch: true,
        ignore_watch: ["node_modules", "app/www",  "app/logs", "nginx-log"],
        node_args: "--inspect-brk=0.0.0.0:5858",
    }]
};