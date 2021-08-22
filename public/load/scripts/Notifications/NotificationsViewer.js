(function () {
    if (window.NotificationsViewer) return;

    window.NotificationsViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Interface = {
            NotificationsContainer: null,
            ItemsArea: null,
            NextButton: null,
            PreviousButton: null,
            ActionButton: null,
            NotificationsButton: params.NotificationsButton
        };

        this.Objects = {
            LastNotSeenID: null,
            LastSeenID: null,
            Now: null,
            ScreenCount: 0,
            NotsCount: 0,
            Items: [],
            FirstScreenIndex: -1,
            LastScreenIndex: -1,
            Processing: false,
            SeenQueue: [],
            TimeoutQueue: [],
            Destroyed: false
        };

        this.Options = GlobalUtilities.extend({
            Count: 8,
            SeenTimeout: 1100,
            UpdateInterval: 30000
        }, params.Options || {});
        
        var that = this;
        
        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Style: "width:24rem; padding:0.3rem 0;", Name: "container",
                Childs: [
                    { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "itemsArea" },
                    {
                        Type: "div", Style: "margin-top:8px;",
                        Childs: [
                            {
                                Type: "div", Style: "float:right; width:16px;",
                                Childs: [
                                    {
                                        Type: "img", Style: "width:12px; height:12px;", Tooltip: RVDic.Next,
                                        Attributes: [{ Name: "src", Value: "../../images/Next.png" }],
                                        Properties: [
                                            { Name: "onmouseover", Value: function () { this.setAttribute("src", "../../images/Next-Over.png"); } },
                                            { Name: "onmouseout", Value: function () { this.setAttribute("src", "../../images/Next.png"); } },
                                            { Name: "onclick", Value: function () { that.show_next(); } }
                                        ]
                                    }
                                ]
                            },
                            {
                                Type: "div", Style: "float:right; text-align:center; width:" + ((that.Options.Width || 300) - 40) + "px; " +
                                    "color:black; font-weight:normal; font-size:x-small;", Name: "nextButton",
                                Name: "actionButton",
                                Properties: [
                                    { Name: "onmouseover", Value: function () { this.style.fontWeight = "bold"; } },
                                    { Name: "onmouseout", Value: function () { this.style.fontWeight = "normal"; } }
                                ],
                                Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                            },
                            {
                                Type: "div", Style: "float:left; width:16px;",
                                Childs: [
                                    {
                                        Type: "img", Style: "width:12px; height:12px;", Tooltip: RVDic.Previous, Name: "previousButton",
                                        Attributes: [{ Name: "src", Value: "../../images/Previous.png" }],
                                        Properties: [
                                            { Name: "onmouseover", Value: function () { this.setAttribute("src", "../../images/Previous-Over.png"); } },
                                            { Name: "onmouseout", Value: function () { this.setAttribute("src", "../../images/Previous.png"); } },
                                            { Name: "onclick", Value: function () { that.show_previous(); } }
                                        ]
                                    }
                                ]
                            },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    }
                ]
            }
        ]);

        that.Interface.NotificationsContainer = elems["container"];
        that.Interface.ItemsArea = elems["itemsArea"];
        that.Interface.NextButton = elems["nextButton"];
        that.Interface.PreviousButton = elems["previousButton"];
        that.Interface.ActionButton = elems["actionButton"];

        //Initialize the menu
        var content = that.Interface.NotificationsContainer;
        var button = that.Interface.NotificationsButton;

        button.onclick = function (e) {
            e.stopPropagation();

            var hideFunc = function () {
                jQuery(document.body).off('click', hideHandler);
                popupMenu.Hide(function () { that.clear_timeout_queue(); });
            };

            var hideHandler = function (event) {
                if (popupMenu.IsOpen() && !jQuery(event.target).closest(popupMenu.Container).length &&
                    GlobalUtilities.is_visible(event.target)) hideFunc();
            };
            
            var popupMenu = GlobalUtilities.popup_menu(button, content, {
                Align: "bottom",
                ContentClass: "SurroundingShadow",
                Style: "background-color:white; border-color:rgb(200,200,200);",
                OnAfterShow: function () {
                    that.set_seen_timeout();
                    if (!that.Objects.Now) that.get_notifications();
                    jQuery(document.body).on('click', hideHandler);
                }
            });
            
            button.onclick = function (e) {
                e.stopPropagation();

                if (popupMenu.IsOpen()) hideFunc();
                else popupMenu.Show();
            };
        };
        //end of Initialize the menu
        
        that._initialize();
    }

    NotificationsViewer.prototype = {
        _destroy: function () {
            if (this.ContainerDiv && this.ContainerDiv.parentNode) this.ContainerDiv.parentNode.removeChild(this.ContainerDiv);
            this.clear_timeout_queue();
            this.Objects.Destroyed = true;
        },

        _initialize: function () {
            var that = this;

            GlobalUtilities.load_files([
                "API/NotificationsAPI.js",
                "API/CNAPI.js" //I don't know why without this, the class doesn't work correctly in some cases
            ], {
                    OnLoad: function () {
                        that.get_notifications_count();
                        setInterval(function () { that.get_notifications_count(); }, that.Options.UpdateInterval);
                    }
                });
        },

        get_title: function (notification) {
            var that = this;
            notification = notification || {};

            var dicEntry = ((RVDic.NTFN || {}).SubjectType_Action || {})[notification.SubjectType + "_" + notification.Action] || {};
            var title = ((dicEntry.Audience || {})[notification.UserStatus] || {}).Notif || dicEntry.Notif;

            if (!title) return null;

            var fullname = GlobalUtilities.trim((Base64.decode((notification.Sender || {}).FirstName) || " ") + " " +
                (Base64.decode((notification.Sender || {}).LastName) || " ")) || (notification.Sender || {}).UserName;

            title = title.replace("[user]", "<a href='" + RVAPI.UserPageURL({ UserID: (notification.Sender || {}).UserID }) + "' " +
                "style='color:blue; font-weight:bold;'>" + GlobalUtilities.convert_numbers_to_persian(fullname) + "</a>");

            var funcName = "r" + GlobalUtilities.random_str(20);
            window[funcName] = function () {
                NotificationsAPI.SetNotificationsAsSeen({ NotificationIDs: [notification.NotificationID] });
                return true;
            };
            
            var options = {
                question: { title: RVDic.Question, url: RVAPI.QuestionPageURL({ QuestionID: notification.RefItemID }) },
                answer: { title: RVDic.Answer, url: RVAPI.QuestionPageURL({ QuestionID: notification.RefItemID }) },
                post: { title: RVDic.Post, url: RVAPI.PostsPageURL({ PostID: notification.RefItemID }) },
                comment: { title: RVDic.Comment, url: RVAPI.PostsPageURL({ PostID: notification.RefItemID }) },
                sent: { title: RVDic.Sent_Verb, url: RVAPI.PostsPageURL({ PostID: notification.SubjectID }) },
                shared: { title: RVDic.Shared_Verb, url: RVAPI.PostsPageURL({ PostID: notification.RefItemID }) },
                mentioned: {
                    title: RVDic.Mentioned_Verb,
                    url: RVAPI.PostsPageURL({ PostID: notification.SubjectType == "Post" ? notification.SubjectID : notification.RefItemID })
                },
                subject: {
                    title: Base64.decode((notification.Info || {}).NodeType) || RVDic.Subject,
                    url: RVAPI.NodePageURL({ NodeID: notification.RefItemID })
                },
                expertisedomain: { title: RVDic.ExpertiseDomain, url: RVAPI.NodePageURL({ NodeID: notification.RefItemID }) },
                group: { title: RVDic.Group, url: RVAPI.NodePageURL({ NodeID: notification.RefItemID }) },
                registered: { title: RVDic.Registered_Verb, url: RVAPI.NodePageURL({ NodeID: notification.RefItemID }) }
            };
            
            jQuery.each(options, function (key, value) {
                var theTag = "<a href='" + value.url + "' style='margin:0px 4px 0px 4px; color:blue; font-weight:bold;' " +
                    "onclick='" + funcName + "();'>" + value.title + "</a>";
                title = title.replace("[" + key + "]", theTag);
            });
            
            return title;
        },

        add_item: function (notification, params) {
            var that = this;
            params = params || {};

            var title = that.get_title(notification);

            if (!title) return;

            var isNew = params.IsNew === true;

            that.Interface.ActionButton.innerHTML = RVDic.ShowAll;

            var description = Base64.decode(notification.Description);

            if (["LikeNode", "LikeQuestion", "QuestionQuestion"]
                .some(function (x) { return x == (notification.Action + notification.SubjectType); }))
                description = Base64.decode(notification.SubjectName);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemContainer", Tooltip: notification.SendDate,
                    Class: "rv-border-radius-quarter SoftShadow TextAlign " +
                        (notification.Seen === false ? "rv-bg-color-softer-soft" : "rv-bg-color-white-softer"),
                    Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":1.5rem; margin-bottom:0.4rem; cursor:default;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.2rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { that.remove_notification(notification.NotificationID); } }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.7rem; color:black;", Name: "titleArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "descArea",
                            Style: "color:gray; font-size:0.6rem; margin-top:0.3rem;"
                        }
                    ]
                }
            ]);

            elems["titleArea"].innerHTML = title;

            var _div = document.createElement("div");
            GlobalUtilities.append_markup_text(_div, description, {
                Done: function () {
                    elems["descArea"].innerHTML = GlobalUtilities.get_text_begining(_div.innerText || _div.textContent, 100, "...");
                }
            });

            var itemContainer = elems["itemContainer"];
            itemContainer.NotificationID = notification.NotificationID;

            if (isNew) {
                that.Objects.Items.reverse();
                that.Objects.Items.push(itemContainer);
                that.Objects.Items.reverse();

                that.Interface.PreviousButton.setAttribute("src", "../../images/Previous-Red.png");
            }
            else
                that.Objects.Items.push(itemContainer);

            if (isNew) {
                ++that.Objects.FirstScreenIndex;
                ++that.Objects.LastScreenIndex;
            }
            else {
                if (that.Objects.FirstScreenIndex == -1) that.Objects.FirstScreenIndex = this.Objects.Items.length - 1;
                that.Objects.LastScreenIndex = that.Objects.Items.length - 1;
                that.add_to_screen(itemContainer);
            }
        },

        get_notifications_count: function () {
            var that = this;

            NotificationsAPI.GetNotificationsCount({
                ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.Destroy) {
                        that._destroy();
                        return;
                    }
                    else
                        that.ContainerDiv.style.display = "block";

                    var count = +result.Count;
                    if (isNaN(count)) count = 0;
                    var dif = count - that.Objects.NotsCount;
                    
                    if (dif > 0 && that.Objects.Now && that.Objects.Now != "")
                        that.get_notifications({ GetNew: true, Count: dif });
                }
            });
        },

        get_notifications: function (params) {
            if (this.Objects.Processing) return;

            params = params || {};
            var that = this;

            that.Interface.ActionButton.innerHTML = RVDic.Loading + "...";

            var _add_olds = function () {
                if (params.IfEmpty && params.IfEmpty.First >= 0 && params.IfEmpty.Last >= 0) {
                    that.Objects.FirstScreenIndex = params.IfEmpty.First;
                    that.Objects.LastScreenIndex = params.IfEmpty.Last;
                    for (var i = params.IfEmpty.First; i <= params.IfEmpty.Last; ++i)
                        if (that.Objects.Items[i]) that.add_to_screen(that.Objects.Items[i]);
                }
            }

            var getNew = params.GetNew === true;

            if (!getNew && that.Objects.LastNotSeenID == -1 && that.Objects.LastSeenID == -1) {
                _add_olds();
                that.Interface.ActionButton.innerHTML = that.get_screen_items_count() == 0 ? RVDic.NothingToDisplay : "";
                return;
            }

            that.Objects.Processing = true;

            NotificationsAPI.GetNotifications({ LastNotSeenID: (getNew ? "" : that.Objects.LastNotSeenID),
                LastSeenID: (getNew ? "" : that.Objects.LastSeenID), Count: params.Count || that.Options.Count,
                LastViewDate: (getNew ? "" : that.Objects.Now || ""), Seen: (getNew ? false : null),
                ResponseHandler: function (responseText) {
                    var result = JSON.parse(responseText);

                    if (result.Destroy) {
                        that._destroy();
                        return;
                    }
                    else
                        that.ContainerDiv.style.display = "block";

                    if (!that.Objects.Now) that.Objects.Now = result.Now || "";

                    var nots = result.Notifications || [];
                    for (var i = 0, lnt = nots.length; i < lnt; ++i) {
                        nots[i].Info = !nots[i].Info || nots[i].Info == "" ? {} : JSON.parse(Base64.decode(nots[i].Info));
                        that.add_item(nots[i], { IsNew: getNew });
                    }

                    if (!getNew) {
                        that.Objects.LastNotSeenID = nots.length > 0 && result.LastNotSeenID != "" ? result.LastNotSeenID : -1;
                        that.Objects.LastSeenID = nots.length > 0 && result.LastSeenID != "" ? result.LastSeenID : -1;
                        if (nots.length == 0) _add_olds();
                    }

                    if (params.OnEnd) params.OnEnd();
                    that.Interface.ActionButton.innerHTML = that.get_screen_items_count() == 0 ? RVDic.NothingToDisplay : "";

                    that.set_seen_timeout();
                    that.Objects.Processing = false;
                }
            });
        },

        set_seen_timeout: function () {
            var that = this;
            that.Objects.TimeoutQueue.push(setTimeout(function () { that.set_notifications_as_seen(); }, that.Options.SeenTimeout));
        },

        clear_timeout_queue: function () {
            for (var i = 0, lnt = this.Objects.TimeoutQueue.length; i < lnt; ++i)
                if (this.Objects.TimeoutQueue[i]) clearTimeout(this.Objects.TimeoutQueue[i]);
            this.Objects.TimeoutQueue = [];
        },

        set_notifications_as_seen: function () {
            var that = this;

            var _timestamp = (new Date()).getTime();
            var notificationIds = [];
            for (var i = 0, lnt = this.Objects.SeenQueue.length; i < lnt; ++i) {
                if (!this.Objects.SeenQueue[i].Seen &&
                    (_timestamp - this.Objects.SeenQueue[i].Timestamp) >= (this.Options.SeenTimeout - 1000)) {
                    notificationIds.push(this.Objects.SeenQueue[i].ID);
                    this.Objects.SeenQueue[i].Seen = true;
                }
            }

            if (notificationIds.length == 0) return;

            NotificationsAPI.SetNotificationsAsSeen({ NotificationIDs: notificationIds,
                ResponseHandler: function (responseText) {}
            });
        },

        remove_notification: function (notificationId) {
            if (this.Objects.Processing) return;

            var that = this;
            var _itemContainer = null;
            for (var i = 0; i < that.Objects.Items.length; ++i)
                if (that.Objects.Items[i] && that.Objects.Items[i].NotificationID == notificationId) _itemContainer = that.Objects.Items[i];
            if (_itemContainer == null) return;

            that.Objects.Processing = true;
            GlobalUtilities.block(_itemContainer);

            NotificationsAPI.RemoveNotification({ NotificationID: notificationId,
                ResponseHandler: function (responseText) {
                    var result = JSON.parse(responseText);
                    GlobalUtilities.unblock(_itemContainer);

                    if (result.ErrorText) {
                        that.Objects.Processing = false;
                        return;
                    }

                    _itemContainer.parentNode.removeChild(_itemContainer);
                    for (var i = 0; i < that.Objects.Items.length; ++i)
                        if (that.Objects.Items[i] && that.Objects.Items[i].NotificationID == notificationId) that.Objects.Items[i] = null;

                    var addOneNewItem = true;

                    for (var i = that.Objects.LastScreenIndex + 1; i < that.Objects.Items.length; ++i) {
                        if (!that.Objects.Items[i]) continue;

                        that.add_to_screen(that.Objects.Items[i]);
                        that.Objects.LastScreenIndex = i;
                        addOneNewItem = false;
                        break;
                    }

                    that.Objects.Processing = false;

                    if (that.get_screen_items_count() == 0) that.show_previous();
                    else if (addOneNewItem) that.get_notifications({ Count: 1 });
                }
            });
        },

        add_to_screen: function (item) {
            this.Interface.ItemsArea.appendChild(item);

            for (var i = 0, lnt = this.Objects.SeenQueue.length; i < lnt; ++i)
                if (this.Objects.SeenQueue[i].Seen && this.Objects.SeenQueue[i].ID == item.NotificationID) return;
            this.Objects.SeenQueue.push({ ID: item.NotificationID, Seen: false, Timestamp: (new Date()).getTime() });
        },

        clear_screen: function () {
            this.Interface.ItemsArea.innerHTML = "";
        },

        get_screen_items_count: function () {
            var count = 0;
            for (var i = this.Objects.FirstScreenIndex; i <= this.Objects.LastScreenIndex; ++i)
                if (this.Objects.Items[i]) ++count;
            return count;
        },

        show_previous: function () {
            if (this.Objects.Processing) return;

            var items = [];
            this.Objects.LastScreenIndex = this.Objects.FirstScreenIndex - 1;
            for (var i = this.Objects.LastScreenIndex; i > -1 && items.length < this.Options.Count; --i) {
                if (!this.Objects.Items[i]) continue;
                items.push(this.Objects.Items[i]);
                if (items.length == 1) this.Objects.LastScreenIndex = i;
                this.Objects.FirstScreenIndex = i;
            }

            var dif = this.Options.Count - items.length;
            items = items.reverse();

            for (var i = this.Objects.LastScreenIndex + 1; i < this.Objects.Items.length && items.length < this.Options.Count; ++i) {
                if (!this.Objects.Items[i]) continue;
                items.push(this.Objects.Items[i]);
                this.Objects.LastScreenIndex = i;
            }

            this.clear_screen();
            for (var i = 0, lnt = items.length; i < lnt; ++i) this.add_to_screen(items[i]);
        },

        show_next: function () {
            if (this.Objects.Processing) return;

            var items = [];
            var ifempty = { First: this.Objects.FirstScreenIndex, Last: this.Objects.LastScreenIndex };
            this.Objects.FirstScreenIndex = -1;
            for (var i = this.Objects.LastScreenIndex + 1; i < this.Objects.Items.length && items.length < this.Options.Count; ++i) {
                if (!this.Objects.Items[i]) continue;
                items.push(this.Objects.Items[i]);
                if (items.length == 1) this.Objects.FirstScreenIndex = i;
                this.Objects.LastScreenIndex = i;
            }

            this.clear_screen();
            for (var i = 0, lnt = items.length; i < lnt; ++i) this.add_to_screen(items[i]);

            var dif = this.Options.Count - items.length;
            if (dif > 0) this.get_notifications({ Count: dif, IfEmpty: (items.length == 0 ? ifempty : null) });
        }
    }
})();