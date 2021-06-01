(function () {
    if (window.QATagViewer) return;

    window.QATagViewer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            Tag: params.Tag || {}
        };

        this.Options = {
            Count: 20
        };

        var that = this;
        
        GlobalUtilities.load_files(["API/QAAPI.js", "QA/QuestionMini.js", "QA/QATags.js"], {
            OnLoad: function () { that.initialize(); }
        });
    }

    QATagViewer.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var url = RVAPI.NodePageURL({ NodeID: that.Objects.Tag.ID });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Link: url,
                    Style: "font-weight:bold; font-size:2rem;" +
                        "margin:1rem 0rem 2rem 0rem; text-align:center;",
                    Childs: [{ Type: "text", TextValue: that.Objects.Tag.Name }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "tags",
                    Style: "margin-bottom:2rem; display:none;",
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center", 
                    Style: "margin:0rem;", Name: "questions"
                }
            ], that.Container);
            
            that.related_tags(elems["tags"]);
            that.all_questions(elems["questions"]);
        },

        related_tags: function (container) {
            var that = this;

            var count = 20;
            var found = null;
            var searched = null;

            var _do = function () {
                var used = {};
                var arr = [];

                for (var i = 0, lnt = Math.max(found.length, searched.length) ; i < lnt; ++i) {
                    if (arr.length >= count) break;

                    if ((found.length > i) && !used[found[i].NodeID] &&
                        (found[i].NodeID != that.Objects.Tag.ID)) {
                        arr.push(found[i]);
                        used[found[i].NodeID] = true;
                    }

                    if ((searched.length > i) && !used[searched[i].NodeID] &&
                        (searched[i].NodeID != that.Objects.Tag.ID)) {
                        arr.push(searched[i]);
                        used[searched[i].NodeID] = true;
                    }
                }

                if (arr.length > 0) jQuery(container).fadeIn(500);

                new QATags(container, { Tags: arr });
            }

            QAAPI.FindRelatedTags({
                NodeID: that.Objects.Tag.ID, Count: count, LowerBoundary: 0, ParseResults: true,
                ResponseHandler: function (result) {
                    found = (result || {}).Nodes || [];
                    if (GlobalUtilities.get_type(searched) == "array") _do();
                }
            });

            QAAPI.GroupQuestionsByRelatedNodes({
                SearchText: Base64.encode(that.Objects.Tag.Name), Count: count, LowerBoundary: 0, ParseResults: true,
                ResponseHandler: function (result) {
                    searched = (result || {}).Nodes || [];
                    if (GlobalUtilities.get_type(found) == "array") _do();
                }
            });
        },

        all_questions: function (container) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", InnerTitle: RVDic.Search,
                            Style: "width:100%; margin-bottom:1rem; display:none;", Name: "searchInput",
                            Attributes: [{ Name: "type", Value: "text" }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 RevTextAlign", Style: "padding:0rem 0.5rem;",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-search fa-2x rv-icon-button", Style: "margin-bottom:1rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        var btn = this;
                                        jQuery(btn).fadeOut(500, function () {
                                            jQuery(btn.parentNode).remove();
                                            jQuery(elems["searchInput"]).fadeIn(500, function () { this.focus(); });
                                        });
                                    }
                                }
                            ]
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
            var count = that.Options.Count;
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
                    NodeID: that.Objects.Tag.ID, SearchText: Base64.encode(searchText),
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

                        for (var i = 0, lnt = questions.length; i < lnt; ++i)
                            that.add_question(questionsArea, questions[i]);

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

        add_question: function (container, question) {
            var that = this;

            new QuestionMini(container, question, { HideSender: true });
        }
    }
})();