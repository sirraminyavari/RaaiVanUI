(function () {
    if (window.RemoteSearch) return;

    window.RemoteSearch = function (container) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;

        this.Interface = {
            ServersList: null,
            SearchInput: null,
            Results: null
        };

        this.Objects = {
            RequestHandlers: []
        };

        this.Options = {
            DefaultNodeTypeID: "ntid",
            BatchSize: 2,
            Count: 10
        };

        var that = this;

        GlobalUtilities.load_files([
            "API/UsersAPI.js",
            "API/SearchAPI.js",
            "FormsManager/FormElementTypes.js",
            "RemoteServers/RemoteServerSettings.js"
        ], { OnLoad: function () { that.preinit(); } });
    };

    RemoteSearch.prototype = {
        preinit: function () {
            var that = this;

            UsersAPI.GetRemoteServers({
                ParseResults: true,
                ResponseHandler: function (result) {
                    that.initialize(result.Servers || []);
                }
            });
        },

        initialize: function (servers) {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "display:flex; flex-flow:row;",
                Childs: [
                    {
                        Type: "div", Class: "rv-border-radius-half SurroundingShadow",
                        Style: "flex:0 0 auto; width:16rem; background-color:white; padding:1rem;" +
                            "margin-" + RV_RevFloat + ":1rem;",
                        Childs: [
                            {
                                Type: "div", Class: "WarmColor", Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.ServersList }]
                            },
                            { Type: "div", Name: "servers" }
                        ]
                    },
                    {
                        Type: "div", Class: "rv-border-radius-half SurroundingShadow",
                        Style: "flex:1 1 auto; padding:1rem; background-color:white;",
                        Childs: [
                            {
                                Type: "div", Style: "display:flex; flex-flow:row; align-items:center; margin-bottom:2rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "flex:1 1 auto;",
                                        Childs: [{
                                            Type: "input", Class: "rv-input", Name: "searchInput",
                                            Style: "width:100%;", Placeholder: RVDic.SearchText
                                        }]
                                    },
                                    {
                                        Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                                        Style: "flex:0 0 auto; display:flex; flex-flow:row; margin-" + RV_Float + ":4rem;" +
                                            "height:100%; border-color:rgb(240,240,240); padding:0.3rem;",
                                        Childs: [
                                            {
                                                Type: "div", Class: "rv-flat-label", Style: "flex:0 0 auto;",
                                                Childs: [{ Type: "text", TextValue: RVDic.Grouping }]
                                            },
                                            {
                                                Type: "div", Style: "flex:0 0 auto; margin-" + RV_Float + ":0.5rem; padding-top:0.1rem;",
                                                Childs: [{
                                                    Type: "switch", Name: "grouping",
                                                    Params: {
                                                        Height: 1, MiniMode: true, Checked: true,
                                                        OnChange: function () { that.start_search(); }
                                                    }
                                                }]
                                            }
                                        ]
                                    }
                                ]
                            },
                            { Type: "div", Class: "rv-trim-vertical-margins", Name: "results" }
                        ]
                    }
                ]
            }], that.Container);

            that.Interface.SearchInput = elems["searchInput"];
            that.Interface.GroupSwitch = elems["grouping"].Checkbox;
            that.Interface.Results = elems["results"];

            that.Objects.ServersList = new RemoteServerSettings(elems["servers"], {
                Servers: servers, SelectMode: true, Checkbox: true
            });

            GlobalUtilities.set_onchangeorenter(elems["searchInput"], function () {
                that.start_search();
            });

            that.start_search();
        },

        get_search_text: function () {
            var that = this;

            return GlobalUtilities.trim(that.Interface.SearchInput.value).toLowerCase();
        },

        get_search_id: function (searchText) {
            var that = this;

            if (!searchText) return;

            if (that.__PREVIOUS_SEARCH_TEAXT == searchText) return that.__SEARCH_ID;
            else {
                that.__PREVIOUS_SEARCH_TEAXT = searchText;
                that.__SEARCH_ID = GlobalUtilities.random()
                return that.__SEARCH_ID;
            }
        },

        validate_search: function (searchId, nodeTypeId, lowerBoundary) {
            var that = this;
            
            return !!lowerBoundary || (nodeTypeId != that.Options.DefaultNodeTypeID) ||
                (that.get_search_id(that.get_search_text()) == searchId);
        },

        start_search: function () {
            var that = this;

            that.Interface.Results.innerHTML = "";

            var searchText = that.get_search_text();
            var grouping = that.Interface.GroupSwitch.checked;

            if (!searchText) return;

            var items = that.Objects.ServersList.get_checked_items(true);

            items.filter(i => !that.Objects.RequestHandlers.some(r => r.Server.ID == i.ID))
                .forEach(i => {
                    var reqObj = RVRequest.new();

                    reqObj.set_remote_server({
                        BaseURL: Base64.decode(i.URL),
                        UserName: Base64.decode(i.UserName),
                        Password: Base64.decode(i.Password)
                    });

                    that.Objects.RequestHandlers.push({ Server: i, Request: reqObj });
                });

            var searchParams = {
                SearchText: searchText,
                SearchID: that.get_search_id(searchText),
                RequestHandler: null,
                LowerBoundary: 0
            };

            var iterate = function (arrItems) {
                var iterLength = Math.min((arrItems || []).length, that.Options.BatchSize);
                var cur = (arrItems || []).slice(0, iterLength);
                var next = (arrItems || []).length > iterLength ? arrItems.slice(iterLength) : [];

                cur.forEach(rh => {
                    that.search(GlobalUtilities.extend({}, searchParams, { RequestHandler: rh }), result => {
                        var expand = items.length == 1;

                        if (grouping) that.add_group_results(rh.Server, result, searchParams, expand);
                        else that.show_results(that.Interface.Results, result, rh.Server, true, searchParams);

                        var nextCopy = next;
                        next = [];
                        iterate(nextCopy);
                    });
                });
            };

            iterate(items.map(i => that.Objects.RequestHandlers.filter(r => r.Server.ID == i.ID)[0]));

            /*
            items.map(i => that.Objects.RequestHandlers.filter(r => r.Server.ID == i.ID)[0])
                .forEach(rh => {
                    that.search(GlobalUtilities.extend({}, searchParams, { RequestHandler: rh }), result => {
                        var expand = items.length == 1;

                        if (grouping) that.add_group_results(rh.Server, result, searchParams, expand);
                        else that.show_results(that.Interface.Results, result, rh.Server, true, searchParams);
                    });
                });
            */
        },

        search: function (params, callback) {
            var that = this;
            params = params || {};

            var text = GlobalUtilities.trim(params.SearchText || " ").toLowerCase();
            var requestHandler = params.RequestHandler;
            var nodeTypeId = params.NodeTypeID || that.Options.DefaultNodeTypeID;
            var lowerBoundary = params.LowerBoundary;

            if (!lowerBoundary) lowerBoundary = 0;

            if (!that.validate_search(params.SearchID, nodeTypeId, lowerBoundary)) return;

            if (!!lowerBoundary && (nodeTypeId != that.Options.DefaultNodeTypeID) && (that.get_search_id(that.get_search_text()) != params.SearchID)) return;

            var dic = that.__RESULTS_DIC = that.__RESULTS_DIC || {};
            var sIdDic = dic[requestHandler.Server.ID] = dic[requestHandler.Server.ID] || {};
            var ntIdDic = sIdDic[nodeTypeId] = sIdDic[nodeTypeId] || {};
            var txtDic = ntIdDic[text] = ntIdDic[text] || {};

            if (txtDic[lowerBoundary]) return callback(txtDic[lowerBoundary]);

            SearchAPI.Search({
                SearchText: Base64.encode(text),
                ItemTypes: "Node",
                TypeIDs: params.NodeTypeID,
                Title: true,
                Description: true,
                Content: true,
                Tags: true,
                FileContent: true,
                ForceHasContent: true,
                SuggestNodeTypes: true,
                Count: that.Options.Count,
                LowerBoundary: lowerBoundary,
                RequestHandler: requestHandler.Request,
                ParseResults: true,
                ResponseHandler: function (result) {
                    if (!that.validate_search(params.SearchID, nodeTypeId, lowerBoundary)) return;

                    txtDic[lowerBoundary] = result;
                    callback(result);
                }
            });
        },

        add_group_results: function (server, result, searchParams, expand) {
            var that = this;

            var nodeTypes = !(result.NodeTypes || []).length ? [] :
                [{ Title: Base64.encode(RVDic.All), ID: "allNTs", All: true }].concat(result.NodeTypes);

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "rv-border-radius-quarter SoftShadow",
                Style: "padding:1rem; margin-top:1rem;",
                Childs: [
                    {
                        Type: "div", Class: "WarmColor", Style: "font-weight:500;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(server.Name) }]
                    },
                    {
                        Type: "div", Style: "font-size:0.7rem; color:rgb(150,150,150);",
                        Childs: [{ Type: "text", TextValue: Base64.decode(server.URL) }]
                    },
                    (!nodeTypes.length ? null : {
                        Type: "div", Style: "margin-top:0.5rem;",
                        Childs: nodeTypes.map(nt => {
                            return {
                                Type: "div", Name: nt.ID || "allNts",
                                Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftBorder SoftShadow",
                                Style: "display:inline-block; border-color:rgb(200,200,200); cursor:pointer;" +
                                    "margin-bottom:0.3rem; margin-" + RV_RevFloat + ":0.3rem; font-size:0.7rem; padding:0.1rem 0.5rem;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(nt.Title) }]
                            };
                        })
                    }),
                    (!(result.Items || []).length ? null : {
                        Type: "div", Class: "rv-trim-vertical-margins", Name: "results", Style: "margin-top:1rem;",
                        Childs: [{
                            Type: "div", Style: "text-align:center; color:blue; cursor:pointer;",
                            Childs: [{ Type: "text", TextValue: RVDic.ViewResults }]
                        }]
                    })
                ]
            }], that.Interface.Results);

            var _do_show = function (r, sp) {
                jQuery(elems["results"]).fadeOut(200, function () {
                    elems["results"].innerHTML = "";

                    that.show_results(elems["results"], r, server, false, sp);

                    jQuery(elems["results"]).animate({ 'height': 'toggle' }, 500);
                });
            };

            if (elems["results"]) {
                elems["results"].onclick = function () {
                    elems["results"].onclick = null;
                    _do_show(result, searchParams);
                };

                if (expand) jQuery(elems["results"]).click();
            }

            nodeTypes.forEach(nt => {
                var domElem = elems[nt.ID];

                domElem.onclick = function (e) {
                    e.stopPropagation();
                    if (elems["results"]) elems["results"].onclick = null;

                    var sp = GlobalUtilities.extend({}, searchParams, { NodeTypeID: nt.All ? null : nt.ID });
                    that.search(sp, r => _do_show(r, sp));
                };
            });
        },

        show_results: function (container, result, server, serverInfo, searchParams) {
            var that = this;

            (result.Items || []).forEach(item => that.add_result(container, item, server, serverInfo));

            if (!searchParams.LowerBoundary && !(result.Items || []).length && !serverInfo) {
                GlobalUtilities.create_nested_elements([{
                    Type: "div", Style: "text-align:center; font-weight:500; color:rgb(150,150,150); margin-top:1rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }], container);
            }

            if (!serverInfo && !result.NoMore) {
                var moreButton = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "rv-air-button rv-circle", Style: "margin-top:0.5rem;", Name: "_div",
                    Childs: [{ Type: "text", TextValue: RVDic.More }]
                }], container)["_div"];

                moreButton.onclick = function () {
                    moreButton.onclick = null;
                    moreButton.innerHTML = "";
                    GlobalUtilities.loading(moreButton);

                    that.search(GlobalUtilities.extend({}, searchParams, { LowerBoundary: result.LastItem }), r => {
                        jQuery(moreButton).remove();
                        that.show_results(container, r, server, serverInfo, searchParams);
                    });
                };
            }
        },

        add_result: function (container, item, server, serverInfo) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "rv-border-radius-quarter rv-bg-color-softer-soft SoftShadow", Name: "container",
                Style: "padding:0.5rem; margin-top:0.5rem; cursor:pointer;",
                Childs: [{
                    Type: "div", Style: "display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:1 1 auto;",
                            Childs: [
                                {
                                    Type: "div", Style: "font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.Title) }]
                                },
                                (!server || !serverInfo ? null : {
                                    Type: "div", Style: "margin-top:0.3rem; font-size:0.7rem; color:blue;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(server.Name) + " - " + Base64.decode(server.URL) }]
                                }),
                                (!item.Description ? null : {
                                    Type: "div", Name: "desc",
                                    Style: "margin-top:1rem; font-size:0.7rem; color:rgb(100,100,100);"
                                })
                            ]
                        },
                        {
                            Type: "div", Class: "rv-trim-vertical-margins",
                            Style: "flex:0 0 auto; display:flex; flex-flow:column; align-items:center; justify-content:center;" +
                                "width:8rem; margin-" + RV_Float + ":2rem; font-size:0.7rem;",
                            Childs: [
                                (!item.AdditionalID ? null : {
                                    Type: "div", Style: "margin-bottom:0.25rem; width:100%; cursor:default; padding:0.1rem 0.3rem;",
                                    Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.AdditionalID) }]
                                }),
                                (!item.Type ? null : {
                                    Type: "div", Style: "width:100%; cursor:default; padding:0.1rem 0.3rem;",
                                    Class: "rv-air-button rv-border-radius-quarter",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.Type) }]
                                })
                            ]
                        }
                    ]
                }]
            }], container);

            if (elems["desc"]) elems["desc"].innerHTML = Base64.decode(item.Description);

            elems["container"].onclick = function () {
                that.__NODE_OBJ = that.__NODE_OBJ || {};

                if (that.__NODE_OBJ[item.ID]) return GlobalUtilities.show(that.__NODE_OBJ[item.ID]);

                var _div = that.__NODE_OBJ[item.ID] = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "_div"
                }])["_div"];

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                var rh = that.Objects.RequestHandlers.filter(r => r.Server.ID == server.ID)[0].Request;

                var url = Base64.decode(server.URL) + "/api/get_nodes?timeStamp=" + (new Date()).getTime();
                var queryString = "ID=" + item.ID + "&FormDetails=" + true + "&TypeID=1";

                rh.post_request(url, queryString, r => {
                    that.show_node(_div, ((r || {}).Nodes || []).length ? r.Nodes[0] : null);
                }, {}, true);
            };
        },

        show_node: function (container, node) {
            node = node || {};

            container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "WarmColor",
                    Style: "font-weight:500; margin-bottom:1.5rem; text-align:center; font-size:1.2rem;",
                    Childs: [{ Type: "text", TextValue: Base64.decode(node.Name) }]
                },
                {
                    Type: "div",
                    Childs: [
                        { Title: RVDic.ID, Value: Base64.decode(node.AdditionalID) },
                        { Title: RVDic.CreationDate, Value: Base64.decode(node.CreationDate) },
                        { Title: RVDic.NodeType, Value: Base64.decode(node.NodeType) },
                        { Title: RVDic.Keywords, Value: (node.Keywords || []).map(k => Base64.decode(k)).join(' - ') },
                        { Title: RVDic.Abstract, Value: Base64.decode(node.Abstract) },
                        {
                            Title: RVDic.Files,
                            Value: !(node.Files || []).length ? null : node.Files.map(file => {
                                return Base64.decode(file.Name) +
                                    (file.Extension ? "." + Base64.decode(file.Extension) : "") +
                                    (!file.Size ? "" : " (" + Number((file.Size / (1024 * 1024)).toFixed(2)) + "MB)");
                            })
                        }
                    ].filter(i => !!i.Value).map(itm => {
                        return {
                            Type: "div", Style: "display:flex; flex-flow:row; margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label", Style: "flex:0 0 auto; min-width:5rem;",
                                    Childs: [{ Type: "text", TextValue: itm.Title + ":" }]
                                },
                                {
                                    Type: "div", Style: "flex:1 1 auto;",
                                    Childs: (GlobalUtilities.get_type(itm.Value) == "array" ? itm.Value : [itm.Value]).map(v => {
                                        return { Type: "div", Childs: [{ Type: "text", TextValue: v }] }
                                    })
                                }
                            ]
                        };
                    })
                },
                { Type: "div", Class: "rv-trim-vertical-margins", Name: "formDetails" }
            ], container);

            var details = [];

            for (var k in (node.FormDetails || {}))
                details.push(node.FormDetails[k]);

            details = details.sort((a, b) => a.SequenceNumber > b.SequenceNumber);

            details.forEach(d => {
                if (d.TextValue) d.TextValue = Base64.decode(d.TextValue);

                d.Info = GlobalUtilities.to_json(Base64.decode(d.Info)) || {};
                d.Title = Base64.decode(d.Title);
                d.Name = Base64.decode(d.Name);
                d.TextValue = Base64.decode(d.TextValue);
                jQuery.each(d.GuidItems || [], function (ind, val) { val.Name = Base64.decode(val.Name); });

                var viewElement = ((FormElementTypes[d.Type] || {}).dataview || function () { })(d) || {};

                if (viewElement.Container) {
                    var el = GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "rv-border-radius-quarter rv-bg-color-trans-white SoftBorder SoftShadow",
                        Style: "margin-bottom:1rem; padding:0.5rem; border-color:rgb(200,200,200);",
                        Childs: [
                            {
                                Type: "div", Style: "margin-bottom:0.5rem;",
                                Childs: [{ Type: "text", TextValue: d.Title }]
                            },
                            { Type: "div", Name: "data" }
                        ]
                    }], elems["formDetails"]);

                    el["data"].appendChild(viewElement.Container);
                }

                if (viewElement.Set) viewElement.Set(d);
            });
        }
    }
})();