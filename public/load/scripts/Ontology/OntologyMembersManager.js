(function () {
    if (window.OntologyMembersManager) return;

    window.OntologyMembersManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Interface = {
            Title: null,
            PendingArea: null,
            InputsContainer: null,
            UsersArea: null,
            SearchInput: null
        };

        this.Objects = {
            NodeID: params.NodeID,
            UserAutoSuggest: null,
            Users: [],
            ListViewer: null
        };

        this.Options = {
            Editable: false,
            ExpertsMode: false,
            ShowChildHierarchyMembers: false,
            OnMembersGet: null,
            Refresh: null,
            Count: 10
        };

        for (var op in (params.Options || {})) this.Options[op] = params.Options[op];

        var that = this;

        GlobalUtilities.load_files([
            "SimpleListViewer/NewSimpleListViewer.js",
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI"] }
        ], { OnLoad: function () { that._initialize(); } });
    };

    OntologyMembersManager.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "title",
                    Style: "text-align:center; font-weight:bold; margin-bottom:1rem; font-size:1rem;"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:0.5rem; display:none;", Name: "pendingArea"
                },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "inputsArea", Style: "margin:0 0 1rem 0; display:none;" },
                (!that.Options.Editable ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "newUserArea", Style: "margin-bottom:1rem;"
                }),
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "searchInputContainer",
                    Style: "text-align:center; margin-bottom:1rem; display:none;",
                    Childs: [{
                        Type: "input", Class: "rv-input", Name: "searchInput",
                        Style: "font-size:0.7rem; width:50%;", InnerTitle: RVDic.SearchText
                    }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "usersArea" },
                {
                    Type: "div", Class: "small-10 medium-8 large-6 ActionButton", Name: "childMembers",
                    Style: "text-align:center; margin:1rem auto 0rem auto;" +
                        (that.Options.ShowChildHierarchyMembers ? "" : "display:none;"),
                    Properties: [{ Name: "onclick", Value: function () { that.show_child_members(); } }],
                    Childs: [{ Type: "text", TextValue: RVDic[that.Options.ExpertsMode ? "NodeAndSubNodeExperts" : "NodeAndSubNodeMembers"] }]
                }
            ], that.ContainerDiv);

            that.Interface.Title = elems["title"];
            that.Interface.PendingArea = elems["pendingArea"];
            that.Interface.InputsContainer = elems["inputsArea"];
            that.Interface.UsersArea = elems["usersArea"];

            that.set_title();

            that.reset();
        },

        initialize_inputs: function (hasSearchInput) {
            var that = this;

            if (that._INPUTS_INITED) return;
            that._INPUTS_INITED = true;

            if (!hasSearchInput && !that.Options.Editable) return;
            else jQuery(that.Interface.InputsContainer).fadeIn(0);

            var doubleMode = hasSearchInput && that.Options.Editable;

            var searchMode = !that.Options.Editable;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Class: doubleMode ? "small-8 medium-8 large-8" : "small-12 medium-12 large-12",
                    Childs: [
                        (!that.Options.Editable ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "newUserArea", Style: "display:none;",
                        }),
                        (!hasSearchInput ? null : {
                            Type: "input", Class: "rv-input", Name: "searchInput",
                            Style: "font-size:0.7rem; width:100%; display:none;", InnerTitle: RVDic.SearchText
                        })
                    ]
                },
                (!doubleMode ? null : {
                    Type: "div", Class: "small-4 medium-4 large-4", Style: "padding-" + RV_Float + ":1rem;",
                    Childs: [{
                        Type: "middle", Class: "small-12 medium-12 large-12 rv-air-button rv-circle", Name: "toggleButton", Style: "display:none;",
                        Properties: [{ Name: "onclick", Value: function () { searchMode = !searchMode; set_mode(); } }]
                    }]
                })
            ], that.Interface.InputsContainer);

            that.Interface.SearchInput = elems["searchInput"];

            var set_mode = function () {
                if (elems["toggleButton"]) {
                    jQuery(elems["toggleButton"]).fadeOut(500, function () {
                        elems["toggleButton"].innerHTML =
                            searchMode ? (that.Options.ExpertsMode ? RVDic.AddExpert : RVDic.AddMember) : RVDic.Search;

                        jQuery(elems["toggleButton"]).fadeIn(500);
                    });
                }

                var fadeOutInput = searchMode ? elems["newUserArea"] : that.Interface.SearchInput;
                var fadeInInput = searchMode ? that.Interface.SearchInput : elems["newUserArea"];

                jQuery(fadeOutInput || fadeInInput).fadeOut(500, function () {
                    jQuery(fadeInInput || fadeOutInput).fadeIn(500);
                });
            };

            set_mode();

            if (that.Interface.SearchInput) GlobalUtilities.set_onchangeorenter(that.Interface.SearchInput, function () {
                if (that.Objects.ListViewer) that.Objects.ListViewer.reset();
            });

            if (elems["newUserArea"]) that.Objects.UserAutoSuggest = !that.Options.Editable ? null :
                GlobalUtilities.append_autosuggest(elems["newUserArea"], {
                    InputClass: "rv-input",
                    InputStyle: "width:60%;",
                    InnerTitle: RVDic.UserSelect + "...",
                    AjaxDataSource: UsersAPI.GetUsersDataSource(),
                    OnSelect: function () {
                        var index = that.Objects.UserAutoSuggest.selectedIndex;
                        var userId = that.Objects.UserAutoSuggest.values[index];
                        var fullname = that.Objects.UserAutoSuggest.keywords[index];

                        CNAPI[that.Options.ExpertsMode === true ? "AddExpert" : "AddMember"]({
                            NodeID: that.Objects.NodeID, UserID: userId, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                                that.Objects.UserAutoSuggest.clear();

                                if (that.Objects.ListViewer) that.Objects.ListViewer.add_item({
                                    UserID: userId, ImageURL: result.ImageURL, FirstName: fullname
                                });
                            }
                        });
                    },
                    ResponseParser: function (responseText) {
                        return (JSON.parse(responseText).Users || []).map(function (itm) {
                            return [Base64.decode(itm.FirstName) + " " + Base64.decode(itm.LastName) +
                                " - " + Base64.decode(itm.UserName), itm.UserID];
                        });
                    }
                });
        },

        show_child_members: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "searchInputContainer",
                            Style: "text-align:center; margin-bottom:1rem; display:none;",
                            Childs: [{
                                Type: "input", Class: "rv-input", Name: "searchInput",
                                Style: "font-size:0.7rem; width:50%;", InnerTitle: RVDic.SearchText
                            }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["_div"]);
            GlobalUtilities.show(elems["container"]);

            GlobalUtilities.set_onchangeorenter(elems["searchInput"], function () { if (listViewer) listViewer.reset(); });

            var apiFunction = that.Options.ExpertsMode ? "GetChildHierarchyExperts" : "GetChildHierarchyMembers";

            var listViewer = null;

            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                OnLoad: function () {
                    listViewer = new NewSimpleListViewer(elems["_div"], {
                        AutoGrow: false,
                        Options: {
                            Count: that.Options.Count,
                            OnDataRequest: function (options, done, setTotalCount) {
                                var searchText = GlobalUtilities.trim(elems["searchInput"].value);

                                CNAPI[apiFunction](GlobalUtilities.extend(options || {}, {
                                    NodeID: that.Objects.NodeID, SearchText: Base64.encode(searchText), ParseResults: true,
                                    ResponseHandler: function (result) {
                                        setTotalCount(result.TotalCount);
                                        done({ Items: result.Users });

                                        jQuery(elems["searchInputContainer"])[
                                            !searchText && (result.TotalCount <= that.Options.Count) ? "fadeOut" : "fadeIn"](0);
                                    }
                                }));
                            },
                            ItemBuilder: function (container, item, params) {
                                that.create_user(container, that.decode_user(item));
                                params.OnAfterAdd();
                            },
                            OnNothingFound: function (itemsArea) {
                                itemsArea.innerHTML = "<div class='small-12 medium-12 large-12' style='text-align:center; color:rgb(100,100,100);" +
                                    "font-weight:bold; font-size:1rem; padding:1rem;'>" + RVDic.NoUserFound + "</div>";
                            }
                        }
                    });
                }
            });
        },

        reset: function (params) {
            params = params || {};

            var that = this;

            that.Objects.Users = [];
            that.Objects.NodeID = params.NodeID || that.Objects.NodeID;

            if (that.Options.OnMembersGet) return that.Options.OnMembersGet();

            that.Objects.ListViewer = new NewSimpleListViewer(that.Interface.UsersArea, {
                Options: {
                    Count: that.Options.Count,
                    AutoGrow: false,
                    OnDataRequest: function (options, done, setTotalCount) {
                        var searchText = GlobalUtilities.trim((that.Interface.SearchInput || { value: "" }).value);
                        
                        CNAPI[that.Options.ExpertsMode === true ? "GetExperts" : "GetMembers"](GlobalUtilities.extend(options || {}, {
                            NodeID: that.Objects.NodeID, SearchText: Base64.encode(searchText), ParseResults: true,
                            ResponseHandler: function (result) {
                                that.set_title(result.TotalCount);
                                setTotalCount(result.TotalCount);
                                done((result.Experts || result.Members || []).map(function (u) { return that.decode_user(u); }));

                                if (!searchText) that.initialize_inputs(result.TotalCount > that.Options.Count);
                            }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        that.add_user(container, item, function () { params.OnAfterRemove(item); });
                        params.OnAfterAdd();
                    },
                    OnNothingFound: function (itemsArea) {
                        itemsArea.innerHTML = "<div class='small-12 medium-12 large-12' style='text-align:center; color:rgb(100,100,100);" +
                            "font-weight:bold; font-size:1rem; padding:1rem;'>" + RVDic.NothingToDisplay + "</div>";
                    },
                    OnReset: function () {
                        that.Objects.Users = [];
                    }
                }
            });
            
            if (that.Options.Editable && (that.Options.ExpertsMode !== true)) {
                CNAPI.GetPendingMembers({
                    NodeID: that.Objects.NodeID, Count: 100, ParseResults: true,
                    ResponseHandler: function (result) {
                        var members = result.Members || [];
                        if (members.length > 0) that.Interface.PendingArea.style.display = "block";

                        members.forEach(function (u) { that.add_pending_user(that.decode_user(u)); });
                    }
                });
            }

            if (that.Options.Refresh) that.Options.Refresh();
        },

        set_title: function (totalCount) {
            var that = this;

            var title = RVDic[that.Options.ExpertsMode === true ? "Experts" : "Members"];

            that.Interface.Title.innerHTML = title +
                (GlobalUtilities.get_type(totalCount) == "undefined" ? "" :
                    " (" + RVDic.Count + ": <span style='color:red; margin-" + RV_Float + ":0.3rem;'>" +
                    GlobalUtilities.convert_numbers_to_persian(totalCount || "0") + "</span>)");
        },

        decode_user: function (user) {
            user = user || {};

            return {
                UserID: user.UserID, FirstName: Base64.decode(user.FirstName),
                LastName: Base64.decode(user.LastName), UserName: Base64.decode(user.UserName),
                ImageURL: user.ImageURL || user.ProfileImageURL, IsAdmin: user.IsAdmin
            };
        },

        add_pending_user: function (user) {
            var that = this;

            var userID = user.UserID || "";
            var fullName = Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName);
            var userImgUrl = user.ImageURL || user.ProfileImageURL || "";
            var userPageUrl = UsersAPI.UserPageURL({ UserID: userID });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-quarter SoftBorder", Name: "container",
                    Style: "display:inline-block; width:12rem; padding:0.3rem; margin:0.3rem;" +
                        "background-color:white; color:black; margin-" + window.RV_Float + ":0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "height:3rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; width:3.5rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter",
                                            Style: "max-width:100%; max-height:100%;",
                                            Attributes: [{ Name: "src", Value: userImgUrl }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "Ellipsis", Tooltip: fullName, Link: userPageUrl,
                                    Style: "display:inline-block; width:7.45rem;",
                                    Childs: [{ Type: "text", TextValue: fullName }]
                                }
                            ]
                        },
                        {
                            Type: "div", Name: "icons",
                            Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                            Childs: [
                                {
                                    Type: "i", Name: "rejectButton", Tooltip: RVDic.Reject,
                                    Class: "fa fa-times-circle-o fa-3x rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "i", Name: "acceptButton", Tooltip: RVDic.Accept,
                                    Class: "fa fa-check-circle-o fa-3x rv-icon-button",
                                    Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.PendingArea);

            elems["acceptButton"].onclick = function () {
                if (this.Processing) return;
                this.Processing = true;

                CNAPI.AcceptMember({
                    NodeID: that.Objects.NodeID, UserID: userID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        jQuery(elems["container"]).fadeOut(500, function () {
                            elems["container"].parentNode.removeChild(elems["container"]);
                            that.add_user(user);
                        });
                    }
                });
            };

            elems["rejectButton"].onclick = function () {
                if (this.Processing) return;
                this.Processing = true;

                CNAPI.RemoveMember({
                    NodeID: that.Objects.NodeID, UserID: userID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        jQuery(elems["container"]).fadeOut(500, function () {
                            elems["container"].parentNode.removeChild(elems["container"]);
                        });
                    }
                });
            };
        },

        get_user: function (userId) {
            for (var i = 0, lnt = (this.Objects.Users || []).length; i < lnt; ++i)
                if ((this.Objects.Users[i] || {}).UserID == userId) return (this.Objects.Users[i] || {});
            return null;
        },

        add_users: function (users) {
            this.Interface.UsersArea.innerHTML = "";
            for (var i = 0, lnt = (users || []).length; i < lnt; ++i) this.add_user(that.Interface.UsersArea, users[i]);
        },

        add_user: function (container, user, onRemove) {
            var that = this;

            user = user || {};

            var userId = user.UserID;
            var isAdmin = user.IsAdmin === true;

            if (that.get_user(userId) != null) return false;

            var editable = that.Options.Editable === true;

            var editOptions = [];

            if (editable) {
                editOptions.push({
                    Type: "div",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [{ Name: "onclick", Value: function () { that.remove_user(userId, onRemove); } }]
                        }
                    ]
                });
            }

            if ((editable || isAdmin) && !that.Options.ExpertsMode) {
                editOptions.push({
                    Type: "div",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-user rv-icon-button", Tooltip: RVDic.Admin, Name: "adminButton",
                            Style: "cursor:" + (editable ? "pointer" : "normal") + "; color:" + (isAdmin ? "red" : "black") + ";",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                });
            }

            var elems = that.create_user(container, user, editOptions);

            user.ContainerDiv = elems["containerDiv"];
            var adminButton = elems["adminButton"];

            if (adminButton && editable) {
                adminButton.__IsAdmin = isAdmin;

                var _set_admin_tooltip = function () {
                    GlobalUtilities.append_tooltip(adminButton, (adminButton.__IsAdmin ? RVDic.RevokeManagement : RVDic.SetAsManager));
                };

                _set_admin_tooltip();

                adminButton.onclick = function () {
                    if (typeof (adminButton.__IsAdmin) == "undefined") adminButton.__IsAdmin = isAdmin;

                    GlobalUtilities.block(user.ContainerDiv);

                    CNAPI[adminButton.__IsAdmin ? "UnAdmin" : "MakeAdmin"]({
                        UserID: userId, NodeID: that.Objects.NodeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (!result.ErrorText) adminButton.__IsAdmin = !adminButton.__IsAdmin;
                            else alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                            adminButton.style.color = adminButton.__IsAdmin ? "red" : "black";

                            _set_admin_tooltip();

                            GlobalUtilities.unblock(user.ContainerDiv);
                        }
                    });
                }
            }

            that.Objects.Users.push(user);

            if (that.Options.Refresh) that.Options.Refresh();

            return true;
        },

        remove_user: function (userId, done) {
            var that = this;

            GlobalUtilities.confirm(RVDic.Confirms.RemoveUser, function (r) {
                if (r) CNAPI[that.Options.ExpertsMode === true ? "RemoveExpert" : "RemoveMember"]({
                    NodeID: that.Objects.NodeID, UserID: userId, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var user = that.get_user(userId);
                        if (user == null) return;

                        for (var i = 0, lnt = that.Objects.Users.length; i < lnt; ++i)
                            if ((that.Objects.Users[i] || {}).UserID == userId) that.Objects.Users[i] = null;

                        user.ContainerDiv.parentNode.removeChild(user.ContainerDiv);

                        if (done) done();

                        if (that.Options.Refresh) that.Options.Refresh();
                    }
                });
            });
        },

        create_user: function (container, item, editOptions) {
            var that = this;

            item = item || {};
            editOptions = editOptions || [];

            var fullname = GlobalUtilities.trim((item.FirstName || " ") + " " + (item.LastName || " ")) || RVDic.Anonymous;

            return GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4", Name: "containerDiv", Style: "padding:0.3rem; min-height:4.2rem;",
                    Childs: [
                        {
                            Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                            Style: "position:relative; padding:0.3rem; height:100%;" +
                                "padding-" + RV_Float + ":3.8rem;" + (editOptions.length ? "padding-" + RV_RevFloat + ":2rem;" : ""),
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem; width:3rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter", Style: "width:3rem; height:3rem;;",
                                            Attributes: [{ Name: "src", Value: item.ImageURL }]
                                        }
                                    ]
                                },
                                (!editOptions.length ? null : {
                                    Type: "div",
                                    Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0rem; width:1.5rem; text-align:center;",
                                    Childs: editOptions
                                }),
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.7rem; cursor:pointer;",
                                    Link: RVAPI.UserPageURL({ UserID: item.UserID }),
                                    Childs: [
                                        { Type: "text", TextValue: fullname },
                                        (!item.UserName ? null : {
                                            Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                            Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; padding:0 0.3rem; font-size:0.6rem;",
                                            Childs: [{ Type: "text", TextValue: item.UserName }]
                                        })
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);
        }
    };
})();