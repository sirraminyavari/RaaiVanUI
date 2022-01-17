if (!window.MessagingAPI) window.MessagingAPI = {
    ResponseURL: "/api/msg",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    GetRecentThreads: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/GetRecentThreads?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LastID ? "&LastID=" + params.LastID : "");
        return MessagingAPI._send(url, params, queryString);
    },

    GetThreadUsers: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/GetThreadUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.ThreadID ? "&ThreadID=" + params.ThreadID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LastID ? "&LastID=" + params.LastID : "");
        return MessagingAPI._send(url, params, queryString);
    },

    GetMessages: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/GetMessages?timeStamp=" + new Date().getTime();
        var queryString = (params.ThreadID ? "&ThreadID=" + params.ThreadID : "") +
            (params.MinID ? "&MinID=" + params.MinID : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return MessagingAPI._send(url, params, queryString);
    },

    SendMessage: function (params) {
        params = params || {};

        params.ReceiverUserIDs = params.ReceiverUserIDs || params.ReceiverUserID;

        var url = MessagingAPI.ResponseURL + "/SendMessage?timeStamp=" + new Date().getTime();
        var queryString = (params.ForwardedFrom ? "&ForwardedFrom=" + params.ForwardedFrom : "") +
            (params.ThreadID ? "&ThreadID=" + params.ThreadID : "") +
            (params.ReceiverUserIDs ? "&ReceiverUserIDs=" + params.ReceiverUserIDs : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.MessageText ? "&MessageText=" + params.MessageText : "") +
            (params.IsGroup ? "&IsGroup=" + params.IsGroup : "") +
            (params.AttachedFiles ? "&AttachedFiles=" + params.AttachedFiles : "") +
            (params.GroupID ? "&GroupID=" + params.GroupID : "") +
            (params.Ref ? "&Ref=" + params.Ref : "");
        return MessagingAPI._send(url, params, queryString);
    },

    RemoveThread: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/RemoveThread?timeStamp=" + new Date().getTime();
        var queryString = (params.ThreadID ? "&ThreadID=" + params.ThreadID : "");
        return MessagingAPI._send(url, params, queryString);
    },

    RemoveMessage: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/RemoveMessage?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "");
        return MessagingAPI._send(url, params, queryString);
    },

    SetMessagesAsSeen: function (params) {
        params = params || {};

        params.IDs = params.IDs || params.ID;

        var url = MessagingAPI.ResponseURL + "/SetMessagesAsSeen?timeStamp=" + new Date().getTime();
        var queryString = (params.ThreadID ? "&ThreadID=" + params.ThreadID : "");
        return MessagingAPI._send(url, params, queryString);
    },

    GetNotSeenMessagesCount: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/GetNotSeenMessagesCount?timeStamp=" + new Date().getTime();
        return MessagingAPI._send(url, params, "");
    },

    GetForwardedMessages: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/GetForwardedMessages?timeStamp=" + new Date().getTime();
        var queryString = (params.MessageID ? "&MessageID=" + params.MessageID : "");
        return MessagingAPI._send(url, params, queryString);
    },

    GetMessageReceivers: function (params) {
        params = params || {};

        var url = MessagingAPI.ResponseURL + "/GetMessageReceivers?timeStamp=" + new Date().getTime();
        var queryString = (params.MessageID ? "&MessageID=" + params.MessageID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LastID ? "&LastID=" + params.LastID : "");
        return MessagingAPI._send(url, params, queryString);
    }
};