(function () {
    if (window.QuestionMini) return;

    window.QuestionMini = function (container, question, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            Question: question || {}
        };

        this.Options = {
            Callback: params.Callback
        };

        var that = this;

        GlobalUtilities.load_files(["API/QAAPI.js"], { OnLoad: function () { that.initialize(params); }});
    }

    QuestionMini.prototype = {
        initialize: function (options) {
            var that = this;

            var container = that.Container;
            var question = that.Objects.Question;

            var hideSender = options.HideSender;
            var checkbox = options.Checkbox;
            var removeButton = options.RemoveButton;

            if (((question.Sender || {}).UserID || "_").toLowerCase() != (window.RVGlobal.CurrentUserID || "__").toLowerCase())
                container.LatestDate = container.LatestDate || question.SendDate_Gregorian;

            var sender = question.Sender || {};
            var fullname = Base64.decode(sender.FirstName) + " " + Base64.decode(sender.LastName);
            var hasBestAnswer = question.HasBestAnswer === true;
            var likesCount = +question.LikesCount;
            var dislikesCount = +question.DislikesCount;

            if (isNaN(likesCount) || !likesCount) likesCount = 0;
            if (isNaN(dislikesCount) || !dislikesCount) dislikesCount = 0;

            var totalLikes = likesCount - dislikesCount;

            var padding = checkbox && removeButton ? 6 : (checkbox || removeButton ? 3 : 0);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 row rv-border-radius-1 SoftShadow",
                    Style: "position:relative; padding:1rem 1rem 0.5rem 1rem; margin:0rem 0rem 1rem 0rem;" +
                        "padding-" + RV_RevFloat + ":2rem; background-color:white;" +
                        (padding ? "padding-" + RV_Float + ":" + padding + "rem;" : ""),
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.2rem;",
                            Childs: !question.HasBestAnswer ? null : [
                                {
                                    Type: "i", Class: "fa fa-check fa-2x rv-green",
                                    Style: "width:2.5rem; text-align:center;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem;" +
                                "width:3rem; text-align:center;" + (removeButton ? "" : "display:none;"),
                            Childs: !removeButton ? null : [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-2x rv-icon-button", Name: "removeButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " +
                                RV_Float + ":" + (removeButton ? "3" : "0") + "rem;" +
                                "width:3rem; text-align:center;" + (checkbox ? "" : "display:none;"),
                            Childs: !checkbox ? null : [
                                { Type: "middle", Childs: [{ Type: "checkbox", Name: "checkbox" }] }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-4 large-3 row",
                            Style: "margin:0rem 0rem 0.5rem 0rem;" + (hideSender ? "display:none;" : ""),
                            Childs: hideSender ? null : [
                                {
                                    Type: "div", Class: "small-5 medium-4 large-3",
                                    Childs: [
                                        {
                                            Type: "middle", Class: "TextAlign",
                                            Childs: [
                                                {
                                                    Type: "img", Class: "rv-circle", Style: "max-width:90%",
                                                    Attributes: [{ Name: "src", Value: sender.ProfileImageURL }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-7 medium-8 large-9", Style: "padding-" + RV_RevFloat + ":0.5rem",
                                    Childs: [{
                                        Type: "middle", Link: RVAPI.UserPageURL({ UserID: sender.UserID }),
                                        Childs: [{ Type: "text", TextValue: fullname }]
                                    }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Class: (hideSender ? "small-12 medium-12 large-12" : "small-12 medium-8 large-9"),
                            Childs: [
                                {
                                    Type: "middle", Style: "text-align:justify;",
                                    Link: QAAPI.QuestionPageURL({ QuestionID: question.QuestionID }),
                                    Childs: [{ Type: "text", TextValue: Base64.decode(question.Title) }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0.5rem 0rem 0rem 0rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-6 large-3 rv-icon-button",
                                    Properties: !question.RelatedNodesCount ? null : [
                                        { Name: "onclick", Value: function () { that.show_related_nodes(question); } }
                                    ],
                                    Childs: !question.RelatedNodesCount ? null : [
                                        { Type: "text", TextValue: RVDic.RelatedNodesCount + ": " + question.RelatedNodesCount }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-3 rv-icon-button",
                                    Properties: !likesCount ? null : [
                                        { Name: "onclick", Value: function () { that.show_fans(question); } }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.LikesCount + ": " + totalLikes }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-3",
                                    Childs: [{ Type: "text", TextValue: RVDic.AnswersCount + ": " + question.AnswersCount }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-3",
                                    Childs: [{ Type: "text", TextValue: question.SendDate }]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            if (that.Options.Callback) that.Options.Callback.call(that, {
                Container: elems["container"],
                Question: question,
                RemoveButton: elems["removeButton"],
                Checkbox: elems["checkbox"]
            });
        },

        show_related_nodes: function (question) {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 SoftBackgroundColor rv-border-radius-1",
                    Style: "padding:1rem; margin:0rem auto;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["QA/QATags.js"], {
                OnLoad: function () {
                    new QATags(_div, {
                        Title: Base64.decode(question.Title),
                        QuestionID: question.QuestionID,
                        Count: 100,
                        HideSearchInput: true
                    });
                }
            });
        },

        show_fans: function (question) {
            var that = this;

            if (that.FansContainer) return GlobalUtilities.show(that.FansContainer);

            var _div = that.FansContainer =
                GlobalUtilities.create_nested_elements([{ Type: "div", Name: "_div" }])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["Social/RelatedUsersViewer.js"], {
                OnLoad: function () {
                    new RelatedUsersViewer(_div, {
                        SubjectID: question.QuestionID,
                        SubjectType: "Question"
                    });
                }
            });
        }
    }
})();