(function () {
    if (window.StateManager) return;

    window.StateManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;
        params = params || {};

        this.Objects = {
            WorkFlowID: params.WorkFlowID,
            State: params.State || {}
        };

        this.Options = {
            GetStates: params.GetStates || function () { }
        };
        
        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "FGAPI", "WFAPI"] },
            {
                Root: "WorkFlowManager/", Ext: "js",
                Childs: ["ResponsibleManager", "DataNeedsManager", "RejectionSettings"]
            }
        ], { OnLoad: function () { that.initialize(); } });
    }

    StateManager.prototype = {
        initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var create_checkbox = function (p) {
                p = p || {}  ;
                
                return {
                    Type: "div", Style: "padding:0.5rem;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Childs: [
                        {
                            Type: "checkbox",
                            Style: "width:1.2rem; height:1.2rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;",
                            Params: { 
                                Checked: p.Value,
                                OnChange: function () {
                                    var __this = this;
                                    var checked = __this.Checked;
                                    GlobalUtilities.block(__this.parentNode);

                                    var dt = {};
                                    dt[p.ParamName] = checked;

                                    WFAPI[p.APIFunction](GlobalUtilities.extend({
                                        WorkFlowID: that.Objects.WorkFlowID,
                                        StateID: (that.Objects.State || {}).StateID, ParseResults: true,
                                        ResponseHandler: function (result) {
                                            if (result.ErrorText) {
                                                if (!checked) __this.Check({ StopOnChange: true });
                                                else __this.Uncheck({ StopOnChange: true });
                                            }

                                            GlobalUtilities.unblock(__this.parentNode);
                                        }
                                    }, dt));
                                }
                            }
                        },
                        { Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: p.Title }] }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:1rem; font-size:1.2rem; font-weight:bold; text-align:center;",
                    Childs: [{Type: "text", TextValue: Base64.decode(that.Objects.State.Title)}]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "descriptionArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "tagArea"
                },
                {
                    Type: "div", Style: "padding:0.5rem;", Name: "responsibleSection",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white"
                },
                create_checkbox({
                    Value: that.Objects.State.DescriptionNeeded !== false,
                    APIFunction: "SetStateDescriptionNeeded",
                    ParamName: "DescriptionNeeded",
                    Title: RVDic.WF.DescriptionCompulsoryForAction
                }),
                create_checkbox({
                    Value: that.Objects.State.HideOwnerName === true,
                    APIFunction: "SetStateHideOwnerName",
                    ParamName: "HideOwnerName",
                    Title: RVDic.WF.HideCreatorName
                }),
                create_checkbox({
                    Value: that.Objects.State.EditPermission === true,
                    APIFunction: "SetStateEditPermission",
                    ParamName: "EditPermission",
                    Title: RVDic.WF.GrantEditPermission
                }),
                {
                    Type: "div", Style: "padding:0.5rem;", Name: "rejectionSettings",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white"
                },
                {
                    Type: "div", Style: "padding:0.5rem;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Childs: [
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Style: "display:inline-block;",
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        this.parentNode.removeChild(this);
                                        that.set_form_limits(elems["formLimits"], that.Objects.State.ID);
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.WF.EditableFormFields }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "formLimits" }
                    ]
                },
                {
                    Type: "div", Style: "padding:0.5rem;", Name: "pollArea",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white"
                },
                {
                    Type: "div", Style: "padding:0.5rem;", Name: "dataNeedsSection",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white"
                }
            ], that.ContainerDiv);

            that.set_description(elems["descriptionArea"]);

            that.set_tag(elems["tagArea"]);

            that.set_poll(elems["pollArea"]);

            //Rejection
            GlobalUtilities.loading(elems["rejectionSettings"]);

            new RejectionSettings(elems["rejectionSettings"], {
                WorkFlowID: that.Objects.WorkFlowID, State: that.Objects.State,
                GetStates: that.Options.GetStates
            });
            //end of Rejection

            new ResponsibleManager(elems["responsibleSection"], {
                WorkFlowID: that.Objects.WorkFlowID, State: that.Objects.State,
                GetStates: that.Options.GetStates
            });

            new DataNeedsManager(elems["dataNeedsSection"], {
                WorkFlowID: that.Objects.WorkFlowID, State: that.Objects.State,
                GetStates: that.Options.GetStates
            });
        },

        set_description: function (container) {
            var that = this;

            var description = Base64.decode(that.Objects.State.Description);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:0.4rem; font-size:0.8rem; text-align:center; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.WF.StateDescriptionInfo }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":2.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionData" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea" }
                    ]
                }
            ], container);

            var descriptionData = elems["descriptionData"];
            var editArea = elems["editArea"];

            var descriptionInput = new AdvancedTextArea({
                ContainerDiv: editArea, DefaultText: RVDic.Description + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            var editButton = elems["editButton"];

            var _set_desc = function () {
                descriptionData.innerHTML = !description ? "(" + RVDic.DescriptionIsEmpty + ")" : "";
                if (description) GlobalUtilities.append_markup_text(descriptionData, description);

                descriptionInput.set_data(description);
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    descriptionData.style.display = editButton.__Editing ? "none" : "block";

                    _set_desc();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newDescription = GlobalUtilities.trim(descriptionInput.get_data());

                    var ____save = function () {
                        GlobalUtilities.block(container);

                        WFAPI.SetWorkFlowStateDescription({
                            WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID,
                            Description: Base64.encode(newDescription), ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else {
                                    description = newDescription;
                                    that.Objects.State.Description = Base64.encode(newDescription);
                                    editButton.__Editing = false;
                                    set_things();
                                }

                                GlobalUtilities.unblock(container);
                            }
                        });
                    };

                    if (!newDescription) {
                        GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveEmptyDescription, function (result) {
                            if (!result) return;
                            ____save();
                        });
                    }
                    else
                        ____save();
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            if (!description) _on_edit();
            _set_desc();
        },

        set_tag: function (container) {
            var that = this;

            var tag = Base64.decode((that.Objects.State || {}).Tag);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":2.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-2x rv-icon-button", Name: "tagRemoveButton",
                                    Style: "margin-top:-0.3rem;", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "i", Class: "fa fa-floppy-o fa-2x rv-icon-button", Name: "saveTag", Tooltip: RVDic.Save,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "tagSelect" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "tagView",
                            Childs: [{ Type: "text", TextValue: tag }]
                        }
                    ]
                }
            ], container);

            var tagSelect = GlobalUtilities.append_autosuggest(elems["tagSelect"], {
                AjaxDataSource: CNAPI.GetTagsDataSource(),
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.TagSelect,
                ResponseParser: function (responseText) {
                    var tags = JSON.parse(responseText).Tags || [];
                    var arr = [];
                    for (var i = 0, lnt = tags.length; i < lnt; ++i)
                        arr.push([Base64.decode(tags[i].Tag || ""), tags[i].TagID || ""]);
                    return arr;
                }
            });

            var _show_tag = function (_tg) {
                elems["tagView"].style.display = elems["tagRemoveButton"].style.display = "block";
                elems["tagSelect"].style.display = elems["saveTag"].style.display = "none";

                elems["tagView"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block;",
                        Childs: [{ Type: "text", TextValue: RVDic.Tag }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(GlobalUtilities.secure_string(_tg)) }]
                    }
                ], elems["tagView"]);
            };

            var _hide_tag = function () {
                elems["tagView"].style.display = elems["tagRemoveButton"].style.display = "none";
                elems["tagSelect"].style.display = elems["saveTag"].style.display = "block";
                tagSelect.InputElement.value = "";
            };

            if (tag) _show_tag(tag);
            else _hide_tag();

            elems["saveTag"].onclick = function () {
                var selectedTag = GlobalUtilities.trim(tagSelect.InputElement.value);
                if (!selectedTag) return;

                GlobalUtilities.block(container);

                WFAPI.SetWorkFlowStateTag({
                    WorkFlowID: that.Objects.WorkFlowID, StateID: (that.Objects.State || {}).StateID,
                    Tag: Base64.encode(selectedTag), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        _show_tag(selectedTag);
                        GlobalUtilities.unblock(container);
                    }
                });
            }

            elems["tagRemoveButton"].onclick = function () {
                GlobalUtilities.block(container);

                WFAPI.RemoveWorkFlowStateTag({
                    WorkFlowID: that.Objects.WorkFlowID, StateID: (that.Objects.State || {}).StateID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        _hide_tag();
                        GlobalUtilities.unblock(container);
                    }
                });
            }
        },

        set_form_limits: function (container, ownerId) {
            var that = this;

            container.innerHTML = "";

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["FormsManager/FormOwner.js"], {
                OnLoad: function () { new FormOwner(container, { OwnerID: ownerId }); }
            });
        },

        set_poll: function (container) {
            var that = this;

            var poll = (that.Objects.State || {}).Poll || {};

            var id = poll.PollID || "";
            var name = Base64.decode(poll.Name || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":7.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Style: "margin-" + RV_RevFloat + ":1rem;", Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":2.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Poll + ":" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                            Style: "color:green; font-weight:bold;"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea" }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];

            var pollSelect = GlobalUtilities.append_autosuggest(editArea, {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.PollSelect + "...",
                AjaxDataSource: FGAPI.GetPolls({ Count: 20 }),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Polls || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i].Name || ""), items[i].PollID]);
                    return arr;
                }
            });

            var _set_data = function () {
                GlobalUtilities.set_text(viewArea, !name ? RVDic.NotSet : name);
                if (id) pollSelect.set_item(id, name);
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var index = pollSelect.selectedIndex;
                    var newId = index >= 0 ? pollSelect.values[index] : "";
                    var newName = index >= 0 ? pollSelect.keywords[index] : "";

                    var _val = GlobalUtilities.trim(pollSelect.InputElement.value);
                    if (!_val) newId = newName = "";

                    GlobalUtilities.block(container);

                    WFAPI.SetStatePoll({
                        WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID,
                        PollID: newId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                id = newId;
                                name = newName;
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

            if (!id) _on_edit();
            _set_data();
        }
    };
})();