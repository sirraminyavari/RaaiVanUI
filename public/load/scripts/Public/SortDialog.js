(function () {
    if (window.SortDialog) return;

    window.SortDialog = function (params) {
        params = params || {};

        this.Objects = {
            Container: params.Container || {},
            Title: params.Title || RVDic.Sort,
            Items: params.Items || [],
            CheckContainerItemValidity: params.CheckContainerItemValidity || function () { return true; },
            GetItemID: params.GetItemID || function () { return null; },
            GetItemTitle: params.GetItemTitle || function () { return null; },
            GetItemContainer: params.GetItemContainer || function (item) { return item },
            APIFunction: params.APIFunction || function (data, done) { done(true); }
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "jQuery/Sortable/", Childs: ["jquery.sortable.css", "jquery.sortable.js"] }], {
            OnLoad: function () { that.initialize(); }
        });
    };

    SortDialog.prototype = {
        initialize: function () {
            var that = this;

            var container = that.Objects.Container;
            var dialogTitle = that.Objects.Title;
            var items = that.Objects.Items;
            var checkContainerItemValidity = that.Objects.CheckContainerItemValidity;
            var getItemId = that.Objects.GetItemID;
            var getItemTitle = that.Objects.GetItemTitle;
            var getItemContainer = that.Objects.GetItemContainer;
            var apiFunction = that.Objects.APIFunction;

            var itemsDic = {};
            var arrItems = [];
            var sortedIds = [];

            var _process_item = function (item) {
                var id = getItemId(item);
                var title = getItemTitle(item);

                if (!id || !title) return;

                itemsDic[id] = item;
                sortedIds.push(id);

                arrItems.push({
                    Type: "div", Tooltip: title,
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder WarmBackgroundColor Ellipsis",
                    Style: "padding:0.5rem 2rem; margin-bottom:0.3rem; font-weight:bold; cursor:move; color:white;" +
                        "direction:" + GlobalUtilities.textdirection(title) + ";",
                    Attributes: [{ Name: "ItemID", Value: id }],
                    Childs: [{ Type: "text", TextValue: title }]
                });
            };

            if (items.length)
                jQuery.each(items, function (ind, val) { _process_item(val); });
            else {
                var first = container.firstChild;
                while (first) {
                    if(checkContainerItemValidity(first)) _process_item(first);
                    first = first.nextSibling;
                }
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem; text-align:center;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding:0rem 0.3rem 0.8rem 0.3rem; text-align:center;",
                            Childs: [{ Type: "text", TextValue: dialogTitle }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 sortable grid",
                            Style: "padding-top:1px;", Name: "itemsArea",
                            Childs: arrItems
                        },
                        {
                            Type: "div", Class: "small-8 medium-6 large-4 rv-air-button rv-circle", Name: "confirmButton",
                            Style: "margin:1rem auto 0rem auto; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            var showed = GlobalUtilities.show(elems["container"], {
                OnClose: function () {
                    if (confirmButtonClicked || !_changed()) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveTheChanges, function (result) {
                        if (result) _do_save();
                    });
                }
            });

            jQuery(elems["itemsArea"]).height(jQuery(elems["itemsArea"]).height());

            jQuery(elems["itemsArea"]).sortable({
                PlaceHolder: {
                    Style: "margin:0.3rem 0rem 0.3rem 0rem; height:2.5rem; background-color:white;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder"
                }
            });

            var processing = false;
            var confirmButtonClicked = false;

            var _get_sorted_list = function () {
                var sortedList = [];
                var iter = elems["itemsArea"].firstChild;
                var counter = 0;

                while (iter) {
                    sortedList.push(iter.getAttribute("ItemID"));
                    ++counter;
                    iter = iter.nextSibling;
                }

                return sortedList;
            }

            var _changed = function () {
                var sl = _get_sorted_list();
                for (var i = 0, lnt = sl.length; i < lnt; ++i)
                    if (sl[i] != sortedIds[i]) return true;
                return false;
            };

            var _do_save = function () {
                if (processing) return;
                processing = true;

                GlobalUtilities.block(elems["confirmButton"]);

                var sortedList = _get_sorted_list();
                
                var newOrder = [];
                jQuery.each(sortedList, function (ind, val) { newOrder.push(itemsDic[val]); });

                apiFunction({ SortedIDs: sortedList, SortedItems: newOrder }, function (result) {
                    if (result) {
                        var lastItem = items.length ? getItemContainer(items[0]) : container.firstChild;
                        
                        if (container.appendChild) {
                            jQuery.each(sortedList, function (ind, val) {
                                var curItem = getItemContainer(itemsDic[val]);

                                if (lastItem && (lastItem != curItem) && (curItem.parentNode == container)) {
                                    if (lastItem) container.insertBefore(curItem, lastItem);
                                    else container.appendChild(curItem);
                                }

                                lastItem = curItem.nextSibling;
                            });
                        }

                        showed.Close();
                    }

                    processing = false;
                    GlobalUtilities.unblock(elems["confirmButton"]);
                });
            }

            elems["confirmButton"].onclick = function () {
                confirmButtonClicked = true;
                if (!_changed()) showed.Close();
                _do_save();
            };
        }
    };
})();