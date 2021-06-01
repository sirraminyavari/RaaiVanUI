(function () {
    if (window.UserConnections) return;

    window.UserConnections = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            FriendsDiv: null,
            NetworkDiv: null,
            RequestedFriendDiv: null,
            FriendSuggestionsDiv: null,
            RequestsContainer: null
        };

        this.Objects = {
            UserID: params.UserID,
            ProfileImageURL: params.ProfileImageURL,
            RequestsInitialized: false,
            SuggestionsInitialized: false,
            TotalRequests: 0,
            TotalSuggestions: 0,
            OpenTab: params.OpenTab || "FriendsTab"
        };

        this.Options = {
            Modules: params.Modules
        };

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js", "UserViewer/FullViewer.js", "SimpleListViewer/NewSimpleListViewer.js"], {
            OnLoad: function () { that.init(); }
        });
    };

    UserConnections.prototype = {
        init: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row rv-border-radius-1",
                    Style: "margin:0 auto; overflow:hidden;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Style: "text-align-center;",
                            Childs: [
                                {
                                    Type: "div", Name: "FriendsTab", Style: "padding:1rem 0; font-size:1.2rem;",
                                    Class: "small-12 medium-12 large-12 rv-air-button",
                                    Childs: [{ Type: "text", TextValue: RVDic.Friends }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Style: "text-align-center;",
                            Childs: [
                                {
                                    Type: "div", Name: "expandNetworkTab", Style: "padding:1rem 0; font-size:1.2rem;",
                                    Class: "small-12 medium-12 large-12 rv-air-button-base rv-air-button-black",
                                    Childs: [{ Type: "text", TextValue: RVDic.ExpandFriendsNetwork }]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 WarmBorder SoftBackgroundColor",
                    Style: "position:relative; padding:0.5rem; margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "WarmBackgroundColor", Name: "friendsArrow",
                            Style: "display:none; width:1rem; height:1rem; z-index:-1;" +
                                "border-top:thin #EFEFEF solid; border-" + window.RV_RevFloat + ":thin #EFEFEF solid;" +
                                "margin-top:-1rem; position:absolute; " + window.RV_Float + ":calc(25% - 0.5rem);" +
                                "-ms-transform: rotate(45deg); -webkit-transform: rotate(45deg); transform: rotate(45deg);"
                        },
                        {
                            Type: "div", Class: "WarmBackgroundColor", Name: "expandNetworkArrow",
                            Style: "display:none; width:1rem; height:1rem; z-index:-1;" +
                                "border-top:thin #EFEFEF solid; border-" + window.RV_RevFloat + ":thin #EFEFEF solid;" +
                                "margin-top:-1rem; position:absolute; " + window.RV_RevFloat + ":calc(25% - 0.5rem);" +
                                "-ms-transform: rotate(45deg); -webkit-transform: rotate(45deg); transform: rotate(45deg);"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "friendsDiv", Style: "margin:0;" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: "expandNetworkDiv",
                            Style: "margin:0; display:none;",
                            Childs: [
                                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "friendRequestsMainDiv", Style: "margin:0rem;" },
                                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "friendSuggestionsDiv", Style: "margin:0rem;" }
                            ]
                        }
                    ]
                }
            ], that.Container);

            var userImage = elems["userImage"];
            that.Interface.FriendsDiv = elems["friendsDiv"];
            var networkDiv = that.Interface.NetworkDiv = elems["expandNetworkDiv"];
            var friendsArrow = elems["friendsArrow"];
            var expandNetworkArrow = elems["expandNetworkArrow"];

            var friendsTab = elems["FriendsTab"];
            friendsTab.Name = "FriendsTab";

            var expandNetworkTab = elems["expandNetworkTab"];
            expandNetworkTab.Name = "ExpandNetworkTab";

            that.Interface.FriendRequestsMainDiv = elems["friendRequestsMainDiv"];
            that.Interface.RequestedFriendDiv = elems["requestedFriendDiv"];
            that.Interface.FriendSuggestionsDiv = elems["friendSuggestionsDiv"];

            /****************  Friends  **************/
            var _show_friends = function () {
                that.show_friends();
                that.Interface.FriendsDiv.style.display = friendsArrow.style.display = "flex";
                networkDiv.style.display = expandNetworkArrow.style.display = "none";
            };

            friendsTab.onclick = _show_friends;

            /*************  FriendRequests & Suggestions  ****************/
            var totalRequests = 0;

            var _create_container = function () {
                var _elem = GlobalUtilities.create_nested_elements([
                    { Type: "header", Class: "small-12 medium-12 large-12", Params: { Title: RVDic.FriendRequests } },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "requestsContainer", Style: "margin-bottom:1rem;" }
                ], that.Interface.FriendRequestsMainDiv);

                that.Interface.RequestsContainer = _elem["requestsContainer"];
                that.Interface.FriendRequestsMainDiv.style.display = "none";
            };

            _create_container();

            var expand_onclick = function () {
                isFirstInit = true;
                that.Interface.FriendsDiv.style.display = friendsArrow.style.display = "none";
                networkDiv.style.display = expandNetworkArrow.style.display = "block";

                that._init_friend_requests();
                that._init_friend_suggestions();
            };

            expandNetworkTab.onclick = expand_onclick;

            GlobalUtilities.loading(that.Interface.FriendSuggestionsDiv);

            /******************  Show Friends  *******************/

            if (that.Objects.OpenTab == friendsTab.Name) _show_friends();
            else if (that.Objects.OpenTab == expandNetworkTab.Name) expand_onclick();
        },

        set_meta_data: function () {
            var that = this;

            that.NoRequestFoundMessage = that.NoRequestFoundMessage || GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                    Style: "font-size:1.2rem; padding:1rem 0; text-align:center; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }
            ])["_div"];

            var totalRequests = that.Objects.TotalRequests;
            var suggestionsCount = that.Objects.TotalSuggestions;

            if (that.Objects.RequestsInitialized && that.Objects.SuggestionsInitialized &&
                !that.Objects.TotalRequests && !that.Objects.TotalSuggestions)
                that.Interface.NetworkDiv.insertBefore(that.NoRequestFoundMessage, that.Interface.NetworkDiv.firstChild);
            else if (that.NoRequestFoundMessage.parentNode)
                that.NoRequestFoundMessage.parentNode.removeChild(that.NoRequestFoundMessage);
        },

        show_friends: function () {
            var that = this;

            that.NoFriendFoundMessage = that.NoFriendFoundMessage || GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                    Style: "font-size:1.2rem; padding:1rem 0; text-align:center; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }
            ])["_div"];
            
            new NewSimpleListViewer(that.Interface.FriendsDiv, {
                Options: {
                    OnDataRequest: function (options, done) {
                        UsersAPI.GetFriends(GlobalUtilities.extend(options || {}, {
                            UserID: that.Objects.UserID, ParseResults: true,
                            ResponseHandler: function (result) {
                                that._get_users_info(result.Friends || [], function (usrs) { done(usrs); });
                            }
                        }));
                    },
                    OnNothingFound: function () {
                        that.Interface.FriendsDiv.insertBefore(that.NoFriendFoundMessage, that.Interface.FriendsDiv.firstChild);
                    },
                    ItemBuilder: function (container, item, params) {
                        if ((that.NoFriendFoundButton || {}).parentNode)
                            that.NoFriendFoundMessage.parentNode.removeChild(that.NoFriendFoundMessage);

                        UserViewer.FullViewer(container, { User: item, Options: { IsIconsDivHidden: true } });
                        params.OnAfterAdd();
                    }
                }
            });
        },

        _get_users_info: function (usersArr, callback) {
            var that = this;
            callback = callback || function () { };
            var userIds = [];
            for (var i = 0, lnt = usersArr.length; i < lnt; ++i) userIds.push(usersArr[i].UserID);

            UsersAPI.GetUsers({
                UserIDs: userIds.join("|"), Department: true, ParseResults: true,
                ResponseHandler: function (result) {
                    var retDic = {};
                    for (var i = 0, lnt = (result.Users || []).length; i < lnt; ++i) {
                        var u = result.Users[i];
                        
                        retDic[u.UserID] = {
                            JobTitle: u.JobTitle,
                            GroupID: (u.Nodes || []).length > 0 ? u.Nodes[0].NodeID : "",
                            GroupName: (u.Nodes || []).length > 0 ? Base64.decode(u.Nodes[0].Name) : ""
                        };
                    }

                    for (var i = 0, lnt = usersArr.length; i < lnt; ++i)
                        usersArr[i] = GlobalUtilities.extend(usersArr[i], retDic[usersArr[i].UserID] || {});

                    callback(usersArr);
                }
            });
        },

        _init_friend_requests: function () {
            var that = this;

            that.Interface.RequestsContainer.innerHTML = "";
            GlobalUtilities.loading(that.Interface.RequestsContainer);

            var isLoading = true;
            
            UsersAPI.GetFriendshipRequests({
                UserID: that.Objects.UserID, Sent: false, Count: 10000, ParseResults: true,
                ResponseHandler: function (result) {
                    var friends = result.Friends || [];
                    
                    that.Objects.RequestsInitialized = true;
                    that.Objects.TotalRequests = result.TotalCount;

                    that.set_meta_data();
                    
                    if (isLoading) { that.Interface.RequestsContainer.innerHTML = ""; isLoading = false; }

                    if (that.Objects.TotalRequests == 0) { that.Interface.FriendRequestsMainDiv.innerHTML = ""; }
                    else that.Interface.FriendRequestsMainDiv.style.display = "block";
                    
                    var _create_user = function (user) {
                        UserViewer.FullViewer(that.Interface.RequestsContainer, GlobalUtilities.extend({
                            User: GlobalUtilities.extend(user, { IsPending: true }),
                            OnHide: function () {
                                --that.Objects.TotalRequests;
                                if (that.Objects.TotalRequests <= 0) that.Interface.FriendRequestsMainDiv.innerHTML = "";
                                that.set_meta_data();
                            },
                            OnAcceptRequest: function (_params) {
                                that.Interface.RequestedFriendDiv.style.backgroundImage = "url('" + _params.UserImageURL + "')";
                            }
                        }));
                    };
                    
                    that._get_users_info(friends, function (usrs) {
                        jQuery.each(usrs || [], function (ind, val) { _create_user(val); });
                    });
                }
            });
        },

        _init_friend_suggestions: function () {
            var that = this;

            var _getCount = 12;
            var lowerBoundary = 0;
            var secondSuggestionList = [];
            var ended = false;
            var isFirstInit = true;
            var suggestionDivs = [];

            var _create_user_viewer = function (_container, users) {
                var _showNextSuggestion = function (_params) {
                    var createdNew = false;

                    var _createNewSuggestion = function () {
                        if (secondSuggestionList.length > 0) {
                            _create_user_viewer(null, [secondSuggestionList[0]]);
                            elems["MainDiv"].parentNode.insertBefore(suggestionDivs[secondSuggestionList[0].UserID],
                                suggestionDivs[_params.UserID]);

                            secondSuggestionList.splice(0, 1);
                            createdNew = true;
                        }
                    }

                    _createNewSuggestion();

                    if (secondSuggestionList.length == 0 && !ended) {
                        _get_items(function (_scndList) {
                            secondSuggestionList = _scndList;
                            if (!createdNew) _createNewSuggestion();
                        });
                    }
                };

                for (var i = 0; i < users.length; i++) {
                    var elems = UserViewer.FullViewer(_container, {
                        User: users[i], Options: { ShowCloseButton: true },
                        OnClose: function (__params) { _showNextSuggestion(__params); },
                        OnHide: function () {
                            if (that.Objects.TotalSuggestions == 0) that.Interface.FriendSuggestionsDiv.innerHTML = "";
                        },
                        OnSendRequest: function (__params) {
                            lowerBoundary -= 1;
                            _showNextSuggestion(__params);
                            --that.Objects.TotalSuggestions;
                            that.set_meta_data();
                        }
                    });

                    suggestionDivs[users[i].UserID] = elems["MainDiv"];
                }
            };

            var _get_items = function (done) {
                UsersAPI.GetFriendSuggestions({
                    UserID: that.Objects.UserID, Count: _getCount, LowerBoundary: lowerBoundary + 1, ParseResults: true,
                    ResponseHandler: function (result) {
                        var suggestions = result.Suggestions || [];

                        that.Objects.SuggestionsInitialized = true;
                        that.Objects.TotalSuggestions = result.TotalCount;

                        that.set_meta_data();

                        that._get_users_info(suggestions, function (usrs) {
                            var usrArr = [];

                            for (var i = 0; i < usrs.length; i++)
                                usrArr[i] = GlobalUtilities.extend(usrs[i], { IsPending: false });

                            if (usrArr.length < _getCount) ended = true;
                            lowerBoundary += usrArr.length;
                            done(usrArr);
                        });
                    }
                });
            };

            _get_items(function (users) {
                that.Interface.FriendSuggestionsDiv.innerHTML = "";
                
                if (users.length > 0) {
                    GlobalUtilities.create_nested_elements([
                        { Type: "header", Class: "small-12 medium-12 large-12", Params: { Title: RVDic.FriendSuggestions } },
                    ], that.Interface.FriendSuggestionsDiv);
                }

                _create_user_viewer(that.Interface.FriendSuggestionsDiv, users);
            });
        }
    };
})();