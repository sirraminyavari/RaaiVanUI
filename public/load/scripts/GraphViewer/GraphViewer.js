(function () {
    if (window.GraphViewer) return;

    window.GraphViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        var that = this;

        that.Interface = {
            SettingsArea: null,
            Checkboxes: {
                Members: null,
                Admins: null,
                Experts: null,
                Fans: null,
                Creators: null,
                Friends: null,
                Hierarchy: null,
                RelatedNodes: null
            },
            NodeTypeSelects: {
                Members: null,
                Experts: null,
                Fans: null,
                Creators: null,
                RelatedNodes: null
            }
        };

        that.Objects = {
            Items: [],
            CentralItemID: null
        };

        that.Options = {
            LevelDistance: 100
        };

        var body = document.getElementsByTagName("body")[0];

        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Class: "SoftShadow WarmBackgroundColor SoftBorder RevTextAlign", Name: "selectionArea",
            Style: "position:fixed; top:0rem; left:0rem; right:0rem; height:3.25rem; z-index:2;"
        }], body);

        var selectionArea = elems["selectionArea"];

        elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Style: "margin-top:3.25rem;", Attributes: [{ Name: "id", Value: "container" }],
            Childs: [{
                Type: "div", Attributes: [{ Name: "id", Value: "center-container" }],
                Childs: [{ Type: "div", Name: "convas", Attributes: [{ Name: "id", Value: "infovis" }] }]
            }]
        }], that.ContainerDiv);

        var convasContainer = elems["convas"];

        that.Graph = new $jit.RGraph({
            'injectInto': convasContainer,
            //Optional: create a background canvas and plot
            //concentric circles in it.
            'background': {
                CanvasStyles: { strokeStyle: '#555' },
                levelDistance: that.Options.LevelDistance, numberOfCircles: 100
            },
            Navigation: {
                enable: true,
                type: 'Native',
                //Enable panning events only if we're dragging the empty
                //canvas (and not a node).
                panning: 'avoid nodes',
                zooming: 10 //zoom speed. higher is more sensible
            },
            Node: { 'overridable': true, 'color': '#cc0000' },
            Edge: { 'overridable': true, 'color': '#ffffff' },
            Events: {
                enable: true,
                onClick: function (node, event, e) { },
                onMouseWheel: function (delta, e) { that.zoom(delta < 0); }
            },
            //Parent-children distance
            levelDistance: that.Options.LevelDistance,
            //Duration
            duration: 500,
            //Add styles to node labels on label creation
            onCreateLabel: function (domElement, node) { that._create_label(domElement, node); },
            onPlaceLabel: function (domElement, node) {
                var style = domElement.style;
                var left = parseInt(style.left);
                var w = domElement.offsetWidth;
                style.left = (left - w / 2) + 'px';
                style.display = '';
            }
        });

        that._pre_init({ SelectionArea: selectionArea });
    };

    GraphViewer.prototype = {
        _pre_init: function (params) {
            var that = this;
            GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params); } });
        },

        _initialize: function (params) {
            params = params || {};
            var that = this;
            if (params.SelectionArea) that._create_selection_area(params.SelectionArea);
            that._create_settings_area();

            var body = document.getElementsByTagName("body")[0];

            var _set_info_style = function (_div) {
                _div.style.background = "#e1e6ff"; _div.style.border = "1px dotted #C0C0C0";
                _div.style.opacity = "0.40"; _div.style.opacity = "filter:alpha(opacity=40)";
            };

            var _set_info_style_over = function (_div) {
                _div.style.background = "#e1e6df"; _div.style.border = "1px double  #999999";
                _div.style.opacity = "1.0"; _div.style.opacity = "filter:alpha(opacity=100)";
            };

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "z-index:1; background:#e1e6ff; position:fixed; top:55px; " + RV_Float + ":10px; " +
                        "border:1px dotted #C0C0C0; padding:4px; opacity:0.40; opacity:filter:alpha(opacity=40);",
                    Properties: [
                        { Name: "onmouseover", Value: function () { _set_info_style_over(this); } },
                        { Name: "onmouseout", Value: function () { _set_info_style(this); } }
                    ],
                    Childs: [
                        {
                            Type: "div",
                            Childs: [{
                                Type: "img", Style: "width:20px; height:20px; cursor:pointer;",
                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Add_256.png") }],
                                Properties: [{ Name: "onclick", Value: function () { that.zoom(false); } }]
                            }]
                        },
                        {
                            Type: "div", Style: "margin-top:4px;",
                            Childs: [{
                                Type: "img", Style: "width:20px; height:20px; cursor:pointer;",
                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Minus-Over.png") }],
                                Properties: [{ Name: "onclick", Value: function () { that.zoom(true); } }]
                            }]
                        }
                    ]
                },
                {
                    Type: "div",
                    Style: "z-index:1; background:#e1e6ff; position:fixed; top:55px; " + RV_RevFloat + ":10px; " +
                        "border:1px dotted #C0C0C0; padding:4px; opacity:0.40; opacity:filter:alpha(opacity=40);",
                    Properties: [
                        { Name: "onmouseover", Value: function () { _set_info_style_over(this); } },
                        { Name: "onmouseout", Value: function () { _set_info_style(this); } }
                    ],
                    Childs: [{
                        Type: "img", Style: "width:20px; height:20px; cursor:pointer;",
                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Settings.png") }],
                        Properties: [{ Name: "onclick", Value: function () { GlobalUtilities.show(that.Interface.SettingsArea); } }]
                    }]
                },
                {
                    Type: "div",
                    Style: "z-index:1; background:#e1e6ff; position:fixed; top:95px; " + (RV_RTL ? "left" : "right") + ":10px; " +
                        "border:1px dotted #C0C0C0; padding:4px; opacity:0.40; opacity:filter:alpha(opacity=40);",
                    Properties: [
                        { Name: "onmouseover", Value: function () { _set_info_style_over(this); } },
                        { Name: "onmouseout", Value: function () { _set_info_style(this); } }
                    ],
                    Childs: [{
                        Type: "div",
                        Childs: [{
                            Type: "img", Style: "width:20px; height:20px; cursor:pointer;", //Tooltip: RVDic.Clean,
                            Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Clean.png") }],
                            Properties: [{ Name: "onclick", Value: function () { that.empty(); } }]
                        }]
                    }]
                }
            ], body);

            var _get_item = function (opts) {
                var _img = [];
                if (opts.ImageURL) {
                    _img.push({ Type: "img", Style: "width:22px; height:7px;", Attributes: [{ Name: "src", Value: opts.ImageURL }] });
                }

                return [
                    {
                        Type: "div", Style: "margin-top:" + (opts.Color ? 8 : 6) + "px; float:" + RV_Float +
                          "; padding:" + (opts.Color ? 1 : 0) + "px; width:" + (opts.Color ? 20 : 22) +
                          "px; background-color:" + (opts.Color || "") + ";", Childs: _img
                    },
                    {
                        Type: "div", Style: "margin:0px 4px 4px 4px; float:" + RV_Float,
                        Childs: [{ Type: "text", TextValue: opts.Title }]
                    },
                    { Type: "div", Style: "clear:both;" }
                ]
            }

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "z-index:1; background:#e1e6ff; position:fixed; bottom:10px; " + (RV_RTL ? "right" : "left") + ":10px; " +
                        "border:1px dotted #C0C0C0; padding:4px; opacity:0.40; opacity:filter:alpha(opacity=40);",
                    Properties: [
                        { Name: "onmouseover", Value: function () { _set_info_style_over(this); } },
                        { Name: "onmouseout", Value: function () { _set_info_style(this); } }
                    ],
                    Childs: [
                        {
                            Type: "div", Style: "margin-bottom:5px; font-size:x-small; font-weight:bold; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic.MapGuide }]
                        },
                        { Type: "div", Style: "margin:4px;", Childs: _get_item({ Color: "brown", Title: RVDic.Members }) },
                        { Type: "div", Style: "margin:4px;", Childs: _get_item({ Color: "red", Title: RVDic.Admins }) },
                        { Type: "div", Style: "margin:4px;", Childs: _get_item({ Color: "purple", Title: RVDic.Experts }) },
                        { Type: "div", Style: "margin:4px;", Childs: _get_item({ Color: "orange", Title: RVDic.Fans }) },
                        { Type: "div", Style: "margin:4px;", Childs: _get_item({ Color: "green", Title: RVDic.Creators }) },
                        { Type: "div", Style: "margin:4px;", Childs: _get_item({ Color: "blue", Title: RVDic.Coworkers }) },
                        {
                            Type: "div", Style: "margin:4px;",
                            Childs: _get_item({ ImageURL: GlobalUtilities.icon("ArrowLeft-Mini.png"), Title: RVDic.Hierarchy })
                        },
                        { Type: "div", Style: "margin:4px;", Childs: _get_item({ Color: "black", Title: RVDic.RelatedNodes }) },
                    ]
                }
            ], body);
        },

        _parse_results: function (result, newGraph) {
            var nodes = [];
            var edges = [];

            if (result.NodeID) {
                if (newGraph === true) {
                    this.Objects.Items[result.NodeID] = result;
                    nodes.push({ ID: result.NodeID, Name: Base64.decode(result.Name || "") });
                }
                if (result.Parent) {
                    this.Objects.Items[result.Parent.NodeID] = result.Parent;
                    nodes.push({ ID: result.Parent.NodeID, Name: Base64.decode(result.Parent.Name || "") });
                    edges.push({ SourceID: result.Parent.NodeID, DestinationID: result.NodeID, Type: "Parent" });
                }
                for (var i = 0, lnt = (result.Childs || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.Childs[i].NodeID] = result.Childs[i];
                    nodes.push({ ID: result.Childs[i].NodeID, Name: Base64.decode(result.Childs[i].Name || "") });
                    edges.push({ SourceID: result.NodeID, DestinationID: result.Childs[i].NodeID, Type: "Parent" });
                }
                for (var i = 0, lnt = (result.RelatedNodes || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.RelatedNodes[i].NodeID] = result.RelatedNodes[i];
                    nodes.push({ ID: result.RelatedNodes[i].NodeID, Name: Base64.decode(result.RelatedNodes[i].Name || "") });
                    edges.push({ SourceID: result.NodeID, DestinationID: result.RelatedNodes[i].NodeID, Type: "Related" });
                }
                for (var i = 0, lnt = (result.Creators || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.Creators[i].UserID] = result.Creators[i];
                    nodes.push({
                        ID: result.Creators[i].UserID,
                        Name: Base64.decode(result.Creators[i].FirstName || "") + " " + Base64.decode(result.Creators[i].LastName || "")
                    });
                    edges.push({ SourceID: result.Creators[i].UserID, DestinationID: result.NodeID, Type: "Creator" });
                }
                for (var i = 0, lnt = (result.Members || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.Members[i].UserID] = result.Members[i];
                    nodes.push({
                        ID: result.Members[i].UserID,
                        Name: Base64.decode(result.Members[i].FirstName || "") + " " + Base64.decode(result.Members[i].LastName || "")
                    });
                    edges.push({
                        SourceID: result.Members[i].UserID, DestinationID: result.NodeID,
                        Type: (result.Members[i].IsAdmin === true ? "Admin" : (result.Members[i].IsPending === true ? "PendingMember" : "Member"))
                    });
                }
                for (var i = 0, lnt = (result.Experts || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.Experts[i].UserID] = result.Experts[i];
                    nodes.push({
                        ID: result.Experts[i].UserID,
                        Name: Base64.decode(result.Experts[i].FirstName || "") + " " + Base64.decode(result.Experts[i].LastName || "")
                    });
                    edges.push({ SourceID: result.Experts[i].UserID, DestinationID: result.NodeID, Type: "Expert" });
                }
                for (var i = 0, lnt = (result.Fans || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.Fans[i].UserID] = result.Fans[i];
                    nodes.push({
                        ID: result.Fans[i].UserID,
                        Name: Base64.decode(result.Fans[i].FirstName || "") + " " + Base64.decode(result.Fans[i].LastName || "")
                    });
                    edges.push({ SourceID: result.Fans[i].UserID, DestinationID: result.NodeID, Type: "Fan" });
                }
            }
            else {
                if (newGraph === true) {
                    this.Objects.Items[result.UserID] = result;
                    nodes.push({
                        ID: result.UserID,
                        Name: Base64.decode(result.FirstName || "") + " " + Base64.decode(result.LastName || "")
                    });
                }
                for (var i = 0, lnt = (result.CreatedNodes || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.CreatedNodes[i].NodeID] = result.CreatedNodes[i];
                    nodes.push({ ID: result.CreatedNodes[i].NodeID, Name: Base64.decode(result.CreatedNodes[i].Name || "") });
                    edges.push({ SourceID: result.UserID, DestinationID: result.CreatedNodes[i].NodeID, Type: "Creator" });
                }
                for (var i = 0, lnt = (result.MemberNodes || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.MemberNodes[i].NodeID] = result.MemberNodes[i];
                    nodes.push({ ID: result.MemberNodes[i].NodeID, Name: Base64.decode(result.MemberNodes[i].Name || "") });
                    edges.push({
                        SourceID: result.UserID, DestinationID: result.MemberNodes[i].NodeID,
                        Type: (result.MemberNodes[i].IsAdmin === true ? "Admin" :
                            (result.MemberNodes[i].IsPending === true ? "PendingMember" : "Member"))
                    });
                }
                for (var i = 0, lnt = (result.ExpertiseDomains || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.ExpertiseDomains[i].NodeID] = result.ExpertiseDomains[i];
                    nodes.push({ ID: result.ExpertiseDomains[i].NodeID, Name: Base64.decode(result.ExpertiseDomains[i].Name || "") });
                    edges.push({ SourceID: result.UserID, DestinationID: result.ExpertiseDomains[i].NodeID, Type: "Expert" });
                }
                for (var i = 0, lnt = (result.Favorites || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.Favorites[i].NodeID] = result.Favorites[i];
                    nodes.push({ ID: result.Favorites[i].NodeID, Name: Base64.decode(result.Favorites[i].Name || "") });
                    edges.push({ SourceID: result.UserID, DestinationID: result.Favorites[i].NodeID, Type: "Fan" });
                }
                for (var i = 0, lnt = (result.Friends || []).length; i < lnt; ++i) {
                    this.Objects.Items[result.Friends[i].UserID] = result.Friends[i];
                    nodes.push({
                        ID: result.Friends[i].UserID,
                        Name: Base64.decode(result.Friends[i].FirstName || "") + " " + Base64.decode(result.Friends[i].LastName || "")
                    });
                    edges.push({ SourceID: result.UserID, DestinationID: result.Friends[i].UserID, Type: "Friend" });
                }
            }

            this.add_nodes(nodes, newGraph);
            this.add_edges(edges);
        },

        _create_selection_area: function (containerDiv) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "display:flex; align-items:center; z-index:3; position:absolute;" +
                        "top:0; bottom:0;" + RV_RevFloat + ":2rem; font-size:1.2rem;",
                    Childs: [{
                        Type: "i", Class: "fa fa-home fa-2x", Style: "color:white;",
                        Tooltip: RVDic.PersonalPage, Link: RVAPI.HomePageURL(),
                        Attributes: [{ Name: "aria-hidden", Value: true }]
                    }]
                },
                {
                    Type: "div", Class: "Direction",
                    Style: "position:relative; padding-top:0.5rem; width:40rem; margin:0 auto;" + 
                        "padding-" + RV_RevFloat + ":10rem;",
                    Childs: [
                        {
                            Type: "div", Class: "rv-border-radius-quarter",
                            Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0rem; width:9.5rem;" +
                                "padding:0.2rem; background-color:white;",
                            Childs: [{
                                Type: "div", Name: "menu", Style: "padding:0.2rem 0; font-size:0.7rem;",
                                Class: "small-12 medium-12 large-12 rv-air-button-base " +
                                    "rv-air-button-black rv-border-radius-quarter",
                                Properties: [{ Name: "onmouseover", Value: function () { this.onmouseover = null; _init_mouse_over(); } }],
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-chevron-down", Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    },
                                    { Type: "text", TextValue: RVDic.AdvancedSelect }
                                ]
                            }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemSelect" }
                    ]
                }
            ], containerDiv);

            var nodeSelectArea = elems["itemSelect"];

            //Item Select Area
            var popupMenu = null;

            var _init_mouse_over = function () {
                popupMenu = GlobalUtilities.popup_menu(elems["menu"], menuElems["container"], { Align: "bottom" });

                GlobalUtilities.enable_by_mouse_over(elems["menu"], popupMenu.Container, {
                    Started: true, OnStart: function (d) { popupMenu.Show(d); }, OnEnd: function (d) { popupMenu.Hide(d); }
                });
            };

            var menuElems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "row", Name: "container",
                    Style: "margin:0rem; width:16rem; padding:0.5rem; line-height:7rem; text-align:center; font-size:1.2rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Style: "padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "div", Style: "height:7rem;",
                                Class: "small-12 medium-12 large-12 rv-air-button rv-border-radius-half",
                                Properties: [{ Name: "onclick", Value: function () { _userSelect(); } }],
                                Childs: [{ Type: "text", TextValue: RVDic.User }]
                            }]
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Style: "padding-" + RV_Float + ":0.5rem;",
                            Childs: [{
                                Type: "div", Style: "height:7rem;",
                                Class: "small-12 medium-12 large-12 rv-air-button rv-border-radius-half",
                                Properties: [{ Name: "onclick", Value: function () { _nodeSelect(); } }],
                                Childs: [{ Type: "text", TextValue: RVDic.Node }]
                            }]
                        }
                    ]
                }
            ]);

            var _nodeSelect = function () {
                if (that.__NodeListContainer) {
                    that.__ShowedNodeList = GlobalUtilities.show(that.__NodeListContainer);
                    return;
                }

                var _div = that.__NodeListContainer = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0 auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                that.__ShowedNodeList = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);

                GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                    OnLoad: function () {
                        var ns = new NodeSelect(_div, {
                            Options: {
                                Title: RVDic.NodeSelect,
                                NodeTypeSearchBox: true, TreeCheckbox: false, HideSelectedItems: true, Filters: true,
                                OnSelect: function (nd) {
                                    that.__ShowedNodeList.Close();
                                    _onselect(nd.NodeID, false);
                                }
                            }
                        });
                    }
                });
            }

            var _userSelect = function () {
                if (that.__UserListContainer) {
                    that.__ShowedUserList = GlobalUtilities.show(that.__UserListContainer);
                    return;
                }

                var _div = that.__UserListContainer = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "_div"
                }])["_div"];

                that.__ShowedUserList = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);

                GlobalUtilities.load_files(["USR/UserSelect.js"], {
                    OnLoad: function () {
                        var us = new UserSelect(_div, {
                            Options: {
                                HideSelectedItems: true,
                                OnSelect: function (user) {
                                    that.__ShowedUserList.Close();
                                    _onselect(user.UserID, true);
                                }
                            }
                        });
                    }
                });
            }
            //end of Item Select Area

            var _onselect = function (id, isUser) {
                if (that.Graph.graph.hasNode(id)) return that.set_central_node(id);

                that.Objects.CentralItemID = id;

                var _params = {
                    NodeID: isUser ? "" : id, UserID: isUser ? id : "",
                    ResponseHandler: function (responseText) { that._parse_results(JSON.parse(responseText), true); }
                }

                var filters = that._get_filters();
                for (var itm in filters) _params[itm] = filters[itm];

                CNAPI.GetMapItems(_params);
            }

            var itemSelect = GlobalUtilities.append_autosuggest(nodeSelectArea, {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.Search + "...",
                AjaxDataSource: RVAPI.SuggestTags({ Count: 20 }),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Items || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i].Name || ""), items[i].ItemID + "|" + items[i].Type]);
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    if (index < 0) return;

                    var centralItemId = String(this.values[index]).split('|');

                    _onselect(centralItemId[0], centralItemId[1] == "User");
                }
            });
        },

        _create_label: function (domElement, node) {
            var that = this;

            var _zIndex = 9;
            var item = that.Objects.Items[node.id];
            if (!item) return;

            var imageUrl = item.ProfileImageURL || item.IconUrl || item.NodeTypeIconURL;
            var navigateUrl = item.UserID ?
                RVAPI.UserPageURL({ UserID: item.UserID }) : RVAPI.NodePageURL({ NodeID: item.NodeID });
            var nodeData = [];
            if (item.NodeType && item.NodeType != "") {
                nodeData.push({ Type: "div", Childs: [{ Type: "text", TextValue: "(" + Base64.decode(item.NodeType) + ")" }] });
            }
            var additionalId = item.AdditionalID || "";

            domElement.setAttribute("style", "position:absolute; background:#e1e6df; border:1px dotted #C0C0C0; padding:2px; " +
                "opacity:0.40; opacity:filter:alpha(opacity=40); font-size:x-small; font-weight:bold;" +
                "color:#000; -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2); text-align:center; " +
                "-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2); z-index:" + _zIndex + ";");
            
            jQuery(domElement).attr("class", (jQuery(domElement).attr("class") || " ") + " rv-border-radius-half");

            domElement.onclick = function () {
                that.Graph.busy = false;
                that.set_central_node(node.id);
                return true;
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Childs: [
                        {
                            Type: "div", Style: "text-align:center;",
                            Childs: [
                                {
                                    Type: "img", Style: "width:1.5rem; height:1.5rem;", Name: "icon",
                                    Attributes: [{ Name: "src", Value: imageUrl }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "cursor:pointer; margin-top:0.4rem;",
                            Childs: [{ Type: "text", TextValue: node.name }]
                        },
                        {
                            Type: "div", Style: "display:none; text-align:center;", Name: "overElement",
                            Childs: [
                                { Type: "div", Childs: [{ Type: "text", TextValue: additionalId }] },
                                { Type: "div", Childs: nodeData },
                                {
                                    Type: "div", Class: "rv-air-button rv-circle", Style: "margin-top:0.5rem;", Link: navigateUrl,
                                    Childs: [{ Type: "text", TextValue: RVDic.VisitPage }]
                                },
                                {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-circle", Style: "margin-top:0.5rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.add_connected_nodes(node.id); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.AddN.replace("[n]", RVDic.RelatedNodes) }]
                                }
                            ]
                        }
                    ]
                }
            ], domElement);

            var overElement = elems["overElement"];
            var iconArea = elems["icon"];

            domElement.onmouseover = function () {
                overElement.style.display = "block";

                domElement.style.background = "#e1e6ff";
                domElement.style.border = "1px double  #999999";
                domElement.style.padding = "5px";
                domElement.style.opacity = "1.0";
                domElement.style.opacity = "filter:alpha(opacity=100)";
                domElement.style.zIndex = "9999";
            };

            domElement.onmouseout = function () {
                overElement.style.display = "none";

                domElement.style.background = "#e1e6df";
                domElement.style.border = "1px";
                domElement.style.padding = "2px";
                domElement.style.opacity = "0.40";
                domElement.style.opacity = "filter:alpha(opacity=40)";
                domElement.style.zIndex = _zIndex;
            };
        },

        _create_settings_area: function () {
            var that = this;

            var _append_select = function (_area) {
                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "middle", Class: "small-12 medium-12 large-12",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "itemArea",
                                Style: "position:relative; display:none; padding-" + RV_Float + ":1.5rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "position:absolute; top:0.2rem;" + RV_Float + ":0rem;",
                                        Childs: [
                                            {
                                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton",
                                                Attributes: [{ Name: "aria-hidden", Value: true }]
                                            }
                                        ]
                                    },
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "selectedItem" }
                                ]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "selectArea" }
                        ]
                    }
                ], _area);

                var itemArea = _el["itemArea"];
                var removeButton = _el["removeButton"];
                var selectedItem = _el["selectedItem"];
                var selectArea = _el["selectArea"];

                var as = GlobalUtilities.append_autosuggest(selectArea, {
                    InputClass: "rv-input",
                    InputStyle: "width:100%; font-size:0.7rem;",
                    InnerTitle: RVDic.FilterSelect + "...",
                    AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                    ResponseParser: function (responseText) {
                        var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                        var arr = [];
                        for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                            arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                        return arr;
                    },
                    OnSelect: function () {
                        GlobalUtilities.set_text(selectedItem, GlobalUtilities.secure_string(this.keywords[this.selectedIndex]));
                        itemArea.style.display = "block";
                        selectArea.style.display = "none";
                    }
                });

                removeButton.onclick = function () {
                    clear_autosuggest(as);
                    itemArea.style.display = "none";
                    selectArea.style.display = "block";
                }

                return as;
            };

            var _create_chb = function (chbs, selectAreaName) {
                var boxes = (chbs || []).map(function (val) {
                    return {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "position:relative; padding-" + RV_Float + ":1.5rem; margin-bottom:0.3rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                Childs: [{ Type: "checkbox", Name: val.Name, Params: { Checked: val.Checked === true, Width: 18, Height: 18 } }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Childs: [{ Type: "text", TextValue: val.Title }]
                            }
                        ]
                    }
                });

                var _bxStyle = !selectAreaName ? "" : 
                    ("border-" + RV_RevFloat + "-width:0.2rem; border-" + RV_RevFloat +
                    "-color:rgb(200,200,200);" + "border-" + RV_RevFloat + "-style:solid;");

                return {
                    Type: "div", Style: "margin:0rem; padding:0.3rem;",
                    Class: "small-12 medium-12 large-12 row rv-border-radius-quarter rv-bg-color-trans-white", 
                    Childs: [
                        {
                            Type: "div", Class: "small-4 medium-4 large-4 rv-trim-vertical-margins rv-border-radius-quarter",
                            Style: _bxStyle, Childs: boxes
                        },
                        { Type: "div", Class: "small-8 medium-8 large-8", Name: selectAreaName, Style: "padding-" + RV_Float + ":0.5rem;" }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "settingsArea",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; margin-bottom:1rem; font-size:1.2rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Settings }]
                        },
                        _create_chb([
                            { Name: "Members", Title: RVDic.Members, Checked: true },
                            { Name: "Admins", Title: RVDic.Admins, Checked: true }
                        ], "MembersNodeTypeSelect"),
                        _create_chb([{ Name: "Experts", Title: RVDic.Experts, Checked: true }], "ExpertsNodeTypeSelect"),
                        _create_chb([{ Name: "Fans", Title: RVDic.Fans }], "FansNodeTypeSelect"),
                        _create_chb([{ Name: "Creators", Title: RVDic.Creators }], "CreatorsNodeTypeSelect"),
                        _create_chb([{ Name: "Friends", Title: RVDic.Coworkers }]),
                        _create_chb([{ Name: "Hierarchy", Title: RVDic.Hierarchy, Checked: true }]),
                        _create_chb([{ Name: "RelatedNodes", Title: RVDic.RelatedNodes, Checked: true }], "RelatedNodesTypeSelect")
                    ]
                }
            ]);

            that.Interface.SettingsArea = elems["settingsArea"];

            that.Interface.Checkboxes.Members = elems["Members"];
            that.Interface.Checkboxes.Admins = elems["Admins"];
            that.Interface.Checkboxes.Experts = elems["Experts"];
            that.Interface.Checkboxes.Fans = elems["Fans"];
            that.Interface.Checkboxes.Creators = elems["Creators"];
            that.Interface.Checkboxes.Friends = elems["Friends"];
            that.Interface.Checkboxes.Hierarchy = elems["Hierarchy"];
            that.Interface.Checkboxes.RelatedNodes = elems["RelatedNodes"];

            that.Interface.NodeTypeSelects.Members = _append_select(elems["MembersNodeTypeSelect"]);
            that.Interface.NodeTypeSelects.Experts = _append_select(elems["ExpertsNodeTypeSelect"]);
            that.Interface.NodeTypeSelects.Fans = _append_select(elems["FansNodeTypeSelect"]);
            that.Interface.NodeTypeSelects.Creators = _append_select(elems["CreatorsNodeTypeSelect"]);
            that.Interface.NodeTypeSelects.RelatedNodes = _append_select(elems["RelatedNodesTypeSelect"]);
        },

        _get_filters: function () {
            var filters = {};

            var index = this.Interface.NodeTypeSelects.RelatedNodes.selectedIndex;
            var relatedNodesTypeId = index < 0 ? "" : this.Interface.NodeTypeSelects.RelatedNodes.values[index];

            index = this.Interface.NodeTypeSelects.Members.selectedIndex;
            var membersNodeTypeId = index < 0 ? "" : this.Interface.NodeTypeSelects.Members.values[index];

            index = this.Interface.NodeTypeSelects.Creators.selectedIndex;
            var creatorsNodeTypeId = index < 0 ? "" : this.Interface.NodeTypeSelects.Creators.values[index];

            index = this.Interface.NodeTypeSelects.Experts.selectedIndex;
            var expertsNodeTypeId = index < 0 ? "" : this.Interface.NodeTypeSelects.Experts.values[index];

            index = this.Interface.NodeTypeSelects.Fans.selectedIndex;
            var fansNodeTypeId = index < 0 ? "" : this.Interface.NodeTypeSelects.Fans.values[index];

            return {
                Members: this.Interface.Checkboxes.Members.checked,
                Admins: this.Interface.Checkboxes.Admins.checked,
                Experts: this.Interface.Checkboxes.Experts.checked,
                Fans: this.Interface.Checkboxes.Fans.checked,
                Creators: this.Interface.Checkboxes.Creators.checked,
                Friends: this.Interface.Checkboxes.Friends.checked,
                Hierarchy: this.Interface.Checkboxes.Hierarchy.checked,
                RelatedNodes: this.Interface.Checkboxes.RelatedNodes.checked,
                RelatedNodesTypeID: relatedNodesTypeId,
                MembersNodeTypeID: membersNodeTypeId,
                CreatorsNodeTypeID: creatorsNodeTypeId,
                ExpertsNodeTypeID: expertsNodeTypeId,
                FansNodeTypeID: fansNodeTypeId
            };
        },

        add_connected_nodes: function (itemId) {
            var that = this;

            var item = that.Objects.Items[itemId];
            if (!item) return;

            var _params = {
                NodeID: item.NodeID, UserID: item.UserID,
                ResponseHandler: function (responseText) { that._parse_results(JSON.parse(responseText), false); }
            };

            var filters = that._get_filters();
            for (var itm in filters) _params[itm] = filters[itm];

            CNAPI.GetMapItems(_params);
        },

        add_edges: function (edges) {
            for (var i = 0, lnt = (edges || []).length; i < lnt; ++i) {
                var _type = undefined;
                var _color = "#000";
                var _weight = 1;

                switch (edges[i].Type) {
                    case "Member":
                        _color = "brown";
                        break;
                    case "Admin":
                        _color = "red";
                        break;
                    case "Expert":
                        _color = "purple";
                        break;
                    case "Fan":
                        _color = "orange";
                        break;
                    case "Creator":
                        _color = "green";
                        break;
                    case "Friend":
                        _color = "blue";
                        break;
                    case "Parent":
                        _type = "arrow";
                        _color = "#000";
                        break;
                    case "Related":
                        _color = "#000";
                        break;
                }

                var _data = { $direction: [edges[i].SourceID, edges[i].DestinationID], $dim: 8, $color: _color, 'weight': _weight };
                if (_type) _data.$type = _type;
                this.Graph.graph.addAdjacence({ 'id': edges[i].SourceID }, { 'id': edges[i].DestinationID }, _data);
            }

            this.Graph.refresh();
        },

        remove_edges: function (edges) {
            this.Graph.op.removeEdge(edges, { type: "fade:seq", hideLabels: true });
        },

        add_nodes: function (nodes, newGraph) {
            var arr = [];
            for (var i = 0, lnt = (nodes || []).length; i < lnt; ++i) {
                if (this.Graph.graph.hasNode(nodes[i].NodeID)) continue;
                arr.push({ id: nodes[i].ID, name: nodes[i].Name, data: { $dim: 2, $color: '#000' } });
            }
            if (newGraph === true) {
                this.Graph.loadJSON(arr);
                this.Graph.refresh();
            }
            else {
                this.Graph.op.sum(arr, { type: "fade:seq", hideLabels: true });
                this.Graph.refresh();
            }
        },

        remove_node: function (nodeId) {
            var n = this.Graph.graph.getNode(nodeId);
            if (!n) return;
            var subnodes = n.getSubnodes(0);
            var map = [];
            for (var i = 0; i < subnodes.length; i++) map.push(subnodes[i].id);
            this.Graph.op.removeNode(map.reverse(), { type: "fade:seq", hideLabels: true });
        },

        set_central_node: function (nodeId) {
            this.Graph.onClick(nodeId, { hideLabels: false });
        },

        empty: function () {
            this.Graph.loadJSON({ id: "1a2b3c4d", data: { $dim: 1, $color: '#000' /*'transparent'*/ } });
            this.Graph.refresh();
            this.remove_node("1a2b3c4d");
        },

        zoom: function (out) {
            var scale = out === true ? 0.8 : 1.2;
            this.Graph.canvas.scale(scale, scale);
        }
    };
})();