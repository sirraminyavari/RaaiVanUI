(function () {
    if (window.AdvancedUserSearch) return;

    window.AdvancedUserSearch = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            SearchArea: null,
            ButtonsArea: null,
            NodeTypesArea: null,
            NodesArea: null,
            SearchInput: null,
            MembersCheckbox: null,
            ExpertsCheckbox: null,
            ContributorsCheckbox: null,
            PropertyOwnersCheckbox: null,
            ResumeCheckbox: null,
            ResumeCHBContainer: null,
            ItemsArea: null
        };

        this.Objects = {
            NodesMode: false,
            NodeTypeSelect: null,
            FilterNodes: []
        };

        this.Options = {
            Count: 20
        };

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js", "API/CNAPI.js", "SingleDataContainer/NewSingleDataContainer.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    AdvancedUserSearch.prototype = {
        initialize: function () {
            var that = this;

            var checkboxes = [];

            var _add_checkbox = function (name, title) {
                checkboxes.push({
                    Type: "div", Class: "small-12 medium-6 large-2 row",
                    Style: "margin:0rem; padding-bottom:0.5rem;", Name: name + "Container",
                    Childs: [
                        {
                            Type: "div", Class: "small-4 medium-4 large-4 RevTextAlign",
                            Style: "padding-" + RV_RevFloat + ":0.2rem;",
                            Childs: [
                                {
                                    Type: "checkbox", Name: name,
                                    Params: { Checked: true, OnChange: function () { that.search(); } }
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-8 medium-8 large-8 TextAlign",
                            Style: "cursor:pointer; padding-" + RV_Float + ":0.2rem;",
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                                { Name: "onmouseout", Value: function () { this.style.color = "black"; } },
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        var chb = elems[name];

                                        for (var i in that.Interface) {
                                            if ((that.Interface[i] == chb) ||
                                                (GlobalUtilities.get_type(that.Interface[i].uncheck) != "function")) continue;
                                            that.Interface[i].uncheck({ StopOnChange: true });
                                        }

                                        chb.check({ StopOnChange: true });

                                        that.search();
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: title }]
                        }
                    ]
                });
            };

            _add_checkbox("membersChb", RVDic.Member);
            _add_checkbox("expertsChb", RVDic.Expert);
            _add_checkbox("contributorsChb", RVDic.Creator);
            _add_checkbox("propertyOwnersChb", RVDic.RelatedNode);
            _add_checkbox("resumeChb", RVDic.Resume);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6",
                    Style: "position:relative;", Name: "searchArea",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.2rem;" + RV_RevFloat + ":0.4rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-search fa-2x rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { that.search(); } }]
                                }
                            ]
                        },
                        {
                            Type: "input", Class: "rv-input", InnerTitle: RVDic.Search, Name: "searchInput",
                            Style: "width:100%; padding-" + RV_RevFloat + ":2.5rem; margin-bottom:1rem;"
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                {
                    Type: "div", Class: "small-10 medium-8 large-6 row",
                    Style: "margin:0rem;", Name: "buttonsArea",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-5 large-5", Style: "margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "padding:0.3rem 0rem;", Name: "nodeTypeSelect",
                                    Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                                    Childs: [{ Type: "text", TextValue: RVDic.NodeTypeSelect }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-2 large-2" },
                        {
                            Type: "div", Class: "small-12 medium-5 large-5", Style: "margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "padding:0.3rem 0rem;", Name: "nodeSelect",
                                    Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                                    Childs: [{ Type: "text", TextValue: RVDic.NodeSelect }]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem; margin-bottom:1rem; display:none;", Name: "nodeTypesArea"
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodesArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                    Style: "margin:0rem; margin-bottom:1rem; padding:0rem 2rem;",
                    Childs: checkboxes
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea",
                    Style: "margin-bottom:4rem;"
                }
            ], that.Container);

            that.Interface.SearchArea = elems["searchArea"];
            that.Interface.ButtonsArea = elems["buttonsArea"];
            that.Interface.NodeTypesArea = elems["nodeTypesArea"];
            that.Interface.NodesArea = elems["nodesArea"];
            that.Interface.SearchInput = elems["searchInput"];
            that.Interface.MembersCheckbox = elems["membersChb"];
            that.Interface.ExpertsCheckbox = elems["expertsChb"];
            that.Interface.ContributorsCheckbox = elems["contributorsChb"];
            that.Interface.PropertyOwnersCheckbox = elems["propertyOwnersChb"];
            that.Interface.ResumeCheckbox = elems["resumeChb"];
            that.Interface.ResumeCHBContainer = elems["resumeChbContainer"];
            that.Interface.ItemsArea = elems["itemsArea"];

            jQuery(that.Interface.SearchInput).focus();

            GlobalUtilities.set_onchangeorenter(that.Interface.SearchInput, function () { that.search(); });

            elems["nodeSelect"].onclick = function () {
                if ((that.Objects.FilterNodes || []).length)
                    return that.show_filter_nodes(that.Interface.NodesArea, that.Objects.FilterNodes);

                that.select_nodes({ InitialNodes: null }, function (nds) {
                    that.show_filter_nodes(that.Interface.NodesArea, nds);
                });
            };

            elems["nodeTypeSelect"].onclick = function () {
                jQuery(that.Interface.NodeTypesArea).toggle(500);
            };

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(that.Interface.NodeTypesArea, {
                InputStyle: "width:100%;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            that.Objects.NodeTypeSelect = new NewSingleDataContainer(that.Interface.NodeTypesArea, {
                InputStyle: "width:100%;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || nodeTypes[i].NodeType), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnAfterAdd: function () { that.search(); },
                OnAfterRemove: function () { that.search(); }
            });
        },

        search: function (more, done) {
            var that = this;

            if (!that.LowerBoundary) that.LowerBoundary = 1;

            var queryParams = that.search_options();

            if (queryParams === false) {
                jQuery(that.Interface.ItemsArea).fadeOut(500, function () {
                    that.Interface.ItemsArea.innerHTML = "";
                    jQuery(that.Interface.ItemsArea).fadeIn(0);
                });

                return false;
            }

            if (!more) that.LowerBoundary = 1;

            var _do = function (result, more) {
                var users = result.Users || [];

                if (!more && !users.length) {
                    return jQuery(that.Interface.ItemsArea).fadeOut(500, function () {
                        that.Interface.ItemsArea.innerHTML =
                            "<div class='rv-gray' style='text-align:center; font-size:1.5rem;'>" +
                            RVDic.NoUserFound + "</div>";

                        jQuery(that.Interface.ItemsArea).fadeIn(500);
                    });
                }

                that.LowerBoundary += users.length;

                for (var i = 0, lnt = users.length; i < lnt; ++i)
                    that.add_user(that.Interface.ItemsArea, users[i]);

                if (users.length >= that.Options.Count) {
                    var searching = false;

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                            Style: "margin-top:1rem; padding:0.5rem 0rem;",
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        if (searching) return;
                                        searching = true;

                                        var btn = this;

                                        btn.innerHTML = "";
                                        GlobalUtilities.loading(btn);

                                        that.search(true, function () { jQuery(btn).remove(); });
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.More }]
                        }
                    ], that.Interface.ItemsArea);
                }
            };

            UsersAPI.AdvancedUserSearch(GlobalUtilities.extend(queryParams, {
                Count: that.Options.Count, LowerBoundary: that.LowerBoundary, ParseResults: true,
                ResponseHandler: function (result) {
                    if (done) done();

                    if (more) _do(result, more);
                    else {
                        jQuery(that.Interface.ItemsArea).fadeOut(500, function () {
                            that.Interface.ItemsArea.innerHTML = "";
                            _do(result, more);
                            jQuery(that.Interface.ItemsArea).fadeIn(500);
                        });
                    }
                }
            }));
        },

        select_nodes: function (params, done) {
            var that = this;

            var nodeSelect = null;
            var initialNodes = params.InitialNodes || [];

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor"
                }
            ]);

            GlobalUtilities.loading(elems["container"]);
            var showedDiv = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                OnLoad: function () {
                    nodeSelect = new NodeSelect(elems["container"], {
                        Options: {
                            Title: RVDic.PleaseSelectRelatedNodes,
                            NodeTypeSearchBox: true,
                            Filters: true,
                            FilterNames: ["MyGroups", "MyExpertiseDomains"],
                            ShowBottomBar: true,
                            OnConfirm: function () {
                                var _selectedNodes = nodeSelect.get_items({ Check: true });
                                showedDiv.Close();
                                if (done) done(_selectedNodes);
                            },
                            OnCancel: function () { showedDiv.Close(); }
                        }
                    });

                    for (var i = 0, lnt = initialNodes.length; i < lnt; ++i) {
                        nodeSelect.add_item({
                            NodeID: initialNodes[i].NodeID,
                            Name: Base64.decode(initialNodes[i].Name),
                            NodeType: Base64.decode(initialNodes[i].NodeType)
                        }, true);
                    }
                }
            });
        },

        show_filter_nodes: function (container, nodes) {
            var that = this;

            container.innerHTML = "";

            that.Objects.FilterNodes = nodes;

            var _goto_search_mode = function () {
                jQuery(container).fadeOut(500, function () {
                    container.innerHTML = "";

                    jQuery(that.Interface.ButtonsArea).fadeIn(500);
                    if (that.Objects.NodeTypeSelect && that.Objects.NodeTypeSelect.get_items_string("|"))
                        jQuery(that.Interface.NodeTypesArea).fadeIn(500);
                    jQuery(that.Interface.ResumeCHBContainer).fadeIn(500);
                    jQuery(that.Interface.SearchArea).fadeIn(500, function () {
                        jQuery(that.Interface.SearchInput).focus();
                    });

                    that.Objects.NodesMode = false;

                    that.search();
                });
            };

            if (!(nodes || []).length) return _goto_search_mode();

            that.Objects.NodesMode = true;

            jQuery(that.Interface.SearchArea).fadeOut(500);
            jQuery(that.Interface.NodeTypesArea).fadeOut(500);
            jQuery(that.Interface.ResumeCHBContainer).fadeOut(500);
            jQuery(that.Interface.ButtonsArea).fadeOut(500, function () {
                jQuery(that.Interface.NodesArea).fadeIn(500);
            });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 RevTextAlign RevDirection",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button",
                            Style: "margin:0.5rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        that.select_nodes({ InitialNodes: nodes }, function (nds) {
                                            that.show_filter_nodes(container, nds);
                                        });
                                    }
                                }
                            ]
                        },
                        {
                            Type: "i", Class: "fa fa-search fa-2x rv-icon-button",
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [{ Name: "onclick", Value: function () { _goto_search_mode(); } }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:1rem;", Name: "nodes"
                }
            ], container);

            for (var i = 0, lnt = (nodes || []).length; i < lnt; ++i)
                that.add_filter_node(elems["nodes"], nodes[i]);

            that.search();
        },

        add_filter_node: function (container, node) {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "SoftBorder SoftBackgroundColor", Name: "_div",
                    Style: "display:inline-block; margin:0.2rem; padding:0.1rem 0.2rem;" +
                        "font-size:0.8rem;" + GlobalUtilities.border_radius("0.2rem")
                }
            ], container)["_div"];

            _div.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                { Type: "span", Childs: [{ Type: "text", TextValue: Base64.decode(node.Name) }] },
                {
                    Type: "span", Class: "rv-gray", Style: "margin-" + RV_Float + ":0.3rem;",
                    Childs: [{ Type: "text", TextValue: "(" + Base64.decode(node.NodeType || node.TypeName) + ")" }]
                }
            ], _div);
        },

        search_options: function () {
            var that = this;

            var searchText = GlobalUtilities.trim(that.Interface.SearchInput.value);

            var nodeTypeIds = !that.Objects.NodeTypeSelect ? "" :
                that.Objects.NodeTypeSelect.get_items_string("|");

            var nodeIds = [];

            if (that.Objects.NodesMode) {
                for (var i = 0, lnt = (that.Objects.FilterNodes || []).length; i < lnt; ++i)
                    nodeIds.push(that.Objects.FilterNodes[i].NodeID);
            }

            return !that.Objects.NodesMode && !searchText ? false : {
                SearchText: that.Objects.NodesMode ? null : Base64.encode(searchText),
                NodeTypeIDs: that.Objects.NodesMode ? null : nodeTypeIds,
                NodeIDs: that.Objects.NodesMode ? nodeIds.join('|') : null,
                Members: that.Interface.MembersCheckbox.Checked,
                Experts: that.Interface.ExpertsCheckbox.Checked,
                Contributors: that.Interface.ContributorsCheckbox.Checked,
                PropertyOwners: that.Interface.PropertyOwnersCheckbox.Checked,
                Resume: that.Interface.ResumeCheckbox.Checked
            };
        },

        add_user: function (container, item) {
            var that = this;

            var user = item.User || {};

            var hasInfo = item.IsMember || item.IsExpert || item.IsContributor || item.HasProperty;

            var isMemberCount = item.IsMember, isExpertCount = item.IsExpert,
                isContributorCount = item.IsContributor, hasPropertyCount = item.HasProperty,
                resume = item.Resume;

            var fullname = Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName);
            var imageUrl = user.ImageURL || user.ProfileImageURL;

            var arr = [];

            var _add_info = function (title, value, hideValue) {
                if (value) arr.push({
                    Type: "div", Class: "rv-air-button",
                    Style: "display:inline-block; padding:0.2rem; text-align:center;" +
                        "font-size:0.7rem; cursor:default; margin:0.2rem;" + GlobalUtilities.border_radius("0.2rem"),
                    Childs: [{ Type: "text", TextValue: title + (hideValue ? "" : ": " + value) }]
                });
            };

            _add_info(RVDic.Member, isMemberCount);
            _add_info(RVDic.Expert, isExpertCount);
            _add_info(RVDic.Creator, isContributorCount);
            _add_info(RVDic.RelatedNode, hasPropertyCount);
            _add_info(RVDic.Resume, resume, true);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 SoftBackgroundColor SoftBorder",
                    Style: "position:relative; margin-top:0.5rem; padding-" + RV_Float + ":4rem;" +
                        "padding-" + RV_RevFloat + ":3rem;" + GlobalUtilities.border_radius("0.3rem"),
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; width:3.5rem; top:0rem; bottom:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "middle", Style: "text-align:center;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-circle", Style: "width:2.5rem;",
                                            Attributes: [{ Name: "src", Value: imageUrl }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; width:3rem; top:0rem; bottom:0rem;" +
                                RV_RevFloat + ":0rem;" + (hasInfo ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "middle", Style: "text-align:center;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-id-card-o fa-2x rv-icon-button",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.info_dialog(user); } }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; padding:1rem 0.5rem;" +
                                                "font-size:1.2rem; padding-" + RV_Float + ":0rem;",
                                            Link: RVAPI.UserPageURL({ UserID: user.UserID }),
                                            Childs: [{ Type: "text", TextValue: fullname }]
                                        },
                                        { Type: "div", Style: "display:inline-block;", Childs: arr }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);
        },

        info_dialog: function (user) {
            var that = this;

            var queryParams = that.search_options();

            if (!queryParams) return;

            var fullname = Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-size:1.2rem; font-weight:bold; text-align:center; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: fullname }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["items"]);
            GlobalUtilities.show(elems["container"]);

            UsersAPI.AdvancedUserSearchMeta(GlobalUtilities.extend(queryParams, {
                UserID: user.UserID, ParseResults: true,
                ResponseHandler: function (result) {
                    var nodes = (result || {}).Nodes || [];

                    elems["items"].innerHTML = "";

                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        that.add_node(elems["items"], nodes[i]);
                }
            }));
        },

        add_node: function (container, node) {
            var that = this;

            var name = Base64.decode(node.Name);

            var arr = [];

            var _add_info = function (title, value) {
                if (value) arr.push({
                    Type: "div", Class: "rv-air-button",
                    Style: "display:inline-block; padding:0.2rem; text-align:center;" +
                        "font-size:0.7rem; cursor:default; margin:0.2rem;" + GlobalUtilities.border_radius("0.2rem"),
                    Childs: [{ Type: "text", TextValue: title }]
                });
            };

            _add_info(RVDic.Member, node.IsMember);
            _add_info(RVDic.Expert, node.IsExpert);
            _add_info(RVDic.Creator, node.IsContributor);
            _add_info(RVDic.RelatedNode, node.HasProperty);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 SoftBackgroundColor SoftBorder",
                    Style: "margin-top:0.2rem; padding:0.5rem;" + GlobalUtilities.border_radius("0.3rem"),
                    Childs: [
                        {
                            Type: "div",
                            Style: "display:inline-block; padding-" + RV_Float + ":0rem;",
                            Link: RVAPI.NodePageURL({ NodeID: node.NodeID }),
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: name }]
                                },
                                {
                                    Type: "div", Class: "rv-gray", Style: "display:inline-block; margin:0rem 0.5rem;",
                                    Childs: [{ Type: "text", TextValue: "(" + Base64.decode(node.NodeType || node.TypeName) + ")" }]
                                }
                            ]
                        },
                        { Type: "div", Style: "display:inline-block;", Childs: arr }
                    ]
                }
            ], container);
        }
    };
})();