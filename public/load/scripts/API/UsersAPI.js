if(!window.UsersAPI) window.UsersAPI = {
    ResponseURL: "/api/user",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    UserPageURL: function (params) {
        params = params || {};
        return "../../user" + (params.UserID ? "/" + params.UserID : "") +
            (params.Tab ? "?Tab=" + params.Tab : "");
    },

    GetPasswordPolicy: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetPasswordPolicy?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    GetUsersDataSource: function (params) { return UsersAPI.GetUsers(params); },

    CheckUserName: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/CheckUserName?timeStamp=" + new Date().getTime();
        var queryString = (params.UserName ? "&UserName=" + params.UserName : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetUsers: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.All ? "&All=" + params.All : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (GlobalUtilities.get_type(params.IsOnline) == "boolean" ? "&IsOnline=" + params.IsOnline : "") +
            (GlobalUtilities.get_type(params.IsApproved) == "boolean" ? "&IsApproved=" + params.IsApproved : "") +
            (params.UserIDs ? "&UserIDs=" + params.UserIDs : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.Department ? "&Department=" + params.Department : "") +
            (params.LockedStatus ? "&LockedStatus=" + params.LockedStatus : "") +
            (params.ApprovedStatus ? "&ApprovedStatus=" + params.ApprovedStatus : "") +
            (params.SystemAdminStatus ? "&SystemAdminStatus=" + params.SystemAdminStatus : "") +
            (params.LastActivityTime ? "&LastActivityTime=" + params.LastActivityTime : "") +
            (params.MainEmail ? "&MainEmail=" + params.MainEmail : "") +
            (params.MainPhoneNumber ? "&MainPhoneNumber=" + params.MainPhoneNumber : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") + "&text=";
        return UsersAPI._send(url, params, queryString);
    },

    GetWorkspaceUsers: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetWorkspaceUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkspaceID ? "&WorkspaceID=" + params.WorkspaceID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") + "&text=";
        return UsersAPI._send(url, params, queryString);
    },

    GetApplicationUsers: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetApplicationUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") + "&text=";
        return UsersAPI._send(url, params, queryString);
    },

    GetUser: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetUser?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.GetPhoneNumbers ? "&GetPhoneNumbers=" + params.GetPhoneNumbers : "") +
            (params.GetEmails ? "&GetEmails=" + params.GetEmails : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetCurrentUser: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetCurrentUser?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    AdvancedUserSearch: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/AdvancedUserSearch?timeStamp=" + new Date().getTime();
        var queryString = (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.Members ? "&Members=" + params.Members : "") +
            (params.Experts ? "&Experts=" + params.Experts : "") +
            (params.Contributors ? "&Contributors=" + params.Contributors : "") +
            (params.PropertyOwners ? "&PropertyOwners=" + params.PropertyOwners : "") +
            (params.Resume ? "&Resume=" + params.Resume : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return UsersAPI._send(url, params, queryString);
    },

    AdvancedUserSearchMeta: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/AdvancedUserSearchMeta?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.Members ? "&Members=" + params.Members : "") +
            (params.Experts ? "&Experts=" + params.Experts : "") +
            (params.Contributors ? "&Contributors=" + params.Contributors : "") +
            (params.PropertyOwners ? "&PropertyOwners=" + params.PropertyOwners : "");
        return UsersAPI._send(url, params, queryString);
    },

    CreateUser: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/CreateUser?timeStamp=" + new Date().getTime();
        var queryString = (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.FirstName ? "&FirstName=" + params.FirstName : "") +
            (params.LastName ? "&LastName=" + params.LastName : "");
        return UsersAPI._send(url, params, queryString);
    },

    CreateUserToken: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/CreateUserToken?timeStamp=" + new Date().getTime();
        var queryString = (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.FirstName ? "&FirstName=" + params.FirstName : "") +
            (params.LastName ? "&LastName=" + params.LastName : "") +
            (params.Contact ? "&Contact=" + params.Contact : "") +
            (params.Password ? "&Password=" + params.Password : "") +
            (params.InvitationID ? "&InvitationID=" + params.InvitationID : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "");
        return UsersAPI._send(url, params, queryString);
    },

    ValidateUserCreation: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/ValidateUserCreation?timeStamp=" + new Date().getTime();
        var queryString = (params.VerificationToken ? "&VerificationToken=" + params.VerificationToken : "") +
            (params.Code ? "&Code=" + params.Code : "") +
            (params.Login ? "&Login=" + params.Login : "");
        return UsersAPI._send(url, params, queryString);
    },

    SignInWithGoogle: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SignInWithGoogle?timeStamp=" + new Date().getTime();
        var queryString = (params.GoogleToken ? "&GoogleToken=" + params.GoogleToken : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "") +
            (params.InvitationID ? "&InvitationID=" + params.InvitationID : "") +
            (params.Email ? "&Email=" + params.Email : "") +
            (params.FirstName ? "&FirstName=" + params.FirstName : "") +
            (params.LastName ? "&LastName=" + params.LastName : "") +
            (params.GoogleID ? "&GoogleID=" + params.GoogleID : "") +
            (params.ImageURL ? "&ImageURL=" + params.ImageURL : "");
        return UsersAPI._send(url, params, queryString);
    },

    CreateTemporaryUser: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/CreateTemporaryUser?timeStamp=" + new Date().getTime();
        var queryString = (params.FirstName ? "&FirstName=" + params.FirstName : "") +
            (params.LastName ? "&LastName=" + params.LastName : "") +
            (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.Email ? "&Email=" + params.Email : "") +
            (params.Password ? "&Password=" + params.Password : "") +
            (params.InvitationID ? "&InvitationID=" + params.InvitationID : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "");
        return UsersAPI._send(url, params, queryString);
    },

    ActivateTemporaryUser: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/ActivateTemporaryUser?timeStamp=" + new Date().getTime();
        var queryString = (params.ActivationCode ? "&ActivationCode=" + params.ActivationCode : "");
        return UsersAPI._send(url, params, queryString);
    },

    IsInvited: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/IsInvited?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.Email ? "&Email=" + params.Email : "");
        return UsersAPI._send(url, params, queryString);
    },

    InviteUser: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/InviteUser?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.Email ? "&Email=" + params.Email : "") +
            (params.FullName ? "&FullName=" + params.FullName : "") +
            (params.MessageText ? "&MessageText=" + params.MessageText : "");
        return UsersAPI._send(url, params, queryString);
    },

    BatchInviteUsers: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/BatchInviteUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.Emails ? "&Emails=" + params.Emails : "") +
            (params.MessageText ? "&MessageText=" + params.MessageText : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetInvitedUsersCount: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetInvitedUsersCount?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetUserInvitations: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetUserInvitations?timeStamp=" + new Date().getTime();
        var queryString = (params.ApplicationID ? "&ApplicationID=" + params.ApplicationID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetCurrentInvitations: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetCurrentInvitations?timeStamp=" + new Date().getTime();
        var queryString = "";
        return UsersAPI._send(url, params, queryString);
    },

    SetPasswordResetTicket: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetPasswordResetTicket?timeStamp=" + new Date().getTime();
        var queryString = (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.Password ? "&Password=" + params.Password : "") +
            (params.InvitationID ? "&InvitationID=" + params.InvitationID : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "");
        return UsersAPI._send(url, params, queryString);
    },

    ChangePassword: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/ChangePassword?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.CurrentPassword ? "&CurrentPassword=" + params.CurrentPassword : "") +
            (params.NewPassword ? "&NewPassword=" + params.NewPassword : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "");
        return UsersAPI._send(url, params, queryString);
    },

    ValidatePassword: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/ValidatePassword?timeStamp=" + new Date().getTime();
        var queryString = (params.Password ? "&Password=" + params.Password : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetPassword: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetPassword?timeStamp=" + new Date().getTime();
        var queryString = (params.VerificationToken ? "&VerificationToken=" + params.VerificationToken : "") +
            (params.Code ? "&Code=" + params.Code : "") +
            (params.Login ? "&Login=" + params.Login : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetRandomPassword: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetRandomPassword?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    ModifyEmailTicket: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/ModifyEmailTicket?timeStamp=" + new Date().getTime();
        var queryString = (params.EmailID ? "&EmailID=" + params.EmailID : "") +
            (params.Address ? "&Address=" + params.Address : "") +
            (params.Captcha ? "&Captcha=" + params.Captcha : "");
        return UsersAPI._send(url, params, queryString);
    },

    ModifyEmail: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/ModifyEmail?timeStamp=" + new Date().getTime();
        var queryString = (params.VerificationToken ? "&VerificationToken=" + params.VerificationToken : "") +
            (params.Code ? "&Code=" + params.Code : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetTheme: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetTheme?timeStamp=" + new Date().getTime();
        var queryString = (params.Theme ? "&Theme=" + params.Theme : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetTheme: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetTheme?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    SetVerificationCodeMedia: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetVerificationCodeMedia?timeStamp=" + new Date().getTime();
        var queryString = (params.Media ? "&Media=" + params.Media : "");
        return UsersAPI._send(url, params, queryString);
    },

    SaveUserSettingsItem: function (params) {
        params = params || {};

        var type = GlobalUtilities.get_type(params.Value);

        var url = UsersAPI.ResponseURL + "/SaveUserSettingsItem?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "") + 
            ((type != "undefined") && (type != "null") ? "&Value=" + params.Value : "") +
            ("&Type=" + type);
        console.log(queryString);
        return UsersAPI._send(url, params, queryString);
    },

    UpdateFriendSuggestions: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/UpdateFriendSuggestions?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Full ? "&Full=" + params.Full : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetFriendSuggestions: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetFriendSuggestions?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.MembershipNodeTypeIDs ? "&MembershipNodeTypeIDs=" + params.MembershipNodeTypeIDs : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetFriends: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetFriends?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.FriendIDs ? "&FriendIDs=" + params.FriendIDs : "") +
            (params.MutualsCount ? "&MutualsCount=" + params.MutualsCount : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Online ? "&Online=" + params.Online : "") + "&text=";
        return UsersAPI._send(url, params, queryString);
    },

    GetEmailContactsStatus: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetEmailContactsStatus?timeStamp=" + new Date().getTime();
        var queryString = (params.SaveEmails ? "&SaveEmails=" + params.SaveEmails : "") +
            (params.Emails ? "&Emails=" + params.Emails : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetFriendshipRequests: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetFriendshipRequests?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (GlobalUtilities.get_type(params.Sent) == "boolean" ? "&Sent=" + params.Sent : "") +
            (params.MutualsCount ? "&MutualsCount=" + params.MutualsCount : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return UsersAPI._send(url, params, queryString);
    },

    SendFriendRequest: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SendFriendRequest?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetFriendshipStatus: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetFriendshipStatus?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.OtherUserIDs ? "&OtherUserIDs=" + params.OtherUserIDs : "") +
            (params.MutualsCount ? "&MutualsCount=" + params.MutualsCount : "");
        return UsersAPI._send(url, params, queryString);
    },

    AcceptFriend: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/AcceptFriendship?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&OtherUserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    RejectFriend: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RejectFriendship?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&OtherUserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetFriendRequestsCount: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetFriendRequestsCount?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    GetLastContentCreators: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetLastContentCreators?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "");
        return UsersAPI._send(url, params, queryString);
    },

    AddRemoteServer: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/AddRemoteServer?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "") +
            (params.URL ? "&RemoteURL=" + params.URL : "") +
            (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.Password ? "&Password=" + params.Password : "");
        return UsersAPI._send(url, params, queryString);
    },

    ModifyRemoteServer: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/ModifyRemoteServer?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.URL ? "&RemoteURL=" + params.URL : "") +
            (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.Password ? "&Password=" + params.Password : "");
        return UsersAPI._send(url, params, queryString);
    },

    RemoveRemoteServer: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RemoveRemoteServer?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetRemoteServers: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetRemoteServers?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    // Profile

    SetUserName: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetUserName?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.UserName ? "&UserName=" + params.UserName : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetFirstAndLastName: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetFirstAndLastName?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.FirstName ? "&FirstName=" + params.FirstName : "") +
            (params.LastName ? "&LastName=" + params.LastName : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetFirstName: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetFirstName?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.FirstName ? "&FirstName=" + params.FirstName : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetLastName: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetLastName?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.LastName ? "&LastName=" + params.LastName : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetAboutMe: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetAboutMe?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Text ? "&Text=" + params.Text : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetCity: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetCity?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.City ? "&City=" + params.City : "");
        return UsersAPI._send(url, params, queryString);
    },

    IsApproved: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/IsApproved?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (GlobalUtilities.get_type(params.IsApproved) == "boolean" ? "&IsApproved=" + params.IsApproved : "");
        return UsersAPI._send(url, params, queryString);
    },

    UnlockUser: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/UnlockUser?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetOrganization: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetOrganization?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Organization ? "&Organization=" + params.Organization : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetDepartment: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetDepartment?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Department ? "&Department=" + params.Department : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetJobTitle: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetJobTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.JobTitle ? "&JobTitle=" + params.JobTitle : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetEmploymentTypes: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetEmploymentTypes?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    SetEmploymentType: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetEmploymentType?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.EmploymentType ? "&EmploymentType=" + params.EmploymentType : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetBirthday: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetBirthday?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Birthday ? "&Birthday=" + params.Birthday : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetPhoneNumber: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetPhoneNumber?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.PhoneNumber ? "&PhoneNumber=" + params.PhoneNumber : "") +
            (params.PhoneNumberType ? "&PhoneNumberType=" + params.PhoneNumberType : "");
        return UsersAPI._send(url, params, queryString);
    },

    EditPhoneNumber: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/EditPhoneNumber?timeStamp=" + new Date().getTime();
        var queryString = (params.NumberID ? "&NumberID=" + params.NumberID : "") +
            (params.PhoneNumber ? "&PhoneNumber=" + params.PhoneNumber : "") +
            (params.PhoneNumberType ? "&PhoneNumberType=" + params.PhoneNumberType : "");
        return UsersAPI._send(url, params, queryString);
    },

    RemovePhoneNumber: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RemovePhoneNumber?timeStamp=" + new Date().getTime();
        var queryString = (params.NumberID ? "&NumberID=" + params.NumberID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetMainPhone: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetMainPhone?timeStamp=" + new Date().getTime();
        var queryString = (params.NumberID ? "&NumberID=" + params.NumberID : "") +
            (params.Token ? "&VerificationToken=" + params.Token : "") +
            (params.Code ? "&Code=" + params.Code : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetEmailAddress: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetEmailAddress?timeStamp=" + new Date().getTime();
        var queryString = (params.Address ? "&Address=" + params.Address : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetEmailAddresses: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetEmailAddresses?timeStamp=" + new Date().getTime();
        var queryString = (params.UserName ? "&UserName=" + params.UserName : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    EditEmailAddress: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/EditEmailAddress?timeStamp=" + new Date().getTime();
        var queryString = (params.EmailID ? "&EmailID=" + params.EmailID : "") +
            (params.Address ? "&Address=" + params.Address : "");
        return UsersAPI._send(url, params, queryString);
    },

    RemoveEmailAddress: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RemoveEmailAddress?timeStamp=" + new Date().getTime();
        var queryString = (params.EmailID ? "&EmailID=" + params.EmailID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetMainEmail: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetMainEmail?timeStamp=" + new Date().getTime();
        var queryString = (params.EmailID ? "&EmailID=" + params.EmailID : "") +
            (params.Token ? "&VerificationToken=" + params.Token : "") +
            (params.Code ? "&Code=" + params.Code : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetResumeConstantInfo: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetResumeConstantInfo?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    GetResumeInfo: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetResumeInfo?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return UsersAPI._send(url, params, queryString);
    },

    GetLanguages: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/GetLanguages?timeStamp=" + new Date().getTime();
        return UsersAPI._send(url, params, "");
    },

    SetJobExperience: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetJobExperience?timeStamp=" + new Date().getTime();
        var queryString = (params.JobID ? "&JobID=" + params.JobID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Employer ? "&Employer=" + params.Employer : "") +
            (params.StartDate ? "&StartDate=" + params.StartDate : "") +
            (params.EndDate ? "&EndDate=" + params.EndDate : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetEducationalExperience: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetEducationalExperience?timeStamp=" + new Date().getTime();
        var queryString = (params.EducationID ? "&EducationID=" + params.EducationID : "") +
            (params.School ? "&School=" + params.School : "") +
            (params.StudyField ? "&StudyField=" + params.StudyField : "") +
            (params.Level ? "&Level=" + params.Level : "") +
            (params.StartDate ? "&StartDate=" + params.StartDate : "") +
            (params.EndDate ? "&EndDate=" + params.EndDate : "") +
            (params.GraduateDegree ? "&GraduateDegree=" + params.GraduateDegree : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetInstituteEducationalExperience: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetInstituteEducationalExperience?timeStamp=" + new Date().getTime();
        var queryString = (params.EducationID ? "&EducationID=" + params.EducationID : "") +
            (params.School ? "&School=" + params.School : "") +
            (params.StudyField ? "&StudyField=" + params.StudyField : "") +
            (params.StartDate ? "&StartDate=" + params.StartDate : "") +
            (params.EndDate ? "&EndDate=" + params.EndDate : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetHonorAndAward: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetHonorAndAward?timeStamp=" + new Date().getTime();
        var queryString = (params.HonorID ? "&HonorID=" + params.HonorID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Occupation ? "&Occupation=" + params.Occupation : "") +
            (params.Issuer ? "&Issuer=" + params.Issuer : "") +
            (params.IssueDate ? "&IssueDate=" + params.IssueDate : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return UsersAPI._send(url, params, queryString);
    },

    SetLanguage: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/SetLanguage?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.LanguageName ? "&LanguageName=" + params.LanguageName : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.LanguageLevel ? "&LanguageLevel=" + params.LanguageLevel : "");
        return UsersAPI._send(url, params, queryString);
    },

    RemoveJobExperience: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RemoveJobExperience?timeStamp=" + new Date().getTime();
        var queryString = (params.JobID ? "&JobID=" + params.JobID : "");
        return UsersAPI._send(url, params, queryString);
    },

    RemoveEducationalExperience: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RemoveEducationalExperience?timeStamp=" + new Date().getTime();
        var queryString = (params.EducationID ? "&EducationID=" + params.EducationID : "");
        return UsersAPI._send(url, params, queryString);
    },

    RemoveHonorAndAward: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RemoveHonorAndAward?timeStamp=" + new Date().getTime();
        var queryString = (params.HonorID ? "&HonorID=" + params.HonorID : "");
        return UsersAPI._send(url, params, queryString);
    },

    RemoveLanguage: function (params) {
        params = params || {};

        var url = UsersAPI.ResponseURL + "/RemoveLanguage?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "");
        return UsersAPI._send(url, params, queryString);
    }

    // end of Profile
};