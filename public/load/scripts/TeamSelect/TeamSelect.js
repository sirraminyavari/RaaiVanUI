(function () {
    if (window.TeamSelect) return;

    var __Users = {};

    window.TeamSelect = function (params) {
        params = params || {};
        var that = this;

        this.Interface = {
            DialogContainer: null,
            UsersSelectArea: null,
            OwnerSelectButton: null,
            AlertArea: null,
            UsersArea: null,
            SumArea: null
        }

        this.Objects = {
            NodeTypeID: params.NodeTypeID || "",
            Dialog: null,
            DialogOwner: null,
            SelectedUsers: params.SelectedUsers || [],
            UserSelect: null
        }

        var options = params.Options || {};

        this.Options = {
            OnSelect: options.OnSelect
        }

        GlobalUtilities.load_files(["API/CNAPI.js", "API/UsersAPI.js"], {
            OnLoad: function () { that._initialize(params); }
        });
    }

    TeamSelect.prototype = {
        _initialize: function (params) {
            params = params || {};
            var that = this;

            params.InitialUsers = params.InitialUsers || [];

            if (params.InitialUsers.length == 0) {
                UsersAPI.GetCurrentUser({
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        var user = result;
                        user.UserName = Base64.decode(user.UserName);
                        user.FirstName = Base64.decode(user.FirstName);
                        user.LastName = Base64.decode(user.LastName);
                        user.FullName = Base64.decode(user.FullName);

                        __Users[user.UserID] = user;

                        params.InitialUsers.push(user);

                        that._create_interface(params);
                    }
                });
            }
            else
                that._create_interface(params);
        },

        _set_inner_titles: function () {
            var that = this;
            GlobalUtilities.set_inner_title(that.Objects.UserSelect.InputElement, RVDic.UserSelect + "...");
        },

        show: function (params) {
            params = params || {};
            var that = this;

            that.Objects.Dialog = GlobalUtilities.show(that.Interface.DialogContainer);

            if (params.InitialUsers) that._remove_user(null, true);

            for (var i = 0, lnt = (params.InitialUsers || []).length; i < lnt; ++i)
                that._add_user(params.InitialUsers[i]);

            that._set_inner_titles();
        },

        close: function () {
            if (this.Objects.Dialog) this.Objects.Dialog.Close();
        },

        _create_interface: function (params) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "groupSelectDialog",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center; font-weight:bold; margin-bottom:0.1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.UsersSelect }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "alertArea",
                            Style: "color:red; text-align:center; margin-bottom:1rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "usersSelectArea",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "ownerSelectButton",
                                    Style: "cursor:pointer; color: green; font-weight:bold; font-size:0.8rem; margin-bottom:0.5rem;"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "userSelect" },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                                    Childs: [
                                        {
                                            Type: "div", Name: "sumArea",
                                            Style: "display:inline-block; width:5rem; margin:0.8rem 0.3rem 0rem 0.3rem;" +
                                                "text-align:center; font-size:0.7rem; font-weight:bold;"
                                        }
                                    ]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "usersArea" },
                                {
                                    Type: "div", Class: "small-12 medium-8 large-6 row", Style: "margin:1rem auto 0rem auto;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-5 medium-5 large-5 ActionButton",
                                            Style: "font-weight:bold;", Name: "cancelButton",
                                            Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                                        },
                                        { Type: "div", Class: "small-2 medium-2 large-2" },
                                        {
                                            Type: "div", Class: "small-5 medium-5 large-5 ActionButton", 
                                            Style: "font-weight:bold;", Name: "registerButton",
                                            Childs: [{ Type: "text", TextValue: RVDic.Register }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]);

            that.Interface.DialogContainer = elems["groupSelectDialog"];
            that.Interface.UsersSelectArea = elems["usersSelectArea"];
            that.Interface.OwnerSelectButton = elems["ownerSelectButton"];
            that.Interface.AlertArea = elems["alertArea"];
            that.Interface.UsersArea = elems["usersArea"];
            that.Interface.SumArea = elems["sumArea"];

            that.Objects.Dialog = GlobalUtilities.show(that.Interface.DialogContainer);

            that._goto_users_select_page(params.Owner);

            elems["cancelButton"].onclick = function () { that.Objects.Dialog.Close(); }
            
            elems["registerButton"].onclick = function () {
                var _collaborationShares = "";
                var sum = 0;
                var usersCount = 0;
                for (var i = 0, isFirst = true, lnt = that.Objects.SelectedUsers.length; i < lnt; ++i) {
                    if (!that.Objects.SelectedUsers[i]) continue;
                    var _share = +that.Objects.SelectedUsers[i].ShareInput.value;
                    if (isNaN(_share) || _share <= 0 || _share > 100) {
                        that.Interface.AlertArea.style.display = "block";
                        that.Interface.AlertArea.innerHTML = RVDic.Confirms.CollaborationShareLimit;
                        return;
                    }
                    sum += _share;
                    ++usersCount;
                    _collaborationShares += (isFirst ? "" : "|") + that.Objects.SelectedUsers[i].UserID + ":" + _share;
                    isFirst = false;
                }

                if (usersCount == 0) {
                    that.Interface.AlertArea.style.display = "block";
                    that.Interface.AlertArea.innerHTML = RVDic.Confirms.PleaseSelectUsers;
                    return;
                }

                if (sum != 100) {
                    alertArea.style.display = "block";
                    that.Interface.AlertArea.innerHTML = RVDic.Confirms.CollaborationSumLimit;
                    return;
                }

                params.CollaborationShares = _collaborationShares;
                //params.OwnerID = that.Objects.Dialog.Owner ? that.Objects.Dialog.Owner.NodeID || "" : "";
                params.OwnerID = that.Objects.DialogOwner ? that.Objects.DialogOwner.NodeID || "" : "";
                //params.OnSucceed = function () { that.Objects.Dialog.Close(); }

                if (that.Options.OnSelect) {
                    var su = [];
                    for (var i = 0, lnt = (that.Objects.SelectedUsers || []).length; i < lnt; ++i) {
                        if (!that.Objects.SelectedUsers[i]) continue;
                        var _usr = that.Objects.SelectedUsers[i];
                        su.push(GlobalUtilities.extend(_usr, __Users[_usr.UserID] || {}));
                    }
                    that.Options.OnSelect((GlobalUtilities.extend({}, { SU: su })).SU, that.Objects.DialogOwner, function () { that.close(); });
                }
            };

            that.Objects.UserSelect = GlobalUtilities.append_autosuggest(elems["userSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    var users = JSON.parse(responseText).Users || [];
                    var arr = [];
                    for (var i = 0, lnt = users.length; i < lnt; ++i) {
                        arr.push([Base64.decode(users[i].FirstName) + " " + Base64.decode(users[i].LastName) +
                            (RVGlobal.HideUserNames ? "" : " - " + Base64.decode(users[i].UserName)), users[i].UserID]);

                        __Users[users[i].UserID] = { UserID: users[i].UserID, FirstName: Base64.decode(users[i].FirstName),
                            LastName: Base64.decode(users[i].LastName), UserName: Base64.decode(users[i].UserName),
                            ProfileImageURL: users[i].ImageURL || users[i].ProfileImageURL
                        };
                    }

                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    var userId = this.values[index];
                    var fullname = this.keywords[index];
                    that.Objects.UserSelect.clear();
                    that._add_user({ UserID: userId, FullName: fullname });
                }
            });

            for (var i = 0, lnt = (params.InitialUsers || []).length; i < lnt; ++i)
                that._add_user(params.InitialUsers[i]);

            that._set_inner_titles();
        },

        _set_sum: function () {
            var that = this;
            var sum = 0;
            for (var i = 0, lnt = that.Objects.SelectedUsers.length; i < lnt; ++i) {
                if (!that.Objects.SelectedUsers[i]) continue;
                var _share = +that.Objects.SelectedUsers[i].ShareInput.value;
                if (isNaN(_share)) _share = 0;
                sum += _share;
                that.Objects.SelectedUsers[i].ShareInput.style.color = _share > 100 ? "red" :
                    (isNaN(+that.Objects.SelectedUsers[i].ShareInput.value) ? "#cdcdcd" : "black");
                if (_share > 0 && _share <= 100) that.Objects.SelectedUsers[i].ShareInput.style.fontWeight = "normal";
                that.Objects.SelectedUsers[i].Share = _share;
            }
            that.Interface.SumArea.innerHTML = sum > 100 ? "100+" : (sum == 0 ? "" : sum.toFixed(2));
            that.Interface.SumArea.style.color = sum > 100 ? "red" : (sum < 100 ? "blue" : "green");
        },

        _goto_users_select_page: function (params) {
            var that = this;

            that.Interface.OwnerSelectButton.innerHTML = RVDic.ClickToSelectTheOwnerOfTheIntellectualProperty;
            that.Interface.OwnerSelectButton.style.cursor = "pointer";

            if (params && params.NodeID) {
                that.Objects.DialogOwner = params;
                that.Interface.OwnerSelectButton.innerHTML = "";
                that.Interface.OwnerSelectButton.style.cursor = "default";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [
                            {
                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                Attributes: [{ Name: "aria-hidden", Value: true }],
                                Properties: [
                                    {
                                        Name: "onclick",
                                        Value: function () {
                                            that.Objects.DialogOwner = null;
                                            that._goto_users_select_page();
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        Type: "div", Style: "display:inline-block; cursor:pointer;",
                        Link: RVAPI.NodePageURL({ NodeID: params.NodeID }),
                        Childs: [{ Type: "text", TextValue: params.NodeName || ""}]
                    }
                ], that.Interface.OwnerSelectButton);
            }

            setTimeout(function () {
                that.Interface.OwnerSelectButton.onclick = (params || {}).NodeID ? function () { } : function () {
                    if (that.__OwnerSelectDiv) {
                        that.__ShowedOwnerDiv = GlobalUtilities.show(that.__OwnerSelectDiv);
                        return;
                    }

                    that.__OwnerSelectDiv = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                        }
                    ])["_div"];

                    GlobalUtilities.loading(that.__OwnerSelectDiv);
                    that.__ShowedOwnerDiv = GlobalUtilities.show(that.__OwnerSelectDiv);

                    GlobalUtilities.load_files(["CN/NodeOwnerSelect.js"], {
                        OnLoad: function () {
                            var nos = new NodeOwnerSelect(that.__OwnerSelectDiv, {
                                NodeTypeID: that.Objects.NodeTypeID,
                                OnSelect: function (node) {
                                    that.__ShowedOwnerDiv.Close();

                                    ////////////////////////////////////////////////////////////////////////
                                    var nodeId = node.NodeID;
                                    var nodeName = node.Name;

                                    GlobalUtilities.block(that.Interface.DialogContainer);

                                    that._remove_user(null, true);

                                    CNAPI.GetMembers({
                                        NodeID: nodeId,
                                        ResponseHandler: function (responseText) {
                                            var members = JSON.parse(responseText).Members || [];
                                            for (var i = 0, lnt = members.length; i < lnt; ++i) {
                                                members[i].FirstName = Base64.decode(members[i].FirstName || "");
                                                members[i].LastName = Base64.decode(members[i].LastName || "");
                                                members[i].UserName = Base64.decode(members[i].UserName || "");

                                                __Users[members[i].UserID] = {
                                                    UserID: members[i].UserID, FirstName: members[i].FirstName,
                                                    LastName: members[i].LastName, UserName: members[i].UserName,
                                                    ProfileImageURL: members[i].ImageURL || members[i].ProfileImageURL
                                                };

                                                that._add_user(members[i]);
                                            }

                                            that.Interface.AlertArea.style.display = !members.length ? "block" : "none";
                                            that.Interface.AlertArea.innerHTML = !members.length ? RVDic.MSG.NoMemberFound : "";

                                            that._goto_users_select_page({ NodeID: nodeId, NodeName: nodeName });

                                            GlobalUtilities.unblock(that.Interface.DialogContainer);
                                        }
                                    });
                                    ///////////////////////////////////////
                                }
                            });
                        }
                    });
                }
            }, 100);
        },

        _add_user: function (user) {
            user = user || {};
            var that = this;

            if (that._get_user(user.UserID)) return;
            user.FullName = user.FullName ? user.FullName :
                user.FirstName + " " + user.LastName + (RVGlobal.HideUserNames ? "" : " - " + user.UserName);
            that.Objects.SelectedUsers.push(user);

            var _share = +user.Share;
            if (isNaN(_share)) _share = 0;

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "userContainer",
                    Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-quarter", 
                    Style: "position:relative; font-size:0.8rem; padding:0.3rem; padding-" + RV_RevFloat + ":6rem;", 
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.2rem;" + RV_RevFloat + ":0.3rem; width:5rem;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "shareInput",
                                    Style: "width:100%; font-size:0.6rem; padding-top:0.1rem;" +
                                        "padding-bottom:0.1rem; text-align:center;",
                                    Attributes: [{ Name: "type", Value: "text" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block;", Link: RVAPI.UserPageURL({ UserID: user.UserID }),
                            Childs: [{ Type: "text", TextValue: user.FullName }]
                        }
                    ]
                }
            ], that.Interface.UsersArea);

            var userContainer = _el["userContainer"];
            var removeButton = _el["removeButton"];

            user.ContainerDiv = userContainer;

            user.ShareInput = _el["shareInput"];
            GlobalUtilities.set_inner_title(user.ShareInput, RVDic.CollaborationShare);

            if (_share > 0) {
                user.ShareInput.value = _share;
                user.ShareInput.style.color = "black";
            }

            removeButton.onclick = function () { that._remove_user(user.UserID); }

            user.ShareInput.onchange = function () { that._set_sum(); }
            that._set_sum();
        },

        _get_user: function (userId) {
            var that = this;

            for (var i = 0, lnt = that.Objects.SelectedUsers.length; i < lnt; ++i) {
                if (that.Objects.SelectedUsers[i] != null && that.Objects.SelectedUsers[i].UserID == userId)
                    return that.Objects.SelectedUsers[i];
            }

            return null;
        },

        _remove_user: function (userId, removeAll) {
            var that = this;

            for (var i = 0, lnt = that.Objects.SelectedUsers.length; i < lnt; ++i) {
                if (that.Objects.SelectedUsers[i] == null) continue;
                if (removeAll === true || that.Objects.SelectedUsers[i].UserID == userId) {
                    that.Objects.SelectedUsers[i].ContainerDiv.parentNode.removeChild(that.Objects.SelectedUsers[i].ContainerDiv);
                    that.Objects.SelectedUsers[i] = null;
                }
            }

            that._set_sum();
        }
    }
})();