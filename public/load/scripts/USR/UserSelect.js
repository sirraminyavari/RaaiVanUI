(function () {
    if (window.UserSelect) return;

    window.UserSelect = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        params = params || {};

        this.Interface = {
            SelectedArea: null,
            UsersArea: null,
            TotalCount: null
        };

        this.Objects = {
            UserInput: null,
            FriendsCheckbox: null,
            SelectedItems: {},
            UsersList: null,
            GetUsersFunction: null
        };

        var options = params.Options || {};

        this.Options = {
            HideSelectedItems: options.HideSelectedItems === true,
            Title: options.Title || RVDic.UserSelect,
            Limits: {},
            OnSelect: options.OnSelect,
            OnConfirm: options.OnConfirm
        };

        var that = this;

        if (!that.ContainerDiv) {
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor", 
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "title", Style: "text-align:center;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "containerDiv" },
                        {
                            Type: "div", Class: "ActionButton", Name: "confirmButton",
                            Style: "width:8rem; margin:1rem auto 0rem auto;",
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        var rslt = { Nodes: that.get_items(), NodeTypes: that.get_node_types(true) };

                                        var _msg = rslt.Nodes.length == 0 && rslt.NodeTypes.length == 0 ?
                                            RVDic.Confirms.YouHaveSelectedNothing + ". " + RVDic.Confirms.DoYouWantToContinue :
                                            RVDic.Confirms.AreYouSureAboutYourSelection;

                                        GlobalUtilities.confirm(_msg, function (r) {
                                            if (!r) return;
                                            SHOWEDDIALOG.Close();
                                            if (that.Options.OnConfirm) that.Options.OnConfirm(rslt);
                                        });
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            that.ContainerDiv = elems["containerDiv"];
            if ((that.Options.Title || "") != "") {
                elems["title"].style.marginBottom = "10px;";
                GlobalUtilities.set_text(elems["title"], that.Options.Title);
            }

            var SHOWEDDIALOG = GlobalUtilities.show(elems["container"]);
        }
        else {
            that.ContainerDiv.innerHTML = "";
        }

        var hasSharingModule = !!((window.RVGlobal || {}).Modules || {}).SH;
        
        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;" +
                    "position:relative; font-weight:bold; margin-bottom:1rem; font-size:1rem; color:rgb(100,100,100); text-align:center;",
                Childs: [
                    { Type: "text", TextValue: that.Options.Title },
                    { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "userselectdialog" } },
                    { Type: "div", Style: "position:absolute; top:0;" + RV_RevFloat + ":0;", Name: "totalCount" }
                ]
            },
            {
                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half",
                Style: "background-color:white; padding:0.5rem; margin-bottom:1rem;" +
                    (that.Options.HideSelectedItems ? "display:none;" : ""),
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-text-shadow",
                        Style: "font-size:0.8rem; font-weight:bold; margin-bottom:0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.SelectedUsers }]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "selectedArea", Style: "margin:0;" }
                ]
            },
            {
                Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0;",
                Childs: [
                    {
                        Type: "div", Class: "small-8 medium-7 large-6",
                        Childs: [
                            {
                                Type: "input", Class: "rv-input", Style: "width:100%;",
                                InnerTitle: RVDic.Search + "...", Name: "userInput",
                                Attributes: [{ Name: "type", Value: "text" }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-4 medium-5 large-6",
                        Style: "padding:0rem 1rem;" + (hasSharingModule ? "" : "display:none;"),
                        Childs: [
                            {
                                Type: "checkbox", Name: "friendsCheckbox",
                                Params: GlobalUtilities.extend({
                                    OnClick: function (e, d) {
                                        e.preventDefault();
                                        d();
                                        that.suggest_users();
                                    }
                                }, hasSharingModule ? { Checked: false } : {})
                            },
                            {
                                Type: "div", Style: "display:inline-block; margin:0.5rem; margin-bottom:0rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.SelectFriends }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "font-size:0.7rem; margin-top:0.5rem;", Name: "usersArea"
                    }
                ]

            }
        ], this.ContainerDiv);

        this.Interface.SelectedArea = elems["selectedArea"];
        this.Interface.UsersArea = elems["usersArea"];
        this.Interface.TotalCount = elems["totalCount"];
        this.Objects.UserInput = elems["userInput"];
        this.Objects.FriendsCheckbox = elems["friendsCheckbox"];

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js", "SimpleListViewer/NewSimpleListViewer.js"], {
            OnLoad: function () { that._initialize(); }
        });
    }

    UserSelect.prototype = {
        _initialize: function () {
            var that = this;

            var _to = null;

            var _search = function () { that.suggest_users(); }

            that._check_if_no_item_selected(true);

            that.Objects.UserInput.onkeydown = function () {
                if (_to) clearTimeout(_to);
                _to = setTimeout(function () { _search(); }, 500);
            };

            that.Objects.UsersList = new NewSimpleListViewer(that.Interface.UsersArea, {
                AutoGrow: false,
                Options: {
                    InnerWidthOffset: 0, Width: null,
                    OnDataRequest: function (options, done, setTotalCount) {
                        that.users_data_request(options, function (result) {
                            that.set_total_count(result.TotalCount);
                            setTotalCount(result.TotalCount);
                            done(result.Users || result.Friends || []);
                        });

                        that.Objects.GetUsersFunction(options);
                    },
                    ItemBuilder: function (container, item, params) {
                        item = item || {};
                        item.FullName = Base64.decode(item.FirstName) + " " + Base64.decode(item.LastName);
                        item.UserName = Base64.decode(item.UserName);
                        
                        GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "small-12 medium-12 large-6", Style: "padding:0.2rem;",
                            Childs: [{
                                Type: "div",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                                Style: "padding:0.3rem; font-size:0.8rem; display:flex; flex-flow:row; align-items:center; cursor:pointer;",
                                Properties: [
                                    {
                                        Name: "onclick",
                                        Value: function () {
                                            that.add_item(item);
                                            if (that.Options.OnSelect) that.Options.OnSelect(item);
                                        }
                                    }
                                ],
                                Childs: [
                                    {
                                        Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                        Childs: [{
                                            Type: "img", Class: "rv-border-radius-quarter", Style: "width:2.5rem; height:2.5rem;",
                                            Attributes: [{ Name: "src", Value: item.ImageURL }]
                                        }]
                                    },
                                    {
                                        Type: "div", Style: "flex:1 1 auto;",
                                        Childs: [
                                            { Type: "text", TextValue: item.FullName },
                                            {
                                                Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                                Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;" +
                                                    "padding:0.1rem 0.3rem; font-size:0.6rem;",
                                                Childs: [{Type: "text", TextValue: item.UserName}]
                                            }
                                        ]
                                    }
                                ]
                            }]
                        }], container);

                        params.OnAfterAdd();
                    }
                }
            });

            that.suggest_users();
        },

        set_total_count: function (count) {
            var that = this;

            if (!that.Interface.TotalCount) return;

            that.Interface.TotalCount.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-text-shadow",
                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-weight:bold;" +
                        "color:rgb(100,100,100); font-size:0.8rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.Count + ":" }]
                },
                {
                    Type: "div", Class: "rv-text-shadow", Style: "display:inline-block; color:red; font-weight:bold; font-size:0.8rem;",
                    Childs: [{ Type: "text", TextValue: count || "0" }]
                }
            ], that.Interface.TotalCount);
        },

        _check_if_no_item_selected: function (setMessage) {
            for (var itm in (this.Objects.SelectedItems || {}))
                if (this.Objects.SelectedItems[itm]) return;
            this.Interface.SelectedArea.innerHTML = !setMessage ? "" :
                "<div class='small-12 medium-12 large-12' style='text-align:center; font-size:0.7rem; font-weight:bold; color:red;'>" +
                RVDic.ThereIsNoItemSelected + "</div>";
        },

        add_item: function (user, auto) {
            var that = this;

            if (!user || that.Objects.SelectedItems[user.UserID]) return;
            else if (!auto) {
                var selectedCount = 0;

                for (var _id in that.Objects.SelectedItems)
                    if (that.Objects.SelectedItems[_id])++selectedCount;

                if (that.Options.Limits.Count > 0 && selectedCount >= that.Options.Limits.Count) {
                    alert(RVDic.MSG.CannotSelectMoreThanNItems.replace("[n]", that.Options.Limits.Count));
                    return false;
                }
            }

            that._check_if_no_item_selected(false);
            that.Objects.SelectedItems[user.UserID] = user;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-6", Style: "padding:0.2rem;", Name: "container",
                Childs: [{
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-softer-soft SoftShadow",
                    Style: "padding:0.3rem; display:flex; flex-flow:row; align-items:center;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove, Name: "removeButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                elems["container"].parentNode.removeChild(elems["container"]);
                                                that.Objects.SelectedItems[user.UserID] = null;
                                                that._check_if_no_item_selected(true);
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "img", Class: "rv-border-radius-quarter", Style: "width:1.5rem; height:1.5rem;",
                                Attributes: [{ Name: "src", Value: user.ImageURL }]
                            }]
                        },
                        {
                            Type: "div", Style: "flex:1 1 auto;",
                            Childs: [
                                { Type: "text", TextValue: GlobalUtilities.trim(user.FullName) },
                                {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;" +
                                        "padding:0.1rem 0.3rem; font-size:0.6rem;",
                                    Childs: [{ Type: "text", TextValue: user.UserName }]
                                }
                            ]
                        }
                    ]
                }]
            }], that.Interface.SelectedArea);

            return true;
        },

        users_data_request: (function () {
            var searchResults = {};

            return function (options, done) {
                options = options || {};
                var that = this;

                var searchText = GlobalUtilities.trim(that.Objects.UserInput.value || "");
                
                var _response_handler = function (responseText) {
                    done(JSON.parse(responseText));
                };

                var apiFunction = that.Objects.FriendsCheckbox.checked ? "GetFriends" : "GetUsers";

                searchResults[apiFunction] = searchResults[apiFunction] || {};

                that.Objects.UserInput.style.display = "block";

                var _initial_check = function () {
                    if (searchResults[apiFunction][searchText]) {
                        _response_handler(searchResults[apiFunction][searchText]);
                        return true;
                    }
                    return false;
                };

                that.Objects.GetUsersFunction = function (op) {
                    if (op.LowerBoundary <= 1 && _initial_check()) return;

                    UsersAPI[apiFunction]({
                        SearchText: Base64.encode(searchText),
                        Count: op.Count, LowerBoundary: op.LowerBoundary,
                        ResponseHandler: function (responseText) {
                            if (op.LowerBoundary <= 1) searchResults[apiFunction][searchText] = responseText;
                            _response_handler(responseText);
                        }
                    });
                }
            }
        })(),

        suggest_users: function (params) {
            params = params || {};
            var that = this;

            that.Objects.UsersList.clear();
            that.Objects.UsersList.data_request(params);
        },

        get_items: function (params) {
            params = params || {};
            var that = this;

            var arr = [];
            for (var userId in that.Objects.SelectedItems)
                if (that.Objects.SelectedItems[userId]) arr.push(that.Objects.SelectedItems[userId]);

            if (params.Check && that.Options.Limits.Count > 0 && arr.length > that.Options.Limits.Count) {
                alert(RVDic.MSG.CannotSelectMoreThanNItems.replace("[n]", that.Options.Limits.Count));
                return false;
            }

            return arr;
        },

        get_items_string: function (delimiter) {
            var str = "";
            for (var userId in this.Objects.SelectedItems)
                if (this.Objects.SelectedItems[userId]) str += (str == "" ? "" : delimiter) + userId;
            return str;
        },

        clear: function () {
            this.Interface.SelectedArea.innerHTML = "";
            this.Objects.SelectedItems = {};
            this._check_if_no_item_selected(true);
        }
    }
})();