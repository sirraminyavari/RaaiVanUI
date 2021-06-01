(function () {
    if (window.AllNodesList) return;

    window.AllNodesList = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            SearchInput: null,
            NodeTypes: null,
            NodesContainer: null
        };

        this.Objects = {
            OrderVariableName: !window.RVGlobal.CurrentUserID ? null : ("ServicesOrder_" + RVGlobal.CurrentUserID),
            NodeTypes: {},
            CurrentNodeTypeIDs: []
        };

        this.Options = {
            InitialNodeTypes: {},
            InitialRelatedItem: params.InitialRelatedItem,
            ShowAllNodeTypes: params.ShowAllNodeTypes === true,
            SortByName: params.SortByName === true
        };

        if (params.InitialNodeTypes) {
            for (var i = 0; i < params.InitialNodeTypes.length; ++i)
                this.Options.InitialNodeTypes[params.InitialNodeTypes[i].NodeTypeID] = params.InitialNodeTypes[i];
        }

        var that = this;

        that.processing(true);

        GlobalUtilities.load_files(["API/CNAPI.js", "API/PrivacyAPI.js", "CN/NodesViewer.js"], {
            OnLoad: function () { that.preinit(); }
        });
    };

    AllNodesList.prototype = {
        preinit: function () {
            var that = this;

            var _add_other_node_types = function (nodeTypeIds) {
                nodeTypeIds = nodeTypeIds || [];

                if (!that.Options.ShowAllNodeTypes) return that.initialize(nodeTypeIds);

                CNAPI.GetNodeTypes({
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        var newIds = (result.NodeTypes || [])
                            .filter(function (x) { return !that.Objects.NodeTypes[x.NodeTypeID]; })
                            .map(function (x) { return x.NodeTypeID; });

                        PrivacyAPI.CheckAccess({
                            ObjectIDs: newIds.join("|"), Type: "NodeType", Permissions: ["View", "ViewAbstract"].join("|"),
                            ParseResults: true,
                            ResponseHandler: function (r) {
                                (result.NodeTypes || [])
                                    .filter(function (x) { return !that.Objects.NodeTypes[x.NodeTypeID] && (r[x.NodeTypeID] || []).length; })
                                    .forEach(function (nt) {
                                        nodeTypeIds.push(nt.NodeTypeID);
                                        that.Objects.NodeTypes[nt.NodeTypeID] = nt;
                                    });

                                that.initialize(nodeTypeIds);
                            }
                        });
                    }
                });
            };
            
            CNAPI.GetServices({
                ParseResults: true,
                ResponseHandler: function (result) {
                    (result.Services || []).forEach(function (s) {
                        that.Objects.NodeTypes[s.NodeTypeID] = s;
                    });

                    RVAPI.GetVariable({
                        Name: that.Objects.OrderVariableName, ParseResults: true,
                        ResponseHandler: function (r) {
                            var order = JSON.parse(Base64.decode((r || {}).Value) || "{}").Order || [];

                            var newOrder = [];
                            var dic = {};

                            //Recent Items
                            var recentItems = GlobalUtilities.get_recent_items("nodetypes", 3);

                            recentItems.forEach(function (itm) {
                                if (!that.Objects.NodeTypes[itm.NodeTypeID]) that.Objects.NodeTypes[itm.NodeTypeID] = itm;
                                that.Objects.NodeTypes[itm.NodeTypeID].IsRecent = dic[itm.NodeTypeID] = true;
                                newOrder.push(itm.NodeTypeID);
                            });
                            //end of Recent Items
                            
                            for (var i = 0, lnt = order.length; i < lnt; ++i) {
                                if (dic[order[i]]) continue;
                                else dic[order[i]] = true;
                                
                                if (that.Objects.NodeTypes[order[i]]) newOrder.push(order[i]);
                            }

                            for (var id in that.Objects.NodeTypes)
                                if (!dic[id]) newOrder.push(id);

                            _add_other_node_types(newOrder);
                        }
                    });
                }
            });
        },

        initialize: function (nodeIds) {
            var that = this;

            if (that.Options.SortByName) {
                var sorted = nodeIds.filter(function (id) { return !!that.Objects.NodeTypes[id].IsRecent; });

                var newSorted = nodeIds.filter(function (id) { return !sorted.some(function (i) { return i == id; }); })
                    .map(function (id) {
                        var name = Base64.decode(that.Objects.NodeTypes[id].TypeName || that.Objects.NodeTypes[id].NodeType);
                        return { ID: id, Name: name };
                    })
                    .sort(function (a, b) { return a.Name.localeCompare(b.Name); }) //localeCompare sorts based on persian alphabet
                    .map(function (itm) { return itm.ID; });

                nodeIds = sorted.concat(newSorted);
            }

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-4 large-3", Style: "padding:0rem 0.5rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.5rem; position:relative;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-search fa-lg", Style: "color:rgb(200,200,200);",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "input", Class: "rv-input", Name: "searchInput", InnerTitle: RVDic.Search,
                                    Style: "width:100%; font-size:0.6rem; padding-" + RV_RevFloat + ":1.7rem;"
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypes" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-8 large-9", Name: "nodes",
                    Style: "display:none; padding:0rem 0.5rem;"
                }
            ], that.Container);

            that.Interface.SearchInput = elems["searchInput"];
            that.Interface.NodeTypes = elems["nodeTypes"];
            that.Interface.NodesContainer = elems["nodes"];

            jQuery(that.Interface.SearchInput).focus(function () {
                jQuery(that.Interface.SearchInput).select();
            });

            //initial node types
            var arr = [];
            for (var id in that.Options.InitialNodeTypes) {
                arr.push(id);
                that.add_node_type(that.Interface.NodeTypes, that.Options.InitialNodeTypes[id]);
            }
            that.Objects.CurrentNodeTypeIDs = arr;
            //end of initial node types
            
            (nodeIds || []).forEach(function (id) {
                that.add_node_type(that.Interface.NodeTypes, that.Objects.NodeTypes[id]);
            });

            jQuery(elems["nodeTypes"]).fadeIn(500);

            that.show_multiple(function () {
                that.processing(false);

                jQuery(that.Interface.SearchInput).focus();
                GlobalUtilities.set_onchangeorenter(that.Interface.SearchInput, function () { that.search_node_types(); });
            });
        },

        search_node_types: function () {
            var that = this;

            if (that.__Searching) return;

            var searchText = GlobalUtilities.trim(that.Interface.SearchInput.value);

            if (!searchText) return that.unhide_all(that.Interface.NodeTypes);

            that.__Searching = true;

            that.hide_all(that.Interface.NodeTypes);

            var loading = GlobalUtilities.loading(that.Interface.NodeTypes);

            CNAPI.GetNodeTypes({
                SearchText: Base64.encode(searchText), ParseResults: true,
                ResponseHandler: function (result) {
                    var nodeTypes = result.NodeTypes || [];

                    loading.Destroy();

                    for (var i = 0; i < nodeTypes.length; ++i)
                        that.add_node_type(that.Interface.NodeTypes, nodeTypes[i]);

                    that.__Searching = false;
                }
            });
        },

        hide_all: function (container) {
            var that = this;
            var firstChild = (container || {}).firstChild;
            while (firstChild) {
                if (firstChild.NodeTypeID) jQuery(firstChild).fadeOut(100);
                firstChild = firstChild.nextSibling;
            }
        },

        unhide_all: function (container) {
            var that = this;
            var firstChild = (container || {}).firstChild;
            while (firstChild) {
                if (firstChild.NodeTypeID) jQuery(firstChild).fadeIn(500);
                firstChild = firstChild.nextSibling;
            }
        },

        add_node_type: function (container, nodeType) {
            var that = this;

            //check if exists
            var firstChild = container.firstChild;
            while (firstChild) {
                if (firstChild.NodeTypeID == nodeType.NodeTypeID) return jQuery(firstChild).fadeIn(500);
                firstChild = firstChild.nextSibling;
            }
            //end of check if exists
            
            var cls = "small-12 medium-12 large-12 [class] rv-border-radius-half";

            var isSelected = (container != that.Interface.Searched) && that.Options.InitialNodeTypes[nodeType.NodeTypeID];

            cls = cls.replace("[class]", isSelected ? "rv-tab-selected" : "rv-tab");

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "btn", Class: "TextAlign " + cls,
                Style: "margin-bottom:0.3rem; padding:0.2rem 0.5rem; text-align:cetner;" +
                    "display:flex; flex-flow:row; align-items:center;",
                Childs: [
                    {
                        Type: "div", Style: "flex:1 1 auto;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(nodeType.TypeName || nodeType.NodeType) }]
                    },
                    (!nodeType.IsRecent ? null : {
                        Type: "div", Style: "flex:0 0 auto; opacity:0.5; padding-" + RV_Float + ":0.5rem;",
                        Childs: [{Type: "i", Class: "fa fa-clock-o fa-lg"}]
                    })
                ]
            }], container);

            elems["btn"].NodeTypeID = nodeType.NodeTypeID;
            if (isSelected) elems["btn"].IsSelected = true;

            elems["btn"].onclick = function (e) { that.item_click(e, nodeType, container, elems["btn"]); };
        },

        item_click: function (event, nodeType, container, btn, done) {
            var that = this;
            event = event || {};
            
            var ctrlKey = !!event.ctrlKey;

            /*
            var removeItem = btn.IsSelected && ctrlKey && (that.Objects.CurrentNodeTypeIDs.length > 1);

            if (that.processing() ||
                (btn.IsSelected && !removeItem && (ctrlKey || (that.Objects.CurrentNodeTypeIDs.length == 1)))) return;
            */

            var removeItem = btn.IsSelected;

            if (that.processing() || (btn.IsSelected && !removeItem)) return;

            if (!removeItem) {
                var recent = { NodeTypeID: nodeType.NodeTypeID, NodeType: nodeType.TypeName || nodeType.NodeType };
                GlobalUtilities.add_to_recent_items("nodetypes", recent, "NodeTypeID");
            }
            
            that.processing(true);

            var cls = "small-12 medium-12 large-12 [class] rv-border-radius-half TextAlign";

            var nodesContainer = null;

            if (ctrlKey) {
                btn.IsSelected = !removeItem;

                if (!removeItem)
                    that.Objects.CurrentNodeTypeIDs.push(nodeType.NodeTypeID);
                else {
                    var newArr = [];

                    for (var i = 0; i < that.Objects.CurrentNodeTypeIDs.length; ++i) {
                        if (that.Objects.CurrentNodeTypeIDs[i] != nodeType.NodeTypeID)
                            newArr.push(that.Objects.CurrentNodeTypeIDs[i]);
                    }

                    that.Objects.CurrentNodeTypeIDs = newArr;
                }

                btn.setAttribute("class", cls.replace("[class]", removeItem ? "rv-tab" : "rv-tab-selected"));

                that.show_multiple(function () {
                    that.processing(false);
                    if (done) done();
                });
            }
            else {
                that.Objects.CurrentNodeTypeIDs = removeItem ? [] : [nodeType.NodeTypeID];

                var firstChild = container.firstChild;

                while (firstChild) {
                    firstChild.IsSelected = !removeItem && (firstChild == btn);

                    firstChild.setAttribute("class",
                        cls.replace("[class]", !removeItem && (firstChild == btn) ? "rv-tab-selected" : "rv-tab"));

                    firstChild = firstChild.nextSibling;
                };

                if (removeItem) {
                    that.show_multiple(function () {
                        that.processing(false);
                        if (done) done();
                    });
                }
                else {
                    if (btn.NodesContainer)
                        nodesContainer = btn.NodesContainer;
                    else {
                        nodesContainer = btn.NodesContainer = GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "_div"
                        }])["_div"];

                        GlobalUtilities.loading(nodesContainer);
                    }

                    that.show(nodesContainer, function () {
                        that.processing(false);
                        if (done) done();
                    });
                }
            }
        },

        processing: function (value) {
            var that = this;
            if (GlobalUtilities.get_type(value) == "boolean") that._IsProcessing = value;
            return !!that._IsProcessing;
        },

        show_multiple: function (done) {
            var that = this;

            var nodesContainer = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Name: "_div"
            }])["_div"];

            GlobalUtilities.loading(nodesContainer);

            that.show(nodesContainer, done);
        },

        show: function (container, done) {
            var that = this;

            var relatedItem = that.Options.InitialRelatedItem;
            that.Options.InitialRelatedItem = null;

            container.NodesViewer = container.NodesViewer || new NodesViewer(container, {
                NodeTypeIDs: that.Objects.CurrentNodeTypeIDs,
                Options: { InitialRelatedItem: relatedItem }
            });

            jQuery(that.Interface.NodesContainer).fadeOut(500, function () {
                that.Interface.NodesContainer.innerHTML = "";
                that.Interface.NodesContainer.appendChild(container);

                jQuery(that.Interface.NodesContainer).fadeIn(500, function () { if (done) done(); });
            });
        },

        more: function () {
            var that = this;

            if ((((that.Interface.NodesContainer || {}).firstChild || {}).NodesViewer || {}).more)
                that.Interface.NodesContainer.firstChild.NodesViewer.more();
        }
    };
})();