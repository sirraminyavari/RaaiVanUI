(function () {
    if (window.AutoMessageManager) return;

    window.AutoMessageManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID
        };

        this.Options = {
            AudienceTypes: params.AudienceTypes || ["SendToOwner", "SpecificNode", "RefState"],
            GetStates: params.GetStates || function () { }
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI", "WFAPI"] }], {
            OnLoad: function () { that.initialize(params); }
        });
    }

    AutoMessageManager.prototype = {
        initialize: function (params) {
            var that = this;
            params = params || {};

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; color:green; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Messages }]
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
                            Type: "div", Style: "display:none; margin-" + RV_Float + ":1rem;", Name: "audTypesArea",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Name: "audTypeSelect", Style: "font-size:0.7rem;",
                                    Childs: [{ Type: "option", Childs: [{ Type: "text", TextValue: RVDic.WF.AudienceTypeSelect + "..." }] }]
                                }
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea", Style: "margin-top:0.5rem;" }
            ], that.ContainerDiv);

            var addButton = elems["addButton"];
            var audTypesArea = elems["audTypesArea"];
            var audTypeSelect = elems["audTypeSelect"];
            
            addButton.onclick = function () {
                if (that.Options.AudienceTypes.length == 1)
                    that.add_item(elems["itemsArea"], { AudienceType: that.Options.AudienceTypes[0] });
                else {
                    audTypeSelect.selectedIndex = 0;
                    audTypesArea.style.display = "inline-block";
                }
            };

            jQuery.each(that.Options.AudienceTypes || [], function (ind, val) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "option", Attributes: [{ Name: "title", Value: val }],
                        Childs: [{ Type: "text", TextValue: RVDic.WF[val] }]
                    }
                ], audTypeSelect);
            });

            audTypeSelect.onchange = function () {
                if (this.selectedIndex == 0) return;
                that.add_item(elems["itemsArea"], { AudienceType: this[this.selectedIndex].title });
                audTypesArea.style.display = "none";
            };

            jQuery.each(params.AutoMessages || [], function (ind, val) { that.add_item(elems["itemsArea"], val); });
        },

        add_item: function (container, item) {
            var that = this;
            item = item || {};

            var audienceType = item.AudienceType;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemContainer",
                    Class: "small-12 medium-12 large-12 rv-bg-color-trans-soft rv-border-radius-half",
                    Style: "position:relative; margin-top:0.5rem; padding:0.5rem; padding-" + RV_Float + ":2rem; min-height:3.7rem;",
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
                                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "nodeSelectArea",
                                    Style: "position:relative; margin:0rem; padding-" + RV_RevFloat + ":6rem;" +
                                        "margin-bottom:0.5rem; display:none;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0rem; width:5rem;",
                                            Childs: [
                                                {
                                                    Type: "middle",
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
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "small-5 medium-5 large-5", Name: "nodeTypeSelect",
                                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                                        },
                                        { Type: "div", Class: "small-7 medium-7 large-7", Name: "nodeSelect" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "stateSelectArea",
                                    Style: "display:none; margin-bottom:0.5rem;",
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                            Childs: [
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "info", Style: "margin-bottom:0.5rem;" },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyTextArea" }
                            ]
                        }
                    ]
                }
            ], container);
            
            var removeButton = elems["removeButton"];
            var editButton = elems["editButton"];
            var itemContainer = elems["itemContainer"];
            var editArea = elems["editArea"];
            var viewArea = elems["viewArea"];
            var nodeSelectArea = elems["nodeSelectArea"];
            var stateSelectArea = elems["stateSelectArea"];
            var adminCheckbox = elems["adminCheckbox"];

            var infoArea = elems["info"];
            var bodyTextArea = elems["bodyTextArea"];

            var mainEditArea = audienceType == "SpecificNode" ? nodeSelectArea :
                (audienceType == "RefState" ? stateSelectArea : null);
            if (mainEditArea) mainEditArea.style.display = "flex";

            var stateSelect = GlobalUtilities.append_autosuggest(elems["stateSelectArea"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7;",
                InnerTitle: RVDic.StateSelect + "...",
                AjaxDataSource: function (text, callback) {
                    that.Options.GetStates(function (states) {
                        var arr = [];
                        for (var i = 0, lnt = states.length; i < lnt; ++i)
                            arr.push([Base64.decode(states[i].Title), states[i].StateID]);
                        callback(arr);
                    });
                }
            });

            var nodeSelect = GlobalUtilities.append_autosuggest(elems["nodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7;",
                InnerTitle: RVDic.NodeSelect + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].Name || "");
                        if ((items[i].AdditionalID || "") == "") tt += " - " + Base64.decode(items[i].AdditionalID || "");
                        arr.push([tt, items[i].NodeID]);
                    }
                    return arr;
                }
            });

            var nodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    var nodeTypeId = this.values[index];
                    var nodeType = this.keywords[index];
                    nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(nodeSelect.InputElement, RVDic.SelectN.replace("[n]", nodeType));
                }
            });

            var descriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["descriptionArea"], DefaultText: RVDic.Description + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            removeButton.onclick = function () {
                GlobalUtilities.confirm(RVDic.Confirms.AutoMessageRemove, function (r) {
                    if (!r) return;

                    if (!item.AutoMessageID)
                        itemContainer.parentNode.removeChild(itemContainer);
                    else {
                        GlobalUtilities.block(itemContainer);

                        WFAPI.RemoveAutoMessage({
                            AutoMessageID: item.AutoMessageID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.Succeed) itemContainer.parentNode.removeChild(itemContainer);
                                else GlobalUtilities.unblock(itemContainer);
                            }
                        });
                    }
                });
            };

            var _set_info_desc = function () {
                var _desc = Base64.decode(item.BodyText);

                infoArea.innerHTML = bodyTextArea.innerHTML = "";

                //Desc Area
                var descElems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "span",
                        Childs: [{ Type: "text", TextValue: RVDic.Description + ": " }]
                    },
                    { Type: "span", Style: "color:rgb(80,80,80);", Name: "desc" }
                ], bodyTextArea);

                if (!_desc) descElems["desc"].innerHTML = "(" + RVDic.DescriptionIsEmpty + ")";
                else GlobalUtilities.append_markup_text(descElems["desc"], _desc);

                descElems["desc"].setAttribute("class", "_"); //this is necessary!!!
                //end of Desc Area

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block;",
                        Childs: [{ Type: "text", TextValue: RVDic.AudienceType + ": " }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: RVDic.WF[audienceType] }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (item.NodeTypeID && (audienceType == "SpecificNode") ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.RoleType + ": " + Base64.decode(item.NodeType) }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (item.NodeID && (audienceType == "SpecificNode") ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.RoleType + ": " + Base64.decode(item.NodeName) }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + ((item.Admin === true) && (audienceType == "SpecificNode") ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Admin }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (item.RefStateID && (audienceType == "RefState") ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.State + ": " + Base64.decode(item.RefStateTitle) }]
                    }
                ], infoArea);

                descriptionInput.set_data(_desc);

                if ((audienceType == "RefState") && item.RefStateID)
                    stateSelect.set_item(item.RefStateID, Base64.decode(item.RefStateTitle));
                else if (audienceType == "SpecificNode") {
                    if (item.Admin === true) adminCheckbox.Check({ StopOnChange: true });
                    else adminCheckbox.Uncheck({ StopOnChange: true });

                    if (item.NodeTypeID) {
                        nodeTypeSelect.set_item(item.NodeTypeID, Base64.decode(item.NodeType));
                        nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: item.NodeTypeID }));
                        GlobalUtilities.set_inner_title(nodeSelect.InputElement,
                            RVDic.CN.SelectN.replace("[n]", Base64.decode(item.NodeType)));
                    }

                    if (item.NodeID) nodeSelect.set_item(item.NodeID, Base64.decode(item.NodeName));
                }
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
                    var index = nodeTypeSelect.selectedIndex;
                    var nodeTypeId = index < 0 ? item.NodeTypeID : nodeTypeSelect.values[index];
                    var nodeType = index < 0 ? Base64.decode(item.NodeType) : nodeTypeSelect.keywords[index];

                    index = nodeSelect.selectedIndex;
                    var nodeId = index < 0 ? item.NodeID : nodeSelect.values[index];
                    var nodeName = index < 0 ? Base64.decode(item.NodeName) : nodeSelect.keywords[index];
                    if (!nodeSelect.InputElement.value) nodeId = nodeTypeId = "";
                    if ((audienceType == "SpecificNode") && !nodeId) return alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.Node));

                    var admin = audienceType == "SpecificNode" ? adminCheckbox.Checked : item.Admin === true;

                    index = stateSelect.selectedIndex;
                    var stateId = index < 0 ? item.RefStateID : stateSelect.values[index];
                    var stateTitle = index < 0 ? Base64.decode(item.RefStateTitle) : stateSelect.keywords[index];
                    if (!stateSelect.InputElement.value) stateId = stateTitle = "";
                    if ((audienceType == "RefState") && !stateId) return alert(RVDic.Checks.PleaseSelectState);

                    var newDescription = GlobalUtilities.trim(descriptionInput.get_data());
                    if (!newDescription) return alert(RVDic.Checks.DescriptionCannotBeEmpty);

                    GlobalUtilities.block(itemContainer);

                    WFAPI.SetAutoMessage({
                        AutoMessageID: item.AutoMessageID, OwnerID: that.Objects.OwnerID,
                        BodyText: Base64.encode(newDescription), AudienceType: audienceType,
                        RefStateID: stateId, NodeID: nodeId, Admin: admin, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                if (result.AutoMessage) item.AutoMessageID = result.AutoMessage.AutoMessageID;
                                item.BodyText = Base64.encode(newDescription);
                                if (audienceType == "RefState") {
                                    item.RefStateID = stateId;
                                    item.RefStateTitle = Base64.encode(stateTitle);
                                }
                                if (audienceType == "SpecificNode") {
                                    item.NodeID = nodeId;
                                    item.NodeName = Base64.encode(nodeName);
                                    item.NodeTypeID = nodeTypeId;
                                    item.NodeType = Base64.encode(nodeType);
                                    item.Admin = admin;
                                }
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

            if (!item.AutoMessageID) _on_edit();
            _set_info_desc();
        } //end of 'add_item'
    }
})();