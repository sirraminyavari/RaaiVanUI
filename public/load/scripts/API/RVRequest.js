const _RVRequest = function () {
    this.Objects = {
        AccessToken: null,
        AccessTokenParameterName: "acstkn",
        RemoteServer: {
            BaseURL: null,
            UserName: null,
            Password: null,
            Ticket: null,
            AuthenticationFailed: false
        }
    };
};

_RVRequest.prototype = {
    parse_response: function (responseText, parseResults, remoteSettings) {
        var that = this;

        var hasRemoteServer = that.has_remote_server(remoteSettings);

        try {
            var parsed = JSON.parse("{\"R\":" + responseText + "}").R;

            if (parsed.AccessToken) {
                if (hasRemoteServer) {
                    var remoteTicket = parsed.Ticket || (remoteSettings || {}).Ticket;
                    if (remoteTicket) GlobalUtilities.add_csrf_token(parsed.AccessToken, remoteTicket);
                }
                else
                    GlobalUtilities.add_csrf_token(parsed.AccessToken);
            }

            if (parsed.ResponseIsNotJSON) {
                responseText = Base64.decode(parsed.Response);
                parsed = JSON.parse("{\"R\":" + responseText + "}").R;
            }

            if (parsed.ResetSession) {
                alert(RVDic.MSG.OperationCompletedSuccessfully + ". " + RVDic.MSG.PleaseLoginAgain + "!",
                    { Timeout: 4000 }, () => window.location.href = RVAPI.LoginPageURL());
            }

            parseResults = parseResults || !responseText || (responseText[0] != "{");

            return parseResults ? parsed : responseText;
        } catch (e) { return responseText; }
    },

    check_authenticated: (function () {
        var _div = null;
        var _obj = null;

        return function (responseText, remoteSettings) {
            if ((remoteSettings || {}).BaseURL) return;

            try {
                var j = JSON.parse(responseText);

                if (j.USBTokenNotFound) {
                    var msg = "USB Token Is Not Connected To Device";

                    if (!window.GlobalUtilities) alert(msg);
                    else {
                        var dialogName = "USBTOKENNOTCONNECTEDTODEVIDE";

                        window[dialogName] = window[dialogName] || GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem; text-align:center;", Name: "_div",
                            Childs: [{ Type: "text", TextValue: ((window.RVDic || {}).MSG || {}).USBTokenNotFound || msg }]
                        }])["_div"];

                        GlobalUtilities.show(window[dialogName], { Stick: true });
                    }
                }
                else if (j.NotAuthenticated === true) {
                    window.IsAuthenticated = false;
                    if (window.RVGlobal) window.RVGlobal.IsAuthenticated = false;

                    if (window.GlobalUtilities) {
                        //GlobalUtilities.login_dialog();
                        window.location.href = RVAPI.LoginPageURL();
                    }
                }
                else if (j.NoApplicationFound) {
                    if (!(window.RVGlobal || {}).SAASBasedMultiTenancy)
                        alert(((window.RVDic || {}).MSG || {}).NoApplicationFound || "no application found");
                }
                else if (j.AppID && (window.RVGlobal || {}).ApplicationID && (j.AppID != window.RVGlobal.ApplicationID)) {
                    window.DIFF_TEAM_RESPONSE = window.DIFF_TEAM_RESPONSE || GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0 auto; padding:1rem;", Name: "container",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "font-size:1.2rem; font-weight:500; text-align:center; margin-bottom:1rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.MSG.YouHaveSelectedADifferentTeam }]
                            },
                            {
                                Type: "div", Class: "small-6 medium-6 large-6 rv-circle rv-air-button", Style: "margin:0 auto;",
                                Properties: [{ Name: "onclick", Value: function () { window.location.href = RVAPI.HomePageURL(); } }],
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-home", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    },
                                    { Type: "text", TextValue: RVDic.HomePage }
                                ]
                            }
                        ]
                    }])["container"];

                    if (!GlobalUtilities.is_visible(window.DIFF_TEAM_RESPONSE)) {
                        if ((window.DIFF_TEAM_RESPONSE.Showed || {}).Close) window.DIFF_TEAM_RESPONSE.Showed.Close();

                        window.DIFF_TEAM_RESPONSE.Showed = GlobalUtilities.show(window.DIFF_TEAM_RESPONSE, { Stick: true });
                    }
                }
            } catch (e) { }
        }
    })(),

    set_remote_server: function (remoteSettings, options) {
        var that = this;
        remoteSettings = remoteSettings || {};
        options = options || {};

        if (!that.has_remote_server(remoteSettings)) return;

        that.refine_base_url(remoteSettings);

        that.Objects.RemoteServer.BaseURL = remoteSettings.BaseURL;
        that.Objects.RemoteServer.UserName = remoteSettings.UserName;
        that.Objects.RemoteServer.Password = remoteSettings.Password;
        that.Objects.RemoteServer.Ticket = null;

        if (options.CheckConnection) that.authenticate_with_remote_server(null, function (result) {
            options.CheckConnection(result);
        });
    },

    check_remote_connection: function (settings, callback) {
        var that = this;
        settings = settings || {};
        that.authenticate_with_remote_server(settings, callback);
    },

    remove_remote_server: function () {
        var that = this;
        that.Objects.RemoteServer = {};
    },

    has_remote_server: function (settings) {
        var that = this;
        var rs = settings || {};
        return !!(rs.BaseURL && rs.UserName && rs.Password);
    },

    authenticate_with_remote_server: function (settings, callback) {
        var that = this;
        if (!that.has_remote_server(settings)) return;

        var rs = settings || that.Objects.RemoteServer;

        if (rs.Ticket) return callback(true);
        else if (rs.AuthenticationFailed === true) callback(false);

        var url = window.RVAPI ? RVAPI.RemoteAuthenticationURL() :
            "../../api/Authenticate&timeStamp=" + new Date().getTime();
        var queryString = "UserName=" + rs.UserName + "&Password=" + rs.Password;

        that._send_request("POST", url, queryString, function (data) {
            if (data.Result && (data.Result.toLowerCase() == "ok") && data.Ticket) {
                rs.Ticket = data.Ticket;
                callback(true);
            }
            else {
                console.log(GlobalUtilities.extend({ Response: data }, settings, { Password: "****" }));

                rs.AuthenticationFailed = true;
                callback(false);
            }
        }, true, null, rs);
    },

    is_data_request: function (url) {
        var that = this;
        return (url.toLowerCase().indexOf("/api/") >= 0) || (url.toLowerCase().indexOf("/upload/") >= 0) ||
            (url.toLowerCase().indexOf("/download/") >= 0) || (url.toLowerCase().indexOf("/rss") >= 0);
    },

    refine_base_url: function (remoteSettings) {
        var that = this;
        if (!(remoteSettings || {}).BaseURL) return;
        var baseUrl = remoteSettings.BaseURL.toLowerCase();
        if (baseUrl[baseUrl.length - 1] == '/') baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        if (!baseUrl.startsWith("http")) baseUrl = "http://" + baseUrl;
        remoteSettings.BaseURL = baseUrl;
    },

    refine_url: function (url, settings) {
        var that = this;
        var rs = that.is_data_request(url) ? settings : null;
        return !rs || !that.has_remote_server(rs) ? url : url.replace("../..", rs.BaseURL);
    },

    refine_query_string: function (queryString, settings) {
        var that = this;

        var rs = settings || {};
        var hasRemoteServer = that.has_remote_server(rs);
        var remoteTicket = rs.Ticket;

        var data = { RefreshAccessToken: "true" };

        var atkn = hasRemoteServer ? GlobalUtilities.get_csrf_token(remoteTicket) :
            GlobalUtilities.get_csrf_token() || that.Objects.AccessToken;
        
        var atknParamName = (window.GlobalUtilities || {}).AccessTokenParameterName || that.Objects.AccessTokenParameterName;

        if (atkn && atknParamName) data[atknParamName] = atkn;

        if (hasRemoteServer && remoteTicket) data["Ticket"] = remoteTicket;

        if (queryString) jQuery.each(queryString.split("&"), function (ind, val) {
            var eq = val.indexOf("=");
            if ((eq <= 0) || (eq == val.length - 1)) return;
            data[val.substr(0, eq)] = val.substr(eq + 1);
        });

        return data;
    },

    send_request: function (method, url, queryString, responseHandler, parseResults, options, remoteSettings) {
        var that = this;

        responseHandler = responseHandler || function () { };
        remoteSettings = remoteSettings || that.Objects.RemoteServer;

        var _do = function () {
            that._send_request(method, url, queryString, responseHandler, parseResults, options, remoteSettings);
        };

        var isPostRequest = method.toLowerCase() == "post";

        if (!(options || {}).IsLocalRequest && isPostRequest && that.has_remote_server(remoteSettings)) {
            that.authenticate_with_remote_server(remoteSettings, function (succeed) {
                if (!succeed) responseHandler({ AuthenticationFailed: true });
                else _do();
            });
        }
        else _do();
    },

    _send_request: function (method, url, queryString, responseHandler, parseResults, options, remoteSettings) {
        var that = this;
        options = options || {};

        var isPostRequest = method.toLowerCase() == "post";
        var isLocalRequest = !!options.IsLocalRequest;

        url = isPostRequest || !isLocalRequest ? that.refine_url(url, remoteSettings) : url;
        if (!that.is_data_request(url)) remoteSettings = null;
        var requestParams = isPostRequest && that.is_data_request(url) ?
            that.refine_query_string(queryString, isLocalRequest ? null : remoteSettings) : null;
        
        if (!isLocalRequest && (remoteSettings || {}).BaseURL && (window.RVAPI || {}).WebRequest) {
            return RVAPI.WebRequest({
                URL: url, Data: requestParams, ParseResults: false,
                RequestOptions: { IsLocalRequest: true },
                ResponseHandler: function (res) {
                    res = Base64.decode(res);
                    responseHandler(that.parse_response(res, parseResults, remoteSettings));
                }
            });
        }
        
        jQuery.ajax({
            crossDomain: true,
            cache: false,
            dataType: "text",
            method: method,
            timeout: options.Timeout ? options.Timeout : 0,
            url: url,
            data: requestParams,
            error: function (jqXHR, status, error) {
                var isTimeOut = (status == "timeout");
                var isError = (status == "error");

                if (isTimeOut && options.OnTimeout) options.OnTimeout(status, error);
                else if ((isError || isTimeOut) && options.OnError) options.OnError(status, error);
                else if (responseHandler) {
                    //responseHandler({ ErrorText: isTimeOut ? "RequestTimedOut" : "NetworkError" });

                    if (!isTimeOut) {
                        console.error(status);
                        console.error({ message: error, url: url, data: requestParams });
                    }
                }
            },
            success: function (responseText) {
                that.check_authenticated(responseText, remoteSettings);
                if (responseHandler) responseHandler(that.parse_response(responseText, parseResults, remoteSettings));
            }
        });
    },

    post_request: function (url, queryString, responseHandler, options, parseResults) {
        var that = this;
        var x = setInterval(function () {
            if (!window.RVGlobal || !(GlobalUtilities || {}).AccessTokenParameterName) return;
            clearInterval(x);
            that.send_request("POST", url, queryString, responseHandler, parseResults, options);
        }, 50);
    },

    get_request: function (url, responseHandler, options, parseResults) {
        var that = this;

        var x = setInterval(function () {
            if (!window.RVGlobal || !(GlobalUtilities || {}).AccessTokenParameterName) return;
            clearInterval(x);
            that.send_request("GET", url, null, responseHandler, parseResults, options);
        }, 50);
    }
};

const RVRequest = new _RVRequest();

RVRequest.new = function () { return new _RVRequest(); };
    
send_post_request = function (url, queryString, responseHandler, responseParams,
    failureHandler, failureParams, parseResults, options) {
    ((options || {}).RequestHandler || RVRequest).post_request(url, queryString, responseHandler, options, parseResults);
};

send_get_request = function (url, responseHandler, responseParams,
    failureHandler, failureParams, parseResults, options) {
    ((options || {}).RequestHandler || RVRequest).get_request(url, responseHandler, options, parseResults);
};

window.RVRequest = RVRequest;