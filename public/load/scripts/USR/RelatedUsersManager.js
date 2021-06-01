(function () {
    if (window.RelatedUsersManager) return;

    window.RelatedUsersManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null
        };

        this.Objects = {
            FoundUsers: [],
            Users: []
        };

        this.Options = GlobalUtilities.extend({
            Editable: false,
            Title: null,
            TitleClass: null,
            TitleStyle: null,
            InputClass: null,
            InputStyle: null,
            ItemsAreaStyle: null,
            RemoveConfirm: null,
            OnBeforeUsersGet: null,
            OnBeforeAdd: null,
            OnBeforeRemove: null
        }, params.Options || {});

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["UsersAPI"]}], {
            OnLoad: function () { that._preinit(params); }
        });
    }

    RelatedUsersManager.prototype = {
        _preinit: function () {
            var that = this;

            var onBeforeUsersGet = that.Options.OnBeforeUsersGet || function (e, d) { };
            var prevented = false;
            var processing = true;

            var succeed = function (result) {
                that._initialize(GlobalUtilities.get_type(result) == "array" ? result : (result || {}).Users || []);
            }

            if (onBeforeUsersGet.call(that, { preventDefault: function () { prevented = true } }, succeed) === false) succeed(false);
            else if (processing === true && !prevented) succeed();
        },

        _initialize: function (initialUsers) {
            var that = this;

            initialUsers = initialUsers || [];

            var _label = that.Options.Title;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 meidum-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: that.Options.TitleClass, Style: that.Options.TitleStyle,
                            Childs: !_label ? null : [{ Type: "middle", Childs: [{ Type: "text", TextValue: _label + ":" }] }]
                        },
                        {
                            Type: "div", Class: that.Options.InputClass || "small-12 medium-12 large-12",
                            Style: that.Options.InputStyle, Name: "userSelect"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "itemsArea",
                    Style: "margin:0rem; margin-top:1rem;" + (that.Options.ItemsAreaStyle || " ")
                }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];

            var _processing = false;

            var _beforeAdd = function (uId) {
                var onBeforeAdd = that.Options.OnBeforeAdd || function (e, d) { };
                var prevented = false;

                var succeed = function (result) {
                    if ((result || {}).UserID || (result || {}).User) {
                        that.add_user(result.UserID ? result : result.User);
                        as.clear();
                    }

                    _processing = false;
                    GlobalUtilities.unblock(that.ContainerDiv);
                }

                var _data = { preventDefault: function () { prevented = true }, User: { UserID: uId} };

                GlobalUtilities.block(that.ContainerDiv);
                _processing = true;

                if (onBeforeAdd.call(that, _data, succeed) === false) succeed(false);
                else if (_processing === true && !prevented) succeed();
            }

            var as = GlobalUtilities.append_autosuggest(elems["userSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    var users = JSON.parse(responseText).Users || [];
                    var arr = [];
                    for (var i = 0, lnt = users.length; i < lnt; ++i) {
                        users[i].FirstName = Base64.decode(users[i].FirstName);
                        users[i].LastName = Base64.decode(users[i].LastName);
                        users[i].UserName = Base64.decode(users[i].UserName);

                        arr.push([users[i].FirstName + " " + users[i].LastName + " - " + users[i].UserName, users[i].UserID]);

                        that.Objects.FoundUsers[users[i].UserID] = users[i];
                    }
                    return arr;
                },
                OnSelect: function () {
                    _beforeAdd((that.Objects.FoundUsers[as.values[as.selectedIndex]] || {}).UserID);
                }
            });

            for (var i = 0, lnt = initialUsers.length; i < lnt; ++i)
                that.add_user(initialUsers[i]);
        },

        add_user: function (user) {
            var that = this;

            if (!user) return;

            user.FirstName = Base64.decode(user.FirstName);
            user.LastName = Base64.decode(user.LastName);
            user.UserName = Base64.decode(user.UserName);

            var fullname = GlobalUtilities.trim((user.FirstName || " ") + " " + (user.LastName || " "));

            that.Objects.Users[user.UserID] = user;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.3rem;", Name: "container",
                Childs: [{
                    Type: "div",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                    Style: "position:relative; padding:0.3rem; height:100%; min-height:4rem;" +
                        "padding-" + RV_Float + ":3.8rem; padding-" + RV_RevFloat + ":1.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.2rem;" + RV_RevFloat + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { that.remove_user(user.UserID, elems["container"]); } }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0; bottom:0;" + RV_Float + ":0.3rem;",
                            Childs: [{
                                Type: "middle",
                                Childs: [{
                                    Type: "img", Class: "rv-border-radius-quarter", Style: "width:3rem; height:3rem;",
                                    Attributes: [{ Name: "src", Value: user.ProfileImageURL || user.ImageURL }]
                                }]
                            }]
                        },
                        {
                            Type: "div", Class: "small-12 meidum-12 large-12", Style: "font-size:0.8rem;",
                            Link: RVAPI.UserPageURL({ UserID: user.UserID }), Params: { Confirmation: true },
                            Childs: [
                                { Type: "text", TextValue: fullname },
                                (!user.UserName ? null : {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-size:0.6rem; padding:0.1rem 0.3rem;",
                                    Childs: [{ Type: "text", TextValue: user.UserName }]
                                })
                            ]
                        }
                    ]
                }]
            }], that.Interface.ItemsArea);
        },

        remove_user: (function () {
            var _beforeRemove = function (that, container, uId) {
                var onBeforeRemove = that.Options.OnBeforeRemove || function (e, d) { };
                var prevented = false;

                var succeed = function (result) {
                    if (result !== false) {
                        that.Objects.Users[uId] = null;
                        container.parentNode.removeChild(container);
                    }

                    that.__Removing = false;
                    GlobalUtilities.unblock(that.ContainerDiv);
                }

                var _data = { preventDefault: function () { prevented = true }, User: { UserID: uId} };

                GlobalUtilities.block(that.ContainerDiv);
                that.__Removing = true;

                if (onBeforeRemove.call(that, _data, succeed) === false) succeed(false);
                else if (that.__Removing === true && !prevented) succeed();
            }

            return function (userId, containerDiv) {
                var that = this;

                if (!that.Options.RemoveConfirm)
                    _beforeRemove(that, containerDiv, userId);
                else {
                    GlobalUtilities.confirm(that.Options.RemoveConfirm, function (result) {
                        if (result) _beforeRemove(that, containerDiv, userId);
                    });
                }
            }
        })()
    }
})();