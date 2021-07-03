(function () {
    if (window.ServiceInitializer) return;

    window.ServiceInitializer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        params = params || {};

        this.Interface = {
            Items: null,
            SearchInput: null,
            OptionButtons: null
        };

        this.Objects = {
            OrderVariableName: "ServicesOrder_" + window.RVGlobal.CurrentUserID +
                (!RVGlobal.SAASBasedMultiTenancy ? "" : "_" + RVGlobal.ApplicationID),
            ServicesOrder: null,
            Services: {},
            Buttons: {}
        };
        
        this.Options = {
            DocsOnly: params.DocsOnly,
            DocumentTreeNode: params.DocumentTreeNode,
            PreviousVersion: params.PreviousVersion,
            OnInit: params.OnInit,
            OnServiceSelect: params.OnServiceSelect,
            Modules: params.Modules || {},
            IsSystemAdmin: params.IsSystemAdmin === true,
            ShowRegisterDialogForSingleService: params.ShowRegisterDialogForSingleService,
            ShowAllButton: params.ShowAllButton === false ? false : true,
            EnableNewPage: params.EnableNewPage === true,
            AddScrollBar: params.AddScrollBar === true,
            SearchBox: params.SearchBox === true
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._preinit(params); } });
    }

    ServiceInitializer.prototype = {
        _preinit: function (params) {
            params = params || {};
            var that = this;

            that._get_services(params, function (services) {
                services = services || [];

                if ((services.length == 1) && that.Options.ShowRegisterDialogForSingleService)
                    return that.on_service_select(services[0]);

                var _add_not_existing_items = function (arr, _order) {
                    for (var s = 0, ln = services.length; s < ln; ++s) {
                        var exists = false;
                        for (var x = 0, l = _order.length; x < l; ++x) {
                            if (_order[x] == services[s].NodeTypeID) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) arr.push(services[s].NodeTypeID);
                    }
                };

                RVAPI.GetVariable({
                    Name: that.Objects.OrderVariableName, ParseResults: true,
                    ResponseHandler: function (result) {
                        var order = JSON.parse(Base64.decode((result || {}).Value) || "{}").Order || [];

                        var newOrder = [];
                        var moreButtonAdded = false;

                        for (var i = 0, lnt = services.length; i < lnt; ++i)
                            that.Objects.Services[services[i].NodeTypeID] = services[i];

                        for (var i = 0, lnt = order.length; i < lnt; ++i) {
                            if (order[i] == "MoreButton") {
                                moreButtonAdded = true;
                                _add_not_existing_items(newOrder, order);
                            }
                            else if (!that.Objects.Services[order[i]]) continue;

                            newOrder.push(order[i]);
                        }

                        if (!moreButtonAdded) {
                            _add_not_existing_items(newOrder, order);
                            newOrder.push("MoreButton");
                        }

                        that.Objects.ServicesOrder = newOrder;

                        that._initialize();
                    }
                });
            });
        },

        _get_services: function (params, callback) {
            params = params || {};
            var that = this;

            if ((params.Services || []).length)
                callback(params.Services.filter(function (s) { return !that.Options.DocsOnly || s.IsDocument; }));
            else {
                CNAPI.GetServices({
                    IsDocument: that.Options.DocsOnly, ParseResults: true,
                    ResponseHandler: function (result) {
                        callback(result.Services);
                    }
                });
            }
        },

        _initialize: function () {
            var that = this;
            
            if (that.ContainerDiv) that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Style: "display:flex; flex-flow:column; height:100%;",
                Childs: [
                    (!that.Options.SearchBox ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "margin-bottom:0.3rem; flex:0 0 auto; padding:0.2rem 1.2rem;",
                        Childs: [{
                            Type: "input", Class: "rv-input", Name: "searchInput",
                            Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.Search + "..."
                        }]
                    }),
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "items", Style: "flex:1 1 auto;" }
                ]
            }], that.ContainerDiv);

            that.Interface.Items = elems["items"];
            that.Interface.SearchInput = elems["searchInput"];

            if (that.Options.AddScrollBar) {
                that.Interface.Items = GlobalUtilities.append_scrollbar(elems["items"], { AutoHeight: false });
                that.Interface.Items.style[RV_RTL ? "paddingLeft" : "paddingRight"] = "1.2rem";
                that.Interface.Items.style.padding = "0 1.2rem";
            }

            that.add_service_buttons();

            if (elems["searchInput"]) GlobalUtilities.set_onchangeorenter(elems["searchInput"], function () { that.search(); });

            if (that.Options.OnInit) that.Options.OnInit();
        },

        search: function () {
            var that = this;

            var searchText = GlobalUtilities.trim((that.Interface.SearchInput || { value: "" }).value);

            if (that.Interface.OptionButtons)
                jQuery(that.Interface.OptionButtons)[searchText ? "fadeOut" : "fadeIn"](searchText ? 200 : 500);

            for (id in (that.Objects.Buttons || {}))
                if (that.Objects.Buttons[id]) that.Objects.Buttons[id].show_if_match();
        },

        add_service_buttons: function () {
            var that = this;

            that.Interface.Items.innerHTML = that.Objects.ServicesOrder.length > 1 ? "" :
                "<div style='font-weight:bold; text-align:center;'>" + RVDic.ThereIsNoService + "</div>";
            if (that.Objects.ServicesOrder.length <= 1) return;

            var moreButtonPosition = that.Objects.ServicesOrder.length - 1;
            
            for (var i = 0, lnt = that.Objects.ServicesOrder.length; i < lnt; ++i) {
                if (that.Objects.ServicesOrder[i] == "MoreButton" &&
                    ((moreButtonPosition = i) > -1) && !that.Options.DocsOnly) break;
                if (that.Objects.ServicesOrder[i] != "MoreButton")
                    that.add_item(that.Objects.Services[that.Objects.ServicesOrder[i]]);
            }

            var needsMoreButton = moreButtonPosition != (that.Objects.ServicesOrder.length - 1);
            var needsSortButton = (that.Objects.ServicesOrder.length > 3);

            var moreMode = true;

            if (that.Options.DocsOnly || !(needsMoreButton || needsSortButton)) return;

            that.Objects.ServicesOrder
                .filter(function (value, index, self) { return index > moreButtonPosition; })
                .forEach(function (value, index, self) { that.add_item(that.Objects.Services[value], { IsHidden: true }); });

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container",
                Style: "font-weight:bold; margin:0.5rem 0rem 1.5rem 0rem; display:none;",
                Childs: [
                    {
                        Type: "div", Class: "small-6 medium-6 large-6", Style: "padding-" + RV_RevFloat + ":0.5rem",
                        Childs: [{
                            Type: "div", Class: "rv-circle SoftBorder", Name: "moreButton",
                            Style: (needsMoreButton ? "" : "display:none;") + "text-align:center;" +
                                "cursor:pointer; padding:0.3rem; border-color:rgb(220,220,220); font-size:0.7rem;",
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.backgroundColor = "rgb(220,220,220)"; } },
                                { Name: "onmouseout", Value: function () { this.style.backgroundColor = "transparent"; } }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.More + "..." }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-6 medium-6 large-6", Style: "padding-" + RV_Float + ":0.5rem",
                        Childs: [{
                            Type: "div", Class: "rv-circle SoftBorder", Name: "sortButton",
                            Style: "display:none; text-align:center;" +
                                "cursor:pointer; padding:0.3rem; border-color:rgb(220,220,220); font-size:0.7rem;",
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.backgroundColor = "rgb(220,220,220)"; } },
                                { Name: "onmouseout", Value: function () { this.style.backgroundColor = "transparent"; } },
                                {
                                    Name: "onclick",
                                    Value: function () { that.sort_dialog(function (result) { if (result) that.add_service_buttons(); }); }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.Sort }]
                        }]
                    }
                ]
            }], that.Interface.Items);

            that.Interface.OptionButtons = elems["container"];

            jQuery(elems["container"]).fadeIn(500);

            elems["moreButton"].onclick = function () {
                var btn = this;
                if (btn.Processing) return;
                btn.Processing = true;

                that.Objects.ServicesOrder
                    .filter(function (value, index, self) { return index > moreButtonPosition; })
                    .forEach(function (value, index, self) {
                        that.Objects.Buttons[that.Objects.Services[value].NodeTypeID].is_hidden(!moreMode);
                    });

                btn.innerHTML = (moreMode ? RVDic.Less : RVDic.More) + "...";

                jQuery(btn).mouseout();

                moreMode = !moreMode;
                btn.Processing = false;
            };

            if (needsSortButton) {
                jQuery(that.Interface.Items).mouseover(function () {
                    elems["sortButton"].style.display = "block";
                });

                jQuery(that.Interface.Items).mouseout(function () {
                    elems["sortButton"].style.display = "none";
                });
            }
        },

        add_item: function (service, options) {
            var that = this;
            options = options || {};
            
            var title = Base64.decode(service.Title);
            var nodeType = Base64.decode(service.TypeName);

            var iconUrl = service.IconURL || GlobalUtilities.icon("New.png");
            
            var newNodePageUrl = RVAPI.NewNodePageURL({
                NodeTypeID: service.NodeTypeID, ParentID: null,
                PreviousVersionID: ((that.Options.DocsOnly === true ? that.Options.PreviousVersion : null) || {}).ID,
                DocumentTreeNodeID: ((that.Options.DocsOnly === true ? that.Options.DocumentTreeNode : null) || {}).ID
            });
            
            var _div = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "_div", Tooltip: nodeType, TooltipAlign: RV_RTL ? "left" : "right",
                Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow", 
                Style: "margin:0.5rem 0rem; cursor:pointer; display:none;" +
                    "padding:0.3rem; padding-" + RV_Float + ":2.6rem; position:relative;",
                Properties: [{
                    Name: "onclick", Value: function (e) {
                        if (e.ctrlKey && that.Options.EnableNewPage) window.open(newNodePageUrl);
                        else that.on_service_select(service);
                    }
                }],
                Childs: [
                    {
                        Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.2rem;",
                        Childs: [{
                            Type: "middle",
                            Childs: [{
                                Type: "div", Class: "rv-circle",
                                Style: "width:2rem; height:2rem; background-color:white; text-align:center;",
                                Childs: [{
                                    Type: "middle",
                                    Childs: [{
                                        Type: "img", Style: "width:60%; height:60%;",
                                        Attributes: [{ Name: "src", Value: GlobalUtilities.add_timestamp(iconUrl) }]
                                    }]
                                }]
                            }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "height:100%; padding:0.4rem 0rem;",
                        Childs: [{
                            Type: "middle", Class: "small-12 medium-12 large-12 TextAlign", Style: "font-size:0.8rem;",
                            Childs: [{ Type: "text", TextValue: title }]
                        }]
                    }
                ]
            }], that.Interface.Items)["_div"];

            if (!options.IsHidden) jQuery(_div).fadeIn(500);

            var retJson = {
                show_if_match: function () {
                    var searchText = GlobalUtilities.trim((that.Interface.SearchInput || { value: "" }).value);

                    var isMatch = options.IsHidden && !searchText ? false :
                        !searchText || GlobalUtilities.is_search_match(title, searchText) ||
                        GlobalUtilities.is_search_match(nodeType, searchText);

                    jQuery(_div)[isMatch ? "fadeIn" : "fadeOut"](isMatch ? 500 : 200);
                },
                is_hidden: function (value) {
                    if (GlobalUtilities.get_type(value) != "boolean") return options.IsHidden;

                    options.IsHidden = value;
                    retJson.show_if_match();
                }
            };

            that.Objects.Buttons[service.NodeTypeID] = retJson;
        },

        on_service_select: function (service) {
            var that = this;

            if (that.Options.OnServiceSelect) that.Options.OnServiceSelect(service);

            var _div = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-10 large-10 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto 3rem auto; padding:1rem;", Name: "container"
            }])["container"];

            GlobalUtilities.loading(_div);
            var showed = GlobalUtilities.show(_div, { DisableCloseOnClick: true });
            
            GlobalUtilities.load_files(["CN/RegisterNewNode.js"], {
                OnLoad: function () {
                    CNAPI.GetServiceRegistrationInfo({
                        NodeTypeID: service.NodeTypeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            new RegisterNewNode(_div, {
                                Service: service,
                                Extensions: result.Extensions || {},
                                Options: {
                                    IsServiceAdmin: result.IsServiceAdmin,
                                    NodeSelectType: (result.KnowledgeType || {}).NodeSelectType,
                                    PreviousVersion: (that.Options.DocsOnly === true ? that.Options.PreviousVersion : null),
                                    ParentNode: null,
                                    DocumentTreeNode: (that.Options.DocsOnly === true ? that.Options.DocumentTreeNode : null),
                                    OnFinish: function () { showed.Close(); }
                                }
                            });
                        }
                    });
                }
            });
        },

        _sort_dialog: function(callbak){
            var that = this;

            var arrItems = [];

            for (var i = 0, lnt = that.Objects.ServicesOrder.length; i < lnt; ++i) {
                var isMoreButton = that.Objects.ServicesOrder[i] == "MoreButton";

                var name = isMoreButton ? "" : Base64.decode(that.Objects.Services[that.Objects.ServicesOrder[i]].Title);
                var trimedName = GlobalUtilities.trim2pix(name, 300, { Postfix: "..." });

                arrItems.push({
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder" +
                        (isMoreButton ? "" : " WarmBackgroundColor"),
                    Name: isMoreButton ? "moreButton" : null,
                    Style: "margin:0.3rem 0rem; padding:0.3rem; font-weight:bold; cursor:move;" +
                        (isMoreButton ? "background-color:rgb(220,220,220); text-align:center; border-color:rgb(220,220,220);" : ""),
                    Attributes: [{ Name: "ItemID", Value: that.Objects.ServicesOrder[i] }],
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; color:white;",
                            Tooltip: name == trimedName ? null : name,
                            Childs: [{ Type: "text", TextValue: trimedName }]
                        }
                    ]
                });
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Style: "margin-bottom:1rem; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic._HelpSortNames }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 sortable grid", Name: "itemsArea",
                            Style: "padding-top:0.1rem;", Childs: arrItems
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6 ActionButton", Name: "confirmButton",
                            Style: "margin:1rem auto 0rem auto; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            elems["moreButton"].innerHTML = "";
            GlobalUtilities.append_markup_text(elems["moreButton"], RVDic.More + "..." + " (" + RVDic.DragMe + ":))");

            var confirmButtonClicked = false;

            var _get_sorted_list = function () {
                var sortedList = [];
                var iter = elems["itemsArea"].firstChild;
                var counter = 0;

                while (iter) {
                    sortedList.push(iter.getAttribute("ItemID"));
                    ++counter;
                    iter = iter.nextSibling;
                }

                return sortedList;
            }

            var _changed = function () {
                var sl = _get_sorted_list();
                for (var i = 0, lnt = sl.length; i < lnt; ++i)
                    if (sl[i] != that.Objects.ServicesOrder[i]) return true;
                return false;
            }

            var showed = GlobalUtilities.show(elems["container"], {
                OnClose: function () {
                    if (confirmButtonClicked || !_changed()) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveTheChanges, function (result) {
                        if (result) _do_save();
                    });
                }
            });

            jQuery(elems["itemsArea"]).height(jQuery(elems["itemsArea"]).height());

            jQuery(elems["itemsArea"]).sortable({
                PlaceHolder: {
                    Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder",
                    Style: "margin:0.3rem auto; height:2rem; background-color:white;"
                }
            });

            var processing = false;

            var _do_save = function () {
                if (processing) return;
                processing = true;

                GlobalUtilities.block(elems["confirmButton"]);

                var sortedList = _get_sorted_list();

                RVAPI.SetVariable({
                    Name: that.Objects.OrderVariableName,
                    Value: JSON.stringify({ Order: sortedList }), ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;
                        GlobalUtilities.unblock(elems["confirmButton"]);

                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            that.Objects.ServicesOrder = sortedList;
                            showed.Close();
                            callbak(!result.ErrorText);
                        }
                    }
                });
            } //end of 'var _do_save = function () {'

            elems["confirmButton"].onclick = function () {
                confirmButtonClicked = true;
                if (!_changed()) showed.Close();
                _do_save();
            }
        },

        sort_dialog: function (callback) {
            var that = this;

            GlobalUtilities.load_files([{ Root: "jQuery/Sortable/", Childs: ["jquery.sortable.css", "jquery.sortable.js"] }], {
                OnLoad: function () { that._sort_dialog(callback); }
            });
        }
    }
})();