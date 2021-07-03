(function () {
    if (window.DocumentTreesManager) return;

    window.DocumentTreesManager = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            Trees: null,
            ArchiveCheckbox: null
        };

        var that = this;

        GlobalUtilities.load_files(["API/DocsAPI.js", "Public/NameDialog.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    DocumentTreesManager.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_RevFloat + ":10rem;",
                    Childs: [
                        {
                            Type: "div", Class: "RevTextAlign RevDirection",
                            Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":1rem;",
                            Childs: [
                                {
                                    Type: "bottom", Class: "TextAlign Direction",
                                    Style: "display:inline-block; margin-bottom:0.5rem;",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "archiveChb", Params: { OnChange: function () { that.show_trees(this.Checked); } },
                                            Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;"
                                        },
                                        { Type: "text", TextValue: RVDic.ShowRemovedItems }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "display:flex; flex-flow:row; align-items:center; font-weight:bold; margin-bottom:1rem;" +
                                "font-size:1.2rem; color:rgb(100,100,100);",
                            Childs: [
                                { Type: "text", TextValue: RVDic.DocumentTrees },
                                { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_documenttrees" } }
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "trees" }
            ], that.Container);

            that.Interface.Trees = elems["trees"];

            that.show_trees(false);
        },

        show_trees: function (archive) {
            var that = this;

            that.Interface.Trees.innerHTML = "";
            GlobalUtilities.loading(that.Interface.Trees);

            DocsAPI.GetTrees({
                Archive: archive, ParseResults: true,
                ResponseHandler: function (result) {
                    that.Interface.Trees.innerHTML = "";

                    var elems = GlobalUtilities.create_nested_elements([
                        { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "container" }
                    ], that.Interface.Trees);

                    if(!archive) that.new_item(elems["container"]);

                    jQuery.each((result || {}).Trees || [], function (ind, val) {
                        that.add_item(elems["container"], val, false, archive);
                    });
                }
            });
        },

        new_item: function (container) {
            var that = this;

            var btn = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "height:100%; font-size:1.2rem;", Name: "btn",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half rv-air-button",
                            Childs: [
                                {
                                    Type: "middle", Style: "display:inline-block;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-plus-circle fa-lg",
                                            Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.NewN.replace("[n]", RVDic.Tree) }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container)["btn"];

            var saving = false;

            btn.onclick = function () {
                if (saving) return;
                saving = true;

                new NameDialog({
                    Title: RVDic.Name, InnerTitle: RVDic.Name,
                    OnActionCall: function (name, callback) {
                        if (!name) return callback(!(saving = false));

                        DocsAPI.CreateTree({
                            Title: Base64.encode(name), ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.TreeID) that.add_item(container, {
                                    ID: result.TreeID, Title: Base64.encode(name)
                                }, true, false);

                                callback(!!(result || {}).TreeID);

                                saving = false;
                            }
                        });
                    }
                });
            };
        },

        add_item: function (container, item, add2top, archive) {
            var that = this;

            var id = item.ID;

            var action_button = function (p, size) {
                p = p || {};

                return {
                    Type: "div", Style: "padding:0rem 0.25rem;",
                    Class: "small-" + size + " medium-" + size + " large-" + size, 
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle", Name: p.Name,
                            Childs: [
                                {
                                    Type: "i", Class: "fa " + p.Icon, Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: p.Title }
                            ]
                        }
                    ]
                };
            };
            
            var create_buttons = function (btns) {
                btns = btns.filter(function (val) { return !!val; });
                var size = btns.length == 2 ? "6" : (btns.length == 3 ? "4" : "12");
                return btns.map(function (val) { return action_button(val, size); });
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4",
                    Style: "padding:0.5rem; opacity:0;", Name: "container",
                    Childs: [
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-softer-soft",
                            Style: "position:relative; height:100%; padding:0.4rem; padding-bottom:3.5rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-border-radius-quarter",
                                    Style: "position:absolute; bottom:0.5rem; left:0.5rem; right:0.5rem;" +
                                        "padding:0.3rem; background-color:white;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                                            Childs: create_buttons([
                                                { Name: "rename", Title: RVDic.Rename, Icon: "fa-i-cursor" },
                                                (archive ? null : { Name: "edit", Title: RVDic.Edit, Icon: "fa-pencil" }),
                                                {
                                                    Name: "remove", Title: archive ? RVDic.Recycle : RVDic.Remove,
                                                    Icon: archive ? "fa-recycle" : "fa-times"
                                                }
                                            ])
                                        }
                                    ]
                                },
                                {
                                    Type: "middle", Style: "display:inline-block; font-size:1rem;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.Title), Name: "treeName" }]
                                }
                            ]
                        }
                    ]
                }
            ]);
            
            if (!add2top) container.appendChild(elems["container"]);
            else container.insertBefore(elems["container"], (container.firstChild || {}).nextSibling);

            jQuery(elems["container"]).animate({ opacity: 1 }, 500);

            elems["rename"].onclick = function () {
                that.rename(item, function (name) {
                    item.Title = Base64.encode(name);
                    elems["treeName"].data = GlobalUtilities.convert_numbers_to_persian(name);
                });
            };

            if (elems["edit"]) elems["edit"].onclick = function () { that.edit(item); }
            
            elems["remove"].onclick = function () {
                that.remove_recycle(item, archive, function () {
                    jQuery(elems["container"]).fadeOut(500, function () { jQuery(elems["container"]).remove(); });
                });
            };
        },

        rename: function (item, done) {
            var that = this;

            if (that.SavingName) return;
            that.SavingName = true;
            
            new NameDialog({
                Title: RVDic.NewN.replace("[n]", RVDic.Name), InitialValue: Base64.decode(item.Title), InnerTitle: RVDic.Name,
                OnActionCall: function (name, callback) {
                    if (!name) return callback(!(that.SavingName = false));

                    DocsAPI.RenameTree({
                        TreeID: item.ID, Title: Base64.encode(name), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) done(name);

                            callback(!!(result || {}).Succeed);

                            that.SavingName = false;
                        }
                    });
                }
            });
        },

        edit: function (item) {
            var that = this;

            that.TreeManagers = that.TreeManagers || [];

            if (that.TreeManagers[item.ID]) return GlobalUtilities.show(that.TreeManagers[item.ID]);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; margin-bottom:1rem; font-size:1.2rem; color:rgb(100,100,100); text-align:center;",
                            Childs: [
                                { Type: "text", TextValue: Base64.decode(item.Title) },
                                { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_edittree" } }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div", Style: "overflow:hidden;" }
                    ]
                }
            ]);

            that.TreeManagers[item.ID] = elems["container"];

            GlobalUtilities.loading(elems["_div"]);
            GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files([
                { Root: "TreeViewContainer/", Ext: "js", Childs: ["TreeViewContainer", "TreeMaker"] }
            ], {
                OnLoad: function () {
                    elems["_div"].innerHTML = "";
                    
                    new TreeMaker({
                        ContainerDiv: elems["_div"],
                        FailureAlert: "Communication with server failed",
                        NewNodeDefaultTitle: RVDic.NewN.replace("[n]", RVDic.SubCategory),
                        RequestHandler: DocsAPI.DocsHandler,
                        Command: "Command", GetNodes: "GetChildNodes", CreateNode: "CreateTreeNode",
                        ChangeNode: "RenameTreeNode", MoveNode: "ChangeParent", RemoveNode: "RemoveTreeNode",
                        InitialGet: true, DeleteConfirmation: true, RemoveHierarchyConfirmation: true,
                        DeleteConfirmationAlert: RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.SubCategory),
                        TreeID: item.ID,
                        StringConstants: {
                            Nodes: "TreeNodes", NodeID: "TreeNodeID", ParentID: "ParentID",
                            Title: "Title", TreeID: "TreeID"
                        },
                        Options: {
                            AjaxLoading: true,
                            RequestParams: { TreeID: item.ID, Archive: false },
                            AjaxResponseParser: function (responseText) {
                                var result = JSON.parse(responseText);

                                var arr = [];
                                jQuery.each(result.TreeNodes || [], function (ind, val) {
                                    arr.push({ ID: val.TreeNodeID, Title: Base64.decode(val.Title), HasChild: !!val.HasChild });
                                });

                                return arr;
                            }
                        },
                        OnSort: function (sortedItems, callback) {
                            DocsAPI.SetTreeNodesOrder({
                                TreeNodeIDs: sortedItems.join('|'), ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    callback(!!result.Succeed);
                                }
                            });
                        }
                    });
                }
            });
        },

        remove_recycle: function (item, recycle, done) {
            var that = this;

            if (that.Removing) return;
            that.Removing = true;

            var msg = RVDic.Confirms[recycle ? "DoYouWantToRecycleTheN" : "DoYouWantToRemoveN"]
                .replace("[n]", "'" + Base64.decode(item.Title) + "'");

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return (that.Removing = false);

                DocsAPI[recycle ? "RecycleTree" : "RemoveTree"]({
                    TreeID: item.ID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) done();

                        that.Removing = false;
                    }
                });
            });
        }
    };
})();