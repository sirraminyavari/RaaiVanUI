if (!window.EventsAPI) window.EventsAPI = {
    ResponseURL: "/api/event",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    NewEvent: function (params) {
        params = params || {};

        var url = EventsAPI.ResponseURL + "/NewEvent?timeStamp=" + new Date().getTime();
        var queryString = (params.Type ? "&Type=" + params.Type : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.BeginDate ? "&BeginDate=" + params.BeginDate : "") +
            (params.FinishDate ? "&FinishDate=" + params.FinishDate : "") +
            (params.UserIDs ? "&UserIDs=" + params.UserIDs : "") +
            (params.GroupIDs ? "&GroupIDs=" + params.GroupIDs : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return EventsAPI._send(url, params, queryString);
    },

    GetEvent: function (params) {
        params = params || {};

        var url = EventsAPI.ResponseURL + "/GetEvent?timeStamp=" + new Date().getTime();
        var queryString = (params.EventID ? "&EventID=" + params.EventID : "");
        return EventsAPI._send(url, params, queryString);
    },

    GetFinishedEventsCount: function (params) {
        params = params || {};

        var url = EventsAPI.ResponseURL + "/GetFinishedEventsCount?timeStamp=" + new Date().getTime();
        return EventsAPI._send(url, params, "");
    },

    GetFinishedEvents: function (params) {
        params = params || {};

        var url = EventsAPI.ResponseURL + "/GetFinishedEvents?timeStamp=" + new Date().getTime();
        return EventsAPI._send(url, params, "");
    },

    RemoveEvent: function (params) {
        params = params || {};

        var url = EventsAPI.ResponseURL + "/RemoveCalenderUser?timeStamp=" + new Date().getTime();
        var queryString = (params.EventID ? "&CalenderID=" + params.EventID : "");
        return EventsAPI._send(url, params, queryString);
    }
};