(function () {
    if (window.Messaging) return;

    var _color = "red"; //"rgb(220,220,220)"; // GlobalUtilities.get_css_property(".SoftBackgroundColor", "background-color");

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.NotSeenMessage { animation: NSMAnim 5s 1; -webkit-animation: NSMAnim 5s 1; -moz-animation: NSMAnim 5s 1; } ' +
        '@keyframes NSMAnim { 0% { color: ' + _color + '; } 100% { color: black; } } ' +
        '@-webkit-keyframes NSMAnim { 0% { color: ' + _color + '; } 100% { color: black; } } ' +
        '@-moz-keyframes NSMAnim { 0% { color: ' + _color + '; } 100% { color: black; } } ';
    document.getElementsByTagName('head')[0].appendChild(style);

    window.Messaging = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        var that = this;

        that.Interface = {
            NewMessageArea: null,
            MessageArea: null,
            ThreadsArea: null,
            MessageTextAdvInput: null
        }

        that.Objects = {
            LastID: null,
            Threads: {},
            CurrentThread: null
        }

        this.Options = {
            Count: 20,
            ThreadCount: 10,
            Height: Math.max(Math.floor(screen.height / 2.1), 370)
        }

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["MessagingAPI", "UsersAPI", "DocsAPI"] }], {
            OnLoad: function () { that._initialize(); }
        });
    }

    Messaging.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";
            var newMessageObj = null;
            var newMessageDiv = null;
            var showedDiv = null;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "Header",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; font-weight:bold; padding:0rem 0.8rem;" +
                                        "padding-" + RV_RevFloat + ":7rem; padding-bottom:1rem;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "ActionButton", Name: "newMessage",
                                            Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; width:6rem; font-weight:bold;",
                                            Properties: [{ Name: "onclick", Value: function () { that.show_new_message(); } }],
                                            Childs: [{ Type: "text", TextValue: RVDic.NewMessage || "NewMessage" }]
                                        },
                                        { Type: "text", TextValue: RVDic.Messages || "Messages" }
                                    ]
                                },
                                { Type: "hr", Class: "small-12 medium-12 large-12", Style: "margin-top:0px;" }
                            ]
                        },
                        {
                            Type: "div", Name: "COLUMNRIGHT", Class: "small-12 medium-4 large-3",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",  Name: "threadArea",
                                    Style: "height:" + that.Options.Height + "px; overflow-y:auto;",
                                    Childs: [
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "recentThreads" },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12", Name: "moreButton",
                                            Style: "text-align:center; cursor:pointer; color:gray; margin-bottom:0.3rem; font-weight:bold;",
                                            Properties: [{ Name: "onclick", Value: function () { that.get_threads(); } }],
                                            Childs: [{ Type: "text", TextValue: RVDic.More }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Name: "COLUMNLEFT", Class: "small-12 medium-8 large-9",
                            Style: "padding-" + RV_Float + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Name: "sentMessages",
                                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                                    Style: "height:" + that.Options.Height + "px; overflow:auto;" +
                                        "margin-bottom:0.3rem; background-color:white; padding:0.3rem;"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "newMessageArea",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-bottom:0.3rem;", Name: "messageTextAdvInput"
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-bottom:0.3rem;", Name: "attachmentsDiv"
                                        },
                                        {
                                            Type: "div", Name: "sendMessage", Class: "ActionButton RevFloat",
                                            Style: "width:4rem; font-weight:bold;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Send || "Send" }]
                                        },
                                        { Type: "div", Style: "clear:both;" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.NewMessageArea = elems["newMessageArea"];
            that.Interface.MessageArea = elems["sentMessages"];
            that.Interface.ThreadsArea = elems["recentThreads"];
            that.Interface.ThreadsArea.MoreButton = elems["moreButton"];

            GlobalUtilities.onscrollend(elems["threadArea"], null, function () { that.get_threads(); });

            GlobalUtilities.onscrollend(that.Interface.MessageArea, { Top: true }, function () {
                var threadObj = that.Objects.Threads[((that.Objects.CurrentThread || {}).Thread || {}).ThreadID];
                if (!threadObj) return;
                that.show_messages(threadObj.Thread.ThreadID, null, { More: true });
            });

            var messageTextAdvInput = new AdvancedTextArea({
                ContainerDiv: elems["messageTextAdvInput"],
                DefaultText: RVDic["MessageText"] + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            var uploader = null;
            GlobalUtilities.load_files(["API/DocsAPI.js"], {
                OnLoad: function () {
                    var _el = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder", Tooltip: RVDic.UploadFile,
                            Style: "border-style:dashed; margin-bottom:0.6rem; padding:0.3rem;", Name: "uploadArea"
                        }
                    ], elems["attachmentsDiv"]);

                    var _uploadParams = {
                        UploadDataSource: DocsAPI.GetUploadLink(), Removable: true,
                        OnRemove: function (fl, uploadResponse, callback) { callback(); }
                    };
                    GlobalUtilities.uploader(_el["uploadArea"], _uploadParams, function (au) { uploader = au; });
                }
            });

            elems["sendMessage"].onclick = function () {
                if (messageTextAdvInput.get_data() == "")
                    return alert(RVDic.Checks.MessageTextCannotBeEmpty || "MessageTextCannotBeEmpty");

                that.send_message(messageTextAdvInput, uploader);
            };

            that.get_threads();
        },

        select_thread: function (threadId) {
            var curTrdDiv = null;
            if (this.Objects.CurrentThread) curTrdDiv = (this.Objects.CurrentThread || {}).ThreadDiv["mainDiv"];
            var trdDiv = (this.Objects.Threads[threadId] || {}).ThreadDiv["mainDiv"];
            if (curTrdDiv) curTrdDiv.setAttribute("class", curTrdDiv.getAttribute("class").replace("ColdBackgroundColor", "SoftBackgroundColor"));
            if (trdDiv) trdDiv.setAttribute("class", trdDiv.getAttribute("class").replace("SoftBackgroundColor", "ColdBackgroundColor"));
        },

        add_thread: function (container, thread, firstChild) {
            var that = this;
            var threadId = thread.ThreadID;

            if (that.Objects.Threads[threadId]) {
                that.Objects.Threads[threadId].SentCount = thread.SentCount || "0";
                that.Objects.Threads[threadId].ThreadDiv["SentCount"].innerHTML =
                     GlobalUtilities.convert_numbers_to_persian(that.Objects.Threads[threadId].SentCount);

                that.Objects.Threads[threadId].ReceivedCount = thread.MessagesCount - thread.SentCount || "0";
                that.Objects.Threads[threadId].ThreadDiv["ReceivedCount"].innerHTML =
                     GlobalUtilities.convert_numbers_to_persian(that.Objects.Threads[threadId].ReceivedCount);

                that.Objects.Threads[threadId].NotSeen = thread.NotSeen || "0";
                that.Objects.Threads[threadId].ThreadDiv["NotSeen"].innerHTML =
                     GlobalUtilities.convert_numbers_to_persian(that.Objects.Threads[threadId].NotSeen);

                return container.insertBefore(that.Objects.Threads[threadId].ThreadDiv["mainDiv"], container.firstChild);
            }

            var fullname = RVDic.Group || "Group";
            var iconUrl = GlobalUtilities.icon("Group.png");
            var isGroup = thread.IsGroup === true;
            var tooltip = null;

            if (!isGroup) {
                var usr = thread.Users[0];
                fullname = Base64.decode(usr.FirstName || "") + " " + Base64.decode(usr.LastName || "");
                iconUrl = usr.ProfileImageURL;
            }
            else {
                tooltip = "<div>" + RVDic["You"] + " " + RVDic["And"] + "</div>";

                for (var i = 0, lnt = thread.Users.length; i < lnt; i++)
                    tooltip += "<div>" + Base64.decode(thread.Users[i].FirstName) + " " + Base64.decode(thread.Users[i].LastName) + "</div>";

                if (thread.UsersCount > thread.Users.length) {
                    var othersCount = thread.UsersCount - thread.Users.length;
                    tooltip += "<div style='margin-top:4px;'>" + (RVDic.AndNOthers || "and [n] others").replace(
                        "[n]", "<span style='font-weight:bold;'>" + othersCount + "</span>") + "</div>";
                }
            }

            var pageUrl = isGroup ? "" : UsersAPI.UserPageURL({ UserID: threadId });
            var threadName = GlobalUtilities.trim2pix(fullname, 126, { Postfix: "..." });
            tooltip = String(threadName).lastIndexOf("...") >= 0 ? fullname : tooltip;

            var thrdDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBackgroundColor SoftBorder",
                    Style: "padding:0.3rem; margin-bottom:0.3rem; cursor:pointer;", Name: "mainDiv",
                    Properties: [{ Name: "onclick", Value: function () { that.show_messages(threadId); } }],
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_Float + ":2.5rem; padding-" + RV_RevFloat + ":2rem;" +
                                "min-height:2.2rem;",
                            Childs: [
                                {
                                    Type: "div", Name: "picture",
                                    Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter", Tooltip: tooltip,
                                            Style: "width:2rem; height:2rem; cursor:pointer;",
                                            Attributes: [{ Name: "src", Value: iconUrl }],
                                            Properties: [
                                                {
                                                    Name: "onclick",
                                                    Value: function (e) {
                                                        e.stopPropagation();

                                                        if (isGroup) that.show_thread_users(threadId);
                                                        else GlobalUtilities.link_click(e, pageUrl);
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times rv-icon-button",
                                            Name: "deleteButton", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [{ Type: "text", TextValue: threadName }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "Counts",
                            Style: "font-size:0.6rem; color:gray; margin-top:0.3rem;",
                            Childs: [
                                {
                                    Type: "div", Tooltip: (RVDic.Sent || "Sent"),
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;", 
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-upload rv-icon-button", Style: "cursor:default;",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        },
                                        { Type: "div", Style: "display:inline-block; width:1.5rem;", Name: "SentCount" }
                                    ]
                                },
                                {
                                    Type: "div", Tooltip: (RVDic.Received || "Received"),
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-download rv-icon-button", Style: "cursor:default;",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        },
                                        { Type: "div", Style: "display:inline-block; width:1.5rem;", Name: "ReceivedCount" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "RevFloat", Name: "NotSeen", Tooltip: (RVDic.NotSeen || "NotSeen"),
                                    Style: "color:red; font-weight:bold;" + (thread.NotSeenCount > 0 ? "" : "display:none;")
                                },
                                { Type: "div", Style: "Clear:both;" }
                            ]
                        }
                    ]
                }
            ], container);

            var _grayify = function (element) {
                element.onmouseover = function () { this.style.color = "black"; }
                element.onmouseout = function () { this.style.color = "gray"; }
            }

            _grayify(thrdDiv["SentCount"]);
            _grayify(thrdDiv["ReceivedCount"]);

            thrdDiv["SentCount"].innerHTML = GlobalUtilities.convert_numbers_to_persian(thread.SentCount || "0");
            thrdDiv["ReceivedCount"].innerHTML = GlobalUtilities.convert_numbers_to_persian(thread.MessagesCount - (thread.SentCount || "0"));
            thrdDiv["NotSeen"].innerHTML = GlobalUtilities.convert_numbers_to_persian(thread.NotSeenCount || "0");

            that.Objects.Threads[threadId] = {
                Thread: thread, Container: null, ThreadDiv: thrdDiv, MinID: null, CurrentScrollTop: null,
                CurrentTotalHeight: null, ItemsArea: null, MoreButton: null, Processing: false
            };

            if (firstChild) container.insertBefore(that.Objects.Threads[threadId].ThreadDiv["mainDiv"], container.firstChild);

            thrdDiv["deleteButton"].onclick = function (e) {
                e.stopPropagation();

                GlobalUtilities.confirm(RVDic.Confirms.RemoveThread, function (r) {
                    if (!r) return;

                    GlobalUtilities.block(thrdDiv["mainDiv"]);

                    MessagingAPI.RemoveThread({
                        ThreadID: threadId,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);

                            GlobalUtilities.unblock(thrdDiv["mainDiv"]);

                            var threadToDisplay = null;

                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                var otherDiv = GlobalUtilities.get_next_element(thrdDiv["mainDiv"], false);
                                if (!otherDiv) { otherDiv = GlobalUtilities.get_next_element(thrdDiv["mainDiv"], true); }

                                thrdDiv["mainDiv"].parentNode.removeChild(thrdDiv["mainDiv"]);

                                if (that.Objects.CurrentThread.Thread.ThreadID == threadId) {
                                    that.Objects.CurrentThread = null;
                                    that.Interface.MessageArea.innerHTML = "";

                                    if (otherDiv) {
                                        for (var tid in that.Objects.Threads) {
                                            if ((that.Objects.Threads[tid] || {}).ThreadDiv["mainDiv"] == otherDiv) {
                                                threadToDisplay = tid;
                                                break;
                                            }
                                        }
                                    }
                                }

                                that.Objects.Threads[threadId] = null;
                                if (threadToDisplay) that.show_messages(threadToDisplay);
                            }
                        }
                    });
                });
            }
        },

        show_messages: function (threadId, messages, params) {
            params = params || {};
            var that = this;

            if (GlobalUtilities.get_type(messages) == "json") messages = [messages];
            var threadObj = that.Objects.Threads[threadId];
            var container = threadObj.Container;
            var more = params.More === true;

            if (more && !threadObj.MoreButton) return;

            if (that.ProcessingThread) return;
            that.ProcessingThread = true;

            var oldThread = that.Objects.CurrentThread;

            that.select_thread(threadId);

            if (oldThread) {
                oldThread.CurrentScrollTop = GlobalUtilities.scrolltop(that.Interface.MessageArea);
                oldThread.CurrentTotalHeight = GlobalUtilities.total_height(that.Interface.MessageArea);
            }

            if (oldThread != threadObj) that.Interface.MessageArea.innerHTML = "";

            var _add_messages = function (msgs) {
                msgs = msgs || messages || [];

                for (var i = 0, lnt = msgs.length; i < lnt; ++i)
                    that.add_message(threadObj.ItemsArea, msgs[more ? (lnt - i - 1) : i], more);

                that.Objects.CurrentThread = threadObj;

                var tp = threadObj.CurrentScrollTop || {};

                if (more) {
                    setTimeout(function () {
                        var newTotalHeight = GlobalUtilities.total_height(that.Interface.MessageArea);
                        var scrollTop = threadObj.CurrentScrollTop + newTotalHeight - threadObj.CurrentTotalHeight;
                        GlobalUtilities.scrolltop(that.Interface.MessageArea, scrollTop);
                    }, 10);
                }
                else {
                    if (threadObj.CurrentScrollTop == null || messages) GlobalUtilities.scroll(that.Interface.MessageArea);
                    else setTimeout(function () { GlobalUtilities.scrolltop(that.Interface.MessageArea, threadObj.CurrentScrollTop); }, 10);
                }

                if (threadObj.MoreButton) threadObj.MoreButton.innerHTML = RVDic.More;

                that.ProcessingThread = false;
            }

            var _get_messages = function () {
                if (threadObj.MoreButton) {
                    threadObj.MoreButton.innerHTML = "";
                    GlobalUtilities.loading(threadObj.MoreButton);
                }

                MessagingAPI.GetMessages({
                    ThreadID: threadId, MinID: threadObj.MinID, Count: that.Options.Count,
                    ResponseHandler: function (responseText) {
                        var result = JSON.parse(responseText);
                        if (!more) threadObj.ItemsArea.innerHTML = "";
                        threadObj.MinID = result.MinID;

                        if ((result.Messages || []).length < that.Options.Count) {
                            threadObj.MoreButton.parentNode.removeChild(threadObj.MoreButton);
                            threadObj.MoreButton = null;
                        }

                        _add_messages(result.Messages || []);

                        var messageIds = "";
                        var s = 0;

                        for (var i = 0, lnt = result.Messages.length; i < lnt; i++) {
                            if (result.Messages[i].Seen) continue;
                            result.Messages[i].Seen = true;
                            s++;
                            messageIds += (messageIds == "" ? "" : "|") + result.Messages[i].ID;
                        }

                        that.Objects.CurrentThread.Thread.NotSeenCount -= s;
                        that.Objects.CurrentThread.ThreadDiv["NotSeen"].innerHTML = that.Objects.CurrentThread.Thread.NotSeenCount;

                        if (that.Objects.CurrentThread.Thread.NotSeenCount == 0)
                            that.Objects.CurrentThread.ThreadDiv["NotSeen"].style.display = "none";

                        that.Objects.Threads[that.Objects.CurrentThread.Thread.ThreadID] = that.Objects.CurrentThread;

                        if (messageIds) MessagingAPI.SetMessagesAsSeen({ IDs: messageIds, ThreadID: threadId, ResponseHandler: function () { } });
                    }
                });
            }

            if (more) _get_messages();

            if (container) {
                _add_messages();
                return (oldThread == threadObj) ? null : that.Interface.MessageArea.appendChild(container);
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "moreButton",
                            Style: "text-align:center; cursor:pointer; color:gray; margin-bottom:0.3rem; font-weight:bold;",
                            Properties: [{ Name: "onclick", Value: function () { that.show_messages(threadId, null, { More: true }); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.More }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" }
                    ]
                }
            ], that.Interface.MessageArea);

            threadObj.Container = elems["container"];
            threadObj.MoreButton = elems["moreButton"];
            threadObj.ItemsArea = elems["itemsArea"];

            _get_messages();
        },

        add_message: function (container, message, add2Top) {
            var that = this;

            var isSender = message.IsSender === true;
            var seen = message.Seen === true || isSender;

            var float = isSender ? "Float" : "RevFloat";
            var revFloat = isSender === true ? "RevFloat" : "Float";

            var right = isSender ? RV_Float : RV_RevFloat;
            var left = isSender ? RV_RevFloat : RV_Float;

            var fullname = Base64.decode(message.SenderFirstName || "") + " " + Base64.decode(message.SenderLastName || "");

            var pageUrl = UsersAPI.UserPageURL({ UserID: message.SenderUserID });

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "msgDiv", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + (isSender ? RV_Float : RV_RevFloat) + ":2.3rem;" + 
                        "padding-" + (isSender ? RV_RevFloat : RV_Float) + ":8rem; margin-bottom:1rem;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { elems["detailsDiv"].style.display = "block"; } },
                        { Name: "onmouseout", Value: function () { elems["detailsDiv"].style.display = "none"; } }
                    ],
                    Childs: [
                        {
                            Type: "div", Name: "senderPicture",
                            Style: "position:absolute; top:0rem;" + (isSender ? RV_Float : RV_RevFloat) + ":0rem;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-quarter", Tooltip: fullname,
                                    Style: "width:2rem; height:2rem; cursor:pointer;", Link: pageUrl,
                                    Attributes: [{ Name: "src", Value: message.ProfileImageURL }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: isSender ? "" : "RevDirection RevTextAlign", Name: "detailsDiv",
                            Style: "position:absolute; top:0rem;" + (isSender ? RV_RevFloat : RV_Float) + ":0rem;" +
                                "width:8rem; padding:0rem 0.3rem; display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "buttons",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-paper-plane rv-icon-button", Tooltip: RVDic.SendForward,
                                            Style: "margin-" + (isSender ? RV_RevFloat: RV_Float) + ":1rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.show_new_message(message); } }]
                                        },
                                        {
                                            Type: "i", Class: "fa fa-times rv-icon-button",
                                            Tooltip: RVDic.Remove, Name: "deleteButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.show_new_message(message); } }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "Direction TextAlign", Style: "display:inline-block; font-size:0.6rem;",
                                    Childs: [{ Type: "text", TextValue: message.SendDate }]
                                }
                            ]
                        },
                        {
                            Type: "div", Name: "msgContent",
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter " +
                                (isSender ? "SoftBorder" : "SoftBackgroundColor"),
                            Style: "font-size:0.8rem; padding:0.3rem; min-height:2.5rem; overflow:hidden; position:relative;" +
                                (!message.ForwardedFrom ? "" : ("padding-" + (isSender ? RV_RevFloat : RV_Float) + ":1.5rem;")),
                            Childs: [
                                {
                                    Type: "div", Name: "fwdButton",
                                    Style: "position:absolute; top:0.3rem;" + (isSender ? RV_RevFloat : RV_Float) + ":0.3rem;" +
                                        (message.ForwardedFrom ? "" : "display:none;"),
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-share rv-icon-button", Tooltip: RVDic.SendForwardList,
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { that.show_forwarded_messages(message.MessageID); } }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "title",
                                    Style: "font-weight:bold; font-size:0.7rem; margin-bottom:0.3rem;" +
                                        (message.Title ? "" : "display: none;"),
                                    Childs: [{ Type: "text", TextValue: Base64.decode(message.Title || "") }]
                                },
                                {
                                    Type: "div", Name: "murkupMessageTextArea",
                                    Class: "small-12 medium-12 large-12 " + (seen ? "" : "NotSeenMessage")
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachmentsArea" }
                            ]
                        }
                    ]
                }
            ]);

            var MessageDiv = elems["msgDiv"];

            if (add2Top) container.insertBefore(MessageDiv, container.firstChild);
            else container.appendChild(MessageDiv);

            GlobalUtilities.append_markup_text(elems["murkupMessageTextArea"], Base64.decode(message.MessageText), {
                RichText: new RegExp("<.*?>", "g").test(Base64.decode(message.MessageText))
            });

            var attachedFiles = message.AttachedFiles || [];

            if (attachedFiles.length > 0) {
                GlobalUtilities.loading(elems["attachmentsArea"]);

                GlobalUtilities.load_files(["MediaManager/MediaManager.js"], {
                    OnLoad: function () {
                        elems["attachmentsArea"].innerHTML = "";

                        for (var i = 0, lnt = attachedFiles.length; i < lnt; ++i) {
                            attachedFiles[i].FileName = Base64.decode(attachedFiles[i].FileName || "");
                            attachedFiles[i].DownloadLink = DocsAPI.GetDownloadLink({ FileID: attachedFiles[i].FileID || "" });
                            attachedFiles[i].Extension = Base64.decode(attachedFiles[i].Extension || "");
                        }
                        
                        (new MediaManager({ ContainerDiv: elems["attachmentsArea"], NoInlineMedia: true })).add_items(attachedFiles, {
                            Removable: false, Acceptable: false, Downloadable: true
                        });
                    }
                });
            }

            elems["deleteButton"].onclick = function (e) {
                GlobalUtilities.confirm(RVDic.Confirms.RemoveMessage, function (r) {
                    if (!r) return;

                    GlobalUtilities.block(MessageDiv);

                    MessagingAPI.RemoveMessage({
                        ID: message.ID,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);

                            GlobalUtilities.unblock(MessageDiv);

                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.CurrentThread.Thread.MessagesCount -= 1;

                                if (message.IsSender == 1) {
                                    that.Objects.CurrentThread.Thread.SentCount -= 1;
                                    that.Objects.CurrentThread.ThreadDiv["SentCount"].innerHTML = that.Objects.CurrentThread.Thread.SentCount;
                                }
                                else {
                                    that.Objects.CurrentThread.ThreadDiv["ReceivedCount"].innerHTML =
                                        that.Objects.CurrentThread.Thread.MessagesCount - that.Objects.CurrentThread.Thread.SentCount;
                                }

                                that.Objects.Threads[that.Objects.CurrentThread.ThreadId] = that.Objects.CurrentThread;
                                MessageDiv.parentNode.removeChild(MessageDiv);
                            }
                        }
                    });
                });
            }
        },

        send_message: function (advInput, uploader) {
            var that = this;

            GlobalUtilities.block(that.Interface.NewMessageArea);

            var strAttachedFiles = uploader ? uploader.get_items_string() : "";

            MessagingAPI.SendMessage({
                ThreadID: that.Objects.CurrentThread.Thread.ThreadID, MessageText: Base64.encode(advInput.get_data()),
                IsGroup: that.Objects.CurrentThread.Thread.IsGroup, AttachedFiles: strAttachedFiles, Ref: "Messages",
                ResponseHandler: function (responseText) {
                    var result = JSON.parse(responseText);

                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else {
                        if (result.Thread) that.add_thread(that.Interface.ThreadsArea, result.Thread, false);
                        if (result.Message) that.show_messages(that.Objects.CurrentThread.Thread.ThreadID, result.Message);

                        if (result.SenderIsReceiver) {
                            var msg = GlobalUtilities.extend({}, result.Message || {}, { ID: +(result.Message || {}).ID + 1, IsSender: false });
                            that.show_messages(that.Objects.CurrentThread.Thread.ThreadID, msg);
                        }

                        advInput.clear();
                        if (uploader) uploader.clear();
                    }

                    GlobalUtilities.unblock(that.Interface.NewMessageArea);
                }
            });
        },

        get_threads: function () {
            var that = this;

            if (!that.Interface.ThreadsArea.MoreButton || that.Interface.ThreadsArea.processing) return;

            that.Interface.ThreadsArea.processing = true;

            if (that.Interface.ThreadsArea.MoreButton) {
                that.Interface.ThreadsArea.MoreButton.innerHTML = "";
                GlobalUtilities.loading(that.Interface.ThreadsArea.MoreButton);
            }

            var lastId = 0;
            for (var tid in that.Objects.Threads)
                if (that.Objects.Threads[tid])++lastId;
            if (lastId == 0) lastId = null;

            MessagingAPI.GetRecentThreads({
                LastID: lastId, Count: that.Options.ThreadCount,
                ResponseHandler: function (responseText) {
                    var result = JSON.parse(responseText);
                    that.Objects.LastID = result.LastID;

                    for (var i = 0, lnt = result.Threads.length; i < lnt; ++i)
                        that.add_thread(that.Interface.ThreadsArea, result.Threads[i], false);

                    if (!that.Objects.CurrentThread && result.Threads.length > 0)
                        that.show_messages(result.Threads[0].ThreadID, null, null);

                    if (result.Threads.length < that.Options.ThreadCount) {
                        that.Interface.ThreadsArea.MoreButton.parentNode.removeChild(that.Interface.ThreadsArea.MoreButton);
                        that.Interface.ThreadsArea.MoreButton = null;
                    }

                    if (that.Interface.ThreadsArea.MoreButton)
                        that.Interface.ThreadsArea.MoreButton.innerHTML = RVDic.More;

                    that.Interface.ThreadsArea.processing = false;
                }
            });
        },

        show_trd_user: function (container, user) {
            var that = this;

            var fullname = Base64.decode(user.FirstName) + " " + Base64.decode(user.LastName);

            var userPageUrl = UsersAPI.UserPageURL({ UserID: user.UserID });

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-6", Style: "padding:0.2rem;",
                    Childs: [
                        {
                            Type: "div", Link: userPageUrl,
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter " +
                                "rv-bg-color-trans-white DashedAutoHideBorder",
                            Style: "height:100%; padding:0.3rem; cursor:pointer; position:relative;" +
                                "padding-" + RV_Float + ":2.7rem; min-height:2.6rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-border-radius-quarter", Style: "width:2rem; height:2rem;",
                                            Attributes: [{ Name: "src", Value: user.ProfileImageURL }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [{ Type: "text", TextValue: fullname }]
                                }
                            ]
                        }
                    ]
                }
            ], container);
        },

        show_thread_users: (function () {
            var threadUsers = {};

            var _add_user = function (that, threadId, user) {
                if ((threadUsers[threadId] || {}).Users[user.UserID]) return;
                threadUsers[threadId].Users[user.UserID] = true;

                that.show_trd_user(threadUsers[threadId].ItemsArea, user);
            }

            var _get_users = function (that, threadId) {
                var lastId = 0;
                for (var i in threadUsers[threadId].Users)++lastId;

                if (that.ProcessingThreadUsers || !threadUsers[threadId].MoreButton) return;
                that.ProcessingThreadUsers = true;

                threadUsers[threadId].MoreButton.innerHTML = "";
                GlobalUtilities.loading(threadUsers[threadId].MoreButton);

                MessagingAPI.GetThreadUsers({
                    ThreadID: threadId, LastID: lastId, Count: 20,
                    ResponseHandler: function (responseText) {
                        var users = JSON.parse(responseText).Users || [];
                        for (var i = 0, lnt = users.length; i < lnt; ++i)
                            _add_user(that, threadId, users[i]);

                        if (users.length < 20) {
                            threadUsers[threadId].MoreButton.parentNode.removeChild(threadUsers[threadId].MoreButton);
                            threadUsers[threadId].MoreButton = null;
                        }
                        else threadUsers[threadId].MoreButton.innerHTML = RVDic.More;

                        that.ProcessingThreadUsers = false;
                    }
                });
            }

            return function (threadId) {
                if (threadUsers[threadId]) return GlobalUtilities.show(threadUsers[threadId].Container);

                var that = this;

                threadUsers[threadId] = { Container: null, ItemsArea: null, MoreButton: null, Users: {} };

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-8 medium-6 large-5 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "itemsArea", Style: "margin:0rem;" },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "moreButton",
                                Style: "text-align:center; font-weight:bold; color:gray; margin:0.6rem 0rem; cursor:pointer;",
                                Properties: [
                                    { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                    { Name: "onmouseout", Value: function () { this.style.color = "gray"; } }
                                ]
                            }
                        ]
                    }
                ]);

                var container = threadUsers[threadId].Container = elems["container"];
                var itemsArea = threadUsers[threadId].ItemsArea = elems["itemsArea"];
                var moreButton = threadUsers[threadId].MoreButton = elems["moreButton"];

                GlobalUtilities.onscrollend(container, { Offset: 10 }, function () { _get_users(that, threadId); });
                moreButton.onclick = function () { _get_users(that, threadId); };

                GlobalUtilities.show(container);

                _get_users(that, threadId);
            }
        })(),

        show_new_message: function (message) {
            var that = this;

            message = message || {};
            var newMessageObj = null;
            var newMessageDiv = null;
            var showedDiv = null;

            if (newMessageDiv) {
                showedDiv = GlobalUtilities.show(newMessageDiv);
                newMessageObj.clear();
                return;
            }

            newMessageDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(newMessageDiv);
            showedDiv = GlobalUtilities.show(newMessageDiv);

            GlobalUtilities.load_files(["MSG/NewMessage.js"], {
                OnLoad: function () {
                    newMessageObj = new NewMessage(newMessageDiv, {
                        Message: message,
                        OnMessageSent: function (info) {
                            showedDiv.Close();
                            if (info.Thread) that.add_thread(that.Interface.ThreadsArea, info.Thread, true);
                            if (info.Thread && info.Message) that.show_messages(info.Thread.ThreadID, info.Message);

                            if (info.SenderIsReceiver) {
                                var msg = GlobalUtilities.extend({}, info.Message || {}, {
                                    ID: +(info.Message || {}).ID + 1,
                                    IsSender: false
                                });

                                that.show_messages(info.Thread.ThreadID, msg);
                            }
                        }
                    });
                }
            });
        },

        show_forwarded_messages: (function () {
            var fwdMessages = {};

            var _add_messages = function (that, messageId, message) {
                if ((fwdMessages[messageId] || {}).Messages[message.MessageID]) return;
                var isGroup = message.IsGroup;
                var tooltip = "";

                var senderFullname = Base64.decode(message.SenderFirstName) + " " + Base64.decode(message.SenderLastName);
                var senderPageUrl = UsersAPI.UserPageURL({ UserID: message.SenderUserID });

                var receiverPageUrl;
                var receiverProfileImageURL = GlobalUtilities.icon("Group.png");

                if (!isGroup && message.ReceiverUsers.length == 1) {
                    tooltip = Base64.decode(message.ReceiverUsers[0].FirstName) + " " +
                            Base64.decode(message.ReceiverUsers[0].LastName);
                    receiverPageUrl = UsersAPI.UserPageURL({ UserID: message.ReceiverUsers[0].UserID });
                    receiverProfileImageURL = message.ReceiverUsers[0].ProfileImageURL;
                }
                else {
                    tooltip = "<div>" + RVDic["You"] + " " + RVDic["And"] + "</div>";

                    for (var i = 0, lnt = message.ReceiverUsers.length; i < lnt; i++)
                        tooltip += "<div>" + Base64.decode(message.ReceiverUsers[i].FirstName) + " " +
                                Base64.decode(message.ReceiverUsers[i].LastName) + "</div>";

                    if (message.ReceiversCount > message.ReceiverUsers.length) {
                        var othersCount = message.ReceiversCount - message.ReceiverUsers.length;
                        tooltip += "<div style='margin-top:4px;'>" + (RVDic.AndNOthers || "and [n] others").replace(
                                "[n]", "<span style='font-weight:bold;'>" + othersCount + "</span>") + "</div>";
                    }
                }

                fwdMessages[messageId].Messages[message.MessageID] = true;

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter DashedAutoHideBorder",
                        Style: "padding:0.3rem; margin:0.2rem 0rem; position:relative; padding-" + RV_Float + ":7rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                                Childs: [
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter", Tooltip: senderFullname,
                                        Style: "width:2rem; height:2rem; cursor:pointer;", Link: senderPageUrl,
                                        Attributes: [{ Name: "src", Value: message.SenderProfileImageURL }]
                                    },
                                    {
                                        Type: "i",
                                        Class: "fa " + (RV_RTL ? "fa-angle-left" : "fa-angle-right") + " fa-lg rv-icon-button",
                                        Style: "margin:0rem 0.5rem; cursor:default;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    },
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter",
                                        Style: "width:2rem; height:2rem; cursor:pointer;", Tooltip: tooltip,
                                        Attributes: [{ Name: "src", Value: receiverProfileImageURL }],
                                        Properties: [
                                            {
                                                Name: "onclick",
                                                Value: function (e) {
                                                    if (isGroup) that.show_message_receivers(message.MessageID);
                                                    else GlobalUtilities.link_click(e, receiverPageUrl);
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                                Style: "font-size:0.8rem; background-color:white; padding:0.3rem; min-height:2rem;",
                                Childs: [
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12",
                                        Style: "font-size:0.7rem; font-weight:bold; margin-bottom:0.3rem;" +
                                            (message.Title ? "" : "display: none;"),
                                        Childs: [{ Type: "text", TextValue: Base64.decode(message.Title) }]
                                    },
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "murkupMessageTextArea" }
                                ]
                            },
                            {
                                Type: "div", Class: "RevFloat",
                                Style: "display:inline-block; font-size:0.6rem; margin-top:0.3rem;",
                                Childs: [{ Type: "text", TextValue: message.SendDate }]
                            },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    }
                ], fwdMessages[messageId].Container);

                GlobalUtilities.append_markup_text(elems["murkupMessageTextArea"], Base64.decode(message.MessageText), { RichText: true });
            };

            var _get_forwarded_messages = function (that, messageId) {
                MessagingAPI.GetForwardedMessages({
                    MessageID: messageId,
                    ResponseHandler: function (responseText) {
                        var messages = JSON.parse(responseText).ForwardedMessages || [];

                        for (var i = 0, lnt = messages.length; i < lnt; ++i) {
                            _add_messages(that, messageId, messages[i]);
                        }
                    }
                });
            }

            return function (messageId) {
                if (fwdMessages[messageId]) return GlobalUtilities.show(fwdMessages[messageId].Container);

                var that = this;
                fwdMessages[messageId] = { Container: null, Messages: {} };

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container"
                    }
                ]);

                var container = fwdMessages[messageId].Container = elems["container"];
                GlobalUtilities.show(container);
                _get_forwarded_messages(that, messageId);
            }
        })(),

        show_message_receivers: (function () {
            var messageUsers = {};

            var _add_user = function (that, messageId, user) {
                if ((messageUsers[messageId] || {}).Users[user.UserID]) return;
                messageUsers[messageId].Users[user.UserID] = true;

                that.show_trd_user(messageUsers[messageId].ItemsArea, user);
            }

            var _get_users = function (that, messageId) {
                var lastId = 0;
                for (var i in messageUsers[messageId].Users)++lastId;

                if (that.ProcessingMessageUsers || !messageUsers[messageId].MoreButton) return;
                that.ProcessingMessageUsers = true;

                messageUsers[messageId].MoreButton.innerHTML = "";
                GlobalUtilities.loading(messageUsers[messageId].MoreButton);

                MessagingAPI.GetMessageReceivers({
                    MessageID: messageId, LastID: lastId, Count: 20,
                    ResponseHandler: function (responseText) {
                        var users = JSON.parse(responseText).Users || [];
                        for (var i = 0, lnt = users.length; i < lnt; ++i)
                            _add_user(that, messageId, users[i]);

                        if (users.length < 20) {
                            messageUsers[messageId].MoreButton.parentNode.removeChild(messageUsers[messageId].MoreButton);
                            messageUsers[messageId].MoreButton = null;
                        }
                        else messageUsers[messageId].MoreButton.innerHTML = RVDic.More;

                        that.ProcessingMessageUsers = false;
                    }
                });
            }

            return function (messageId) {
                if (messageUsers[messageId]) return GlobalUtilities.show(messageUsers[messageId].Container);

                var that = this;

                messageUsers[messageId] = { Container: null, ItemsArea: null, MoreButton: null, Users: {} };

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-8 medium-6 large-5 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "itemsArea", Style: "margin:0rem;" },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "moreButton",
                                Style: "text-align:center; font-weight:bold; color:gray; margin:0.6rem 0rem; cursor:pointer;",
                                Properties: [
                                    { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                    { Name: "onmouseout", Value: function () { this.style.color = "gray"; } }
                                ]
                            }
                        ]
                    }
                ]);

                var container = messageUsers[messageId].Container = elems["container"];
                var itemsArea = messageUsers[messageId].ItemsArea = elems["itemsArea"];
                var moreButton = messageUsers[messageId].MoreButton = elems["moreButton"];

                GlobalUtilities.onscrollend(container, { Offset: 10 }, function () { _get_users(that, messageId); });
                moreButton.onclick = function () { _get_users(that, messageId); };

                GlobalUtilities.show(container);

                _get_users(that, messageId);
            }
        })()
    }
})();