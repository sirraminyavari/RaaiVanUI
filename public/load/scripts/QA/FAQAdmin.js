(function () {
    if (window.FAQAdmin) return;

    window.FAQAdmin = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;

        this.Interface = {
            Info: null
        };

        this.Objects = {
            Categories: {}
        };

        var that = this;

        GlobalUtilities.load_files([
            "API/QAAPI.js",
            "QA/FAQCategoryAdmin.js",
            { Root: "TreeViewContainer/", Ext: "js", Childs: ["TreeViewContainer", "TreeMaker"] }
        ], { OnLoad: function () { that.initialize(); } });
    }

    FAQAdmin.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-6 large-4",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "tree",
                                    Style: "border-style:solid; border-width:1px; border-color:black;" +
                                        "padding:4px 0px 4px 0px; font-size:0.8rem; margin-bottom:1rem;" +
                                        GlobalUtilities.border_radius("0.3rem")
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-6 large-8", Name: "info",
                            Style: "padding:0rem 1rem;"
                        }
                    ]
                }
            ], that.Container);

            that.Interface.Info = elems["info"];

            that.show_tree(elems["tree"]);
        },

        show_tree: function (container) {
            var that = this;

            new TreeMaker({
                ContainerDiv: container,
                NewNodeDefaultTitle: RVDic.NewN.replace("[n]", RVDic.Category),
                RequestHandler: QAAPI.ResponseURL,
                Command: "Command",
                GetNodes: "GetChildFAQCategories",
                CreateNode: "CreateFAQCategory",
                ChangeNode: "RenameFAQCategory",
                MoveNode: "MoveFAQCategories",
                RemoveNode: "RemoveFAQCategories",
                InitialGet: true,
                DeleteConfirmation: true,
                RemoveHierarchyConfirmation: true,
                DeleteConfirmationAlert: RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Category),
                StringConstants: { Nodes: "Categories", NodeID: "CategoryID", NodeIDs: "CategoryIDs", ParentID: "ParentID", Title: "Name" },
                Options: {
                    AjaxLoading: true,
                    RequestParams: { IsTreeView: "true" },
                    AjaxResponseParser: function (result) {
                        var cats = JSON.parse(result).Categories || [];
                        var items = [];
                        for (var i = 0, lnt = cats.length; i < lnt; ++i) {
                            items.push({
                                ID: cats[i].CategoryID,
                                Title: Base64.decode(cats[i].Name || ""),
                                HasChild: cats[i].HasChild
                            });
                        }
                        return items;
                    }
                },
                OnSelect: function (node) {
                    var obj = that.Objects.Categories[node.ID] = that.Objects.Categories[node.ID] || {};

                    jQuery(that.Interface.Info).fadeOut(that.Interface.Info.firstChild ? 500 : 0, function () {
                        jQuery(that.Interface.Info).html("");

                        if (!obj.Container) {
                            obj.Container = GlobalUtilities.create_nested_elements([
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                            ])["_div"];

                            new FAQCategoryAdmin(obj.Container, {
                                Category: { CategoryID: node.ID, Name: node.Name }
                            });
                        }

                        that.Interface.Info.appendChild(obj.Container);

                        jQuery(that.Interface.Info).fadeIn(500);
                    });
                },
                OnSort: function (sortedItems, callback) {
                    QAAPI.SetFAQCategoriesOrder({
                        CategoryIDs: sortedItems.join('|'), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            callback(!!result.Succeed);
                        }
                    });
                }
            });
        }
    }
})();