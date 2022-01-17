if (!window.NotificationsAPI) window.NotificationsAPI = {
    ResponseURL: "/api/notification",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    GetNotificationsCount: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetNotificationsCount?timeStamp=" + new Date().getTime();
        return NotificationsAPI._send(url, params, "");
    },

    GetNotifications: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetNotifications?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LastNotSeenID ? "&LastNotSeenID=" + params.LastNotSeenID : "") +
            (params.LastSeenID ? "&LastSeenID=" + params.LastSeenID : "") +
            (typeof (params.Seen) == "undefined" ? "" : "&Seen=" + params.Seen) +
            (params.LastViewDate ? "&LastViewDate=" + params.LastViewDate : "") +
            (params.LowerDateLimit ? "&LowerDateLimit=" + params.LowerDateLimit : "") +
            (params.UpperDateLimit ? "&UpperDateLimit=" + params.UpperDateLimit : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    SetNotificationsAsSeen: function (params) {
        params = params || {};

        var strIds = "";
        for (var i = 0, lnt = (params.NotificationIDs || []).length; i < lnt; ++i)
            strIds += (i == 0 ? "" : "|") + params.NotificationIDs[i];

        var url = NotificationsAPI.ResponseURL + "/SetNotificationsAsSeen?timeStamp=" + new Date().getTime();
        var queryString = (strIds == "" ? "" : "&NotificationIDs=" + strIds);
        return NotificationsAPI._send(url, params, queryString);
    },

    SetUserNotificationsAsSeen: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/SetUserNotificationsAsSeen?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    RemoveNotification: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/RemoveNotification?timeStamp=" + new Date().getTime();
        var queryString = (params.NotificationID ? "&NotificationID=" + params.NotificationID : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    GetDashboardTypes: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetDashboardTypes?timeStamp=" + new Date().getTime();
        return NotificationsAPI._send(url, params, "");
    },

    SetDashboardsAsSeen: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/SetDashboardsAsSeen?timeStamp=" + new Date().getTime();
        var queryString = (params.DashboardIDs ? "&DashboardIDs=" + params.DashboardIDs : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    RemoveDashboards: function (params) {
        params = params || {};

        params.DashboardIDs = params.DashboardIDs || params.DashboardID;

        var url = NotificationsAPI.ResponseURL + "/RemoveDashboards?timeStamp=" + new Date().getTime();
        var queryString = (params.DashboardIDs ? "&DashboardIDs=" + params.DashboardIDs : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    GetDashboardsCount: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetDashboardsCount?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodelID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeAdditionalID ? "&NodeAdditionalID=" + params.NodeAdditionalID : "") +
            (params.Type ? "&Type=" + params.Type : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    GetDashboards: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetDashboards?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeAdditionalID ? "&NodeAdditionalID=" + params.NodeAdditionalID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Type ? "&Type=" + params.Type : "") +
            (params.SubType ? "&SubType=" + params.SubType : "") +
            (params.SubTypeTitle ? "&SubTypeTitle=" + params.SubTypeTitle : "") +
            (params.Done === true || params.Done === false ? "&Done=" + params.Done : "") +
            (params.DateFrom ? "&DateFrom=" + params.DateFrom : "") +
            (params.DateTo ? "&DateTo=" + params.DateTo : "") +
            (GlobalUtilities.get_type(params.DistinctItems) == "boolean" ? "&DistinctItems=" + params.DistinctItems : "") +
            (GlobalUtilities.get_type(params.InWorkFlow) == "boolean" ? "&InWorkFlow=" + params.InWorkFlow : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    GetCurrentDashboards: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetCurrentDashboards?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeAdditionalID ? "&NodeAdditionalID=" + params.NodeAdditionalID : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    SetMessageTemplate: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/SetMessageTemplate?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.TemplateID ? "&TemplateID=" + params.TemplateID : "") +
            (params.BodyText ? "&BodyText=" + params.BodyText : "") +
            (params.AudienceType ? "&AudienceType=" + params.AudienceType : "") +
            (params.AudienceRefOwnerID ? "&AudienceRefOwnerID=" + params.AudienceRefOwnerID : "") +
            (params.AudienceNodeID ? "&AudienceNodeID=" + params.AudienceNodeID : "") +
            (params.AudienceNodeAdmin ? "&AudienceNodeAdmin=" + params.AudienceNodeAdmin : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    RemoveMessageTemplate: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/RemoveMessageTemplate?timeStamp=" + new Date().getTime();
        var queryString = (params.TemplateID ? "&TemplateID=" + params.TemplateID : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    GetOwnerMessageTemplates: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetOwnerMessageTemplates?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    //Notification Messages

    SetUserMessagingActivation: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/SetUserMessagingActivation?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.OptionID ? "&OptionID=" + params.OptionID : "") +
            (params.SubjectType ? "&SubjectType=" + params.SubjectType : "") +
            (params.UserStatus ? "&UserStatus=" + params.UserStatus : "") +
            (params.Action ? "&Action=" + params.Action : "") +
            (params.Media ? "&Media=" + params.Media : "") +
            (params.Enable ? "&Enable=" + params.Enable : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    SetNotificationMessageTemplateText: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/SetNotificationMessageTemplateText?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.TemplateID ? "&TemplateID=" + params.TemplateID : "") +
            (params.Subject ? "&Subject=" + params.Subject : "") +
            (params.Text ? "&Text=" + params.Text : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    SetAdminMessagingActivation: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/SetAdminMessagingActivation?timeStamp=" + new Date().getTime();
        var queryString = (params.TemplateID ? "&TemplateID=" + params.TemplateID : "") +
            (params.SubjectType ? "&SubjectType=" + params.SubjectType : "") +
            (params.Action ? "&Action=" + params.Action : "") +
            (params.Media ? "&Media=" + params.Media : "") +
            (params.UserStatus ? "&UserStatus=" + params.UserStatus : "") +
            (params.Language ? "&Language=" + params.Language : "") +
            (params.Enable ? "&Enable=" + params.Enable : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    GetUserMessagingActivation: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetUserMessagingActivation?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return NotificationsAPI._send(url, params, queryString);
    },

    GetNotificationMessageTemplatesInfo: function (params) {
        params = params || {};

        var url = NotificationsAPI.ResponseURL + "/GetNotificationMessageTemplatesInfo?timeStamp=" + new Date().getTime();
        return NotificationsAPI._send(url, params, "");
    }

    //end of Notification Messages
};