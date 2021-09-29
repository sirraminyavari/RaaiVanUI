(function () {
    if (window.CNExplorer) return;

    window.CNExplorer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};
        
        this.Interface = {
            Path: null,
            Toolbar: {
                Container: null,
                Buttons: {
                    Bookmark: null, Copy: null, Cut: null, Paste: null, Rename: null,
                    Remove: null, NewFolder: null, NewFile: null, NewVersion: null
                }
            },
            BookmarksButton: null,
            SearchInput: null,
            BackButton: null,
            ForwardButton: null,
            FolderTypesTitle: null,
            FolderTypes: null,
            DocumentTreesTitle: null,
            DocumentTrees: null,
            DocumentTreeNodesTitle: null,
            DocumentTreeNodes: null,
            FoldersTitle: null,
            FoldersContainer: null,
            Folders: null,
            FoldersMoreButton: null,
            ContentsTitle: null,
            ContentsContainer: null,
            Contents: null,
            ContentsMoreButton: null,
            NothingToDisplay: null
        };

        this.Objects = {
            ContentTypes: [],
            FolderTypes: [],
            DocumentTrees: [],
            SortFilters: [],
            Current: {
                PathLocation: -1,
                FolderTypes: {},
                DocumentTrees: {},
                DocumentTreeNodes: {},
                Folders: {},
                Contents: {},
                FoldersLowerBoundary: 1,
                ContentsLowerBoundary: 1
            },
            Paths: [],
            LastSearchedText: null,
            Permissions: {},
            Clipboard: null,
            Services: null
        };

        this.Options = {
            Count: 20,
            ItemWidthClass: params.ItemWidthClass || "small-12 medium-6 large-4",
            Selectable: { FolderType: false, DocumentTree: true, DocumentTreeNode: true, Folder: false, Content: true }
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js", "API/DocsAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    window.CNExplorer.prototype = {
        _preinit: function () {
            var that = this;

            //Change backspace behavior
            var inputTypes = function () { return /^((text)|(password)|(file)|(search)|(email)|(number)|(date))$/ig; }
            var cnt = 0;
            // Prevent the backspace key from navigating back.
            jQuery(document).unbind('keydown').bind('keydown', function (event) {
                //8: backspace, 37: left arrow, 39: right arrow
                var backAction = (!event.shiftKey && (event.keyCode === 8)) || (event.altKey && (event.keyCode === 37));
                var forwardAction = (event.shiftKey && (event.keyCode === 8)) || (event.altKey && (event.keyCode === 39));
                var search = event.ctrlKey && (event.keyCode === 70);

                if (!backAction && !forwardAction && !search) return;

                var doPrevent = false;
                var d = event.srcElement || event.target;
                
                var tagName = d.tagName.toLowerCase();
                var type = (d.type || "adfsdfdfsd").toLowerCase();

                if (((tagName == 'input') && inputTypes().test(type)) || (tagName == 'textarea'))
                    doPrevent = d.readOnly || d.disabled;
                else doPrevent = true;

                if (doPrevent) {
                    event.preventDefault();

                    if (backAction) that.back();
                    else if (forwardAction) that.forward();
                    else if (search) jQuery(that.Interface.SearchInput).focus();
                }
            });
            //end of Change backspace behavior

            that.Objects.ContentTypes = [
                { NodeTypeID: "", Name: "تجربه" },
                { NodeTypeID: "", Name: "مهارت" },
                { NodeTypeID: "", Name: "مستند" },
                { NodeTypeID: "", Name: "تک نگاشت" }
            ];

            that.Objects.SortFilters = [
                { Name: "name", Title: "نام" },
                { Name: "type", Title: "نوع" },
                { Name: "date", Title: "تاریخ" }
            ];

            var _decode_node_type = function (nt) {
                nt.Name = Base64.decode(nt.Name);
                for (var i = 0, lnt = (nt.Childs || []).length; i < lnt; ++i)
                    _decode_node_type(nt.Childs[i]);
                return nt;
            }

            if (((window.RVGlobal || {}).Modules || {}).DCT) {
                GlobalUtilities.load_files(["API/PrivacyAPI.js"], {
                    OnLoad: function () {
                        PrivacyAPI.CheckAuthority({
                            Permissions: "ContentsManagement", ParseResults: true,
                            ResponseHandler: function (result) {
                                that.Objects.Permissions["ContentsManagement"] = !!(result || {})["ContentsManagement"];
                                if (that.Objects.Permissions["ContentsManagement"]) that.set_toolbar_buttons_visibility();
                            }
                        });
                    }
                });
            }
            
            CNAPI.Explore({
                RegistrationArea: true, Tags: true, Relations: true, ParseResults: true, Count: 1000,
                ResponseHandler: function (result) {
                    var nodeTypes = result.NodeTypes || [];

                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        that.Objects.FolderTypes.push(_decode_node_type(nodeTypes[i]));

                    for (var i = 0, lnt = (result.DocumentTrees || []).length; i < lnt; ++i) {
                        that.Objects.DocumentTrees.push({
                            ID: result.DocumentTrees[i].ID,
                            Name: Base64.decode(result.DocumentTrees[i].Name)
                        });
                    }
                    
                    that._initialize();

                    that.get_services();
                }
            });
        },

        _initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var toolbarButtons = [];

            var _add_toolbar_button = function (p) {
                toolbarButtons.push({
                    Type: "div", Class: "rv-air-button rv-circle", Name: p.Name,
                    Style: "display:inline-block; margin:0.1rem; padding:0.1rem 1rem; font-size:0.65rem;",
                    Properties: [{ Name: "onclick", Value: function (e) { if (that[p.ClickFunc]) that[p.ClickFunc](e); } }],
                    Childs: !p.Icon ? [{ Type: "text", TextValue: p.Title }] : [
                        {
                            Type: "i", Class: "fa fa-" + p.Icon, Style: "margin-" + RV_RevFloat + ":0.2rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        },
                        { Type: "text", TextValue: p.Title }
                    ]
                });
            };

            ///////////////////////////////////////////////
            //TreeButton: for tree classes and nodes
            //ExpertsButton
            //MembersButton
            //FansButton
            ///////////////////////////////////////////////

            //_add_toolbar_button({ Name: "btnBookmark", Title: RVDic.Bookmark, Icon: "star", ClickFunc: "Bookmark" });
            _add_toolbar_button({ Name: "btnCopy", Title: RVDic.Copy || "copy", Icon: "files-o", ClickFunc: "Copy" });
            _add_toolbar_button({ Name: "btnCut", Title: RVDic.Cut || "cut", Icon: "scissors", ClickFunc: "Cut" });
            _add_toolbar_button({ Name: "btnPaste", Title: RVDic.Paste || "paste", Icon: "clipboard", ClickFunc: "Paste" });
            _add_toolbar_button({ Name: "btnRename", Title: RVDic.Rename || "rename", Icon: "pencil", ClickFunc: "Rename" });
            _add_toolbar_button({ Name: "btnRemove", Title: RVDic.Remove || "remove", Icon: "trash-o", ClickFunc: "Remove" });
            _add_toolbar_button({
                Name: "btnNewFolder",
                Title: RVDic.NewN.replace("[n]", RVDic.Folder),
                Icon: "plus",
                ClickFunc: "NewFolder"
            });
            _add_toolbar_button({
                Name: "btnNewFile",
                Title: RVDic.NewN.replace("[n]", RVDic.Document + "/" + RVDic.Knowledge),
                Icon: "plus",
                ClickFunc: "NewFile"
            });
            _add_toolbar_button({
                Name: "btnNewVersion",
                Title: RVDic.NewN.replace("[n]", RVDic.Version),
                Icon: "plus",
                ClickFunc: "NewVersion"
            });
            _add_toolbar_button({
                Name: "btnNewDocumentTree",
                Title: RVDic.NewN.replace("[n]", RVDic.Tree),
                Icon: "plus",
                ClickFunc: "NewDocumentTree"
            });

            var _create_separator = function (p) {
                p = p || {};

                var countId = GlobalUtilities.random_str(20);
                var buttonId = GlobalUtilities.random_str(20);

                var theCount = 0;

                return {
                    Type: "div", Class: "small-12 medium-12 large-12 WarmBackgroundColor", Name: p.Name,
                    Style: "position:relative; margin:1.5rem 0rem 1rem 0rem; padding-top:0.2rem;",
                    Properties: [
                        {
                            Name: "set_count",
                            Value: function (count) {
                                theCount = count < 0 ? 0 : count;
                                elems[countId].innerHTML = !theCount ? "" :
                                    "(" + GlobalUtilities.convert_numbers_to_persian(count) + ")";
                            }
                        },
                        {
                            Name: "add_count",
                            Value: function (count) {
                                this.set_count(theCount + count);
                                if (!theCount) this.fade_out();
                            }
                        },
                        {
                            Name: "fade_in",
                            Value: function (interval) {
                                jQuery(elems[p.Name]).fadeIn(interval);
                                elems[buttonId].setAttribute("class", "fa fa-chevron-up rv-icon-button");
                            }
                        },
                        {
                            Name: "fade_out",
                            Value: function (interval) {
                                jQuery(elems[p.Name]).fadeOut(interval);
                                this.set_count(0);
                            }
                        }
                    ],
                    Childs: [
                        {
                            Type: "div", Class: "rv-tab-selected rv-circle",
                            Style: "position:absolute; top:-0.6rem; height:1.4rem; font-size:0.6rem; cursor:default;" +
                                "background-color:white; font-weight:bold; padding-left:1rem; padding-right:1rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-chevron-up rv-icon-button",
                                    Style: "margin-" + RV_RevFloat + ":0.5rem;", Name: buttonId,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                var _cls = elems[p.ContainerName].style.display == "none" ? "fa-chevron-up" : "fa-chevron-down";
                                                this.setAttribute("class", "fa " + _cls + " rv-icon-button");
                                                jQuery(elems[p.ContainerName]).animate({ height: "toggle" }, 500);
                                            }
                                        }
                                    ]
                                },
                                { Type: "text", TextValue: p.Title },
                                { Type: "span", Style: "margin-" + RV_Float + ":0.3rem;", Name: countId }
                            ]
                        }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 row rv-border-radius-quarter SoftBorder SurroundingShadow",
                            Style: "margin:0rem; background-color:white; position:relative; border-color:rgb(200,200,200);" +
                                "padding-" + RV_RevFloat + ":4rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0.5rem;",
                                    Childs: [
                                        {
                                            Type: "middle", Style: "direction:ltr; text-align:left;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-arrow-circle-o-left fa-2x cn-explorer-nav cn-explorer-nav-disabled",
                                                    Name: window.RV_RTL ? "backButton" : "forwardButton",
                                                    Attributes: [{ Name: "aria-hidden", Value: "true" }]
                                                },
                                                {
                                                    Type: "i", Class: "fa fa-arrow-circle-o-right fa-2x cn-explorer-nav cn-explorer-nav-disabled",
                                                    Style: "margin-left:0.5rem;",
                                                    Name: window.RV_RTL ? "forwardButton" : "backButton",
                                                    Attributes: [{ Name: "aria-hidden", Value: "true" }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-8 medium-8 large-8 row",
                                    Style: "margin:0rem;", Name: "path"
                                },
                                {
                                    Type: "div", Class: "small-4 medium-4 large-4 row",
                                    Style: "margin:0rem; padding:0.3rem 0.5rem 0.3rem 0.5rem;" +
                                        "position:relative; padding-" + RV_Float + ":2rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0.4rem;" + RV_Float + ":0.3rem;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-star-o", Name: "bookmarksButton",
                                                    Style: "font-size:20px; color:black; cursor:pointer; display:none;",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "input", Class: "rv-input",
                                                    Style: "width:100%; font-size:0.7rem; padding:0.1rem 0.3rem;",
                                                    Name: "searchInput",
                                                    Attributes: [
                                                        { Name: "placeholder", Value: RVDic.Search },
                                                        { Name: "disabled", Value: "true" }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0.1rem 0 0 0; padding:0.2rem;", Name: "toolbar",
                            Childs: [
                                { Type: "div", Class: "small-12 medium-12 large-12", Childs: toolbarButtons },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-4",
                                    Style: "padding:0.5rem; display:none;", Name: "contentType"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-4",
                                    Style: "padding:0.5rem; display:none;", Name: "sortBy"
                                }
                            ]
                        }
                    ]
                },
                _create_separator({ Name: "folderTypesTitle", ContainerName: "folderTypes", Title: RVDic.NodeTypes }),
                { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "folderTypes" },
                _create_separator({ Name: "documentTreesTitle", ContainerName: "documentTrees", Title: RVDic.DocumentTrees }),
                { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "documentTrees" },
                _create_separator({ Name: "documentTreeNodesTitle", ContainerName: "documentTreeNodes", Title: RVDic.DocumentFolders }),
                { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "documentTreeNodes" },
                _create_separator({ Name: "foldersTitle", ContainerName: "foldersContainer", Title: RVDic.Folders }),
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "foldersContainer",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "folders" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0rem; margin-top:0.5rem;", Name: "foldersMoreButton"
                        }
                    ]
                },
                _create_separator({ Name: "contentsTitle", ContainerName: "contentsContainer", Title: RVDic.Contents }),
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "contentsContainer",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "contents" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0rem; margin-top:0.5rem;", Name: "contentsMoreButton"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin:0rem; margin-top:1rem; text-align:center; display:none;", Name: "nothing2display",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }
            ], that.Container);

            that.Interface.Toolbar.Container = elems["toolbar"];
            that.Interface.Toolbar.Buttons.Bookmark = elems["btnBookmark"];
            that.Interface.Toolbar.Buttons.Copy = elems["btnCopy"];
            that.Interface.Toolbar.Buttons.Cut = elems["btnCut"];
            that.Interface.Toolbar.Buttons.Paste = elems["btnPaste"];
            that.Interface.Toolbar.Buttons.Rename = elems["btnRename"];
            that.Interface.Toolbar.Buttons.Remove = elems["btnRemove"];
            that.Interface.Toolbar.Buttons.NewFolder = elems["btnNewFolder"];
            that.Interface.Toolbar.Buttons.NewFile = elems["btnNewFile"];
            that.Interface.Toolbar.Buttons.NewVersion = elems["btnNewVersion"];
            that.Interface.Toolbar.Buttons.NewDocumentTree = elems["btnNewDocumentTree"];

            that.Interface.BookmarksButton = elems["bookmarksButton"];
            that.Interface.Path = elems["path"];
            that.Interface.SearchInput = elems["searchInput"];
            that.Interface.BackButton = elems["backButton"];
            that.Interface.ForwardButton = elems["forwardButton"];
            that.Interface.FolderTypesTitle = elems["folderTypesTitle"];
            that.Interface.FolderTypes = elems["folderTypes"];
            that.Interface.DocumentTreesTitle = elems["documentTreesTitle"];
            that.Interface.DocumentTrees = elems["documentTrees"];
            that.Interface.DocumentTreeNodesTitle = elems["documentTreeNodesTitle"];
            that.Interface.DocumentTreeNodes = elems["documentTreeNodes"];
            that.Interface.FoldersTitle = elems["foldersTitle"];
            that.Interface.FoldersContainer = elems["foldersContainer"];
            that.Interface.Folders = elems["folders"];
            that.Interface.FoldersMoreButton = elems["foldersMoreButton"];
            that.Interface.ContentsTitle = elems["contentsTitle"];
            that.Interface.ContentsContainer = elems["contentsContainer"];
            that.Interface.Contents = elems["contents"];
            that.Interface.ContentsMoreButton = elems["contentsMoreButton"];
            that.Interface.NothingToDisplay = elems["nothing2display"];

            that.content_types(elems["contentType"]);
            that.sort_filters(elems["sortBy"]);

            that.Interface.BackButton.onclick = function () {
                that.back();
            };

            that.Interface.ForwardButton.onclick = function () {
                that.forward();
            };

            that.Interface.FoldersMoreButton.onclick = function () {
                if (that.Interface.FoldersMoreButton._loading) return;
                that.get_folders();
            };

            that.Interface.ContentsMoreButton.onclick = function () {
                if (that.Interface.ContentsMoreButton._loading) return;
                var pt = that.Objects.Paths[that.Objects.Current.PathLocation];

                if (pt[pt.length - 1].Type == "DocumentTreeNode") that.get_document_tree_node_contents();
                else that.get_contents();
            };

            //search
            var do_search = function () {
                if ((that.Objects.LastSearchedText === that.search_text()) || (that.Objects.Current.PathLocation < 0)) return;
                var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                that.fill({ PathItem: pt[pt.length - 1], Search: true });
            };

            GlobalUtilities.set_onchangeorenter(that.Interface.SearchInput, function () { do_search(); }, { Timeout: 1500 });
            //end of search

            that.fill();
        },

        fill: function (params) {
            params = params || {};
            var that = this;
            
            that.Objects.Current.FolderTypes = {};
            that.Objects.Current.DocumentTrees = {};
            that.Objects.Current.DocumentTreeNodes = {};
            that.Objects.Current.Folders = {};
            that.Objects.Current.Contents = {};
            that.Objects.Current.FoldersLowerBoundary = 1;
            jQuery(that.Interface.FoldersMoreButton).html("");
            that.Objects.Current.ContentsLowerBoundary = 1;
            jQuery(that.Interface.ContentsMoreButton).html("");

            if (params.Search) that.Objects.LastSearchedText = that.search_text();
            else {
                that.Objects.LastSearchedText = null;
                jQuery(that.Interface.SearchInput).val("");
            }
            
            if (that.Interface.FolderTypesTitle.fade_out) that.Interface.FolderTypesTitle.fade_out(0);
            jQuery(that.Interface.FolderTypes).fadeOut(0);
            if (that.Interface.DocumentTreesTitle.fade_out) that.Interface.DocumentTreesTitle.fade_out(0);
            jQuery(that.Interface.DocumentTrees).fadeOut(0);
            if (that.Interface.DocumentTreeNodesTitle.fade_out) that.Interface.DocumentTreeNodesTitle.fade_out(0);
            jQuery(that.Interface.DocumentTreeNodes).fadeOut(0);
            if (that.Interface.FoldersTitle.fade_out) that.Interface.FoldersTitle.fade_out(0);
            jQuery(that.Interface.FoldersContainer).fadeOut(0);
            if (that.Interface.ContentsTitle.fade_out) that.Interface.ContentsTitle.fade_out(0);
            jQuery(that.Interface.ContentsContainer).fadeOut(0);
            jQuery(that.Interface.NothingToDisplay).fadeOut(0);

            that.Interface.FolderTypes.innerHTML = that.Interface.DocumentTrees.innerHTML =
                that.Interface.DocumentTreeNodes.innerHTML = that.Interface.Folders.innerHTML =
                that.Interface.Contents.innerHTML = "";

            var pathItem = params.PathItem;
            if (!pathItem && ((that.Objects.FolderTypes.length + that.Objects.DocumentTrees.length) == 1)) {
                if (that.Objects.FolderTypes.length) {
                    pathItem = that.Objects.FolderTypes[0];
                    params.PathItemType = "FolderType";
                }
                else {
                    pathItem = that.Objects.DocumentTrees[0];
                    params.PathItemType = "DocumentTree";
                }
            }
            else pathItem = pathItem || {};
            
            var pathId = (pathItem || {}).ID || "root";
            var pathName = (pathItem || {}).Name ? pathItem.Name : RVDic.Root;
            var pathType = params.PathItemType || (pathItem || {}).Type;
            var pathChilds = pathItem.Childs || [];
            
            var oldPath = that.Objects.Current.PathLocation < 0 ? null : that.Objects.Paths[that.Objects.Current.PathLocation];

            //Update paths
            if (params.Back || params.Forward) {
                that.Objects.Current.PathLocation += params.Back ? -1 : 1;
                jQuery(that.Interface.SearchInput).val("");

                var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                pathId = pt[pt.length - 1].ID;
                pathName = pt[pt.length - 1].Name;
                pathType = pt[pt.length - 1].Type;
                pathChilds = pt[pt.length - 1].Childs;
            }
            else if(!params.Search) { //traversing
                var pathsArr = [];
                for (var i = 0; i <= that.Objects.Current.PathLocation; ++i)
                    pathsArr.push(that.Objects.Paths[i]);

                var pathHist = [];

                var pathExists = false;
                
                if (that.Objects.Current.PathLocation >= 0) {
                    for (var i = 0; i < that.Objects.Paths[that.Objects.Current.PathLocation].length; ++i) {
                        var itm = that.Objects.Paths[that.Objects.Current.PathLocation][i];
                        pathHist.push(itm);
                        if (itm.ID == pathId) {
                            pathExists = true;
                            break;
                        }
                    }
                }
                
                if (!pathExists) {
                    var ind = -1;
                    for (var i = 0, lnt = (params.Path || []).length; i < (lnt - 1); ++i)
                        if ((pathHist.length > 0) && (pathHist[pathHist.length - 1].ID == params.Path[i].ID)) ind = i;

                    for (var i = ind + 1, lnt = (params.Path || []).length; i < (lnt - 1) ; ++i) {
                        pathHist.push({
                            TreeID: params.Path[i].TreeID,
                            ID: params.Path[i].ID,
                            Name: params.Path[i].Name,
                            Type: params.Path[i].Type || "Folder"
                        });
                    }

                    pathHist.push(GlobalUtilities.extend(pathItem || {}, {
                        ID: pathId, Name: pathName,
                        Type: params.PathItemType, Childs: pathChilds
                    }));
                }

                that.Objects.Current.PathLocation++;
                pathsArr.push(pathHist);
                that.Objects.Paths = pathsArr;
            }
            
            that.show_path(function () {
                var isRoot = pathId == "root";
                var isDocumentTree = !isRoot && (pathType == "DocumentTree");
                var isDocumentTreeNode = !isRoot && (pathType == "DocumentTreeNode");
                var isFolder = !isRoot && (pathType == "Folder");
                var isFolderType = !isRoot && !isDocumentTree && !isDocumentTreeNode && !isFolder;
                
                that.nav_buttons_disabled();

                that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                
                if (isFolderType) {
                    jQuery(that.Interface.SearchInput).attr("disabled", false);

                    if ((pathChilds || []).length > 0) {
                        if (that.Interface.FoldersTitle.set_count) that.Interface.FolderTypesTitle.set_count(pathChilds.length);
                        if (that.Interface.FoldersTitle.fade_in) that.Interface.FolderTypesTitle.fade_in(0);
                        jQuery(that.Interface.FolderTypes).fadeIn(0);
                    }

                    for (var i = 0, lnt = (pathChilds || []).length; i < lnt; ++i)
                        that.add_folder_type(pathChilds[i]);

                    var nothingCount = 0;
                    
                    that.get_node_type_permissions(pathId, function () {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                    });

                    if ((pathChilds || []).length == 0)++nothingCount;
                    else that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });

                    that.get_folders(pathId, null, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 3)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });
                    
                    that.get_contents(pathId, null, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 3)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });
                }
                else if (isDocumentTree) {
                    jQuery(that.Interface.SearchInput).attr("disabled", false);

                    var hasSearchText = !!that.search_text();

                    that.get_document_tree_nodes(pathId, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (!hasSearchText ? true : ++nothingCount >= 2))
                            jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });

                    if (hasSearchText) that.get_document_tree_node_contents(pathId, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 2)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });
                }
                else if (isDocumentTreeNode) {
                    jQuery(that.Interface.SearchInput).attr("disabled", false);

                    if ((pathChilds || []).length > 0) {
                        if (that.Interface.DocumentTreeNodesTitle.set_count)
                            that.Interface.DocumentTreeNodesTitle.set_count(pathChilds.length);
                        if (that.Interface.DocumentTreeNodesTitle.fade_in) that.Interface.DocumentTreeNodesTitle.fade_in(0);
                        jQuery(that.Interface.DocumentTreeNodes).fadeIn(0);
                    }

                    var nothingCount = 0;

                    if ((pathChilds || []).length == 0)++nothingCount;
                    else that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });

                    that.get_document_tree_nodes(pathId, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 3)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });

                    that.get_document_tree_node_contents(pathId, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 3)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });
                }
                else if (isFolder) {
                    jQuery(that.Interface.SearchInput).attr("disabled", false);

                    var nothingCount = 0;
                    
                    that.get_node_permissions(pathId, function () {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                    });

                    that.get_document_trees(pathId, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 3)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });

                    that.get_folders(null, pathId, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 3)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });

                    that.get_contents(null, pathId, function (p) {
                        that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                        if (!(p || {}).Count && (++nothingCount >= 3)) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });
                }
                else if ((that.Objects.FolderTypes.length == 0) && (that.Objects.DocumentTrees.length == 0)) {
                    jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                }
                else if ((that.Objects.FolderTypes.length + that.Objects.DocumentTrees.length) == 1) {
                    jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                }
                else if ((that.Objects.FolderTypes.length > 0) || (that.Objects.DocumentTrees.length > 0)) {
                    jQuery(that.Interface.SearchInput).attr("disabled", true);

                    if (that.Objects.FolderTypes.length > 0) {
                        if (that.Interface.FoldersTitle.set_count)
                            that.Interface.FolderTypesTitle.set_count(that.Objects.FolderTypes.length);
                        if (that.Interface.FoldersTitle.fade_in) that.Interface.FolderTypesTitle.fade_in(0);
                        jQuery(that.Interface.FolderTypes).fadeIn(0);
                    }
                    if (that.Objects.DocumentTrees.length > 0) {
                        if (that.Interface.DocumentTreesTitle.set_count)
                            that.Interface.DocumentTreesTitle.set_count(that.Objects.DocumentTrees.length);
                        if (that.Interface.DocumentTreesTitle.fade_in) that.Interface.DocumentTreesTitle.fade_in(0);
                        jQuery(that.Interface.DocumentTrees).fadeIn(0);
                    }

                    for (var i = 0, lnt = that.Objects.FolderTypes.length; i < lnt; ++i)
                        that.add_folder_type(that.Objects.FolderTypes[i]);

                    for (var i = 0, lnt = that.Objects.DocumentTrees.length; i < lnt; ++i)
                        that.add_document_tree(that.Objects.DocumentTrees[i]);

                    if ((that.Objects.FolderTypes.length == 0) && (that.Objects.DocumentTrees.length == 0))
                        jQuery(that.Interface.NothingToDisplay).fadeIn(500);

                    that.set_toolbar_buttons_visibility({ ID: pathId, Type: pathType });
                }
            });
            //end of Update paths
        },

        search_text: function () {
            var that = this;
            return GlobalUtilities.trim(that.Interface.SearchInput.value);
        },

        order_by: function () {
            return null;
        },

        order_by_desc: function () {
            return null;
        },

        back: function () {
            var that = this;
            if (that.Objects.Current.PathLocation <= 0) return;
            that.fill({ Back: true });
        },

        forward: function () {
            var that = this;
            if ((that.Objects.Current.PathLocation < 0) ||
                (that.Objects.Paths.length <= (that.Objects.Current.PathLocation + 1))) return;
            that.fill({ Forward: true });
        },

        nav_buttons_disabled: function () {
            var that = this;
            that.Interface.BackButton.classList[that.Objects.Current.PathLocation <= 0 ? "add" : "remove"]("cn-explorer-nav-disabled");
            that.Interface.ForwardButton.classList[(that.Objects.Current.PathLocation < 0) ||
                (that.Objects.Paths.length <= (that.Objects.Current.PathLocation + 1)) ? "add" : "remove"]("cn-explorer-nav-disabled");
        },

        get_services: function (callback) {
            var that = this;

            if (that.Objects.Services) return callback(that.Objects.Services);
            else if (that.__GettingServices) return callback(null);

            that.__GettingServices = true;

            CNAPI.GetServices({
                ParseResults: true,
                ResponseHandler: function (result) {
                    var services = result.Services || [];
                    
                    that.Objects.Services = { Array: services };

                    for (var i = 0; i < services.length; ++i)
                        that.Objects.Services[services[i].NodeTypeID] = services[i];
                    
                    if (callback) callback(that.Objects.Services);

                    that.__GettingServices = false;
                }
            });
        },

        get_node_type_permissions: function (nodeTypeId, callback) {
            var that = this;
            
            if (that.Objects.Permissions[nodeTypeId]) return callback(that.Objects.Permissions[nodeTypeId]);
            
            CNAPI.GetService({
                NodeTypeID: nodeTypeId, ParseResults: true,
                ResponseHandler: function (result) {
                    callback(that.Objects.Permissions[nodeTypeId] = result || {});
                }
            });
        },

        get_node_permissions: function (nodeId, callback) {
            var that = this;
            
            if (that.Objects.Permissions[nodeId]) return callback(that.Objects.Permissions[nodeId]);
            
            CNAPI.GetNodeInfo({
                NodeID: nodeId, Extensions: true, Service: true, UserStatus: true, ParseResults: true,
                ResponseHandler: function (result) {
                    result = result || {};
                    
                    var exts = {};
                    for (var i = 0; i < (result.Extensions || []).length; ++i)
                        exts[result.Extensions[i].Extension] = true;
                    result.Extensions = exts;
                    
                    result.IsDocument = !!(result.Service || {}).IsDocument;
                    result.IsKnowledge = !!(result.Service || {}).IsKnowledge;
                    result.IsTree = !!(result.Service || {}).IsTree;
                    result.IsServiceAdmin = !!(result.UserStatus || {}).IsServiceAdmin;
                    result.IsAreaAdmin = !!(result.UserStatus || {}).IsAreaAdmin;
                    result.IsCreator = !!(result.UserStatus || {}).IsCreator;
                    result.IsContributor = !!(result.UserStatus || {}).IsContributor;
                    result.IsExpert = !!(result.UserStatus || {}).IsExpert;
                    result.IsMember = !!(result.UserStatus || {}).IsMember;
                    result.IsAdminMember = !!(result.UserStatus || {}).IsAdminMember;
                    result.Editable = !!(result.UserStatus || {}).Editable;

                    result.IsAdmin = !!((window.RVGlobal || {}).IsSystemAdmin || result.IsServiceAdmin || result.IsAreaAdmin);
                    
                    that.Objects.Permissions[nodeId] = result;
                    
                    callback(result);
                }
            });
        },

        get_document_tree_permissions: function (treeId, callback) {
            var that = this;
            
            if (that.Objects.Permissions[treeId]) return callback(that.Objects.Permissions[treeId]);

            callback(that.Objects.Permissions[treeId] = {
                Editable: !!(window.RVGlobal || {}).IsSystemAdmin || !!(that.Objects.Permissions || {})["ContentsManagement"]
            });
        },

        find_path_item_type_permissions: function (type) {
            var that = this;
            var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
            for (var i = (pt || []).length - 1; i >= 0; --i) {
                if (pt[i].Type == type)
                    return GlobalUtilities.extend(that.Objects.Permissions[pt[i].ID] || {}, { PathItem: pt[i] });
            }
            return null;
        },

        set_toolbar_buttons_visibility: function (pathItem) {
            var that = this;
            
            var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
            if (!pathItem && pt) pathItem = pt[pt.length - 1];
            if (pt && ((pt[pt.length - 1].ID || "root").toLowerCase() != (pathItem.ID || "root").toLowerCase())) return;
            
            if (!pathItem) pathItem = { ID: "root", Type: "root" };
            
            var pathType = pathItem.Type || "root";
            
            var selected = that.get_selected() || {};
            
            var helperDic = {
                Bookmark: { Paths: ["Folder", "DocumentTree", "DocumentTreeNode"] },
                Copy: {
                    Contents: { Single: true, Multiple: true },
                    DocumentTreeNodes: { Single: true, Multiple: true },
                    DocumentTrees: { Single: true, Multiple: true }
                },
                Cut: {
                    Contents: { Single: true, Multiple: true, ValidPaths: ["DocumentTreeNode"] },
                    DocumentTreeNodes: { Single: true, Multiple: true },
                    DocumentTrees: { Single: true, Multiple: true }
                },
                Paste: { Paths: ["Folder", "DocumentTree", "DocumentTreeNode"] },
                Rename: { DocumentTrees: { Single: true }, DocumentTreeNodes: { Single: true } },
                Remove: {
                    Contents: { Single: true, Multiple: true, ValidPaths: ["DocumentTreeNode"] },
                    DocumentTrees: { Single: true, Multiple: true },
                    DocumentTreeNodes: { Single: true, Multiple: true }
                },
                NewFolder: { Paths: ["FolderType", "Folder", "DocumentTree", "DocumentTreeNode"] },
                NewFile: { Paths: ["DocumentTreeNode"] },
                NewVersion: { Contents: { Single: true, ValidPaths: ["DocumentTreeNode"] }},
                NewDocumentTree: { Paths: ["root", "Folder"] }
            };

            helperDic.Bookmark.Permission = function () {
                return (pathItem.Type != "DocumentTree") || !!that.find_path_item_type_permissions("Folder");
            };

            helperDic.Copy.Permission = function () { return true; };

            helperDic.Cut.Permission = function () {
                if (!((window.RVGlobal || {}).Modules || {}).DCT) return false;

                var folderPermissions = that.find_path_item_type_permissions("Folder");

                if (folderPermissions)
                    return (folderPermissions.Extensions || {}).Documents && !!folderPermissions.IsAdmin;
                else {
                    var documentTreePermissions = that.find_path_item_type_permissions("DocumentTree") || {};
                    return !!documentTreePermissions.Editable;
                }
            };

            helperDic.Paste.Permission = function () {
                switch (pathItem.Type) {
                    case "Folder":
                        var folderPermissions = that.find_path_item_type_permissions("Folder") || {};
                        return !!((((that.Objects.Clipboard || {}).Contents || []).length > 0) && (folderPermissions.IsAdmin ||
                            folderPermissions.IsContributors || folderPermissions.IsCreator));
                    case "DocumentTree":
                    case "DocumentTreeNode":
                        if (!((window.RVGlobal || {}).Modules || {}).DCT) return false;
                        
                        var hasContent = ((that.Objects.Clipboard || {}).Contents || []).length > 0;
                        var hasDocTrees = ((that.Objects.Clipboard || {}).DocumentTrees || []).length > 0;
                        var hasDocTreeNodes = ((that.Objects.Clipboard || {}).DocumentTreeNodes || []).length > 0;
                        
                        if (!hasDocTrees && !hasDocTreeNodes && ((pathItem.Type == "DocumentTree") || !hasContent)) return false;
                        
                        var folderPermissions = that.find_path_item_type_permissions("Folder");

                        if (folderPermissions) {
                            if (!(folderPermissions.Extensions || {}).Documents) return false;

                            if (hasContent && !hasDocTrees && !hasDocTreeNodes)
                                return !!(folderPermissions.IsAdmin ||
                                    folderPermissions.IsContributors || folderPermissions.IsCreator);
                            else return !!folderPermissions.IsAdmin;
                        }
                        else
                            return !!that.Objects.Permissions["ContentsManagement"];
                    default:
                        return false;
                }
            };

            helperDic.Rename.Permission = function () {
                if (!((window.RVGlobal || {}).Modules || {}).DCT) return false;
                
                var folderPermissions = that.find_path_item_type_permissions("Folder");
                
                if (folderPermissions)
                    return (folderPermissions.Extensions || {}).Documents && !!folderPermissions.IsAdmin;
                else {
                    var itm = (selected.DocumentTrees || []).length ? selected.DocumentTrees[0] :
                        ((selected.DocumentTreeNodes || []).length ? selected.DocumentTreeNodes[0] : null);
                    return !!itm && (selected.TotalCount == 1) && !!that.Objects.Permissions["ContentsManagement"];
                }
            };

            helperDic.Remove.Permission = function () {
                if (!((window.RVGlobal || {}).Modules || {}).DCT) return false;

                var folderPermissions = that.find_path_item_type_permissions("Folder");

                if (folderPermissions) {
                    if (!(folderPermissions.Extensions || {}).Documents) return false;

                    if ((selected.Contents || []).length)
                        return !!folderPermissions.IsAdmin || !!folderPermissions.IsAdminMember;
                    else return !!folderPermissions.IsAdmin;
                }
                else {
                    var itm = (selected.DocumentTrees || []).length ? selected.DocumentTrees[0] :
                        ((selected.DocumentTreeNodes || []).length ? selected.DocumentTreeNodes[0] : null);
                    return !!itm && !(selected.Contents || []).length && !!that.Objects.Permissions["ContentsManagement"];
                }
            };

            helperDic.NewFolder.Permission = function () {
                switch (pathItem.Type) {
                    case "FolderType":
                    case "Folder":
                        var folderTypePermissions = that.find_path_item_type_permissions("FolderType") || {};

                        if (pathItem.Type == "Folder" && !folderTypePermissions.IsTree) return false;
                        
                        return (pathItem.Type == "FolderType" && folderTypePermissions.IsAdmin) ||
                            !!(that.Objects.Services || {})[pathItem.ID];
                    case "DocumentTree":
                    case "DocumentTreeNode":
                        if (!((window.RVGlobal || {}).Modules || {}).DCT) return false;

                        var folderPermissions = that.find_path_item_type_permissions("Folder");

                        if (folderPermissions) {
                            return (folderPermissions.Extensions || {}).Documents &&
                                !!(folderPermissions.IsAdmin || folderPermissions.IsMember ||
                                folderPermissions.IsExpert || folderPermissions.IsContributor);
                        }
                        else
                            return !!that.Objects.Permissions["ContentsManagement"];
                    default:
                        return false;
                }
            };

            helperDic.NewFile.Permission = function () {
                return !((window.RVGlobal || {}).Modules || {}).DCT || (pathItem.Type != "DocumentTreeNode") ? false :
                    GlobalUtilities.any(that.Objects.Services, function (s) { return s.IsDocument; });
            };

            helperDic.NewVersion.Permission = function () {
                if (!((window.RVGlobal || {}).Modules || {}).DCT) return false;
                
                if (pathItem.Type == "DocumentTreeNode") {
                    return (selected.TotalCount == 1) && ((selected.Contents || []).length == 1) &&
                        !!((that.Objects.Services || {})[(selected.Contents[0].Item || {}).NodeTypeID || "_"] || {}).IsDocument;
                }
                else return false;
            };

            helperDic.NewDocumentTree.Permission = function () {
                if (!((window.RVGlobal || {}).Modules || {}).DCT) return false;

                if (pathItem.Type == "Folder") {
                    var folderPermissions = that.find_path_item_type_permissions("Folder") || {};
                    return (folderPermissions.Extensions || {}).Documents && !!folderPermissions.IsAdmin;
                }
                else if ((pathItem.Type || "root").toLowerCase() == "root")
                    return !!that.Objects.Permissions["ContentsManagement"];
                
                return false;
            };

            var toBeShown = {};
            
            for (var name in helperDic) {
                if (helperDic[name].Permission && !helperDic[name].Permission()) continue;
                
                if (helperDic[name].All && (selected.TotalCount > 0) && (selected.TypesCount == 1) &&
                    (helperDic[name].All.Multiple || (helperDic[name].All.Single && (selected.TotalCount == 1))) &&
                    (!(helperDic[name].All.ValidPaths || []).length ||
                    GlobalUtilities.any(helperDic[name].All.ValidPaths, function (vp) { return vp == pathType; }))) {
                    toBeShown[name] = true;
                    continue;
                }
                else if ((helperDic[name].Paths || []).length && !(selected || {}).TotalCount &&
                    GlobalUtilities.any(helperDic[name].Paths, function (vp) { return vp == pathType; })) {
                    toBeShown[name] = true;
                    continue;
                }
                
                for (var container in helperDic[name]) {
                    if ((container == "All") || (container == "Paths") ||
                        (container == "Permission") || !that.Interface[container]) continue;

                    var selectedCount = (selected[container] || []).length;

                    var show = helperDic[name][container].Single && (selectedCount == 1) && (selected.TotalCount == 1);
                    show = show || (helperDic[name][container].Multiple && (selectedCount > 0) &&
                        (selectedCount == selected.TotalCount));
                    if (show && (helperDic[name][container].ValidPaths || []).length)
                        show = GlobalUtilities.any(helperDic[name][container].ValidPaths, function (vp) { return vp == pathType; });

                    if (show) {
                        toBeShown[name] = true;
                        break;
                    }
                }
            }
            
            jQuery(that.Interface.Toolbar.Container).fadeOut(0);

            for (var btn in that.Interface.Toolbar.Buttons) {
                if (toBeShown[btn]) jQuery(that.Interface.Toolbar.Container).fadeIn(0);
                jQuery(that.Interface.Toolbar.Buttons[btn])[toBeShown[btn] ? "fadeIn" : "fadeOut"](toBeShown[btn] ? 500 : 0);
            }
        },

        Bookmark: function () {
            var that = this;
            var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
            if (pt && pt.length) pt[pt.length - 1].bookmark();
        },

        Copy: function () {
            var that = this;
            var selected = that.get_selected() || {};
            if (selected.TotalCount) that.Objects.Clipboard = GlobalUtilities.extend({}, selected);
        },

        Cut: function () {
            var that = this;
            var selected = that.get_selected();

            var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
            if (pt && pt.length) pt = pt[pt.length - 1];

            if ((selected || {}).TotalCount && (pt || {}).ID) {
                that.Objects.Clipboard = GlobalUtilities.extend({
                    Cut: true,
                    RemoveFrom: pt.ID
                }, selected);
            }
            else that.Objects.Clipboard = null;
        },

        Paste: function () {
            var that = this;

            if (processing) return;

            var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
            if (pt && pt.length) pt = pt[pt.length - 1];
            
            var clip = that.Objects.Clipboard || {};
            
            var isContent = (clip.Contents || []).length;
            var isTreeNode = (clip.DocumentTreeNodes || []).length;
            var isDocTree = (clip.DocumentTrees || []).length;

            if ((clip.TypesCount != 1) || (!isContent && !isTreeNode && !isDocTree)) return;

            var ids = [];
            var array = isContent ? clip.Contents : (isTreeNode ? clip.DocumentTreeNodes : clip.DocumentTrees);

            jQuery.each(array, function (ind, val) { ids.push(val.ID); });

            var removeFrom = clip.Cut ? clip.RemoveFrom : null;
            
            var processing = true;

            if (isContent && (pt.Type == "Folder")) {
                CNAPI.AddRelation({
                    SourceNodeID: pt.ID, DestinationNodeIDs: ids.join("|"), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            if (((that.find_path_item_type_permissions("Folder") || {}).PathItem || {}).ID == pt.ID) {
                                jQuery(that.Interface.NothingToDisplay).fadeOut(0);
                                if (that.Interface.ContentsTitle.add_count) that.Interface.ContentsTitle.add_count(array.length);
                                if (that.Interface.ContentsTitle.fade_in) that.Interface.ContentsTitle.fade_in(0);
                                jQuery(that.Interface.ContentsContainer).fadeIn(0);
                                jQuery.each(array.slice(0).reverse(), function (ind, val) { that.add_content(val.Item, true); });
                            }
                        }

                        processing = false;
                    }
                });
            }
            else if (isContent && (pt.Type == "DocumentTreeNode")) {
                DocsAPI.AddTreeNodeContents({
                    TreeNodeID: pt.ID, NodeIDs: ids.join("|"), RemoveFrom: removeFrom, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            if (((that.find_path_item_type_permissions("DocumentTreeNode") || {}).PathItem || {}).ID == pt.ID) {
                                jQuery(that.Interface.NothingToDisplay).fadeOut(0);
                                if (that.Interface.ContentsTitle.add_count) that.Interface.ContentsTitle.add_count(array.length);
                                if (that.Interface.ContentsTitle.fade_in) that.Interface.ContentsTitle.fade_in(0);
                                jQuery(that.Interface.ContentsContainer).fadeIn(0);
                                jQuery.each(array.slice(0).reverse(), function (ind, val) { that.add_content(val.Item, true); });
                            }
                        }

                        processing = false;
                    }
                });
            }
            else if ((isTreeNode || isDocTree) && ((pt.Type == "DocumentTree") || (pt.Type == "DocumentTreeNode"))) {
                DocsAPI[removeFrom ? "MoveTreeNodes" : "CopyTreeNodes"]({
                    DestinationID: pt.ID, CopiedIDs: ids.join("|"), MovedIDs: ids.join("|"), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            var curPathId = ((that.find_path_item_type_permissions("DocumentTreeNode") ||
                                that.find_path_item_type_permissions("DocumentTree") || {}).PathItem || {}).ID;

                            if (curPathId == pt.ID) {
                                jQuery(that.Interface.NothingToDisplay).fadeOut(0);
                                if (that.Interface.DocumentTreeNodesTitle.add_count)
                                    that.Interface.DocumentTreeNodesTitle.add_count((result.TreeNodes || []).length);
                                if (that.Interface.DocumentTreeNodesTitle.fade_in)
                                    that.Interface.DocumentTreeNodesTitle.fade_in(0);
                                jQuery(that.Interface.DocumentTreeNodes).fadeIn(0);
                                jQuery.each((result.TreeNodes || []).slice(0).reverse(), function (ind, val) {
                                    that.add_document_tree_node({
                                        TreeID: val.TreeID,
                                        ID: val.TreeNodeID,
                                        Name: Base64.decode(val.Title)
                                    }, null, true);
                                });

                            }
                        }

                        processing = false;
                    }
                });
            }
        },

        Rename: function () {
            var that = this;

            var selected = that.get_selected() || {};

            var item = (selected.DocumentTrees || []).length ? selected.DocumentTrees[0] :
                ((selected.DocumentTreeNodes || []).length ? selected.DocumentTreeNodes[0] : null);
            if (!item || (selected.TotalCount != 1)) return;

            var msg = RVDic.Confirms.DoYouWantToRenameN
                .replace("[n]", item.Type == "DocumentTree" ? RVDic.Tree : RVDic.SubCategory);

            that.name_dialog({
                Title: RVDic.Rename, InnerTitle: RVDic.Title, InitialValue: item.Item.Name, ConfirmMessage: msg,
                OnAPICall: function (name, callback) {
                    DocsAPI[item.Type == "DocumentTree" ? "RenameTree" : "RenameTreeNode"]({
                        TreeID: item.ID, TreeNodeID: item.ID, Title: Base64.encode(name), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                item.Rename(name);

                                if (item.Type == "DocumentTree") {
                                    for (var i = 0; i < (that.Objects.DocumentTrees || []).length; ++i) {
                                        if (that.Objects.DocumentTrees[i].ID == item.ID)
                                            that.Objects.DocumentTrees[i].Name = name;
                                    }
                                }
                            }

                            callback(!!(result || {}).Succeed);
                        }
                    });
                }
            });
        },

        Remove: function () {
            var that = this;

            var selected = that.get_selected() || {};
            var arr = selected.Contents || selected.DocumentTrees || selected.DocumentTreeNodes || [];

            if (that.__Removing || !selected.TotalCount || (selected.TypesCount != 1) || !arr.length) return;

            GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.SelectedItems), function (r) {
                if (!r) return;

                that.__Removing = true;

                var ids = [];

                for (var i = 0; i < arr.length; ++i) ids.push(arr[i].ID);

                var nodePermissions = that.find_path_item_type_permissions("Folder") || {};
                var docTreePermissions = that.find_path_item_type_permissions("DocumentTreeNode") || {};

                var apiFunction = selected.Contents ? "RemoveTreeNodeContents" : 
                    (selected.DocumentTrees ? "RemoveTree" : "RemoveTreeNode");

                DocsAPI[apiFunction]({
                    TreeIDs: ids.join("|"), OwnerID: (nodePermissions.PathItem || {}).ID,
                    NodeIDs: ids.join("|"), TreeOwnerID: (nodePermissions.PathItem || {}).ID,
                    RemoveHierarchy: true, TreeNodeID: (docTreePermissions.PathItem || {}).ID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            for (var i = 0; i < arr.length; ++i)
                                jQuery(arr[i].Container).fadeOut(500, function () { this.remove(); });

                            if (selected.Contents) {
                                if (that.Interface.ContentsTitle.add_count)
                                    that.Interface.ContentsTitle.add_count(-1 * ids.length);
                            }
                            else if (selected.DocumentTrees) {
                                if (that.Interface.DocumentTreesTitle.add_count)
                                    that.Interface.DocumentTreesTitle.add_count(-1 * ids.length);
                            }
                            else if (selected.DocumentTreeNodes) {
                                if (that.Interface.DocumentTreeNodesTitle.add_count)
                                    that.Interface.DocumentTreeNodesTitle.add_count(-1 * ids.length);
                            }

                            setTimeout(function () {
                                that.set_toolbar_buttons_visibility();
                                if (!(that.get_items() || {}).TotalCount) {
                                    if (that.Interface.FolderTypesTitle.fade_out) that.Interface.FolderTypesTitle.fade_out(0);
                                    jQuery(that.Interface.FolderTypes).fadeOut(0);
                                    if (that.Interface.DocumentTreesTitle.fade_out)
                                        that.Interface.DocumentTreesTitle.fade_out(0);
                                    jQuery(that.Interface.DocumentTrees).fadeOut(0);
                                    if (that.Interface.DocumentTreeNodesTitle.fade_out) 
                                        that.Interface.DocumentTreeNodesTitle.fade_out(0);
                                    jQuery(that.Interface.DocumentTreeNodes).fadeOut(0);
                                    if (that.Interface.FoldersTitle.fade_out) that.Interface.FoldersTitle.fade_out(0);
                                    jQuery(that.Interface.FoldersContainer).fadeOut(0);
                                    if (that.Interface.ContentsTitle.fade_out) that.Interface.ContentsTitle.fade_out(0);
                                    jQuery(that.Interface.ContentsContainer).fadeOut(0);

                                    jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                                }
                            }, 1000);
                        }

                        that.__Removing = false;
                    }
                });
            });
        },

        NewFolder: function () {
            var that = this;

            that.name_dialog({
                Title: RVDic.Title, InnerTitle: RVDic.Title, InitialValue: null,
                ConfirmMessage: function (name) { return RVDic.Confirms.DoYouWantToCreateN.replace("[n]", name); },
                OnAPICall: function (name, callback) {
                    var treeNode = (that.find_path_item_type_permissions("DocumentTreeNode") || {}).PathItem || {};
                    var tree = (that.find_path_item_type_permissions("DocumentTree") || {}).PathItem || {};
                    var folder = (that.find_path_item_type_permissions("Folder") || {}).PathItem || {};
                    var folderType = (that.find_path_item_type_permissions("FolderType") || {}).PathItem || {};

                    var parentId = tree.ID ? treeNode.ID : folder.ID;

                    var apiFunction = tree.ID ? DocsAPI.CreateTreeNode : CNAPI.AddNode;

                    apiFunction({
                        NodeTypeID: folderType.ID, TreeID: tree.ID, ParentNodeID: parentId, ParentID: parentId,
                        Name: Base64.encode(name), Title: Base64.encode(name), ParseResults: true,
                        ResponseHandler: function (result) {
                            result = result || {};

                            callback(!!result.Succeed);

                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                jQuery(that.Interface.NothingToDisplay).fadeOut(0);

                                if (!tree.ID) {
                                    if (that.Interface.FoldersTitle.add_count)
                                        that.Interface.FoldersTitle.add_count(1);
                                    if (that.Interface.FoldersTitle.fade_in) that.Interface.FoldersTitle.fade_in(0);
                                    jQuery(that.Interface.FoldersContainer).fadeIn(0);
                                    that.add_folder({ ID: result.NodeID, Name: name }, null, true);
                                }
                                else {
                                    if (that.Interface.DocumentTreeNodesTitle.add_count)
                                        that.Interface.DocumentTreeNodesTitle.add_count(1);
                                    if (that.Interface.DocumentTreeNodesTitle.fade_in)
                                        that.Interface.DocumentTreeNodesTitle.fade_in(0);
                                    jQuery(that.Interface.DocumentTreeNodes).fadeIn(0);
                                    that.add_document_tree_node({ TreeID: tree.ID, ID: result.TreeNodeID, Name: name }, null, true);
                                }
                            }
                        }
                    });
                }
            });
        },

        NewFile: function (service, previousVersion) {
            var that = this;

            //prepare tree node
            var docTree = (that.find_path_item_type_permissions("DocumentTree") || {}).PathItem;
            var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
            
            if (!docTree || !pt) return;

            var documentTreeNode = {
                ID: pt[pt.length - 1].ID,
                Tree: { ID: docTree.ID, Name: docTree.Name },
                Path: []
            };

            for (var i = pt.length - 1; i && (pt[i].Type == "DocumentTreeNode") ; --i)
                documentTreeNode.Path.push({ ID: pt[i].ID, Name: pt[i].Name });

            documentTreeNode.Path = documentTreeNode.Path.reverse();
            //end of prepare tree node

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            var showed = GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["CN/ServiceInitializer.js"], {
                OnLoad: function () {
                    new ServiceInitializer(_div, {
                        Services: service ||
                            ((that.Objects.Services || {}).Array || []).filter(function (s) { return !!s.IsDocument; }),
                        Modules: (window.RVGlobal || {}).Modules,
                        IsSystemAdmin: (window.RVGlobal || {}).IsSystemAdmin,
                        DocsOnly: true,
                        DocumentTreeNode: documentTreeNode,
                        PreviousVersion: previousVersion,
                        ShowRegisterDialogForSingleService: !!service,
                        OnServiceSelect: function () { showed.Close(); }
                    });
                }
            });
        },

        NewVersion: function () {
            var that = this;
            
            var selected = that.get_selected() || {};
            var service = that.Objects.Services.Array
                .filter(function (s) { return s.NodeTypeID == selected.Contents[0].Item.NodeTypeID });
            
            that.NewFile(service, { ID: selected.Contents[0].Item.ID, Name: selected.Contents[0].Item.Name });
        },

        NewDocumentTree: function () {
            var that = this;
            
            that.name_dialog({
                Title: RVDic.NewN.replace("[n]", RVDic.Tree), InnerTitle: RVDic.Title, InitialValue: null,
                ConfirmMessage: function (name) { return RVDic.Confirms.DoYouWantToCreateN.replace("[n]", name); },
                OnAPICall: function (name, callback) {
                    var folder = (that.find_path_item_type_permissions("Folder") || {}).PathItem || {};

                    DocsAPI.CreateTree({
                        OwnerID: folder.ID, Title: Base64.encode(name), ParseResults: true,
                        ResponseHandler: function (result) {
                            result = result || {};

                            callback(!!result.Succeed);

                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) that.add_document_tree({ ID: result.TreeID, Name: name }, true);
                        }
                    });
                }
            });
        },

        name_dialog: function (params) {
            params = params || {};
            var that = this;

            var title = params.Title;
            var innerTitle = params.InnerTitle;
            var initialValue = params.InitialValue;
            var onApiCall = params.OnAPICall;
            var confirmMessage = params.ConfirmMessage;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: title || RVDic.Title }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", InnerTitle: innerTitle || RVDic.Title,
                                    Style: "width:100%;", Name: "nameInput"
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-1 large-1" },
                        {
                            Type: "div", Class: "small-6 medium-4 large-4 rv-air-button rv-circle",
                            Style: "margin-top:1rem; padding:0.2rem 1rem;", Name: "confirm",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        },
                        { Type: "div", Class: "small-12 medium-2 large-2" },
                        {
                            Type: "div", Class: "small-6 medium-4 large-4 rv-air-button rv-circle",
                            Style: "margin-top:1rem; padding:0.2rem 1rem;", Name: "cancel",
                            Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                        },
                        { Type: "div", Class: "small-12 medium-1 large-1" }
                    ]
                }
            ]);

            var canceled = false;
            var processing = false;

            var _get_name = function () { return GlobalUtilities.trim(elems["nameInput"].value); };

            var _do = function () {
                var nm = _get_name();

                if (processing || !nm) return;

                if (initialValue && (nm == initialValue)) {
                    canceled = true;
                    showed.Close();
                }

                processing = true;

                onApiCall(nm, function (succeed) {
                    if (succeed) {
                        canceled = true;
                        showed.Close();
                    }

                    processing = false;
                });
            };

            GlobalUtilities.set_onenter(elems["nameInput"], function () { _do(); });

            elems["confirm"].onclick = function () { _do(); };

            elems["cancel"].onclick = function () {
                canceled = true;
                showed.Close();
            };

            var showed = GlobalUtilities.show(elems["container"], {
                OnShow: function () {
                    if (initialValue) {
                        elems["nameInput"].value = initialValue;
                        jQuery(elems["nameInput"]).focus().select();
                    }
                    else jQuery(elems["nameInput"]).focus();
                },
                OnClose: function () {
                    if (canceled) return;
                    var nm = _get_name();
                    if ((initialValue && nm && (nm != initialValue)) || (!initialValue && nm)) {
                        var msg = GlobalUtilities.get_type(confirmMessage) == "function" ? confirmMessage(nm) : confirmMessage;
                        GlobalUtilities.confirm(msg, function (r) { if (r) _do(); });
                    }
                }
            });
        },

        append_more_button: function (container) {
            container._loading = false;

            jQuery(container).html("");

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "background-color:rgb(240,240,240); color:rgb(120,120,120); padding:1rem 0rem 1rem 0rem;" +
                        "font-size:1rem; font-weight:bold; cursor:pointer; text-align:center;" + GlobalUtilities.border_radius("1rem"),
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.backgroundColor = "rgb(220,220,220)"; this.style.color = "rgb(40,40,40)"; } },
                        { Name: "onmouseout", Value: function () { this.style.backgroundColor = "rgb(240,240,240)"; this.style.color = "rgb(120,120,120)"; } }
                    ],
                    Childs: [{ Type: "text", TextValue: RVDic.More }]
                }
            ], container);
        },

        more_button_loading: function (container) {
            container._loading = true;
            jQuery(container).html("");
            GlobalUtilities.loading(container);
        },

        get_document_trees: function (nodeId, callback) {
            var that = this;

            var pathId = nodeId;

            var searchText = that.search_text();
            if (searchText || !((window.RVGlobal || {}).Modules || {}).DCT)
                return !callback ? null : callback({ Count: 0 });

            DocsAPI.GetOwnerTrees({
                OwnerID: pathId, ParseResults: true,
                ResponseHandler: function (result) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if (pathId != pt[pt.length - 1].ID) return;

                    var trees = result.Trees || [];

                    if (callback) callback({ Count: trees.length });

                    for (var i = 0, lnt = trees.length; i < lnt; ++i)
                        that.add_document_tree({ ID: trees[i].ID, Name: Base64.decode(trees[i].Title) });

                    if (trees.length > 0) {
                        if (that.Interface.DocumentTreesTitle.set_count) that.Interface.DocumentTreesTitle.set_count(trees.length);
                        if (that.Interface.DocumentTreesTitle.fade_in) that.Interface.DocumentTreesTitle.fade_in(0);
                        jQuery(that.Interface.DocumentTrees).fadeIn(0);
                    }
                }
            });
        },

        _get_document_tree_nodes: function (treeId, callback) {
            var that = this;

            var pathId = treeId;
            var searchText = that.search_text();

            DocsAPI.GetTreeNodes({
                TreeID: treeId, ParseResults: true,
                ResponseHandler: function (results) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if (pathId != pt[pt.length - 1].ID) return;

                    var treeNodes = results.TreeNodes || [];

                    if (callback) callback({ Count: treeNodes.length });

                    var newArr = [];

                    var _add_items = function (parentId, theArray) {
                        for (var i = 0, lnt = treeNodes.length; i < lnt; ++i) {
                            if (!(!parentId && !treeNodes[i].ParentID) && (parentId != treeNodes[i].ParentID)) continue;

                            var theItem = {
                                TreeID: treeId,
                                ID: treeNodes[i].TreeNodeID,
                                Name: Base64.decode(treeNodes[i].Title),
                                Childs: []
                            };

                            theArray.push(theItem);
                            _add_items(theItem.ID, theItem.Childs);
                        }
                    };

                    _add_items(null, newArr);
                    
                    for (var i = 0, lnt = newArr.length; i < lnt; ++i)
                        that.add_document_tree_node(newArr[i]);

                    if (newArr.length > 0) {
                        if (that.Interface.DocumentTreeNodesTitle.set_count) that.Interface.DocumentTreeNodesTitle.set_count(newArr.length);
                        if (that.Interface.DocumentTreeNodesTitle.fade_in) that.Interface.DocumentTreeNodesTitle.fade_in(0);
                        jQuery(that.Interface.DocumentTreeNodes).fadeIn(0);
                    }
                }
            });
        },

        get_document_tree_nodes: function (pathId, callback) {
            var that = this;

            pathId = that.__ExploreDocTreeIDOrTreeNodeID = pathId || that.__ExploreDocTreeIDOrTreeNodeID;

            var searchText = that.search_text();

            var treeId = ((that.find_path_item_type_permissions("DocumentTree") || {}).PathItem || {}).ID;
            var treeNodeId = ((that.find_path_item_type_permissions("DocumentTreeNode") || {}).PathItem || {}).ID;

            DocsAPI.GetChildNodes({
                TreeID: treeId, TreeNodeID: treeNodeId, SearchText: Base64.encode(searchText),
                ParseResults: true,
                ResponseHandler: function (result) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if (pathId != pt[pt.length - 1].ID) return;

                    var nodes = result.TreeNodes || [];
                    
                    if (callback) callback({ Count: nodes.length });

                    for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                        that.add_document_tree_node({
                            TreeID: treeId,
                            ID: nodes[i].TreeNodeID,
                            Name: Base64.decode(nodes[i].Title)
                        }, !searchText ? null : function (tn, cb) {
                            that.__PathCache = that.__PathCache || {};

                            if (that.__PathCache[tn.ID]) return cb(that.__PathCache[tn.ID]);

                            DocsAPI.GetParentNodes({
                                TreeNodeID: tn.ID, ParseResults: true,
                                ResponseHandler: function (result) {
                                    var nodes = (result.TreeNodes || []).sort(function (f, s) { return f.Level < s.Level; });
                                    var arrp = [];
                                    for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                                        nodes[i].Name = Base64.decode(nodes[i].Name);
                                        arrp.push({ TreeID: treeId, ID: nodes[i].NodeID, Name: nodes[i].Name, Type: "DocumentTreeNode" });
                                    }
                                    that.__PathCache[tn.ID] = arrp;
                                    cb(arrp);
                                }
                            });
                        });
                    }

                    if (nodes.length > 0) {
                        if (that.Interface.DocumentTreeNodesTitle.set_count) that.Interface.DocumentTreeNodesTitle.set_count(nodes.length);
                        if (that.Interface.DocumentTreeNodesTitle.fade_in) that.Interface.DocumentTreeNodesTitle.fade_in(0);
                        jQuery(that.Interface.DocumentTreeNodes).fadeIn(0);
                    }
                }
            });
        },

        get_folders: function (nodeTypeId, nodeId, callback) {
            var that = this;

            if (nodeTypeId || nodeId) that.__ExploreFolderNodeTypeID = that.__ExploreFolderNodeID = null;
            nodeTypeId = that.__ExploreFolderNodeTypeID = nodeTypeId || that.__ExploreFolderNodeTypeID;
            nodeId = that.__ExploreFolderNodeID = nodeId || that.__ExploreFolderNodeID;

            that.more_button_loading(that.Interface.FoldersMoreButton);

            var pathId = nodeTypeId || nodeId;
            var searchText = that.search_text();
            
            CNAPI.GetChildNodes({
                NodeTypeID: nodeTypeId, NodeID: nodeId, Count: that.Options.Count,
                LowerBoundary: that.Objects.Current.FoldersLowerBoundary, OrderBy: that.order_by(),
                OrderByDesc: that.order_by_desc(), SearchText: Base64.encode(searchText), ParseResults: true,
                ResponseHandler: function (result) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if (pathId != pt[pt.length - 1].ID) return;

                    var nodes = result.Nodes || [];

                    if (callback) callback({ Count: nodes.length });

                    var totalCount = result.TotalCount;
                    that.Objects.Current.FoldersLowerBoundary += nodes.length;

                    var hide = totalCount <= (that.Objects.Current.FoldersLowerBoundary - 1);
                    jQuery(that.Interface.FoldersMoreButton)[hide ? "fadeOut" : "fadeIn"](0);
                    that.append_more_button(that.Interface.FoldersMoreButton);
                    
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                        nodes[i].Name = Base64.decode(nodes[i].Name);
                        
                        that.add_folder({
                            ID: nodes[i].NodeID,
                            Name: nodes[i].Name
                        }, !searchText ? null : function (folder, cb) {
                            that.__PathCache = that.__PathCache || {};

                            if (that.__PathCache[folder.ID]) return cb(that.__PathCache[folder.ID]);

                            CNAPI.GetParentNodes({
                                NodeID: folder.ID, ParseResults: true,
                                ResponseHandler: function (result) {
                                    var nodes = (result.Nodes || []).sort(function (f, s) { return f.Level < s.Level; });
                                    var arrp = [];
                                    for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                                        nodes[i].Name = Base64.decode(nodes[i].Name);
                                        arrp.push({ ID: nodes[i].NodeID, Name: nodes[i].Name });
                                    }
                                    that.__PathCache[folder.ID] = arrp;
                                    cb(arrp);
                                }
                            });
                        });
                    }

                    if (nodes.length > 0) {
                        if (that.Interface.FoldersTitle.set_count) that.Interface.FoldersTitle.set_count(totalCount);
                        if (that.Interface.FoldersTitle.fade_in) that.Interface.FoldersTitle.fade_in(0);
                        jQuery(that.Interface.FoldersContainer).fadeIn(0);
                    }
                }
            });
        },

        get_contents: function (pathTypeId, pathId, callback) {
            var that = this;
            
            var hasPath = pathTypeId || pathId;

            pathTypeId = that.__ExploreContentPathTypeID = pathTypeId || (hasPath ? null : that.__ExploreContentPathTypeID);
            pathId = that.__ExploreContentPathID = pathId || (hasPath ? null : that.__ExploreContentPathID);
            
            that.more_button_loading(that.Interface.ContentsMoreButton);
            
            CNAPI.Explore({
                BaseID: pathId, BaseTypeIDs: pathTypeId ? [pathTypeId].join("|") : null,
                LowerBoundary: that.Objects.Current.ContentsLowerBoundary, Count: that.Options.Count,
                RegistrationArea: true, Tags: true, Relations: true,
                OrderBy: that.order_by(), OrderByDesc: that.order_by_desc(), SearchText: Base64.encode(that.search_text()),
                ParseResults: true,
                ResponseHandler: function (result) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if ((pathId || pathTypeId) != pt[pt.length - 1].ID) return;
                    
                    var items = result.Items || [];

                    if (callback) callback({ Count: items.length });

                    var totalCount = result.TotalCount;
                    
                    that.Objects.Current.ContentsLowerBoundary += items.length;
                    var hide = totalCount <= (that.Objects.Current.ContentsLowerBoundary - 1);
                    jQuery(that.Interface.ContentsMoreButton)[hide ? "fadeOut" : "fadeIn"](0);

                    that.append_more_button(that.Interface.ContentsMoreButton);
                    
                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        items[i].Related.Name = Base64.decode(items[i].Related.Name);
                        items[i].Related.NodeType = Base64.decode(items[i].Related.NodeType);
                        
                        that.add_content({
                            ID: items[i].Related.NodeID,
                            NodeTypeID: items[i].Related.NodeTypeID,
                            Name: items[i].Related.Name,
                            Type: items[i].Related.NodeType,
                            ImageURL: items[i].Related.ImageURL,
                            IsTag: items[i].IsTag,
                            IsRelation: items[i].IsRelation,
                            IsRegistrationArea: items[i].IsRegistrationArea
                        });
                    }

                    if (items.length > 0) {
                        if (that.Interface.ContentsTitle.set_count) that.Interface.ContentsTitle.set_count(totalCount);
                        if (that.Interface.ContentsTitle.fade_in) that.Interface.ContentsTitle.fade_in(0);
                        jQuery(that.Interface.ContentsContainer).fadeIn(0);
                    }
                }
            });
        },

        get_document_tree_node_contents: function (pathId, callback) {
            var that = this;

            pathId = that.__ExploreDocContentPathID = pathId || that.__ExploreDocContentPathID;

            that.more_button_loading(that.Interface.ContentsMoreButton);

            DocsAPI.GetTreeNodeDocs({
                TreeNodeID: pathId, LowerBoundary: that.Objects.Current.ContentsLowerBoundary, Count: that.Options.Count,
                OrderBy: that.order_by(), OrderByDesc: that.order_by_desc(), SearchText: Base64.encode(that.search_text()),
                ParseResults: true,
                ResponseHandler: function (result) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if (pathId != pt[pt.length - 1].ID) return;

                    var items = result.Docs || [];

                    if (callback) callback({ Count: items.length });

                    var totalCount = result.TotalCount;

                    that.Objects.Current.ContentsLowerBoundary += items.length;
                    var hide = totalCount <= (that.Objects.Current.ContentsLowerBoundary - 1);
                    jQuery(that.Interface.ContentsMoreButton)[hide ? "fadeOut" : "fadeIn"](0);

                    that.append_more_button(that.Interface.ContentsMoreButton);

                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        that.add_content({
                            ID: items[i].ID,
                            NodeTypeID: items[i].NodeTypeID,
                            Name: Base64.decode(items[i].Title),
                            Type: Base64.decode(items[i].Type),
                            ImageURL: items[i].IconURL
                        });
                    }

                    if (items.length > 0) {
                        if (that.Interface.ContentsTitle.set_count) that.Interface.ContentsTitle.set_count(totalCount);
                        if (that.Interface.ContentsTitle.fade_in) that.Interface.ContentsTitle.fade_in(0);
                        jQuery(that.Interface.ContentsContainer).fadeIn(0);
                    }
                }
            });
        },

        show_path: function(callback){
            var that = this;

            var oldPath = that.__LastPath;
            var newPath = that.__LastPath = that.Objects.Paths[that.Objects.Current.PathLocation];

            var lastSimilarIndex = 0, hasSimilarity = false;

            for (var i = 0, lnt = (oldPath || []).length; (i < lnt) && (i < newPath.length) ; ++i) {
                if (oldPath[i].ID != newPath[i].ID) break;
                else {
                    lastSimilarIndex = i;
                    hasSimilarity = true;
                }
            }

            var needsPathCreation = hasSimilarity && (newPath.length > (lastSimilarIndex + 1));

            if (hasSimilarity) {
                for (var i = oldPath.length - 1; i > lastSimilarIndex; --i)
                    oldPath[i].pop(needsPathCreation || (i > (lastSimilarIndex + 1)) ? null : callback);

                if ((oldPath.length == newPath.length) && (lastSimilarIndex >= (newPath.length - 1))) callback();
            }

            for (var i = hasSimilarity ? lastSimilarIndex + 1 : 0, lnt = newPath.length; i < lnt; ++i)
                that.add_path_item(newPath[i], i < (lnt - 1) ? null : callback);
        },

        add_path_item: function(pathItem, callback){
            var that = this;
            
            var isDocumentTree = pathItem.Type == "DocumentTree";
            var isDocumentTreeNode = pathItem.Type == "DocumentTreeNode";
            var isFolder = pathItem.Type == "Folder";
            
            var privateClass = pathItem.ID == "root" ? "cn-explorer-path-root" :
                (isFolder || isDocumentTreeNode ? "cn-explorer-path-folder" : "cn-explorer-path-folder-type");
            
            var clr = GlobalUtilities.generate_color(isDocumentTreeNode ? pathItem.TreeID || pathItem.ID : pathItem.ID);

            var overFunc = null, outFunc = null;

            if (isDocumentTree) {
                overFunc = function () { this.style.backgroundColor = clr.Dark; this.style.color = "white"; };
                outFunc = function () { this.style.backgroundColor = clr.Hover; this.style.color = "black"; };
            }
            else if (isDocumentTreeNode) {
                overFunc = function () { this.style.backgroundColor = clr.Color; };
                outFunc = function () { this.style.backgroundColor = clr.Bright; };
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "span", Class: "cn-explorer-path-item Ellipsis " + privateClass, Name: "item",
                    Style: (!isDocumentTree ? "" : "background-color:" + clr.Hover + "; color:black;") + "position:relative;" + 
                        (!isDocumentTreeNode ? "" : "background-color:" + clr.Bright + "; border-color:" + clr.Dark + ";"),
                    Properties: [
                        { Name: "onmouseover", Value: overFunc },
                        { Name: "onmouseout", Value: outFunc },
                        {
                            Name: "onclick",
                            Value: function () {
                                var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                                if (pt[pt.length - 1].ID != pathItem.ID) that.fill({ PathItem: pathItem });
                            }
                        }
                    ],
                    Childs: [{ Type: "text", TextValue: pathItem.Name }]
                }
            ], that.Interface.Path);

            //to be removed
            var _bookmark_animation = function () {
                var scrollTop = jQuery(window).scrollTop();

                var pos = jQuery(elems["item"]).offset();
                pos.top = pos.top - scrollTop + 3;
                pos.left = pos.left + (jQuery(elems["item"]).width() / 2);
                var starPos = jQuery(that.Interface.BookmarksButton).offset();
                starPos.top = starPos.top - scrollTop;
                var center = { top: Math.floor(window.innerHeight / 2), left: Math.floor(window.innerWidth / 2) };

                var star = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "star",
                        Style: "position:fixed; top:" + Math.floor(pos.top) + "px;" +
                            "left:" + Math.floor(pos.left) + "px; color:rgb(255,201,14);" +
                            "z-index:" + GlobalUtilities.zindex.alert() + "; font-size:0px;",
                        Childs: [{ Type: "i", Class: "fa fa-star" }]
                    }
                ], elems["item"])["star"];

                jQuery(star).animate({ "font-size": 20 }, function () {
                    jQuery(star).animate({ "top": center.top - 50, "left": center.left, "font-size": 100 }, 1000, function () {
                        jQuery(star).animate({ "top": starPos.top - 2, "left": starPos.left, "font-size": 16 }, 1000, function () {
                            jQuery(star).remove();

                            that.Interface.BookmarksButton.style.color = "rgb(255,201,14)";
                            that.Interface.BookmarksButton.classList.remove("fa-star-o");
                            that.Interface.BookmarksButton.classList.add("fa-star");
                        });
                    });
                });
            }
            //end of to be removed

            var itm = elems["item"];

            pathItem.bookmark = function () { _bookmark_animation(); };

            pathItem.pop = function (done) {
                if (itm.parentNode) jQuery(itm).fadeOut(500, function () {
                    if (done) done();
                    itm.parentNode.removeChild(itm);
                });
            }

            if (callback) callback();
        },

        content_types: function (container) {
            var that = this;

            var con = GlobalUtilities.create_nested_elements([
                { Type: "select", Name: "container" }
            ], container)["container"];

            for (var i = 0, lnt = that.Objects.ContentTypes.length; i < lnt; ++i)
                that.add_content_type(con, that.Objects.ContentTypes[i]);
        },

        add_content_type: function (container, item) {
            var that = this;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "option",
                    Childs: [{ Type: "text", TextValue: item.Name }]
                }
            ], container);
        },

        sort_filters: function (container) {
            var that = this;

            var con = GlobalUtilities.create_nested_elements([
                { Type: "select", Name: "container" }
            ], container)["container"];

            for (var i = 0, lnt = that.Objects.SortFilters.length; i < lnt; ++i)
                that.add_sort_filter(con, that.Objects.SortFilters[i]);
        },

        add_sort_filter: function (container, item) {
            var that = this;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "option",
                    Childs: [{ Type: "text", TextValue: item.Title }]
                }
            ], container);
        },

        get_items: function (selectedStatus) {
            var that = this;

            var containers = ["FolderTypes", "DocumentTrees", "DocumentTreeNodes", "Folders", "Contents"];

            var ret = {};
            var totalCount = 0;

            for (var i = 0; i < containers.length; ++i) {
                var firstChild = (that.Interface[containers[i]] || {}).firstChild;

                while (firstChild) {
                    if (GlobalUtilities.get_type((firstChild.TheItem || {}).IsSelected) != "boolean") continue;

                    var choose = GlobalUtilities.get_type(selectedStatus) == "boolean" ?
                        firstChild.TheItem.IsSelected == selectedStatus : true;

                    if (choose) {
                        ret[containers[i]] = ret[containers[i]] || [];
                        ret[containers[i]].push(firstChild.TheItem);
                        ++totalCount;
                    }

                    firstChild = firstChild.nextSibling;
                }
            }

            ret.TotalCount = totalCount;

            ret.TypesCount = 0;
            for (var i = 0; i < containers.length; ++i)
                if ((ret[containers[i]] || []).length > 0)++ret.TypesCount;

            return ret;
        },

        get_selected: function () {
            var that = this;
            return that.get_items(true);
        },

        item_exists: function (container, item) {
            var that = this;

            var firstChild = (container || {}).firstChild;

            while (firstChild) {
                if ((firstChild.TheItem || {}).ID == (item || {}).ID) return true;
                firstChild = firstChild.nextSibling;
            }

            return false;
        },

        unselect_all: function (exception) {
            var that = this;
            var selected = that.get_selected();
            
            for (var c in selected) {
                if (GlobalUtilities.get_type(selected[c]) != "array") continue;

                for (var i = 0; i < selected[c].length; ++i)
                    if ((selected[c][i] != exception) && (selected[c][i] || {}).UnSelect) selected[c][i].UnSelect();
            }
        },

        init_the_item: function (theItem, _div) {
            var that = this;

            var chb = GlobalUtilities.create_nested_elements([
                {
                    Type: "checkbox", Name: "chb",
                    Style: "width:1rem; height:1rem; background-color:white;" + (theItem.IsSelected ? "" : "display:none;"),
                    Params: {
                        OnChange: function (e) {
                            if (!e) return;
                            else if (this.checked) theItem.Select(e);
                            else theItem.UnSelect(e);
                        }
                    }
                }
            ], _div["chbContainer"])["chb"];
            
            if (theItem.HasCheckbox || theItem.HasVisitPage) {
                var hovering = false;

                var _do = function () {
                    if (theItem.HasCheckbox) chb.style.display = hovering || theItem.IsSelected ? "block" : "none";
                    if (theItem.HasVisitPage)
                        _div["visitPage"].style.display = hovering || theItem.IsSelected ? "inline-block" : "none";
                };

                theItem.Container.onmouseover = function () {
                    hovering = true;
                    setTimeout(function () { _do(); }, 0);
                };

                theItem.Container.onmouseout = function () {
                    hovering = false;
                    setTimeout(function () { _do(); }, 50);
                };
            }

            theItem = GlobalUtilities.extend(theItem || {}, {
                Rename: function (newName) {
                    if (_div.nameData) _div.nameData.data = GlobalUtilities.convert_numbers_to_persian(newName);
                    else if (_div.name) GlobalUtilities.set_text(_div.name, GlobalUtilities.convert_numbers_to_persian(newName));

                    theItem.Item.Name = newName;
                },
                IsSelected: false,
                Select: function (e) {
                    theItem.IsSelected = true;
                    if(_div.name) _div.name.style.fontWeight = "bold";
                    if (chb) chb.Check();
                    if (_div.content) {
                        _div.content.classList.remove("rv-bg-color-trans-soft");
                        _div.content.classList.add("rv-bg-color-softer-soft");
                    }

                    if (!(e || {}).ctrlKey) that.unselect_all(theItem);
                    else {
                        var selected = that.get_selected() || {};
                        if (selected.TypesCount && (selected.TypesCount > 1)) theItem.UnSelect();
                    }
                    
                    if (e) that.set_toolbar_buttons_visibility();
                },
                UnSelect: function (e) {
                    theItem.IsSelected = false;
                    _div.name.style.fontWeight = "normal";
                    chb.UnCheck();
                    if (_div.content) {
                        _div.content.classList.remove("rv-bg-color-softer-soft");
                        _div.content.classList.add("rv-bg-color-trans-soft");
                    }

                    if (e) that.set_toolbar_buttons_visibility();
                    else chb.style.display = "none";
                }
            });

            return theItem;
        },

        add_folder_type: function (folderType, add2top) {
            var that = this;
            
            if (that.item_exists(that.Interface.FolderTypes, folderType)) return;
            
            var clr = GlobalUtilities.generate_color(folderType.ID);
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: that.Options.ItemWidthClass, Style: "padding:0.2rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "content",
                            Class: "small-12 medium-12 large-12 row rv-border-radius-half " +
                                "rv-bg-color-white-softer SoftShadow SoftBorder",
                            Style: "margin:0rem; padding:0.3rem; cursor:pointer; position:relative;" + 
                                "padding-" + RV_Float + ":3rem; height:100%; border-color:rgb(240,240,240);" +
                                (!that.Options.Selectable.FolderType ? "" : "padding-" + RV_RevFloat + ":2rem;"),
                            Properties: [{ Name: "onclick", Value: function () { that.fill({ PathItem: folderType, PathItemType: "FolderType" }); } }],
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-book fa-3x",
                                            Style: "color:" + clr.Hover + ";",
                                            Attributes: [{Name: "aria-hidden", Value: true}]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "chbContainer",
                                    Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0rem; width:1.6rem;" +
                                        "text-align:center;" + (that.Options.Selectable.FolderType ? "" : "display:none;")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "name",
                                    Style: "min-height:2rem; margin-top:0.5rem; text-align:justify;",
                                    Childs: [{ Type: "text", TextValue: folderType.Name }]
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.FolderTypes);

            if (add2top) that.Interface.FolderTypes.insertBefore(elems["container"], that.Interface.FolderTypes.firstChild);
            else that.Interface.FolderTypes.appendChild(elems["container"]);

            elems["container"].TheItem = that.init_the_item({
                ID: folderType.ID,
                Type: "FolderType",
                Item: folderType,
                HasCheckbox: that.Options.Selectable.FolderType,
                Container: elems["container"]
            }, elems);
        },

        add_document_tree: function (tree, add2top) {
            var that = this;
            
            if (that.item_exists(that.Interface.DocumentTrees, tree)) return;

            var clr = GlobalUtilities.generate_color(tree.ID);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: that.Options.ItemWidthClass, Style: "padding:0.2rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "content",
                            Class: "small-12 medium-12 large-12 row rv-border-radius-half " +
                                "rv-bg-color-white-softer SoftShadow SoftBorder",
                            Style: "margin:0rem; padding:0.3rem; cursor:pointer; position:relative;" +
                                "padding-" + RV_Float + ":3rem; height:100%; border-color:rgb(240,240,240);" +
                                (!that.Options.Selectable.DocumentTree ? "" : "padding-" + RV_RevFloat + ":2rem;"),
                            Properties: [{ Name: "onclick", Value: function () { that.fill({ PathItem: tree, PathItemType: "DocumentTree" }); } }],
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem; width:2.5rem; text-align:center;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "rv-border-radius-quarter",
                                            Style: "display:inline-block; background-color:" + clr.Hover + ";",
                                            Childs: [
                                                {
                                                    Type: "img", Class: "rv-border-radius-quarter", Style: "height:2.5rem; width:1.2rem;",
                                                    Attributes: [{ Name: "src", Value: GlobalUtilities.icon("FolderStack.png") }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "chbContainer",
                                    Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0rem; width:1.6rem;" +
                                        "text-align:center;" + (that.Options.Selectable.DocumentTree ? "" : "display:none;")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "name",
                                    Style: "min-height:2rem; margin-top:0.5rem; text-align:justify;",
                                    Childs: [{ Type: "text", TextValue: tree.Name }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            if (add2top) that.Interface.DocumentTrees
                .insertBefore(elems["container"], that.Interface.DocumentTrees.firstChild);
            else that.Interface.DocumentTrees.appendChild(elems["container"]);

            elems["container"].TheItem = that.init_the_item({
                ID: tree.ID,
                Type: "DocumentTree",
                Item: tree,
                HasCheckbox: that.Options.Selectable.DocumentTree,
                Container: elems["container"]
            }, elems);
        },

        add_document_tree_node: function (treeNode, getPath, add2top) {
            var that = this;
            
            if (that.item_exists(that.Interface.DocumentTreeNodes, treeNode)) return;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: that.Options.ItemWidthClass, Style: "padding:0.2rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "content",
                            Class: "small-12 medium-12 large-12 row rv-border-radius-half " +
                                "rv-bg-color-white-softer SoftShadow SoftBorder",
                            Style: "margin:0rem; padding:0.3rem; cursor:pointer; position:relative;" +
                                "padding-" + RV_Float + ":3rem; height:100%; border-color:rgb(240,240,240);" +
                                (!that.Options.Selectable.DocumentTreeNode ? "" : "padding-" + RV_RevFloat + ":2rem;"),
                            Properties: [{
                                Name: "onclick",
                                Value: function () {
                                    if (this._processing) return;
                                    this._processing = true;

                                    if (getPath) {
                                        getPath(treeNode, function (path) {
                                            this._processing = false;
                                            that.fill({ PathItem: treeNode, PathItemType: "DocumentTreeNode", Path: path });
                                        });
                                    }
                                    else {
                                        this._processing = false;
                                        that.fill({ PathItem: treeNode, PathItemType: "DocumentTreeNode" });
                                    }
                                }
                            }],
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-folder fa-3x", Style: "color:rgb(252,223,128);",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "chbContainer",
                                    Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0rem; width:1.6rem;" +
                                        "text-align:center;" + (that.Options.Selectable.DocumentTreeNode ? "" : "display:none;")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "name",
                                    Style: "min-height:2rem; margin-top:0.5rem; text-align:justify;",
                                    Childs: [{ Type: "text", TextValue: treeNode.Name }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            if (add2top) that.Interface.DocumentTreeNodes
                .insertBefore(elems["container"], that.Interface.DocumentTreeNodes.firstChild);
            else that.Interface.DocumentTreeNodes.appendChild(elems["container"]);

            elems["container"].TheItem = that.init_the_item({
                ID: treeNode.ID,
                Type: "DocumentTreeNode",
                Item: treeNode,
                HasCheckbox: that.Options.Selectable.DocumentTreeNode,
                Container: elems["container"]
            }, elems);
        },

        add_folder: function (folder, getPath, add2top) {
            var that = this;
            
            if (that.item_exists(that.Interface.Folders, folder)) return;

            var url = CNAPI.NodePageURL({ NodeID: folder.ID });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: that.Options.ItemWidthClass, Style: "padding:0.2rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "content",
                            Class: "small-12 medium-12 large-12 row rv-border-radius-half " +
                                "rv-bg-color-white-softer SoftShadow SoftBorder",
                            Style: "margin:0rem; padding:0.3rem; cursor:pointer; position:relative;" + 
                                "padding-" + RV_Float + ":3rem; height:100%; border-color:rgb(240,240,240);" +
                                (!that.Options.Selectable.Folder ? "" : "padding-" + RV_RevFloat + ":2rem;"),
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        if (this._processing) return;
                                        this._processing = true;

                                        if (getPath) {
                                            getPath(folder, function (path) {
                                                this._processing = false;
                                                that.fill({ PathItem: folder, PathItemType: "Folder", Path: path });
                                            });
                                        }
                                        else {
                                            this._processing = false;
                                            that.fill({ PathItem: folder, PathItemType: "Folder" });
                                        }
                                    }
                                }
                            ],
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-folder fa-3x", Style: "color:rgb(252,223,128);",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "chbContainer",
                                    Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0rem; width:1.6rem;" +
                                        "text-align:center;" + (that.Options.Selectable.Folder ? "" : "display:none;")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "name",
                                    Style: "min-height:2.5rem; text-align:justify;",
                                    Childs: [
                                        { Type: "text", TextValue: folder.Name, Name: "nameData" },
                                        {
                                            Type: "div", Name: "visitPage",
                                            Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                            Style: "display:none; margin-" + RV_Float + ":0.5rem; font-size:0.6rem; padding:0.1rem 0.4rem;",
                                            Properties: [{ Name: "onclick", Value: function (e) { GlobalUtilities.link_click(e, url, { Confirmation: false, ForceOpen: true }); } }],
                                            Childs: [{ Type: "text", TextValue: RVDic.VisitPage }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]);

            if (add2top) that.Interface.Folders.insertBefore(elems["container"], that.Interface.Folders.firstChild);
            else that.Interface.Folders.appendChild(elems["container"]);

            elems["container"].TheItem = that.init_the_item({
                ID: folder.ID,
                Type: "Folder",
                Item: folder,
                HasCheckbox: that.Options.Selectable.Folder,
                HasVisitPage: true,
                Container: elems["container"]
            }, elems);
        },

        add_content: function (content, add2top) {
            var that = this;
            
            if (that.item_exists(that.Interface.Contents, content)) return;

            var url = CNAPI.NodePageURL({ NodeID: content.ID });
            
            var icons = [];

            var add_icon = function (name) {
                icons.push({
                    Type: "i", Class: "fa fa-" + name, Style: "margin-" + window.RV_Float + ":0.4rem;",
                    Attributes: [{ Name: "aria-hidden", Value: "true" }]
                });
            }

            if (content.IsTag) add_icon("tag");
            if (content.IsRelation) add_icon("exchange");
            if (content.IsRegistrationArea) add_icon("registered");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: that.Options.ItemWidthClass, Style: "padding:0.2rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "content",
                            Class: "small-12 medium-12 large-12 row rv-border-radius-half " +
                                "rv-bg-color-white-softer SoftShadow SoftBorder",
                            Style: "margin:0rem; padding:0.3rem; cursor:pointer; position:relative;" +
                                "padding-" + RV_Float + ":3rem; height:100%; border-color:rgb(240,240,240);" +
                                (!that.Options.Selectable.Content ? "" : "padding-" + RV_RevFloat + ":2rem;"),
                            Properties: [{ Name: "onclick", Value: function (e) { GlobalUtilities.link_click(e, url, { Confirmation: false, ForceOpen: true }); } }],
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-half", Style: "width:2.5rem; height:2.5rem;",
                                            Attributes: [{ Name: "src", Value: content.ImageURL }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "chbContainer",
                                    Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0rem; width:1.6rem;" +
                                        "text-align:center;" + (that.Options.Selectable.Content ? "" : "display:none;")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "name",
                                                    Childs: [{
                                                        Type: "a", Class: "rv-link",
                                                        Attributes: [{ Name: "href", Value: url }],
                                                        Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); } }],
                                                        Childs: [{ Type: "text", TextValue: content.Name }]
                                                    }]
                                                },
                                                {
                                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:0.3rem;",
                                                    Childs: [
                                                        {
                                                            Type: "div", Class: "rv-air-button rv-circle",
                                                            Style: "display:inline-block; padding:0rem 0.5rem; font-size:0.7rem;",
                                                            Childs: [{ Type: "text", TextValue: content.Type }]
                                                        },
                                                        { Type: "div", Style: "display:inline-block;", Childs: icons }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]);

            if (add2top) that.Interface.Contents.insertBefore(elems["container"], that.Interface.Contents.firstChild);
            else that.Interface.Contents.appendChild(elems["container"]);

            elems["container"].TheItem = that.init_the_item({
                ID: content.ID,
                Type: "Content",
                Item: content,
                HasCheckbox: that.Options.Selectable.Content,
                Container: elems["container"]
            }, elems);
        }
    }
})();