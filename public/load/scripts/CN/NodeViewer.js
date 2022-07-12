(function () {
    if (window.NodeViewer) return;

    window.NodeViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        
        this.Objects = {
            IsAuthenticated: (window.RVGlobal || {}).IsAuthenticated,
            NodeID: params.NodeID,
            NoContentService: null,
            Extensions: [],
            UnlimitedDownloadAccess: false
        };
        
        this.Options = {
            TitleWidth: 8, //8rem
            Modules: params.Modules || {},
            ShowWorkFlow: params.ShowWorkFlow === true,
            ShowKnowledgeOptions: params.ShowKnowledgeOptions === true,
            HideContributors: (params.HideContributors === true) || !this.Objects.IsAuthenticated
        };
        
        var that = this;
        
        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI", "DocsAPI", "PrivacyAPI"] },
            "MediaManager/MediaManager.js",
            "TabsManager/TabsManager.js"
        ], { OnLoad: function () { that._preload(); } });
    }

    NodeViewer.prototype = {
        _preload: function () {
            var that = this;
            
            CNAPI.GetExtensions({
                OwnerID: that.Objects.NodeID, ParseResults: true,
                ResponseHandler: function (r) {
                    that.Objects.Extensions = r.Extensions || [];
                    
                    CNAPI.GetNode({
                        NodeID: that.Objects.NodeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            var node = result || {};
                            
                            if (!(window.RVGlobal || {}).SAASBasedMultiTenancy)
                                document.title = GlobalUtilities.convert_numbers_to_persian(Base64.decode(node.Name.Value) + " - " + document.title);

                            that.Objects.NoContentService = node.NoContentService;
                            that._initialize(node);
                        }
                    });
                }
            });
        },

        _initialize: function (params) {
            params = params || {};
            var that = this;

            //Add to recent items
            var recent = {
                NodeID: params.NodeID,
                AdditionalID: params.AdditionalID,
                NodeTypeID: params.NodeTypeID,
                Name: params.Name.Value,
                NodeType: params.NodeType.Value[params.NodeType.Value.length - 1].Name
            };

            GlobalUtilities.add_to_recent_items(recent.NodeTypeID, recent, "NodeID");
            //end of Add to recent items

            var contribution = params.Contribution === true;
            var hasChild = params.HasChild === true;
            var abstractViewMode = params.ViewPermission != "View";
            
            var isAdmin = (params.IsAreaAdmin === true) || (params.IsServiceAdmin === true) || (params.IsSystemAdmin === true);
            
            that.Objects.UnlimitedDownloadAccess = isAdmin || params.IsCreator || params.IsContributor ||
                params.IsAdmin || !!(params.Permissions || {}).Download; //IsAdmin: admin member of group
            
            that.ContainerDiv.innerHTML = "";
            
            var iconButtons = [];
            
            var _add_icon_button = function (p) {
                p = p || {};

                iconButtons.push({
                    Type: "div", Class: "RevFloat", Name: p.Name, Tooltip: p.Tooltip,
                    Style: "width:1.8rem; text-align:center; margin-top:0.2rem; position:relative;",
                    Childs: [
                        (!p.FontIcon ? null : {
                            Type: "i", Class: "fa " + p.FontIcon + " fa-lg rv-icon-button",
                            Style: "font-size:1.3rem; margin-top:0.15rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [{ Name: "onclick", Value: p.OnClick }]
                        }),
                        (!p.IconName ? null : {
                            Type: "img", Style: "width:1rem; height:1rem; cursor:pointer;",
                            Attributes: [{ Name: "src", Value: GlobalUtilities.icon(p.IconName + ".png") }],
                            Properties: [{ Name: "onclick", Value: p.OnClick }]
                        }),
                        (!p.Count ? null : {
                            Type: "div", Class: "SoftBorder SoftBackgroundColor",
                            Style: "position:absolute; width:1rem; height:1rem; top:-0.6rem;" + RV_Float + ":-0.4rem;" +
                              "color:red; font-size:" + (p.Count > 99 ? "0.7rem" : "0.6rem") + ";" +
                              "text-align:center; direction:ltr;" +
                              GlobalUtilities.border_radius(8) + (p.Count ? "" : "display:none;"),
                            Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(p.Count > 99 ? "99+" : String(p.Count)) }]
                        })
                    ]
                });
            };
            
            if (hasChild) _add_icon_button({ Tooltip: RVDic.TreeView, IconName: "TreeView", OnClick: function () { that._tree_view(params); } });

            if (that._has_extension("Documents") && !abstractViewMode) {
                _add_icon_button({
                    Tooltip: RVDic.Documents, IconName: "Ledgers240",
                    OnClick: function () { that.show_document_trees(params); }
                });
            }

            if (that._has_extension("Experts") && !abstractViewMode) {
                _add_icon_button({
                    Tooltip: RVDic.Experts, IconName: "Expert-Over",
                    OnClick: function () { that.show_experts_members(params, true, isAdmin); }
                });
            }

            if (that._has_extension("Members") && !abstractViewMode) {
                _add_icon_button({
                    Tooltip: RVDic.Members, IconName: "Group", Count: params.MembershipRequestsCount,
                    OnClick: function () { that.show_experts_members(params, false, isAdmin || params.IsAdmin === true); }
                });
            }

            _add_icon_button({
                Tooltip: RVDic.QRCode, FontIcon: "fa-qrcode",
                OnClick: function () { window.open(RVAPI.NodeToQRCodeURL({ NodeID: that.Objects.NodeID, URLOnly: true })); }
            });

            //_add_icon_button({ Tooltip: RVDic.Settings, IconName: "Settings" });
            //_add_icon_button({ Tooltip: RVDic.RegisterNewVersion, IconName: "New" });
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "padding-" + RV_Float + ":6rem; position:relative;",
                    Childs: [
                        {
                            Type: "div", Name: "iconArea",
                            Style: "position:absolute; bottom:0rem; width:0rem;" + RV_Float + ":0rem;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                            Childs: [
                                { Type: "div", Class: "small-12 medium-12 large-6", Name: "tabsArea" },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-6 RevDirection RevTextAlign",
                                    Childs: [
                                        { Type: "div", Style: "display:inline-block;", Name: "visitsCount" },
                                        { Type: "div", Style: "display:inline-block;", Name: "likesCount" },
                                        { Type: "div", Style: "display:inline-block;", Name: "feedback" },
                                        { Type: "div", Style: "display:inline-block;", Name: "scoreArea" }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                            Childs: [
                                { Type: "div", Class: "small-12 medium-6 large-8", Name: "titleArea" },
                                { Type: "div", Class: "small-12 medium-6 large-4", Childs: iconButtons }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "position:relative;",
                    Childs: [
                        { Type: "hr", Class: "small-12 medium-12 large-12" },
                        { Type: "div", Name: "menu" },
                        {
                            Type: "div", Class: "rv-air-button-base rv-air-button-black", Name: "detailsButton",
                            Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;" +
                                "text-align:center; margin-bottom:1rem; font-size:0.6rem; padding:0.1rem 0.5rem;",
                            Properties: [
                                {
                                    Name: "onclick", Value: function () {
                                        var btn = this;

                                        jQuery(elems["details"]).animate({ height: "toggle" }, 500, function () {
                                            if (GlobalUtilities.is_visible(elems["details"])) {
                                                btn.innerHTML = RVDic.HideDetails +
                                                    "<i class='fa fa-chevron-up' style='margin-" + RV_Float + ":0.3rem;'></i>";
                                            }
                                            else {
                                                btn.innerHTML = RVDic.ShowDetails +
                                                    "<i class='fa fa-chevron-down' style='margin-" + RV_Float + ":0.3rem;'></i>";
                                            }
                                        });
                                    }
                                }
                            ],
                            Childs: [
                                { Type: "text", TextValue: RVDic.ShowDetails },
                                { Type: "i", Class: "fa fa-chevron-down", Style: "margin-" + RV_Float + ":0.3rem;" }
                            ]
                        },
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "generalInfo",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0rem; display:none;", Name: "details",
                            Childs: [
                                {
                                    Type: "div", Style: "margin-bottom:0.6rem;",
                                    Class: (contribution && !that.Options.HideContributors ?
                                        "small-12 medium-6 large-8" : "small-12 medium-12 large-12") +
                                        " rv-trim-vertical-margins",
                                    Childs: [
                                        "additionalId", "typeArea", "nameHierarchyArea", "creator", "creationDate", "expirationDate",
                                        "adminArea", "searchabilityArea", "confidentiality", "documentTree", "previousVersion",
                                        "newVersions"
                                    ].map(function (p) {
                                        return {
                                            Type: "div", Name: p, 
                                            Class: "small-12 medium-12 large-12 row rv-border-radius-quarter " +
                                                "rv-bg-color-white-softer SoftShadow SoftBorder",
                                            Style: "margin:0.5rem 0; padding:0.3rem; border-color:rgb(240,240,240);"
                                        };
                                    })
                                },
                                {
                                    Type: "div", Name: "contributors",
                                    Class: (contribution && !that.Options.HideContributors ?
                                        "small-12 medium-6 large-4" : "small-12 medium-12 large-12"),
                                    Style: that.Options.HideContributors ? "display:none;" : ""
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "publicDescription" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0rem; padding:0.3rem;", Name: "attachedFiles"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "abstract" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "keywords",
                            Style: "margin:0.6rem 0rem;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "relations",
                            Style: "margin-bottom:1rem; display:none; position:relative;" +
                                "padding-" + RV_Float + ":6rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;" +
                                        "font-size:0.7rem; font-weight:bold; margin-top:0.2rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.RelatedNodes + ":" }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "relationItems" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "similarNodes",
                            Style: "margin-bottom:1rem; display:none; position:relative;" +
                                "padding-" + RV_Float + ":6rem;",
                            Childs: [{
                                Type: "div",
                                Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;" +
                                    "font-size:0.7rem; font-weight:bold; margin-top:0.2rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.SimilarNodes + ":" }]
                            }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "knowledgableUsers",
                            Style: "margin-bottom:1rem; display:none; position:relative;" +
                                "padding-" + RV_Float + ":6rem;",
                            Childs: [{
                                Type: "div",
                                Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;" +
                                    "font-size:0.7rem; font-weight:bold; margin-top:0.2rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.KnowledgablePeople + ":" }]
                            }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "relatedQuestions",
                            Style: "margin-bottom:1rem; display:none; position:relative;" +
                                "padding-" + RV_Float + ":6rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;" +
                                        "font-size:0.7rem; font-weight:bold; margin-top:0.2rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.RelatedQuestions + ":" }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "questions" }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:10rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "wiki",
                            Style: "margin-top:1.5rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "form",
                            Style: "margin-top:1.5rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "posts",
                            Style: "margin-top:1.5rem; display:none;"
                        }//,
                        //{ Type: "div", Class: "small-12 medium-12 large-12", Name: "events", Style: "display:none;" }
                    ]
                }
            ], that.ContainerDiv);
            
            //Initialize tabs
            var tabs = [];

            var _add_tab = function (extension) {
                var _ext = String((extension || {}).Extension).toLowerCase();

                if (!["form", "wiki", "posts"].some(function (k) { return _ext == k; }) || !that._has_extension(_ext)) return;

                var _div = elems[_ext];

                //if (_ext == "wiki" || (tabs.length == 0 && !that._has_extension("wiki"))) {
                
                if (tabs.length == 0) {
                    var _el = GlobalUtilities.create_nested_elements([
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "top" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "bottom" },
                        {
                            Type: "div", Name: "justAbstractPermission",
                            Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor",
                            Style: (abstractViewMode ? "" : "display:none;") + "margin-top:2rem; padding:3rem;" +
                                "font-size:1.5rem; color:blue; font-weight:bold; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic.MSG.AccessDeniedForFullContent }]
                        }
                    ], elems[_ext]);

                    _el["top"].appendChild(elems["generalInfo"]);
                    _div = _el["bottom"];
                }

                var _title = Base64.decode(extension.Title || "") || RVDic[extension.Extension] || extension.Extension;
                
                tabs.push({ Page: elems[_ext], Title: _title, FixedPage: true,
                    OnActive: function (ind) {
                        jQuery(elems["detailsButton"])[ind == 0 ? "fadeIn" : "fadeOut"](0);

                        if (!abstractViewMode) that["_init_" + _ext](_div, params);
                        else jQuery(_div).fadeOut(0);
                    }
                });
            }

            that._fix_extensions(params);
            
            for (var i = 0, lnt = that.Objects.Extensions.length; i < lnt; ++i)
                _add_tab(that.Objects.Extensions[i]);

            if (abstractViewMode && tabs.length) tabs = [tabs[0]];

            if (tabs.length > 0) new TabsManager({ ContainerDiv: elems["tabsArea"], Pages: tabs }).goto_page(tabs[0].Page);
            if (tabs.length == 1) jQuery(elems["tabsArea"]).css("opacity", 0);
            //end of tabs initialization
            
            if (that.Objects.IsAuthenticated) that._init_menu(elems["menu"], params);

            that.set_score(elems["scoreArea"], params);
            that.set_icon(elems["iconArea"], params);
            that.set_name(elems["titleArea"], params);
            that.set_name_hierarchy(elems["nameHierarchyArea"], params);

            if (!that.Objects.NoContentService) {
                that.set_visits_count(elems["visitsCount"], params);
                that.set_likes_count(elems["likesCount"], params);
            }
            
            if (that.Objects.IsAuthenticated) {
                that.set_node_type(elems["typeArea"], params);
                that.set_additional_id(elems["additionalId"], params);
                that.show_creator(elems["creator"], params);
                that.show_creation_date(elems["creationDate"], params);
                that.set_admin_area(elems["adminArea"], params);

                if (!that.Objects.NoContentService) {
                    that.show_expiration_date(elems["expirationDate"], params);
                    that.set_searchability(elems["searchabilityArea"], params);
                    that.set_confidentiality(elems["confidentiality"], params);
                    that.set_public_description(elems["publicDescription"], params);
                }
                else {
                    elems["expirationDate"].style.display = "none";
                    elems["searchabilityArea"].style.display = "none";
                    elems["confidentiality"].style.display = "none";
                    elems["publicDescription"].style.display = "none";
                }

                if (params.IsKnowledge && !that.Objects.NoContentService) that.set_feedbacks(elems["feedback"], params);
                else elems["feedback"].style.display = "none";
            }
            else {
                elems["typeArea"].style.display = "none";
                elems["additionalId"].style.display = "none";
                elems["creator"].style.display = "none";
                elems["creationDate"].style.display = "none";
                elems["expirationDate"].style.display = "none";
                elems["adminArea"].style.display = "none";
                elems["searchabilityArea"].style.display = "none";
                elems["confidentiality"].style.display = "none";
                elems["feedback"].style.display = "none";
                elems["publicDescription"].style.display = "none";
            }
            
            if (params.IsDocument && that.Options.Modules.DCT && that.Objects.IsAuthenticated)
                that.set_document_tree(elems["documentTree"], params);
            else elems["documentTree"].style.display = "none";

            if (params.EnablePreviousVersionSelect && that.Options.Modules.DCT && that.Objects.IsAuthenticated) {
                that.set_previous_version(elems["previousVersion"], params);
                that.show_new_versions(elems["newVersions"], params);
            }
            else {
                elems["previousVersion"].style.display = "none";
                elems["newVersions"].style.display = "none";
            }
            
            if ((that.Options.Modules.WF === true) && that.Options.ShowWorkFlow) that._initialize_workflow();
            if (that.Options.ShowKnowledgeOptions) that._initialize_knowledge_options(params);

            if (!that.Objects.NoContentService) {
                that.set_attached_files(elems["attachedFiles"], params);
                that.set_description(elems["abstract"], params);
                that.set_keywords(elems["keywords"], params);

                that.show_related_nodes(elems["relations"], elems["relationItems"], params);

                if (that.Objects.IsAuthenticated) {
                    if (false) that.show_similar_nodes(elems["similarNodes"], params);
                    if (!that.Options.HideContributors) that.show_knowledgable_users(elems["knowledgableUsers"], params);
                    if (false) that.show_related_questions(elems["relatedQuestions"], elems["questions"], params);
                }

                if (contribution) that.set_contributors(elems["contributors"], params);
            }
        },

        _fix_extensions: function (params) {
            var that = this;

            if (!that._has_extension("Wiki") || !that._has_extension("Form") ||
                params.Editable || params.HasWorkFlowEditPermission) return;

            var wikiIndex = -1, formIndex = -1;

            for (var i = 0; i < (that.Objects.Extensions || []).length; ++i) {
                var ext = String((that.Objects.Extensions[i] || {}).Extension || "_").toLowerCase();

                if (ext == "wiki") wikiIndex = i;
                else if (ext == "form") formIndex = i;
            }

            if (((wikiIndex < formIndex) && !params.HasWikiContent && params.HasFormContent) ||
                ((formIndex < wikiIndex) && !params.HasFormContent && params.HasWikiContent)) {
                var tmp = that.Objects.Extensions[wikiIndex];
                that.Objects.Extensions[wikiIndex] = that.Objects.Extensions[formIndex];
                that.Objects.Extensions[formIndex] = tmp;
            }
        },

        _init_menu: function (container, params) {
            params = params || {};
            var that = this;

            var currUId = (window.RVGlobal || {}).CurrentUserID;

            var nodeType = Base64.decode(params.NodeType.Value[params.NodeType.Value.length - 1].Name);
            
            var items = [];

            var _add_item = function (title, iconName, onclick) {
                var objNames = {
                    IconName: "r" + GlobalUtilities.generate_new_guid(),
                    TitleName: "r" + GlobalUtilities.generate_new_guid()
                };

                items.push({
                    Type: "div", Class: "Direction TextAlign", Style: "cursor:pointer; padding:0.3rem;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                        { Name: "onmouseout", Value: function () { this.style.color = "black"; } },
                        { Name: "onclick", Value: onclick }
                    ],
                    Childs: [
                        {
                            Type: "i", Class: iconName + " rv-icon-button", Name: objNames.IconName,
                            Style: "margin-top:0.2rem; margin-" + RV_RevFloat + ":0.3rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        },
                        {
                            Type: "div", Style: "display:inline-block;", Name: objNames.TitleName,
                            Childs: [{ Type: "text", TextValue: title }]
                        }
                    ]
                });

                return objNames;
            }

            if ((that._has_extension("Group") || params.IsMember) && !params.IsAdmin && !params.ForcedMembership) {
                var _nt = ((params.NodeType || {}).Value || {}).Name || [];
                _nt = Base64.decode(_nt[_nt.length - 1]);
                
                var button_title = function () {
                    return params.MembershipStatus == "Pending" ? RVDic.CancelRequest :
                        (params.IsMember ? RVDic.LeaveN.replace("[n]", _nt) : RVDic.JoinN.replace("[n]", _nt))
                }

                var button_icon = function () {
                    return params.MembershipStatus == "Pending" ? "fa fa-sign-out" :
                        (params.IsMember ? "fa fa-sign-out" : "fa fa-sign-in");
                }

                var confirm_message = function () {
                    return params.MembershipStatus == "Pending" ? RVDic.Confirms.DoYouWantToCancelYourRequest :
                        (params.IsMember ? RVDic.Confirms.DoYouWantToLeaveN.replace("[n]", _nt) :
                        RVDic.Confirms.DoYouWantToJoinN.replace("[n]", _nt));
                }

                var api_function = function () {
                    return params.MembershipStatus == "Pending" || params.IsMember ? "RemoveMember" : "AddMember";
                }

                var objNames = _add_item(button_title(), button_icon(), function () {
                    if (_nt._Processing) return;

                    var curBtn = this;
                    
                    GlobalUtilities.confirm(confirm_message(), function (r) {
                        if (!r) return;

                        _nt._Processing = true;

                        CNAPI[api_function()]({
                            NodeID: that.Objects.NodeID, UserID: currUId, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) {
                                    params.MembershipStatus = result.Status == "NotSet" ? "" : result.Status;
                                    params.IsMember = result.Status == "Accepted";
                                    
                                    GlobalUtilities.set_text(elems[objNames.TitleName], button_title());
                                    elems[objNames.IconName].setAttribute("class", button_icon());
                                }

                                _nt._Processing = false;
                            }
                        });
                    });
                });
            }

            if (params.Removable) {
                _add_item(RVDic.Remove, "fa fa-times", function () {
                    var _msg = RVDic.Confirms.DoYouWantToRemoveNode.replace("[nt]", nodeType || RVDic.Node);

                    GlobalUtilities.confirm(_msg, function (r) {
                        if (!r) return;

                        CNAPI.RemoveNode({
                            NodeID: params.NodeID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                                alert(RVDic.MSG[result.Succeed] || result.Succeed);

                                setTimeout(function () {
                                    window.location.href = RVGlobal.SAASBasedMultiTenancy ?
                                        RVAPI.ClassesPageURL() : RVAPI.UserPageURL({ UserID: currUId });
                                }, 4000);
                            }
                        });
                    });
                });
            }

            if (items.length == 0) return;
            
            container.setAttribute("style", "position:absolute; margin-top:-0.6rem;" + RV_RevFloat + ":0rem;");

            var menuButton = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "fakeDot",
                    Style: "position:absolute; bottom:0.6rem; padding-top:1px; width:1px;" +
                        "background-color:transparent;" + RV_RevFloat + ":0.5rem;"
                },
                { Type: "i", Class: "fa fa-angle-down fa-2x", Style: "cursor:pointer;" }
            ], container);

            var elems = GlobalUtilities.create_nested_elements([{ Type: "div", Name: "_div", Childs: items }]);
            var menu = elems["_div"];

            var popupMenu = null;
            var ebmoObj = null;

            var _init_mouse_over = function () {
                popupMenu = GlobalUtilities.popup_menu(menuButton["fakeDot"], menu, {
                    Align: "bottom", LeftOffset: window.RV_RTL ? 6 : -6
                });

                ebmoObj = GlobalUtilities.enable_by_mouse_over(container, popupMenu.Container, {
                    Started: true, Delay: 100,
                    OnStart: function (d) { popupMenu.Show(d); }, OnEnd: function (d) { popupMenu.Hide(d); }
                });
            }

            container.onmouseover = function () { this.onmouseover = null; _init_mouse_over(); }
        },

        _get_extension: function (extName) {
            extName = String(extName).toLowerCase();
            for (var i = 0, lnt = (this.Objects.Extensions || []).length; i < lnt; ++i) {
                var ext = this.Objects.Extensions[i];
                if (String(ext.Extension || "").toLowerCase() == extName && ext.Disabled === false) return ext;
            }
        },

        _has_extension: function (extName) {
            return !!this._get_extension(extName);
        },

        set_score: function (container, params) {
            params = params || {};
            var that = this;

            var score = +params.Score;

            if (!params.IsKnowledge || isNaN(score) || score <= 0 || (params.Status && params.Status != "Accepted")) return;

            var scoreScale = +params.ScoreScale;
            if (isNaN(scoreScale) || scoreScale <= 0) scoreScale = 10;

            var lblScore = Number(score * (scoreScale / 10)).toFixed(2);

            var _div = GlobalUtilities.create_nested_elements([
                { Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1.5rem;", Name: "_div" }
            ], container)["_div"];

            GlobalUtilities.append_tooltip(_div, lblScore + " " + GlobalUtilities.convert_numbers_to_persian(RVDic.Score));

            for (var i = 0; i < 5; ++i) {
                var iconName = (score >= 1.5 ? "Star-Full" : (score >= 0.5 ? "Star-Half" : "Star-Outline")) + ".png";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "img", Style: "width:1rem; height:1rem;",
                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(iconName) }]
                    }
                ], _div);

                score -= 2;
            }
        },

        set_icon: function (container, params) {
            params = params || {};

            var that = this;

            var editable = (params.IconURL || {}).Editable === true;
            var iconUrl = (params.IconURL || {}).Value;
            var highQualityiIconUrl = (params.IconURL || {}).HighQuality;

            GlobalUtilities.load_files(["Multimedia/IconSelect.js"], {
                OnLoad: function () {
                    var ic = new IconSelect(container, { ObjectID: that.Objects.NodeID, Editable: editable,
                        IconURL: iconUrl, HighQualityIconURL: highQualityiIconUrl,
                        IconType: "Icon", HighQualityIconType: "HighQualityIcon", DimensionsVariableName: "IconDimensions",
                        ImageWidth: 84, ImageHeight: 84, SaveWidth: 100, SaveHeight: 100, AspectRatio: 1
                    });
                }
            });
        },

        set_status: function () {
            /* this function will be overrided in function: set_name */
        },

        set_name: function (container, params) {
            params = params || {};
            var editable = (params.Name || {}).Editable === true;
            var title = Base64.decode((params.Name || {}).Value || "");
            var that = this;

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Tooltip: (editable ? RVDic.DoubleClickToEdit : null), Name: "viewArea",
                    Style: "display:inline-block; font-weight:bold;" + (editable ? "cursor:pointer;" : "")
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "titleInput",
                            Style: "width:100%; font-size:0.8rem; padding-top:0.1rem; padding-bottom:0.1rem;",
                            Attributes: [{ Name: "type", Value: "text" }]
                        }
                    ]
                }
            ], container);

            that.set_status = function () {
                viewArea.innerHTML = "";

                var hasStatus = params.Status && RVDic.CN[params.Status];

                GlobalUtilities.create_nested_elements([
                    { Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(title) },
                    {
                        Type: "div", Class: "rv-border-radius-quarter rv-air-button-base rv-air-button-black",
                        Style: "display:" + (hasStatus ? "inline-block" : "none") + "; font-size:0.6rem;" +
                            "margin-" + RV_Float + ":0.5rem; cursor:default;",
                        Childs: [{ Type: "text", TextValue: RVDic.Status + ": " + RVDic.CN[params.Status] }]
                    }
                ], viewArea);
            };

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var titleInput = _el["titleInput"];

            var _set_data = function () {
                that.set_status();
                titleInput.value = title;
            };

            var __Editing = false;

            var _on_edit = function () {
                if (!editable) return;

                var set_things = function () {
                    _set_data();

                    viewArea.style.display = __Editing ? "none" : "inline-block";
                    editArea.style.display = __Editing ? "block" : "none";

                    if (__Editing) jQuery(titleInput).focus().select();
                }

                if (__Editing === true) {
                    var newTitle = GlobalUtilities.trim(titleInput.value);
                    if (!newTitle) return;

                    GlobalUtilities.block(container);

                    CNAPI.ModifyNodeName({
                        NodeID: params.NodeID, Name: Base64.encode(newTitle),
                        CheckWorkFlowEditPermission: params.HasWorkFlowEditPermission, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                title = Base64.decode(result.Name);
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            } //end of _on_edit

            viewArea.ondblclick = _on_edit;
            if (title == "") _on_edit();
            GlobalUtilities.set_onenter(titleInput, _on_edit);
            _set_data();
        },

        set_visits_count: function (container, params) {
            params = params || {};
            var visitsCount = +params.VisitsCount;
            if (isNaN(visitsCount)) visitsCount = "0";
            var that = this;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-half SoftShadow TextAlign Direction",
                    Style: "display:inline-block; padding:0.3rem; padding-bottom:0rem;" +
                        "position:relative; padding-" + RV_Float + ":1.2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":-0.6rem;",
                            Childs: [{
                                Type: "middle",
                                Childs: [{
                                    Type: "img", Style: "width:1.3rem; height:1.3rem;",
                                    Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Visited.png") }]
                                }]
                            }]
                        },
                        {
                            Type: "div", Name: "visitsCountId",
                            Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(RVDic.NVisits.replace("[n]", visitsCount)) }]
                        }
                    ]
                }
            ], container);
        },

        set_likes_count: function (container, params) {
            params = params || {};
            var likesCount = +params.LikesCount;
            if (isNaN(likesCount)) likesCount = "0";
            var likeStatus = params.LikeStatus === true;
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-half SoftShadow TextAlign Direction",
                    Style: "display:inline-block; padding:0.3rem; padding-bottom:0rem;" +
                        "position:relative; padding-" + RV_Float + ":1.2rem; margin-" + RV_RevFloat + ":1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":-0.6rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "img", Name: "likeButton",
                                            Style: "width:1.3rem; height:1.3rem; cursor:pointer;",
                                            Attributes: [{ Name: "src", Value: GlobalUtilities.icon("th" + (likeStatus ? "down" : "up") + ".png") }]
                                        }
                                    ]
                                }
                            ]
                        },
                        { Type: "div", Name: "likesCountId" }
                    ]
                }
            ], container);

            var likeButton = elems["likeButton"];
            var countArea = elems["likesCountId"];

            var _set_count = function () {
                countArea.innerHTML = GlobalUtilities.convert_numbers_to_persian(RVDic.NLikes.replace("[n]", likesCount));
            };

            _set_count();

            likeButton.onclick = function () {
                if (likeButton.Processing) return;
                likeButton.Processing = true;

                CNAPI[likeStatus === false ? "Like" : "Unlike"]({
                    NodeID: params.NodeID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Succeed) {
                            likeStatus = result.LikeStatus;
                            likeButton.setAttribute("src", GlobalUtilities.icon("th" + (likeStatus ? "down" : "up") + ".png"));

                            likesCount += likeStatus ? 1 : -1;

                            _set_count();
                        }

                        likeButton.Processing = false;
                    }
                });
            }
        },

        meta_title: function (title) {
            var that = this;

            return {
                Type: "div",
                Style: "position:absolute; top:0; bottom:0;" + RV_Float + ":0rem; width:" + that.Options.TitleWidth + "rem;" +
                    "display:flex; flex-flow:row; align-items:center; color:rgb(80,80,80);",
                Childs: [{ Type: "text", TextValue: title + ":" }]
            };
        },

        set_node_type: function (container, params) {
            params = params || {};
            var editable = false; // (params.NodeType || {}).Editable === true;

            var nodeType = ((params.NodeType || {}).Value || []).map(function (nt) {
                return GlobalUtilities.extend(nt, { Name: Base64.decode(nt.Name) });
            });
            
            var that = this;

            var _el = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                Childs: [
                    that.meta_title(RVDic.NodeType),
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [
                            {
                                Type: "div", Tooltip: (editable ? RVDic.DoubleClickToEdit : null), Name: "viewArea",
                                Style: "display:inline-block;" + (editable ? "cursor:pointer;" : "")
                            },
                            { Type: "div", Name: "editArea", Style: "display:none;" }
                        ]
                    }
                ]
            }], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];

            var typeSelect = GlobalUtilities.append_autosuggest(_el["editArea"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.8rem; padding-top:0.1rem; padding-bottom:0.1rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    _on_edit(this.values[this.selectedIndex], this.keywords[this.selectedIndex]);
                }
            });

            var _set_data = function () {
                viewArea.innerHTML = "";

                var iconName = RV_RTL ? "fa-angle-double-left" : "fa-angle-double-right";

                for (var i = 0, lnt = nodeType.length; i < lnt; ++i) {
                    if (i > 0) {
                        GlobalUtilities.create_nested_elements([{
                            Type: "div", Style: "display:inline-block; margin:0rem 0.5rem;",
                            Childs: [{ Type: "i", Class: "fa " + iconName, Attributes: [{ Name: "aria-hidden", Value: true }] }]
                        }], viewArea);
                    }
                    
                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                        Style: "display:inline-block; font-size:0.7rem; padding:0.1rem 0.3rem;",
                        Link: RVAPI.ClassesPageURL({ NodeTypeID: nodeType[i].ID }),
                        Childs: [{ Type: "text", TextValue: nodeType[i].Name }]
                    }], viewArea);
                }
            }

            var __Editing = false;

            var _on_edit = function (_nodeTypeId, _nodeType) {
                if (!editable) return;

                var set_things = function () {
                    _set_data();
                    viewArea.style.display = __Editing ? "none" : "inline-block";
                    editArea.style.display = __Editing ? "block" : "none";
                }

                if (__Editing === true) {
                    GlobalUtilities.block(container);

                    CNAPI.ChangeNodeType({
                        NodeID: params.NodeID, NodeTypeID: _nodeTypeId,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);

                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                nodeType = result.NodeType || [];
                                for (var i = 0, lnt = nodeType.length; i < lnt; ++i) nodeType[i] = Base64.decode(nodeType[i]);
                                typeSelect.empty();
                                __Editing = false;
                                set_things();

                                window.location.reload();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            } //end of _on_edit

            viewArea.ondblclick = _on_edit;
            if (nodeType.length == 0) _on_edit();
            _set_data();
        },

        set_name_hierarchy: function (container, params) {
            var that = this;
            params = params || {};
            var editable = (params.NameHierarchy || {}).Editable === true;

            var nameHierarchy = ((params.NameHierarchy || {}).Value || []).map(function (nt) {
                return GlobalUtilities.extend(nt, { Name: Base64.decode(nt.Name) });
            });

            if ((nameHierarchy.length <= 1) && !editable) return container.parentNode.removeChild(container);

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;" +
                        (!editable ? "" : "padding-" + RV_RevFloat + ":5rem;"),
                    Childs: [
                        that.meta_title(RVDic.Hierarchy),
                        (!editable ? null : {
                            Type: "div",
                            Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0; width:4.5rem;" +
                                "display:flex; flex-flow:row; align-items:center; font-size:0.7rem;",
                            Childs: [{
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                Style: "flex:1 1 auto;", Name: "editButton",
                                Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                            }]
                        }),
                        { Type: "div", Name: "viewArea", Style: "display:inline-block;" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                            Childs: [{ Type: "div", Class: "small-12 medium-12 large-12", Name: "parentSelect" }]
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];

            var parentSelect = GlobalUtilities.append_autosuggest(_el["parentSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.ParentNodeSelect + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: params.NodeTypeID }),
                SelectOptions: {
                    Mode: "Node",
                    NodeTypes: [{
                        NodeTypeID: params.NodeTypeID,
                        TypeName: params.NodeType.Value[params.NodeType.Value.length - 1].Name
                    }]
                },
                ResponseParser: function (responseText) {
                    return (JSON.parse(responseText).Nodes || []).map(function (itm) {
                        return [Base64.decode(itm.Name), itm.NodeID];
                    });
                },
                OnSelect: function () {
                    _on_edit(this.values[this.selectedIndex], this.keywords[this.selectedIndex]);
                }
            });

            var _set_data = function () {
                viewArea.innerHTML = "";

                for (var i = 0, lnt = nameHierarchy.length; i < lnt; ++i) {
                    var iconName = RV_RTL ? "fa-angle-double-left" : "fa-angle-double-right";

                    if (i > 0) {
                        GlobalUtilities.create_nested_elements([{
                            Type: "div", Style: "display:inline-block; margin:0rem 0.5rem;",
                            Childs: [{ Type: "i", Class: "fa " + iconName, Attributes: [{ Name: "aria-hidden", Value: true }] }]
                        }], viewArea);
                    }

                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                        Style: "display:inline-block; font-size:0.7rem; padding:0.1rem 0.3rem;",
                        Link: RVAPI.NodePageURL({ NodeID: nameHierarchy[i].ID }),
                        Childs: [{ Type: "text", TextValue: nameHierarchy[i].Name }]
                    }], viewArea);
                }
            }

            var __Editing = false;

            var _on_edit = function (_nodeId, _name) {
                if (!editable) return;

                var set_things = function () {
                    _set_data();
                    viewArea.style.display = __Editing ? "none" : "block";
                    editArea.style.display = __Editing ? "block" : "none";
                    _el["editButton"].innerHTML = __Editing ? RVDic.Save : RVDic.Edit;
                };

                if (__Editing === true) {
                    GlobalUtilities.block(container);

                    CNAPI.MoveNode({
                        NodeID: params.NodeID, ParentNodeID: _nodeId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                nameHierarchy = result.NameHierarchy || [];
                                for (var i = 0, lnt = nameHierarchy.length; i < lnt; ++i) nameHierarchy[i] = Base64.decode(nameHierarchy[i]);
                                parentSelect.empty();
                                __Editing = false;
                                set_things();

                                window.location.reload();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            } //end of _on_edit

            if (_el["editButton"]) _el["editButton"].onclick = _on_edit;
            if (nameHierarchy.length == 0) _on_edit();
            _set_data();
        },

        set_additional_id: function (container, params) {
            params = params || {};
            var additionalId = params.AdditionalID || "";
            var that = this;

            if (!additionalId) container.parentNode.removeChild(container);

            GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                Childs: [
                    that.meta_title(RVDic.AdditionalID),
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(additionalId) }]
                    }
                ]
            }], container);
        },

        show_creator: function (container, params) {
            params = params || {};
            var creator = params.Creator || {};
            var that = this;
            
            var userId = creator.UserID;
            var firstname = Base64.decode(creator.FirstName);
            var lastname = Base64.decode(creator.LastName);
            var username = RVGlobal.HideUserNames ? null : Base64.decode(creator.UserName);
            
            if (!userId) return container.parentNode.removeChild(container);

            GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                Childs: [
                    that.meta_title(RVDic.Registerer),
                    {
                        Type: "div", Style: "display:" + (that.Options.HideContributors ? "none" : "inline-block") + ";",
                        Link: UsersAPI.UserPageURL({ UserID: userId }),
                        Childs: [
                            { Type: "text", TextValue: firstname + " " + lastname },
                            (!username ? null : {
                                Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; padding:0.1rem 0.3rem; font-size:0.6rem;",
                                Childs: [{ Type: "text", TextValue: username }]
                            })
                        ]
                    },
                    {
                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-circle",
                        Style: "padding:0.1rem 1rem; font-size:0.7rem; cursor:default;" +
                            "display:" + (that.Options.HideContributors ? "inline-block" : "none") + ";",
                        Childs: [{ Type: "text", TextValue: RVDic.Hidden }]
                    }
                ]
            }], container);
        },

        show_creation_date: function (container, params) {
            params = params || {};
            var that = this;

            var creationDate = params.CreationDate;

            if (!creationDate) return container.parentNode.removeChild(container);

            GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                Childs: [
                    that.meta_title(RVDic.CreationDate),
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(creationDate) }]
                    }
                ]
            }], container);
        },

        show_expiration_date: function (container, params) {
            params = params || {};
            var that = this;
            
            var editable = (params.ExpirationDate || {}).Editable;
            var expirationDate = (params.ExpirationDate || {}).Value;
            var expired = (params.ExpirationDate || {}).Expired;
            
            if (!expirationDate && !editable) return container.parentNode.removeChild(container);

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                    Childs: [
                        that.meta_title(RVDic.ExpirationDate),
                        {
                            Type: "div", Name: "viewArea",
                            Style: "display:inline-block;" + (editable ? "cursor:pointer;" : ""),
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;", Name: "value",
                                    Tooltip: (editable ? RVDic.DoubleClickToEdit : null)
                                },
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.8rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times rv-icon-button",
                                            Name: "removeButton", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        { Type: "div", Name: "editArea", Style: "display:none;" }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var valueArea = _el["value"];
            var removeButton = _el["removeButton"];
            var editArea = _el["editArea"];

            var dateSelect = null;
            var removing = false;

            removeButton.onclick = function () {
                if (removing) return;
                removing = true;
                
                CNAPI.SetNodeExpirationDate({
                    NodeID: that.Objects.NodeID, ExpirationDate: null, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            expirationDate = result.ExpirationDate;
                            expired = result.Expired;

                            _set_data();
                        }

                        removing = false;
                    }
                });
            };

            var _set_data = function () {
                removeButton.style.display = expirationDate ? "block" : "none";

                valueArea.innerHTML = !expirationDate ? "<span class='rv-gray'>" + RVDic.NotSet + "</span>" :
                    "<span style='" + (expired ? "color:red;" : "") + "'>" +
                    GlobalUtilities.convert_numbers_to_persian(expirationDate) + "<span>";
            }

            var __Editing = false;
            var loadingDateSelect = false;

            var _on_edit = function () {
                if (!editable || removing) return;
                
                var set_things = function () {
                    _set_data();

                    viewArea.style.display = __Editing ? "none" : "inline-block";
                    editArea.style.display = __Editing ? "block" : "none";

                    if (__Editing) {
                        if (!dateSelect && !loadingDateSelect) {
                            loadingDateSelect = true;

                            GlobalUtilities.append_calendar(editArea, {
                                OnSelect: function () { _on_edit(); }
                            }, function (cal) {
                                dateSelect = cal;
                                loadingDateSelect = false;
                            });
                        }
                    }
                }

                if (__Editing === true) {
                    if (!dateSelect) return;

                    GlobalUtilities.block(container);

                    var newExpirationDate = dateSelect.Get().Value;

                    CNAPI.SetNodeExpirationDate({
                        NodeID: that.Objects.NodeID, ExpirationDate: newExpirationDate, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                expirationDate = result.ExpirationDate || expirationDate;
                                expired = result.ExpirationDate ? result.Expired : expired;

                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            } //end of _on_edit

            viewArea.ondblclick = _on_edit;
            _set_data();
        },

        set_admin_area: function (container, params) {
            var that = this;
            params = params || {};

            var editable = (params.AdminArea || {}).Editable === true;
            var adminArea = (params.AdminArea || {}).Value || {};
            adminArea.NodeName = Base64.decode(adminArea.NodeName);
            adminArea.NodeType = Base64.decode(adminArea.NodeType);

            if (!editable && !adminArea.NodeID) return container.parentNode.removeChild(container);

            var areaSelectNeeded = (params.AdminType == "AreaAdmin") || (params.AdminType == "ComplexAdmin");

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                    Childs: [
                        that.meta_title(RVDic.BelongsTo),
                        { Type: "div", Name: "viewArea", Style: "display:inline-block;" },
                        (!editable ? null : {
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "editButton",
                            Style: "display:inline-block; font-size:0.7rem; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                        }),
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: "editArea",
                            Style: "margin:0rem; display:none;",
                            Childs: [
                                { Type: "div", Class: "small-4 medium-4 large-4", Name: "nodeTypeSelect" },
                                {
                                    Type: "div", Class: "small-8 medium-8 large-8", Name: "nodeSelect",
                                    Style: "padding-" + RV_Float + ":0.5rem;"
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editButton = _el["editButton"];
            var editArea = _el["editArea"];

            var nodeSelect = areaSelectNeeded ? null : GlobalUtilities.append_autosuggest(_el["nodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.8rem; padding-top:0.1rem; padding-bottom:0.1rem;",
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].Name || "");
                        if ((items[i].AdditionalID || "") != "") tt += " - " + Base64.decode(items[i].AdditionalID || "");
                        arr.push([tt, items[i].NodeID]);
                    }
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    newNodeId = this.values[index];
                    newNodeName = this.keywords[index];
                    _on_edit();
                }
            });

            var nodeTypeSelect = areaSelectNeeded ? null : GlobalUtilities.append_autosuggest(_el["nodeTypeSelect"], {
                InnerTitle: RVDic.NodeTypeSelect + "...",
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.8rem; padding-top:0.1rem; padding-bottom:0.1rem;",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID || ""]);
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    var nodeTypeId = this.values[index];
                    var nodeType = newNodeType = this.keywords[index];
                    GlobalUtilities.set_inner_title(nodeSelect.InputElement, RVDic.SelectN.replace("[n]", nodeType) + "...");
                    nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                }
            });

            var newNodeId = "";
            var newNodeName = "";
            var newNodeType = "";

            var _set_data = function () {
                viewArea.innerHTML = "";

                if (adminArea.NodeID) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:inline-block;", Link: CNAPI.NodePageURL({ NodeID: adminArea.NodeID }),
                            Childs: [{ Type: "text", TextValue: adminArea.NodeName + " (" + adminArea.NodeType + ")" }]
                        }
                    ], viewArea);
                }
            };

            var __Editing = false;

            var set_things = function () {
                _set_data();

                if (editButton) jQuery(editButton)[__Editing && !areaSelectNeeded ? "fadeOut" : "fadeIn"]();
                jQuery(viewArea)[__Editing ? "fadeOut" : "fadeIn"](0, function () {
                    jQuery(editArea)[__Editing ? "fadeIn" : "fadeOut"]();
                });
            };

            var _on_edit = function () {
                if (!editable || areaSelectNeeded) return;

                if (__Editing === true) {
                    GlobalUtilities.block(container);

                    CNAPI.SetAdminArea({
                        NodeID: that.Objects.NodeID, AreaID: newNodeId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                adminArea.NodeID = newNodeId;
                                adminArea.NodeName = newNodeName;
                                adminArea.NodeType = newNodeType;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            }; //end of _on_edit

            if (!adminArea.NodeID && !areaSelectNeeded) _on_edit();
            _set_data();
            
            if (editButton) editButton.onclick = !areaSelectNeeded ? _on_edit : function () {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                var showed = GlobalUtilities.show(_div);
                
                GlobalUtilities.load_files(["CN/AdminAreaSelect.js"], {
                    OnLoad: function () {
                        new AdminAreaSelect(_div, {
                            NodeID: params.NodeID,
                            NodeTypeID: params.NodeTypeID,
                            AdminType: params.AdminType,
                            CreatorUserID: (params.Creator || {}).UserID,
                            OnSelect: function (node) {
                                if (showed) showed.Close();
                                
                                adminArea.NodeID = node.NodeID;
                                adminArea.NodeName = node.Name;
                                adminArea.NodeType = node.NodeType;

                                set_things();
                            }
                        });
                    }
                });
            };
        },

        set_searchability: function (container, params) {
            params = params || {};
            var editable = (params.Searchable || {}).Editable === true;
            var searchable = (params.Searchable || {}).Value || {};
            var that = this;

            if (!editable) return container.parentNode.removeChild(container);

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                    Childs: [
                        that.meta_title(RVDic.BeSearchable),
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "checkbox",
                                    Params: {
                                        Checked: searchable, Width: 18, Height: 18,
                                        OnClick: function (e, done) {
                                            e.preventDefault();

                                            CNAPI.SetNodeSearchability({
                                                NodeID: that.Objects.NodeID, Searchable: !this.Checked, ParseResults: true,
                                                ResponseHandler: function (result) { if (!result.ErrorText) done(); }
                                            });
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ], container);
        },

        set_confidentiality: function (container, params) {
            params = params || {};
            var editable = (params.ConfidentialityLevel || {}).Editable === true;
            var confidentialityLevel = (params.ConfidentialityLevel || {}).Value || {};
            confidentialityLevel.Title = Base64.decode(confidentialityLevel.Title || "");
            var that = this;
            
            if (!editable && !confidentialityLevel.ID) return container.parentNode.removeChild(container);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                    Childs: [
                        that.meta_title(RVDic.ConfidentialityLevel),
                        {
                            Type: "div", Style: "display:inline-block;", Name: "title",
                            Childs: [{ Type: "text", TextValue: !confidentialityLevel.Title ? RVDic.NotSet : confidentialityLevel.Title }]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "editButton",
                            Style: "display:" + (editable ? "inline-block" : "none") + ";" +
                                "margin-" + RV_Float + ":1rem;",
                            Childs: [
                                { Type: "i", Class: "fa fa-pencil", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                                { Type: "text", TextValue: RVDic.PRVC.EditConfidentialityAndPermissions }
                            ]
                        }
                    ]
                }
            ], container);

            var editButton = elems["editButton"];
            var showed = null;

            if (editable) editButton.onclick = function () {
                if (editButton.__Div) return (showed = GlobalUtilities.show(editButton.__Div));

                var _div = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }])["container"];

                editButton.__Div = _div;

                GlobalUtilities.loading(_div);
                showed = GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                    OnLoad: function () {
                        var pv = new PermissionSetting(_div, {
                            ObjectID: that.Objects.NodeID,
                            Options: {
                                ConfidentialitySelect: true,
                                PermissionTypes: ["View", "ViewAbstract", "ViewRelatedItems", "Modify", "Delete", "Download"],
                                ObjectType: "Node",
                                OnSave: function (data) {
                                    var confidentialityTitle = Base64.decode(((data || {})[that.Objects.NodeID] || {}).ConfidentialityTitle);
                                    
                                    GlobalUtilities.set_text(elems["title"],
                                        GlobalUtilities.convert_numbers_to_persian(!confidentialityTitle ? RVDic.NotSet : confidentialityTitle));

                                    showed.Close();
                                }
                            }
                        });
                    }
                });
            };
        },

        set_document_tree: function (container, params) {
            params = params || {};
            var that = this;

            var editable = (params.DocumentTree || {}).Editable === true;

            var docTree = (params.DocumentTree || {}).Value || {};
            docTree.Name = Base64.decode(docTree.Name || "");
            var childs = docTree.Childs || [];
            for (var i = 0, lnt = childs.length; i < lnt; ++i)
                childs[i].Name = Base64.decode(childs[i].Name);

            if (!editable && !docTree.ID) return container.parentNode.removeChild(container);

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                    Childs: [
                        that.meta_title(RVDic.DocumentTree),
                        {
                            Type: "div", Name: "viewArea", Tooltip: (editable ? RVDic.DoubleClickToEdit : null),
                            Style: "display:inline-block;" + (editable ? "cursor:pointer;" : ""),
                            Childs: [
                                {
                                    Type: "div", Name: "treeTitle",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;"
                                },
                                { Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: "(" }] },
                                { Type: "div", Style: "display:inline-block;", Name: "treeChilds" },
                                { Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: ")" }] }
                            ]
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var treeTitleArea = _el["treeTitle"];
            var treeChildsArea = _el["treeChilds"];

            var _set_data = function () {
                GlobalUtilities.set_text(treeTitleArea, docTree.Name);
                treeChildsArea.innerHTML = childs.length > 0 ? "" : "<span style='color:gray;'>" + RVDic.NotSet + "</span>";

                var iconName = RV_RTL ? "fa-angle-double-left" : "fa-angle-double-right";

                for (var i = 0, lnt = childs.length; i < lnt; ++i) {
                    if (i > 0) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Style: "display:inline-block; margin:0rem 0.5rem;",
                                Childs: [{ Type: "i", Class: "fa " + iconName, Attributes: [{ Name: "aria-hidden", Value: true }] }]
                            }
                        ], treeChildsArea);
                    }

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:inline-block; color:gray;",
                            Childs: [{ Type: "text", TextValue: childs[i].Name }]
                        }
                    ], treeChildsArea);
                }
            };

            _set_data();

            var _dtnsObj = null;

            viewArea.ondblclick = !editable ? null : function () {
                if (_dtnsObj) {
                    _dtnsObj.ShowedDiv = GlobalUtilities.show(_dtnsObj.Container);
                    return;
                }

                _dtnsObj = { ShowedDiv: null, Container: null };

                var _div = _dtnsObj.Container = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                _dtnsObj.ShowedDiv = GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["DCT/DocTreeNodeSelect.js"], {
                    OnLoad: function () {
                        new DocTreeNodeSelect(_div, {
                            OnClose: function () { _dtnsObj.ShowedDiv.Close(); },
                            OnSelect: function (nd) {
                                _dtnsObj.ShowedDiv.Close();

                                GlobalUtilities.block(container);

                                CNAPI.SetDocumentTreeNodeID({
                                    NodeID: that.Objects.NodeID, DocumentTreeNodeID: nd.ID,
                                    CheckWorkFlowEditPermission: params.HasWorkFlowEditPermission, ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                        else {
                                            docTree = nd.Tree;
                                            childs = nd.Path;

                                            _set_data();
                                        }

                                        GlobalUtilities.unblock(container);
                                    }
                                });
                            }
                        });
                    }
                });
            };
        },

        set_previous_version: function (container, params) {
            var that = this;
            params = params || {};

            var editable = (params.PreviousVersion || {}).Editable === true;

            var previousVersion = (params.PreviousVersion || {}).Value || {};
            previousVersion.Name = Base64.decode(previousVersion.Name);

            if (!editable && !previousVersion.ID) return container.parentNode.removeChild(container);

            var nodeType = params.NodeType.Value;
            nodeType = nodeType[nodeType.length - 1];

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem; display:flex; flex-flow:row;",
                Childs: [
                    that.meta_title(RVDic.PreviousVersion),
                    {
                        Type: "div", Style: "flex:1 1 auto",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea",
                                Childs: [{ Type: "div", Class: "small-12 medium-12 large-12", Name: "typeSelect" }]
                            }
                        ]
                    },
                    (!editable ? null : {
                        Type: "div", Class: "RevDirection RevTextAlign", Style: "flex:0 0 auto; padding-" + RV_Float + ":0.5rem;",
                        Childs: [
                            { Name: "removeButton", Title: RVDic.Remove },
                            { Name: "editButton", Title: RVDic.Edit }
                        ].map(function (btn) {
                            return {
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter Direction TextAlign", Name: btn.Name,
                                Style: "display:none; margin-" + RV_Float + ":0.5rem; font-size:0.6rem;",
                                Childs: [{ Type: "text", TextValue: btn.Title }]
                            };
                        })
                    })
                ]
            }], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var removeButton = elems["removeButton"];
            var editButton = elems["editButton"];

            var typeSelect = GlobalUtilities.append_autosuggest(elems["typeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.8rem; padding-top:0.1rem; padding-bottom:0.1rem;",
                InnerTitle: RVDic.SelectN.replace("[n]", nodeType.Name) + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: (((params || {}).NodeType || {}).Value || {}).ID }),
                ResponseParser: function (responseText) {
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name || ""), nodes[i].NodeID]);
                    return arr;
                },
                OnSelect: function () {
                    _on_edit(this.values[this.selectedIndex], this.keywords[this.selectedIndex]);
                },
                OnSelectButtonClick: function () {
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
                                    Title: RVDic.NodeSelect, NodeTypeSearchBox: false, TreeCheckbox: false,
                                    HideSelectedItems: true, Filters: true, ShowBottomBar: false,
                                    Limits: { NodeTypes: [{ NodeTypeID: nodeType.ID, TypeName: nodeType.Name }] },
                                    OnSelect: function (node) {
                                        that.__ShowedNodeList.Close();
                                        typeSelect.set_item(node.NodeID, node.Name, { IgnoreOnSelect: false });
                                    },
                                    OnCancel: function () { that.__ShowedNodeList.Close(); }
                                }
                            });
                        }
                    });
                }
            });

            var __Editing = false;

            var _set_data = function () {
                viewArea.innerHTML = "";

                if (previousVersion.ID) {
                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Link: RVAPI.NodePageURL({ NodeID: previousVersion.ID }),
                        Childs: [{ Type: "text", TextValue: previousVersion.Name }]
                    }], viewArea);
                }
                else viewArea.innerHTML = RVDic.NotSet;

                if (previousVersion && typeSelect)
                    typeSelect.set_item(previousVersion.ID, previousVersion.Name, { IgnoreOnSelect: true });
            };

            var set_things = function () {
                _set_data();
                viewArea.style.display = __Editing ? "none" : "block";
                editArea.style.display = __Editing ? "block" : "none";
                if (removeButton) removeButton.style.display = __Editing || !previousVersion.ID ? "none" : "inline-block";
                if (editButton) {
                    editButton.style.display = "inline-block";
                    editButton.innerHTML = __Editing ? RVDic.Save : RVDic.Edit;
                }
            };

            var go = function (previousVersionId, previousVersionName, done) {
                GlobalUtilities.block(container);

                CNAPI.SetPreviousVersion({
                    NodeID: params.NodeID, PreviousVersionID: previousVersionId, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText)
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            previousVersion.ID = previousVersionId;
                            previousVersion.Name = previousVersionName;
                            typeSelect.empty();
                            __Editing = false;
                            set_things();
                        }

                        GlobalUtilities.unblock(container);

                        if (done) done();
                    }
                });
            };

            var _on_edit = function (previousVersionId, previousVersionName) {
                if (!editable) return;

                if (__Editing === true) go(previousVersionId, previousVersionName);
                else __Editing = true;

                set_things();
            }; //end of _on_edit

            if (removeButton) removeButton.onclick = function () {
                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.PreviousVersion);

                GlobalUtilities.confirm(msg, function (r) {
                    if (r) go(null, null, function () { _on_edit(null, null) });
                });
            };

            if (editButton) editButton.onclick = function () {
                var index = typeSelect.selectedIndex;
                index >= 0 ? _on_edit(typeSelect.values[index], typeSelect.keywords[index]) : _on_edit();
            };

            if (!previousVersion.Name) _on_edit();

            set_things();
        },

        show_new_versions: function (container, params) {
            params = params || {};
            var newVersions = params.NewVersions || [];
            var that = this;

            if (newVersions.length == 0) return container.parentNode.removeChild(container);

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":" + that.Options.TitleWidth + "rem;",
                    Childs: [
                        that.meta_title(RVDic.NewVersion),
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "newVersions" }
                    ]
                }
            ], container);

            var itemsArea = _el["newVersions"];

            var add_item = function (version) {
                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "rv-bg-color-white-softer rv-border-radius-quarter SoftShadow SoftBorder",
                    Style: "display:inline-block; padding:0.3rem; margin:0.1rem;" +
                        "margin-" + RV_RevFloat + ":0.3rem; font-size:0.7rem; border-color:rgb(220,220,220);",
                    Link: CNAPI.NodePageURL({ NodeID: version.NodeID }),
                    Childs: [{ Type: "text", TextValue: Base64.decode(version.Name || "") }]
                }], itemsArea);
            }

            for (var i = 0, lnt = newVersions.length; i < lnt; ++i)
                add_item(newVersions[i]);
        },

        set_public_description: function (container, params) {
            params = params || {};

            var editable = (params.PublicDescription || {}).Editable === true;
            var that = this;

            var desc = Base64.decode((params.PublicDescription || {}).Value || "");

            if (!editable && !desc) return container.parentNode.removeChild(container);

            var nodeType = params.NodeType.Value;
            nodeType = nodeType[nodeType.length - 1].Name;
            
            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; font-weight:bold; padding:0rem 0.3rem; padding-" + RV_RevFloat + ":2rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; bottom:0rem;" + RV_RevFloat + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: RVDic.PublicDescriptionForN.replace("[n]", nodeType) }]
                        }
                    ]
                },
                { Type: "hr", Class: "small-12 medium-12 large-12" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "padding:0.3rem; padding-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:justify;", Name: "descriptionData"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea" }
                    ]
                }
            ], container);

            var descriptionData = _el["descriptionData"];
            var editArea = _el["editArea"];

            var textInput = null;

            var editButton = _el["editButton"];

            var _set_desc = function () {
                descriptionData.innerHTML = "";
                if (desc != "") GlobalUtilities.append_markup_text(descriptionData, desc, { RichText: true });
            };

            var _on_edit = function () {
                if (!editable) return;

                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    descriptionData.style.display = editButton.__Editing ? "none" : "block";

                    if (editButton.__Editing) {
                        if (!textInput) {
                            textInput = new AdvancedTextArea({
                                ContainerDiv: editArea, DefaultText: RVDic.WhatIsYourOpinion,
                                QueryTemplate: "RelatedThings",
                                ItemTemplate: {
                                    ItemsTitle: "Items", ID: "ItemID", Name: "Name",
                                    Type: "Type", ImageURL: "ImageURL"
                                }
                            });
                        }

                        textInput.set_data(desc);
                    }

                    _set_desc();

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "floppy-o" : "pencil") + " fa-lg rv-icon-button");
                }

                if (editButton.__Editing === true) {
                    var newDesc = GlobalUtilities.trim(textInput.get_data());

                    GlobalUtilities.block(container);

                    CNAPI.ModifyNodePublicDescription({
                        NodeID: params.NodeID, Description: Base64.encode(newDesc),
                        CheckWorkFlowEditPermission: params.HasWorkFlowEditPermission, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                desc = Base64.decode(result.Description);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            _set_desc();
        },

        set_description: function (container, params) {
            params = params || {};
            var editable = (params.Description || {}).Editable === true;
            var that = this;

            var abstract = Base64.decode((params.Description || {}).Value || "");

            if ((!editable && !abstract) || params.DisableAbstractAndKeywords)
                return container.parentNode.removeChild(container);

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; font-weight:bold; padding:0rem 0.3rem; padding-" + RV_RevFloat + ":2rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; bottom:0rem;" + RV_RevFloat + ":0.3rem;" + (editable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: RVDic.Abstract }]
                        }
                    ]
                },
                { Type: "hr", Class: "small-12 medium-12 large-12" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "padding:0.3rem; padding-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:justify;", Name: "descriptionData"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea" }
                    ]
                }
            ], container);

            var descriptionData = _el["descriptionData"];
            var editArea = _el["editArea"];

            var textInput = null;

            var editButton = _el["editButton"];

            var _set_desc = function () {
                descriptionData.innerHTML = "";
                if (abstract) GlobalUtilities.append_markup_text(descriptionData, abstract, { RichText: true });
            };

            var _update_editor = function () {
                AdvancedTextArea.replace_markups(abstract, {
                    IgnoreBreaks: true, IgnoreURLs: false,
                    Done: function (text) { textInput.set_data(text); }
                });
            };

            var loadingEditor = false;

            var _on_edit = function () {
                if (!editable) return;

                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    descriptionData.style.display = editButton.__Editing ? "none" : "block";

                    if (editButton.__Editing) {
                        if (textInput) _update_editor();
                        else if (!loadingEditor) {
                            loadingEditor = true;

                            GlobalUtilities.append_rich_text_editor(editArea, { EnableTagging: true }, function (editor) {
                                textInput = editor;
                                loadingEditor = false;
                                _update_editor();
                            });
                        }
                    }

                    _set_desc();

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "floppy-o" : "pencil") + " fa-lg rv-icon-button");
                }

                if (editButton.__Editing === true) {
                    var newAbstract = GlobalUtilities.trim(textInput.get_data());

                    GlobalUtilities.block(container);

                    CNAPI.ModifyNodeDescription({
                        NodeID: params.NodeID, Description: Base64.encode(newAbstract),
                        CheckWorkFlowEditPermission: params.HasWorkFlowEditPermission, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                abstract = Base64.decode(result.Description);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;
            //if (abstract == "") _on_edit();
            _set_desc();
        },

        set_keywords: function (container, params) {
            params = params || {};
            
            var editable = (params.Keywords || {}).Editable === true;
            
            var keywords = (params.Keywords || {}).Value || [];
            var that = this;

            if ((!editable && !keywords.length) || params.DisableAbstractAndKeywords)
                return container.parentNode.removeChild(container);

            var _el = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "position:relative; padding-" + RV_Float + ":4.5rem;",
                Childs: [
                    {
                        Type: "div",
                        Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; width:4.5rem;" +
                            "font-weight:bold; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Keywords + ":" }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [
                            {
                                Type: "div", Tooltip: (editable ? RVDic.DoubleClickToEdit : null), Name: "keywords",
                                Style: "display:inline-block;" + (editable ? "cursor:pointer;" : "") //inline-block is necessary to display tooltip at the center of text
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea",
                                Style: "position:relative; display:none; padding-" + RV_Float + ":2rem;",
                                Childs: [
                                    {
                                        Type: "div",
                                        Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; width:2rem;",
                                        Childs: [{
                                            Type: "i", Class: "fa fa-floppy-o fa-2x rv-icon-button", Tooltip: RVDic.Save,
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { _on_edit(); } }]
                                        }]
                                    },
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemSelect" }
                                ]
                            }
                        ]
                    }
                ]
            }], container);

            var itemsArea = _el["keywords"];
            var editArea = _el["editArea"];

            var itemSelect = null;

            GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    itemSelect = new NewSingleDataContainer(_el["itemSelect"], { EnableTextItem: true,
                        InputStyle: "margin:0rem; width:100%;",
                        AjaxDataSource: CNAPI.GetTagsDataSource(),
                        ResponseParser: function (responseText) {
                            var tags = JSON.parse(responseText).Tags || [];
                            var arr = [];
                            for (var i = 0, lnt = tags.length; i < lnt; ++i)
                                arr.push([Base64.decode(tags[i].Tag || ""), tags[i].TagID || ""]);
                            return arr;
                        }
                    });

                    for (var i = 0, lnt = keywords.length; i < lnt; ++i)
                        itemSelect.add_item(Base64.decode(keywords[i] || ""), Base64.decode(keywords[i] || ""));
                }
            });

            var add_item = function (_keyword) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; margin:0rem 0.3rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(_keyword || "") }]
                    }
                ], itemsArea);
            };

            var _set_data = function () {
                itemsArea.innerHTML = "";

                for (var i = 0, lnt = keywords.length; i < lnt; ++i) {
                    if (i > 0) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Style: "display:inline-block; margin:0rem 0.3rem; color:red;",
                                Childs: [{ Type: "text", TextValue: "-" }]
                            }
                        ], itemsArea);
                    }

                    add_item(keywords[i]);
                }
            }

            var __Editing = false;

            var _on_edit = function () {
                if (!editable) return;

                var set_things = function () {
                    itemsArea.style.display = __Editing ? "none" : "inline-block";
                    editArea.style.display = __Editing ? "block" : "none";

                    _set_data();
                }

                if (__Editing === true) {
                    var newValue = (((itemSelect.Objects || {}).Autosuggest || {}).InputElement || {}).value;
                    if (newValue) itemSelect.add_item(newValue, newValue);

                    var _items = itemSelect.get_items();
                    var newKeywords = [];
                    var strKeywords = "";
                    for (var i = 0, lnt = _items.length; i < lnt; ++i) {
                        newKeywords.push(Base64.encode(_items[i].Title || ""));
                        strKeywords += (i == 0 ? "" : "|") + Base64.encode(_items[i].Title || "");
                    }
                    
                    GlobalUtilities.block(container);

                    CNAPI.ModifyNodeTags({
                        NodeID: that.Objects.NodeID, Tags: strKeywords,
                        CheckWorkFlowEditPermission: params.HasWorkFlowEditPermission, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                keywords = newKeywords;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            } //end of _on_edit

            itemsArea.ondblclick = _on_edit;
            if (keywords.length == 0) _on_edit();
            _set_data();
        },

        show_similar_nodes: function (container, params) {
            params = params || {};
            var that = this;
            
            var _add_item = function (item) {
                var generatedColors = GlobalUtilities.generate_color(item.Node.NodeID);

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                        Style: "display:inline-block; margin:0.2rem; padding:0.1rem 0.3rem; font-size:0.7rem;" +
                            "background-color:" + generatedColors.Color + "; border-color:" + generatedColors.Dark + ";" +
                            "cursor:pointer; color:black;",
                        Link: RVAPI.NodePageURL({ NodeID: item.Node.NodeID }),
                        Properties: [
                            { Name: "onmouseover", Value: function () { this.style.color = "white"; this.style.backgroundColor = generatedColors.Dark; } },
                            { Name: "onmouseout", Value: function () { this.style.color = "black"; this.style.backgroundColor = generatedColors.Color; } }
                        ],
                        Childs: [{ Type: "text", TextValue: Base64.decode(item.Node.Name) }]
                    }
                ], container);
            };
            
            CNAPI.SuggestSimilarNodes({
                NodeID: that.Objects.NodeID, Count: 10, ParseResults: true,
                ResponseHandler: function (result) {
                    var nodes = result.Nodes || [];

                    if (nodes.length) jQuery(container).fadeIn(500);

                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        _add_item(nodes[i]);
                }
            });
        },

        show_knowledgable_users: function (container, params) {
            params = params || {};
            var that = this;

            var _add_item = function (item) {
                var fullname = Base64.decode(item.User.FirstName) + " " + Base64.decode(item.User.LastName);

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter rv-air-button",
                        Style: "display:inline-block; margin:0.2rem; padding:0.3rem; font-size:0.7rem;",
                        Link: RVAPI.UserPageURL({ UserID: item.User.UserID }), Params: { IgnoreMouseEvents: true },
                        Childs: [
                            {
                                Type: "div", Style: "text-align:center;",
                                Childs: [
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter", Style: "width:2.5rem; height:2.5rem;",
                                        Attributes: [{ Name: "src", Value: item.User.ProfileImageURL || item.User.ImageURL }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Style: "margin-top:0.3rem;",
                                Childs: [{ Type: "text", TextValue: fullname }]
                            }
                        ]
                    }
                ], container);
            };

            CNAPI.SuggestKnowledgableUsers({
                NodeID: that.Objects.NodeID, Count: 10, ParseResults: true,
                ResponseHandler: function (result) {
                    var users = (result.Users || []).filter(u => !!u.FirstName || !!u.LastName);

                    if (users.length) jQuery(container).fadeIn(500);

                    for (var i = 0, lnt = users.length; i < lnt; ++i)
                        _add_item(users[i]);
                }
            });
        },

        set_contributors: function (container, params) {
            params = params || {};

            var _sort = function (array) {
                return array.sort(function (a, b) { return +a.Share < +b.Share; });
            };

            var editable = (params.Contributors || {}).Editable === true;
            var contributors = _sort((params.Contributors || {}).Value || []);
            var nodeOwner = params.Owner || {};
            nodeOwner.Name = Base64.decode(nodeOwner.Name);
            
            var that = this;

            if (that.Options.HideContributors || (!editable && !contributors.length))
                return container.parentNode.removeChild(container);

            for (var i = 0, lnt = contributors.length; i < lnt; ++i) {
                contributors[i].FirstName = Base64.decode(contributors[i].FirstName);
                contributors[i].LastName = Base64.decode(contributors[i].LastName);
                contributors[i].UserName = Base64.decode(contributors[i].UserName);
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:0.5rem; font-weight:bold; text-align:center; color:green;",
                    Childs: [
                        { Type: "text", TextValue: RVDic.Contributors },
                        {
                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                            Style: "margin-" + RV_Float + ":0.5rem;" + (editable ? "" : "display:none;"),
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "ownerArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea", Style: "text-align:center;" }
            ], container);

            var itemsArea = elems["itemsArea"];
            var ownerArea = elems["ownerArea"];

            var _set_owner = function () {
                ownerArea.innerHTML = "";

                if (!(nodeOwner || {}).NodeID) return jQuery(ownerArea).fadeOut(0);
                else jQuery(ownerArea).fadeIn(0);

                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:0.3rem; text-align:center; font-size:0.7rem; font-weight:bold;",
                    Link: CNAPI.NodePageURL({ NodeID: nodeOwner.NodeID }),
                    Childs: [{ Type: "text", TextValue: nodeOwner.Name }]
                }], ownerArea);
            };

            _set_owner();

            var teamSelect = null;

            var _select_team = function () {
                if (teamSelect) {
                    teamSelect.show({
                        InitialUsers: contributors,
                        Owner: { NodeID: (nodeOwner || {}).NodeID, NodeName: (nodeOwner || {}).Name }
                    });
                }
                else {
                    teamSelect = new TeamSelect({
                        InitialUsers: contributors, Owner: { NodeID: (nodeOwner || {}).NodeID, NodeName: (nodeOwner || {}).Name } ,
                        Options: {
                            OnSelect: function (items, owner, done) {
                                items = _sort(items);

                                var collaborationShares = "";
                                for (var i = 0, lnt = items.length; i < lnt; ++i)
                                    collaborationShares += (collaborationShares == "" ? "" : "|") + items[i].UserID + ":" + items[i].Share;

                                CNAPI.SetContributors({
                                    NodeID: params.NodeID, Contributors: collaborationShares,
                                    OwnerID: (owner || {}).NodeID || "", ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                        else if (result.Succeed) {
                                            nodeOwner = ((owner || {}).NodeID || "") == "" ? null :
                                                { NodeID: (owner || {}).NodeID, Name: (owner || {}).NodeName };
                                            _set_owner();

                                            itemsArea.innerHTML = "";
                                            contributors = items;
                                            for (var i = 0, lnt = contributors.length; i < lnt; ++i)
                                                add_item(contributors[i]);
                                            done();
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }

            elems["editButton"].onclick = function () {
                if (!editable) return;
                GlobalUtilities.load_files(["TeamSelect/TeamSelect.js"], { OnLoad: _select_team });
            };

            var add_item = function (contrib) {
                var userId = contrib.UserID || "";
                var firstname = contrib.FirstName;
                var lastname = contrib.LastName;
                var username = RVGlobal.HideUserNames ? null : contrib.UserName;
                var profileImageUrl = contrib.ProfileImageURL;
                var share = +contrib.Share;
                if (isNaN(share)) share = 0;

                var fullname = GlobalUtilities.trim(firstname + " " + lastname);

                var shareTooltip = GlobalUtilities.convert_numbers_to_persian(String(share));

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter rv-bg-color-trans-soft",
                        Style: "display:inline-block; width:5.5rem; margin:0.2rem; padding:0.5rem; text-align:center;",
                        Childs: [
                            {
                                Type: "div", Style: "width:100%; text-align:center;",
                                Childs: [
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter", Style: "width:5rem; height:5rem;",
                                        Attributes: [{ Name: "src", Value: profileImageUrl }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Tooltip: "%" + shareTooltip,
                                Class: "rv-circle SoftBorder RevDirection RevTextAlign",
                                Style: "width:90%; margin:0.3rem auto 0rem auto; padding:0.1rem;",
                                Childs: [{
                                    Type: "div", Class: "rv-circle WarmBackgroundColor",
                                    Style: "padding:0.2rem 0rem; width:" + share + "%;"
                                }]
                            },
                            {
                                Type: "div", Style: "cursor:pointer; margin-top:0.3rem; font-size:0.6rem;",
                                Tooltip: firstname + " " + lastname + (username ? " - " + username : ""),
                                Link: UsersAPI.UserPageURL({ UserID: userId }),
                                Childs: [{ Type: "text", TextValue: GlobalUtilities.get_text_begining(fullname || username || RVDic.Unknown, 16, "...") }]
                            }
                        ]
                    }
                ], itemsArea);
            }

            for (var i = 0, lnt = contributors.length; i < lnt; ++i)
                add_item(contributors[i]);
        },

        set_attached_files: function (container, params) {
            params = params || {};
            var editable = (params.AttachedFiles || {}).Editable === true;
            var attachedFiles = (params.AttachedFiles || {}).Value || [];
            var that = this;
            
            if (!editable && !attachedFiles.length) return container.parentNode.removeChild(container);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "uploadArea", Tooltip: RVDic.UploadFile,
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder", 
                    Style: "padding:0.3rem; border-style:dashed; margin-bottom:0.5rem;" +
                        (editable && !params.DisableFileUpload ? "" : "display:none;")
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachedFiles" }
            ], container);
            
            var mediaManager = new MediaManager({
                ContainerDiv: elems["attachedFiles"],
                UnlimitedDownloadAccess: that.Objects.UnlimitedDownloadAccess,
                PDFCovers: params.PDFCovers || []
            });

            var _clarify = function (_attachedFile) {
                _attachedFile.FileName = Base64.decode(_attachedFile.FileName);
                _attachedFile.DownloadLink = DocsAPI.GetDownloadLink({ FileID: _attachedFile.FileID, Download: true });
                _attachedFile.ImageDownloadLink = DocsAPI.GetDownloadLink({ FileID: _attachedFile.FileID, Download: false });
                _attachedFile.Extension = Base64.decode(_attachedFile.Extension);
                return _attachedFile;
            };

            for (var i = 0, lnt = attachedFiles.length; i < lnt; ++i)
                attachedFiles[i] = _clarify(attachedFiles[i]);

            var mediaManagerParams = {
                Removable: editable, Acceptable: false,
                OnRemove: function (p) {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveAttachedFile, function (result) {
                        if (!result) return;
                        p = p || {};
                        var file = p.File || {};

                        DocsAPI.RemoveFile({
                            FileID: file.FileID, OwnerID: file.OwnerID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (p.ContainerDiv) p.ContainerDiv.parentNode.removeChild(p.ContainerDiv);
                            }
                        });
                    });
                },
                OnAccept: function () { }
            };

            mediaManager.add_items(attachedFiles, mediaManagerParams);

            var uploader = null;

            var _uploadParams = {
                UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: that.Objects.NodeID, OwnerType: "Node" }),
                Removable: editable,
                OnUpload: function (file, jsonResponse) {
                    var attachedFile = jsonResponse.AttachedFile;
                    if (attachedFile) mediaManager.add_item(_clarify(attachedFile), mediaManagerParams);
                    uploader.remove(file);
                },
                OnRemove: function (p) { }
            }

            if (editable && !params.DisableFileUpload)
                GlobalUtilities.uploader(elems["uploadArea"], _uploadParams, function (au) { uploader = au; });
        },

        show_experts_members: function (nodeObject, expertMode, isAdmin) {
            var that = this;
            
            var _divName = expertMode ? "__ExpertsDiv" : "__MembersDiv";
            if (that[_divName]) return GlobalUtilities.show(that[_divName]);

            var _div = that[_divName] = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "container"
            }])["container"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);
            
            GlobalUtilities.load_files(["Ontology/OntologyMembersManager.js"], {
                OnLoad: function () {
                    _div.innerHTML = "";

                    new OntologyMembersManager(_div, {
                        NodeID: that.Objects.NodeID,
                        Options: {
                            ExpertsMode: expertMode,
                            Editable: isAdmin === true,
                            ShowChildHierarchyMembers: !!nodeObject.IsTree && nodeObject.HasChild
                        }
                    });
                }
            });
        },

        has_confidentiality: function (params) {
            return (((params || {}).ConfidentialityLevel || {}).Value || {}).LevelID &&
                (params.ConfidentialityLevel.Value.LevelID > 1);
        },

        _init_wiki: function (container, params) {
            var that = this;
            
            params = params || {};
            
            if (that.__WikiInited) return;
            that.__WikiInited = true;

            GlobalUtilities.loading(container);
            
            GlobalUtilities.load_files(["Wiki/WikiManager.js"], {
                OnLoad: function () {
                    var wm = new WikiManager(container, {
                        OwnerID: that.Objects.NodeID, OwnerType: "Node",
                        HasWorkFlowEditPermission: params.HasWorkFlowEditPermission,
                        Downloadable: that.Objects.UnlimitedDownloadAccess,
                        HasConfidentiality: that.has_confidentiality(params),
                        Options: { PDFCovers: params.PDFCovers || [] }
                    });
                }
            });
        },

        _init_form: function (container, params) {
            params = params || {};
            var that = this;

            if (that.__FormInited) return;
            that.__FormInited = true;

            GlobalUtilities.loading(container);

            var _do = function (instanceId) {
                GlobalUtilities.load_files(["FormsManager/FormViewer.js", ], {
                    OnLoad: function () {
                        new FormViewer(container, {
                            InstanceID: instanceId, LimitOwnerID: params.NodeTypeID,
                            ShowAllIfNoLimit: true, Editable: params.Editable && !!instanceId,
                            ElementsEditable: true, HideDescription: true, FillButton: false,
                            Exportable: that.Objects.UnlimitedDownloadAccess && !!instanceId,
                            HasConfidentiality: that.has_confidentiality(params),
                            UnlimitedDownloadAccess: that.Objects.UnlimitedDownloadAccess,
                            PDFCovers: params.PDFCovers || [],
                            HasWorkFlowEditPermission: params.HasWorkFlowEditPermission,
                            CheckUniqueConstraints: true, CreatorUserID: (params.Creator || {}).UserID
                        });
                    }
                });
            };
            
            if ((params.FormInstance || {}).InstanceID) return _do(params.FormInstance.InstanceID);
            
            GlobalUtilities.load_files(["API/FGAPI.js", ], {
                OnLoad: function () {
                    FGAPI.InitializeOwnerFormInstance({
                        OwnerID: that.Objects.NodeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                container.innerHTML = "<div style='text-align:center; font-weight:bold;'>" +
                                    RVDic.MSG[result.ErrorText] || result.ErrorText + "</div>";
                                return;
                            }

                            _do(result.InstanceID);
                        }
                    });
                }
            });
        },

        _init_posts: function (container) {
            var that = this;

            if (that.__SharingInited) return;
            that.__SharingInited = true;

            GlobalUtilities.loading(container);
            
            GlobalUtilities.load_files(["SharingManager/SharingManager.js"], {
                OnLoad: function () {
                    new SharingManager({
                        PostsContainerDivID: container, OwnerObjectID: that.Objects.NodeID, InitialFill: true,
                        OwnerType: "Node", Permissions: { AddPost: true }, NewPostArea: "Advanced",
                        EnableImageUpload: true, HidePrivacyOptions: true,
                        RealTime: true, RealTimeFeedID: that.Objects.NodeID
                    });
                }
            });
        },

        /*
        _init_events: function (container) {
            var that = this;

            if (that.__EventsInited) return;
            that.__EventsInited = true;

            GlobalUtilities.loading(container);

            GlobalUtilities.load_calendar(function () {
                GlobalUtilities.load_files([
                    "AdvancedListViewer.css",
                    { Root: "AdvancedListViewer-v1/", Ext: "js", Childs: ["AdvancedListViewer", "ALV-GeneralFunctions"] },
                    "FullCalenderView/FullCalenderView.js",
                    "../../Node/JavaScripts/NodeCalender.js"
                ], {
                    OnLoad: function () {
                        container.innerHTML = null;

                        var elems = GlobalUtilities.create_nested_elements([
                            { Type: "div", Name: "outerCalenderContainer",
                                Childs: [
                                    { Type: "div", Class: "RevFloat", Style: "width:205px; margin-top:5px;", Name: "calboxContainer",
                                        Childs: [
                                            { Type: "div", Style: "margin-" + RV_RevFloat + ":2px;", Name: "calendarContainer",
                                                Childs: [{ Type: "div", Name: "nodeCalendar"}]
                                            },
                                            { Type: "div", Class: "SelectedDayEvents", Style: "width:188px; margin-top:5px;", Name: "events" }
                                        ]
                                    },
                                    { Type: "div", Class: "Float", Style: "width:660px;", Name: "fullCalendar" },
                                    { Type: "div", Style: "clear:both;" }
                                ]
                            }
                        ], container);

                        NodeCalender.initialize({ NodeID: that.Objects.NodeID,
                            OuterCalenderContainer: elems["outerCalenderContainer"],
                            CalboxContainer: elems["calboxContainer"],
                            CalendarContainer: elems["calendarContainer"],
                            NodeCalendar: elems["nodeCalendar"],
                            EventsContainer: elems["events"]
                        });

                        FullCalenderView.initialize({ ContainerDiv: elems["fullCalendar"], NodeID: that.Objects.NodeID });
                    }
                });
            });
        },
        */

        _tree_view: function (params) {
            params = params || {};
            var that = this;

            var nodeTypeId = params.NodeTypeID || "";
            var nodeId = params.NodeID || "";

            if (that.__TreeViewDiv) return GlobalUtilities.show(that.__TreeViewDiv);

            var _div = that.__TreeViewDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            GlobalUtilities.load_files([
                "jQuery/jsTree/jquery.jstree.js",
                "TreeViewContainer/TreeViewContainer.js",
                "TreeNodeViewer/TreeNodeViewer.js"
            ], {
                LoadSequential: true,
                OnLoad: function () {
                    var tnv = new TreeNodeViewer(_div, {
                        NodeTypeID: nodeTypeId, NodeID: nodeId, Width: 480, Checkbox: false,
                        OnNodeSelect: function (p) {
                            var _nodePageUrl = CNAPI.NodePageURL({ NodeID: p.ID });
                            GlobalUtilities.link_click(p.Event || {}, _nodePageUrl);
                        }
                    });
                }
            });
        },

        show_related_nodes: function (mainContainer, itemsContainer, params) {
            var that = this;
            params = params || {};
            
            var hide = (params.Relations || {}).Hide;
            
            if (hide) return jQuery(mainContainer).remove();
            
            GlobalUtilities.load_files(["CN/RelatedNodesViewer.js"], {
                OnLoad: function () {
                    new RelatedNodesViewer(itemsContainer, {
                        ObjectID: that.Objects.NodeID,
                        Editable: params.Editable && !params.DisableRelatedNodesSelect,
                        OnInit: function () { jQuery(mainContainer).fadeIn(500);},
                        OnNothingToDisplay: function () { jQuery(mainContainer).remove() }
                    }, params);
                }
            });
        },

        set_feedbacks: function (container, params) {
            params = params || {};
            var that = this;

            var _objects = {};

            var _init_new = function (valueArea, button, type, onChange) {
                if (_objects[type]) return GlobalUtilities.show(_objects[type]);

                var _div = _objects[type] = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["KW/KnowledgeFeedback.js"], {
                    OnLoad: function () {
                        new KnowledgeFeedback(_div, { KnowledgeID: that.Objects.NodeID, Type: type,
                            TotalValue: type == "Financial" ? params.TotalFinancialFeedbacks : params.TotalTemporalFeedbacks,
                            OnTotalChange: onChange
                        });
                    }
                });
            }

            var _add = function (type, iconName, value) {
                var totalValue = value;
                var valuePostfix = RVDic.KW[type == "Financial" ? "CurrencyUnit" : "TimeUnit"];
                var tooltip = RVDic.KW[type == "Financial" ? "FinancialFeedbacks" : "TemporalFeedbacks"];

                var _set_value = function (addedValue) {
                    totalValue += addedValue ? addedValue : 0;
                    elems["value"].innerHTML = GlobalUtilities.convert_numbers_to_persian(totalValue + " " + valuePostfix);
                }

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-half SoftShadow TextAlign Direction",
                        Style: "display:inline-block; padding:0.3rem; padding-bottom:0rem;" +
                            "position:relative; padding-" + RV_Float + ":1.2rem; margin-" + RV_RevFloat + ":1rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":-0.6rem;",
                                Childs: [
                                    {
                                        Type: "middle",
                                        Childs: [
                                            {
                                                Type: "img", Name: "button", Tooltip: tooltip,
                                                Style: "width:1.3rem; height:1.3rem; cursor:pointer;",
                                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon(iconName) }],
                                                Properties: [{ Name: "onclick", Value: function () { _init_new(elems["value"], elems["button"], type, _set_value); } }]
                                            }
                                        ]
                                    }
                                ]
                            },
                            { Type: "div", Name: "value" }
                        ]
                    }
                ], container);

                _set_value();
            }

            _add("Temporal", "AddEconomyValue.png", params.TotalTemporalFeedbacks);
            _add("Financial", "money.png", params.TotalFinancialFeedbacks);
        },

        _initialize_workflow: function () {
            var that = this;

            var actionDiv = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                Style: "position:fixed; bottom:0.6rem; left:0rem; right:0rem; margin:0rem;",
                Childs: [{
                    Type: "div", Name: "actionDiv",
                    Class: "small-10 medium-8 large-6 rv-border-radius-quarter WarmBorder SoftBackgroundColor",
                    Style: "padding:0.3rem; text-align:center; border-width:0.3rem;" +
                        "font-weight:bold; cursor:pointer; color:gray;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                        { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                        { Name: "onclick", Value: function () { _show(); } }
                    ]
                }]
            }], document.body)["actionDiv"];

            actionDiv.innerHTML = "<span style='color:black; margin:0rem 0.3rem;'>" + RVDic.WorkFlow + ":" +
                "</span><span style='margin:0rem 0.3rem;'>" + RVDic.ClickForAction + "</span>";

            var _show = function () {
                var _divName = "__QuestionsDiv";
                if (actionDiv[_divName]) return GlobalUtilities.show(actionDiv[_divName]);

                var _div = actionDiv[_divName] = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }])["_div"];

                GlobalUtilities.loading(_div);
                var showed = GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["WorkFlowManager/WorkFlowViewer.js"], {
                    OnLoad: function () {
                        var wfv = new WorkFlowViewer(_div, {
                            OwnerID: that.Objects.NodeID,
                            OnInit: function () { wfv.show(); },
                            OnEnd: function () {
                                showed.Close();
                                jQuery(actionDiv).fadeOut(500);
                            }
                        });
                    }
                });
            }
        },

        _initialize_knowledge_options: function (params) {
            params = params || {};
            var that = this;

            var _inWorkflow = function () {
                return !(params.Status == "Rejected" || params.Status == "Accepted");
                //!(params.Status == "Personal" || params.Status == "SentBackForRevision" || params.Status == "Rejected" || params.Status == "Accepted" || !params.Status);
            };

            var actionDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                    Style: "position:fixed; bottom:0.6rem; left:0rem; right:0rem; margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Name: "actionDiv",
                            Class: "small-10 medium-8 large-6 rv-border-radius-quarter WarmBorder SoftBackgroundColor", 
                            Style: "padding:0.3rem; text-align:center; border-width:0.3rem;" +
                                "font-weight:bold; cursor:pointer; color:gray;",
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                { Name: "onclick", Value: function () { _show(); } }
                            ]
                        }
                    ]
                }
            ], document.body)["actionDiv"];
            
            actionDiv.innerHTML = "<span style='color:black; margin:0rem 0.3rem;'>" + RVDic.KnowledgeWorkFlow + ":" +
                "</span><span style='margin:0rem 0.3rem;'>" +
                (!_inWorkflow() && !params.KWFActionExists ? RVDic.ClickToViewHistory : RVDic.ClickForAction) + "</span>";

            var _show = function () {
                var _divName = "__QuestionsDiv";
                if (actionDiv[_divName]) return GlobalUtilities.show(actionDiv[_divName]);

                var _div = actionDiv[_divName] = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor", 
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                var showedDiv = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);

                GlobalUtilities.load_files(["KW/KnowledgeWorkFlow.js"], {
                    OnLoad: function () {
                        _div.innerHTML = "";
                        var wfv = new KnowledgeWorkFlow(_div, GlobalUtilities.extend({
                            NodeName: (params.Name || {}).Value,
                            Close: function () { showedDiv.Close(); },
                            OnStatusChange: function (d) {
                                params.Status = d.Status;
                                that.set_status();
                            }
                        }, params));
                    }
                });
            }
        },

        show_document_trees: function (params) {
            params = params || {};
            var that = this;

            if (that.__DocTreesInited) {
                if (that.__DocTreesObj) that.__DocTreesObj.show();
                return;
            }

            that.__DocTreesInited = true;

            GlobalUtilities.load_files(["DCT/OwnerDocs.js"], {
                OnLoad: function () {
                    that.__DocTreesObj = new OwnerDocs({
                        OwnerID: params.NodeID,
                        Editable: params.IsAreaAdmin || params.IsServiceAdmin || params.IsSystemAdmin
                    });
                }
            });
        },

        show_related_questions: function (container, itemsContainer) {
            var that = this;

            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js", "API/QAAPI.js", "QA/QuestionMini.js"], {
                OnLoad: () => that._show_related_questions(container, itemsContainer)
            });
        },

        _show_related_questions: function (container, itemsContainer) {
            var that = this;

            new NewSimpleListViewer(itemsContainer, {
                AutoGrow: false,
                Options: {
                    InnerWidthOffset: 0, Width: null,
                    OnDataRequest: function (options, done, setTotalCount) {
                        QAAPI.GetQuestions(GlobalUtilities.extend(options || {}, {
                            NodeID: that.Objects.NodeID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.TotalCount) jQuery(container).fadeIn(500);
                                setTotalCount(result.TotalCount);
                                done((result || {}).Questions || []);
                            }
                        }));
                    },
                    OnNothingFound: function () {
                    },
                    ItemBuilder: function (container, item, params) {
                        new QuestionMini(container, item, { HideSender: true });
                        params.OnAfterAdd();
                    }
                }
            });
        }
    }
})();