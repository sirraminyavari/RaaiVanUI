const req = require.context('../components/Icons/', true, /\.js$/);

module.exports = req
  .keys()
  .map(req)
  .map((m) => m?.default)
  .filter((m) => !!m);
