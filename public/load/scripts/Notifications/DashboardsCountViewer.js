(function () {
    if (window.DashboardsCountViewer) return;

    window.DashboardsCountViewer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            ItemsContainer: null,
            UserInfo: null
        };

        this.Objects = {
            SelectedUser: null
        };

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["NotificationsAPI", "UsersAPI", "CNAPI"] },
            { Root: "Notifications/", Ext: "js", Childs: ["DashboardTypes", "DashboardViewer"] }
        ], { OnLoad: function () { that.initialize(); } });
    };

    DashboardsCountViewer.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;" +
                        "position:relative; text-align:center; margin-bottom:1rem; font-size:1.2rem; font-weight:bold; padding:0 5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0;" + RV_RevFloat + ":0;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-air-button rv-circle",
                                    Style: "display:inline-block; padding:0.2rem 1rem; font-size:0.8rem; font-weight:normal; margin-" + RV_RevFloat + ":0.5rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.reset(); } }],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-refresh", Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.Refresh }
                                    ]
                                },
                                {
                                    Type: "div", Class: "rv-air-button rv-circle",
                                    Style: "display:inline-block; padding:0.2rem 1rem; font-size:0.8rem; font-weight:normal;",
                                    Properties: [{ Name: "onclick", Value: function () { that.supervision_options(); } }],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-cog", Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.Supervision }
                                    ]
                                }
                            ]
                        },
                        { Type: "text", TextValue: RVDic.Dashboard },
                        { Type: "div", Style: "display:none; margin-" + RV_Float + ":0.5rem;", Name: "userInfo" },
                        { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "dashboard" } }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "items", Style: "margin:0;" }
            ], that.Container);

            that.Interface.ItemsContainer = elems["items"];
            that.Interface.UserInfo = elems["userInfo"];

            that.reset();
        },

        supervision_options: function () {
            var that = this;

            if (that.SVContainer) return (that.SVContainer.Showed = GlobalUtilities.show(that.SVContainer));
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 rv-trim-vertical-margins SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        (!(window.RVGlobal || {}).IsSystemAdmin ? null : {
                            Type: "div", Style: "padding:0.5rem; margin-bottom:1rem; background-color:white;",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half SoftShadow",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.SelectAUserToSeeTheirDashboard }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "userSelect" }
                            ]
                        }),
                        {
                            Type: "div", Style: "padding:0.5rem; background-color:white;",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half SoftShadow",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.SelectNodeToSeeRelatedDashboards }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypeSelect" },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeSelect", Style: "margin-top:0.5rem;" },
                                {
                                    Type: "div", Class: "small-5 medium-4 large-3 rv-air-button rv-circle",
                                    Style: "margin:1rem auto 0 auto;", Name: "currentItems",
                                    Childs: [{ Type: "text", TextValue: RVDic.Show }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            that.SVContainer = elems["container"];
            that.SVContainer.Showed = GlobalUtilities.show(that.SVContainer);

            if (elems["userSelect"]) {
                GlobalUtilities.append_autosuggest(elems["userSelect"], {
                    InputClass: "rv-input",
                    InputStyle: "width:100%; font-size:0.7rem;",
                    InnerTitle: RVDic.UserSelect + "...",
                    AjaxDataSource: UsersAPI.GetUsersDataSource(),
                    ResponseParser: function (responseText) {
                        var users = JSON.parse(responseText).Users || [];
                        var arr = [];
                        for (var i = 0, lnt = users.length; i < lnt; ++i) {
                            var fullname = Base64.decode(users[i].FirstName) + " " + Base64.decode(users[i].LastName);
                            arr.push([fullname + " - " + Base64.decode(users[i].UserName), users[i].UserID]);
                        }
                        return arr;
                    },
                    OnSelect: function (index) {
                        that.Objects.SelectedUser = { UserID: this.values[index], FullName: this.keywords[index] };
                        this.clear();
                        that.SVContainer.Showed.Close();
                        that.reset();
                    }
                });
            }

            nodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + " " + "(" + RVDic.Optional + ")" + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex];
                    var nodeType = this.keywords[this.selectedIndex];
                    nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(nodeSelect.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + " " + RVDic.Or + " " + RVDic.AdditionalID + "...");
                }
            });

            nodeSelect = GlobalUtilities.append_autosuggest(elems["nodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + " " + RVDic.Or + " " + RVDic.AdditionalID + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].Name || "");
                        if ((items[i].AdditionalID || "") == "") tt += " - " + Base64.decode(items[i].AdditionalID || "");
                        arr.push([tt, items[i].NodeID]);
                    }
                    return arr;
                }
            });

            elems["currentItems"].onclick = function () {
                var index = nodeTypeSelect.selectedIndex;
                var nodeTypeId = index < 0 ? null : nodeTypeSelect.values[index];

                index = nodeSelect.selectedIndex;
                var nodeId = index < 0 || !GlobalUtilities.trim(nodeSelect.InputElement.value) ? null : nodeSelect.values[index];
                var inputValue = nodeId ? "" : GlobalUtilities.trim(nodeSelect.InputElement.value);
                var nodeAdditionalId = nodeId ? "" : inputValue;

                NotificationsAPI.GetCurrentDashboards({
                    NodeTypeID: nodeTypeId, NodeID: nodeId, NodeAdditionalID: nodeAdditionalId, ParseResults: true,
                    ResponseHandler: function (result) {
                        that.show_current_items(result.Items || []);
                    }
                });
            };
        },

        reset: function () {
            var that = this;

            that.Interface.ItemsContainer.innerHTML = "";
            that.Interface.UserInfo.innerHTML = "";
            jQuery(that.Interface.UserInfo).fadeOut(0);

            GlobalUtilities.loading(that.Interface.ItemsContainer);

            NotificationsAPI.GetDashboardsCount({
                UserID: (that.Objects.SelectedUser || {}).UserID, ParseResults: true,
                ResponseHandler: function (result) {
                    that.Interface.ItemsContainer.innerHTML = "";

                    if ((that.Objects.SelectedUser || {}).UserID) {
                        that.Interface.UserInfo.style.display = "inline-block";

                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Name: "info",
                                Class: "rv-border-radius-quarter SoftBackgroundColor SoftShadow",
                                Style: "position:relative; font-size:0.8rem; font-weight:normal; padding:0.3rem;" +
                                    "padding-" + RV_RevFloat + ":1.7rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;",
                                        Childs: [{
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{
                                                Name: "onclick",
                                                Value: function () {
                                                    that.Objects.SelectedUser = null;
                                                    that.reset();
                                                }
                                            }]
                                        }]
                                    },
                                    { Type: "text", TextValue: that.Objects.SelectedUser.FullName }
                                ]
                            }
                        ], that.Interface.UserInfo);
                    }

                    if (!(result.Items || []).length) {
                        return (that.Interface.ItemsContainer.innerHTML = "<div class='small-12 medium-12 large-12' " +
                            "style='text-align:center; color:rgb(100,100,100);" +
                            "font-weight:bold; font-size:1rem; padding:1rem;'>" + RVDic.NothingToDisplay + "</div>");
                    }

                    (result.Items || []).forEach(function (item) {
                        if (["Wiki", "MembershipRequest"].some(function (x) { return x == item.Type; }))
                            that.add_item(that.Interface.ItemsContainer, item);
                        else if ((item.Sub || []).length && (item.Sub[0].Sub || []).length)
                            item.Sub.forEach(function (x) { that.add_item(that.Interface.ItemsContainer, x); });
                        else that.add_item(that.Interface.ItemsContainer, item);
                    });
                }
            });
        },

        add_item: function (container, item) {
            var that = this;

            var countPartsDic = {
                ToBeDone: { Class: "rv-air-button-soft-red" },
                Done: { Class: "rv-air-button-soft-green" },
                DoneItems: { Class: "rv-air-button-soft-blue" }
            };

            var _create_count = function (name, value) {
                return !value || !countPartsDic[name] ? null : {
                    Type: "div", Name: name,
                    Class: "small-12 medium-12 large-12 rv-air-button-base " +
                        countPartsDic[name].Class + " rv-border-radius-quarter TextAlign",
                    Style: "position:relative; padding:0.3rem; margin-bottom:0.5rem; padding-" + RV_RevFloat + ":2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0.3rem; font-size:1rem;",
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: value }] }]
                        },
                        { Type: "text", TextValue: RVDic.NTFN.CountParts[name] || name }
                    ]
                };
            };

            var title = Base64.decode(item.NodeType) || RVDic[item.Type] || item.Type;

            var icons = {
                Wiki: "fa-book",
                MembershipRequest: "fa-user-circle-o",
                Question: "fa-question-circle-o"
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "padding:0.5rem; height:100%; position:relative;",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-softer-soft SoftShadow",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "text-align:center; font-weight:bold; font-size:1rem;",
                                    Childs: [
                                        (!icons[item.Type] ? null : {
                                            Type: "i", Class: "fa " + icons[item.Type] + " fa-lg", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }),
                                        {
                                            Type: "div", Style: "display:inline-block;",
                                            Childs: [{ Type: "text", TextValue: title }]
                                        },
                                        (!item.NotSeen ? null : {
                                            Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                            Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.7rem;" +
                                                "background-color:red; color:white; padding:0.1rem 0.3rem;",
                                            Childs: [{ Type: "text", TextValue: item.NotSeen }]
                                        })
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-trim-vertical-margins",
                                    Style: "padding:0.5rem; background-color:white; margin-top:0.8rem;",
                                    Childs: [
                                        _create_count("ToBeDone", item.ToBeDone),
                                        _create_count("Done", item.Done),
                                        _create_count("DoneItems", +(item.DoneAndInWorkFlow || "0") + +(item.DoneAndNotInWorkFlow || "0"))
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var _set_onclick = function (btn, options) {
                if (!btn) return;

                btn.onclick = function () { that.show_dashboard(options); };
            };

            var subTypesFilter = (item.Sub || []).filter(function (u) { return !!u.SubType; })
                .map(function (itm) { return { Name: itm.SubType, ToBeDone: itm.ToBeDone, Done: itm.Done }; }) || [];

            if (!subTypesFilter.length) subTypesFilter = (item.Sub || []).filter(function (u) { return !!u.SubTypeTitle; })
                .map(function (itm) { return { Name: Base64.decode(itm.SubTypeTitle), ToBeDone: itm.ToBeDone, Done: itm.Done }; }) || [];

            var nodeTypesFilter = item.NodeTypeID ? [] : (item.Sub || []).filter(function (u) { return !!u.NodeTypeID; })
                .map(function (itm) {
                    return { ID: itm.NodeTypeID, Name: Base64.decode(itm.NodeType), ToBeDone: itm.ToBeDone, Done: itm.Done };
                }) || [];

            _set_onclick(elems["ToBeDone"], {
                Done: false,
                Type: item.Type,
                NodeTypeID: item.NodeTypeID,
                NodeType: Base64.decode(item.NodeType),
                Filters: !nodeTypesFilter.length ?
                    subTypesFilter.filter(function (u) { return !!u.Name && !!u.ToBeDone; })
                        .map(function (itm) {
                            return {
                                SubType: itm.Name, SubTypeTitle: Base64.encode(itm.Name),
                                Name: RVDic.NTFN.DashboardSubTypes[itm.Name] || itm.Name, Count: itm.ToBeDone
                            };
                        }) :
                    nodeTypesFilter.filter(function (u) { return !!u.Name && !!u.ToBeDone; })
                        .map(function (itm) { return { NodeTypeID: itm.ID, Name: itm.Name, Count: itm.ToBeDone }; }),
                Options: { Title: title, Type: RVDic.NTFN.CountParts.ToBeDone }
            });

            _set_onclick(elems["Done"], {
                Done: true, Type: item.Type,
                NodeTypeID: item.NodeTypeID, NodeType: Base64.decode(item.NodeType),
                Filters: !nodeTypesFilter.length ?
                    subTypesFilter.filter(function (u) { return !!u.Name && !!u.Done; })
                        .map(function (itm) {
                            return {
                                SubType: itm.Name, SubTypeTitle: Base64.encode(itm.Name),
                                Name: RVDic.NTFN.DashboardSubTypes[itm.Name] || itm.Name, Count: itm.Done
                            };
                        }) :
                    nodeTypesFilter.filter(function (u) { return !!u.Name && !!u.Done; })
                        .map(function (itm) { return { NodeTypeID: itm.ID, Name: itm.Name, Count: itm.Done }; }),
                Options: { Title: title, Type: RVDic.NTFN.CountParts.Done }
            });

            _set_onclick(elems["DoneItems"], {
                DistinctItems: true, Type: item.Type,
                NodeTypeID: item.NodeTypeID, NodeType: Base64.decode(item.NodeType),
                Filters: [
                    { InWorkFlow: true, Name: RVDic.InWorkFlow, Count: item.DoneAndInWorkFlow },
                    { InWorkFlow: false, Name: RVDic.Ended, Count: item.DoneAndNotInWorkFlow }
                ].filter(function (u) { return !!u.Count; }),
                Options: { Title: title, Type: RVDic.NTFN.CountParts.DoneItems }
            });
        },

        show_dashboard: function (params) {
            var that = this;
            params = GlobalUtilities.extend(params || {}, { SelectedUser: that.Objects.SelectedUser });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-10 large-9 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem; position:relative;", Name: "container",
                    Childs: [
                        { Type: "div", Style: "position:absolute; top:1rem;" + RV_RevFloat + ":1rem;", Name: "totalCount" },
                        (!(params.Options || {}).Title ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:1rem; text-align:center; font-weight:bold; font-size:1rem;",
                            Childs: [
                                { Type: "text", TextValue: params.Options.Title },
                                (!params.Options.Type ? null : {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;" +
                                        "font-size:0.7rem; font-weight:bold; cursor:default;",
                                    Childs: [{ Type: "text", TextValue: params.Options.Type }]
                                })
                            ]
                        }),
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["_div"]);
            GlobalUtilities.show(elems["container"]);

            params.SetTotalCount = function (cnt) {
                elems["totalCount"].innerHTML = "";
                
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div",
                        Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-weight:bold; color:rgb(100,100,100)",
                        Childs: [{ Type: "text", TextValue: RVDic.Count + ":" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; color:red; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: cnt || "0" }]
                    }
                ], elems["totalCount"]);
            };

            new DashboardViewer(elems["_div"], params);
        },

        show_current_items: function (items) {
            var that = this;

            items = items || [];

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectedNodeCurrentlyIsInBelowDashboards }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" }
                    ]
                }
            ]);

            GlobalUtilities.show(elems["container"]);

            if (!items.length) {
                return (elems["items"].innerHTML = "<div style='text-align:center; color:rgb(100,100,100);" +
                    "font-weight:bold; font-size:1rem; padding:1rem;'>" + RVDic.NothingToDisplay + "</div>");
            }

            items.forEach(function (item) {
                item.Info = {}; //it should not be used
                item.User = item.User || {};
                
                if (item.SubType == "Evaluator") {
                    item.User.FirstName = Base64.encode(RVDic.Anonymous);
                    item.User.LastName = item.User.UserName = "";
                }

                var _arrData = ((DashboardTypes[item.Type] || {}).view || function () { return [] })(item);

                var _navigateUrl = item.Type == "Question" ? RVAPI.QuestionPageURL({ QuestionID: item.NodeID }) :
                    RVAPI.NodePageURL({ NodeID: item.NodeID });

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "margin:0.5rem 0 0 0; padding:0.5rem;", Name: "container", Link: _navigateUrl,
                        Class: "small-12 medium-12 large-12 row rv-border-radius-half rv-bg-color-white-softer SoftShadow",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "font-size:0.8rem; position:relative; padding-" + RV_RevFloat + ":2rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "display:inline-block;",
                                        Childs: [{ Type: "text", TextValue: Base64.decode(item.NodeName) }]
                                    },
                                    (!item.NodeType ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; font-size:0.6rem; padding:0.1rem 0.3rem; margin-" + RV_Float + ":0.5rem;",
                                        Childs: [{ Type: "text", TextValue: Base64.decode(item.NodeType) }]
                                    })
                                ]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "position:relative; padding-" + RV_RevFloat + ":4rem;",
                                Childs: [{
                                    Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                                    Style: "display:inline-block; margin-top:0.5rem; margin-" + RV_RevFloat + ":0.3rem;" +
                                        "background-color:white; padding:0.1rem 0.3rem; font-size:0.7rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-user", Style: "margin-" + RV_RevFloat + ":0.3rem; color:rgb(120,120,120);",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block; color:rgb(120,120,120);",
                                            Childs: [{ Type: "text", TextValue: GlobalUtilities.trim(Base64.decode(item.User.FirstName) + " " + Base64.decode(item.User.LastName)) }]
                                        }
                                    ]
                                }].concat(_arrData || [])
                            }
                        ]
                    }
                ], elems["items"]);
            });
        }
    };
})();