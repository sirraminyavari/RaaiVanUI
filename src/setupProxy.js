const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

let packageJson = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));

let saasProxy = packageJson.proxy;
const orgProxy = saasProxy + ':1234';

let isOrg = (process.env.REACT_APP_ENV || '_').toLowerCase() == 'org';

let proxy = process.env.REACT_APP_PROXY || (isOrg ? orgProxy : saasProxy);

module.exports = function (app) {
  var endpoints = ['api', 'rss', 'upload', 'download', 'signalr'].map(
    (v) => '/' + v
  );

  endpoints.forEach((ep) => {
    app.use(
      ep,
      createProxyMiddleware({
        target: proxy,
        changeOrigin: true,
      })
    );
  });
};
