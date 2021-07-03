(function () {
    if (window.UserSettings) return;

    window.UserSettings = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js"], { OnLoad: function () { that._initialize(); } });
    };

    UserSettings.prototype = {
        _initialize: function () {
            var that = this;

            var modules = (window.RVGlobal || {}).Modules || {};

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-title",
                    Childs: [{ Type: "text", TextValue: RVDic.PersonalSettings }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                    Childs: [
                        {
                            Type: "div", Name: "themeArea", Style: "margin-bottom:0.5rem;",
                            Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                            Properties: [{ Name: "onclick", Value: function () { that.select_theme(elems["themeArea"]); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.ThemeSelect }]
                        },
                        {
                            Type: "div", Name: "changePassword", Style: "margin-bottom:0.5rem;",
                            Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                            Properties: [{ Name: "onclick", Value: function () { that.change_password(); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.ChangePassword }]
                        },
                        (!modules.SMSEMailNotifier ? null : {
                            Type: "div", Name: "notificationSettings", Style: "margin-bottom:0.5rem;",
                            Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                            Properties: [{ Name: "onclick", Value: function () { that.notification_settings(); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.NotificationSettings }]
                        })
                    ]
                }
            ], that.ContainerDiv);
        },

        select_theme: function (container) {
            var that = this;

            if (!window.RVGlobal.EnableThemes) return container.parentNode.removeChild(container);
            
            if (that.__Themes)
                that._select_theme(that.__Themes);
            else {
                RVAPI.GetThemes({
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        that.__Themes = result.Themes
                        that._select_theme();
                    }
                });
            }
        },

        _select_theme: function () {
            var that = this;

            var themes = that.__Themes;
            
            var container = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-5 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto 0rem auto; padding:1rem;", Name: "container"
            }])["container"];

            var showedDiv = GlobalUtilities.show(container);

            var arr = [];

            var _add = function (thm) {
                var codes = thm.Codes;

                var thmCode = thm.Name.substr(thm.Name.indexOf("_") + 1);

                var items = [];

                var _add_item = function (itm) {
                    itm = itm || {};

                    items.push({
                        Type: "div", Class: "rv-circle",
                        Style: "display:inline-block; padding:0.001rem; margin:0.1rem; width:1.5rem; height:1.5rem;" +
                            "border-width:0.1rem; border-style:solid; border-color:transparent;" +
                            (itm.Style ? itm.Style : "")
                    });
                };

                _add_item({ Name: "color", Style: "background-color:" + codes.color + ";" });
                _add_item({ Name: "vsoft", Style: "background-color:" + codes.verysoft + ";" });
                _add_item({ Name: "soft", Style: "background-color:" + codes.soft + ";" });
                _add_item({ Name: "warm", Style: "background-color:" + codes.warm + ";" });
                _add_item({ Name: "vwarm", Style: "background-color:" + codes.verywarm + ";" });
                _add_item({ Name: "wborder", Style: "background-color:transparent; border-color:" + codes.warmborder + ";" });
                _add_item({ Name: "sborder", Style: "background-color:transparent; border-color:" + codes.softborder + ";" });
                _add_item({ Name: "acbtn", Style: "background-color:" + codes.actionbutton + "; border-color:" + codes.warmborder + "; color:white;" });
                _add_item({ Name: "htwarm", Style: "background-color:" + codes.highlytransparentwarm + ";" });
                _add_item({ Name: "vtwarm", Style: "background-color:" + codes.verytransparentwarm + ";" });
                _add_item({ Name: "mtwarm", Style: "background-color:" + codes.mediumtransparentwarm + ";" });
                _add_item({ Name: "twarm", Style: "background-color:" + codes.transparentwarm + ";" });

                items.push({
                    Type: "div", Class: "check-button",
                    Style: "position:absolute; top:0.1rem;" + RV_Float + ":0rem; width:2rem; text-align:center;" +
                        "display:" + (String(thm.Name).toLowerCase() == String(window.RVGlobal.Theme).toLowerCase() ? "block;" : "none;"),
                    Properties: [{ Name: "themeName", Value: thm.Name }],
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-check fa-2x rv-icon-button", Style: "cursor:default;",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                });

                arr.push({
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; margin:0.2rem; padding:0.2rem; background-color:white; cursor:pointer;" +
                        "padding-" + RV_Float + ":3rem; height:2.1rem;" + GlobalUtilities.border_radius("0.3rem"),
                    Tooltip: !thmCode || (thmCode.toLowerCase() == "default") ? null : thmCode,
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.backgroundColor = thm.Codes.reverse; } },
                        { Name: "onmouseout", Value: function () { this.style.backgroundColor = "white"; } },
                        {
                            Name: "onclick",
                            Value: function () {
                                UsersAPI.SetTheme({
                                    Theme: thm.Name, ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) return;

                                        var curThmUrl = RVAPI.ThemeURL({ Name: window.RVGlobal.Theme || "Default" });
                                        var newThmUrl = RVAPI.ThemeURL({ Name: thm.Name });

                                        DynamicFileUtilities.replace_css(curThmUrl, newThmUrl);

                                        window.RVGlobal.Theme = thm.Name;

                                        var chks = container.getElementsByClassName("check-button");

                                        for (var i = 0; i < chks.length; ++i)
                                            chks[i].style.display = (String(chks[i].themeName).toLowerCase() == String(thm.Name).toLowerCase() ? "block" : "none");
                                    }
                                });
                            }
                        }
                    ],
                    Childs: items
                });

                if (String(thm.Name).toLowerCase() == "default") {
                    var temp = [];
                    temp.push(arr[arr.length - 1]);
                    for (var i = 0; i < (arr.length - 1); ++i)
                        temp.push(arr[i]);
                    arr = temp;
                }
            }
            
            for (var i = 0, lnt = (themes || []).length; i < lnt; ++i)
                _add(themes[i]);
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; margin-bottom:0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.ThemeSelect }]
                },
                { Type: "div", Childs: arr }
            ], container);
        },

        change_password: function () {
            var that = this;

            var container = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "container"
            }])["container"];

            GlobalUtilities.loading(container);
            var showedDiv = GlobalUtilities.show(container);

            GlobalUtilities.load_files(["USR/ChangePasswordDialog.js"], {
                OnLoad: function () {
                    new ChangePasswordDialog(container, {
                        OnPasswordChange: function () { showedDiv.Close(); }
                    });
                }
            });
        },

        notification_settings: function () {
            var that = this;

            if (that.NotificationSettingsPanel) return GlobalUtilities.show(that.NotificationSettingsPanel);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-10 large-9 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; margin-bottom:1rem; font-size:1.2rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.NotificationSettings }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                    ]
                }
            ]);

            that.NotificationSettingsPanel = elems["container"];

            GlobalUtilities.loading(elems["_div"]);
            GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["Notifications/SendMessageUserSetting.js"], {
                OnLoad: function () {
                    var settings = window.RVGlobal || {};

                    new SendMessageUserSetting(elems["_div"], {
                        UserID: settings.UserID,
                        CurrentUserID: settings.CurrentUserID,
                        IsSystemAdmin: settings.IsSystemAdmin === true
                    });
                }
            });
        }
    }
})();