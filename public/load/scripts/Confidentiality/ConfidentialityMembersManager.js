(function () {
    if (window.ConfidentialityMembersManager) return;

    window.ConfidentialityMembersManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Interface = {
            NewUserArea: null,
            UsersArea: null
        };

        this.Objects = {
            ConfidentialityID: params.ConfidentialityID,
            UserAutoSuggest: null,
            Users: [],
            ListViewer: null
        };

        this.Options = {
            Editable: false,
            OnMembersGet: null
        };

        for (var op in (params.Options || {})) this.Options[op] = params.Options[op];

        var elems = GlobalUtilities.create_nested_elements([
            { Type: "div", Class: "small-12 medium-12 large-12", Name: "newUserArea", Style: "margin-bottom:1rem;" },
            { Type: "div", Class: "small-12 medium-12 large-12", Name: "usersArea" }
        ], this.ContainerDiv);

        this.Interface.NewUserArea = elems["newUserArea"];
        this.Interface.UsersArea = elems["usersArea"];

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["UsersAPI", "PrivacyAPI"] },
            "SimpleListViewer/NewSimpleListViewer.js"
        ], { OnLoad: function () { that._initialize(); } });
    }

    ConfidentialityMembersManager.prototype = {
        _initialize: function () {
            var that = this;

            that.__SuggestedUserImages = {};

            that.Objects.UserAutoSuggest = GlobalUtilities.append_autosuggest(that.Interface.NewUserArea, {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    var users = JSON.parse(responseText).Users || [];
                    var arr = [];
                    for (var i = 0, lnt = users.length; i < lnt; ++i) {
                        arr.push([Base64.decode(users[i].FirstName) + " " + Base64.decode(users[i].LastName) +
                            " - " + Base64.decode(users[i].UserName), users[i].UserID]);
                        that.__SuggestedUserImages[users[i].UserID] = users[i].ImageURL;
                    }
                    return arr;
                },
                OnSelect: function () {
                    var index = that.Objects.UserAutoSuggest.selectedIndex;
                    var userId = that.Objects.UserAutoSuggest.values[index];
                    var fullname = that.Objects.UserAutoSuggest.keywords[index];

                    PrivacyAPI.SetConfidentialityLevel({
                        ObjectID: userId, ConfidentialityID: that.Objects.ConfidentialityID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                clear_autosuggest(that.Objects.UserAutoSuggest);

                                if (that.Objects.ListViewer) that.Objects.ListViewer.add_item({
                                    UserID: userId, ImageURL: that.__SuggestedUserImages[userId], FirstName: fullname
                                });
                            }
                        }
                    });
                }
            });

            that.reset();
        },

        reset: function (params) {
            params = params || {};

            var that = this;

            that.Objects.Users = [];
            that.Objects.ConfidentialityID = params.ConfidentialityID || that.Objects.ConfidentialityID;

            if (that.Options.OnMembersGet) return that.Options.OnMembersGet();

            that.Objects.ListViewer = new NewSimpleListViewer(that.Interface.UsersArea, {
                Options: {
                    Count: that.Options.Count,
                    AutoGrow: false,
                    OnDataRequest: function (options, done, setTotalCount) {
                        //var searchText = GlobalUtilities.trim((that.Interface.SearchInput || { value: "" }).value);

                        PrivacyAPI.GetConfidentialityLevelUsers(GlobalUtilities.extend(options || {}, {
                            ConfidentialityID: that.Objects.ConfidentialityID, ParseResults: true,
                            ResponseHandler: function (result) {
                                setTotalCount(result.TotalCount);

                                var users = (result.Users || []).map(function (u) {
                                    return {
                                        UserID: u.UserID, FirstName: Base64.decode(u.FirstName),
                                        LastName: Base64.decode(u.LastName), UserName: Base64.decode(u.UserName),
                                        ImageURL: u.ProfileImageURL
                                    };
                                });

                                done(users);
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
                    }
                }
            });
        },

        get_user: function (userId) {
            for (var i = 0, lnt = (this.Objects.Users || []).length; i < lnt; ++i)
                if ((this.Objects.Users[i] || {}).UserID == userId) return (this.Objects.Users[i] || {});
            return null;
        },

        add_user: function (container, user, onRemove) {
            var that = this;

            user = user || {};

            var fullname = GlobalUtilities.trim((user.FirstName || " ") + " " + (user.LastName || " "));

            if (that.get_user(user.UserID) != null) return;

            var editable = that.Options.Editable === true;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-6 large-4", Name: "containerDiv", Style: "padding:0.3rem;",
                Childs: [{
                    Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                    Style: "padding:0.3rem; height:100%; display:flex; flex-flow:row; align-items:center;",
                    Childs: [
                        (!editable ? null : {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                Attributes: [{ Name: "aria-hidden", Value: true }],
                                Properties: [{ Name: "onclick", Value: function () { that.remove_user(user.UserID, fullname, onRemove); } }]
                            }]
                        }),
                        {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "img", Class: "rv-border-radius-quarter", Style: "width:2rem; height:2rem;",
                                Attributes: [{ Name: "src", Value: user.ImageURL }]
                            }]
                        },
                        {
                            Type: "div", Style: "flex:1 1 auto; cursor:pointer;",
                            Link: UsersAPI.UserPageURL({ UserID: user.UserID }),
                            Childs: [
                                { Type: "text", TextValue: fullname },
                                (!user.UserName ? null : {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;" +
                                        "padding:0.1rem 0.3rem; font-size:0.6rem;",
                                    Childs: [{ Type: "text", TextValue: user.UserName }]
                                })
                            ]
                        }
                    ]
                }]
            }], container);

            user.ContainerDiv = elems["containerDiv"];

            that.Objects.Users.push(user);
        },

        remove_user: function (userId, fullname, done) {
            var that = this;

            GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + fullname + "'"), function (result) {
                if (!result) return;

                PrivacyAPI.UnsetConfidentialityLevel({
                    ObjectID: userId,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var user = that.get_user(userId);
                        if (user == null) return;

                        for (var i = 0, lnt = that.Objects.Users.length; i < lnt; ++i)
                            if ((that.Objects.Users[i] || {}).UserID == userId) that.Objects.Users[i] = null;

                        user.ContainerDiv.parentNode.removeChild(user.ContainerDiv);

                        done();
                    }
                });
            });
        }
    }
})();