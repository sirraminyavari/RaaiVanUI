(function () {
    if (window.MasterPageBuilder) return;

    window.MasterPageBuilder = function (params) {
        var that = this;
        params = params || {};
        
        this.Interface = {
            ContentSection: params.ContentSection,
            OptionsButton: null,
            SystemSettingsButton: null,
            ReportsButton: null,
            MessagesButton: null,
            NotificationsButton: null,
            DashboardButton: null,
            NetworkButton: null,
            NavigationButton: null,
            QuestionButton: null,
            SidePanel: null,
            RevSidePanel: null
        };

        var isSaaS = this.is_saas();
        var hasApplicationId = this.has_application_id();
        var modules = (window.RVGlobal || {}).Modules || {};
        
        this.Objects = {
            Modules: modules,
            Buttons: [
                (!hasApplicationId ? null : {
                    Title: RVDic.Options, Icon: "fa-bars", FontSize: "1.2rem", Name: "options",
                    HideForLarge: true, DontHide: true, NoSmallMode: true
                }),
                (!hasApplicationId ? null : { Title: RVDic.Home, Icon: "fa-home", FontSize: "1.2rem", Link: RVAPI.HomePageURL() }),
                (!isSaaS ? null : { Title: RVDic.Teams, Icon: "fa-users", Link: RVAPI.ApplicationsPageURL() }),
                (isSaaS || (!modules.VisualMap && !modules.Explorer) ? null : {
                    Title: RVDic.Navigation, Icon: "fa-map-signs", IsMenu: true, Name: "navigationButton",
                    GetButton: function () { return that.Interface.NavigationButton; },
                    Childs: [
                        (!modules.Explorer ? null : { Title: RVDic.Explorer, Link: RVAPI.ExplorerPageURL() }),
                        (!modules.VisualMap ? null : { Title: RVDic.KnowledgeMap, Link: RVAPI.GraphPageURL() })
                    ]
                }),
                (isSaaS || !modules.QA ? null : {
                    Title: RVDic.Question, Icon: "fa-question-circle",
                    IsMenu: true, FontSize: "1.2rem", Name: "questionButton",
                    GetButton: function () { return that.Interface.QuestionButton; },
                    Childs: [
                        { Title: RVDic.NewQuestion, Link: RVAPI.NewQuestionPageURL() },
                        { Title: RVDic.Questions, Link: RVAPI.QuestionsPageURL() }
                    ]
                }),
                (isSaaS || !modules.SH ? null : {
                    Title: RVDic.Coworkers, Icon: "fa-users", Name: "networkButton",
                    OnClick: function (e) {
                        var count = that.Interface.NetworkButton.Count;
                        GlobalUtilities.link_click(e, RVAPI.NetworkPageURL({ Tab: count ? "ExpandNetworkTab" : null }));
                    }
                }),
                (!hasApplicationId || !modules.MSG ? null : {
                    Title: RVDic.Messages, Icon: "fa-envelope", Name: "messagesButton",
                    OnClick: function (e) { that.messages_button_click(e); }
                }),
                (!hasApplicationId ? null : {
                    Title: RVDic.Dashboard, Icon: "fa-inbox", Name: "dashboardButton",
                    OnClick: function (e) { that.dashboard_button_click(e); }
                }),
                (!hasApplicationId ? null : {
                    Title: RVDic.Notifications, Icon: "fa-bell-o", Name: "notificationsButton", NoSmallMode: true
                })
            ].filter(function (x) { return !!x; }),
            SearchButtons: {
                Normal: { Title: RVDic.Search, Link: RVAPI.SearchPageURL(), OnlySmallMode: true },
                Advanced: {
                    Title: RVDic.Advanced, SmallTitle: RVDic.AdvancedSearch,
                    Icon: "fa-filter", Link: RVAPI.ClassesPageURL()
                },
                Users: {
                    Title: RVDic.KnowledgeWorkers, SmallTitle: RVDic.SearchKnowledgeWorkers,
                    Icon: "fa-address-card-o", Link: RVAPI.ExpertLocatorPageURL()
                }
            }
        };

        this.initialize();
    }

    MasterPageBuilder.prototype = {
        initialize: function () {
            var that = this;

            var isAuthenticated = (window.RVGlobal || {}).IsAuthenticated;
            var hasApplicationId = that.has_application_id();
            var isSaaS = that.is_saas();

            var searchBoxWidth = isSaaS ? 25.2 : 21;
            var searchButtonsWidth = isSaaS ? 4.5 : 8.7;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "WarmBackgroundColor RevTextAlign rv-not-printable",
                    Style: "position:fixed; top:0rem; left:0rem; right:0rem; height:3.5rem; z-index:2;" +
                        (isAuthenticated ? "padding-" + RV_Float + ":12rem;" : ""),
                    Childs: [
                        (isAuthenticated ? null : {
                            Type: "div", Class: "RevDirection RevTextAlign",
                            Style: "position:absolute; top:0; bottom:0; " + RV_RevFloat + ":2rem;",
                            Childs: [{
                                Type: "middle",
                                Childs: [{
                                    Type: "div", Class: "rv-air-button rv-circle SoftBorder", Name: "loginButton",
                                    Style: "border-width:2px; border-color:white; font-size:1rem; padding:0.3rem 1.5rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.login_dialog(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.SystemLogin }]
                                }]
                            }]
                        }),
                        (!isAuthenticated ? null : {
                            Type: "div", Class: "RevDirection RevTextAlign",
                            Style: "position:absolute; top:0; bottom:0; " + RV_Float + ":0; padding:0 2px;" +
                                "width:12rem; background-color:rgb(105,105,105);",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0; bottom:0; " + RV_RevFloat + ":0; background-color:white;" +
                                        "padding-" + RV_RevFloat + ":2px;"
                                },
                                that.create_button({
                                    Title: RVDic.WorkTable, IsMenu: true, DontHide: true, Name: "worktableButton",
                                    ImageURL: ((window.RVGlobal || {}).CurrentUser || {}).ImageURL
                                })
                            ]
                        }),
                        (!isAuthenticated ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12 Direction TextAlign",
                            Style: "height:100%; padding-" + RV_Float + ":1rem; display:flex; flex-flow:row;",
                            Childs: [
                                {
                                    Type: "div", Style: "flex:1 1 auto; height:100%;",
                                    Childs: that.Objects.Buttons.map(function (btn) { return that.create_button(btn); })
                                },
                                (!hasApplicationId ? null : {
                                    Type: "div", Class: "show-for-large", Name: "searchContainer",
                                    Style: "position:relative; flex:0 0 auto; height:100%; width:" + searchBoxWidth + "rem;" +
                                        "padding-" + RV_RevFloat + ":calc(4vw + " + searchButtonsWidth + "rem);",
                                    Childs: [
                                        {
                                            Type: "div", Name: "searchOptions",
                                            Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":4vw;",
                                            Childs: [
                                                that.create_button(that.Objects.SearchButtons.Advanced),
                                                (isSaaS ? null : {
                                                    Type: "div", Style: "display:inline-block; padding:0 0.2rem; height:100%; position:relative;",
                                                    Childs: [{ Type: "div", Style: "position:absolute; padding-right:1px; background-color:white; top:0.8rem; bottom:0.8rem;" }]
                                                }),
                                                (isSaaS ? null : that.create_button(that.Objects.SearchButtons.Users))
                                            ]
                                        },
                                        (RVAPI.IsSearchPage() ? null : {
                                            Type: "middle", Style: "position:relative;",
                                            Childs: [
                                                {
                                                    Type: "div",
                                                    Style: "position:absolute; top:0; bottom:0; " + RV_RevFloat + ":0.4rem;",
                                                    Childs: [{
                                                        Type: "middle", Childs: [{
                                                            Type: "i", Class: "fa fa-search fa-lg rv-icon-button", Name: "searchButton",
                                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                                        }]
                                                    }]
                                                },
                                                {
                                                    Type: "input", Class: "rv-input", InnerTitle: RVDic.Search, Name: "searchInput",
                                                    Style: "width:100%; padding-" + RV_RevFloat + ":2rem; border-width:0;"
                                                }
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                },
                {
                    Type: "div", Name: "sidePanel",
                    Style: "display:flex; flex-flow:row; position:fixed; bottom:0rem; " +
                        RV_Float + ":0rem; z-index:" + GlobalUtilities.zindex.dialog() + ";"
                },
                {
                    Type: "div", Class: "RevDirection RevTextAlign", Name: "revSidePanel",
                    Style: "display:flex; flex-flow:row; position:fixed; bottom:0rem; " +
                        RV_Float + ":0rem; z-index:" + GlobalUtilities.zindex.dialog() + ";"
                }
            ], document.body);

            that.Interface.OptionsButton = elems["options"];
            that.Interface.NetworkButton = elems["networkButton"];
            that.Interface.MessagesButton = elems["messagesButton"];
            that.Interface.DashboardButton = elems["dashboardButton"];
            that.Interface.NotificationsButton = elems["notificationsButton"];
            that.Interface.NavigationButton = elems["navigationButton"];
            that.Interface.QuestionButton = elems["questionButton"];
            that.Interface.SidePanel = elems["sidePanel"];
            that.Interface.RevSidePanel = elems["revSidePanel"];

            that.init_notifications_button();
            that.init_options_button();

            that.Objects.Buttons.filter(function (x) { return x.GetButton && (x.Childs || []).length })
                .forEach(function (x) { that.init_menu(x.GetButton(), x.Childs); });

            if (hasApplicationId) that.init_all_notifications();

            that.create_content_section(elems["worktableButton"]);

            //Search Options
            jQuery(elems["searchInput"])
                .focus(function () {
                    var nm = RV_RTL ? "paddingLeft" : "paddingRight";

                    jQuery(elems["searchOptions"]).fadeOut(500, function () {
                        jQuery(elems["searchContainer"]).animate({ [nm]: "4vw" }, 500);
                    });
                })
                .blur(function () {
                    var nm = RV_RTL ? "paddingLeft" : "paddingRight";
                    var lp = (searchButtonsWidth * GlobalUtilities.rem2px()) + (4 * GlobalUtilities.vw2px());

                    jQuery(elems["searchContainer"]).animate({ [nm]: lp + "px" }, 500, function () {
                        elems["searchContainer"].style[nm] = "calc(4vw + " + searchButtonsWidth + "rem)";
                        jQuery(elems["searchOptions"]).fadeIn(500);
                    });
                });

            GlobalUtilities.set_onenter(elems["searchInput"], function () { that.do_search(elems["searchInput"].value); });

            jQuery(elems["searchButton"]).click(function () { that.do_search(elems["searchInput"].value); });
            //end of Search Options

            //Init Chat
            if (isAuthenticated && that.Objects.Modules.Chat) GlobalUtilities.load_files(["MSG/RChat.js"], {
                Timeout: 1000,
                OnLoad: function () { new RChat(); }
            });
            //end of Init Chat

            that.show_background_bubbles();
        },

        is_saas: function () {
            return !!(window.RVGlobal || {}).SAASBasedMultiTenancy;
        },

        has_application_id: function () {
            return !!(window.RVGlobal || {}).ApplicationID;
        },

        create_button: function (params) {
            var that = this;
            params = params || {};

            var hasApplicationId = that.has_application_id();
            
            return {
                Type: "div", Name: params.Name, Link: params.Link,
                Class: "Direction TextAlign rv-bg-color-trans-white-opaque" +
                    (!hasApplicationId ? "" : (params.DontHide ? "" : " show-for-large") + (params.HideForLarge ? " hide-for-large" : "")),
                Style: "position:relative; height:100%; width:4rem; text-align:center; padding-bottom:1.5rem;" +
                    "color:rgba(255,255,255,0.8); cursor:pointer; display:inline-block;",
                Properties: !params.OnClick ? null : [{ Name: "onclick", Value: params.OnClick }],
                Childs: [
                    {
                        Type: "div", Style: "position:absolute; bottom:1.4rem; left:0; right:0; height:1.8rem;",
                        Childs: [{
                            Type: "middle", Style: "font-size:" + (params.FontSize || "1rem") + ";",
                            Childs: [
                                (!params.ImageURL ? null : {
                                    Type: "img", Class: "rv-circle", Style: "width:1.5rem; height:1.5rem;",
                                    Attributes: [{ Name: "src", Value: params.ImageURL }]
                                }),
                                (!params.Icon ? null : {
                                    Type: "i", Class: "fa " + params.Icon + " fa-lg",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                })
                            ]
                        }]
                    },
                    {
                        Type: "div",
                        Style: "position:absolute; bottom:0.3rem; left:0; right:0; height:1rem; font-size:0.7rem;",
                        Childs: [
                            { Type: "text", TextValue: params.Title },
                            (!params.IsMenu ? null : {
                                Type: "i", Class: "fa fa-caret-down", Style: "margin-right:0.3rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            })
                        ]
                    }
                ]
            };
        },

        do_search: function (searchText) {
            searchText = GlobalUtilities.trim(searchText || " ");
            if (searchText) window.location = RVAPI.SearchPageURL({ SearchText: Base64.encode(searchText) });
        },

        create_content_section: function (button) {
            var that = this;

            if (!button) return;

            var hasApplicationId = that.has_application_id();

            var isOpen = false;
            var sideWidth = 18;
            var paddingName = RV_RTL ? "paddingRight" : "paddingLeft";

            button.onclick = function () {
                if (!isOpen && hasApplicationId) {
                    that.initialize_permissions();
                    that.initialize_services(elems["serivces"]);
                }
                
                jQuery(that.Interface.ContentSection).animate({ [paddingName]: (isOpen ? "0" : sideWidth + "rem") }, 500);
                jQuery(that.Interface.SidePanel).animate({ [RV_Float]: (isOpen ? "0" : sideWidth + "rem") }, 500);
                jQuery(elems["sideContent"]).animate({ [RV_Float]: (!isOpen ? "0" : (-sideWidth - 1) + "rem") }, 500);
                isOpen = !isOpen;
            };

            var systemVersion = !(window.RVGlobal || {}).ShowSystemVersion ? null : (window.RVGlobal || {}).SystemVersion;
            if (systemVersion && (systemVersion.toLowerCase()[0] == "v")) systemVersion = systemVersion.substring(1);

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "SoftBackgroundColor SurroundingShadow", Name: "sideContent",
                Style: "position:fixed; display:flex; flex-flow:column; top:3.4rem; bottom:0;" +
                    "width:" + sideWidth + "rem;" + RV_Float + ":" + (-sideWidth - 1) + "rem;",
                Childs: [
                    {
                        Type: "div", Name: "serivces",
                        Style: "flex-grow:1; flex-shrink:1; flex-basis:auto; padding-top:0.5rem;"
                    },
                    {
                        Type: "div", Name: "options",
                        Style: "flex-grow:0; flex-shrink:1; flex-basis:auto; text-align:center; padding-bottom:0.4rem;",
                        Childs: [{ Type: "div", Style: "display:inline-block; width:90%; padding-top:1px; background-color:rgb(220,220,220);" }]
                    },
                    {
                        Type: "div", Name: "options",
                        Style: "flex-grow:0; flex-shrink:1; flex-basis:auto; text-align:center;"
                    },
                    (!systemVersion ? null : {
                        Type: "div", Style: "flex:0 1 auto; text-align:center; font-size:0.7rem; color:rgb(80,80,80); ",
                        Childs: [{ Type: "text", TextValue: RVDic.Version + " " + systemVersion }]
                    })
                ]
            }], that.Interface.ContentSection);

            that.add_side_options(elems["options"]);
        },

        add_side_options: function (container) {
            var that = this;

            var _create = function (params) {
                params = params || {};

                return {
                    Type: "div", Name: params.Name,
                    Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftBorder", Link: params.Link,
                    Style: "position:relative; height:4rem; width:4rem; text-align:center; padding-bottom:1.5rem;" +
                        "margin:0.25rem 0.5rem; cursor:pointer; border-color:rgb(200,200,200); color:rgb(100,100,100);" +
                        "display:" + (params.Hide ? "none" : "inline-block") + ";",
                    Properties: !params.OnClick ? null : [{ Name: "onclick", Value: params.OnClick }],
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "height:100%; padding-top:0.3rem;",
                            Childs: [{
                                Type: "middle", Style: "font-size:" + (params.FontSize || "1rem") + ";",
                                Childs: [
                                    (!params.ImageURL ? null : {
                                        Type: "img", Class: "rv-circle", Style: "width:2rem; height:2rem;",
                                        Attributes: [{ Name: "src", Value: params.ImageURL }]
                                    }),
                                    (!params.Icon ? null : {
                                        Type: "i", Class: "fa " + params.Icon + " fa-2x rv-icon-button", Style: "margin-top:0.1rem;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    })
                                ]
                            }]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; bottom:0.3rem; left:0; right:0; height:1rem; font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: params.Title }]
                        }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                _create({
                    Title: RVDic.Profile,
                    ImageURL: ((window.RVGlobal || {}).CurrentUser || {}).ImageURL,
                    Link: RVAPI.UserPageURL({ UserID: ((window.RVGlobal || {}).CurrentUser || {}).UserID, Tab: "resume" })
                }),
                _create({ Title: RVDic.Management, Icon: "fa-wrench", Link: RVAPI.AdminPanelPageURL(), Hide: true, Name: "sysAdmin" }),
                _create({ Title: RVDic.Reports, Icon: "fa-bar-chart", Link: RVAPI.ReportsPageURL(), Name: "reports" }),
                _create({ Title: RVDic.Settings, Icon: "fa-cog", OnClick: function (e) { that.user_settings(this); } }),
                _create({ Title: RVDic.Help, Icon: "fa-question", Link: RVAPI.HelpPageURL() }),
                _create({ Title: RVDic.Logout, Icon: "fa-power-off", OnClick: function (e) { that.logout(this); } })
            ], container);

            that.Interface.SystemSettingsButton = elems["sysAdmin"];
            that.Interface.ReportsButton = elems["reports"];
        },

        user_settings: function (button) {
            if (button.__SettingsDiv) return GlobalUtilities.show(button.__SettingsDiv);

            var _div = button.__SettingsDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }
            ])["container"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);
            
            GlobalUtilities.load_files(["USR/UserSettings.js"], { OnLoad: function () { new UserSettings(_div); } });
        },

        logout: function (button) {
            if (button._Processing) return;
            button._Processing = true;

            RVAPI.Logout({
                ParseResults: true,
                ResponseHandler: function (result) { window.location.href = RVAPI.LoginPageURL(); }
            });
        },

        initialize_permissions: function () {
            var that = this;

            if (that.PermissionsInited) return;
            else that.PermissionsInited = true;

            var _do = () => (that.Interface.SystemSettingsButton.style.display = "inline-block");

            if (RVGlobal.IsSystemAdmin) _do();
            else {
                var roles = (RVGlobal.AccessRoles || []).map(r => r.Name);

                PrivacyAPI.CheckAuthority({
                    Permissions: roles.join("|"), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (roles.some(r => !!(result || {})[r])) _do();
                    }
                });
            }
        },

        initialize_services: function (container) {
            var that = this;

            if (container.ServicesInited) return;
            else container.ServicesInited = true;

            GlobalUtilities.load_files(["CN/ServiceInitializer.js"], {
                OnLoad: function () {
                    new ServiceInitializer(container, {
                        Modules: (window.RVGlobal || {}).Modules || {},
                        AddScrollBar: true,
                        IsSystemAdmin: (window.RVGlobal || {}).IsSystemAdmin,
                        EnableNewPage: true,
                        SearchBox: true
                    });
                }
            });
        },

        messages_button_click: function (e) {
            var that = this;

            if (e.ctrlKey) return window.open(RVAPI.MessagesPageURL());

            if (that.__MessagesContainer) return GlobalUtilities.show(that.__MessagesContainer);

            that.__MessagesContainer = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(that.__MessagesContainer);
            GlobalUtilities.show(that.__MessagesContainer);

            GlobalUtilities.load_files(["MSG/Messaging.js"], {
                OnLoad: function () { new Messaging(that.__MessagesContainer); }
            });
        },

        dashboard_button_click: function (e) {
            var that = this;

            if (e.ctrlKey) return window.open(RVAPI.DashboardPageURL());

            if (that.__DashboardsContainer) {
                GlobalUtilities.show(that.__DashboardsContainer);
                if (that.__DashboardViewer) that.__DashboardViewer.reset(true);
                return;
            }

            that.__DashboardsContainer = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-11 large-10 row rv-border-radius-1",
                    Style: "margin:0rem auto; padding:1rem; background-color:white;", Name: "container"
                }
            ])["container"];

            GlobalUtilities.show(that.__DashboardsContainer);
            GlobalUtilities.loading(that.__DashboardsContainer);

            GlobalUtilities.load_files(["Notifications/DashboardsCountViewer.js"], {
                OnLoad: function () { that.__DashboardViewer = new DashboardsCountViewer(that.__DashboardsContainer); }
            });
        },

        init_notifications_button: function () {
            var that = this;

            if (!that.Interface.NotificationsButton) return;

            var line = GlobalUtilities.create_nested_elements([
                { Type: "div", Style: "position:absolute; bottom:0; left:0; right:0;", Name: "_div" }
            ], that.Interface.NotificationsButton)["_div"];

            GlobalUtilities.load_files(["Notifications/NotificationsViewer.js"], {
                OnLoad: function () {
                    new NotificationsViewer(line, {
                        NotificationsButton: that.Interface.NotificationsButton,
                        Options: {
                            SeenTimeout: 0 /* _ntfn.SeenTimeout */,
                            UpdateInterval: ((window.RVGlobal || {}).Notifications || {}).UpdateInterval
                        }
                    });
                }
            });
        },

        init_options_button: function () {
            var that = this;

            var options = [];

            that.Objects.Buttons.filter(function (x) { return !x.NoSmallMode; }).forEach(function (btn) {
                if ((btn.Childs || []).length) options = options.concat(btn.Childs);
                else options.push(btn);
            });

            for (var key in that.Objects.SearchButtons)
                options.push(that.Objects.SearchButtons[key]);

            that.init_menu(that.Interface.OptionsButton, options);
        },

        init_menu: function (button, options) {
            var that = this;

            if (!button) return;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "WarmBackgroundColor", Name: "_div", Style: "font-size:0.7rem;",
                Childs: options.map(function (op) {
                    return {
                        Type: "div",
                        Class: "rv-bg-color-trans-white-opaque rv-border-radius-quarter", Link: op.Link,
                        Style: "padding:0.3rem 0.5rem; color:rgba(255,255,255,0.8); cursor:pointer;",
                        Properties: !op.OnClick ? null : [{ Name: "onclick", Value: op.OnClick }],
                        Childs: [{ Type: "text", TextValue: op.SmallTitle || op.Title }]
                    };
                })
            }]);

            var menu = elems["_div"];

            var popupMenu = null;

            var _init_mouse_over = function () {
                popupMenu = GlobalUtilities.popup_menu(button, menu, {
                    Align: "bottom", Class: "WarmBackgroundColor"
                });

                GlobalUtilities.enable_by_mouse_over(button, popupMenu.Container, {
                    Started: true,
                    Delay: 0,
                    OnStart: function (d) { popupMenu.Show(d); },
                    OnEnd: function (d) { popupMenu.Hide(d); }
                });
            };

            button.onmouseover = function () { this.onmouseover = null; _init_mouse_over(); }
        },

        init_all_notifications: function () {
            var that = this;

            var _do = function () {
                if (!(window.RVGlobal || {}).IsAuthenticated) return;

                RVAPI.GetAllNotifications({
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        that.set_notifications_count(that.Interface.NotificationsButton, result.Notifications);
                        that.set_notifications_count(that.Interface.DashboardButton, result.Dashboards);
                        that.set_notifications_count(that.Interface.MessagesButton, result.Messages);
                        that.set_notifications_count(that.Interface.NetworkButton, result.FriendRequests);
                    }
                });
            };

            setInterval(function () { _do(); }, 60000);
            _do();
        },

        set_notifications_count: function (button, count) {
            if (!button) return;

            var newDashboardsCount = +((count || {}).NotSeen || "0"); //Dashboards has a NotSeen property
            button.Count = count = +((count || {}).ToBeDone || count || "0"); //Dashboards has a ToBeDone property
            
            //Count
            button.CountContainer = button.CountContainer || GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-circle WarmBorder", Name: "_div",
                    Style: "position:absolute; top:0.2rem;" + RV_RevFloat + ":2.3rem; width:1.4rem; height:1.4rem;" +
                        "line-height:calc(1.4rem - 2px); text-align:center; background-color:red; color:white; border-width:2px;" +
                        "display:none;"
                }
            ], button)["_div"];

            button.CountContainer.style.fontSize = (count > 99 ? 0.5 : 0.6) + (RV_RTL ? 0 : -0.1) + "rem";
            button.CountContainer.innerHTML =
                GlobalUtilities.convert_numbers_to_persian(count > 99 ? (RV_RTL ? "+99" : "99+") : count);

            jQuery(button.CountContainer)[count ? "fadeIn" : "fadeOut"](500);
            //end of Count


            //NotSeenCount
            if (count && newDashboardsCount) {
                button.NewCountContainer = button.NewCountContainer || GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-circle", Name: "_div",
                        Style: "position:absolute; top:0.2rem;" + RV_RevFloat + ":3.5rem; padding:0.15rem; background-color:red;"
                    }
                ], button)["_div"];

                jQuery(button.NewCountContainer).fadeIn(500);
            }
            else if (button.NewCountContainer) jQuery(button.NewCountContainer).fadeOut(500);
            //end of NotSeenCount
        },

        show_background_bubbles: function () {
            if (!(window.RVGlobal || {}).ColorfulBubbles) return;

            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.SoftBackgroundColor { _opacity:0.85; } @keyframes rv-bubble-animate-1 { 0% { transform: translateY(0) rotate(0deg); opacity:1; border-radius:0; } 100% { transform: translateY(-120vh) rotate(720deg); opacity:0.4; border-radius:50%; } } @keyframes rv-bubble-animate-2 { 0% { transform: translateY(0) rotate(0deg); opacity:1; border-radius:50%; } 100% { transform: translateY(-120vh) rotate(-720deg); opacity:0.4; border-radius:0; } }';
            document.getElementsByTagName('head')[0].appendChild(style);

            var container = GlobalUtilities.create_nested_elements([{ Type: "ul", Name: "_ul", Style: "position:fixed; top:0rem; bottom:-2rem; left:0rem; right:0rem; z-index:-1000;" }])["_ul"];
            document.body.appendChild(container);

            var used = 3, avail = 97, maxWidth = 10, isLast = false;
            var maxDiameter = maxWidth * Math.sqrt(2);

            while (!isLast) {
                if ((avail - used) < maxDiameter) isLast = true;
                var w = Number(((avail - used) < maxDiameter ? (avail - used) / Math.sqrt(2) : GlobalUtilities.random(1, 10)).toFixed(2));
                var color = GlobalUtilities.generate_color(), no = GlobalUtilities.random(1, 2);

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "li",
                        Style: "position:absolute; list-style:none; bottom:-" + w + "vw;" +
                            "width:" + w + "vw; height:" + w + "vw; left:" + used + "vw;" +
                            "animation-delay:" + GlobalUtilities.random(0, 10) + "s !important;" +
                            "animation-duration:" + GlobalUtilities.random(10, 20) + "s !important;" +
                            "background-color:" + color.Bright + ";" +
                            "animation:rv-bubble-animate-" + no + " 25s linear infinite;"
                    }
                ], container);

                used += (w * Math.sqrt(2) * 1.2);
            }
        },

        login_dialog: function () {
            var that = this;

            that.__LoginDialog = that.__LoginDialog || {};

            if (that.__LoginDialog.Showed) {
                GlobalUtilities.show(that.__LoginDialog.Showed);
                if (that.__LoginDialog.LoginControl) that.__LoginDialog.LoginControl.clear();
                return;
            }

            var _div = that.__LoginDialog.Showed = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1", Name: "_div",
                Style: "margin:0rem auto; padding:1rem; background-color:" +
                    (RVGlobal.SAASBasedMultiTenancy ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)") + ";"
            }])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["USR/LoginControl.js"], {
                OnLoad: function () {
                    that.__LoginDialog.LoginControl = new LoginControl(_div, {
                        ReloadAfterLogin: false, ContainerClass: false,
                        OnLogin: function (d) { window.location.href = window.location.href; }
                    });
                }
            });
        },

        get_side_panel: function (rev) {
            return rev ? this.Interface.RevSidePanel : this.Interface.SidePanel;
        }
    };
})();