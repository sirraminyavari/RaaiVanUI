(function () {
    if (window.IDPattern) return;

    var VALID_SYMBOLS = ["-", "_", "/"];

    var VALID_ITEMS = ["AlphaNumeric"].concat(VALID_SYMBOLS).concat([
        "FormField", "AreaID", "FVersionID", "PVersionID", "VersionCounter",
        "PYear", "PYearS", "PMonth", "PDay", "GYear", "GYearS", "GMonth", "GDay", "RND",
        "NCount", "NCountPY", "NCountGY", "NCountS", "NCountSPY", "NCountSGY"
    ]);

    window.IDPattern = function (params) {
        params = params || {};

        this.Interface = {
            Pattern: null,
            Example: null
        };

        this.Objects = {
            NodeTypeID: params.NodeTypeID
        };

        this.Options = {
            InitialValue: params.InitialValue,
            OnSave: params.OnSave || function () { }
        };
        
        this.initialize();
    };

    IDPattern.prototype = {
        initialize: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;s", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "pattern",
                            Style: "direction:ltr; text-align:center; margin-bottom:1rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "example",
                            Style: "text-align:center; margin-bottom:1rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center;",
                            Childs: VALID_ITEMS.map(function (itm) {
                                var obj = { Name: itm, Title: RVDic.CN.AddIDPattern[itm] || itm };

                                return {
                                    Type: "div", Class: "rv-air-button rv-circle",
                                    Style: "display:inline-block; margin:0.2rem; padding:0.2rem 1rem; font-size:0.8rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.add_pattern_part(elems["pattern"], obj); } }],
                                    Childs: [{ Type: "text", TextValue: obj.Title }]
                                };
                            })
                        },
                        {
                            Type: "div", Class: "small-8 medium-6 large-4 ActionButton",
                            Style: "margin:1rem auto 0 auto;",
                            Properties: [{ Name: "onclick", Value: function () { _on_save(); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            that.Interface.Pattern = elems["pattern"];
            that.Interface.Example = elems["example"];

            var saved = false;

            var showed = GlobalUtilities.show(elems["container"], {
                OnClose: function () {
                    if (!saved) GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveTheChanges, function (r) {
                        if (r) _on_save();
                    });
                }
            });

            var _on_save = function () {
                if (saved) return;
                saved = true;

                that.Options.OnSave({ Pattern: that.get_pattern() });
                showed.Close();
            };

            IDPattern.parse_pattern(that.Options.InitialValue).forEach(function (value, index, self) {
                that._add_pattern_part(elems["pattern"], value, value, index != (self.length - 1));
            });
        },

        get_pattern_parts: function () {
            var that = this;

            var parts = [];

            var firstChild = (that.Interface.Pattern || {}).firstChild;

            while (firstChild && firstChild.PatternData) {
                parts.push(firstChild.PatternData);
                firstChild = firstChild.nextSibling;
            }

            return parts;
        },

        get_pattern: function () {
            var that = this;

            var pattern = "", parts = that.get_pattern_parts();

            for (var i = 0; i < parts.length; ++i)
                pattern += parts[i].Pattern;

            return pattern;
        },

        show_example: function () {
            var that = this;

            var pattern = that.get_pattern();

            CNAPI.GenerateAdditionalID({
                NodeTypeID: that.Objects.NodeTypeID, AdditionalIDPattern: Base64.encode(pattern), ParseResults: true,
                ResponseHandler: function (result) {
                    if (!result.AdditionalID || (pattern != that.get_pattern())) return;

                    var dic = result.Dic || {};

                    var parts = that.get_pattern_parts();
                    var arr = [];

                    for (var i = 0; i < parts.length; ++i) {
                        var nm = !dic[parts[i].Name] && (parts[i].Pattern[0] == "~") ?
                            GlobalUtilities.random(100, 999) : dic[parts[i].Name] || parts[i].Name;

                        arr.push({
                            Type: "div",
                            Style: "display:inline-block; margin-right:0.2rem; color:" + parts[i].Color.Dark + ";",
                            Childs: [{ Type: "text", TextValue: nm }]
                        });
                    }

                    if (that.Interface.Example) {
                        jQuery(that.Interface.Example).fadeOut(500, function () {
                            that.Interface.Example.innerHTML = "";

                            GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Style: "display:inline-block; margin-left:0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Example + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block; direction:ltr;", Childs: arr }
                            ], that.Interface.Example);

                            jQuery(that.Interface.Example).fadeIn(500);
                        });
                    }
                }
            });
        },

        add_pattern_part: function (container, params) {
            params = params || {};
            var that = this;

            var lowerName = String(params.Name).toLowerCase();

            if (that[lowerName])
                that[lowerName](params, function (data) { that._add_pattern_part(container, params, data); });
            else that._add_pattern_part(container, params, null);
        },

        _add_pattern_part: function (container, params, data, ignoreUpdate) {
            params = params || {};
            data = data || {};
            var that = this;
            
            jQuery(container).fadeIn(0);

            var postfix = data.Length ? String(data.Length) : (data.ElementID ? ":" + data.ElementID : "");

            var title = params.Title;

            if (/[a-zA-Z0-9]+/.test(params.Name)) {
                title = data.Value ||
                    ("[" + params.Title + (data.Length ? " (" + RVDic.NDigits.replace("[n]", data.Length) + ")" : "") + "]");
            }

            var name = params.Name + postfix;

            var color = GlobalUtilities.generate_color(data.Value || name);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftBorder SoftShadow", Name: "container",
                    Style: "display:inline-block; margin:0.1rem; padding:0rem 0.2rem; font-size:0.75rem; border-color:rgb(200,200,200);",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-right:0.3rem;",
                            Childs: [{
                                Type: "i", Class: "fa fa-times rv-icon-button", Name: "remove",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; color:" + color.Dark,
                            Childs: [{ Type: "text", TextValue: title }]
                        }
                    ]
                }
            ], container);

            elems["container"].PatternData = {
                Pattern: data.Value || (/[a-zA-Z0-9]+/.test(params.Name) ? "~[[" + name + "]]" : name),
                Name: data.Value || name,
                Color: color
            };

            elems["remove"].onclick = function () {
                jQuery(elems["container"]).fadeOut(500, function () {
                    this.remove();
                    if (!container.firstChild) jQuery(container).fadeOut(0);

                    that.show_example();
                });
            };

            if (!ignoreUpdate) that.show_example();
        },

        alphanumeric: function (params, callback) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-1 SoftBackgroundColor",
                    Style: "width:34rem; margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Style: "text-align:center; margin-bottom:1rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: params.Title }]
                        },
                        { Type: "alphanumeric", Name: "input", Class: "rv-input", Style: "width:100%; text-align:center;" },
                        {
                            Type: "div", Style: "margin-top:8px;",
                            Childs: [
                                {
                                    Type: "div", Class: "ActionButton", Style: "width:100px; margin:0px auto;",
                                    Properties: [{ Name: "onclick", Value: function () { _do(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            var _do = function () {
                if (elems["input"].value) callback({ Value: elems["input"].value });
                showed.Close();
            };

            GlobalUtilities.set_onenter(elems["input"], function () { _do(); });

            var showed = GlobalUtilities.show(elems["container"]);

            jQuery(elems["input"]).focus();
        },

        count_select: function (params, callback) {
            params = params || {};
            var that = this;

            var parts = [];

            var _add_part = function (num) {
                var isAuto = String(num).toLowerCase() == "auto";

                parts.push({
                    Type: "div", Class: "rv-air-button rv-circle",
                    Style: "display:inline-block; margin:0.2rem; text-align:center;" +
                        "width:" + (isAuto ? "6" : "2") + "rem; height:2rem; line-height:1.5rem;",
                    Properties: [
                        {
                            Name: "onclick",
                            Value: function () {
                                callback({ Length: isNaN(num) ? null : num });
                                showed.Close();
                            }
                        }
                    ],
                    Childs: [{ Type: "text", TextValue: isAuto ? RVDic.Dynamic : String(num) }]
                });
            };

            _add_part("auto");

            for (var i = 2; i < 10; ++i)
                _add_part(i);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-1 SoftBackgroundColor",
                    Style: "width:38rem; margin:0 auto; padding:1rem; text-align:center; direction:ltr;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Style: "text-align:center; margin-bottom:1rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: params.Title }]
                        },
                        {
                            Type: "div", Class: "TextAlign Direction", Style: "text-align:center; margin-bottom:0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.DigitsCount + ":" }]
                        },
                        { Type: "div", Childs: parts }
                    ]
                }
            ]);

            var showed = GlobalUtilities.show(elems["container"]);
        },

        rnd: function (params, callback) { this.count_select(params, callback); },

        ncount: function (params, callback) { this.count_select(params, callback); },

        ncountpy: function (params, callback) { this.count_select(params, callback); },

        ncountgy: function (params, callback) { this.count_select(params, callback); },

        ncounts: function (params, callback) { this.count_select(params, callback); },

        ncountspy: function (params, callback) { this.count_select(params, callback); },

        ncountsgy: function (params, callback) { this.count_select(params, callback); },

        formfield: function (params, callback) {
            var that = this;

            that.__FormElements = that.__FormElements || { Container: null, Showed: null };

            if (that.__FormElements.Container)
                return (that.__FormElements.Showed = GlobalUtilities.show(that.__FormElements.Container));

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; margin-bottom:1rem; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.Field) }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "items" }
                    ]
                }
            ]);

            that.__FormElements.Container = elems["container"];

            GlobalUtilities.loading(elems["items"]);
            that.__FormElements.Showed = GlobalUtilities.show(elems["container"]);

            var _add_element = function (e) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "padding:0.5rem; margin-bottom:0.5rem; display:flex; flex-flow:row; cursor:pointer;",
                        Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow",
                        Properties: [
                            {
                                Name: "onclick",
                                Value: function () {
                                    callback({ ElementID: e.ElementID });
                                    that.__FormElements.Showed.Close();
                                }
                            }
                        ],
                        Childs: [
                            {
                                Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: RVDic.Title + ": " }]
                            },
                            {
                                Type: "div", Style: "flex:1 1 auto;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(e.Title) }]
                            },
                            {
                                Type: "div", Style: "flex:0 0 auto; padding-" + RV_Float + ":0.5rem;",
                                Childs: [{
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "font-size:0.7rem; padding:0.1rem 0.3rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Type + ": " + RVDic.FG.ElementTypes[e.Type] }]
                                }]
                            }
                        ]
                    }
                ], elems["items"]);
            };

            GlobalUtilities.load_files(["API/FGAPI.js"], {
                OnLoad: function () {
                    FGAPI.GetFormElements({
                        OwnerID: that.Objects.NodeTypeID, Type: "Node", ParseResults: true,
                        ResponseHandler: function (result) {
                            if (!(result.Elements || []).length) return (elems["items"].innerHTML =
                                "<div style='text-align:center;'>" + RVDic.MSG.AdditionalIDPatternFormElementNotFound + "</div>");

                            elems["items"].innerHTML = "";

                            (result.Elements || [])
                                .filter(function (e) {
                                    return ["Text", "Numeric", "Select", "Node"].some(function (s) { return s == e.Type; });
                                })
                                .forEach(function (e) { _add_element(e); });
                        }
                    });
                }
            });
        }
    };

    IDPattern.get_first_part = function (pattern) {
        if (!pattern || (GlobalUtilities.get_type(pattern) != "string")) return "";

        for (var i = 0; i < VALID_ITEMS.length; ++i)
            if (pattern.indexOf(VALID_ITEMS[i]) == 0) return VALID_ITEMS[i];

        var ind = pattern.indexOf("~");
        var closeInd = pattern.indexOf("]]");

        if (ind != 0) {
            for (var x = 0; x < VALID_SYMBOLS.length; ++x) {
                var sInd = pattern.indexOf(VALID_SYMBOLS[x]);
                if (sInd > 0) {
                    return IDPattern.get_first_part(pattern.substr(0, sInd));
                }
            }

            return ind < 0 ? pattern.substr(0) : pattern.substr(0, ind);
        }
        else if ((ind == 0) && (closeInd > 0)) return pattern.substr(0, closeInd + 2);
        else return "";
    }

    IDPattern.parse_pattern = function (pattern) {
        var parts = [];

        while (true) {
            var firstPart = IDPattern.get_first_part(pattern);

            if (!firstPart) break;

            parts.push(firstPart);
            pattern = pattern.substr(firstPart.length);
        }

        return parts.map(function (p) {
            var isTemplate = (p.indexOf("~[[") >= 0) && (p.indexOf("]]") >= 0);
            var isSymbol = !isTemplate && VALID_SYMBOLS.some(function (s) { return s == p; });

            if (!isTemplate) {
                return {
                    Name: isSymbol ? p : "AlphaNumeric",
                    Title: isSymbol ? p : RVDic.CN.AddIDPattern.AlphaNumeric,
                    Value: isSymbol ? null : p
                };
            }
            else {
                p = p.substr(3, p.length - 5);

                var elementId = !/\:[0-9A-Za-z\-]{36}$/ig.test(p || "_") ? "" : p.substr(p.length - 36);
                if (elementId) p = p.substr(0, p.length - 37);

                var firstDigit = p.match(/\d/);
                var numInd = p.indexOf(firstDigit);
                var length = numInd <= 0 ? 0 : Number(p.substr(numInd));

                if (numInd >= 0) p = p.substr(0, numInd);

                return { Name: p, Title: RVDic.CN.AddIDPattern[p] || p, ElementID: elementId, Length: isNaN(length) ? 0 : length };
            };
        });
    }
})();