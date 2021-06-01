(function () {
    if (window.FAQViewer) return;

    window.FAQViewer = function (container) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        
        this.Interface = {
            Path: null,
            SearchInput: null,
            BackButton: null,
            ForwardButton: null,
            Folders: null,
            Contents: null,
            NothingToDisplay: null
        }

        this.Objects = {
            Current: {
                PathLocation: -1,
                Folders: {},
                Contents: {}
            },
            Paths: [],
            LastSearchedText: null
        }

        this.Options = {
            Count: 100
        }

        var that = this;

        GlobalUtilities.load_files(["API/QAAPI.js", "QA/QuestionMini.js"], { OnLoad: function () { that._preinit(); } });
    }

    window.FAQViewer.prototype = {
        _get_color: function (id) {
            var hue = 1, saturation = 1, lightness = 1;

            for (var i = 0; i < 8; ++i) hue = (10 * hue) + String(id).charCodeAt(i);
            for (var i = 9; i < 13; ++i) saturation = (10 * saturation) + String(id).charCodeAt(i);
            for (var i = 14; i < 18; ++i) lightness = (10 * lightness) + String(id).charCodeAt(i);

            return "hsl(" + (hue % 360) + "," + ((saturation % 80) + 20) + "%," + ((lightness % 70) + 15) + "%)";
        },

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

            that._initialize();
        },

        _initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "padding:0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row SoftBorder", 
                                    Style: "margin:0rem; background-color:white;" + GlobalUtilities.border_radius("0.2rem"),
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-8 row",
                                            Style: "margin:0rem;", Name: "path"
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-4 row",
                                            Style: "margin:0rem; padding:0rem 0.5rem;",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "small-8 medium-10 large-9",
                                                    Childs: [
                                                        {
                                                            Type: "middle", Style: "display:none;",
                                                            Childs: [
                                                                {
                                                                    Type: "input", Class: "TextInput", Name: "searchInput",
                                                                    Style: "width:100%; height:1.6rem; padding:0rem 0.3rem 0rem 0.3rem;",
                                                                    Attributes: [{ Name: "placeholder", Value: RVDic.Search }]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    Type: "div", Class: "small-4 medium-2 large-3",
                                                    Childs: [
                                                        {
                                                            Type: "middle", Style: "direction:ltr; text-align:left; padding-top:0.2rem;",
                                                            Childs: [
                                                                {
                                                                    Type: "li", Class: "fa fa-arrow-circle-o-left fa-2x qa-faq-nav qa-faq-nav-disabled",
                                                                    Name: window.RV_RTL ? "backButton" : "forwardButton",
                                                                    Attributes: [{ Name: "aria-hidden", Value: "true" }]
                                                                },
                                                                {
                                                                    Type: "li", Class: "fa fa-arrow-circle-o-right fa-2x qa-faq-nav qa-faq-nav-disabled",
                                                                    Style: "margin-left:0.5rem;",
                                                                    Name: window.RV_RTL ? "forwardButton" : "backButton",
                                                                    Attributes: [{ Name: "aria-hidden", Value: "true" }]
                                                                }
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
                                    Style: "margin:0rem; margin-top:1rem;", Name: "folders"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row",
                                    Style: "margin:0rem; margin-top:1rem;", Name: "contents"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin:0rem; margin-top:1rem; text-align:center; display:none;", Name: "nothing2display",
                                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                                }
                            ]
                        }
                    ]
                }
            ], that.Container);
            
            that.Interface.Path = elems["path"];
            that.Interface.SearchInput = elems["searchInput"];
            that.Interface.BackButton = elems["backButton"];
            that.Interface.ForwardButton = elems["forwardButton"];
            that.Interface.Folders = elems["folders"];
            that.Interface.Contents = elems["contents"];
            that.Interface.NothingToDisplay = elems["nothing2display"];
            
            that.Interface.BackButton.onclick = function () {
                that.back();
            }

            that.Interface.ForwardButton.onclick = function () {
                that.forward();
            }
            
            //search
            var searchTimeout = null;

            var do_search = function () {
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                    searchTimeout = null;
                }    
                
                if ((that.Objects.LastSearchedText === that.search_text()) || (that.Objects.Current.PathLocation < 0)) return;
                
                var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                that.fill({ PathItem: pt[pt.length - 1], Search: true });
            }

            jQuery(that.Interface.SearchInput).keypress(function () {
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                    searchTimeout = null;
                }

                searchTimeout = setTimeout(do_search, 1500);
            });

            GlobalUtilities.set_onenter(that.Interface.SearchInput, do_search);
            //end of search
            
            that.fill();
        },

        fill: function (params) {
            params = params || {};
            var that = this;
            
            that.Objects.Current.Folders = {};
            that.Objects.Current.Contents = {};
            
            if (params.Search) that.Objects.LastSearchedText = that.search_text();
            else {
                that.Objects.LastSearchedText = null;
                jQuery(that.Interface.SearchInput).val("");
            }
            
            jQuery(that.Interface.Folders).fadeOut(0);
            jQuery(that.Interface.Contents).fadeOut(0);
            jQuery(that.Interface.NothingToDisplay).fadeOut(0);

            that.Interface.Folders.innerHTML = that.Interface.Contents.innerHTML = "";
            
            var pathItem = params.PathItem || {};
            
            var pathId = pathItem.ID || "root";
            var pathName = pathItem.Name ? pathItem.Name : RVDic.Root;
            var pathType = params.PathItemType || pathItem.Type;
            
            var oldPath = that.Objects.Current.PathLocation < 0 ? null : that.Objects.Paths[that.Objects.Current.PathLocation];
            
            //Update paths
            if (params.Back || params.Forward) {
                that.Objects.Current.PathLocation += params.Back ? -1 : 1;
                jQuery(that.Interface.SearchInput).val("");

                var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                pathId = pt[pt.length - 1].ID;
                pathName = pt[pt.length - 1].Name;
                pathType = pt[pt.length - 1].Type;
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

                    for (var i = ind + 1, lnt = (params.Path || []).length; i < (lnt - 1) ; ++i)
                        pathHist.push({ ID: params.Path[i].ID, Name: params.Path[i].Name, Type: "Folder" });

                    pathHist.push({ ID: pathId, Name: pathName, Type: params.PathItemType });
                }

                that.Objects.Current.PathLocation++;
                pathsArr.push(pathHist);
                that.Objects.Paths = pathsArr;
            }
            
            that.show_path(function () {
                var isRoot = pathId == "root";

                that.nav_buttons_disabled();

                var nothingCount = 0;

                that.get_folders(pathId, function () {
                    if (++nothingCount >= 2) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                });

                if (pathId && !isRoot) {
                    that.get_contents(pathId, function () {
                        if (++nothingCount >= 2) jQuery(that.Interface.NothingToDisplay).fadeIn(500);
                    });
                }
            });
            //end of Update paths
        },

        search_text: function () {
            var that = this;
            return GlobalUtilities.trim(that.Interface.SearchInput.value);
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
            that.Interface.BackButton.classList[that.Objects.Current.PathLocation <= 0 ? "add" : "remove"]("qa-faq-nav-disabled");
            that.Interface.ForwardButton.classList[(that.Objects.Current.PathLocation < 0) ||
                (that.Objects.Paths.length <= (that.Objects.Current.PathLocation + 1)) ? "add" : "remove"]("qa-faq-nav-disabled");
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

        get_folders: function (categoryId, onNothing) {
            var that = this;

            if (categoryId) that.__ExploreFolderCategoryID = null;
            categoryId = that.__ExploreFolderCategoryID = categoryId || that.__ExploreFolderCategoryID;

            var searchText = that.search_text();

            QAAPI.GetChildFAQCategories({
                CategoryID: categoryId, Count: 1000, LowerBoundary: 0, SearchText: Base64.encode(searchText),
                ParseResults: true,
                ResponseHandler: function (result) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if (categoryId != pt[pt.length - 1].ID) return;

                    var categories = result.Categories || [];

                    if (categories.length == 0 && onNothing) onNothing();

                    for (var i = 0, lnt = categories.length; i < lnt; ++i) {
                        categories[i].Name = Base64.decode(categories[i].Name);

                        that.add_folder({
                            ID: categories[i].CategoryID,
                            Name: categories[i].Name
                        }, !searchText ? null : function (folder, cb) {
                            that.__PathCache = that.__PathCache || {};

                            if (that.__PathCache[folder.ID]) return cb(that.__PathCache[folder.ID]);
                            /*
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
                            */
                        });
                    }

                    if (categories.length > 0) jQuery(that.Interface.Folders).fadeIn(0);
                }
            });
        },

        get_contents: function (categoryId, onNothing) {
            var that = this;
            
            categoryId = that.__ExploreContentCategoryID = categoryId || (categoryId ? null : that.__ExploreContentCategoryID);
            
            QAAPI.GetFAQItems({
                CategoryID: categoryId, Count: 1000, ParseResults: true,
                ResponseHandler: function (result) {
                    var pt = that.Objects.Paths[that.Objects.Current.PathLocation];
                    if (categoryId != pt[pt.length - 1].ID) return;

                    var items = result.Questions || [];

                    if (items.length == 0 && onNothing) onNothing();

                    for (var i = 0, lnt = items.length; i < lnt; ++i) {

                        that.add_content({
                            ID: items[i].CategoryID,
                            Name: Base64.decode(items[i].Title),
                            Question: items[i]
                        });
                    }

                    if (items.length > 0) jQuery(that.Interface.Contents).fadeIn(0);
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

            for (var i = hasSimilarity ? lastSimilarIndex + 1 : 0, lnt = newPath.length; i < lnt; ++i) {
                that.add_path_item(newPath[i], i < (lnt - 1) ? null : callback);
            }
        },

        add_path_item: function(pathItem, callback){
            var that = this;
            
            var isFolder = pathItem.Type == "Folder";
            var privateClass = pathItem.ID == "root" ? "qa-faq-path-root" :
                (isFolder ? "qa-faq-path-folder" : "qa-faq-path-folder-type");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "span", Class: "qa-faq-path-item Ellipsis " + privateClass, Name: "item",
                    Properties: [
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

            var itm = elems["item"];

            pathItem.pop = function (done) {
                if (itm.parentNode) jQuery(itm).fadeOut(500, function () {
                    if (done) done();
                    itm.parentNode.removeChild(itm);
                });
            }

            if (callback) callback();
        },

        add_folder: function (folder, getPath) {
            var that = this;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row SoftBorder",
                            Style: "padding:0.4rem; margin:0.2rem;" +
                                "cursor:pointer;" + GlobalUtilities.border_radius("0.5rem"),
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.classList.add("SoftBackgroundColor"); } },
                                { Name: "onmouseout", Value: function () { this.classList.remove("SoftBackgroundColor"); } },
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
                                    Type: "div", Class: "small-4 medium-3 large-2",
                                    Childs: [{ Type: "i", Class: "fa fa-folder fa-3x", Style: "color:rgb(252,223,128);" }]
                                },
                                {
                                    Type: "div", Class: "small-8 medium-9 large-10", Style: "height:2.5rem;",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "Ellipsis qa-faq-item-small qa-faq-item-medium qa-faq-item-large",
                                                    Childs: [{ Type: "div", Childs: [{ Type: "text", TextValue: folder.Name }] }]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.Folders);
        },

        add_content: function (content) {
            var that = this;
            
            new QuestionMini(that.Interface.Contents, content.Question, { HideSender: true });
        }
    }
})();