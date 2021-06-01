(function () {
    if (window.DataNeedsManager) return;

    window.DataNeedsManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            DataNeedsArea: null,
            ItemsArea: null
        };

        this.Objects = {
            WorkFlowID: params.WorkFlowID,
            State: params.State || {}
        };

        this.Options = {
            GetStates: params.GetStates || function () { }
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI", "WFAPI", "FGAPI"] }], {
            OnLoad: function () { that.initialize(); }
        });
    };

    DataNeedsManager.prototype = {
        initialize: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:0.5rem; font-weight:bold; text-align:center;",
                    Childs: [{ Type: "text", TextValue: RVDic.DataNeedSettings }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;", Name: "descriptionArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        [
                            {
                                Type: "checkbox", Style: "width:1.2rem; height:1.2rem; cursor:pointer;",
                                Params: {
                                    Checked: that.Objects.State.FreeDataNeedRequests === true,
                                    OnChange: function () {
                                        var __this = this;
                                        var checked = __this.checked;
                                        GlobalUtilities.block(__this.parentNode);

                                        WFAPI.SetFreeDataNeedRequests({
                                            WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID,
                                            FreeDataNeedRequests: checked, ParseResults: true,
                                            ResponseHandler: function (result) {
                                                if (result.ErrorText) {
                                                    if (checked) __this.Uncheck({ StopOnChange: true });
                                                    else __this.Check({ StopOnChange: true });
                                                }
                                                else that.Objects.State.FreeDataNeedRequests = checked;

                                                GlobalUtilities.unblock(__this.parentNode);
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.FreeDataNeedRequests }]
                            }
                        ]
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "typeSetArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;", Name: "dataneedsArea",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; color:green; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.DataNeeds }]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "addButton",
                            Style: "display:inline-block; margin-" + RV_Float + ":1rem; font-size:0.7rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-plus", Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.Add }
                            ]
                        },
                        {
                            Type: "div", Style: "margin-top:0.5rem;", Name: "itemsArea",
                            Class: "small-12 medium-12 large-12 rv-trim-vertical-margins"
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.DataNeedsArea = elems["dataneedsArea"];
            that.Interface.ItemsArea = elems["itemsArea"];

            that.set_description(elems["descriptionArea"]);
            that.set_data_needs_type(elems["typeSetArea"]);

            elems["addButton"].onclick = function () { that.add_data_need(); };

            jQuery.each(that.Objects.State.DataNeeds || [], function (ind, val) { that.add_data_need(val); });
        },

        set_description: function (container) {
            var that = this;

            var description = Base64.decode(that.Objects.State.DataNeedsDescription);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:0.4rem; font-size:0.8rem; text-align:center; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.WF.DataNeedsDescriptionInfo }]
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

                        WFAPI.SetStateDataNeedsDescription({
                            WorkFlowID: that.Objects.WorkFlowID || "",
                            StateID: that.Objects.StateID || "",
                            Description: Base64.encode(newDescription),
                            ResponseHandler: function (responseText) {
                                var result = JSON.parse(responseText);

                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else {
                                    description = newDescription;
                                    that.Objects.State.DataNeedsDescription = Base64.encode(newDescription);
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

        set_data_needs_type: function (container) {
            var that = this;

            var dataNeedsType = that.Objects.State.DataNeedsType;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-air-button rv-circle", Style: "display:inline-block;", Name: "setButton",
                    Childs: [{ Type: "text", TextValue: RVDic.SetDataNeedsType }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "typeSelectArea",
                    Style: "position:relative; padding-" + RV_Float + ":2.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:-0.2rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-2x rv-icon-button", Name: "removeButton", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "curTypeArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: "optionsArea",
                            Style: "position:relative; margin:0rem; padding-" + RV_Float + ":2.5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-floppy-o fa-2x rv-icon-button", Name: "saveButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-6 medium-4 large-4",
                                    Childs: [
                                        {
                                            Type: "select", Class: "rv-input", Style: "font-size:0.7rem;", Name: "typeSelect",
                                            Childs: [
                                                {
                                                    Type: "option",
                                                    Childs: [{ Type: "text", TextValue: RVDic.SetDataNeedsType + "..." }]
                                                },
                                                {
                                                    Type: "option",
                                                    Attributes: [{ Name: "title", Value: "SpecificNodes" }],
                                                    Childs: [{ Type: "text", TextValue: RVDic.WF.SendToSpecificNodes }]
                                                },
                                                {
                                                    Type: "option",
                                                    Attributes: [{ Name: "title", Value: "RefState" }],
                                                    Childs: [{ Type: "text", TextValue: RVDic.WF.RefState }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-6 medium-8 large-8", Name: "refStateArea",
                                    Style: "padding-" + RV_Float + ":1rem;"
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var setButton = elems["setButton"];
            var typeSelectArea = elems["typeSelectArea"];
            var removeButton = elems["removeButton"];
            var curTypeArea = elems["curTypeArea"];
            var optionsArea = elems["optionsArea"];
            var saveButton = elems["saveButton"];
            var typeSelect = elems["typeSelect"];
            var refStateArea = elems["refStateArea"];

            var stateSelect = GlobalUtilities.append_autosuggest(refStateArea, {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.StateSelect,
                AjaxDataSource: function (text, callback) {
                    that.Options.GetStates(function (states) {
                        var arr = [];
                        for (var i = 0, lnt = states.length; i < lnt; ++i)
                            arr.push([Base64.decode(states[i].Title), states[i].StateID]);
                        callback(arr);
                    });
                }
            });

            var _save_data_needs_type = function (params) {
                params = params || {};

                GlobalUtilities.block(container);

                WFAPI.SetStateDataNeedsType({
                    WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID,
                    DataNeedsType: params.Type, RefStateID: params.RefStateID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText)
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            that.Objects.State.RefDataNeedsStateID = params.RefStateID;
                            that.Objects.State.RefDataNeedsStateTitle = Base64.encode(params.RefStateTitle);
                            _set_interface(params.Type, true);
                        }

                        GlobalUtilities.unblock(container);
                    }
                });
            };

            var _set_interface = function (_type, isViewMode) {
                var isNone = !_type || (_type == "None");
                isViewMode = isViewMode === true;

                if (that.Objects.State.RefDataNeedsStateID)
                    stateSelect.set_item(that.Objects.State.RefDataNeedsStateID, Base64.decode(that.Objects.State.RefDataNeedsStateTitle));

                curTypeArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.DataNeedsType + ":" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.WF[_type == "SpecificNodes" ? "SendToSpecificNodes" : _type] }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (_type == "RefState" ? "inline-block" : "none") + "; font-size:0.7rem; cursor:default;",
                        Childs: [{ Type: "text", TextValue: RVDic.State + ": " + Base64.decode(that.Objects.State.RefDataNeedsStateTitle) }]
                    }
                ], curTypeArea);

                typeSelect.selectedIndex = 0;

                setButton.style.display = isNone && isViewMode ? "block" : "none";
                typeSelectArea.style.display = isNone && isViewMode ? "none" : "block";
                curTypeArea.style.display = isViewMode && !isNone ? "block" : "none";
                optionsArea.style.display = isViewMode ? "none" : "flex";
                refStateArea.style.display = "none";
                that.Interface.DataNeedsArea.style.display = _type == "SpecificNodes" ? "block" : "none";

                if (!isViewMode) removeButton.onclick = function () { _set_interface(_type, true); }
                else removeButton.onclick = function () { _save_data_needs_type({ Type: "None" }); }
            };

            _set_interface(dataNeedsType, true);

            setButton.onclick = function () { _set_interface(null, "TypeSelect"); };

            typeSelect.onchange = function () {
                var index = typeSelect.selectedIndex;
                var type = typeSelect[index].title;
                refStateArea.style.display = (index == 0) || (type != "RefState") ? "none" : "block";
            };

            saveButton.onclick = function () {
                var index = typeSelect.selectedIndex;
                if (index == 0) return;
                var _type = typeSelect[index].title;

                index = stateSelect.selectedIndex;
                var refStateId = index < 0 ? "" : stateSelect.values[index];
                var refStateTitle = index < 0 ? "" : stateSelect.keywords[index];

                if ((_type == "RefState") && !refStateId)
                    return alert(RVDic.PleaseSelectTheDesiredState);

                _save_data_needs_type({ Type: _type, RefStateID: refStateId, RefStateTitle: refStateTitle });
            };
        },

        add_data_need: function (item) {
            var that = this;
            item = item || {};

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemContainer",
                    Class: "small-12 medium-12 large-12 rv-bg-color-trans-soft rv-border-radius-half",
                    Style: "position:relative; margin-top:0.5rem; padding:0.5rem; padding-" + RV_Float + ":2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.5rem;" + RV_Float + ":0.5rem; width:2rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                            Tooltip: RVDic.Remove, Name: "removeButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:0.3rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button",
                                            Tooltip: RVDic.Edit, Name: "editButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: "editArea",
                            Style: "margin:0rem; display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeTypeSelect",
                                    Style: "margin-bottom:1rem; padding-" + RV_RevFloat + ":0.5rem;"
                                },
                                {
                                    Type: "div", Class: "small-6 medium-6 large-6", Name: "formSelect",
                                    Style: "margin-bottom:1rem; padding-" + RV_Float + ":0.5rem;"
                                },
                                {
                                    Type: "div", Class: "small-4 medium-4 large-4",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "adminCheckbox",
                                            Style: "width:1rem; height:1rem; cursor:pointer;"
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.4rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.BeAdmin }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-4 medium-4 large-4",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "multiselectCheckbox",
                                            Style: "width:1rem; height:1rem; cursor:pointer;"
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.4rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.EnableMultiSelect }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-4 medium-4 large-4",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "necessaryCheckbox",
                                            Style: "width:1rem; height:1rem; cursor:pointer;"
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.4rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.DataNeeded }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-top:1rem; font-size:0.7rem; text-align:center;",
                                    Childs: [{ Type: "text", TextValue: RVDic.WF.DataNeedsItemDescriptionInfo }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionInput", Style: "margin-top:0.4rem;" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                            Childs: [
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "info", Style: "margin-bottom:0.5rem;" },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea" }
                            ]
                        }
                    ]
                }
            ], that.Interface.ItemsArea);

            var removeButton = elems["removeButton"];
            var editButton = elems["editButton"];
            var itemContainer = elems["itemContainer"];
            var editArea = elems["editArea"];
            var viewArea = elems["viewArea"];
            var adminCheckbox = elems["adminCheckbox"];
            var multiselectCheckbox = elems["multiselectCheckbox"];
            var necessaryCheckbox = elems["necessaryCheckbox"];

            var infoArea = elems["info"];
            var descriptionArea = elems["descriptionArea"];

            var nodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            var formSelect = GlobalUtilities.append_autosuggest(elems["formSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.FormSelect + "...",
                AjaxDataSource: FGAPI.GetForms(),
                ResponseParser: function (responseText) {
                    var forms = JSON.parse(responseText).Forms || [];
                    var arr = [];
                    for (var i = 0, lnt = forms.length; i < lnt; ++i)
                        arr.push([Base64.decode(forms[i].Title), forms[i].FormID]);
                    return arr;
                }
            });

            var descriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["descriptionInput"], DefaultText: RVDic.Description + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            removeButton.onclick = function () {
                GlobalUtilities.confirm(RVDic.Confirms.DataNeedRemove, function (r) {
                    if (!r) return;

                    if (!item.NodeTypeID)
                        itemContainer.parentNode.removeChild(itemContainer);
                    else {
                        GlobalUtilities.block(itemContainer);

                        WFAPI.RemoveStateDataNeed({
                            WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID,
                            NodeTypeID: item.NodeTypeID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.Succeed) itemContainer.parentNode.removeChild(itemContainer);
                                else GlobalUtilities.unblock(itemContainer);
                            }
                        });
                    }
                });
            };

            var _set_info_desc = function () {
                var _desc = Base64.decode(item.Description);

                infoArea.innerHTML = descriptionArea.innerHTML = "";

                //Desc Area
                var descElems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "span",
                        Childs: [{ Type: "text", TextValue: RVDic.WF.DescriptionForDataNeedDirector + ": " }]
                    },
                    { Type: "span", Style: "color:rgb(80,80,80);", Name: "desc" }
                ], descriptionArea);

                if (!_desc) descElems["desc"].innerHTML = "(" + RVDic.DescriptionIsEmpty + ")";
                else GlobalUtilities.append_markup_text(descElems["desc"], _desc);

                descElems["desc"].setAttribute("class", "_"); //this is necessary!!!
                //end of Desc Area

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block;",
                        Childs: [{ Type: "text", TextValue: RVDic.RoleType + ": " }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(item.NodeType) }]
                    },
                    {
                        Type: "div",
                        Style: "display:" + (item.FormTitle ? "inline-block" : "none") + "; margin-" + RV_Float + ":1.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Form + ": " }]
                    },
                    {
                        Type: "div",
                        Style: "display:" + (item.FormTitle ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; margin-" + RV_RevFloat + ":1rem; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(item.FormTitle) }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (item.Admin === true ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Admin }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (item.MultiSelect === true ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.MultiSelect }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (item.Necessary === true ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Necessary }]
                    }
                ], infoArea);

                descriptionInput.set_data(_desc);

                if (item.Admin === true) adminCheckbox.Check({ StopOnChange: true });
                else adminCheckbox.Uncheck({ StopOnChange: true });

                if (item.MultiSelect === true) multiselectCheckbox.Check({ StopOnChange: true });
                else multiselectCheckbox.Uncheck({ StopOnChange: true });

                if (item.Necessary === true) necessaryCheckbox.Check({ StopOnChange: true });
                else necessaryCheckbox.Uncheck({ StopOnChange: true });

                if (item.NodeTypeID) nodeTypeSelect.set_item(item.NodeTypeID, Base64.decode(item.NodeType));
                if (item.FormID) formSelect.set_item(item.FormID, Base64.decode(item.FormTitle));
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "flex" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_info_desc();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-lg rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newDescription = GlobalUtilities.trim(descriptionInput.get_data());

                    var index = nodeTypeSelect.selectedIndex;
                    var _ntid = index < 0 ? item.NodeTypeID : nodeTypeSelect.values[index];
                    if (!_ntid) return alert(RVDic.Checks.PleaseSelectNodeType);
                    var _ntype = index < 0 ? "" : nodeTypeSelect.keywords[index];

                    index = formSelect.selectedIndex;
                    var _frmId = index < 0 ? item.FormID : formSelect.values[index];
                    var _frmTitle = index < 0 ? "" : formSelect.keywords[index];

                    var _ad = adminCheckbox.checked;
                    var _multiselect = multiselectCheckbox.checked;
                    var _necessary = necessaryCheckbox.checked;

                    GlobalUtilities.block(itemContainer);

                    WFAPI.SetStateDataNeed({
                        WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID,
                        PreviousNodeTypeID: item.NodeTypeID, NodeTypeID: _ntid, FormID: _frmId,
                        Admin: _ad, MultiSelect: _multiselect, Necessary: _necessary,
                        Description: Base64.encode(newDescription), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                item.NodeTypeID = _ntid;
                                item.Description = Base64.encode(newDescription);
                                item.NodeType = Base64.encode(_ntype);
                                item.FormID = _frmId;
                                item.FormTitle = Base64.encode(_frmTitle);
                                item.Admin = _ad;
                                item.MultiSelect = _multiselect;
                                item.Necessary = _necessary;

                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(itemContainer);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;

            if (!item.NodeTypeID) _on_edit();
            _set_info_desc();
        } //end of 'add_data_need'
    };
})();