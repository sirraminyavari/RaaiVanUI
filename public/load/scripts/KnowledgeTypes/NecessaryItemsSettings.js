(function () {
    if (window.NecessaryItemsSettings) return;

    window.NecessaryItemsSettings = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            KnowledgeTypeID: params.KnowledgeTypeID
        };

        var that = this;

        GlobalUtilities.load_files(["API/KnowledgeAPI.js"], { OnLoad: function () { that._initialize(params); } });
    }

    NecessaryItemsSettings.prototype = {
        _initialize: function (params) {
            params = params || {};
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-" + RV_Float + ":1.5rem; margin-bottom:0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.KW.KnowledgeTypeSettings.CheckTheseBeforeEvaluation }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-" + RV_Float + ":2.5rem;", Name: "itemsArea"
                }
            ], that.ContainerDiv);

            for (var itm in (params.NecessaryItems || {}))
                that.add_item(elems["itemsArea"], params, itm);
        },

        add_item: function (container, params, itemName) {
            var that = this;

            var processing = false;

            var _dic = RVDic.KW.KnowledgeTypeSettings.NecessaryItems;
            var title = _dic[itemName];
            if (_dic[itemName + "_Info"]) title += " " + _dic[itemName + "_Info"];
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", 
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-soft",
                    Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "checkbox",
                                    Params: {
                                        Checked: params.NecessaryItems[itemName], Width: 18, Height: 18,
                                        OnClick: function (e, done) {
                                            e.preventDefault();

                                            if (processing) return;
                                            processing = true;

                                            var funcName = this.Checked ? "DeactiveNecessaryItem" : "ActivateNecessaryItem";

                                            KnowledgeAPI[funcName]({
                                                KnowledgeTypeID: that.Objects.KnowledgeTypeID, ItemName: itemName,
                                                ParseResults: true,
                                                ResponseHandler: function (result) {
                                                    processing = false;
                                                    if (result.ErrorText) return;
                                                    params.NecessaryItems[itemName] = !params.NecessaryItems[itemName];
                                                    done(true);
                                                }
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: title }]
                        }
                    ]
                }
            ], container);
        }
    }
})();