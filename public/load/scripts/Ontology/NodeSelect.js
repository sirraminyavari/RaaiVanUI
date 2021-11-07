(function () {
    if (window.NodeSelect) return;

    window.NodeSelect = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        params = params || {};

        this.Interface = {
            SelectedArea: null,
            NodeTypesArea: null,
            NodesArea: null,
            NoNodeType: null,
            NothingFoundArea: null,
            FiltersArea: null,
            FormFiltersArea: null,
            FormFiltersButton: null,
            MatchAllFiltersArea: null,
            TotalCount: null
        };

        this.Objects = {
            AllNodeTypes: null,
            NodeTypeInput: null,
            NodeInput: null,
            NodeInputInnerTitle: RVDic.SearchText +
                " (" + RVDic.Title + " - " + RVDic.AdditionalID + " - " + RVDic.Keywords + ")",
            CurrentNodeType: null,
            SelectedItems: {},
            MatchAllFilters: false,
            NodeTypes: {},
            NodeTypeContainers: {},
            CurrentNodeTypeContainer: null,
            SelectedFilter: null,
            NodesList: null,
            GetNodesFunction: null,
            OwnerForms: {}
        };

        var options = params.Options || {};

        this.Options = {
            Limits: options.Limits || {},
            Filters: options.Filters === true,
            FilterNames: options.FilterNames,
            IgnoreAllFilter: options.IgnoreAllFilter === true,
            DocumentsOnly: options.DocumentsOnly === true,
            NodeTypeSearchBox: !(options.Limits || {}).NodeTypes && (options.NodeTypeSearchBox === true),
            NodeTypesSelectable: options.NodeTypesSelectable === true,
            NodeTypesMultiSelect: (options.NodeTypesSelectable === true) && (options.NodeTypesMultiSelect !== false),
            HideSelectedItems: options.HideSelectedItems === true,
            TreeCheckbox: options.TreeCheckbox !== false,
            Title: options.Title,
            ShowBottomBar: options.ShowBottomBar,
            OnSelect: options.OnSelect,
            OnConfirm: options.OnConfirm,
            OnCancel: options.OnCancel,
            OnInit: options.OnInit,
            DataRequestOptions: options.DataRequestOptions
        };

        var fln = [];
        if (!this.Options.IgnoreAllFilter) fln.push("All");
        (this.Options.FilterNames || []).forEach(function (x) {
            if (!fln.some(function (s) { return s == x; })) fln.push(x);
        });
        this.Objects.FilterNames = fln;
        
        if ((this.Options.Limits.NodeTypes || []).length || (this.Options.Limits.Nodes || []).length)
            this.Options.Filters = false;
        
        var that = this;
        
        that.ContainerDiv.innerHTML = "";

        var hideNodeTypes = that.Options.Limits.NodeTypes && that.Options.Limits.NodeTypes.length == 0;

        var show_hide_node_types_area = function (hide) {
            var attrPadding = RV_RTL ? "paddingRight" : "paddingLeft";

            if (hide) {
                jQuery(elems["ntFilters"]).fadeOut(500, function () {
                    jQuery(elems["container"]).animate({ [attrPadding]: "0rem" }, 500);
                });
            }
            else {
                jQuery(elems["container"]).animate({ [attrPadding]: "12rem" }, 500, function () {
                    jQuery(elems["ntFilters"]).fadeIn(500);
                });
            }
        };

        var show_hide_selected_items = function (hide) {
            elems["selectedContainer"].style.display = hide ? "none" : "block";
            elems["nodesContainer"].setAttribute("class", "small-x medium-x large-x".replace(/x/ig, hide ? "12" : "7"));
        };

        var elems = GlobalUtilities.create_nested_elements([
            (!that.Options.Title ? null : {
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;" +
                    "position:relative; font-weight:bold; margin-bottom:1rem; font-size:1rem; color:rgb(100,100,100); text-align:center;",
                Childs: [
                    { Type: "text", TextValue: that.Options.Title },
                    { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "nodeselectdialog" } },
                    { Type: "div", Style: "position:absolute; top:0;" + RV_RevFloat + ":0;", Name: "totalCount" }
                ]
            }),
            {
                Type: "div", Class: "small-12 medium-12 large-12 row rv-border-radius-half", Name: "filters",
                Style: "position:relative; padding:0.4rem;" + (that.Options.Filters ? "" : "display:none;") +
                    "margin:0; margin-bottom:1rem; background-color:white;" +
                    (that.Options.Filters ? "padding-" + RV_Float + ":4rem;" : ""),
                Childs: [
                    (!that.Options.Filters ? null : {
                        Type: "div", Style: "position:absolute; top:0; bottom:0;" + RV_Float + ":0.5rem; font-size:0.7rem; font-weight:bold;",
                        Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RVDic.Filters + ":" }]}]
                    }),
                    (!that.Options.Filters ? null : { Type: "div", Class: "small-12 medium-7 large-8", Name: "generalFilters" }),
                    {
                        Type: "div", Name: "formFilters", Style: "display:none; padding-top:0.2rem; margin:0rem;",
                        Class: (that.Options.Filters ? "small-12 medium-5 large-4" : "small-12 medium-12 large-12") + " row",
                        Childs: [
                            {
                                Type: "div", Name: "formFiltersButton", Style: "margin:0 auto; font-size:0.7rem;",
                                Class: (that.Options.Filters ? "small-10 medium-10 large-10" : "small-6 medium-6 large-6") +
                                    " rv-air-button-base rv-air-button-black rv-circle",
                                Properties: [{ Name: "onclick", Value: function () { that.show_form_filters(); } }]
                            },
                            (that.Options.Filters ? null : { Type: "div", Class: "small-1 medium-1 large-1" }),
                            {
                                Type: "div", Name: "matchAllFiltersArea", 
                                Class: that.Options.Filters ? "small-12 medium-12 large-12" : "small-5 medium-5 large-5",
                                Style: "display:none;" + (!that.Options.Filters ? "" : "text-align:center; margin-top:0.5rem;"),
                                Childs: [
                                    {
                                        Type: "checkbox", Name: "matchAllFilters",
                                        Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.4rem;",
                                        Params: { OnChange: function () { that.suggest_nodes(); } }
                                    },
                                    { Type: "text", TextValue: RVDic.FG.MatchAllFilters }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container",
                Style: "position:relative; margin:0rem; min-height:10rem;",
                Childs: [
                    {
                        Type: "div", Name: "ntFilters",
                        Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0rem; width:11.5rem; display:none;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: (that.Options.NodeTypeSearchBox ? "" : "display:none;") + "margin-bottom:0.5rem;",
                                Childs: [
                                    {
                                        Type: "input", Class: "rv-input", Style: "width:100%; font-size:0.7rem;",
                                        InnerTitle: RVDic.Search, Name: "nodeTypeInput"
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "noNodeType",
                                Style: "text-align:center; color:rgb(100,100,100); display:none;",
                                Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "nodeTypesContainer",
                                Style: "height:" + (that.Options.NodeTypeSearchBox ? "calc(100% - 2.5rem)" : "100%") + ";"
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-7 medium-7 large-7", Name: "nodesContainer",
                        Style: "padding-" + RV_RevFloat + ":0.5rem;",
                        Childs: [
                            {
                                Type: "div", Class: "small-10 medium-10 large-10", Style: "margin:0 auto 0.5rem auto;",
                                Childs: [
                                    {
                                        Type: "input", Class: "rv-input", Style: "width:100%; font-size:0.7rem;",
                                        InnerTitle: that.Objects.NodeInputInnerTitle, Name: "nodeInput"
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "font-size:0.7rem;", Name: "nodesArea"
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "nothingFoundArea",
                                Style: "font-size:1rem; font-weight:bold; text-align:center; margin-top:1rem; display:none;",
                                Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-5 medium-5 large-5", Name: "selectedContainer", Style: "display:none;",
                        Childs: [
                            {
                                Type: "header", Class: "small-12 medium-12 large-12",
                                Params: { Title: RVDic.SelectedNodes, FontSize: "0.7rem" }
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                                Style: (that.Options.HideSelectedItems ? "display:none;" : ""), Name: "selectedArea"
                            }
                        ]
                    }
                ]
            },
            (!that.Options.ShowBottomBar ? null : {
                Type: "div", Class: "rv-border-radius-quarter", Name: "buttonsArea",
                Style: "position:fixed; bottom:0rem; left:6vw; right:6vw; padding:1rem 10rem; text-align:center;" +
                    "background-color:rgb(245,245,245); box-shadow:0px 0px 10px; height:4rem;",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0;", Style: "font-weight:bold;",
                        Childs: [
                            { Type: "div", Class: "small-1 medium-1 large-1" },
                            {
                                Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle",
                                Properties: [{ Name: "onclick", Value: function () { if (that.Options.OnConfirm) that.Options.OnConfirm(); }}],
                                Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                            },
                            { Type: "div", Class: "small-2 medium-2 large-2" },
                            {
                                Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle",
                                Properties: [{ Name: "onclick", Value: function () { if (that.Options.OnCancel) that.Options.OnCancel(); } }],
                                Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                            },
                            { Type: "div", Class: "small-1 medium-1 large-1" }
                        ]
                    }
                ]
            })
        ], that.ContainerDiv);

        that.Interface.TotalCount = elems["totalCount"];

        show_hide_node_types_area(hideNodeTypes);
        show_hide_selected_items(that.Options.HideSelectedItems);

        this.Interface.SelectedArea = elems["selectedArea"];
        this.Interface.NodeTypesArea = elems["nodeTypesContainer"];
        this.Interface.NodesArea = elems["nodesArea"];
        this.Interface.NoNodeType = elems["noNodeType"];
        this.Interface.NothingFoundArea = elems["nothingFoundArea"];
        this.Interface.FiltersArea = elems["filters"];
        this.Interface.FormFiltersArea = elems["formFilters"];
        this.Interface.FormFiltersButton = elems["formFiltersButton"];
        this.Interface.MatchAllFiltersArea = elems["matchAllFiltersArea"];
        this.Objects.NodeTypeInput = elems["nodeTypeInput"];
        this.Objects.NodeInput = elems["nodeInput"];
        this.Objects.MatchAllFilters = elems["matchAllFilters"];

        //append scrollbar
        this.Interface.NodeTypesArea = GlobalUtilities.append_scrollbar(that.Interface.NodeTypesArea, { AutoHeight: false });
        //end of append scrollbar
        
        //Filters
        var filtersArr = [];

        that.Options.Filters = !that.Options.Filters ? null :
            ["All", "MyIntellectualProperties", "MyExpertiseDomains", "MyGroups", "MyFavorites"];

        if (that.Options.Filters && (that.Options.FilterNames || []).length) {
            that.Options.Filters = that.Options.FilterNames.filter(function (val) {
                val = val.toLowerCase();
                return that.Options.Filters.some(function (x) { return x.toLowerCase() == val; });
            });
        }
        
        var select_unselect_filter = function (name, obj, select) {
            obj.__Selected = !!select;
            obj.style.fontWeight = select ? "bold" : "normal";
            obj.setAttribute("class", (select ? "rv-tab-selected" : "rv-bg-color-softer-soft") + " rv-border-radius-quarter");
            that.Objects.SelectedFilter = name;
        };

        var add_filter = function (p) {
            p = p || {};

            filtersArr.push({
                Type: "div", Class: "rv-bg-color-softer-soft rv-border-radius-quarter", Name: p.Name,
                Style: "display:inline-block; margin:0.1rem 0.25rem; cursor:pointer;" +
                    "font-weight:normal; font-size:0.7rem; padding:0.3rem 0.5rem;",
                Properties: [
                    {
                        Name: "onclick",
                        Value: function () {
                            var cur = filterElems[p.Name];

                            for (i = 0, lnt = that.Options.Filters.length; i < lnt; ++i) {
                                var another = filterElems[that.Options.Filters[i]];
                                if (another != cur || !cur.__Selected) {
                                    select_unselect_filter(p.Name == "All" ? null : p.Name, another, another == cur);
                                    if (another == cur) {
                                        that.Objects.SelectedFilter = p.Name == "All" ? null : p.Name;

                                        that.suggest_node_types(function () {
                                            that.suggest_nodes();
                                        });
                                    }
                                }
                            }

                            that.set_form_filters_visibility();
                        }
                    }
                ],
                Childs: [{ Type: "text", TextValue: RVDic[p.Name] }]
            });
        };

        if ((that.Options.Filters || []).length) {
            for (var i = 0, lnt = that.Options.Filters.length; i < lnt; ++i)
                add_filter({ Name: that.Options.Filters[i] });

            var filterElems = GlobalUtilities.create_nested_elements(filtersArr, elems["generalFilters"]);

            select_unselect_filter(that.Options.Filters[0], filterElems[that.Options.Filters[0]], true);
        }
        //end of Filters
        
        GlobalUtilities.load_files(["API/CNAPI.js", "SimpleListViewer/NewSimpleListViewer.js"], {
            OnLoad: function () { that._preinit(); }
        });
    }

    NodeSelect.prototype = {
        _preinit: function () {
            var that = this;
            
            if (((that.Options.Limits || {}).NodeTypes || []).length || ((that.Options.Limits || {}).Nodes || []).length) {
                that.Objects.AllNodeTypes = (that.Options.Limits || {}).NodeTypes || [];
                that._initialize();
            }
            else {
                if (that.Options.IgnoreAllFilter)
                    that._initialize();
                else {
                    CNAPI.GetNodeTypes({
                        IsDocument: that.Options.DocumentsOnly ? true : null, ParseResults: true,
                        ResponseHandler: function (result) {
                            that.Objects.AllNodeTypes = result.NodeTypes || [];
                            that._initialize();
                        }
                    });
                }
            }
        },

        _initialize: function () {
            var that = this;

            that._check_if_no_item_selected(true);
            
            GlobalUtilities.set_onchangeorenter(that.Objects.NodeTypeInput, function () {
                var container = that.get_node_types_container(false);
                
                jQuery(that.Interface.NodeTypesArea).fadeOut(500, function () {
                    that.show_node_types(container);
                    jQuery(that.Interface.NodeTypesArea).fadeIn(500);
                });
            });

            GlobalUtilities.set_onchangeorenter(that.Objects.NodeInput, function () { that.suggest_nodes(); });

            that.suggest_node_types(function () {
                that.Objects.NodesList = new NewSimpleListViewer(that.Interface.NodesArea, {
                    AutoGrow: false,
                    Options: {
                        InnerWidthOffset: 0, Width: null,
                        OnDataRequest: function (options, done, setTotalCount) {
                            options = options || {};

                            jQuery(that.Interface.NothingFoundArea).fadeOut(0);

                            that.nodes_data_request(options, function (result) {
                                that.set_total_count(result.TotalCount);
                                setTotalCount(result.TotalCount);
                                done(result.Nodes || []);
                            });

                            that.Objects.GetNodesFunction(options);
                        },
                        OnNothingFound: function () {
                            jQuery(that.Interface.NothingFoundArea).fadeIn(500);
                        },
                        ItemBuilder: function (container, item, params) {
                            item = item || {};
                            item.Name = Base64.decode(item.Name);
                            item.NodeType = item.NodeType ? Base64.decode(item.NodeType) :
                                (that.Objects.NodeTypes[item.NodeTypeID] || {}).TypeName;
                            item.AdditionalID = Base64.decode(item.AdditionalID);

                            var options = [];
                            if (item.HasChild === true) {
                                options.push({
                                    Type: "img", Tooltip: RVDic.TreeView,
                                    Style: "cursor:pointer; width:0.9rem; height:0.9rem;" +
                                        "margin-" + window.RV_Float + ":0.6rem;",
                                    Attributes: [{ Name: "src", Value: GlobalUtilities.icon("TreeView.png") }],
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function (e) {
                                                e.stopPropagation();

                                                that.show_tree({
                                                    NodeTypeID: item.NodeTypeID,
                                                    NodeID: item.NodeID,
                                                    NodeType: item.NodeType
                                                });
                                            }
                                        }
                                    ]
                                });
                            }

                            var hasSelectedNodeType = !!that.Objects.CurrentNodeType &&
                                (item.NodeTypeID == that.Objects.CurrentNodeType.NodeTypeID);

                            GlobalUtilities.create_nested_elements([{
                                Type: "div",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer " +
                                    "SoftShadow SoftBorder",
                                Style: "margin:0.2rem 0; padding:0.3rem; border-color:rgb(230,230,230); cursor:pointer;" +
                                    "position:relative;" + (!options.length ? "" : "padding-" + RV_RevFloat + ":2rem;"),
                                Properties: [{
                                    Name: "onclick",
                                    Value: function () {
                                        that.add_item(item, null, true);
                                        if (that.Options.OnSelect) that.Options.OnSelect(item);
                                    }
                                }],
                                Childs: [
                                    (!options.length ? null : {
                                        Type: "div", Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;",
                                        Childs: options
                                    }),
                                    {
                                        Type: "div", Style: "display:inline-block;",
                                        Childs: [{ Type: "text", TextValue: item.Name }]
                                    },
                                    (!item.AdditionalID ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; margin-" + RV_Float + ":0.4rem; font-size:0.6rem;",
                                        Childs: [{ Type: "text", TextValue: item.AdditionalID }]
                                    }),
                                    (hasSelectedNodeType || !item.NodeType ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; margin-" + RV_Float + ":0.4rem; font-size:0.6rem;",
                                        Childs: [{ Type: "text", TextValue: item.NodeType }]
                                    }),
                                    (!item.CreationDate ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; margin-" + RV_Float + ":0.4rem; font-size:0.6rem;",
                                        Childs: [{ Type: "text", TextValue: item.CreationDate }]
                                    })
                                ]
                            }], container);

                            params.OnAfterAdd();
                        }
                    }
                });

                if (that.Options.OnInit) that.Options.OnInit();
            });
            that.suggest_nodes();
        },

        set_total_count: function (count) {
            var that = this;

            if (!that.Interface.TotalCount) return;

            that.Interface.TotalCount.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-text-shadow",
                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-weight:bold;" +
                        "color:rgb(100,100,100); font-size:0.8rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.Count + ":" }]
                },
                {
                    Type: "div", Class: "rv-text-shadow", Style: "display:inline-block; color:red; font-weight:bold; font-size:0.8rem;",
                    Childs: [{ Type: "text", TextValue: count || "0" }]
                }
            ], that.Interface.TotalCount);
        },

        set_form_filters_visibility: function (nodeTypeId) {
            var that = this;
            
            nodeTypeId = nodeTypeId || that.get_current_node_type_id();

            var _do = function () {
                var show = nodeTypeId && (nodeTypeId == that.get_current_node_type_id()) &&
                    (!that.Objects.SelectedFilter || (that.Objects.SelectedFilter == "All")) &&
                    (that.Objects.OwnerForms[nodeTypeId] || {}).FormID;

                that.set_filters_text(nodeTypeId);

                jQuery(that.Interface.FiltersArea)[show || that.Options.Filters ? "fadeIn" : "fadeOut"](0, function () {
                    jQuery(that.Interface.FormFiltersArea)[show ? "fadeIn" : "fadeOut"](500);
                });
            };

            if (!((window.RVGlobal || {}).Modules || {}).FG || !nodeTypeId || that.Objects.OwnerForms[nodeTypeId]) return _do();
            
            GlobalUtilities.load_files(["API/FGAPI.js"], {
                OnLoad: function () {
                    FGAPI.GetOwnerForm({
                        OwnerID: nodeTypeId, ParseResults: true,
                        ResponseHandler: function (result) {
                            that.Objects.OwnerForms[nodeTypeId] = {
                                FormID: (result || {}).FormID,
                                Title: Base64.decode((result || {}).Title)
                            };

                            _do();
                        }
                    });
                }
            });
        },

        filters_count: function (nodeTypeId) {
            var that = this;
            var cnt = 0;
            for (var id in ((that.Objects.OwnerForms[nodeTypeId] || {}).Filters || {}))++cnt;
            return cnt;
        },

        set_filters_text: function (nodeTypeId) {
            var that = this;
            var cnt = that.filters_count(nodeTypeId);
            
            var str = cnt ? RVDic.Form + ": " + RVDic.NFiltersSelected.replace("[n]", cnt) : RVDic.SetFormFilters;
            that.Interface.FormFiltersButton.innerHTML = GlobalUtilities.convert_numbers_to_persian(str);
            that.Interface.MatchAllFiltersArea.style.display = cnt > 1 ? "block" : "none";
        },

        show_form_filters: function () {
            var that = this;

            var nodeTypeId = that.get_current_node_type_id();
            if (!nodeTypeId || !that.Objects.OwnerForms[nodeTypeId].FormID) return;

            that.FormFilterContainers = that.FormFilterContainers || {};
            that.FormFilterContainers[nodeTypeId] = that.FormFilterContainers[nodeTypeId] || {};

            if (that.FormFilterContainers[nodeTypeId].Container)
                return (that.FormFilterContainers[nodeTypeId].Showed = GlobalUtilities.show(that.FormFilterContainers[nodeTypeId].Container));

            var _div = that.FormFilterContainers[nodeTypeId].Container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            that.FormFilterContainers[nodeTypeId].Showed = GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["FormsManager/FormSearchFilters.js"], {
                OnLoad: function () {
                    var fsf = new FormSearchFilters(_div, {
                        Delimiter: "~", FormID: that.Objects.OwnerForms[nodeTypeId].FormID,
                        OnConfirm: function () {
                            that.FormFilterContainers[nodeTypeId].Showed.Close();
                            that.Objects.OwnerForms[nodeTypeId].Filters = fsf.get({ JSON: true });
                            that.set_filters_text(nodeTypeId);
                            that.suggest_nodes();
                        }
                    });
                }
            });
        },

        get_current_node_type_id: function () {
            return (this.Objects.CurrentNodeType || {}).NodeTypeID;
        },

        nodetype_filter_api: function () {
            var that = this;

            if (!that.Options.Filters) return null;

            switch (that.Objects.SelectedFilter) {
                case "MyFavorites": return "GetFavoriteNodesCount";
                case "MyGroups": return "GetMembershipDomainsCount";
                case "MyExpertiseDomains": return "GetExpertiseDomainsCount";
                case "MyIntellectualProperties": return "GetIntellectualPropertiesCount";
            }

            return null;
        },

        node_filter_api: function () {
            var that = this;

            if (!that.Options.Filters) return null;

            switch (that.Objects.SelectedFilter) {
                case "MyFavorites": return "GetFavoriteNodes";
                case "MyGroups": return "GetMembershipDomains";
                case "MyExpertiseDomains": return "GetExpertiseDomains";
                case "MyIntellectualProperties": return "GetIntellectualProperties";
            }

            return null;
        },

        _check_if_no_item_selected: function (setMessage) {
            for (var itm in (this.Objects.SelectedItems || {}))
                if (this.Objects.SelectedItems[itm]) return;
            this.Interface.SelectedArea.innerHTML = !setMessage ? "" :
                "<div style='text-align:center; font-size:0.7rem; font-weight:bold; color:red;'>" + RVDic.ThereIsNoItemSelected + "</div>";
        },

        add_item: function (node, auto, add2top) {
            var that = this;

            if (!node || that.Objects.SelectedItems[node.NodeID]) return;
            else if (!auto) {
                var selectedCount = 0;

                for (var _id in that.Objects.SelectedItems)
                    if (that.Objects.SelectedItems[_id])++selectedCount;

                if ((that.Options.Limits.Count > 0) && (selectedCount >= that.Options.Limits.Count)) {
                    alert(RVDic.MSG.CannotSelectMoreThanNItems.replace("[n]", that.Options.Limits.Count));
                    return false;
                }
            }

            that._check_if_no_item_selected(false);
            that.Objects.SelectedItems[node.NodeID] = node;

            var nodeType = !node.NodeType ? that.Objects.NodeTypes[node.NodeTypeID].TypeName : node.NodeType;

            var trimed = node.Name.substr(0, 50);
            var tooltip = trimed == node.Name ? null : node.Name;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "container",
                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftBorder SoftShadow",
                Style: "position:relative; padding:0.3rem; margin:0.3rem 0; font-size:0.7rem;" +
                    "padding-" + RV_Float + ":1.5rem; display:none;",
                Childs: [
                    {
                        Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                        Childs: [{
                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton", Tooltip: RVDic.Remove,
                            Properties: [{
                                Name: "onclick",
                                Value: function () {
                                    jQuery(elems["container"]).fadeOut(500, function () { this.remove(); });
                                    that.Objects.SelectedItems[node.NodeID] = null;
                                    that._check_if_no_item_selected(true);
                                }
                            }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block;", Tooltip: tooltip,
                                Childs: [{ Type: "text", TextValue: trimed + (tooltip ? "..." : "") }]
                            },
                            {
                                Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                Style: "display:inline-block; margin-" + RV_Float + ":0.4rem; font-size:0.6rem; cursor:default;",
                                Childs: [{ Type: "text", TextValue: nodeType }]
                            }
                        ]
                    }
                ]
            }]);

            if (add2top) that.Interface.SelectedArea.insertBefore(elems["container"], that.Interface.SelectedArea.firstChild);
            else that.Interface.SelectedArea.appendChild(elems["container"]);

            jQuery(elems["container"]).fadeIn(500);

            return true;
        },

        _get_node_type_sub_tree: function (nodeType, allNodeTypes) {
            var that = this;

            if (that.Options.NodeTypesSelectable) return null;

            var parentsDic = {};

            for (var i = 0, lnt = (allNodeTypes || []).length; i < lnt; ++i) {
                if (allNodeTypes[i].ParentID && (allNodeTypes[i].NodeTypeID != allNodeTypes[i].ParentID)) {
                    parentsDic[allNodeTypes[i].ParentID] = parentsDic[allNodeTypes[i].ParentID] || {};
                    parentsDic[allNodeTypes[i].ParentID][allNodeTypes[i].NodeTypeID] = allNodeTypes[i];
                }
            }

            var seenDic = {};
            var arr = [];

            var _get_childs = function (nodeTypeId) {
                if (!parentsDic[nodeTypeId]) return;

                for (var id in parentsDic[nodeTypeId]) {
                    if (seenDic[id]) continue;
                    seenDic[id] = true;

                    var nd = parentsDic[nodeTypeId][id];

                    arr.push({
                        ID: nd.NodeTypeID,
                        Title: Base64.decode(nd.TypeName),
                        ParentID: seenDic[nodeTypeId] ? nodeTypeId : null
                    });

                    _get_childs(id);
                }
            };

            _get_childs(nodeType.NodeTypeID);

            return arr.length ? arr : null;
        },

        _has_parent_node_type: function (nodeType, allNodeTypes) {
            var that = this;

            if (that.Options.NodeTypesSelectable || !nodeType.ParentID ||
                (nodeType.NodeTypeID == nodeType.ParentID)) return false;

            for (var i = 0, lnt = (allNodeTypes || []).length; i < lnt; ++i)
                if (allNodeTypes[i].NodeTypeID == nodeType.ParentID) return true;

            return false;
        },

        _add_node_type: function (nodeType, subTree, allNodeTypes) {
            var that = this;

            var container = that.Interface.NodeTypesArea;
            container.NodeTypes = container.NodeTypes || [];
            
            nodeType = nodeType || {};
            nodeType.TypeName = Base64.decode(nodeType.TypeName || nodeType.NodeType);
            
            if (container.NodeTypes[nodeType.NodeTypeID]) return;
            container.NodeTypes[nodeType.NodeTypeID] = that.Objects.NodeTypes[nodeType.NodeTypeID] = nodeType;
            
            var elems = null;
            
            nodeType.check = function () {
                if (!that.Options.NodeTypesSelectable) return;

                nodeType.Checked = true;
                elems["container"].style.color = "red";
                if (elems["_checkbox"]) elems["_checkbox"].check();
            };

            nodeType.uncheck = function () {
                if (!that.Options.NodeTypesSelectable) return;

                nodeType.Checked = false;
                elems["container"].style.color = "black";
                if (elems["_checkbox"]) elems["_checkbox"].uncheck();
            };

            elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "container",
                Class: "small-12 medium-12 large-12 rv-air-button rv-border-radius-quarter TextAlign",
                Style: "position:relative; padding:0.3rem; margin:0.2rem 0; padding-" + RV_RevFloat + ":1rem;" +
                    (!that.Options.NodeTypesSelectable ? "" : "padding-" + RV_Float + ":1.5rem;"),
                Childs: [
                    (!that.Options.NodeTypesSelectable ? null : {
                        Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                        Childs: [{
                            Type: "checkbox", Name: "_checkbox",
                            Params: {
                                Width: "0.9rem", Height: "0.9rem",
                                OnClick: function (e, done) {
                                    if (!this.Checked && !that.Options.NodeTypesMultiSelect) {
                                        that.get_node_types().filter(x => x.NodeTypeID != nodeType.NodeTypeID)
                                            .forEach(x => that.uncheck_node_type(x.NodeTypeID));
                                    }

                                    nodeType[(this.Checked ? "un" : "") + "check"]();
                                }
                            }
                        }]
                    }),
                    {
                        Type: "div", Style: "display:inline-block;", Name: "typeName",
                        Childs: [{ Type: "text", TextValue: nodeType.TypeName }]
                    },
                    (that.Options.NodeTypesSelectable || !(subTree || []).length ? null : {
                        Type: "div", Name: "subIcon", Class: "rv-border-radius-quarter", Tooltip: RVDic.SubNodeTypes,
                        Style: "display:inline-block; background-color:white; padding:0.3rem; margin-" + RV_Float + ":0.6rem;"
                    }),
                    {
                        Type: "div", Name: "treeIcon", Class: "rv-border-radius-quarter", Tooltip: RVDic.TreeView,
                        Style: "display:none; background-color:white; padding:0.3rem; margin-" + RV_Float + ":0.6rem;"
                    }
                ]
            }], container);
            
            nodeType.ContainerDiv = elems["container"];
            nodeType.NameContainer = elems["typeName"];
            nodeType.TreeIconDiv = elems["treeIcon"];

            if (elems["subIcon"]) {
                GlobalUtilities.create_nested_elements([{
                    Type: "img", Style: "cursor:pointer; width:0.9rem; height:0.9rem;",
                    Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Hierarchy.png") }]
                }], elems["subIcon"]);

                elems["subIcon"].onclick = function (e) {
                    e.stopPropagation();
                    
                    that.show_sub_node_types(nodeType, subTree, function (selected) {
                        that.show_node_types(container);

                        for (var id in container.NodeTypes)
                            if (id == selected.ID) container.NodeTypes[id].NameContainer.Click();
                    });
                };
            }

            elems["treeIcon"].onclick = function (e) {
                e.stopPropagation();
                that.show_tree({ NodeTypeID: nodeType.NodeTypeID, NodeType: nodeType.TypeName });
            };

            var onContainerClick = function () {
                var selected = (that.Objects.CurrentNodeType || {}).NodeTypeID == nodeType.NodeTypeID;
                _select_unselect(!selected);
                that.suggest_nodes();
            };

            elems["container"].onclick = nodeType.NameContainer.Click = onContainerClick;

            var _select_unselect = function (select) {
                if (select && that.Objects.CurrentNodeType)
                    that.Objects.CurrentNodeType.ContainerDiv.style.fontWeight = "normal";

                elems["container"].style.fontWeight = select ? "bold" : "normal";
                that.Objects.CurrentNodeType = select ? nodeType : null;
            };

            nodeType.Select = function () { _select_unselect(true); };

            nodeType.Unselect = function () { _select_unselect(false); };

            nodeType.Show = function () { jQuery(elems["container"]).fadeIn(0); };

            nodeType.Hide = function () { jQuery(elems["container"]).fadeOut(0); };

            nodeType.SetVisibility = function () {
                var isSearched = that.is_searched(nodeType, allNodeTypes);

                if (isSearched) nodeType.Show();
                else nodeType.Hide();

                return isSearched;
            };

            nodeType.SetVisibility();
        },

        add_node_type: function (nodeType) {
            var that = this;

            that._create_default_container();
            var container = that.get_node_types_container(false);

            that.show_node_types(container, [nodeType]);
        },

        _create_default_container: function () {
            var that = this;
            if (!that.Objects.CurrentNodeTypeContainer) that.get_node_types_container(true);
        },

        node_type_exists: function (nodeTypeId) {
            return ((this.Objects.CurrentNodeTypeContainer || {}).NodeTypes || {})[nodeTypeId] ? true : false;
        },

        check_node_type: function (nodeTypeId) {
            if (((this.Objects.CurrentNodeTypeContainer || {}).NodeTypes || {})[nodeTypeId])
                this.Objects.CurrentNodeTypeContainer.NodeTypes[nodeTypeId].check();
        },

        uncheck_node_type: function (nodeTypeId) {
            if (((this.Objects.CurrentNodeTypeContainer || {}).NodeTypes || {})[nodeTypeId])
                this.Objects.CurrentNodeTypeContainer.NodeTypes[nodeTypeId].uncheck();
        },

        check_trees: (function () {
            var _set_tree_icon = function (that, nodeTypeId) {
                that.Objects.NodeTypes[nodeTypeId].TreeIconDiv.innerHTML = "";

                that.Objects.NodeTypes[nodeTypeId].TreeIconDiv.style.display = "inline-block";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "img",
                        Style: "cursor:pointer; width:0.9rem; height:0.9rem;",
                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon("TreeView.png") }]
                    }
                ], that.Objects.NodeTypes[nodeTypeId].TreeIconDiv);
            }

            var treeNodeTypes = {};

            return function (nodeTypeIds) {
                var that = this;

                var _ids = [];
                for (var i = 0, lnt = (nodeTypeIds || []).length; i < lnt; ++i) {
                    if (treeNodeTypes[nodeTypeIds[i]]) _set_tree_icon(that, nodeTypeIds[i]);
                    else _ids.push(nodeTypeIds[i]);
                }

                if (_ids.length > 0) {
                    CNAPI.IsTree({
                        IDs: _ids.join("|"), ParseResults: true,
                        ResponseHandler: function (result) {
                            for (var ntId in (result || {})) {
                                if (result[ntId] === true) {
                                    treeNodeTypes[ntId] = true;
                                    _set_tree_icon(that, ntId);
                                }
                            }
                        }
                    });
                }
            }
        })(),

        search_node_types: function (nodeTypes) {
            var that = this;

            var searchText = !that.Objects.NodeTypeInput || !GlobalUtilities.is_visible(that.Objects.NodeTypeInput) ?
                "" : that.Objects.NodeTypeInput.value;

            if (!searchText || !(searchText = GlobalUtilities.trim(searchText))) return nodeTypes;

            var ret = [];

            var arr = String(searchText).toLowerCase().split(" ");

            for (var i = 0, lnt = (nodeTypes || []).length; i < lnt; ++i) {
                var name = " " + String(Base64.decode(nodeTypes[i].TypeName || nodeTypes[i].NodeType || "")).toLowerCase();

                for (var x = 0; x < arr.length; ++x) {
                    if (name.indexOf(" " + arr[x]) >= 0) {
                        ret.push(nodeTypes[i]);
                        break;
                    }
                }
            }

            return ret;
        },

        search_text: function () {
            var that = this;

            var searchText = !that.Objects.NodeTypeInput || !GlobalUtilities.is_visible(that.Objects.NodeTypeInput) ?
                "" : that.Objects.NodeTypeInput.value;

            return !searchText || !(searchText = GlobalUtilities.trim(searchText)) ? "" : searchText;
        },

        is_searched: function (nodeType, allNodeTypes) {
            var that = this;

            var searchText = that.search_text();
            
            if (!searchText) return !that._has_parent_node_type(nodeType, allNodeTypes);

            var arr = String(searchText).toLowerCase().split(" ");

            var name = (" " + nodeType.TypeName).toLowerCase();

            for (var x = 0; x < arr.length; ++x)
                if (name.indexOf(" " + arr[x]) >= 0) return true;

            return false;
        },

        get_node_types_container: function (createIfNotExist) {
            var that = this;

            var _containerName = that.Objects.SelectedFilter || "null";
            
            var container = that.Objects.NodeTypeContainers[_containerName];

            if (!container && createIfNotExist) container = { NodeTypes: {} };

            if (container) that.Objects.NodeTypeContainers[_containerName] =
                that.Objects.CurrentNodeTypeContainer = container;

            return container;
        },

        show_node_types: function (container, nodeTypes) {
            var that = this;
            nodeTypes = nodeTypes || [];

            container = container || that.Objects.CurrentNodeTypeContainer;
            if (!container) return;

            container.NodeTypes = container.NodeTypes || {};

            jQuery.each(nodeTypes, function (ind, val) { container.NodeTypes[val.NodeTypeID] = val; });

            jQuery.each(nodeTypes, function (ind, val) {
                var subTree = that._get_node_type_sub_tree(val, nodeTypes);
                that._add_node_type(val, subTree, nodeTypes);

                that.Objects.NodeTypes[val.NodeTypeID].Show();
            });

            var ids = nodeTypes.map(function (val) { return val.NodeTypeID; });
            if (ids.length) that.check_trees(ids);

            if (that.Objects.CurrentNodeType && !container.NodeTypes[that.Objects.CurrentNodeType.NodeTypeID])
                that.Objects.NodeTypes[that.Objects.CurrentNodeType.NodeTypeID].Unselect();
            
            //set visibility
            var visiblesCount = 0;

            for (var id in that.Objects.NodeTypes)
                if (!(container.NodeTypes || {})[id]) that.Objects.NodeTypes[id].Hide();

            for (var id in (container.NodeTypes || {})) {
                if ((that.Objects.NodeTypes[id] || {}).SetVisibility && that.Objects.NodeTypes[id].SetVisibility())
                    ++visiblesCount;
            }
            
            jQuery(that.Interface.NoNodeType)[visiblesCount ? "fadeOut" : "fadeIn"](0);
            //end of set visibility
            
            if ((nodeTypes.length == 1) && (nodeTypes[0].NameContainer || {}).Click) nodeTypes[0].NameContainer.Click();
        },

        suggest_node_types: function (callback) {
            var that = this;

            var containerExists = !!that.get_node_types_container(false);
            var container = that.get_node_types_container(true);
            
            var _show = function (nodeTypes) {
                that.show_node_types(container, nodeTypes);
                if (callback) callback();
            };
            
            jQuery(that.Interface.NodeTypesArea).fadeOut(500, function () {
                if (containerExists) _show();
                else {
                    var hasLimits = (that.Options.Limits.Nodes || []).length || (that.Options.Limits.NodeTypes || []).length;
                    var apiFunction = that.nodetype_filter_api();
                    
                    if (apiFunction) {
                        var _call = function (ops) { //Options
                            CNAPI[apiFunction](GlobalUtilities.extend(ops || {}, {
                                IsDocument: that.Options.DocumentsOnly ? true : null, ParseResults: true,
                                ResponseHandler: function (result) {
                                    var nodeTypes = result.NodeTypes || [];

                                    if (hasLimits) nodeTypes = nodeTypes.filter(function (val) {
                                        return (that.Options.Limits.NodeTypes || []).some(function (x) { return x.NodeTypeID = val.NodeTypeID });
                                    });

                                    _show(nodeTypes);
                                }
                            }));
                        };
                        
                        if (GlobalUtilities.get_type(that.Options.DataRequestOptions) != "function") _call();
                        else that.Options.DataRequestOptions({}, function (ops) { _call(ops); });
                    }
                    else if (hasLimits) _show(that.Options.Limits.NodeTypes || []);
                    else _show(that.Objects.AllNodeTypes);
                }

                jQuery(that.Interface.NodeTypesArea).fadeIn(500);
            });
        },

        nodes_data_request: function (options, done) {
            options = options || {};
            var that = this;
            var filterName = that.Objects.SelectedFilter || "null";

            that.SearchResults = that.SearchResults || {};
            
            var relatedNodeTypeId = that.get_current_node_type_id();
            var searchText = GlobalUtilities.trim(/* relatedNodeTypeId == "" ? "" : */ that.Objects.NodeInput.value);
            if (searchText == that.Objects.NodeInputInnerTitle) searchText = "";

            that.set_form_filters_visibility(relatedNodeTypeId);

            var _response_handler = function (responseText) {
                done(JSON.parse(responseText));
            };

            that.SearchResults[filterName] = that.SearchResults[filterName] || {};
            that.SearchResults[filterName][relatedNodeTypeId] = that.SearchResults[filterName][relatedNodeTypeId] || {};

            that.Objects.NodeInput.style.display = "block";

            var _initial_check = function () {
                if ((that.Objects.OwnerForms[relatedNodeTypeId] || {}).FormID && !that.Objects.SelectedFilter) return false;
                else if (that.SearchResults[filterName][relatedNodeTypeId][searchText]) {
                    _response_handler(that.SearchResults[filterName][relatedNodeTypeId][searchText]);
                    return true;
                }
                return false;
            };

            if (!relatedNodeTypeId && (that.Options.Limits.Nodes || []).length) {
                that.Objects.NodeInput.style.display = "none";

                that.Objects.GetNodesFunction = function (op) {
                    if (_initial_check()) return;

                    var rt = JSON.stringify({ Nodes: that.Options.Limits.Nodes });
                    that.SearchResults[filterName][relatedNodeTypeId][searchText] = rt;
                    _response_handler(rt);
                }
            }
            else {
                var apiFunction = that.node_filter_api() || "GetNodes";

                that.Objects.GetNodesFunction = function (op) {
                    if (op.LowerBoundary <= 1 && _initial_check()) return;

                    var ntIds = [];

                    if (relatedNodeTypeId) ntIds.push(relatedNodeTypeId);
                    else {
                        jQuery.each((that.Options.Limits.NodeTypes || []), function (ind, val) {
                            ntIds.push(val.NodeTypeID);
                        });
                    }

                    CNAPI[apiFunction]({
                        NodeTypeID: relatedNodeTypeId,
                        NodeTypeIDs: ntIds.join("|"),
                        SearchText: Base64.encode(searchText),
                        Searchable: true,
                        HasChild: true,
                        IsDocument: that.Options.DocumentsOnly ? true : null,
                        FormFilters: !that.filters_count(relatedNodeTypeId) ? null :
                            Base64.encode(JSON.stringify(that.Objects.OwnerForms[relatedNodeTypeId].Filters)),
                        MatchAllFilters: that.Objects.MatchAllFilters.Checked,
                        UseNodeTypeHierarchy: true,
                        Count: op.Count,
                        LowerBoundary: op.LowerBoundary,
                        ResponseHandler: function (responseText) {
                            if (op.LowerBoundary <= 1)
                                that.SearchResults[filterName][relatedNodeTypeId][searchText] = responseText;
                            _response_handler(responseText);
                        }
                    });
                }
            }
        },

        suggest_nodes: function (params) {
            params = params || {};
            var that = this;

            if (that.Objects.NodesList) {
                that.Objects.NodesList.clear();
                that.Objects.NodesList.data_request(params);
            }
        },

        show_sub_node_types: function (nodeType, subTree, onSelect) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: nodeType.TypeName }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "tree",
                            Style: "overflow:hidden; padding:0.8rem;"
                        }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["tree"]);
            var showed = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["jQuery/jsTree/jquery.jstree.js", "TreeViewContainer/TreeViewContainer.js"], {
                LoadSequential: true,
                OnLoad: function () {
                    elems["tree"].innerHTML = "";

                    var tnv = new TreeViewContainer(elems["tree"], {
                        Nodes: subTree, Hotkeys: false, Checkbox: false, TreeStateCheckbox: false,
                        Modifiable: false, ProgressiveRender: true, AjaxLoading: false, AjaxURL: null,
                        OnNodeSelect: function (d) {
                            showed.Close();
                            onSelect(d);
                        }
                    });
                }
            });
        },

        show_tree: function (params) {
            params = params || {};
            var that = this;

            var nodeTypeId = params.NodeTypeID;
            var nodeId = params.NodeID;
            var nodeType = !params.NodeType ? (that.Objects.NodeTypes[nodeTypeId] || {}).TypeName : params.NodeType;

            var id = nodeId || nodeTypeId;

            that.__Trees = that.__Trees || {};

            if (that.__Trees[id]) {
                that.__Trees[id].ShowedDiv = GlobalUtilities.show(that.__Trees[id].Container);
                return;
            }

            var obj = that.__Trees[id] = { ShowedDiv: null, Container: null };

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-6 medium-8 small-10 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        { Type: "div", Class: "ActionButton", Name: "button",
                            Style: "width:8rem; text-align:center; cursor:pointer; margin:0.5rem auto;" + 
                                (that.Options.TreeCheckbox ? "" : "display:none;"),
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm}]
                        },
                        { Type: "div", Name: "tree" }
                    ]
                }
            ]);

            obj.Container = elems["container"];

            GlobalUtilities.loading(elems["tree"]);
            obj.ShowedDiv = GlobalUtilities.show(obj.Container);

            GlobalUtilities.load_files([
                "jQuery/jsTree/jquery.jstree.js",
                "TreeViewContainer/TreeViewContainer.js",
                "TreeNodeViewer/TreeNodeViewer.js"
            ], { LoadSequential: true,
                OnLoad: function () {
                    elems["tree"].innerHTML = "";

                    var tnv = new TreeNodeViewer(elems["tree"], {
                        NodeTypeID: nodeTypeId, NodeID: nodeId, Width: 480, Checkbox: that.Options.TreeCheckbox,
                        OnNodeSelect: function (d) {
                            if (that.Options.OnSelect) that.Options.OnSelect({ NodeID: d.ID, Name: d.Name });
                            if (!that.Options.TreeCheckbox) obj.ShowedDiv.Close();
                        }
                    });

                    elems["button"].onclick = function () {
                        var items = tnv.get_checked_items() || [];
                        for (var i = 0, lnt = items.length; i < lnt; ++i) {
                            if (!that.add_item({ NodeID: items[i].ID, Name: items[i].Title, NodeTypeID: nodeTypeId, NodeType: nodeType })) break;
                        }
                        obj.ShowedDiv.Close();
                    }
                }
            });
        },

        get_items: function (params) {
            params = params || {};
            var that = this;

            var arr = [];
            for (var nodeId in that.Objects.SelectedItems)
                if (that.Objects.SelectedItems[nodeId]) arr.push(that.Objects.SelectedItems[nodeId]);

            if (params.Check && that.Options.Limits.Count > 0 && arr.length > that.Options.Limits.Count) {
                alert(RVDic.MSG.CannotSelectMoreThanNItems.replace("[n]", that.Options.Limits.Count));
                return false;
            }

            return arr;
        },

        get_items_string: function (delimiter) {
            var str = "";
            for (var nodeId in this.Objects.SelectedItems)
                if (this.Objects.SelectedItems[nodeId]) str += (str == "" ? "" : delimiter) + nodeId;
            return str;
        },

        get_node_types: function (checked) {
            var that = this;

            return (that.Objects.AllNodeTypes || []).filter(function (val) {
                return (checked == null) || ((checked === true) && (val.Checked === true)) ||
                    ((checked === false) && (val.Checked === false));
            });
        },

        get_node_types_string: function (checked, delimiter) {
            var that = this;

            return (that.Objects.AllNodeTypes || []).filter(function (val) {
                return (checked == null) || ((checked === true) && (val.Checked === true)) ||
                    ((checked === false) && (val.Checked === false));
            }).map(function (x) { return x.NodeTypeID; }).join(delimiter);
        },

        clear: function () {
            this.Interface.SelectedArea.innerHTML = "";
            this.Objects.NodeTypes = {};
            this.Objects.SelectedItems = {};
            this._check_if_no_item_selected(true);
        }
    }
})();