(function () {
    if (((window.ReportOptions || {}).KW || {}).KnowledgeEvaluationsHistoryReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.KW = window.ReportOptions.KW || {};

    window.ReportOptions.KW.KnowledgeEvaluationsHistoryReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        
        this.Objects = {
            KnowledgeTypeSelect: null,
            KnowledgeSelect: null,
            UsersList: null,
            GroupSelect: null,
            DateFrom: null,
            DateTo: null,
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

    ReportOptions.KW.KnowledgeEvaluationsHistoryReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Knowledge + ":" }]
                        },
                        {
                            Type: "div", Style: "flex:1 1 auto;",
                            Childs: [{
                                Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0;",
                                Childs: [
                                    { Type: "div", Class: "small-6 medium-6 large-6", Name: "knowledgeTypeSelect" },
                                    {
                                        Type: "div", Class: "small-6 medium-6 large-6", Name: "knowledgeSelect",
                                        Style: "padding-" + RV_Float + ":1rem;"
                                    }
                                ]
                            }]
                        }
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
                            Childs: [{ Type: "text", TextValue: RVDic.Date + ":" }]
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
                }
            ], that.ContainerDiv);
            
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
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex];
                    var nodeType = this.keywords[this.selectedIndex];
                    that.Objects.KnowledgeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.KnowledgeSelect.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });

            that.Objects.KnowledgeSelect = GlobalUtilities.append_autosuggest(elems["knowledgeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.KnowledgeSelect + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource({ IsKnowledge: true }),
                ResponseParser: function (responseText) {
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name || ""), nodes[i].NodeID]);
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

            that.Objects.GroupSelect = new ReportGroupSelect(elems["groups"], {
                Groups: that.Objects.Config.Groups,
                MultiSelect: false,
                AdminMode: that.Objects.Config.FullAccess,
                NodeTypesSelectable: false
            });

            GlobalUtilities.append_calendar(elems["sendDateFrom"], { ClearButton: true }, function (cal) {
                that.Objects.DateFrom = cal;
            });

            GlobalUtilities.append_calendar(elems["sendDateTo"], { ClearButton: true }, function (cal) {
                that.Objects.DateTo = cal;
            });

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.KnowledgeTypeID) this.Objects.KnowledgeTypeSelect.set_item(params.KnowledgeTypeID.Value || "", params.KnowledgeTypeID.Title || "");
            if (params.KnowledgeID) this.Objects.KnowledgeTypeSelect.set_item(params.KnowledgeID.Value || "", params.KnowledgeID.Title || "");
            if (params.UserID) this.Objects.UsersList.add_item(params.UserID.Title || "", params.UserID.Value || "");
            
            if (params.DateFrom && that.Objects.DateFrom)
                that.Objects.DateFrom.Set({ Value: params.DateFrom.Value, Label: params.DateFrom.Title });

            if (params.DateTo && that.Objects.DateTo)
                that.Objects.DateTo.Set({ Value: params.DateTo.Value, Label: params.DateTo.Title });
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

            index = that.Objects.KnowledgeSelect.selectedIndex;
            var knowledgeId = index < 0 ? "" : that.Objects.KnowledgeSelect.values[index];
            var knowledgeName = index < 0 ? "" : that.Objects.KnowledgeSelect.keywords[index];

            var dateFrom = (that.Objects.DateFrom || { Get: function () { return {} } }).Get();
            var dateTo = (that.Objects.DateTo || { Get: function () { return {} } }).Get();

            return {
                KnowledgeTypeID: knowledgeTypeId,
                _Title_KnowledgeTypeID: knowledgeType,
                KnowledgeID: knowledgeId,
                _Title_KnowledgeID: knowledgeName,
                UserIDs: that.Objects.UsersList.get_items_string("|"),
                CreatorGroupID: creatorGroup.NodeID,
                _Title_CreatorGroupID: creatorGroup.Name,
                DateFrom: dateFrom.Value || "",
                _Title_DateFrom: dateFrom.Label || "",
                DateTo: dateTo.Value || "",
                _Title_DateTo: dateTo.Label || ""
            };
        },

        clear: function () {
            var that = this;

            if (this.Objects.KnowledgeTypeSelect) this.Objects.KnowledgeTypeSelect.empty();
            if (this.Objects.KnowledgeSelect) this.Objects.KnowledgeSelect.empty();
            if (this.Objects.UsersList) this.Objects.UsersList.clear();
            if (this.Objects.GroupSelect) this.Objects.GroupSelect.clear();
            if (this.Objects.DateFrom) this.Objects.DateFrom.Clear();
            if (this.Objects.DateTo) this.Objects.DateTo.Clear();
        }
    }
})();