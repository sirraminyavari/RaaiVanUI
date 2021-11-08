(function () {
    if (window.ReportGroupSelect) return;

    window.ReportGroupSelect = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            Nodes: null,
            SelectButton: null
        };

        this.Objects = {
            UsersRadio: null,
            GroupsRadio: null,
            Groups: params.Groups,
            GroupTypes: null,
            NodesList: null,
            UserSelect: null,
            SelectedNodes: null,
            SelectedNodeTypes: null
        };

        var groupTypeIds = {};
        (this.Objects.Groups || []).forEach(g => (groupTypeIds[g.NodeTypeID] = g));

        this.Objects.GroupTypes = Object.keys(groupTypeIds).map(key => ({
            NodeTypeID: key,
            NodeType: Base64.decode(groupTypeIds[key].NodeType || groupTypeIds[key].TypeName)
        }));
        
        this.Options = {
            MultiSelect: !!params.MultiSelect,
            AdminMode: !!params.AdminMode,
            NodeTypesSelectable: !!params.NodeTypesSelectable,
            NodeTypesMultiSelect: !!params.NodeTypesMultiSelect,
            GroupsSelectable: (params.GroupsSelectable !== false) && (params.AdminMode || (params.Groups || []).length),
            UsersSelectable: !!params.UsersSelectable
        };

        var that = this;

        GlobalUtilities.load_files([
            "API/CNAPI.js",
            "API/UsersAPI.js",
            (this.Options.AdminMode && this.Options.GroupsSelectable ? "Ontology/NodeSelect.js" : null),
            (this.Options.UsersSelectable && this.Options.MultiSelect ? "SingleDataContainer/NewSingleDataContainer.js" : null)
        ], { OnLoad: () => that.initialize() });
    };

    ReportGroupSelect.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var radioName = GlobalUtilities.random_str(10);
            var usersId = GlobalUtilities.random_str(20);
            var groupsId = GlobalUtilities.random_str(20);
            var usersRadioName = usersId + "_radio";
            var groupsRadioName = groupsId + "_radio";

            var radio_section = function (options) {
                return {
                    Type: "div", Style: "display:flex; flex-flow:row; margin-bottom:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "input", Name: options.RadioName,
                                Attributes: [
                                    { Name: "type", Value: "radio" },
                                    { Name: "name", Value: radioName },
                                    { Name: "value", Value: (options || {}).Value },
                                    (!(options || {}).Selected ? null : { Name: "checked", Value: true })
                                ],
                                Properties: [{ Name: "onchange", Value: function () { options.OnChange(this.checked); } }]
                            }]
                        },
                        {
                            Type: "div", Style: "flex:0 0 auto;",
                            Properties: [{ Name: "onclick", Value: () => jQuery(elems[options.RadioName]).click() }],
                            Childs: [{ Type: "text", TextValue: (options || {}).Title }]
                        }
                    ]
                };
            };

            var show = function (id) {
                jQuery("#" + id + " *").attr("disabled", false).on('click').css({ 'pointer-events': '', 'opacity': 1 });
            };

            var hide = function (id) {
                jQuery("#" + id + " *").attr("disabled", "disabled").off('click').css({ 'pointer-events': 'none', 'opacity': 0.8 });
            };

            var coupleMode = that.Options.GroupsSelectable && that.Options.UsersSelectable;

            var elems = GlobalUtilities.create_nested_elements([
                (!coupleMode ? null : radio_section({
                    Title: that.Options.MultiSelect ? RVDic.BasedOnUsers : RVDic.BasedOnUser,
                    Value: "Users", Selected: true,
                    RadioName: usersRadioName,
                    OnChange: () => (show(usersId), hide(groupsId))
                })),
                (!that.Options.UsersSelectable ? null : {
                    Type: "div", ID: usersId, Class: "small-12 medium-10 large-7",
                    Style: (coupleMode ? "margin-bottom:1rem; display:flex; flex-flow:row; padding-" + RV_Float + ":2rem;" : ""),
                    Childs: [
                        (!coupleMode ? null : {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{
                                Type: "text",
                                TextValue: RVDic.SelectN.replace("[n]", that.Options.MultiSelect ? RVDic.Users : RVDic.User) + ":"
                            }]
                        }),
                        { Type: "div", Style: "flex:1 1 auto;", Name: "users" }
                    ]
                }),
                (!coupleMode ? null : radio_section({
                    Title: that.Options.MultiSelect ? RVDic.BasedOnGroups : RVDic.BasedOnGroup,
                    Value: "Groups",
                    RadioName: groupsRadioName,
                    OnChange: () => (show(groupsId), hide(usersId))
                })),
                (!that.Options.GroupsSelectable ? null : {
                    Type: "div", ID: groupsId, Class: "small-12 medium-12 large-12",
                    Style: (coupleMode ? "margin-bottom:1rem; display:flex; flex-flow:row; padding-" + RV_Float + ":2rem;" : ""),
                    Childs: [
                        (!coupleMode ? null : {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{
                                Type: "text",
                                TextValue: RVDic.SelectN.replace("[n]", that.Options.MultiSelect ? RVDic.Groups : RVDic.Group) + ":"
                            }]
                        }),
                        { Type: "div", Style: "flex:1 1 auto;", Name: "nodes" }
                    ]
                })
            ], that.Container);

            if (coupleMode) setTimeout(() => hide(groupsId), 100);

            that.Objects.UsersRadio = elems[usersRadioName];
            that.Objects.GroupsRadio = elems[groupsRadioName];

            that.Interface.Nodes = elems["nodes"];

            if (that.Options.UsersSelectable && that.Options.AdminMode) {
                var userSelectOptions = {
                    InputClass: "rv-input",
                    InputStyle: "width:100%; font-size:0.7rem;",
                    InnerTitle: RVDic.UserSelect + "...",
                    NoButtons: true,
                    AjaxDataSource: UsersAPI.GetUsersDataSource(),
                    ResponseParser: function (responseText) {
                        return ((GlobalUtilities.to_json(responseText) || {}).Users || [])
                            .map(u => {
                                var fullname = Base64.decode(u.FullName) ||
                                    (Base64.decode(u.FirstName) + " " + Base64.decode(u.LastName));
                                return [fullname + (RVGlobal.HideUserNames ? "" : " - " + Base64.decode(u.UserName)), u.UserID];
                            });
                    }
                };

                that.Objects.UserSelect = that.Options.MultiSelect ?
                    new NewSingleDataContainer(elems["users"], userSelectOptions) :
                    GlobalUtilities.append_autosuggest(elems["users"], userSelectOptions);
            }
            else if (that.Options.UsersSelectable) {
                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "rv-air-button rv-border-radius-quarter", Style: "display:inline-block; cursor:default;",
                    Childs: [
                        {
                            Type: "img", Class: "rv-circle", Style: "width:1.2rem; height:1.2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Attributes: [{ Name: "src", Value: RVGlobal.CurrentUser.ProfileImageURL || RVGlobal.CurrentUser.ImageURL }]
                        },
                        { Type: "text", TextValue: Base64.decode(RVGlobal.CurrentUser.FullName) }
                    ]
                }], elems["users"]);
            }

            if (that.Options.GroupsSelectable)
                that.init_select_button(elems["nodes"]);
        },

        init_select_button: function (container) {
            var that = this;

            var isGroupAdmin = (that.Objects.Groups || []).length;

            var menuButton = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "selectButton",
                Style: "display:inline-block; margin-bottom:0.3rem; margin-" + RV_RevFloat + ":0.6rem;", 
                Childs: [
                    { Type: "text", TextValue: RVDic.Select },
                    (!isGroupAdmin ? null : {
                        Type: "i", Class: "fa fa-chevron-down", Style: "margin-" + RV_Float + ":0.3rem;"
                    })
                ]
            }], container)["selectButton"];

            that.Interface.SelectButton = menuButton;

            if (!isGroupAdmin && that.Options.AdminMode)
                menuButton.onclick = () => that.select_nodes();
            else {
                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "rv-trim-vertical-margins", Name: "_div",
                    Childs: (that.Objects.Groups || []).map(grp => {
                        return {
                            Type: "div", Class: "rv-border-radius-quarter rv-bg-color-softer-soft SoftShadow",
                            Style: "padding:0.3rem; margin-bottom:0.5rem; cursor:pointer;",
                            Properties: [{
                                Name: "onclick",
                                Value: () => {
                                    that.add_node(GlobalUtilities.extend({}, grp, {
                                        Name: Base64.decode(grp.Name),
                                        NodeType: Base64.decode(grp.NodeType)
                                    }));

                                    //popupMenu.Reposition();
                                    popupMenu.Hide();
                                }
                            }],
                            Childs: [
                                { Type: "text", TextValue: Base64.decode(grp.Name) },
                                (!grp.NodeType ? null : {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:inline-block; font-size:0.6rem; margin-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(grp.NodeType) }]
                                })
                            ]
                        };
                    }).concat([(!that.Options.AdminMode ? null : {
                        Type: "div", Class: "rv-link", Style: "text-align:center; margin-top:1rem; font-size:0.7rem;",
                        Properties: [{
                            Name: "onclick",
                            Value: () => {
                                that.select_nodes();
                                popupMenu.Hide();
                            }
                        }],
                        Childs: [{ Type: "text", TextValue: RVDic.ShowAll }]
                    })])
                }]);

                var menu = elems["_div"];

                var popupMenu = null;
                var ebmoObj = null;

                var _init_mouse_over = function () {
                    popupMenu = GlobalUtilities.popup_menu(menuButton, menu, {
                        Align: "bottom", Style: "background-color:white; border-color:rgb(200,200,200);"
                    });

                    ebmoObj = GlobalUtilities.enable_by_mouse_over(menuButton, popupMenu.Container, {
                        Started: true, Delay: 100,
                        OnStart: function (d) { popupMenu.Show(d); }, OnEnd: function (d) { popupMenu.Hide(d); }
                    });
                }

                menuButton.onmouseover = function () { this.onmouseover = null; _init_mouse_over(); }
            }
        },

        select_nodes: function () {
            var that = this;

            if (that.__NodeListContainer) {
                that.__ShowedNodeList = GlobalUtilities.show(that.__NodeListContainer);

                if (that.Objects.NodesList) {
                    that.Objects.NodesList.clear();
                    (that.Objects.SelectedNodes || []).forEach(nd => that.Objects.NodesList.add_item(nd));
                }

                return;
            }

            var _div = that.__NodeListContainer = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }])["_div"];

            that.__ShowedNodeList = GlobalUtilities.show(_div);
            GlobalUtilities.loading(_div);

            var on_select = (selectedNodes, selectedNodeTypes) => {
                that.Objects.SelectedNodes = selectedNodes;
                that.Objects.SelectedNodeTypes = !(that.Objects.SelectedNodes || []).length ? selectedNodeTypes : null;
                that.rebuild_nodes();
            };

            var _init_node_select = function (nodeTypesArray) {
                if (!nodeTypesArray.length) {
                    _div.innerHTML = "<div style='text-align:center; font-size:1.2rem; font-weight:bold; padding:2rem 0; color:rgb(100,100,100);'>" +
                        RVDic.MSG.CannotFindAnyGroups + "</div>";
                    return;
                };

                that.Objects.NodesList = new NodeSelect(_div, {
                    Options: {
                        Title: RVDic.NodeSelect,
                        NodeTypeSearchBox: false,
                        TreeCheckbox: that.Options.MultiSelect,
                        HideSelectedItems: !that.Options.MultiSelect,
                        NodeTypesSelectable: that.Options.NodeTypesSelectable,
                        NodeTypesMultiSelect: !!that.Options.NodeTypesMultiSelect,
                        Limits: { NodeTypes: nodeTypesArray },
                        ShowBottomBar: that.Options.MultiSelect,
                        OnSelect: (that.Options.MultiSelect ? null : function (node) {
                            that.__ShowedNodeList.Close();
                            on_select([node]);
                        }),
                        OnConfirm: function () {
                            that.__ShowedNodeList.Close();
                            var sNodes = that.Objects.NodesList.get_items({ Check: true }) || [];
                            var sNodeTypes = that.Objects.NodesList.get_node_types(true) || [];
                            on_select(sNodes, sNodeTypes);
                        },
                        OnCancel: function () { that.__ShowedNodeList.Close(); }
                    }
                });

                (that.Objects.SelectedNodes || []).forEach(nd => that.Objects.NodesList.add_item(nd));
            };

            if ((that.Objects.GroupTypes || []).length)
                _init_node_select(that.Objects.GroupTypes);
            else {
                CNAPI.GetNodeTypes({
                    Extensions: ["Group", "Members", "Experts"].join(","), ParseResults: true,
                    ResponseHandler: result => _init_node_select((result || {}).NodeTypes || [])
                });
            }
        },

        rebuild_nodes: function () {
            var that = this;

            that.Interface.Nodes.innerHTML = "";

            var arr = (that.Objects.SelectedNodes || []).map(nd => GlobalUtilities.extend({}, nd, { IsNode: true }))
                .concat((that.Objects.SelectedNodeTypes || []).map(nt => GlobalUtilities.extend({}, nt, { IsNodeType: true })));

            var elems = GlobalUtilities.create_nested_elements(arr.map(nd => {
                var elemName = (nd.NodeID || nd.NodeTypeID).replace("-", "");

                return {
                    Type: "div", Name: elemName,
                    Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                    Style: "display:inline-block; padding:0.3rem 0.5rem;" +
                        "margin-bottom:0.3rem; margin-" + RV_RevFloat + ":0.6rem;",
                    Childs: [{
                        Type: "div", Style: "display:flex; align-items:center;",
                        Childs: [
                            { Type: "text", TextValue: nd.IsNode ? nd.Name : nd.NodeType },
                            {
                                Type: "i", Class: "fa fa-times rv-icon-button",
                                Style: "margin-" + RV_Float + ":0.5rem;", 
                                Properties: [{
                                    Name: "onclick",
                                    Value: (e) => {
                                        e.stopPropagation();
                                        jQuery(elems[elemName]).fadeOut(500, () => jQuery(elems[elemName]).remove());

                                        if (nd.IsNode) {
                                            that.Objects.SelectedNodes =
                                                that.Objects.SelectedNodes.filter(x => x.NodeID != nd.NodeID);
                                        }
                                        else {
                                            that.Objects.SelectedNodeTypes =
                                                that.Objects.SelectedNodeTypes.filter(x => x.NodeTypeID != nd.NodeTypeID);
                                        }
                                    }
                                }]
                            }
                        ]
                    }]
                };
            }), that.Interface.Nodes);

            that.Interface.Nodes.appendChild(that.Interface.SelectButton);
        },

        set_node_type: function (nodeTypeId, name) {
            var that = this;
            if (that.Objects.NodeTypeSelect) that.Objects.NodeTypeSelect.set_item(nodeTypeId, name);
        },

        add_node: function (nodes) {
            var that = this;

            that.Objects.SelectedNodes = that.Objects.SelectedNodes || [];

            if (GlobalUtilities.get_type(nodes) != "array") nodes = [nodes];

            nodes.filter(nd => !!(nd || {}).NodeID && !(that.Objects.SelectedNodes || []).some(x => x.NodeID == nd.NodeID))
                .forEach(nd => {
                    if (that.Options.MultiSelect)
                        that.Objects.SelectedNodes.push(nd);
                    else that.Objects.SelectedNodes = [nd];
                });

            that.rebuild_nodes();
        },

        get_items: function () {
            var that = this;

            var retVal = {};

            if (that.Options.GroupsSelectable && (!that.Options.UsersSelectable || (that.Objects.GroupsRadio || {}).checked)) {
                retVal = {
                    Nodes: that.Objects.SelectedNodes || [],
                    NodeTypes: that.Objects.SelectedNodeTypes || []
                };
            }

            if (that.Options.UsersSelectable && (!that.Options.GroupsSelectable || (that.Objects.UsersRadio || {}).checked)) {
                if (that.Options.MultiSelect && that.Options.AdminMode)
                    retVal.Users = that.Objects.UserSelect.get_items().map(u => ({ UserID: u.ID, FullName: u.Title }));
                else if (that.Options.AdminMode) {
                    var index = that.Objects.UserSelect.selectedIndex;

                    retVal.Users = [{
                        UserID: index < 0 ? "" : that.Objects.UserSelect.values[index],
                        FullName: index < 0 ? "" : that.Objects.UserSelect.keywords[index]
                    }].filter(u => !!u.UserID);
                }
                else retVal.Users = [RVGlobal.CurrentUser].map(u => ({
                    UserID: u.UserID,
                    FullName: Base64.decode(u.FullName)
                }));
            }

            return retVal;
        },

        clear: function () {
            var that = this;

            if ((that.Objects.UserSelect || {}).clear) that.Objects.UserSelect.clear();
            else if ((that.Objects.UserSelect || {}).empty) that.Objects.UserSelect.empty();

            that.Objects.SelectedNodes = [];
            that.Objects.SelectedNodeTypes = [];

            that.rebuild_nodes();
        }
    };
})();