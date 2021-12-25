(function () {
    if (window.RaaiVanHelp) return;

    window.RaaiVanHelp = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            HelpContent: null
        };

        this.Objects = {
            Permissions: {},
            HasSomePermissions: false
        };

        this.Options = {
            Index: params.Index,
            ShowFirstItem: !!(params.Index || []).length,
            IgnorePermissions: !!(params.Index || []).length
        };

        var that = this;

        GlobalUtilities.load_files([
            "TreeView/TreeView.js",
            "Lang/Help/" + RV_Lang + ".js", "API/PrivacyAPI.js",
            "RaaiVanHelp/HelpUtils.js"
        ], { OnLoad: function () { that._preinit(); } });
    }

    RaaiVanHelp.prototype = {
        _preinit: function () {
            var that = this;
            
            if (that.Options.Index) return that._initialize();

            var permissions = (RVGlobal.AccessRoles || []).map(r => r.Name);

            PrivacyAPI.CheckAuthority({
                Permissions: permissions.join("|"), ParseResults: true,
                ResponseHandler: function (result) {
                    permissions.forEach(p => that.Objects.Permissions[p.toLowerCase()] = !!result[p]);

                    that.Objects.HasSomePermissions = Object.keys(that.Objects.Permissions)
                        .some(key => !!that.Objects.Permissions[key]);

                    that._initialize();
                }
            });
        },

        _initialize: function () {
            var that = this;

            var index = that.Options.Index || that.architecture();
            that.set_paths(null, index);

            var isSingleMode = ((index || []).length == 1) && !(index[0].Sub || []).length;
            
            var indexCls = isSingleMode ? "small-12 medium-12 large-12" : "small-12 medium-4 large-3";
            var contentCls = isSingleMode ? "small-12 medium-12 large-12" : "small-12 medium-8 large-9";

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: indexCls, Style: (isSingleMode ? "display:none;" : ""),
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding:0.5rem; padding-" + RV_RevFloat + ":0.7rem; position:relative;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-circle SoftBackgroundColor",
                                    Style: "position:absolute; top:0rem; " + RV_RevFloat + ":0rem; bottom:0rem;" +
                                        "padding-" + RV_RevFloat + ":0.2rem;"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "index" }
                            ]
                        }
                    ]
                },
                { Type: "div", Class: contentCls, Style: "padding:0.5rem; line-height:1.8rem;", Name: "content" }
            ], that.Container);

            that.Interface.HelpContent = elems["content"];
            
            new TreeView(elems["index"], {
                Items: index,
                Item: function (itm) {
                    var hasPermission = !itm.Permission ||
                        (itm.Permission.toLowerCase() == "any" && that.Objects.HasSomePermissions) ||
                        that.Objects.Permissions[itm.Permission.toLowerCase()];

                    if (itm.SystemAdmin && !(window.RVGlobal || {}).IsSystemAdmin) return false;
                    else if (!that.Options.IgnorePermissions && !hasPermission) return false;
                    else if (itm.ModuleIdentifier && !((window.RVGlobal || {}).Modules || {})[String(itm.ModuleIdentifier).toLowerCase()]) return false;

                    var titleArr = that._title(itm.Name);

                    return {
                        Name: Base64.encode(itm.Name),
                        Title: Base64.encode(titleArr[titleArr.length - 1]),
                        Childs: itm.Sub
                    };
                },
                OnClick: function (e, item, done) {
                    that.show(item, function () { done(); });
                }
            });

            if (that.Options.ShowFirstItem) that.show(index[0], function () { });
        },

        show: function (item, done) {
            var that = this;

            that.HelpContent = that.HelpContent || {};

            if (!that.HelpContent[item.Name]) {
                var titleArr = that._title(item.Name);
                
                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:justify;", Name: "container",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "title",
                                Style: "text-align:center; margin-bottom:1rem;"
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                        ]
                    }
                ]);

                var _add_title_part = function (title, isLast) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "rv-border-radius-quarter rv-air-button-base rv-air-button-black",
                            Style: "display:inline-block; font-size:0.8rem; cursor:default;",
                            Childs: [{ Type: "text", TextValue: title }]
                        },
                        {
                            Type: "div", Style: "display:" + (isLast ? "none" : "inline-block") + "; margin:0rem 0.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa " + (RV_RTL ? "fa-chevron-left" : "fa-chevon-right"),
                                    Style: "color:rgb(100,100,100);",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        }
                    ], elems["title"]);
                };

                for (var i = 0; i < titleArr.length; ++i)
                    _add_title_part(titleArr[i], i == titleArr.length - 1);

                that.HelpContent[item.Name] = elems["container"];

                GlobalUtilities.loading(elems["_div"]);
                
                RVAPI.GetHelpIndexEntry({
                    Name: Base64.encode(item.Name), ParseResults: true,
                    ResponseHandler: function (r) {
                        //elems["_div"].innerHTML = Base64.decode(((r || {}).Entry || {}).Content);

                        GlobalUtilities.append_markup_text(elems["_div"], Base64.decode(((r || {}).Entry || {}).Content), {
                            Done: function () { GlobalUtilities.remove_empty_tags(elems["_div"]); }
                        });
                    }
                });
            }

            that._show(that.HelpContent[item.Name], item, done);
        },

        _show: function (content, item, done) {
            var that = this;

            if (that.__Showing) return;
            that.__Showing = true;

            done();

            jQuery(that.Interface.HelpContent).fadeOut(250, function () {
                that.Interface.HelpContent.innerHTML = "";
                that.Interface.HelpContent.appendChild(content);
                that.__Showing = false;
                jQuery(that.Interface.HelpContent).fadeIn(500);
            });
        },

        _title: function (name) {
            return (HelpUtils.get_title || function (name) { return name; })(name);
        },

        set_paths: function (path, arr) {
            var that = this;

            for (var i = 0, lnt = (arr || []).length; i < lnt; ++i) {
                var folderPath = (path ? path + "/" : "") +
                    /*((i + 1) > 9 ? "" : "0") + (i + 1) + " - " +*/
                    arr[i].Name + (arr[i].ModuleIdentifier ? " - " + arr[i].ModuleIdentifier : "");
                arr[i].Path = folderPath + "/" + arr[i].Name + ".rvhlp";

                if ((arr[i].Sub || []).length > 0) that.set_paths(folderPath + "/sub", arr[i].Sub);
            }
        },

        architecture: function () {
            return (HelpUtils.get_architecture || function () { return []; })();
        }
    }
})();