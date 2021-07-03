(function () {
    if (window.RVAccordion) return;

    window.RVAccordion = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Container.classList.add("rv-trim-vertical-margins");
    };

    RVAccordion.prototype = {
        add_item: function (item) {
            var that = this;
            item = item || {};

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "margin-bottom:0.5rem; padding:0.5rem; cursor:pointer;", Name: "_div",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-softer-soft SoftShadow",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "name",
                            Style: "position:relative; padding-" + RV_RevFloat + ":2rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "i", Name: "arrow",
                                                    Class: "fa fa-chevron-down fa-lg rv-icon-button",
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "title" }
                            ]
                        },
                        {
                            Type: "div", Name: "items",
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-trim-vertical-margins",
                            Style: "display:none; margin-top:0.5rem; padding:0rem; background-color:white; cursor:default;",
                            Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); }}]
                        }
                    ]
                }
            ], that.Container);

            if (GlobalUtilities.get_type(item.Title) == "function") {
                var titleAdded = false;

                var _add = function (o) {
                    if (titleAdded || !o) return;
                    titleAdded = true;
                    elems["title"].appendChild(o);
                };

                _add(item.Title(function (o) { _add(o); }));
            }
            else {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "title", Style: "font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: item.Title }]
                    }
                ], elems["title"]);
            }

            elems["_div"].Collapse = function () {
                if (elems["items"].style.display != "none") jQuery(elems["items"]).animate({ height: "toggle", padding: "0rem" }, 500);
                elems["arrow"].setAttribute("class", "fa fa-chevron-down fa-lg rv-icon-button");
                elems["_div"].IsShown = false;
            };

            elems["_div"].Expand = function () {
                if (elems["items"].style.display == "none") jQuery(elems["items"]).animate({ height: "toggle", padding: "0.5rem" }, 500);
                elems["arrow"].setAttribute("class", "fa fa-chevron-up fa-lg rv-icon-button");
                elems["_div"].IsShown = true;
            };

            var _click = function (doNotChangeSelf) {
                if (that._ShowHideProcessing) return;
                that._ShowHideProcessing = true;

                var first = that.Container.firstChild;
                while (first) {
                    if (first != elems["_div"]) { if (first.Collapse) first.Collapse(); }
                    else if (first.IsShown && !doNotChangeSelf) { if (first.Collapse) first.Collapse(); }
                    else { if (first.Expand && !doNotChangeSelf) first.Expand(); }

                    first = first.nextSibling;
                }

                setTimeout(function () { that._ShowHideProcessing = false; }, 500);
            };

            elems["_div"].onclick = function () { _click(); };

            return {
                items_section: function () { return elems["items"]; },
                expand: function () { _click(elems["_div"].IsShown === true); },
                collapse: function () { elems["_div"].Collapse(); },
                hide: function (speed) { jQuery(elems["_div"]).fadeOut(speed || 500); },
                show: function (speed) { jQuery(elems["_div"]).fadeIn(speed || 500); } ,
            };
        }
    };
})();