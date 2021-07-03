(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.CreatorUsersReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.CreatorUsersReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            NodeSelect: null,
            MembershipNodeTypeSelect: null,
            MembershipNodeSelect: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.CN.CreatorUsersReport.prototype = {
        _initialize: function (params, done) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem; margin-bottom:1rem; position:relative; padding-" + RV_Float + ":11rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.NodeSelect + ":" }]
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeTypeSelect",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeSelect",
                            Style: "padding-" + RV_Float + ":0.5rem;"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem; position:relative; padding-" + RV_Float + ":11rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Contributors + " (" + RVDic.Optional + ") :" }]
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "membershipNodeTypeSelect",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "membershipNodeSelect",
                            Style: "padding-" + RV_Float + ":0.5rem;"
                        }
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
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex];
                    var nodeType = this.keywords[this.selectedIndex];
                    that.Objects.NodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.NodeSelect.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });
            
            that.Objects.NodeSelect = GlobalUtilities.append_autosuggest(elems["nodeSelect"], {
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

            that.Objects.MembershipNodeTypeSelect = GlobalUtilities.append_autosuggest(elems["membershipNodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.OwnerNodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID || ""]);
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    var nodeTypeId = this.values[index];
                    var nodeType = this.keywords[index];
                    that.Objects.MembershipNodeSelect.clear();
                    that.Objects.MembershipNodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.MembershipNodeSelect.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });

            that.Objects.MembershipNodeSelect = GlobalUtilities.append_autosuggest(elems["membershipNodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + "...",
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

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;

            params = params || {};
            if (params.NodeTypeID) this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value || "", params.NodeTypeID.Title || "");
            if (params.NodeID) this.Objects.NodeSelect.set_item(params.NodeID.Value || "", params.NodeID.Title || "");
            if (params.MembershipNodeTypeID)
                this.Objects.MembershipNodeTypeSelect.set_item(params.MembershipNodeTypeID.Value || "", params.MembershipNodeTypeID.Title || "");
            if (params.MembershipNodeID)
                this.Objects.MembershipNodeSelect.set_item(params.MembershipNodeID.Value || "", params.MembershipNodeID.Title || "");
        },

        get_data: function () {
            var that = this;

            var index = this.Objects.NodeSelect.selectedIndex;
            var nodeId = index < 0 ? "" : this.Objects.NodeSelect.values[index];
            var node = index < 0 ? "" : this.Objects.NodeSelect.keywords[index];

            index = this.Objects.MembershipNodeTypeSelect.selectedIndex;
            var membershipNodeTypeId = index < 0 ? "" : this.Objects.MembershipNodeTypeSelect.values[index];
            var membershipNodeType = index < 0 ? "" : this.Objects.MembershipNodeTypeSelect.keywords[index];

            index = this.Objects.MembershipNodeSelect.selectedIndex;
            var membershipNodeId = index < 0 ? "" : this.Objects.MembershipNodeSelect.values[index];
            var membershipNode = index < 0 ? "" : this.Objects.MembershipNodeSelect.keywords[index];

            if (!nodeId) {
                alert(RVDic.Checks.PleaseSelectNode);
                return false;
            }

            return {
                NodeID: nodeId, _Title_NodeID: node,
                MembershipNodeTypeID: membershipNodeTypeId, _Title_MembershipNodeTypeID: membershipNodeType,
                MembershipNodeID: membershipNodeId, _Title_MembershipNodeID: membershipNode
            };
        },

        clear: function () {
            var that = this;

            this.Objects.NodeTypeSelect.empty();
            this.Objects.NodeSelect.empty();
            this.Objects.MembershipNodeTypeSelect.empty();
            this.Objects.MembershipNodeSelect.empty();
        }
    }
})();