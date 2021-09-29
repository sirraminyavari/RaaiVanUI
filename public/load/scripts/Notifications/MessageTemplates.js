(function () {
    if (window.MessageTemplates) return;

    window.MessageTemplates = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        params = params || {};

        this.Interface = {
            ItemsArea: null
        };

        this.Objects = {
            OwnerID: params.OwnerID || ""
        };

        this.Options = {
            Title: RVDic.Messages,
            AudienceTypes: ["Creator", "Contributor", "SpecificNode", "Experts", "Members", "RefOwner"]
        };

        GlobalUtilities.extend(this.Options, (params.Options || {}));

        var that = this;

        GlobalUtilities.load_files(["API/NotificationsAPI.js"], {
            OnLoad: function () { that._preinit(); }
        });
    }

    MessageTemplates.prototype = {
        _preinit: function () {
            var that = this;

            NotificationsAPI.GetOwnerMessageTemplates({
                OwnerID: that.Objects.OwnerID,
                ParseResults: true,
                ResponseHandler: function (templates) { that._initialize(templates); }
            });
        },

        _initialize: function (templates) {
            templates = templates || {};
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; margin-bottom:1rem; padding:0rem 2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-plus fa-lg rv-icon-button", Name: "addButton", Tooltip: RVDic.Add,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold; text-align:center;",
                            Childs: [{ Type: "text", TextValue: that.Options.Title }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:none; margin-bottom:1rem; text-align:center;", Name: "audTypesArea",
                    Childs: [
                        {
                            Type: "select", Class: "rv-input",
                            Style: "width:12rem; font-size:0.7rem;", Name: "audTypeSelect",
                            Childs: [{ Type: "option", Childs: [{ Type: "text", TextValue: RVDic.WF.AudienceTypeSelect + "..." }] }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" }
            ], that.ContainerDiv);

            var addButton = elems["addButton"];
            var audTypesArea = elems["audTypesArea"];
            that.Interface.ItemsArea = elems["itemsArea"];

            addButton.onclick = function () {
                if (that.Options.AudienceTypes.length == 1) that.add_item({ AudienceType: that.Options.AudienceTypes[0] });
                else {
                    audTypeSelect.selectedIndex = 0;
                    audTypesArea.style.display = "block";
                }
            };

            var audTypeSelect = elems["audTypeSelect"];

            for (var i = 0, lnt = that.Options.AudienceTypes.length; i < lnt; ++i) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "option",
                        Attributes: [{ Name: "title", Value: that.Options.AudienceTypes[i] }],
                        Childs: [{ Type: "text", TextValue: RVDic.NTFN.AudienceTypes[that.Options.AudienceTypes[i]] }]
                    }
                ], audTypeSelect);
            }

            audTypeSelect.onchange = function () {
                if (this.selectedIndex == 0) return;
                that.add_item({ AudienceType: this[this.selectedIndex].title });
                audTypesArea.style.display = "none";
            };

            for (var i = 0, lnt = (templates || []).length; i < lnt; ++i) that.add_item(templates[i]);
        },

        add_item: function (item, params) {
            item = item || {};
            params = params || {};
            var that = this;

            var audienceType = item.AudienceType || "";

            item.AudienceNodeType = Base64.decode(item.AudienceNodeType || "");
            item.AudienceNodeName = Base64.decode(item.AudienceNodeName || "");
            item.BodyText = Base64.decode(item.BodyText || "");
            //item.RefOwnerName = Base64.decode(item.RefOwnerName || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemContainer",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white",
                    Style: "position:relative; padding:0.3rem; margin-top:0.3rem; padding-" + RV_Float + ":2rem; min-height:3.2rem;", 
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem; width:1.5rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton",
                                            Style: "margin-bottom:0.5rem;", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "nodeSelectArea",
                                    Style: "display:none; margin:0rem; margin-bottom:1rem;", 
                                    Childs: [
                                        { Type: "div", Class: "small-7 medium-8 large-9", Name: "nodeTypeSelect" },
                                        {
                                            Type: "div", Class: "small-5 medium-4 large-3", Style: "padding-" + RV_Float + ":0.5rem;",
                                            Childs: [
                                                {
                                                    Type: "checkbox", Name: "adminCheckbox",
                                                    Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.3rem;"
                                                },
                                                { Type: "label", Childs: [{ Type: "text", TextValue: RVDic.BeAdmin }] }
                                            ]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeSelect", Style: "margin-top:0.5rem;" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "stateSelectArea",
                                    Style: "display:none; margin-bottom:1rem;"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea" }
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
            ], that.Interface.ItemsArea);

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

            var mainEditArea = audienceType == "SpecificNode" ? nodeSelectArea : (audienceType == "RefOwner" ? stateSelectArea : null);
            if (mainEditArea) mainEditArea.style.display = "flex";

            var nodeSelect = GlobalUtilities.append_autosuggest(elems["nodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + "...",
                AjaxDataSource: CNAPI.GetNodes(),
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
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), (nodeTypes[i].NodeTypeID || "")]);
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    var nodeTypeId = this.values[index];
                    var nodeType = this.keywords[index];
                    nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(nodeSelect.InputElement, RVDic.Select + " " + nodeType + "...");
                }
            });

            var descriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["descriptionArea"], DefaultText: RVDic.Description + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            var _on_remove = function () {
                if (!item.TemplateID || item.TemplateID == "")
                    itemContainer.parentNode.removeChild(itemContainer);
                else {
                    GlobalUtilities.block(itemContainer);

                    NotificationsAPI.RemoveMessageTemplate({
                        TemplateID: item.TemplateID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.Succeed) itemContainer.parentNode.removeChild(itemContainer);
                            else GlobalUtilities.unblock(itemContainer);
                        }
                    });
                }
            }

            removeButton.onclick = function () {
                GlobalUtilities.confirm(RVDic.Confirms.MessageTemplateRemove, function (result) { if (result) _on_remove(); });
            };

            var _set_info_desc = function () {
                var _bt = item.BodyText;
                bodyTextArea.innerHTML = !_bt ? RVDic.DescriptionIsEmpty : "";
                if (_bt) GlobalUtilities.append_markup_text(bodyTextArea, _bt);

                GlobalUtilities.set_text(infoArea, RVDic.NTFN.AudienceTypes[audienceType] + (audienceType == "SpecificNode" ?
                    " - " + item.AudienceNodeName + (item.AudienceNodeAdmin === true ? " - " + RVDic.Admin : "") : ""));
            };

            var _on_edit = function () {
                var set_things = function () {
                    var _bt = item.BodyText || "";

                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_info_desc();
                    descriptionInput.set_data(_bt);

                    if (audienceType == "SpecificNode") {
                        adminCheckbox.checked = item.Admin === true;
                        if (item.AudienceNodeTypeID) {
                            nodeTypeSelect.set_item(item.AudienceNodeTypeID || "", item.AudienceNodeType || "");
                            nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: item.AudienceNodeTypeID }));
                            GlobalUtilities.set_inner_title(nodeSelect.InputElement, RVDic.Select + " " + item.AudienceNodeType + "...");
                        }
                        if (item.AudienceNodeID) nodeSelect.set_item(item.AudienceNodeID || "", item.AudienceNodeName || "");
                    }

                    editButton.setAttribute("class",
                        editButton.__Editing ? "fa fa-floppy-o fa-lg rv-icon-button" : "fa fa-pencil fa-lg rv-icon-button");
                }

                if (editButton.__Editing === true) {
                    var newDescription = GlobalUtilities.trim(descriptionInput.get_data());

                    var index = nodeSelect.selectedIndex;
                    var _nid = index < 0 ? item.NodeID || "" : nodeSelect.values[index];

                    if ((audienceType == "SpecificNode") && !_nid) return alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.Node));

                    var _nName = index < 0 ? "" : nodeSelect.keywords[index];

                    var _ad = audienceType == "SpecificNode" ? adminCheckbox.checked : item.Admin === true;

                    if (!newDescription) return alert(RVDic.Checks.DescriptionCannotBeEmpty);

                    GlobalUtilities.block(itemContainer);

                    NotificationsAPI.SetMessageTemplate({
                        TemplateID: item.TemplateID || "", OwnerID: that.Objects.OwnerID || "",
                        BodyText: Base64.encode(newDescription), AudienceType: audienceType,
                        AudienceNodeID: _nid, AudienceNodeAdmin: _ad, AudienceRefOwnerID: null, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                if (result.TemplateID) item.TemplateID = result.TemplateID || "";
                                item.BodyText = newDescription;
                                item.AudienceRefOwnerID = null;
                                item.AudienceNodeID = _nid;
                                item.AudienceNodeName = _nName;
                                item.AudienceNodeAdmin = _ad;
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

            if (!item.TemplateID) _on_edit();
            _set_info_desc();
        } //end of 'add_item'
    }
})();