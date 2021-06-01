(function () {
    if (window.DashboardViewer) return;

    window.DashboardViewer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null,
            SearchFiltersContainer: null
        };

        this.Objects = {
            NodeTypeID: params.NodeTypeID,
            NodeType: params.NodeType,
            Type: params.Type,
            Done: params.Done,
            DistinctItems: params.DistinctItems,
            Filters: params.Filters || [],
            ListViewer: null,
            SelectedFilter: null,
            SelectedUser: params.SelectedUser,
            DateFrom: null,
            DateTo: null,
            SearchInput: null
        };

        this.Options = {
            Count: 10,
            SetTotalCount: params.SetTotalCount
        };

        var that = this;

        GlobalUtilities.load_files([
            "API/WFAPI.js",
            "API/NotificationsAPI.js",
            "Notifications/DashboardTypes.js",
            "SimpleListViewer/NewSimpleListViewer.js"
        ], { OnLoad: function () { that.initialize(); } });
    };

    DashboardViewer.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var strClass = that.Objects.Filters.length ? "small-7 medium-8 large-9" : "small-12 medium-12 large-12";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "position:relative; margin:0;",
                    Childs: [
                        {
                            Type: "div", Name: "searchFilters",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder", 
                            Style: "display:none; padding:0.5rem; border-color:rgb(200,200,200); background-color:white;" +
                                "margin-bottom:1rem; position:relative; min-height:2.9rem;" +
                                "padding-" + RV_RevFloat + ":" + (that.Objects.DistinctItems ? "0" : "11") + "rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0.5rem;" +
                                        "width:" + (that.Objects.DistinctItems ? "50%" : "10rem") + ";",
                                    Childs: [{
                                        Type: "middle", 
                                        Childs: [{ Type: "input", Class: "rv-input", Name: "searchText", Style: "width:100%; font-size:0.6rem;" }]
                                    }]
                                },
                                (that.Objects.DistinctItems ? null : {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.7rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.DashboardEntranceDate + " " + RVDic.From + ":" }]
                                        },
                                        { Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1rem;", Name: "from" },
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                                        },
                                        { Type: "div", Style: "display:inline-block;", Name: "to" }
                                    ]
                                })
                            ]
                        },
                        (!that.Objects.Filters.length ? null : {
                            Type: "div", Class: "small-5 medium-4 large-3", Name: "filters",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                        }),
                        { Type: "div", Class: strClass, Name: "itemsArea" }
                    ]
                }
            ], that.Container);

            that.Interface.ItemsArea = elems["itemsArea"];
            that.Interface.SearchFiltersContainer = elems["searchFilters"];
            that.Objects.SearchInput = elems["searchText"];

            that.set_search_input_placeholder();
            that.set_search_filters_visibility();

            GlobalUtilities.set_onchangeorenter(that.Objects.SearchInput, function () {
                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
            });

            if (elems["from"]) GlobalUtilities.append_calendar(elems["from"], {
                ClearButton: true,
                OnLoad: function () { elems["from"].innerHTML = ""; },
                OnSelect: function () { if (that.Objects.ListViewer) that.Objects.ListViewer.reset(); }
            }, function (cal) { that.Objects.DateFrom = cal; });

            if (elems["to"]) GlobalUtilities.append_calendar(elems["to"], {
                ClearButton: true,
                OnLoad: function () { elems["to"].innerHTML = ""; },
                OnSelect: function () { if (that.Objects.ListViewer) that.Objects.ListViewer.reset(); }
            }, function (cal) { that.Objects.DateTo = cal; });

            var set_selected_filter = function (obj) {
                if (obj.Selected) obj = null;

                var firstChild = elems["filters"].firstChild;
                while (firstChild) {
                    if (firstChild.Select) {
                        if (firstChild == obj) firstChild.Select();
                        else firstChild.Unselect();
                    }

                    firstChild = firstChild.nextSibling;
                }

                that.Objects.SelectedFilter = (obj || {}).TheFilter ? (obj || {}).TheFilter : null;

                that.set_search_input_placeholder();
                that.set_search_filters_visibility();

                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
            };

            that.Objects.Filters.forEach(function (fltr) {
                var filterElems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "container",
                        Class: "small-12 medium-12 large-12 rv-air-button rv-border-radius-quarter TextAlign",
                        Style: "position:relative; padding-" + RV_RevFloat + ":2.4rem; margin-bottom:0.5rem;",
                        Properties: [{ Name: "onclick", Value: function () { set_selected_filter(filterElems["container"]); } }],
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0.3rem; color:red;",
                                Childs: [{
                                    Type: "middle", Class: "rv-border-radius-quarter",
                                    Style: "padding:0.1rem 0.3rem; background-color:white; font-size:0.7rem;" +
                                        "width:1.8rem; text-align:center;",
                                    Childs: [{ Type: "text", TextValue: fltr.Count < 100 ? fltr.Count : (RV_RTL ? "+99" : "99+") }]
                                }]
                            },
                            { Type: "text", TextValue: fltr.Name }
                        ]
                    }
                ], elems["filters"]);

                filterElems["container"].TheFilter = fltr;

                filterElems["container"].Select = function () {
                    this.classList.remove("rv-air-button");
                    this.classList.add("rv-tab-selected");
                    this.Selected = true;
                };

                filterElems["container"].Unselect = function () {
                    this.classList.remove("rv-tab-selected");
                    this.classList.add("rv-air-button");
                    this.Selected = false;
                };
            });

            that.reset();
        },

        set_search_input_placeholder: function () {
            var that = this;
            if (!that.Objects.SearchInput) return;
            var hasNodeTypeId = (that.Objects.SelectedFilter || {}).NodeTypeID || that.Objects.NodeTypeID;
            var text = RVDic.SearchText + (!hasNodeTypeId ? "" : " " + RVDic.Or + " " + RVDic.AdditionalID);
            GlobalUtilities.set_inner_title(that.Objects.SearchInput, text);
        },

        set_search_filters_visibility: function () {
            var that = this;
            
            var totalCount = that.Objects.SelectedFilter ? that.Objects.SelectedFilter.Count :
                [0].concat((that.Objects.Filters || []).map(function (u) { return u.Count; }))
                    .reduce(function (total, num) { return total + num; });
            
            var isVisible = totalCount > that.Options.Count;

            if (!isVisible) that.Objects.SearchInput.value = "";

            if (that.Interface.SearchFiltersContainer)
                jQuery(that.Interface.SearchFiltersContainer)[isVisible ? "fadeIn" : "fadeOut"](0);
            
            return isVisible;
        },

        reset: function () {
            var that = this;

            that.Interface.ItemsArea.innerHTML = "";

            that.Objects.ListViewer = new NewSimpleListViewer(that.Interface.ItemsArea, {
                Options: {
                    Count: that.Options.Count,
                    AutoGrow: false,
                    OnDataRequest: function (options, done, setTotalCount) {
                        var filter = that.Objects.SelectedFilter || {};
                        var hasSearchFilters = that.set_search_filters_visibility();

                        NotificationsAPI.GetDashboards(GlobalUtilities.extend(options || {}, {
                            Type: that.Objects.Type, Done: that.Objects.Done, DistinctItems: that.Objects.DistinctItems,
                            NodeTypeID: that.Objects.NodeTypeID || filter.NodeTypeID, SubType: filter.SubType,
                            SearchText: !hasSearchFilters ? null : Base64.encode(GlobalUtilities.trim(that.Objects.SearchInput.value)),
                            DateFrom: !hasSearchFilters || !(that.Objects.DateFrom || {}).Get ? null : that.Objects.DateFrom.Get().Value,
                            DateTo: !hasSearchFilters || !(that.Objects.DateTo || {}).Get ? null : that.Objects.DateTo.Get().Value,
                            SubTypeTitle: filter.SubTypeTitle, InWorkFlow: filter.InWorkFlow,
                            UserID: (that.Objects.SelectedUser || {}).UserID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (that.Options.SetTotalCount) that.Options.SetTotalCount(result.TotalCount);
                                setTotalCount(result.TotalCount);
                                done(result.Items || []);

                                var notSeenIds = (result.Items || []).filter(function (u) { return !u.Seen; })
                                    .map(function (v) { return v.DashboardID; });

                                if (notSeenIds.length > 0) NotificationsAPI.SetDashboardsAsSeen({
                                    DashboardIDs: notSeenIds.join("|"), ParseResults: true,
                                    ResponseHandler: function (r) { }
                                });
                            }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        container.classList.add("rv-trim-vertical-margins");

                        var filter = that.Objects.SelectedFilter || {};

                        if (that.Objects.DistinctItems) that.add_node(container, item);
                        else that.add_item(container, item, {
                            ShowNodeType: !that.Objects.NodeTypeID && !filter.NodeTypeID,
                            OnRemove: function () { params.OnAfterRemove(item) }
                        });

                        params.OnAfterAdd();
                    },
                    OnNothingFound: function (itemsArea) {
                        itemsArea.innerHTML = "<div class='small-12 medium-12 large-12' style='text-align:center; color:rgb(100,100,100);" +
                            "font-weight:bold; font-size:1rem; padding:1rem;'>" + RVDic.NothingToDisplay + "</div>";
                    }
                }
            });
        },

        add_item: function (container, item, options) {
            item = item || {};
            options = options || {};
            var that = this;

            item.Info = JSON.parse(Base64.decode(item.Info) || "{}");

            var _arrData = ((DashboardTypes[item.Type] || {}).view || function () { return [] })(item);

            var _navigateUrl = item.Type == "Question" ? RVAPI.QuestionPageURL({ QuestionID: item.NodeID }) :
                RVAPI.NodePageURL({ NodeID: item.NodeID });

            var _action = !(DashboardTypes[item.Type] || {}).get_action ? null : DashboardTypes[item.Type].get_action(item);

            var removable = (DashboardTypes[item.Type] || {}).removable ?
                DashboardTypes[item.Type].removable(item) === true : item.Removable === true;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "margin:0.5rem 0 0 0; padding:0.5rem;", Name: "container", Link: _navigateUrl,
                    Class: "small-12 medium-12 large-12 row rv-border-radius-half rv-bg-color-white-softer SoftShadow" +
                        (item.Seen === true ? "" : " SoftBorder"),
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-size:0.8rem; position:relative; padding-" + RV_RevFloat + ":2rem;",
                            Childs: [
                                (that.Objects.Done || !removable ? null : {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }),
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.NodeName) }]
                                },
                                (!options.ShowNodeType || !item.NodeType ? null : {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:inline-block; font-size:0.6rem; padding:0.1rem 0.3rem; margin-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.NodeType) }]
                                })
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_RevFloat + ":4rem;",
                            Childs: (_arrData || []).concat([(that.Objects.Done || !_action ? null : {
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                Style: "position:absolute; bottom:0;" + RV_RevFloat + ":0; font-size:0.7rem;",
                                Properties: [{ Name: "onclick", Value: _action }],
                                Childs: [{ Type: "text", TextValue: RVDic.Action }]
                            })])
                        }
                    ]
                }
            ], container);

            if (elems["removeButton"]) elems["removeButton"].onclick = function (e) {
                e.stopPropagation();

                GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveTheDashboardItem, function (r) {
                    if (!r) return;

                    NotificationsAPI.RemoveDashboards({
                        DashboardID: item.DashboardID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                jQuery(elems["container"]).fadeOut(500, function () { this.remove(); });
                                if (options.OnRemove) options.OnRemove();
                            }
                        }
                    });
                });
            };
        },

        add_node: function (container, item) {
            var that = this;
            item = item || {};

            var name = Base64.decode(item.Name);
            var status = item.Status ? RVDic.CN[item.Status] : (item.WFState ? Base64.decode(item.WFState) : "");
            var hasCreator = !!(item.Creator || {}).UserName && !item.HideCreators &&
                (!item.Status || (item.Status == "Accepted"));

            var userId = (item.Creator || {}).UserID;
            var userProfileUrl = RVAPI.UserPageURL({ UserID: userId });
            var fullName = Base64.decode((item.Creator || {}).FirstName) + " " + Base64.decode((item.Creator || {}).LastName);

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemContainer",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow",
                    Style: "padding:0.4rem; margin-top:0.5rem; position:relative; cursor:pointer;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Link: RVAPI.NodePageURL({ NodeID: item.NodeID }),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; direction:" + (GlobalUtilities.textdirection(name) || '') + ";",
                                    Childs: [{
                                        Type: "a", Class: "rv-link",
                                        Attributes: [{ Name: "href", Value: RVAPI.NodePageURL({ NodeID: item.NodeID }) }],
                                        Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); } }],
                                        Childs: [{ Type: "text", TextValue: name }]
                                    }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.6rem; color:rgb(120,120,120);",
                            Childs: [
                                (!hasCreator ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow", Link: userProfileUrl,
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; margin-top:0.5rem;" +
                                        "padding:0.1rem 0.5rem; background-color:white;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-user", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: fullName }
                                    ]
                                }),
                                (!item.CreationDate ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.5rem;" +
                                        "margin-top:0.5rem; background-color:white;",
                                    Childs: [{ Type: "text", TextValue: item.CreationDate }]
                                }),
                                (!status ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.5rem;" +
                                        "margin-top:0.5rem; background-color:white;",
                                    Childs: [{ Type: "text", TextValue: status }]
                                }),
                                (!item.AdditionalID ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; padding:0.1rem 0.5rem;" +
                                        "margin-top:0.5rem; background-color:white;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; color:rgb(80,80,80); margin-" + RV_RevFloat + ":0.3rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Code + ":" }]
                                        },
                                        { Type: "text", TextValue: Base64.decode(item.AdditionalID) }
                                    ]
                                })
                            ]
                        }
                    ]
                }
            ], container);
        }
    };
})();