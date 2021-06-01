(function () {
    if (window.ReportOptions && window.ReportOptions.WF && window.ReportOptions.WF.StateNodesCountReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.WF = window.ReportOptions.WF || {};

    window.ReportOptions.WF.StateNodesCountReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            WorkFlowSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["WFAPI", "CNAPI"] }], {
            OnLoad: function () { that._initialize(params, done); }
        });
    }

    ReportOptions.WF.StateNodesCountReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;", Name: "nodeTypeSelect"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_Float + ":0.5rem;", Name: "workflowSelect"
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
                InnerTitle: RVDic.NodeTypeSelect + "..."
            });

            that.Objects.WorkFlowSelect = GlobalUtilities.append_autosuggest(elems["workflowSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.WorkFlowSelect + "..."
            });

            WFAPI.GetWorkFlowOwners({
                ParseResults: true,
                ResponseHandler: function (result) {
                    var nodeTypes = result.NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].Name), nodeTypes[i].NodeTypeID]);
                    that.Objects.NodeTypeSelect.bindArray(arr);

                    that.set_data(params);
                }
            });

            WFAPI.GetWorkFlows({
                ParseResults: true,
                ResponseHandler: function (result) {
                    var workflows = result.WorkFlows || [];
                    var arr = [];
                    for (var i = 0, lnt = workflows.length; i < lnt; ++i)
                        arr.push([Base64.decode(workflows[i].Name), workflows[i].WorkFlowID]);
                    that.Objects.WorkFlowSelect.bindArray(arr);

                    that.set_data(params);
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
            if (params.WorkFlowID) this.Objects.WorkFlowSelect.set_item(params.WorkFlowID.Value || "", params.WorkFlowID.Title || "");

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

            index = this.Objects.WorkFlowSelect.selectedIndex;
            var workflowId = index < 0 ? "" : this.Objects.WorkFlowSelect.values[index];
            var workflow = index < 0 ? "" : this.Objects.WorkFlowSelect.keywords[index];

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                WorkFlowID: workflowId, _Title_WorkFlowID: workflow,
                LowerCreationDateLimit: beginDate.Value,
                _Title_LowerCreationDateLimit: beginDate.Label,
                UpperCreationDateLimit: finishDate.Value,
                _Title_UpperCreationDateLimit: finishDate.Label
            };
        },

        clear: function () {
            var that = this;

            this.Objects.NodeTypeSelect.empty();
            this.Objects.WorkFlowSelect.empty();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();