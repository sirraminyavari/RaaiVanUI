(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.NodesOwnNodesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.NodesOwnNodesReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            CreatorNodeTypeSelect: null,
            NodesList: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI"] },
            { Root: "SingleDataContainer/", Ext: "js", Childs: ["NewSingleDataContainer"] }],
            { OnLoad: function () { that._initialize(params, done); } }
        );
    }

    ReportOptions.CN.NodesOwnNodesReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-7 medium-7 large-7", Style: "margin-bottom:1rem;", Name: "nodeTypeSelect" },
                { Type: "div", Class: "small-7 medium-7 large-7", Style: "margin-bottom:1rem;", Name: "creatorNodeTypeSelect" },
                { Type: "div", Class: "small-7 medium-7 large-7", Style: "margin-bottom:1rem;", Name: "nodesList" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
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
                    that.Objects.NodesList.bind_data_source(CNAPI.GetLists({ NodeTypeID: nodeTypeId }));
                }
            });

            that.Objects.NodesList = new NewSingleDataContainer(elems["nodesList"], {
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

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.NodeTypeID) this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value || "", params.NodeTypeID.Title || "");
            if (params.CreatorNodeTypeID)
                this.Objects.CreatorNodeTypeSelect.set_item(params.CreatorNodeTypeID.Value || "", params.CreatorNodeTypeID.Title || "");

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

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                CreatorNodeTypeID: creatorNodeTypeId, _Title_CreatorNodeTypeID: creatorNodeType,
                NodeIDs: this.Objects.NodesList.get_items_string("|"),
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
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();