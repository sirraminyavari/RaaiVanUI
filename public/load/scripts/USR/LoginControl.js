(function () {
    if (window.LoginControl) return;

    var INPUT_BG_COLOR = (window.RVGlobal || {}).SAASBasedMultiTenancy ? "rgba(216,216,216,1)" : "rgba(84,89,95,0.82)";

    var stl = document.createElement("style");
    stl.setAttribute("type", "text/css");
    stl.innerHTML = ".login-input:-webkit-autofill, .login-input:-webkit-autofill:hover, .login-input:-webkit-autofill:focus { -webkit-text-fill-color: white; -webkit-box-shadow: 0 0 0px 1000px " + INPUT_BG_COLOR + " inset; transition: background-color 5000s ease-in-out 0s; }";
    document.head.appendChild(stl);

    window.LoginControl = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            UserName: null,
            Password: null,
            Captcha: null
        };

        this.Objects = {
            IsInvited: false,
            Captcha: null,
            InvitationID: GlobalUtilities.request_params().get_value("inv")
        };

        this.Options = {
            UseCaptcha: params.UseCaptcha,
            Title: params.Title,
            ContainerClass: params.ContainerClass === false ? null :
                (params.ContainerClass || "BorderRadius4 SoftBorder SoftBackgroundColor NormalPadding"),
            OnLogin: params.OnLogin,
            ReloadAfterLogin: !(params.ReloadAfterLogin === false),
            ReturnURL: params.ReturnURL,
            IgnoreSSO: params.IgnoreSSO,
            InitialFocus: params.InitialFocus !== false
        };

        var that = this;

        var files = [{ Root: "API/", Ext: "js", Childs: ["RVAPI", "UsersAPI"] }];
        if (that.Options.UseCaptcha) files.push("CaptchaImage.js");

        GlobalUtilities.load_files(files, { OnLoad: function () { that._preinit(); } });
    }

    LoginControl.prototype = {
        _preinit: function () {
            var that = this;

            var reqParams = GlobalUtilities.request_params();

            var activationCode = reqParams.get_value("ac");
            var userName = reqParams.get_value("un");
            var passwordTicket = reqParams.get_value("pt");

            if (activationCode) {
                UsersAPI.ActivateTemporaryUser({
                    ActivationCode: activationCode, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Succeed) alert(RVDic.MSG[result.Succeed] || result.Succeed, { Timeout: 30000 });
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        that._initialize();
                    }
                });
            }
            else if (passwordTicket) {
                that.show_reset_password_form(passwordTicket, userName);
                that._initialize();
            }
            else that._initialize();
        },

        _initialize: function () {
            var that = this;

            RVAPI.GetDomains({
                ParseResults: true,
                ResponseHandler: function (r) {
                    for (var i = 0, lnt = (r.Domains || []).length; i < lnt; ++i) {
                        r.Domains[i].Value = Base64.decode(r.Domains[i].Value);
                        r.Domains[i].Text = Base64.decode(r.Domains[i].Text);
                    }

                    that.initialize(r.Domains || []);
                }
            });
        },

        initialize: function (domains) {
            var that = this;
            domains = domains || [];

            var isInvited = that.Objects.IsInvited;

            var signupable = (window.RVGlobal.Modules.UserSignUp === true) || (window.RVGlobal.Modules.SignUpViaInvitation === true);
            var enableSignUp = (window.RVGlobal.Modules.UserSignUp === true) || (window.RVGlobal.Modules.SignUpViaInvitation && isInvited);
            var enableForgotPassword = signupable || (window.RVGlobal.Modules.EmailVerificationCode === true) ||
                (window.RVGlobal.Modules.SMSVerificationCode === true);
            
            var userNameInnerTitle = ((window.RVDic || {}).UserName || "UserName") + "...";
            var passwordInnerTitle = ((window.RVDic || {}).Password || "Password") + "...";

            that.ContainerDiv.innerHTML = "";

            var hasMultipleDomains = domains.length > 1;

            var domainOptions = [];

            if (domains.length > 0)
                domainOptions.push({ Type: "option", Childs: [{ Type: "text", TextValue: RVDic.DomainSelect + "..." }] });

            for (var i = 0, lnt = domains.length; i < lnt; ++i) {
                domainOptions.push({
                    Type: "option",
                    Attributes: [{ Name: "title", Value: domains[i].Value }],
                    Childs: [{ Type: "text", TextValue: domains[i].Text }]
                });
            }
            
            var ssoUrl = that.Options.IgnoreSSO ? "" : Base64.decode((window.RVGlobal || {}).SSOLoginURL);
            var isSaaS = RVGlobal.SAASBasedMultiTenancy;

            var buttonClass = isSaaS ? "rv-air-button-warm-blue" : "rv-air-button-green";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; margin-bottom:1rem;",
                    Childs: [{
                        Type: "img", Style: "max-width:50%; max-height:160px;",
                        Attributes: [{ Name: "src", Value: isSaaS ? RVGlobal.LogoURL : RVGlobal.LogoMiniURL }]
                    }]
                },
                (!(window.RVGlobal || {}).SystemTitle || isSaaS ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-text-shadow",
                    Style: "text-align:center; color:white; font-size:1.4rem; font-weight:500;",
                    Childs: [{ Type: "text", TextValue: Base64.decode(window.RVGlobal.SystemTitle) }]
                }),
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container",
                    Style: "margin:1.5rem 0 0 0;",
                    Childs: [
                        (!that.Options.Title ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; text-align:center; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: that.Options.Title }]
                        }),
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; margin-bottom:1rem;" +
                                        (hasMultipleDomains ? "" : "display:none;"),
                                    Childs: [{
                                        Type: "select", Class: "rv-input", Name: "domainSelect",
                                        Style: "width:100%; height:3rem; color:white; border-width:0; background-color:" + INPUT_BG_COLOR + ";",
                                        Childs: domainOptions
                                    }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [
                                        { Name: "usernameInput", Placeholder: RVDic.UserName, MarginBottom: 1 },
                                        { Name: "passwordInput", Placeholder: RVDic.Password, Type: "password" }
                                    ].map(btn => {
                                        return {
                                            Type: "animated_input", Name: btn.Name,
                                            Style: (btn.MarginBottom ? "margin-bottom:" + btn.MarginBottom + "rem;" : ""),
                                            Params: {
                                                Type: btn.Type,
                                                Placeholder: btn.Placeholder,
                                                BackgroundColor: INPUT_BG_COLOR,
                                                Class: "login-input",
                                                Style: "border-width:0; height:3.5rem; color:" + (isSaaS ? "black" : "white") + ";",
                                                PlaceholderStyle: {
                                                    BackgroundColor: { Active: "transparent" },
                                                    Color: isSaaS ? { Default: "rgb(150,150,150)", Active: "rgb(100,100,100)" } :
                                                        { Default: "rgb(200,200,200)", Active: "white" },
                                                    FontSize: { Default: "1.2rem", Active: "0.9rem" }
                                                }
                                            }
                                        };
                                    })
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "captcha", Style: "margin-top:1rem; display:none;" },
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 row " + (!ssoUrl ? "" : "rv-border-radius-1"),
                            Style: "margin:1rem 0 0.5rem 0; overflow:hidden; height:3rem; font-size:1.2rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "margin:0 auto; height:100%;",
                                    Class: (!ssoUrl ? "small-12 medium-12 large-12" : "small-6 medium-6 large-6"),
                                    Childs: [
                                        {
                                            Type: "div", Name: "loginButton",
                                            Class: "small-12 medium-12 large-12 " +
                                                (ssoUrl ? "rv-air-button-base rv-air-button-black" :
                                                    "rv-border-radius-quarter rv-air-button-base " + buttonClass),
                                            Style: "padding:0.4rem; color:white; height:100%;" +
                                                "display:flex; align-items:center; justify-content:center;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Login }]
                                        }
                                    ]
                                },
                                (!ssoUrl ? null : {
                                    Type: "div", Class: "small-6 medium-6 large-6", Style: "text-align-center; height:100%;",
                                    Childs: [
                                        {
                                            Type: "div", Name: "ssoLoginButton",
                                            Class: "small-12 medium-12 large-12 rv-air-button-base " + buttonClass,
                                            Style: "padding:0.4rem; height:100%; color:white;" +
                                                "display:flex; align-items:center; justify-content:center;",
                                            Properties: [{ Name: "onclick", Value: function () { window.location.href = ssoUrl; } }],
                                            Childs: [{ Type: "text", TextValue: Base64.decode((window.RVGlobal || {}).SSOLoginTitle) || RVDic.LoginWithSSOServer }]
                                        }
                                    ]
                                })
                            ]
                        },
                        (!(window.RVGlobal || {}).GoogleSignInClientID || !(window.RVGlobal || {}).IsDev ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "loginWithGoogle", Style: "margin-top:0.5rem;"
                        }),
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; font-size:0.8rem;",
                            Childs: [
                                {
                                    Type: "div", Name: "_signupArea", Class: "small-12 medium-5 large-5 SoftTextShadow",
                                    Style: "margin:1rem auto 0 auto; cursor:pointer; text-align:center;" +
                                        (isSaaS ? "" : "color:white;") + (enableSignUp ? "" : "display:none;"),
                                    Properties: [{ Name: "onclick", Value: function () { that.show_signup_form(); } }],
                                    Childs: [{ Type: "text", TextValue: (window.RVDic || {}).SignUp || "SignUp" }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-2 large-2",
                                    Style: (!enableSignUp || !signupable ? "display:none;" : "")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-5 large-5 SoftTextShadow",
                                    Style: "margin:1rem auto 0 auto; cursor:pointer; text-align:center;" +
                                        (isSaaS ? "" : "color:white;") + (enableForgotPassword ? "" : "display:none;"),
                                    Properties: [{ Name: "onclick", Value: function () { that.show_forget_password_form(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.ForgotMyPassword }]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.UserName = elems["usernameInput"].Input;
            that.Interface.Password = elems["passwordInput"].Input;
            that.Interface.Captcha = elems["captcha"];

            if (elems["loginWithGoogle"]) {
                GlobalUtilities.append_google_login_button(elems["loginWithGoogle"], {
                    InvitationID: that.Objects.InvitationID
                });
            }

            if (that.Options.UseCaptcha) {
                that.Objects.Captcha = new CaptchaImage(that.Interface.Captcha, {
                    OnEnter: function () { that.try_login(); }
                });
            }

            if (!enableSignUp) elems["_signupArea"].parentNode.removeChild(elems["_signupArea"]);

            jQuery(that.Interface.Password).keydown(function (e) { e.stopImmediatePropagation(); });

            var domainSelect = elems["domainSelect"];

            var _do = function () {
                if (window.IsAuthenticated) return;

                var _domain = domains.length > 0 ? domainSelect[domains.length == 1 ? 1 : domainSelect.selectedIndex].title : null;
                var username = GlobalUtilities.trim(that.Interface.UserName.value);
                var password = that.Interface.Password.value;

                if (username == userNameInnerTitle) username = "";
                if (password == passwordInnerTitle) password = "";

                var isAdmin = String(username).toLowerCase() == "admin";
                if (isAdmin) _domain = "";

                var captchaValue = that.Objects.Captcha ? that.Objects.Captcha.get() : null;

                /* if (!isAdmin && (domains.length > 0) && !_domain) return RVDic.Checks.PleaseSelectYourDomain;
                else */ if (!username) return RVDic.Checks.PleaseEnterYourUserName;
                else if (!password) return RVDic.Checks.PleaseEnterYourPassword;
                else if (that.Objects.Captcha && !captchaValue) return RVDic.Checks.PleaseEnterTheCaptcha;

                if (that.__Processing) return;
                that.__Processing = true;

                GlobalUtilities.block(elems["loginButton"]);

                RVAPI.Login({
                    UserName: Base64.encode(username),
                    Password: Base64.encode(password),
                    DomainName: Base64.encode(_domain),
                    Captcha: that.Objects.Captcha ? Base64.encode(captchaValue) : null,
                    InvitationID: that.Objects.InvitationID,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            if (result.ErrorText.TwoStepAuthentication)
                                setTimeout(function () { that.step_two(result.ErrorText.Data || {}); }, 0);
                            else {
                                var needsCaptcha = (username.toLowerCase() == "admin") &&
                                    result.RemainingLockoutTime && !that.Options.UseCaptcha;

                                var err = (RVDic.MSG[result.ErrorText] || result.ErrorText)
                                    .replace("[n]", result.RemainingLockoutTime || " ");

                                if (needsCaptcha) {
                                    err = RVDic.Checks.PleaseEnterTheCaptcha;
                                    that.init_captcha();
                                }

                                alert(err, null, function () { that.clear(); });
                            }
                        }
                        else if (result.Succeed) that.logged_in(result);

                        GlobalUtilities.unblock(elems["loginButton"]);

                        that.__Processing = false;
                    }
                });
            }

            var _onEnter = that.try_login = function () {
                var msg = _do();
                if (msg) alert(msg, null, function () { /*that.clear();*/ });
            };

            GlobalUtilities.set_onenter(that.Interface.UserName, _onEnter);
            GlobalUtilities.set_onenter(that.Interface.Password, _onEnter);
            elems["loginButton"].onclick = _onEnter;

            //if (that.Options.InitialFocus) jQuery(that.Interface.UserName).focus(); //.select();

            if (isInvited) that.show_signup_form();
        },

        try_login: function () { }, //will be implemented in initialize function

        init_captcha: function () {
            var that = this;

            if (that.Options.UseCaptcha || that.Objects.Captcha) return;
            that.Options.UseCaptcha = true;

            GlobalUtilities.load_files(["CaptchaImage.js"], {
                OnLoad: function () {
                    jQuery(that.Interface.Captcha).fadeIn(500);

                    that.Objects.Captcha = new CaptchaImage(that.Interface.Captcha, {
                        OnEnter: function () { that.try_login(); }
                    });
                }
            });
        },

        step_two: function (data) {
            var that = this;

            var vcd = GlobalUtilities.verification_code_dialog(data, {
                Message: RVDic.MSG.AnAuthenticationCodeHasBeenSentToYourNWithValueM,
                HideCancelButton: true,
                Callback: function (d, done) {
                    if (!d) return;

                    RVAPI.LoginStepTwo({
                        Token: d.Token, Code: d.Code, InvitationID: that.Objects.InvitationID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText, null, function () {
                                    that.clear();
                                    done(false);
                                    if (result.CodeDisposed) vcd.Close();
                                });
                            }
                            else if (result.Succeed) {
                                done(true);
                                that.logged_in(result);
                            }
                        }
                    });
                }
            });
        },

        clear: function () {
            var that = this;

            if (that.Objects.Captcha) that.Objects.Captcha.reset();

            that.Interface.UserName.value = "";
            that.Interface.Password.value = "";
            jQuery(that.Interface.UserName).focus()
            //jQuery(that.Interface.UserName).select();
        },

        logged_in: function (data) {
            var that = this;

            GlobalUtilities.logged_in(data);

            that.on_login(data, function () {
                window.location.href = that.Options.ReturnURL || window.location.href;
            });

            if (that.Options.OnLogin) that.Options.OnLogin(data);
        },

        on_login: function (result, callback) {
            var that = this;
            result = result || {};

            var msg = result.LoginMessage ? Base64.decode(result.LoginMessage) : null;

            if (that.Options.ReloadAfterLogin) {
                msg = (msg || RVDic.MSG.LoggedInSuccessfully) + ". " + RVDic.Confirms.DoYouWantToRefreshThePage;
                GlobalUtilities.confirm(msg, function (r) { if (r) callback(); });
            }
            else {
                if ((result.LastLogins || []).length > 0) that.show_last_logins(msg, result.LastLogins, callback);
                else if (msg) alert(msg, { Timeout: 10000 }, callback);
                else callback();
            }

            RVAPI.SetSession({ SessionName: "ShowMessages", Value: true.toString(), ResponseHandler: function () { } });
        },

        show_last_logins: function (loginMessage, lastLogins, callback) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Class: "small-10 medium-8 large-6 row align-center rv-border-radius-1 SoftBackgroundColor",
                    Childs: [
                        (!loginMessage ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:500; font-size:1rem; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: loginMessage }]
                        }),
                        (!(lastLogins || []).length ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; color:gray; font-weight:bold; margin-bottom:0.6rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.LastLogins }]
                        }),
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea",
                            Style: ((lastLogins || []).length ? "" : "display:none;")
                        },
                        {
                            Type: "div", Class: "small-6 medium-5 large-4 rv-air-button rv-circle",
                            Style: "margin-top:1.5rem;",
                            Properties: [{ Name: "onclick", Value: function () { showed.Close(); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.GotIt }]
                        }
                    ]
                }
            ]);

            var showed = GlobalUtilities.show(elems["container"], { OnClose: function () { callback(); } });

            var _add_item = function (itm) {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "margin:0.3rem 0rem; padding:0.5rem;", Name: "_div",
                        Class: "rv-border-radius-quarter SoftShadow " +
                            (itm.Action == "Login" ? "rv-bg-color-white-softer" : "rv-bg-color-softer-soft")
                    }
                ], elems["itemsArea"])["_div"];

                _div.innerHTML = "<span style='font-weight:bold; margin:0rem 0.3rem;'>" +
                    (itm.Action == "Login" ? RVDic.Login : RVDic.FailedLogin) +
                    "</span>" + RVDic.OnDate + " '" + itm.Date + "' " + RVDic.FromAddress + " '" +
                    itm.HostAddress + "'";
            };

            for (var i = 0, lnt = (lastLogins || []).length; i < lnt; ++i) _add_item(lastLogins[i]);
        },

        show_signup_form: function (container) {
            var that = this;

            if (that.__ProcessingUserSignUpForm) return;
            that.__ProcessingUserSignUpForm = true;

            GlobalUtilities.load_files(["USR/UserSignUp.js"], {
                OnLoad: function () {
                    var x = new UserSignUp();
                    that.__ProcessingUserSignUpForm = false;
                }
            });
        },

        show_forget_password_form: function () {
            var that = this;

            var isSaaS = RVGlobal.SAASBasedMultiTenancy;

            var dlg = that.SHOWED_PASS_RESET_DIALOG = that.SHOWED_PASS_RESET_DIALOG || { Container: null, Showed: null };

            if (dlg.Container) {
                dlg.Showed = GlobalUtilities.show(dlg.Container);
                return;
            }

            var _div = dlg.Container = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-6 large-4 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }])["_div"];

            GlobalUtilities.loading(_div);
            dlg.Showed = GlobalUtilities.show(_div);

            GlobalUtilities.load_files([
                "USR/ChangePasswordDialog.js",
                isSaaS ? null : "CaptchaImage.js"
            ], {
                OnLoad: function () {
                    UsersAPI.GetPasswordPolicy({
                        ParseResults: true,
                        ResponseHandler: function (passwordPolicy) {
                            _div.innerHTML = "";

                            that._show_forget_password_form(_div, passwordPolicy, () => {
                                dlg.Showed.Close();
                            });
                        }
                    });
                }
            });
        },

        _show_forget_password_form: function (container, passwordPolicy, close) {
            var that = this;

            var isSaaS = RVGlobal.SAASBasedMultiTenancy;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "font-weight:bold; text-align:center;",
                    Childs: [{ Type: "text", TextValue: window.RVDic["ResendPassword"] || "ResendPassword" }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [{
                        Type: "input", Class: "rv-input", Style: "width:100%;", Name: "userNameInput",
                        InnerTitle: isSaaS ? RVDic.UserNameOrEmail : RVDic.UserName,
                        Attributes: [{ Name: "autocomplete", Value: "off" }]
                    }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [{
                        Type: "input", Name: "passwordInput", Class: "rv-input", Style: "width:100%;", InnerTitle: RVDic.NewPassword,
                        Attributes: [
                            { Name: "type", Value: "password" },
                            { Name: "autocomplete", Value: "off" }
                        ]
                    }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "policyContainer",
                    Style: "margin:0.5rem 0 0 0; display:none;",
                    Childs: [{ Type: "div", Name: "passPolicy", Style: "padding-" + RV_Float + ":0.5rem;" }]
                },
                (isSaaS ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-top:1rem;", Name: "captcha"
                }),
                {
                    Type: "div", Name: "sendButton",
                    Class: "small-10 medium-8 large-6 ActionButton",
                    Style: "margin:1rem auto 0rem auto; font-weight:bold;",
                    Properties: [{ Name: "onclick", Value: function () { sendTicket(); } }],
                    Childs: [{ Type: "text", TextValue: RVDic.GetConfirmationCode }]
                }
            ], container);

            var sendButton = elems["sendButton"];
            var userNameInput = elems["userNameInput"];
            var passwordInput = elems["passwordInput"];

            GlobalUtilities.necessary_input({ Input: userNameInput });

            //Check Password Policy
            var policyChecker = (new ChangePasswordDialog()).password_policy_checker(elems["passPolicy"], passwordPolicy, true);

            jQuery(passwordInput).focus(function () {
                if (elems["policyContainer"].style.display == "none")
                    jQuery(elems["policyContainer"]).animate({ 'height': 'toggle' }, 500);
            });

            jQuery(passwordInput).focusout(function () {
                if (elems["policyContainer"].style.display != "none")
                    jQuery(elems["policyContainer"]).animate({ 'height': 'toggle' }, 500);
            });

            jQuery(passwordInput).keyup(function () {
                var val = passwordInput.value;
                var isValid = policyChecker.check(val);

                passwordInput.classList[isValid ? "remove" : "add"]("rv-input-invalid");
            });
            //end of Check Password Policy

            var captchaObj = null;

            if (elems["captcha"]) {
                captchaObj = new CaptchaImage(elems["captcha"], {
                    OnEnter: () => jQuery(elems["sendButton"]).click()
                });
            }

            var sendTicket = function () {
                var username = GlobalUtilities.trim(userNameInput.value);
                var password = GlobalUtilities.trim(passwordInput.value);

                var captchaValue = captchaObj ? captchaObj.get() : null;

                if (!username) return alert(RVDic.Checks.PleaseEnterYourUserName);
                else {
                    GlobalUtilities.block(sendButton);

                    that.send_pass_reset_request(username, password, (succeed) => {
                        GlobalUtilities.unblock(sendButton);
                        if (succeed) close();
                    }, captchaValue);
                }
            };
        },

        send_pass_reset_request: function (username, password, callback, captchaValue) {
            var that = this;

            var isSaaS = RVGlobal.SAASBasedMultiTenancy;

            var succeed = false;

            var _do = (token) => {
                UsersAPI.SetPasswordResetTicket({
                    UserName: Base64.encode(GlobalUtilities.secure_string(username)),
                    Password: Base64.encode(GlobalUtilities.secure_string(password)),
                    InvitationID: that.Options.InvitationID,
                    Captcha: token,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.VerificationCode) {
                            succeed = true;
                            that.show_reset_password_form(result.VerificationCode);
                        }
                        else if (result.Email && result.Phone) {
                            that.pass_reset_contact_select(result, (contact) => {
                                if (!contact) callback(false);
                                else that.send_pass_reset_request(contact, password, callback);
                            });
                        }

                        callback(succeed);
                    }
                });
            };

            if (isSaaS) {
                GlobalUtilities.init_recaptcha(function (captcha) {
                    captcha.getToken(token => _do(token));
                });
            }
            else _do(captchaValue);
        },

        pass_reset_contact_select: function (data, callback) {
            var that = this;

            //implement later
            callback();
        },

        show_reset_password_form: function (verificationCode) {
            var that = this;

            var vcd = GlobalUtilities.verification_code_dialog(verificationCode, {
                Message: RVDic.MSG.AnAuthenticationCodeHasBeenSentToYourNWithValueM,
                HideCancelButton: true,
                Callback: function (d, done) {
                    if (!d) return;
                    
                    UsersAPI.SetPassword({
                        VerificationToken: d.Token, Code: d.Code, Login: true, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText, null, function () {
                                    that.clear();
                                    done(false);
                                    if (result.CodeDisposed) vcd.Close();
                                });
                            }
                            else if (result.Succeed) {
                                GlobalUtilities.logged_in(result);
                                window.location.href = window.location.href;
                                done(true);
                            }
                        }
                    });
                }
            });
        }
    }
})();