if (!window.EMAPI) window.EMAPI = {
    RequestHandler: "/api/expert",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    SearchExpertiseDomains: function (params) {
        params = params || {};

        var url = EMAPI.RequestHandler + "/SearchExpertiseDomains?timeStamp=" + new Date().getTime();
        var queryString = "SearchText=";
        return EMAPI._send(url, params, queryString);
    },

    GetExpertiseDomains: function (params) {
        params = params || {};

        var url = EMAPI.RequestHandler + "/GetExpertiseDomains?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return EMAPI._send(url, params, queryString);
    },

    IAmExpert: function (params) {
        params = params || {};

        var url = EMAPI.RequestHandler + "/IAmExpert?timeStamp=" + new Date().getTime();
        var queryString = (params.ExpertiseDomain ? "&ExpertiseDomain=" + params.ExpertiseDomain : "");
        return EMAPI._send(url, params, queryString);
    },

    IAmNotExpert: function (params) {
        params = params || {};

        var url = EMAPI.RequestHandler + "/IAmNotExpert?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return EMAPI._send(url, params, queryString);
    },

    ConfirmExpertise: function () {
    }
};