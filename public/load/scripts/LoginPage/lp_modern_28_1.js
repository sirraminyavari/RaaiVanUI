(function () {
    if (window.lp_modern_28_1) return;

    window.lp_modern_28_1 = function (container, params, options) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Options = GlobalUtilities.extend({
            HideStatistics: false,
            HideDetails: false
        }, options || {});

        this.initialize(params);
    };

    lp_modern_28_1.prototype = {
        initialize: function (params) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Style: "display:flex; flex-flow:column; height:100%;",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                        Style: "flex:0 0 auto; margin:0rem; min-height:40vh;" + (that.Options.HideStatistics ? "display:none;" : ""),
                        Childs: [
                            { Category: "supply", Title: RVDic.Supply },
                            { Category: "demand", Title: RVDic.Demand },
                            { Category: "contribution", Title: RVDic.Contribution }
                        ].map(function (ct) {
                            return {
                                Type: "div", Class: "small-12 medium-6 large-4",
                                Style: "display:flex; align-items:center; justify-content:center; margin:0rem;" +
                                    "text-align:center; padding:0.5rem 0;",
                                Childs: [{
                                    Type: "div", Style: "width:100%;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-bottom:1rem; text-align:center; font-size:1.5rem; font-weight:bold;",
                                            Childs: [{ Type: "text", TextValue: ct.Title }]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12 row", Name: ct.Category, Style: "margin:0;"}
                                    ]
                                }]
                            }
                        })
                    },
                    (!(params.Users || []).length ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "display:flex; flex:1 0 auto; align-items:center; text-align:center; padding:1rem 0;",
                        Childs: [{
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "div", Style: "font-weight:bold; font-size:1.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.LastContentCreators }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "users", Style: "margin:0rem;" }
                            ]
                        }]
                    })
                ]
            }], that.Container);
            
            (params.Users || []).filter(function (v, ind) { return ind < 4; })
                .forEach(function (value, ind, self) { that.add_user(elems["users"], value); });

            var _add_statistic_item = function (container, name, title) {
                if (!(params.Statistics || {})[name] && ((params.Statistics || {})[name] !== 0)) return;

                var first = {
                    Type: "div", Class: "small-6 medium-6 large-6 RevTextAlign",
                    Style: "padding:0rem 0.5rem; font-size:2rem; color:#888; line-height:1.2;",
                    Childs: [{ Type: "text", TextValue: params.Statistics[name] || "0" }]
                };

                var second = {
                    Type: "div", Class: "small-6 medium-6 large-6 TextAlign",
                    Style: "padding:0rem 0.5rem; font-size:0.8rem;",
                    Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: title }] }]
                };

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                        Childs: [first, second]
                    }
                ], container);
            };

            _add_statistic_item(elems["supply"], "NodesCount", RVDic.Node);
            if (((window.RVGlobal || {}).Modules || {}).QA)
                _add_statistic_item(elems["supply"], "AnswersCount", RVDic.Answer);
            _add_statistic_item(elems["supply"], "WikiChangesCount", RVDic.WikiEdit);
            
            _add_statistic_item(elems["demand"], "SearchesCount", RVDic.Search);
            if (((window.RVGlobal || {}).Modules || {}).QA)
                _add_statistic_item(elems["demand"], "QuestionsCount", RVDic.Question);
            _add_statistic_item(elems["demand"], "NodePageVisitsCount", RVDic.KnowledgeVisit);

            that.contribution_statistics(elems["contribution"], params.Statistics);
        },

        contribution_statistics: function (container, params) {
            var that = this;
            params = params || {};

            var arr = [];

            var _add_item = function (itm) {
                arr.push({
                    Type: "div", Class: "small-4 medium-4 large-4", Style: "text-align:center;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-size:1.5rem; color:#888;",
                            Childs: [{ Type: "text", TextValue: params[itm.Name] || "0" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:0.5rem; color:" + (itm.Color || "#888") + ";",
                            Childs: [{ Type: "i", Class: "fa fa-" + itm.Icon, Style: "font-size:3rem;" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: itm.Title }]
                        }
                    ]
                });
            };

            _add_item({ Name: "CommentsCount", Title: RVDic.Comment, Icon: "comments-o", Color: "rgb(237,0,140)" });
            _add_item({ Name: "PostsCount", Title: RVDic.Post, Icon: "comment", Color: "rgb(54,198,46)" });
            _add_item({ Name: "ActiveUsersCount", Title: RVDic.Active, Icon: "user", Color: "rgb(20,135,254)" });

            GlobalUtilities.create_nested_elements(arr, container);
        },

        add_user: function (container, user) {
            var that = this;

            var fullname = Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName);
            var types = user.Types.split(',');

            var typesArr = [];

            var _add_type = function (tp) {
                typesArr.push({
                    Type: "div", Class: "WarmBackgroundColor",
                    Style: "color:white; font-size:0.7rem; padding:0.2rem 0.5rem; margin:0.1rem;" +
                        "display:inline-block;" + GlobalUtilities.border_radius("0.2rem"),
                    Childs: [{ Type: "text", TextValue: " " + (RVDic[tp] || tp) + " " }]
                });
            };

            for (var i = 0; i < types.length; ++i)
                _add_type(types[i]);

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-3", Style: "padding:0.6rem;",
                    Childs: [
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0rem; padding:0.4rem; height:100%;" +
                                "text-align:center; font-size:1.5rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:1rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-circle", Style: "width:6rem;",
                                            Attributes: [{ Name: "src", Value: user.ProfileImageURL || user.ImageURL }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 meidum-12 large-12",
                                    Childs: [{ Type: "text", TextValue: fullname }]
                                },
                                {
                                    Type: "div", Class: "small-12 meidum-12 large-12",
                                    Style: (that.Options.HideDetails ? "display:none;" : ""),
                                    Childs: typesArr
                                }
                            ]
                        }
                    ]
                }
            ], container);
        }
    };
})();