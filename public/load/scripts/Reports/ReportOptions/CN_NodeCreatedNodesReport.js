(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.NodeCreatedNodesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.NodeCreatedNodesReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            CreatorNodeTypeSelect: null,
            CreatorNodeSelect: null,
            StatusSelect: null,
            ShowPersonalItemsSelect: null,
            PublishedSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.CN.NodeCreatedNodesReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var statuses = [{ ID: "", Value: RVDic.Status + "..." }];
            for (var key in RVDic.RPT.CN.NodeCreatedNodesReport.Status_Dic)
                statuses.push({ ID: key, Value: RVDic.RPT.CN.NodeCreatedNodesReport.Status_Dic[key] });

            var groupStatuses = [
                { ID: "", Value: RVDic.ShowAll + "..." },
                { ID: "True", Value: RVDic.ShowPersonalItems },
                { ID: "False", Value: RVDic.ShowGroupItems }
            ];

            var publishedStatuses = [
                { ID: "", Value: RVDic.ShowAll + "..." },
                { ID: "True", Value: RVDic.Published },
                { ID: "False", Value: RVDic.NotPublished }
            ];

            var create_titled = function (itm) {
                return {
                    Type: "div", Class: itm.Class,
                    Style: (itm.Style || " ") + "position:relative; padding-" + RV_Float + ":8rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0;" + RV_Float + ":0; padding-top:0.3rem;",
                            Childs: [{ Type: "text", TextValue: itm.Title + ":" }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12 row", Name: itm.Name, Style: "margin:0;", Childs: itm.Childs }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        create_titled({
                            Class: "small-12 medium-12 large-12", Title: RVDic.IntellectualPropertyType, Style: "margin-bottom:1rem;",
                            Childs: [{ Type: "div", Style: "width:calc(50% - 0.5rem);", Name: "nodeTypeSelect"}]
                        }),
                        create_titled({
                            Class: "small-12 medium-12 large-12", Title: RVDic.SelectN.replace("[n]", RVDic.Group), Style: "margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-6 medium-6 large-6",
                                    Style: "padding-" + RV_RevFloat + ":0.5rem;", Name: "creatorNodeTypeSelect"
                                },
                                {
                                    Type: "div", Class: "small-6 medium-6 large-6",
                                    Style: "padding-" + RV_Float + ":0.5rem;", Name: "creatorNodeSelect"
                                }
                            ]
                        }),
                        create_titled({
                            Class: "small-12 medium-12 large-12", Title: RVDic.Status, Style: "margin-bottom:1rem;",
                            Childs: [{
                                Type: "select", Class: "rv-input", Name: "statusSelect", Style: "width:calc(50% - 0.5rem); font-size:0.7rem;",
                                Childs: statuses.map(function (s) {
                                    return {
                                        Type: "option",
                                        Attributes: !s.ID ? null : [{ Name: "title", Value: s.ID }],
                                        Childs: [{ Type: "text", TextValue: s.Value }]
                                    }
                                })
                            }]
                        }),
                        create_titled({
                            Class: "small-12 medium-12 large-12", Title: RVDic.RPT.CN.NodeCreatedNodesReport.PersonalOrGroup, Style: "margin-bottom:1rem;",
                            Childs: [{
                                Type: "select", Class: "rv-input", Name: "piSelect", Style: "width:calc(50% - 0.5rem); font-size:0.7rem;",
                                Childs: groupStatuses.map(function (s) {
                                    return {
                                        Type: "option",
                                        Attributes: !s.ID ? null : [{ Name: "title", Value: s.ID }],
                                        Childs: [{ Type: "text", TextValue: s.Value }]
                                    }
                                })
                            }]
                        }),
                        create_titled({
                            Class: "small-12 medium-12 large-12", Title: RVDic.RPT.CN.NodeCreatedNodesReport.PublishedStatus, Style: "margin-bottom:1rem;",
                            Childs: [{
                                Type: "select", Class: "rv-input", Name: "publishedSelect", Style: "width:calc(50% - 0.5rem); font-size:0.7rem;",
                                Childs: publishedStatuses.map(function (s) {
                                    return {
                                        Type: "option",
                                        Attributes: !s.ID ? null : [{ Name: "title", Value: s.ID }],
                                        Childs: [{ Type: "text", TextValue: s.Value }]
                                    }
                                })
                            }]
                        }),
                        create_titled({
                            Class: "small-12 medium-12 large-12", Title: RVDic.CreationDate, Style: "margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding-top:0.3rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                                {
                                    Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem; padding-top:0.3rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
                            ]
                        })
                    ]
                }
            ], that.ContainerDiv);

            that.Objects.StatusSelect = elems["statusSelect"];
            that.Objects.ShowPersonalItemsSelect = elems["piSelect"];
            that.Objects.PublishedSelect = elems["publishedSelect"];

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            that.Objects.CreatorNodeTypeSelect = GlobalUtilities.append_autosuggest(elems["creatorNodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + " (" + RVDic.Optional + ")...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
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
                    that.Objects.CreatorNodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.CreatorNodeSelect.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });

            that.Objects.CreatorNodeSelect = GlobalUtilities.append_autosuggest(elems["creatorNodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.SelectN.replace("[n]", RVDic.Group) + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].Name || "");
                        if ((items[i].AdditionalID || "") == "") tt += " - " + Base64.decode(items[i].AdditionalID || "");
                        arr.push([tt, items[i].NodeID]);
                    }
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

        set_data: function (params) {
            var that = this;
            params = params || {};
            
            if (params.NodeTypeID) this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value || "", params.NodeTypeID.Title || "");

            if (params.CreatorNodeID) this.Objects.CreatorNodeSelect.set_item(params.CreatorNodeID.Value || "", params.CreatorNodeID.Title || "");
            
            if (params.Status) {
                for (var i = 0; i < that.Objects.StatusSelect.length; ++i)
                    if (that.Objects.StatusSelect[i].title == (params.Status || {}).Value) that.Objects.StatusSelect.selectedIndex = i;
            }

            if (params.ShowPersonalItems) {
                switch (String((params.ShowPersonalItems || {}).Value).toLowerCase()) {
                    case "true":
                        this.Objects.ShowPersonalItemsSelect.selectedIndex = 1;
                        break;
                    case "false":
                        this.Objects.ShowPersonalItemsSelect.selectedIndex = 2;
                        break;
                }
            }

            if (params.Published) {
                switch (String((params.Published || {}).Value).toLowerCase()) {
                    case "true":
                        this.Objects.PublishedSelect.selectedIndex = 1;
                        break;
                    case "false":
                        this.Objects.PublishedSelect.selectedIndex = 2;
                        break;
                }
            }

            if (params.LowerCreationDateLimit && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.LowerCreationDateLimit.Value, Label: params.LowerCreationDateLimit.Title });

            if (params.UpperCreationDateLimit && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.UpperCreationDateLimit.Value, Label: params.UpperCreationDateLimit.Title });
        },

        get_data: function () {
            var that = this;

            var index = this.Objects.NodeTypeSelect.selectedIndex;
            var nodeTypeId = index < 0 ? "" : this.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : this.Objects.NodeTypeSelect.keywords[index];

            index = this.Objects.CreatorNodeSelect.selectedIndex;
            var creatorNodeId = index < 0 ? "" : this.Objects.CreatorNodeSelect.values[index];
            var creatorNode = index < 0 ? "" : this.Objects.CreatorNodeSelect.keywords[index];

            var statusSelect = that.Objects.StatusSelect;
            var slct = that.Objects.ShowPersonalItemsSelect;
            var publishedSelect = that.Objects.PublishedSelect;

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                CreatorNodeID: creatorNodeId, _Title_CreatorNodeID: creatorNode,
                Status: statusSelect[statusSelect.selectedIndex].title,
                ShowPersonalItems: slct[slct.selectedIndex].title,
                Published: publishedSelect[publishedSelect.selectedIndex].title,
                LowerCreationDateLimit: beginDate.Value,
                _Title_LowerCreationDateLimit: beginDate.Label,
                UpperCreationDateLimit: finishDate.Value,
                _Title_UpperCreationDateLimit: finishDate.Label
            };
        },

        clear: function () {
            var that = this;

            that.Objects.NodeTypeSelect.empty();
            that.Objects.CreatorNodeTypeSelect.empty();
            that.Objects.CreatorNodeSelect.empty();
            that.Objects.StatusSelect.selectedIndex = 0;
            that.Objects.ShowPersonalItemsSelect.selectedIndex = 0;
            that.Objects.PublishedSelect.selectedIndex = 0;
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();