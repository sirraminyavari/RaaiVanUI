(function () {
    if (window.LoginPageInitializer) return;

    window.LoginPageInitializer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        var that = this;

        GlobalUtilities.load_files(["USR/LoginControl.js"], {
            OnLoad: function () { that.initialize(params); }
        });
    };

    LoginPageInitializer.prototype = {
        initialize: function (initialJson) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "mainContent",
                    Style: "background-repeat:no-repeat; background-attachment:fixed; background-position:center;" +
                        "background-size:cover; height:100vh; display:flex; flex-flow:column; align-items:center;" +
                        "justify-content:center; position:relative;",
                    Childs: [
                        {
                            Type: "div", Style: "width:100%;",
                            Childs: [{
                                Type: "div", Class: "small-12 medium-8 large-6 rv-border-radius-1", Name: "loginContainer",
                                Style: "padding:1rem 5rem; background-color:rgba(0,0,0,0.7); margin:0 auto;",
                                Childs: [{ Type: "div", Class: "small-12 medium-12 large-12", Name: "loginArea" }]
                            }]
                        },
                        {
                            Type: "div", Style: "position:absolute; bottom:0.5rem; left:0; right:0; text-align:center;",
                            Childs: [{
                                Type: "div", Class: "rv-air-button-base rv-air-button-white rv-circle", Name: "pageDownButton",
                                Style: "display:inline-flex; align-items:center; justify-content:center; width:3rem; height:3rem;",
                                Childs: [{
                                    Type: "i", Class: "fa fa-chevron-down fa-2x",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }]
                            }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center", Name: "statisticsArea",
                    Style: "margin:0rem; padding:0vw 4vw; min-height:100vh; position:relative;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; padding-top:0.5rem; height:4rem;",
                            Childs: [{
                                Type: "div", Class: "rv-air-button-base rv-air-button-black rv-circle", Name: "pageUpButton",
                                Style: "display:inline-flex; align-items:center; justify-content:center; width:3rem; height:3rem;",
                                Childs: [{
                                    Type: "i", Class: "fa fa-chevron-up fa-2x", Style: "margin-bottom:0.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }]
                            }]
                        },
                        { Type: "div", Name: "loginPageContent", Style: "min-height:calc(100vh - 4rem); width:100%;" }
                    ]
                }
            ], that.Container);

            var ind = GlobalUtilities.random(6, 28);
            var bgUrl = GlobalUtilities.icon("background/RV-BG-" + (ind < 10 ? "0" : "") + ind + ".jpg");
            elems["mainContent"].style.backgroundImage = "url(" + bgUrl + ")";

            var firstPage = elems["mainContent"];
            var secondPage = elems["loginPageContent"];

            elems["pageDownButton"].onclick = function () {
                GlobalUtilities.scroll_into_view(secondPage, { Offset: 0 });
            };

            elems["pageUpButton"].onclick = function () {
                GlobalUtilities.scroll_into_view(firstPage, { Offset: 0 });
            };

            if (initialJson.LoggedIn) {
                var msg = initialJson.LoginMessage ? Base64.decode(initialJson.LoginMessage) : null;

                GlobalUtilities.set_auth_cookie(initialJson.AuthCookie);

                if (msg || ((initialJson.LastLogins || []).length > 0))
                    (new LoginControl()).show_last_logins(msg, initialJson.LastLogins, function () { window.location.href = "../../home"; });
                else window.location.href = "../../home";

                return;
            }

            if (RVGlobal.SysID) {
                var sysElems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10, medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; font-size:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.MSG.InvalidSystemIDMessage }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; margin-top:1rem;",
                            Childs: [{
                                Type: "div", Class: "rv-border-radius-half WarmTextShadow", Name: "sysId",
                                Style: "display:inline-block; font-size:1rem; padding:0.5rem; background-color:white; color:rgb(80,80,80);"
                            }]
                        },
                        {
                            Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle", Style: "margin:1rem auto 0 auto;",
                            Properties: [{ Name: "onclick", Value: function () { sysShowed.Close(); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.GotIt + "!" }]
                        }
                    ]
                }]);

                sysElems["sysId"].innerHTML = RVGlobal.SysID;

                var sysShowed = GlobalUtilities.show(sysElems["container"]);
            }

            var loginPageModel = initialJson.LoginPageModel;

            if (loginPageModel) {
                var _jsFileName = "lp_" + loginPageModel;
                var statistics = initialJson[loginPageModel];

                if (statistics) {
                    GlobalUtilities.load_files(["LoginPage/" + _jsFileName + ".js"], {
                        OnLoad: function () { new window[_jsFileName](elems["loginPageContent"], statistics); }
                    });
                }
                else {
                    jQuery(elems["pageDownButton"]).fadeOut(0);
                    jQuery(elems["statisticsArea"]).fadeOut(0);
                }
            }

            elems["loginContainer"].style.backgroundColor =
                RVGlobal.SAASBasedMultiTenancy ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";

            new LoginControl(elems["loginArea"], {
                ReloadAfterLogin: false, ContainerClass: false, IgnoreSSO: false, InitialFocus: false,
                ReturnURL: initialJson.ReturnURL ? Base64.decode(initialJson.ReturnURL) : null,
                OnLogin: function (d) { }
            });
        }
    };
})();