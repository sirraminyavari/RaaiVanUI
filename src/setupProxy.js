const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  "/api/*",
    createProxyMiddleware({
      target: "http://localhost:20470",
      changeOrigin: true,
    });
};
