(function () {
    if (window.ReportOptions && window.ReportOptions.USR && window.ReportOptions.USR.UsersPerformanceReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.UsersPerformanceReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            UsersRadio: null,
            GroupsRadio: null,
            UsersList: null,
            GroupSelect: null,
            BeginDate: null,
            FinishDate: null,
            CompensationVolume: null,
            CompensatePerScoreRadio: null,
            ScoreItems: [],
            Config: GlobalUtilities.extend({
                Groups: [],
                FullAccess: false,
                GroupAdminAccess: false

            }, params.Config)
        };
        
        this.Options = {
            InitialScores: {},
            CompensatePerScore: true,
            CompensationVolume: 0
        };

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI"] },
            "SingleDataContainer/NewSingleDataContainer.js",
            "Reports/ReportGroupSelect.js"
        ], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.USR.UsersPerformanceReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var radioName = GlobalUtilities.random_str(10);

            var radio_section = function (options) {
                return {
                    Type: "div", Style: "display:flex; flex-flow:row; margin-bottom:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "input", Name: options.RadioName,
                                Attributes: [
                                    { Name: "type", Value: "radio" },
                                    { Name: "name", Value: radioName },
                                    { Name: "value", Value: (options || {}).Value },
                                    (!(options || {}).Selected ? null : { Name: "checked", Value: true })
                                ],
                                Properties: [{ Name: "onchange", Value: function () { options.OnChange(this.checked); } }]
                            }]
                        },
                        {
                            Type: "div", Style: "flex:0 0 auto;",
                            Properties: [{ Name: "onclick", Value: () => jQuery(elems[options.RadioName]).click() }],
                            Childs: [{ Type: "text", TextValue: (options || {}).Title }]
                        }
                    ]
                };
            };

            var usersId = GlobalUtilities.random_str(20);
            var groupsId = GlobalUtilities.random_str(20);
            var usersRadioName = usersId + "_radio";
            var groupsRadioName = groupsId + "_radio";

            var show = function (id) {
                jQuery("#" + id + " *").attr("disabled", false).on('click').css({ 'pointer-events': '', 'opacity': 1 });
            };

            var hide = function (id) {
                jQuery("#" + id + " *").attr("disabled", "disabled").off('click').css({ 'pointer-events': 'none', 'opacity': 0.8 });
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "position:relative;",
                    Childs: [{
                        Type: "div", Class: "ActionButton",
                        Style: "position:absolute; top:0;" + RV_RevFloat + ":0;",
                        Properties: [{ Name: "onclick", Value: function () { GlobalUtilities.show(that.scoring_dialog().Container); } }],
                        Childs: [{ Type: "text", TextValue: RVDic.ScoringOptions }]
                    }]
                },
                (!that.Objects.Config.FullAccess ? null : radio_section({
                    Title: RVDic.BasedOnUsers,
                    Value: "Users", Selected: true,
                    RadioName: usersRadioName,
                    OnChange: () => (show(usersId), hide(groupsId))
                })),
                (!that.Objects.Config.FullAccess ? null : {
                    Type: "div", ID: usersId, Class: "small-12 medium-10 large-7", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.Users) + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "usersList" }
                    ]
                }),
                { Type: "div", Class: "small-12 medium-12 large-12" },
                (!that.Objects.Config.FullAccess ? null : radio_section({
                    Title: RVDic.BasedOnGroups,
                    Value: "Groups",
                    RadioName: groupsRadioName,
                    OnChange: () => (show(groupsId), hide(usersId))
                })),
                {
                    Type: "div", ID: groupsId, Style: "display:flex; flex-flow:row; margin-bottom:2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.Groups) + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "groups" }
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

            if (that.Objects.Config.FullAccess) setTimeout(() => hide(groupsId), 100);

            that.Objects.UsersRadio = elems[usersRadioName];
            that.Objects.GroupsRadio = elems[groupsRadioName];

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
                MultiSelect: true,
                AdminMode: that.Objects.Config.FullAccess,
                NodeTypesSelectable: false
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

            var itemType = (that.Objects.UsersRadio || {}).checked ? "Users" : "Groups";

            var items = !that.Objects.GroupSelect ? {} : that.Objects.GroupSelect.get_items() || {};

            if ((itemType == "Groups") && !that.Objects.Config.FullAccess && !(items.Nodes || []).length) {
                alert(RVDic.Checks.PleaseSelectTheGroups);
                return false;
            }

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

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                UserIDs: itemType == "Users" && that.Objects.UsersList ? that.Objects.UsersList.get_items_string("|") : "",
                NodeIDs: itemType == "Groups" ? (items.Nodes || []).map(itm => itm.NodeID).join("|") : "",
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

            if (that.Objects.UsersRadio) jQuery(that.Objects.UsersRadio).click();
            if (that.Objects.UsersList) that.Objects.UsersList.clear();
            if (that.Objects.GroupSelect) that.Objects.GroupSelect.clear();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();