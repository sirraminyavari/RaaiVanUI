(function () {
    if (window.NodeOwnerSelect) return;

    window.NodeOwnerSelect = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            NodeTypeID: params.NodeTypeID || "",
            Limits: []
        }

        this.Options = {
            OnSelect: params.OnSelect
        }

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    NodeOwnerSelect.prototype = {
        _preinit: function () {
            var that = this;

            CNAPI.GetContributionLimits({ NodeTypeID: that.Objects.NodeTypeID,
                ParseResults: true,
                ResponseHandler: function (limits) {
                    limits = limits || [];
                    var limitIds = [];

                    for (var i = 0, lnt = limits.length; i < lnt; ++i) {
                        limits[i].Name = Base64.decode(limits[i].Name || "");
                        limitIds.push(limits[i].NodeTypeID);
                    }

                    that.Objects.Limits = limits;

                    CNAPI.GetMemberNodes({ NodeTypeIDs: limitIds.join("|"),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            var nodes = result.Nodes || [];

                            for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                                nodes[i].Name = Base64.decode(nodes[i].Name);
                                nodes[i].NodeType = Base64.decode(nodes[i].NodeType);
                            }

                            that._initialize(nodes);
                        }
                    });
                }
            });
        },

        _initialize: function (memberNodes) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: RVDic.SelectTheOwnerOfTheIntellectualProperty }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:1rem 0rem;",
                    Childs: [
                        { Type: "div", Class: "small-5 medium-5 large-5", Name: "nodeTypeSelect" },
                        {
                            Type: "div", Class: "small-7 medium-7 large-7", Name: "nodeSelect",
                            Style: "padding-" + RV_Float + ":1rem;"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "font-weight:bold; color:gray;" + ((memberNodes || []).length ? "" : "display:none;"),
                    Childs: [{ Type: "text", TextValue: RVDic.GroupsThatYouAreMemberIn + ":" }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea", Style: "margin-top:1rem;" }
            ], that.ContainerDiv);

            var _onselect = function () {
                var nodeTypeId = nodeTypeSelect.values[nodeTypeSelect.selectedIndex];
                var nodeType = nodeTypeSelect.keywords[nodeTypeSelect.selectedIndex];
                nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                GlobalUtilities.set_inner_title(nodeSelect.InputElement, RVDic.SelectN.replace("[n]", nodeType) + "...");
            }

            var nodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.NodeTypeSelect + "...", 
                AjaxDataSource: (that.Objects.Limits.length > 0 ? null : CNAPI.GetNodeTypesDataSource()),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: _onselect
            });

            var nodeSelect = GlobalUtilities.append_autosuggest(elems["nodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.NodeSelect + "...", 
                ResponseParser: function (responseText) {
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name), nodes[i].NodeID]);
                    return arr;
                },
                OnSelect: function () { that.select({ NodeID: this.values[this.selectedIndex], Name: this.keywords[this.selectedIndex] }); }
            });

            if (that.Objects.Limits.length > 0) {
                var arr = [];
                for (var i = 0, lnt = that.Objects.Limits.length; i < lnt; ++i)
                    arr.push([that.Objects.Limits[i].Name, that.Objects.Limits[i].NodeTypeID]);
                nodeTypeSelect.bindArray(arr);

                if (arr.length == 1) {
                    nodeTypeSelect.set_item(that.Objects.Limits[0].NodeTypeID, that.Objects.Limits[0].Name);
                    _onselect();

                    elems["nodeTypeSelect"].innerHTML = "";

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "padding:0.3rem; margin:0.6rem 0.3rem 0rem 0.3rem;",
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                            Childs: [{ Type: "text", TextValue: RVDic.NodeType + ": " + that.Objects.Limits[0].Name }]
                        }
                    ], elems["nodeTypeSelect"]);
                }
            }

            for (var i = 0, lnt = (memberNodes || []).length; i < lnt; ++i)
                that.add_item(elems["itemsArea"], memberNodes[i]);
        },

        add_item: function (container, node) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                    Style: "display:inline-block; padding:0.3rem; margin:0.3rem; cursor:pointer;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                        { Name: "onmouseout", Value: function () { this.style.color = "black"; } },
                        { Name: "onclick", Value: function () { that.select({ NodeID: node.NodeID, Name: node.Name }); } }
                    ],
                    Childs: [
                        { Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: node.Name }] },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; color:gray;",
                            Childs: [{ Type: "text", TextValue: "(" + node.NodeType + ")" }]
                        }
                    ]
                }
            ], container);
        },

        select: function (node) {
            if (this.Options.OnSelect) this.Options.OnSelect(node);
        }
    }
})();