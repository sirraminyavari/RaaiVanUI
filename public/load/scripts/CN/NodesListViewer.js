(function () {
    if (window.NodesListViewer) return;

    window.NodesListViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null,
            SearchFiltersContainer: null,
            TotalCount: null
        };

        this.Objects = {
            ListViewer: null,
            SelectedNodeType: null,
            DateFrom: null,
            DateTo: null,
            SearchInput: null
        };

        this.Options = {
            Title: params.Title,
            NodeTypes: params.NodeTypes,
            Constraints: params.Constraints,
            APIFunc: params.APIFunc,
            HelpEntryName: params.HelpEntryName,
            Count: params.Count || 10
        };

        var that = this;

        GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js", "API/CNAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    NodesListViewer.prototype = {
        _preinit: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var nodeTypeTitlePart = (that.Options.NodeTypes || []).length == 1 ?
                " - " + Base64.decode(that.Options.NodeTypes[0].NodeType) : "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "position:relative; margin:0;",
                    Childs: [
                        { Type: "div", Style: "position:absolute; top:0;" + RV_RevFloat + ":0;", Name: "totalCount" },
                        (!that.Options.Title ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;" +
                                "font-weight:bold; text-align:center; margin-bottom:1rem; font-size:1rem;",
                            Childs: [
                                { Type: "text", TextValue: that.Options.Title + nodeTypeTitlePart },
                                (!that.Options.HelpEntryName ? null : {
                                    Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: that.Options.HelpEntryName }
                                })
                            ]
                        }),
                        {
                            Type: "div", Name: "searchFilters",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder",
                            Style: "display:none; padding:0.5rem; border-color:rgb(200,200,200); background-color:white;" +
                                "margin-bottom:1rem; position:relative; min-height:2.9rem;" +
                                "padding-" + RV_RevFloat + ":11rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0.5rem; width:10rem;",
                                    Childs: [{
                                        Type: "middle",
                                        Childs: [{ Type: "input", Class: "rv-input", Name: "searchText", Style: "width:100%; font-size:0.6rem;" }]
                                    }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.7rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.CreationDate + " " + RVDic.From + ":" }]
                                        },
                                        { Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1rem;", Name: "from" },
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                                        },
                                        { Type: "div", Style: "display:inline-block;", Name: "to" }
                                    ]
                                }
                            ]
                        },
                        ((that.Options.NodeTypes || []).length <= 1 ? null : {
                            Type: "div", Class: "small-5 medium-4 large-3", Name: "nodeTypes",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                        }),
                        {
                            Type: "div", Name: "itemsArea",
                            Class: (that.Options.NodeTypes || []).length <= 1 ? "small-12 medium-12 large-12" : "small-7 medium-8 large-9"
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];
            that.Interface.SearchFiltersContainer = elems["searchFilters"];
            that.Objects.SearchInput = elems["searchText"];
            that.Interface.TotalCount = elems["totalCount"];

            that.set_search_input_placeholder();
            that.set_search_filters_visibility();

            GlobalUtilities.set_onchangeorenter(that.Objects.SearchInput, function () {
                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
            });

            if (elems["from"]) GlobalUtilities.append_calendar(elems["from"], {
                ClearButton: true,
                OnLoad: function () { elems["from"].innerHTML = ""; },
                OnSelect: function () { if (that.Objects.ListViewer) that.Objects.ListViewer.reset(); }
            }, function (cal) { that.Objects.DateFrom = cal; });

            if (elems["to"]) GlobalUtilities.append_calendar(elems["to"], {
                ClearButton: true,
                OnLoad: function () { elems["to"].innerHTML = ""; },
                OnSelect: function () { if (that.Objects.ListViewer) that.Objects.ListViewer.reset(); }
            }, function (cal) { that.Objects.DateTo = cal; });

            var set_selected_filter = function (obj) {
                if (obj.Selected) obj = null;

                var firstChild = elems["nodeTypes"].firstChild;
                while (firstChild) {
                    if (firstChild.Select) {
                        if (firstChild == obj) firstChild.Select();
                        else firstChild.Unselect();
                    }

                    firstChild = firstChild.nextSibling;
                }

                that.Objects.SelectedNodeType = (obj || {}).TheNodeType ? (obj || {}).TheNodeType : null;

                that.set_search_input_placeholder();
                that.set_search_filters_visibility();

                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
            };
            
            if ((that.Options.NodeTypes || []).length == 1) that.Objects.SelectedNodeType = that.Options.NodeTypes[0];

            (that.Options.NodeTypes || []).forEach(function (nodeType) {
                if (!elems["nodeTypes"]) return;

                var filterElems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "container",
                        Class: "small-12 medium-12 large-12 rv-air-button rv-border-radius-quarter TextAlign",
                        Style: "position:relative; padding-" + RV_RevFloat + ":2.4rem; margin-bottom:0.5rem;",
                        Properties: [{ Name: "onclick", Value: function () { set_selected_filter(filterElems["container"]); } }],
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0.3rem; color:red;",
                                Childs: [{
                                    Type: "middle", Class: "rv-border-radius-quarter",
                                    Style: "padding:0.1rem 0.3rem; background-color:white; font-size:0.7rem;" +
                                        "width:1.8rem; text-align:center;",
                                    Childs: [{ Type: "text", TextValue: nodeType.Count }]
                                }]
                            },
                            { Type: "text", TextValue: Base64.decode(nodeType.NodeType) }
                        ]
                    }
                ], elems["nodeTypes"]);

                filterElems["container"].TheNodeType = nodeType;

                filterElems["container"].Select = function () {
                    this.classList.remove("rv-air-button");
                    this.classList.add("rv-tab-selected");
                    this.Selected = true;
                };

                filterElems["container"].Unselect = function () {
                    this.classList.remove("rv-tab-selected");
                    this.classList.add("rv-air-button");
                    this.Selected = false;
                };
            });

            that.reset();
        },

        set_search_input_placeholder: function () {
            var that = this;
            if (!that.Objects.SearchInput) return;
            var hasNodeTypeId = !!(that.Objects.SelectedNodeType || {}).NodeTypeID;
            var text = RVDic.SearchText + (!hasNodeTypeId ? "" : " " + RVDic.Or + " " + RVDic.AdditionalID);
            GlobalUtilities.set_inner_title(that.Objects.SearchInput, text);
        },

        set_search_filters_visibility: function () {
            var that = this;

            var totalCount = that.Objects.SelectedNodeType ? that.Objects.SelectedNodeType.Count :
                [0].concat((that.Options.NodeTypes || []).map(function (u) { return u.Count; }))
                    .reduce(function (total, num) { return total + num; });
            
            var isVisible = totalCount > that.Options.Count;

            if (!isVisible) that.Objects.SearchInput.value = "";

            if (that.Interface.SearchFiltersContainer)
                jQuery(that.Interface.SearchFiltersContainer)[isVisible ? "fadeIn" : "fadeOut"](0);

            return isVisible;
        },

        set_total_count: function (count) {
            var that = this;

            that.Interface.TotalCount.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-weight:bold; color:rgb(100,100,100)",
                    Childs: [{ Type: "text", TextValue: RVDic.Count + ":" }]
                },
                {
                    Type: "div", Style: "display:inline-block; color:red; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: count || "0" }]
                }
            ], that.Interface.TotalCount);
        },

        reset: function () {
            var that = this;

            that.Interface.ItemsArea.innerHTML = "";
            
            that.Objects.ListViewer = new NewSimpleListViewer(that.Interface.ItemsArea, {
                Options: {
                    Count: that.Options.Count,
                    AutoGrow: false,
                    OnDataRequest: function (options, done, setTotalCount) {
                        var nodeType = that.Objects.SelectedNodeType || {};
                        var hasSearchFilters = that.set_search_filters_visibility();

                        CNAPI[that.Options.APIFunc](GlobalUtilities.extend(options || {}, that.Options.Constraints || {}, {
                            NodeTypeID: nodeType.NodeTypeID,
                            SearchText: !hasSearchFilters ? null : Base64.encode(GlobalUtilities.trim(that.Objects.SearchInput.value)),
                            LowerDateLimit: !hasSearchFilters || !(that.Objects.DateFrom || {}).Get ? null : that.Objects.DateFrom.Get().Value,
                            UpperDateLimit: !hasSearchFilters || !(that.Objects.DateTo || {}).Get ? null : that.Objects.DateTo.Get().Value,
                            ParseResults: true,
                            ResponseHandler: function (result) {
                                that.set_total_count(result.TotalCount);
                                setTotalCount(result.TotalCount);
                                done(result.Nodes || []);
                            }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        container.classList.add("rv-trim-vertical-margins");
                        that.build_item(container, item);
                        params.OnAfterAdd();
                    },
                    OnNothingFound: function (itemsArea) {
                        itemsArea.innerHTML = "<div class='small-12 medium-12 large-12' style='text-align:center; color:rgb(100,100,100);" +
                            "font-weight:bold; font-size:1rem; padding:1rem;'>" + RVDic.NothingToDisplay + "</div>";
                    }
                }
            });
        },

        _initialize_options: function (container) {
        },

        _reset_options: function () {
        },

        build_item: function (container, item) {
            var that = this;
            item = item || {};

            var name = Base64.decode(item.Name);
            var status = item.Status ? RVDic.CN[item.Status] : (item.WFState ? Base64.decode(item.WFState) : "");
            
            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemContainer",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow",
                    Style: "padding:0.4rem; margin-top:0.5rem; position:relative; cursor:pointer;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Link: RVAPI.NodePageURL({ NodeID: item.NodeID }),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; direction:" + (GlobalUtilities.textdirection(name) || '') + ";",
                                    Childs: [{
                                        Type: "a", Class: "rv-link",
                                        Attributes: [{ Name: "href", Value: RVAPI.NodePageURL({ NodeID: item.NodeID }) }],
                                        Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); } }],
                                        Childs: [{ Type: "text", TextValue: name }]
                                    }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.6rem; color:rgb(120,120,120);",
                            Childs: [
                                (item.NodeTypeID == (that.Objects.SelectedNodeType || {}).NodeTypeID ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.5rem;" +
                                        "margin-top:0.5rem; background-color:white;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.NodeType) }]
                                }),
                                (!item.CreationDate ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.5rem;" +
                                        "margin-top:0.5rem; background-color:white;",
                                    Childs: [{ Type: "text", TextValue: item.CreationDate }]
                                }),
                                (!status ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.5rem;" +
                                        "margin-top:0.5rem; background-color:white;",
                                    Childs: [{ Type: "text", TextValue: status }]
                                }),
                                (!item.AdditionalID ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.5rem;" +
                                        "margin-top:0.5rem; background-color:white;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; color:rgb(80,80,80); margin-" + RV_RevFloat + ":0.3rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Code + ":" }]
                                        },
                                        { Type: "text", TextValue: Base64.decode(item.AdditionalID) }
                                    ]
                                }),
                                (!item.HasChild ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow rv-air-button rv-circle",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0 0.5rem;" +
                                        "margin-top:0.5rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.show_tree(item); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.TreeView }]
                                })
                            ]
                        }
                    ]
                }
            ], container);
        },

        show_tree: function (item) {
            var that = this;
            if (!item) return;

            that.__TreeObjects = that.__TreeObjects || {};

            if (that.__TreeObjects[item.NodeID]) {
                that.__TreeObjects[item.NodeID].ShowedDiv = GlobalUtilities.show(that.__TreeObjects[item.NodeID].Container);
                return;
            }

            var obj = that.__TreeObjects[item.NodeID] = { ShowedDiv: null, Container: null };

            var _div = obj.Container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "BorderRadius4 SoftBackgroundColor NormalPadding", Name: "_div",
                    Style: "width:500px; margin:0px auto 0px auto;"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            obj.ShowedDiv = GlobalUtilities.show(_div);

            GlobalUtilities.load_files([
                "jQuery/jsTree/jquery.jstree.js",
                "TreeViewContainer/TreeViewContainer.js",
                "TreeNodeViewer/TreeNodeViewer.js"
            ], {
                LoadSequential: true,
                OnLoad: function () {
                    var tnv = new TreeNodeViewer(_div, {
                        NodeTypeID: item.NodeTypeID, NodeID: item.NodeID, Width: 480, Checkbox: false,
                        OnNodeSelect: function (p) {
                            var _nodePageUrl = CNAPI.NodePageURL({ NodeID: p.ID });
                            GlobalUtilities.link_click(p.Event || {}, _nodePageUrl);
                        }
                    });
                }
            });
        }
    }
})();