(function () {
    if (window.AdminAreaSelect) return;

    window.AdminAreaSelect = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) {
            this.ContainerDiv = document.createElement("div");
            this.IsDialog = true;
        }
        params = params || {};

        this.Interface = {
            ItemsArea: null
        };

        this.Objects = {
            NodeID: params.NodeID,
            NodeTypeID: params.NodeTypeID,
            AdminType: params.AdminType,
            CreatorUserID: params.CreatorUserID,
            Dialog: null
        };

        this.Options = {
            OnSelect: params.OnSelect,
            OnCancel: params.OnCancel,
            OnNodesGet: params.OnNodesGet,
            OnSingleNodeFound: params.OnSingleNodeFound,
            SelectConfirmation: params.Confirmation !== false
        };

        var that = this;
        
        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(); } });
    }

    AdminAreaSelect.prototype = {
        show: function () {
            var that = this;
            
            if (!that.IsDialog) return;
            
            that.Objects.Dialog = GlobalUtilities.dialog(that.ContainerDiv, RVDic.AdminAreaSelect, {
                Width: 480,
                OnEscape: function () { that.cancel(); }
            });
        },

        cancel: function () {
            if (this.Objects.Dialog) this.Objects.Dialog.Close();
            if (this.Options.OnCancel) this.Options.OnCancel();
        },

        _initialize: function () {
            var that = this;
            
            if ((that.Objects.AdminType == "AreaAdmin") || (that.Objects.AdminType == "ComplexAdmin")) {
                CNAPI.GetAdminAreaLimits({
                    NodeTypeID: that.Objects.NodeTypeID, NodeID: that.Objects.NodeID, ParseResults: true,
                    ResponseHandler: function (result) {
                        var nodeTypes = result.NodeTypes || [];
                        that._get_user_areas(nodeTypes);
                    }
                });
            }
            else if (that.Options.OnNodesGet) that.Options.OnNodesGet(true); //there is no need to select admin area
        },

        _init_interface: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin-bottom:1rem; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: RVDic.PleaseSelectAdminArea }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "itemsArea" },
                {
                    Type: "div", Class: "AppButton",
                    Style: "width:6rem; text-align:center; margin:1rem auto 0rem auto; font-weight:bold;" +
                        (that.IsDialog ? "" : "display:none"),
                    Properties: [{ Name: "onclick", Value: function () { that.cancel(); } }],
                    Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];
        },

        _get_user_areas: function (nodeTypes) {
            var that = this;

            var ntIds = [];
            for (var i = 0, lnt = (nodeTypes || []).length; i < lnt; ++i) ntIds.push(nodeTypes[i].NodeTypeID);
            
            var _add_node_type = function (container, nodeType) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                        Style: "text-align:center; margin:0.3rem 0rem; padding:0.3rem;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(nodeType.Name || "") }]
                    }
                ], container);
            };

            CNAPI.GetMemberNodes({
                NodeTypeIDs: ntIds.join('|'), UserID: that.Objects.CreatorUserID, ParseResults: true,
                ResponseHandler: function (result) {
                    var nodes = result.Nodes || [];

                    for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                        nodes[i].Name = Base64.decode(nodes[i].Name || "");
                        nodes[i].NodeType = Base64.decode(nodes[i].NodeType || "");
                    }

                    if (that.Options.OnNodesGet) that.Options.OnNodesGet(nodes);

                    if (nodes.length == 0) {
                        //At least one membership area must be set
                        if (nodeTypes.length == 0) {
                            alert(RVDic.MSG.YouMustBeMemberInAtListOneGroup);
                            that.cancel();
                        }
                        else {
                            var elems = GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.MSG.YouMustBeMemberInAtListOneGroupOfThisTypes }]
                                        },
                                        {Type: "div", Class: "small-12 medium-12 large-12", Name: "_div"}
                                    ]
                                }
                            ]);

                            var showed = GlobalUtilities.show(elems["container"]);

                            that.cancel();

                            for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                                _add_node_type(elems["_div"], nodeTypes[i]);
                        }
                    }
                    else if (nodes.length == 1) {
                        that._select(nodes[0], true);
                        if (that.Options.OnSingleNodeFound) that.Options.OnSingleNodeFound();
                    }
                    else {
                        that._init_interface();

                        for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                            that._add_node(nodes[i]);
                        that.show();
                    }
                }
            });
        },

        _add_node: function (node) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", 
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                    Style: "position:relative; margin:0.5rem 0rem; padding:0.5rem; padding-" + RV_RevFloat + ":6rem; cursor:pointer;",
                    Properties: [{ Name: "onclick", Value: function () { that._select(node); } }],
                    Childs: [
                        {
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                            Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.5rem; font-size:0.7rem;",
                            Link: CNAPI.NodePageURL({ NodeID: node.NodeID }),
                            Childs: [{ Type: "text", TextValue: RVDic.ShowPage }]
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: node.Name }]
                        },
                        {
                            Type: "div", Class: "rv-air-button-base rv-white-button rv-border-radius-quarter SoftBorder",
                            Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: node.NodeType }]
                        }
                    ]
                }
            ], that.Interface.ItemsArea);
        },

        _select: function (node, force) {
            var that = this;

            if (force || !that.Options.SelectConfirmation) return that.set(node);

            GlobalUtilities.confirm(RVDic.CN.DoYouWantToSelectNOfTypeM.replace("[n]", "'" + node.Name + "'").replace("[m]", node.NodeType), function (r) {
                if (!r) that.show();
                else that.set(node);
            });
        },

        set: function (node) {
            var that = this;

            if (!that.Objects.NodeID) return that.Options.OnSelect ? that.Options.OnSelect(node) : null;

            if (that.__Saving) return;
            that.__Saving = true;
            
            CNAPI.SetAdminArea({
                NodeID: that.Objects.NodeID, AreaID: node.NodeID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText)
                        alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else {
                        if (that.Options.OnSelect) that.Options.OnSelect(node);
                        if (that.Objects.Dialog) that.Objects.Dialog.Close();
                    }

                    that.__Saving = false;
                }
            });
        }
    }
})();