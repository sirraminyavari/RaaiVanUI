(function () {
    if (window.KnowledgeFeedback) return;

    window.KnowledgeFeedback = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsContainer: null
        }

        this.Objects = {
            KnowledgeID: params.KnowledgeID || params.NodeID,
            Type: params.Type,
            Feedbacks: null,
            MineStatus: false
        }

        this.Options = {
            OnTotalChange: params.OnTotalChange || function () { }
        }

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["KnowledgeAPI", "UsersAPI"]}], {
            OnLoad: function () { that._preinit(); }
        });
    },

    KnowledgeFeedback.prototype = {
        _preinit: function () {
            var that = this;

            KnowledgeAPI[that.Objects.Type == "Financial" ? "GetFinancialFeedBacks" : "GetTemporalFeedBacks"]({
                KnowledgeID: that.Objects.KnowledgeID, ParseResults: true,
                ResponseHandler: function (result) { that._initialize(that.Objects.Feedbacks = result.FeedBacks); }
            });
        },

        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var feedbacksTitle = RVDic.KW.AllFeedbacks.replace("[type]", RVDic.KW[that.Objects.Type]);
            var otherFeedbacksTitle = RVDic.KW.MyFeedbacks.replace("[type]", RVDic.KW[that.Objects.Type]);

            var show = function (mineStatus) {
                var mine = that.Objects.MineStatus = !!(mineStatus);

                feedbacksTitle = (mine ? RVDic.KW.MyFeedbacks : RVDic.KW.AllFeedbacks).replace("[type]", RVDic.KW[that.Objects.Type]);
                otherFeedbacksTitle = (mine ? RVDic.KW.AllFeedbacks : RVDic.KW.MyFeedbacks).replace("[type]", RVDic.KW[that.Objects.Type]);

                elems["itemsArea"].innerHTML = "";

                for (var i = 0, lnt = (that.Objects.Feedbacks || []).length; i < lnt; ++i)
                    that.add_item(that.Objects.Feedbacks[i]);

                that.empty_message(elems["itemsArea"]);
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_RevFloat + ":2.5rem;" +
                        ((window.RVGlobal || {}).IsAuthenticated ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "div", Class: "RevTextAlign",
                            Style: "position:absolute; bottom:0rem;" + RV_RevFloat + ":0.2rem; width:2rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-plus fa-lg rv-icon-button", Tooltip: RVDic.KW.NewFeedback,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { that.new_feedback(); } }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-border-radius-quarter", Name: "title",
                                    Style: "cursor:pointer; font-weight:bold; padding:0.3rem;",
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.classList.add("ActionButton"); this.innerHTML = otherFeedbacksTitle; } },
                                        { Name: "onmouseout", Value: function () { this.classList.remove("ActionButton"); this.innerHTML = feedbacksTitle; } },
                                        { Name: "onclick", Value: function () { show(!that.Objects.MineStatus); this.classList.remove("ActionButton"); } }
                                    ],
                                    Childs: [{ Type: "text", TextValue: feedbacksTitle }]
                                },
                            ]
                        }
                    ]
                },
                { Type: "hr", Class: "small-12 medium-12 large-12" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" }
            ], that.ContainerDiv);

            that.Interface.ItemsContainer = elems["itemsArea"];

            show();
        },

        empty_message: function (itemsArea) {
            var that = this;

            if (itemsArea.getElementsByTagName("div").length > 0) return;

            that.__EmptyMessageDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                    Style: "text-align:center; font-weight:bold; color:gray;",
                    Childs: [{ Type: "text", TextValue: RVDic.KW.NoFeedbacks }]
                }
            ], itemsArea)["_div"];
        },

        add_item: function (feedback, add2Top) {
            var that = this;

            var feedbackType = feedback.FeedBackType || "";
            var senderFullName = Base64.decode(feedback.FirstName) + " " + Base64.decode(feedback.LastName);
            var senderUserName = Base64.decode(feedback.UserName || "");
            var value = +(feedback.Value || "0");
            if (isNaN(value)) value = 0;
            var sendDate = feedback.SendDate || "";
            var profileImageUrl = feedback.ProfileImageURL || "";
            var editable = feedback.Editable === true ? true : false;

            if (that.Objects.MineStatus && !feedback.Mine) return;

            if ((that.__EmptyMessageDiv || {}).parentNode) that.__EmptyMessageDiv.parentNode.removeChild(that.__EmptyMessageDiv);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white SoftBorder",
                    Style: "padding:0.5rem; margin-top:0.3rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding-" + RV_Float + ":5rem; padding-" + RV_RevFloat + ":2rem; position:relative;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter",
                                            Link: UsersAPI.UserPageURL({ UserID: feedback.UserID }),
                                            Style: "width:4rem; height:4rem;",
                                            Attributes: [{ Name: "src", Value: profileImageUrl }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "RevTextAlign",
                                    Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;" +
                                        "width:2rem; " + (editable ? "" : "display:none;"),
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                            Tooltip: RVDic.Remove, Name: "removeButton",
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [{ Type: "text", TextValue: senderFullName }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-top:0.6rem; color:rgb(200, 200, 200);",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(feedback.Description || "") }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; font-size:0.6rem; color:green;",
                                    Childs: [{ Type: "text", TextValue: sendDate }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.6rem; font-weight:bold;" + 
                                        "margin-" + RV_RevFloat + ":1rem;",
                                    Childs: [{ Type: "text", TextValue: value + " " + RVDic.KW[(that.Objects.Type == "Financial" ? "CurrencyUnit" : "TimeUnit")] }]
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.ItemsContainer);

            if (add2Top) that.Interface.ItemsContainer.insertBefore(elems["container"], that.Interface.ItemsContainer.firstChild);

            var processing = false;

            elems["removeButton"].onclick = function () {
                if (processing) return;

                GlobalUtilities.confirm(RVDic.KW.FeedbackRemoveConfirm, function (r) {
                    if (!r) return;

                    processing = true;

                    KnowledgeAPI.RemoveFeedBack({ FeedBackID: feedback.FeedBackID, ParseResults: true,
                        ResponseHandler: function (result) {
                            processing = false;

                            if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                            var arr = [];
                            for (var i = 0, lnt = (that.Objects.Feedbacks || []).length; i < lnt; ++i)
                                if (that.Objects.Feedbacks[i].FeedBackID != feedback.FeedBackID) arr.push(that.Objects.Feedbacks[i]);
                            that.Objects.Feedbacks = arr;

                            if (elems["container"].parentNode) elems["container"].parentNode.removeChild(elems["container"]);

                            that.Options.OnTotalChange(-1 * value);
                        }
                    });
                })
            }
        },

        new_feedback: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; margin-bottom:1rem; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic.KW[that.Objects.Type == "Financial" ? "NewFinancialFeedback" : "NewTemporalFeedback"] }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-6 large-4",
                            Style: "font-weight:bold; font-size:0.8rem; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [{ Type: "text", TextValue: RVDic.KW[that.Objects.Type == "Financial" ? "FinancialFeedbackValue" : "TemporalFeedbackValue"] + ":" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-6 large-8",
                            Childs: [{ Type: "number", Class: "rv-input", Style: "width:100%;", Params: { Float: true }, Name: "value" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-top:1rem;", Name: "descriptionArea"
                        },
                        {
                            Type: "div", Class: "small-10 medium-6 large-5 row", Style: "margin:0rem auto;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-5 large-5 ActionButton",
                                    Style: "font-weight:bold; margin-top:1rem;", Name: "confirmButton",
                                    Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                                },
                                { Type: "div", Class: "small-12 medium-2 large-2" },
                                {
                                    Type: "div", Class: "small-12 medium-5 large-5 ActionButton",
                                    Style: "font-weight:bold; margin-top:1rem;",
                                    Properties: [{ Name: "onclick", Value: function () { showedDiv.Close(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            var showedDiv = GlobalUtilities.show(elems["container"]);

            var descInput = new AdvancedTextArea({ ContainerDiv: elems["descriptionArea"], DefaultText: RVDic.Description + "..." });

            var processing = false;

            elems["confirmButton"].onclick = function () {
                if (processing) return;

                var feedbackValue = +elems["value"].value;
                var description = GlobalUtilities.trim(descInput.get_data());

                if (isNaN(feedbackValue) || feedbackValue <= 0) return alert(RVDic.KW.FeedbackValueMustBePositiveNumber);
                else if (!description) return alert(RVDic.KW.FeedbackDescriptionCannotBeEmpty);

                processing = true;

                KnowledgeAPI[that.Objects.Type == "Financial" ? "FinancialFeedBack" : "TemporalFeedBack"]({
                    KnowledgeID: that.Objects.KnowledgeID, Value: feedbackValue,
                    Description: Base64.encode(description), ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;

                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var arr = [result.FeedBack];
                        for (var i = 0, lnt = (that.Objects.Feedbacks || []).length; i < lnt; ++i)
                            arr.push(that.Objects.Feedbacks[i]);
                        that.Objects.Feedbacks = arr;

                        showedDiv.Close();
                        that.add_item(result.FeedBack, true);
                        that.Options.OnTotalChange(feedbackValue);
                    }
                });
            };
        }
    }
})();