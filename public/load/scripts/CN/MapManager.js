(function () {
    if (window.MapManager) return;

    window.MapManager = function (container, params) {
        this.ContainerDiv = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            RemovedNodeTypesCheckbox: null,
            SearchInput: null,
            Panel: null
        };

        this.Objects = {
            IdentityFormID: params.IdentityFormID,
            ClassesTree: null,
            Panels: {}
        };
        
        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js", "TreeView/TreeView.js", "TabsManager/TabsManager.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    MapManager.prototype = {
        initialize: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Style: "height:calc(100vh - 6rem); padding:0 0.5rem;",
                Childs: [{
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; height:100%;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-5 large-4",
                            Style: "position:relative; height:100%; padding-top:5rem;" +
                                "padding-" + RV_RevFloat + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-circle SoftBackgroundColor",
                                    Style: "position:absolute; top:0rem; " + RV_RevFloat + ":0rem; bottom:0rem;" +
                                        "padding-" + RV_RevFloat + ":0.2rem;"
                                },
                                {
                                    Type: "div", Style: "position:absolute; top:0rem; left:1rem; right:1rem;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-bottom:0.5rem;",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle", Name: "editTree",
                                                    Properties: [{ Name: "onclick", Value: function () { that.node_types_edit(); } }],
                                                    Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                                                },
                                                {
                                                    Type: "div", Class: "small-8 medium-8 large-8", Style: "padding-" + RV_Float + ":1rem;",
                                                    Childs: [{
                                                        Type: "middle",
                                                        Childs: [
                                                            {
                                                                Type: "checkbox", Name: "archiveChb", Params: { OnChange: function () { _on_archive_chb_change(); } },
                                                                Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;"
                                                            },
                                                            { Type: "text", TextValue: RVDic.ShowRemovedItems }
                                                        ]
                                                    }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "input", Class: "rv-input", InnerTitle: RVDic.Search,
                                            Style: "width:100%; font-size:0.7rem;", Name: "searchInput",
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "height:100%;", Name: "nodeTypes"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-7 large-8", Name: "panel",
                            Style: "padding-" + RV_Float + ":0.5rem;"
                        }
                    ]
                }]
            }], that.ContainerDiv);

            that.Interface.RemovedNodeTypesCheckbox = elems["archiveChb"];
            that.Interface.SearchInput = elems["searchInput"];
            that.Interface.Panel = elems["panel"];

            var _on_archive_chb_change = function () {
                elems["editTree"].classList.remove("rv-air-button");
                elems["editTree"].classList.remove("rv-tab-disabled");

                elems["editTree"].classList.add(elems["archiveChb"].checked ? "rv-tab-disabled" : "rv-air-button");

                that.reset_node_types();
            };

            GlobalUtilities.set_onchangeorenter(elems["searchInput"], function () { that.reset_node_types(); });

            that.node_types_view(elems["nodeTypes"]);
        },

        reset_node_types: function () {
            var that = this;

            that.Objects.Panels = {};
            if (that.Objects.ClassesTree) that.Objects.ClassesTree.reset();

            if (that.Interface.Panel) {
                jQuery(that.Interface.Panel).fadeOut(500, function () {
                    that.Interface.Panel.innerHTML = "";
                    jQuery(that.Interface.Panel).fadeIn(500);
                });
            }
        },

        node_types_view: function (container) {
            var that = this;

            //append scrollbar
            var _div = GlobalUtilities.append_scrollbar(container, { AutoHeight: false });
            _div.style[RV_RTL ? "paddingLeft" : "paddingRight"] = "1.2rem";
            //end of append scrollbar

            var isArchive = false;

            that.Objects.ClassesTree = new TreeView(_div, {
                DataRequest: function (node, callback) {
                    var searchText = GlobalUtilities.trim(that.Interface.SearchInput.value);

                    CNAPI[searchText ? "GetNodeTypes" : "GetChildNodeTypes"]({
                        NodeTypeID: (node || {}).NodeTypeID, Count: 10000,
                        SearchText: !searchText ? null : Base64.encode(searchText),
                        Archive: (isArchive = that.Interface.RemovedNodeTypesCheckbox.checked),
                        ParseResults: true,
                        ResponseHandler: function (result) { callback(result.NodeTypes); }
                    });
                },
                Item: function (itm) {
                    return {
                        Name: itm.NodeTypeID,
                        Title: itm.TypeName,
                        Childs: itm.HasChild
                    };
                },
                TitleBuilder: function (itm, options) {
                    if (!isArchive) return null;

                    var itmElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                            Style: "position:relative; padding-" + RV_RevFloat + ":2rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.2rem;" + RV_RevFloat + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-recycle fa-lg rv-icon-button",
                                            Name: "recycleButton", Tooltip: RVDic.Recycle,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                { Type: "text", TextValue: Base64.decode(itm.Name || itm.TypeName) }
                            ]
                        }
                    ]);

                    var processing = false;

                    itmElems["recycleButton"].onclick = function (e) {
                        e.stopPropagation();

                        if (processing) return;

                        var ttl = GlobalUtilities.get_text_begining(Base64.decode(itm.Name || itm.TypeName), 100, "...");
                        var msg = RVDic.Confirms.DoYouWantToRecycleTheN.replace("[n]", ttl);

                        GlobalUtilities.confirm(msg, function (r) {
                            if (!r) return;

                            processing = true;

                            CNAPI.RecoverNodeType({
                                NodeTypeID: itm.NodeTypeID, ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    else if (result.Succeed) {
                                        options.Remove();

                                        if (that.is_active_panel(itm)) {
                                            jQuery(that.Interface.Panel).fadeOut(500, function () {
                                                that.Interface.Panel.innerHTML = "";
                                                jQuery(that.Interface.Panel).fadeIn(0);
                                            });
                                        }
                                    }

                                    processing = false;
                                }
                            });
                        });
                    };

                    return itmElems["container"];
                },
                OnClick: function (e, item, done) {
                    that.show_panel(item);
                    done();
                }
            });
        },

        tree_edit_help_button: function () {
            var that = this;

            return {
                Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                Childs: [
                    {
                        Type: "div", Style: "margin-bottom:1rem; font-size:0.7rem;",
                        Class: "small-8 medium-6 large-4 rv-air-button-base rv-air-button-black " +
                            "rv-border-radius-quarter Direction",
                        Properties: [{ Name: "onclick", Value: function (e) { GlobalUtilities.help_request(e, "systemsettings_edittree"); } }],
                        Childs: [
                            { Type: "i", Class: "fa fa-question-circle-o fa-lg", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                            { Type: "text", TextValue: RVDic.EditTreeGuide }
                        ]
                    }
                ]
            };
        },

        node_types_edit: function () {
            var that = this;

            if (that.Interface.RemovedNodeTypesCheckbox.checked) return;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        that.tree_edit_help_button(),
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div", Style: "overflow:hidden;" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["_div"]);
            GlobalUtilities.show(elems["container"], { OnClose: function () { that.reset_node_types(); } });

            GlobalUtilities.load_files([
                "API/CNAPI.js",
                { Root: "TreeViewContainer/", Ext: "js", Childs: ["TreeViewContainer", "TreeMaker"] }
            ], {
                OnLoad: function () {
                    elems["_div"].innerHTML = "";

                    new TreeMaker({
                        ContainerDiv: elems["_div"],
                        FailureAlert: "Communication with server failed",
                        NewNodeDefaultTitle: RVDic.NewN.replace("[n]", RVDic.NodeType),
                        RequestHandler: CNAPI.ResponseURL,
                        Command: "Command",
                        GetNodes: "GetChildNodeTypes",
                        CreateNode: "AddNodeType",
                        ChangeNode: "RenameNodeType",
                        MoveNode: "MoveNodeType",
                        RemoveNode: "RemoveNodeType",
                        InitialGet: true,
                        DeleteConfirmation: true,
                        RemoveHierarchyConfirmation: true,
                        DeleteConfirmationAlert: RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.NodeType),
                        StringConstants: { Nodes: "NodeTypes", NodeID: "NodeTypeID", NodeIDs: "NodeTypeIDs", ParentID: "ParentID", Title: "TypeName" },
                        Options: {
                            AjaxLoading: true,
                            RequestParams: { Archive: false },
                            AjaxResponseParser: function (responseText) {
                                var result = JSON.parse(responseText);
                                var items = result.NodeTypes || [];
                                
                                var arr = [];
                                for (var i = 0, lnt = items.length; i < lnt; ++i) {
                                    items[i].TypeName = Base64.decode(items[i].TypeName || "");

                                    arr.push({ ID: items[i].NodeTypeID, Title: items[i].TypeName, HasChild: items[i].HasChild === true });
                                }

                                return arr;
                            }
                        },
                        OnSort: function (sortedItems, callback) {
                            CNAPI.SetNodeTypesOrder({
                                NodeTypeIDs: sortedItems.join('|'), ParseResults: true,
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

        is_active_panel: function (nodeType) {
            var that = this;

            return !!(that.Interface.Panel || {}).firstChild &&
                (that.Interface.Panel.firstChild == that.Objects.Panels[(nodeType || {}).NodeTypeID]);
        },

        show_panel: function (nodeType) {
            var that = this;

            if (that.is_active_panel(nodeType)) return;

            that.Objects.Panels = that.Objects.Panels || {};

            var hasInited = !!that.Objects.Panels[nodeType.NodeTypeID];

            var container = that.Objects.Panels[nodeType.NodeTypeID] =
                that.Objects.Panels[nodeType.NodeTypeID] || GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                    Style: "position:relative; height:100%; padding-top:3rem;"
                }])["_div"];

            var to = that.Interface.Panel.firstChild ? 500 : 0;

            jQuery(that.Interface.Panel).fadeOut(to, function () {
                that.Interface.Panel.innerHTML = "";
                that.Interface.Panel.appendChild(container);

                jQuery(that.Interface.Panel).fadeIn(500, function () {
                    if (!hasInited) that.init_panel(container, nodeType);
                });
            });
        },

        init_panel: function (container, nodeType) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "tabs",
                    Style: "position:absolute; top:0rem; left:0rem; right:0rem; height:2.5rem; overflow:hidden;"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 SoftBackgroundColor rv-border-radius-quarter", 
                    Style: "height:100%; padding:0.5rem;", Name: "content"
                }
            ], container);

            //append scrollbar
            var _div = GlobalUtilities.append_scrollbar(elems["content"], { AutoHeight: false });
            _div.style[RV_RTL ? "paddingLeft" : "paddingRight"] = "1.2rem";
            //end of append scrollbar

            var pages = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "general", Style: "margin:0rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "extensions", Style: "margin:0rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "service", Style: "margin:0rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "admins", Style: "margin:0rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "nodes", Style: "margin:0rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "complexes", Style: "margin:0rem;" },
                (!that.Objects.IdentityFormID ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "identity", Style: "margin:0rem;"
                })
            ], _div);

            //Initialize tabs
            var inited = { General: false, Extensions: false, Service: false, Admins: false, Nodes: false, Complexes: false, Identity: false };

            var tabs = [];

            tabs.push({
                Page: pages["general"], Title: RVDic.General, FixedPage: true,
                OnActive: function (ind) {
                    if (inited.General) return;
                    inited.General = true;

                    that.general_info(pages["general"], nodeType);
                }
            });

            tabs.push({
                Page: pages["extensions"], Title: RVDic.Extensions, FixedPage: true,
                OnActive: function (ind) {
                    if (inited.Extensions) return;
                    inited.Extensions = true;

                    that.extensions(pages["extensions"], nodeType);
                }
            });

            tabs.push({
                Page: pages["service"], Title: RVDic.ServiceSettings, FixedPage: true,
                OnActive: function (ind) {
                    if (inited.Service) return;
                    inited.Service = true;

                    that.service(pages["service"], nodeType);
                }
            });

            tabs.push({
                Page: pages["admins"], Title: RVDic.CN.Service.ServiceAdmins, FixedPage: true,
                OnActive: function (ind) {
                    if (inited.Admins) return;
                    inited.Admins = true;

                    that.service_admins(pages["admins"], GlobalUtilities.extend({ ServiceAdminMode: true }, nodeType));
                }
            });

            tabs.push({
                Page: pages["nodes"], Title: RVDic.Nodes, FixedPage: true,
                OnActive: function (ind) {
                    if (inited.Nodes) return;
                    inited.Nodes = true;

                    that.nodes(pages["nodes"], nodeType);
                }
            });

            tabs.push({
                Page: pages["complexes"], Title: RVDic.Complexes, FixedPage: true,
                OnActive: function (ind) {
                    if (inited.Complexes) return;
                    inited.Complexes = true;

                    that.complexes(pages["complexes"], nodeType);
                }
            });
            
            if (that.Objects.IdentityFormID) {
                tabs.push({
                    Page: pages["identity"], Title: RVDic.Specifications, FixedPage: true,
                    OnActive: function (ind) {
                        if (inited.Identity) return;
                        inited.Identity = true;

                        that.identity(pages["identity"], nodeType);
                    }
                });
            }

            (new TabsManager({ ContainerDiv: elems["tabs"], Pages: tabs })).goto_page(0);
            //end of tabs initialization
        },

        general_info: function (container, nodeType) {
            var that = this;

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["CN/NodeTypeGeneralInfoManager.js"], {
                OnLoad: function () {
                    container.innerHTML = "";
                    new NodeTypeGeneralInfoManager(container, { NodeType: nodeType });
                }
            });
        },

        extensions: function (container, nodeType) {
            var that = this;

            GlobalUtilities.loading(container);
            
            GlobalUtilities.load_files(["CN/CNExtensions.js"], {
                OnLoad: function () {
                    new CNExtensions(container, {
                        NodeTypeID: nodeType.NodeTypeID,
                        NodeType: Base64.decode(nodeType.Name || nodeType.TypeName)
                    });
                }
            });
        },

        service: function (container, nodeType) {
            var that = this;
            
            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["CN/NodeTypeService.js"], {
                OnLoad: function () {
                    new NodeTypeService(container, {
                        NodeTypeID: nodeType.NodeTypeID, Modules: (window.RVGlobal || {}).Modules || {}
                    });
                }
            });
        },

        service_admins: function (container, nodeType) {
            var that = this;

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["CN/SpecialUsers.js"], {
                OnLoad: function () {
                    container.innerHTML = "";
                    new SpecialUsers(container, nodeType);
                }
            });
        },

        complexes: function (container, nodeType) {
            var that = this;

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["CN/CNListsManager.js"], {
                OnLoad: function () {
                    new CNListsManager(container, {
                        NodeTypeID: nodeType.NodeTypeID,
                        NodeType: Base64.decode(nodeType.Name || nodeType.TypeName)
                    });
                }
            });
        },

        identity: function (container, nodeType) {
            var that = this;

            GlobalUtilities.loading(container);
            
            GlobalUtilities.load_files(["API/FGAPI.js"], {
                OnLoad: function () {
                    FGAPI.InitializeOwnerFormInstance({
                        OwnerID: nodeType.NodeTypeID, FormID: that.Objects.IdentityFormID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                container.innerHTML = "<div style='text-align:center; font-weight:bold;'>" +
                                    RVDic.MSG[result.ErrorText] || result.ErrorText + "</div>";
                                return;
                            }

                            GlobalUtilities.load_files(["FormsManager/FormViewer.js",], {
                                OnLoad: function () {
                                    new FormViewer(container, {
                                        InstanceID: result.InstanceID,  Editable: true,
                                        ElementsEditable: true, HideDescription: true, FillButton: false
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },

        nodes: function (container, nodeType) {
            var that = this;

            var _create_button = function (title, name) {
                return {
                    Type: "div", Class: "small-12 medium-6 large-6",
                    Style: "padding:0rem 0.5rem; margin-bottom:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                            Style: "margin:0rem auto; height:100%;", Name: name,
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: title }] }]
                        }
                    ]
                };
            };
            
            var elems = GlobalUtilities.create_nested_elements([
                _create_button("+ " + RVDic.Add, "newNode"),
                _create_button(RVDic.TreeEdit, "treeEdit"),
                _create_button("+ " + RVDic.ImportViaExcel, "importExcel"),
                (!RVGlobal.Modules.FG ? null : _create_button("+ " + RVDic.ImportViaXML, "importXML")),
                { Type: "div", Class: "small-12 medium-6 large-6" },
                {
                    Type: "div", Class: "small-12 medium-6 large-6",
                    Style: "padding:0rem 0.5rem; margin-bottom:0.5rem;",
                    Childs: [
                        {
                            Type: "middle", Style: "text-align:center;",
                            Childs: [
                                {
                                    Type: "checkbox", Name: "archiveChb",
                                    Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;",
                                    Params: { OnChange: function () { reset(); }}
                                },
                                { Type: "text", TextValue: RVDic.ShowRemovedItems }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-8 medium-7 large-6",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "searchInput",
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.SearchText,
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-4 medium-5 large-6 RevDirection RevTextAlign",
                            Childs: [
                                {
                                    Type: "middle", Class: "Direction TextAlign", Name: "totalCount",
                                    Style: "display:inline-block; font-weight:bold;"
                                }
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;", Name: "nodesList" }
            ], container);

            elems["importExcel"].onclick = function () {
                that.import_dialog(nodeType, function () { reset(); });
            };

            elems["importXML"].onclick = function () {
                that.import_xml_dialog(nodeType, function () { reset(); });
            };

            elems["treeEdit"].onclick = function () {
                that.tree_nodes_edit(nodeType, function () { reset(); });
            };

            that.new_node_dialog(elems["newNode"], nodeType, function (nd) {
                if (listViewer) {
                    nd.Add2Top = true;
                    listViewer.add_item(nd);
                    total_count(total_count() + 1);
                }
            });

            GlobalUtilities.loading("nodesList");

            var listViewer = null;

            GlobalUtilities.set_onchangeorenter(elems["searchInput"], function () { reset(); });

            var total_count = function (value) {
                if (GlobalUtilities.get_type(value) != "number") return Number(elems["totalCount"].TotalCount || "0");

                elems["totalCount"].TotalCount = value = value < 0 ? 0 : value;

                elems["totalCount"].innerHTML = RVDic.Count + ":<span style='color:red; margin-" + RV_Float + ":0.4rem;'>" +
                    GlobalUtilities.convert_numbers_to_persian(value) + "</span>";
            };

            var reset = function () {
                if (!listViewer) return;

                listViewer.clear();
                listViewer.data_request();
            };

            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                OnLoad: function () {
                    listViewer = new NewSimpleListViewer(elems["nodesList"], {
                        Options: {
                            Count: 20,
                            OnDataRequest: function (options, done) {
                                CNAPI.GetNodes(GlobalUtilities.extend(options || {}, {
                                    SearchText: Base64.encode(GlobalUtilities.trim(elems["searchInput"].value)),
                                    NodeTypeID: nodeType.NodeTypeID, Archive: elems["archiveChb"].checked, ParseResults: true,
                                    ResponseHandler: function (result) {
                                        total_count(+result.TotalCount);
                                        done(result.Nodes || []);
                                    }
                                }));
                            },
                            ItemBuilder: function (container, item, params) {
                                that.add_node(container, item, {
                                    OnAfterRemove: function () {
                                        params.OnAfterRemove();
                                        total_count(total_count() - 1);
                                    }
                                });
                                params.OnAfterAdd();
                            }
                        }
                    });
                }
            });
        },

        new_node_dialog: function (btn, nodeType, done) {
            var that = this;

            var saving = false;

            btn.onclick = function () {
                if (saving) return;
                saving = true;

                GlobalUtilities.load_files(["Public/NameDialog.js"], {
                    OnLoad: function () {
                        new NameDialog({
                            Title: RVDic.Name, InnerTitle: RVDic.Name,
                            OnActionCall: function (name, callback) {
                                if (!name) return callback(!(saving = false));

                                CNAPI.AddNode({
                                    NodeTypeID: nodeType.NodeTypeID, Name: Base64.encode(name), ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                        else if (result.Node) done(result.Node);

                                        callback(!!(result || {}).Node);

                                        saving = false;
                                    }
                                });
                            }
                        });
                    }
                });
            };
        },

        add_node: function (container, node, params) {
            var that = this;
            params = params || {};
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow SoftBorder",
                    Style: "position:relative; padding:0.3rem; margin-bottom:0.3rem; border-color:rgb(220,220,220);" +
                        "padding-" + RV_RevFloat + ":9rem; padding-" + RV_Float + ":3.5rem; cursor:pointer;",
                    Properties: [{ Name: "onclick", Value: function () { if (!editButton.__Editing) that.expand_node(node); } }],
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "i", Name: "removeButton", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                            Class: "fa " + (node.Archived ? "fa-recycle" : "fa-times") + " fa-lg rv-icon-button",
                                            Tooltip: node.Archived ? RVDic.Recycle : RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button",
                                            Tooltip: RVDic.Edit, Name: "editButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0.3rem;" +
                                "width:8rem; text-align:center; font-size:0.7rem; font-weight:bold; color:rgb(100,100,100);",
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: Base64.decode(node.AdditionalID) }] }]
                        },
                        {
                            Type: "div", Style: "display:inline-block;", Name: "viewArea",
                            Childs: [{ Type: "text", TextValue: Base64.decode(node.Name) }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "nameInput",
                                    Style: "width:100%; font-size:0.7rem;"
                                }
                            ]
                        }
                    ]
                }
            ]);

            if (node.Add2Top) container.insertBefore(elems["container"], container.firstChild);
            else container.appendChild(elems["container"]);

            //Remove button
            var removing = false;

            elems["removeButton"].onclick = function (e) {
                e.stopPropagation();

                if (removing) return;

                var msg = RVDic.Confirms[node.Archived ? "DoYouWantToRecycleTheN" : "DoYouWantToRemoveN"].replace("[n]", "'" +
                    GlobalUtilities.get_text_begining(Base64.decode(node.Name), 100, "...") + "'");

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;
                    removing = true;

                    CNAPI[node.Archived ? "RecycleNode" : "RemoveNode"]({
                        NodeID: node.NodeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                node.Archived = !node.Archived;
                                jQuery(elems["container"]).fadeOut(500, function () { this.remove(); });
                            }

                            removing = false;
                            params.OnAfterRemove();
                        }
                    });
                });
            };
            //end of Remove button

            //Edit button
            var editButton = elems["editButton"];

            var _set_data = function () {
                GlobalUtilities.set_text(elems["viewArea"], GlobalUtilities.get_text_begining(
                    GlobalUtilities.convert_numbers_to_persian(Base64.decode(node.Name)), 2000));

                elems["nameInput"].value = Base64.decode(node.Name);
            };

            var _on_edit = function (e) {
                if (e) e.stopPropagation();

                var set_things = function () {
                    elems["editArea"].style.display = editButton.__Editing ? "block" : "none";
                    elems["viewArea"].style.display = editButton.__Editing ? "none" : "inline-block";

                    _set_data();

                    if (editButton.__Editing) jQuery(elems["nameInput"]).focus().select();

                    editButton.setAttribute("class",
                        editButton.__Editing ? "fa fa-floppy-o fa-lg rv-icon-button" : "fa fa-pencil fa-lg rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newName = GlobalUtilities.trim(elems["nameInput"].value);

                    if (!newName) return;

                    GlobalUtilities.block(elems["container"]);

                    CNAPI.ModifyNodeName({
                        NodeID: node.NodeID, Name: Base64.encode(newName), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                node.Name = Base64.encode(newName);

                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(elems["container"]);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;

            _set_data();
            //end of Edit button
        },

        import_dialog: function (nodeType, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;" +
                                "font-weight:bold; margin-bottom:1rem; font-size:1rem; color:rgb(100,100,100); text-align:center;",
                            Childs: [
                                { Type: "text", TextValue: RVDic.ImportViaExcel },
                                { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_map_nodes_manynodesviaexcel" } }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; text-align:center; margin-bottom:1rem;",
                            Childs: [{
                                Type: "div", Class: "rv-air-button rv-circle", Name: "templateButton",
                                Style: "display:inline-block; padding:0.3rem 1.5rem; font-size:0.7rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.GetTemplateFile }]
                            }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "_div"
                        }
                    ]
                }
            ]);

            elems["templateButton"].onclick = function () {
                GlobalUtilities.submit_form({
                    URL: CNAPI.ExcelHeaders({ NodeTypeID: nodeType.NodeTypeID }),
                    RequestParams: {
                        Dic: Base64.encode(JSON.stringify({
                            node_name: Base64.encode(RVDic.Title),
                            node_id: Base64.encode(RVDic.AdditionalID),
                            node_parent_id: Base64.encode(RVDic.ParentNodeID),
                            node_tags: Base64.encode(RVDic.Keywords),
                            node_abstract: Base64.encode(RVDic.Abstract)
                        }))
                    }
                });
            };

            GlobalUtilities.loading(elems["_div"]);
            var showed = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["CN/CNImportFromExcel.js"], {
                OnLoad: function () {
                    new CNImportFromExcel(elems["_div"], {
                        NodeTypeID: nodeType.NodeTypeID,
                        OnFinish: function (elements) {
                            showed.Close();
                            if (done) done();
                        }
                    });
                }
            });
        },

        import_xml_dialog: function (nodeType, done) {
            var that = this;

            if (that.XMLImportDialog) return GlobalUtilities.show(that.XMLImportDialog, { OnClose: done });

            var _div = that.XMLImportDialog = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }
            ])["container"];

            GlobalUtilities.loading(_div);
            var showed = GlobalUtilities.show(_div, { OnClose: done });

            GlobalUtilities.load_files(["CN/CNImportFromXML.js"], {
                OnLoad: function () {
                    new CNImportFromXML(_div, { NodeTypeID: nodeType.NodeTypeID });
                }
            });
        },

        tree_nodes_edit: function (nodeType, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        that.tree_edit_help_button(),
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div", Style: "overflow:hidden;" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["_div"]);
            GlobalUtilities.show(elems["container"], { OnClose: function () { done(); } });

            GlobalUtilities.load_files([
                "API/CNAPI.js",
                { Root: "TreeViewContainer/", Ext: "js", Childs: ["TreeViewContainer", "TreeMaker"] }
            ], {
                OnLoad: function () {
                    elems["_div"].innerHTML = "";

                    new TreeMaker({
                        ContainerDiv: elems["_div"],
                        FailureAlert: "Communication with server failed",
                        NewNodeDefaultTitle: RVDic.NewN.replace("[n]",
                            Base64.decode(nodeType.Name || nodeType.TypeName) || RVDic.Node),
                        RequestHandler: CNAPI.ResponseURL,
                        Command: "Command",
                        OnDoubleClick: function (par) {
                            par = par || {};
                            that.expand_node({ NodeID: par.ID, Name: Base64.encode(par.Name) });
                        },
                        GetNodes: "GetChildNodes",
                        CreateNode: "AddNode&NodeTypeID=" + nodeType.NodeTypeID,
                        ChangeNode: "ModifyNodeName",
                        MoveNode: "SetDirectParent",
                        RemoveNode: "RemoveNode",
                        InitialGet: true,
                        DeleteConfirmation: true,
                        RemoveHierarchyConfirmation: true,
                        DeleteConfirmationAlert: RVDic.Confirms.DoYouWantToRemoveN.replace("[n]",
                            Base64.decode(nodeType.Name || nodeType.TypeName) || RVDic.Node),
                        StringConstants: { Nodes: "Nodes", NodeID: "NodeID", ParentID: "ParentNodeID", Title: "Name" },
                        Options: {
                            AjaxLoading: true,
                            RequestParams: { NodeTypeID: nodeType.NodeTypeID, IsTreeView: "true" },
                            AjaxResponseParser: function (result) { return CNAPI.ParseTreeNodes(result); }
                        },
                        OnSort: function (sortedItems, callback) {
                            CNAPI.SetNodesOrder({
                                NodeIDs: sortedItems.join('|'), ParseResults: true,
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

        expand_node: function (node) {
            var that = this;

            if (node.ExpandDiv) return GlobalUtilities.show(node.ExpandDiv);

            var _btn = function (name, data) {
                return {
                    Type: "div", Class: "small-12 medium-4 large-4", Style: "padding:0rem 0.5rem; margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle", Name: name,
                            Childs: data
                        }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 row rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold; text-align:center;",
                            Childs: [
                                { Type: "text", TextValue: Base64.decode(node.Name) },
                                {
                                    Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                                    Link: RVAPI.NodePageURL({ NodeID: node.NodeID }), Params: { IgnoreMouseEvents: true },
                                    Style: "display:inline-block; padding:0.3rem; background-color:white;" +
                                        "cursor:pointer; margin-" + RV_Float + ":0.5rem; font-size:0.6rem; color:rgb(80,80,80);",
                                    Childs: [{Type: "text", TextValue: RVDic.VisitPage}]
                                }
                            ]
                        },
                        _btn("members", [{ Type: "text", TextValue: RVDic.Members }]),
                        _btn("experts", [{ Type: "text", TextValue: RVDic.Experts }]),
                        _btn("privacy", [
                            {
                                Type: "i", Class: "fa fa-key", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            },
                            { Type: "text", TextValue: RVDic.Privacy }
                        ])
                    ]
                }
            ]);

            node.ExpandDiv = elems["_div"];
            GlobalUtilities.show(elems["_div"]);

            //Privacy
            elems["privacy"].onclick = function () {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container"
                    }
                ])["container"];

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                    OnLoad: function () {
                        _div.innerHTML = "";

                        var pv = new PermissionSetting(_div, {
                            ObjectID: node.NodeID,
                            Options: {
                                ConfidentialitySelect: true,
                                PermissionTypes: ["View", "ViewAbstract", "ViewRelatedItems", "Modify", "Delete", "Download"],
                                ObjectType: "Node",
                                OnSave: function (data) { }
                            }
                        });
                    }
                });
            };
            //end of Privacy

            //Members & Experts
            var _show_members_experts = function (expertMode) {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container"
                    }
                ]);

                GlobalUtilities.loading(_div["container"]);
                GlobalUtilities.show(_div["container"]);

                GlobalUtilities.load_files(["Ontology/OntologyMembersManager.js"], {
                    OnLoad: function () {
                        new OntologyMembersManager(_div["container"], {
                            NodeID: node.NodeID, Options: { ExpertsMode: expertMode, Editable: true }
                        });
                    }
                });
            };

            elems["members"].onclick = function () { _show_members_experts(false); };
            elems["experts"].onclick = function () { _show_members_experts(true); };
            //end of Members & Experts
        }
    };
})();