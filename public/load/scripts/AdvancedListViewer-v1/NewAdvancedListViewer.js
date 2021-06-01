(function () {
    if (window.NewAdvancedListViewer) return;

    window.NewAdvancedListViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        
        this.Interface = {
            TotalCountArea: null,
            OptionsArea: null,
            ItemsArea: null
        }

        this.Objects = {
            CurrentItemsCount: null,
            TotalCount: null
        }

        this.Options = {
            Count: 10,
            OnOptionsInit: params.OnOptionsInit,
            OnOptionsReset: params.OnOptionsReset,
            OnDataRequest: params.OnDataRequest,
            ItemBuilder: params.ItemBuilder
        }

        this._initialize();
    }

    NewAdvancedListViewer.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            //◄ ►

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-bottom:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-8 medium-8 large-8",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; padding:0rem 1.5rem; position:relative;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:-0.2rem; right:0rem; text-align:right;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-angle-right fa-2x rv-icon-button",
                                                    Style: "font-weight:bold;", Tooltip: (RV_RTL ? RVDic.Next : RVDic.Previous),
                                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                                    Properties: [{ Name: "onclick", Value: function () { RV_RTL ? that.next() : that.previous(); } }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Style: "position:absolute; top:-0.2rem; left:0rem; text-align:left;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-angle-left fa-2x rv-icon-button",
                                                    Style: "font-weight:bold;", Tooltip: (RV_RTL ? RVDic.Previous : RVDic.Next),
                                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                                    Properties: [{ Name: "onclick", Value: function () { RV_RTL ? that.previous() : that.next(); } }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [
                                                {
                                                    Type: "number", Class: "rv-input", Name: "lowerBoundaryInput",
                                                    Style: "width:5rem; text-align:center; direction:ltr; font-size:0.7rem; padding:0.1rem 0rem;",
                                                    Attributes: [{ Name: "type", Value: "text" }, { Name: "value", Value: "1-10" }],
                                                    Properties: [{ Name: "onclick", Value: function () { this.select(); } }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "rv-input", Name: "totalCountArea",
                                            Style: "display:inline-block; padding:0.07rem 0rem; width:4rem; text-align:center;"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-4 medium-4 large-4 RevTextAlign",
                            Childs: [
                                {
                                    Type: "div", Class: "TextAlign",
                                    Style: "cursor:pointer; font-weight:bold; font-size:0.8rem;" +
                                        "display:" + (that.Options.OnOptionsInit ? "inline-block" : "none") + ";",
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                that._initialize_options(elems["optionsArea"]);
                                                jQuery(elems["optionsArea"]).animate({ height: "toggle" }, 500);
                                            }
                                        }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.Options }]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Name: "optionsArea",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "border-style:dashed; border-color:gray; margin:0.5rem 0rem; padding:0.3rem;" +
                        (that.Options.OnOptionsInit ? "" : "display:none;")
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" }
            ], that.ContainerDiv);

            that.Interface.OptionsArea = elems["optionsArea"];
            that.Interface.ItemsArea = elems["itemsArea"];

            var boundaryInput = that.Objects.LowerBoundaryInput = elems["lowerBoundaryInput"];
            that.Interface.TotalCountArea = elems["totalCountArea"];

            GlobalUtilities.set_onenter(boundaryInput, function () {
                var value = +GlobalUtilities.trim(boundaryInput.value);
                if (isNaN(value) || value <= 0) value = 1;

                if (value > that.Objects.TotalCount) return that.reset_boundary_area();

                that.Objects.LowerBoundary = value;

                that.load();
            });

            that.load();
        },

        _initialize_options: function (container) {
            var that = this;

            if (that.__OptionsInited || !that.Options.OnOptionsInit) return;
            that.__OptionsInited = true;

            that.Options.OnOptionsInit(container);
        },

        reset_boundary_area: function () {
            var that = this;

            var totalCount = isNaN(+that.Objects.TotalCount) ? 0 : +that.Objects.TotalCount;

            that.Interface.TotalCountArea.innerHTML = GlobalUtilities.convert_numbers_to_persian(RVDic.Of + " " + totalCount);

            that.Objects.LowerBoundary = +that.Objects.LowerBoundary || 1;

            that.Objects.LowerBoundaryInput.value = GlobalUtilities.convert_numbers_to_persian(
                (isNaN(+that.Objects.CurrentItemsCount) || +that.Objects.CurrentItemsCount == 0) ? 0 :
                that.Objects.LowerBoundary + " - " + ((+that.Objects.LowerBoundary) + (+that.Objects.CurrentItemsCount) - 1));
        },

        next: function () {
            var that = this;
            
            var newBoundary = +that.Objects.LowerBoundary;
            if (isNaN(newBoundary)) newBoundary = 0;

            var currentCount = +that.Objects.CurrentItemsCount;
            newBoundary += (isNaN(currentCount) || currentCount <= 0 ? 0 : currentCount);

            var totalCount = isNaN(+that.Objects.TotalCount) ? 0 : +that.Objects.TotalCount;
            
            if (newBoundary > totalCount) return;

            that.Objects.LowerBoundary = newBoundary;

            that.load();
        },

        previous: function () {
            var that = this;

            var newBoundary = (isNaN(+that.Objects.LowerBoundary) ? 0 : +that.Objects.LowerBoundary) - that.Options.Count;
            if (newBoundary <= 0) newBoundary = 1;
            if (that.Objects.LowerBoundary == newBoundary) return;

            that.Objects.LowerBoundary = newBoundary;

            that.load();
        },

        reset: function (reload) {
            var that = this;

            that.Objects.LowerBoundary = null;
            if (that.Interface.OptionsArea) that.Interface.OptionsArea.style.display = "none";
            if (that.Options.OnOptionsReset) that.Options.OnOptionsReset();
            if (reload === true) that.load();
        },

        load: function () {
            var that = this;

            that.Interface.ItemsArea.innerHTML = "";
            GlobalUtilities.loading(that.Interface.ItemsArea);

            var options = { LowerBoundary: that.Objects.LowerBoundary, Count: that.Options.Count };

            if (that.Options.OnDataRequest) that.Options.OnDataRequest(options, function (result) {
                var items = result.Items || [];

                that.Objects.TotalCount = result.TotalCount;
                that.Objects.CurrentItemsCount = items.length;

                that.Interface.ItemsArea.innerHTML = items.length > 0 ? "" :
                        "<div style='text-align:center; font-weight:bold; margin-bottom:0.5rem;'>" + RVDic.NothingToDisplay + "</div>";

                for (var i = 0, lnt = items.length; i < lnt; ++i)
                    that.add_item(items[i]);

                that.reset_boundary_area();
            });
        },

        add_item: function (item) {
            item = item || {};
            var that = this;

            if (that.Options.ItemBuilder) that.Options.ItemBuilder(that.Interface.ItemsArea, item, {
                OnAfterRemove: function (item) {
                    that.Objects.CurrentItemsCount -= 1;
                    that.Objects.TotalCount -= 1;

                    that.reset_boundary_area();
                }
            });
        }
    }
})();