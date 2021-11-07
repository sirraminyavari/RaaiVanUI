(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.NodesCreatedNodesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.NodesCreatedNodesReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Objects = {
            NodeTypeSelect: null,
            GroupSelect: null,
            ShowPersonalItemsSelect: null,
            BeginDate: null,
            FinishDate: null,
            Config: GlobalUtilities.extend({
                Groups: [],
                FullAccess: false,
                GroupAdminAccess: false

            }, params.Config)
        };

        var that = this;

        GlobalUtilities.load_files([
            "API/CNAPI.js",
            "SingleDataContainer/NewSingleDataContainer.js",
            "Reports/ReportGroupSelect.js"
        ], { OnLoad: () => that._initialize(params, done) });
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
                    Class: "small-12 medium-12 large-12", Title: RVDic.SelectN.replace("[n]", RVDic.Groups),
                    Style: "margin-bottom:1rem;", Name: "groups"
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

            that.Objects.GroupSelect = new ReportGroupSelect(elems["groups"], {
                Groups: that.Objects.Config.Groups,
                MultiSelect: true,
                AdminMode: that.Objects.Config.FullAccess,
                NodeTypesSelectable: true
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

            var items = !that.Objects.GroupSelect ? {} : that.Objects.GroupSelect.get_items() || {};
            var creatorNodeType = (items.NodeTypes || []).length ? items.NodeTypes[0] || {} : {};

            if (!creatorNodeType.NodeTypeID && !(items.Nodes || []).length) {
                alert(RVDic.Checks.PleaseSelectTheGroups);
                return false;
            }

            var index = this.Objects.NodeTypeSelect.selectedIndex;
            var nodeTypeId = index < 0 ? "" : this.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : this.Objects.NodeTypeSelect.keywords[index];

            var slct = this.Objects.ShowPersonalItemsSelect;

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeID: nodeTypeId,
                _Title_NodeTypeID: nodeType,
                CreatorNodeTypeID: creatorNodeType.NodeTypeID,
                _Title_CreatorNodeTypeID: creatorNodeType.NodeType,
                NodeIDs: (items.Nodes || []).map(itm => itm.NodeID).join("|"),
                ShowPersonalItems: slct[slct.selectedIndex].title,
                LowerCreationDateLimit: beginDate.Value,
                _Title_LowerCreationDateLimit: beginDate.Label,
                UpperCreationDateLimit: finishDate.Value,
                _Title_UpperCreationDateLimit: finishDate.Label
            };
        },

        clear: function () {
            var that = this;

            if (this.Objects.NodeTypeSelect) this.Objects.NodeTypeSelect.empty();
            if (this.Objects.GroupSelect) this.Objects.GroupSelect.clear();
            this.Objects.ShowPersonalItemsSelect.selectedIndex = 0;
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();