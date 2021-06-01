(function () {
    if (window.TabsManager) return;

    window.TabsManager = function (params) {
        params = params || {};
        this.ContainerDiv = typeof (params.ContainerDiv) == "object" ?
            params.ContainerDiv : document.getElementById(params.ContainerDiv || "");
        if (this.ContainerDiv == null) return;

        this.PagesArea = typeof (params.PagesArea) == "object" ?
            params.PagesArea : document.getElementById(params.PagesArea || "");

        this.Options = params.Options || {};

        if (params.OnClick) this.OnClick = params.OnClick;

        this.Tabs = [];

        this._create_tabs({ Pages: params.Pages });
    }

    TabsManager.prototype = {
        _initialize: function (params) {
            params = params || {};
        },

        hide_tabs: function () { this.ContainerDiv.style.display = "none"; },
        show_tabs: function () { this.ContainerDiv.style.display = "block"; },

        add_tab: function (page) {
            var that = this;

            var hasPagesArea = this.PagesArea != null;
            var pageTitle = page.Title || "";
            var removable = page.Removable === true;

            var _newPage = typeof (page.Page) == "object" ? page.Page : document.getElementById(page.Page || "");
            if ((!hasPagesArea && _newPage == null) || (_newPage == null && pageTitle == "")) return;
            if (_newPage == null) _newPage = document.createElement("div");

            if (hasPagesArea && page.FixedPage !== true) this.PagesArea.appendChild(_newPage);
            _newPage.style.display = "none";

            var tabButton = null;

            if (page.Button) {
                tabButton = GlobalUtilities.get_type(page.Button) == "function" ? page.Button(this.ContainerDiv, page) :
                    (typeof (page.Button) == "object" ? page.Button : document.getElementById(page.Button));
                tabButton.Foreign = true;
                tabButton.classList.add("rv-tab" + (page.Disabled ? "-disabled" : ""));
            }
            else {
                var _options = []
                if (removable) {
                    _options.push({
                        Type: "i", Class: "fa fa-times rv-icon-button", Name: "removeButton",
                        Style: "margin-top:0.1rem; margin-" + RV_Float + ":1rem;",
                        Attributes: [{ Name: "aria-hidden", Value: true }]
                    });
                }

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-tab", Name: "newTabId",
                        Style: "margin:0.2rem 0.4rem; display:inline-block;" + GlobalUtilities.border_radius("0.2rem"),
                        Childs: [
                            { Type: "div", Class: "Float", Childs: [{ Type: "text", TextValue: pageTitle }] },
                            { Type: "div", Class: "RevFloat", Childs: _options },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    }
                ], this.ContainerDiv);

                tabButton = elems["newTabId"];
                var removeButton = elems["removeButton"];

                if (removeButton) removeButton.onclick = function () {
                    var _onTabClick = tabButton.onclick;
                    tabButton.onclick = null;
                    that.remove_tab(_newPage, function () {
                        tabButton.onclick = _onTabClick;
                    });
                }
            }

            tabButton.RelatedPage = _newPage;
            tabButton.__OnClick = page.OnClick || this.OnClick;
            tabButton.onclick = function () {
                if (newTab.Disabled) return;

                that.goto_page(this.RelatedPage);
                if (this.__OnClick) this.__OnClick();
            }

            var newTab = {
                Tab: tabButton,
                Page: _newPage,
                IsActive: false,
                IsHidden: !!page.Hidden,
                OnActive: page.OnActive,
                OnDeactive: page.OnDeactive,
                Disabled: page.Disabled === true,
                Next: null,
                Previous: null
            };

            if (newTab.IsHidden) jQuery(newTab.Tab).fadeOut(0);

            this.Tabs.push(newTab);

            return newTab;
        },

        _create_tabs: function (params) {
            var that = this;

            for (var i = 0, lnt = ((params || {}).Pages || []).length; i < lnt; ++i)
                that.add_tab(params.Pages[i]);

            for (var i = 0; i < (that.Tabs || []).length; ++i) {
                if (i > 0) that.Tabs[i].Previous = that.Tabs[i - 1];
                if (i < (that.Tabs.length - 1)) that.Tabs[i].Next = that.Tabs[i + 1];
            }
        },

        get: function (page) {
            var that = this;

            if (page) {
                for (var i = 0, lnt = that.Tabs.length; i < lnt; ++i)
                    if (that.Tabs[i].Page == page) return that.Tabs[i];
            }
            else {
                for (var i = 0; i < (that.Tabs || []).length; ++i)
                    if (that.Tabs[i].IsActive) return that.Tabs[i];
            }

            return null;
        },

        enable: function (page) {
            var that = this;

            for (var i = 0, lnt = that.Tabs.length; i < lnt; ++i) {
                if (that.Tabs[i].Page == page) {
                    that.Tabs[i].Disabled = false;
                    that.Tabs[i].Tab.setAttribute("class", "rv-tab");
                }
            }
        },

        unhide: function (page) {
            var that = this;

            for (var i = 0, lnt = that.Tabs.length; i < lnt; ++i) {
                if (that.Tabs[i].Page == page) {
                    that.Tabs[i].IsHidden = false;
                    jQuery(that.Tabs[i].Tab).fadeIn(500);
                }
            }
        },

        remove_tab: function (page, callback) {
            var that = this;
            callback = callback || function () { };
            
            for (var i = 0, lnt = that.Tabs.length; i < lnt; ++i) {
                if (that.Tabs[i] != null && that.Tabs[i].Page === page) {
                    var isActive = GlobalUtilities.is_visible(page);
                    
                    jQuery(that.Tabs[i].Tab).fadeOut(500);

                    jQuery(that.Tabs[i].Page).fadeOut(500, function () {
                        that.Tabs[i].Page.parentNode.removeChild(that.Tabs[i].Page);
                        that.Tabs[i].Tab.parentNode.removeChild(that.Tabs[i].Tab);

                        that.Tabs[i] = null;

                        if (!isActive) return;

                        for (var j = i - 1; j >= 0; --j)
                            if (that.Tabs[j] != null) return that.goto_page(that.Tabs[j].Page);

                        for (var j = i + 1, _ln = this.Tabs.length; j < _ln; ++j)
                            if (that.Tabs[j] != null) return that.goto_page(that.Tabs[j].Page);

                        callback();
                    });

                    return;
                }
            }
        },

        goto_page: function (page) {
            var that = this;

            if (that.ChangingTab) return;
            that.ChangingTab = true;

            for (var i = 0, lnt = that.Tabs.length; i < lnt; ++i) {
                if (that.Tabs[i] === null) continue;

                if (!(that.Tabs[i].Page === page || that.Tabs[i].Page.id === page || i === page)) {
                    that.Tabs[i].Tab.setAttribute("class", "rv-tab" + (that.Tabs[i].Disabled ? "-disabled" : ""));
                    that.Tabs[i].IsActive = false;
                    jQuery(that.Tabs[i].Page).fadeOut(500);
                    if (that.Tabs[i].OnDeactive) that.Tabs[i].OnDeactive(i, that.Tabs[i]);
                }
                else that.Tabs[i].Tab.setAttribute("class", "rv-tab-selected");
            }

            setTimeout(function () {
                for (var i = 0, lnt = that.Tabs.length; i < lnt; ++i) {
                    if (!that.Tabs[i]) continue;

                    if (that.Tabs[i].Page === page || that.Tabs[i].Page.id === page || i === page) {
                        that.Tabs[i].IsActive = true;
                        jQuery(that.Tabs[i].Page).fadeIn(500, function () { that.ChangingTab = false; });
                        if (that.Tabs[i].OnActive) that.Tabs[i].OnActive(i, that.Tabs[i]);
                    }
                }
            }, 500);
        },

        next: function () {
            var that = this;

            for (var i = 0; i < (that.Tabs || []).length; ++i) {
                if (that.Tabs[i].IsActive && (i < (that.Tabs.length - 1)) && (that.Tabs[i + 1] || {}).Page)
                    that.goto_page(that.Tabs[i + 1].Page);
            }
        },

        previous: function () {
            var that = this;

            for (var i = 0; i < (that.Tabs || []).length; ++i) {
                if (that.Tabs[i].IsActive && (i > 0) && (that.Tabs[i - 1] || {}).Page)
                    that.goto_page(that.Tabs[i - 1].Page);
            }
        },

        get_pages_count: function () {
            var count = 0;

            for (var i = 0, lnt = this.Tabs.length; i < lnt; ++i) {
                if (this.Tabs[i] === null) continue;
                ++count;
            }

            return count;
        }
    }
})();