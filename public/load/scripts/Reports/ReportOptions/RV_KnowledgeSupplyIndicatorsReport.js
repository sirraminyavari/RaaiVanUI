(function () {
    if (window.ReportOptions && window.ReportOptions.RV && window.ReportOptions.RV.KnowledgeSupplyIndicatorsReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.RV = window.ReportOptions.RV || {};

    window.ReportOptions.RV.KnowledgeSupplyIndicatorsReport = function (containerDiv, params, done) {
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

        GlobalUtilities.load_files(["API/CNAPI.js", "SingleDataContainer/NewSingleDataContainer.js"], {
            OnLoad: function () { that._initialize(params, done); }
        });
    }

    ReportOptions.RV.KnowledgeSupplyIndicatorsReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-8 large-6", Name: "nodeTypeSelect", Style: "margin-bottom:1rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                { Type: "div", Class: "small-12 medium-8 large-6", Name: "creatorNodeTypeSelect" },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                { Type: "div", Class: "small-12 medium-8 large-6", Name: "nodesList", Style: "margin:1rem 0rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.CreationDate + ":" }]
                },
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                {
                    Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
            ], that.ContainerDiv);

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:50%; font-size:0.7rem;",
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
                InputStyle: "width:50%; font-size:0.7rem;",
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
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name), nodes[i].NodeID]);
                    return arr;
                }
            });

            GlobalUtilities.append_calendar(elems["beginDate"], null, function (cal) {
                that.Objects.BeginDate = cal;
            });

            GlobalUtilities.append_calendar(elems["finishDate"], null, function (cal) {
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

            if (params.BeginDate && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.BeginDate.Value, Label: params.BeginDate.Title });

            if (params.FinishDate && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.FinishDate.Value, Label: params.FinishDate.Title });
        },

        get_data: function () {
            var that = this;
            
            var index = this.Objects.NodeTypeSelect.selectedIndex;
            
            var nodeTypeId = index < 0 ? "" : this.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : this.Objects.NodeTypeSelect.keywords[index];
            
            index = this.Objects.CreatorNodeTypeSelect.selectedIndex;
            var creatorNodeTypeId = index < 0 ? "" : this.Objects.CreatorNodeTypeSelect.values[index];
            var creatorNodeType = index < 0 ? "" : this.Objects.CreatorNodeTypeSelect.keywords[index];
            
            var beginDate = (that.Objects.BeginDate || { Get: function () { return {} } }).Get();
            var finishDate = (that.Objects.FinishDate || { Get: function () { return {} } }).Get();
            
            return {
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                CreatorNodeTypeID: creatorNodeTypeId, _Title_CreatorNodeTypeID: creatorNodeType,
                CreatorNodeIDs: this.Objects.NodesList.get_items_string("|"),
                BeginDate: beginDate.Value || "",
                _Title_BeginDate: beginDate.Label || "",
                FinishDate: finishDate.Value || "",
                _Title_FinishDate: finishDate.Label || "",
            };
        },

        clear: function () {
            var that = this;

            this.Objects.NodeTypeSelect.empty();
            this.Objects.CreatorNodeTypeSelect.empty();
            this.Objects.NodesList.clear();
            this.Objects.ShowPersonalItemsSelect.selectedIndex = 0;
            if (this.Objects.BeginDate) this.Objects.BeginDate.Clear();
            if (this.Objects.FinishDate) this.Objects.FinishDate.Clear();
        }
    }
})();