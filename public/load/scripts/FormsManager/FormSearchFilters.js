(function () {
    if (window.FormSearchFilters) return;

    window.FormSearchFilters = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            FormID: params.FormID,
            OwnerID: params.OwnerID,
            FormElements: {},
            Elements: {}
        };

        this.Options = {
            Delimiter: params.Delimiter,
            OnConfirm: params.OnConfirm
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js", "FormsManager/FormElementTypes.js"], {
            OnLoad: function () { that._preinit(); }
        });
    }

    FormSearchFilters.prototype = {
        _preinit: function () {
            var that = this;
            
            FGAPI.GetFormElements({
                FormID: that.Objects.FormID, OwnerID: that.Objects.OwnerID,
                ConsiderElementLimits: true, ParseResults: true,
                ResponseHandler: function (result) {
                    that._initialize(result.Elements);
                }
            });
        },

        _initialize: function (elements) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-bottom:0.5rem;",
                    Childs: [
                        {Type: "div", Class: "small-12 medium-1 large-2"},
                        {
                            Type: "div", Class: "small-5 medium-4 large-3 rv-air-button rv-circle", Style: "font-weight:bold;",
                            Properties: [{ Name: "onclick", Value: function () { if (that.Options.OnConfirm) that.Options.OnConfirm(that.get()); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        },
                        { Type: "div", Class: "small-2 medium-2 large-2" },
                        {
                            Type: "div", Class: "small-5 medium-4 large-3 rv-air-button rv-circle", Style: "font-weight:bold;",
                            Properties: [{ Name: "onclick", Value: function () { that.clear(); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.Clean }]
                        },
                        { Type: "div", Class: "small-12 medium-1 large-2" }
                    ]
                },
                {
                    Type: "div", Class: "small-10 medium-8 large-6", Style: "margin:1rem auto;",
                    Childs: [
                        { Type: "input", Class: "rv-input", Style: "width:100%;", InnerTitle: RVDic.Search, Name: "_input" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "nothingFound",
                    Style: "text-align:center; font-size:1.2rem; color:gray; display:none;",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" }
            ], that.ContainerDiv);

            for (var i = 0, lnt = (elements || []).length; i < lnt; ++i)
                that.add_element(elems["itemsArea"], elements[i]);

            var _is_search_match = function (text, searchText) {
                text = text.split(" ");
                searchText = searchText.split(" ");

                for (var i = 0; i < (searchText || []).length; ++i) {
                    for (var x = 0; x < (text || []).length; ++x)
                        if (text[x].indexOf(searchText[i]) == 0) return true;
                }

                return false;
            };

            GlobalUtilities.set_onchangeorenter(elems["_input"], function () {
                var searchText = GlobalUtilities.trim(elems["_input"].value);
                var firstChild = elems["itemsArea"].firstChild;

                jQuery(elems["nothingFound"]).fadeOut(300);

                var hasShowed = false;

                while (firstChild) {
                    var show = !searchText || (firstChild.TheTitle && _is_search_match(firstChild.TheTitle, searchText));
                    if (show) hasShowed = true;
                    jQuery(firstChild)[show ? "fadeIn" : "fadeOut"](500);
                    firstChild = firstChild.nextSibling;
                }

                if (!hasShowed) jQuery(elems["nothingFound"]).fadeIn(500);
            });
        },

        add_separator: function (container, element) {
            var that = this;

            element.Title = Base64.decode(element.Title || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "titleArea",
                    Class: "small-12 medium-12 large-12 rv-circle WarmBackgroundColor",
                    Style: "padding:0.5rem 3rem; margin-bottom:0.5rem; text-align:center;" +
                        "font-weight:bold; font-size:0.8rem; color:white;"
                }
            ], container);

            GlobalUtilities.append_markup_text(elems["titleArea"], element.Title);
        },

        add_element: function (container, element) {
            element = element || {};
            var that = this;

            if (element.Type == "Separator") return that.add_separator(container, element);

            element.Title = Base64.decode(element.Title || "");
            element.Info = JSON.parse(Base64.decode(element.Info || "") || "{}");

            var elementId = element.ElementID || "";
            var title = element.Title;
            var type = element.Type || "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "padding:0.5rem; margin-bottom:0.5rem;", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-quarter",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: title }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "inputArea", Style: "margin-top:0.5rem;" }
                    ]
                }
            ], container);

            elems["container"].TheTitle = title;

            that.Objects.Elements[elementId] = (FormElementTypes[type] || {}).searchfilters ?
                    FormElementTypes[type].searchfilters(element) : null;
            if (that.Objects.Elements[elementId]) that.Objects.FormElements[elementId] = element;

            if (that.Objects.Elements[elementId]) elems["inputArea"].appendChild(that.Objects.Elements[elementId].Container);
        },

        clear: function () {
            var that = this;
            for (var elementId in that.Objects.Elements)
                if ((that.Objects.Elements[elementId] || {}).Clear) that.Objects.Elements[elementId].Clear();
        },

        get: function (options) {
            var that = this;
            options = options || {};

            var data = {};
            
            for (var elementId in that.Objects.Elements) {
                if ((that.Objects.Elements[elementId] || {}).Get) {
                    var dt = that.Objects.Elements[elementId].Get({ Delimiter: that.Options.Delimiter });

                    if (!options.JSON) data[elementId] = dt;
                    else if ((dt || {}).JSONValue) data[elementId] = dt.JSONValue;

                    if (data[elementId])
                        data[elementId].Type = (that.Objects.FormElements[elementId] || {}).Type;
                }
            }

            return data;
        },

        set: function (data) {
            var that = this;
            that.clear();
            for (var elementId in (data || {}))
                if ((that.Objects.Elements[elementId] || {}).Set) that.Objects.Elements[elementId].Set(data[elementId]);
        }
    }
})();