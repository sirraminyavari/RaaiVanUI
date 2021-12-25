(function () {
    if (window.NodeTypeService) return;
    
    window.NodeTypeService = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            NodeTypeID: params.NodeTypeID || "",
            NodeType: params.NodeType || "",
            Modules: params.Modules || {}
        }

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "WFAPI"] },
            { Root: "CN/", Ext: "js", Childs: ["ServiceAdminType", "ContributionEnabler", "SpecialUsers"] }
        ], { OnLoad: function () { that._preinit(); } });
    }

    NodeTypeService.prototype = {
        _preinit: function () {
            var that = this;

            CNAPI.GetService({
                NodeTypeID: that.Objects.NodeTypeID,
                ResponseHandler: function (responseText) {
                    var result = JSON.parse(responseText);

                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else that._initialize(result);
                }
            });
        },

        _initialize: function (params) {
            params = params || {};
            var that = this;

            var modules = (window.RVGlobal || {}).Modules || {};

            var enableContribution = params.EnableContribution === true;
            var noContent = params.NoContent === true;
            var isKnowledge = params.IsKnowledge === true;
            var isDocument = params.IsDocument === true;
            var enablePreviousVersionSelect = params.EnablePreviousVersionSelect === true;
            var isTree = params.IsTree === true;
            var uniqueMembership = params.UniqueMembership === true;
            var uniqueAdminMember = params.UniqueAdminMember === true;
            var disableAbstractAndKeywords = params.DisableAbstractAndKeywords === true;
            var disableFileUpload = params.DisableFileUpload === true;
            var disableRelatedNodesSelect = params.DisableRelatedNodesSelect === true;
            var editableForAdmin = params.EditableForAdmin === true;
            var editableForCreator = params.EditableForCreator === true;
            var editableForOwners = params.EditableForOwners === true;
            var editableForExperts = params.EditableForExperts === true;
            var editableForMembers = params.EditableForMembers === true;
            var editSuggestion = params.EditSuggestion === true;

            var checkboxes = [];

            var _add_checkbox = function (_value, _function, _title) {
                _value = _value === true;

                checkboxes.push({
                    Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-quarter",
                    Style: "margin-bottom:0.5rem; padding:0.3rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [
                                {
                                    Type: "checkbox",
                                    Params: {
                                        Checked: _value, Width: 18, Height: 18,
                                        OnClick: function (e, done) {
                                            if (GlobalUtilities.get_type(_function) == "function") return _function.call(this, e, done);

                                            e.preventDefault();
                                            
                                            CNAPI[_function]({
                                                NodeTypeID: that.Objects.NodeTypeID, Editable: !this.Checked,
                                                Enable: !this.Checked, Value: !this.Checked, IsDocument: !this.Checked,
                                                IsKnowledge: !this.Checked, IsTree: !this.Checked, ParseResults: true,
                                                ResponseHandler: function (result) { done(!result.ErrorText); }
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: _title }]
                        }
                    ]
                });
            };

            //_add_checkbox(enableContribution, "EnableContribution", RVDic.CN.Service.EnableContribution);

            if (modules.FG) _add_checkbox(noContent, "NoContentService", RVDic.CN.Service.NoContent);

            if(modules.KW) _add_checkbox(isKnowledge, function (e, done) {
                e.preventDefault();

                var _isk = !this.Checked;

                CNAPI["IsKnowledge"]({
                    NodeTypeID: that.Objects.NodeTypeID, IsKnowledge: _isk,
                    ResponseHandler: function (responseText) {
                        if (JSON.parse(responseText).ErrorText) return done(false);
                        done();
                    }
                });
            }, RVDic.CN.Service.IsKnowledge);

            if (modules.DCT) {
                _add_checkbox(isDocument, "IsDocument", RVDic.CN.Service.IsDocument);
                _add_checkbox(enablePreviousVersionSelect, "EnablePreviousVersionSelect", RVDic.CN.Service.EnablePreviousVersionSelect);
            }
            _add_checkbox(isTree, "IsTree", RVDic.CN.Service.IsTree);
            _add_checkbox(uniqueMembership, "HasUniqueMembership", RVDic.CN.Service.UniqueMembership);
            _add_checkbox(uniqueAdminMember, "HasUniqueAdminMember", RVDic.CN.Service.UniqueAdminMember);
            _add_checkbox(disableAbstractAndKeywords, "AbstractAndKeywordsDisabled", RVDic.CN.Service.DisableAbstractAndKeywords);
            _add_checkbox(disableFileUpload, "FileUploadDisabled", RVDic.CN.Service.DisableFileUpload);
            _add_checkbox(disableRelatedNodesSelect, "RelatedNodesSelectDisabled", RVDic.CN.Service.DisableRelatedNodesSelect);
            _add_checkbox(editableForAdmin, "EditableForAdmin", RVDic.CN.Service.EditableForAdmin);
            _add_checkbox(editableForCreator, "EditableForCreator", RVDic.CN.Service.EditableForCreator);
            _add_checkbox(editableForOwners, "EditableForOwners", RVDic.CN.Service.EditableForOwners);
            _add_checkbox(editableForExperts, "EditableForExperts", RVDic.CN.Service.EditableForExperts);
            _add_checkbox(editableForMembers, "EditableForMembers", RVDic.CN.Service.EditableForMembers);
            _add_checkbox(editSuggestion, "EditSuggestion", RVDic.CN.Service.EditSuggestion);

            var generic_item = function (name) {
                return {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-quarter",
                    Style: "margin-bottom:0.5rem; padding:0.3rem;", Name: name
                }
            };

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-7 large-4 rv-air-button rv-circle",
                    Style: "margin:0rem auto 1rem auto;", Name: "privacyButton",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-key", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        },
                        { Type: "text", TextValue: RVDic.Privacy }
                    ]
                },
                generic_item("title"),
                generic_item("description"),
                generic_item("successMessage"),
                generic_item("form"),
                generic_item("workflow"),
                generic_item("docTrees"),
                generic_item("serviceAdminType"),
                generic_item("maxAcceptableAdminLevel"),
                generic_item("contributionArea"),
                { Type: "div", Class: "small-12 medium-12 large-12", Childs: checkboxes },
                generic_item("freeusers"),
                { Type: "div", Class: "DashedAutoHideBorder NormalPadding", Name: "fileConstraints" },
                { Type: "div", Class: "DashedAutoHideBorder NormalPadding", Name: "automessages" }
            ], that.ContainerDiv);

            params.NodeTypeID = that.Objects.NodeTypeID;
            that.set_title(elems["title"], params);
            that.set_description(elems["description"], params);
            that.set_success_message(elems["successMessage"], params);
            new ServiceAdminType(elems["serviceAdminType"], params);
            that.set_max_acceptable_admin_level(elems["maxAcceptableAdminLevel"], params);
            new ContributionEnabler(elems["contributionArea"], params);
            new SpecialUsers(elems["freeusers"], params);
            //new FileConstraints(elems["fileConstraints"], params);

            var privacyButton = elems["privacyButton"];
            privacyButton.onclick = function () {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container"
                    }
                ])["container"];

                GlobalUtilities.loading(_div);
                var showed = GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                    OnLoad: function () {
                        _div.innerHTML = "";
                        
                        var pv = new PermissionSetting(_div, {
                            ObjectID: that.Objects.NodeTypeID,
                            Options: {
                                ConfidentialitySelect: false,
                                PermissionTypes: [
                                    "Create", "CreateBulk", "View", "ViewAbstract",
                                    "ViewRelatedItems", "Modify", "Delete", "Download"
                                ],
                                ObjectType: "NodeType",
                                OnSave: function () { showed.Close(); }
                            }
                        });
                    }
                });
            };

            var formDiv = elems["form"];
            if (!that.Objects.Modules.FG) //if Forms Module in not enabled
                formDiv.parentNode.removeChild(formDiv);
            else {
                GlobalUtilities.load_files(["FormsManager/FormOwner.js"], {
                    OnLoad: function () {
                        new FormOwner(formDiv, {
                            OwnerID: params.NodeTypeID,
                            TitleWidth: 9.5, TitleMargin: 1.5, ButtonSize: "fa-lg"
                        });
                    }
                });
            }

            var workflowDiv = elems["workflow"];
            if (!that.Objects.Modules.WF) //if Workflow Module in not enabled
                workflowDiv.parentNode.removeChild(workflowDiv);
            else {
                GlobalUtilities.loading(workflowDiv);

                GlobalUtilities.load_files(["WorkFlowManager/WorkFlowOwner.js"], {
                    OnLoad: function () { new WorkFlowOwner(workflowDiv, { OwnerID: params.NodeTypeID }); }
                });
            }

            var docTreesDiv = elems["docTrees"];
            if (!that.Objects.Modules.DCT) //if Documents Module in not enabled
                docTreesDiv.parentNode.removeChild(docTreesDiv);
            else {
                GlobalUtilities.loading(docTreesDiv);

                GlobalUtilities.load_files(["DCT/DocumentTreeOwner.js"], {
                    OnLoad: function () { new DocumentTreeOwner(docTreesDiv, { OwnerID: params.NodeTypeID }); }
                });
            }

            /*
            new AutoMessageManager(elems["automessages"], { OwnerID: "", AutoMessages: [],
            Options: { AudienceTypes: ["SendToOwner", "SpecificNode"] }
            });
            */
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

            if (params.CreateView) params.CreateView(viewArea);
            if (params.CreateEdit) params.CreateEdit(editArea);

            var _set_data = function () {
                if (params.SetData) params.SetData();
            };

            var _on_edit = function () {
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

            if (params.HasContent && !params.HasContent()) _on_edit();
            _set_data();

            return {
                View: viewArea,
                Edit: editArea
            };
        },

        set_title: function (container, params) {
            params = params || {};
            var that = this;

            params.Title = Base64.decode(params.Title);

            var viewElems = null;
            var editElems = null;

            that.generic_item(container, {
                Title: RVDic.Title,
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
                        { Type: "input", Class: "rv-input", Name: "titleInput", Style: "width:100%; font-size:0.7rem;" }
                    ], area);
                },
                HasContent: function () { return !!params.Title; },
                SetData: function () {
                    viewElems["view"].innerHTML = "";

                    GlobalUtilities.create_nested_elements([{
                        Type: "text", TextValue: GlobalUtilities.get_text_begining(params.Title, 2000) || RVDic.NotSet
                    }], viewElems["view"]);

                    editElems["titleInput"].value = params.Title;
                },
                OnSave: function (start, done) {
                    start();

                    var newTitle = GlobalUtilities.trim(editElems["titleInput"].value);

                    CNAPI.SetServiceTitle({
                        NodeTypeID: that.Objects.NodeTypeID, Title: Base64.encode(newTitle), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.Title = newTitle;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        },

        set_description: function (container, params) {
            params = params || {};
            var that = this;

            params.Description = Base64.decode(params.Description);

            var viewElems = null;
            var descriptionInput = null;

            that.generic_item(container, {
                Title: RVDic.Description,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem; text-align:justify;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    descriptionInput = new AdvancedTextArea({
                        ContainerDiv: area, DefaultText: RVDic.Description + "...",
                        QueryTemplate: "RelatedThings",
                        ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
                    });
                },
                HasContent: function () { return !!params.Description; },
                SetData: function () {
                    var desc = GlobalUtilities.get_text_begining(params.Description, 3000, "", { RichText: false });
                    viewElems["view"].innerHTML = !desc ? RVDic.NotSet : "";
                    if (desc) GlobalUtilities.append_markup_text(viewElems["view"], desc);

                    if (descriptionInput) descriptionInput.set_data(params.Description);
                },
                OnSave: function (start, done) {
                    start();

                    var newDescription = !descriptionInput ? null : GlobalUtilities.trim(descriptionInput.get_data());

                    CNAPI.SetServiceDescription({
                        NodeTypeID: that.Objects.NodeTypeID, Description: Base64.encode(newDescription), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.Description = newDescription;

                            done(!params.ErrorText);
                        }
                    });
                }
            });
        },

        set_success_message: function (container, params) {
            params = params || {};
            var that = this;

            params.SuccessMessage = Base64.decode(params.SuccessMessage);

            var viewElems = null;
            var msgInput = null;

            that.generic_item(container, {
                Title: RVDic.SuccessMessage,
                CreateView: function (area) {
                    viewElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "view",
                            Style: "color:green; font-weight:bold; font-size:0.7rem; text-align:justify;"
                        }
                    ], area);
                },
                CreateEdit: function (area) {
                    msgInput = new AdvancedTextArea({
                        ContainerDiv: area, DefaultText: RVDic.SuccessMessage + "...",
                        QueryTemplate: "RelatedThings",
                        ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
                    });
                },
                HasContent: function () { return !!params.SuccessMessage; },
                SetData: function () {
                    var desc = GlobalUtilities.get_text_begining(params.SuccessMessage, 3000, "", { RichText: false });
                    viewElems["view"].innerHTML = !desc ? RVDic.NotSet : "";
                    if (desc) GlobalUtilities.append_markup_text(viewElems["view"], desc);

                    if (msgInput) msgInput.set_data(params.SuccessMessage);
                },
                OnSave: function (start, done) {
                    start();

                    var newMsg = !msgInput ? null : GlobalUtilities.trim(msgInput.get_data());

                    CNAPI.SetServiceSuccessMessage({
                        NodeTypeID: that.Objects.NodeTypeID, Message: Base64.encode(newMsg), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.SuccessMessage = newMsg;

                            done(!params.ErrorText);
                        }
                    });
                }
            });
        },

        set_max_acceptable_admin_level: function (container, params) {
            params = params || {};
            var that = this;

            params.MaxAcceptableAdminLevel = !params.MaxAcceptableAdminLevel ? -1 : +params.MaxAcceptableAdminLevel;
            if (isNaN(params.MaxAcceptableAdminLevel) || (params.MaxAcceptableAdminLevel <= 0))
                params.MaxAcceptableAdminLevel = -1;

            var viewElems = null;
            var editElems = null;

            that.generic_item(container, {
                Title: RVDic.CN.Service.MaxAcceptableAdminLevel,
                TitleFontSize: "0.65rem",
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
                        { Type: "number", Class: "rv-input", Name: "input", Style: "width:100%; font-size:0.7rem;" }
                    ], area);
                },
                HasContent: function () { return params.MaxAcceptableAdminLevel >= 0; },
                SetData: function () {
                    viewElems["view"].innerHTML = params.MaxAcceptableAdminLevel <= 0 ? RVDic.NotSet : params.MaxAcceptableAdminLevel;
                    editElems["input"].value = params.MaxAcceptableAdminLevel <= 0 ? "" : params.MaxAcceptableAdminLevel;
                },
                OnSave: function (start, done) {
                    var newLevel = +editElems["input"].value;
                    if (!editElems["input"].value || isNaN(newLevel) || (newLevel < 0)) return;

                    start();

                    CNAPI.SetMaxAcceptableAdminLevel({
                        NodeTypeID: that.Objects.NodeTypeID, MaxAcceptableAdminLevel: newLevel, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else params.MaxAcceptableAdminLevel = newLevel;

                            done(!result.ErrorText);
                        }
                    });
                }
            });
        }
    }
})();