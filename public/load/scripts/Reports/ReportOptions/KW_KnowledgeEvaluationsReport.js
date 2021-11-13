(function () {
    if (((window.ReportOptions || {}).KW || {}).KnowledgeEvaluationsReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.KW = window.ReportOptions.KW || {};

    window.ReportOptions.KW.KnowledgeEvaluationsReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        
        this.Objects = {
            KnowledgeTypeSelect: null,
            UsersList: null,
            MemberInNodeTypeSelect: null,
            GroupSelect: null,
            SendDateFrom: null,
            SendDateTo: null,
            ActionDateFrom: null,
            ActionDateTo: null,
            DelayFromInput: null,
            DelayToInput: null,
            SeenStatusSelect: null,
            DoneStatusSelect: null,
            CanceledStatusSelect: null,
            Config: GlobalUtilities.extend({
                Groups: [],
                FullAccess: false,
                GroupAdminAccess: false

            }, params.Config)
        };

        this.Options = {
            Modules: params.Modules || {}
        };
        
        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["UsersAPI", "CNAPI"] },
            "SingleDataContainer/NewSingleDataContainer.js",
            "Reports/ReportGroupSelect.js"
        ], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.KW.KnowledgeEvaluationsReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-9 large-7", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.KnowledgeType + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "knowledgeTypeSelect" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-9 large-7", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.Evaluator) + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "usersList" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-9 large-7", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.BeMemberInNodeType + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "memberInNodeTypeSelect" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CreatorGroup + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "groups" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SendDate + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:16rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "sendDateFrom" }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:16rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "sendDateTo" }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.ActionDate + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:16rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "actionDateFrom" }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:16rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "actionDateTo" }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.EvaluationDelay + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:16rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block; width:10rem;",
                                    Childs: [
                                        {
                                            Type: "number", Name: "delayFrom",
                                            Style: "width:100%; text-align:center; font-size:0.7rem;",
                                            Attributes: [{ Name: "placeholder", Value: "(" + RVDic.DaysCount + ")" }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:16rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block; width:10rem;",
                                    Childs: [
                                        {
                                            Type: "number", Name: "delayTo",
                                            Style: "width:100%; text-align:center; font-size:0.7rem;",
                                            Attributes: [{ Name: "placeholder", Value: "(" + RVDic.DaysCount + ")" }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SeenStatus + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:10rem;",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Name: "seen", Style: "width:100%; font-size:0.7rem;",
                                    Childs: [
                                        { Type: "option", Childs: [{ Type: "text", TextValue: RVDic.All }] },
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "true" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Seen }]
                                        },
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "false" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.NotSeen }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.DoneStatus + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:10rem;",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Name: "done", Style: "width:100%; font-size:0.7rem;",
                                    Childs: [
                                        { Type: "option", Childs: [{ Type: "text", TextValue: RVDic.All }] },
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "true" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Done }]
                                        },
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "false" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.NotDone }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CanceledStatus + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; width:10rem;",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Name: "canceled", Style: "width:100%; font-size:0.7rem;",
                                    Childs: [
                                        { Type: "option", Childs: [{ Type: "text", TextValue: RVDic.All }] },
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "true" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Canceled }]
                                        },
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "false" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.NotCanceled }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Objects.DelayFromInput = elems["delayFrom"];
            that.Objects.DelayToInput = elems["delayTo"];

            that.Objects.SeenStatusSelect = elems["seen"];
            that.Objects.DoneStatusSelect = elems["done"];
            that.Objects.CanceledStatusSelect = elems["canceled"];
            
            that.Objects.KnowledgeTypeSelect = GlobalUtilities.append_autosuggest(elems["knowledgeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.KnowledgeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource({ IsKnowledge: true }),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            that.Objects.UsersList = new NewSingleDataContainer(elems["usersList"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                NoButtons: true,
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    var users = JSON.parse(responseText).Users || [];
                    var arr = [];
                    for (var i = 0, lnt = users.length; i < lnt; ++i) {
                        var fullname = Base64.decode(users[i].FirstName) + " " + Base64.decode(users[i].LastName);
                        arr.push([fullname + " - " + Base64.decode(users[i].UserName), users[i].UserID]);
                    }
                    return arr;
                }
            });

            that.Objects.MemberInNodeTypeSelect = GlobalUtilities.append_autosuggest(elems["memberInNodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.BeMemberInNodeType + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            that.Objects.GroupSelect = new ReportGroupSelect(elems["groups"], {
                Groups: that.Objects.Config.Groups,
                MultiSelect: false,
                AdminMode: that.Objects.Config.FullAccess,
                NodeTypesSelectable: false
            });

            GlobalUtilities.append_calendar(elems["sendDateFrom"], { ClearButton: true }, function (cal) {
                that.Objects.SendDateFrom = cal;
            });

            GlobalUtilities.append_calendar(elems["sendDateTo"], { ClearButton: true }, function (cal) {
                that.Objects.SendDateTo = cal;
            });

            GlobalUtilities.append_calendar(elems["actionDateFrom"], { ClearButton: true }, function (cal) {
                that.Objects.ActionDateFrom = cal;
            });

            GlobalUtilities.append_calendar(elems["actionDateTo"], { ClearButton: true }, function (cal) {
                that.Objects.ActionDateTo = cal;
            });

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.KnowledgeTypeID) this.Objects.KnowledgeTypeSelect.set_item(params.KnowledgeTypeID.Value || "", params.KnowledgeTypeID.Title || "");
            if (params.MemberInNodeTypeID) this.Objects.MemberInNodeTypeSelect.set_item(params.MemberInNodeTypeID.Value || "", params.MemberInNodeTypeID.Title || "");

            if (params.SendDateFrom && that.Objects.SendDateFrom) {
                that.Objects.SendDateFrom.Set({
                    Value: params.SendDateFrom.Value, Label: params.SendDateFrom.Title
                });
            }

            if (params.SendDateTo && that.Objects.SendDateTo) {
                that.Objects.SendDateTo.Set({
                    Value: params.SendDateTo.Value, Label: params.SendDateTo.Title
                });
            }

            if (params.ActionDateFrom && that.Objects.ActionDateFrom) {
                that.Objects.ActionDateFrom.Set({
                    Value: params.ActionDateFrom.Value, Label: params.ActionDateFrom.Title
                });
            }

            if (params.ActionDateTo && that.Objects.ActionDateTo) {
                that.Objects.ActionDateTo.Set({
                    Value: params.ActionDateTo.Value, Label: params.ActionDateTo.Title
                });
            }

            var delayFrom = (params.DelayFrom || {}).Value || params.DelayFrom;
            if (delayFrom || (delayFrom == 0)) that.Objects.DelayFromInput.value = delayFrom;

            var delayTo = (params.DelayTo || {}).Value || params.DelayTo;
            if (delayTo || (delayTo == 0)) that.Objects.DelayToInput.value = delayTo;

            var seen = String((params.Seen || {}).Value || params.Seen || "_").toLowerCase();
            if (seen == "true" || seen == "false") that.Objects.SeenStatusSelect.selectedIndex = seen == "true" ? 1 : 2;

            var done = String((params.Done || {}).Value || params.Done || "_").toLowerCase();
            if (done == "true" || done == "false") that.Objects.DoneStatusSelect.selectedIndex = done == "true" ? 1 : 2;

            var canceled = String((params.Canceled || {}).Value || params.Canceled || "_").toLowerCase();
            if (canceled == "true" || canceled == "false") that.Objects.CanceledStatusSelect.selectedIndex = canceled == "true" ? 1 : 2;
        },

        get_data: function () {
            var that = this;

            var items = !that.Objects.GroupSelect ? {} : that.Objects.GroupSelect.get_items() || {};
            var creatorGroup = (items.Nodes || []).length ? items.Nodes[0] || {} : {};

            if (!that.Objects.Config.FullAccess && !creatorGroup.NodeID) {
                alert(RVDic.Checks.PleaseSelectAGroup);
                return false;
            }

            var index = that.Objects.KnowledgeTypeSelect.selectedIndex;
            var knowledgeTypeId = index < 0 ? "" : that.Objects.KnowledgeTypeSelect.values[index];
            var knowledgeType = index < 0 ? "" : that.Objects.KnowledgeTypeSelect.keywords[index];

            index = that.Objects.MemberInNodeTypeSelect.selectedIndex;
            var memberInNodeTypeId = index < 0 ? "" : that.Objects.MemberInNodeTypeSelect.values[index];
            var memberInNodeType = index < 0 ? "" : that.Objects.MemberInNodeTypeSelect.keywords[index];

            var sendDateFrom = (that.Objects.SendDateFrom || { Get: function () { return {} } }).Get();
            var sendDateTo = (that.Objects.SendDateTo || { Get: function () { return {} } }).Get();

            var actionDateFrom = (that.Objects.ActionDateFrom || { Get: function () { return {} } }).Get();
            var actionDateTo = (that.Objects.ActionDateTo || { Get: function () { return {} } }).Get();

            var delayFrom = that.Objects.DelayFromInput.value;
            var delayTo = that.Objects.DelayToInput.value;

            var seen = that.Objects.SeenStatusSelect[that.Objects.SeenStatusSelect.selectedIndex].title;
            var done = that.Objects.DoneStatusSelect[that.Objects.DoneStatusSelect.selectedIndex].title;
            var canceled = that.Objects.CanceledStatusSelect[that.Objects.CanceledStatusSelect.selectedIndex].title;

            return {
                KnowledgeTypeID: knowledgeTypeId,
                _Title_KnowledgeTypeID: knowledgeType,
                UserIDs: that.Objects.UsersList.get_items_string("|"),
                MemberInNodeTypeID: memberInNodeTypeId,
                _Title_MemberInNodeTypeID: memberInNodeType,
                CreatorGroupID: creatorGroup.NodeID,
                _Title_CreatorGroupID: creatorGroup.Name,
                SendDateFrom: sendDateFrom.Value || "",
                _Title_SendDateFrom: sendDateFrom.Label || "",
                SendDateTo: sendDateTo.Value || "",
                _Title_SendDateTo: sendDateTo.Label || "",
                ActionDateFrom: actionDateFrom.Value || "",
                _Title_ActionDateFrom: actionDateFrom.Label || "",
                ActionDateTo: actionDateTo.Value || "",
                _Title_ActionDateTo: actionDateTo.Label || "",
                DelayFrom: delayFrom,
                DelayTo: delayTo,
                Seen: seen,
                Done: done,
                Canceled: canceled
            };
        },

        clear: function () {
            var that = this;

            if (this.Objects.KnowledgeTypeSelect) this.Objects.KnowledgeTypeSelect.empty();
            if (this.Objects.UsersList) this.Objects.UsersList.clear();
            if (this.Objects.MemberInNodeTypeSelect) this.Objects.MemberInNodeTypeSelect.empty();
            if (this.Objects.GroupSelect) this.Objects.GroupSelect.clear();
            if (this.Objects.SendDateFrom) this.Objects.SendDateFrom.Clear();
            if (this.Objects.SendDateTo) this.Objects.SendDateTo.Clear();
            if (this.Objects.ActionDateFrom) this.Objects.ActionDateFrom.Clear();
            if (this.Objects.ActionDateTo) this.Objects.ActionDateTo.Clear();
            if (this.Objects.DelayFromInput) this.Objects.DelayFromInput.value = "";
            if (this.Objects.DelayToInput) this.Objects.DelayToInput.value = "";
            if (this.Objects.SeenStatusSelect) this.Objects.SeenStatusSelect.selectedIndex = 0;
            if (this.Objects.DoneStatusSelect) this.Objects.DoneStatusSelect.selectedIndex = 0;
            if (this.Objects.CanceledStatusSelect) this.Objects.CanceledStatusSelect.selectedIndex = 0;
        }
    }
})();