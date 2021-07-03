(function () {
    if (window.ReportOptions && window.ReportOptions.USR && window.ReportOptions.USR.UsersPerformanceReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.UsersPerformanceReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            ItemTypeSelect: null,
            UsersList: null,
            NodeTypeSelect: null,
            NodesList: null,
            ListsList: null,
            BeginDate: null,
            FinishDate: null,
            CompensationVolume: null,
            CompensatePerScoreRadio: null,
            ScoreItems: []
        };

        this.Options = {
            InitialScores: {},
            CompensatePerScore: true,
            CompensationVolume: 0
        };

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI"] },
            "SingleDataContainer/NewSingleDataContainer.js"
        ], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.USR.UsersPerformanceReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Name: "itemTypeSelect",
                                    Style: "max-width:12rem; font-size:0.7rem;", 
                                    Childs: [
                                        {
                                            Type: "option",
                                            Attributes: [{ Name: "title", Value: "User" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.User }]
                                        },
                                        {
                                            Type: "option",
                                            Attributes: [{ Name: "title", Value: "Node" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Group }]
                                        },
                                        (true ? null : {
                                            Type: "option",
                                            Attributes: [{ Name: "title", Value: "Complex" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Complex }]
                                        })
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6 RevDirection RevTextAlign",
                            Childs: [
                                {
                                    Type: "div", Class: "ActionButton",
                                    Style: "display:inline-block; text-align:center;",
                                    Properties: [{ Name: "onclick", Value: function () { GlobalUtilities.show(that.scoring_dialog().Container); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.ScoringOptions }]
                                }
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                {
                    Type: "div", Class: "small-6 medium-6 large-6", Name: "userDiv",
                    Style: "padding-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "div", Name: "usersList" }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "nodeDiv", Style: "margin:0rem; display:none;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeTypeSelect",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "nodesList",
                            Style: "padding-" + RV_Float + ":0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "listsList",
                            Style: "padding-" + RV_Float + ":0.5rem;"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
                    ]
                }
            ], that.ContainerDiv);

            var usersDiv = elems["userDiv"];
            var nodeDiv = elems["nodeDiv"];
            that.Objects.ItemTypeSelect = elems["itemTypeSelect"];

            that.Objects.ItemTypeSelect.onchange = function () {
                var itemType = this[this.selectedIndex].title;
                jQuery(usersDiv)[itemType == "User" ? "fadeIn" : "fadeOut"](0);
                jQuery(nodeDiv)[itemType == "Node" || itemType == "Complex" ? "fadeIn" : "fadeOut"](0);
                jQuery(elems["nodesList"])[itemType == "Node" ? "fadeIn" : "fadeOut"](0);
                jQuery(elems["listsList"])[itemType == "Complex" ? "fadeIn" : "fadeOut"](0);
            };

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

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID || ""]);
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    var nodeTypeId = this.values[index];
                    var nodeType = this.keywords[index];

                    that.Objects.NodesList.bind_data_source(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.NodesList.Objects.Autosuggest.InputElement, RVDic.SelectN.replace("[n]", nodeType) + "...");

                    that.Objects.ListsList.bind_data_source(CNAPI.GetLists({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.ListsList.Objects.Autosuggest.InputElement, RVDic.ComplexSelect + "...");
                }
            });

            that.Objects.NodesList = new NewSingleDataContainer(elems["nodesList"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + "...",
                NoButtons: true,
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name), nodes[i].NodeID]);
                    return arr;
                }
            });

            that.Objects.ListsList = new NewSingleDataContainer(elems["listsList"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.ComplexSelect + "...",
                NoButtons: true,
                AjaxDataSource: CNAPI.GetLists(),
                ResponseParser: function (responseText) {
                    var lists = JSON.parse(responseText).Lists || [];
                    var arr = [];
                    for (var i = 0, lnt = lists.length; i < lnt; ++i)
                        arr.push([Base64.decode(lists[i].Name), lists[i].ListID]);
                    return arr;
                }
            });

            GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) {
                that.Objects.BeginDate = cal;
            });

            GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) {
                that.Objects.FinishDate = cal;
            });

            that.set_data(params);

            done();
        },

        set_initial_scores: function (input) {
            var that = this;
            
            (input || "~").split("|")
                .map(function (x) { return x.split(":"); })
                .filter(function (u) { return u.length == 2; })
                .forEach(function (itm) {
                    var itemName = itm[1], value = +itm[0];
                    that.Options.InitialScores[itemName] = value;
                });
        },

        get_score_items: function () {
            var that = this;

            if((that.Objects.ScoreItems || []).some(function (x) { return isNaN(+x.InputElement.value); })) return false;

            return (that.Objects.ScoreItems || [])
                .map(function (itm) { return { Name: itm.Name, Value: +itm.InputElement.value }; });
        },

        to_knowledge_type_id: function (input) {
            var str = !/[0-9A-Za-z]{32}$/ig.test(input || "_") ? "" : input.substr(input.length - 32);
            return !str ? "" : str.substr(0, 8) + "-" + str.substr(8, 4) + "-" +
                str.substr(12, 4) + "-" + str.substr(16, 4) + "-" + str.substr(20);
        },

        get_knowledge_type_ids: function () {
            var that = this;

            return (that.get_score_items() || [])
                .map(function (itm) { return that.to_knowledge_type_id((itm || {}).Name); })
                .filter(function (x, index, self) { return !!x && self.indexOf(x) == index; });
        },

        scoring_dialog: function (reset) {
            var that = this;
            
            if (!reset && that.SCORING_DIALOG_OBJECT) return that.SCORING_DIALOG_OBJECT;

            if (reset) that.Objects.ScoreItems = [];

            var items = ["AA_SharesOnWall", "AB_ReceivedSharesOnKnowledges", "AC_SentSharesOnKnowledges", "AD_ReceivedTemporalFeedBacks",
                "AE_ReceivedFinancialFeedBacks", "AF_SentFeedBacksCount", "AG_SentQuestions", "AH_SentAnswers", "AI_KnowledgeOverview",
                "AJ_KnowledgeEvaluation", "AK_CommunityScore", "AL_AcceptedWikiChanges", "AM_WikiEvaluation", "AN_PersonalPageVisit"];
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.ScoringOptions }]
                        },
                        {
                            Type: "div", Class: "small-11 medium-11 large-11 row rv-border-radius-1",
                            Style: "margin:1rem auto; background-color:white; padding:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "text-align:center; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.AllocateRewards }]
                                },
                                {
                                    Type: "div", Class: "small-8 medium-8 large-8",
                                    Childs: [
                                        {
                                            Type: "input", Name: "compensatePerScore",
                                            Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                            Attributes: [
                                                { Name: "type", Value: "radio" },
                                                { Name: "name", Value: "rewardTypeSelect" },
                                                { Name: "checked", Value: true }
                                            ]
                                        },
                                        { Type: "label", Childs: [{ Type: "text", TextValue: RVDic.CompensatePerScore }] },
                                        { Type: "br" },
                                        {
                                            Type: "input", Name: "totalBudget",
                                            Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                            Attributes: [{ Name: "type", Value: "radio" }, { Name: "name", Value: "rewardTypeSelect" }]
                                        },
                                        { Type: "label", Childs: [{ Type: "text", TextValue: RVDic.CompensateOnScoresWeight }] }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-4 medium-4 large-4 RevDirection RevTextAlign",
                                    Childs: [
                                        {
                                            Type: "input", Class: "rv-input",
                                            Style: "width:8rem; font-size:0.7rem; text-align:center;",
                                            InnerTitle: RVDic.CompensationVolume + "...", Name: "compensationVolume",
                                            Attributes: [{ Name: "type", Value: "text" }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SetItemsWeight }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.AddContentType + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "nodeTypeSelect" }
                            ]
                        }
                    ]
                }
            ]);

            that.Objects.CompensationVolume = elems["compensationVolume"];
            that.Objects.CompensatePerScoreRadio = elems["compensatePerScore"];

            var cv = +that.Options.CompensationVolume;
            that.Objects.CompensationVolume.value = isNaN(cv) ? "" : cv;
            
            if (!that.Options.CompensatePerScore) elems["totalBudget"].checked = true;

            var _dicPart = (((RVDic || {}).RPT || {}).USR || {}).UsersPerformanceReport || {};

            items.forEach(function (itm) {
                that.add_score_item(elems["itemsArea"], { Name: itm, Title: _dicPart[itm] || itm });
            });

            //Add knowledge types
            var ktIds = [];

            for (var key in (that.Options.InitialScores || {})) {
                var ktId = that.to_knowledge_type_id(key);
                if (ktId && !ktIds.some(function (x) { return x == ktId; })) ktIds.push(ktId);
            }

            if (ktIds.length > 0) {
                CNAPI.GetNodeTypes({
                    NodeTypeIDs: ktIds.join('|'), ParseResults: true,
                    ResponseHandler: function (result) {
                        (result.NodeTypes || []).forEach(function (itm) {
                            that.add_node_type(elems["itemsArea"], { ID: itm.NodeTypeID, Name: Base64.decode(itm.TypeName) });
                        });
                    }
                });
            }
            //end of Add knowledge types
            
            var nodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    var index = nodeTypeSelect.selectedIndex;

                    that.add_node_type(elems["itemsArea"], {
                        ID: nodeTypeSelect.values[index], Name: nodeTypeSelect.keywords[index]
                    }, true);

                    nodeTypeSelect.clear();
                }
            });

            var retObj = that.SCORING_DIALOG_OBJECT = { Container: elems["container"] }

            return retObj;
        },

        add_score_item: function (container, item, options) {
            var that = this;
            options = options || {};
            
            if (that.Objects.ScoreItems.some(function (u) { return u.Name == item.Name })) return false;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white",
                    Style: "padding:0.5rem; position:relative; padding-" + RV_RevFloat + ":5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "input", InnerTitle: RVDic.Weight + "...",
                                    Style: "width:4rem; font-size:0.5rem; text-align:center;",
                                    Attributes: [{ Name: "type", Value: "text" }]
                                }
                            ]
                        },
                        {
                            Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                            Style: "margin-" + RV_RevFloat + ":0.5rem;" + (options.OnRemove ? "" : "display:none;"),
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [{ Name: "onclick", Value: function () { options.OnRemove(); } }]
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: item.Title }]
                        }
                    ]
                }
            ], container);

            var is = that.Options.InitialScores;
            elems["input"].value = is[item.Name] === 0 ? is[item.Name] : is[item.Name] || 1;

            var jsonObj = {
                Name: item.Name,
                InputElement: elems["input"],
                ID: item.ID,
                Container: elems["container"],
                IsKnowledgeType: options.IsKnowledgeType,
                Remove: function () {
                    jQuery(elems["container"]).remove();
                    jsonObj.Container = null;
                }
            };
            
            that.Objects.ScoreItems.push(jsonObj);
        },

        add_node_type: function (container, item, autoScroll) {
            var that = this;

            var _dicPart = (((RVDic || {}).RPT || {}).USR || {}).UsersPerformanceReport || {};
            
            [
                { Name: "AO_Registered", EntryName: "Registered", OnRemove: function () { that.remove_node_type(item.ID); } },
                { Name: "AP_AcceptedCount", EntryName: "AcceptedCount" },
                { Name: "AQ_AcceptedScore", EntryName: "AcceptedScore" }
            ].forEach(function (x) {
                that.add_score_item(container, {
                    ID: item.ID,
                    Name: x.Name + "_" + String(item.ID).replace(/-/ig, ''),
                    Title: _dicPart[x.EntryName] + ": " + item.Name
                }, { IsKnowledgeType: true, OnRemove: x.OnRemove });
            });

            if (autoScroll) GlobalUtilities.scroll(container.parentNode);
        },

        remove_node_type: function (nodeTypeId) {
            var that = this;
            
            if (!nodeTypeId) return;
            
            that.Objects.ScoreItems.filter(function (x) { return (x.ID || "~") == nodeTypeId; })
                .forEach(function (itm) { jQuery(itm.Container).fadeOut(500, function () { this.remove(); }); });

            that.Objects.ScoreItems = that.Objects.ScoreItems.filter(function (x) { return (x.ID || "~") != nodeTypeId; });
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.BeginDate && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.BeginDate.Value, Label: params.BeginDate.Title });

            if (params.FinishDate && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.FinishDate.Value, Label: params.FinishDate.Title });

            if (params.CompensatePerScore) that.Options.CompensatePerScore = params.CompensatePerScore;

            if (params.CompensationVolume) that.Options.CompensationVolume = params.CompensationVolume;
            
            that.set_initial_scores(params.ScoreItems);
            that.scoring_dialog(true);
        },

        get_data: function () {
            var that = this;

            var knowledgeTypeIds = that.get_knowledge_type_ids();

            var compensatePerScore = (that.Objects.CompensatePerScoreRadio || {}).checked === true;
            var compensationVolume = +((that.Objects.CompensationVolume || {}).value || "");
            if (isNaN(compensationVolume)) compensationVolume = 0;

            var scoreItems = that.get_score_items();

            if (scoreItems === false) {
                alert((((RVDic.RPT || {}).USR || {}).UsersPerformanceReport || {})["WeightMustBeANonnegativeNumber"] ||
                    "WeightMustBeANonnegativeNumber");
                GlobalUtilities.show(that.scoring_dialog().Container);
                return false;
            }

            scoreItems = scoreItems.map(function (itm) { return itm.Value + ":" + itm.Name; }).join("|");
            
            var itemType = that.Objects.ItemTypeSelect[that.Objects.ItemTypeSelect.selectedIndex].title;

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                UserIDs: itemType == "User" ? that.Objects.UsersList.get_items_string("|") : "",
                NodeIDs: itemType == "Node" ? that.Objects.NodesList.get_items_string("|") : "",
                ListIDs: itemType == "Complex" ? that.Objects.ListsList.get_items_string("|") : "",
                KnowledgeTypeIDs: knowledgeTypeIds.join("|"),
                BeginDate: beginDate.Value,
                _Title_BeginDate: beginDate.Label,
                FinishDate: finishDate.Value,
                _Title_FinishDate: finishDate.Label,
                CompensatePerScore: compensatePerScore, CompensationVolume: compensationVolume, ScoreItems: scoreItems
            };
        },

        clear: function () {
            var that = this;

            this.Objects.ItemTypeSelect.selectedIndex = 0;
            this.Objects.ItemTypeSelect.onchange();
            this.Objects.UsersList.clear();
            this.Objects.NodeTypeSelect.clear();
            this.Objects.NodesList.clear();
            this.Objects.ListsList.clear();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();