(function () {
    if (window.ManageKnowledgeEvaluators) return;

    window.ManageKnowledgeEvaluators = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsContainer: null
        };

        this.Objects = GlobalUtilities.extend({
            NodeID: null,
            Creator: null,
            Evaluators: null,
            ExistingEvaluators: {},
            UnhideEvaluators: false,
            EvaluationsEditableForAdmin: false
        }, params);
        
        this.Options = {
            Editable: params.Editable === true,
            OnTerminate: params.OnTerminate,
            OnDetailRequest: params.OnDetailRequest
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["KnowledgeAPI", "UsersAPI"] }], {
            OnLoad: function () { that._preinit(); }
        });
    }

    ManageKnowledgeEvaluators.prototype = {
        _preinit: function () {
            var that = this;

            KnowledgeAPI.GetEvaluations({
                KnowledgeID: that.Objects.NodeID, ParseResults: true,
                ResponseHandler: function (results) { that._initialize(results); }
            });
        },

        _initialize: function (evaluators) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; margin-bottom:1rem; font-size:1rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.KW.EvaluationProcess }]
                },
                { Type: "header", Class: "small-12 medium-12 large-12", Params: { Title: RVDic.Evaluators } },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" },
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-air-button rv-circle", Name: "terminateEvaluation",
                    Style: "margin:1rem auto 0rem auto;" + (that.Options.Editable ? "" : "display:none;"),
                    Childs: [{ Type: "text", TextValue: RVDic.KW.CurrentEvaluationsAreEnough + ". " + RVDic.KW.TerminateEvaluation }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "selectArea" }
            ], that.ContainerDiv);

            that.Interface.ItemsContainer = elems["itemsArea"];

            that.select_evaluators(elems["selectArea"]);

            for (var i = 0, lnt = (evaluators || []).length; i < lnt; ++i)
                that.add_item(evaluators[i]);

            that.empty_message(elems["itemsArea"]);

            elems["terminateEvaluation"].onclick = function () {
                var btn = this;

                GlobalUtilities.block(btn);

                KnowledgeAPI.TerminateEvaluation({
                    NodeID: that.Objects.NodeID, ParseResults: true,
                    ResponseHandler: function (result) {
                        GlobalUtilities.unblock(btn);

                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            alert(RVDic.MSG[result.Succeed] || result.Succeed);
                            if (that.Options.OnTerminate) that.Options.OnTerminate(result);
                        }
                    }
                });
            };
        },

        empty_message: function (itemsArea) {
            var that = this;

            if (itemsArea.getElementsByTagName("div").length > 0) return;

            that.__EmptyMessageDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; color:gray;", Name: "_div",
                    Childs: [{ Type: "text", TextValue: RVDic.KW.NoEvaluator }]
                }
            ], itemsArea)["_div"];
        },

        add_item: function (evaluation) {
            if (!evaluation) return;
            var that = this;

            evaluation.User = evaluation.User || {};
            
            if ((that.__EmptyMessageDiv || {}).parentNode) that.__EmptyMessageDiv.parentNode.removeChild(that.__EmptyMessageDiv);
            
            var showUser = that.Options.Editable || that.Objects.UnhideEvaluators;

            var fullname = !showUser ? RVDic.Anonymous : Base64.decode(evaluation.User.FirstName) + " " + Base64.decode(evaluation.User.LastName);
            var userPageUrl = !showUser ? null : UsersAPI.UserPageURL({ UserID: evaluation.User.UserID });
            var userImageUrl = !showUser ? GlobalUtilities.icon("Unknown.jpg") : evaluation.User.ProfileImageURL || evaluation.User.ImageURL;

            if (that.Objects.ExistingEvaluators[evaluation.User.UserID]) return;
            that.Objects.ExistingEvaluators[evaluation.User.UserID] = true;

            var removable = that.Options.Editable && (evaluation.Removable === true);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-bg-color-white-softer rv-border-radius-half SoftShadow",
                    Style: "padding:0.5rem; position:relative; padding-" + RV_Float + ":4rem; padding-bottom:0.2rem;" +
                        "margin-bottom:0.3rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.5rem;" + RV_Float + ":0.5rem; width:3.5rem;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-quarter",
                                    Style: "width:3rem; height:3rem;", Link: userPageUrl,
                                    Attributes: [{ Name: "src", Value: userImageUrl }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_RevFloat + ":2rem; min-height:2rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "RevTextAlign",
                                    Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;" +
                                        (removable ? "" : "display:none;"),
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                            Name: "removeButton", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Link: userPageUrl,
                                    Childs: [{ Type: "text", TextValue: fullname }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; color:gray; font-size:0.6rem; font-weight:bold;" +
                                        "margin-" + RV_Float + ":0.5rem;" + (!evaluation.Score ? "" : "display:none;"),
                                    Childs: [{ Type: "text", TextValue: RVDic.NotDone }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; color:green; font-size:0.6rem; margin-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: evaluation.EvaluationDate }]
                                },
                                {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Tooltip: RVDic.Score, Name: "score",
                                    Style: "display:" + (!evaluation.Score ? "none" : "inline-block") + ";" +
                                        "font-size:0.6rem; font-weight:bold; padding:0.1rem 0.5rem;" +
                                        "margin-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: (evaluation.Score ? Number(evaluation.Score).toFixed(2) : "") }]
                                },
                                {
                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "showDetails",
                                    Style: "display:" + (!evaluation.Score ? "none" : "inline-block") + ";" +
                                        "font-size:0.6rem; font-weight:bold; padding:0.1rem 0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.ShowDetails }]
                                },
                                (!that.Objects.EvaluationsEditableForAdmin || !that.Options.Editable || !evaluation.Score ? null : {
                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "edit",
                                    Style: "display:inline-block; font-size:0.6rem; font-weight:bold; padding:0.1rem 0.5rem;" +
                                        "margin-" + RV_RevFloat + ":0.5rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.edit_evaluation_form(evaluation); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                                })
                            ]
                        }
                    ]
                }
            ], that.Interface.ItemsContainer);

            elems["removeButton"].onclick = function () {
                GlobalUtilities.confirm(RVDic.Confirms.RemoveKnowledgeEvaluator, function (r) {
                    if (!r) return;

                    GlobalUtilities.block(elems["container"]);

                    KnowledgeAPI.RemoveEvaluator({
                        NodeID: that.Objects.NodeID, UserID: evaluation.User.UserID,
                        ParseResults: true,
                        ResponseHandler: function (results) {
                            GlobalUtilities.unblock(elems["container"]);

                            if (results.ErrorText) alert(RVDic.MSG[results.ErrorText] || results.ErrorText);
                            else {
                                elems["container"].parentNode.removeChild(elems["container"]);
                                that.Objects.ExistingEvaluators[evaluation.User.UserID] = false;

                                that.empty_message(that.Interface.ItemsContainer);
                            }
                        }
                    });
                });
            };

            elems["score"].onclick = elems["showDetails"].onclick = function () {
                if (that.Objects.OnDetailRequest) that.Objects.OnDetailRequest({ User: evaluation.User });
            };
        },

        select_evaluators: function (container) {
            var that = this;

            if (!that.Options.Editable) return;

            GlobalUtilities.load_files(["KW/KnowledgeEvaluation.js"], {
                OnLoad: function () {
                    var elems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-top:1rem; display:none;", Name: "container",
                            Childs: [
                                {
                                    Type: "header", Class: "small-12 medium-12 large-12",
                                    Params: { Title: RVDic.KW.SelectNewEvaluators }
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                            ]
                        }
                    ], container);

                    new KnowledgeEvaluation(elems["_div"], GlobalUtilities.extend({
                        SelectMode: true,
                        OnUserExist: function () { elems["container"].style.display = "block"; },
                        OnBeforeSave: function (userIds, callback, usrs) {
                            callback(false);

                            var arr = [];

                            for (var i = 0, lnt = (userIds || []).length; i < lnt; ++i)
                                if (!that.Objects.ExistingEvaluators[userIds[i]]) arr.push(userIds[i]);

                            KnowledgeAPI.NewEvaluators({
                                NodeID: that.Objects.NodeID, UserIDs: arr.join("|"), ParseResults: true,
                                ResponseHandler: function (result) {
                                    for (var _id in usrs)
                                        that.add_item(GlobalUtilities.extend({
                                            Removable: true,
                                            User: GlobalUtilities.extend(usrs[_id], {
                                                UserName: Base64.encode(usrs[_id].UserName),
                                                FirstName: Base64.encode(usrs[_id].FirstName),
                                                LastName: Base64.encode(usrs[_id].LastName)
                                            })
                                        }));
                                }
                            });
                        }
                    }, that.Objects));
                }
            });
        },

        edit_evaluation_form: function (evaluation) {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                    Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            var _showed = GlobalUtilities.show(_div);
            
            GlobalUtilities.load_files(["KW/EvaluationForm.js"], {
                OnLoad: function () {
                    new EvaluationForm(_div, {
                        NodeID: that.Objects.NodeID,
                        Creator: that.Objects.Creator,
                        EvaluatorID: (evaluation.User || {}).UserID,
                        PreEvaluated: false,
                        ForceEvaluatorsDescribe: false,
                        TextOptions: that.Objects.TextOptions,
                        OnConfirm: function () { _showed.Close(); },
                        OnClose: function () { _showed.Close(); }
                    });
                }
            });
        }
    }
})();