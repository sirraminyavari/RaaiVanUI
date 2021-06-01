(function () {
    if (window.ReportOptions && window.ReportOptions.USR && window.ReportOptions.USR.MostVisitedItemsReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.MostVisitedItemsReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            ItemTypeSelect: null,
            NodeTypeSelect: null,
            CountSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.USR.MostVisitedItemsReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "select", Class: "rv-input", Name: "itemTypeSelect",
                            Style: "width:15rem; margin-" + RV_RevFloat + ":2rem; font-size:0.7rem;",
                            Childs: [
                                {
                                    Type: "option",
                                    Attributes: [{ Name: "title", Value: "User" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.User }]
                                },
                                {
                                    Type: "option",
                                    Attributes: [{ Name: "title", Value: "Node" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Node }]
                                }
                            ]
                        },
                        {
                            Type: "select", Class: "rv-input", Name: "countSelect", Style: "width:10rem; font-size:0.7rem;",
                            Childs: [
                                {
                                    Type: "option",
                                    Attributes: [{ Name: "title", Value: "20" }],
                                    Childs: [{ Type: "text", TextValue: 20 }]
                                },
                                {
                                    Type: "option",
                                    Attributes: [{ Name: "title", Value: "50" }],
                                    Childs: [{ Type: "text", TextValue: 50 }]
                                },
                                {
                                    Type: "option",
                                    Attributes: [{ Name: "title", Value: "100" }],
                                    Childs: [{ Type: "text", TextValue: 100 }]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:none; margin-bottom:1rem;", Name: "nodeTypeSelect"
                },
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

            var nodeTypeDiv = elems["nodeTypeSelect"];

            that.Objects.ItemTypeSelect = elems["itemTypeSelect"];
            that.Objects.CountSelect = elems["countSelect"];

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:50%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID || ""]);
                    return arr;
                }
            });

            that.Objects.ItemTypeSelect.onchange = function () {
                var itemType = this[this.selectedIndex].title;
                nodeTypeDiv.style.display = itemType == "Node" ? "block" : "none";
            };

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

            if (params.ItemType == "Node") {
                this.Objects.ItemTypeSelect.selectedIndex = 1;
                if (params.NodeTypeID) this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value || "", params.NodeTypeID.Title || "");
            }

            this.Objects.CountSelect.selectedIndex = params.Count == 50 ? 1 : (params.Count == 100 ? 2 : 0);

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

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                ItemType: this.Objects.ItemTypeSelect[this.Objects.ItemTypeSelect.selectedIndex].title || "",
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                Count: this.Objects.CountSelect[this.Objects.CountSelect.selectedIndex].title || "",
                BeginDate: beginDate.Value,
                _Title_BeginDate: beginDate.Label,
                FinishDate: finishDate.Value,
                _Title_FinishDate: finishDate.Label,
            };
        },

        clear: function () {
            var that = this;

            that.Objects.ItemTypeSelect.selectedIndex = 0;
            that.Objects.NodeTypeSelect.empty();
            this.Objects.CountSelect.selectedIndex = 0;
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();