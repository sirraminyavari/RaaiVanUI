(function () {
    if (window.UsersManager) return;

    window.UsersManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            UserNames: {}
        };

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js", "SimpleListViewer/NewSimpleListViewer.js"], {
            OnLoad: function () { that._initialize(); }
        });
    }

    UsersManager.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var searchInputInnerTitle = RVDic.Search + "...";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center; font-weight:bold; margin-bottom:1.5rem;" +
                        "font-size:1.2rem; color:rgb(100,100,100);",
                    Childs: [
                        { Type: "text", TextValue: RVDic.Users },
                        { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_users" } }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-5 large-5", Style: "margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", InnerTitle: searchInputInnerTitle,
                                    Style: "width:100%;;", Name: "userInput"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-2 large-2",
                            Style: "margin-bottom:1rem; padding-top:0.5rem; padding-" + RV_Float + ":1rem;",
                            Childs: [
                                {
                                    Type: "checkbox", Name: "onlineChb",
                                    Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;",
                                    Params: { OnChange: function () { _search(); }}
                                },
                                { Type: "text", TextValue: RVDic.Online },
                                {
                                    Type: "checkbox", Name: "activeChb",
                                    Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;" +
                                        "margin-" + RV_Float + ":1rem;",
                                    Params: { OnChange: function () { _search(); }, Checked: true }
                                },
                                { Type: "text", TextValue: RVDic.Active }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-2 large-2", Name: "countArea",
                            Style: "marign-bottom:1rem; text-align:center; font-weight:bold; padding-top:0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-6 medium-3 large-3", Style: "margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "middle", Class: "small-12 medium-12 large-12 ActionButton",
                                    Style: "font-size:0.7rem; font-weight:bold;",
                                    Properties: [{ Name: "onclick", Value: function () { that.new_user(function () { _search(); }); } }],
                                    Childs: [{ Type: "text", TextValue: "+ " + RVDic.CreateNewUser }]
                                }
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "listArea" }
            ], that.ContainerDiv);

            var get_search_text = function () {
                var searchText = GlobalUtilities.trim(elems["userInput"].value);
                if (searchText == searchInputInnerTitle) searchText = "";
                return searchText;
            };

            var _search = function () {
                nslv.clear();
                nslv.data_request();
            };

            GlobalUtilities.set_onchangeorenter(elems["userInput"], function () { _search(); });

            GlobalUtilities.onscrollend(document, { Offset: 10 }, function () { if (nslv) nslv.data_request(); });

            var nslv = new NewSimpleListViewer(elems["listArea"], {
                Options: {
                    Count: 10,
                    OnDataRequest: function (options, done) {
                        UsersAPI.GetUsers(GlobalUtilities.extend(options || {}, {
                            SearchText: Base64.encode(get_search_text()), LockedStatus: true, ApprovedStatus: true,
                            IsOnline: elems["onlineChb"].checked, IsApproved: elems["activeChb"].checked,  ParseResults: true,
                            ResponseHandler: function (result) {
                                elems["countArea"].innerHTML =
                                    GlobalUtilities.convert_numbers_to_persian(RVDic.NPeople.replace("[n]", result.TotalCount));
                                done(result.Users || []);
                            }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        that.add_user(container, item);
                        params.OnAfterAdd();
                    }
                }
            });
        },

        add_user: function (container, user) {
            var that = this;

            var userPageUrl = UsersAPI.UserPageURL({ UserID: user.UserID });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row rv-border-radius-quarter SoftBorder",
                    Style: "padding:0.3rem; margin:0rem; margin-bottom:0.3rem; position:relative;" +
                        "padding-" + RV_Float + ":3rem; min-height:2.6rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter", Link: userPageUrl,
                                            Style: "width:2rem; height:2rem; cursor:pointer;",
                                            Tooltip: Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName),
                                            Attributes: [{ Name: "src", Value: user.ProfileImageURL || user.ImageURL }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-3 large-3", Style: "padding:0.2rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "div", Name: "fullname", Style: "padding:0.3rem; cursor:pointer;",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-soft"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-3 large-3", Style: "padding:0.2rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "div", Name: "username", Style: "padding:0.3rem;",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-soft"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-4 large-4", Style: "padding:0.2rem;",
                            Childs: [
                                {
                                    Type: "middle", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                                    Childs: [
                                        {
                                            Type: "div", Name: "activeStatus", 
                                            Class: "small-6 medium-6 large-6 rv-border-radius-quarter rv-bg-color-trans-soft",
                                            Style: "text-align:center; padding:0.3rem; cursor:pointer;"
                                        },
                                        {
                                            Type: "div", Name: "lockedStatus",
                                            Class: "small-6 medium-6 large-6 " +
                                                (user.IsLockedOut ? "rv-border-radius-quarter rv-bg-color-trans-soft" : ""),
                                            Style: "text-align:center; padding:0.3rem;" +
                                                (user.IsLockedOut ? "cursor:pointer;" : "")
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-2 large-2",
                            Childs: [
                                {
                                    Type: "middle", Class: "small-12 medium-12 large-12", Name: "passwordReset",
                                    Style: "text-align:center; color:blue; cursor:pointer; font-size:0.7rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.ResetPassword }]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            that.set_fullname(elems["fullname"], user);
            that.set_username(elems["username"], user);
            that.set_active_status(elems["activeStatus"], user);
            that.set_locked_status(elems["lockedStatus"], user);
            that.reset_password(elems["passwordReset"], user);
        },

        set_fullname: function (container, user) {
            var that = this;

            var firstName = Base64.decode(user.FirstName);
            var lastName = Base64.decode(user.LastName);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                    Style: "cursor:pointer;", Tooltip: RVDic.DoubleClickToEdit
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "editArea",
                    Style: "margin:0rem; display:none;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Style: "padding-" + RV_RevFloat + ":0.25rem;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "firstNameInput", InnerTitle: RVDic.FirstName,
                                    Style: "width:100%; font-size:0.6rem;", Tooltip: RVDic.FirstName
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Style: "padding-" + RV_Float + ":0.25rem;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "lastNameInput", InnerTitle: RVDic.LastName,
                                    Style: "width:100%; font-size:0.6rem;", Tooltip: RVDic.LastName
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var firstNameInput = elems["firstNameInput"];
            var lastNameInput = elems["lastNameInput"];

            var _set_data = function () {
                var fullname = GlobalUtilities.trim(firstName + " " + lastName);
                viewArea.style.color = fullname ? "black" : "transparent";
                GlobalUtilities.set_text(viewArea, fullname ? GlobalUtilities.secure_string(fullname) : "__");

                firstNameInput.value = firstName;
                lastNameInput.value = lastName;
            };

            var __Editing = false;

            var _on_edit = function () {
                var set_things = function () {
                    _set_data();
                    jQuery(viewArea)[__Editing ? "fadeOut" : "fadeIn"](0);
                    jQuery(editArea)[__Editing ? "fadeIn" : "fadeOut"](0);
                };

                if (__Editing === true) {
                    var newFirstName = GlobalUtilities.trim(firstNameInput.value);
                    var newLastName = GlobalUtilities.trim(lastNameInput.value);

                    if (!newFirstName || !newLastName) return;

                    GlobalUtilities.block(container);

                    UsersAPI.SetFirstAndLastName({
                        UserID: user.UserID, FirstName: Base64.encode(newFirstName),
                        LastName: Base64.encode(newLastName), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                firstName = newFirstName;
                                lastName = newLastName;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            }; //end of _on_edit

            viewArea.ondblclick = _on_edit;
            GlobalUtilities.set_onenter(firstNameInput, _on_edit);
            GlobalUtilities.set_onenter(lastNameInput, _on_edit);
            _set_data();
        },

        set_username: function (container, user) {
            var that = this;

            var userName = Base64.decode(user.UserName);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                    Style: "cursor:pointer;", Tooltip: RVDic.DoubleClickToEdit
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "userNameInput",
                            Style: "width:100%; font-size:0.6rem;", Tooltip: RVDic.UserName
                        }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var userNameInput = elems["userNameInput"];

            var _set_data = function () {
                GlobalUtilities.set_text(viewArea, GlobalUtilities.convert_numbers_to_persian(GlobalUtilities.secure_string(userName)));
                userNameInput.value = userName;
            };

            var __Editing = false;

            var _on_edit = function () {
                var set_things = function () {
                    _set_data();
                    viewArea.style.display = __Editing ? "none" : "block";
                    editArea.style.display = __Editing ? "block" : "none";
                };

                if (__Editing === true) {
                    var newUserName = GlobalUtilities.trim(userNameInput.value);
                    if (newUserName == "") return;

                    GlobalUtilities.block(container);

                    UsersAPI.SetUserName({
                        UserID: user.UserID, UserName: Base64.encode(newUserName), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                userName = newUserName;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            }; //end of _on_edit

            viewArea.ondblclick = _on_edit;
            GlobalUtilities.set_onenter(userNameInput, _on_edit);
            _set_data();
        },

        set_active_status: function (container, user) {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
            ], container)["_div"];

            var activeStatus, revActiveStatus;

            var detect_active_status = function () {
                activeStatus = user.IsApproved ? RVDic.Active : RVDic.Inactive;
                revActiveStatus = user.IsApproved ? RVDic.Inactive : RVDic.Active;

                _div.innerHTML = GlobalUtilities.secure_string(activeStatus);
                _div.onmouseover = function () {
                    this.innerHTML = revActiveStatus;
                    this.style.color = "blue";
                };
                _div.onmouseout = function () {
                    this.innerHTML = activeStatus;
                    this.style.color = "black";
                };
            };

            detect_active_status();

            var _processing = false;

            _div.onclick = function () {
                if (_processing) return;
                _processing = true;

                var newIsApproved = !user.IsApproved;

                UsersAPI.IsApproved({
                    UserID: user.UserID, IsApproved: newIsApproved, ParseResults: true,
                    ResponseHandler: function (result) {
                        _processing = false;

                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            user.IsApproved = newIsApproved;
                            detect_active_status();
                        }
                    }
                })
            };
        },

        set_locked_status: function (container, user) {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
            ], container)["_div"];

            _div.innerHTML = GlobalUtilities.secure_string(user.IsLockedOut ? RVDic.Locked : "__");
            if (!user.IsLockedOut) container.style.color = "transparent";

            if (!user.IsLockedOut) return;

            _div.onmouseover = function () {
                this.style.color = "blue";
                this.innerHTML = GlobalUtilities.secure_string(RVDic.Unlock);
            };

            _div.onmouseout = function () {
                this.style.color = "black";
                this.innerHTML = GlobalUtilities.secure_string(RVDic.Locked);
            };

            var _unlockProcessing = false;

            _div.onclick = function () {
                if (_unlockProcessing) return;
                _unlockProcessing = true;

                UsersAPI.UnlockUser({
                    UserID: user.UserID, ParseResults: true,
                    ResponseHandler: function (result) {
                        _unlockProcessing = false;
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            container.setAttribute("style", "cursor:default; color:transparent;");
                            container.setAttribute("class", "");
                            container.innerHTML = "";
                            container.onclick = null;
                        }
                    }
                });
            };
        },

        reset_password: function (container, user) {
            var that = this;

            var _processing = false;

            container.onclick = function () {
                if (_processing) return;

                var msg = RVDic.Confirms.DoYouWantToResetPasswordForUserN.replace("[n]",
                    Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName));

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;

                    _processing = true;

                    UsersAPI.SetRandomPassword({
                        UserID: user.UserID, ParseResults: true,
                        ResponseHandler: function (result) {
                            _processing = false;

                            if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (!result.Succeed) return;

                            var _el = GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Name: "container",
                                    Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBorder", 
                                    Style: "margin:0rem auto; background-color:white; padding:1rem;" +
                                        "border-width:0.3rem; border-color:gray;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "font-size:0.7rem; text-align:center;",
                                            Childs: [
                                                {
                                                    Type: "img", Class: "rv-border-radius-quarter",
                                                    Style: "width:1.5rem; height:1.5rem; margin-" + RV_RevFloat + ":0.5rem;",
                                                    Attributes: [{ Name: "src", Value: user.ProfileImageURL || user.ImageURL }]
                                                },
                                                { Type: "text", TextValue: Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName) }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "small-10 medium-10 large-10 rv-border-radius-half",
                                            Style: "margin:1rem auto; padding:0.5rem; text-align:center; background-color:rgb(240,240,240);",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "small-12 medium-12 large-12",
                                                    Style: "font-weight:bold; font-size:0.7rem; margin-bottom:1rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.NewPassword }]
                                                },
                                                {
                                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "direction:ltr;",
                                                    Childs: [
                                                        {
                                                            Type: "text", TextValue: Base64.decode(result.Password),
                                                            ConvertNumbers: false
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "small-10 medium-8 large-8 ActionButton",
                                            Style: "margin:0rem auto; font-weight:bold; font-size:0.7rem;",
                                            Properties: [{ Name: "onclick", Value: function () { showedDiv.Close(); }}],
                                            Childs: [{Type: "text", TextValue: RVDic.Confirm}]
                                        }
                                    ]
                                }
                            ]);

                            var showedDiv = GlobalUtilities.show(_el["container"], { NoBackground: true });
                        }
                    });
                })
            }
        },

        new_user: function (done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor", 
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; margin-bottom:1rem;; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic.CreateNewUser }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:0.5rem; position:relative; padding-" + RV_Float + ":6rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.UserName + ":" }]
                                },
                                {
                                    Type: "input", Class: "rv-input", Name: "usernameInput",
                                    Style: "width:100%; font-size:0.7rem;"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:0.5rem; position:relative; padding-" + RV_Float + ":6rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FirstName + ":" }]
                                },
                                {
                                    Type: "input", Class: "rv-input", Name: "firstnameInput",
                                    Style: "width:100%; font-size:0.7rem;"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:1rem; position:relative; padding-" + RV_Float + ":6rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.LastName + ":" }]
                                },
                                {
                                    Type: "input", Class: "rv-input", Name: "lastnameInput",
                                    Style: "width:100%; font-size:0.7rem;"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-10 mediumm-8 large-6 ActionButton", Name: "confirmButton",
                            Style: "margin:0rem auto; font-size:0.7rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            GlobalUtilities.necessary_input([{ Input: elems["firstnameInput"] }, { Input: elems["lastnameInput"] }]);

            //username check
            var _ucheck = function (result) {
                elems["usernameInput"].style.color = result === true ? "red" : "green";
                elems["usernameInput"].style.backgroundColor = result === true ? "#FCDDFB" : "rgba(160, 251, 160, 0.47)";
            };

            GlobalUtilities.set_onchangeorenter(elems["usernameInput"], function () {
                var uname = GlobalUtilities.trim(elems["usernameInput"].value);

                UsersAPI.CheckUserName({
                    UserName: Base64.encode(uname), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (uname != GlobalUtilities.trim(elems["usernameInput"].value)) return;
                        that.Objects.UserNames[uname] = result;
                        _ucheck(result);
                    }
                });
            }, {
                OnKeyDown: function () {
                    elems["usernameInput"].style.color = "black";
                    elems["usernameInput"].style.backgroundColor = "white";
                    
                    var uname = GlobalUtilities.trim(elems["usernameInput"].value);
                    if (!uname) return true;
                    
                    if (typeof (that.Objects.UserNames[uname]) != "undefined") {
                        _ucheck(that.Objects.UserNames[uname]);
                        return true;
                    }

                    return false;
                }
            });
            //end of username check

            var showedDiv = GlobalUtilities.show(elems["container"]);

            var _processing = false;

            elems["confirmButton"].onclick = function () {
                if (_processing) return;

                var username = GlobalUtilities.trim(elems["usernameInput"].value);
                var firstname = GlobalUtilities.trim(elems["firstnameInput"].value);
                var lastname = GlobalUtilities.trim(elems["lastnameInput"].value);

                if (that.Objects.UserNames[username]) return alert(RVDic.MSG.UserNameAlreadyExists);
                else if (!username || !firstname || !lastname) return alert(RVDic.PleaseFillNecessaryFields);

                _processing = true;

                UsersAPI.CreateUser({
                    UserName: Base64.encode(username), FirstName: Base64.encode(firstname),
                    LastName: Base64.encode(lastname), ParseResults: true,
                    ResponseHandler: function (result) {
                        _processing = false;

                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            showedDiv.Close();
                            done();
                            return alert(RVDic.MSG[result.Succeed] || result.Succeed);
                        }
                    }
                });
            };
        }
    }
})();