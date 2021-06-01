(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.NodesCreatedNodesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.NodesCreatedNodesReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            CreatorNodeTypeSelect: null,
            NodesList: null,
            ShowPersonalItemsSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js", "SingleDataContainer/NewSingleDataContainer.js"], {
            OnLoad: function () { that._initialize(params, done); }
        });
    }

    ReportOptions.CN.NodesCreatedNodesReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var groupStatuses = [
                { ID: "", Value: RVDic.ShowAll + "..." },
                { ID: "True", Value: RVDic.ShowPersonalItems },
                { ID: "False", Value: RVDic.ShowGroupItems }
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
                create_titled({
                    Class: "small-12 medium-12 large-12", Title: RVDic.IntellectualPropertyType, Style: "margin-bottom:1rem;",
                    Childs: [{ Type: "div", Style: "width:calc(50% - 0.5rem);", Name: "nodeTypeSelect" }]
                }),
                create_titled({
                    Class: "small-12 medium-12 large-12", Title: RVDic.SelectN.replace("[n]", RVDic.Groups), Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.5rem;",
                            Childs: [{ Type: "div", Style: "width:calc(50% - 0.5rem);", Name: "creatorNodeTypeSelect" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "div", Style: "width:calc(50% - 0.5rem);", Name: "nodesList" }]
                        }
                    ]
                }),
                create_titled({
                    Class: "small-12 medium-12 large-12", Title: RVDic.RPT.CN.NodesCreatedNodesReport.PersonalOrGroup, Style: "margin-bottom:1rem;",
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
            ], that.ContainerDiv);

            that.Objects.ShowPersonalItemsSelect = elems["piSelect"];

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
                InnerTitle: RVDic.OwnerNodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    return (JSON.parse(responseText).NodeTypes || [])
                        .map(function (x) { return [Base64.decode(x.TypeName), x.NodeTypeID]; });
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex];
                    that.Objects.NodesList.bind_data_source(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                }
            });

            that.Objects.NodesList = new NewSingleDataContainer(elems["nodesList"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.Groups + "...",
                NoButtons: true,
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    return (JSON.parse(responseText).Nodes || [])
                        .map(function (x) { return [Base64.decode(x.Name), x.NodeID]; });
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
            if (params.CreatorNodeTypeID)
                this.Objects.CreatorNodeTypeSelect.set_item(params.CreatorNodeTypeID.Value || "", params.CreatorNodeTypeID.Title || "");

            if (params.ShowPersonalItems) {
                switch (String(params.ShowPersonalItems.Value).toLowerCase()) {
                    case "true":
                        this.Objects.ShowPersonalItemsSelect.selectedIndex = 1;
                        break;
                    case "false":
                        this.Objects.ShowPersonalItemsSelect.selectedIndex = 2;
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

            index = this.Objects.CreatorNodeTypeSelect.selectedIndex;
            var creatorNodeTypeId = index < 0 ? "" : this.Objects.CreatorNodeTypeSelect.values[index];
            var creatorNodeType = index < 0 ? "" : this.Objects.CreatorNodeTypeSelect.keywords[index];

            var slct = this.Objects.ShowPersonalItemsSelect;

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                CreatorNodeTypeID: creatorNodeTypeId, _Title_CreatorNodeTypeID: creatorNodeType,
                NodeIDs: this.Objects.NodesList.get_items_string("|"),
                ShowPersonalItems: slct[slct.selectedIndex].title,
                LowerCreationDateLimit: beginDate.Value,
                _Title_LowerCreationDateLimit: beginDate.Label,
                UpperCreationDateLimit: finishDate.Value,
                _Title_UpperCreationDateLimit: finishDate.Label
            };
        },

        clear: function () {
            var that = this;

            this.Objects.NodeTypeSelect.empty();
            this.Objects.CreatorNodeTypeSelect.empty();
            this.Objects.NodesList.clear();
            this.Objects.ShowPersonalItemsSelect.selectedIndex = 0;
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();