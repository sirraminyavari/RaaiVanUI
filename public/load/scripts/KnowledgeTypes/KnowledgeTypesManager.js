(function () {
    if (window.KnowledgeTypesManager) return;

    window.KnowledgeTypesManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        
        this.Interface = {
            SearchInput: null,
            ItemsArea: null,
            CommonPage: null
        };

        this.Objects = {
            Items: {},
            LastSelectedItemID: null
        };

        var that = this;

        GlobalUtilities.load_files(["KnowledgeTypes/KnowledgeTypeSettings.js", "API/CNAPI.js", "API/KnowledgeAPI.js"], {
            OnLoad: function () { that._initialize(); }
        });
    }

    KnowledgeTypesManager.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center;font-weight:bold; margin-bottom:1rem;" +
                        "font-size:1.2rem; color:rgb(100,100,100);",
                    Childs: [
                        { Type: "text", TextValue: RVDic.PRVC.KnowledgeAdmin },
                        { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_evaluationprocesses" } }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-4 large-3",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", InnerTitle: RVDic.SearchText + "...",
                                    Style: "width:100%;", Name: "searchInput",
                                    Attributes: [{ Name: "type", Value: "text" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-top:0.5rem;", Name: "itemsArea"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-8 large-9", Name: "commonPage",
                    Style: "padding-" + RV_Float + ":1rem;"
                }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];
            that.Interface.CommonPage = elems["commonPage"];

            that.Interface.SearchInput = elems["searchInput"];

            GlobalUtilities.set_onchangeorenter(that.Interface.SearchInput, function () {
                that.show_items({ SearchText: that.get_search_text() });
            });
            
            that.show_items();
        },

        get_search_text: function () {
            var that = this;
            return GlobalUtilities.trim(that.Interface.SearchInput.value);
        },

        show_items: function (params) {
            params = params || {};
            var that = this;

            if (that.__GettingItems) return;
            that.__GettingItems = true;

            that._show_items(params, function () { that.__GettingItems = false; });
        },

        _show_items: function (params, done) {
            params = params || {};
            var that = this;
            
            that.Interface.CommonPage.innerHTML = "";
            that.Interface.ItemsArea.innerHTML = "";
            GlobalUtilities.loading(that.Interface.ItemsArea);
            
            CNAPI.GetNodeTypes({
                IsKnowledge: true, SearchText: Base64.encode(params.SearchText), Count: 1000000, ParseResults: true,
                ResponseHandler: function (result) {
                    if ((that.get_search_text() || "_") != (params.SearchText || "_")) return done();

                    that.Interface.ItemsArea.innerHTML = "";

                    jQuery.each(result.NodeTypes || [], function (ind, val) { that.add_item(val); });

                    done();
                }
            });
        },

        add_item: function (params) {
            params = params || {};
            var that = this;

            var itemId = params.NodeTypeID;
            var name = Base64.decode(params.TypeName);
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemDiv", Tooltip: name,
                    Class: "small-12 medium-12 large-12 rv-selectable-title Ellipsis",
                    Style: "background-color:#f5f9ff; padding:0.2rem; margin:0.2rem 0rem; position:relative;",
                    Properties: [{ Name: "onclick", Value: function () { that.on_item_select(itemId); } }],
                    Childs: [{ Type: "text", TextValue: name }]
                }
            ], that.Interface.ItemsArea);

            var itemDiv = elems["itemDiv"];
            var nameText = elems["nameText"];

            that.Objects.Items[itemId] = GlobalUtilities.extend(params, {
                ContainerDiv: itemDiv,
                NodeTypeID: itemId,
                Title: name,
                Settings: null,
                Selected: false
            });
        },

        on_item_select: function (itemId) {
            var that = this;

            var lastSelectedItemId = that.Objects.LastSelectedItemID;
            if (lastSelectedItemId != null && that.Objects.Items[lastSelectedItemId]) {
                var _itm = that.Objects.Items[lastSelectedItemId];
                _itm.Selected = false;
                _itm.ContainerDiv.style.backgroundColor = "#f5f9ff";
            }

            that.Objects.LastSelectedItemID = itemId;

            var item = that.Objects.Items[itemId];
            item.Selected = true;
            item.ContainerDiv.style.backgroundColor = "#ffaaaa";

            if (!item.Settings) {
                var _div = item.Settings = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "padding:1rem;", Name: "_div",
                        Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor"
                    }
                ])["_div"];
                
                new KnowledgeTypeSettings(_div, { KnowledgeTypeID: itemId, KnowledgeType: Base64.decode(item.TypeName) });
            }

            jQuery(that.Interface.CommonPage).fadeOut(500, function () {
                that.Interface.CommonPage.innerHTML = "";

                jQuery(that.Interface.CommonPage).fadeOut(0, function () {
                    that.Interface.CommonPage.appendChild(item.Settings);
                    jQuery(that.Interface.CommonPage).fadeIn(500);
                });
            });
        }
    }
})();