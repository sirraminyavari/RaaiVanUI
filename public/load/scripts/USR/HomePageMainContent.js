(function () {
    if (window.HomePageMainContent) return;

    window.HomePageMainContent = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            User: params.User || {},
            Priorities: params.Priorities || {}
        };

        this.initialize();
    };

    HomePageMainContent.prototype = {
        initialize: function () {
            var that = this;

            var modules = (window.RVGlobal || {}).Modules || {};
            
            var valid = [
                (!modules.SocialNetwork ? null : { key: "sharing", func: function () { that.append_sharing(); } }),
                { key: "explorer", func: function () { that.append_explorer(); } },
                { key: "search", func: function () { that.append_search(); } }
            ].filter(function (x) { return !!x; });
            
            var centerItems = (that.Objects.Priorities.Center || []).concat(valid.map(function (u) { return u.key; }))
                .filter(function (x) { return !!x && (GlobalUtilities.get_type(x) == "string"); })
                .map(function (x) { return GlobalUtilities.trim(x).toLowerCase(); })
                .filter(function (x) { return valid.some(function (v) { return v.key == x; }); });
            
            if (centerItems.length) valid.filter(function (x) { return x.key == centerItems[0]; })[0].func();
        },

        append_sharing: function () {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:2rem;", Name: "_div" }
            ], that.Container)["_div"];

            GlobalUtilities.loading(_div);
            
            GlobalUtilities.load_files(["SharingManager/SharingManager.js"], {
                OnLoad: function () {
                    var sm = new SharingManager({
                        Container: _div, OwnerObjectID: that.Objects.User.UserID, InitialFill: true,
                        OwnerType: "User", Permissions: { AddPost: true }, NewPostArea: "Advanced", News: true,
                        HidePrivacyOptions: !!(window.RVGlobal || {}).SAASBasedMultiTenancy,
                        OnLoad: function () {
                            GlobalUtilities.onscrollend(document, { Offset: 10 }, function () { sm.get_posts(); });
                        }
                    });
                }
            });
        },

        append_explorer: function () {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:2rem;", Name: "_div" }
            ], that.Container)["_div"];

            GlobalUtilities.load_files([
                { Root: "CN/CNExplorer/", Childs: ["CNExplorer.css", "CNExplorer.js"] }
            ], { OnLoad: function () { new CNExplorer(_div, { ItemWidthClass: "small-12 medium-12 large-6" }); } });
        },

        append_search: function () {
            var that = this;

            var el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [{
                        Type: "input", Class: "rv-input", Name: "input",
                        Style: "width:100%;", InnerTitle: RVDic.Search
                    }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:2rem;", Name: "_div"
                }
            ], that.Container);

            GlobalUtilities.load_files(["SearchManager/SearchManager.js"], {
                OnLoad: function () {
                    new SearchManager(el["_div"], {
                        Options: {
                            HideOptions: true, SuggestServices: true,
                            Modules: GlobalUtilities.extend({}, (window.RVGlobal || {}).Modules || {}, {
                                USR: false, QA: false, FileContents: false
                            })
                        },
                        SearchInput: el["input"], SearchButton: null, InitialSearch: false
                    });
                }
            });
        }
    };
})();