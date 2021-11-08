(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.NodeVisitDetailsReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.NodeVisitDetailsReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Objects = {
            NodeTypeSelect: null,
            NodesList: null,
            HierarchyCheckbox: null,
            GroupSelect: null,
            UniqueCheckbox: null,
            DateFrom: null,
            DateTo: null,
            Config: GlobalUtilities.extend({
                Groups: [],
                FullAccess: false,
                GroupAdminAccess: false
            }, params.Config)
        };

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["UsersAPI", "CNAPI"] },
            "SingleDataContainer/NewSingleDataContainer.js",
            "Reports/ReportGroupSelect.js"
        ], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.CN.NodeVisitDetailsReport.prototype = {
        _initialize: function (params, done) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Nodes + ":" }]
                        },
                        {
                            Type: "div", Style: "flex:1 1 auto;",
                            Childs: [{
                                Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0;",
                                Childs: [
                                    { Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeTypeSelect" },
                                    {
                                        Type: "div", Class: "small-6 medium-6 large-6", Name: "nodes",
                                        Style: "padding-" + RV_Float + ":1rem;"
                                    }
                                ]
                            }]
                        }
                    ]
                },
                {
                    Type: "div", Style: "display:flex; flex-flow:row; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto;",
                            Childs: [{ Type: "checkbox", Style: "width:1.2rem; height:1.2rem;", Name: "hierarchy" }]
                        },
                        {
                            Type: "div", Style: "flex:1 0 auto; padding-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.ConsideringTheSubNodeTypes }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Creator + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "groups" }
                    ]
                },
                {
                    Type: "div", Style: "display:flex; flex-flow:row; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto;",
                            Childs: [{ Type: "checkbox", Style: "width:1.2rem; height:1.2rem;", Name: "unique" }]
                        },
                        {
                            Type: "div", Style: "flex:1 0 auto; padding-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.RPT.CN.NodeVisitDetailsReport.BasedOnUniqueUsers }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":2rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Date + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "dateFrom" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 1.5rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "dateTo" }
                    ]
                }
            ], that.ContainerDiv);

            that.Objects.HierarchyCheckbox = elems["hierarchy"];
            that.Objects.UniqueCheckbox = elems["unique"];

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    return ((GlobalUtilities.to_json(responseText) || {}).NodeTypes || [])
                        .map(nt => [Base64.decode(nt.TypeName), nt.NodeTypeID]);
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex];
                    var nodeType = this.keywords[this.selectedIndex];
                    that.Objects.NodesList.bind_data_source(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.NodesList.Objects.Autosuggest.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });

            that.Objects.NodesList = new NewSingleDataContainer(elems["nodes"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + "...",
                NoButtons: true,
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    return ((GlobalUtilities.to_json(responseText) || {}).Nodes || [])
                        .map(nt => [Base64.decode(nt.Name), nt.NodeID]);
                }
            });
            
            that.Objects.GroupSelect = new ReportGroupSelect(elems["groups"], {
                Groups: that.Objects.Config.Groups,
                MultiSelect: true,
                AdminMode: that.Objects.Config.FullAccess,
                NodeTypesSelectable: false,
                UsersSelectable: that.Objects.Config.HasPersonalMode
            });
            
            GlobalUtilities.append_calendar(elems["dateFrom"], { ClearButton: true }, function (cal) {
                that.Objects.DateFrom = cal;
            });

            GlobalUtilities.append_calendar(elems["dateTo"], { ClearButton: true }, function (cal) {
                that.Objects.DateTo = cal;
            });

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.NodeTypeID) this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value, params.NodeTypeID.Title);

            if (that.Objects.HierarchyCheckbox)
                that.Objects.HierarchyCheckbox[!!params.GrabSubNodeTypes ? "check" : "uncheck"]();

            if (that.Objects.UniqueCheckbox)
                that.Objects.UniqueCheckbox[!!params.UniqueVisitors ? "check" : "uncheck"]();

            if (params.DateFrom && that.Objects.DateFrom)
                that.Objects.DateFrom.Set({ Value: params.DateFrom.Value, Label: params.DateFrom.Title });

            if (params.DateTo && that.Objects.DateTo)
                that.Objects.DateTo.Set({ Value: params.DateTo.Value, Label: params.DateTo.Title });
        },

        get_data: function () {
            var that = this;

            var items = !that.Objects.GroupSelect ? {} : that.Objects.GroupSelect.get_items() || {};

            if (!that.Objects.Config.FullAccess && !(items.Nodes || []).length && !(items.Users || []).length) {
                alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.Creator));
                return false;
            }

            var index = that.Objects.NodeTypeSelect.selectedIndex;
            var nodeTypeId = index < 0 ? "" : that.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : that.Objects.NodeTypeSelect.keywords[index];

            var dateFrom = (that.Objects.DateFrom || { Get: function () { return {} } }).Get();
            var dateTo = (that.Objects.DateTo || { Get: function () { return {} } }).Get();

            return {
                NodeTypeID: nodeTypeId,
                _Title_NodeTypeID: nodeType,
                NodeIDs: Base64.encode(JSON.stringify({
                    Name: "GuidTableType",
                    Types: { Value: "Guid" },
                    Items: that.Objects.NodesList.get_items().map((itm) => ({ Value: itm.ID }))
                })),
                GrabSubNodeTypes: !that.Objects.HierarchyCheckbox ? null : that.Objects.HierarchyCheckbox.Checked,
                CreatorGroupIDs: Base64.encode(JSON.stringify({
                    Name: "GuidTableType",
                    Types: { Value: "Guid" },
                    Items: (items.Nodes || []).map((itm) => ({ Value: itm.NodeID }))
                })),
                CreatorUserIDs: Base64.encode(JSON.stringify({
                    Name: "GuidTableType",
                    Types: { Value: "Guid" },
                    Items: (items.Users || []).map((itm) => ({ Value: itm.UserID }))
                })),
                UniqueVisitors: !that.Objects.UniqueCheckbox ? null : that.Objects.UniqueCheckbox.Checked,
                DateFrom: dateFrom.Value || "",
                _Title_DateFrom: dateFrom.Label || "",
                DateTo: dateTo.Value || "",
                _Title_DateTo: dateTo.Label || ""
            };
        },

        clear: function () {
            var that = this;

            if (this.Objects.NodeTypeSelect) this.Objects.NodeTypeSelect.empty();
            if (this.Objects.NodesList) this.Objects.NodesList.clear();
            if (this.Objects.DateFrom) this.Objects.DateFrom.Clear();
            if (this.Objects.DateTo) this.Objects.DateTo.Clear();
        },

        chart_date_from: function (value, title) {
            if (value && title) {
                if (this.Objects.DateFrom)
                    this.Objects.DateFrom.Set({ Value: value, Label: title });
            }
            else
                return (this.Objects.DateFrom || { Get: function () { return {} } }).Get();
        },

        chart_date_to: function (value, title) {
            if (value && title) {
                if (this.Objects.DateTo)
                    this.Objects.DateTo.Set({ Value: value, Label: title });
            }
            else
                return (this.Objects.DateTo || { Get: function () { return {} } }).Get();
        }
    }
})();