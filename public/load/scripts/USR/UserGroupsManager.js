(function () {
    if (window.UserGroupsManager) return;

    window.UserGroupsManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;
        params = params || {};

        this.Interface = {
            ItemInput: null,
            ItemsArea: null,
            CommonPage: null
        };

        this.Objects = {
            Items: {},
            Roles: [],
            LastSelectedItemID: null
        };

        var that = this;

        GlobalUtilities.loading(that.ContainerDiv);

        GlobalUtilities.load_files(["API/UsersAPI.js", "USR/UserGroupSettings.js"], {
            OnLoad: function () { that._initialize(); }
        });
    }

    UserGroupsManager.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center; font-weight:bold; margin-bottom:1rem;" +
                        "font-size:1.2rem; color:rgb(100,100,100);",
                    Childs: [
                        { Type: "text", TextValue: RVDic.PRVC.UserGroupsManagement },
                        { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_usergroups" } }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-4 large-3",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "itemInput", Style: "width:100%; font-size:0.7rem;",
                                    InnerTitle: RVDic.NewN.replace("[n]", RVDic.Group) + "..."
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

            var itemInput = that.Interface.ItemInput = elems["itemInput"];

            GlobalUtilities.set_onenter(itemInput, function () {
                var name = GlobalUtilities.trim(itemInput.value);
                if (!name) return;

                UsersAPI.CreateUserGroup({
                    Name: Base64.encode(name), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        that.add_item({ ID: result.ID, Name: Base64.encode(name) });
                    }
                });

                itemInput.value = "";
            });

            that.show_items();
        },

        show_items: function () {
            var that = this;

            that.Interface.CommonPage.innerHTML = "";
            that.Interface.ItemsArea.innerHTML = "";
            GlobalUtilities.loading(that.Interface.ItemsArea);

            UsersAPI.GetAccessRoles({
                ParseResults: true,
                ResponseHandler: function (r) {
                    that.Objects.Roles = r.Roles || [];

                    UsersAPI.GetUserGroups({
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            that.Interface.ItemsArea.innerHTML = "";
                            jQuery.each(result.Groups || [], function (ind, val) { that.add_item(val); });
                        }
                    });
                }
            });
        },

        add_item: function (params) {
            params = params || {};
            var that = this;

            var itemId = params.ID;
            var name = Base64.decode(params.Name);

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
                                            Type: "i", Class: "fa fa-times rv-icon-button",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.remove(itemId, name); } }]
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
                                    Childs: [{ Type: "input", Class: "rv-input", Name: "nameInput", Style: "width:100%; font-size:0.7rem;" }]
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.ItemsArea);

            var itemDiv = elems["itemDiv"];
            var editButton = elems["editButton"];
            var nameDiv = elems["nameDiv"];
            var editDiv = elems["editDiv"];
            var nameInput = elems["nameInput"];
            var nameText = elems["nameText"];

            editButton.onclick = function () {
                var set_things = function () {
                    var itm = that.Objects.Items[itemId];

                    nameText.data = GlobalUtilities.convert_numbers_to_persian(itm.Name);
                    nameInput.value = itm.Name;

                    editDiv.style.display = editButton.__Editing ? "block" : "none";
                    nameDiv.style.display = editButton.__Editing ? "none" : "block";

                    GlobalUtilities.append_tooltip(nameDiv, itm.Name);

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "floppy-o" : "pencil") + " rv-icon-button");
                }

                if (this.__Editing === true) {
                    var newName = GlobalUtilities.trim(nameInput.value);
                    if (!newName) return;

                    GlobalUtilities.block(itemDiv);

                    UsersAPI.RenameUserGroup({
                        ID: itemId, Name: Base64.encode(newName), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Items[itemId].Name = name = newName;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(itemDiv);
                        }
                    });
                }
                else this.__Editing = true;

                set_things();
            }

            that.Objects.Items[itemId] = GlobalUtilities.extend(params, {
                ContainerDiv: itemDiv,
                ID: itemId,
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
                        Type: "div", Style: "padding:1rem;", Name: "_div",
                        Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor"
                    }
                ])["_div"];

                new UserGroupSettings(_div, { ID: itemId, Roles: that.Objects.Roles });
            }

            jQuery(that.Interface.CommonPage).fadeOut(500, function () {
                that.Interface.CommonPage.innerHTML = "";

                jQuery(that.Interface.CommonPage).fadeOut(0, function () {
                    that.Interface.CommonPage.appendChild(item.Settings);
                    jQuery(that.Interface.CommonPage).fadeIn(500);
                });
            });
        },

        remove: function (itemId, itemName) {
            var that = this;

            var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + itemName + "'");

            GlobalUtilities.confirm(msg, function (result) {
                if (!result) return;

                UsersAPI.RemoveUserGroup({
                    ID: itemId, ParseResults: true,
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