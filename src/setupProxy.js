const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://185.239.107.180',
      changeOrigin: true,
    })
  );
  app.use(
    '/rss',
    createProxyMiddleware({
      target: 'http://185.239.107.180',
      changeOrigin: true,
    })
  );
  app.use(
    '/upload',
    createProxyMiddleware({
      target: 'http://185.239.107.180',
      changeOrigin: true,
    })
  );
  app.use(
    '/download',
    createProxyMiddleware({
      target: 'http://185.239.107.180',
      changeOrigin: true,
    })
  );
  app.use(
    '/signalr',
    createProxyMiddleware({
      target: 'http://185.239.107.180',
      changeOrigin: true,
    })
  );
};
