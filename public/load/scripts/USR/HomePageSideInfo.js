(function () {
    if (window.HomePageSideInfo) return;

    window.HomePageSideInfo = function (container, params) {
        this.ContainerDiv = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            Lists: null
        };
        
        this.Objects = {
            User: params.User
        };

        this.Options = {
            Modules: params.Modules
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js", "CN/NodesListViewer.js"], {
            OnLoad: function () { that._initialize(); }
        });
    };

    HomePageSideInfo.prototype = {
        _initialize: function () {
            var that = this;

            var isSaaS = (window.RVGlobal || {}).SAASBasedMultiTenancy;

            //initialize variables
            var fullName = GlobalUtilities.trim(Base64.decode(that.Objects.User.FirstName) + " " + Base64.decode(that.Objects.User.LastName));
            var jobTitle = Base64.decode(that.Objects.User.JobTitle);
            
            var groupId = that.Objects.User.GroupID;
            var groupName = Base64.decode(that.Objects.User.GroupName);
            //end of variables initialization

            var listNames = ["intellectualProperties", "expertiseDomains", "membershipDomains", "favorites"];
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "padding-" + RV_RevFloat + ":1rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SurroundingShadow",
                            Style: "background-color:white; padding-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-ignore-bottom-radius",
                                    Style: "position:relative; height:6rem; background-repeat:no-repeat; background-size:cover;" +
                                        "background-position:center center; background-image: url('" + that.Objects.User.CoverPhotoURL + "');",
                                    Childs: [{
                                        Type: "div", Style: "position:absolute; bottom:-2.5rem; left:0; right:0; text-align:center;",
                                        Childs: [{
                                            Type: "div", Class: "SoftBorder rv-circle",
                                            Style: "display:inline-block; width:6rem; height:6rem; border-color:white;",
                                            Childs: [{
                                                Type: "img", Class: "rv-circle", Style: "width:100%; height:100%;",
                                                Link: RVAPI.UserPageURL({ Tab: "Resume" }),
                                                Attributes: [{ Name: "src", Value: GlobalUtilities.add_timestamp(that.Objects.User.ProfileImageURL) }]
                                            }]
                                        }]
                                    }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 WarmColor",
                                    Style: "margin-top:3rem; font-weight:bold; text-align:center;",
                                    Childs: [{ Type: "text", TextValue: fullName }]
                                },
                                (!jobTitle && (!groupId || !groupName) ? null : {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-top:0.3rem; padding:0 0.5rem; text-align:center;",
                                    Childs: [
                                        (!jobTitle ? null : {
                                            Type: "div", Style: "display:inline-block; color:rgb(80,80,80);",
                                            Childs: [{ Type: "text", TextValue: jobTitle }]
                                        }),
                                        (!groupId || !groupName ? null : {
                                            Type: "div",
                                            Style: "display:inline-block; color:rgb(120,120,120);" +
                                                (!jobTitle ? "" : "margin-" + RV_Float + ":0.5rem;") +
                                                "margin-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [{ Type: "text", TextValue: " " + RVDic.In + " " }]
                                        }),
                                        (!groupId || !groupName ? null : {
                                            Type: "div", Link: RVAPI.NodePageURL({ NodeID: groupId }), Style: "display:inline-block;",
                                            Childs: [{ Type: "text", TextValue: groupName }]
                                        })
                                    ]
                                }),
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                                    Style: "padding:0 1rem; margin-top:1rem; display:none;", Name: "lists",
                                    Childs: listNames.map(function (name) {
                                        return { Type: "div", Style: "margin-bottom:0.5rem; display:none;", Name: name };
                                    })
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "remoteSearch", Style: "padding:1rem 1rem 0 1rem;" }
                            ]
                        },
                        { Type: "div", Name: "nodesOfFriends", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem; display:none;" },
                        { Type: "div", Name: "friendSuggestions", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem; display:none;" },
                        (!that.Options.Modules.SignUpViaInvitation ? null : {
                            Type: "div", Name: "invitationArea", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem; display:none;"
                        }),
                        (!isSaaS ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-air-button",
                            Style: "margin-top:1rem; display:none;", Name: "templates",
                            Childs: [{ Type: "text", TextValue: RVDic.TemplatesGallery }]
                        })
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.Lists = elems["lists"];

            //Fill Intellectual Properties
            that.create_list(elems["intellectualProperties"], {
                APIFunction_Count: "GetIntellectualPropertiesCount",
                APIFunction: "GetIntellectualProperties",
                Title: RVDic.IntellectualProperties,
                HelpEntryName: "intellectualproperties"
            });
            //end of Fill Intellectual Properties


            //Fill Expertise Domains
            that.create_list(elems["expertiseDomains"], {
                APIFunction_Count: "GetExpertiseDomainsCount",
                APIFunction: "GetExpertiseDomains",
                Title: RVDic.ExpertiseDomains,
                HelpEntryName: "expertisedomains"
            });
            //end of Fill Expertise Domains


            //Fill Membership Domains
            that.create_list(elems["membershipDomains"], {
                APIFunction_Count: "GetMembershipDomainsCount",
                APIFunction: "GetMembershipDomains",
                Title: RVDic.Groups,
                HelpEntryName: "groups"
            });
            //end of Fill Membership Domains


            //Fill Favorite Nodes
            that.create_list(elems["favorites"], {
                APIFunction_Count: "GetFavoriteNodesCount",
                APIFunction: "GetFavoriteNodes",
                Title: RVDic.Favorites,
                HelpEntryName: "favorites"
            });
            //end of Fill Favorite Nodes

            //Fill Intellectual Properties of Friends
            if (that.Options.Modules.SocialNetwork) {
                GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                    OnLoad: function () { that.intellectual_properties_of_friends(elems["nodesOfFriends"]); }
                });
            }
            //end of Fill Intellectual Properties of Friends


            //Fill Friend Suggestions
            if (that.Options.Modules.SocialNetwork) {
                GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js", "API/UsersAPI.js"], {
                    OnLoad: function () { that.friend_suggestions(elems["friendSuggestions"]); }
                });
            }
            //end of Fill Friend Suggestions


            if (!isSaaS) {
                GlobalUtilities.load_files(["API/PrivacyAPI.js"], {
                    OnLoad: function () {
                        PrivacyAPI.CheckAuthority({
                            Permissions: "RemoteServers", ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.RemoteServers) {
                                    GlobalUtilities.create_nested_elements([{
                                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                        Style: "margin:0 auto; padding:0.3rem; color:black;", Link: RVAPI.RemoteSearchPageURL(),
                                        Childs: [{ Type: "text", TextValue: RVDic.SearchRemoteServers }]
                                    }], elems["remoteSearch"]);
                                }
                            }
                        });
                    }
                });
            }


            if (false && that.Options.Modules.SignUpViaInvitation && elems["invitationArea"]) {
                GlobalUtilities.load_files(["USR/Invitation.js"], {
                    OnLoad: function () {
                        jQuery(elems["invitationArea"]).fadeIn(0);
                        new Invitation(elems["invitationArea"], { UserID: ((window.RVGlobal || {}).CurrentUser || {}).UserID });
                    }
                });
            }

            if (elems["templates"]) elems["templates"].onclick = function () {
                var btn = this;

                if (btn.Templates) {
                    btn.Templates.Showed = GlobalUtilities.show(btn.Templates.Container);
                    return;
                }

                btn.Templates = { Showed: null, Container: null };

                var _div = btn.Templates.Container = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "_div"
                }])["_div"];

                GlobalUtilities.loading(_div);

                btn.Templates.Showed = GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["Templates/Templategallery.js"], {
                    OnLoad: function () {
                        new TemplateGallery(_div);
                    }
                })
            };
        },

        create_list: function (container, params) {
            params = params || {};
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow", 
                    Style: "position:relative; padding:0.5rem; padding-" + RV_RevFloat + ":5.5rem; cursor:pointer; height:2.8rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "middle", Style: "text-align:center;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pie-chart fa-lg rv-icon-button",
                                            Tooltip: RVDic.Chart, Name: "chartButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":2.5rem; width:3rem;",
                            Childs: [
                                {
                                    Type: "middle", Class: "RevTextAlign",
                                    Childs: [{ Type: "div", Style: "color:red;", Name: "count" }]
                                }
                            ]
                        },
                        {
                            Type: "middle", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: params.Title }]
                        }
                    ]
                }
            ], container);

            CNAPI[params.APIFunction_Count]({
                ParseResults: true,
                ResponseHandler: function (result) {
                    var nodeTypes = result.NodeTypes || [];

                    var count = !nodeTypes.length ? 0 : (nodeTypes.length == 1 ? nodeTypes[0].Count :
                        nodeTypes.reduce(function (total, item) { return (total.Count || total) + item.Count; }));
                    
                    if (!count) return;
                    else jQuery(that.Interface.Lists).fadeIn(0);

                    jQuery(container).fadeIn(500);

                    elems["container"].onclick = function () {
                        that.show_items(nodeTypes, params.Title, params.APIFunction, params.HelpEntryName);
                    };

                    elems["count"].innerHTML = GlobalUtilities.convert_numbers_to_persian(count);

                    elems["chartButton"].onclick = function (e) {
                        if ((window.event || {}).cancelBubble) window.event.cancelBubble = true;
                        else e.stopPropagation();

                        that.show_pie_chart(nodeTypes, params.Title, params.APIFunction, params.HelpEntryName);
                    };
                }
            });
        },

        show_pie_chart: function (nodeTypes, title, apiFunction, helpEntryName) {
            var that = this;

            that.__PieChartContainers = {};

            if (that.__PieChartContainers[apiFunction]) return GlobalUtilities.show(that.__PieChartContainers[apiFunction]);

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1", Name: "container",
                    Style: "margin:0 auto; padding:1rem; background-color:white; direction:ltr; position:relative;",
                    Childs: [
                        {
                            Type: "div", Class: "Direction",
                            Style: "text-align:center; font-weight:bold; margin-bottom:8px;",
                            Childs: [{ Type: "text", TextValue: title }]
                        },
                        { Type: "div", Name: "_div" },
                        {
                            Type: "div", Class: "rv-air-button rv-circle",
                            Style: "position:absolute;" + window.RV_RevFloat + ":1rem; top:1rem;",
                            Properties: [
                                { Name: "onclick", Value: function () { that.start_compare(nodeTypes, title, apiFunction); } }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.CompareWithOthers }]
                        }
                    ]
                }
            ]);

            var _container = that.__PieChartContainers[apiFunction] = _el["container"];

            GlobalUtilities.loading(_el["_div"]);
            GlobalUtilities.show(_container);

            var totalCount = 0;
            var _data = [];

            for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i) totalCount += nodeTypes[i].Count;

            for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i) {
                var ttl = Base64.decode(nodeTypes[i].NodeType) + " - " +
                    String(Number(nodeTypes[i].Count * 100 / totalCount).toFixed(2)) + " " + RVDic.Percent;

                _data.push([
                    ttl,
                    nodeTypes[i].Count,
                    { NodeTypeID: nodeTypes[i].NodeTypeID, NodeType: Base64.decode(nodeTypes[i].NodeType) }
                ]);
            }

            GlobalUtilities.load_files([{ Root: "HighCharts/", Ext: "js", Childs: ["highcharts", "highcharts-3d"] }], {
                LoadSequential: true,
                OnLoad: function () {
                    jQuery(_el["_div"]).highcharts({
                        chart: { type: 'pie', options3d: { enabled: true, alpha: 45 }, style: { fontFamily: 'AMitra' } },
                        title: { text: null },
                        plotOptions: {
                            pie: {
                                innerSize: 100, depth: 45,
                                events: {
                                    click: function (e) {
                                        var index = e.point.index;
                                        
                                        that.show_items([{
                                            NodeTypeID: _data[index][2].NodeTypeID,
                                            NodeType: Base64.encode(_data[index][2].NodeType),
                                            Count: _data[index][1]
                                        }], title, apiFunction, helpEntryName);
                                    }
                                }
                            }
                        },
                        series: [{ name: RVDic.Count, data: _data }]
                    });
                }
            });
        },

        start_compare: function (nodeTypes, title, apiFunction) {
            var that = this;

            that.__CompareChart = that.__CompareChart || {};
            if (that.__CompareChart[apiFunction]) return GlobalUtilities.show(that.__CompareChart[apiFunction]);

            var currentUser = {
                UserID: (that.Objects.User || {}).UserID,
                FullName: GlobalUtilities.trim((Base64.decode((that.Objects.User || {}).FirstName) || " ") + " " +
                    (Base64.decode((that.Objects.User || {}).LastName) || " ")) || Base64.decode((that.Objects.User || {}).UserName)
            };

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 row rv-border-radius-1", Name: "container",
                    Style: "margin:0 auto; padding:1rem; background-color:white; direction:ltr;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 Direction",
                            Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: title + " - " + RVDic.Compare }]
                        },
                        { Type: "div", Class: "small-8 medium-8 large-8", Name: "_div", Style: "min-height:30rem;" },
                        { Type: "div", Class: "small-4 medium-4 large-4 Direction", Name: "userSelect" }
                    ]
                }
            ]);

            GlobalUtilities.loading(_el["userSelect"]);

            GlobalUtilities.load_files(["API/CNAPI.js", "API/UsersAPI.js", "SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    var nsdc = new NewSingleDataContainer(_el["userSelect"], {
                        InputClass: "rv-input",
                        InputStyle: "width:100%; font-size:0.7rem;",
                        InnerTitle: RVDic.UserSelect + "...",
                        NoButtons: true,
                        AjaxDataSource: UsersAPI.GetUsersDataSource(),
                        ResponseParser: function (responseText) {
                            return (JSON.parse(responseText).Users || []).map(function (itm) {
                                var fullname = GlobalUtilities.trim((Base64.decode(itm.FirstName) || " ") + " " +
                                    (Base64.decode(itm.LastName) || " ")) || Base64.decode(itm.UserName);

                                return [fullname, itm.UserID];
                            });
                        },
                        OnAfterAdd: function (_itm) {
                            GlobalUtilities.block(_el["userSelect"]);
                            
                            CNAPI[apiFunction + "Count"]({
                                UserID: _itm.ID, ParseResults: true,
                                ResponseHandler: function (result) {
                                    add_user({ UserID: _itm.ID, FullName: _itm.Title }, result.NodeTypes || []);
                                    GlobalUtilities.unblock(_el["userSelect"]);
                                }
                            });
                        },
                        OnAfterRemove: function (_itm) { remove_user(_itm.ID); }
                    });

                    nsdc.add_item(currentUser.FullName, currentUser.UserID);
                }
            });

            var _container = that.__CompareChart[apiFunction] = _el["container"];

            GlobalUtilities.loading(_el["_div"]);
            GlobalUtilities.show(_container);

            var _data = [];

            for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i) {
                _data.push([
                    Base64.decode(nodeTypes[i].NodeType) + " - " + nodeTypes[i].Count,
                    nodeTypes[i].Count,
                    { NodeTypeID: nodeTypes[i].NodeTypeID, NodeType: Base64.decode(nodeTypes[i].NodeType) }
                ]);
            }

            var chart = null;
            var processing = false;

            var plot = function (users) {
                if (processing) return;

                users = users || [];

                var ntIdDic = {};
                var ntUnion = [];
                var categories = [];

                for (var i = 0, lnt = users.length; i < lnt; ++i) {
                    for (var ntId in (users[i].NodeTypes || {})) {
                        if (ntIdDic[ntId]) continue;

                        ntIdDic[ntId] = true;
                        ntUnion.push(users[i].NodeTypes[ntId]);
                        categories.push(Base64.decode(users[i].NodeTypes[ntId].NodeType));
                    }
                }

                var series = [];

                for (var i = 0, lnt = users.length; i < lnt; ++i) {
                    var usrData = [];

                    for (var j = 0, _ln = ntUnion.length; j < _ln; ++j) {
                        var ntId = ntUnion[j].NodeTypeID;
                        usrData.push(users[i].NodeTypes[ntId] ? users[i].NodeTypes[ntId].Count : 0);
                    }

                    series.push({ name: users[i].FullName, data: usrData, pointPlacement: 'on' });
                }

                if (chart) {
                    for (var i = chart.series.length - 1; i >= 0; --i)
                        chart.series[i].remove(false);

                    for (var i = 0, lnt = series.length; i < lnt; ++i)
                        chart.addSeries(series[i], false);

                    //chart.series[0].update({ data: [series[0].data[0]] });

                    chart.xAxis[0].update({ categories: categories }, false);

                    return chart.redraw();
                }

                processing = true;

                GlobalUtilities.load_files([{ Root: "HighCharts/", Ext: "js", Childs: ["highcharts", "highcharts-more"] }], {
                    LoadSequential: true,
                    OnLoad: function () {
                        jQuery(_el["_div"]).highcharts({
                            chart: { polar: true, type: 'line', style: { fontFamily: 'AMitra' } },
                            title: { text: null },
                            pane: { size: '88%' },
                            xAxis: { categories: categories, tickmarkPlacement: 'on', lineWidth: 0 },
                            yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0 },
                            tooltip: {
                                shared: true,
                                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
                            },
                            legend: { align: 'right', verticalAlign: 'top', y: 70, layout: 'vertical' },
                            series: series
                        });

                        chart = jQuery(_el["_div"]).highcharts();

                        processing = false;
                    }
                });
            } //end of 'function plot...'

            var plotItems = [];

            var add_user = function (userInfo, userNodeTypes) {
                if (plotItems.length == 1 && plotItems[0].UserID == userInfo.UserID) return;

                var usr = { UserID: userInfo.UserID, FullName: userInfo.FullName, NodeTypes: {} };
                for (var i = 0, lnt = (userNodeTypes || []).length; i < lnt; ++i)
                    usr.NodeTypes[userNodeTypes[i].NodeTypeID] = userNodeTypes[i];
                plotItems.push(usr);
                plot(plotItems);
            };

            var remove_user = function (userId) {
                var newItems = [];
                for (var i = 0, lnt = plotItems.length; i < lnt; ++i)
                    if (plotItems[i].UserID != userId) newItems.push(plotItems[i]);
                plotItems = newItems;
                plot(plotItems);
            };

            add_user(currentUser, nodeTypes);
        },

        show_items: function (nodeTypes, title, _function, helpEntryName) {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-10 large-9 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);
            
            GlobalUtilities.load_files(["CN/NodesListViewer.js"], {
                OnLoad: function () {
                    new NodesListViewer(_div, {
                        Title: title,
                        APIFunc: _function,
                        NodeTypes: nodeTypes,
                        HelpEntryName: helpEntryName
                    });
                }
            });
        },

        intellectual_properties_of_friends: function (containerDiv) {
            var that = this;

            var obj = GlobalUtilities.sidebox(containerDiv, { Title: RVDic.ContentsGeneratedByMyCoworkers, Button: true });

            var _nofContainer = obj.Content;
            var button = obj.Button;

            _nofContainer.style.overflow = "hidden";

            var _toggleClass = function () {
                this.classList.toggle("fa-angle-double-down");
                this.classList.toggle("fa-angle-double-up");

                if (_nofContainer.style.display == "none") jQuery(_nofContainer).fadeIn(); else jQuery(_nofContainer).fadeOut();
            };

            GlobalUtilities.create_nested_elements([{
                Type: "i", Class: "fa fa-angle-double-up fa-2x rv-icon-button",
                Properties: [{ Name: "onclick", Value: function () { _toggleClass.call(this); } }]
            }], button);

            var lastItem = 0;

            new NewSimpleListViewer(_nofContainer, {
                Options: {
                    Width: 204, InnerWidthOffset: 0, Count: 5,
                    OnDataRequest: function (options, done) {
                        _nofContainer.style.overflowY = "hidden";

                        CNAPI.GetIntellectualPropertiesOfFriends(GlobalUtilities.extend(options || {}, {
                            CreatorInfo: true, ParseResults: true, LowerBoundary: lastItem + 1,
                            ResponseHandler: function (result) { lastItem = result.LastItem; done(result.Nodes || []); }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        containerDiv.style.display = "block";

                        var name = Base64.decode(item.Name);
                        var nodePageUrl = RVAPI.NodePageURL({ NodeID: item.NodeID });

                        var nodeType = Base64.decode(item.NodeType);

                        var fullname = (GlobalUtilities.trim(Base64.decode((item.Creator || {}).FirstName) + " " +
                            Base64.decode((item.Creator || {}).LastName))) || RVDic.Anonymous;
                        var profileImageUrl = (item.Creator || {}).ProfileImageURL || (item.Creator || {}).ImageURL ||
                            GlobalUtilities.icon("Unknown.jpg");

                        GlobalUtilities.create_nested_elements([{
                            Type: "div", Link: nodePageUrl,
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer",
                            Style: "padding:0.3rem; position:relative; padding-" + RV_Float + ":3rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter",
                                            Style: "width:2rem; height:2rem;", Tooltip: fullname,
                                            Attributes: [{ Name: "src", Value: profileImageUrl }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row",
                                    Style: "margin:0rem; font-size:0.7rem;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Childs: [
                                                { Type: "text", TextValue: name },
                                                {
                                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                                    Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;" +
                                                        "font-size:0.6rem; padding:0.1rem 0.3rem;",
                                                    Childs: [{ Type: "text", TextValue: nodeType }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 WarmColor RevTextAlign",
                                            Style: "margin-top:0.2rem; font-size:0.7rem;",
                                            Childs: [{ Type: "text", TextValue: item.CreationDate }]
                                        }
                                    ]
                                }
                            ]
                        }], container);

                        params.OnAfterAdd();
                    }
                }
            });
        },

        friend_suggestions: function (containerDiv) {
            var that = this;

            var obj = GlobalUtilities.sidebox(containerDiv, { Title: RVDic.FriendSuggestions, Button: true });

            var _nofContainer = obj.Content;
            var button = obj.Button;

            _nofContainer.style.overflow = "hidden";

            var _toggleClass = function () {
                this.classList.toggle("fa-angle-double-down");
                this.classList.toggle("fa-angle-double-up");

                if (_nofContainer.style.display == "none") jQuery(_nofContainer).fadeIn(); else jQuery(_nofContainer).fadeOut();
            }

            GlobalUtilities.create_nested_elements([
                {
                    Type: "i", Class: "fa fa-angle-double-up fa-2x rv-icon-button",
                    Properties: [{ Name: "onclick", Value: function () { _toggleClass.call(this); } }]
                }
            ], button);

            var nsl = new NewSimpleListViewer(_nofContainer, {
                Options: {
                    Count: 5,
                    OnDataRequest: function (options, done) {
                        _nofContainer.style.overflowY = "hidden";

                        UsersAPI.GetFriendSuggestions(GlobalUtilities.extend(options || {}, {
                            ParseResults: true,
                            ResponseHandler: function (result) { done(result.Suggestions || []); }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        containerDiv.style.display = "block";

                        var userId = item.UserID;
                        var fullname = Base64.decode(item.FirstName) + " " + Base64.decode(item.LastName);
                        var trimedFullName = GlobalUtilities.trim2pix(fullname, 100, { Style: "font-size:x-small;", Postfix: "..." });
                        var userPageUrl = UsersAPI.UserPageURL({ UserID: item.UserID });

                        var elems = GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Name: "container",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer",
                                Style: "padding:0.3rem; position:relative; padding-" + RV_Float + ":3rem;" +
                                    "padding-" + RV_RevFloat + ":2rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                        Childs: [
                                            {
                                                Type: "img", Class: "rv-border-radius-quarter",
                                                Style: "width:2rem; height:2rem;", Tooltip: fullname,
                                                Attributes: [{ Name: "src", Value: item.ProfileImageURL || item.ImageURL }]
                                            }
                                        ]
                                    },
                                    {
                                        Type: "div", Class: "rv-circle SoftBorder", Name: "addButton",
                                        Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem; cursor:pointer;" +
                                            "width:1.5rem; height:1.5rem; text-align:center; border-width:0.15rem; line-height:1.5rem;" +
                                            "border-color:rgb(200,200,200); font-weight:bold; font-size:1.2rem; color:gray;",
                                        Properties: [
                                            { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                                            { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                            {
                                                Name: "onclick",
                                                Value: function () {
                                                    if (this._Processing) return;
                                                    this._Processing = true;

                                                    UsersAPI.SendFriendRequest({
                                                        UserID: userId, ParseResults: true,
                                                        ResponseHandler: function (result) {
                                                            this._Processing = false;

                                                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                                            else if (result.Succeed) {
                                                                elems["container"].parentNode.removeChild(elems["container"]);
                                                                nsl.data_request({ Count: 1 });
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        ],
                                        Childs: [{ Type: "text", TextValue: "+" }]
                                    },
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12",
                                        Style: "font-size:0.7rem; cursor:pointer;", Link: userPageUrl,
                                        Childs: [
                                            {
                                                Type: "div", Class: "small-12 medium-12 large-12",
                                                Tooltip: (fullname == trimedFullName ? null : fullname),
                                                Childs: [{ Type: "text", TextValue: trimedFullName }]
                                            },
                                            {
                                                Type: "div", Class: "small-12 medium-12 large-12",
                                                Style: "color:gray; margin-top:0.2rem;",
                                                Childs: [{ Type: "text", TextValue: RVDic.NMutualCoworkers.replace("[n]", item.MutualFriendsCount || "0") }]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ], container);

                        params.OnAfterAdd();
                    }
                }
            });
        }
    };
})();