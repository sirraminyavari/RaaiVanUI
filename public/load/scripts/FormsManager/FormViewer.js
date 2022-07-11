(function () {
    if (window.FormViewer) return;

    window.FormViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.InitialParams = GlobalUtilities.extend({}, params || {});

        this.Interface = {
            Header: null,
            Footer: null,
            Editing: false,
            EditButton: null,
            FilledButton: null,
            ImportButton: null,
            FooterSaveButton: null,
            ElementsArea: null,
            ButtonsArea: null,
            Statistics: null
        };

        this.Objects = {
            InstanceID: params.InstanceID,
            RefInstanceID: params.RefInstanceID,
            PollID: params.PollID,
            Poll: params.Poll,
            PollOwnerType: params.PollOwnerType,
            FormID: params.FormID,
            IsDirector: null,
            IsSystemAdmin: null,
            LimitOwnerID: params.LimitOwnerID,
            EnforceLimits: !!params.EnforceLimits,
            Filled: false,
            Elements: [],
            IsWorkFlowAdmin: params.IsWorkFlowAdmin,
            CreatorUserID: params.CreatorUserID
        };
        
        this.Options = {
            ElementsToShow: params.Elements,
            ShowAllIfNoLimit: params.ShowAllIfNoLimit === true,
            PollAbstract: params.PollAbstract === true,
            Editable: params.Editable,
            FillButton: params.FillButton === false ? false : true,
            FooterSaveButton: (params.Editable === true) && (params.FooterSaveButton === true),
            ElementsEditable: params.ElementsEditable === true,
            Exportable: params.Exportable === true,
            HasConfidentiality: params.HasConfidentiality === true,
            UnlimitedDownloadAccess: params.UnlimitedDownloadAccess,
            PDFCovers: params.PDFCovers || [],
            HideHeader: params.HideHeader === true,
            HideEmptyElements: params.HideEmptyElements === true,
            HideTitle: params.HideTitle === true,
            HideDescription: params.HideDescription === true,
            FontSize: params.FontSize || "small",
            CheckUniqueConstraints: params.CheckUniqueConstraints === true,
            CloseOnFill: params.CloseOnFill === false ? false : true,
            OnInit: params.OnInit,
            OnFill: params.OnFill,
            OnUnfill: params.OnUnfill,
            OnEditStateChange: params.OnEditStateChange,
            OnNoElementDetect: params.OnNoElementDetect,
            OnAfterSave: params.OnAfterSave,
            OnAfterElementSave: params.OnAfterElementSave,
            OnFormImport: params.OnFormImport
        };
        
        var that = this;
        
        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["FGAPI", "UsersAPI", "DocsAPI"] },
            "AdvancedTextArea/AdvancedTextArea.js",
            "FormsManager/FormElementTypes.js",
            "Public/NameDialog.js"
        ], {
            OnLoad: function () {
                if (!that.Objects.InstanceID && that.Objects.PollID) that._preinit_poll_abstract();
                else that._preinit();
            }
        });
    }

    FormViewer.prototype = {
        _preinit: function () {
            var that = this;

            if (that.Options.ElementsToShow) {
                that._initialize({ Elements: that.Options.ElementsToShow });
            }
            else if (that.Objects.FormID && !that.Objects.InstanceID) {
                FGAPI.GetFormElements({
                    FormID: that.Objects.FormID, ParseResults: true,
                    ResponseHandler: function (result) {
                        that._initialize(result);
                    }
                });
            }
            else {
                FGAPI.GetFormInstance({
                    InstanceID: that.Objects.InstanceID,
                    LimitOwnerID: that.Objects.LimitOwnerID,
                    EnforceLimits: that.Objects.EnforceLimits,
                    ShowAllIfNoLimit: that.Options.ShowAllIfNoLimit,
                    PollAbstract: that.Options.PollAbstract,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        that.Objects.FormID = result.FormID;
                        if (result.PollID) that.Objects.PollID = result.PollID;

                        //set abstracts if exist
                        var abstractDic = that._get_abstract_dic(result.PollAbstract);

                        for (var i = 0, lnt = (result.Elements || []).length; i < lnt; ++i)
                            that._set_poll_abstract(result.Elements[i], abstractDic);
                        //end of set abstracts if exist

                        that._initialize(GlobalUtilities.extend(result || {}, { Statistics: (result.PollAbstract || {}).Statistics }));
                    }
                });
            }
        },

        _preinit_poll_abstract: function () {
            var that = this;

            that.Options.Editable = false;
            that.Options.FillButton = false;

            FGAPI.GetPollAbstract({
                PollID: that.Objects.PollID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.Poll) that.Objects.Poll = result.Poll;
                    
                    var elements = [];

                    for (var i = 0, lnt = (result.Items || []).length; i < lnt; ++i) {
                        var abs = result.Items[i];

                        elements.push(abs.Element);

                        elements[i].Abstract = GlobalUtilities.extend({}, {
                            ValuesCount: abs.Count,
                            DistinctValuesCount: (abs.Abstract || {}).DistinctValuesCount,
                            Values: (abs.Abstract || {}).Values,
                            Min: (abs.Abstract || {}).Min,
                            Max: (abs.Abstract || {}).Max,
                            Avg: (abs.Abstract || {}).Avg,
                            Var: (abs.Abstract || {}).Var,
                            StDev: (abs.Abstract || {}).StDev
                        });
                    }

                    that._initialize({ Elements: elements, Statistics: result.Statistics });
                }
            });
        },

        _initialize: function (params) {
            params = params || {};
            var that = this;
            
            that.Objects.IsDirector = params.IsDirector === true;
            that.Objects.IsSystemAdmin = params.IsSystemAdmin === true;
            that.Objects.Filled = params.Filled === true;
            
            if ((that.Objects.IsDirector || that.Objects.IsSystemAdmin) &&
                (GlobalUtilities.get_type(that.Options.Editable) != "boolean")) {
                that.Options.HideEmptyElements = false;
                that.Options.Editable = true;
            }

            that.ContainerDiv.innerHTML = "";
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "padding:1rem;",
                Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "header",
                        Style: (that.Options.HideHeader === true ? "display:none;" : "")
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "elementsArea" },
                    {
                        Type: "div", Name: "statistics",
                        Class: "small-12 medium-12 large-12 rv-border-radius-half WarmBackgroundColor",
                        Style: "margin-bottom:1rem; text-align:center; padding:0.5rem; display:none;"
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "footer",
                        Childs: [{
                            Type: "div", Name: "footerSaveButton",
                            Class: "small-8 medium-6 large-4 rv-air-button rv-circle",
                            Style: "margin:1rem auto 0rem auto; padding:0.5rem; font-weight:bold;" +
                                (that.Options.FooterSaveButton ? "" : "display:none;"),
                            Properties: [{ Name: "onclick", Value: function () { that.onedit(); } }],
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-floppy-o fa-lg",
                                    Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.Save }
                            ]
                        }]
                    }
                ]
            }], that.ContainerDiv);

            that.Interface.Header = elems["header"];
            that.Interface.Footer = elems["footer"];
            that.Interface.ElementsArea = elems["elementsArea"];
            that.Interface.FooterSaveButton = elems["footerSaveButton"];
            that.Interface.Statistics = elems["statistics"];

            that.create_header(params);
            if (that.Options.FillButton === false) that.Interface.FilledButton.style.display = "none";

            that.set_form_statistics(params.Statistics);

            var elements = params.Elements || [];
            var showEmptyMessage = true;
            for (var i = 0, lnt = elements.length; i < lnt; ++i) {
                if ((that.Options.HideEmptyElements || elements[i].IsWorkFlowField) && that.isempty(elements[i])) continue;
                that.add_element(elements[i]);
                showEmptyMessage = false;
            }

            if (showEmptyMessage) {
                that.Interface.ElementsArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:center; font-weight:bold; margin:0.5rem 0rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                    }
                ], that.Interface.ElementsArea);

                if (that.Options.OnNoElementDetect) that.Options.OnNoElementDetect();
            }

            if (that.Options.OnInit) setTimeout(function () {
                that.Options.OnInit.call(that, { Elements: params.Elements });
            }, 1000);
        },

        import_enabled: function (elements) {
            var that = this;
            
            if (!that.Objects.FormID || !that.Options.Editable || that.Objects.PollID || !(elements || []).length) return false;
            else return (elements || []).some(function (e) { return !!e.Name; });
        },

        show_poll_summary: function () {
            var that = this;
            return (that.Objects.IsWorkFlowAdmin === true) || 
                ((that.Objects.Poll || {}).ShowSummary === true) || (!that.Objects.InstanceID && that.Objects.PollID);
        },

        hide_poll_contributors: function () {
            var that = this;
            return (that.Objects.IsWorkFlowAdmin !== true) && ((that.Objects.Poll || {}).HideContributors === true);
        },

        set_form_statistics: function (statistics) {
            var that = this;
            statistics = statistics || {};
            
            if (!that.Interface.Statistics || !that.show_poll_summary()) return;

            jQuery(that.Interface.Statistics).fadeOut(500, function () {
                that.Interface.Statistics.innerHTML = "";

                if (!statistics.WeightSum && !statistics.Sum && !statistics.WeightedSum && !statistics.Avg &&
                    !statistics.WeightedAvg && !statistics.Min && !statistics.Max && !statistics.Var && !statistics.StDev) return;

                if (!(+statistics.WeightSum))
                    that.add_number(that.Interface.Statistics, { Title: RVDic.Min, Value: statistics.Min });
                if (!(+statistics.WeightSum))
                    that.add_number(that.Interface.Statistics, { Title: RVDic.Max, Value: statistics.Max });
                if (!(+statistics.WeightSum))
                    that.add_number(that.Interface.Statistics, { Title: RVDic.Sum, Value: statistics.Sum });
                that.add_number(that.Interface.Statistics, { Title: RVDic.Average, Value: statistics.WeightedAvg });
                if (!(+statistics.WeightSum))
                    that.add_number(that.Interface.Statistics, { Title: RVDic.Variance, Value: statistics.Var });
                if (!(+statistics.WeightSum))
                    that.add_number(that.Interface.Statistics, { Title: RVDic.StandardDeviation, Value: statistics.StDev });

                jQuery(that.Interface.Statistics).fadeIn(500);
            });
        },

        _get_abstract_dic: function (pollAbstract) {
            var that = this;

            if (!that.show_poll_summary()) return {};

            var dic = {};

            var pollAbstractItems = (pollAbstract || {}).Items || [];
            for (var i = 0, lnt = pollAbstractItems.length; i < lnt; ++i)
                dic[(pollAbstractItems[i].Element || {}).ElementID] = pollAbstractItems[i];

            return dic;
        },

        _set_poll_abstract: function (element, abstractDic) {
            var that = this;

            if (!that.Options.PollAbstract || !that.show_poll_summary()) return;
            
            var abs = abstractDic[element.RefElementID || element.ElementID];

            if (!abs) element.Abstract = { ValuesCount: 0, DistinctValuesCount: 0, Values: [] };
            else {
                element.Abstract = GlobalUtilities.extend({}, {
                    ValuesCount: abs.Count,
                    DistinctValuesCount: (abs.Abstract || {}).DistinctValuesCount,
                    Values: (abs.Abstract || {}).Values,
                    Min: (abs.Abstract || {}).Min,
                    Max: (abs.Abstract || {}).Max,
                    Avg: (abs.Abstract || {}).Avg,
                    Var: (abs.Abstract || {}).Var,
                    StDev: (abs.Abstract || {}).StDev
                });
            }
        },

        _set_edit_icon: function (isEditMode) {
            var that = this;

            var editButton = this.Interface.EditButton;
            var filledButton = this.Interface.FilledButton;
            _obj = this.Objects;
            _obj.Editing = isEditMode;

            if (that.Interface.FooterSaveButton)
                jQuery(that.Interface.FooterSaveButton)[isEditMode && that.Options.FooterSaveButton ? "fadeIn" : "fadeOut"](0);

            var editIcon = _obj.Editing ? " fa-floppy-o " : " fa-pencil ";
            var filledIcon = _obj.Editing ? " fa-times-circle-o " : " fa-check-circle-o ";

            editButton.setAttribute("class", "fa" + editIcon + "fa-2x rv-icon-button");
            filledButton.setAttribute("class", "fa" + filledIcon + "fa-2x rv-icon-button");

            filledButton.style.display = _obj.Editing || this.Options.FillButton !== false ? "inline-block" : "none";

            GlobalUtilities.append_tooltip(editButton, _obj.Editing ? RVDic.Save : RVDic.Edit);
            GlobalUtilities.append_tooltip(filledButton, _obj.Editing ? "لغو تغییرات" : "پایان ویرایش");
        },

        _set_elements_fill: function (filled) {
            var elements = this.Objects.Elements || [];
            for (var i = 0, lnt = elements.length; i < lnt; ++i) {
                if (elements[i] && elements[i].BodyTextManager) {
                    if (filled === true) {
                        elements[i].BodyTextManager.goto_view_mode();
                        elements[i].BodyTextManager.set_as_filled();
                    }
                    else
                        elements[i].BodyTextManager.set_as_not_filled();
                }
            }
        },

        set_as_filled: function (params) {
            params = params || {};

            this.Objects.Filled = true;
            if (this.Interface.EditButton) this.Interface.EditButton.style.display = "none";
            if (this.Interface.FilledButton) this.Interface.FilledButton.style.display = "none";
            if (this.Options.OnFill && params.OnFill !== false) this.Options.OnFill();
            this._set_elements_fill(true);

            FGAPI.OnFormFill(this.Objects.InstanceID);

            if (this.Options.CloseOnFill === true && params.OnFill !== false) {
                GlobalUtilities.confirm("فرم با موفقیت تایید شد. آیا می خواهید صفحه را ترک کنید؟", function (result) {
                    if (result) window.close();
                });
            }
        },

        set_as_not_filled: function () {
            this.Objects.Filled = false;
            if (this.Interface.EditButton) this.Interface.EditButton.style.display = "inline-block";
            if (this.Interface.FilledButton) this.Interface.FilledButton.style.display = "inline-block";
            if (this.Options.OnFill) this.Options.OnUnfill();
            this._set_elements_fill(false);
        },

        save_elements: function (elements, params) {
            params = params || { ContainerDiv: null, OnSucceed: null };
            var that = this;

            var _els = [];
            var _elsToClear = [];

            var valuesDic = {}, erredElementIds = {};

            for (var i = 0, lnt = (elements || []).length; i < lnt; ++i) {
                var _data = valuesDic[elements[i].Data.ElementID] =
                    (((elements[i] || {}).BodyTextManager || {}).get_data || function () { })();

                if ((_data === false) || ((_data || {}).Result === false)) {
                    erredElementIds[elements[i].Data.ElementID] = true;

                    if (params.IgnoreInvalidInputs) continue;
                    else if ((_data || {}).Message) alert(RVDic.MSG[_data.Message] || _data.Message);
                    else if ((elements[i].Data || {}).Necessary === true) alert(RVDic.PleaseFillNecessaryFields);
                    return;
                }
                else if (!_data) {
                    //return alert(RVDic.InputDataIsNotValid);
                    if (elements[i].Data.ElementID) _elsToClear.push(elements[i].Data.ElementID);
                    continue;
                }

                _els.push({
                    ElementID: elements[i].Data.ElementID,
                    InstanceID: that.Objects.InstanceID,
                    RefElementID: elements[i].Data.RefElementID,
                    Title: elements[i].Data.Title,
                    SequenceNumber: elements[i].Data.SequenceNumber,
                    Filled: elements[i].Data.Filled,
                    Type: elements[i].Data.Type,
                    Info: elements[i].Data.Info,
                    TextValue: _data.TextValue,
                    FloatValue: _data.FloatValue,
                    BitValue: _data.BitValue,
                    DateValue: _data.DateValue,
                    GuidItems: _data.GuidItems,
                    Files: _data.Files
                });
            }
            
            if ((_els.length == 0) && (_elsToClear.length == 0)) return;

            var _conDiv = params.ContainerDiv || that.ContainerDiv;

            var _do_save = function () {
                GlobalUtilities.block(_conDiv);
                
                FGAPI.SaveFormInstanceElements({
                    Elements: _els, ElementsToClear: _elsToClear.join('|'),
                    PollID: that.Options.PollAbstract ? that.Objects.PollID : null,
                    PollOwnerType: that.Objects.PollOwnerType, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText)
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            var filledElements = result.FilledElements || [];
                            
                            var abstractDic = that._get_abstract_dic(result.PollAbstract);
                            that.set_form_statistics((result.PollAbstract || {}).Statistics);

                            (elements || []).forEach(elem => {
                                that._set_poll_abstract(elem.Data, abstractDic);

                                var filledElem = filledElements.filter(e => e.ElementID == elem.Data.ElementID);
                                filledElem = filledElem.length == 1 ? filledElem[0] : null;

                                if (filledElem) {
                                    elem.Data.ElementID = filledElem.NewElementID;
                                    elem.Data.RefElementID = filledElem.ElementID;
                                    elem.Data.Filled = true;
                                }

                                var resElem = (result.Elements || []).filter(x => x.ElementID == elem.Data.ElementID ||
                                    x.ElementID == elem.Data.RefElementID);
                                resElem = resElem.length == 1 ? that.parse_element(resElem[0]) : null;
                                
                                if (resElem) {
                                    elem.Data.TextValue = resElem.TextValue;
                                    elem.Data.FloatValue = resElem.FloatValue;
                                    elem.Data.BitValue = resElem.BitValue;
                                    elem.Data.DateValue = resElem.DateValue;
                                    elem.Data.GuidItems = resElem.GuidItems;
                                    elem.Data.Files = resElem.Files || [];
                                    elem.BodyTextManager.set_data();
                                }
                            });

                            for (var i = 0, lnt = (elements || []).length; i < lnt; ++i) {
                                if (erredElementIds[elements[i].Data.ElementID]) continue;

                                elements[i].BodyTextManager.editing_done();
                                elements[i].Value =
                                    valuesDic[elements[i].Data.ElementID] || valuesDic[elements[i].Data.RefElementID];
                            }
                            
                            if (params.OnSucceed) params.OnSucceed({ Erred: erredElementIds });
                        }

                        GlobalUtilities.unblock(_conDiv);
                    }
                });
            };

            if (!that.Objects.PollID || !_elsToClear.length) _do_save();
            else {
                var msg = GlobalUtilities.convert_numbers_to_persian(RVDic.Confirms.YouHaveNotAnsweredNQuestionsOfThePoll.replace("[n]", _elsToClear.length));
                GlobalUtilities.confirm(msg, function (r) { if (r) _do_save(); });
            }
        },

        create_header: function (params) {
            params = params || {};
            var that = this;
            
            var title = Base64.decode(params.Title || "");
            var description = Base64.decode((that.Objects.Poll || {}).Description || params.Description || "");
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 mdium-12 large-12",
                    Style: "position:relative; padding-" + RV_RevFloat + ":7.5rem; min-height:2rem;",
                    Childs: [
                        {
                            Type: "div", Class: "RevDirection RevTextAlign rv-not-printable",
                            Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; width:11rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Style: "margin-" + RV_Float + ":1rem;" +
                                        "display:" + (that.Options.Editable ? "inline-block" : "none") + ";",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "i", Class: "fa fa-check-circle-o fa-2x rv-icon-button", Name: "filledButton",
                                    Style: "margin-" + RV_Float + ":1rem;" +
                                        "display:" + (that.Options.Editable ? "inline-block" : "none") + ";",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "i", Tooltip: RVDic.XMLDataImport, Name: "importButton",
                                    Class: "fa fa-upload fa-2x rv-icon-button",
                                    Style: "margin-" + RV_Float + ":1rem;" +
                                        "display:" + (that.import_enabled(params.Elements) ? "inline-block" : "none") + ";",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                (!that.Options.Exportable ? null : {
                                    Type: "i", Tooltip: RVDic.ExportToPDF, Name: "exportButton",
                                    Class: "fa fa-file-pdf-o fa-2x rv-icon-button",
                                    Style: "margin-" + RV_Float + ":1rem; display:inline-block;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                })
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; margin-bottom:0.4rem;" + (that.Options.HideTitle ? "display:none;" : ""),
                            Childs: [{ Type: "text", TextValue: title }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea",
                            Style: "margin-bottom:0.5rem; text-align:justify;" +
                                (that.Options.HideDescription ? "display:none;" : "")
                        }
                    ]
                },
                { Type: "hr", Class: "small-12 medium-12 large-12" }
            ], that.Interface.Header);

            GlobalUtilities.append_markup_text(elems["descriptionArea"], description);

            var editButton = elems["editButton"];
            var filledButton = elems["filledButton"];
            var importButton = elems["importButton"];
            var exportButton = elems["exportButton"];

            this.Interface.EditButton = editButton;
            this.Interface.FilledButton = filledButton;
            this.Interface.ImportButton = importButton;

            GlobalUtilities.append_tooltip(editButton, RVDic.Edit);
            GlobalUtilities.append_tooltip(filledButton, RVDic.EditingDone);

            var _on_filled = function () {
                editButton.style.display = "none";
                filledButton.style.display = "none";
            };

            if (that.Objects.Filled === true) this.set_as_filled({ OnFill: false });

            filledButton.onclick = function () {
                if (that.Objects.Editing) {
                    for (var i = 0, lnt = (that.Objects.Elements || []).length; i < lnt; ++i) {
                        that.Objects.Elements[i].BodyTextManager.goto_view_mode();
                        that.Objects.Elements[i].BodyTextManager.set_data();
                    }

                    return that._set_edit_icon(false);
                }

                if (filledButton.__Filling) return;

                GlobalUtilities.confirm("در صورت ادامه، این فرم قابل تغییر نخواهد بود. آیا مایلید ادامه دهید؟", function (result) {
                    if (!result) return;

                    filledButton.__Filling = true;

                    FGAPI.SetFormInstanceAsFilled({
                        InstanceID: that.Objects.InstanceID,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else that.set_as_filled();
                        }
                    });
                });
            };

            editButton.onclick = function () { that.onedit(); };

            importButton.onclick = function () { that.import_dialog({ Elements: params.Elements }); };

            if (exportButton) exportButton.onclick = function () {
                if (that.__ProcessingPDF) return;

                var _do = function (cover, password) {
                    cover = cover || {};

                    that.__ProcessingPDF = true;
                    setTimeout(function () { that.__ProcessingPDF = false; }, 5000);

                    var url = FGAPI.ExportAsPDF({
                        InstanceID: that.Objects.InstanceID,
                        LimitOwnerID: that.Objects.LimitOwnerID,
                        CoverID: cover.FileID,
                        Password: Base64.encode(password)
                    });

                    GlobalUtilities.open_window({ URL: url });
                };

                that.select_cover(function (cover) {
                    if (!that.Options.HasConfidentiality) _do(cover);
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
            };
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
        },

        goto_edit_mode: function () {
            var that = this;

            if (!that.Options.Editable) return;

            (that.Objects.Elements || [])
                .filter(elem => !elem.BodyTextManager.is_edit_mode() && !elem.Data.IsWorkFlowField)
                .forEach(elem => {
                    elem.BodyTextManager.goto_edit_mode();
                    elem.BodyTextManager.set_data();
                });

            that.Objects.Editing = true;
            that._set_edit_icon(that.Objects.Editing);
            
            if (that.Options.OnEditStateChange) that.Options.OnEditStateChange({ IsEditState: that.Objects.Editing });
        },

        onedit: function (callbackData, options) {
            var that = this;
            options = options || {};
            
            var set_things = function (p) {
                p = p || {};

                (that.Objects.Elements || [])
                    .filter(elem => !(p.Erred || {})[elem.Data.ElementID] && !elem.Data.IsWorkFlowField)
                    .forEach(elem => {
                        if (that.Objects.Editing) elem.BodyTextManager.goto_edit_mode();
                        else if (!that.Options.ElementsEditable) elem.BodyTextManager.goto_view_mode();

                        elem.BodyTextManager.set_data();
                    });

                that._set_edit_icon(that.Objects.Editing);

                if (that.Options.OnEditStateChange) that.Options.OnEditStateChange({ IsEditState: that.Objects.Editing });
            };
            
            if (that.Objects.Editing === true) {
                var elements = (that.Objects.Elements || []).filter(e => e.BodyTextManager.is_edit_mode());
                var formElems = (that.Objects.Elements || []).filter(e => e.Data.Type == "Form");
                
                if (!elements.length) {
                    if (formElems.length && that.Options.OnAfterSave)
                        that.Options.OnAfterSave.call(that, elements, callbackData);
                    return;
                }
                
                that.save_elements(elements, {
                    IgnoreInvalidInputs: options.IgnoreInvalidInputs,
                    ContainerDiv: that.ContainerDiv,
                    OnSucceed: function (p) {
                        that.Objects.Editing = false;
                        set_things(p);
                        if (that.Options.OnAfterSave) that.Options.OnAfterSave.call(that, elements, callbackData);
                    }
                });
            }
            else {
                that.Objects.Editing = true;
                set_things();
            }
        },

        isempty: function (element) {
            return ((FormElementTypes[element.Type || ""] || {}).isempty || function () { return false; })(element);
        },

        has_empty_necessary_element: function () {
            var that = this;
            for (var i = 0, lnt = (that.Objects.Elements || []).length; i < lnt; ++i)
                if (that.isempty(that.Objects.Elements[i].Data) && that.Objects.Elements[i].Data.Necessary === true) return true;
            return false;
        },

        parse_element: function (element) {
            if (!element) return element;

            element.Info = JSON.parse(Base64.decode(element.Info) || "{}");
            element.Title = Base64.decode(element.Title);
            element.Name = Base64.decode(element.Name);
            element.Help = GlobalUtilities.trim(Base64.decode(element.Help));
            element.TextValue = Base64.decode(element.TextValue);
            jQuery.each(element.GuidItems || [], function (ind, val) { val.Name = Base64.decode(val.Name); });

            return element;
        },

        add_element: function (element) {
            var that = this;

            if (element.Type == "Separator") return that.add_separator(element);
            var isFormType = element.Type == "Form";

            if (!that.Options.CheckUniqueConstraints) element.UniqueValue = false;

            element.InstanceID = element.InstanceID || that.Objects.InstanceID;
            that.parse_element(element);
            
            var helpTip = GlobalUtilities.get_text_begining(element.Help, 200, "...");

            var valuesCount = (element.Abstract || {}).ValuesCount;
            var editionsCount = element.EditionsCount;
            
            var showEditButton = that.Options.Editable && that.Options.ElementsEditable &&
                !isFormType && !element.IsWorkFlowField;
            var hint = null;
            
            var creatorUserId = (element.Creator || {}).UserID;
            var creatorFullName = GlobalUtilities.trim((Base64.decode((element.Creator || {}).FirstName) || " ") + " " +
                (Base64.decode((element.Creator || {}).LastName) || " "));
            var showCreator = creatorUserId && creatorFullName && (!editionsCount || editionsCount == 1) &&
                showEditButton && that.Objects.CreatorUserID && (creatorUserId != that.Objects.CreatorUserID);
            
            if (that.Options.Editable && isFormType) hint = RVDic.AnyChangeWillBeSaved;
            else if (element.UniqueValue) hint = RVDic.UniqueValue;

            var isNecessary = that.Options.Editable && (element.Necessary === true);
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "padding:0.5rem; margin-bottom:0.5rem;", Name: "elementDiv",
                Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-quarter",
                Tooltip: (element.Necessary === true ? RVDic.Necessary : null), TooltipAlign: RV_Float,
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "position:relative; margin-bottom:0.5rem; padding-" + RV_Float + ":" +
                            (!that.Options.Editable || !that.Options.ElementsEditable ? 0 : 2) + "rem;",
                        Childs: [
                            {
                                Type: "div", Class: "rv-not-printable",
                                Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; width:2rem;",
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton",
                                        Style: (!showEditButton ? "display:none;" : ""),
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Name: "titleArea",
                                Style: "display:inline-block; text-align:justify; font-weight:bold;"
                            },
                            (!isNecessary ? null : {
                                Type: "div", Name: "necessaryArea",
                                Style: "display:inline-block; font-weight:bold; color:red; margin:0rem 0.3rem;",
                                Childs: [{ Type: "text", TextValue: "*" }]
                            }),
                            (!element.Help ? null : {
                                Type: "i", Class: "fa fa-question-circle-o fa-lg rv-icon-button", Name: "helpButton", Tooltip: helpTip,
                                Style: "margin-" + RV_Float + ":" + (isNecessary ? "0.2" : "0.5") + "rem; cursor:pointer;",
                                Attributes: [{ Name: "aria-hidden", Value: true }],
                                Properties: [{ Name: "onclick", Value: function () { that.show_help(elems["helpButton"], element.Help); } }]
                            }),
                            {
                                Type: "div", Name: "hintArea",
                                Class: "rv-tab-selected rv-border-radius-quarter",
                                Style: "display:" + (!hint ? "none" : "inline-block") + "; color:rgb(200, 50, 50);" +
                                    "margin-" + RV_Float + ":0.5rem; font-size:0.6rem; cursor:default; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: hint }]
                            },
                            {
                                Type: "div", Class: "rv-air-button rv-border-radius-half", Name: "peopleCount",
                                Style: "margin-" + RV_Float + ":0.5rem; padding:0rem 1rem; font-size:0.7rem;" +
                                    "display:" + (!isNaN(valuesCount) && (valuesCount > 0) ? "inline-block" : "none") + ";" +
                                    (that.hide_poll_contributors() ? "cursor:default;" : ""),
                                Childs: [{ Type: "text", TextValue: RVDic.NPeople.replace("[n]", valuesCount) }]
                            },
                            {
                                Type: "div", Name: "editionsCount",
                                Class: "rv-air-button-base rv-air-button-black rv-border-radius-half",
                                Style: "margin-" + RV_Float + ":0.5rem; padding:0rem 1rem; font-size:0.7rem;" +
                                    "display:" + (!isNaN(editionsCount) && (editionsCount > 1) && that.Options.Editable ? "inline-block" : "none") + ";",
                                Childs: [{ Type: "text", TextValue: RVDic.EditionsHistory + " (" + editionsCount + ")" }]
                            },
                            (!showCreator ? null : {
                                Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-half",
                                Style: "margin-" + RV_Float + ":0.5rem; padding:0rem 1rem; font-size:0.7rem; display:inline-block;",
                                Properties: [{ Name: "onclick", Value: function (e) { GlobalUtilities.link_click(e, RVAPI.UserPageURL({ UserID: creatorUserId })); } }],
                                Childs: [{ Type: "text", TextValue: RVDic.Author + ": " + creatorFullName }]
                            })
                        ]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyTextArea" }
                ]
            }], that.Interface.ElementsArea);

            GlobalUtilities.append_markup_text(elems["titleArea"], element.Title);

            that.Objects.Elements.push({
                Data: element,
                ContainerDiv: elems["elementDiv"],
                BodyTextManager: that.create_body_text_area(elems["bodyTextArea"], element, { EditButton: elems["editButton"] })
            });

            that._set_people_count_button_click(elems["peopleCount"], element);

            that._set_editions_count_button_click(elems["editionsCount"], element);
        },

        show_help: function (button, help) {
            var that = this;
            
            if (button.HelpContainer) return GlobalUtilities.show(button.HelpContainer);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; font-size:1rem; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Help }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center;", Name: "help" }
                    ]
                }
            ]);

            button.HelpContainer = elems["container"];

            GlobalUtilities.append_markup_text(elems["help"], help);

            GlobalUtilities.show(elems["container"]);
        },

        add_separator: function (element) {
            var that = this;

            element.Title = Base64.decode(element.Title || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "titleArea",
                    Class: "small-12 medium-12 large-12 rv-circle WarmBackgroundColor",
                    Style: "padding:0.5rem 3rem; margin-bottom:0.5rem; text-align:center;" +
                        "font-weight:bold; font-size:0.8rem; color:white;"
                }
            ], that.Interface.ElementsArea);

            GlobalUtilities.append_markup_text(elems["titleArea"], element.Title);
        },

        _set_people_count_button_click: function (btn, element) {
            var that = this;

            var valuesCount = (element.Abstract || {}).ValuesCount;

            var peopleContainer = null;

            if (that.hide_poll_contributors()) return;

            btn.onclick = function () {
                if (peopleContainer) return GlobalUtilities.show(peopleContainer);

                var _pc = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center;",
                                Childs: [
                                    {
                                        Type: "div", Style: "display:inline-block; font-weight:bold;",
                                        Childs: [{ Type: "text", TextValue: element.Title }]
                                    },
                                    {
                                        Type: "div", Class: "rv-air-button rv-border-radius-half",
                                        Style: "margin-" + RV_Float + ":0.5rem; padding:0rem 1rem; font-size:0.7rem;" +
                                            "display:inline-block; cursor:default;",
                                        Childs: [{ Type: "text", TextValue: RVDic.NPeople.replace("[n]", valuesCount) }]
                                    }
                                ]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;", Name: "items" }
                        ]
                    }
                ]);

                peopleContainer = _pc["_div"];

                GlobalUtilities.loading(_pc["items"]);
                GlobalUtilities.show(peopleContainer);

                GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                    OnLoad: function () {
                        new NewSimpleListViewer(_pc["items"], {
                            Options: {
                                Count: 10,
                                OnDataRequest: function (options, done) {
                                    FGAPI.GetPollElementInstances(GlobalUtilities.extend(options || {}, {
                                        PollID: that.Objects.PollID, ElementID: element.RefElementID || element.ElementID,
                                        ParseResults: true,
                                        ResponseHandler: function (result) { done(result.Items || []); }
                                    }));
                                },
                                ItemBuilder: function (container, item, params) {
                                    var dt = item.LastModificationDate || item.CreationDate;

                                    var _el = GlobalUtilities.create_nested_elements([
                                        {
                                            Type: "div",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white " +
                                                "SoftBorder SoftShadow",
                                            Style: "margin:0.3rem 0rem; padding:0.3rem; padding-bottom:0.1rem;" +
                                                "padding-" + RV_Float + ":3rem; min-height:2.7rem; position:relative;",
                                            Childs: [
                                                {
                                                    Type: "div",
                                                    Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                                    Childs: [
                                                        {
                                                            Type: "img", Class: "rv-border-radius-quarter",
                                                            Style: "width:2rem; height:2rem; cursor:pointer;",
                                                            Link: RVAPI.UserPageURL({ UserID: item.Creator.UserID }),
                                                            Tooltip: Base64.decode(item.Creator.FirstName) + " " + Base64.decode(item.Creator.LastName),
                                                            Attributes: [{ Name: "src", Value: item.Creator.ProfileImageURL }]
                                                        }
                                                    ]
                                                },
                                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "data" },
                                                {
                                                    Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                                                    Childs: [
                                                        {
                                                            Type: "div", Class: "Direction TextAlign",
                                                            Style: "display:inline-block; margin-top:0.3rem; font-size:0.7rem; color:green;",
                                                            Childs: [{ Type: "text", TextValue: dt }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ], container);

                                    var _itm = GlobalUtilities.extend({}, element, item);
                                    if (_itm.TextValue) _itm.TextValue = Base64.decode(_itm.TextValue);
                                    _itm.Abstract = null;

                                    var viewElement = ((FormElementTypes[element.Type] || {}).dataview || function () { })(_itm) || {};
                                    if (viewElement.Container) _el["data"].appendChild(viewElement.Container);
                                    if (viewElement.Set) viewElement.Set(_itm);

                                    params.OnAfterAdd();
                                }
                            }
                        });
                    }
                });
            };
        },

        _set_editions_count_button_click: function (btn, element) {
            var that = this;

            var editionsCount = element.EditionsCount;

            var editionsContainer = null;

            btn.onclick = function () {
                if (editionsContainer) return GlobalUtilities.show(editionsContainer);

                var _pc = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: element.Title }]
                                },
                                {
                                    Type: "div", Class: "rv-air-button rv-border-radius-half",
                                    Style: "margin-" + RV_Float + ":0.5rem; padding:0rem 1rem; font-size:0.7rem;" +
                                        "display:inline-block; cursor:default;",
                                    Childs: [{ Type: "text", TextValue: RVDic.EditionsHistory + " (" + editionsCount + ")" }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;", Name: "items" }
                    ]
                }]);

                editionsContainer = _pc["_div"];

                GlobalUtilities.loading(_pc["items"]);
                GlobalUtilities.show(editionsContainer);

                GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                    OnLoad: function () {
                        new NewSimpleListViewer(_pc["items"], {
                            Options: {
                                Count: 10,
                                OnDataRequest: function (options, done) {
                                    FGAPI.GetElementChanges(GlobalUtilities.extend(options || {}, {
                                        ElementID: element.ElementID, ParseResults: true,
                                        ResponseHandler: function (result) { done(result.Changes || []); }
                                    }));
                                },
                                ItemBuilder: function (container, item, params) {
                                    var dt = item.CreationDate;

                                    item.Info = JSON.parse(Base64.decode(item.Info) || "{}");

                                    var _el = GlobalUtilities.create_nested_elements([{
                                        Type: "div",
                                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer " +
                                            "SoftBorder SoftShadow",
                                        Style: "margin:0.3rem 0rem; padding:0.3rem; padding-bottom:0.1rem; border-color:rgb(220,220,220);" +
                                            "padding-" + RV_Float + ":3rem; min-height:2.7rem; position:relative;",
                                        Childs: [
                                            {
                                                Type: "div",
                                                Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                                Childs: [{
                                                    Type: "img", Class: "rv-border-radius-quarter",
                                                    Style: "width:2rem; height:2rem; cursor:pointer;",
                                                    Link: RVAPI.UserPageURL({ UserID: item.Creator.UserID }),
                                                    Tooltip: Base64.decode(item.Creator.FirstName) + " " + Base64.decode(item.Creator.LastName),
                                                    Attributes: [{ Name: "src", Value: item.Creator.ProfileImageURL }]
                                                }]
                                            },
                                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "data" },
                                            {
                                                Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                                                Childs: [{
                                                    Type: "div", Class: "Direction TextAlign WarmColor",
                                                    Style: "display:inline-block; margin-top:0.3rem; font-size:0.7rem;",
                                                    Childs: [{ Type: "text", TextValue: dt }]
                                                }]
                                            }
                                        ]
                                    }], container);

                                    var _itm = GlobalUtilities.extend({}, element, item);
                                    if (_itm.TextValue) _itm.TextValue = Base64.decode(_itm.TextValue);
                                    _itm.Abstract = null;

                                    var viewElement = ((FormElementTypes[element.Type || ""] || {}).dataview || function () { })(_itm) || {};
                                    if (viewElement.Container) _el["data"].appendChild(viewElement.Container);
                                    if (viewElement.Set) viewElement.Set(_itm);

                                    params.OnAfterAdd();
                                }
                            }
                        });
                    }
                });
            };
        },

        get_element: function (elementId) {
            var elements = this.Objects.Elements;
            for (var i = 0, lnt = elements.length; i < lnt; ++i)
                if (elements[i] != null && elements[i].Data.ElementID == elementId) return elements[i];
            return null;
        },

        add_number: function (container, params) {
            var that = this;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-circle SoftBorder SoftShadow",
                    Style: "display:inline-block; margin:0.2rem 0.4rem; padding:0rem 1rem;" +
                        "background-color:white; font-size:0.7rem;",
                    Childs: [
                        { Type: "text", TextValue: params.Title + ":" },
                        {
                            Type: "span", Style: "margin-" + RV_Float + ":0.3rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: Number(Number(params.Value).toFixed(2)) || "0" }]
                        }
                    ]
                }
            ], container);
        },

        create_body_text_area: function (_div, element, params) {
            params = params || {};
            var that = this;
            var editButton = params.EditButton;
            
            var retJson = {
                get_data: null,
                set_data: null,
                editing_done: null,
                is_edit_mode: null,
                goto_edit_mode: null,
                goto_view_mode: null,
                set_as_filled: function () { if (editButton) editButton.style.display = "none"; },
                set_as_not_filled: function () { if (editButton) editButton.style.display = "block"; }
            };
            
            if (that.Objects.Filled) retJson.set_as_filled();

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyTextArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:none; text-align:center; margin-top:0.5rem;", Name: "numbers"
                }
            ], _div);

            var bodyTextArea = elems["bodyTextArea"];
            var editArea = elems["editArea"];

            //statistics
            var _set_statistics = function () {
                if (GlobalUtilities.get_type((element.Abstract || {}).Min) != "number") return;

                elems["numbers"].innerHTML = "";

                that.add_number(elems["numbers"], { Title: RVDic.Min, Value: element.Abstract.Min });
                that.add_number(elems["numbers"], { Title: RVDic.Max, Value: element.Abstract.Max });
                that.add_number(elems["numbers"], { Title: RVDic.Average, Value: element.Abstract.Avg });
                that.add_number(elems["numbers"], { Title: RVDic.Variance, Value: element.Abstract.Var });
                that.add_number(elems["numbers"], { Title: RVDic.StandardDeviation, Value: element.Abstract.StDev });

                jQuery(elems["numbers"]).fadeIn(500);
            };

            _set_statistics();
            //end of statistics

            var twoPurposeElement = null;
            if ((FormElementTypes[element.Type] || {}).fill_and_dataview) {
                twoPurposeElement = FormElementTypes[element.Type]
                    .fill_and_dataview(GlobalUtilities.extend(element, { Editable: that.Options.Editable }), {
                        UnlimitedDownloadAccess: that.Options.UnlimitedDownloadAccess,
                        PDFCovers: that.Options.PDFCovers || []
                    });
            }
            
            var fillElement = twoPurposeElement ||
                ((FormElementTypes[element.Type] || {}).fill || function () { })(element) || {};
            if (fillElement.Container && !(twoPurposeElement && !that.Options.Editable))
                editArea.appendChild(fillElement.Container);

            var viewElement = twoPurposeElement ||
                ((FormElementTypes[element.Type] || {}).dataview || function () { })(element, {
                    UnlimitedDownloadAccess: that.Options.UnlimitedDownloadAccess,
                    PDFCovers: that.Options.PDFCovers || []
                }) || {};
            if (viewElement.Container && !(twoPurposeElement && that.Options.Editable))
                bodyTextArea.appendChild(viewElement.Container);

            if (twoPurposeElement && that.Options.Editable) {
                editArea.style.display = "block";
                bodyTextArea.style.display = "none";
            }
            
            if (editButton) {
                editButton.onclick = function () {
                    if (!bodyTextArea.__IsEditMode) retJson.goto_edit_mode();
                    else that.save_elements([that.get_element(element.ElementID || "")], {
                        ContainerDiv: that.ContainerDiv,
                        OnSucceed: function () {
                            if (that.Options.OnAfterElementSave)
                                that.Options.OnAfterElementSave.call(that, [that.get_element(element.ElementID || "")]);
                        }
                    });
                }
            }

            retJson.is_edit_mode = function () {
                return !!bodyTextArea.__IsEditMode;
            };

            retJson.goto_edit_mode = function () {
                if (twoPurposeElement) return;

                bodyTextArea.__IsEditMode = true;
                bodyTextArea.style.display = "none";
                editArea.style.display = "block";

                if (editButton) editButton.setAttribute("class", "fa fa-floppy-o fa-lg rv-icon-button");

                if (fillElement.Set) fillElement.Set(element);
                if ((fillElement || {}).Refresh) fillElement.Refresh();
            };

            retJson.goto_view_mode = function () {
                if (twoPurposeElement) return;

                bodyTextArea.__IsEditMode = false;
                bodyTextArea.style.display = "block";
                editArea.style.display = "none";

                if (editButton) editButton.setAttribute("class", "fa fa-pencil fa-lg rv-icon-button");
            };

            if (that.Objects.Filled !== true && that.Options.Editable && that.isempty(element)) {
                retJson.goto_edit_mode();
                that._set_edit_icon(true);
            }

            retJson.editing_done = function () {
                if (bodyTextArea.__IsEditMode !== true) return;
                var _data = retJson.get_data() || {
                    TextValue: null, BitValue: null, DateValue: null, FloatValue: null, GuidItems: null
                };
                for (var d in _data) element[d] = _data[d];
                retJson.set_data();
                retJson.goto_view_mode();
                _set_statistics();
            };

            retJson.get_data = function () {
                return (bodyTextArea.__IsEditMode !== true) ? null : ((fillElement || {}).Get || function () { })();
            };

            retJson.set_data = function () {
                if ((fillElement || {}).Set) fillElement.Set(element);
                if ((viewElement || {}).Set && !twoPurposeElement) viewElement.Set(element);
            };

            retJson.set_data();

            return retJson;
        },

        import_dialog: function (params) {
            params = params || {};
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }
            ])["container"];

            GlobalUtilities.loading(_div);
            var showed = GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["FormsManager/FormImport.js"], {
                OnLoad: function () {
                    new FormImport(_div, {
                        FormID: that.Objects.FormID,
                        Elements: params.Elements,
                        InstanceID: that.Objects.InstanceID,
                        OnFinish: function (data) {
                            showed.Close();

                            if (that.Options.OnFormImport) that.Options.OnFormImport(data);

                            jQuery(that.ContainerDiv).animate({ height: "toggle" }, 500, function () {
                                that.ContainerDiv.innerHTML = "";
                                GlobalUtilities.loading(that.ContainerDiv);
                                jQuery(that.ContainerDiv).fadeIn(500, function () {
                                    var fv = new FormViewer(that.ContainerDiv, that.InitialParams);
                                    for (var x in that) that[x] = null;
                                    for (var x in fv) that[x] = fv[x];
                                })
                            });
                        }
                    });
                }
            });
        }
    }
})();