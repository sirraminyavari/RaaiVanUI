(function () {
    if (window.PollInitializer) return;

    window.PollInitializer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Options = {
            OnInit: params.OnInit
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js", "Polls/PollStart.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    PollInitializer.prototype = {
        initialize: function () {
            var that = this;

            FGAPI.GetCurrentPolls({
                Count: 3, ParseResults: true,
                ResponseHandler: function (result) {
                    var totalCount = result.TotalCount;
                    var polls = (result.Polls || []).slice(0, 3);

                    that.add_polls(polls, totalCount);
                }
            });
        },

        add_polls: function (items, totalCount) {
            var that = this;

            var moreClass = "small-4 medium-3 large-2";

            switch (totalCount) {
                case 2:
                    moreClass = "small-4 medium-12 large-12 hide-for-medium";
                    break;
                case 3:
                    moreClass = "small-4 medium-3 large-12 hide-for-large";
                    break;
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBackgroundColor",
                    Style: "padding:0.5rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0; flex:1 1 auto;", Name: "content"
                        },
                        (totalCount <= 1 ? null : {
                            Type: "div", Class: moreClass, Style: "flex:0 1 auto; padding:0.4rem;",
                            Childs: [{
                                Type: "div", Style: "height:100%; text-align:center; color:rgb(80,80,80);",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter",
                                Childs: [{
                                    Type: "middle", Class: "rv-bg-color-trans-white rv-border-radius-half",
                                    Style: "padding:1rem; cursor:pointer; min-width:7rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.show_all(); } }],
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 show-for-large",
                                            Childs: [{ Type: "text", TextValue: RVDic.AndNMoreItems.replace("[n]", totalCount - 3) }]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 show-for-medium-only",
                                            Childs: [{ Type: "text", TextValue: RVDic.AndNMoreItems.replace("[n]", totalCount - 2) }]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 show-for-small-only",
                                            Childs: [{ Type: "text", TextValue: RVDic.AndNMoreItems.replace("[n]", totalCount - 1) }]
                                        },
                                        {
                                            Type: "i", Style: "margin-top:0.5rem;",
                                            Class: "fa " + (RV_RTL ? "fa-chevron-circle-left" : "fa-chevron-circle-right") + " fa-lg"
                                        }
                                    ]
                                }]
                            }]
                        })
                    ]
                }
            ], that.Container);

            (items || []).forEach(function (poll, ind) {
                if (ind > 2) return;

                var cls = totalCount > 2 ? "small-12 medium-6 large-4" :
                    (totalCount == 2 ? "small-12 medium-6 large-6" : "small-12 medium-12 large-12");
                var visClass = ind > 1 ? "show-for-large" : (ind == 1 ? "show-for-medium" : "");

                var _div = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: cls, Style: "padding:0.4rem; height:100%;",
                    Childs: [{
                        Type: "div", Style: "padding:0.5rem; height:100%;", Name: "_div",
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer " +
                            "SurroundingShadow " + visClass
                    }]
                }], elems["content"])["_div"];

                that.show_poll(_div, poll);
            });

            if (that.Options.OnInit) that.Options.OnInit({ TotalCount: totalCount, Polls: items });
        },

        show_poll: function (container, poll) {
            var that = this;

            GlobalUtilities.loading(container);

            new PollStart(container, {
                CopyFromPollID: poll.IsCopyOfPollID,
                PollID: poll.PollID,
                PollName: poll.Name || poll.RefName,
                Poll: poll,
                UseExistingPoll: true
            });
        },

        show_all: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem; padding-bottom:0.5rem;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; text-align:center; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Polls }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["items"]);
            GlobalUtilities.show(elems["_div"]);

            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                OnLoad: function () {
                    new NewSimpleListViewer(elems["items"], {
                        Options: {
                            Count: 4,
                            OnDataRequest: function (options, done, setTotalCount) {
                                FGAPI.GetCurrentPolls(GlobalUtilities.extend(options || {}, {
                                    ParseResults: true,
                                    ResponseHandler: function (result) {
                                        setTotalCount(result.TotalCount);
                                        done(result.Polls || []);
                                    }
                                }));
                            },
                            ItemBuilder: function (container, item, params) {
                                var _div = GlobalUtilities.create_nested_elements([{
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "padding:0.25rem;",
                                    Childs: [{
                                        Type: "div", Style: "padding:0.5rem;", Name: "_div",
                                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow"
                                    }]
                                }], container)["_div"];

                                var x = {
                                    "PollID": "ced63ce1-fb94-4838-be9d-10465767f278",
                                    "IsCopyOfPollID": "082ecfc3-3aad-41d1-b722-3262714ccf8c",
                                    "Name": "", "RefName": "Rmlyc3QgUG9sbA==",
                                    "Description": "2YfZhdqp2KfYsSDar9ix2KfZhduMINiv2LEg2KfbjNmGINmG2LjYsdiz2YbYrNuMINi02LHaqdiqINmG2YXYp9uM24zYryAoKGdlc2kpKQ==",
                                    "RefDescription": "2YTYt9mB2Kcg2KfbjNmGINmB2LHZhSDYsdinINiq2qnZhduM2YQg2KjZgdix2YXYp9uM24zYry4=",
                                    "BeginDate": "1396/07/02",
                                    "FinishDate": "",
                                    "ShowSummary": true,
                                    "Done": true,
                                    "HideContributors": false
                                };

                                that.show_poll(_div, item);
                                params.OnAfterAdd();
                            }
                        }
                    });
                }
            });
        }
    };
})();