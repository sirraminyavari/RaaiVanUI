if (!window.DIAPI) window.DIAPI = {
    ResponseURL: "/api/import",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    ImportData: function (params) {
        params = params || {};

        params.Timeout = 120000;

        var url = DIAPI.ResponseURL + "/ImportData?timeStamp=" + new Date().getTime();
        var queryString = (params.AttachedFile ? "&AttachedFile=" + params.AttachedFile : "");

        return DIAPI._send(url, params, queryString);
    }
};