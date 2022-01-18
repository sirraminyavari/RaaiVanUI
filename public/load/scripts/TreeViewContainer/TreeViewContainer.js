(function () {
    if (window.TreeViewContainer) return;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.JSTreeNoCheckbox > a > .jstree-checkbox { display:none; }';
    document.getElementsByTagName('head')[0].appendChild(style);

    window.TreeViewContainer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;

        params = params || {};

        if(!params.HideScroll) this.ContainerDiv.style.overflowX = "auto";
        
        this.TreeContainer = document.createElement("div");
        this.ContainerDiv.appendChild(this.TreeContainer);

        //////////-> Initiali with params <-//////////
        this.InitialParams = params;
        this.AjaxURL = params.AjaxURL;

        this._initialize();
    }

    TreeViewContainer.prototype = {
        generate_new_guid: function () {
            var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).toUpperCase().substring(1); }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        _initialize: function () {
            var that = this;

            var _jqcheck = function () { return typeof (jQuery) == "function"; }
            var _jqextcheck = function (ext) { return _jqcheck() && typeof (jQuery(document.createElement("div"))[ext]) == "function"; }

            GlobalUtilities.load_files([
                { Root: "jQuery/", Ext: "js", Childs: ["jsTree/jquery.jstree", "jquery.cookie", "jquery.hotkeys"] }
            ], {
                Timeout: 0, LoadSequential: true, OnLoad: function () {
                    that.reset(that.InitialParams);
                    if (that.InitialParams.OnLoad) that.InitialParams.OnLoad(that.InitialParams.LoadParams);
                }
            });
        },

        _request_data: function () { return {}; },  //this method will be implemented in 'reset' method

        _parse_results: function (result) {
            var that = this;
            
            if (!that.AjaxResponseParser) return result;
            var nodes = that.AjaxResponseParser(JSON.stringify(result));
            var items = [];
            for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                if (nodes[i].HasChild === true) {
                    items.push({
                        state: "closed",
                        data: {
                            title: GlobalUtilities.convert_numbers_to_persian(nodes[i].Title || ""),
                            attr: { id: null, href: "hasChild" }
                        },
                        attr: {
                            id: nodes[i].ID || "", href: null,
                            class: (that._onlyLeafCheckboxes ? "JSTreeNoCheckbox" : null)
                        }
                    });
                }
                else {
                    items.push({
                        data: GlobalUtilities.convert_numbers_to_persian(nodes[i].Title || ""),
                        attr: { id: nodes[i].ID || "" }, children: []
                    });
                }
            }
            return items;
        },

        reset: function (params) {
            var initialParams = this.InitialParams || {};
            params = params || {};
            var that = this;

            for (var _par in params) initialParams[_par] = params[_par];
            params = initialParams;
            
            this._hotkeys = params.Hotkeys === false ? "" : "hotkeys";
            this._checkbox = params.Checkbox === true ? "checkbox" : "";
            this._onlyLeafCheckboxes = params.OnlyLeafCheckboxes === true;
            this._treeStateCheckbox = params.TreeStateCheckbox === true;
            this._modifiable = params.Modifiable === false ? "" : "crrm";
            this.onNodeSelect = params.OnNodeSelect ? params.OnNodeSelect : null;
            this.onDoubleClick = params.OnDoubleClick ? params.OnDoubleClick : null;
            this.onNodeAdd = params.OnNodeAdd ? params.OnNodeAdd : null;
            this.onNodeRemove = params.OnNodeRemove ? params.OnNodeRemove : null;
            this.onNodeRename = params.OnNodeRename ? params.OnNodeRename : null;
            this.onCut = params.OnCut ? params.OnCut : null;
            this.onPaste = params.OnPaste ? params.OnPaste : null;
            this.onRenameOccured = params.OnRenameOccured ? params.OnRenameOccured : null;
            this.onSort = params.OnSort ? params.OnSort : null;
            this._boolDefaultAdd = params.DefaultAdd === false ? false : true;
            this._boolDefaultRemove = params.DefaultRemove === false ? false : true;
            this._boolDefaultRename = params.DefaultRename === false ? false : true;
            this._boolDefaultCut = params.DefaultCut === false ? false : true;
            this._boolDefaultPaste = params.DefaultPaste === false ? false : true;
            
            this._nodes = params.Nodes || [];
            this._nodes = this._parse_raw_nodes(this._nodes);
            this.AjaxResponseParser = params.AjaxResponseParser;
            //////////////////////////////////////////////
            //////////////////////////////////////////////
            
            var stringConsts = params.StringConsts || {};
            var ajaxParams = params.AjaxParams || {};
            
            var ajaxUrl = !params.AjaxURL ? "" : String(params.AjaxURL).toLowerCase();
            
            if (ajaxUrl) {
                ajaxUrl += "/" + (stringConsts.Command || 'GetTreesOrChildNodes');
                ajaxUrl += (ajaxUrl.indexOf("?") >= 0 ? "&" : "?") + "rndts=" + new Date().getTime();
            }

            this.AjaxURL = ajaxUrl;
            
            that._request_data = function (nodeId) {
                var dt = {};

                dt[stringConsts.StrNodeID || 'NodeID'] = nodeId;
                dt[stringConsts.StrOwnerID || 'OwnerID'] = params.OwnerID || '';
                dt[stringConsts.StrRootID || 'RootID'] = params.RootID || '';

                for (_item in ajaxParams) {
                    if (((stringConsts.StrNodeID || "NodeID") == _item) && (nodeId != "")) continue;
                    dt[_item] = ajaxParams[_item];
                }
                
                return dt;
            };
            
            var jsonData = params.AjaxLoading !== true ? { "data": this._nodes || [], "ajax": false } : {
                "ajax": {
                    "method": "POST",
                    "url": ajaxUrl,
                    "data": function (n) {
                        var nId = n.attr ? n.attr("id") : '';
                        
                        var queryStringJson = that._request_data(nId);

                        queryStringJson[GlobalUtilities.AccessTokenParameterName] = GlobalUtilities.get_csrf_token();
                        
                        return queryStringJson;
                    },
                    "success": function (result) { return that._parse_results(result); },
                    "progressive_render": params.ProgressiveRender === true
                }
            };

            jQuery(this.TreeContainer).jstree("destroy");

            var _get_selected_node = function (tree) {
                return tree.data.ui.selected.get(0) ? tree.data.ui.selected : tree.data.ui.hovered;
            };
            
            //TreeView Creation
            jQuery(this.TreeContainer).jstree({
                "json_data": jsonData,
                "plugins": ["themes", "json_data", "ui", this._modifiable, this._hotkeys, this._checkbox],
                "core": { "initially_open": [/*"phtml_1"*/], rtl: !!RV_RTL, strings: { loading: "در حال بارگذاری..."} },
                "checkbox": { "two_state": !this._treeStateCheckbox },
                "themes": {
                    "theme": RV_RTL ? "default-rtl" : "default",
                    "dots": true,
                    "icons": false,
                    "url": GlobalUtilities.js("jQuery/jsTree/themes/" + (RV_RTL ? "default-rtl" : "default") + "/style.css")
                },
                "hotkeys": {
                    "del": function () {
                        var _node = _get_selected_node(this);
                        that._onremove(_node);
                    },
                    "n": function () {
                        var _node = _get_selected_node(this);
                        that._onadd(_node);
                    },
                    "m": function () { that._onadd(-1); },
                    "f2": function () {
                        var _node = _get_selected_node(this);
                        that._onrename(_node);
                    },
                    "ctrl+x": function () {
                        var _node = _get_selected_node(this);
                        that._oncut(_node);
                    },
                    "ctrl+v": function () {
                        var _node = _get_selected_node(this);
                        that._onpaste(_node);
                    },
                    "ctrl+m": function () {
                        var _node = _get_selected_node(this);
                        that._onroot(_node);
                    },
                    "s": function () {
                        var _node = _get_selected_node(this);
                        that._onsort(_node);
                    },
                    "r": function () {
                        that._onsort(null);
                    }
                }
            });
            
            var _get_path = function (data) {
                var path = [];
                var pathIds = data.inst.get_path('#' + data.rslt.obj.attr('id'), true);
                var pathNames = data.inst.get_path('#' + data.rslt.obj.attr('id'), false);
                for (var i = 0, lnt = pathIds.length; i < lnt; ++i)
                    path.push({ ID: pathIds[i], Name: pathNames[i] });
                return path;
            }

            if (this.onNodeSelect !== null) {
                jQuery(this.TreeContainer).bind("select_node.jstree", function (event, data) {
                    var _node = data.rslt.obj;

                    if (that.onNodeSelect !== null) that.onNodeSelect({ Event: data.rslt.e, ID: _node.attr("id"),
                        Node: _node, Name: that.get_text(_node), Path: _get_path(data), TreeViewInstance: that
                    });
                });
            }

            if (this.onDoubleClick !== null) {
                jQuery(this.TreeContainer).bind("dblclick.jstree", function (event) {
                    var _node = jQuery(event.target).closest("li");
                    if (that.onDoubleClick !== null) that.onDoubleClick({ ID: _node.attr("id"),
                        Node: _node, Name: that.get_text(_node), /*Path: _get_path(data),*/TreeViewInstance: that
                    });
                });
            }

            if (this.onRenameOccured !== null) {
                jQuery(this.TreeContainer).bind("rename_node.jstree", function (event, data) {
                    //this event occurs when the user has entered the new name and pressed enter
                    var _node = data.rslt.obj;
                    if (that.onRenameOccured !== null) that.onRenameOccured({ Event: data.rslt.e, ID: _node.attr("id"),
                        Node: _node, Path: _get_path(data), RLBK: data.rlbk
                    });
                });
            }
            //end of TreeView Creation
        },

        _parse_raw_nodes: function (rawNodes) {
            var that = this;
            
            rawNodes = rawNodes || [];
            var _tree = [];
            var createdNodes = [];
            
            var nodesOrder = {};
            for (var i = 0, lnt = rawNodes.length; i < lnt; ++i)
                nodesOrder[rawNodes[i].ID] = { Order: i + 1, Sorted: false, Name: rawNodes[i].Title };
            
            var idBasedRawNodes = [];
            for (var i = 0, lnt = rawNodes.length; i < lnt; ++i) idBasedRawNodes[rawNodes[i].ID] = rawNodes[i];

            var sort_nodes = function (toBeSorted) {
                if (GlobalUtilities.get_type(toBeSorted) != "array") return;

                toBeSorted.sort(function (first, second) {
                    if (!nodesOrder[first.attr.id].Sorted && ((first.children || []).length > 0)) sort_nodes(first.children);
                    if (!nodesOrder[second.attr.id].Sorted && ((second.children || []).length > 0)) sort_nodes(second.children);
                    nodesOrder[first.attr.id].Sorted = nodesOrder[second.attr.id].Sorted = true;

                    return nodesOrder[first.attr.id].Order > nodesOrder[second.attr.id].Order;
                });
            }

            var locate_node = function (_rawNode) {
                if (_rawNode == null || createdNodes[_rawNode.ID]) return null;

                var parentId = _rawNode.ParentID === _rawNode.ID ? "" : _rawNode.ParentID || "";
                var parentNode = parentId === "" ? null : createdNodes[parentId] || locate_node(idBasedRawNodes[parentId]);

                var newNode = {
                    "data": _rawNode.Title || "",
                    "attr": { "id": _rawNode.ID || "" },
                    "children": []
                };

                parentNode === null ? _tree.push(newNode) : parentNode["children"].push(newNode);
                createdNodes[_rawNode.ID] = newNode;

                return newNode;
            }

            for (var i = 0, lnt = rawNodes.length; i < lnt; ++i)
                if (!createdNodes[rawNodes[i].ID]) locate_node(rawNodes[i]);

            if (that._onlyLeafCheckboxes) {
                for (var _id in createdNodes)
                    if ((createdNodes[_id].children || []).length > 0) createdNodes[_id].attr.class = "JSTreeNoCheckbox";
            }

            sort_nodes(_tree);
            
            return _tree;
        },

        hide: function () { this.ContainerDiv.style.display = "none"; },
        unhide: function () { this.ContainerDiv.style.display = "block"; },

        add: function (refNode, rawNode) {
            rawNode = rawNode || {};
            var newNode = {
                "data": GlobalUtilities.convert_numbers_to_persian(rawNode.Title || "گره جدید"),
                "attr": { "id": rawNode.ID || "" }, "children": []
            };
            return jQuery(this.TreeContainer).jstree("create", refNode, "inside", newNode, false, true);
        },

        _onadd: function (refNode) {
            if (this._boolDefaultAdd) this.add(refNode);
            if (this.onNodeAdd !== null) this.onNodeAdd({ ID: isNaN(+refNode) ? refNode.attr("id") : refNode, Node: refNode });
        },

        remove: function (node) {
            jQuery(this.TreeContainer).jstree("remove", node);
        },

        _onremove: function (node) {
            if (this._boolDefaultRemove) this.remove(node);
            
            var hasChild = String(jQuery(node).get(0).getAttribute("class")).toLowerCase().indexOf("jstree-leaf") < 0;

            var ids = [];
            for (var i = 0; i < node.length; i++) {
                ids.push(node[i].getAttribute("id"));
                if (String(jQuery(node[i]).get(0).getAttribute("class")).toLowerCase().indexOf("jstree-leaf") < 0) hasChild = true;
            }
            
            if (this.onNodeRemove !== null) this.onNodeRemove({ ID: node.attr("id"), IDs: ids, Node: node, HasChild: hasChild });
        },

        rename: function (node) {
            jQuery(this.TreeContainer).jstree("rename", node);
        },

        _onrename: function (node) {
            if (this._boolDefaultRename) this.rename(node);
            if (this.onNodeRename !== null) this.onNodeRename({ ID: node.attr("id"), Node: node });
        },

        cut: function (node) {
            jQuery(this.TreeContainer).jstree("cut", node);
        },

        _oncut: function (node) {
            if (this._boolDefaultCut) this.cut(node);

            var ids = [];
            for (var i = 0; i < node.length; i++) ids.push(node[i].getAttribute("id"));

            if (this.onCut !== null) this.onCut({ ID: node.attr("id"), IDs: ids, Node: node });
        },

        paste: function (node) {
            jQuery(this.TreeContainer).jstree("paste", node);
        },

        _onpaste: function (node) {
            if (this._boolDefaultPaste) this.paste(node);

            var ids = [];
            for (var i = 0; i < node.length; i++) ids[i] = node[i].getAttribute("id");

            if (this.onPaste !== null) this.onPaste({ ID: node.attr("id"), IDs: ids, Node: node });
        },

        root: function (node) {
            jQuery(this.TreeContainer).jstree("move_node", node, -1);
        },

        _onroot: function (node) {
            if (this.onPaste !== null) {
                var ids = [];
                for (var i = 0; i < node.length; i++) ids[i] = node[i].getAttribute("id");
                this.onPaste({ ID: node.attr("id"), IDs: ids, Node: node, Root: true });
            }
        },

        _onsort: function (node) {
            if (!this.onSort) return;
            var that = this;
            
            that.get_childs(node, function (childs) {
                if (childs.length > 1) that.sort_dialog(childs);
            });
        },

        rollback: function (params) {
            params = params || {};
            jQuery.jstree.rollback(params.RLBK || params);
        },

        get_text: function (node) {
            return jQuery(this.TreeContainer).jstree("get_text", node);
        },
        
        get_childs: function (node, callback) {
            if (GlobalUtilities.get_type(callback) != "function") return;
            var that = this;
            
            var childs = [];
            var nodeElem = node ? (!node.get && node.ID ? document.getElementById(node.ID) : node.get(0)) : null;
            var nodeId = nodeElem ? nodeElem.getAttribute("id") : null;
            var el = (nodeElem || that.ContainerDiv).getElementsByTagName("li");
            if (!nodeElem && (el.length > 0)) nodeElem = (el[0].parentNode || {}).parentNode;
            
            if (that.InitialParams.AjaxLoading !== true) {
                for (var i = 0, lnt = el.length; i < lnt; ++i) {
                    var secondLevelParent = (el[i].parentNode || {}).parentNode;
                    var thirdLevelParent = (secondLevelParent || {}).parentNode;
                    if ((secondLevelParent != nodeElem) && (thirdLevelParent != nodeElem)) continue;
                    var textElem = el[i].firstChild.nextSibling;
                    childs.push({ ID: el[i].getAttribute("id"), Name: textElem.innerText || textElem.textContent });
                }
                callback(childs);
            }
            else {
                RVAPI.PostRequest(that.AjaxURL, that._request_data(nodeId), function (dt) {
                    var items = that._parse_results(dt);
                    for (var i = 0, lnt = (items || []).length; i < lnt; ++i)
                        childs.push({ ID: items[i].attr.id, Name: (items[i].data || {}).title || items[i].data });
                    callback(childs);
                });
            }
        },

        get_all_nodes: function (callback) {
            var that = this;

            var ret = [];

            var processing = 0;

            var _do = function (node) {
                ++processing;
                
                that.get_childs(node, function (childs) {
                    if ((childs || []).length) {
                        if (node) node.Childs = childs;
                        else ret = childs;
                    }
                    
                    var theArr = (node ? childs : ret) || [];
                    for (var i = 0; i < theArr.length; ++i) _do(theArr[i]);

                    --processing;
                    
                    if (!processing) callback(ret);
                });
            };

            _do(null);
        },

        toggle_node: function (node) {
            if (typeof (node) != "object") node = "#" + node;
            jQuery(this.TreeContainer).jstree("toggle_node", node);
        },

        __get_normal_items: function (items) {
            var arr = [];
            for (var i = 0, lnt = items.length; i < lnt; ++i) {
                var _text = jQuery(this.TreeContainer).jstree("get_text", items[i]);
                arr.push({ ID: items[i].id, Title: _text });
            }
            return arr;
        },

        get_checked_items: function (normal) {
            var items = jQuery(this.TreeContainer).jstree("get_checked", null, true);
            return normal === true ? this.__get_normal_items(items) : items;
        },

        get_unchecked_items: function (normal) {
            var items = jQuery(this.TreeContainer).jstree("get_unchecked", null, true);
            return normal === true ? this.__get_normal_items(items) : items;
        },

        __get_items_string: function (delimiter, checked) {
            delimiter = delimiter || '|';

            var retVal = "";
            var nodes = checked === true ? this.get_checked_items() : this.get_unchecked_items();
            for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                if (i > 0) retVal += delimiter;
                retVal += nodes[i].id;
            }

            return retVal;
        },

        get_checked_items_string: function (delimiter) {
            return this.__get_items_string(delimiter, true);
        },

        get_unchecked_items_string: function (delimiter) {
            return this.__get_items_string(delimiter, false);
        },

        sort_dialog: function (items) {
            var that = this;

            if (that.LoadingSortDialog) return;
            that.LoadingSortDialog = true;

            GlobalUtilities.load_files(["Public/SortDialog.js"], {
                OnLoad: function () {
                    new SortDialog({
                        Container: !items.length ? null : (document.getElementById(items[0].ID) || {}).parentNode,
                        Title: RVDic._HelpSortNames,
                        Items: items,
                        GetItemID: function (item) { return item.ID; },
                        GetItemTitle: function (item) { return item.Name; },
                        GetItemContainer: function (item) { return document.getElementById(item.ID); },
                        APIFunction: function (data, done) {
                            that.onSort(data.SortedIDs || [], function (result) { done(!!result); });
                        }
                    });

                    that.LoadingSortDialog = false;
                }
            });
        }
    }
})();