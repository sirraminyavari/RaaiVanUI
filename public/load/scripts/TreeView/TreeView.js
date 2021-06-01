(function () {
    if (window.TreeView) return;

    window.TreeView = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;

        this.Options = {
            DataRequest: params.DataRequest,
            Item: params.Item,
            PathVariableName: params.PathVariableName,
            TitleBuilder: params.TitleBuilder,
            OnClick: params.OnClick,
            OnItemAdd: params.OnItemAdd
        };

        this.initialize(params);
    }

    TreeView.prototype = {
        initialize: function (params) {
            params = params || {};
            var that = this;

            if (!that.Options.DataRequest) that.add_items(that.Container, params.Items);
            else that.data_request(that.Container);
        },

        reset: function () {
            var that = this;

            jQuery(that.Container).animate({ height: "toggle" }, 500, function () {
                jQuery(that.Container).html("").fadeIn(500);
                that.data_request(that.Container);
            });
        },

        data_request: function (container, node) {
            var that = this;

            if (!that.Options.DataRequest || !container || container.IsLoading) return;
            container.IsLoading = true;

            GlobalUtilities.loading(container);

            setTimeout(function () {
                that.Options.DataRequest(node, function (arr) {
                    container.innerHTML = "";
                    container.IsLoading = false;
                    if (node) node.Childs = arr;

                    that.add_items(container, arr);
                });
            }, 1000);
        },

        add_items: function (container, items) {
            var that = this;

            for (var i = 0, lnt = (items || []).length; i < lnt; ++i)
                that.add_item(container, items[i]);
        },

        add_item: function (container, item, parent) {
            var that = this;

            var oldItem = item;
            if (GlobalUtilities.get_type(that.Options.Item) == "function") item = that.Options.Item(item);

            if (!item) return;

            if (that.Options.PathVariableName) {
                var _path = [];
                for (var i = 0; i < ((parent || {}).Path || []).length; ++i)
                    _path.push(parent[that.Options.PathVariableName][i]);
                _path.push(oldItem);
                oldItem[that.Options.PathVariableName] = _path;
            };

            var hasChild = ((item.Childs || []).length > 0) || (item.Childs === true && that.Options.DataRequest);
            var childsContainer = null;
            var childsVisibile = false;

            var name = Base64.decode(item.Name);
            var title = Base64.decode(item.Title);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",  Name: "container",
                    Style: "padding-" + RV_Float + ":1.1rem; position:relative; cursor:pointer; display:none;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.2rem;" + RV_Float + ":0rem; bottom:0rem; width:1rem; text-align:center;",
                            Childs: !hasChild ? null : [
                                {
                                    Type: "i", Class: "fa fa-plus-square-o rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function (e) {
                                                if (!childsContainer) return;

                                                var to = (oldItem.Childs || []).length ? 500 : 0;

                                                jQuery(childsContainer).animate({ height: "toggle" }, to, function () {
                                                    if ((oldItem.Childs || []).length) return;
                                                    if (that.Options.DataRequest) that.data_request(childsContainer, oldItem);
                                                });

                                                childsVisibile = !childsVisibile;
                                                this.setAttribute("class", "fa rv-icon-button fa-" + (childsVisibile ? "minus" : "plus") + "-square-o");
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Name: "title",
                            Class: "small-12 medium-12 large-12 rv-bg-color-trans-soft rv-border-radius-quarter",
                            Style: "padding:0.1rem 0.2rem; margin:0.15rem 0rem; border-width:0rem;"
                        }
                    ]
                }
            ], container);

            var ttlObj = !that.Options.TitleBuilder ? null : that.Options.TitleBuilder(oldItem, {
                Remove: function () {
                    jQuery(elems["container"]).animate({ height: "toggle" }, 500, function () {
                        jQuery(elems["container"]).remove();
                    });
                }
            });

            if (ttlObj) elems["title"].appendChild(ttlObj);
            else GlobalUtilities.create_nested_elements([{ Type: "text", TextValue: title }], elems["title"]);

            if (hasChild) {
                childsContainer = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "padding-" + RV_Float + ":1rem; display:none;", Name: "_div"
                    }
                ], container)["_div"];
                
                //jQuery(childsContainer).animate({ height: "toggle" }, 0);

                for (var i = 0, lnt = item.Childs.length; i < lnt; ++i)
                    that.add_item(childsContainer, item.Childs[i], oldItem) ;
            }

            that.__Titles = that.__Titles || [];

            that.__Titles.push(elems["title"]);

            var _set_classes = function () {
                for (var i = 0, lnt = that.__Titles.length; i < lnt; ++i) {
                    var cls = that.__Titles[i] == elems["title"] ? "rv-air-button TextAlign" : "rv-bg-color-trans-soft";
                    that.__Titles[i].setAttribute("class", "small-12 medium-12 large-12 rv-border-radius-quarter " + cls);
                }
            };

            elems["title"].onclick = function (e) {
                if (GlobalUtilities.get_type(that.Options.OnClick) == "function") {
                    e.TitleElement = elems["title"];
                    that.Options.OnClick(e, oldItem, function () { _set_classes(); });
                }
                else _set_classes();
            };

            jQuery(elems["container"]).animate({ height: "toggle" }, 500);

            if (that.Options.OnItemAdd) that.Options.OnItemAdd({ TitleElement: elems["title"] }, oldItem);
        }
    }
})();