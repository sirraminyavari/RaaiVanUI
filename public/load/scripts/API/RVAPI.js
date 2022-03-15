if (!window.RVAPI) window.RVAPI = {
    ResponseURL: "/api/rv",
    RSSResponseURL: "/rss",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    RemoteAuthenticationURL: function () {
        return "/api/Authenticate?timeStamp=" + new Date().getTime();
    },

    PostRequest: function (url, data, callback) {
        var queryString = "";
        for (var id in (data || {}))
            queryString += (!queryString ? "" : "&") + id + "=" + data[id];
        send_post_request(url, queryString, callback, null, null, null, true);
    },

    ThemeURL: function (params) { return "/api/rv/theme?name=" + (params || {}).Name + "&timeStamp=" + new Date().getTime(); },

    HelpPageURL: function () { return "/helpme"; },

    LoginPageURL: function () { return "/login"; },

    ApplicationsPageURL: function () { return "/teams"; },

    HomePageURL: function () { return "/home"; },

    IsHomePage: function () {
        return window.location.pathname.toLowerCase().indexOf("/home") == 0;
    },

    DownloadLink: function (params) {
        params = params || {};
        return "/download/" + (params.FileID || "_") +
            (params.Extension ? "&Extension=" + params.Extension : "") +
            (params.Category ? "&Category=" + params.Category : "") +
            (params.CoverID ? "&CoverID=" + params.CoverID : "") +
            (params.Meta ? "&Meta=" + params.Meta : "") +
            (params.Password ? "&PS=" + params.Password : "") +
            (params.Download === false ? "&dl=false" : "");
    },

    UserPageURL: function (params) {
        params = params || {};
        return "/user" + (params.UserID ? "/" + params.UserID : "") + (params.Tab ? "?Tab=" + params.Tab : "");
    },

    DashboardPageURL: function (params) {
        return "/dashboard";
    },

    NetworkPageURL: function (params) {
        params = params || {};
        return "/network" + (params.Tab ? "?OpenTab=" + params.Tab : "");
    },

    NewNodePageURL: function (params) {
        params = params || {};
        params.ParentID = params.ParentID || params.ParentNodeID;

        return "/newnode/" + (params.NodeTypeID || params.ID || "") + "?timeStamp=" + new Date().getTime() +
            (params.ParentID ? "&ParentID=" + params.ParentID : "") +
            (params.PreviousVersionID ? "&PreviousVersionID=" + params.PreviousVersionID : "") +
            (params.DocumentTreeNodeID ? "&DocumentTreeNodeID=" + params.DocumentTreeNodeID : "");
    },

    NodePageURL: function (params) {
        params = params || {};
        return "/node/" + (params.NodeID || params.ID || "_") + (params.QRCode ? "?qrcode=true" : "");
    },

    NodeToQRCodeURL: function (params) {
        params = params || {};
        return "/api/network/qrcode?NodeID=" + (params.NodeID || params.ID || "_") +
            (params.URLOnly ? "&URLOnly=" + params.URLOnly : "") +
            "&timeStamp=" + new Date().getTime();
    },

    NewQuestionPageURL: function () {
        return "/newquestion";
    },

    QuestionsPageURL: function () {
        return "/questions";
    },

    QuestionPageURL: function (params) {
        return "/question/" + ((params || {}).QuestionID);
    },

    FormPageURL: function (params) {
        return "/form/" + ((params || {}).ID || (params || {}).InstanceID);
    },

    PostsPageURL: function (params) {
        return "/posts" + (!(params || {}).PostID ? "" : "/" + params.PostID);
    },

    MessagesPageURL: function () {
        return "/messages";
    },

    ClassesPageURL: function (params) {
        params = params || {};

        var queryString = (!params.NodeTypeIDs ? "" : "&IDs=" + params.NodeTypeIDs.join(",")) +
            (!params.RelatedID ? "" : "&RelatedID=" + params.RelatedID) +
            (params.Bookmarked !== true ? "" : "&Bookmarked=true");

        if (queryString && (queryString[0] == "&")) queryString = queryString.substr(1);

        return "/classes" + (!params.NodeTypeID ? "" : "/" + String(params.NodeTypeID).toLowerCase()) +
            (queryString ? "?" + queryString : "");
    },

    GraphPageURL: function () {
        return "/graph";
    },

    ExplorerPageURL: function () {
        return "/explorer";
    },

    ExpertLocatorPageURL: function (params) {
        return "/usersearch";
    },

    OnboardingPageURL: function (params) {
        return "/onboarding";
    },

    SearchPageURL: function (params) {
        return "/dosearch" + (!(params || {}).SearchText ? "" : "/" + params.SearchText.replace(/\//g, '_').replace(/\+/g, '~'));
    },

    IsSearchPage: function () {
        return window.location.pathname.toLowerCase().indexOf("/dosearch") == 0;
    },

    RemoteSearchPageURL: function (params) {
        return "/remotesearch";
    },

    DownloadURL: function (params) {
        params = params || {};
        return "/download/" + (params.FileID || "_") + "?" +
            (params.Extension ? "&Extension=" + params.Extension : "") +
            (params.Category ? "&Category=" + params.Category : "") +
            (params.CoverID ? "&CoverID=" + params.CoverID : "") +
            (params.Meta ? "&Meta=" + params.Meta : "") +
            (params.Password ? "&PS=" + params.Password : "") +
            (params.Download === false ? "&dl=false" : "");
    },

    DataImportTemplateURL: function (params) {
        params = params || {};
        return "/Data_Import_Templates/" + params.Name + ".xml" + "?timeStamp=" + new Date().getTime();
    },

    AdminPanelPageURL: function (params) {
        return "/configuration";
    },

    ReportsPageURL: function (params) {
        return "/reportspanel";
    },

    _LoginFuncs: [],
    _LogoutFuncs: [],

    LoggedIn: function () { for (var i = 0, lnt = RVAPI._LoginFuncs.length; i < lnt; ++i) RVAPI._LoginFuncs[i](); },
    LoggedOut: function () { for (var i = 0, lnt = RVAPI._LogoutFuncs.length; i < lnt; ++i) RVAPI._LogoutFuncs[i](); },

    OnLogin: function (params) {
        var _onLogin = GlobalUtilities.get_type(params) == "function" ? params : (params || {}).OnLogin;
        if (_onLogin) RVAPI._LoginFuncs.push(_onLogin);
    },

    OnLogout: function (params) {
        var _onLogout = GlobalUtilities.get_type(params) == "function" ? params : (params || {}).OnLogout;
        if (_onLogout) RVAPI._LogoutFuncs.push(_onLogout);
    },

    GetGlobalParams: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetGlobalParams?timeStamp=" + new Date().getTime();
        var queryString = (GlobalUtilities.get_type(params.Set) == "boolean" ? "&Set=" + params.Set : "");
        return RVAPI._send(url, params, queryString);
    },

    CheckRoute: function (params) {
        params = params || {};

        var reqParams = [];

        for (var key in (params.Parameters || {}))
            reqParams.push(key + "=" + params.Parameters[key]);

        var url = RVAPI.ResponseURL + "/CheckRoute?timeStamp=" + new Date().getTime();
        var queryString = (params.RouteName ? "&RouteName=" + params.RouteName : "") + "&" + reqParams.join("&");
        return RVAPI._send(url, params, queryString);
    },

    CreateWorkspace: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/CreateWorkspace?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "");
        return RVAPI._send(url, params, queryString);
    },

    RenameWorkspace: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RenameWorkspace?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkspaceID ? "&WorkspaceID=" + params.WorkspaceID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return RVAPI._send(url, params, queryString);
    },

    RemoveWorkspaceTicket: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RemoveWorkspaceTicket?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkspaceID ? "&WorkspaceID=" + params.WorkspaceID : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "");
        return RVAPI._send(url, params, queryString);
    },

    RemoveWorkspace: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RemoveWorkspace?timeStamp=" + new Date().getTime();
        var queryString = (params.VerificationToken ? "&VerificationToken=" + params.VerificationToken : "") +
            (params.Code ? "&Code=" + params.Code : "");
        return RVAPI._send(url, params, queryString);
    },

    GetWorkspaces: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetWorkspaces?timeStamp=" + new Date().getTime();
        var queryString = "";
        return RVAPI._send(url, params, queryString);
    },

    GetApplications: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetApplications?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkspaceID ? "&WorkspaceID=" + params.WorkspaceID : "") +
            (GlobalUtilities.get_type(params.Archive) == "boolean" ? "&Archive=" + params.Archive : "");
        return RVAPI._send(url, params, queryString);
    },

    GetApplicationsMonitoring: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetApplicationsMonitoring?timeStamp=" + new Date().getTime();
        var queryString = (params.MembersCount ? "&MembersCount=" + params.MembersCount : "") +
            (params.LastActivityTime ? "&LastActivityTime=" + params.LastActivityTime : "") + 
            (params.LoginsCountSinceNDaysAgo ? "&LoginsCountSinceNDaysAgo=" + params.LoginsCountSinceNDaysAgo : "") +
            (params.TotalUsersCount ? "&TotalUsersCount=" + params.TotalUsersCount : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return RVAPI._send(url, params, queryString);
    },

    GetApplicationPerformanceMonitoring: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetApplicationPerformanceMonitoring?timeStamp=" + new Date().getTime();
        var queryString = (params.AppID ? "&AppID=" + params.AppID : "") +
            (params.DateFrom ? "&DateFrom=" + params.DateFrom : "") +
            (params.DateTo ? "&DateTo=" + params.DateTo : "");
        return RVAPI._send(url, params, queryString);
    },

    SelectApplication: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SelectApplication?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "");
        return RVAPI._send(url, params, queryString);
    },

    CreateApplication: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/CreateApplication?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkspaceID ? "&WorkspaceID=" + params.WorkspaceID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return RVAPI._send(url, params, queryString);
    },

    ModifyApplication: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/ModifyApplication?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return RVAPI._send(url, params, queryString);
    },

    SetApplicationSize: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SetApplicationSize?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.Size ? "&Size=" + params.Size : "");
        return RVAPI._send(url, params, queryString);
    },

    SetApplicationFieldOfExpertise: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SetApplicationFieldOfExpertise?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.FieldID ? "&FieldID=" + params.FieldID : "") +
            (params.FieldName ? "&FieldName=" + params.FieldName : "");
        return RVAPI._send(url, params, queryString);
    },

    SaveApplicationInfo: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SaveApplicationInfo?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Tagline ? "&Tagline=" + params.Tagline : "") +
            (params.Website ? "&Website=" + params.Website : "") +
            (params.About ? "&About=" + params.About : "") +
            (params.Size ? "&Size=" + params.Size : "") +
            (params.ExpertiseFieldID ? "&ExpertiseFieldID=" + params.ExpertiseFieldID : "") +
            (params.ExpertiseFieldName ? "&ExpertiseFieldName=" + params.ExpertiseFieldName : "") + 
            (params.Language ? "&Language=" + params.Language : "") +
            (params.Calendar ? "&Calendar=" + params.Calendar : "");
        return RVAPI._send(url, params, queryString);
    },

    RemoveApplication: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RemoveApplication?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "");
        return RVAPI._send(url, params, queryString);
    },

    RecycleApplication: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RecycleApplication?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "");
        return RVAPI._send(url, params, queryString);
    },

    RemoveUserFromWorkspace: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RemoveUserFromWorkspace?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkspaceID ? "&WorkspaceID=" + params.WorkspaceID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return RVAPI._send(url, params, queryString);
    },

    RemoveUserFromApplication: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RemoveUserFromApplication?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return RVAPI._send(url, params, queryString);
    },

    UnsubscribeFromApplication: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/UnsubscribeFromApplication?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "");
        return RVAPI._send(url, params, queryString);
    },

    AddSystemAdmin: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/AddSystemAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return RVAPI._send(url, params, queryString);
    },

    RemoveSystemAdmin: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RemoveSystemAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return RVAPI._send(url, params, queryString);
    },

    GetDomains: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetDomains?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    Login: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/Login?timeStamp=" + new Date().getTime();
        var queryString = (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.Password ? "&Password=" + params.Password : "") +
            (params.DomainName ? "&DomainName=" + params.DomainName : "") +
            (params.RememberMe ? "&RememberMe=" + params.RememberMe : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "") +
            (params.InvitationID ? "&InvitationID=" + params.InvitationID : "");
        return RVAPI._send(url, params, queryString);
    },

    LoginStepTwo: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/LoginStepTwo?timeStamp=" + new Date().getTime();
        var queryString = (params.Token ? "&TwoStepToken=" + params.Token : "") +
            (params.Code ? "&Code=" + params.Code : "") +
            (params.RememberMe ? "&RememberMe=" + params.RememberMe : "") +
            (params.InvitationID ? "&InvitationID=" + params.InvitationID : "");
        return RVAPI._send(url, params, queryString);
    },

    ResendVerificationCode: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/ResendVerificationCode?timeStamp=" + new Date().getTime();
        var queryString = (params.Token ? "&VerificationToken=" + params.Token : "");
        return RVAPI._send(url, params, queryString);
    },

    Logout: function (params) {
        params = params || {};

        if ((window.RaaiVanHub || {}).stop) window.RaaiVanHub.stop();

        var url = RVAPI.ResponseURL + "/Logout?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    CaptchaImage: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/CaptchaImage?timeStamp=" + new Date().getTime();
        var queryString = (params.Width ? "&Width=" + params.Width : "") +
            (params.Height ? "&Height=" + params.Height : "");
        return RVAPI._send(url, params, queryString);
    },

    SetSession: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SetSession?timeStamp=" + new Date().getTime();
        var queryString = (params.Value ? "&Value=" + params.Value : "") +
            (params.SessionName ? "&SessionName=" + params.SessionName : "");
        return RVAPI._send(url, params, queryString);
    },

    GetSession: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetSession?timeStamp=" + new Date().getTime();
        var queryString = (params.SessionName ? "&SessionName=" + params.SessionName : "");
        return RVAPI._send(url, params, queryString);
    },

    SetVariable: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SetVariable?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "") +
            (params.Value ? "&Value=" + params.Value : "") +
            (params.ApplicationIndependent ? "&ApplicationIndependent=" + params.ApplicationIndependent : "");
        return RVAPI._send(url, params, queryString);
    },

    GetVariable: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetVariable?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "") +
            (params.ApplicationIndependent ? "&ApplicationIndependent=" + params.ApplicationIndependent : "");
        return RVAPI._send(url, params, queryString);
    },

    SetOwnerVariable: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SetOwnerVariable?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return RVAPI._send(url, params, queryString);
    },

    GetOwnerVariables: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetOwnerVariables?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.CurrentUserOnly ? "&CurrentUserOnly=" + params.CurrentUserOnly : "");
        return RVAPI._send(url, params, queryString);
    },

    RemoveOwnerVariable: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/RemoveOwnerVariable?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "");
        return RVAPI._send(url, params, queryString);
    },

    RSS: function (params) {
        params = params || {};

        var url = RVAPI.RSSResponseURL + "/external?timeStamp=" + new Date().getTime();
        var queryString = (params.URLs ? "&URLs=" + params.URLs : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.StoreAsNodeTypeID ? "&StoreAsNodeTypeID=" + params.StoreAsNodeTypeID : "");
        return RVAPI._send(url, params, queryString);
    },

    GetJob: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetJob?timeStamp=" + new Date().getTime();
        var queryString = (params.Type ? "&Type=" + params.Type : "");
        return RVAPI._send(url, params, queryString);
    },

    GetJobs: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetJobs?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    StartJob: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/StartJob?timeStamp=" + new Date().getTime();
        var queryString = (params.Type ? "&Type=" + params.Type : "");
        return RVAPI._send(url, params, queryString);
    },

    StopJob: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/StopJob?timeStamp=" + new Date().getTime();
        var queryString = (params.Type ? "&Type=" + params.Type : "");
        return RVAPI._send(url, params, queryString);
    },

    SetJobTiming: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SetJobTiming?timeStamp=" + new Date().getTime();
        var queryString = (params.Type ? "&Type=" + params.Type : "") +
            (params.Interval ? "&Interval=" + params.Interval : "") +
            (params.StartHour ? "&StartHour=" + params.StartHour : "") +
            (params.StartMinute ? "&StartMinute=" + params.StartMinute : "") +
            (params.EndHour ? "&EndHour=" + params.EndHour : "") +
            (params.EndMinute ? "&EndMinute=" + params.EndMinute : "");
        return RVAPI._send(url, params, queryString);
    },

    GetLogActions: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetLogActions?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    WebRequest: function (params) {
        params = params || {};

        var data = [];
        for (var d in (params.Data || {}))
            data.push(Base64.encode(d) + ":" + Base64.encode(String(params.Data[d])));

        var url = RVAPI.ResponseURL + "/WebRequest?timeStamp=" + new Date().getTime();
        var queryString = (params.URL ? "&RequestURL=" + Base64.encode(params.URL) : "") +
            (data.length > 0 ? "&Data=" + data.join('|') : "");
        return RVAPI._send(url, params, queryString);
    },

    GetThemes: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetThemes?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    SuggestTags: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SuggestTags?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") + "&text=";
        return RVAPI._send(url, params, queryString);
    },

    Like: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/Like?timeStamp=" + new Date().getTime();
        var queryString = (params.LikedID ? "&LikedID=" + params.LikedID : "") +
            (params.LikedType ? "&LikedType=" + params.LikedType : "");
        return RVAPI._send(url, params, queryString);
    },

    Dislike: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/Dislike?timeStamp=" + new Date().getTime();
        var queryString = (params.LikedID ? "&LikedID=" + params.LikedID : "") +
            (params.LikedType ? "&LikedType=" + params.LikedType : "");
        return RVAPI._send(url, params, queryString);
    },

    Unlike: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/Unlike?timeStamp=" + new Date().getTime();
        var queryString = (params.LikedID ? "&LikedID=" + params.LikedID : "") +
            (params.LikedType ? "&LikedType=" + params.LikedType : "");
        return RVAPI._send(url, params, queryString);
    },

    GetFans: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetFans?timeStamp=" + new Date().getTime();
        var queryString = (params.LikedID ? "&LikedID=" + params.LikedID : "");
        return RVAPI._send(url, params, queryString);
    },

    Follow: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/Follow?timeStamp=" + new Date().getTime();
        var queryString = (params.FollowedID ? "&FollowedID=" + params.FollowedID : "");
        return RVAPI._send(url, params, queryString);
    },

    Unfollow: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/Unfollow?timeStamp=" + new Date().getTime();
        var queryString = (params.FollowedID ? "&FollowedID=" + params.FollowedID : "");
        return RVAPI._send(url, params, queryString);
    },

    GetHelpIndex: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetHelpIndex?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    GetHelpIndexEntry: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetHelpIndexEntry?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "");
        return RVAPI._send(url, params, queryString);
    },

    GetHelpMediaFiles: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetHelpMediaFiles?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    SaveHelpIndexEntry: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SaveHelpIndexEntry?timeStamp=" + new Date().getTime();
        var queryString = (params.Lang ? "&Lang=" + params.Lang : "") +
            (params.Path ? "&Path=" + params.Path : "") +
            (params.Content ? "&Content=" + params.Content : "");
        return RVAPI._send(url, params, queryString);
    },

    SaveSystemSettingsValues: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/SaveSystemSettingsValues?timeStamp=" + new Date().getTime();
        var queryString = (params.Settings ? "&Settings=" + params.Settings : "");
        return RVAPI._send(url, params, queryString);
    },

    GetSystemSettingsValues: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetSystemSettingsValues?timeStamp=" + new Date().getTime();
        var queryString = (params.Names ? "&Names=" + params.Names : "");
        return RVAPI._send(url, params, queryString);
    },

    GetAllNotifications: function (params) {
        params = params || {};

        var url = RVAPI.ResponseURL + "/GetAllNotifications?timeStamp=" + new Date().getTime();
        return RVAPI._send(url, params, "");
    },

    Log: function (params) {
        params = params || {};

        params.Data = params.Data || params.data;

        var url = RVAPI.ResponseURL + "/Log?timeStamp=" + new Date().getTime();
        var queryString = (params.Data ? "&Data=" + params.Data : "");
        return RVAPI._send(url, params, queryString);
    }
};