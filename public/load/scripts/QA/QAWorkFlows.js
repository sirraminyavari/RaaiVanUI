/// <reference path="FAQCategoryAdmin.js" />
(function () {
    if (window.QAWorkFlows) return;

    window.QAWorkFlows = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;
        
        params = params || {};

        this.Interface = {
            ItemInput: null,
            ItemsArea: null,
            CommonPage: null,
            ShowRemovedButton: null,
            ShowExistingButton: null
        };

        this.Objects = {
            Items: {},
            OrderedItems: [],
            LastSelectedItemID: null
        };

        var that = this;

        GlobalUtilities.loading(that.ContainerDiv);

        GlobalUtilities.load_files(["API/QAAPI.js", "QA/QAWorkFlowSettings.js"], {
            OnLoad: function () { that._initialize(); }
        });
    }

    QAWorkFlows.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-4 large-3",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_RevFloat + ":2rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem; " + RV_RevFloat + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-sort fa-2x rv-icon-button", Name: "sortButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.sort_dialog(); }}]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 ActionButton",
                                    Style: "text-align:center; margin-bottom:0.6rem;", Name: "removedButton",
                                    Properties: [{ Name: "onclick", Value: function () { that.show_items({ Archive: true }); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.ShowRemovedWorkFlows }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 ActionButton",
                            Name: "existingButton",
                            Style: "text-align:center; margin-bottom:0.6rem; display:none;",
                            Properties: [{ Name: "onclick", Value: function () { that.show_items({ Archive: false }); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.ShowExistingWorkFlows }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Style: "width:100%;", Name: "itemInput",
                                    Attributes: [{ Name: "type", Value: "text" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-top:0.5rem;", Name: "itemsArea"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-8 large-9", Name: "commonPage",
                    Style: "padding-" + RV_Float + ":1rem;"
                }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];
            that.Interface.CommonPage = elems["commonPage"];
            that.Interface.ShowRemovedButton = elems["removedButton"];
            that.Interface.ShowExistingButton = elems["existingButton"];

            var itemInput = that.Interface.ItemInput = elems["itemInput"];
            GlobalUtilities.set_inner_title(itemInput, RVDic.NewWorkFlowName + "...");

            GlobalUtilities.set_onenter(itemInput, function () {
                var name = GlobalUtilities.trim(itemInput.value);
                if (name == "") return;

                QAAPI.AddNewWorkFlow({
                    Name: Base64.encode(name), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            return;
                        }
                        
                        that.add_item({
                            WorkFlowID: result.WorkFlowID,
                            Name: Base64.encode(name),
                            RemovableAfterConfirmation: true
                        }, false, { Add2Top: true });
                    }
                });

                itemInput.value = "";
            });

            that.show_items({ Archive: false });
        },

        show_items: function (params) {
            params = params || {};
            var that = this;

            params = params || {};
            var that = this;

            if (that.__GettingWorkFlows) return;
            that.__GettingWorkFlows = true;

            var archive = params.Archive;

            var fadeInButton = that.Interface[archive ? "ShowExistingButton" : "ShowRemovedButton"];
            var fadeOutButton = that.Interface[archive ? "ShowRemovedButton" : "ShowExistingButton"];

            if (fadeInButton == that.Interface.ShowRemovedButton) fadeInButton = fadeInButton.parentNode;
            if (fadeOutButton == that.Interface.ShowRemovedButton) fadeOutButton = fadeOutButton.parentNode;

            jQuery(fadeOutButton).fadeOut(500, function () { jQuery(fadeInButton).fadeIn(500); });

            jQuery(that.Interface.ItemInput)[archive ? "fadeOut" : "fadeIn"](500);

            that._show_items(params, function () { that.__GettingWorkFlows = false; });
        },

        _show_items: function (params, done) {
            params = params || {};
            var that = this;

            var archive = params.Archive;

            that.Interface.CommonPage.innerHTML = "";
            that.Interface.ItemsArea.innerHTML = "";
            GlobalUtilities.loading(that.Interface.ItemsArea);

            that.Objects.OrderedItems = [];

            QAAPI.GetWorkFlows({
                Archive: archive, ParseResults: true,
                ResponseHandler: function (result) {
                    var workflows = result.WorkFlows || [];

                    that.Interface.ItemsArea.innerHTML = "";

                    for (var i = 0, lnt = (workflows || []).length; i < lnt; ++i)
                        that.add_item(workflows[i], archive);

                    done();
                }
            });
        },

        add_item: function (params, archive, options) {
            params = params || {};
            options = options || {};
            var that = this;

            var itemId = params.WorkFlowID || "";
            var name = Base64.decode(params.Name || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "itemDiv",
                    Style: "background-color:#f5f9ff; padding:0.2rem; margin:0.2rem 0rem; position:relative;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:1.5rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-" + (archive ? "undo" : "times") + " rv-icon-button",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.remove_recycle(itemId, archive); } }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":1.5rem; width:1.5rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pencil rv-icon-button", Name: "editButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":3rem; width:1.5rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "middle", 
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-key rv-icon-button", Name: "privacyButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.privacy_dialog(itemId); } }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding-" + RV_Float + ":4.7rem;",
                            Childs: [
                                {
                                    Type: "div", Name: "nameDiv",
                                    Class: "small-12 medium-12 large-12 rv-selectable-title Ellipsis",
                                    Properties: [{ Name: "onclick", Value: function () { that.on_item_select(itemId); } }],
                                    Childs: [{ Type: "text", TextValue: name, Name: "nameText" }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editDiv",
                                    Childs: [
                                        {
                                            Type: "input", Class: "rv-input", Style: "width:100%;", Name: "nameInput",
                                            Attributes: [{ Name: "type", Value: "text" }]
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]);

            var itemDiv = elems["itemDiv"];
            var editButton = elems["editButton"];
            var nameDiv = elems["nameDiv"];
            var editDiv = elems["editDiv"];
            var nameInput = elems["nameInput"];
            var nameText = elems["nameText"];

            if (options.Add2Top) that.Interface.ItemsArea.insertBefore(itemDiv, that.Interface.ItemsArea.firstChild);
            else that.Interface.ItemsArea.appendChild(itemDiv);

            editButton.onclick = function () {
                var set_things = function () {
                    var itm = that.Objects.Items[itemId];

                    nameText.data = itm.Name || "";
                    nameInput.value = itm.Name || "";

                    editDiv.style.display = editButton.__Editing ? "block" : "none";
                    nameDiv.style.display = editButton.__Editing ? "none" : "block";

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "floppy-o" : "pencil") + " rv-icon-button");
                }

                if (this.__Editing === true) {
                    var newName = GlobalUtilities.trim(nameInput.value);

                    if (newName == "") return;

                    GlobalUtilities.block(nameDiv);

                    QAAPI.RenameWorkFlow({
                        WorkFlowID: itemId, Name: Base64.encode(newName), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Items[itemId].Name = newName;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(nameDiv);
                        }
                    });
                }
                else this.__Editing = true;

                set_things();
            }

            that.Objects.Items[itemId] = GlobalUtilities.extend(params, {
                ContainerDiv: itemDiv,
                Settings: null,
                Selected: false,
                ID: itemId,
                Name: name,
                Description: Base64.decode(params.Description)
            });
            
            if (!archive) that.Objects.OrderedItems.push(that.Objects.Items[itemId]);
        },

        privacy_dialog: function (itemId) {
            var that = this;

            that.__PrivacyDialog = that.__PrivacyDialog || {};
            
            if (that.__PrivacyDialog[itemId]) {
                that.__PrivacyDialogShowed = GlobalUtilities.show(that.__PrivacyDialog[itemId]);
                return;
            }

            var _div = that.__PrivacyDialog[itemId] = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }
            ])["container"];

            GlobalUtilities.loading(_div);
            var showed = that.__PrivacyDialogShowed = GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                OnLoad: function () {
                    _div.innerHTML = "";

                    var pv = new PermissionSetting(_div, {
                        ObjectID: itemId,
                        Options: {
                            ConfidentialitySelect: false, PermissionTypes: ["Create"], ObjectType: "QAWorkFlow",
                            OnSave: function () { showed.Close(); }
                        }
                    });
                }
            });
        },

        on_item_select: function (itemId) {
            var that = this;

            var lastSelectedItemId = that.Objects.LastSelectedItemID;
            if (lastSelectedItemId != null && that.Objects.Items[lastSelectedItemId]) {
                var _itm = that.Objects.Items[lastSelectedItemId];
                _itm.Selected = false;
                _itm.ContainerDiv.style.backgroundColor = "#f5f9ff";
            }

            that.Objects.LastSelectedItemID = itemId;

            var item = that.Objects.Items[itemId];
            item.Selected = true;
            item.ContainerDiv.style.backgroundColor = "#ffaaaa";

            if (!item.Settings) {
                var _div = item.Settings = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                        Style: "padding:0.5rem; padding-bottom:5rem;"
                    }
                ])["_div"];

                new QAWorkFlowSettings(_div, { WorkFlow: that.Objects.Items[itemId] });
            }

            jQuery(that.Interface.CommonPage).fadeOut(500, function () {
                that.Interface.CommonPage.innerHTML = "";

                jQuery(that.Interface.CommonPage).fadeOut(0, function () {
                    that.Interface.CommonPage.appendChild(item.Settings);
                    jQuery(that.Interface.CommonPage).fadeIn(500);
                });
            });
        },

        remove_recycle: function (itemId, recycle) {
            var that = this;

            var msg = recycle ? RVDic.Confirms.DoYouWantToRecycleTheN.replace("[n]", RVDic.WorkFlow) :
                RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.WorkFlow);

            GlobalUtilities.confirm(msg, function (result) {
                if (!result) return;

                QAAPI[recycle ? "RecycleWorkFlow" : "RemoveWorkFlow"]({
                    WorkFlowID: itemId, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            return;
                        }

                        var item = that.Objects.Items[itemId];
                        if (!item) return;

                        if (item.ContainerDiv) item.ContainerDiv.parentNode.removeChild(item.ContainerDiv);
                        that.Objects.Items[itemId] = null;
                    }
                });
            });
        },

        sort_dialog: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "SoftBackgroundColor rv-border-radius-1",
                    Style: "width:50vw; padding:1rem; margin:0rem auto;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Style: "margin-bottom:1rem; text-align:center; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic._HelpSortNames }]
                        },
                        { Type: "div", Name: "items", Style: "margin-bottom:1rem;" },
                        {
                            Type: "div", Class: "ActionButton", Name: "confirmButton",
                            Style: "width:8rem; margin:0rem auto;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            var _div = elems["_div"];

            GlobalUtilities.loading(elems["items"]);

            var onClose = null;

            var showed = GlobalUtilities.show(_div, { OnClose: function () { onClose(); } });

            GlobalUtilities.load_files([{ Root: "jQuery/Sortable/", Childs: ["jquery.sortable.css", "jquery.sortable.js"] }], {
                OnLoad: function () {
                    elems["items"].innerHTML = "";

                    var parts = [];

                    var add_part = function (id, title) {
                        parts.push({
                            Type: "div", Class: "WarmBackgroundColor rv-border-radius-half",
                            Style: "cursor:pointer; text-align:center; margin:0.5rem 0rem; padding:0.5rem;",
                            Attributes: [{ Name: "ItemID", Value: id }],
                            Childs: [{ Type: "text", TextValue: title }]
                        });
                    }

                    for (var i = 0, lnt = that.Objects.OrderedItems.length; i < lnt; ++i)
                        add_part(that.Objects.OrderedItems[i].ID, that.Objects.OrderedItems[i].Name);

                    GlobalUtilities.create_nested_elements(parts, elems["items"]);

                    jQuery(elems["items"]).sortable({
                        PlaceHolder: { Style: "margin:0.5rem 0rem; height:2rem; background-color:white;" }
                    });

                    var processing = false;
                    var confirmButtonClicked = false;

                    onClose = function () {
                        if (confirmButtonClicked || !_changed()) return;

                        GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveTheChanges, function (result) {
                            if (result) _do_save();
                        });
                    };

                    var _get_sorted_list = function () {
                        var sortedList = [];
                        var iter = elems["items"].firstChild;
                        var counter = 0;

                        while (iter) {
                            sortedList.push(iter.getAttribute("ItemID"));
                            ++counter;
                            iter = iter.nextSibling;
                        }

                        return sortedList;
                    }

                    var _changed = function () {
                        var sl = _get_sorted_list();
                        for (var i = 0, lnt = sl.length; i < lnt; ++i)
                            if (sl[i] != that.Objects.OrderedItems[i].ID) return true;
                        return false;
                    }

                    var _do_save = function () {
                        if (processing) return;
                        processing = true;

                        GlobalUtilities.block(elems["confirmButton"]);

                        var dic = {};
                        for (var i = 0, lnt = that.Objects.OrderedItems.length; i < lnt; ++i)
                            dic[that.Objects.OrderedItems[i].ID] = that.Objects.OrderedItems[i];

                        var sortedList = _get_sorted_list();

                        var newOrder = [];
                        for (var i = 0, lnt = sortedList.length; i < lnt; ++i)
                            newOrder.push(dic[sortedList[i]]);

                        QAAPI.SetWorkFlowsOrder({
                            WorkFlowIDs: sortedList.join('|'), ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) {
                                    that.Objects.OrderedItems = newOrder;

                                    for (var i = 0, lnt = newOrder.length; i < lnt; ++i)
                                        that.Interface.ItemsArea.appendChild(newOrder[i].ContainerDiv);

                                    showed.Close();

                                    processing = false;
                                    GlobalUtilities.unblock(elems["confirmButton"]);
                                }
                            }
                        });
                    }

                    elems["confirmButton"].onclick = function () {
                        confirmButtonClicked = true;
                        if (!_changed()) showed.Close();
                        _do_save();
                    }
                }
            });
        }
    }
})();