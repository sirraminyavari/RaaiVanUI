(function () {
    if (window.QATags) return;

    window.QATags = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            Tags: null,
            MoreButton: null,
            EditButton: null,
            SearchArea: null
        };

        this.Objects = {
            QuestionID: params.QuestionID,
            TotalCount: 0,
            LowerBoundary: 0,
            Input: null,
            SearchText: "",
            NewButton: null
        };

        this.Options = {
            Title: params.Title,
            Editable: !!params.Editable,
            AjaxLoading: true,
            Count: params.Count || 100,
            Mini: !!params.Mini,
            HideSearchInput: !!params.HideSearchInput,
            OnSelect: params.OnSelect
        };

        var that = this;

        GlobalUtilities.load_files(["API/QAAPI.js"], { OnLoad: function () { that.preinit(params); } });
    }

    QATags.prototype = {
        preinit: function (params) {
            params = params || {};
            var that = this;

            if (GlobalUtilities.get_type(params.Tags) == "array") {
                that.Options.AjaxLoading = false;
                that.initialize(params);
            }
            else {
                that.Options.AjaxLoading = true;
                
                that.get_tags(function (result) {
                    params.Tags = (result || {}).Nodes || [];
                    that.initialize(params);
                });
            }
        },

        getting_tags: function (value) {
            var that = this;
            if ((value === true) || (value === false)) that.__GettingTags = value;
            return !!that.__GettingTags;
        },

        get_tags: function (callback) {
            var that = this;
            
            if (that.getting_tags()) return;
            that.getting_tags(true);
            
            var searchText = !that.Objects.Input ? "" : GlobalUtilities.trim(that.Objects.Input.value);

            if (searchText != that.Objects.SearchText) that.Objects.TotalCount = that.Objects.LowerBoundary = 0;
            that.Objects.SearchText = searchText;

            if (isNaN(that.Objects.LowerBoundary) || (that.Objects.LowerBoundary < 1))
                that.Objects.LowerBoundary = 1;
            
            var isNew = false;

            if (that.Objects.LowerBoundary <= 1) {
                isNew = true;

                if (that.Interface.MoreButton) jQuery(that.Interface.MoreButton).fadeOut(0);
                if (that.Interface.Tags) {
                    that.Interface.Tags.innerHTML = "";
                    GlobalUtilities.loading(that.Interface.Tags);
                }
            }

            QAAPI[that.Objects.QuestionID ? "GetRelatedTags" : "GroupQuestionsByRelatedNodes"]({
                QuestionID: that.Objects.QuestionID, SearchText: Base64.encode(searchText),
                Count: that.Options.Count, LowerBoundary: that.Objects.LowerBoundary, ParseResults: true,
                ResponseHandler: function (result) {
                    that.Objects.TotalCount = +(result || {}).TotalCount;
                    if (isNaN(that.Objects.TotalCount)) that.Objects.TotalCount = 0;
                    that.Objects.LowerBoundary += ((result || {}).Nodes || []).length;
                    
                    if (isNew && that.Interface.Tags) that.Interface.Tags.innerHTML = "";

                    callback(result);

                    that.getting_tags(false);
                }
            });
        },

        initialize: function (params) {
            params = params || {};
            var that = this;

            that.Container.innerHTML = "";

            var hideSearch = that.Options.HideSearchInput || !that.Options.AjaxLoading;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; text-align:center; margin-bottom:1rem;" +
                                (that.Options.Title ? "" : "display:none;"),
                            Childs: [{ Type: "text", TextValue: that.Options.Title }]
                        },
                        {
                            Type: "div", Class: "small-10 medium-8 large-6", 
                            Childs: hideSearch ? null : [
                                {
                                    Type: "input", Class: "rv-input", InnerTitle: RVDic.Search,
                                    Style: "width:100%; margin-bottom:2rem; display:none;", Name: "searchInput",
                                    Attributes: [{ Name: "type", Value: "text" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 RevTextAlign", Style: "padding:0rem 0.5rem;",
                            Childs: hideSearch ? null : [
                                {
                                    Type: "i", Class: "fa fa-search fa-2x rv-icon-button", Style: "margin-bottom:0.2rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                var btn = this;
                                                jQuery(btn).fadeOut(500, function () {
                                                    jQuery(btn.parentNode).remove();
                                                    jQuery(elems["searchInput"]).fadeIn(500, function () { this.focus(); });
                                                });
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "tags" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "searchArea" },
                        {
                            Type: "div", Name: "moreButton",
                            Class: "small-10 medium-10 large-10 rv-air-button rv-circle SoftBorder",
                            Style: "margin:1rem auto 0rem auto; text-align:center; border-color:rgb(80,80,80);" +
                                "display:none;" + (that.Options.Mini ? "padding:0.2rem 0rem;" : "padding:0.5rem 0rem;"),
                            Childs: [{ Type: "text", TextValue: RVDic.More }]
                        }
                    ]
                }
            ], that.Container);

            that.Objects.Input = elems["searchInput"];
            that.Interface.Tags = elems["tags"];
            that.Interface.MoreButton = elems["moreButton"];
            that.Interface.SearchArea = elems["searchArea"];

            var set_more_button_visibility = function () {
                var isVisible = that.Options.AjaxLoading && (that.Objects.TotalCount >= that.Objects.LowerBoundary);
                jQuery(elems["moreButton"])[isVisible ? "fadeIn" : "fadeOut"](500);
            }

            set_more_button_visibility();

            that.add_tags(params.Tags || []);

            var loading = false;

            elems["moreButton"].onclick = function () {
                if (that.getting_tags()) return;

                elems["moreButton"].innerHTML = "";
                GlobalUtilities.loading(elems["moreButton"]);
                
                that.get_tags(function (result) {
                    elems["moreButton"].innerHTML = RVDic.More;

                    that.add_tags((result || {}).Nodes || []);
                    set_more_button_visibility();
                });
            }

            if (that.Objects.Input) {
                GlobalUtilities.set_onchangeorenter(that.Objects.Input, function () {
                    that.Objects.LowerBoundary = 0;

                    that.get_tags(function (result) {
                        that.add_tags((result || {}).Nodes || []);
                        set_more_button_visibility();
                    });
                });
            }
        },

        empty_response: function () {
            var that = this;

            that.Interface.Tags.innerHTML = "<div style='font-weight:bold; text-align:center;'>" +
                RVDic.NothingToDisplay + "</div>";
        },

        select_tags: function (params, done) {
            var that = this;

            var nodeSelect = null;
            var initialNodes = params.InitialNodes || [];

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }
            ]);

            GlobalUtilities.loading(elems["container"]);
            var showedDiv = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                OnLoad: function () {
                    nodeSelect = new NodeSelect(elems["container"], {
                        Options: {
                            Title: RVDic.PleaseSelectRelatedNodes,
                            NodeTypeSearchBox: true,
                            Filters: true,
                            ShowBottomBar: true,
                            OnConfirm: function () {
                                var _selectedNodes = nodeSelect.get_items({ Check: true });
                                showedDiv.Close();
                                if (done) done(_selectedNodes);
                            },
                            OnCancel: function () { showedDiv.Close(); }
                        }
                    });

                    for (var i = 0, lnt = initialNodes.length; i < lnt; ++i) {
                        nodeSelect.add_item({
                            NodeID: initialNodes[i].NodeID,
                            Name: Base64.decode(initialNodes[i].Name),
                            NodeType: Base64.decode(initialNodes[i].NodeType)
                        }, true);
                    }
                }
            });
        },

        edit_button: function () {
            var that = this;

            if (!that.Options.Editable) return;

            var container = that.Interface.Tags;
            if (that.Interface.EditButton) jQuery(that.Interface.EditButton).remove();

            var hasTag = !!container.firstChild;

            var editTitle = RVDic.AddN.replace("[n]", RVDic.RelatedNodes);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "rv-air-button", Name: "button",
                            Style: "display:inline-block;" + (!that.Options.Mini ? "" : "font-size:0.7rem;") +
                                GlobalUtilities.border_radius("0.2rem"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-edit fa-lg",
                                    Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: editTitle }
                            ]
                        },
                        {
                            Type: "div", Class: "small-10 medium-8 large-6", Name: "searchArea",
                            Style: "position:relative; display:none; padding-" + RV_RevFloat + ":6rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-air-button", Name: "advancedEditButton",
                                    Style: "position:absolute; top:0.6rem;" + RV_RevFloat + ":0rem; width:5.5rem;" +
                                        "text-align:center;" + GlobalUtilities.border_radius("0.2rem"),
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-edit fa-lg",
                                            Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.Edit }
                                    ]
                                },
                                {
                                    Type: "input", Class: "rv-input", Name: "searchInput",
                                    Style: "margin:0.5rem 0rem; width:100%;", InnerTitle: RVDic.Title,
                                    Attributes: [{ Name: "type", Value: "text" }]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            that.Interface.EditButton = elems["container"];

            var editButton = elems["button"];
            var searchArea = elems["searchArea"];
            var searchInput = elems["searchInput"];
            var btn = elems["advancedEditButton"];

            var set_css = function (buttonMode) {
                var _class = buttonMode ? "" : "small-12 medium-12 large-12 row align-center";
                var _style = !buttonMode ? "margin:0rem;" :
                    "display:inline-block;" + (!container.firstChild ? "" : "margin:0.2rem;");

                that.Interface.EditButton.setAttribute("class", _class);
                that.Interface.EditButton.setAttribute("style", _style);
            };

            set_css(true);

            editButton.onclick = function () {
                jQuery(editButton).fadeOut(500, function () {
                    set_css(false);

                    jQuery(searchArea).fadeIn(500, function () { jQuery(searchInput).focus(); });
                });
            };

            GlobalUtilities.set_onchange(searchInput, function () {
                that.Interface.SearchArea.innerHTML = "";

                GlobalUtilities.loading(that.Interface.SearchArea);

                QAAPI.SearchNodes({
                    SearchText: Base64.encode(GlobalUtilities.trim(searchInput.value)),
                    Count: 20, ParseResults: true,
                    ResponseHandler: function (result) {
                        that.Interface.SearchArea.innerHTML = "";

                        for (var i = 0, lnt = ((result || {}).Tags || []).length; i < lnt; ++i)
                            that.add_tag(result.Tags[i], { IsSearchResult: true });
                    }
                });
            });

            var addingTag = false;

            GlobalUtilities.set_onenter(searchInput, function () {
                if (addingTag) return;
                addingTag = true;

                var tagValue = GlobalUtilities.trim(searchInput.value);
                if (!tagValue) return;

                QAAPI.AddQuestionTag({
                    QuestionID: that.Objects.QuestionID, Tag: Base64.encode(tagValue),
                    IsNewQuestion: !that.Objects.QuestionID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        
                        var tags = (result || {}).Tags || [];

                        if (result.Succeed && (tags.length == 1)) {
                            that.add_tag(tags[0], { InlineInsert: true });

                            searchInput.value = "";
                            jQuery(searchInput).focus();
                        }
                        else if (tags.length > 1) {
                            var _div = GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                                }
                            ])["_div"];

                            var showed = GlobalUtilities.show(_div);

                            for (var i = 0, lnt = tags.length; i < lnt; ++i) {
                                that.add_tag(tags[i], {
                                    Container: _div, ShowNodeType: true, Temp: true, IsSearchResult: true,
                                    OnAdd: function () {
                                        showed.Close();

                                        searchInput.value = "";
                                        jQuery(searchInput).focus();
                                    }
                                });
                            }
                        }

                        addingTag = false;
                    }
                });
            });

            btn.onclick = function () {
                var tags = [], firstChild = container.firstChild;

                while (firstChild) {
                    if ((firstChild.TagInfo || {}).Tag && !firstChild.TagInfo.IsTemporary())
                        tags.push(firstChild.TagInfo.Tag);
                    firstChild = firstChild.nextSibling;
                }

                that.select_tags({ InitialNodes: tags }, function (nds) {
                    var nodeIds = [];
                    for (var i = 0, lnt = (nds || []).length; i < lnt; ++i)
                        nodeIds.push(nds[i].NodeID);

                    QAAPI[that.Objects.QuestionID ? "SaveRelatedNodes" : "CheckNodes"]({
                        QuestionID: that.Objects.QuestionID, NodeIDs: nodeIds.join("|"),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed || result.Tags) {
                                jQuery(container).animate({ height: "toggle" }, 500, function () {
                                    container.innerHTML = "";
                                    that.add_tags(result.Tags);
                                    jQuery(container).fadeIn(500);
                                });
                            }
                        }
                    });
                });
            };
        },

        add_tags: function (tags) {
            var that = this;

            if ((tags.length == 0) && !that.Options.Editable) return that.empty_response();

            for (var i = 0, lnt = tags.length; i < lnt; ++i)
                that.add_tag(tags[i]);

            if (that.Options.Editable) that.edit_button();
        },

        add_tag: function (tag, params) {
            tag = tag || {};
            params = params || {};
            var that = this;

            var isSearchResult = !!params.IsSearchResult;
            var isTemporary = (params.Temp === true) || isSearchResult;
            var inlineInsert = !!params.InlineInsert;

            var showNodeType = !!params.ShowNodeType;

            var container = params.Container || (isSearchResult ? that.Interface.SearchArea : that.Interface.Tags);

            var firstChild = container.firstChild;
            while (firstChild) {
                if (((firstChild.TagInfo || {}).Tag || {}).NodeID == tag.NodeID) return;
                firstChild = firstChild.nextSibling;
            }

            var generatedColors = GlobalUtilities.generate_color(tag.NodeID);
            var colors = !isTemporary ? generatedColors :
                { Color: "rgb(255,255,255)", Hover: "rgb(200,200,200)", Dark: "rgb(150,150,150)" };
            var url = QAAPI.TagPageURL({ TagID: tag.NodeID });
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "SoftBorder", Name: "container",
                    Style: "position:relative; display:inline-block; cursor:pointer; margin:0.2rem;" +
                        "background-color:" + colors.Color + ";" + GlobalUtilities.border_radius("0.2rem") + 
                        "border-color:" + colors.Dark + "; color:rgb(80,80,80);" +
                        (!that.Options.Mini ? "padding:0.2rem 0.5rem;" : "font-size:0.7rem; padding:0.2rem 0.3rem;"),
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.backgroundColor = colors.Hover; this.style.color = "rgb(0,0,0)"; } },
                        { Name: "onmouseout", Value: function () { this.style.backgroundColor = colors.Color; this.style.color = "rgb(80,80,80)"; } }
                    ],
                    Childs: [
                        {
                            Type: "div", Class: "rv-circle rv-icon-button", Name: "removeButton",
                            Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; color:red;" +
                                "font-weight:bold; background-color:white; padding:0rem 0.2rem;" + 
                                (that.Options.Editable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(tag.Name) }]
                        },
                        {
                            Type: "div",
                            Style: "color:gray; margin-" + RV_Float + ":0.3rem;" +
                                "display:" + (showNodeType ? "inline-block" : "none") + ";",
                            Childs: [{ Type: "text", TextValue: "(" + Base64.decode(tag.NodeType) + ")" }]
                        },
                        {
                            Type: "div", Class: "rv-circle",
                            Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; color:red;" +
                                "font-weight:bold; background-color:white; padding:0rem 0.5rem;",
                            Childs: [{ Type: "text", TextValue: tag.Count || "0" }]
                        }
                    ]
                }
            ]);

            var tagContainer = elems["container"];

            if (inlineInsert) jQuery(tagContainer).css({ opacity: 0 });

            if (that.Interface.EditButton && (that.Interface.EditButton.parentNode == container))
                container.insertBefore(tagContainer, that.Interface.EditButton);
            else container.appendChild(tagContainer);

            if (inlineInsert) jQuery(tagContainer).animate({ opacity: 1 }, 500);

            var tagInfo = { Tag: tag, IsTemporary: function () { return isTemporary; } };

            tagContainer.TagInfo = tagInfo;

            var adding = false;

            tagContainer.onclick = function (e) {
                if (isSearchResult) {
                    if (!that.Objects.QuestionID) {
                        jQuery(tagContainer).fadeOut(500, function () {
                            that.add_tag(tag, { InlineInsert: true });
                        });

                        if (params.OnAdd) params.OnAdd(tag);

                        return;
                    }

                    if (adding) return;
                    adding = true;

                    return QAAPI.AddRelatedNodes({
                        QuestionID: that.Objects.QuestionID, NodeIDs: tag.NodeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                jQuery(tagContainer).fadeOut(500, function () {
                                    that.add_tag(tag, { InlineInsert: true });
                                });

                                if (params.OnAdd) params.OnAdd(tag);
                            }

                            adding = false;
                        }
                    });
                }
                else if (isTemporary) {
                    colors = generatedColors;
                    tagContainer.style.backgroundColor = colors.Hover;
                    tagContainer.style.borderColor = colors.Dark;
                    isTemporary = false;
                }
                else if (!that.Options.OnSelect) GlobalUtilities.link_click(e, url);
                
                if (that.Options.OnSelect) {
                    that.Options.OnSelect({
                        NodeID: tag.NodeID,
                        Name: Base64.decode(tag.Name),
                        NodeType: Base64.decode(tag.NodeType),
                        Count: tag.Count
                    });
                }
            }

            if (!isSearchResult && !inlineInsert) that.edit_button();

            var removing = false;

            elems["removeButton"].onclick = function (e) {
                e.stopPropagation();

                if (!that.Objects.QuestionID)
                    return jQuery(tagContainer).fadeOut(500, function () { this.remove(); });

                if (removing) return;

                GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Tag), function (r) {
                    if (!r) return;
                    removing = true;

                    QAAPI.RemoveRelatedNodes({
                        QuestionID: that.Objects.QuestionID, NodeIDs: tag.NodeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed)
                                jQuery(tagContainer).fadeOut(500, function () { this.remove(); });

                            removing = false;
                        }
                    });
                });
            };

            return tagInfo;
        },

        remove_temporary: function () {
            var that = this;

            var firstChild = that.Interface.Tags.firstChild;
            while(firstChild){
                var nextChild = firstChild.nextSibling;
                if ((firstChild.TagInfo || {}).IsTemporary && firstChild.TagInfo.IsTemporary())
                    jQuery(firstChild).remove();
                firstChild = nextChild;
            }

            that.edit_button();
        },

        clear: function () {
            var that = this;
            that.Interface.Tags.innerHTML = "";
            that.edit_button();
        },

        get_selected_tags: function () {
            var that = this;

            var tags = [];

            var firstChild = that.Interface.Tags.firstChild;
            while (firstChild) {
                var nextChild = firstChild.nextSibling;
                if (firstChild.TagInfo && (!(firstChild.TagInfo || {}).IsTemporary || !firstChild.TagInfo.IsTemporary()))
                    tags.push(firstChild.TagInfo.Tag);
                firstChild = nextChild;
            }

            return tags;
        }
    }
})();