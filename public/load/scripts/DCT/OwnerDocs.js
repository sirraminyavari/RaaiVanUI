(function () {
    if (window.OwnerDocs) return;

    window.OwnerDocs = function (params) {
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID,
            MainContainer: null
        };

        this.Options = {
            Editable: !!params.Editable
        };

        var that = this;
        
        GlobalUtilities.load_files(["API/DocsAPI.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    OwnerDocs.prototype = {
        initialize: function () {
            var that = this;
            
            DocsAPI.GetOwnerTrees({
                OwnerID: that.Objects.OwnerID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (((result.Trees || []).length == 1) && !that.Options.Editable) that.show_tree(result.Trees[0]);
                    else that.show_trees_list(result.Trees);
                }
            });
        },

        show: function () {
            var that = this;

            if (that.Objects.MainContainer) GlobalUtilities.show(that.Objects.MainContainer);
        },

        show_trees_list: function (trees) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.DocumentTrees }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" }
                    ]
                }
            ]);

            if (!that.Objects.MainContainer) that.Objects.MainContainer = elems["_div"];

            GlobalUtilities.show(elems["_div"]);

            if (!(trees || []).length && !that.Options.Editable) {
                elems["items"].innerHTML = "<div style='text-align:center; color:gray; font-weight:bold;'>" +
                    RVDic.MSG.NoDocumentTreeFound + "</div>";
                return;
            }

            var _add_tree = function (tree, insertBefore) {
                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-half rv-bg-color-trans-white SoftBorder", Name: "_div",
                        Style: "display:inline-block; margin:0.2rem; padding:0.2rem 0.5rem; cursor:pointer;",
                        Properties: [{ Name: "onclick", Value: function () { that.show_tree(tree); } }],
                        Childs: [
                            {
                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "remove", Tooltip: RVDic.Remove,
                                Style: "margin-" + RV_RevFloat + ":0.4rem;" + (that.Options.Editable ? "" : "display:none;"), 
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            },
                            { Type: "text", TextValue: Base64.decode(tree.Title) }
                        ]
                    }
                ]);

                if (!insertBefore) elems["items"].appendChild(_el["_div"]);
                else elems["items"].insertBefore(_el["_div"], insertBefore);

                var _processing = false;

                jQuery(_el["remove"]).click(function (e) {
                    e.stopPropagation();
                    if (_processing) true;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Tree), function (r) {
                        if (!r) return;

                        _processing = true;
                        
                        DocsAPI.RemoveTree({
                            TreeID: tree.ID, OwnerID: that.Objects.OwnerID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) jQuery(_el["_div"]).fadeOut(500, function () { this.remove(); });

                                _processing = false;
                            }
                        });
                    });
                });
            };

            for (var i = 0; i < trees.length; ++i)
                _add_tree(trees[i]);

            if (that.Options.Editable) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-half",
                        Style: "display:inline-block; margin:0.2rem; padding:0.2rem 0.5rem; cursor:pointer;",
                        Properties: [
                            {
                                Name: "onclick", Value: function () {
                                    var btn = this;
                                    that.new_tree(function (tree) { _add_tree(tree, btn); });
                                }
                            }
                        ],
                        Childs: [
                            {
                                Type: "i", Class: "fa fa-plus", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            },
                            { Type: "text", TextValue: RVDic.NewN.replace("[n]", RVDic.Tree) }
                        ]
                    }
                ], elems["items"]);
            }
        },

        new_tree: function (callback) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.MSG.ChooseOneOfTheTemplates }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["items"]);
            var showed = GlobalUtilities.show(elems["_div"]);

            var _add_template = function (tree) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-half rv-bg-color-white-softer SoftBorder",
                        Style: "display:inline-block; padding:0.5rem 1rem; margin:0.2rem; cursor:pointer;" +
                            (tree.ID ? "" : "color:maroon; font-weight:bold;"),
                        Properties: [
                            {
                                Name: "onclick",
                                Value: function () {
                                    that.create_tree(tree, function () { showed.Close(); }, callback);
                                }
                            }]
                        ,
                        Childs: [{ Type: "text", TextValue: Base64.decode(tree.Title) }]
                    }
                ], elems["items"]);
            };

            DocsAPI.GetTrees({
                ParseResults: true,
                ResponseHandler: function (result) {
                    jQuery(elems["items"]).fadeOut(0, function () {
                        elems["items"].innerHTML = "";

                        _add_template({ ID: "", Title: Base64.encode(RVDic.Empty) });

                        for (var i = 0; i < (result.Trees || []).length; ++i)
                            _add_template(result.Trees[i]);

                        jQuery(elems["items"]).fadeIn(500);
                    });
                }
            });
        },

        create_tree: function (refTree, onSelect, callback) {
            var that = this;

            var msg = RVDic.Confirms.DoYouWantToUseTheTemplateN.replace("[n]", Base64.decode(refTree.Title));

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return;
                if (onSelect) onSelect();
                that._create_tree(refTree, callback);
            });
        },

        _create_tree: function (refTree, callback) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "title",
                            Style: "text-align:center; margin-bottom:1rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "overflow:hidden;", Name: "tree"
                        }
                    ]
                }
            ]);

            var theTree = { ID: null, Title: null };

            GlobalUtilities.loading(elems["tree"]);
            GlobalUtilities.show(elems["container"], { OnClose: function () { if (theTree.ID) callback(theTree); } });

            DocsAPI.CreateTree({
                Title: refTree.Title, TemplateTreeID: refTree.ID, OwnerID: that.Objects.OwnerID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    
                    theTree.ID = result.TreeID;

                    jQuery(elems["title"]).fadeIn(500, function () {
                        that._edit_tree_set_title(elems["title"], {
                            ID: result.TreeID, Title: refTree.Title, EditMode: true
                        }, function (tre) { theTree.Title = tre.Title; });
                    });

                    GlobalUtilities.load_files([
                        "TreeViewContainer/TreeViewContainer.js",
                        "TreeViewContainer/TreeMaker.js"
                    ], { OnLoad: function () { that._edit_tree(elems["tree"], { ID: result.TreeID }); } });
                }
            });
        },

        show_tree: function (tree) {
            var that = this;

            that._Trees = that._Trees || {};
            if (that._Trees[tree.ID]) return GlobalUtilities.show(that._Trees[tree.ID]);

            var editable = that.Options.Editable;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-11 large-10 row rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(tree.Title) }]
                                },
                                {
                                    Type: "div", Class: "rv-air-button rv-circle",
                                    Style: "display:" + (editable ? "inline-block" : "none") + ";" +
                                        "margin-" + RV_Float + ":1rem; font-size:0.7rem; padding:0.2rem 1rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.edit_tree(tree); } }],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-lg",
                                            Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.Edit }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-4 large-3",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "padding:0.5rem; padding-" + RV_RevFloat + ":0.7rem; position:relative;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "rv-circle WarmBackgroundColor",
                                            Style: "position:absolute; top:0rem; " + RV_RevFloat + ":0rem; bottom:0rem;" +
                                                "padding-" + RV_RevFloat + ":0.2rem;"
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "overflow:hidden;", Name: "tree"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-8 large-9", Name: "items",
                            Style: "padding-" + RV_Float + ":1rem;"
                        }
                    ]
                }
            ]);

            if (!that.Objects.MainContainer) that.Objects.MainContainer = elems["container"];

            GlobalUtilities.show(that._Trees[tree.ID] = elems["container"]);

            that.show_tree_node_documents(elems["items"], null);

            var changingPage = false;

            DocsAPI.GetTreeNodes({
                TreeID: tree.ID, ParseResults: true,
                ResponseHandler: function (results) {
                    var nodes = results.TreeNodes || [];

                    for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                        nodes[i].ID = nodes[i].TreeNodeID || "";
                        nodes[i].Title = Base64.decode(nodes[i].Title);
                    }

                    GlobalUtilities.load_files([
                        "jQuery/jsTree/jquery.jstree.js",
                        "TreeViewContainer/TreeViewContainer.js"
                    ], {
                        LoadSequential: true,
                        OnLoad: function () {
                            var newTreeView = new TreeViewContainer(elems["tree"], {
                                Nodes: nodes, Hotkeys: false,
                                Checkbox: false, OnlyLeafCheckboxes: false, Modifiable: false,
                                OnNodeSelect: function (nd) {
                                    if (changingPage) return;
                                    changingPage = true;

                                    that.show_tree_node_documents(elems["items"], nd, function () { changingPage = false; });
                                }
                            });
                        }
                    });
                }
            });
        },

        edit_tree: function (tree) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "title",
                            Style: "text-align:center; margin-bottom:1rem;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "overflow:hidden;", Name: "tree"
                        }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["tree"]);
            GlobalUtilities.show(elems["container"]);

            that._edit_tree_set_title(elems["title"], tree, function () { });

            GlobalUtilities.load_files([
                "TreeViewContainer/TreeViewContainer.js",
                "TreeViewContainer/TreeMaker.js"
            ], { OnLoad: function () { that._edit_tree(elems["tree"], tree); } });
        },

        _edit_tree_set_title: function (container, tree, done) {
            tree = tree || {};
            var that = this;

            var title = Base64.decode(tree.Title);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Tooltip: RVDic.DoubleClickToEdit, Name: "viewArea",
                    Style: "display:inline-block; font-weight:bold; cursor:pointer;",
                    Childs: [{ Type: "text", TextValue: title }]
                },
                {
                    Type: "div", Class: "small-12 medium-10 large-8", Name: "editArea",
                    Style: "display:none; margin:0rem auto;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "titleInput",
                            Style: "width:100%; font-size:0.8rem; padding-top:0.1rem; padding-bottom:0.1rem;",
                            Attributes: [{ Name: "type", Value: "text" }]
                        }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var titleInput = elems["titleInput"];

            var _set_data = function () {
                GlobalUtilities.set_text(viewArea, GlobalUtilities.convert_numbers_to_persian(GlobalUtilities.secure_string(title)));
                titleInput.value = title;
            };

            var __Editing = false;

            var _on_edit = function () {
                var set_things = function () {
                    _set_data();

                    viewArea.style.display = __Editing ? "none" : "inline-block";
                    editArea.style.display = __Editing ? "block" : "none";

                    if (__Editing) jQuery(titleInput).focus().select();
                }

                if (__Editing === true) {
                    var newTitle = GlobalUtilities.trim(titleInput.value);
                    if (!newTitle) return;

                    GlobalUtilities.block(container);

                    DocsAPI.RenameTree({
                        TreeID: tree.ID, Title: Base64.encode(newTitle), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                tree.Title = Base64.encode(title = newTitle);
                                __Editing = false;
                                set_things();
                                done(tree);
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            } //end of _on_edit

            viewArea.ondblclick = _on_edit;
            if (!title || tree.EditMode) _on_edit();
            GlobalUtilities.set_onenter(titleInput, _on_edit);
            _set_data();
        },

        _edit_tree: function (container, tree) {
            var that = this;

            container.innerHTML = "";

            new TreeMaker({
                ContainerDiv: container, FailureAlert: "connection error",
                NewNodeDefaultTitle: RVDic.NewN.replace("[n]", RVDic.SubCategory), RequestHandler: DocsAPI.DocsHandler,
                Command: "Command", GetNodes: "GetTreeNodes",
                CreateNode: "CreateTreeNode", ChangeNode: "RenameTreeNode",
                MoveNode: "ChangeParent", RemoveNode: "RemoveTreeNode",
                InitialGet: true, DeleteConfirmation: true, RemoveHierarchyConfirmation: true, TreeID: tree.ID,
                DeleteConfirmationAlert: RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.SubCategory),
                StringConstants: {
                    Nodes: "TreeNodes", NodeID: "TreeNodeID", ParentID: "ParentID", Title: "Title", TreeID: "TreeID"
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
        },

        show_tree_node_documents: function (container, treeNode, callback) {
            var that = this;

            if (!treeNode) {
                container.innerHTML = "<div style='text-align:center;'>" + "</div>";
                return callback ? callback() : null;
            }

            that._TNDContainer = that._TNDContainer || {};

            if (that._TNDContainer[treeNode.ID]) {
                if (container.firstChild && (container.firstChild == that._TNDContainer[treeNode.ID])) return;

                return jQuery(container).fadeOut(500, function () {
                    container.innerHTML = "";
                    container.appendChild(that._TNDContainer[treeNode.ID]);
                    jQuery(container).fadeIn(500, function () { callback(); });
                });
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin:0.5rem 0.3rem; position:relative; padding-" + RV_RevFloat + ":6rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0rem",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "rv-air-button rv-circle", Name: "addButton",
                                                    Style: "display:inline-block; font-size:0.7rem; padding:0.2rem 1rem;",
                                                    Childs: [
                                                        {
                                                            Type: "i", Class: "fa fa-plus",
                                                            Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                                        },
                                                        { Type: "text", TextValue: RVDic.Add }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "path",
                                    Style: "padding:0.3rem 0rem;"
                                }
                            ]
                        },
                        {Type: "div", Class: "small-12 medium-12 large-12 row", Name: "items", Style: "margin:0rem;"}
                    ]
                }
            ]);
            
            that._TNDContainer[treeNode.ID] = elems["container"];
            var _div = elems["items"];

            GlobalUtilities.loading(_div);

            elems["addButton"].onclick = function () {
                that.add_doc(treeNode, function (docs) {
                    var docIds = [];
                    for (var i = 0, lnt = (docs || []).length; i < lnt; ++i) docIds.push(docs[i].NodeID);
                    
                    DocsAPI.AddTreeNodeContents({
                        TreeNodeID: treeNode.ID, NodeIDs: docIds.join('|'), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                            var dic = {};

                            for (var i = 0, lnt = (result.Docs || []).length; i < lnt; ++i)
                                dic[result.Docs[i].ID] = result.Docs[i];

                            for (var i = 0, lnt = (docs || []).length; i < lnt; ++i) {
                                if (dic[docs[i].ID || docs[i].NodeID])
                                    docs[i].IconURL = dic[docs[i].ID || docs[i].NodeID].IconURL;
                                _show_doc(docs[i]);
                            }
                        }
                    });
                });
            };

            //show path
            var iconName = RV_RTL ? "fa-angle-double-left" : "fa-angle-double-right";
            
            for (var i = 0, lnt = (treeNode.Path || []).length; i < lnt; ++i) {
                if (i > 0) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 0.5rem;",
                            Childs: [{ Type: "i", Class: "fa " + iconName, Attributes: [{ Name: "aria-hidden", Value: true }] }]
                        }
                    ], elems["path"]);
                }

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; color:gray;",
                        Childs: [{ Type: "text", TextValue: treeNode.Path[i].Name }]
                    }
                ], elems["path"]);
            }
            //end of show path

            jQuery(container).fadeOut(500, function () {
                container.innerHTML = "";
                container.appendChild(elems["container"]);

                jQuery(container).fadeIn(500, function () {
                    callback();

                    DocsAPI.GetTreeNodeDocs({
                        TreeNodeID: treeNode.ID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                            _div.innerHTML = "";

                            if (!(result.Docs || []).length) {
                                _div.innerHTML = "<div style='font-size:1rem; text-align:center;" +
                                    "color:rgb(100,100,100); width:100%;'>" + RVDic.NoDocumentExistsInThisPath + "</div>";
                                return;
                            }

                            for (var i = 0; i < (result.Docs || []).length; ++i)
                                _show_doc(result.Docs[i]);
                        }
                    });
                });
            });
            
            var _show_doc = function (doc) {
                if (_div.firstChild && !_div.firstChild.IsDocument) _div.innerHTML = "";

                var editable = that.Options.Editable;

                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-6", Name: "container",
                        Style: "display:none; padding:0.3rem;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder",
                                Style: "padding:0.5rem; height:100%; position:relative; min-height:3rem;" +
                                    "padding-" + RV_Float + ":3rem;" + (!editable ? "" : "padding-" + RV_RevFloat + ":2rem;"),
                                Childs: [
                                    {
                                        Type: "div",
                                        Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;" +
                                            (editable ? "" : "display:none;"),
                                        Childs: [
                                            {
                                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                                Tooltip: RVDic.Remove, Name: "removeButton",
                                                Attributes: [{ Name: "aria-hidden", Value: true }]
                                            }
                                        ]
                                    },
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12", Style: "height:100%;",
                                        Link: RVAPI.NodePageURL({ NodeID: doc.ID || doc.NodeID }),
                                        Childs: [
                                            {
                                                Type: "div",
                                                Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.5rem;",
                                                Childs: [
                                                    {
                                                        Type: "middle",
                                                        Childs: [
                                                            {
                                                                Type: "img", Class: "rv-border-radius-quarter",
                                                                Style: "width:2rem; height:2rem;",
                                                                Attributes: [{ Name: "src", Value: doc.IconURL }]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                Type: "middle", Style: "text-align:justify;",
                                                Childs: [{ Type: "text", TextValue: Base64.decode(doc.Title || doc.Name) }]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ], _div);

                var itemContainer = _el["container"];

                itemContainer.IsDocument = true;

                jQuery(itemContainer).fadeIn(500);

                var removing = false;

                _el["removeButton"].onclick = function () {
                    if (removing) return;

                    var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Document);

                    GlobalUtilities.confirm(msg, function (r) {
                        if (!r) return;

                        removing = true;

                        DocsAPI.RemoveTreeNodeContents({
                            TreeNodeID: treeNode.ID, NodeID: doc.NodeID || doc.ID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) jQuery(itemContainer).fadeOut(500, function () { this.remove(); });

                                removing = false;
                            }
                        });
                    });
                };
            };
        },

        add_doc: function (treeNode, callback) {
            var that = this;

            //to be removed
            return that.select_existing_documents(function (docs) { callback(docs); });
            //end of to be removed

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-6 large-4 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "existing",
                            Style: "margin-bottom:1rem; font-size:1.2rem; padding:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectFromExistingDocuments }]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "new",
                            Style: "font-size:1.2rem; padding:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.RegisterNewN.replace("[n]", RVDic.Document) }]
                        }
                    ]
                }
            ]);

            var showed = GlobalUtilities.show(elems["container"]);

            elems["existing"].onclick = function () {
                that.select_existing_documents(function (docs) {
                    callback(docs);
                    showed.Close();
                });
            };
        },

        select_existing_documents: function (callback) {
            var that = this;

            var nodeSelect = null;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
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
                            FilterNames: ["MyIntellectualProperties", "MyFavorites"],
                            TreeCheckbox: true,
                            DocumentsOnly: true,
                            ShowBottomBar: true,
                            OnConfirm: function () {
                                if (callback) callback(nodeSelect.get_items());
                                showedDiv.Close();
                            },
                            OnCancel: function () { showedDiv.Close(); }
                        }
                    });
                }
            });
        }
    };
})();