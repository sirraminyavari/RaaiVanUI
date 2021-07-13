class APIHandler {
  constructor(apiClass, apiFunction) {
    this.APIClass = apiClass;
    this.APIFunction = apiFunction;
  }

  _load(callback) {
    if (window[this.APIClass]) callback();
    else
      window.GlobalUtilities.load_files(['API/' + this.APIClass + '.js'], {
        OnLoad: callback,
      });
  }

  fetch(params, callback, onError) {
    const that = this;

    if (window.GlobalUtilities.get_type(callback) !== 'function') {
      console.error('APIHandler.fetch: callback is not a function');
      return callback();
    }

    this._load(() => {
      window[that.APIClass][that.APIFunction](
        window.GlobalUtilities.extend({}, params || {}, {
          ParseResults: true,
          ResponseHandler: callback,
          OnError: onError,
        })
      );
    });
  }

  url(params, callback) {
    const that = this;

    if (window.GlobalUtilities.get_type(callback) !== 'function') {
      console.error('APIHandler.url: callback is not a function');
      return callback();
    }

    this._load(() => {
      let url = window[that.APIClass][that.APIFunction](params);
      callback(url);
    });
  }
}
export default APIHandler;
