(function () {
    "use strict";

    if (window.QuestionsPanel) return;

    window.QuestionsPanel = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;

        this.Interface = {
            GroupsContainer: null,
            Related: null,
            Favorites: null,
            MyAsked: null,
            AskedOfMe: null,
            SortButton: null
        };

        this.Objects = {
            Order: [],
            OrderVariableName: window.RVGlobal.CurrentUserID + "_QAPanelOrder"
        };

        this.Options = {
            Count: 5,
            TagsCount: 100,
            AllCount: 5
        }

        var that = this;

        GlobalUtilities.load_files(["API/QAAPI.js", "QA/QuestionMini.js", "TabsManager/TabsManager.js"], {
            OnLoad: function () { that.preinit(); }
        });
    }

    QuestionsPanel.prototype = {
        preinit: function () {
            var that = this;

            RVAPI.GetVariable({
                Name: that.Objects.OrderVariableName, ParseResults: true,
                ResponseHandler: function (result) {
                    var order = (result.Value ? JSON.parse(Base64.decode(result.Value) || "{}") : {}).Order || [];

                    var defaultOrder = [
                        "Newest",
                        {
                            Name: "Related", Groups: true, ExpertiseDomains: true,
                            Favorites: true, Properties: true, FromFriends: true
                        },
                        "Favorites",
                        "MyAsked",
                        "AskedOfMe"
                    ];

                    for (var i = 0, lnt = defaultOrder.length; i < lnt; ++i) {
                        var exists = false;
                        for (var j = 0; j < order.length; ++j) {
                            if ((defaultOrder[i].Name || defaultOrder[i]) == (order[j].Name || order[j]))
                                exists = true;
                        }
                        if (!exists) order.push(defaultOrder[i]);
                    }

                    that.Objects.Order = order;

                    that.initialize();
                }
            });
        },

        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var orderItem = null;
            for (var i = 0, lnt = that.Objects.Order.length; i < lnt; ++i) {
                if ((that.Objects.Order[i].Name || that.Objects.Order[i]) == "Related")
                    orderItem = that.Objects.Order[i];
            }

            var related_checkbox = function (name) {
                var elemName = name + "Checkbox";

                return {
                    Type: "div", Class: "small-12 medium-6 large-4 TextAlign rv-icon-button",
                    Style: "font-size:0.8rem;",
                    Properties: [{ Name: "onclick", Value: function () { elems[elemName][elems[elemName].checked ? "uncheck" : "check"](); } }],
                    Childs: [
                        {
                            Type: "checkbox", Name: elemName, Params: {
                                Checked: !!orderItem[name],
                                OnChange: function () {
                                    orderItem[name] = !!elems[elemName].checked;
                                    that.save_order();
                                    that.get_related(orderItem, { Renew: true });
                                }
                            },
                            Style: "margin-" + RV_RevFloat + ":0.5rem; width:1rem; height:1rem;"
                        },
                        { Type: "text", TextValue: that.get_related_title(name) }
                    ]
                };
            }

            var related_checkboxes = function () {
                var boxes = [];
                var names = ["Groups", "ExpertiseDomains", "Favorites", "Properties", "FromFriends"];

                for (var i = 0, lnt = names.length; i < lnt; ++i)
                    boxes.push(related_checkbox(names[i]));

                return boxes;
            }

            var parts = [];

            var add_part = function (name) {
                parts.push({
                    Type: "div", Class: "small-12 medium-12 large-12", Name: name + "Container",
                    Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor SoftBorder",
                            Style: "text-align:center; margin-bottom:1rem; padding:1rem 3rem; color:rgb(143,143,143);" +
                                "font-weight:bold; font-size:2rem; position:relative;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [{ Type: "text", TextValue: that.get_header_title(name) }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row",
                                    Name: name == "Related" ? "settings" : null,
                                    Style: "margin:1rem 0rem 0rem 0rem; font-size:1rem; font-weight:normal; display:none;",
                                    Childs: name != "Related" ? null : related_checkboxes()
                                },
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:1.2rem; " + RV_RevFloat + ":0.5rem;" +
                                        (name == "Related" ? "" : "display:none;"),
                                    Childs: name != "Related" ? null : [
                                        {
                                            Type: "i", Class: "fa fa-cog fa-lg rv-icon-button",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [
                                                {
                                                    Name: "onclick",
                                                    Value: function () {
                                                        jQuery(elems["settings"]).animate({ height: "toggle" });
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: name }
                    ]
                });
            }

            add_part("Related");
            add_part("Favorites");
            add_part("MyAsked");
            /*add_part("AskedOfMe");*/

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem 0rem 1rem 0rem;",
                    Childs: [
                        { Type: "div", Class: "small-10 medium-11 large-11", Name: "tabs" },
                        {
                            Type: "div", Class: "small-2 medium-1 large-1 RevTextAlign",
                            Style: "padding-" + RV_RevFloat + ":1rem; display:none;", Name: "buttons",
                            Childs: [{ Type: "i", Class: "fa fa-sort fa-2x rv-icon-button", Name: "sortButton" }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "groupsContainer",
                    Childs: parts
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "tags" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "allQuestions" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "faq" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "heros", Style: "display:none;",
                    Childs: [{ Type: "text", TextValue: "At here, you can see who are the heros of QA (Monthly, Annual & All)!" }]
                }
            ], that.Container);

            that.Interface.GroupsContainer = elems["groupsContainer"];
            that.Interface.Related = elems["Related"];
            that.Interface.Favorites = elems["Favorites"];
            that.Interface.MyAsked = elems["MyAsked"];
            that.Interface.AskedOfMe = elems["AskedOfMe"];
            that.Interface.SortButton = elems["sortButton"];

            //initialize tabs
            var tabs = [];

            var groupsInited = false;
            var tagsInited = false;
            var allInited = false;
            var faqInited = false;

            if (window.RVGlobal.IsAuthenticated) {
                tabs.push({
                    Page: elems["groupsContainer"], Title: RVDic.Categories, FixedPage: true,
                    OnDeactive: function () { jQuery(elems["buttons"]).fadeOut(500); },
                    OnActive: function () {
                        jQuery(elems["buttons"]).fadeIn(500);

                        if (groupsInited) return;
                        groupsInited = true;

                        that.Interface.SortButton.onclick = function () { that.sort_dialog(); }

                        that.auto_sort();

                        for (var i = 0; i < that.Objects.Order.length; ++i)
                            that.call_api(that.Objects.Order[i]);
                    }
                });
            }
            else elems["groupsContainer"].style.display = "none";

            tabs.push({
                Page: elems["allQuestions"], Title: RVDic.AllQuestions, FixedPage: true,
                OnActive: function () {
                    if (allInited) return;
                    allInited = true;

                    that.all_questions(elems["allQuestions"]);
                }
            });

            tabs.push({
                Page: elems["tags"], Title: RVDic.MostUsedTags, FixedPage: true,
                OnActive: function () {
                    if (tagsInited) return;
                    tagsInited = true;

                    that.show_tags(elems["tags"]);
                }
            });

            tabs.push({
                Page: elems["faq"], Title: RVDic.FAQ, FixedPage: true,
                OnActive: function () {
                    if (faqInited) return;
                    faqInited = true;

                    that.faq(elems["faq"]);
                }
            });

            /*
            tabs.push({
                Page: elems["heros"], Title: "Heros", FixedPage: true,
                OnActive: function () { }
            });
            */

            (new TabsManager({ ContainerDiv: elems["tabs"], Pages: tabs })).goto_page(0);
            //end of initialize tabs
        },

        save_order: function () {
            var that = this;

            RVAPI.SetVariable({
                Name: that.Objects.OrderVariableName,
                Value: Base64.encode(JSON.stringify({ Order: that.Objects.Order })),
                ResponseHandler: function (r) { }
            });
        },

        get_related_title: function (name) {
            switch (name) {
                case "Groups":
                    return RVDic.RelatedToN.replace("[n]", RVDic.MyGroups);
                case "ExpertiseDomains":
                    return RVDic.RelatedToN.replace("[n]", RVDic.MyExpertiseDomains);
                case "Favorites":
                    return RVDic.RelatedToN.replace("[n]", RVDic.MyFavorites);
                case "Properties":
                    return RVDic.RelatedToN.replace("[n]", RVDic.MyIntellectualProperties);
                case "FromFriends":
                    return RVDic.AskedByN.replace("[n]", RVDic.MyCoworkers);
            }
        },

        get_header_title: function (name) {
            switch (name) {
                case "Related":
                    return RVDic.QuestionsRelatedToMe;
                case "Favorites":
                    return RVDic.MyFavoriteQuestions;
                case "MyAsked":
                    return RVDic.MyQuestions;
                /*case "AskedOfMe":
                    return RVDic.QuestionsAskedOfMe;*/
                case "Newest":
                    return RVDic.SortBelowByTime;
            }
        },

        get_items_container: function (name) {
            var that = this;

            switch (name) {
                case "Related":
                    return that.Interface.Related;
                case "Favorites":
                    return that.Interface.Favorites;
                case "MyAsked":
                    return that.Interface.MyAsked;
                /*case "AskedOfMe":
                    return that.Interface.AskedOfMe;*/
            }
        },

        call_api: function (orderItem) {
            var that = this;

            switch (orderItem.Name || orderItem) {
                case "Related":
                    return that.get_related(orderItem);
                case "Favorites":
                    return that.get_favorites(orderItem);
                case "MyAsked":
                    return that.get_my_asked(orderItem);
                /*case "AskedOfMe":
                    return that.get_asked_of_me(orderItem);*/
            }
        },

        get_questions: function (container, apiFunction, reqParams, params) {
            reqParams = reqParams || {};
            params = params || {};
            var that = this;

            that.__Processing = that.__Processing || {};
            if (that.__Processing[apiFunction]) return;
            that.__Processing[apiFunction] = true;

            var renew = params.Renew === true;
            var autoSort = !renew && (params.AutoSort !== false);

            var lowerBoundary = +reqParams.LowerBoundary;
            if (isNaN(lowerBoundary) || (lowerBoundary < 1)) lowerBoundary = 1;
            var getMore = lowerBoundary > 1;

            var moreButton = params.MoreButton;

            if (!getMore) {
                container.innerHTML = "";
                GlobalUtilities.loading(container);
            }
            else if (moreButton) {
                moreButton.innerHTML = "";
                GlobalUtilities.loading(moreButton);
            }

            QAAPI[apiFunction](GlobalUtilities.extend(reqParams, {
                Count: reqParams.Count || that.Options.Count, LowerBoundary: lowerBoundary, ParseResults: true,
                ResponseHandler: function (result) {
                    var questions = result.Questions || [];

                    if (!getMore) {
                        container.innerHTML = questions.length > 0 ? "" :
                            "<div class='small-12 medium-12 large-12' style='text-align:center;" +
                            "color:rgb(100,100,100); margin-bottom:2rem;'>" +
                            RVDic.NothingToDisplay + "</div>";
                    }

                    if (moreButton) {
                        moreButton.innerHTML = RVDic.More;

                        var isVisible = result.TotalCount >= (lowerBoundary + questions.length);
                        jQuery(moreButton)[isVisible ? "fadeIn" : "fadeOut"](500);

                        moreButton.onclick = function () {
                            that.get_questions(container, apiFunction, GlobalUtilities.extend(reqParams, {
                                LowerBoundary: lowerBoundary + questions.length
                            }), params);
                        }
                    }

                    for (var i = 0, lnt = questions.length; i < lnt; ++i)
                        that.add_item(container, questions[i]);

                    if (autoSort && !getMore) that.auto_sort();

                    that.__Processing[apiFunction] = false;
                }
            }));
        },

        get_related: function (orderItem, params) {
            var that = this;

            that.get_questions(that.Interface.Related, "GetRelatedQuestions", {
                Groups: orderItem.Groups,
                ExpertiseDomains: orderItem.ExpertiseDomains,
                Favorites: orderItem.Favorites,
                Properties: orderItem.Properties,
                FromFriends: orderItem.FromFriends
            }, params);
        },

        get_favorites: function (orderItem, params) {
            var that = this;

            that.get_questions(that.Interface.Favorites, "MyFavoriteQuestions", null, params);
        },

        get_my_asked: function (orderItem, params) {
            var that = this;

            that.get_questions(that.Interface.MyAsked, "MyAskedQuestions", null, params);
        },

        get_asked_of_me: function (orderItem, params) {
            var that = this;

            that.get_questions(that.Interface.AskedOfMe, "QuestionsAskedOfMe", null, params);
        },

        add_item: function (container, question) {
            var that = this;

            new QuestionMini(container, question);
        },

        auto_sort: function () {
            var that = this;

            var order = that.Objects.Order;
            var tempOrder = [];

            for (var i = 0, lnt = order.length; i < lnt; ++i) {
                if ((order[i].Name || order[i]) != "Newest") {
                    tempOrder.push(order[i]);
                    continue;
                }
                else {
                    var arr = [];
                    for (var j = i + 1; j < lnt; ++j)
                        arr.push(order[j]);

                    for (var x = 0; x < arr.length; ++x) {
                        for (var y = x + 1; y < arr.length; ++y) {
                            var xVal = (that.get_items_container(arr[x].Name || arr[x]) || {}).LatestDate;
                            var yVal = (that.get_items_container(arr[y].Name || arr[y]) || {}).LatestDate;

                            if ((!xVal && yVal) || (xVal && yVal && ((new Date(yVal)) > (new Date(xVal))))) {
                                var tmp = arr[x];
                                arr[x] = arr[y];
                                arr[y] = tmp;
                            }
                        }
                    }

                    for (var x = 0; x < arr.length; ++x)
                        tempOrder.push(arr[x]);

                    break;
                }
            }

            var lastItem = that.Interface.GroupsContainer.firstChild;
            
            for (var i = 0, lnt = tempOrder.length; i < lnt; ++i) {
                var curItem = that.get_items_container(tempOrder[i].Name || tempOrder[i]);

                if (!curItem) continue;
                else curItem = curItem.parentNode;

                if (lastItem != curItem) {
                    if (lastItem) that.Interface.GroupsContainer.insertBefore(curItem, lastItem);
                    else that.Interface.GroupsContainer.appendChild(curItem);
                }

                lastItem = curItem.nextSibling;
            }
        },

        sort_dialog: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "SoftBackgroundColor rv-border-radius-1",
                    Style: "width:50vw; padding:1rem; margin:0rem auto;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Style: "margin-bottom:1rem; text-align:center; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic._HelpSortNames }]
                        },
                        { Type: "div", Name: "items", Style: "margin-bottom:1rem;" },
                        {
                            Type: "div", Class: "ActionButton", Name: "confirmButton",
                            Style: "width:8rem; margin:0rem auto;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            var _div = elems["_div"];

            GlobalUtilities.loading(elems["items"]);

            var onClose = null;

            var showed = GlobalUtilities.show(_div, {
                OnClose: function () {
                    onClose();
                }
            });

            GlobalUtilities.load_files([{ Root: "jQuery/Sortable/", Childs: ["jquery.sortable.css", "jquery.sortable.js"] }], {
                OnLoad: function () {
                    elems["items"].innerHTML = "";

                    var parts = [];

                    var add_part = function (name) {
                        var _cls = name == "Newest" ? "SoftBackgroundColor SoftBorder" : "WarmBackgroundColor";
                        var _ttl = that.get_header_title(name);

                        if (!_ttl) return;

                        parts.push({
                            Type: "div", Class: _cls + " rv-border-radius-half",
                            Style: "cursor:pointer; text-align:center; margin:0.5rem 0rem; padding:0.5rem;",
                            Attributes: [{ Name: "ItemName", Value: name }],
                            Childs: [{ Type: "text", TextValue: _ttl }]
                        });
                    }

                    for (var i = 0, lnt = that.Objects.Order.length; i < lnt; ++i)
                        add_part(that.Objects.Order[i].Name || that.Objects.Order[i]);

                    GlobalUtilities.create_nested_elements(parts, elems["items"]);

                    jQuery(elems["items"]).sortable({
                        PlaceHolder: { Style: "margin:0.5rem 0rem; height:2rem; background-color:white;" }
                    });

                    var processing = false;
                    var confirmButtonClicked = false;

                    onClose = function () {
                        if (confirmButtonClicked || !_changed()) return;

                        GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveTheChanges, function (result) {
                            if (result) _do_save();
                        });
                    };

                    var _get_sorted_list = function () {
                        var sortedList = [];
                        var iter = elems["items"].firstChild;
                        var counter = 0;

                        while (iter) {
                            sortedList.push(iter.getAttribute("ItemName"));
                            ++counter;
                            iter = iter.nextSibling;
                        }

                        return sortedList;
                    }

                    var _changed = function () {
                        var sl = _get_sorted_list();
                        for (var i = 0, lnt = sl.length; i < lnt; ++i)
                            if (sl[i] != (that.Objects.Order[i].Name || that.Objects.Order[i])) return true;
                        return false;
                    }

                    var _do_save = function () {
                        if (processing) return;
                        processing = true;

                        GlobalUtilities.block(elems["confirmButton"]);

                        var dic = {};
                        for (var i = 0, lnt = that.Objects.Order.length; i < lnt; ++i)
                            dic[that.Objects.Order[i].Name || that.Objects.Order[i]] = that.Objects.Order[i];

                        var sortedList = _get_sorted_list();

                        var newOrder = [];
                        for (var i = 0, lnt = sortedList.length; i < lnt; ++i)
                            newOrder.push(dic[sortedList[i]]);

                        that.Objects.Order = newOrder;

                        that.save_order();

                        that.auto_sort();

                        showed.Close();

                        processing = false;
                        GlobalUtilities.unblock(elems["confirmButton"]);
                    }

                    elems["confirmButton"].onclick = function () {
                        confirmButtonClicked = true;
                        if (!_changed()) showed.Close();
                        _do_save();
                    }
                }
            });
        },

        show_tags: function (container) {
            var that = this;

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["QA/QATags.js"], {
                OnLoad: function () { new QATags(container, { Count: that.Options.TagsCount }); }
            });
        },

        all_questions: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "questions" },
                {
                    Type: "div", Name: "moreButton",
                    Class: "small-12 medium-12 large-12 rv-air-button rv-circle SoftBorder",
                    Style: "margin:1rem auto; text-align:center; border-color:rgb(80,80,80);" +
                        "padding:0.5rem 0rem; display:none;",
                    Childs: [{ Type: "text", TextValue: RVDic.More }]
                }
            ], container);

            that.get_questions(elems["questions"], "GetQuestions", {
                Count: that.Options.AllCount,
                LowerBoundary: 0
            }, { AutoSort: false, MoreButton: elems["moreButton"] });
        },

        faq: function (container) {
            var that = this;

            container.innerHTML = "";

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files([{ Root: "QA/FAQViewer/", Childs: ["FAQViewer.css", "FAQViewer.js"] }], {
                OnLoad: function () { new FAQViewer(container); }
            });
        }
    }
})();