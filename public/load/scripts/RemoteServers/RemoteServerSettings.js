(function () {
    if (window.RemoteServerSettings) return;

    window.RemoteServerSettings = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};
        
        this.Interface = {
            SearchContainer: null,
            SearchInput: null,
            SelectAll: null,
            Items: null
        };

        this.Objects = {
            Items: []
        };

        this.Options = {
            BatchSize: 2,
            SelectMode: !!params.SelectMode,
            Checkbox: !!params.Checkbox,
            OnSelect: params.OnSelect
        };

        var that = this;
        
        GlobalUtilities.load_files(["API/UsersAPI.js"], {
            OnLoad: function () { that._preinit(params); }
        });
    };

    RemoteServerSettings.prototype = {
        _preinit: function (params) {
            var that = this;
            params = params || {};
            
            if (params.Servers) return that.initialize(params.Servers);
            
            UsersAPI.GetRemoteServers({
                ParseResults: true,
                ResponseHandler: function (result) {
                    that.initialize(result.Servers || []);
                }
            });
        },

        initialize: function (servers) {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                (that.Options.SelectMode ? null : {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-air-button rv-circle",
                    Style: "margin:0 auto 1rem auto;", Name: "newItem",
                    Childs: [{ Type: "text", TextValue: "+ " + RVDic.NewN.replace("[n]", RVDic.RemoteServer) }]
                }),
                {
                    Type: "div", Style: "display:flex; flex-flow:row; align-items:center;",
                    Childs: [
                        (!that.Options.Checkbox ? null : {
                            Type: "div",
                            Style: "flex:0 0 auto; margin:0.5rem 0; margin-" + RV_RevFloat + ":1rem; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{
                                Type: "i", Name: "selectAllChb", Style: "cursor:pointer; font-size:1.2rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }]
                        }),
                        {
                            Type: "div", Style: "flex:1 1 auto; margin:0.5rem 0;",
                            Childs: [{
                                Type: "div", Name: "searchContainer",
                                Class: that.Options.Checkbox ? "small-12 medium-12 large-12" : "small-10 medium-8 large-6",
                                Style: "margin:0 auto; display:none;",
                                Childs: [{
                                    Type: "input", Class: "rv-input", Name: "searchInput",
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.Search + "..."
                                }]
                            }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical margins", Name: "items" }
            ], that.Container);

            that.Interface.SearchContainer = elems["searchContainer"];
            that.Interface.SearchInput = elems["searchInput"];
            that.Interface.SelectAll = elems["selectAllChb"];
            that.Interface.Items = elems["items"];

            jQuery.each(servers || [], function (ind, val) { that.add_item(elems["items"], val); });

            if (elems["newItem"]) elems["newItem"].onclick = function () { that.new_item(elems["items"]); };

            GlobalUtilities.set_onchangeorenter(that.Interface.SearchInput, function () { that.search(); });

            that.set_select_all_checkbox_status();

            var check_one = function (jsonObj) {
                jsonObj.Check(function (x) {
                    var arr = that.Objects.Items.filter(i => !i.Checked && (i.Status === null));
                    if (arr.length) check_one(arr[0]);
                });
            };
            
            for (var i = 0; i < Math.min(that.Options.BatchSize, (servers || []).length); i++) {
                var srv = that.get_json_object(servers[i].ID);
                if (srv) check_one(srv);
            }
        },

        set_select_all_checkbox_status: function () {
            var that = this;
            var chb = that.Interface.SelectAll;

            if (!chb) return;

            var allCount = that.get_items().length;
            var chCount = that.get_checked_items().length;
            
            var cls = allCount == chCount ? "fa-check-square-o" : (chCount > 0 ? "fa-minus-square-o" : "fa-square-o");
            
            chb.setAttribute("class", "fa " + cls + " fa-lg");

            if (!chb.onclick) chb.onclick = function () {
                if (!that.get_checked_items().length) that.check_all();
                else that.uncheck_all();

                that.set_select_all_checkbox_status();
            };
        },

        set_search_input_display: function () {
            var that = this;

            var itemsCount = 0;
            var firstChild = that.Interface.Items.firstChild;

            while (firstChild) {
                if (firstChild.TheObject)++itemsCount;
                firstChild = firstChild.nextSibling;
            }

            var hide = itemsCount <= 5;

            jQuery(that.Interface.SearchContainer)[hide ? "fadeOut" : "fadeIn"](500);

            if (hide) {
                that.Interface.SearchInput.value = "";
                that.search();
            }
        },

        search: function () {
            var that = this;
            
            var searchText = GlobalUtilities.trim(that.Interface.SearchInput.value).toLowerCase();
            
            var firstChild = that.Interface.Items.firstChild;

            while (firstChild) {
                if (firstChild.TheObject) {
                    var value = Base64.decode(firstChild.TheObject.Name) + " " +
                        Base64.decode(firstChild.TheObject.URL) + " " + Base64.decode(firstChild.TheObject.UserName);
                    jQuery(firstChild)[value.toLowerCase().indexOf(searchText) >= 0 ? "fadeIn" : "fadeOut"](0);
                }

                firstChild = firstChild.nextSibling;
            }
        },

        new_item: function (itemsContainer) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-title",
                        Childs: [{ Type: "text", TextValue: RVDic.NewN.replace("[n]", RVDic.RemoteServer) }]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                ]
            }], that.Container);

            var showed = GlobalUtilities.show(elems["container"]);

            that.add_item(elems["_div"], null, {
                OnSave: function (item) {
                    showed.Close();
                    that.add_item(itemsContainer, item, { Add2Top: true });
                }
            });
        },

        add_item: function (container, item, options) {
            var that = this;
            item = item || {};
            options = options || {};

            var isNew = !!item.ID && !!options.Add2Top;
            
            var create_view_element = function (p) {
                p = p || {};

                return {
                    Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0 0.3rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "display:inline-block; text-transform:capitalize; font-weight:bold; color:rgb(100,100,100);",
                            Childs: [{ Type: "text", TextValue: p.Title + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: p.Value }]
                        }
                    ]
                };
            };

            var create_input = function (p) {
                p = p || {};

                return {
                    Type: "div", Class: "small-12 medium-6 large-6",
                    Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":5rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem; text-transform:capitalize;",
                            Childs: [{ Type: "text", TextValue: p.Title + ":" }]
                        },
                        {
                            Type: "input", Class: "rv-input", InnerTitle: p.Title,
                            Style: "width:100%; font-size:0.7rem;", Name: p.Name,
                            Attributes: [{ Name: "type", Value: p.Type || "text" }]
                        }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "container",
                Class: "small-12 medium-12 large-12" +
                    (item.ID ? "rv-border-radius-half rv-bg-color-white-softer SoftShadow" : ""),
                Style: "position:relative; padding:0.5rem; margin-top:0.5rem;" +
                    (that.Options.SelectMode ? "cursor:pointer" : ""),
                Properties: !(that.Options.Checkbox || (that.Options.SelectMode && that.Options.OnSelect)) ? null : [{
                    Name: "onclick",
                    Value: function (e) {
                        if (elems["chb"]) elems["container"].Checked(!elems["chb"].Checked);
                        if (that.Options.SelectMode && that.Options.OnSelect) that.Options.OnSelect(item);
                        that.set_select_all_checkbox_status();
                    }
                }],
                Childs: [
                    {
                        Type: "div", Style: "display:flex; flex-flow:row; align-items:center;",
                        Childs: [
                            (!that.Options.Checkbox ? null : {
                                Type: "div", Style: "flex:0 0 auto;" ,
                                Childs: [{
                                    Type: "checkbox", Style: "width:1rem; height:1rem;", Name: "chb", Params: {
                                        Checked: true,
                                        OnChange: function () { that.set_select_all_checkbox_status(); }
                                    }
                                }]
                            }),
                            (!item.ID || that.Options.SelectMode ? null : {
                                Type: "div", Style: "flex:0 0 auto;",
                                Childs: [{
                                    Type: "i", Class: "fa fa-trash-o fa-lg rv-icon-button",
                                    Tooltip: RVDic.Remove, Name: "removeButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }]
                            }),
                            (!item.ID || that.Options.SelectMode ? null : {
                                Type: "div", Style: "flex:0 0 auto; margin-" + RV_Float + ":0.7rem;",
                                Childs: [{
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button",
                                    Tooltip: RVDic.Edit, Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }]
                            }),
                            {
                                Type: "div", Style: "flex:1 1 auto; padding:0 1rem;",
                                Childs: [
                                    { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "viewArea", Style: "margin:0rem;" },
                                    (that.Options.SelectMode ? null : {
                                        Type: "div", Class: "small-12 medium-12 large-12 row", Name: "editArea",
                                        Style: "margin:0rem; display:none;",
                                        Childs: [
                                            create_input({ Name: "name", Title: RVDic.Name }),
                                            create_input({ Name: "url", Title: RVDic.URL }),
                                            create_input({ Name: "username", Title: RVDic.UserName }),
                                            create_input({ Name: "password", Title: RVDic.Password, Type: "password" })
                                        ]
                                    }),
                                ]
                            },
                            (!item.ID ? null : {
                                Type: "div", Class: "RevDirection RevTextAlign",
                                Style: "flex:0 0 auto; display:flex; flex-flow:row; width:2.5rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "flex:0 0 auto; display: flex; justify-content: center; align-items: center;",
                                        Childs: [{
                                            Type: "i", Class: "fa fa-clock-o fa-lg", Name: "checkButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }]
                                    },
                                    {
                                        Type: "div", 
                                        Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" + 
                                            "display:flex; justify-content:center; align-items:center;",
                                        Childs: [{
                                            Type: "i", Class: "fa fa-refresh", Name: "refresh",
                                            Style: "color:blue; cursor:pointer; display:none;", Tooltip: RVDic.Refresh,
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); recheck(); } }]
                                        }]
                                    }
                                ]
                            })
                        ]
                    },
                    (item.ID ? null : {
                        Type: "div", Class: "small-6 medium-5 large-4 rv-air-button rv-circle",
                        Style: "margin:1rem auto 0 auto;", Name: "editButton",
                        Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                    })
                ]
            }]);

            if (options.Add2Top) container.insertBefore(elems["container"], container.firstChild);
            else container.appendChild(elems["container"]);

            elems["container"].TheObject = item;

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var nameInput = elems["name"];
            var urlInput = elems["url"];
            var usernameInput = elems["username"];
            var passwordInput = elems["password"];
            var checkButton = elems["checkButton"];

            var removeButton = elems["removeButton"];
            var editButton = elems["editButton"];

            elems["container"].ItemObject = item;

            elems["container"].Checked = function (value) {
                if (GlobalUtilities.get_type(value) == "boolean") {
                    if (elems["chb"]) elems["chb"][value ? "check" : "uncheck"]();
                }
                else return !elems["chb"] ? null : elems["chb"].Checked;
            };

            var processing = false;

            if (removeButton) removeButton.onclick = function () {
                if (processing) return;

                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + Base64.decode(item.Name) + "'");

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;
                    processing = true;

                    UsersAPI.RemoveRemoteServer({
                        ID: item.ID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                jQuery(elems["container"]).fadeOut(500, function () {
                                    this.remove();
                                    that.Objects.Items = that.Objects.Items.filter(i => i.Item.ID != item.ID);
                                    that.set_search_input_display();
                                });
                            }

                            processing = false;
                        }
                    });
                });
            };

            var check_connection = function (callback) {
                if (GlobalUtilities.get_type(callback) != "function") callback = function () { };

                if ((jsonObj || {}).Checked || !item.ID) return callback(null);
                else jsonObj.Checked = true;

                if (checkButton) {
                    checkButton.style.color = "black";
                    checkButton.setAttribute("class", "fa fa-spinner fa-lg fa-pulse");
                }

                RVRequest.check_remote_connection({
                    BaseURL: Base64.decode(item.URL),
                    UserName: Base64.decode(item.UserName),
                    Password: Base64.decode(item.Password)
                }, function (result) {
                    if (checkButton) {
                        checkButton.style.color = result ? "green" : "red";
                        checkButton.setAttribute("class", result ? "fa fa-check-circle-o fa-lg" : "fa fa-times fa-lg");
                    }

                    elems["refresh"].style.display = !result ? "block" : "none";

                    jsonObj.Status = result;
                    callback(jsonObj);
                });
            };

            var recheck = function () {
                jsonObj.Status = null;
                jsonObj.Checked = false;
                check_connection();
            };

            var jsonObj = !item.ID ? null : {
                Item: item,
                Checked: false,
                Check: check_connection,
                Status: null
            };

            if (!!item.ID) that.Objects.Items.push(jsonObj);

            var _set_data = function () {
                viewArea.innerHTML = "";

                if (that.Options.Checkbox) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 WarmColor",
                            Childs: [{ Type: "text", TextValue: Base64.decode(item.Name) }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "color:rgb(150,150,150); font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(item.URL) }]
                        }
                    ], viewArea);
                }
                else {
                    GlobalUtilities.create_nested_elements([
                        create_view_element({ Title: RVDic.Name, Value: Base64.decode(item.Name) }),
                        create_view_element({ Title: RVDic.URL, Value: Base64.decode(item.URL) }),
                        create_view_element({ Title: RVDic.UserName, Value: Base64.decode(item.UserName) })
                    ], viewArea);
                }
                
                if (item.ID && editArea) {
                    nameInput.value = Base64.decode(item.Name);
                    urlInput.value = Base64.decode(item.URL);
                    usernameInput.value = Base64.decode(item.UserName);
                    passwordInput.value = Base64.decode(item.Password);
                }
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = (editButton || {}).__Editing ? "flex" : "none";
                    viewArea.style.display = (editButton || {}).__Editing ? "none" : "flex";
                    if (checkButton) checkButton.style.display = (editButton || {}).__Editing ? "none" : "block";

                    _set_data();

                    if (item.ID && !!editButton) {
                        editButton.setAttribute("class",
                            "fa fa-" + (editButton.__Editing ? "floppy-o" : "pencil") + " fa-lg rv-icon-button");

                        GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                    }
                };

                if (editButton.__Editing === true) {
                    var newName = GlobalUtilities.trim(nameInput.value);
                    var newUrl = GlobalUtilities.trim(urlInput.value);
                    var newUsername = GlobalUtilities.trim(usernameInput.value);
                    var newPassword = GlobalUtilities.trim(passwordInput.value);

                    if (!newName || !newUrl || !newUsername || !newPassword) return;

                    GlobalUtilities.block(container);

                    UsersAPI[item.ID ? "ModifyRemoteServer" : "AddRemoteServer"]({
                        ID: item.ID, Name: Base64.encode(newName), URL: Base64.encode(newUrl),
                        UserName: Base64.encode(newUsername), Password: Base64.encode(newPassword), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                item.Name = result.Server.Name;
                                item.URL = result.Server.URL;
                                item.UserName = result.Server.UserName;
                                item.Password = result.Server.Password;

                                if (item.ID) {
                                    editButton.__Editing = false;
                                    set_things();

                                    recheck();
                                }
                                else if (options.OnSave) {
                                    item.ID = result.Server.ID;
                                    options.OnSave(item);
                                }
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            if (editButton) editButton.onclick = _on_edit;

            if (!item.ID && editButton) _on_edit();
            else if (isNew) check_connection();

            _set_data();

            that.set_search_input_display();
        },

        get_json_object: function (id) {
            var ret = !id ? null : this.Objects.Items.find(itm => itm.Item.ID == id);
            return !ret ? null : ret;
        },

        get_items_dom: function () {
            return [].filter.call((this.Interface.Items || []).childNodes, d => !!d.Checked) || [];
        },

        get_items: function () {
            return this.get_items_dom().map(d => d.ItemObject);
        },

        get_checked_items: function (connected) {
            var that = this;
            var arr = that.get_items_dom().filter(d => d.Checked()).map(d => d.ItemObject);
            return !connected ? arr : (arr || []).filter(a => (that.get_json_object(a.ID) || {}).Status === true);
        },

        check_all: function () {
            this.get_items_dom().forEach(d => d.Checked(true));
        },

        uncheck_all: function () {
            this.get_items_dom().forEach(d => d.Checked(false));
        }
    };
})();