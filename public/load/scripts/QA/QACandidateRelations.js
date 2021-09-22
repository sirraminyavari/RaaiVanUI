(function () {
    if (window.QACandidateRelations) return;

    window.QACandidateRelations = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {}

        this.Objects = {
            WorkFlowID: params.WorkFlowID || ""
        };

        this.Options = {
            OnViewMode: params.OnViewMode || function () { },
            OnEditMode: params.OnEditMode || function () { }
        };

        var that = this;
        
        GlobalUtilities.load_files(["API/QAAPI.js", "Ontology/NodeSelect.js"], {
            OnLoad: function () { that._preinit(params); }
        });
    }

    QACandidateRelations.prototype = {
        _preinit: function (params) {
            var that = this;
            params = params || {};
            
            QAAPI.GetCandidateRelations({
                ID: that.Objects.WorkFlowID, ParseResults: true,
                ResponseHandler: function (result) {
                    params.CandidateRelations = result;
                    that._initialize(params);
                }
            });
        },

        do_edit: null,

        _initialize: function (params) {
            params = params || {};
            var that = this;
            
            var nodeTypes = (params.CandidateRelations || {}).NodeTypes || [];
            var nodes = (params.CandidateRelations || {}).Nodes || [];

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "viewArea", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-6 large-4",
                            Style: "padding:0rem 0.3rem 0.5rem 0.3rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CandidateRelations + ":" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-6 large-8",
                            Style: "padding:0rem 0.3rem; font-size:0.7rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "font-weight:bold;", Name: "nodeTypesTitle",
                                    Childs: [{ Type: "text", TextValue: RVDic.NodeTypes }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypesArea" },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "font-weight:bold; margin-top:0.5rem;", Name: "nodesTitle",
                                    Childs: [{ Type: "text", TextValue: RVDic.Nodes }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodesArea" }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding:0rem 0.3rem 0.5rem 0.3rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CandidateRelations + ":" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeSelect"
                        }
                    ]
                },
                { Type: "div", Style: "clear:both;" }
            ], that.ContainerDiv);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var nodeTypesArea = elems["nodeTypesArea"];
            var nodesArea = elems["nodesArea"];
            var nodeTypesTitle = elems["nodeTypesTitle"];
            var nodesTitle = elems["nodesTitle"];

            var nodeSelect = new NodeSelect(elems["nodeSelect"], { Options: { NodeTypesSelectable: true } });
            
            var _ntIds = [];
            for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i) {
                if (!nodeSelect.node_type_exists(nodeTypes[i].NodeTypeID)) {

                    nodeSelect.add_node_type(nodeTypes[i]);
                    _ntIds.push(nodeTypes[i].NodeTypeID);
                }

                nodeSelect.check_node_type(nodeTypes[i].NodeTypeID);
            }

            if (_ntIds.length > 0) nodeSelect.check_trees(_ntIds);

            for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                nodes[i].Name = Base64.decode(nodes[i].Name || "");
                nodes[i].NodeType = Base64.decode(nodes[i].NodeType || "");

                nodeSelect.add_item(nodes[i]);
            }
            
            var _add_view_node = function (node) {
                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "SoftBorder",
                        Style: "display:inline-block; margin:0.3rem; padding:0.3rem;" +
                            GlobalUtilities.border_radius("0.3rem"),
                        Childs: [
                            {
                                Type: "a", Style: "color:black;", Name: "_a",
                                Attributes: [{ Name: "href", Value: RVAPI.NodePageURL({ NodeID: node.NodeID }) }],
                                Properties: [
                                    { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                                    { Name: "onmouseout", Value: function () { this.style.color = "black"; } }
                                ]
                            }
                        ]
                    }
                ], nodesArea);

                _el["_a"].innerHTML = "";

                GlobalUtilities.create_nested_elements([{
                    Type: "label", Style: "cursor:pointer;",
                    Childs: [
                        { Type: "text", TextValue: node.Name },
                        (!node.NodeType ? null : {
                            Type: "span", Style: "font-size:0.7rem; margin-" + window.RV_Float + ":0.4rem;",
                            Childs: [
                                { Type: "text", TextValue: "(" },
                                {
                                    Type: "span", Style: "color:gray;",
                                    Childs: [{ Type: "text", TextValue: node.NodeType }]
                                },
                                { Type: "text", TextValue: ")" }
                            ]
                        })
                    ]
                }], _el["_a"]);
            }

            var _set_data = function () {
                nodeTypesArea.innerHTML = "";
                nodesArea.innerHTML = "";

                nodeTypesTitle.style.display = nodeTypes.length > 0 ? "block" : "none";
                nodesTitle.style.display = nodes.length > 0 ? "block" : "none";

                for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "SoftBorder SoftBackgroundColor",
                            Style: "display:inline-block; margin:0.3rem; padding:0.3rem;" +
                                GlobalUtilities.border_radius("0.3rem"),
                            Childs: [{ Type: "text", TextValue: nodeTypes[i].TypeName }]
                        }
                    ], nodeTypesArea);
                }

                for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                    _add_view_node(nodes[i]);

                nodeSelect.show_all_node_types();
            }

            var __Editing = false;

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = __Editing ? "block" : "none";
                    viewArea.style.display = __Editing ? "none" : "flex";

                    _set_data();

                    if (__Editing) that.Options.OnEditMode();
                    else that.Options.OnViewMode();
                }

                if (__Editing === true) {
                    var newNodes = nodeSelect.get_items();
                    var newNodeTypes = nodeSelect.get_node_types(true);

                    var strNodeIds = "";
                    for (var i = 0, lnt = newNodes.length; i < lnt; ++i)
                        strNodeIds += (strNodeIds == "" ? "" : "|") + newNodes[i].NodeID;

                    var strNodeTypeIds = "";
                    for (var i = 0, lnt = newNodeTypes.length; i < lnt; ++i)
                        strNodeTypeIds += (strNodeTypeIds == "" ? "" : "|") + newNodeTypes[i].NodeTypeID;

                    GlobalUtilities.block(that.ContainerDiv);

                    QAAPI.SetCandidateRelations({
                        WorkFlowID: that.Objects.WorkFlowID,
                        NodeTypeIDs: strNodeTypeIds, NodeIDs: strNodeIds, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                nodes = newNodes;
                                nodeTypes = newNodeTypes;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(that.ContainerDiv);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            }; //end of _on_edit

            that.do_edit = function () {
                _on_edit();
            };

            if (nodes.length == 0 && nodeTypes.length == 0) _on_edit();
            _set_data();
        }
    }
})();