(function () {
    if (window.KnowledgeWorkFlow) return;

    window.KnowledgeWorkFlow = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        
        this.Objects = {
            NodeID: params.NodeID,
            AdditionalID: params.AdditionalID,
            NodeName: params.NodeName,
            Creator: params.Creator || {},
            Status: params.Status || "Personal", // Personal | SentToAdmin | SentBackForRevision | SentToEvaluators | Rejected | Accepted
            AdminType: params.AdminType || "",
            HasAdmin: (params.AdminType == "AreaAdmin" || params.AdminType == "ComplexAdmin") ?
                !!(((params.AdminArea || {}).Value || {}).NodeID || params.AdminAreaID) : true,
            EvaluationNeeded: params.EvaluationNeeded === true,
            Evaluators: params.Evaluators || "",
            PreEvaluateByOwner: params.PreEvaluateByOwner === true,
            ForceEvaluatorsDescribe: params.ForceEvaluatorsDescribe === true,
            PreEvaluated: params.PreEvaluated === true,
            UnhideEvaluators: params.UnhideEvaluators === true,
            UnhideEvaluations: params.UnhideEvaluations === true,
            UnhideNodeCreators: params.UnhideNodeCreators === true,
            TextOptions: {},
            IsRegisterer: params.IsRegisterer === true,
            IsContributor: params.IsContributor === true,
            IsAreaAdmin: params.IsAreaAdmin === true,
            IsEvaluator: params.IsEvaluator === true,
            HasEvaluated: params.HasEvaluated === true,
            EvaluationsEditable: params.EvaluationsEditable === true,
            EvaluationsEditableForAdmin: params.EvaluationsEditableForAdmin === true,
            IsFreeUser: params.IsFreeUser === true,
            IsServiceAdmin: params.IsServiceAdmin === true,
            IsSystemAdmin: params.IsSystemAdmin === true,
            IsDirector: params.IsDirector === true,
            KWFPermission: params.KWFPermission === true,
            Searchable: params.Searchable === true,
            Publicated: params.Status == "Accepted",
            NodeSelectType: params.NodeSelectType || "",
            DescriptionArea: null
        };
        
        try {
            this.Objects.TextOptions = JSON.parse(Base64.decode(params.TextOptions) || "{}");

            for (var key in this.Objects.TextOptions)
                this.Objects.TextOptions[key] = (this.Objects.TextOptions[key] || []).map(function (val) { return Base64.decode(val); });
        }
        catch (e) { }
        
        this.Options = {
            Close: params.Close,
            HasAdminArea: params.HasAdminArea || function () { return false; },
            OnStatusChange: params.OnStatusChange || function () { }
        };

        var that = this;

        GlobalUtilities.load_files(["API/KnowledgeAPI.js", "Public/NameDialog.js"], { OnLoad: function () { that.reset(); } });
    }

    KnowledgeWorkFlow.prototype = {
        reset: function () {
            var that = this;
            var objs = that.Objects;
            var descNeeded = false;
            var buttons = [];
            
            that.ContainerDiv.innerHTML = "";
            that.Objects.DescriptionArea = null;

            var rejectList = null;
            var revisionList = null;
            
            var _isPersonal = function () {
                return ["Personal", "SentBackForRevision", "Rejected"].some(function (val) { return val == objs.Status; });
            };

            var _isAdmin = objs.IsSystemAdmin || objs.IsServiceAdmin || objs.IsAreaAdmin || objs.IsDirector;
            var _isSuperAdmin = objs.IsSystemAdmin || objs.IsServiceAdmin;

            var _succeed = function (result) {
                if (result.Status) {
                    that.Objects.Status = result.Status;
                    that.Options.OnStatusChange({ Status: that.Objects.Status });
                }

                if (typeof (result.Publicated) != "undefined")
                    that.Objects.Publicated = result.Publicated === true;
                if (typeof (result.Searchable) != "undefined")
                    that.Objects.Searchable = result.Searchable === true;
                if (typeof (result.IsEvaluator) != "undefined")
                    that.Objects.IsEvaluator = result.IsEvaluator === true;
                if (typeof (result.HasEvaluated) != "undefined")
                    that.Objects.HasEvaluated = result.HasEvaluated === true;
                that.reset();
            };

            //show evaluation form
            var _show_evaluation_form = function (container, afterConfirm) {
                GlobalUtilities.loading(container);

                GlobalUtilities.load_files(["KW/EvaluationForm.js"], {
                    OnLoad: function () {
                        var _onconfirm = function (result, val) {
                            if (afterConfirm) afterConfirm();
                            _succeed(result);
                        };

                        new EvaluationForm(container, {
                            NodeID: that.Objects.NodeID,
                            Creator: that.Objects.Creator,
                            PreEvaluated: that.Objects.PreEvaluateByOwner && that.Objects.PreEvaluated,
                            ForceEvaluatorsDescribe: that.Objects.ForceEvaluatorsDescribe,
                            TextOptions: that.Objects.TextOptions,
                            OnConfirm: _onconfirm,
                            OnRefuse: _onconfirm,
                            OnClose: function () { if (that.Options.Close) that.Options.Close(); }
                        });
                    }
                });
            }
            
            //if (that.Objects.IsEvaluator && !_isAdmin) return _show_evaluation_form(that.ContainerDiv);
            //show evaluation form
            
            var _send_request = function (apiFunc) {
                if (GlobalUtilities.get_type(apiFunc) == "function") return apiFunc();

                var desc = that.Objects.DescriptionArea ? Base64.encode(that.Objects.DescriptionArea.get_data()) : null;

                var rejectArr = !rejectList || ((apiFunc.toLowerCase().indexOf("reject") < 0) && !!revisionList) ? null :
                    (rejectList.get_items() || []).map(function (val) { return Base64.encode(val.Title); });
                var revisionArr = !revisionList || ((apiFunc.toLowerCase().indexOf("reject") >= 0) && !!rejectList) ? null :
                    (revisionList.get_items() || []).map(function (val) { return Base64.encode(val.Title); });

                KnowledgeAPI[apiFunc]({
                    NodeID: that.Objects.NodeID,
                    TextOptions: (rejectArr || revisionArr || []).join('|'),
                    Description: desc, ParseResults: true,
                    ResponseHandler: function (result) {
                        GlobalUtilities.unblock(that.ContainerDiv);

                        if (result.ErrorText) {
                            var msg = RVDic.MSG[result.ErrorText] || result.ErrorText;

                            if (result.NecessaryItems) {
                                msg = "<div style='font-weight:bold; margin-bottom:0.6rem;'>" +
                                    RVDic.KW.KnowledgeTypeSettings.NecessaryItems.CheckMessage + ":" + "</div>";

                                for (var i = 0, lnt = result.NecessaryItems.length; i < lnt; ++i)
                                    msg += "<div>" + "<span style='color:red; margin-" + window.RV_RevFloat + ":0.3rem;'>" + "-" + "</span>" +
                                        RVDic.KW.KnowledgeTypeSettings.NecessaryItems[result.NecessaryItems[i]] + "</div>";
                            }

                            alert(msg, { Timeout: 20000 });
                        }
                        else if (result.Succeed) {
                            alert(RVDic.MSG[result.Succeed] || result.Succeed);
                            _succeed(result);
                        }
                        else if (result.ShowEvaluationForm) {
                            var _div = GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                                    Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor"
                                }
                            ])["_div"];

                            var _showed = GlobalUtilities.show(_div);

                            _show_evaluation_form(_div, function () {
                                that.Objects.PreEvaluated = true;
                                _showed.Close();
                                _send_request(apiFunc);
                            });
                        }
                    }
                });
            };

            var _add_button = function (p) {
                p = p || {};

                var _click = function () {
                    if (p.OnClick) p.OnClick();
                    var apiFunc = p.APIFunction;
                    if (!apiFunc) return;
                    
                    GlobalUtilities.block(that.ContainerDiv);
                    
                    if (objs.HasAdmin || that.Options.HasAdminArea()) return _send_request(apiFunc);
                    
                    var _div = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                        }
                    ])["_div"];

                    GlobalUtilities.loading(_div);

                    var showedDiv = GlobalUtilities.show(_div, {
                        OnClose: function () { GlobalUtilities.unblock(that.ContainerDiv); }
                    });

                    GlobalUtilities.load_files(["CN/AdminAreaSelect.js"], {
                        OnLoad: function () {
                            that.__AdminSelect = new AdminAreaSelect(_div, {
                                NodeID: that.Objects.NodeID,
                                AdminType: that.Objects.AdminType,
                                OnSelect: function (node) {
                                    that.Objects.HasAdmin = true;
                                    showedDiv.Close();

                                    _send_request(apiFunc);
                                },
                                OnCancel: function () {
                                    showedDiv.Close();
                                    GlobalUtilities.unblock(that.ContainerDiv);
                                }
                            });
                        }
                    });
                };

                buttons.push({
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "padding:0.3rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-circle rv-air-button",
                            Properties: [{ Name: "onclick", Value: function () { _click(); } }],
                            Childs: [{ Type: "text", TextValue: p.Title || "" }]
                        }
                    ]
                });
            };
            
            if (_isPersonal()) {
                descNeeded = true;

                if (!objs.Publicated && (_isAdmin || (objs.IsRegisterer && objs.IsFreeUser)) && (that.Objects.Status != "Rejected"))
                    _add_button({ Title: RVDic.KW.EvaluationNotNeeded, APIFunction: "AcceptKnowledge" });

                if (_isSuperAdmin || objs.IsRegisterer) _add_button({
                    Title: that.Objects.Status == "Rejected" ? RVDic.KW.ResendToAdmin : RVDic.KW.SendToAdmin,
                    APIFunction: "SendToAdmin"
                });
            }

            if (that.Objects.PreEvaluated) {
                var theUser = that.get_history_user(that.Objects.Creator, { IsCreator: true, IsEvaluator: false });

                _add_button({
                    Title: RVDic.KW.ViewSelfEvaluationForm,
                    OnClick: function () { that.show_filled_evaluation_form(theUser); }
                });
            }

            var textOptionsNeeded = false;

            if ((objs.Status == "SentToAdmin") && _isAdmin && objs.EvaluationNeeded) {
                descNeeded = textOptionsNeeded = true;

                _add_button({ Title: RVDic.KW.Reject, APIFunction: "RejectKnowledge" });

                _add_button({ Title: RVDic.KW.SendBackForRevision, APIFunction: "SendBackForRevision" });

                var sendToEvaluatorsTitle = that.Objects.Evaluators == "KnowledgeAdmin" ?
                    RVDic.ConfirmAndContinue : RVDic.KW.SendToEvaluators;

                _add_button({ Title: sendToEvaluatorsTitle,
                    APIFunction: function () {
                        var _div = GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                        }])["_div"];

                        GlobalUtilities.loading(_div);

                        var showedDiv = GlobalUtilities.show(_div, {
                            OnClose: function () { GlobalUtilities.unblock(that.ContainerDiv); }
                        });

                        GlobalUtilities.load_files(["KW/KnowledgeEvaluation.js"], {
                            OnLoad: function () {
                                new KnowledgeEvaluation(_div, GlobalUtilities.extend({
                                    Succeed: function (result) {
                                        showedDiv.Close();
                                        _succeed(result);
                                    },
                                    Description: that.Objects.DescriptionArea ? that.Objects.DescriptionArea.get_data() : null
                                }, that.Objects));
                            }
                        });
                    }
                });
            }
            else if ((objs.Status == "SentToAdmin") && _isAdmin && !objs.EvaluationNeeded) {
                descNeeded = true;

                _add_button({ Title: RVDic.KW.Accept, APIFunction: "AcceptKnowledge" });
                _add_button({ Title: RVDic.KW.Reject, APIFunction: "RejectKnowledge" });
            }

            var showEvaluationProcess = (objs.IsRegisterer || objs.IsContributor) && that.Objects.UnhideEvaluations;

            if ((objs.Status == "SentToEvaluators") && (_isAdmin || showEvaluationProcess)) {
                var _evProcessObj = { ShowedDiv: null, Container: null };
                
                _add_button({ Title: (_isAdmin ? RVDic.KW.ManageEvaluationProcess : RVDic.KW.ShowEvaluationProcess),
                    APIFunction: function () {
                        if (_evProcessObj.Container) {
                            _evProcessObj.ShowedDiv = GlobalUtilities.show(_evProcessObj.Container, {
                                OnClose: function () { GlobalUtilities.unblock(that.ContainerDiv); }
                            });
                            
                            return;
                        }

                        _evProcessObj.Container = GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                                Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                            }
                        ])["_div"];

                        GlobalUtilities.loading(_evProcessObj.Container);

                        _evProcessObj.ShowedDiv = GlobalUtilities.show(_evProcessObj.Container, {
                            OnClose: function () { GlobalUtilities.unblock(that.ContainerDiv); }
                        });

                        GlobalUtilities.load_files(["KW/ManageKnowledgeEvaluators.js"], {
                            OnLoad: function () {
                                new ManageKnowledgeEvaluators(_evProcessObj.Container, GlobalUtilities.extend({}, that.Objects, {
                                    NodeID: that.Objects.NodeID, Editable: _isAdmin,
                                    OnTerminate: function (result) {
                                        _evProcessObj.ShowedDiv.Close();
                                        _succeed(result);
                                    },
                                    OnDetailRequest: function (d) {
                                        var theUser = that.get_history_user(d.User, { IsCreator: false, IsEvaluator: false });
                                        that.show_filled_evaluation_form(theUser);
                                    }
                                }));
                            }
                        });
                    }
                });

                //if (_isAdmin) _add_button({ Title: RVDic.KW.TerminateEvaluation, APIFunction: "TerminateEvaluation" });
            }
            
            if (!that.Objects.Publicated && that.Objects.IsEvaluator) {
                var _evaluationObj = { ShowedDiv: null, Container: null };

                if (!that.Objects.HasEvaluated || that.Objects.EvaluationsEditable) {
                    _add_button({
                        Title: that.Objects.HasEvaluated ? RVDic.KW.EditEvaluation : RVDic.KW.DoEvaluation,
                        APIFunction: function () {
                            if (_evaluationObj.Container) {
                                _evaluationObj.ShowedDiv = GlobalUtilities.show(_evaluationObj.Container, {
                                    OnClose: function () { GlobalUtilities.unblock(that.ContainerDiv); }
                                });

                                return;
                            }

                            _evaluationObj.Container = GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                                    Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor"
                                }
                            ])["_div"];

                            _evaluationObj.ShowedDiv = GlobalUtilities.show(_evaluationObj.Container, {
                                OnClose: function () { GlobalUtilities.unblock(that.ContainerDiv); }
                            });

                            _show_evaluation_form(_evaluationObj.Container, function () { _evaluationObj.ShowedDiv.Close(); });
                        }
                    });
                }

                _add_button({
                    Title: RVDic.SendComment,
                    OnClick: function () { that.new_comment(null, null, function () { that.reset(); }); }
                });
            }

            var hasStatus = that.Objects.Status && RVDic.CN[that.Objects.Status];
            
            var elems = buttons.length == 0 ? {} : GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "status",
                            Style: "text-align:center; font-weight:bold; font-size:1rem; margin-bottom:1rem;" +
                                (hasStatus ? "" : "display:none;"),
                            Childs: [{ Type: "text", TextValue: RVDic.Status + ": " + RVDic.CN[that.Objects.Status] }]
                        },
                        (!textOptionsNeeded || !((that.Objects.TextOptions || {}).Revision || []).length ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "revisionOptions", Style: "margin-bottom:1rem;"
                        }),
                        (!textOptionsNeeded || !((that.Objects.TextOptions || {}).Reject || []).length ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "rejectOptions", Style: "margin-bottom:1rem;"
                        }),
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:none; margin-bottom:1rem;", Name: "textarea"
                        },
                        {
                            Type: "div", Name: "buttonsArea", Style: "margin:0rem;",
                            Class: "small-12 medium-12 large-12 row align-center",
                            Childs: buttons
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "historyArea" }
                    ]
                }
            ], that.ContainerDiv);

            if (elems["revisionOptions"] || elems["rejectOptions"]) {
                GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                    OnLoad: function () {
                        if (elems["revisionOptions"]) {
                            revisionList = new NewSingleDataContainer(elems["revisionOptions"], {
                                InputStyle: "width:100%; font-size:0.8rem;",
                                InnerTitle: RVDic.KW[elems["rejectOptions"] ? "TextOptionsRevision" : "TextOptionsRejectOrRevision"] + "...",
                                NoButtons: true,
                                ArrayDataSource: that.Objects.TextOptions.Revision.map(function (val) { return [val, val] })
                            });
                        }

                        if (elems["rejectOptions"]) {
                            rejectList = new NewSingleDataContainer(elems["rejectOptions"], {
                                InputStyle: "width:100%; font-size:0.8rem;",
                                InnerTitle: RVDic.KW[elems["revisionOptions"] ? "TextOptionsReject" : "TextOptionsRejectOrRevision"] + "...",
                                NoButtons: true,
                                ArrayDataSource: that.Objects.TextOptions.Reject.map(function (val) { return [val, val] })
                            });
                        }
                    }
                });
            }

            if (elems["textarea"] && descNeeded && (that.Objects.Status != "SentToEvaluators")) {
                elems["textarea"].style.display = "block";

                that.Objects.DescriptionArea = new AdvancedTextArea({
                    ContainerDiv: elems["textarea"], DefaultText: RVDic.Description + "...", QueryTemplate: "RelatedThings",
                    ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
                });
            }

            if ((_isAdmin /* && !_isPersonal() */) || that.Objects.IsEvaluator || that.Objects.KWFPermission) {
                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "header", Class: "small-12 medium-12 large-12", Name: "line",
                        Style: (buttons.length ? "margin-top:1rem;" : "") + "display:none;", Params: { Title: RVDic.History }
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "histArea" }
                ], buttons.length == 0 ? that.ContainerDiv : elems["historyArea"]);

                var histArea = _el["histArea"];

                GlobalUtilities.loading(histArea);
                
                KnowledgeAPI.GetHistory({
                    KnowledgeID: that.Objects.NodeID, ParseResults: true,
                    ResponseHandler: function (results) {
                        console.log(results);
                        histArea.innerHTML = "";
                        
                        if ((results || []).length) jQuery(_el["line"]).fadeIn(500);
                        
                        (results || []).forEach(function (val) { that.add_history(histArea, val); });
                    }
                });
            }
        },

        get_history_user: function (user, options) {
            var that = this;

            user = user || {};
            options = options || {};

            var isAdmin = that.Objects.IsDirector || that.Objects.IsSystemAdmin || that.Objects.IsServiceAdmin;
            var iAmActor = ((window.RVGlobal || {}).CurrentUser || {}).UserID == user.UserID;
            
            var hideUser = !isAdmin && !iAmActor && (
                (options.IsEvaluator && !that.Objects.UnhideEvaluators) ||
                (options.IsCreator && !that.Objects.UnhideNodeCreators)
            );

            return {
                UserID: user.UserID,
                FullName: hideUser ? (options.IsCreator ? RVDic.Creator : RVDic.Evaluator) :
                    Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName),
                PageURL: hideUser ? null : UsersAPI.UserPageURL({ UserID: user.UserID }),
                ImageURL: hideUser ? GlobalUtilities.icon("unknown.jpg") : user.ProfileImageURL || user.ImageURL
            };
        },

        add_history: function (container, history) {
            var that = this;

            var isEvaluation = history.Action == "Evaluation";
            var isTemination = history.Action == "TerminateEvaluation";
            var isComment = history.Action == "Comment";
            var isAdmin = that.Objects.IsDirector || that.Objects.IsSystemAdmin || that.Objects.IsServiceAdmin;
            var iAmActor = ((window.RVGlobal || {}).CurrentUser || {}).UserID == history.Actor.UserID;
            var isCreator = history.IsCreator || history.IsContributor;
            var isEvaluator = isEvaluation || (isComment && !isCreator);
            var isSenderCreator = ["SendToAdmin", "Comment"].some(function (x) { return history.Action == x; }) && isCreator;
            
            var isInEvaluation = that.Objects.Status == "SentToEvaluators";

            var user = that.get_history_user(history.Actor, { IsEvaluator: isEvaluator, IsCreator: isSenderCreator });

            if (!isAdmin && isEvaluation && !that.Objects.UnhideEvaluations) return;
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Childs: [
                    {
                        Type: "div",
                        Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow",
                        Style: "margin-top:0.5rem; position:relative; padding:0.5rem;" +
                            "padding-bottom:0.3rem; padding-" + RV_Float + ":4rem;",
                        Childs: [
                            (!isAdmin || isEvaluation || isTemination ? null : {
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.5rem; font-size:0.7rem; padding:0.1rem 0.3rem;",
                                Properties: [{
                                    Name: "onclick",
                                    Value: function () {
                                        that.edit_history_dialog(history, function (d) {
                                            history.Description = Base64.encode(d);
                                            set_desc();
                                        });
                                    }
                                }],
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-pencil", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    },
                                    { Type: "text", TextValue: RVDic.Edit }
                                ]
                            }),
                            {
                                Type: "div", Style: "position:absolute; top:0.5rem;" + RV_Float + ":0.5rem; width:3.5rem;",
                                Childs: [{
                                    Type: "img", Class: "rv-border-radius-quarter", Link: user.PageURL,
                                    Style: "width:3rem; height:3rem;" + (!user.PageURL ? "" : "cursor:pointer") + ";",
                                    Attributes: [{ Name: "src", Value: user.ImageURL }]
                                }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 WarmColor", Style: "font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: user.FullName }]
                            },
                            (!(history.TextOptions || []).length ? null : {
                                Type: "div", Class: "small-12 medium-12 large-12", Style: "margin:0.3rem 0 0.5rem 0;",
                                Childs: history.TextOptions.map(function (to) {
                                    return {
                                        Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow SoftBorder",
                                        Style: "display:inline-block; margin:0.3rem; padding:0.3rem;" +
                                            "border-color:rgb(220,220,220); font-size:0.7rem; margin-" + RV_Float + ":0;",
                                        Childs: [{ Type: "text", TextValue: Base64.decode(to) }]
                                    };
                                })
                            }),
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "min-height:1.5rem; margin:0.5rem 0;", Name: "descArea"
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                                Childs: [
                                    {
                                        Type: "div", Class: "Direction TextAlign WarmColor",
                                        Style: "display:inline-block; font-size:0.7rem;",
                                        Childs: [{ Type: "text", TextValue: history.ActionDate }]
                                    },
                                    {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; font-size:0.6rem; font-weight:bold;" +
                                            "margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.3rem; cursor:default;",
                                        Childs: [{ Type: "text", TextValue: RVDic.KW[history.Action] || RVDic[history.Action] || history.Action }]
                                    },
                                    (!(history.Evaluation || {}).Score ? null : {
                                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                        Style: "display:inline-block; font-size:0.6rem; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.3rem;",
                                        Properties: [{ Name: "onclick", Value: function () { that.show_filled_evaluation_form(user, history.WFVersionID); } }],
                                        Childs: [{ Type: "text", TextValue: RVDic.Score + ": " + Number(history.Evaluation.Score.toFixed(2)) }]
                                    }),
                                    (!(history.Deputy || {}).UserID ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; font-size:0.6rem; font-weight:bold;" +
                                            "margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.3rem; cursor:default;",
                                        Childs: [{ Type: "text", TextValue: RVDic.KW.EditedByAdmin }]
                                    }),
                                    (!isComment || !isInEvaluation ? null : {
                                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                        Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-size:0.7rem;",
                                        Properties: [{
                                            Name: "onclick", Value: function () {
                                                that.new_comment(history.ID, null, function () { that.reset(); });
                                            }
                                        }],
                                        Childs: [{ Type: "text", TextValue: RVDic.Reply }]
                                    }),
                                    (!isComment || !isInEvaluation || !iAmActor ? null : {
                                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                        Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-size:0.7rem;",
                                        Properties: [{
                                            Name: "onclick", Value: function () {
                                                that.new_comment(history.ID, Base64.decode(history.Description), function (data) {
                                                    history.Description = Base64.encode((data || {}).Description);
                                                    set_desc();
                                                });
                                            }
                                        }],
                                        Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                                    })
                                ]
                            }
                        ]
                    },
                    (!(history.Sub || []).length ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "padding-" + RV_Float + ":1rem;", Name: "sub"
                    })
                ]
            }], container);

            var set_desc = function () {
                elems["descArea"].innerHTML = "";
                GlobalUtilities.append_markup_text(elems["descArea"], Base64.decode(history.Description));
            };

            set_desc();
            
            (history.Sub || []).reverse().forEach(function (u) { that.add_history(elems["sub"], u); });
        },

        /**
         * @param {any} historyId
         * @param {any} commentBody //if commentBody has value, it means that the user wants to edit their comment
         * @param {any} done
         */
        new_comment: function (historyId, commentBody, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "desc" },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6 rv-air-button rv-circle",
                            Style: "margin:1rem auto 0rem auto; padding-right:2rem; padding-left:2rem;", Name: "send",
                            Childs: [{ Type: "text", TextValue: RVDic.Send }]
                        }
                    ]
                }
            ]);

            var descObj = new AdvancedTextArea({
                ContainerDiv: elems["desc"], DefaultText: RVDic.WhatDoYouThink + "...", QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            if (commentBody) {
                commentBody = GlobalUtilities.trim(commentBody);
                descObj.set_data(commentBody);
            }

            var showed = GlobalUtilities.show(elems["container"]);

            var processing = false;

            elems["send"].onclick = function () {
                var text = !descObj ? null : GlobalUtilities.trim(descObj.get_data());

                if (!text || processing) return;
                processing = true;

                KnowledgeAPI[commentBody ? "EditKnowledgeComment" : "SendKnowledgeComment"]({
                    ID: commentBody ? historyId : null,
                    NodeID: that.Objects.NodeID, Description: Base64.encode(text),
                    ReplyToHistoryID: commentBody ? null : historyId, ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;
                        
                        if (result.ErrorText)
                            return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            showed.Close();
                            if (done) done({ Description: text });
                        }
                    }
                });
            };
        },

        show_filled_evaluation_form: function (user, wfVersionId) {
            var that = this;

            user = user || {};
            
            var _div = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "_div"
            }])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);
            
            GlobalUtilities.load_files(["KW/FilledEvaluationForm.js"], {
                OnLoad: function (result) {
                    new FilledEvaluationForm(_div, {
                        NodeID: that.Objects.NodeID,
                        AdditionalID: that.Objects.AdditionalID,
                        NodeName: that.Objects.NodeName,
                        Creator: !that.Objects.Creator ? null :
                            that.get_history_user(that.Objects.Creator, { IsCreator: true, IsEvaluator: false }),
                        Evaluator: user,
                        WFVersionID: wfVersionId
                    });
                }
            });
        },

        edit_history_dialog: function (history, done) {
            var that = this;
            
            new NameDialog({
                Title: RVDic.Description, DescriptionMode: true,
                InitialValue: Base64.decode(history.Description),
                ModificationDetection: true,
                OnActionCall: function (value, callback) {
                    KnowledgeAPI.EditHistoryDescription({
                        ID: history.ID, Description: Base64.encode(value), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                            done(value);

                            callback(!result.ErrorText);
                        }
                    });
                }
            });
        }
    }
})();