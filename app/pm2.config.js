module.exports = {
    apps : [{
        name: "test.stock-data-tracker.com",
        script: "./app.js",
        watch: true,
        node_args: "--inspect-brk=0.0.0.0:5858"
    }]
};