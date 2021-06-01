(function () {
    if (window.NewSimpleListViewer) return;

    window.NewSimpleListViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null,
            MoreButton: null
        };

        this.Objects = {
            ItemsCount: 0,
            TotalCount: 0
        };

        this.Options = GlobalUtilities.extend({
            Count: 20,
            AutoGrow: true,
            OnDataRequest: null,
            OnReset: null,
            OnNothingFound: null,
            ItemBuilder: null,
            MoreButtonBuilder: null,
            SearchInput: false
        }, params.Options || {});

        this._initialize();
    }

    NewSimpleListViewer.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:0.5rem;" + (that.Options.SearchInput ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.SearchText, Name: "_input"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem;", Name: "itemsArea"
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "moreButtonArea" }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];

            if (that.Options.SearchInput) {
                GlobalUtilities.set_onchangeorenter(elems["_input"], function () {
                    that.clear();
                    that.data_request({ SearchText: GlobalUtilities.trim(elems["_input"].value) });
                });
            }

            if (that.Options.MoreButtonBuilder)
                that.Interface.MoreButton = that.Options.MoreButtonBuilder.call(that, elems["moreButtonArea"]);
            else {
                that.Interface.MoreButton = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                        Style: "text-align:center; margin-top:1rem;", Name: "moreButton"
                    }
                ], elems["moreButtonArea"])["moreButton"];
            }

            if (that.Interface.MoreButton) that.Interface.MoreButton.onclick = function () { that.on_data_request(); }

            if (that.Options.AutoGrow && GlobalUtilities.get_type(that.Options.OnDataRequest) == "function") {
                that.ContainerDiv.style["overflow-x"] = "hidden";
                that.ContainerDiv.style["overflow-y"] = "auto";

                GlobalUtilities.onscrollend(that.ContainerDiv, { Offset: 10 }, function () { that.on_data_request(); });
            }

            that.on_data_request();
        },

        clear: function () {
            var that = this;

            that.Interface.ItemsArea.innerHTML = "";
            that.Objects.ItemsCount = 0;
            that.__EndedUp = false;
        },

        reset: function () {
            this.clear();
            this.data_request();
            if (this.Options.OnReset) this.Options.OnReset();
        },

        on_data_request: function (options) {
            var that = this;
            
            if (!that.Options.OnDataRequest || that.__EndedUp) return;
            
            if (that.__Processing) return;
            that.__Processing = true;

            options = GlobalUtilities.extend({ LowerBoundary: that.Objects.ItemsCount + 1, Count: that.Options.Count }, options || {});

            if (that.Interface.MoreButton) {
                that.Interface.MoreButton.style.display = "block";
                that.Interface.MoreButton.innerHTML = "";
                GlobalUtilities.loading(that.Interface.MoreButton);
            }

            that.Options.OnDataRequest(options, function (result) {
                var items = result.Items || (GlobalUtilities.get_type(result) == "array" ? result : []);

                if (!items.length && (that.Objects.ItemsCount <= 0) && that.Options.OnNothingFound)
                    that.Options.OnNothingFound(that.Interface.ItemsArea);

                for (var i = 0, lnt = items.length; i < lnt; ++i)
                    that.add_item(items[i]);

                if ((items.length < options.Count) ||
                    ((that.Objects.TotalCount > 0) && (that.Objects.ItemsCount >= that.Objects.TotalCount))) {
                    that.__EndedUp = true;

                    if (that.Interface.MoreButton) {
                        that.Interface.MoreButton.style.display = "none";
                        //that.Interface.MoreButton.parentNode.removeChild(that.Interface.MoreButton);
                        //that.Interface.MoreButton = null;
                    }
                }
                else if (that.Interface.MoreButton) {
                    if (that.Options.MoreButtonBuilder) {
                        var moreContainer = that.Interface.MoreButton.parentNode;
                        moreContainer.removeChild(that.Interface.MoreButton);
                        that.Interface.MoreButton = that.Options.MoreButtonBuilder.call(that, moreContainer);

                        if (that.Interface.MoreButton) that.Interface.MoreButton.onclick = function () { that.on_data_request(); }
                    }
                    else
                        that.Interface.MoreButton.innerHTML = RVDic.More; //"+";
                }

                that.__Processing = false;
            }, function (totalCount) { that.set_total_count(totalCount); });
        },

        data_request: function (options) {
            this.on_data_request(options);
        },

        add_item: function (item) {
            var that = this;

            if (!that.get_count()) that.Interface.ItemsArea.innerHTML = "";;

            if (that.Options.ItemBuilder) that.Options.ItemBuilder(that.Interface.ItemsArea, item, {
                OnAfterAdd: function (item) { that.Objects.ItemsCount += 1; },
                OnAfterRemove: function (item) { that.Objects.ItemsCount -= 1; }
            });
        },

        get_count: function () {
            return this.Objects.ItemsCount;
        },

        get_total_count: function () {
            return this.Objects.TotalCount;
        },

        set_total_count: function (totalCount) {
            var that = this;
            that.Objects.TotalCount = (GlobalUtilities.get_type(totalCount) == "number") && totalCount > 0 ? totalCount : 0;
        },

        items_container: function () {
            return this.Interface.ItemsArea;
        }
    }
})();