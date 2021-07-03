(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.RelatedNodesCountReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.RelatedNodesCountReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            RelatedNodeTypeSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.CN.RelatedNodesCountReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

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
                            Class: "small-12 medium-12 large-12", Title: RVDic.NodeTypeSelect, Style: "margin-bottom:1rem;",
                            Childs: [{ Type: "div", Style: "width:calc(50% - 0.5rem);", Name: "nodeTypeSelect" }]
                        }),
                        create_titled({
                            Class: "small-12 medium-12 large-12", Title: RVDic.RelatedNodeTypeSelect, Style: "margin-bottom:1rem;",
                            Childs: [{ Type: "div", Style: "width:calc(50% - 0.5rem);", Name: "relatedNodeTypeSelect" }]
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

            that.Objects.RelatedNodeTypeSelect = GlobalUtilities.append_autosuggest(elems["relatedNodeTypeSelect"], {
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

            if (params.NodeTypeID) this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value, params.NodeTypeID.Title);
            
            if (params.RelatedNodeTypeID)
                this.Objects.RelatedNodeTypeSelect.set_item(params.RelatedNodeTypeID.Value, params.RelatedNodeTypeID.Title);

            if (params.CreationDateFrom && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.CreationDateFrom.Value, Label: params.CreationDateFrom.Title });

            if (params.CreationDateTo && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.CreationDateTo.Value, Label: params.CreationDateTo.Title });
        },

        get_data: function () {
            var that = this;

            var index = this.Objects.NodeTypeSelect.selectedIndex;
            var nodeTypeId = index < 0 ? "" : this.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : this.Objects.NodeTypeSelect.keywords[index];

            index = this.Objects.RelatedNodeTypeSelect.selectedIndex;
            var relatedNodeTypeId = index < 0 ? "" : this.Objects.RelatedNodeTypeSelect.values[index];
            var relatedNodeType = index < 0 ? "" : this.Objects.RelatedNodeTypeSelect.keywords[index];

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            if (!nodeTypeId) {
                alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.NodeType));
                return false;
            }
            
            return {
                NodeTypeID: nodeTypeId, _Title_NodeID: nodeType,
                RelatedNodeTypeID: relatedNodeTypeId, _Title_RelatedNodeTypeID: relatedNodeType,
                CreationDateFrom: beginDate.Value,
                _Title_CreationDateFrom: beginDate.Label,
                CreationDateTo: finishDate.Value,
                _Title_CreationDateTo: finishDate.Label,
                In: true, Out: true, InTags: true, OutTags: true
            };
        },

        clear: function () {
            var that = this;

            that.Objects.NodeTypeSelect.empty();
            that.Objects.RelatedNodeTypeSelect.empty();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();