(function () {
    if (window.NodesViewer) return;

    window.NodesViewer = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.Container) return;
        params = params || {};
        var that = this;

        that.Objects = {
            NodeTypeIDs: params.NodeTypeIDs || [],
            IsServiceAdmin: false,
            ListViewer: null,
            Form: null,
            GroupingElements: [],
            SearchInput: null,
            DateFrom: null,
            DateTo: null,
            MineCheckbox: null,
            RelatedItem: null,
            FormFilters: null,
            MatchAllCheckbox: null,
            GroupingFilter: null
        };

        that.Options = GlobalUtilities.extend({
            InitialRelatedItem: null,
            SelectMode: false,
            MultiSelect: false,
            OnSelect: null
        }, params.Options || {});

        GlobalUtilities.load_files(["API/CNAPI.js", "SimpleListViewer/NewSimpleListViewer.js"], {
            OnLoad: function () { that._preinit(params); }
        });
    }

    window.NodesViewer.prototype = {
        _preinit: function (params) {
            var that = this;

            that._is_service_admin(function () {
                that._get_owner_form(function (form) {
                    if ((form || {}).FormID) that.Objects.Form = form;
                    
                    if ((that.Objects.Form || {}).FormID && ((that.Objects.NodeTypeIDs || []).length == 1)) {
                        FGAPI.GetFormElements({
                            FormID: that.Objects.Form.FormID, OwnerID: that.Objects.NodeTypeIDs[0],
                            ConsiderElementLimits: true, ParseResults: true,
                            ResponseHandler: function (result) {
                                that.Objects.GroupingElements = ((result || {}).Elements || []).filter(function (e) {
                                    return ["Select", "Binary"].some(function (i) { return i == e.Type; });
                                });

                                that._init(params);
                            }
                        });
                    }
                    else that._init(params);
                });
            });
        },

        _is_service_admin: function (callback) {
            var that = this;

            if ((that.Objects.NodeTypeIDs.length != 1) || (window.RVGlobal || {}).IsSystemAdmin) return callback();
            else {
                CNAPI.IsServiceAdmin({
                    NodeTypeID: that.Objects.NodeTypeIDs[0], ParseResults: true,
                    ResponseHandler: function (result) {
                        that.Objects.IsServiceAdmin = result;
                        callback();
                    }
                });
            }
        },

        _get_owner_form: function (callback) {
            var that = this;

            if (!((window.RVGlobal || {}).Modules || {}).FG ||
                ((that.Objects.NodeTypeIDs || []).length != 1)) return callback();
            
            GlobalUtilities.load_files(["API/FGAPI.js"], {
                OnLoad: function () {
                    FGAPI.GetOwnerForm({
                        OwnerID: that.Objects.NodeTypeIDs[0], ParseResults: true,
                        ResponseHandler: function (result) {
                            if ((result || {}).FormID) callback({ FormID: result.FormID, Title: Base64.decode(result.Title) });
                            else callback();
                        }
                    });
                }
            });
        },

        _init: function (params) {
            var that = this;

            that.Container.innerHTML = "";

            var hasFormFilters = !!(that.Objects.Form || {}).FormID;

            var searchTextInnerTitle = RVDic.SearchText +
                " (" + RVDic.Title + " - " + RVDic.AdditionalID + " - " + RVDic.Keywords + ")";

            var _elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "position:relative; margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                            Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; font-size:0.6rem;",
                            Properties: [{
                                Name: "onclick", Value: function () {
                                    var _cls = _elems["filters"].style.display == "none" ? "fa-angle-up" : "fa-angle-down";
                                    _elems["toggleButton"].setAttribute("class", "fa " + _cls);
                                    jQuery(_elems["filters"]).animate({ height: "toggle" });
                                }
                            }],
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-angle-down", Name: "toggleButton",
                                    Style: "margin-" + RV_RevFloat + ":0.3rem;"
                                },
                                { Type: "text", TextValue: RVDic.FilterSelect }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; height:2rem;",
                            Childs: [{ Type: "middle", Name: "totalCount", Style: "font-weight:bold; font-size:0.8rem;" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "padding:0rem 8rem; margin-bottom:1rem;",
                            Childs: [{
                                Type: "input", Class: "rv-input", Name: "textInput", InnerTitle: searchTextInnerTitle,
                                Style: "width:100%; font-size:0.6rem;"
                            }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBackgroundColor SoftBorder",
                            Style: "display:none; margin-bottom:1rem; padding:1rem; border-color:rgb(200,200,200);", Name: "filters",
                            Childs: [
                                {
                                    Type: "div",
                                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder SoftShadow",
                                    Style: "border-color:rgb(240,240,240); padding:0.5rem; background-color:white;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; margin-" + RV_RevFloat + ":1rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.CreationDate + ":" }]
                                        },
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; margin-" + RV_RevFloat + ":2rem;",
                                            Childs: [
                                                {
                                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                                                },
                                                { Type: "div", Style: "display:inline-block;", Name: "from" }
                                            ]
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block;",
                                            Childs: [
                                                {
                                                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                                                },
                                                { Type: "div", Style: "display:inline-block;", Name: "to" }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder SoftShadow",
                                    Style: "border-color:rgb(240,240,240); padding:0.5rem; background-color:white; margin-top:0.5rem;",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "mine",
                                            Style: "width:1.2rem; height:1.2rem; cursor:pointer; margin-" + RV_RevFloat + ":0.4rem;",
                                            Params: { OnChange: function () { if (that.Objects.ListViewer) that.Objects.ListViewer.reset(); } }
                                        },
                                        { Type: "text", TextValue: RVDic.CN.JustShowMyNodes }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder SoftShadow",
                                    Style: "border-color:rgb(240,240,240); padding:0.5rem; background-color:white; margin-top:0.5rem;",
                                    Childs: [
                                        { Type: "text", TextValue: RVDic.BeRelatedTo + ":" },
                                        {
                                            Type: "div", Style: "display:inline-block;", Name: "relatedItem",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "ndSelect",
                                                    Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.NodeSelect }]
                                                },
                                                {
                                                    Type: "div", Style: "display:inline-block; font-size:0.7rem; margin:0 0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.Or }]
                                                },
                                                {
                                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "usrSelect",
                                                    Style: "display:inline-block; font-size:0.7rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.UserSelect }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Name: "selectedItem",
                                            Class: "rv-border-radius-quarter rv-bg-color-softer-soft SoftShadow",
                                            Style: "position:relative; display:none; padding:0.3rem;" +
                                                "padding-" + RV_Float + ":1.5rem; margin-" + RV_Float + ":0.5rem;",
                                            Childs: [
                                                {
                                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                                    Childs: [{
                                                        Type: "i", Class: "fa fa-times rv-icon-button", Name: "removeRelated", Tooltip: RVDic.Remove,
                                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                                    }]
                                                },
                                                { Type: "div", Name: "selectedTitle", Style: "font-size:0.7rem;" }
                                            ]
                                        }
                                    ]
                                },
                                (!hasFormFilters ? null : {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder SoftShadow",
                                    Style: "border-color:rgb(240,240,240); padding:0.5rem; background-color:white; margin-top:0.5rem;",
                                    Childs: [
                                        { Type: "text", TextValue: RVDic.FormFilters + ":" },
                                        {
                                            Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "formFilters",
                                            Style: "display:inline-block; margin:0rem auto; font-size:0.7rem;" +
                                                "padding-right:2rem; padding-left:2rem; margin-" + RV_Float + ":0.5rem;"
                                        },
                                        {
                                            Type: "div", Style: "display:none; margin-" + RV_Float + ":1rem;", Name: "matchAllArea",
                                            Childs: [
                                                {
                                                    Type: "checkbox", Name: "matchAllFilters",
                                                    Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.4rem;",
                                                    Params: {
                                                        OnChange: function () {
                                                            if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
                                                        }
                                                    }
                                                },
                                                { Type: "text", TextValue: RVDic.FG.MatchAllFilters }
                                            ]
                                        }
                                    ]
                                }),
                                (!(that.Objects.GroupingElements || []).length ? null : {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder SoftShadow",
                                    Style: "border-color:rgb(240,240,240); padding:0.5rem; background-color:white;" +
                                        "margin-top:0.5rem; display:flex; flex-flow:row;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.GroupBy + ":" }]
                                        },
                                        {
                                            Type: "div", Style: "flex:1 1 auto;",
                                            Childs: [
                                                {
                                                    Type: "div", Name: "groupingItems",
                                                    Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                                                    Childs: that.Objects.GroupingElements.map(function (item) {
                                                        return {
                                                            Type: "div", Style: "margin-top:0.5rem;",
                                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-air-button",
                                                            Properties: [{ Name: "onclick", Value: function () { that.group_by(item, function () { set_grouping_item(); }); } }],
                                                            Childs: [{ Type: "text", TextValue: GlobalUtilities.trim_punctuations(Base64.decode(item.Title)) }]
                                                        };
                                                    })
                                                },
                                                {
                                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "selectedGroup"
                                                }
                                            ]
                                        }
                                    ]
                                })
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "mainDiv", Style: "overflow:hidden;" }
            ], that.Container);

            that.Objects.SearchInput = _elems["textInput"];
            that.Objects.MatchAllCheckbox = _elems["matchAllFilters"];
            that.Objects.MineCheckbox = _elems["mine"];

            GlobalUtilities.set_onchangeorenter(that.Objects.SearchInput, function () {
                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
            });

            GlobalUtilities.loading(_elems["from"]);
            GlobalUtilities.loading(_elems["to"]);

            GlobalUtilities.append_calendar(_elems["from"], {
                ClearButton: true,
                OnLoad: function () { _elems["from"].innerHTML = ""; },
                OnSelect: function () { if (that.Objects.ListViewer) that.Objects.ListViewer.reset(); }
            }, function (cal) { that.Objects.DateFrom = cal; });

            GlobalUtilities.append_calendar(_elems["to"], {
                ClearButton: true,
                OnLoad: function () { _elems["to"].innerHTML = ""; },
                OnSelect: function () { if (that.Objects.ListViewer) that.Objects.ListViewer.reset(); }
            }, function (cal) { that.Objects.DateTo = cal; });

            var set_filters_text = function () {
                var cnt = that.get_filters_count();
                var str = cnt ? RVDic.NFiltersSelected.replace("[n]", cnt) : RVDic.Select;
                if (_elems["formFilters"]) _elems["formFilters"].innerHTML = GlobalUtilities.convert_numbers_to_persian(str);
                if (_elems["matchAllArea"]) _elems["matchAllArea"].style.display = cnt > 1 ? "inline-block" : "none";
            };

            if (hasFormFilters) {
                set_filters_text();

                var formContainer = null, showed = null;

                if (_elems["formFilters"]) _elems["formFilters"].onclick = function () {
                    if (formContainer) return (showed = GlobalUtilities.show(formContainer));

                    formContainer = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                        }
                    ])["_div"];

                    GlobalUtilities.loading(formContainer);
                    showed = GlobalUtilities.show(formContainer);

                    GlobalUtilities.load_files(["FormsManager/FormSearchFilters.js"], {
                        OnLoad: function () {
                            var ownerId = (that.Objects.NodeTypeIDs || []).length == 1 ?
                                that.Objects.NodeTypeIDs[0] : null;

                            var fsf = new FormSearchFilters(formContainer, {
                                Delimiter: "~", FormID: that.Objects.Form.FormID, OwnerID: ownerId,
                                OnConfirm: function () {
                                    showed.Close();
                                    that.Objects.FormFilters = fsf.get({ JSON: true });
                                    set_filters_text();
                                    if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
                                }
                            });
                        }
                    });
                };
            } //end of 'if (hasFormFilters) {'

            //Related Item
            var on_item_select = function (item) {
                that.Objects.RelatedItem = item;
                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();

                _elems["selectedTitle"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    (item.NodeID ? null : {
                        Type: "i", Class: "fa fa-user", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                        Attributes: [{ Name: "aria-hidden", Value: "true" }]
                    }),
                    { Type: "text", TextValue: (item.Name || item.FullName) },
                    (!item.NodeType ? null : {
                        Type: "div", Class: "rv-border-radius-quarter",
                        Style: "display:inline-block; background-color:white; margin-" + RV_Float + ":0.5rem;" +
                            "padding:0.1rem 0.3rem; color:rgb(100,100,100);",
                        Childs: [{ Type: "text", TextValue: item.NodeType }]
                    })
                ], _elems["selectedTitle"]);

                jQuery(_elems["relatedItem"]).fadeOut(0, function () {
                    _elems["selectedItem"].style.display = "inline-block";
                });
            };

            _elems["ndSelect"].onclick = function () { that.node_select(on_item_select); };

            _elems["usrSelect"].onclick = function () { that.user_select(on_item_select); };

            _elems["removeRelated"].onclick = function () {
                that.Objects.RelatedItem = null;
                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
                jQuery(_elems["selectedItem"]).fadeOut(500, function () { jQuery(_elems["relatedItem"]).fadeIn(500); });
            };

            if (that.Options.InitialRelatedItem) {
                var relatedItem = that.Options.InitialRelatedItem || {};

                if (relatedItem.NodeID) {
                    relatedItem.Name = Base64.decode(relatedItem.Name);
                    relatedItem.NodeType = Base64.decode(relatedItem.NodeType);
                }
                else if (that.Options.InitialRelatedItem.UserID) {
                    relatedItem.FullName = GlobalUtilities.trim(Base64.decode(relatedItem.FirstName || " ") + " " +
                        Base64.decode(relatedItem.LastName || " ")) || Base64.decode(relatedItem.UserName);
                }

                on_item_select(relatedItem);
            }
            //end of Related Item

            var set_grouping_item = function () {
                var gf = that.Objects.GroupingFilter;

                if (!gf || !_elems["groupingItems"] || !_elems["selectedGroup"]) return;

                var title = that.get_group_title(gf.Element, gf.Filter);

                jQuery(_elems["groupingItems"]).fadeOut(100, function () {
                    _elems["selectedGroup"].innerHTML = "";

                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-softer-soft",
                        Style: "display:flex; flex-flow:row; padding:0.2rem 0.5rem;",
                        Childs: [
                            {
                                Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{
                                        Name: "onclick", Value: function () {
                                            _elems["selectedGroup"].innerHTML = "";
                                            that.Objects.GroupingFilter = null;
                                            jQuery(_elems["selectedGroup"]).fadeOut(100, function () { jQuery(_elems["groupingItems"]).fadeIn(500); });
                                            if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
                                        }
                                    }]
                                }]
                            },
                            {
                                Type: "div", Style: "flex:0 1 auto; color:rgb(100,100,100); padding-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: GlobalUtilities.trim_punctuations(Base64.decode(gf.Element.Title)) + ":" }]
                            },
                            {
                                Type: "div", Style: "flex:1 1 auto;",
                                Childs: [
                                    (!title ? null : { Type: "text", TextValue: title }),
                                    (title ? null : {
                                        Type: "div", Class: "rv-border-radius-quarter",
                                        Style: "display:inline-block; color:red; background-color:white; padding:0.1rem 0.5rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.NotSet }]
                                    })
                                ]
                            }
                        ]
                    }], _elems["selectedGroup"]);

                    jQuery(_elems["selectedGroup"]).fadeIn(500);
                });
            };

            GlobalUtilities.loading(_elems["mainDiv"]);
            
            that.Objects.ListViewer = new NewSimpleListViewer(_elems["mainDiv"], {
                Options: {
                    AutoGrow: false,
                    OnDataRequest: function (options, done) {
                        jQuery(_elems["totalCount"]).fadeOut(100);

                        var reqParams = that.get_request_params() || {};
                        
                        CNAPI.GetNodes(GlobalUtilities.extend(options || {}, reqParams, {
                            UseNodeTypeHierarchy: !reqParams.FormFilters && ((that.Objects.NodeTypeIDs || []).length == 1),
                            ParseResults: true,
                            ResponseHandler: function (result) {
                                var nodes = result.Nodes || [];
                                var nodeDic = [];
                                var nodeIds = nodes.map(function (val) { return val.NodeID; });

                                if (result.TotalCount) {
                                    _elems["totalCount"].innerHTML = RVDic.Count + ": <span style='color:red;'>" +
                                        GlobalUtilities.convert_numbers_to_persian(result.TotalCount) + "</span>";
                                    jQuery(_elems["totalCount"]).fadeIn(500);
                                }

                                if (!nodes.length && !that.Objects.ListViewer.get_count()) {
                                    that.Objects.ListViewer.items_container().innerHTML =
                                        "<div class='small-12 medium-12 large-12' " +
                                        "style='font-weight:bold; font-size:1.2rem; text-align:center; color:gray; margin-top:2rem;'>" +
                                        RVDic.NothingToDisplay + "</div>";
                                    return done([]);
                                }

                                if (!nodeIds.length) return done([]);

                                if (that.Options.SelectMode) done(nodes);
                                else {
                                    var isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;

                                    CNAPI.GetNodeInfo({
                                        NodeIDs: nodeIds.join("|"), Description: !isSaas, Creator: true,
                                        LikesCount: !isSaas, VisitsCount: !isSaas, ParseResults: true,
                                        ResponseHandler: function (nodesInfo) {
                                            var retNodes = [];

                                            (nodesInfo || []).forEach(function (val) { nodeDic[val.NodeID] = val; });

                                            nodes.forEach(function (val) {
                                                retNodes.push(GlobalUtilities.extend(nodeDic[val.NodeID], val));
                                            });

                                            done(retNodes);
                                        }
                                    });
                                }
                            }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        var nodeId = item.NodeID;
                        var additionalId = Base64.decode(item.AdditionalID);

                        var nodeIcon = item.IconURL;
                        var nodePageUrl = CNAPI.NodePageURL({ NodeID: nodeId });
                        var name = Base64.decode(item.Name);
                        var description = GlobalUtilities.get_text_begining(Base64.decode(item.Description), 200, "...");
                        var likesCount = item.LikesCount;
                        var viewsCount = item.VisitsCount;
                        var status = item.Status ? RVDic.CN[item.Status] : (item.WFState ? Base64.decode(item.WFState) : "");
                        var hasCreator = !!(item.Creator || {}).UserName && !item.HideCreators &&
                            (!item.Status || (item.Status == "Accepted"));
                        
                        var fullName = Base64.decode((item.Creator || {}).FirstName) + " " + Base64.decode((item.Creator || {}).LastName);

                        var showNodeType = ((that.Objects.NodeTypeIDs || []).length != 1) ||
                            that.Objects.NodeTypeIDs[0] != item.NodeTypeID;

                        var details = [
                            (!status ? null : { Value: status }),
                            (!likesCount ? null : { Value: RVDic.NLikes.replace("[n]", likesCount) }),
                            (!viewsCount ? null : { Value: RVDic.NVisits.replace("[n]", viewsCount) })
                        ].filter(d => !!d);

                        var elems = GlobalUtilities.create_nested_elements([{
                            Type: "div", Name: "itemContainer",
                            Class: "small-12 medium-12 large-12 rv-bg-color-white-softer " +
                                "rv-border-radius-quarter SoftShadow SoftBorder",
                            Style: "display:flex; flex-flow:row; padding:0.4rem; margin-bottom:0.5rem; position:relative;" +
                                "border-color:rgb(230,230,230);" +
                                (that.Options.SelectMode ? "cursor:pointer;" : "min-height:3.15rem;"),
                            Properties: !that.Options.SelectMode || !that.Options.OnSelect ? null : [{
                                Name: "onclick",
                                Value: function () {
                                    var selectedChb = elems["selectedChb"];

                                    if (selectedChb) selectedChb[selectedChb.Checked ? "uncheck" : "check"]({ StopOnChange: true });
                                    else that.Options.OnSelect(item);
                                }
                            }],
                            Childs: [
                                (!that.Options.SelectMode || !that.Options.MultiSelect ? null : {
                                    Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "checkbox", Params: { Width: 18, Height: 18 }, Name: "selectedChb" }]
                                }),
                                (that.Options.SelectMode ? null : {
                                    Type: "div",
                                    Style: "display:flex; flex-flow:column; flex:0 0 auto; align-items:center; justify-content:center; width:4rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter",
                                            Style: "width:2.5rem; height:2.5rem; margin:0.1rem 0;",
                                            Attributes: [{ Name: "src", Value: GlobalUtilities.add_timestamp(nodeIcon) }]
                                        },
                                        (!item.CreationDate ? null : {
                                            Type: "div", Class: "rv-border-radius-quarter",
                                            Style: "margin:0.1rem 0; font-size:0.6rem; color:gray;",
                                            Childs: [{ Type: "text", TextValue: item.CreationDate }]
                                        })
                                    ]
                                }),
                                {
                                    Type: "div", Style: "flex:1 1 auto; display:flex; flex-flow:column;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "flex:0 0 auto;",
                                            Link: that.Options.SelectMode ? null : nodePageUrl,
                                            Childs: [
                                                {
                                                    Type: "div",
                                                    Style: "display:inline-block; direction:" + (GlobalUtilities.textdirection(name) || '') + ";",
                                                    Childs: [{
                                                        Type: "a", Class: "rv-link",
                                                        Attributes: [{ Name: "href", Value: nodePageUrl }],
                                                        Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); } }],
                                                        Childs: [{ Type: "text", TextValue: name }]
                                                    }]
                                                },
                                                (!additionalId ? null : {
                                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                                    Style: "display:inline-block; font-size:0.6rem; padding:0.1rem 0.3rem;" +
                                                        "margin-" + RV_Float + ":0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: additionalId }]
                                                }),
                                                (!showNodeType ? null : {
                                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                                    Style: "margin-" + RV_Float + ":0.5rem; padding:0.1rem 0.5rem;" +
                                                        "font-size:0.6rem; display:inline-block;",
                                                    Link: RVAPI.ClassesPageURL({ NodeTypeID: item.NodeTypeID }),
                                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.NodeType) }]
                                                })
                                            ]
                                        },
                                        (that.Options.SelectMode ? null : {
                                            Type: "div", Name: "description",
                                            Style: "flex:0 0 auto; font-size:0.7rem; color:rgb(150,150,150); margin-top:0.2rem;" +
                                                "direction:" + GlobalUtilities.textdirection(description) || '' + ";" +
                                                (!description ? "display:none;" : ""),
                                            Childs: [{ Type: "text", TextValue: description }]
                                        }),
                                        (that.Options.SelectMode || !details.length ? null : {
                                            Type: "div",
                                            Style: "flex:1 1 auto; display:flex; flex-flow:column; justify-content:end;" +
                                                "font-size:0.6rem; color:gray;",
                                            Childs: [{
                                                Type: "div",
                                                Childs: details.map(d => ({
                                                    Type: "div", Class: "rv-border-radius-quarter",
                                                    Style: "display:inline-block; padding:0.1rem 0.5rem;" +
                                                        "margin-top:0.5rem; background-color:white; margin-" + RV_RevFloat + ":0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: d.Value }]
                                                }))
                                            }]
                                        })
                                    ]
                                },
                                {
                                    Type: "div", Class: "RevDirection RevTextAlign",
                                    Style: "flex:0 0 auto; display:flex; flex-flow:column;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;",
                                            Childs: [
                                                (!hasCreator ? null : {
                                                    Type: "div", Style: "flex:0 0 auto; padding-" + RV_Float + ":0.5rem;",
                                                    Childs: [{
                                                        Type: "img", Class: "rv-circle", Style: "width:1.5rem; height:1.5rem;",
                                                        Link: RVAPI.UserPageURL({ UserID: (item.Creator || {}).UserID }),
                                                        Attributes: [{ Name: "src", Value: item.Creator.ProfileImageURL }]
                                                    }]
                                                }),
                                                (!hasCreator ? null : {
                                                    Type: "div", Class: "rv-circle SoftBackgroundColor WarmColor",
                                                    Style: "flex:0 0 auto; padding:0.1rem 1rem 0.1rem 1rem; font-size:0.7rem;" +
                                                        "min-width:5rem; text-align:center;",
                                                    Link: RVAPI.UserPageURL({ UserID: (item.Creator || {}).UserID }),
                                                    Childs: [{ Type: "text", TextValue: fullName }]
                                                })
                                            ]
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

        more: function () {
            if (this.Objects.ListViewer) this.Objects.ListViewer.on_data_request();
        },

        get_filters_count: function () {
            var that = this;

            var cnt = 0;
            for (var id in (that.Objects.FormFilters || {}))++cnt;
            return cnt;
        },

        get_request_params: function () {
            var that = this;

            var formFilters = GlobalUtilities.extend({}, that.Objects.FormFilters || {});
            var filtersCount = that.get_filters_count();

            if (that.Objects.GroupingFilter) {
                var item = that.Objects.GroupingFilter;
                var gf = formFilters[item.Element.ElementID] = {}

                if (item.Filter.Type == "Select") {
                    GlobalUtilities.extend(formFilters, {
                        [item.Element.ElementID]: {
                            TextItems: !item.Filter.TextValue ? [] : [item.Filter.TextValue],
                            Exact: true, Or: true, Type: item.Filter.Type, Compulsory: true
                        }
                    });
                }
                else if (item.Filter.Type == "Binary") {
                    GlobalUtilities.extend(formFilters, {
                        [item.Element.ElementID]: { Bit: item.Filter.BitValue, Type: item.Filter.Type, Compulsory: true }
                    });
                }

                filtersCount++;
            }
            
            return {
                NodeTypeIDs: that.Objects.NodeTypeIDs.join("|"),
                SearchText: Base64.encode(GlobalUtilities.trim(that.Objects.SearchInput.value)),
                Searchable: (window.RVGlobal || {}).IsSystemAdmin || that.Objects.IsServiceAdmin ? null : true,
                CreationDateFrom: !(that.Objects.DateFrom || {}).Get ? null : that.Objects.DateFrom.Get().Value,
                CreationDateTo: !(that.Objects.DateTo || {}).Get ? null : that.Objects.DateTo.Get().Value,
                IsMine: that.Objects.MineCheckbox.checked ? true : null,
                RelatedToNodeID: (that.Objects.RelatedItem || {}).NodeID || (that.Objects.RelatedItem || {}).UserID,
                FormFilters: !filtersCount ? null : Base64.encode(JSON.stringify(formFilters)),
                MatchAllFilters: !that.Objects.MatchAllCheckbox ? null : that.Objects.MatchAllCheckbox.checked
            };
        },

        node_select: function (onSelect) {
            var that = this;

            if (that.__NodeListContainer)
                return (that.__ShowedNodeList = GlobalUtilities.show(that.__NodeListContainer));

            var _div = that.__NodeListContainer = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }])["_div"];

            that.__ShowedNodeList = GlobalUtilities.show(_div);
            GlobalUtilities.loading(_div);

            GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                OnLoad: function () {
                    new NodeSelect(_div, {
                        Options: {
                            Title: RVDic.NodeSelect,
                            NodeTypeSearchBox: true,
                            TreeCheckbox: false,
                            HideSelectedItems: true,
                            Filters: true,
                            ShowBottomBar: false,
                            OnSelect: function (node) {
                                that.__ShowedNodeList.Close();
                                onSelect(node);
                            }
                        }
                    });
                }
            });
        },

        user_select: function (onSelect) {
            var that = this;

            if (that.__UserListContainer)
                return (that.__ShowedUserList = GlobalUtilities.show(that.__UserListContainer));

            var _div = that.__UserListContainer = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }])["_div"];

            that.__ShowedUserList = GlobalUtilities.show(_div);
            GlobalUtilities.loading(_div);

            GlobalUtilities.load_files(["USR/UserSelect.js"], {
                OnLoad: function () {
                    new UserSelect(_div, {
                        Options: {
                            HideSelectedItems: true,
                            OnSelect: function (user) {
                                that.__ShowedUserList.Close();
                                onSelect(user);
                            }
                        }
                    });
                }
            });
        },

        get_group_title: function (formElement, filter) {
            var info = {};

            try { info = JSON.parse(Base64.decode(formElement.Info)); }
            catch (e) { info = {}; }

            var txt = Base64.decode(filter.TextValue);

            if (filter.Type == "Binary")
                return filter.BitValue === true ? Base64.decode(info.Yes) || txt :
                    (filter.BitValue === false ? Base64.decode(info.No) || txt : null);
            else return txt;
        },

        group_by: function (formElement, onSelect) {
            var that = this;
            
            if (((that.Objects.NodeTypeIDs || []).length != 1) || !(formElement || {}).ElementID) return;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:center; font-weight:500; font-size:1rem; margin-bottom:1rem;",
                        Childs: [
                            { Type: "text", TextValue: GlobalUtilities.trim_punctuations(Base64.decode(formElement.Title)) },
                            {
                                Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                Style: "display:inline-block; padding:0.1rem 0.3rem; cursor:default;" +
                                    "margin-" + RV_Float + ":0.5rem; font-size:0.6rem; font-weight:normal;",
                                Childs: [{ Type: "text", TextValue: RVDic.FG.ElementTypes[formElement.Type] || formElement.Type }]
                            }
                        ]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "items" }
                ]
            }]);

            GlobalUtilities.loading(elems["items"]);
            var showed = GlobalUtilities.show(elems["container"]);

            CNAPI.GetNodes(GlobalUtilities.extend(that.get_request_params() || {}, {
                GroupByElementID: formElement.ElementID, ParseResults: true,
                ResponseHandler: function (result) {
                    elems["items"].innerHTML = "";

                    GlobalUtilities.create_nested_elements(((result || {}).Items || []).map(function (itm) {
                        var title = that.get_group_title(formElement, itm);

                        return {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow SoftBorder",
                            Style: "margin:0.3rem 0; border-color:rgb(240,240,240); padding:0.5rem; display:flex; flex-flow:row; cursor:pointer;",
                            Properties: [{
                                Name: "onclick", Value: function () {
                                    that.Objects.GroupingFilter = { Element: formElement, Filter: itm };
                                    showed.Close();
                                    onSelect();
                                    if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
                                }
                            }],
                            Childs: [
                                {
                                    Type: "div", Style: "flex:1 1 auto;",
                                    Childs: [
                                        (!title ? null : { Type: "text", TextValue: title }),
                                        (title ? null : {
                                            Type: "div", Class: "rv-border-radius-quarter",
                                            Style: "display:inline-block; color:red; background-color:rgb(240,240,240); padding:0.1rem 0.5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.NotSet }]
                                        })
                                    ]
                                },
                                {
                                    Type: "div", Style: "flex:0 0 auto; color:red; padding-" + RV_Float + ":1rem;",
                                    Childs: [{Type: "text", TextValue: itm.Count}]
                                }
                            ]
                        }
                    }), elems["items"]);
                }
            }));
        }
    }
})();