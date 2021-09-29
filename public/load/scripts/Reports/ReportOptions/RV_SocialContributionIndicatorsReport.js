(function () {
    if (window.ReportOptions && window.ReportOptions.RV && window.ReportOptions.RV.SocialContributionIndicatorsReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.RV = window.ReportOptions.RV || {};

    window.ReportOptions.RV.SocialContributionIndicatorsReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            CreatorNodeTypeSelect: null,
            NodesList: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js", "SingleDataContainer/NewSingleDataContainer.js"], {
            OnLoad: function () { that._initialize(params, done); }
        });
    }

    ReportOptions.RV.SocialContributionIndicatorsReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
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
            params = params || {};
            var that = this;

            if (params.CreatorNodeTypeID)
                this.Objects.CreatorNodeTypeSelect.set_item(params.CreatorNodeTypeID.Value || "", params.CreatorNodeTypeID.Title || "");

            if (params.BeginDate && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.BeginDate.Value, Label: params.BeginDate.Title });

            if (params.FinishDate && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.FinishDate.Value, Label: params.FinishDate.Title });
        },

        get_data: function () {
            var that = this;

            var index = this.Objects.CreatorNodeTypeSelect.selectedIndex;
            var creatorNodeTypeId = index < 0 ? "" : this.Objects.CreatorNodeTypeSelect.values[index];
            var creatorNodeType = index < 0 ? "" : this.Objects.CreatorNodeTypeSelect.keywords[index];

            var beginDate = (that.Objects.BeginDate || { Get: function () { return {} } }).Get();
            var finishDate = (that.Objects.FinishDate || { Get: function () { return {} } }).Get();

            return {
                CreatorNodeTypeID: creatorNodeTypeId, _Title_CreatorNodeTypeID: creatorNodeType,
                CreatorNodeIDs: Base64.encode(JSON.stringify({
                    Name: "GuidTableType",
                    Types: { Value: "Guid" },
                    Items: that.Objects.NodesList.get_items().map((itm) => ({ Value: itm.ID }))
                })),
                BeginDate: beginDate.Value || "",
                _Title_BeginDate: beginDate.Label || "",
                FinishDate: finishDate.Value || "",
                _Title_FinishDate: finishDate.Label || "",
            };
        },

        clear: function () {
            this.Objects.CreatorNodeTypeSelect.empty();
            this.Objects.NodesList.clear();
            this.Objects.ShowPersonalItemsSelect.selectedIndex = 0;
            if (this.Objects.BeginDate) this.Objects.BeginDate.Clear();
            if (this.Objects.FinishDate) this.Objects.FinishDate.Clear();
        },

        chart_date_from: function (value, title) {
            if (value && title) {
                if (this.Objects.BeginDate)
                    this.Objects.BeginDate.Set({ Value: value, Label: title });
            }
            else
                return (this.Objects.BeginDate || { Get: function () { return {} } }).Get();
        },

        chart_date_to: function (value, title) {
            if (value && title) {
                if (this.Objects.FinishDate)
                    this.Objects.FinishDate.Set({ Value: value, Label: title });
            }
            else
                return (this.Objects.FinishDate || { Get: function () { return {} } }).Get();
        }
    }
})();