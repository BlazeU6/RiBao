const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            target: "http://39.104.81.150:8889",
            changeOrigin: true,
            ws: true,
            pathRewrite: { "^/api": "" }
        })
    );
};