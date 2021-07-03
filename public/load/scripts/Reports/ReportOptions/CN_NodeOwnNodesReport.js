(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.NodeOwnNodesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.NodeOwnNodesReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            CreatorNodeTypeSelect: null,
            CreatorNodeSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.CN.NodeOwnNodesReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_RevFloat + ":0.5rem; margin-bottom:1rem;", Name: "nodeTypeSelect"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12" },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;", Name: "creatorNodeTypeSelect"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_Float + ":0.5rem;", Name: "creatorNodeSelect"
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
                InnerTitle: RVDic.NodeSelect + "...",
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

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                CreatorNodeID: creatorNodeId, _Title_CreatorNodeID: creatorNode,
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
            this.Objects.CreatorNodeSelect.empty();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();