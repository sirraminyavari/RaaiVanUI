(function () {
    if (window.NeededFormsManager) return;

    window.NeededFormsManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            WorkFlowID: params.WorkFlowID,
            InStateID: params.InStateID,
            OutStateID: params.OutStateID
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js"], { OnLoad: function () { that.initialize(params); } });
    }

    NeededFormsManager.prototype = {
        initialize: function (params) {
            params = params || {};
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; color:green; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Forms }]
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
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea", Style: "margin-top:0.5rem;" }
            ], that.ContainerDiv);

            elems["addButton"].onclick = function () { that.add_item(elems["itemsArea"]); };

            jQuery.each(params.Forms || [], function (ind, val) { that.add_item(elems["itemsArea"], val); });
        },

        add_item: function (container, item) {
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
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; padding-" + RV_RevFloat + ":6rem;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0rem; width:5rem;",
                                            Childs: [
                                                {
                                                    Type: "middle",
                                                    Childs: [
                                                        {
                                                            Type: "checkbox", Name: "necessaryCheckbox",
                                                            Style: "width:1rem; height:1rem; cursor:pointer;"
                                                        },
                                                        {
                                                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.4rem;",
                                                            Childs: [{ Type: "text", TextValue: RVDic.Necessary }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "formSelect" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-top:1rem; font-size:0.7rem; text-align:center;",
                                    Childs: [{ Type: "text", TextValue: RVDic.WF.NeededFormDescription }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea", Style: "margin-top:0.4rem;" }
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
            var necessaryCheckbox = elems["necessaryCheckbox"];
            var infoArea = elems["info"];
            var bodyTextArea = elems["bodyTextArea"];

            var formSelect = GlobalUtilities.append_autosuggest(elems["formSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle:  RVDic.FormSelect + "...",
                AjaxDataSource: FGAPI.GetFormsDataSource(),
                ResponseParser: function (responseText) {
                    var forms = JSON.parse(responseText).Forms || [];
                    var arr = [];
                    for (var i = 0, lnt = forms.length; i < lnt; ++i)
                        arr.push([Base64.decode(forms[i].Title || ""), forms[i].FormID || ""]);
                    return arr;
                }
            });

            var descriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["descriptionArea"], DefaultText: RVDic.Description + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            removeButton.onclick = function () {
                GlobalUtilities.confirm(RVDic.Confirms.FormRemove, function (r) {
                    if (!r) return;

                    if (!item.FormID)
                        itemContainer.parentNode.removeChild(itemContainer);
                    else {
                        GlobalUtilities.block(itemContainer);

                        WFAPI.RemoveStateConnectionForm({
                            WorkFlowID: that.Objects.WorkFlowID, InStateID: that.Objects.InStateID,
                            OutStateID: that.Objects.OutStateID, FormID: item.FormID, ParseResults: true,
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
                        Childs: [{ Type: "text", TextValue: RVDic.Form + ": " }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(item.Title) }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (item.Necessary === true ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Necessary }]
                    }
                ], infoArea);

                descriptionInput.set_data(_desc);

                if (item.Necessary === true) necessaryCheckbox.Check({ StopOnChange: true });
                else necessaryCheckbox.Uncheck({ StopOnChange: true });

                if (item.FormID) formSelect.set_item(item.FormID, Base64.decode(item.Title));
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

                    var index = formSelect.selectedIndex;
                    var _fid = index < 0 ? item.FormID : formSelect.values[index];
                    var _fTitle = index < 0 ? "" : formSelect.keywords[index];
                    if (!formSelect.InputElement.value) _fid = _fTitle = "";
                    if (!_fid) return alert(RVDic.Checks.PleaseSelectForm);

                    var _nc = necessaryCheckbox.Checked;

                    GlobalUtilities.block(itemContainer);

                    WFAPI.SetStateConnectionForm({
                        WorkFlowID: that.Objects.WorkFlowID, InStateID: that.Objects.InStateID,
                        OutStateID: that.Objects.OutStateID, FormID: _fid, Necessary: _nc,
                        Description: Base64.encode(newDescription), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                item.FormID = _fid;
                                item.Description = Base64.encode(newDescription);
                                item.Title = Base64.encode(_fTitle);
                                item.Necessary = _nc;
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

            if (!item.FormID) _on_edit();
            _set_info_desc();
        } //end of 'add_item'
    }
})();