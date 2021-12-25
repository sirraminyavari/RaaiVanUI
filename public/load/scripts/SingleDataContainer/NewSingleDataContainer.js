(function () {
    if (window.NewSingleDataContainer) return;

    window.NewSingleDataContainer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null,
            InputDiv: null,
            ButtonsArea: null
        };

        this.Objects = {
            Autosuggest: null,
            AutosuggestParams: params
        };

        this.Options = {
            EnableTextItem: params.EnableTextItem === true,
            Sortable: params.Sortable === true,
            UseInlineInput: params.UseInlineInput === true,
            Necessary: params.Necessary === true,
            CustomData: params.CustomData,
            NoButtons: params.NoButtons,
            OnItemAdd: params.OnItemAdd,
            OnAfterAdd: params.OnAfterAdd,
            OnItemRemove: params.OnItemRemove,
            OnAfterRemove: params.OnAfterRemove,
            OnLoad: params.OnLoad,
            CssClass: {
                ItemsContainer: "r" + GlobalUtilities.random_str(10),
                DraggableItem: "r" + GlobalUtilities.random_str(10),
                Draggable: "r" + GlobalUtilities.random_str(10),
                Placeholder: "r" + GlobalUtilities.random_str(10)
            }
        };

        this._initialize(params);
    }

    NewSingleDataContainer.prototype = {
        _initialize: function (params) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var _inputClass = that.Options.NoButtons ? "small-12 medium-12 large-12" : "small-12 medium-6 large-6";

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "flex: 1 1 auto;",
                Childs: [
                    (that.Options.UseInlineInput ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; flex-basis:0 !important;",
                        Childs: [
                            { Type: "div", Class: _inputClass, Name: "input" },
                            {
                                Type: "div", Class: "small-12 medium-6 large-6", Name: "buttons",
                                Style: that.Options.NoButtons ? "display:none;" : ""
                            }
                        ]
                    }),
                    {
                        Type: "div", Name: "items",
                        Class: "rv-trim-vertical-margins " + that.Options.CssClass.ItemsContainer,
                        Style: that.Options.UseInlineInput ? "" : "margin-top:0.5rem;"
                    }
                ]
            }], that.ContainerDiv);

            that.Interface.ItemsArea = elems["items"];
            that.Interface.InputDiv = elems["input"];
            that.Interface.ButtonsArea = elems["buttons"];

            if (that.Options.Sortable) {
                GlobalUtilities.sortable("." + that.Options.CssClass.ItemsContainer, {
                    Filters: [{ draggable: that.Options.CssClass.DraggableItem, droppable: that.Options.CssClass.ItemsContainer }],
                    DraggableClass: that.Options.CssClass.Draggable,
                    PlaceholderTarget: that.Options.CssClass.Placeholder
                });
            }

            if (!that.Options.UseInlineInput) that.append_autosuggest(elems["input"]);
            else that._add_item();

            that.validate_necessary();

            if (that.Options.OnLoad) that.Options.OnLoad.call(that);
        },

        append_autosuggest: function (container, options) {
            var that = this;

            options = options || {};
            var params = that.Objects.AutosuggestParams || {};

            var _oldOnEnter = params.OnEnter;
            var _onenter = null;

            if (that.Options.EnableTextItem) {
                if (that.Options.UseInlineInput) {
                    _onenter = function (e) {
                        var arr = that.get_items_dom();
                        arr.reverse();
                        if (arr.length && !arr[0].GetData().Title) arr[0].Focus();
                    };
                }
                else {
                    _onenter = function (e) {
                        if (_oldOnEnter) _oldOnEnter();

                        var value = GlobalUtilities.trim(as.InputElement.value);
                        if (!value) return;

                        as.InputElement.value = "";
                        if (that.has_item(value)) return;

                        if ((as.selectedIndex < 0) || ((as.selectedIndex >= 0) && (value != as.keywords[as.selectedIndex])) ||
                            !as.getRow()) {
                            that._add_item(value, value);
                            return false;
                        }
                    };
                }
            }
            
            var as = GlobalUtilities.append_autosuggest(container, GlobalUtilities.extend(params, {
                OnRemove: !that.Options.EnableTextItem || !that.Options.UseInlineInput ? null : options.OnRemove,
                OnEnter: _onenter,
                OnSelect: function () {
                    if (that.Options.UseInlineInput) return;

                    var index = this.selectedIndex;
                    that._add_item(this.keywords[index], this.values[index]);

                    as.InputElement.value = "";
                    jQuery(as.InputElement).focus();
                }
            }));

            if (that.Options.UseInlineInput) {
                jQuery(as.InputElement).on("keyup", function () {
                    if (!that.get_items(true).some((itm) => !itm.Title)) that._add_item();
                    that.validate_necessary();
                });
            }

            if (!that.Options.UseInlineInput) that.Objects.Autosuggest = as;

            return as;
        },

        validate_necessary: function () {
            var that = this;
            
            if (!that.Options.Necessary) return;

            var arr = that.get_items_dom();
            var invalid = arr.filter(itm => !itm.GetData().Title);
            
            if ((that.Objects.Autosuggest || {}).InputElement)
                that.Objects.Autosuggest.InputElement.classList[!arr.length ? "add" : "remove"]("rv-input-invalid");

            if ((invalid.length && arr.length) && (arr.length == invalid.length))
                arr.forEach(itm => itm.SetValidity(itm != invalid[0]));
            else arr.forEach(itm => itm.SetValidity(true));
        },

        buttons_area: function () {
            return this.Interface.ButtonsArea;
        },

        _add_item: function (title, id) {
            var that = this;

            if (that.has_item(id)) return;
            var _done = false;
            
            var onAdd = that.Options.OnItemAdd || function (e, d) { d(); };
            var succeed = function () {
                if (_done) return;
                _done = true;
                that.add_item(title, id);
            }

            var prevented = false;

            var _event = { Item: { ID: id, Title: title }, preventDefault: function () { prevented = true } };

            if (onAdd.call(that, _event, succeed) !== false && !prevented) succeed();
        },

        bind_data_source: function (datasource) {
            var that = this;

            var isArray = typeof (datasource) == "object" ? true : false;
            that.clear();
            isArray ? that.Objects.Autosuggest.bindArray(datasource) : that.Objects.Autosuggest.bindURL(datasource);
        },

        add_item: function (title, id, data) {
            var that = this;

            if (that.has_item(id)) return;

            var inlineRemove = that.Options.EnableTextItem && that.Options.UseInlineInput;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: that.Options.CssClass.DraggableItem, Name: "container", Style: "margin-bottom:0.5rem;",
                Childs: [{
                    Type: "div", Class: that.Options.CssClass.Placeholder, Style: "display:flex; flex-flow:row;",
                    Childs: [
                        (!that.Options.Sortable ? null : {
                            Type: "div", Class: "rv-color-soft-warm " + that.Options.CssClass.Draggable,
                            Style: "flex:0 0 auto; display:flex; align-items:center; justify-content:center;" +
                                "cursor:all-scroll; padding:0 0.5rem; padding-" + RV_Float + ":0;",
                            Childs: [1, 2].map(() => {
                                return {
                                    Type: "i", Class: "fa fa-ellipsis-v", Style: "margin:0 1px;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                };
                            })
                        }),
                        {
                            Type: "div",
                            Class: "rv-border-radius-quarter " +
                                (that.Options.UseInlineInput ? "" : "rv-bg-color-white-softer SoftShadow SoftBorder"),
                            Style: "flex:1 1 auto; display:flex; flex-flow:row; align-items:center;" +
                                (that.Options.UseInlineInput ? "" : "padding:0.3rem; cursor:default; border-color:rgb(220,220,220);"),
                            Childs: [
                                {
                                    Type: "div", Style: "flex:1 1 auto;", Name: "titleArea",
                                    Childs: that.Options.UseInlineInput ? null : [{ Type: "text", TextValue: title }]
                                },
                                (inlineRemove ? null : {
                                    Type: "div", Style: "flex:0 0 auto;",
                                    Childs: [{
                                        Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                        Attributes: [{ Name: "aria-hidden", Value: true }],
                                        Properties: [{ Name: "onclick", Value: function () { remove_option(); } }]
                                    }]
                                })
                            ]
                        },
                        { Type: "div", Style: "flex:0 0 auto; display:none; margin-" + RV_Float + ":0.5rem;", Name: "customData" }
                    ]
                }]
            }], that.Interface.ItemsArea);

            if (that.Options.UseInlineInput) {
                var allItms = that.get_items_with_dom(true);
                allItms.reverse();

                if (allItms.length && !(allItms[0].Data || {}).Title)
                    elems["container"].after(allItms[0].Dom);
            }

            var remove_option = function () {
                if (inlineRemove && !get_data().Title && (that.get_items(true).filter((itm) => !itm.Title).length <= 1)) return;

                elems["container"].parentNode.removeChild(elems["container"]);
                if (that.Options.OnItemRemove) that.Options.OnItemRemove();
                if (that.Options.OnAfterRemove) that.Options.OnAfterRemove({ ID: id, Title: title });

                that.validate_necessary();
            };

            var autosuggestObj = null;

            if (that.Options.UseInlineInput && elems["titleArea"]) {
                autosuggestObj = that.append_autosuggest(elems["titleArea"], {
                    OnRemove: function () { remove_option(); }
                });

                if (title && id) autosuggestObj.set_item(title, id);
            }

            var customData = null;

            if (that.Options.CustomData) {
                elems["customData"].style.display = "inline-block";

                that.Options.CustomData(elems["customData"], { ID: id, Title: title, Data: data }, function (p) {
                    customData = p;
                });
            }

            var get_data = elems["container"].GetData = function () {
                var index = (autosuggestObj || {}).selectedIndex;
                var inputValue = !that.Options.EnableTextItem ? null :
                    GlobalUtilities.trim(((autosuggestObj || {}).InputElement || {}).value || " ");

                return {
                    ID: inputValue || (index >= 0 ? autosuggestObj.values[index] : id),
                    Title: inputValue || (index >= 0 ? GlobalUtilities.trim(autosuggestObj.keywords[index]) : title),
                    Data: GlobalUtilities.get_type((customData || {}).Get) != "function" ? null : customData.Get()
                };
            };

            elems["container"].Focus = function () {
                if ((autosuggestObj || {}).InputElement)
                    jQuery(autosuggestObj.InputElement).focus();
            };

            elems["container"].SetValidity = function (value) {
                if ((autosuggestObj || {}).InputElement)
                    autosuggestObj.InputElement.classList[value ? "remove" : "add"]("rv-input-invalid"); 
            };

            that.validate_necessary();

            if (that.Options.OnAfterAdd) that.Options.OnAfterAdd({ ID: id, Title: title });
        },

        hide_input: function () {
            if (this.Interface.InputDiv)
                this.Interface.InputDiv.style.display = "none";
        },

        show_input: function () {
            if (this.Interface.InputDiv)
                this.Interface.InputDiv.style.display = "block";
        },

        has_item: function (id) {
            return this.get_items(true).some((itm) => itm.ID == id);
        },

        get_items_dom: function () {
            return [].filter.call((this.Interface.ItemsArea || {}).childNodes || [], (nd) => !!(nd || {}).GetData) || [];
        },

        get_items: function (all) {
            return this.get_items_dom()
                .map(nd => nd.GetData())
                .filter(dt => !!dt && (all || !!dt.Title || !!dt.ID)) || [];
        },

        get_items_with_dom: function (all) {
            return this.get_items_dom()
                .map(nd => { return { Dom: nd, Data: nd.GetData() }; })
                .filter(x => all || !!x.Data.Title || !!x.Data.ID) || [];
        },

        get_items_string: function (delimiter) {
            return this.get_items().map((itm) => itm.ID).join(delimiter || "|");
        },

        clear: function (params) {
            params = params || {};
            var that = this;

            that.Interface.ItemsArea.innerHTML = "";
            
            if (!params.SelectedOnly) that.Objects.Autosuggest.clear();
        }
    }
})();