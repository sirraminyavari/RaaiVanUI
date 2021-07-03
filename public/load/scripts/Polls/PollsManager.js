(function () {
    if (window.PollsManager) return;

    window.PollsManager = function (containerDiv, params) {
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
            LastSelectedItemID: null
        };

        var that = this;

        GlobalUtilities.loading(that.ContainerDiv);

        GlobalUtilities.load_files(["API/FGAPI.js", "Polls/PollSettings.js"], {
            OnLoad: function () { that._initialize(); }
        });
    }

    PollsManager.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-4 large-3",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 ActionButton",
                            Style: "text-align:center; margin-bottom:0.6rem;", Name: "removedButton",
                            Properties: [{ Name: "onclick", Value: function () { that.show_items({ Archive: true }); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.ShowRemovedPolls }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 ActionButton", Name: "existingButton",
                            Style: "text-align:center; margin-bottom:0.6rem; display:none;",
                            Properties: [{ Name: "onclick", Value: function () { that.show_items({ Archive: false }); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.ShowExistingPolls }]
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
            GlobalUtilities.set_inner_title(itemInput, RVDic.NewPollTitle + "...");

            GlobalUtilities.set_onenter(itemInput, function () {
                var name = GlobalUtilities.trim(itemInput.value);
                if (!name) return;

                FGAPI.AddPoll({
                    Name: Base64.encode(name), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        that.add_item(result.Poll, false, { Add2Top: true });
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

            if (that.__GettingItems) return;
            that.__GettingItems = true;

            var archive = params.Archive;

            var fadeInButton = that.Interface[archive ? "ShowExistingButton" : "ShowRemovedButton"];
            var fadeOutButton = that.Interface[archive ? "ShowRemovedButton" : "ShowExistingButton"];

            jQuery(fadeOutButton).fadeOut(500, function () { jQuery(fadeInButton).fadeIn(500); });

            jQuery(that.Interface.ItemInput)[archive ? "fadeOut" : "fadeIn"](500);
            
            that._show_items(params, function () { that.__GettingItems = false; });
        },

        _show_items: function (params, done) {
            params = params || {};
            var that = this;

            var archive = params.Archive;

            that.Interface.CommonPage.innerHTML = "";
            that.Interface.ItemsArea.innerHTML = "";
            GlobalUtilities.loading(that.Interface.ItemsArea);

            FGAPI.GetPolls({
                Archive: archive, Count: 1000000, ParseResults: true,
                ResponseHandler: function (result) {
                    var polls = result.Polls || [];

                    that.Interface.ItemsArea.innerHTML = "";

                    for (var i = 0, lnt = (polls || []).length; i < lnt; ++i)
                        that.add_item(polls[i], archive);

                    done();
                }
            });
        },

        add_item: function (params, archive, options) {
            params = params || {};
            options = options || {};
            var that = this;

            var itemId = params.PollID || "";
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
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding-" + RV_Float + ":3.2rem;",
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

                    if (!newName) return;

                    GlobalUtilities.block(nameDiv);

                    FGAPI.RenamePoll({
                        PollID: itemId, Name: Base64.encode(newName), ParseResults: true,
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
                Name: name,
                Settings: null,
                Selected: false
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

                new PollSettings(_div, { Poll: that.Objects.Items[itemId] });
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

            var msg = recycle ? RVDic.Confirms.DoYouWantToRecycleTheN.replace("[n]", RVDic.Poll) :
                RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Poll);

            GlobalUtilities.confirm(msg, function (result) {
                if (!result) return;

                FGAPI[recycle ? "RecyclePoll" : "RemovePoll"]({
                    PollID: itemId, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var item = that.Objects.Items[itemId];
                        if (!item) return;

                        if (item.ContainerDiv) item.ContainerDiv.parentNode.removeChild(item.ContainerDiv);
                        that.Objects.Items[itemId] = null;
                    }
                });
            });
        }
    }
})();