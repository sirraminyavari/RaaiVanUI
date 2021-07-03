(function () {
    if (window.QuestionSelect) return;

    window.QuestionSelect = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            TagQuestions: {},
            AllQuestions: {}
        };

        this.Options = {
            OnConfirm: params.OnConfirm
        };

        var that = this;

        GlobalUtilities.load_files([
            "API/QAAPI.js",
            "QA/QATags.js",
            "QA/QuestionMini.js",
            "TabsManager/TabsManager.js"
        ], { OnLoad: function () { that.initialize(); } });
    }

    QuestionSelect.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center", Name: "confirm",
                    Style: "margin:0rem; margin-bottom:1rem; text-align:center; font-weight:bold;", 
                    Childs: [
                        {
                            Type: "div", Class: "small-8 medium-6 large-4 rv-air-button rv-circle",
                            Properties: !that.Options.OnConfirm ? null : [
                                { Name: "onclick", Value: function () { that.Options.OnConfirm(that.get_selected()); } }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "tabs" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "tagsPage",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "tags" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", 
                            Style: "margin-top:1rem; display:none;", Name: "tagQuestions",
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                    Style: "margin:0rem;", Name: "allPage"
                }
            ], that.Container);

            //initialize tabs
            var tabs = [];

            var tagsInited = false;
            var allInited = false;

            tabs.push({
                Page: elems["tagsPage"], Title: RVDic.Tags, FixedPage: true,
                OnActive: function () {
                    if (tagsInited) return;
                    tagsInited = true;

                    new QATags(elems["tags"], {
                        Count: 10, Mini: true,
                        OnSelect: function (tag) {
                            jQuery(elems["tagQuestions"]).fadeIn(0);
                            elems["tagQuestions"].innerHTML = "";
                            GlobalUtilities.loading(elems["tagQuestions"]);

                            QAAPI.GetQuestions({
                                NodeID: tag.NodeID, Count: 1000, LowerBoundary: 0, ParseResults: true,
                                ResponseHandler: function (result) {
                                    var questions = result.Questions || [];

                                    elems["tagQuestions"].innerHTML = "";
                                    that.Objects.TagQuestions = {};

                                    for (var i = 0, lnt = questions.length; i < lnt; ++i) {
                                        that.add_question(elems["tagQuestions"], questions[i], function (qObj) {
                                            that.Objects.TagQuestions[questions[i].QuestionID] = qObj;
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });

            tabs.push({
                Page: elems["allPage"], Title: RVDic.AllQuestions, FixedPage: true,
                OnActive: function () {
                    if (allInited) return;
                    allInited = true;

                    that.show_all_questions(elems["allPage"]);
                }
            });

            (new TabsManager({ ContainerDiv: elems["tabs"], Pages: tabs })).goto_page(0);
            //end of initialize tabs
        },

        add_question: function (container, question, callback) {
            var that = this;

            new QuestionMini(container, question, {
                HideSender: true, Checkbox: true,
                Callback: function (qObj) { if (callback) callback(qObj); }
            });
        },

        show_all_questions: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", InnerTitle: RVDic.Search,
                            Style: "width:100%; margin-bottom:1rem;", Name: "searchInput",
                            Attributes: [{ Name: "type", Value: "text" }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "questions" },
                {
                    Type: "div", Name: "more",
                    Class: "small-12 medium-12 large-12 rv-air-button rv-circle SoftBorder",
                    Style: "margin:1rem auto 0rem auto; text-align:center; border-color:rgb(80,80,80);" +
                        "padding:0.5rem 0rem; display:none;"
                }
            ], container);

            var searchInput = elems["searchInput"];
            var moreButton = elems["more"];
            var questionsArea = elems["questions"]

            var totalCount = 0;
            var lowerBoundary = 1;
            var count = 10;
            var searchText = "";

            var processing = false;

            var set_more_button_visibility = function () {
                var isVisible = totalCount >= lowerBoundary;
                jQuery(moreButton)[isVisible ? "fadeIn" : "fadeOut"](500);
            };

            var get_questions = function (more) {
                if (processing) return;
                processing = true;

                searchText = more ? searchText : GlobalUtilities.trim(searchInput.value);

                if (more) {
                    moreButton.innerHTML = "";
                    GlobalUtilities.loading(moreButton);
                }
                else {
                    questionsArea.innerHTML = "";
                    GlobalUtilities.loading(questionsArea);

                    that.Objects.AllQuestions = {};
                }

                QAAPI.GetQuestions({
                    SearchText: Base64.encode(searchText),
                    Count: count, LowerBoundary: lowerBoundary, ParseResults: true,
                    ResponseHandler: function (result) {
                        totalCount = result.TotalCount;
                        var questions = (result || {}).Questions || [];
                        lowerBoundary += questions.length;

                        moreButton.innerHTML = RVDic.More;
                        set_more_button_visibility();

                        if (!more) {
                            questionsArea.innerHTML = questions.length > 0 ? "" :
                                "<div class='small-12 medium-12 large-12' style='text-align:center;" +
                                "color:rgb(100,100,100);'>" +
                                RVDic.NothingToDisplay + "</div>";
                        }

                        for (var i = 0, lnt = questions.length; i < lnt; ++i) {
                            that.add_question(questionsArea, questions[i], function (qObj) {
                                that.Objects.AllQuestions[questions[i].QuestionID] = qObj;
                            });
                        }

                        processing = false;
                    }
                });
            };

            GlobalUtilities.set_onchangeorenter(searchInput, function () {
                lowerBoundary = 1;
                get_questions(false);
            });

            moreButton.onclick = function () { get_questions(true); }

            get_questions(false);
        },

        get_selected: function () {
            var that = this;

            var obj = {};

            for (var id in that.Objects.TagQuestions) {
                if (that.Objects.TagQuestions[id].Checkbox.checked)
                    obj[id] = that.Objects.TagQuestions[id].Question;
            }

            for (var id in that.Objects.AllQuestions) {
                if (that.Objects.AllQuestions[id].Checkbox.checked)
                    obj[id] = that.Objects.AllQuestions[id].Question;
            }

            var ret = [];

            for (var id in obj) ret.push(obj[id]);

            return ret;
        }
    }
})();