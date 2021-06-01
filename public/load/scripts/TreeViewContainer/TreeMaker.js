(function () {
    if (window.TreeMaker) return;

    window.TreeMaker = function (params) {
        //-> Variables
        this.TreeViewObject = null;
        this.CuttedID = null;
        this.Adding = false;
        this.Pasting = false;
        //-> end of Variables

        //-> Constants
        this.ContainerDiv = null;
        this.TreeID = null;
        this.DeleteConfirmation = false;
        //-> end of Constants

        //->String Constants
        this.StringConstants = {
            RequestHandler: null, GetRequestHandler: null, AddRequestHandler: null,
            ChangeRequestHandler: null, RemoveRequestHandler: null, MoveRequestHandler: null,
            GetNodes: null, CreateNode: null, ChangeNode: null, MoveNode: null, RemoveNode: null,
            TreeID: null, Nodes: null, NodeID: null, NodeIDs: "NodeIDs", ParentID: null, Title: null,
            FailureAlert: null, NewNodeDefaultTitle: null, DeleteConfirmationAlert: null
        }
        //-> end of Strings

        //-> Options
        this.Options = { AjaxLoading: false, RequestParams: {}, AjaxResponseParser: null };
        //-> end of Options

        this.OnAdd = null;
        this.OnRemove = null;
        this.OnRename = null;
        this.OnPaste = null;
        this.OnSelect = null;
        this.OnDoubleClick = null;
        this.OnSort = null;

        this.reset(params);
    }

    TreeMaker.prototype = {
        reset: function (params) {
            params = params || {};

            this.ContainerDiv = typeof (params.ContainerDiv) == "object" ? params.ContainerDiv : document.getElementById(params.ContainerDiv);
            this.TreeID = params.TreeID || "";
            this.DeleteConfirmation = params.DeleteConfirmation === true ? true : false;
            this.RemoveHierarchyConfirmation = params.RemoveHierarchyConfirmation === true ? true : false;

            var _options = params.Options || {};
            for (_op in _options) this.Options[_op] = _options[_op];

            //-> Initialize string constants
            this.StringConstants.RequestHandler = params.RequestHandler || "";
            this.StringConstants.GetRequestHandler = params.GetRequestHandler || this.StringConstants.RequestHandler;
            this.StringConstants.AddRequestHandler = params.AddRequestHandler || this.StringConstants.RequestHandler;
            this.StringConstants.ChangeRequestHandler = params.ChangeRequestHandler || this.StringConstants.RequestHandler;
            this.StringConstants.RemoveRequestHandler = params.RemoveRequestHandler || this.StringConstants.RequestHandler;
            this.StringConstants.MoveRequestHandler = params.MoveRequestHandler || this.StringConstants.RequestHandler;

            this.StringConstants.GetNodes = params.GetNodes || "GetNodes";
            this.StringConstants.CreateNode = params.CreateNode || "CreateNode";
            this.StringConstants.ChangeNode = params.ChangeNode || "ChangeNode";
            this.StringConstants.MoveNode = params.MoveNode || "MoveNode";
            this.StringConstants.RemoveNode = params.RemoveNode || "RemoveNode";

            var stringConstants = params.StringConstants || {};

            this.StringConstants.TreeID = stringConstants.TreeID || "TreeID";
            this.StringConstants.Nodes = stringConstants.Nodes || "Nodes";
            this.StringConstants.NodeID = stringConstants.NodeID || "NodeID";
            this.StringConstants.NodeIDs = stringConstants.NodeIDs || "NodeIDs";
            this.StringConstants.RemoveHierarchy = stringConstants.RemoveHierarchy || "RemoveHierarchy";
            this.StringConstants.ParentID = stringConstants.ParentID || "ParentNodeID";
            this.StringConstants.Title = stringConstants.Title || "Title";

            this.StringConstants.FailureAlert = params.FailureAlert || "خطا در برقراری ارتباط با سرور";
            this.StringConstants.NewNodeDefaultTitle = params.NewNodeDefaultTitle || "گره جدید";
            this.StringConstants.DeleteConfirmationAlert = params.DeleteConfirmationAlert || "آیا می خواهید گره انتخاب شده را حذف کنید؟";
            this.StringConstants.RemoveHierarchyConfirmationAlert = params.RemoveHierarchyConfirmationAlert || "آیا می خواهید گره های زیرشاخه را نیز حذف کنید؟";
            //-> end of string constants initialization

            this.OnAdd = params.OnAdd;
            this.OnRemove = params.OnRemove;
            this.OnRename = params.OnRename;
            this.OnPaste = params.OnPaste;
            this.OnSelect = params.OnSelect;
            this.OnDoubleClick = params.OnDoubleClick;
            this.OnSort = params.OnSort;

            if (params.InitialGet !== false) {
                if (this.Options.AjaxLoading === true) this.create_tree_view([]);
                else this.get_nodes();
            }
            else this.create_tree_view(_options.Nodes || []);
        },

        create_tree_view: function (nodes, params) {
            params = params || {};
            nodes = nodes || [];

            var that = this;

            var _ajaxLoading = that.Options.AjaxLoading;
            var _ajaxResponseParser = that.Options.AjaxResponseParser;

            if (that.TreeViewObject) {
                delete that.TreeViewObject;
                that.ContainerDiv.innerHTML = "";
            }

            that.TreeViewObject = new TreeViewContainer(that.ContainerDiv, {
                Nodes: nodes, Hotkeys: true, Checkbox: false, Modifiable: true,
                DefaultRemove: false, DefaultAdd: false, DefaultPaste: false,
                OnRenameOccured: function (p) { that.on_rename_occured(p); },
                OnNodeRemove: function (p) { that.on_remove(p); },
                OnNodeAdd: function (p) { that.on_add(p); },
                OnCut: function (p) { that.on_cut(p); },
                OnPaste: function (p) { that.on_paste(p); },
                OnSort: !that.OnSort ? null : function (p, callback) { that.on_sort(p, callback); },
                OnNodeSelect: function (p) { that.on_select(p); },
                OnDoubleClick: function (p) { that.on_double_click(p); },
                ProgressiveRender: _ajaxLoading, AjaxLoading: _ajaxLoading, AjaxURL: that.StringConstants.RequestHandler,
                AjaxParams: that.Options.RequestParams, AjaxResponseParser: _ajaxResponseParser,
                StringConsts: { Command: that.StringConstants.GetNodes, StrNodeID: this.StringConstants.NodeID }
            });
        },

        get_nodes: function () {
            var that = this;

            var url = that.StringConstants.GetRequestHandler + "/" + that.StringConstants.GetNodes + "?timeStamp=" + new Date().getTime();
            var queryString = that.StringConstants.TreeID + "=" + that.TreeID;

            for (_item in that.Options.RequestParams) queryString += "&" + _item + "=" + that.Options.RequestParams[_item];

            send_post_request(url, queryString, function (responseText) {
                var _nodes = JSON.parse(responseText)[that.StringConstants.Nodes];

                if (_nodes.length == 0) {
                    //Node is the refrence of new node and stands for position. -1 means the new node is the root
                    that.on_add({ Node: -1, CreateTree: true });
                    return;
                }

                var nds = [];
                for (var i = 0, lnt = _nodes.length; i < lnt; ++i) {
                    nds.push({
                        ID: _nodes[i][that.StringConstants.NodeID],
                        Title: Base64.decode(_nodes[i][that.StringConstants.Title]),
                        ParentID: _nodes[i][that.StringConstants.ParentID]
                    });
                }

                that.create_tree_view(nds);
            }, { FailureHandler: function () { that.failure_handler(); } });
        },

        failure_handler: function () { alert(this.StringConstants.FailureAlert); },

        on_select: function (params) {
            if (this.OnSelect) this.OnSelect({ ID: params.ID || "", Name: this.TreeViewObject.get_text(params.Node) });
        },

        on_double_click: function (params) {
            if (this.OnDoubleClick) this.OnDoubleClick({ ID: params.ID || "", Name: this.TreeViewObject.get_text(params.Node) });
        },

        on_rename_occured: function (params) {
            params = params || {};
            var that = this;

            var nodeId = params.ID;
            var newTitle = that.TreeViewObject.get_text(params.Node);

            if (!that.StringConstants.ChangeRequestHandler) {
                if (that.OnRename) that.OnRename(params.Node);
                return;
            }

            var url = that.StringConstants.ChangeRequestHandler + "/" + that.StringConstants.ChangeNode + "?timeStamp=" + new Date().getTime();
            var queryString = that.StringConstants.NodeID + "=" + nodeId + "&" + that.StringConstants.Title + "=" + Base64.encode(newTitle) +
                "&" + that.StringConstants.TreeID + "=" + that.TreeID;
            
            send_post_request(url, queryString, function (responseText) {
                var result = JSON.parse(responseText);
                if (result.ErrorText) that.rollback_rename(params);
                else if (that.OnRename) that.OnRename(params.Node);
            }, { FailureHandler: function (p) { that.TreeViewObject.rollback(p); } });
        },

        on_remove: function (params) {
            var that = this;
            params = params || {};

            var nodeId = params.ID;
            var nodeIds = params.IDs || [];

            if (!nodeId && nodeIds.length == 0) return;

            var __act = function (p) {
                if (!that.StringConstants.RemoveRequestHandler) {
                    that.TreeViewObject.remove(params.Node);
                    if (that.OnRemove) that.OnRemove(params.Node);
                    return;
                }

                var url = that.StringConstants.RemoveRequestHandler + "/" + that.StringConstants.RemoveNode + "?timeStamp=" + new Date().getTime();
                var queryString = that.StringConstants.NodeID + "=" + nodeId +
                    "&" + that.StringConstants.NodeIDs + "=" + nodeIds.join('|') +
                    "&" + that.StringConstants.TreeID + "=" + that.TreeID +
                    "&" + that.StringConstants.RemoveHierarchy + "=" + (p || {}).RemoveHierarchy;

                send_post_request(url, queryString, function (responseText) {
                    var result = JSON.parse(responseText);
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else {
                        that.TreeViewObject.remove(params.Node);
                        if (that.OnRemove) that.OnRemove(params.Node);
                    }
                }, { FailureHandler: function () { that.failure_handler(); } });
            }

            var __do = function () {
                if (!that.RemoveHierarchyConfirmation || !params.HasChild) return __act({ RemoveHierarchy: false });

                GlobalUtilities.confirm(that.StringConstants.RemoveHierarchyConfirmationAlert, function (result) {
                    __act({ RemoveHierarchy: result });
                });
            }

            if (!that.DeleteConfirmation) return __do();

            GlobalUtilities.confirm(that.StringConstants.DeleteConfirmationAlert, function (result) {
                if (!result) return;
                __do();
            });
        },

        on_add: function (params) {
            var that = this;
            if (that.Adding === true) return;
            that.Adding = true;
            params = params || {};

            var parentId = params.ID || "";
            parentId = isNaN(+parentId) ? parentId : ""; //if the parentId is a number, it means the parentId determines a position rather than an actual id
            var title = that.StringConstants.NewNodeDefaultTitle;

            var _done = function (newNode) {
                if (params.CreateTree === true) that.create_tree_view([newNode]);
                else that.TreeViewObject.rename(that.TreeViewObject.add(params.Node, newNode));

                that.Adding = false;
            };

            if (!that.StringConstants.AddRequestHandler) {
                return setTimeout(function () {
                    var theNode = { ID: GlobalUtilities.generate_new_guid(), Title: title || "", ParentID: params.ID || "" };
                    _done(theNode);
                    if (that.OnAdd) that.OnAdd(theNode);
                }, 100);
            }

            var url = that.StringConstants.AddRequestHandler + "/" + that.StringConstants.CreateNode + "?timeStamp=" + new Date().getTime();
            var queryString = that.StringConstants.ParentID + "=" + parentId + "&" + that.StringConstants.Title + "=" + Base64.encode(title) +
                "&" + that.StringConstants.TreeID + "=" + that.TreeID;
            
            send_post_request(url, queryString, function (responseText) {
                var result = JSON.parse(responseText);
                if (result.ErrorText) {
                    return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                }

                var rawNode = { ID: result[that.StringConstants.NodeID], Title: title || "", ParentID: params.ID || "" };

                _done(rawNode);

                if (that.OnAdd) that.OnAdd(result);
            }, { FailureHandler: function () { that.failure_handler(); } });
        },

        on_cut: function (params) {
            params = params || {};
            this.CuttedIDs = params.IDs || "";
        },

        on_paste: function (params) {
            var that = this;
            if (that.Pasting === true) return;
            that.Pasting = true;
            params = params || {};
            var nodeIds = params.Root === true ? params.IDs || [] : that.CuttedIDs || [];
            if (nodeIds.length == 0) return;
            var parentId = params.Root === true ? "" : params.IDs || "";

            var _done = function () {
                if (params.Root === true) that.TreeViewObject.root(params.Node);
                else that.TreeViewObject.paste(params.Node);
                that.Pasting = false;
            };

            if (!that.StringConstants.MoveRequestHandler) {
                _done();
                if (that.OnPaste) that.OnPaste(params.Node);
                return;
            }

            var url = that.StringConstants.MoveRequestHandler + "/" + that.StringConstants.MoveNode + "?timeStamp=" + new Date().getTime();
            var queryString = that.StringConstants.NodeIDs + "=" + nodeIds.join('|') +
                "&" + that.StringConstants.ParentID + "=" + parentId +
                "&" + that.StringConstants.TreeID + "=" + that.TreeID;

            send_post_request(url, queryString, function (responseText) {
                var result = JSON.parse(responseText);

                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                else {
                    _done();
                    if (that.OnPaste) that.OnPaste(params.Node);
                }
            },
            {
                FailureHandler: function () {
                    that.Pasting = false;
                    alert(that.StringConstants.FailureAlert);
                }
            });
        },

        on_sort: function (sortedIds, callback) {
            this.OnSort(sortedIds, callback);
        }
    }
})();