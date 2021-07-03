(function () {
    if (window.DocTreeNodeSelect) return;

    window.DocTreeNodeSelect = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Options = {
            OnClose: params.OnClose,
            OnSelect: params.OnSelect
        }

        var that = this;

        GlobalUtilities.load_files(["API/DocsAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    DocTreeNodeSelect.prototype = {
        _preinit: function () {
            var that = this;

            DocsAPI.GetTrees({
                ParseResults: true,
                ResponseHandler: function (results) { that._initialize(results.Trees || []); }
            });
        },

        _initialize: function (trees) {
            trees = trees || [];
            var that = this;

            that.ContainerDiv.innerHTML = "";

            if (trees.length == 0) {
                alert(RVDic.MSG.NoDocumentTreeFound);
                if (that.Options.OnClose) that.Options.OnClose();
                return;
            }

            var itemsArea = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: RVDic.DocumentTreeSelect }]
                },
                { Type: "hr", Class: "small-12 medium-12 large-12", Style: "margin:1rem 0rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
            ], that.ContainerDiv)["_div"];

            for (var i = 0, lnt = trees.length; i < lnt; ++i)
                that.add_item(itemsArea, trees[i]);
        },

        add_item: function (container, tree) {
            tree = tree || {};
            var that = this;

            var treeName = Base64.decode(tree.Title || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                    Style: "display:inline-block; padding:0.3rem; margin:0.3rem; cursor:pointer;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                        { Name: "onmouseout", Value: function () { this.style.color = "black"; } },
                        { Name: "onclick", Value: function () { that.show_tree(tree.ID, treeName); } }
                    ],
                    Childs: [{ Type: "text", TextValue: treeName }]
                }
            ], container);
        },

        show_tree: function (treeId, treeName) {
            var that = this;

            that.Trees = that.Trees || {};
            if (that.Trees[treeId]) {
                that.Trees[treeId].ShowedDiv = GlobalUtilities.show(that.Trees[treeId].Container);
                return;
            }

            that.Trees[treeId] = { ShowedDiv: null, Container: null };

            var _div = that.Trees[treeId].Container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-7 large-5 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem; font-size:0.8rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            that.Trees[treeId].ShowedDiv = GlobalUtilities.show(_div);

            DocsAPI.GetTreeNodes({
                TreeID: treeId,
                ParseResults: true,
                ResponseHandler: function (results) {
                    var nodes = results.TreeNodes || [];

                    for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                        nodes[i].ID = nodes[i].TreeNodeID || "";
                        nodes[i].Title = Base64.decode(nodes[i].Title);
                    }

                    _div.innerHTML = "";

                    var treeArea = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: treeName }]
                        },
                        { Type: "hr", Class: "small-12 medium-12 large-12", Style: "margin:0.5rem 0rem;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "treeArea", Style: "overflow:hidden;" }
                    ], _div)["treeArea"];

                    GlobalUtilities.load_files(["jQuery/jsTree/jquery.jstree.js", "TreeViewContainer/TreeViewContainer.js"], {
                        LoadSequential: true,
                        OnLoad: function () {
                            var newTreeView = new TreeViewContainer(treeArea, {
                                Nodes: nodes, Hotkeys: false,
                                Checkbox: false, OnlyLeafCheckboxes: false, Modifiable: false,
                                OnNodeSelect: function (nd) {
                                    that.Trees[treeId].ShowedDiv.Close();

                                    if (that.Options.OnSelect) {
                                        that.Options.OnSelect(GlobalUtilities.extend(nd || {}, {
                                            Tree: { ID: treeId, Name: treeName }
                                        }));
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    }
})();