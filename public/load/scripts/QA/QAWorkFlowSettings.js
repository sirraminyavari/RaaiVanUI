(function () {
    if (window.QAWorkFlowSettings) return;

    window.QAWorkFlowSettings = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;

        params = params || {};

        this.Interface = {
        };

        this.Objects = {
            WorkFlow: params.WorkFlow
        };

        var that = this;

        GlobalUtilities.load_files(["API/QAAPI.js"], { OnLoad: function () { that._initialize(); } });
    }

    QAWorkFlowSettings.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; font-size:1.5rem; margin-bottom:1rem;",
                    Childs: [{ Type: "text", TextValue: that.Objects.WorkFlow.Name }]
                }
            ], that.ContainerDiv);

            that.set_description();

            that.add_check_box({
                APIFunction: "SetWorkFlowInitialCheckNeeded",
                Title: RVDic.QA.InitialCheckNeeded,
                Value: that.Objects.WorkFlow.InitialCheckNeeded
            });

            that.add_check_box({
                APIFunction: "SetWorkFlowFinalConfirmationNeeded",
                Title: RVDic.QA.FinalConfirmationNeeded,
                Value: that.Objects.WorkFlow.FinalConfirmationNeeded
            });

            that.add_check_box({
                APIFunction: "SetWorkFlowRemovableAfterConfirmation",
                Title: RVDic.QA.RemovableAfterConfirmation,
                Value: that.Objects.WorkFlow.RemovableAfterConfirmation
            });

            that.add_check_box({
                APIFunction: "SetWorkFlowDisableComments",
                Title: RVDic.QA.DisableComments,
                Value: that.Objects.WorkFlow.DisableComments
            });

            that.add_check_box({
                APIFunction: "SetWorkFlowDisableQuestionLikes",
                Title: RVDic.QA.DisableQuestionLikes,
                Value: that.Objects.WorkFlow.DisableQuestionLikes
            });

            that.add_check_box({
                APIFunction: "SetWorkFlowDisableAnswerLikes",
                Title: RVDic.QA.DisableAnswerLikes,
                Value: that.Objects.WorkFlow.DisableAnswerLikes
            });

            that.add_check_box({
                APIFunction: "SetWorkFlowDisableCommentLikes",
                Title: RVDic.QA.DisableCommentLikes,
                Value: that.Objects.WorkFlow.DisableCommentLikes
            });

            that.add_check_box({
                APIFunction: "SetWorkFlowDisableBestAnswer",
                Title: RVDic.QA.DisableBestAnswer,
                Value: that.Objects.WorkFlow.DisableBestAnswer
            });

            /*
            that.add_text_box({
                APIFunction: "SetWorkFlowActionDeadline",
                Title: RVDic.QA.ActionDeadline,
                Value: that.Objects.WorkFlow.ActionDeadline,
                Number: true
            });
            */

            that.add_select({
                APIFunction: "SetWorkFlowAnswerBy",
                Title: RVDic.QA.AnswerBy,
                Value: that.Objects.WorkFlow.AnswerBy,
                Options: [
                    { Name: "All", Title: RVDic.QA.AnswerByAll },
                    { Name: "SelectedUsers", Title: RVDic.QA.AnswerBySelectedUsers }
                ]
            });

            that.add_select({
                APIFunction: "SetWorkFlowPublishAfter",
                Title: RVDic.QA.PublishAfter,
                Value: that.Objects.WorkFlow.PublishAfter,
                Options: [
                    { Name: "Registration", Title: RVDic.QA.PublishAfterRegistration },
                    { Name: "InitialCheck", Title: RVDic.QA.PublishAfterInitialCheck },
                    { Name: "FinalConfirmation", Title: RVDic.QA.PublishAfterFinalConfirmation },
                    { Name: "ChoosingTheBestAnswer", Title: RVDic.QA.PublishAfterChoosingTheBestAnswer }
                ]
            });

            /*
            that.add_select({
                APIFunction: "SetWorkFlowNodeSelectType",
                Title: RVDic.QA.NodeSelectType,
                Value: that.Objects.WorkFlow.NodeSelectType,
                Options: [
                    { Name: "Free", Title: RVDic.QA.NodeSelectTypeFree },
                    { Name: "Limited", Title: RVDic.QA.NodeSelectTypeLimited }
                ]
            });
            */

            that.admins();

            /* that.candidate_relations(); */
        },

        set_description: function () {
            var that = this;

            var description = that.Objects.WorkFlow.Description;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "position:relative; min-height:2.5rem; padding-" + RV_Float + ":2.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:justify;", Name: "descValue"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:none;", Name: "descInput"
                        }
                    ]
                }
            ], that.ContainerDiv);

            var container = elems["container"];
            var descValue = elems["descValue"];
            var editButton = elems["editButton"];
            var descInput = null;

            var _set_desc = function () {
                var desc = GlobalUtilities.get_text_begining(description, 3000, "", { RichText: false });

                descValue.innerHTML = "";

                if (desc) GlobalUtilities.append_markup_text(descValue, desc);
                else descValue.innerHTML = "<span style='color:gray; font-weight:bold;'>" + RVDic.NotSet + "</span>";

                if (descInput) descInput.set_data(description);
            };

            var _on_edit = function () {
                var set_things = function () {
                    elems["descInput"].style.display = editButton.__Editing ? "block" : "none";
                    descValue.style.display = editButton.__Editing ? "none" : "block";

                    if (editButton.__Editing && !descInput) {
                        descInput = new AdvancedTextArea({
                            ContainerDiv: elems["descInput"], DefaultText: RVDic.Description,
                            QueryTemplate: "RelatedThings",
                            ItemTemplate: {
                                ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL"
                            }
                        });
                    }

                    _set_desc();

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "save" : "pencil") + " fa-2x rv-icon-button");
                }

                if (editButton.__Editing === true) {
                    var newDescription = GlobalUtilities.trim(descInput.get_data());

                    GlobalUtilities.block(container);

                    QAAPI.SetWorkFlowDescription({
                        WorkFlowID: that.Objects.WorkFlow.ID, Description: Base64.encode(newDescription),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                description = newDescription;
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
            if (!description) _on_edit();
            _set_desc();
        },

        add_check_box: function (params) {
            var that = this;
            params = params || {};

            var apiFunction = params.APIFunction;
            var value = params.Value === true;
            var title = params.Title;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "position:relative; min-height:2rem; padding-" + RV_Float + ":2.5rem; margin:0.5rem 0rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "checkbox",
                                    Params: {
                                        Checked: value,
                                        OnClick: function (e, done) {
                                            e.preventDefault();

                                            QAAPI[apiFunction]({
                                                WorkFlowID: that.Objects.WorkFlow.ID, Value: !this.Checked,
                                                ParseResults: true,
                                                ResponseHandler: function (result) { done(!result.ErrorText); }
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
            ], that.ContainerDiv);
        },

        add_text_box: function (params) {
            var that = this;
            params = params || {};
            
            var apiFunction = params.APIFunction;
            var value = params.Value;
            var title = params.Title;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container",
                    Style: "position:relative; min-height:2rem; padding-" + RV_Float + ":2.5rem; margin:0.5rem 0rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.2rem 0rem;",
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: title + ":" }] }]
                        },
                        { Type: "div", Class: "small-12 medium-6 large-8", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-6 large-8",
                            Style: "display:none;", Name: "editArea",
                            Childs: [
                                {
                                    Type: (params.Number ? "number" : "input"), Class: "rv-input",
                                    Style: "width:100%;", Name: "_input",
                                    Attributes: params.Number ? null : [{ Name: "type", Value: "text" }]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            var container = elems["container"];
            var editButton = elems["editButton"];
            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var inputObj = elems["_input"];

            var _set_val = function () {
                viewArea.innerHTML = value && (+value > 0) ? GlobalUtilities.convert_numbers_to_persian(String(value)) :
                    "<span style='color:gray; font-weight:bold;'>" + RVDic.NotSet + "</span>";

                inputObj.value = value;
            }

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_val();

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "save" : "pencil") + " fa-2x rv-icon-button");
                }

                if (editButton.__Editing === true) {
                    var newValue = inputObj.value;

                    GlobalUtilities.block(container);

                    QAAPI[apiFunction]({
                        WorkFlowID: that.Objects.WorkFlow.ID, Value: newValue, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                value = newValue;
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
            if (!value) _on_edit();
            _set_val();
        },

        add_select: function (params) {
            var that = this;
            params = params || {};
            
            var apiFunction = params.APIFunction;
            var value = params.Value;
            var title = params.Title;

            var dic = {};
            var options = [];

            var add_option = function (op) {
                if (op.Name) dic[op.Name] = op.Title;

                options.push({
                    Type: "option",
                    Properties: !op.Name ? null : [{ Name: "opValue", Value: op.Name }],
                    Childs: [{ Type: "text", TextValue: op.Title }]
                });
            };

            add_option({ Title: RVDic.Select + "..." });

            for (var i = 0, lnt = (params.Options || []).length; i < lnt; ++i)
                add_option(params.Options[i]);
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container",
                    Style: "position:relative; min-height:2rem; padding-" + RV_Float + ":2.5rem; margin:0.5rem 0rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.2rem 0rem;",
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: title + ":" }] }]
                        },
                        { Type: "div", Class: "small-12 medium-6 large-8", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-6 large-8",
                            Style: "display:none;", Name: "editArea",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Style: "width:100%;",
                                    Name: "slct", Childs: options
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            var container = elems["container"];
            var editButton = elems["editButton"];
            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var selectObj = elems["slct"];

            var _set_val = function () {
                viewArea.innerHTML = value ? dic[value] :
                    "<span style='color:gray; font-weight:bold;'>" + RVDic.NotSet + "</span>";

                for (var i = 0, lnt = selectObj.length; i < lnt; ++i) {
                    if (selectObj[i]["opValue"] == value) {
                        selectObj.selectedIndex = i;
                        break;
                    }
                }
            }

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_val();

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "save" : "pencil") + " fa-2x rv-icon-button");
                }

                if (editButton.__Editing === true) {
                    var newValue = selectObj[selectObj.selectedIndex]["opValue"];

                    GlobalUtilities.block(container);

                    QAAPI[apiFunction]({
                        WorkFlowID: that.Objects.WorkFlow.ID, Value: newValue, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                value = newValue;
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
            if (!value) _on_edit();
            _set_val();
        },

        admins: function(){
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "padding-" + RV_Float + ":2.5rem; margin:1rem 0rem;", Name: "_div"
                }
            ], that.ContainerDiv)["_div"];

            QAAPI.GetWorkFlowAdmins({
                WorkFlowID: that.Objects.WorkFlow.ID, ParseResults: true,
                ResponseHandler: function (result) {
                    var admins = (result || {}).Admins || [];

                    GlobalUtilities.load_files(["USR/RelatedUsersManager.js"], {
                        OnLoad: function () { that._admins(_div, admins); }
                    });
                }
            });
        },

        _admins: function (container, admins) {
            var that = this;
            
            new RelatedUsersManager(container, {
                Options: {
                    Editable: true,
                    Title: RVDic.Admins,
                    TitleClass: "small-12 meidum-6 large-4",
                    TitleStyle: "padding:0.2rem 0rem;",
                    InputClass: "small-12 meidum-6 large-8",
                    OnBeforeUsersGet: function (e, done) {
                        e.preventDefault();
                        done(admins || []);
                    },
                    OnBeforeAdd: function (e, done) {
                        e.preventDefault();

                        QAAPI.AddWorkFlowAdmin({
                            WorkFlowID: that.Objects.WorkFlow.ID, UserID: e.User.UserID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else done(result.User);
                            }
                        });
                    },
                    OnBeforeRemove: function (e, done) {
                        e.preventDefault();

                        QAAPI.RemoveWorkFlowAdmin({
                            WorkFlowID: that.Objects.WorkFlow.ID, UserID: e.User.UserID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else done();
                            }
                        });
                    }
                }
            });
        },

        candidate_relations: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "position:relative; min-height:2rem; padding-" + RV_Float + ":2.5rem; margin:1rem 0rem;",
                    Childs: [{ Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }]
                }
            ], that.ContainerDiv);

            GlobalUtilities.load_files(["QA/QACandidateRelations.js"], {
                OnLoad: function () {
                    var editButton = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        }
                    ], elems["container"])["editButton"];

                    that._candidate_relations(elems["_div"], editButton);
                }
            });
        },

        _candidate_relations: function (container, editButton) {
            var that = this;
            
            var qacr = new QACandidateRelations(container, {
                WorkFlowID: that.Objects.WorkFlow.ID,
                OnViewMode: function () { editButton.setAttribute("class", "fa fa-pencil fa-2x rv-icon-button"); },
                OnEditMode: function () { editButton.setAttribute("class", "fa fa-save fa-2x rv-icon-button"); }
            });

            editButton.onclick = function () { qacr.do_edit(); };
        }
    }
})();