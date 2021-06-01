(function () {
    if (window.ShareDialog) return;
    
    window.ShareDialog = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (this.Container == null) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID,
            Post: params.Post,
            SelectedDestination: null,
            PrivacySelect: null
        };

        this.Options = {
            Done: params.Done
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js", "Ontology/NodeSelect.js", "USR/UserSelect.js"], {
            OnLoad: function () { that.preinit(); }
        });
    };

    ShareDialog.prototype = {
        preinit: function () {
            var that = this;

            CNAPI.GetNodeTypes({
                Extensions: "Posts", ParseResults: true,
                ResponseHandler: function (result) {
                    that.initialize(result.NodeTypes);
                }
            });
        },

        initialize: function (nodeTypes) {
            var that = this;

            that.Container.innerHTML = "";
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; font-size:1rem; margin-bottom:1rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.Share }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "text", Style: "margin-bottom:1rem;" },
                { Type: "header", Class: "small-12 medium-12 large-12", Params: { Title: RVDic.ShareWith + ":" } },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "selectedArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0;", Name: "selectArea",
                    Childs: [
                        { Name: "nodeSelect", Title: RVDic.NodeSelect },
                        { Name: "userSelect", Title: RVDic.UserSelect }
                    ].map(function (itm) {
                        return {
                            Type: "div", Class: "small-6 medium-6 large-6", Style: "padding:0.5rem;",
                            Childs: [{
                                Type: "div", Name: itm.Name,
                                Class: "small-12 medium-12 large-12 rv-border-radius-half rv-air-button",
                                Style: "display:flex; align-items:center; justify-content:center; padding:1rem;",
                                Childs: [{ Type: "text", TextValue: itm.Title }]
                            }]
                        };
                    })
                },
                {
                    Type: "div", Class: "small-6 medium-5 large-4 ActionButton", 
                    Style: "margin:1rem auto 0 auto;", Name: "confirmButton",
                    Childs: [{Type: "text", TextValue: RVDic.Confirm}]
                }
            ], that.Container);

            var textInput =  new AdvancedTextArea({
                ContainerDiv: elems["text"],
                DefaultText: RVDic.Description + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            var set_selected_distination = function (item) {
                that.Objects.SelectedDestination = item;
                that.Objects.PrivacySelect = null;

                jQuery(item ? elems["selectArea"] : elems["selectedArea"]).fadeOut(500, function () {
                    elems["selectedArea"].innerHTML = "";

                    if (item) {
                        var sElems = GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                            Style: "display:flex; flex-flow:row; align-items:center; border-width:2px;" +
                                "border-color:rgb(200,200,200); padding:0.3rem; background-color:white;",
                            Childs: [
                                {
                                    Type: "div", Style: "flex:0 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{
                                        Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                        Attributes: [{ Name: "aria-hidden", Value: true }],
                                        Properties: [{ Name: "onclick", Value: function () { set_selected_distination(null); } }]
                                    }]
                                },
                                ((item || {}).NodeID ? null : {
                                    Type: "div", Style: "flex:0 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{
                                        Type: "img", Class: "rv-border-radius-quarter", Style: "width:1.5rem; height:1.5rem;",
                                        Attributes: [{ Name: "src", Value: item.ImageURL }]
                                    }]
                                }),
                                {
                                    Type: "div", Style: "flex:1 1 auto;",
                                    Childs: [
                                        { Type: "text", TextValue: item.Name || item.FullName },
                                        (!item.NodeType ? null : {
                                            Type: "label", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                            Style: "margin-" + RV_Float + ":0.5rem; font-size:0.6rem; padding:0.1rem 0.3rem; cursor:default;",
                                            Childs: [{ Type: "text", TextValue: item.NodeType }]
                                        }),
                                        (!item.AdditionalID && !item.UserName ? null : {
                                            Type: "label", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                            Style: "margin-" + RV_Float + ":0.5rem; font-size:0.6rem; padding:0.1rem 0.3rem; cursor:default;",
                                            Childs: [{ Type: "text", TextValue: item.AdditionalID || item.UserName }]
                                        })
                                    ]
                                },
                                ((item || {}).NodeID ? null : {
                                    Type: "div", Style: "flex:0 1 auto; padding-" + RV_Float + ":1rem;",
                                    Childs: [{
                                        Type: "select", Class: "rv-input SoftBackgroundColor", Name: "privacySelect",
                                        Style: "width:6rem; font-size:0.7rem; border-width:0; border-" + RV_Float + "-width:3px; border-color:white;",
                                        Childs: [
                                            {
                                                Type: "option", Attributes: [{ Name: "title", Value: "Public" }],
                                                Childs: [{ Type: "text", TextValue: RVDic.Public }]
                                            },
                                            {
                                                Type: "option", Attributes: [{ Name: "title", Value: "Friends" }],
                                                Childs: [{ Type: "text", TextValue: RVDic.Friends }]
                                            }
                                        ]
                                    }]
                                })
                            ]
                        }], elems["selectedArea"]);

                        that.Objects.PrivacySelect = sElems["privacySelect"];
                    }

                    jQuery(item ? elems["selectedArea"] : elems["selectArea"]).fadeIn(500);
                });
            };

            elems["nodeSelect"].onclick = function () {
                that.node_select(nodeTypes, function (node) { set_selected_distination(node); });
            };

            elems["userSelect"].onclick = function () {
                that.user_select(function (user) { set_selected_distination(user); });
            };

            var processing = false;

            elems["confirmButton"].onclick = function () {
                if (processing) return;
                
                var destId = (that.Objects.SelectedDestination || {}).NodeID || (that.Objects.SelectedDestination || {}).UserID;
                
                if (!destId) return alert(RVDic.Checks.PleaseSelectTheSharingDestination);
                else if (destId == that.Objects.OwnerID) alert(RVDic.Checks.YouCannotShareWithTheSamePage);
                
                processing = true;

                var desc = GlobalUtilities.trim(textInput.get_data());
                var isNode = !!(that.Objects.SelectedDestination || {}).NodeID;

                var privacy = !that.Objects.PrivacySelect || isNode ? "Public" :
                    that.Objects.PrivacySelect[that.Objects.PrivacySelect.selectedIndex].title;

                SharingAPI.Share({
                    PostID: that.Objects.Post.PostID,
                    OwnerID: destId,
                    Description: Base64.encode(desc),
                    Privacy: privacy,
                    OwnerType: (isNode ? "Node" : "User"), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            if (GlobalUtilities.get_type(that.Options.Done) == "function") that.Options.Done(true);
                        }

                        processing = false;
                    }
                });
            };
        },

        node_select: function (nodeTypes, onSelect) {
            var that = this;

            if (that.__NodeListContainer) {
                that.__NodeListContainer.Showed = GlobalUtilities.show(that.__NodeListContainer);
                return;
            }

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-10 large-9 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }]);

            that.__NodeListContainer = elems["_div"];

            GlobalUtilities.loading(elems["_div"]);
            that.__NodeListContainer.Showed = GlobalUtilities.show(elems["_div"]);

            var ns = new NodeSelect(elems["_div"], {
                Options: {
                    Title: RVDic.NodeSelect,
                    NodeTypeSearchBox: true,
                    TreeCheckbox: false,
                    HideSelectedItems: true,
                    Filters: true,
                    FilterNames: ["MyGroups", "MyExpertiseDomains", "MyIntellectualProperties"],
                    IgnoreAllFilter: true,
                    ShowBottomBar: false,
                    DataRequestOptions: function (p, callback) {
                        callback({ NodeTypeIDs: (nodeTypes || []).map(function (nt) { return nt.NodeTypeID; }).join("|") });
                    },
                    OnSelect: function (node) {
                        that.__NodeListContainer.Showed.Close();
                        onSelect(node);
                    },
                    OnConfirm: function () {
                        that.__NodeListContainer.Showed.Close();

                        jQuery.each(ns.get_items({ Check: true }) || [], function (ind, val) {
                            onSelect(val);
                        });
                    },
                    OnCancel: function () { that.__NodeListContainer.Showed.Close(); }
                }
            });
        },

        user_select: function (onSelect) {
            var that = this;

            if (that.__UserListContainer) {
                that.__UserListContainer.Showed = GlobalUtilities.show(that.__UserListContainer);
                return;
            }

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-9 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }]);

            that.__UserListContainer = elems["_div"];

            GlobalUtilities.loading(elems["_div"]);
            that.__UserListContainer.Showed = GlobalUtilities.show(elems["_div"]);

            var us = new UserSelect(elems["_div"], {
                Options: {
                    HideSelectedItems: true,
                    OnSelect: function (user) {
                        that.__UserListContainer.Showed.Close();
                        onSelect(user);
                    }
                }
            });
        }
    }
})();