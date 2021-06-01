(function () {
    if (window.RelatedNodesViewer) return;

    window.RelatedNodesViewer = function (container, options, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        options = options || {};
        params = params || {};

        this.Objects = {
            ObjectID: options.ObjectID
        };

        this.Options = {
            Editable: options.Editable === true,
            OnInit: options.OnInit || function () { },
            OnNothingToDisplay: options.OnNothingToDisplay || function () { }
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js",], {
            OnLoad: function () { that.reset(params); }
        });
    }

    RelatedNodesViewer.prototype = {
        reset: function (params) {
            var that = this;

            CNAPI.GetRelatedNodesAbstract({
                NodeID: that.Objects.ObjectID, In: true, Out: true, InTags: true, OutTags: true, ParseResults: true,
                ResponseHandler: function (result) { that.show_related_nodes(result, params); }
            });
        },

        show_related_nodes: function (data, params) {
            var that = this;
            data = data || {};

            that.Container.innerHTML = "";

            if (data.TotalRelationsCount || that.Options.Editable) {
                jQuery(that.Container).fadeIn(500);
                that.Options.OnInit();
            }
            else {
                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBackgroundColor",
                    Style: "text-align:center; font-weight:500; font-size:1.2rem; color:rgb(100,100,100); padding:0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }], that.Container);

                return that.Options.OnNothingToDisplay();
            }

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div",
                Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBackgroundColor",
                Style: "position:relative; padding:0.5rem; min-height:2.6rem;" +
                    (!that.Options.Editable ? "" : "padding-" + RV_RevFloat + ":5rem;"),
                Childs: [
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "editButton",
                        Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.5rem; font-size:0.7rem;" +
                            (!that.Options.Editable ? "display:none;" : ""),
                        Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "_div" }
                ]
            }], that.Container);

            var container = elems["_div"];
            var editButton = elems["editButton"];

            var _create_node_type = function (nodeType) {
                return {
                    Type: "div", Class: "rv-border-radius-quarter rv-bg-color-warm-soft",
                    Style: "display:inline-block; font-size:0.7rem; font-weight:bold;" +
                        "padding:0.2rem 0.4rem; margin:0.2rem 0rem; margin-" + RV_RevFloat + ":0.5rem; cursor:pointer;",
                    //Link: RVAPI.ClassesPageURL({ NodeTypeID: nodeType.NodeTypeID }),
                    Properties: [{ Name: "onclick", Value: function () { that.expand_related_nodes(nodeType); } }],
                    Childs: [
                        { Type: "text", TextValue: Base64.decode(nodeType.NodeType) },
                        {
                            Type: "div", Class: "rv-circle",
                            Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; text-align:center;" +
                                "background-color:white; padding:0.1rem 0.3rem 0rem 0.3rem; color:red; min-width:1rem; font-size:0.6rem;",
                            Childs: [{ Type: "text", TextValue: nodeType.Count }]
                        }
                    ]
                };
            };

            var _create_section = function (nodeType, hide) {
                return GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "margin-top:0.5rem;" + (hide ? "display:none;" : ""),
                    Childs: !nodeType ? null : [_create_node_type(nodeType)]
                }], container);
            };

            var _add_node = function (cont, node) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftBorder SoftShadow",
                        Style: "display:inline-block; margin:0.2rem; padding:0.2rem 0.4rem; font-size:0.7rem; color:black; border-color:rgb(220,220,220);",
                        Tooltip: !node.CreationDate ? null : GlobalUtilities.convert_numbers_to_persian(node.CreationDate),
                        Link: RVAPI.NodePageURL({ NodeID: node.NodeID }),
                        Childs: [{ Type: "text", TextValue: Base64.decode(node.Name) }]
                    }
                ], cont);
            };

            var _add_more_nodes_button = function (cont, nodeType, moreCount) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter rv-air-button-base rv-air-button-black",
                        Style: "display:inline-block; margin:0.2rem; padding:0.2rem 0.4rem;" +
                            "font-size:0.7rem; cursor:pointer; font-weight:bold;",
                        Properties: [{ Name: "onclick", Value: function () { that.expand_related_nodes(nodeType); } }],
                        Childs: [{ Type: "text", TextValue: RVDic.AndNMoreItems.replace("[n]", moreCount) }]
                    }
                ], cont);
            };

            var _show = function (done) {
                jQuery(container).fadeOut(500, function () {
                    container.innerHTML = "";

                    var sections = {};

                    for (var i = 0; i < (data.NodeTypes || []).length; ++i) {
                        if (!(data.NodeTypes[i].Nodes || []).length) continue;

                        var nodeTypeId = data.NodeTypes[i].NodeTypeID;

                        if (!sections[nodeTypeId]) sections[nodeTypeId] = {
                            Section: _create_section(data.NodeTypes[i]), Nodes: data.NodeTypes[i].Nodes || []
                        };

                        jQuery.each(data.NodeTypes[i].Nodes || [], function (ind, val) {
                            _add_node(sections[nodeTypeId].Section["container"], val);
                        });

                        var moreCount = data.NodeTypes[i].Count - (data.NodeTypes[i].Nodes || []).length;

                        if (moreCount)
                            _add_more_nodes_button(sections[nodeTypeId].Section["container"], data.NodeTypes[i], moreCount);
                    }

                    var moreArea = _create_section(null, true)["container"];

                    jQuery.each(data.NodeTypes || [], function (ind, val) {
                        if ((val.Nodes || []).length) return;
                        else {
                            jQuery(moreArea).fadeIn(0);
                            GlobalUtilities.create_nested_elements([_create_node_type(val)], moreArea);
                        }
                    });

                    jQuery(container).fadeIn(500, function () { if (done) done(); });
                });
            };

            _show();

            var _refine_relations = function (done) {
                that.Container.innerHTML = "";
                that.reset(params);
                done();
            };

            var saving = false, processing = false;

            if (editButton) editButton.onclick = function () {
                if (saving || processing) return;
                processing = true;

                CNAPI.GetRelatedNodes({
                    NodeID: that.Objects.ObjectID, In: false, Out: true, InTags: false, OutTags: false, Count: 1000000,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;

                        jQuery.each(result.Nodes || [], function (ind, val) {
                            result.Nodes[ind].Name = Base64.decode(result.Nodes[ind].Name);
                            result.Nodes[ind].NodeType = Base64.decode(result.Nodes[ind].NodeType);
                            result.Nodes[ind].TypeName = Base64.decode(result.Nodes[ind].TypeName);
                        });

                        var prms = GlobalUtilities.extend(params || {}, { InitialNodes: result.Nodes || [] });

                        that.select_related_nodes(prms, function (nds) {
                            var strNodeIds = "";
                            for (var i = 0, lnt = (nds || []).length; i < lnt; ++i)
                                strNodeIds += (strNodeIds == "" ? "" : "|") + nds[i].NodeID;

                            saving = true;

                            CNAPI.SaveRelations({
                                NodeID: that.Objects.ObjectID, RelatedNodeIDs: strNodeIds, ParseResults: true,
                                ResponseHandler: function (results) {
                                    if (results.ErrorText) {
                                        alert(RVDic.MSG[results.ErrorText] || results.ErrorText);
                                        saving = false;
                                    }
                                    else if (results.Succeed) _refine_relations(function () { saving = false; });
                                }
                            });
                        });
                    }
                });
            };
        },

        expand_related_nodes: function (nodeType) {
            var that = this;
            nodeType = nodeType || {};

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "font-size:1.2rem; font-weight:bold; text-align:center; margin-bottom:1rem;",
                        Childs: [
                            { Type: "text", TextValue: Base64.decode(nodeType.NodeType) },
                            {
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.7rem; font-weight:normal;",
                                Link: RVAPI.ClassesPageURL({ NodeTypeID: nodeType.NodeTypeID, RelatedID: that.Objects.ObjectID }),
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-search", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    },
                                    { Type: "text", TextValue: RVDic.AdvancedSearch }
                                ]
                            }
                        ]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodesArea" }
                ]
            }]);

            GlobalUtilities.loading(elems["nodesArea"]);
            GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                OnLoad: function () {
                    elems["nodesArea"].innerHTML = "";

                    new NewSimpleListViewer(elems["nodesArea"], {
                        AutoGrow: false,
                        Options: {
                            InnerWidthOffset: 0, Width: null, SearchInput: nodeType.Count > 10, Count: 10,
                            OnDataRequest: function (options, done) {
                                CNAPI.GetRelatedNodes(GlobalUtilities.extend({}, options || {}, {
                                    NodeID: that.Objects.ObjectID, RelatedNodeTypeID: nodeType.NodeTypeID,
                                    In: true, Out: true, InTags: true, OutTags: true,
                                    SearchText: Base64.encode(options.SearchText), ParseResults: true,
                                    ResponseHandler: function (result) { done(result.Nodes || []); }
                                }));
                            },
                            ItemBuilder: function (container, item, params) {
                                item = item || {};

                                var elems = GlobalUtilities.create_nested_elements([
                                    {
                                        Type: "div", Name: "_div",
                                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter " +
                                            "rv-bg-color-white-softer SoftShadow SoftBorder",
                                        Style: "margin:0.3rem 0rem; padding:0.3rem; cursor:pointer; color:black; border-color:rgb(220,220,220);",
                                        Link: RVAPI.NodePageURL({ NodeID: item.NodeID }),
                                        Childs: [
                                            { Type: "text", TextValue: Base64.decode(item.Name) },
                                            {
                                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                                Style: "display:" + (item.AdditionalID ? "inline-block" : "none") +
                                                    "; margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                                                Childs: [{ Type: "text", TextValue: Base64.decode(item.AdditionalID) }]
                                            }
                                        ]
                                    }
                                ], container);

                                params.OnAfterAdd();
                            }
                        }
                    });
                }
            });
        },

        select_related_nodes: function (params, done) {
            var that = this;

            var nodeSelect = null;
            var initialNodes = params.InitialNodes || [];

            var isAdmin = (params.IsAreaAdmin === true) || (params.IsServiceAdmin === true) || (params.IsSystemAdmin === true);
            isAdmin = false; //isAdmin must be false, because admin must not be able to free select nodes from now (1398/08/27)

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "container"
            }]);

            GlobalUtilities.loading(elems["container"]);
            var showedDiv = GlobalUtilities.show(elems["container"]);

            var _free_node_select = function (p) {
                GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                    OnLoad: function () {
                        var _params = GlobalUtilities.extend({
                            Options: {
                                Title: RVDic.PleaseSelectRelatedNodes,
                                NodeTypeSearchBox: true,
                                Filters: true,
                                ShowBottomBar: true,
                                OnConfirm: function () {
                                    var _selectedNodes = nodeSelect.get_items({ Check: true });
                                    showedDiv.Close();
                                    if (done) done(_selectedNodes);
                                },
                                OnCancel: function () { showedDiv.Close(); }
                            }
                        }, p || {});

                        nodeSelect = new NodeSelect(elems["container"], _params);

                        for (var i = 0, lnt = initialNodes.length; i < lnt; ++i) nodeSelect.add_item(initialNodes[i], true);
                    }
                });
            };

            if (!isAdmin && params.IsKnowledge && ((params.NodeSelectType == "Single") || (params.NodeSelectType == "Limited"))) {
                GlobalUtilities.load_files(["API/KnowledgeAPI.js"], {
                    OnLoad: function () {
                        KnowledgeAPI.GetCandidateRelations({
                            KnowledgeID: that.Objects.ObjectID, ParseResults: true,
                            ResponseHandler: function (result) {
                                var nodes = result.Nodes || [], nodeTypes = result.NodeTypes || [];
                                var hasCandidateRelation = nodes.length > 0 || nodeTypes.length > 0;

                                _free_node_select({
                                    Options: {
                                        Limits: {
                                            Count: params.NodeSelectType == "Single" ? 1 : -1,
                                            Nodes: hasCandidateRelation ? nodes : null, NodeTypes: hasCandidateRelation ? nodeTypes : null
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else _free_node_select();
        }
    };
})();