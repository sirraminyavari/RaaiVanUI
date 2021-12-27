(function () {
    if (window.WikiManager) return;

    window.WikiManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            IndexTitlesArea: null,
            TitlesArea: null,
            TitlesSortButton: null,
            PDFButton: null,
            ParagraphsSortButton: null,
            NoTitleButton: null
        };

        this.Objects = {
            OwnerID: params.OwnerID || "",
            OwnerType: params.OwnerType || "",
            HasWorkFlowEditPermission: params.HasWorkFlowEditPermission,
            Downloadable: params.Downloadable,
            HasConfidentiality: params.HasConfidentiality,
            Titles: [],
            Paragraphs: [],
            IndexTitles: [],
            TitleAdder: null,
            WikiAttachedFiles: []
        };

        this.Options = GlobalUtilities.extend({
            IsAdmin: false,
            ParagraphInnerTitle: RVDic.Title + "...",
            Editable: null,
            History: true,
            AutoScroll: true,
            PDFCovers: []
        }, params.Options || {});

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["WikiAPI", "DocsAPI"] },
            "MediaManager/MediaManager.js", "Public/NameDialog.js"
        ], { OnLoad: function () { that._preinit(); } });
    }

    WikiManager.prototype = {
        _preinit: function () {
            var that = this;

            WikiAPI.GetWiki({
                OwnerID: that.Objects.OwnerID, OwnerType: that.Objects.OwnerType, ParseResults: true,
                ResponseHandler: function (result) {
                    var titles = result.Titles;
                    
                    that.Options.IsAdmin = result.IsAdmin === true;
                    that.Options.Editable = result.Editable === true;

                    that.Objects.WikiAttachedFiles = result.Files;

                    for (var i = 0, lnt = (titles || []).length; i < lnt; ++i)
                        titles[i] = that._decode_title(titles[i]);

                    if (that._initialize(result) === false) return;

                    that.add_titles(titles);

                    that.set_no_title_button();

                    if (titles.length == 0 && that.Objects.TitleAdder) that.Objects.TitleAdder.show();

                    setTimeout(function () {
                        if (jQuery(that.ContainerDiv).find('pre code').length > 0) {
                            GlobalUtilities.load_files(
                                ["jQuery/highlight/highlight.pack.js"],
                                { OnLoad: function () { jQuery(that.ContainerDiv).find('pre code').each(function (i, block) { hljs.highlightBlock(block); }); } }
                            );
                        }
                    }, 2000);
                }
            });
        },

        _decode_change: function (change) {
            change.Title = Base64.decode(change.Title);
            change.BodyText = Base64.decode(change.BodyText);
            return change;
        },

        _decode_paragraph: function (paragraph) {
            paragraph.Title = Base64.decode(paragraph.Title);
            paragraph.BodyText = Base64.decode(paragraph.BodyText);
            for (var i = 0, lnt = (paragraph.Changes || []).length; i < lnt; ++i)
                paragraph.Changes[i] = this._decode_change(paragraph.Changes[i]);
            return paragraph;
        },

        _decode_title: function (title) {
            title.Title = Base64.decode(title.Title);
            for (var i = 0, lnt = (title.Paragraphs || []).length; i < lnt; ++i)
                title.Paragraphs[i] = this._decode_paragraph(title.Paragraphs[i]);
            return title;
        },

        _initialize: function (wiki) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            if (!that.Options.Editable && !that.Options.IsAdmin) {
                var hasParagraph = false;

                jQuery.each((wiki || {}).Titles || [], function (ind, val) {
                    if (((val || {}).Paragraphs || []).length) hasParagraph = true;
                });

                if (!hasParagraph) return false;
            }

            //disable text highlight and context menu for wiki
            var _do_disable = function (div) {
                div.setAttribute("style", "-webkit-user-select: none; -moz-user-select: -moz-none; -ms-user-select: none; user-select: none;");
                div.oncontextmenu = function () { return false; };
            };
            //end of disable text highlight and context menu for wiki

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "indexArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "titlesArea" }
            ], that.ContainerDiv);

            if (!that.Objects.Downloadable) {
                _do_disable(elems["indexArea"]);
                _do_disable(elems["titlesArea"]);
            }

            that.Interface.TitlesArea = elems["titlesArea"];

            that._initialize_index_area(elems["indexArea"], wiki);
        },

        get_titles_count: function () {
            var that = this;
            var cnt = 0;
            for (var i in that.Objects.IndexTitles) if (that.Objects.IndexTitles[i])++cnt;
            return cnt;
        },

        get_paragraphs_count: function (titleId) {
            var that = this;
            var cnt = 0;
            for (var i in ((that.Objects.Titles[titleId] || {}).Paragraphs || {}))
                if (that.Objects.Titles[titleId].Paragraphs[i])++cnt;
            return cnt;
        },

        is_admin: function () {
            return !!(((this.Interface.IndexTitlesArea || {}).firstChild || {}).TitleObject || {}).Removable;
        },

        set_titles_sort_button_visibility: function () {
            if (this.Interface.TitlesSortButton && this.Options.Editable)
                this.Interface.TitlesSortButton.style.display = this.get_titles_count() <= 1 || !this.is_admin() ? "none" : "block";

            if (this.Interface.PDFButton) this.Interface.PDFButton.style.display =
                (this.get_titles_count() <= 0) || !this.Objects.Downloadable ? "none" : "block";
        },

        set_paragraphs_sort_button_visibility: function (titleId) {
            var editable = ((this.Objects.Titles[titleId] || {}).TitleObject || {}).Removable;
            if ((this.Interface.ParagraphsSortButton || {})[titleId])
                this.Interface.ParagraphsSortButton[titleId].style.display = this.get_paragraphs_count(titleId) <= 1 || !editable ? "none" : "block";
        },

        set_no_title_button: function () {
            var that = this;

            if (that.Interface.IndexTitlesArea.firstChild) {
                that.Interface.NoTitleButton.innerHTML = "";
                return;
            }
            else if (that.Interface.NoTitleButton.firstChild) return;

            if (!that.Options.Editable) return;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; color:gray; cursor:pointer; padding:1rem 0rem;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                        { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                        {
                            Name: "onclick",
                            Value: function () { that._create_new_index_title_area(null, true); }
                        }
                    ],
                    Childs: [{ Type: "text", TextValue: RVDic.ClickToAddTitle }]
                }
            ], that.Interface.NoTitleButton);
        },

        set_no_paragraph_button: function (titleId) {
            var that = this;

            if (!that.Options.Editable) return;

            var pArea = that.Objects.Titles[titleId].ParagraphsArea;
            var noPBtn = that.Objects.Titles[titleId].NoParagraphButton;

            if (pArea.firstChild) {
                noPBtn.innerHTML = "";
                return;
            }
            else if (noPBtn.firstChild) return;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; color:gray; cursor:pointer; padding:1rem 0rem;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                        { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                        {
                            Name: "onclick",
                            Value: function () { that._initialize_new_paragraph_area({ TitleID: titleId, ContainerDiv: pArea }); }
                        }
                    ],
                    Childs: [{ Type: "text", TextValue: RVDic.ClickToAddParagraph }]
                }
            ], noPBtn);
        },

        check_existing_files: function (tags) {
            for (var i = 0, lnt = (tags || []).length; i < lnt; ++i)
                this.Objects.WikiAttachedFiles[tags[i].id] = true;
        },

        add_uploaded_file: function (file) {
            this.Objects.WikiAttachedFiles.push(file);
        },

        remove_uploaded_file: function (file) {
            var arr = [];
            for (var i = 0, lnt = (this.Objects.WikiAttachedFiles || []).length; i < lnt; ++i) {
                if (file.FileID != this.Objects.WikiAttachedFiles[i].FileID) {
                    arr.push(this.Objects.WikiAttachedFiles[i]);
                    arr[this.Objects.WikiAttachedFiles[i].FileID] =
                        this.Objects.WikiAttachedFiles[this.Objects.WikiAttachedFiles[i].FileID];
                }
            }
            this.Objects.WikiAttachedFiles = arr;
        },

        _initialize_index_area: function (container, wiki) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-7 large-5 rv-border-radius-quarter SoftBorder",
                    Style: "border-color:Black; padding:0.3rem; margin:0rem auto 0.8rem auto; position:relative;",
                    Childs: [
                        {
                            Type: "div", Class: "RevDirection RevTextAlign",
                            Style: "position:absolute; top:0.3rem; " + window.RV_RevFloat + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Properties: [{ Name: "onclick", Value: function () { that.sort_dialog(true); } }],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-sort fa-2x rv-icon-button",
                                            Style: "display:none; margin:0rem 0.3rem;",
                                            Tooltip: RVDic.SortTitles, Name: "sortButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Properties: [{ Name: "onclick", Value: function () { that.export2pdf(); } }],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-file-pdf-o fa-2x rv-icon-button",
                                            Style: "display:none; margin:0rem 0.3rem;",
                                            Tooltip: RVDic.ExportToPDF, Name: "pdfButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Properties: [{ Name: "onclick", Value: function (e) { GlobalUtilities.help_request(e, "wiki"); } }],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-question-circle-o fa-2x rv-icon-button",
                                            Style: "margin:0rem 0.3rem;", Tooltip: RVDic.Help, 
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; font-size:1.2rem; margin-bottom:0.3rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.TableOfContents }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "noTitleButton" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "titlesAreaId" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "removedTitlesButton",
                            Style: "cursor:pointer; color:blue; text-align:center; font-size:0.7rem; margin-top:0.3rem;" +
                                (that.Options.IsAdmin && that.Options.History && wiki.RemovedTitlesCount > 0 ? "" : "display:none;"),
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        var e = elems["removedTitlesButton"];

                                        if (e._Processing) return;
                                        e._Processing = true;

                                        e.innerHTML = "";
                                        GlobalUtilities.loading(e);

                                        WikiAPI.GetWiki({
                                            OwnerID: that.Objects.OwnerID, OwnerType: that.Objects.OwnerType,
                                            Removed: true, ParseResults: true,
                                            ResponseHandler: function (result) {
                                                e.parentNode.removeChild(e);
                                                if ((result.Titles || []).length == 0) return alert(RVDic.NothingToDisplay);
                                                for (var i = 0, lnt = (result.Titles || []).length; i < lnt; ++i)
                                                    result.Titles[i] = that._decode_title(result.Titles[i]);
                                                that.add_titles(result.Titles);
                                            }
                                        });
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.ShowRemovedTitles }]
                        }
                    ]
                }
            ], container);

            that.Interface.IndexTitlesArea = elems["titlesAreaId"];
            that.Interface.TitlesSortButton = elems["sortButton"];
            that.Interface.PDFButton = elems["pdfButton"];
            that.Interface.NoTitleButton = elems["noTitleButton"];
        },

        _create_new_index_title_area: function (elemBefore, focus, params) {
            params = params || {};
            var that = this;

            //Create Container Div
            var container = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
            ])["_div"];

            if (!elemBefore || !elemBefore.nextSibling) that.Interface.IndexTitlesArea.appendChild(container);
            else that.Interface.IndexTitlesArea.insertBefore(container, elemBefore.nextSibling);
            //end of Create Container Div

            that.set_no_title_button();

            container.IsTitle = true;
            container.__IsNotRegisteredYet = true;

            var titleInputInnerTitle = RVDic.NewTitle + "...";

            var _options = [];

            _options.push({
                Type: "div", Style: "display:inline-block;",
                Childs: [{
                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "cancelButtonImageId",
                    Style: "margin-top:0.3rem;", Tooltip: RVDic.Cancel,
                    Properties: [{
                        Name: "onclick",
                        Value: function () {
                            container.parentNode.removeChild(container);
                            that.set_no_title_button();
                        }
                    }]
                }]
            });

            _options.push({
                Type: "div", Style: "display:inline-block;",
                Childs: [{
                    Type: "i", Class: "fa fa-floppy-o fa-lg rv-icon-button", Name: "saveButtonImageId",
                    Style: "margin-top:0.3rem; margin-" + RV_RevFloat + ":0.6rem;", Tooltip: RVDic.Save
                }]
            });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "titleContainerId",
                    Style: "position:relative; padding:0.1rem; padding-" + RV_RevFloat + ":3.5rem; margin-bottom:0.2rem;",
                    Childs: [
                        {
                            Type: "div", Class: "RevDirection RevTextAlign",
                            Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; width:5rem;", Childs: _options
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "cursor:pointer; margin-bottom:0.2rem;", Name: "titleDivId",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "titleInputId",
                                    Style: "width:100%;", InnerTitle: titleInputInnerTitle
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var titleDiv = elems["titleDivId"];

            var titleInput = elems["titleInputId"];
            var saveButtonImage = elems["saveButtonImageId"];

            //Popup Help
            var popupDiv = GlobalUtilities.create_nested_elements([{ Type: "div", Class: "NormalPadding", Name: "_div" }])["_div"];
            popupDiv.innerHTML = RVDic._HelpAddWikiTitle;

            var showedCount = 0;

            jQuery(titleInput).focus(function () {
                ++showedCount;
                if (showedCount == 1 && params.InitialFocus === false) return;
                titleInput.HelpMenu = GlobalUtilities.popup_menu(titleDiv, popupDiv, { Align: window.RV_Float });
            });

            jQuery(titleInput).blur(function () { if (titleInput.HelpMenu) titleInput.HelpMenu.Hide(); });
            //end of Popup Help

            var _onsavebuttonclick = function () {
                var title = GlobalUtilities.trim(titleInput.value);
                if (title == titleInputInnerTitle) title = "";

                //Calculate Sequence Number
                var sequenceNumber = 1;
                var _prvSibl = container.previousSibling;

                while (_prvSibl) {
                    if (!_prvSibl.__IsNotRegisteredYet)++sequenceNumber;
                    _prvSibl = _prvSibl.previousSibling;
                }
                //end of Calculate Sequence Number

                if (title == "") return alert(RVDic.Checks.TitleCannotBeEmpty);

                WikiAPI.AddTitle({
                    OwnerID: that.Objects.OwnerID, Title: Base64.encode(title),
                    SequenceNumber: sequenceNumber, OwnerType: that.Objects.OwnerType,
                    CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var titleJson = that._decode_title(result.Title || {});

                        var titleElement = that._create_index_title_area({
                            TitleID: titleJson.TitleID, Title: titleJson.Title, Childs: [],
                            SequenceNumber: titleJson.SequenceNumber, Removable: titleJson.Removable,
                            Editable: titleJson.Editable
                        }, container);

                        jQuery(titleInput).blur();

                        if (!container.nextSibling) {
                            var cnita = that._create_new_index_title_area(container, true, { InitialFocus: false });

                            if (that.Options.AutoScroll)
                                GlobalUtilities.scroll(document.body, { Value: GlobalUtilities.total_height(container) });
                        }

                        container.parentNode.removeChild(container);

                        var __newTitleDiv = that._create_title_area(titleJson);
                        var __nextElem = GlobalUtilities.get_next_element(titleElement, true, function (elem) { return elem.IsTitle === true });
                        if (__nextElem != null) {
                            var _tId = __nextElem.TitleID;
                            __nextElem = that.Objects.Titles[_tId];
                            that.Interface.TitlesArea.insertBefore(__newTitleDiv, __nextElem);
                        }
                    }
                });
            } //end of 'var _onsavebuttonclick = function () {'

            saveButtonImage.onclick = _onsavebuttonclick;
            GlobalUtilities.set_onenter(titleInput, _onsavebuttonclick);

            if (focus) titleInput.focus();

            return container;
        },

        _create_index_title_area: function (params, elemAfter) {
            params = params || {};
            var that = this;

            var containerDiv = that.Interface.IndexTitlesArea;

            var titleId = params.TitleID || "";
            var theTitle = params.Title;

            var relatedTitleArea = params.TitleArea;


            var titleContainerDiv = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: (params.Removed ? "color:red;" : ""), Name: "_div"
            }])["_div"];

            titleContainerDiv.IsTitle = true;
            titleContainerDiv.Removed = params.Removed === true;
            titleContainerDiv.TitleID = titleId;
            titleContainerDiv.TitleObject = params;

            if (!elemAfter) containerDiv.appendChild(titleContainerDiv);
            else containerDiv.insertBefore(titleContainerDiv, elemAfter);

            titleContainerDiv.Paragraphs = [];
            that.Objects.IndexTitles[titleId] = titleContainerDiv;

            that.set_titles_sort_button_visibility();
            that.set_no_title_button();

            var titleInputInnerTitle = RVDic.NewTitle + "...";

            var _options = [];

            var _add_button = function (p) {
                _options.push({
                    Type: "div", Style: "display:inline-block;",
                    Childs: [{
                        Type: "i", Name: p.Name, Tooltip: p.Tooltip,
                        Class: "RevFloat fa fa-" + p.IconName + " fa-lg rv-icon-button",
                        Style: "margin-" + RV_Float + ":0.6rem; margin-top:0.3rem;",
                        Properties: [{ Name: "onclick", Value: p.OnClick }]
                    }]
                });
            }

            if (params.Removable === true) {
                _add_button({
                    Name: "removeButtonImageId", IconName: "times", Tooltip: RVDic.Remove,
                    OnClick: function () {
                        if (titleContainerDiv.Editing && _view_mode) {
                            if (elems["editButtonImageId"].TitleInput) jQuery(elems["editButtonImageId"].TitleInput).blur();
                            _view_mode(elems["editButtonImageId"], false);
                            return;
                        }

                        var msg = RVDic.Confirms.RemovingTheTitleCausesRemovingAllOfTheRelatedParagraphs + ". " + RVDic.Confirms.DoYouWantToContinue;

                        GlobalUtilities.confirm(msg, function (r) {
                            if (!r) return;

                            WikiAPI.RemoveTitle({
                                TitleID: titleId, OwnerType: that.Objects.OwnerType,
                                CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                                    if (result.Succeed) {
                                        jQuery(titleContainerDiv).animate({ height: "toggle" }, 500, function () {
                                            titleContainerDiv.parentNode.removeChild(titleContainerDiv);

                                            var titleElem = that.Objects.Titles[titleId];
                                            if (titleElem != null) titleElem.parentNode.removeChild(titleElem);

                                            that.Objects.IndexTitles[titleId] = null;
                                            that.Objects.Titles[titleId] = null;

                                            that.set_titles_sort_button_visibility();
                                            that.set_no_title_button();
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            }

            if (params.Removed) {
                var _recycling = false;

                _add_button({
                    Name: "recycleButton", IconName: "recycle", Tooltip: RVDic.Recycle,
                    OnClick: function () {
                        if (_recycling) return;

                        var msg = RVDic.Confirms.DoYouWantToRecycleTheN.replace("[n]", RVDic.Title);

                        GlobalUtilities.confirm(msg, function (r) {
                            if (!r) return;

                            _recycling = true;

                            WikiAPI.RecycleTitle({
                                TitleID: titleId, OwnerType: that.Objects.OwnerType,
                                CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                                ResponseHandler: function (result) {
                                    _recycling = false;
                                    if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                                    if (result.Succeed) {
                                        alert(RVDic.Reloading + "...");
                                        setTimeout(function () { window.location.href = window.location.href; }, 1000);
                                    }
                                }
                            });
                        });
                    }
                });
            }

            var _edit_mode = null, _view_mode = null;

            if (params.Editable === true) {
                _edit_mode = function (btn, focus) {
                    if (titleContainerDiv.Editing) return;
                    titleContainerDiv.Editing = true;

                    if (elems["removeButtonImageId"]) GlobalUtilities.append_tooltip(elems["removeButtonImageId"], RVDic.Cancel);
                    GlobalUtilities.append_tooltip(btn, RVDic.Save);

                    var _text = titleDiv.MainContent = theTitle;

                    titleDiv.innerHTML = "";

                    var _editArea = GlobalUtilities.create_nested_elements([
                        {
                            Type: "input", Class: "rv-input", Name: "_input",
                            Style: "width:100%;", InnerTitle: titleInputInnerTitle,
                            Attributes: [{ Name: "type", Value: "text" }]
                        }
                    ], titleDiv)["_input"];

                    GlobalUtilities.set_onenter(_editArea, function () { _onEditButtonClick(elems["editButtonImageId"]); });

                    _editArea.value = _text;
                    if (_text) _editArea.style.color = "black";

                    if (focus) {
                        _editArea.focus();
                        _editArea.select();
                    }

                    btn.TitleInput = _editArea;

                    btn.classList.remove("fa-pencil-square-o");
                    btn.classList.add("fa-floppy-o");
                    btn.style.marginTop = "0.3rem";
                };

                _view_mode = function (btn, save) {
                    if (!titleContainerDiv.Editing) return;

                    if (!save && document.activeElement == btn.TitleInput) return;

                    if (elems["removeButtonImageId"]) GlobalUtilities.append_tooltip(elems["removeButtonImageId"], RVDic.Remove);
                    GlobalUtilities.append_tooltip(btn, RVDic.Edit);

                    titleContainerDiv.Editing = false;

                    if (!save) {
                        GlobalUtilities.set_text(titleDiv, titleDiv.MainContent);
                        btn.classList.remove("fa-floppy-o");
                        btn.classList.add("fa-pencil-square-o");
                        btn.style.marginTop = "0.3rem";
                        return;
                    }

                    var _title = GlobalUtilities.trim(btn.TitleInput.value);
                    if (_title == titleInputInnerTitle) _title = "";
                    if (_title == "") return alert(RVDic.Checks.TitleCannotBeEmpty);

                    set_title(_title);

                    WikiAPI.ModifyTitle({
                        TitleID: titleId, Title: Base64.encode(_title), OwnerID: that.Objects.OwnerID,
                        OwnerType: that.Objects.OwnerType,
                        CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                GlobalUtilities.set_text(titleDiv, theTitle);
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            }

                            set_title(theTitle = _title);
                            //that.Objects.Titles[titleId].set_title(theTitle = _title);
                        }
                    });

                    btn.classList.remove("fa-floppy-o");
                    btn.classList.add("fa-pencil-square-o");
                    btn.style.marginTop = "0.3rem";
                };

                var _onEditButtonClick = function (btn) {
                    titleContainerDiv.Editing ? _view_mode(btn, true) : _edit_mode(btn, true);
                };

                _add_button({
                    Name: "editButtonImageId", IconName: "pencil-square-o", Tooltip: RVDic.Edit,
                    OnClick: function () { _onEditButtonClick(elems["editButtonImageId"]); }
                });
            }

            var _areaOut = true;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Name: "titleContainerId",
                Style: "position:relative; margin:0.3rem 0rem; padding:0.1rem; padding-" + RV_RevFloat + ":4rem;",
                Properties: [
                    {
                        Name: "onmouseover",
                        Value: function () {
                            _areaOut = false;
                            setTimeout(function () {
                                if (_areaOut) return;
                                //if (_edit_mode) _edit_mode(elems["editButtonImageId"], false);
                                elems["opcId"].style.display = "inline-block";
                                if (params.Editable && !(titleContainerDiv.nextSibling || {}).__IsNotRegisteredYet)
                                    elems["newTButton"].style.display = "inline-block";
                            }, 50);
                        }
                    },
                    {
                        Name: "onmouseout",
                        Value: function () {
                            _areaOut = true;
                            setTimeout(function () {
                                if (!_areaOut) return;
                                //if (_view_mode) _view_mode(elems["editButtonImageId"], false);
                                elems["opcId"].style.display = "none";
                                if (params.Editable) elems["newTButton"].style.display = "none";
                            }, 400);
                        }
                    }
                ],
                Childs: [
                    {
                        Type: "div", Class: "RevDirection RevTextAlign", Name: "opcId",
                        Style: "display:none; position:absolute; top:0rem;" + RV_RevFloat + ":0rem; width:4rem;",
                        Childs: _options
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "cursor:pointer; margin-bottom:0.1rem;", Name: "titleDivId"
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "childsContainerId" },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "newTButton",
                        Style: "position:absolute; bottom:0.1rem; display:none;",
                        Childs: [
                            {
                                Type: "div", Class: "SoftBorder",
                                Style: "position:absolute; padding-top:1px; width:7rem; border-color:black; z-index:2;" +
                                    "background-color:rgb(255, 255, 255); top:0.1rem;" + window.RV_Float + ":-1.1rem;" +
                                    "background-color:white;" + GlobalUtilities.border_radius(2)
                            },
                            {
                                Type: "div", Tooltip: RVDic.AddNewTitle, Class: "SoftBorder",
                                Style: "position:absolute; width:1.5rem; height:1.5rem; background-color:white; z-index:3;" +
                                    GlobalUtilities.border_radius(12) + "text-align:center; top:-0.6rem; border-color:black;" +
                                    window.RV_Float + ":-2.5rem;" + "cursor:pointer; color:black;" +
                                    "font-size:1.5rem; line-height:1.55rem;",
                                Properties: [{
                                    Name: "onclick",
                                    Value: function () {
                                        var newTArea = that._create_new_index_title_area(titleContainerDiv, true);
                                        //if (that.Options.AutoScroll) GlobalUtilities.scroll_into_view(newTArea);
                                    }
                                }],
                                Childs: [{ Type: "text", TextValue: "+" }]
                            }
                        ]
                    }
                ]
            }], titleContainerDiv);

            var titleDiv = elems["titleDivId"];

            var childsContainer = elems["childsContainerId"];

            var set_title = function (t) {
                t = theTitle || t;

                titleDiv.innerHTML = "";

                GlobalUtilities.create_nested_elements([{
                    Type: "div", Style: "display:inline-block;",
                    Childs: [{ Type: "text", TextValue: t }]
                }], titleDiv);

                if ((that.Objects.Titles[titleId] || {}).set_title) that.Objects.Titles[titleId].set_title(t);
            };

            set_title();

            titleContainerDiv.add_child = function (params) {
                params = params || {};

                var childId = params.ChildID || "";
                var title = params.Title || "";

                var _childElem = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "childDiv",
                        Style: "padding-" + RV_Float + ":1rem; margin-bottom:0.2rem; cursor:pointer;" +
                            "color:rgb(100, 100, 100); display:" + (title == "" ? "none" : "block") + ";",
                        Properties: [
                            {
                                Name: "onclick",
                                Value: function () {
                                    var paragraphElement = that.Objects.Paragraphs[childId];
                                    if (paragraphElement != null && that.Options.AutoScroll)
                                        GlobalUtilities.scroll_into_view(paragraphElement);
                                }
                            },
                            { Name: "IsParagraph", Value: true }
                        ],
                        Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(title) }]
                    }
                ], childsContainer);

                titleContainerDiv.Paragraphs[childId] = _childElem["childDiv"];
                _childElem["childDiv"].rename = function (newTitle) { GlobalUtilities.set_text(this, newTitle); };

                if (params.NextID) {
                    var nextChild = titleContainerDiv.Paragraphs[params.NextID];
                    if (nextChild != null) childsContainer.insertBefore(_childElem["childDiv"], nextChild);
                }
            }

            titleContainerDiv.rename_child = function (childId, newTitle) {
                var child = titleContainerDiv.Paragraphs[childId];
                if (child == null) return;
                var title = newTitle || "";
                child.rename(title);
                child.style.display = title == "" ? "none" : "block";
            };

            titleContainerDiv.remove_child = function (childId) {
                var child = titleContainerDiv.Paragraphs[childId];
                if (child) child.parentNode.removeChild(child);
            };

            var titleChilds = params.Childs || [];
            for (var i = 0, lnt = titleChilds.length; i < lnt; ++i)
                titleContainerDiv.add_child({ ChildID: titleChilds[i].ChildID, Title: titleChilds[i].Title });

            elems["titleDivId"].onclick = function () {
                if (!titleContainerDiv.Editing && that.Objects.Titles[titleId] && that.Options.AutoScroll)
                    GlobalUtilities.scroll_into_view(that.Objects.Titles[titleId]);
            };

            return titleContainerDiv;
        },

        _create_change_area: function (params) {
            var that = this;

            params = params || {};

            var change = params.Change || {};
            var changeId = change.ChangeID || "";
            var isExpert = change.IsExpert === true;
            var paragraphId = change.ParagraphID || "";

            var senderFullName = Base64.decode(change.Sender.FirstName) + " " + Base64.decode(change.Sender.LastName);
            var userPageUrl = UsersAPI.UserPageURL({ UserID: change.Sender.UserID });

            var changesArea = params.ContainerDiv;

            var _options = [];

            var add_button = function (p) {
                p = p || {};

                _options.push({
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center;" + p.Style,
                    Properties: [{ Name: "onclick", Value: p.OnClick }],
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-" + p.IconName + " fa-2x rv-icon-button", Name: p.Name,
                            Tooltip: p.Tooltip, TooltipAlign: RV_RevFloat,
                            Style: "cursor:pointer; margin-" + RV_RevFloat + ":0.1rem;"
                        }
                    ]
                });
            }

            if (isExpert) {
                add_button({ Name: "acceptButtonImageId", IconName: "check", Tooltip: RVDic.Accept });
                add_button({ Name: "rejectButtonImageId", IconName: "times", Tooltip: RVDic.Reject, Style: "margin-top:0.1rem;" });
            }
            else add_button({ Name: "removeButtonImageId", IconName: "times", Tooltip: RVDic.Remove });

            add_button({ Name: "syncButtonImageId", IconName: "refresh", Tooltip: RVDic.RefreshEditor, Style: "margin-top:0.4rem;" });

            _options.push({
                Type: "div", Class: "small-12 medium-12 large-12 rv-icon-button",
                Tooltip: RVDic.ShowDifferences, TooltipAlign: window.RV_RevFloat, Name: "compareButtonImageId",
                Style: "margin-top:0.8rem; margin-" + RV_RevFloat + ":0.1rem;",
                Properties: [
                    {
                        Name: "onclick",
                        Value: function () {
                            elems["compareButtonImageId"].style.display = "none";
                            elems["returnToNormalMode"].parentNode.style.display = "block";

                            var pTitle = that.Objects.Paragraphs[paragraphId].ParagraphObject.Title;
                            var pBody = that.Objects.Paragraphs[paragraphId].ParagraphObject.BodyText;

                            GlobalUtilities.show_text_changes(bodyTextContainer, change.Title, pTitle);
                            GlobalUtilities.show_text_changes(bodyTextContainer, change.BodyText, pBody);
                        }
                    }
                ],
                Childs: [
                    { Type: "i", Class: "fa fa-chevron-circle-" + RV_Float + " fa-lg" },
                    { Type: "i", Class: "fa fa-chevron-circle-" + RV_RevFloat + " fa-lg" }
                ]
            });

            add_button({
                Name: "returnToNormalMode", IconName: "arrow-" + RV_RevFloat,
                Tooltip: RVDic.ReturnToNormalMode, Style: "margin-top:0.4rem; display:none;",
                OnClick: function () {
                    _show_content();
                    elems["returnToNormalMode"].parentNode.style.display = "none";
                    elems["compareButtonImageId"].style.display = "block";
                }
            });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "padding:0.6rem 1rem 0rem 1rem; padding-" + RV_Float + ":2rem;",
                    Childs: [
                        {
                            Type: "div", Name: "changeContainerId",
                            Class: "rv-bg-color-softer-soft rv-border-radius-quarter",
                            Style: "padding:0.5rem; padding-" + RV_RevFloat + ":3rem; position:relative; min-height:9rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "RevDirection",
                                    Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; width:3rem;" +
                                        "padding-top:0.3rem; text-align:center; margin-bottom:0.3rem;",
                                    Childs: _options
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: ((change.Sender || {}).FirstName ? "" : "display:none;"),
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block;",
                                            Childs: [
                                                {
                                                    Type: "img", Class: "BorderRadius4", Link: userPageUrl,
                                                    Style: "width:2rem; height:2rem; cursor:pointer;",
                                                    Attributes: [{ Name: "src", Value: change.Sender.ProfileImageURL }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; margin:0.3rem 0.6rem 0rem 0.6rem;" +
                                                "font-style:italic;",
                                            Childs: [{ Type: "text", TextValue: RVDic.EditSuggestedBy + ":" }]
                                        },
                                        {
                                            Type: "div", Link: userPageUrl,
                                            Style: "display:inline-block; margin-top:0.3rem; color:blue;" +
                                                "font-weight:bold;",
                                            Childs: [{ Type: "text", TextValue: senderFullName }]
                                        },
                                        { Type: "hr", Class: "small-12 medium-12 large-12" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "titleContainerId",
                                    Style: "font-weight:bold; font-style:italic;" +
                                        "margin:0.2rem 0.3rem 0rem 0.3rem; margin-" + RV_Float +
                                        ":1.2rem; padding-bottom:0.4rem; display:none;"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "text-align: justify; margin:4px;", Name: "bodyTextId"
                                }
                            ]
                        }
                    ]
                }
            ], changesArea);

            var changeContainer = elems["changeContainerId"];
            var rejectButtonImage = elems["rejectButtonImageId"];
            var acceptButtonImage = elems["acceptButtonImageId"];
            var removeButtonImage = elems["removeButtonImageId"];

            var titleContainer = elems["titleContainerId"];
            var bodyTextContainer = elems["bodyTextId"];

            var _show_content = function () {
                bodyTextContainer.innerHTML = "";

                if (change.Title) {
                    titleContainer.style.display = "inline-block";
                    GlobalUtilities.set_text(titleContainer, GlobalUtilities.convert_numbers_to_persian(change.Title));
                }

                GlobalUtilities.append_markup_text(bodyTextContainer, change.BodyText || "", {
                    IsHTML: true,
                    Done: function () { GlobalUtilities.remove_empty_tags(bodyTextContainer); }
                });
            }

            _show_content();

            var filesContainer = elems["attachedFilesContainerId"];

            var accept_reject_response_handler = function (result) {
                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                rejectButtonImage.parentNode.removeChild(rejectButtonImage);
                acceptButtonImage.parentNode.removeChild(acceptButtonImage);

                GlobalUtilities.unblock(changeContainer);

                jQuery(changeContainer).animate({ height: "toggle" }, 500, function () {
                    if (that.Options.AutoScroll && !changeContainer.nextSibling) {
                        if (changeContainer.previousSibling) {
                            var ht = GlobalUtilities.total_height(changeContainer.previousSibling);
                            GlobalUtilities.scroll(document.body, { Value: -1 * ht });
                        }
                        else GlobalUtilities.scroll_into_view(that.Objects.Paragraphs[paragraphId]);
                    }

                    changeContainer.parentNode.removeChild(changeContainer);
                });
            }

            if (rejectButtonImage != null) {
                rejectButtonImage.onclick = function () {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRejectWikiChange, function (result) {
                        if (!result) return;

                        GlobalUtilities.block(changeContainer);

                        WikiAPI.RejectChange({
                            ChangeID: changeId, OwnerType: that.Objects.OwnerType, ParseResults: true,
                            ResponseHandler: accept_reject_response_handler
                        });
                    });
                }
            }

            if (acceptButtonImage != null) {
                acceptButtonImage.onclick = function () {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToAcceptWikiChange, function (result) {
                        if (!result) return;

                        GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToApplyWikiChange, function (result) {
                            GlobalUtilities.block(changeContainer);

                            if (result) {
                                WikiAPI.ModifyParagraph({
                                    ParagraphID: paragraphId, ChangeID: changeId, OwnerType: that.Objects.OwnerType,
                                    CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.Succeed) {
                                            change.Title = Base64.decode((result.Paragraph || {}).Title) || change.Title;
                                            change.BodyText = Base64.decode((result.Paragraph || {}).BodyText) || change.BodyText;

                                            that.Objects.Paragraphs[paragraphId].set_data(change.Title, change.BodyText, false);
                                            that.Objects.Paragraphs[paragraphId].change_mode(true);
                                        }

                                        accept_reject_response_handler(result);
                                    }
                                });
                            } else {
                                WikiAPI.AcceptChange({
                                    ChangeID: changeId, OwnerType: that.Objects.OwnerType, Apply: result, ParseResults: true,
                                    ResponseHandler: accept_reject_response_handler
                                });
                            }
                        });
                    });
                }
            }

            if (removeButtonImage != null) {
                removeButtonImage.onclick = function () {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveYourWikiChange, function (result) {
                        if (!result) return;

                        GlobalUtilities.block(changeContainer);

                        WikiAPI.RemoveChange({
                            ChangeID: changeId, OwnerType: that.Objects.OwnerType, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                changeContainer.parentNode.removeChild(changeContainer);
                            }
                        });
                    });
                }
            }

            elems["syncButtonImageId"].onclick = function () {
                if (!that.Objects.Paragraphs[paragraphId].is_edit_mode())
                    return alert(RVDic.MSG.TheWikiChangeWouldBeAppliedIfYouWhereInEditMode, { Timeout: 20000 });

                GlobalUtilities.confirm(RVDic.Confirms.WikiChangeRefreshButtonClick, function (result) {
                    that.Objects.Paragraphs[paragraphId].set_data(change.Title, change.BodyText, true, true, {
                        InsertData: result
                    });
                });
            }

            return changeContainer;
        },

        _initialize_new_paragraph_area: function (params) {
            params = params || {};
            var that = this;

            var titleId = params.TitleID || "";
            var containerDiv = params.ContainerDiv;

            var _options = [];

            var _add_button = function (p) {
                _options.push({
                    Type: "div", Style: p.Style,
                    Childs: [{
                        Type: "i", Class: "fa fa-" + p.IconName + " fa-2x rv-icon-button",
                        Name: p.Name, Tooltip: p.Tooltip, TooltipAlign: RV_RevFloat,
                        Style: "cursor:pointer; margin-" + RV_RevFloat + ":0.1rem;",
                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(p.IconName) }]
                    }]
                });
            }

            _add_button({ Name: "cancelButtonImageId", IconName: "times", Tooltip: RVDic.Cancel });
            _add_button({ Name: "saveButtonImageId", IconName: "floppy-o", Style: "margin-top:0.3rem;", Tooltip: RVDic.Save });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "paragraphContainerId",
                    Style: "padding-bottom:0.5rem; position:relative;" +
                        "padding-" + RV_RevFloat + ":3rem;",
                    Properties: [{ Name: "IsParagraph", Value: true }],
                    Childs: [
                        {
                            Type: "div", Class: "RevDirection",
                            Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; width:2.5rem;" +
                                "text-align:center; padding-top:0.3rem; text-align:center;",
                            Childs: _options
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:1rem;", Name: "titleInputAreaId",
                                    Childs: [
                                        {
                                            Type: "input", Class: "rv-input",
                                            Style: "width:60%;", Name: "titleInputId"
                                        }
                                    ]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "richTextAreaId" }
                            ]
                        }
                    ]
                }
            ]);

            var paragraphContainer = elems["paragraphContainerId"];
            var titleInput = elems["titleInputId"];
            var richTextArea = elems["richTextAreaId"];

            paragraphContainer.__IsNotRegisteredYet = true;

            if (params.InsertBefore) containerDiv.insertBefore(paragraphContainer, params.InsertBefore);
            else containerDiv.appendChild(paragraphContainer);

            GlobalUtilities.set_inner_title(titleInput, this.Options.ParagraphInnerTitle);

            elems["cancelButtonImageId"].onclick = function () {
                jQuery(paragraphContainer).animate({ height: "toggle" }, 500, function () {
                    paragraphContainer.parentNode.removeChild(paragraphContainer);
                    that.set_no_paragraph_button(titleId);
                });
            }

            elems["saveButtonImageId"].onclick = function () {
                if (!(paragraphContainer.RichTextInput || {}).get_data) return;

                var title = GlobalUtilities.trim(titleInput.value);
                if (title == that.Options.ParagraphInnerTitle) title = "";
                var bodyText = paragraphContainer.RichTextInput.get_data();
                bodyText = GlobalUtilities.trim(bodyText);

                //Calculate Sequence Number
                var sequenceNumber = 1;
                var _prvSibl = paragraphContainer.previousSibling;

                while (_prvSibl) {
                    if (!_prvSibl.__IsNotRegisteredYet)++sequenceNumber;
                    _prvSibl = _prvSibl.previousSibling;
                }
                //end of Calculate Sequence Number

                if (title == "" && GlobalUtilities.is_empty_text(bodyText)) {
                    alert(RVDic.Checks.AtLeastOneOfTitleOrDescriptionIsNecessary);
                    return;
                }

                WikiAPI.AddParagraph({
                    TitleID: titleId, Title: Base64.encode(title), BodyText: Base64.encode(bodyText),
                    OwnerType: that.Objects.OwnerType, OwnerID: that.Objects.OwnerID, SequenceNumber: sequenceNumber,
                    CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var paragraphJson = that._decode_paragraph(result.Paragraph || {});

                        var paragraphElement = that._create_paragraph_area({ Paragraph: paragraphJson, ContainerDiv: containerDiv });

                        if (params.InsertBefore) containerDiv.insertBefore(paragraphElement, params.InsertBefore);
                        else containerDiv.appendChild(paragraphElement);

                        paragraphContainer.parentNode.removeChild(paragraphContainer);

                        var nextParagraph = GlobalUtilities.get_next_element(paragraphElement, true, function (elem) { return elem.IsParagraph === true });
                        var indexTitle = that.Objects.IndexTitles[titleId];
                        if (indexTitle != null) indexTitle.add_child({
                            ChildID: paragraphJson.ParagraphID, Title: paragraphJson.Title,
                            NextID: nextParagraph == null ? null : nextParagraph.ParagraphID
                        });
                    }
                });
            }

            that.set_no_paragraph_button(titleId);

            GlobalUtilities.append_rich_text_editor(richTextArea, {
                EnableTagging: true, EnableUploader: true, EnableCodeHighlighter: true,
                Upload: {
                    Removable: that.is_admin(),
                    OwnerID: that.Objects.OwnerID,
                    OwnerType: "WikiContent",
                    AttachedFiles: function (callback) { callback(that.Objects.WikiAttachedFiles); },
                    OnUpload: function (uploadedFile) {
                        uploadedFile.Removable = true;
                        that.add_uploaded_file(uploadedFile);
                    },
                    OnRemove: function (file) { that.remove_uploaded_file(file); }
                }
            }, function (editor) {
                paragraphContainer.RichTextInput = editor;
                paragraphContainer.RichTextInput.set_data("");
            });

            return paragraphContainer;
        },

        _add_attached_files: function (_containerDiv, afs, params) {
            var that = this;

            params = params || {};
            afs = afs || [];

            if (!_containerDiv.MediaManager)
                _containerDiv.MediaManager = new MediaManager({
                    ContainerDiv: _containerDiv,
                    UnlimitedDownloadAccess: that.Objects.Downloadable
                });

            for (var i = 0, lnt = afs.length; i < lnt; ++i) {
                if (!afs[i].Decoded) {
                    afs[i].FileName = Base64.decode(afs[i].FileName || "");
                    afs[i].DownloadLink = DocsAPI.GetDownloadLink({ FileID: afs[i].FileID || "" });
                    afs[i].Extension = Base64.decode(afs[i].Extension || "");
                }

                afs[i].Decoded = true;
            }

            var removeResponseHandler = function (responseText, params) {
                var result = JSON.parse(responseText);

                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                if (params.ContainerDiv) params.ContainerDiv.parentNode.removeChild(params.ContainerDiv);
            }

            var onremove = function (params) {
                GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveAttachedFile, function (result) {
                    if (!result) return;

                    params = params || {};
                    var file = params.File || {};

                    DocsAPI.RemoveFile({
                        FileID: file.FileID || "", OwnerID: file.OwnerID || "",
                        ResponseHandler: removeResponseHandler,
                        ResponseParams: params
                    });
                });
            }

            _containerDiv.MediaManager.add_items(afs, {
                Removable: params.Removable, Acceptable: params.Acceptable,
                OnRemove: onremove, OnAccept: params.OnAccept
            });
        },

        _create_paragraph_area: function (params) {
            params = params || {};
            var that = this;

            var paragraph = params.Paragraph || {};
            var paragraphId = paragraph.ParagraphID || "";
            var titleId = paragraph.TitleID || "";
            var editMode = paragraph.EditMode === true;
            var attachedFiles = paragraph.AttachedFiles || [];

            var paragraphsArea = params.ContainerDiv;

            var _movedOut = true;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "paragraphContainerId",
                    Class: "small-12 medium-12 large-12 " + (paragraph.Removed ? "rv-border-radius-quarter SoftBorder" : ""),
                    Style: "margin:0.5rem 0rem 1.5rem 0rem; position:relative;" + (paragraph.Removed ? "border-style:dashed;" : ""),
                    Properties:
                    [
                        { Name: "ParagraphID", Value: paragraphId },
                        { Name: "IsParagraph", Value: true },
                        {
                            Name: "onmouseover",
                            Value: function () {
                                _movedOut = false;
                                setTimeout(function () {
                                    if (_movedOut) return;
                                    if (that.Options.Editable && !paragraph.Removed &&
                                        !(paragraphContainer.nextSibling || {}).__IsNotRegisteredYet) {
                                        elems["newPButton"].style.display = "inline-block";
                                    }
                                    elems["menuButton"].style.opacity = 1;
                                }, 50);
                            }
                        },
                        {
                            Name: "onmouseout",
                            Value: function () {
                                _movedOut = true;
                                setTimeout(function () {
                                    if (!_movedOut) return;
                                    if (that.Options.Editable && !paragraph.Removed) elems["newPButton"].style.display = "none";
                                    elems["menuButton"].style.opacity = 0.2;
                                }, 400);
                            }
                        }
                    ],
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_RevFloat + ":3rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "RevDirection",
                                    Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;" +
                                        "width:2.5rem; text-align:center;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "RevTextAlign", Name: "menuButton",
                                            Style: "position:relative; margin-top:-0.4rem; opacity:0.2;" +
                                                (paragraph.Removed ? "display:none;" : ""),
                                            Childs: [
                                                {
                                                    Type: "div", Name: "fakeDot",
                                                    Style: "position:absolute; bottom:0.65rem; padding-top:1px; width:1px;" +
                                                        "background-color:transparent; left:0.5rem;"
                                                },
                                                {
                                                    Type: "i", Class: "fa fa-angle-down fa-2x rv-icon-button",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Name: "cancelButton", Style: "display:none;",
                                            Tooltip: RVDic.Cancel, TooltipAlign: window.RV_RevFloat,
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-times fa-2x rv-icon-button",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Name: "saveButton", Style: "margin-top:0.3rem; display:none;",
                                            Tooltip: RVDic.Save, TooltipAlign: window.RV_RevFloat,
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-floppy-o fa-2x rv-icon-button",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Name: "recycleButton",
                                            Style: "margin-top:0.3rem; margin-" + window.RV_RevFloat + ":0.3rem;" +
                                                (paragraph.Removed ? "" : "display:none;"),
                                            Tooltip: RVDic.Recycle, TooltipAlign: window.RV_RevFloat,
                                            Properties: [
                                                {
                                                    Name: "onclick",
                                                    Value: function () {
                                                        if (paragraphContainer._recycling) return;

                                                        var msg = RVDic.Confirms.DoYouWantToRecycleTheN.replace("[n]", RVDic.Paragraph);

                                                        GlobalUtilities.confirm(msg, function (r) {
                                                            if (!r) return;

                                                            paragraphContainer._recycling = true;

                                                            WikiAPI.RecycleParagraph({
                                                                ParagraphID: paragraphId, OwnerType: that.Objects.OwnerType,
                                                                CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                                                                ResponseHandler: function (result) {
                                                                    paragraphContainer._recycling = false;
                                                                    if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                                                                    if (result.Succeed) {
                                                                        alert(RVDic.Reloading + "...");
                                                                        setTimeout(function () { window.location.href = window.location.href; }, 1000);
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    }
                                                }
                                            ],
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-recycle fa-2x rv-icon-button",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "paragraphContentAreaId",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12", Name: "titleContainerId",
                                            Style: "font-weight:bold; font-style:italic; padding:0.3rem;" +
                                                "padding-" + RV_Float + ":1.2rem; padding-bottom:0.4rem;" +
                                                "display:none; font-size:1.1rem;"
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "text-align:justify; padding:0.3rem;", Name: "bodyTextId"
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-" + RV_Float + ":0.8rem;", Name: "attachedFilesContainerId"
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "display:none;", Name: "editAreaId",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-top:0.3rem;", Name: "titleEditDivId"
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyTextEditDivId" }
                                    ]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "changesAreaId" },
                        {
                            Type: "div", Name: "newPButton", Style: "position:absolute; bottom:0rem; display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "SoftBorder",
                                    Style: "position:absolute; padding-top:1px; width:400px; border-color:black; z-index:2;" +
                                        "background-color:rgb(255, 255, 255); top:8px;" + window.RV_Float + ":-10px;" +
                                        "background-color:white;" + GlobalUtilities.border_radius(2)
                                },
                                {
                                    Type: "div", Tooltip: RVDic.AddNewParagraph, Class: "SoftBorder",
                                    Style: "position:absolute; width:34px; height:34px; background-color:white; z-index:3;" +
                                        GlobalUtilities.border_radius(17) + "text-align:center; top:-8px; border-color:black;" +
                                        window.RV_Float + ":-40px;" + "cursor:pointer; color:black; font-weight:bold;" +
                                        "font-size:larger; line-height:34px;",
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                var newPArea = that._initialize_new_paragraph_area({
                                                    TitleID: titleId,
                                                    ContainerDiv: paragraphContainer.parentNode,
                                                    InsertBefore: paragraphContainer.nextSibling
                                                });

                                                if (that.Options.AutoScroll) GlobalUtilities.scroll_into_view(newPArea);
                                            }
                                        }
                                    ],
                                    Childs: [{ Type: "text", TextValue: "+" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-10 medium-9 large-8",
                            Style: "position:relative; margin:0rem auto 0rem auto;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; padding-top:0.1rem; top:0.6rem; z-index:1; opacity:0.4;" +
                                        "background-color:rgb(220, 220, 220); left:0rem; right:0rem;"
                                }
                            ]
                        }
                    ]
                }
            ], paragraphsArea);

            var paragraphContainer = elems["paragraphContainerId"];

            that.Objects.Titles[titleId].Paragraphs = that.Objects.Titles[titleId].Paragraphs || {};
            that.Objects.Paragraphs[paragraphId] = that.Objects.Titles[titleId].Paragraphs[paragraphId] = paragraphContainer;

            paragraphContainer.ParagraphObject = paragraph;
            paragraphContainer.Removed = paragraph.Removed === true;
            paragraphContainer.BodyTextArea = elems["bodyTextId"];

            that.set_paragraphs_sort_button_visibility(titleId);

            //Animate background color if paragraph is removed
            if (paragraph.Removed) {
                var bc = 100;

                var downBc = function () {
                    bc += 5;
                    paragraphContainer.style.backgroundColor = bc >= 255 ? "transparent" : "rgb(" + bc + "," + bc + "," + bc + ")";
                    if (bc < 255) setTimeout(downBc, 50);
                }

                downBc();
            }
            //end of Animate background color if paragraph is removed

            var titleLabel = elems["titleContainerId"];
            var bodyTextContainer = elems["bodyTextId"];
            var filesContainer = elems["attachedFilesContainerId"];

            var editArea = elems["editAreaId"];
            var contentArea = elems["paragraphContentAreaId"];
            var titleEditDiv = elems["titleEditDivId"];
            var bodyTextEditDiv = elems["bodyTextEditDivId"];
            var changesArea = elems["changesAreaId"];

            //Create Menu
            var change_mode = paragraphContainer.change_mode = function (viewMode) {
                contentArea.style.display = viewMode ? "inline" : "none";
                elems["menuButton"].style.display = viewMode ? "inline-block" : "none";
                elems["cancelButton"].style.display = elems["saveButton"].style.display =
                    editArea.style.display = viewMode ? "none" : "block";
                if (!viewMode && ebmoObj) ebmoObj.End();
                paragraphContainer.Editing = !viewMode;
            }

            var buttons = [];

            var add_button = function (title, isLast, onclick) {
                buttons.push({
                    Type: "div", Class: "WarmTextShadow TextAlign",
                    Style: (isLast ? "" : "border-bottom: 1px dotted #808080;") +
                        "width:9rem; cursor:pointer; font-size:0.8rem; padding:0.2rem 0.3rem;",
                    Properties: [{ Name: "onclick", Value: function (e) { onclick.call(this, e); } }],
                    Childs: [{ Type: "text", TextValue: title }]
                });
            };

            if (paragraph.Removable === true) {
                var removing = false;

                add_button(RVDic.Remove, false, function (e) {
                    if (removing) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveParagraph, function (result) {
                        if (!result) return;

                        removing = true;

                        WikiAPI.RemoveParagraph({
                            ParagraphID: paragraphId, OwnerType: that.Objects.OwnerType,
                            CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                            ResponseHandler: function (result) {
                                removing = false;

                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                                if (result.Succeed) {
                                    jQuery(paragraphContainer).animate({ height: "toggle" }, 500, function () {
                                        if (paragraphContainer) paragraphContainer.parentNode.removeChild(paragraphContainer);
                                        var indexTitle = that.Objects.IndexTitles[titleId];
                                        if (indexTitle != null) indexTitle.remove_child(paragraphId);

                                        that.set_paragraphs_sort_button_visibility(titleId);

                                        that.Objects.Titles[titleId].Paragraphs[paragraphId] = null;

                                        that.set_no_paragraph_button(titleId);
                                    });
                                }
                            }
                        });
                    });
                });
            }

            if (paragraph.Editable === true) {
                var _set_editor_data = function (editor, data) {
                    AdvancedTextArea.replace_markups(data, {
                        IgnoreBreaks: true, IgnoreURLs: true, Done: function (text) { editor.set_data(text); }
                    });
                }

                elems["cancelButton"].onclick = function () {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToExitEditMode, function (result) {
                        if (result) change_mode(true);
                    });
                }

                elems["saveButton"].onclick = function () {
                    if (bodyTextEditDiv.__Processing) return;

                    paragraphContainer.Editing = false;

                    var _title = GlobalUtilities.trim(paragraphContainer.TitleEditArea.value);

                    var _bodyText = GlobalUtilities.trim(!(paragraphContainer.BodyEditArea || {}).get_data ? "" :
                        paragraphContainer.BodyEditArea.get_data());

                    GlobalUtilities.block(paragraphContainer);

                    WikiAPI.ModifyParagraph({
                        ParagraphID: paragraphId, Title: Base64.encode(_title),
                        BodyText: Base64.encode(_bodyText), OwnerID: that.Objects.OwnerID, OwnerType: that.Objects.OwnerType,
                        CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                return GlobalUtilities.unblock(paragraphContainer);
                            }

                            _title = Base64.decode((result.Paragraph || {}).Title) || _title;
                            _bodyText = Base64.decode((result.Paragraph || {}).BodyText) || _bodyText;

                            if (result.Change) {
                                var changeJson = that._decode_change(result.Change);
                                var changeElement = that._create_change_area({ Change: changeJson, ContainerDiv: changesArea });

                                var myChange = paragraphContainer.MyChange;
                                if (!myChange) changesArea.appendChild(changeElement);
                                else {
                                    changesArea.insertBefore(changeElement, myChange);
                                    changesArea.removeChild(myChange);
                                }

                                paragraphContainer.MyChange = changeElement;
                            }
                            else {
                                paragraphContainer.add_attached_files(result.AttachedFiles || []);

                                titleLabel.MainContent = paragraph.Title = _title;
                                titleLabel.style.display = paragraph.Title ? "inline-block" : "none";

                                GlobalUtilities.set_text(titleLabel, !paragraph.Title ? "" :
                                    GlobalUtilities.convert_numbers_to_persian(paragraph.Title || ""));

                                bodyTextContainer.innerHTML = "";

                                GlobalUtilities.append_markup_text(bodyTextContainer, _bodyText, {
                                    IsHTML: true,
                                    Done: function (txt, p) {
                                        GlobalUtilities.remove_empty_tags(bodyTextContainer);
                                        that.check_existing_files((p || {}).Tags);
                                    }
                                });

                                bodyTextContainer.MainContent = paragraph.BodyText = _bodyText;

                                var indexTitle = that.Objects.IndexTitles[titleId];
                                if (indexTitle != null) indexTitle.rename_child(paragraphId, _title);
                            }

                            change_mode(true);

                            GlobalUtilities.unblock(paragraphContainer);

                            if (jQuery(contentArea).find('pre code').length > 0) {
                                GlobalUtilities.load_files(["jQuery/highlight/highlight.pack.js"], {
                                    OnLoad: function () {
                                        jQuery(contentArea).find('pre code').each(function (i, block) { hljs.highlightBlock(block); });
                                    }
                                });
                            }
                        }
                    }); //end of 'WikiAPI.ModifyParagraph({'
                }

                add_button(RVDic.Edit, false, function (e) {
                    var editButton = this;

                    paragraphContainer.Editing = true;

                    var _title = titleLabel.MainContent || "";
                    if (!titleEditDiv.EditArea) {
                        titleEditDiv.EditArea = GlobalUtilities.create_nested_elements([
                            {
                                Type: "input", Class: "rv-input", Name: "textInput",
                                Style: "margin-bottom:1rem; width:60%;", InnerTitle: RVDic.Title,
                            }
                        ], titleEditDiv)["textInput"];
                    }

                    var _titleEditArea = paragraphContainer.TitleEditArea = titleEditDiv.EditArea;

                    _titleEditArea.value = _title;

                    var _bodyText = bodyTextContainer.MainContent || "";

                    change_mode(false);

                    if (!bodyTextEditDiv.EditArea) {
                        bodyTextEditDiv.__Processing = true;

                        GlobalUtilities.append_rich_text_editor(bodyTextEditDiv, {
                            EnableTagging: true, EnableUploader: true, EnableCodeHighlighter: true,
                            Upload: {
                                Removable: that.is_admin(),
                                OwnerID: that.Objects.OwnerID,
                                OwnerType: "WikiContent",
                                AttachedFiles: function (callback) { callback(that.Objects.WikiAttachedFiles); },
                                OnUpload: function (uploadedFile) {
                                    uploadedFile.Removable = true;
                                    that.add_uploaded_file(uploadedFile);
                                },
                                OnRemove: function (file) { that.remove_uploaded_file(file); }
                            }
                        }, function (editor) {
                            paragraphContainer.BodyEditArea = bodyTextEditDiv.EditArea = editor;
                            _set_editor_data(editor, _bodyText);
                            bodyTextEditDiv.__Processing = false;
                        });
                    }
                    else _set_editor_data(paragraphContainer.BodyEditArea, _bodyText);
                });

                //if (editMode && editButton != null) editButton.onclick(); ////////////////////////////////////////////
            }

            if (paragraph.Editable === true && that.Options.History && paragraph.AppliedChangesCount > 1)
                add_button(RVDic.EditionsHistory, false, function (e) { that.show_paragraph_editions(paragraphId, { Editable: paragraph.Removable }); });

            add_button(RVDic.Authors, true, function (e) { that.show_authors(paragraphId); });

            var menuElems = GlobalUtilities.create_nested_elements([{ Type: "div", Name: "container", Childs: buttons }]);

            var popupMenu = null;
            var ebmoObj = null;

            var _init_mouse_over = function () {
                popupMenu = GlobalUtilities.popup_menu(elems["fakeDot"], menuElems["container"], {
                    Align: "bottom", LeftOffset: window.RV_RTL ? 26 : -26
                });

                ebmoObj = GlobalUtilities.enable_by_mouse_over(elems["menuButton"], popupMenu.Container, {
                    Started: true, Delay: 100,
                    OnStart: function (d) { popupMenu.Show(d); }, OnEnd: function (d) { popupMenu.Hide(d); }
                });
            }

            elems["menuButton"].onmouseover = function () { this.onmouseover = null; _init_mouse_over(); }
            //end of Create Menu

            paragraphContainer.add_attached_files = function (afs) {
                that._add_attached_files(filesContainer, afs, { Removable: paragraph.Removable });
            }

            paragraphContainer.add_attached_files(attachedFiles);

            if (paragraph.Title) {
                titleLabel.style.display = "inline-block";
                GlobalUtilities.set_text(titleLabel, GlobalUtilities.convert_numbers_to_persian(paragraph.Title || ""));
            }

            GlobalUtilities.append_markup_text(bodyTextContainer, paragraph.BodyText || "", {
                IsHTML: true,
                Done: function (txt, p) {
                    GlobalUtilities.remove_empty_tags(bodyTextContainer);
                    that.check_existing_files((p || {}).Tags);
                }
            });

            bodyTextContainer.MainContent = paragraph.BodyText || "";
            titleLabel.MainContent = paragraph.Title || "";

            paragraphContainer.is_edit_mode = function () {
                return !!(paragraphContainer.BodyEditArea && GlobalUtilities.is_visible(bodyTextEditDiv));
            }

            paragraphContainer.set_data = function (__title, __body, editDataOnly, scrollIfEditMode, p) {
                p = p || {};

                if (paragraphContainer.TitleEditArea) paragraphContainer.TitleEditArea.value = __title;
                if (paragraphContainer.BodyEditArea) {
                    if (p.InsertData) paragraphContainer.BodyEditArea.insert_data(__body);
                    else paragraphContainer.BodyEditArea.set_data(__body);
                }

                if (!editDataOnly) {
                    paragraph.Title = __title;
                    paragraph.BodyText = __body;
                    GlobalUtilities.set_text(titleLabel, paragraph.Title || "");

                    GlobalUtilities.append_markup_text(bodyTextContainer, paragraph.BodyText || "", {
                        IsHTML: true,
                        Done: function () { GlobalUtilities.remove_empty_tags(bodyTextContainer); }
                    });

                    bodyTextContainer.MainContent = paragraph.BodyText;
                    titleLabel.MainContent = paragraph.Title;
                }

                if (scrollIfEditMode && that.Options.AutoScroll && paragraphContainer.BodyEditArea &&
                    GlobalUtilities.is_visible(bodyTextEditDiv)) GlobalUtilities.scroll_into_view(paragraphContainer);

                return paragraphContainer.BodyEditArea && GlobalUtilities.is_visible(bodyTextEditDiv) ? { EditMode: true } : null;
            }

            var changes = paragraph.Changes || [];

            for (var i = 0, lnt = changes.length; i < lnt; ++i) {
                var changeElement = that._create_change_area({ Change: changes[i], ContainerDiv: changesArea });
                if (changes[i].IsExpert !== true) paragraphContainer.MyChange = changeElement;
            }

            that.set_no_paragraph_button(titleId);

            return paragraphContainer;
        },

        _create_title_area: function (params) {
            params = params || {};
            var that = this;

            var titleId = params.TitleID || "";
            var paragraphs = params.Paragraphs || [];

            var titlesArea = that.Interface.TitlesArea;

            var titleContainerDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "_div",
                    Class: (params.Removed ? "rv-border-radius-quarter" : ""),
                    Style: (!params.Removed ? "" : "border-style:dashed; border-width:1px;" +
                        "border-color:red; margin-bottom:0.6rem; padding:0.5rem;")
                }
            ], titlesArea)["_div"];

            titleContainerDiv.IsTitle = true;

            titleContainerDiv.TitleObject = params;

            that.Objects.Titles = that.Objects.Titles || {};
            that.Objects.Titles[titleId] = titleContainerDiv;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:1.5rem 0rem 0.8rem 0rem; font-weight:bolder; position:relative;",
                    Properties: !that.Options.IsAdmin ? null : [
                        { Name: "onmouseover", Value: function () { if (params.RemovedParagraphsCount > 0) elems["removedItemsButton"].style.display = "block"; } },
                        { Name: "onmouseout", Value: function () { elems["removedItemsButton"].style.display = "none"; } }
                    ],
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-8",
                            Style: "padding:0rem 0.3rem; font-size:1.2rem;",
                            Childs: [{ Type: "text", TextValue: (params.Title || ""), Name: "titleNodeId" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-4",
                            Childs: [
                                {
                                    Type: "bottom", Class: "small-12 medium-12 large-12",
                                    Style: "padding-" + RV_RevFloat + ":2rem; position:relative;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "RevTextAlign", Name: "sortButton", Tooltip: RVDic.SortParagraphs,
                                            Style: "position:absolute; bottom:0rem;" + RV_RevFloat + ":0.1rem;" +
                                                "width:2rem; display:none;",
                                            Properties: [{ Name: "onclick", Value: function () { that.sort_dialog(false, { TitleID: titleId }); } }],
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-sort fa-2x rv-icon-button",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 RevTextAlign", Name: "removedItemsButton",
                                            Style: "font-weight:normal; cursor:pointer; color:blue; padding:0rem 0.5rem;" +
                                                "display:none; margin-top:0.3rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.ShowRemovedParagraphs }]
                                        }
                                    ]
                                }
                            ]
                        },
                        { Type: "hr", Class: "small-12 medium-12 large-12" }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "noParagraphButton" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "paragraphsAreaId" }
            ], titleContainerDiv);

            that.Interface.ParagraphsSortButton = that.Interface.ParagraphsSortButton || {};
            that.Interface.ParagraphsSortButton[titleId] = elems["sortButton"];

            titleContainerDiv.NoParagraphButton = elems["noParagraphButton"];

            var paragraphsArea = titleContainerDiv.ParagraphsArea = elems["paragraphsAreaId"];
            for (var i = 0, lnt = paragraphs.length; i < lnt; ++i)
                that._create_paragraph_area({ Paragraph: paragraphs[i], ContainerDiv: paragraphsArea });

            var newPArea = null;

            var addParagraphButtonImage = elems["addParagraphButtonImageId"];
            if (addParagraphButtonImage != null && !params.Removed) {
                addParagraphButtonImage.onclick = function (dontScroll) {
                    if ((newPArea || {}).parentNode) newPArea.parentNode.removeChild(newPArea);
                    newPArea = that._initialize_new_paragraph_area({ TitleID: titleId, ContainerDiv: paragraphsArea });
                    if (dontScroll !== true && that.Options.AutoScroll) GlobalUtilities.scroll_into_view(newPArea);
                }
            }

            elems["removedItemsButton"].onclick = function () {
                var e = elems["removedItemsButton"];

                if (e._Processing) return;
                e._Processing = true;

                e.innerHTML = "";
                GlobalUtilities.loading(e);

                WikiAPI.GetParagraphs({
                    TitleID: titleId, Removed: true, OwnerType: that.Objects.OwnerType, ParseResults: true,
                    ResponseHandler: function (result) {
                        e.parentNode.removeChild(e);
                        if ((result.Paragraphs || []).length == 0) return alert(RVDic.NothingToDisplay);

                        var firstP = null;

                        for (var i = 0, lnt = (result.Paragraphs || []).length; i < lnt; ++i) {
                            var x = that._create_paragraph_area({
                                Paragraph: that._decode_paragraph(result.Paragraphs[i]),
                                ContainerDiv: paragraphsArea
                            });

                            firstP = firstP || x;
                        }

                        if (firstP && that.Options.AutoScroll) GlobalUtilities.scroll_into_view(firstP);
                    }
                });
            };

            that.set_no_paragraph_button(titleId);

            var titleNode = elems["titleNodeId"];
            titleContainerDiv.set_title = function (title) { titleNode.data = title; }

            return titleContainerDiv;
        },

        _create_index: function (titles, params) {
            titles = titles || [];
            params = params || {};
            var that = this;

            var firstT = null;

            for (var i = 0, lnt = titles.length; i < lnt; ++i) {
                var childs = [];

                var paragraphs = titles[i].Paragraphs || [];
                for (var j = 0, len = paragraphs.length; j < len; ++j)
                    childs.push({ ChildID: paragraphs[j].ParagraphID, Title: paragraphs[j].Title });

                var x = that._create_index_title_area({
                    TitleID: titles[i].TitleID, Title: titles[i].Title, Childs: childs,
                    SequenceNumber: titles[i].SequenceNumber, Removable: titles[i].Removable,
                    Removed: titles[i].Removed, Editable: titles[i].Editable
                });

                firstT = firstT || x;
            }

            if (firstT && that.Options.AutoScroll && titles[0].Removed) GlobalUtilities.scroll_into_view(firstT);
        },

        add_titles: function (titles, params) {
            titles = titles || [];
            params = params || {};
            var that = this;

            for (var i = 0, lnt = titles.length; i < lnt; ++i)
                that._create_title_area(titles[i]);

            that._create_index(titles, params);
        },

        show_authors: function (paragraphId) {
            var that = this;

            that.__Authors = that.__Authors || {};

            if (that.__Authors[paragraphId]) return GlobalUtilities.show(that.__Authors[paragraphId]);

            var _div = that.__Authors[paragraphId] = GlobalUtilities.create_nested_elements([{ Type: "div", Name: "_div" }])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            return GlobalUtilities.load_files(["Social/RelatedUsersViewer.js"], {
                OnLoad: function () {
                    new RelatedUsersViewer(_div, {
                        SubjectID: paragraphId, SubjectType: "WikiParagraph",
                        Options: { Constraints: { OwnerType: that.Objects.OwnerType } }
                    });
                }
            });
        },

        show_paragraph_editions: function (paragraphId, params) {
            params = params || {};
            var that = this;

            var editable = params.Editable === true;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "padding:1rem; margin:0rem auto;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            var showed = GlobalUtilities.show(_div);

            var _changes = null;

            var processing = false;

            var apply = function (changeObj) {
                if (processing || !editable) return;
                processing = true;

                WikiAPI.ModifyParagraph({
                    ParagraphID: paragraphId, ChangeID: changeObj.ChangeID,
                    CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;

                        if (result.Succeed) {
                            showed.Close();

                            changeObj.Title = Base64.decode((result.Paragraph || {}).Title) || changeObj.Title;
                            changeObj.BodyText = Base64.decode((result.Paragraph || {}).BodyText) || changeObj.BodyText;

                            that.Objects.Paragraphs[paragraphId].set_data(changeObj.Title, changeObj.BodyText);
                        }
                    }
                });
            }

            var show_change = function (changeObj, nextObj) {
                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "changeArea",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "titleArea",
                                Style: "font-weight:bold; font-size:0.8rem; margin-bottom:0.6rem;"
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyArea" }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; color:green; font-size:0.7rem; margin-top:0.6rem;",
                                Childs: [{ Type: "text", TextValue: changeObj.CreationDate }]
                            },
                            {
                                Type: "div", Name: "changeButton",
                                Style: "display:inline-block; font-size:0.7rem;" +
                                    "margin:0.6rem 1.2rem 0rem 1.2rem; color:gray; cursor:pointer;",
                                Properties: [
                                    { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                    { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                    { Name: "onclick", Value: function () { change_display(); } }
                                ]
                            },
                            {
                                Type: "div",
                                Style: "font-size:0.7rem; margin-top:0.6rem; color:gray; cursor:pointer;" +
                                    "display:" + (editable ? "inline-block" : "none") + ";",
                                Properties: [
                                    { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                    { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                    { Name: "onclick", Value: function () { apply(changeObj); } }
                                ],
                                Childs: [{ Type: "text", TextValue: RVDic.ApplyThisEdition }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 meidum-12 large-12",
                        Childs: nextObj ? [{ Type: "hr", Class: "small-12 medium-12 large-12" }] : null
                    }
                ], _div);

                var _changeDiv = elems["changeArea"];
                var titleArea = elems["titleArea"];
                var bodyArea = elems["bodyArea"];

                var isNormalDisplay = true;

                var normal_display = function () {
                    GlobalUtilities.set_text(titleArea, GlobalUtilities.secure_string(changeObj.Title));

                    GlobalUtilities.append_markup_text(bodyArea, changeObj.BodyText, {
                        IsHTML: true,
                        Done: function () { GlobalUtilities.remove_empty_tags(bodyArea); }
                    });
                }

                var diff_display = function () {
                    if (nextObj) {
                        GlobalUtilities.show_text_changes(titleArea, changeObj.Title, GlobalUtilities.secure_string(nextObj.Title));
                        GlobalUtilities.show_text_changes(bodyArea, changeObj.BodyText, nextObj.BodyText);
                    }
                    else {
                        GlobalUtilities.set_text(titleArea, changeObj.Title);

                        GlobalUtilities.append_markup_text(bodyArea, changeObj.BodyText, {
                            IsHTML: true,
                            Done: function () { GlobalUtilities.remove_empty_tags(bodyArea); }
                        });
                    }
                }

                var change_display = function () {
                    titleArea.innerHTML = bodyArea.innerHTML = "";

                    if (!isNormalDisplay) normal_display();
                    else diff_display();

                    isNormalDisplay = !isNormalDisplay;

                    elems["changeButton"].innerHTML = isNormalDisplay ? RVDic.ShowDifferences : RVDic.ShowNormal;
                }

                change_display();
            }

            WikiAPI.GetParagraphChanges({
                ParagraphID: paragraphId, CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                ResponseHandler: function (result) {
                    _changes = result.Changes || [];

                    if (_changes.length == 0) {
                        showed.Close();
                        return alert(RVDic.NothingToDisplay);
                    }

                    _div.innerHTML = "";

                    for (var i = 0, lnt = _changes.length; i < lnt; ++i)
                        that._decode_change(_changes[i]);

                    for (var i = 0, lnt = _changes.length; i < lnt; ++i)
                        show_change(_changes[i], i == lnt - 1 ? null : _changes[i + 1]);
                }
            });
        },

        _titles_sort_dialog: function () {
            var that = this;

            var sortedTitles = [];
            var arrTitles = [];
            var sortedIds = [];

            var firstTitle = null;
            for (var titleId in (that.Objects.IndexTitles || {})) {
                var tt = that.Objects.IndexTitles[titleId];
                if (!tt || tt.Removed || tt.__IsNotRegisteredYet) continue;
                firstTitle = tt;
                break;
            }
            while (firstTitle && firstTitle.previousSibling) firstTitle = firstTitle.previousSibling;
            while (firstTitle) {
                if (!firstTitle.Removed && !firstTitle.__IsNotRegisteredYet) sortedTitles.push(firstTitle.TitleObject);
                firstTitle = firstTitle.nextSibling;
            }

            for (var i = 0, lnt = sortedTitles.length; i < lnt; ++i) {
                sortedIds.push(sortedTitles[i].TitleID);
                var title = sortedTitles[i].Title;

                arrTitles.push({
                    Type: "div", Tooltip: title,
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder WarmBackgroundColor Ellipsis",
                    Style: "padding:0.5rem 2rem; margin-bottom:0.3rem; font-weight:bold; cursor:move; color:white;" +
                        "direction:" + GlobalUtilities.textdirection(title) + ";",
                    Attributes: [{ Name: "TitleID", Value: sortedTitles[i].TitleID }],
                    Childs: [{ Type: "text", TextValue: title }]
                });
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem; text-align:center;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding:0rem 0.3rem 0.8rem 0.3rem; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic._HelpSortWikiTitles }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 sortable grid",
                            Style: "padding-top:1px;", Name: "itemsArea",
                            Childs: arrTitles
                        },
                        {
                            Type: "div", Class: "small-8 medium-6 large-4 rv-air-button", Name: "confirmButton",
                            Style: "margin:1rem auto 0rem auto; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

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
                    Style: "margin:0.3rem 0rem 0.3rem 0rem; height:2.5rem; background-color:white;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder"
                }
            });

            var processing = false;
            var confirmButtonClicked = false;

            var _get_sorted_list = function () {
                var sortedList = [];
                var iter = elems["itemsArea"].firstChild;
                var counter = 0;

                while (iter) {
                    sortedList.push(iter.getAttribute("TitleID"));
                    ++counter;
                    iter = iter.nextSibling;
                }

                return sortedList;
            }

            var _changed = function () {
                var sl = _get_sorted_list();
                for (var i = 0, lnt = sl.length; i < lnt; ++i)
                    if (sl[i] != sortedIds[i]) return true;
                return false;
            }

            var _do_save = function () {
                if (processing) return;
                processing = true;

                GlobalUtilities.block(elems["confirmButton"]);

                var sortedList = _get_sorted_list();

                //Call API Function
                WikiAPI.SetTitlesOrder({
                    TitleIDs: sortedList.join('|'), OwnerType: that.Objects.OwnerType,
                    CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        //Hold all editor instances
                        var editorInstances = [];
                        for (var instanceId in ((window.CKEDITOR || {}).instances || {})) {
                            var editor = CKEDITOR.instances[instanceId];
                            editorInstances.push({ Editor: editor, Data: editor.get_data() });
                            editor.destroy();
                            CKEDITOR.remove(instanceId);
                        }
                        //end of Hold all editor instances

                        var lastIndexItem = that.Interface.IndexTitlesArea.firstChild;
                        var lastTitleItem = that.Interface.TitlesArea.firstChild;

                        for (var i = 0, lnt = sortedList.length; i < lnt; ++i) {
                            var curItem = that.Objects.IndexTitles[sortedList[i]];
                            var curTitle = that.Objects.Titles[sortedList[i]];

                            if (lastIndexItem != curItem) {
                                if (lastIndexItem) that.Interface.IndexTitlesArea.insertBefore(curItem, lastIndexItem);
                                else that.Interface.IndexTitlesArea.appendChild(curItem);
                            }

                            if (lastTitleItem != curTitle) {
                                if (lastTitleItem) that.Interface.TitlesArea.insertBefore(curTitle, lastTitleItem);
                                else that.Interface.TitlesArea.appendChild(curTitle);
                            }

                            lastIndexItem = curItem.nextSibling;
                            lastTitleItem = curTitle.nextSibling;
                        }

                        //Rebuild all editor instances
                        for (var i = 0, lnt = editorInstances.length; i < lnt; ++i)
                            editorInstances[i].Editor.rebuild(editorInstances[i].Data);
                        //end of Rebuild all editor instances

                        showed.Close();

                        processing = false;
                        GlobalUtilities.unblock(elems["confirmButton"]);
                    }
                });
            }

            elems["confirmButton"].onclick = function () {
                confirmButtonClicked = true;
                if (!_changed()) showed.Close();
                _do_save();
            }
        },

        _paragraphs_sort_dialog: function (params) {
            params = params || {};
            var that = this;

            var titleId = params.TitleID;
            if (!titleId) return;

            var sortedItems = [];
            var arrItems = [];
            var sortedIds = [];

            var firstItem = null;
            for (var paragraphId in (that.Objects.Titles[titleId].Paragraphs || {})) {
                var pg = that.Objects.Titles[titleId].Paragraphs[paragraphId];
                if (!pg || pg.Removed || pg.__IsNotRegisteredYet) continue;
                firstItem = pg;
                break;
            }
            while (firstItem && firstItem.previousSibling) firstItem = firstItem.previousSibling;
            while (firstItem) {
                if (!firstItem.Removed && !firstItem.__IsNotRegisteredYet) sortedItems.push(firstItem.ParagraphObject);
                firstItem = firstItem.nextSibling;
            }

            for (var i = 0, lnt = sortedItems.length; i < lnt; ++i) {
                sortedIds.push(sortedItems[i].ParagraphID);
                var title = sortedItems[i].Title;
                var trimedTitle = GlobalUtilities.trim2pix(title, 300, { Postfix: "..." });

                var _bodyTextArea = that.Objects.Paragraphs[sortedItems[i].ParagraphID].BodyTextArea;
                var bodyText = !_bodyTextArea ? "" : _bodyTextArea.innerText || _bodyTextArea.textContent;
                var trimedBodyText = GlobalUtilities.trim2pix(bodyText, 1200, { Postfix: "..." });

                arrItems.push({
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder WarmBackgroundColor",
                    Style: "padding:0.5rem 1rem; margin-bottom:0.3rem; height:5.5rem; font-weight:bold; cursor:move; color:white;",
                    Attributes: [{ Name: "ParagraphID", Value: sortedItems[i].ParagraphID }],
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 Ellipsis", Tooltip: title,
                            Style: "margin:0.3rem; direction:" + GlobalUtilities.textdirection(bodyText) + ";",
                            Childs: [{ Type: "text", TextValue: title }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:normal; margin-top:0.4rem; margin:0.3rem; text-align:justify;" +
                                "direction:" + GlobalUtilities.textdirection(bodyText) + ";",
                            Childs: [{ Type: "text", TextValue: trimedBodyText }]
                        }
                    ]
                });
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding:0rem 0.3rem 0.8rem 0.3rem; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic._HelpSortWikiParagraphs }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 sortable grid",
                            Style: "padding-top:1px;", Name: "itemsArea",
                            Childs: arrItems
                        },
                        {
                            Type: "div", Class: "small-8 medium-6 large-4 rv-air-button", Name: "confirmButton",
                            Style: "margin:0.8rem auto 0rem auto; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

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
                    Style: "margin:0.3rem 0rem; height:5.5rem; background-color:white;",
                    Class: "small-12 medium-12 large-12 SoftBorder"
                }
            });

            var processing = false;
            var confirmButtonClicked = false;

            var _get_sorted_list = function () {
                var sortedList = [];
                var iter = elems["itemsArea"].firstChild;
                var counter = 0;

                while (iter) {
                    sortedList.push(iter.getAttribute("ParagraphID"));
                    ++counter;
                    iter = iter.nextSibling;
                }

                return sortedList;
            }

            var _changed = function () {
                var sl = _get_sorted_list();
                for (var i = 0, lnt = sl.length; i < lnt; ++i)
                    if (sl[i] != sortedIds[i]) return true;
                return false;
            }

            var _do_save = function () {
                if (processing) return;
                processing = true;

                GlobalUtilities.block(elems["confirmButton"]);

                var sortedList = _get_sorted_list();

                //Call API Function
                WikiAPI.SetParagraphsOrder({
                    ParagraphIDs: sortedList.join('|'), OwnerType: that.Objects.OwnerType,
                    CheckWorkFlowEditPermission: that.Objects.HasWorkFlowEditPermission, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        setTimeout(function () {
                            //Hold all editor instances
                            var editorInstances = [];
                            for (var instanceId in ((window.CKEDITOR || {}).instances || {})) {
                                var editor = CKEDITOR.instances[instanceId];
                                editorInstances.push({ Editor: editor, Data: editor.get_data() });
                                editor.destroy();
                                CKEDITOR.remove(instanceId);
                            }
                            //end of Hold all editor instances

                            var indexParagraphsContainer = that.Objects.IndexTitles[titleId].Paragraphs[sortedList[0]].parentNode;
                            var lastIndexItem = indexParagraphsContainer.firstChild;
                            var paragraphsContainer = that.Objects.Paragraphs[sortedItems[0].ParagraphID].parentNode;
                            var lastParagraphItem = paragraphsContainer.firstChild;

                            for (var i = 0, lnt = sortedList.length; i < lnt; ++i) {
                                var curItem = that.Objects.IndexTitles[titleId].Paragraphs[sortedList[i]];
                                var curParagraph = that.Objects.Titles[titleId].Paragraphs[sortedList[i]];

                                if (lastIndexItem != curItem) {
                                    if (lastIndexItem) indexParagraphsContainer.insertBefore(curItem, lastIndexItem);
                                    else indexParagraphsContainer.appendChild(curItem);
                                }

                                if (lastParagraphItem != curParagraph) {
                                    if (lastParagraphItem) paragraphsContainer.insertBefore(curParagraph, lastParagraphItem);
                                    else paragraphsContainer.appendChild(curParagraph);
                                }

                                lastIndexItem = curItem.nextSibling;
                                lastParagraphItem = curParagraph.nextSibling;
                            }

                            //Rebuild all editor instances
                            for (var i = 0, lnt = editorInstances.length; i < lnt; ++i)
                                editorInstances[i].Editor.rebuild(editorInstances[i].Data);
                            //end of Rebuild all editor instances

                            showed.Close();

                            processing = false;
                            GlobalUtilities.unblock(elems["confirmButton"]);
                        }, 100);
                    }
                });
            }

            elems["confirmButton"].onclick = function () {
                confirmButtonClicked = true;
                if (!_changed()) showed.Close();
                _do_save();
            }
        },

        sort_dialog: function (isTitle, params) {
            var that = this;

            GlobalUtilities.load_files([{ Root: "jQuery/Sortable/", Childs: ["jquery.sortable.css", "jquery.sortable.js"] }], {
                OnLoad: function () {
                    if (isTitle) that._titles_sort_dialog();
                    else that._paragraphs_sort_dialog(params);
                }
            });
        },

        export2pdf: function () {
            var that = this;

            if (that.__ProcessingPDF) return;

            var _do = function (cover, password) {
                cover = cover || {};

                that.__ProcessingPDF = true;
                setTimeout(function () { that.__ProcessingPDF = false; }, 5000);

                var url = WikiAPI.ExportAsPDF({
                    OwnerID: that.Objects.OwnerID,
                    OwnerType: that.Objects.OwnerType,
                    CoverID: cover.FileID,
                    Password: Base64.encode(password)
                });

                GlobalUtilities.open_window({ URL: url });
            };

            that.select_cover(function (cover) {
                if (!that.Objects.HasConfidentiality) _do(cover);
                else {
                    new NameDialog({
                        Title: RVDic.MSG.PasswordNeededToExportFile, InnerTitle: RVDic.Code, ModificationDetection: false,
                        OnActionCall: function (name, callback) {
                            if (name) _do(cover, name);
                            callback(true);
                        }
                    });
                }
            });
        },

        select_cover: function (callback) {
            var that = this;

            if (!(that.Options.PDFCovers || []).length) return callback(null);

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold; margin-bottom:1rem; text-align:center;",
                        Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.DownloadMethod) }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                        Childs: [{}].concat(that.Options.PDFCovers).map(function (cvr) {
                            return {
                                Type: "div", Style: "margin:0.5rem 0; padding:0.5rem; text-align:center; cursor:pointer;",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                                Properties: [{ Name: "onclick", Value: function () { showed.Close(); callback(cvr); } }],
                                Childs: [
                                    { Type: "text", TextValue: (cvr || {}).FileName ? RVDic.DownloadWithCover : RVDic.Download },
                                    (!(cvr || {}).FileName ? null : {
                                        Type: "div", Class: "rv-border-radius-quarter rv-air-button-base rv-air-button-black",
                                        Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.6rem;",
                                        Childs: [{ Type: "text", TextValue: Base64.decode(cvr.FileName) }]
                                    })
                                ]
                            };
                        })
                    }
                ]
            }]);

            var showed = GlobalUtilities.show(elems["container"]);
        }
    }
})();