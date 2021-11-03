const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

let packageJson = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));

module.exports = function (app) {
  var endpoints = ['api', 'rss', 'upload', 'download', 'signalr'].map(
    (v) => '/' + v
  );

  endpoints.forEach((ep) => {
    app.use(
      ep,
      createProxyMiddleware({
        target: packageJson.proxy,
        changeOrigin: true,
      })
    );
  });
};
