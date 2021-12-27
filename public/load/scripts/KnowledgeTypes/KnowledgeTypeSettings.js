(function () {
    if (window.KnowledgeTypeSettings) return;

    window.KnowledgeTypeSettings = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            KnowledgeTypeID: params.KnowledgeTypeID,
            KnowledgeType: params.KnowledgeType
        };

        var that = this;

        GlobalUtilities.load_files(["API/KnowledgeAPI.js", "KnowledgeTypes/NecessaryItemsSettings.js"], {
            OnLoad: function () { that._preload(); }
        });
    };

    KnowledgeTypeSettings.prototype = {
        _preload: function () {
            var that = this;

            KnowledgeAPI.AddKnowledgeType({
                KnowledgeTypeID: that.Objects.KnowledgeTypeID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                    KnowledgeAPI.GetKnowledgeType({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, Detail: true, ParseResults: true,
                        ResponseHandler: function (result) { that._initialize(result); }
                    });
                }
            });
        },

        _initialize: function (params) {
            params = params || {};
            var that = this;

            var create_container = function (p) {
                p = p || {};

                return {
                    Type: "div", Name: p.Name, Style: "padding:0.5rem; margin:0.5rem 0;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow"
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-air-button rv-circle", Style: "margin:0 auto 1rem auto;",
                    Properties: [{ Name: "onclick", Value: function () { that.edit_evaluation_questions(params); }}],
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-pencil", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                            Attributes: [{ Name: "aria-hidden", Value: "true" }]
                        },
                        { Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.EditAssessmentQuestions }
                    ]
                },
                create_container({ Name: "evaluationType" }),
                create_container({ Name: "evaluators" }),
                create_container({ Name: "preEvaluateByOwner" }),
                create_container({ Name: "forceEvaluatorsDescribe" }),
                create_container({ Name: "convertEvaluatorsToExperts" }),
                create_container({ Name: "searchabilityType" }),
                create_container({ Name: "scoreScale" }),
                create_container({ Name: "minAcceptableScore" }),
                create_container({ Name: "evaluationsEditable" }),
                create_container({ Name: "evaluationsEditableForAdmin" }),
                create_container({ Name: "evaluationsRemovable" }),
                create_container({ Name: "unhideEvaluators" }),
                create_container({ Name: "unhideEvaluations" }),
                create_container({ Name: "unhideNodeCreators" }),
                create_container({ Name: "necessaryItems" }),
                create_container({ Name: "textOptions" }),
                create_container({ Name: "nodeSelectType" }),
                create_container({ Name: "candidateRelations" })
            ], that.ContainerDiv);

            that.evaluation_type_settings(elems["evaluationType"], params);
            that.evaluators_settings(elems["evaluators"], params);
            that.boolean_option(elems["preEvaluateByOwner"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.PreEvaluateByOwner,
                Name: "PreEvaluateByOwner",
                APIFunction: KnowledgeAPI.SetPreEvaluateByOwner
            });
            that.boolean_option(elems["forceEvaluatorsDescribe"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.ForceEvaluatorsDescribe,
                Name: "ForceEvaluatorsDescribe",
                APIFunction: KnowledgeAPI.SetForceEvaluatorsDescribe
            });
            that.boolean_option(elems["convertEvaluatorsToExperts"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.ConvertEvaluatorsToExperts,
                Name: "ConvertEvaluatorsToExperts",
                APIFunction: KnowledgeAPI.SetConvertEvaluatorsToExperts
            });
            that.searchability_settings(elems["searchabilityType"], params);
            that.scorescale_settings(elems["scoreScale"], params);
            that.minacceptablescore_settings(elems["minAcceptableScore"], params);
            that.boolean_option(elems["evaluationsEditable"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.EvaluationsEditable,
                Name: "EvaluationsEditable",
                APIFunction: KnowledgeAPI.SetEvaluationsEditable
            });
            that.boolean_option(elems["evaluationsEditableForAdmin"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.EvaluationsEditableForAdmin,
                Name: "EvaluationsEditableForAdmin",
                APIFunction: KnowledgeAPI.SetEvaluationsEditableForAdmin
            });
            that.boolean_option(elems["evaluationsRemovable"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.EvaluationsRemovable,
                Name: "EvaluationsRemovable",
                APIFunction: KnowledgeAPI.SetEvaluationsRemovable
            });
            that.boolean_option(elems["unhideEvaluators"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.UnhideEvaluators,
                Name: "UnhideEvaluators",
                APIFunction: KnowledgeAPI.SetUnhideEvaluators
            });
            that.boolean_option(elems["unhideEvaluations"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.UnhideEvaluations,
                Name: "UnhideEvaluations",
                APIFunction: KnowledgeAPI.SetUnhideEvaluations
            });
            that.boolean_option(elems["unhideNodeCreators"], params, {
                Title: RVDic.KW.KnowledgeTypeSettings.UnhideNodeCreators,
                Name: "UnhideNodeCreators",
                APIFunction: KnowledgeAPI.SetUnhideNodeCreators
            });
            new NecessaryItemsSettings(elems["necessaryItems"], params);
            that.text_options(elems["textOptions"], params);
            that.nodeselecttype_settings(elems["nodeSelectType"], params);
            that.candidaterelations_settings(elems["candidateRelations"], params);
        },

        generic_item: function (container, params) {
            var that = this;
            params = params || {};

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":12rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button",
                                    Tooltip: RVDic.Edit, Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem;" + RV_Float + ":1.5rem;" +
                                (params.TitleFontSize ? "font-size:" + params.TitleFontSize + ";" : ""),
                            Childs: [{ Type: "text", TextValue: params.Title + ":" }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;" }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];

            var editObject = {};

            if (params.CreateView) params.CreateView(viewArea);
            if (params.CreateEdit) editObject = params.CreateEdit(editArea) || {};

            var _set_data = function () {
                if (params.SetData) params.SetData();
            };

            var _on_edit = function () {
                if (editObject.Show) return editObject.Show(function () {
                    if (params.OnSave) params.OnSave(function () { }, function (succeed) { if (succeed) _set_data(); });
                });

                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class",
                        editButton.__Editing ? "fa fa-floppy-o fa-lg rv-icon-button" : "fa fa-pencil fa-lg rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    if (params.OnSave) params.OnSave(function () {
                        GlobalUtilities.block(container);
                    }, function (succeed) {
                        if (succeed) {
                            editButton.__Editing = false;
                            set_things();
                        }

                        GlobalUtilities.unblock(container);
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;

            if (params.HasContent && !params.HasContent() && !editObject.Show) _on_edit();
            _set_data();

            return {
                View: viewArea,
                Edit: editArea
            };
        },

        evaluation_type_settings: function (container, params) {
            params = params || {};
            var that = this;

            var viewElems = null;
            var editElems = null;

            that.generic_item(container, {
                Title: RVDic.KW.KnowledgeTypeSettings.EvaluationTypes.EvaluationType,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    editElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "select", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "typeSelect",
                            Childs: [
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "N" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.EvaluationTypes.N }]
                                },
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "EN" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.EvaluationTypes.EN }]
                                },
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "MN" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.EvaluationTypes.MN }]
                                }
                            ]
                        }
                    ], area);
                },
                HasContent: function () { return !!params.EvaluationType; },
                SetData: function () {
                    viewElems["view"].innerHTML = !params.EvaluationType ?
                        RVDic.KW.KnowledgeTypeSettings.EvaluationTypes.NotNeeded :
                        RVDic.KW.KnowledgeTypeSettings.EvaluationTypes[params.EvaluationType];

                    for (var i = 0, lnt = editElems["typeSelect"].length; i < lnt; ++i) {
                        if (editElems["typeSelect"][i]["etype"] == params.EvaluationType) {
                            editElems["typeSelect"].selectedIndex = i;
                            break;
                        }
                    }
                },
                OnSave: function (start, done) {
                    start();

                    var newEvaluationType = editElems["typeSelect"][editElems["typeSelect"].selectedIndex]["etype"];

                    KnowledgeAPI.SetEvaluationType({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, EvaluationType: newEvaluationType, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.EvaluationType = newEvaluationType;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        evaluators_settings: function (container, params) {
            params = params || {};
            var that = this;

            var viewElems = null;
            var editElems = null;

            var set_count_display = function () {
                if (!editElems) return;

                var emArr = ["Experts", "Members", "ExpertsAndMembers"];

                var _ev = editElems["typeSelect"][editElems["typeSelect"].selectedIndex]["etype"];
                editElems["countDiv"].style.display = emArr.some(function (x) { return x == _ev; }) ? "block" : "none";
            };

            var get_count = function (editMode) {
                if (editMode && !editElems) return 0;

                var count = +(editMode ? GlobalUtilities.trim(editElems["countInput"].value) : params.MinEvaluationsCount);
                if (!count || isNaN(count) || (count <= 0)) count = 0;
                return count;
            };

            that.generic_item(container, {
                Title: RVDic.KW.KnowledgeTypeSettings.Evaluators.Evaluators,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    editElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "typeSelect",
                                    Childs: [
                                        {
                                            Type: "option", Properties: [{ Name: "etype", Value: "NotSet" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.Evaluators.NotSet }]
                                        },
                                        {
                                            Type: "option", Properties: [{ Name: "etype", Value: "KnowledgeAdmin" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.Evaluators.KnowledgeAdmin }]
                                        },
                                        {
                                            Type: "option", Properties: [{ Name: "etype", Value: "Experts" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.Evaluators.Experts }]
                                        },
                                        {
                                            Type: "option", Properties: [{ Name: "etype", Value: "AdminMembers" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.Evaluators.AdminMembers }]
                                        },
                                        {
                                            Type: "option", Properties: [{ Name: "etype", Value: "Members" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.Evaluators.Members }]
                                        },
                                        {
                                            Type: "option", Properties: [{ Name: "etype", Value: "ExpertsAndMembers" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.Evaluators.ExpertsAndMembers }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "countDiv",
                            Style: "position:relative; margin-top:1rem; display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:0.2rem; font-size:0.8rem; text-align:justify;",
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.Evaluators.MinEvaluationsCount + ":" }]
                                },
                                { Type: "number", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "countInput" }
                            ]
                        }
                    ], area);

                    editElems["typeSelect"].onchange = function () { set_count_display(); };
                },
                HasContent: function () { return !!params.Evaluators; },
                SetData: function () {
                    viewElems["view"].innerHTML = RVDic.KW.KnowledgeTypeSettings.Evaluators.NotSet;

                    var count = get_count();

                    editElems["countInput"].value = count ? count : "";

                    for (var i = 0, lnt = editElems["typeSelect"].length; i < lnt; ++i) {
                        if (editElems["typeSelect"][i]["etype"] == params.Evaluators) {
                            editElems["typeSelect"].selectedIndex = i;

                            var emArr = ["Experts", "Members", "ExpertsAndMembers"];

                            viewElems["view"].innerHTML = RVDic.KW.KnowledgeTypeSettings.Evaluators[params.Evaluators] +
                                (count && emArr.some(function (x) { return x == params.Evaluators }) ?
                                " (" + GlobalUtilities.convert_numbers_to_persian(count) + ")" : "");
                            break;
                        }
                    }

                    set_count_display();
                },
                OnSave: function (start, done) {
                    start();

                    var newEvaluators = editElems["typeSelect"][editElems["typeSelect"].selectedIndex]["etype"];
                    var newCount = get_count(true);

                    KnowledgeAPI.SetEvaluators({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, Evaluators: newEvaluators,
                        MinEvaluationsCount: newCount, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                params.Evaluators = newEvaluators;
                                params.MinEvaluationsCount = newCount;
                            }

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        boolean_option: function (container, params, options) {
            params = params || {};
            options = options || {};
            var that = this;

            var processing = false;

            var title = options.Title;
            var optionName = options.Name;
            var apiFunction = options.APIFunction;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":1.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "checkbox",
                                    Params: {
                                        Checked: !!params[optionName], Width: 18, Height: 18,
                                        OnClick: function (e, done) {
                                            e.preventDefault();

                                            if (processing) return;
                                            processing = true;

                                            var newValue = !this.Checked;

                                            apiFunction({
                                                KnowledgeTypeID: that.Objects.KnowledgeTypeID, Value: newValue, ParseResults: true,
                                                ResponseHandler: function (result) {
                                                    processing = false;
                                                    if (result.ErrorText) return;
                                                    params[optionName] = newValue;
                                                    done(true);
                                                }
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: title }]
                        }
                    ]
                }
            ], container);
        },

        nodeselecttype_settings: function (container, params) {
            params = params || {};
            var that = this;

            var viewElems = null;
            var editElems = null;

            that.generic_item(container, {
                Title: RVDic.KW.KnowledgeTypeSettings.NodeSelectType.NodeSelectType,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    editElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "select", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "typeSelect",
                            Childs: [
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "Free" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.NodeSelectType.Free }]
                                },
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "Fixed" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.NodeSelectType.Fixed }]
                                },
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "Single" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.NodeSelectType.Single }]
                                },
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "Limited" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.NodeSelectType.Limited }]
                                }
                            ]
                        }
                    ], area);
                },
                HasContent: function () { return !!params.NodeSelectType; },
                SetData: function () {
                    viewElems["view"].innerHTML = !params.NodeSelectType ?
                        RVDic.KW.KnowledgeTypeSettings.NodeSelectType.Free :
                        RVDic.KW.KnowledgeTypeSettings.NodeSelectType[params.NodeSelectType];

                    for (var i = 0, lnt = editElems["typeSelect"].length; i < lnt; ++i) {
                        if (editElems["typeSelect"][i]["etype"] == params.NodeSelectType) {
                            editElems["typeSelect"].selectedIndex = i;
                            break;
                        }
                    }
                },
                OnSave: function (start, done) {
                    start();

                    var newType = editElems["typeSelect"][editElems["typeSelect"].selectedIndex]["etype"];

                    KnowledgeAPI.SetNodeSelectType({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, NodeSelectType: newType, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.NodeSelectType = newType;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        searchability_settings: function (container, params) {
            params = params || {};
            var that = this;

            var viewElems = null;
            var editElems = null;

            that.generic_item(container, {
                Title: RVDic.KW.KnowledgeTypeSettings.SearchabilityType.SearchableAfter,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    editElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "select", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "typeSelect",
                            Childs: [
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "Registration" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.SearchabilityType.Registration }]
                                },
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "Confirmation" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.SearchabilityType.Confirmation }]
                                },
                                {
                                    Type: "option", Properties: [{ Name: "etype", Value: "Evaluation" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.SearchabilityType.Evaluation }]
                                }
                            ]
                        }
                    ], area);
                },
                HasContent: function () { return !!params.SearchableAfter; },
                SetData: function () {
                    viewElems["view"].innerHTML = !params.SearchableAfter ?
                        RVDic.KW.KnowledgeTypeSettings.SearchabilityType.Registration :
                        RVDic.KW.KnowledgeTypeSettings.SearchabilityType[params.SearchableAfter];

                    for (var i = 0, lnt = editElems["typeSelect"].length; i < lnt; ++i) {
                        if (editElems["typeSelect"][i]["etype"] == params.SearchableAfter) {
                            editElems["typeSelect"].selectedIndex = i;
                            break;
                        }
                    }
                },
                OnSave: function (start, done) {
                    start();

                    var newType = editElems["typeSelect"][editElems["typeSelect"].selectedIndex]["etype"];

                    KnowledgeAPI.SetSearchabilityType({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, SearchableAfter: newType, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.SearchableAfter = newType;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        scorescale_settings: function (container, params) {
            params = params || {};
            var that = this;

            var viewElems = null;
            var editElems = null;

            var get_score_scale = function (editMode) {
                if (editMode && !editElems) return 0;

                var count = +(editMode ? GlobalUtilities.trim(editElems["input"].value) : params.ScoreScale);
                if (!count || isNaN(count) || (count <= 0)) count = 0;
                return count;
            };

            that.generic_item(container, {
                Title: RVDic.KW.KnowledgeTypeSettings.ScoreScale.ScoreScale,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    editElems = GlobalUtilities.create_nested_elements([
                        { Type: "number", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "input" }
                    ], area);
                },
                HasContent: function () { return !!get_score_scale(false); },
                SetData: function () {
                    var scale = get_score_scale(false);

                    viewElems["view"].innerHTML = !scale ? RVDic.KW.KnowledgeTypeSettings.ScoreScale.NotSet : scale;
                    editElems["input"].value = scale ? scale : "";
                },
                OnSave: function (start, done) {
                    start();

                    var newScale = get_score_scale(true);

                    KnowledgeAPI.SetScoreScale({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, ScoreScale: newScale, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.ScoreScale = newScale;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        minacceptablescore_settings: function (container, params) {
            params = params || {};
            var that = this;

            var viewElems = null;
            var editElems = null;

            var get_number = function (editMode) {
                if (editMode && !editElems) return 0;

                var count = +(editMode ? GlobalUtilities.trim(editElems["input"].value) : params.MinAcceptableScore);
                if (!count || isNaN(count) || (count <= 0)) count = 0;
                return count;
            };

            that.generic_item(container, {
                Title: RVDic.KW.KnowledgeTypeSettings.MinAcceptableScore.MinAcceptableScore,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    editElems = GlobalUtilities.create_nested_elements([
                        { Type: "number", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "input" }
                    ], area);
                },
                HasContent: function () { return !!get_number(false); },
                SetData: function () {
                    var number = get_number(false);

                    viewElems["view"].innerHTML = !number ? RVDic.KW.KnowledgeTypeSettings.MinAcceptableScore.NotSet : number;
                    editElems["input"].value = number ? number : "";
                },
                OnSave: function (start, done) {
                    start();

                    var newNumber = get_number(true);

                    KnowledgeAPI.SetMinAcceptableScore({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, MinAcceptableScore: newNumber, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.MinAcceptableScore = newNumber;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        text_options: function (container, params) {
            params = params || {};
            var that = this;

            var groups = [
                { Name: "Reject", Title: RVDic.KW.Reject, ListObj: null },
                { Name: "Revision", Title: RVDic.KW.SendBackForRevision, ListObj: null },
                { Name: "Evaluation", Title: RVDic.KW.Evaluation, ListObj: null }
            ];
            
            try { params.TextOptions = JSON.parse(Base64.decode(params.TextOptions) || "{}"); }
            catch (e) { }

            if (GlobalUtilities.get_type(params.TextOptions) != "json") params.TextOptions = {};

            var has_content = function () {
                return groups.some(function (grp) {
                    return !!(params.TextOptions[grp.Name] || []).length;
                });
            };

            var viewArea = null;

            that.generic_item(container, {
                Title: RVDic.KW.TextOptions,
                CreateView: function (area) { viewArea = area; },
                CreateEdit: function (area) {
                    GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                        OnLoad: function () {
                            groups.forEach(function (grp) {
                                var _div = GlobalUtilities.create_nested_elements([
                                    { Type: "header", Params: { Title: grp.Title } },
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div", Style: "margin-bottom:1rem;" }
                                ], area)["_div"];

                                grp.ListObj = new NewSingleDataContainer(_div, {
                                    EnableTextItem: true,
                                    InputStyle: "width:100%; font-size:0.8rem;",
                                    InnerTitle: RVDic.NewOption + "..."
                                });

                                (params.TextOptions[grp.Name] || []).forEach(function (txt) {
                                    grp.ListObj.add_item(txt, txt);
                                });
                            });
                        }
                    });
                },
                HasContent: has_content,
                SetData: function () {
                    viewArea.innerHTML = "";

                    if (!has_content()) {
                        GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold; color:rgb(100,100,100);",
                            Childs: [{ Type: "text", TextValue: RVDic.NotSet }]
                        }], viewArea);
                    }

                    groups.forEach(function (grp) {
                        var values = (params.TextOptions[grp.Name] || []).map(function (v) { return Base64.decode(v); });
                        
                        if (grp.ListObj) {
                            grp.ListObj.clear();
                            values.forEach(function (v) { grp.ListObj.add_item(v, v); });
                        }

                        if (values.length) {
                            GlobalUtilities.create_nested_elements([
                                { Type: "header", Params: { Title: grp.Title } },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Style: "margin-bottom:1rem;",
                                    Childs: values.map(function (v) {
                                        return {
                                            Type: "div", Style: "margin:0.3rem 0; padding:0.3rem; border-color:rgb(240,240,240);",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftBorder",
                                            Childs: [{ Type: "text", TextValue: v }]
                                        };
                                    })
                                }
                            ], viewArea);
                        }
                    });
                },
                OnSave: function (start, done) {
                    start();

                    var newValue = {};
                    
                    groups.forEach(function (grp) {
                        var arr = !grp.ListObj ? [] : (grp.ListObj.get_items() || []).map(function (itm) {
                            return Base64.encode(itm.Title);
                        });

                        if (arr.length) newValue[grp.Name] = arr;
                    });

                    KnowledgeAPI.SetTextOptions({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID,
                        Value: Base64.encode(JSON.stringify(newValue)), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.TextOptions = newValue;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        candidaterelations_settings: function (container, params) {
            params = params || {};
            var that = this;

            var viewElems = null;
            var nodeSelect = null;

            var get_node_types = function () {
                return (params.CandidateRelations || {}).NodeTypes || [];
            };

            var get_nodes = function () {
                return (params.CandidateRelations || {}).Nodes || [];
            };

            jQuery.each(get_node_types(), function (ind, val) {
                val.TypeName = Base64.decode(val.TypeName);
                val.NodeType = Base64.decode(val.NodeType);
            });

            jQuery.each(get_nodes(), function (ind, val) {
                val.Name = Base64.decode(val.Name);
                val.NodeType = Base64.decode(val.NodeType);
            });

            var _add_view_node = function (node) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                        Style: "display:inline-block; padding:0.3rem; margin:0.2rem;",
                        Link: RVAPI.NodePageURL({ NodeID: node.NodeID }),
                        Childs: [
                            { Type: "text", TextValue: node.Name },
                            (!node.NodeType ? null : {
                                Type: "span", Style: "font-size:0.7rem; margin-" + RV_Float + ":0.5rem;",
                                Childs: [
                                    { Type: "text", TextValue: "(" },
                                    { Type: "span", Style: "color:gray;", Childs: [{ Type: "text", TextValue: node.NodeType }] },
                                    { Type: "text", TextValue: ")" }
                                ]
                            })
                        ]
                    }
                ], viewElems["nodesArea"]);
            };

            that.generic_item(container, {
                Title: RVDic.KW.KnowledgeTypeSettings.CandidateRelations.CandidateRelations,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold;", Name: "nodeTypesTitle",
                            Childs: [{ Type: "text", TextValue: RVDic.NodeTypes }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypesArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; margin-top:0.5rem;", Name: "nodesTitle",
                            Childs: [{ Type: "text", TextValue: RVDic.Nodes }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodesArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "notSet",
                            Style: "display:none; font-weight:bold; color:rgb(100,100,100);",
                            Childs: [{ Type: "text", TextValue: RVDic.NotSet }]
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    var objContainer = null, showedDiv = null;

                    return {
                        Show: function (callback) {
                            if (objContainer) return (showedDiv = GlobalUtilities.show(objContainer));

                            objContainer = GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                                }
                            ])["container"];

                            GlobalUtilities.loading(objContainer);
                            showedDiv = GlobalUtilities.show(objContainer);

                            GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                                OnLoad: function () {
                                    nodeSelect = new NodeSelect(objContainer, {
                                        Options: {
                                            Title: RVDic.KW.KnowledgeTypeSettings.CandidateRelations.CandidateRelations,
                                            NodeTypesSelectable: true,
                                            NodeTypeSearchBox: true,
                                            Filters: false,
                                            ShowBottomBar: true,
                                            OnConfirm: function () {
                                                if (callback) callback();
                                                showedDiv.Close();
                                            },
                                            OnCancel: function () { showedDiv.Close(); },
                                            OnInit: function () {
                                                var _ntIds = [];
                                                
                                                jQuery.each(get_node_types(), function (ind, val) {
                                                    val = GlobalUtilities.extend({}, val);
                                                    val.TypeName = Base64.encode(val.TypeName);
                                                    val.NodeType = Base64.encode(val.NodeType);
                                                    
                                                    if (!nodeSelect.node_type_exists(val.NodeTypeID)) {
                                                        nodeSelect.add_node_type(val);
                                                        _ntIds.push(val.NodeTypeID);
                                                    }

                                                    nodeSelect.check_node_type(val.NodeTypeID);
                                                });

                                                if (_ntIds.length > 0) nodeSelect.check_trees(_ntIds);

                                                jQuery.each(get_nodes(), function (ind, val) {
                                                    nodeSelect.add_item(val);
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    };
                },
                HasContent: function () { return !!get_node_types().length || !!get_nodes().length; },
                SetData: function () {
                    var nodeTypes = get_node_types();
                    var nodes = get_nodes();

                    viewElems["nodesArea"].innerHTML = viewElems["nodeTypesArea"].innerHTML = "";

                    viewElems["nodeTypesTitle"].style.display = nodeTypes.length ? "block" : "none";
                    viewElems["nodesTitle"].style.display = nodes.length ? "block" : "none";
                    viewElems["notSet"].style.display = !nodes.length && !nodeTypes.length ? "block" : "none";
                    
                    jQuery.each(nodeTypes, function (ind, val) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Class: "rv-border-radius-quarter SoftBorder SoftBackgroundColor",
                                Style: "display:inline-block; padding:0.3rem; margin:0.2rem;",
                                Childs: [{ Type: "text", TextValue: val.TypeName }]
                            }
                        ], viewElems["nodeTypesArea"]);
                    });

                    jQuery.each(nodes, function (ind, val) {
                        _add_view_node(val);
                    });

                    //if (nodeSelect) nodeSelect.show_all_node_types();
                },
                OnSave: function (start, done) {
                    start();

                    var newNodes = !nodeSelect ? [] : nodeSelect.get_items();
                    var newNodeTypes = !nodeSelect ? [] : nodeSelect.get_node_types(true);

                    var nodeIds = [];
                    jQuery.each(newNodes, function (ind, val) { nodeIds.push(val.NodeID); });

                    var nodeTypeIds = [];
                    jQuery.each(newNodeTypes, function (ind, val) { nodeTypeIds.push(val.NodeTypeID); });

                    KnowledgeAPI.SetCandidateRelations({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID,
                        NodeTypeIDs: nodeTypeIds.join("|"), NodeIDs: nodeIds.join("|"), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                params.CandidateRelations = params.CandidateRelations || {};

                                params.CandidateRelations.Nodes = newNodes;
                                params.CandidateRelations.NodeTypes = newNodeTypes;
                            }

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        edit_evaluation_questions: function (params) {
            var that = this;

            if (that.QuestionsContainer) return GlobalUtilities.show(that.QuestionsContainer);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-10 large-10 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;" +
                                "font-weight:bold; margin-bottom:1rem; font-size:1.2rem; color:rgb(100,100,100); text-align:center;",
                            Childs: [
                                { Type: "text", TextValue: RVDic.KW.EvaluationQuestions + ": " + that.Objects.KnowledgeType },
                                { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_evaluationprocesses_questions" } }
                            ]
                        },
                        {Type: "div", Class: "small-12 medium-12 large-12", Name: "_div"}
                    ]
                }
            ]);

            that.QuestionsContainer = elems["container"];

            GlobalUtilities.loading(elems["_div"]);
            GlobalUtilities.show(that.QuestionsContainer);
            
            GlobalUtilities.load_files(["KnowledgeTypes/KnowledgeTypeQuestions.js"], {
                OnLoad: function () {
                    new KnowledgeTypeQuestions(elems["_div"], { KnowledgeTypeID: that.Objects.KnowledgeTypeID });
                }
            });
        }
    };
})();