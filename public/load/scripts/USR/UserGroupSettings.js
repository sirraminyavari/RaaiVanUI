(function () {
    if (window.UserGroupSettings) return;

    window.UserGroupSettings = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Interface = {
            RolesArea: null,
            NewUserArea: null,
            UsersArea: null
        };

        this.Objects = {
            ID: params.ID,
            UserAutoSuggest: null,
            Users: [],
            Roles: params.Roles || [],
            Permissions: {}
        };

        this.ContainerDiv.innerHTML = "";

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Style: "margin:0rem; padding:0.3rem;", Name: "rolesArea",
                Class: "small-12 medium-12 large-12 row rv-border-radius-half rv-bg-color-trans-white"
            },
            { Type: "div", Class: "small-12 medium-12 large-12", Name: "newUserArea", Style: "margin:2rem 0 1rem 0;" },
            { Type: "div", Class: "small-12 medium-12 large-12", Name: "usersArea" }
        ], this.ContainerDiv);

        this.Interface.RolesArea = elems["rolesArea"];
        this.Interface.NewUserArea = elems["newUserArea"];
        this.Interface.UsersArea = elems["usersArea"];

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    UserGroupSettings.prototype = {
        initialize: function () {
            var that = this;

            UsersAPI.GetUserGroupPermissions({
                ID: that.Objects.ID, ParseResults: true,
                ResponseHandler: function (result) {
                    var permissions = result.Permissions || [];
                    for (var i = 0, lnt = permissions.length; i < lnt; ++i)
                        that.Objects.Permissions[permissions[i].ID] = true;

                    for (var i = 0, lnt = that.Objects.Roles.length; i < lnt; ++i)
                        that.add_role(that.Objects.Roles[i]);

                    that.Objects.UserAutoSuggest = GlobalUtilities.append_autosuggest(that.Interface.NewUserArea, {
                        InputClass: "rv-input",
                        InputStyle: "width:100%; font-size:0.7rem;",
                        InnerTitle: RVDic.UserSelect + "...",
                        AjaxDataSource: UsersAPI.GetUsersDataSource(),
                        ResponseParser: function (responseText) {
                            var users = JSON.parse(responseText).Users || [];
                            var arr = [];
                            for (var i = 0, lnt = users.length; i < lnt; ++i) {
                                arr.push([Base64.decode(users[i].FirstName || "") + " " + Base64.decode(users[i].LastName || "") +
                                " - " + Base64.decode(users[i].UserName || ""), users[i].UserID]);
                            }
                            return arr;
                        },
                        OnSelect: function () {
                            var index = that.Objects.UserAutoSuggest.selectedIndex;
                            var userId = that.Objects.UserAutoSuggest.values[index];
                            var fullname = that.Objects.UserAutoSuggest.keywords[index];

                            UsersAPI.AddUserGroupMember({
                                ID: that.Objects.ID, UserID: userId, ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                                    clear_autosuggest(that.Objects.UserAutoSuggest);

                                    that.add_user({ UserID: userId, ImageURL: result.ImageURL, FirstName: fullname });
                                }
                            });
                        }
                    });

                    that.reset();
                }
            });
        },

        add_role: function (role) {
            var that = this;

            var _do = function (callback) {
                var _function = (elems["chb"].Checked ? "Unset" : "Set") + "UserGroupPermission";

                UsersAPI[_function]({
                    ID: role.ID, GroupID: that.Objects.ID, ParseResults: true,
                    ResponseHandler: function (result) { callback(!result.ErrorText); }
                });
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.3rem;",
                    Childs: [
                        {
                            Type: "div", 
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                            Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":2rem; height:100%; cursor:pointer;",
                            Properties: [{
                                Name: "onclick", Value: function () {
                                    _do(function (result) {
                                        var curVal = !!elems["chb"].Checked;
                                        if (!result) curVal = !curVal;
                                        var nextFunc = curVal === true ? "uncheck" : "check";
                                        elems["chb"][nextFunc]({ StopOnChange: true });
                                    });
                                }
                            }],
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "chb",
                                            Params: {
                                                Checked: !!that.Objects.Permissions[role.ID], Width: 18, Height: 18,
                                                OnClick: function (e, done) {
                                                    e.preventDefault();
                                                    _do(function (result) { done(result); });
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(role.Title) }]
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.RolesArea);
        },

        reset: function (params) {
            params = params || {};

            var that = this;

            that.Objects.Users = [];
            that.Objects.ID = params.ID || that.Objects.ID;

            var _decode_user = function (usr) {
                return {
                    UserID: usr.UserID, FirstName: Base64.decode(usr.FirstName),
                    LastName: Base64.decode(usr.LastName), UserName: Base64.decode(usr.UserName),
                    ImageURL: usr.ImageURL
                };
            };

            UsersAPI.GetUserGroupMembers({
                ID: that.Objects.ID, ParseResults: true,
                ResponseHandler: function (result) {
                    var members = result.Members || [];

                    var usersArr = [];

                    for (var i = 0, lnt = members.length; i < lnt; ++i)
                        usersArr.push(_decode_user(members[i]));

                    that.add_users(usersArr);
                }
            });
        },

        get_user: function (userId) {
            for (var i = 0, lnt = (this.Objects.Users || []).length; i < lnt; ++i)
                if ((this.Objects.Users[i] || {}).UserID == userId) return (this.Objects.Users[i] || {});
            return null;
        },

        add_users: function (users) {
            this.Interface.UsersArea.innerHTML = "";
            for (var i = 0, lnt = (users || []).length; i < lnt; ++i) this.add_user(users[i]);
        },

        add_user: function (user) {
            var that = this;

            user = user || {};

            var userId = user.UserID;
            var username = user.UserName;
            var firstname = user.FirstName;
            var lastname = user.LastName;
            var fullname = GlobalUtilities.trim((firstname || " ") + " " + (lastname || " ")) + " - " + username;
            var imageUrl = user.ImageURL;

            if (that.get_user(userId) != null) return;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "containerDiv",
                    Style: "display:inline-block; position:relative; padding:0.3rem;" +
                        "width:6rem; padding-" + RV_Float + ":2rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.1rem;" + RV_Float + ":0rem; width:2rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { that.remove_user(userId, fullname); } }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-quarter", Style: "width:100%;",
                                    Attributes: [{ Name: "src", Value: imageUrl }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 Ellipsis", Tooltip: fullname,
                            Style: "font-size:0.6rem; text-align:center; cursor:pointer; margin-top:0.5rem;",
                            Link: UsersAPI.UserPageURL({ UserID: userId }),
                            Childs: [{ Type: "text", TextValue: fullname }]
                        }
                    ]
                }
            ], that.Interface.UsersArea);

            user.ContainerDiv = elems["containerDiv"];

            that.Objects.Users.push(user);
        },

        remove_user: function (userId, fullname) {
            var that = this;

            GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + fullname + "'"), function (result) {
                if (!result) return;

                UsersAPI.RemoveUserGroupMember({
                    ID: that.Objects.ID, UserID: userId, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var user = that.get_user(userId);
                        if (user == null) return;

                        for (var i = 0, lnt = that.Objects.Users.length; i < lnt; ++i)
                            if ((that.Objects.Users[i] || {}).UserID == userId) that.Objects.Users[i] = null;

                        user.ContainerDiv.parentNode.removeChild(user.ContainerDiv);
                    }
                });
            });
        }
    };
})();