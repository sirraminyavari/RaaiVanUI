(function () {
    if (window.RVTag) return;

    window.RVTag = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            NodeAutoSuggest: null,
            UserAutoSuggest: null,
            LastItemSelected: null,
            OnSelect: params.OnSelect || null
        }

        var that = this;
        that._init();
    }

    RVTag.prototype = {
        _init: function () {
            var that = this;

            that.Container.innerHTML = "";

            var hasSharingModule = !!((window.RVGlobal || {}).Modules || {}).SH;
            
            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "planContainer", Style: "padding:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: "nodesPlan", Style: "margin:0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; padding-" + RV_Float + ":5rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; width:5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Node + ":" }]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodesAutoSuggestContainer" }
                                    ]
                                },
                                { Type: "div", Class: "small-6 medium-6 large-6" },
                                {
                                    Type: "div", Name: "nodesDialog", Class: "small-6 medium-6 large-6 rv-air-button rv-circle",
                                    Style: "font-size:0.7rem; margin-top:1rem;",
                                    Properties: [{ Name: "onclick", Value: function () { _nodeSelect(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.AdvancedSelect }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: "usersPlan",
                            Style: "display:none; margin:0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; padding-" + RV_Float + ":5rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; width:5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.User + ":" }]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "usersAutoSuggestContainer" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-6 medium-6 large-6", Name: "friends", Style: "margin-top:1rem;",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "friendsCheckBox",
                                            Style: "display:inline-block; width:1rem; height:1rem;" +
                                                (hasSharingModule ? "" : "display:none;"),
                                            Params: GlobalUtilities.extend({
                                                OnClick: function (e, done) { done(); _bindUserAutoSuggest(); }
                                            }, hasSharingModule ? { Checked: true } : {})
                                        },
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; margin-" + RV_Float + ":0.3rem;" +
                                                (hasSharingModule ? "" : "display:none;"),
                                            Childs: [{ Type: "text", TextValue: RVDic.Coworkers }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "usersDialog", Class: "small-6 medium-6 large-6 rv-air-button rv-circle",
                                    Style: "font-size:0.7rem; margin-top:1rem;",
                                    Properties: [{ Name: "onclick", Value: function () { _userSelect(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.AdvancedSelect }]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row rv-border-radius-half SoftBorder",
                    Style: "height:2rem; line-height:2rem; border-width:0.1rem 0rem 0rem 0rem;" +
                        "margin:0rem; cursor:pointer; background-color:white; text-align:center;",
                    Childs: [
                            {
                                Type: "div", Name: "nodesTab", Class: "small-6 medium-6 large-6 SoftBorder",
                                Style: "height:100%; border-width:0rem 0rem 0rem 0.1rem; font-weight:bold;",
                                Properties: [{
                                    Name: "onclick", Value:
                                        function () {
                                            _el["nodesPlan"].style.display = "flex";
                                            _el["nodesTab"].style.fontWeight = "bold";
                                            _el["usersPlan"].style.display = "none";
                                            _el["usersTab"].style.fontWeight = "normal";
                                        }
                                }],
                                Childs: [{ Type: "text", TextValue: RVDic.Nodes }]
                            },
                            {
                                Type: "div", Name: "usersTab", Class: "small-6 medium-6 large-6", Style: "height:100%;",
                                Properties: [{
                                    Name: "onclick", Value:
                                        function () {
                                            _el["usersPlan"].style.display = "flex";
                                            _el["usersTab"].style.fontWeight = "bold";
                                            _el["nodesPlan"].style.display = "none";
                                            _el["nodesTab"].style.fontWeight = "normal";
                                        }
                                }],
                                Childs: [{ Type: "text", TextValue: RVDic["Users"] }]
                            }
                    ]
                }
            ], that.Container);

            that.Objects.NodeAutoSuggest = GlobalUtilities.append_autosuggest(_el["nodesAutoSuggestContainer"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem; padding:0.1rem 0.3rem;",
                InnerTitle: RVDic.Select + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];

                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].Name || "");
                        arr.push([tt, items[i].NodeID + "_Node"]);
                    }

                    return arr;
                },
                OnSelect: function () {
                    var index = that.Objects.NodeAutoSuggest.selectedIndex;
                    var _idtype = that.Objects.NodeAutoSuggest.values[index].split("_");
                    _onObjectSelect({ ID: _idtype[0], Type: _idtype[1], Value: that.Objects.NodeAutoSuggest.keywords[index] });
                }
            });

            var _users_data_source = function () {
                return _el["friendsCheckBox"].Checked ? UsersAPI.GetFriends({ UserID: window.CurrentUserID }) :
                    UsersAPI.GetUsersDataSource();
            };

            that.Objects.UserAutoSuggest = GlobalUtilities.append_autosuggest(_el["usersAutoSuggestContainer"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem; padding:0.1rem 0.3rem;",
                InnerTitle: RVDic.Select + "...",
                AjaxDataSource: _users_data_source(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Users || JSON.parse(responseText).Friends || [];
                    var arr = [];

                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].FirstName || "") + " " + Base64.decode(items[i].LastName || "");
                        arr.push([tt, items[i].UserID + "_User"]);
                    }

                    return arr;
                },
                OnSelect: function () {
                    var index = that.Objects.UserAutoSuggest.selectedIndex;
                    var _idtype = that.Objects.UserAutoSuggest.values[index].split("_");
                    _onObjectSelect({ ID: _idtype[0], Type: _idtype[1], Value: that.Objects.UserAutoSuggest.keywords[index] });
                }
            });

            var _bindUserAutoSuggest = function () {
                that.Objects.UserAutoSuggest.bindURL(_users_data_source());
            };

            var _onObjectSelect = function (tag) {
                that.Objects.NodeAutoSuggest.InputElement.value = "";
                that.Objects.UserAutoSuggest.InputElement.value = "";
                if (that.Objects.OnSelect) that.Objects.OnSelect(tag);
            }

            //Item Select Area
            var nodeSelectObject = null, userSelectObject = null;

            var _nodeSelect = function () {
                if (that.__NodeListContainer) {
                    that.__ShowedNodeList = GlobalUtilities.show(that.__NodeListContainer);
                    return;
                }

                var _div = that.__NodeListContainer = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                that.__ShowedNodeList = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);
                
                GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                    OnLoad: function () {
                        nodeSelectObject = new NodeSelect(_div, {
                            Options: {
                                Title: RVDic.NodeSelect,
                                NodeTypeSearchBox: true, TreeCheckbox: false, HideSelectedItems: true, Filters: true,
                                OnSelect: function (nd) {
                                    that.__ShowedNodeList.Close();
                                    _onObjectSelect({ ID: nd.NodeID, Type: "Node", Value: nd.Name });
                                }
                            }
                        });
                    }
                });
            }

            var _userSelect = function () {
                if (that.__UserListContainer) {
                    that.__ShowedUserList = GlobalUtilities.show(that.__UserListContainer);
                    return;
                }

                var _div = that.__UserListContainer = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                that.__ShowedUserList = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);

                GlobalUtilities.load_files(["USR/UserSelect.js"], {
                    OnLoad: function () {
                        userSelectObject = new UserSelect(_div, {
                            Options: {
                                HideSelectedItems: true,
                                OnSelect: function (user) {
                                    that.__ShowedUserList.Close();
                                    _onObjectSelect({ ID: user.UserID, Type: "User", Value: user.FullName });
                                }
                            }
                        });
                    }
                });
            }
            //end of Item Select Area
        }
    }
})();