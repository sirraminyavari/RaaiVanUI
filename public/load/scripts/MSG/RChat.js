(function () {
    if (window.RChat) return;
    
    window.RChat = function (params) {
        params = params || {};
        
        var aud = GlobalUtilities.create_nested_elements([
            {
                Type: "audio", Name: "aud",
                Properties: [{ Name: "PlayAudio", Value: function () { jQuery(this)[0].play(); } }],
                Childs: [
                    {
                        Type: "source",
                        Attributes: [{ Name: "src", Value: "../../Audio/notify.ogg" }, { Name: "type", Value: "audio/ogg" }]
                    },
                    {
                        Type: "source",
                        Attributes: [{ Name: "src", Value: "../../Audio/notify.mp3" }, { Name: "type", Value: "audio/mpeg" }]
                    },
                    {
                        Type: "source",
                        Attributes: [{ Name: "src", Value: "../../Audio/notify.wav" }, { Name: "type", Value: "audio/wav" }]
                    }
                ]
            }
        ], document.body)["aud"];
        
        this.Interface = {
            ChatsArea: null,
            OnlineUsers: null,
            NoOnlineUser: null,
            ChatWindows: {},
            TitleArea: null
        }
        
        this.Objects = {
            CurrentUser: { UserID: ((window.RVGlobal || {}).CurrentUser || {}).UserID },
            OnlineUsers: {},
            ChatWindows: {},
            Audio: aud
        }

        this.Options = {
            Count: 10
        }

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["UsersAPI", "MessagingAPI"] }], {
            OnLoad: function () {
                GlobalUtilities.get_side_panel(function (panel) {
                    that.Interface.ChatsArea = panel;
                    that._initialize();
                });
            }
        });
    }

    RChat.prototype = {
        _decode_user: function (user) {
            user.UserName = Base64.decode(user.UserName);
            user.FirstName = Base64.decode(user.FirstName);
            user.LastName = Base64.decode(user.LastName);

            return user;
        },

        _initialize: function () {
            var that = this;

            var hasChatsPanel = RVAPI.IsHomePage() && that.Interface.ChatsArea;

            var container = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "flex:0 0 auto; padding-" + RV_Float + ":1rem; width:17rem;", 
                Childs: [{
                    Type: "div", Style: "display:flex; flex-flow:column; height:100%;",
                    Childs: [
                        { Type: "div", Style: "flex:1 1 auto;" },
                        { Type: "div", Style: "flex:0 0 auto;", Name: "container" }
                    ]
                }]
            }], that.Interface.ChatsArea)["container"];

            var elems = !hasChatsPanel ? null : GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "rv-border-radius-quarter rv-ignore-bottom-radius",
                Childs: [
                    {
                        Type: "div", Name: "usersArea", Style: "overflow:auto; background-color:white;",
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter SurroundingShadow",
                        Childs: [
                            {
                                Type: "div", Name: "onlineUsers", Style: "padding:0.5rem; display:none;",
                                Class: "small-12 medium-12 large-12 rv-trim-vertical-margins"
                            },
                            {
                                Type: "div", Name: "searchUsers", Style: "padding:0.5rem; display:none;",
                                Class: "small-12 medium-12 large-12 rv-trim-vertical-margins"
                            }
                        ]
                    },
                    {
                        Type: "div",
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-ignore-bottom-radius WarmBackgroundColor",
                        Style: "color:white; padding:0.3rem 0.5rem; position:relative; padding-" + RV_RevFloat + ":2.5rem;",
                        Childs: [
                            {
                                Type: "div", Class: "RevTextAlign",
                                Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.5rem; width:2rem;",
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-search", Style: "cursor:pointer;",
                                        Name: "searchButton", Tooltip: RVDic.SearchUsers,
                                        Attributes: [{ Name: "aria-hidden", Value: true }],
                                        Properties: [{
                                            Name: "onclick",
                                            Value: function () {
                                                jQuery(elems["searchButton"]).fadeOut(function () { jQuery(elems["closeButton"]).fadeIn(); });

                                                jQuery(elems["titleContainer"]).fadeOut(function () {
                                                    jQuery(elems["inputContainer"]).fadeIn(function () { jQuery(elems["searchInput"]).focus(); });
                                                });

                                                jQuery(that.Interface.OnlineUsers).fadeOut();
                                            }
                                        }]
                                    },
                                    {
                                        Type: "i", Class: "fa fa-close", Style: "cursor:pointer; display:none;",
                                        Name: "closeButton", Tooltip: RVDic.SearchUsers,
                                        Attributes: [{ Name: "aria-hidden", Value: true }],
                                        Properties: [{
                                            Name: "onclick",
                                            Value: function () {
                                                jQuery(elems["closeButton"]).fadeOut(function () { jQuery(elems["searchButton"]).fadeIn(); });
                                                jQuery(elems["inputContainer"]).fadeOut(function () { jQuery(elems["titleContainer"]).fadeIn(); });

                                                elems["searchInput"].value = "";
                                                _do_search();
                                            }
                                        }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Style: "height:1.6rem;",
                                Childs: [{
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12", Name: "titleContainer", Style: "height:100%;",
                                            Childs: [{
                                                Type: "div", Name: "titleArea", Style: "padding:0 0.5rem; position:relative;",
                                                Childs: [{ Type: "text", TextValue: RVDic.OnlineFriends || "Online Friends" }]
                                            }]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12", Name: "inputContainer", Style: "display:none;",
                                            Childs: [{
                                                Type: "input", Class: "rv-input", Name: "searchInput", InnerTitle: RVDic.SearchUsers,
                                                Style: "width:100%; font-size:0.6rem; border-width:0;"
                                            }]
                                        }
                                    ]
                                }]
                            }
                        ]
                    }
                ]
            }], container);

            that.Interface.TitleArea = (elems || {})["titleArea"];
            that.Interface.OnlineUsers = (elems || {})["onlineUsers"];

            that.Interface.ChatWindows = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "chatBox",
                Style: "flex:0 0 auto; margin-" + RV_Float + ":0.5rem; z-index:" + GlobalUtilities.zindex.dialog() + ";"
            }], that.Interface.ChatsArea)["chatBox"];
            
            if (elems) {
                //append scrollbar
                elems["usersArea"].style.maxHeight = "200px";

                elems["usersArea"] = GlobalUtilities.append_scrollbar(elems["usersArea"], {
                    GetHeight: function () {
                        return parseInt(jQuery(elems["usersArea"])["0"].scrollHeight || "0");
                    },
                    Done: function (p) {
                        //GlobalUtilities.onscrollend(p.Scrollee, null, function () { });
                    }
                });
                //end of append scrollbar

                var _do_search = function () {
                    var searchText = elems["searchInput"].value;

                    if (!searchText)
                        jQuery(elems["searchUsers"]).fadeOut();
                    else {
                        jQuery(elems["onlineUsers"]).fadeOut(function () { jQuery(elems["searchUsers"]).fadeIn(); });

                        elems["searchUsers"].innerHTML = "";
                        GlobalUtilities.loading(elems["searchUsers"]);

                        UsersAPI.GetUsers({
                            SearchText: Base64.encode(searchText), ParseResults: true,
                            ResponseHandler: function (d) {
                                var users = d.Users || [];

                                elems["searchUsers"].innerHTML = "";

                                users.forEach(function (usr) {
                                    that.add_user(elems["searchUsers"], that._decode_user(usr), true);
                                });

                                if (users.length == 0) elems["searchUsers"].innerHTML =
                                    "<div style='text-align:center;'>" + RVDic.NoUserFound + "</div>";
                            }
                        });
                    }
                };

                GlobalUtilities.set_onchangeorenter(elems["searchInput"], _do_search);

                GlobalUtilities.loading(elems["onlineUsers"]);
            }

            var mainTitle = null;

            var listeners = [];

            if (elems) {
                listeners.push({
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "IsOnline",
                    Func: function (user) {
                        setTimeout(function () {
                            that.add_user(that.Interface.OnlineUsers, that._decode_user(user));
                        }, 2000);
                    }
                });

                listeners.push({
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "WentOffline",
                    Func: function (user) {
                        if (that.Objects.OnlineUsers[user.UserID]) that.Objects.OnlineUsers[user.UserID].destroy(user);
                    }
                });
            }

            listeners.push({
                UniqueID: GlobalUtilities.generate_new_guid(),
                Name: "NewMessage",
                Func: function (d) {
                    if ((((d || {}).Message || {}).IsGroup !== false) || (((d || {}).Message || {}).Ref != "Chat")) return;

                    var message = Base64.decode(d.Message.MessageText);
                    var threadId = d.Message.ThreadID;
                    var groupId = d.Message.GroupID;
                    
                    var sender = that._decode_user({
                        UserID: d.Message.SenderUserID,
                        UserName: d.Message.SenderUserName,
                        FirstName: d.Message.SenderFirstName,
                        LastName: d.Message.SenderLastName,
                        ImageURL: d.Message.ProfileImageURL
                    });

                    var selfChat = d.Message.SelfChat === true;
                    var isSender = !selfChat && sender.UserID == that.Objects.CurrentUser.UserID;

                    var receiver = selfChat || !isSender || (d.Thread || {}).IsGroup ||
                        (((d.Thread || {}).Users || []).length != 1) ? null : d.Thread.Users[0];
                    if (receiver) receiver.ImageURL = receiver.ImageURL || receiver.ProfileImageURL;

                    var messageId = d.Message.ID;
                    var receiverMessageId = d.Message.ReceiverID;

                    if ((that.Objects.Audio || {}).PlayAudio && !window.HasFocus) {
                        mainTitle = mainTitle || document.title;

                        document.title = RVDic.NewMessage + "!";

                        var xx = setInterval(function () {
                            if (!window.HasFocus) return;
                            clearInterval(xx);
                            document.title = mainTitle;
                        }, 50);

                        that.Objects.Audio.PlayAudio();
                    }

                    //Create chat window if does'nt exist
                    that.chat_window(groupId, threadId, receiver || sender, { HasNewMessage: true });
                    
                    if (selfChat) that.Objects.ChatWindows[groupId].new_message(sender, true, message, null, messageId);
                    
                    if ((that.Objects.ChatWindows[groupId] || {}).new_message)
                        if (that.Objects.ChatWindows[groupId].new_message(sender, isSender, message, null, receiverMessageId) === false) return;

                    if (!selfChat) {
                        that.Objects.ChatWindows[groupId].HasNotSeenMessage = true;
                        that.Objects.ChatWindows[groupId].set_as_seen();
                    }
                }
            });

            listeners.push({
                UniqueID: GlobalUtilities.generate_new_guid(),
                Name: "ChatWindow",
                Func: function (d) {
                    that.chat_window(d.GroupID || "", null, that._decode_user(d.User || {}));
                }
            });

            listeners.push({
                UniqueID: GlobalUtilities.generate_new_guid(),
                Name: "NewChatMember",
                Func: function (d) {
                    that.Objects.ChatWindows[d.GroupID || ""].new_user(d.Data || {});
                }
            });

            listeners.push({
                UniqueID: GlobalUtilities.generate_new_guid(),
                Name: "IsTyping",
                Func: function (d) {
                    if (d.GroupID && that.Objects.ChatWindows[d.GroupID])
                        that.Objects.ChatWindows[d.GroupID].is_typing(that._decode_user(d.User || {}));
                }
            });

            listeners.push({
                UniqueID: GlobalUtilities.generate_new_guid(),
                Name: "IsNotTyping",
                Func: function (d) {
                    if (d.GroupID && that.Objects.ChatWindows[d.GroupID])
                        that.Objects.ChatWindows[d.GroupID].is_not_typing();
                }
            });
            
            RaaiVanHub.add_listeners(listeners, function () {
                if (!elems) return;

                UsersAPI.GetFriends({
                    Count: 1000, Online: true, ParseResults: true,
                    ResponseHandler: function (d) {
                        var users = d.Friends || [];
                        
                        that.Interface.OnlineUsers.innerHTML = "";

                        users.forEach(function (usr) {
                            that.add_user(that.Interface.OnlineUsers, that._decode_user(usr));
                        });

                        that.set_no_online_user();
                    }
                });
            });
        },

        set_no_online_user: function () {
            var that = this;

            if (!that.Interface.TitleArea) return;
            
            var onlineUsers = [];
            for (var id in that.Objects.OnlineUsers)
                if (that.Objects.OnlineUsers[id]) onlineUsers.push(that.Objects.OnlineUsers[id].User);

            jQuery(that.Interface.TitleArea).fadeOut(200, function () {
                var hasOnlineUser = !!onlineUsers.length;
                that.Interface.TitleArea.innerHTML = hasOnlineUser ? RVDic.OnlineFriends || "Online Friends" : "";

                if (!hasOnlineUser) {
                    that.Interface.TitleArea.style.cursor = "default";
                    that.Interface.TitleArea.onclick = null;

                    GlobalUtilities.append_markup_text(that.Interface.TitleArea, RVDic.NoOnlineFriend + " ((sad))");
                }
                else {
                    that.Interface.TitleArea.style.cursor = "pointer";
                    that.Interface.TitleArea.onclick = function () {
                        jQuery(that.Interface.OnlineUsers)[that.Interface.OnlineUsers.style.display == "none" ? "fadeIn" : "fadeOut"]();
                    };

                    var imgSize = 1.2;
                    var overSize = 0.5;
                    var showedCount = Math.min(3, onlineUsers.length);
                    var ttlMargin = (showedCount * (imgSize - overSize)) + overSize + 0.5;

                    onlineUsers.slice(0, showedCount).forEach(function (usr, index) {
                        var left = (index * imgSize) - (index * overSize);

                        GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "rv-hover-zindex",
                            Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":" + (left || "0") + "rem;",
                            Childs: [{
                                Type: "middle", Childs: [{
                                    Type: "img", Class: "rv-circle",
                                    Style: "width:" + imgSize + "rem; height:" + imgSize + "rem;",
                                    Attributes: [{ Name: "src", Value: usr.ImageURL || usr.ProfileImageURL }]
                                }]
                            }]
                        }], that.Interface.TitleArea);
                    });

                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "Direction TextAlign",
                        Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":" + (ttlMargin || "0") + "rem; font-size:0.7rem;",
                        Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RVDic.NPeople.replace("[n]", onlineUsers.length) }] }]
                    }], that.Interface.TitleArea);
                }

                jQuery(that.Interface.TitleArea).fadeIn(400);
            });
        },

        add_user: function (container, user, isSearchUser) {
            var that = this;

            if (!that.Interface.OnlineUsers) return;

            if (!isSearchUser) {
                if (that.Objects.OnlineUsers[user.UserID]) return;
                that.Objects.OnlineUsers[user.UserID] = { User: user };
            }
            
            var fullname = Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName);

            var profileImageUrl = user.ImageURL || user.ProfileImageURL || "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftShadow " +
                        (isSearchUser && user.IsOnline ? "rv-bg-color-softer-soft" : "rv-bg-color-white-softer"),
                    Style: "cursor:pointer; margin-top:0.5rem; padding:0.3rem; position:relative;" +
                        "padding-" + RV_Float + ":3rem; min-height:2.6rem;",
                    Properties: [{ Name: "onclick", Value: function () { RaaiVanHub.send_data("newchat", { UserID: user.UserID }); } }],
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-quarter", Style: "width:2rem; height:2rem;",
                                    Attributes: [{ Name: "src", Value: profileImageUrl }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 TextAlign", Style: "cursor: pointer;",
                            Childs: [{ Type: "text", TextValue: fullname }]
                        }
                    ]
                }
            ], container);

            if (!isSearchUser) {
                that.Objects.OnlineUsers[user.UserID].destroy = function (usr) {
                    that.Objects.OnlineUsers[usr.UserID] = null;

                    jQuery(elems["container"]).fadeOut(function () {
                        elems["container"].parentNode.removeChild(elems["container"]);
                        that.set_no_online_user();
                    });
                }

                that.set_no_online_user();
            }
        },

        emoticons_list: function (container, onclick) {
            var that = this;

            var add = function (emoticon) {
                var url = GlobalUtilities.icon("Emoticons/" + (RVEmoticons[emoticon] || {}).Name + ".png");

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "img", Style: "width:1rem; height:1rem; cursor:pointer; margin:0.2rem;",
                        Attributes: [{ Name: "src", Value: url }],
                        Properties: [{ Name: "onclick", Value: function () { onclick(emoticon); } }]
                    }
                ], container);
            }

            var dic = {};
            for (em in (window.RVEmoticons || {})) {
                if (dic[(RVEmoticons[em] || {}).Name]) continue;
                dic[(RVEmoticons[em] || {}).Name] = true;

                add(em);
            }
        },

        chat_window: function (groupId, threadId, user, params) {
            var that = this;
            
            if (that.Objects.ChatWindows[groupId]) return that.Objects.ChatWindows[groupId].show((params || {}).HasNewMessage);
            
            var fullname = Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName);
            var trimedFullname = GlobalUtilities.trim2pix(fullname, 130, { Postfix: "..." });

            var profileImageUrl = user.ImageURL || user.ProfileImageURL || "";

            threadId = !threadId || (threadId == (window.RVGlobal || {}).CurrentUserID) ? user.UserID : threadId;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-quarter SoftBorder", Name: "container",
                    Style: "display:inline-block; width:14rem; margin:0 0.4rem; position:relative; background-color:white;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 WarmBackgroundColor",
                            Style: "padding:0.3rem; color: white;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter", Style: "width:1.6rem; height:1.6rem;",
                                            Attributes: [{ Name: "src", Value: profileImageUrl }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Tooltip: trimedFullname == fullname ? null : fullname,
                                    Style: "display:inline-block; cursor:pointer; margin:0rem 0.6rem; color:white;",
                                    Link: UsersAPI.UserPageURL({ UserID: user.UserID }),
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.color = "rgb(200,200,200)"; } },
                                        { Name: "onmouseout", Value: function () { this.style.color = "white"; } }
                                    ],
                                    Childs: [{ Type: "text", TextValue: trimedFullname }]
                                },
                                {
                                    Type: "div", Class: "RevFloat", Style: "display:inline-block; color:white;",
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.color = "red"; } },
                                        { Name: "onmouseout", Value: function () { this.style.color = "white"; } }
                                    ],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-close",
                                            Style: "cursor: pointer;", Tooltip: RVDic.Close,
                                            Properties: [{ Name: "onclick", Value: function () { jQuery(elems["container"]).fadeOut(); } }]
                                        }
                                    ]
                                },
                                { Type: "div", Style: "clear:both;" },
                                {
                                    Type: "i", Class: "fa fa-user-plus",
                                    Style: "cursor: pointer; margin-" + window.RV_RevFloat + ": 7px; display:none;",
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                jQuery(elems["inviteUserBox"]).fadeIn();
                                                jQuery(elems["newUserInput"]).focus();
                                            }
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "inviteUserBox",
                                    Style: "background: #069; text-align: center; display: none;" +
                                        "margin-top: 7px; position: relative;",
                                    Childs: [
                                        {
                                            Type: "input", Name: "newUserInput",
                                            Style: "width: 169px; padding: 4px;", InnerTitle: "Enter a username...",
                                            Attributes: [{ Name: "type", Value: "text" }]
                                        },
                                        {
                                            Type: "i", Class: "fa fa-close",
                                            Style: "position: absolute; " + window.RV_Float +
                                                ": 4px; top: 5px; cursor: pointer;",
                                            Properties: [{ Name: "onclick", Value: function () { jQuery(this).parent().fadeOut(); } }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 SoftBorder",
                            Style: "color:black; min-height:200px; border-width:0rem 0rem 0.1rem 0rem; position:relative;",
                            Childs: [
                                {
                                    Type: "div", Name: "chatsArea",
                                    Style: "height:200px; clear:both; overflow-x: hidden; overflow-y:auto;"
                                },
                                {
                                    Type: "div", Class: "rv-border-radius-quarter", Name: "typingStatus",
                                    Style: "display:none; padding:0.3rem; position:absolute; bottom:0rem; font-size:0.6rem;" +
                                        "color:rgb(100, 100, 100); background-color:rgb(240, 240, 240);" + RV_RevFloat + ":0rem;"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding:0.4rem; padding-" + RV_RevFloat + ":1.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-send rv-icon-button",
                                    Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.3rem;",
                                    Properties: [{ Name: "onclick", Value: function () { send_text(); } }]
                                },
                                {
                                    Type: "i", Class: "fa fa-smile-o rv-icon-button",
                                    Style: "position:absolute; top:0.65rem;" + RV_RevFloat + ":1.8rem;",
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                if (elems["emoticonsList"].style.display == "none") jQuery(elems["emoticonsList"]).fadeIn();
                                                else jQuery(elems["emoticonsList"]).fadeOut();
                                            }
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "SoftBorder", Name: "emoticonsList",
                                    Style: "position:absolute; padding:0.3rem; top:-5rem; height:5rem; overflow:auto; " +
                                        RV_Float + ":0rem; background-color:white; display:none; z-index:" + GlobalUtilities.zindex.dialog() + ";"
                                },
                                {
                                    Type: "textarea", Class: "rv-input", Name: "textInput",
                                    Style: "width:100%; height:1.5rem; resize:none; font-size:0.6rem;" +
                                        "padding-" + RV_RevFloat + ":1.3rem; overflow:hidden;"
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.ChatWindows);

            //append scrollbar
            elems["chatsArea"] = GlobalUtilities.append_scrollbar(elems["chatsArea"], {
                Done: function (p) {
                    setTimeout(function () {
                        elems["chatsArea"].Scrollee = p.Scrollee;

                        GlobalUtilities.onscrollend(p.Scrollee, { Top: true }, function () {
                            that.show_old_messages(elems["chatsArea"], groupId, threadId);
                        });
                    }, 100);
                }
            });
            //end of append scrollbar

            jQuery(elems["textInput"]).focus(function () { set_as_seen(); });

            var chatWindow = that.Objects.ChatWindows[groupId] = elems["container"];

            chatWindow.Info = {
                MemberIDs: [user.UserID], IsGroup: false
            }

            var set_as_seen = that.Objects.ChatWindows[groupId].set_as_seen = function () {
                if (!that.Objects.ChatWindows[groupId].HasNotSeenMessage || !(document.activeElement == elems["textInput"])) return;
                that.Objects.ChatWindows[groupId].HasNotSeenMessage = false;

                MessagingAPI.SetMessagesAsSeen({ ThreadID: threadId });
            }

            that.Objects.ChatWindows[groupId].show = function (hasNewMessage) {
                if (hasNewMessage === true && GlobalUtilities.is_visible(elems["container"])) return;

                jQuery(elems["container"]).show();
                jQuery(elems["textInput"]).focus();
            }

            that.Objects.ChatWindows[groupId].new_message = function (sender, isSender, message, add2Top, messageId) {
                that.Objects.ChatWindows[groupId].Messages = that.Objects.ChatWindows[groupId].Messages || {};
                if (that.Objects.ChatWindows[groupId].Messages[messageId]) return false;
                that.Objects.ChatWindows[groupId].Messages[messageId] = true;

                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: isSender ? "" : "RevDirection RevTextAlign",
                        Style: "padding:0.3rem;", Name: "container",
                        Childs: [
                            {
                                Type: "div",
                                Style: "display:inline-block; margin-" + (isSender ? RV_RevFloat : RV_Float) + ":0.1rem;",
                                Childs: [
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter", Style: "width:1.5rem; height:1.5rem;",
                                        Tooltip: isSender ? null : sender.FirstName + " " + sender.LastName,
                                        Attributes: [{ Name: "src", Value: sender.ProfileImageURL || sender.ImageURL }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Name: "_msg",
                                Class: "rv-border-radius-quarter TextDirection  " + (isSender ? "SoftBackgroundColor" : "SoftBorder"),
                                Style: "display:inline-block; width:10rem; font-size:0.7rem; padding:0.3rem;" +
                                    "direction:" + GlobalUtilities.textdirection(message)
                            }
                        ]
                    }
                ], elems["chatsArea"]);

                GlobalUtilities.append_markup_text(_el["_msg"], message, { RichText: new RegExp("<.*?>", "g").test(message) });

                if (add2Top) elems["chatsArea"].insertBefore(_el["container"], elems["chatsArea"].firstChild);
                else if (elems["chatsArea"].Scrollee) GlobalUtilities.scroll(elems["chatsArea"].Scrollee);
            }

            that.Objects.ChatWindows[groupId].new_user = function (user) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "padding: 4px; background: #eee; color: black; font-size: small; margin: 7px 0;",
                        Childs: [{ Type: "text", TextValue: JSON.stringify(user) }]
                    }
                ], elems["chatsArea"]);
                
                if (elems["chatsArea"].Scrollee)
                    jQuery(elems["chatsArea"].Scrollee).animate({ scrollTop: jQuery(elems["chatsArea"].Scrollee)[0].scrollHeight }, 100);
            }

            that.Objects.ChatWindows[groupId].is_typing = function (u) {
                elems["typingStatus"].style.display = "block";
                elems["typingStatus"].innerHTML = RVDic.IsTyping + "...";
                //elems["typingStatus"].innerHTML = RVDic.NIsTyping.replace("[n]", u.FirstName + " " + u.LastName) + "...";
            };

            that.Objects.ChatWindows[groupId].is_not_typing = function () {
                elems["typingStatus"].style.display = "none";
            };
            
            that.emoticons_list(elems["emoticonsList"], function (emoticon) {
                elems["textInput"].value = elems["textInput"].value + " " + emoticon;
                jQuery(elems["textInput"]).focus();
            });

            var isTyping = false;
            var typingTimeout = null;

            var send_text = function () {
                var text = GlobalUtilities.trim(elems["textInput"].value);
                if (!text) return;

                if (elems["emoticonsList"].style.display != "none") jQuery(elems["emoticonsList"]).fadeOut();

                isTyping = false;
                
                MessagingAPI.SendMessage({
                    ReceiverUserIDs: threadId, MessageText: Base64.encode(text),
                    IsGroup: false, GroupID: groupId, Ref: "Chat", ParseResults: true,
                    ResponseHandler: function (d) { }
                });

                elems["textInput"].value = "";

                RaaiVanHub.send_data("IsNotTyping", { GroupID: groupId });
            }

            jQuery(elems["textInput"]).focus();
            
            jQuery(elems["textInput"]).keydown(function (event) {
                elems["textInput"].style.direction = GlobalUtilities.textdirection(elems["textInput"].value) || '';

                var newIsTyping = !!GlobalUtilities.trim(elems["textInput"].value);

                if (event.keyCode == 13 && newIsTyping) {
                    event.stopPropagation();
                    send_text();
                }
                else if (newIsTyping == isTyping) return;
                else if (isTyping = newIsTyping) RaaiVanHub.send_data("IsTyping", { GroupID: groupId });
                else RaaiVanHub.send_data("IsNotTyping", { GroupID: groupId });
            });

            jQuery(elems["newUserInput"]).keyup(function (event) {
                if (event.keyCode == 13 && jQuery(this).val() != "") {
                    RaaiVanHub.send_data("NewChatMember", { GroupID: groupId, UserID: elems["newUserInput"].value });
                    
                    jQuery(this).parent().fadeOut();
                    jQuery(this).val("");
                }
            });

            var x = setInterval(function () {
                if (elems["chatsArea"].Scrollee) {
                    clearInterval(x);
                    that.show_old_messages(elems["chatsArea"], groupId, threadId);
                }
            }, 100);
        },

        show_old_messages: function (container, groupId, userId) {
            var that = this;

            var groupObj = that.Objects.ChatWindows[groupId];

            if (groupObj._NoMore || groupObj._Processing) return;
            groupObj._Processing = true;

            MessagingAPI.GetMessages({
                ThreadID: userId, MinID: groupObj.MinID, Count: that.Options.Count,
                ParseResults: true,
                ResponseHandler: function (result) {
                    groupObj._Processing = false;

                    groupObj.MinID = result.MinID;

                    if ((result.Messages || []).length < that.Options.Count) {
                        groupObj._NoMore = true;
                    }

                    var curTotalHeight = GlobalUtilities.total_height(container.Scrollee || container);
                    var curScrollTop = GlobalUtilities.scrolltop(container.Scrollee || container);

                    for (var i = (result.Messages || []).length - 1; i >= 0; --i) {
                        var msg = result.Messages[i];

                        var sender = {
                            UserID: msg.SenderUserID,
                            UserName: msg.SenderUserName,
                            FirstName: msg.SenderFirstName,
                            LastName: msg.SenderLastName,
                            ProfileImageURL: msg.ProfileImageURL
                        }

                        groupObj.new_message(that._decode_user(sender), msg.IsSender,
                            Base64.decode(msg.MessageText), true, msg.ID);
                    }

                    setTimeout(function () {
                        var scrollTop = curScrollTop + GlobalUtilities.total_height(container) - curTotalHeight;
                        GlobalUtilities.scrolltop(container.Scrollee || container, scrollTop);
                    }, 10);

                    for (var i = 0, lnt = result.Messages.length; i < lnt; i++) {
                        if (!result.Messages[i].Seen) { that.Objects.ChatWindows[groupId].HasNotSeenMessage = true; break; }
                    }

                    that.Objects.ChatWindows[groupId].set_as_seen();
                }
            });
        }
    }
})();