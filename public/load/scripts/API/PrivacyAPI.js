if (!window.PrivacyAPI) window.PrivacyAPI = {
    ResponseURL: "/api/privacy",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    CheckAuthority: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/CheckAuthority?timeStamp=" + new Date().getTime();
        var queryString = (params.Permissions ? "&Permissions=" + params.Permissions : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    CheckAccess: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/CheckAccess?timeStamp=" + new Date().getTime();
        var queryString = (params.ObjectIDs ? "&ObjectIDs=" + params.ObjectIDs : "") +
            (params.Type ? "&Type=" + params.Type : "") +
            (params.Permissions ? "&Permissions=" + params.Permissions : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    SetAudience: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/SetAudience?timeStamp=" + new Date().getTime();
        var queryString = (params.ObjectType ? "&ObjectType=" + params.ObjectType : "") +
            (params.Data ? "&Data=" + params.Data : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    GetAudience: function (params) {
        params = params || {};

        params.ObjectIDs = params.ObjectIDs || params.ObjectID;

        var url = PrivacyAPI.ResponseURL + "/GetAudience?timeStamp=" + new Date().getTime();
        var queryString = (params.ObjectIDs ? "&ObjectIDs=" + params.ObjectIDs : "") +
            (params.ObjectType ? "&ObjectType=" + params.ObjectType : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    AddConfidentialityLevel: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/AddConfidentialityLevel?timeStamp=" + new Date().getTime();
        var queryString = (params.LevelID ? "&LevelID=" + params.LevelID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    ModifyConfidentialityLevel: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/ModifyConfidentialityLevel?timeStamp=" + new Date().getTime();
        var queryString = (params.ConfidentialityID ? "&ConfidentialityID=" + params.ConfidentialityID : "") +
            (params.LevelID ? "&LevelID=" + params.LevelID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    RemoveConfidentialityLevel: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/RemoveConfidentialityLevel?timeStamp=" + new Date().getTime();
        var queryString = (params.ConfidentialityID ? "&ConfidentialityID=" + params.ConfidentialityID : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    GetConfidentialityLevels: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/GetConfidentialityLevels?timeStamp=" + new Date().getTime();
        return PrivacyAPI._send(url, params, "");
    },

    SetConfidentialityLevel: function (params) {
        params = params || {};

        params.ConfidentialityID = params.ConfidentialityID || params.LevelID;

        var url = PrivacyAPI.ResponseURL + "/SetConfidentialityLevel?timeStamp=" + new Date().getTime();
        var queryString = (params.ObjectID ? "&ObjectID=" + params.ObjectID : "") +
            (params.ConfidentialityID ? "&ConfidentialityID=" + params.ConfidentialityID : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    UnsetConfidentialityLevel: function (params) {
        params = params || {};

        params.ConfidentialityID = params.ConfidentialityID || params.LevelID;

        var url = PrivacyAPI.ResponseURL + "/UnsetConfidentialityLevel?timeStamp=" + new Date().getTime();
        var queryString = (params.ObjectID ? "&ObjectID=" + params.ObjectID : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    GetConfidentialityLevel: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/GetConfidentialityLevel?timeStamp=" + new Date().getTime();
        var queryString = (params.ObjectID ? "&ObjectID=" + params.ObjectID : "");
        return PrivacyAPI._send(url, params, queryString);
    },

    GetConfidentialityLevelUsers: function (params) {
        params = params || {};

        var url = PrivacyAPI.ResponseURL + "/GetConfidentialityLevelUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.ConfidentialityID ? "&ConfidentialityID=" + params.ConfidentialityID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return PrivacyAPI._send(url, params, queryString);
    }
};