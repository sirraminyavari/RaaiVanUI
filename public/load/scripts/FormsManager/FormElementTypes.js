(function () {
    if (window.FormElementTypes) return;

    var __CreateSelect = function (container, params) {
        params = params || {};

        var slct = GlobalUtilities.create_nested_elements([
            { Type: "select", Class: "rv-input", Name: "_slct", Style: "font-size:0.7rem;" }
        ], container)["_slct"];

        for (var i = 0, lnt = (params.Options || []).length; i < lnt; ++i) {
            GlobalUtilities.create_nested_elements([
                {
                    Type: "option", Name: "_slct", Attributes: [{ Name: "title", Value: params.Options[i].ID }],
                    Childs: [{ Type: "text", TextValue: params.Options[i].Title }]
                }
            ], slct);
        }

        return {
            Get: function () { return slct[slct.selectedIndex].title; },
            Set: function (data) {
                for (var i = 0, lnt = slct.length; i < lnt; ++i) {
                    if (slct[i].title == data) {
                        slct.selectedIndex = i;
                        return;
                    }
                }
                slct.selectedIndex = 0;
            },
            Clear: function () { slct.selectedIndex = 0; }
        }
    };

    var __CreateRadiosCheckboxes = function (container, params) {
        params = params || {};
        var isCheckbox = params.IsCheckbox === true;
        
        var inputElems = [];

        var _create_option = function (index, title, p) {
            p = p || {};

            var min = !isCheckbox && ((params.Data || []).length >= (index + 1)) ? (params.Data[index] || {}).Min : null;
            var max = !isCheckbox && ((params.Data || []).length >= (index + 1)) ? (params.Data[index] || {}).Max : null;
            
            var minIsNumber = GlobalUtilities.get_type(min) == "number";
            var maxIsNumber = GlobalUtilities.get_type(max) == "number";

            var needsNumberSelect = false;
            var floatValue = undefined;

            if (minIsNumber && maxIsNumber && (min != max)) needsNumberSelect = true;
            else if ((minIsNumber && maxIsNumber) || (minIsNumber && !maxIsNumber) || (!minIsNumber && maxIsNumber))
                floatValue = minIsNumber ? min : max;

            var checkedBgClass = "rv-bg-color-softer-soft";
            var notCheckedBgClass = "rv-bg-color-white-softer";
            var checkedClass = "fa " + (isCheckbox ? "fa-check-square" : "fa-check-circle-o") + " fa-lg";
            var notCheckedClass = "fa " + (isCheckbox ? "fa-square-o" : "fa-circle-o") + " fa-lg";

            var elemName = GlobalUtilities.random_str(20);
            var checkIconName = elemName + "icon";

            var _set_value = function (value) {
                elems[elemName].checked = value;
                elems[elemName].classList.remove(value ? notCheckedBgClass : checkedBgClass);
                elems[elemName].classList.add(value ? checkedBgClass : notCheckedBgClass);
                elems[elemName].style.fontWeight = value ? "bold" : "normal";
                elems[checkIconName].setAttribute("class", value ? checkedClass : notCheckedClass);
                elems[checkIconName].style.color = value ? "green" : "black";
            };

            var _onAfterClick = function (newValue) {
                elems[elemName].set_value(newValue);

                if (newValue && !isCheckbox) {
                    var firstChild = elems[elemName].parentNode.firstChild;
                    while (firstChild) {
                        if (firstChild.set_value && (firstChild != elems[elemName])) firstChild.set_value(false);
                        firstChild = firstChild.nextSibling;
                    }
                }
            };

            var _onclick = function () {
                var newValue = !elems[elemName].checked;
                
                if (newValue && needsNumberSelect) {
                    new __NumberSelect(Math.min(min, max), Math.max(min, max), function (num) {
                        if (GlobalUtilities.get_type(num) == "number") {
                            elems[elemName].FloatValue = num;
                            _onAfterClick(newValue);
                        }
                    });
                }
                else _onAfterClick(newValue);
            };

            return {
                Type: "div", Name: elemName,
                Class: "small-12 medium-12 large-12 rv-circle TextAlign WarmBorder " + notCheckedBgClass,
                Style: "position:relative; padding:0.2rem 3rem; margin-top:0.3rem; cursor:pointer;",
                Properties: [
                    { Name: "TheTitle", Value: title },
                    { Name: "FloatValue", Value: floatValue },
                    { Name: "checked", Value: false },
                    { Name: "set_value", Value: function (value) { _set_value(value); } },
                    { Name: "onclick", Value: function () { _onclick(); } }
                ],
                Childs: [
                    {
                        Type: "div", Style: "position:absolute; top:0.3rem; bottom:0rem; " + RV_Float + ":1rem;",
                        Childs: [
                            {
                                Type: "i", Class: notCheckedClass, Style: "color:black;", Name: checkIconName,
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [{ Type: "text", TextValue: (p.HideIndex ? "" : (index + 1) + "-  ") + title }]
                    }
                ]
            };
        };

        var options = params.Options || [];

        var isAutoSuggestMode = params.AutoSuggestMode === true;

        if (!isAutoSuggestMode)
            jQuery.each(options || [], function (ind, val) { inputElems.push(_create_option(ind, val)); });

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "autosuggest",
                        Style: "margin-bottom:0.5rem;" + (isAutoSuggestMode ? "" : "display:none;")
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "items",
                        Style: (isAutoSuggestMode ? "display:none;" : ""),
                        Childs: inputElems
                    }
                ]
            }
        ], container);

        var get_inputs = function (selectedOnly) {
            var inputs = [];
            var firstChild = elems["items"].firstChild;
            while (firstChild) {
                if (firstChild.set_value && (!selectedOnly || firstChild.checked)) inputs.push(firstChild);
                firstChild = firstChild.nextSibling;
            }
            return inputs;
        };

        var add_and_set_option = function (index, value) {
            jQuery(elems["items"]).fadeIn(0);

            var inputs = get_inputs() || [];
            for (var i = 0; i < inputs.length; ++i)
                if (inputs[i].TheTitle == value) return inputs[i].set_value(true);

            var newOption = _create_option(index, value, { HideIndex: true });

            var newElems = GlobalUtilities.create_nested_elements([newOption], elems["items"]);

            for (var k in newElems) if (!elems[k]) elems[k] = newElems[k];

            newElems[newOption.Name].set_value(true);
        };

        if (isAutoSuggestMode) {
            var autoSuggestArray = [];
            jQuery.each(options || [], function (ind, val) {
                autoSuggestArray.push([val, JSON.stringify({ ID: ind, RND: GlobalUtilities.random_str(10) })]);
            });

            GlobalUtilities.append_autosuggest(elems["autosuggest"], {
                ArrayDataSource: autoSuggestArray, InnerTitle: RVDic.SelectN.replace("[n]", RVDic.Option) + "...",
                OnSelect: function () {
                    if (!isCheckbox) elems["items"].innerHTML = "";

                    var id = JSON.parse(this.values[this.selectedIndex]).ID;
                    var value = this.keywords[this.selectedIndex];

                    this.empty();

                    add_and_set_option(id, value);
                }
            });
        }

        return {
            GetFloatValue: function () {
                if (params.IsCheckbox === true) return null;
                var inputs = get_inputs(true) || [];
                return inputs.length ? inputs[0].FloatValue : null;
            },
            Get: function () {
                var selectedTitles = [];

                jQuery.each(get_inputs(true) || [], function (ind, val) {
                    if (params.IsCheckbox === true) selectedTitles.push(val.TheTitle);
                    else selectedTitles = [val.TheTitle];
                });

                return !selectedTitles.length ? null : selectedTitles.join(" ~ ");
            },
            Set: function (data) {
                var inputs = get_inputs() || [];

                jQuery.each(inputs, function (ind, val) { val.set_value(false); });

                jQuery.each(String(data || "").split("~"), function (i, str) {
                    str = GlobalUtilities.trim(str);
                    if (!str) return;

                    if (isAutoSuggestMode) add_and_set_option(i, str);
                    else jQuery.each(inputs, function (ind, val) { if (val.TheTitle == str) val.set_value(true); });
                });
            },
            Clear: function () {
                jQuery.each(get_inputs() || [], function (ind, val) { val.set_value(false); });
                if (isAutoSuggestMode) elems["items"].innerHTML = "";
            }
        }
    };

    var __CreatePollItem = function (container, params) {
        var value = params.Value;
        var min = params.Min;
        var max = params.Max;
        var title = params.Title || value;
        var percent = Number(Number(params.Percent).toFixed(2));
        var count = params.Count;
        var selected = params.Selected;
        var editable = params.Editable;
        var multiSelect = params.MultiSelect;

        var _get_selected_count = function () {
            var cnt = 0;
            var firstChild = container.firstChild;
            while (firstChild) {
                if (firstChild.Selected)++cnt;
                firstChild = firstChild.nextSibling;
            }
            return cnt;
        };

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Name: "container",
                Tooltip: GlobalUtilities.convert_numbers_to_persian(count + " (" + percent + "%)"),
                Class: "small-12 medium-12 large-12 rv-circle SoftBorder" + (!editable ? "" : " rv-bg-color-white-softer"),
                Style: "position:relative; margin:0.3rem 0rem; padding:0.3rem 0.8rem;" +
                    "border-width:" + (selected ? "0.15" : "0.1") + "rem; padding-" + RV_RevFloat + ":5rem;" +
                    (editable ? "cursor:pointer;" : "background-color:white;"),
                Properties: !editable ? null : [
                    {
                        Name: "onclick",
                        Value: function () {
                            if (selected && (_get_selected_count() != 1)) unselect();
                            else select(true);
                        }
                    }
                ],
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 Ellipsis", Name: "value",
                        Style: "font-size:0.8rem;" + (!selected ? "color:rgb(100,100,100);" : "color:black; font-weight:bold;"),
                        Childs: [{ Type: "text", TextValue: title }]
                    },
                    {
                        Type: "div",
                        Style: "position:absolute; top:0.2rem; bottom:0.2rem; left:0.2rem; right:0.2rem;" +
                            (percent ? "" : "display:none;"),
                        Childs: [
                            {
                                Type: "div", Class: "rv-air-button rv-circle",
                                Style: "height:100%; width:" + percent + "%; padding:0.1rem 0rem;" +
                                    (editable ? "" : "cursor:default;")
                            }
                        ]
                    },
                    {
                        Type: "div", Name: "check",
                        Style: "position:absolute; top:0rem; bottom:0rem; width:2rem;" +
                            "text-align:center;" + RV_RevFloat + ":0rem;" + (selected ? "" : "display:none;"),
                        Childs: [
                            {
                                Type: "middle",
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-check fa-lg", Style: "color:green;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        Type: "div",
                        Style: "position:absolute; top:0rem; bottom:0rem; width:2.5rem;" +
                            "text-align:center;" + RV_RevFloat + ":2rem; color:black; font-size:0.7rem;",
                        Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: percent + "%" }] }]
                    }
                ]
            }
        ], container);

        var needsNumberSelect = false;

        var _select = function () {
            elems["container"].style.borderWidth = "0.15rem";
            elems["value"].style.fontWeight = "bold";
            elems["value"].style.color = "black";
            jQuery(elems["check"]).fadeIn(500);
            elems["container"].Selected = selected = true;

            if (!multiSelect) {
                var firstChild = container.firstChild;
                while (firstChild) {
                    if ((firstChild != elems["container"]) && firstChild.Unselect) firstChild.Unselect();
                    firstChild = firstChild.nextSibling;
                }
            }
        };

        var select = function (isClicked) {
            if (!needsNumberSelect || !isClicked) _select();
            else new __NumberSelect(Math.min(min, max), Math.max(min, max), function (selectedNum) {
                if (GlobalUtilities.get_type(selectedNum) == "number") {
                    elems["container"].FloatValue = selectedNum;
                    _select();
                }
            });

        };

        var unselect = function () {
            elems["container"].style.borderWidth = "0.1rem";
            elems["value"].style.fontWeight = "normal";
            elems["value"].style.color = "rgb(100,100,100)";
            jQuery(elems["check"]).fadeOut(500);
            elems["container"].Selected = selected = false;
        };

        elems["container"].Selected = selected;
        elems["container"].TheValue = value;
        elems["container"].Select = function () { select(); };
        elems["container"].Unselect = function () { unselect(); };

        var minIsNumber = GlobalUtilities.get_type(min) == "number";
        var maxIsNumber = GlobalUtilities.get_type(max) == "number";

        if (minIsNumber && maxIsNumber && (min != max)) needsNumberSelect = true;
        else if ((minIsNumber && maxIsNumber) || (minIsNumber && !maxIsNumber) || (!minIsNumber && maxIsNumber))
            elems["container"].FloatValue = minIsNumber ? min : max;
    };

    var __NumberSelect = function (min, max, done) {
        var parts = [];

        var _add = function (n) {
            parts.push({
                Type: "div", Class: "rv-air-button rv-circle",
                Style: "display:inline-block; width:3rem; height:3rem; line-height:2rem; font-size:1.2rem;" +
                    "font-weight:bold; text-align:center; margin:0.3rem; padding:0.5rem;",
                Properties: [{ Name: "onclick", Value: function () { showed.Close(); done(n); } }],
                Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(n) }]
            });
        };

        for (var i = Math.floor(min) ; i <= Math.floor(max) ; ++i) _add(i);

        var showed = GlobalUtilities.show(GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem; text-align:center;", Name: "_div",
                Childs: parts
            }
        ])["_div"]);
    };

    window.FormElementTypeSettings = {
        SmallOptionClass: "small-12 medium-9 large-5",
        SmallOptionLabelWidth: 3,
        SwitchParams: { Height: 1, MiniMode: true },
        validate_name: function (name) {
            name = GlobalUtilities.trim(name || " ");
            return !name || /^[a-zA-Z0-9_]{1,100}$/ig.test(name);
        }
    };

    window.FormElementTypes = {
        Text: {
            isempty: function (params) { return !(params || {}).TextValue; },

            nothing2display: function (container) {
                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; color:rgb(150,150,150);",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }], container);
            },
            
            patterns: {
                email: { Pattern: "[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\\.[A-Za-z0-9-\\.]{2,}", Sample: "example@site.com" },
                hhmmss: { Pattern: "([01][0-9]|2[0-3])(:[0-5][0-9]){2}", Sample: "23:59:59" },
                hhmm: { Pattern: "([01][0-9]|2[0-3]):[0-5][0-9]", Sample: "23:59" },
                url: { Pattern: "((([hH][tT][tT][pP][sS]?)|([fF][tT][pP])):\\/\\/[^\\s<>]+)", Sample: "http://inknowtex.ir" },
                mobile: { Pattern: "09[0-9]{9}", Sample: "093588888888" },
                nationalid: { Pattern: "[0-9]{10}", Sample: "0022446688" }
            },

            get_pattern: function (name) {
                return FormElementTypes.Text.patterns[String(name).toLowerCase()] || {};
            },

            edit: function (info, params) {
                params = params || {};

                if (params.IsParagraph) return null;

                var isSimpleText = !!params.IsSimpleText;
                
                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        (isSimpleText ? null : {
                            Type: "div", Style: "margin-top:0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "checkbox", Name: "useSimpleEditor" }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FG.UseSimpleEditor }]
                                }
                            ]
                        }),
                        {
                            Type: "div",
                            Style: "flex:0 0 auto; display:flex; flex-flow:row; align-items:center; margin:1rem 0;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label",
                                    Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                        "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Pattern + ":" }]
                                },
                                {
                                    Type: "div", Style: "flex:1 1 auto; display:flex; flex-flow:row;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Class: "rv-border-radius-quarter rv-ignore-" + RV_RevFloat.toLowerCase() + "-radius SoftBackgroundColor",
                                            Style: "flex:0 0 auto; padding-" + RV_Float + ":0.3rem;"
                                        },
                                        {
                                            Type: "div", Style: "flex:1 1 auto; display:flex; flex-flow:column; padding:0.5rem;",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "small-10 medium-8 large-6", Style: "flex-basis:0 !important;",
                                                    Childs: [{
                                                        Type: "select", Class: "rv-input", Name: "patternNameSelect",
                                                        Style: "width:100; font-size:0.7rem; margin-bottom:0.5rem;"
                                                    }]
                                                },
                                                {
                                                    Type: "div", Class: "small-10 medium-8 large-6", Style: "flex-basis:0 !important;",
                                                    Childs: [{
                                                        Type: "input", Class: "rv-input rv-placeholder-align-left", Name: "patternInput",
                                                        InnerTitle: "regular expression; e.g. [0-9]{4}\-[a-zA-Z]*", LatinNumbers: true,
                                                        Style: "width:100%; font-size:0.7rem; direction:ltr; text-align:left;" +
                                                            "margin-bottom:0.5rem; display:none;"
                                                    }]
                                                },
                                                {
                                                    Type: "div", Class: "small-10 medium-8 large-6", Style: "flex-basis:0 !important;",
                                                    Childs: [{
                                                        Type: "input", Class: "rv-input", Name: "placeholderInput",
                                                        Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.FG.Placeholder
                                                    }]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }]);

                var container = elems["container"];
                
                var useSimpleEditor = elems["useSimpleEditor"];
                var patternNameSelect = elems["patternNameSelect"];
                var patternInput = elems["patternInput"];
                var placeholderInput = elems["placeholderInput"];

                var _add_option = function (name, title) {
                    GlobalUtilities.create_nested_elements([{
                        Type: "option",
                        Properties: [{ Name: "theName", Value: name }],
                        Childs: [{ Type: "text", TextValue: title }]
                    }], elems["patternNameSelect"]);
                };

                _add_option(null, RVDic.PatternSelect + "...");
                for (var p in FormElementTypes.Text.patterns)
                    _add_option(p, RVDic.FG.Patterns[p]);
                _add_option("custom", RVDic.Custom);

                patternNameSelect.onchange = function () {
                    var selectedIndex = this.selectedIndex;
                    var name = this.item(selectedIndex).theName;

                    jQuery(patternInput)[name == "custom" ? "fadeIn" : "fadeOut"](500);
                };
                
                jQuery(patternInput).keyup(function () {
                    patternInput.classList[GlobalUtilities.is_valid_regexp(patternInput.value) ? "remove" : "add"]("rv-input-invalid");
                });

                jQuery(patternInput).keyup();

                var _set = function (p) {
                    p = p || {};

                    if (useSimpleEditor) {
                        if (p.UseSimpleEditor === true) useSimpleEditor.check();
                        else useSimpleEditor.uncheck();
                    }

                    if (p.PatternName) {
                        for (var i = 0; i < patternNameSelect.length; ++i) {
                            if (patternNameSelect.item(i).theName == p.PatternName) {
                                patternNameSelect.selectedIndex = i;
                                jQuery(patternNameSelect).change();
                                break;
                            }
                        }
                    }
                    
                    if (p.Pattern && GlobalUtilities.is_valid_regexp(Base64.decode(p.Pattern)))
                        patternInput.value = Base64.decode(p.Pattern);

                    if (p.PlaceHolder) placeholderInput.value = Base64.decode(p.PlaceHolder);
                };

                return {
                    Container: container,
                    Clear: function () {
                        if (useSimpleEditor) useSimpleEditor.uncheck();
                        patternNameSelect.selectedIndex = 0;
                        patternInput.value = placeholderInput.value = "";
                    },
                    Set: function (p) { _set(p); },
                    Get: function () {
                        var ret = {
                            UseSimpleEditor: isSimpleText || ((useSimpleEditor || {}).checked === true)
                        };

                        var patternName = patternNameSelect.item(patternNameSelect.selectedIndex).theName;
                        if (patternName && FormElementTypes.Text.patterns[patternName]) ret.PatternName = patternName;

                        var pattern = patternName != "custom" ? null : patternInput.value;
                        if ((patternName == "custom") && !GlobalUtilities.is_valid_regexp(pattern)) return false;
                        ret.Pattern = Base64.encode(pattern);
                        
                        if (GlobalUtilities.trim(placeholderInput.value))
                            ret.PlaceHolder = Base64.encode(GlobalUtilities.trim(placeholderInput.value));

                        if (ret.Pattern || ret.PatternName) ret.UseSimpleEditor = true;
                        
                        return ret;
                    }
                };
            },

            view: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                var _set = function (p) {
                    container.innerHTML = "";

                    var info = (p || {}).Info || {};

                    var useSimpleEditor = info.UseSimpleEditor === true;
                    var patternName = info.PatternName && FormElementTypes.Text.patterns[info.PatternName] ?
                        info.PatternName : null;
                    var pattern = patternName ? null : Base64.decode(info.Pattern);
                    var placeholder = Base64.decode(info.PlaceHolder);

                    var _el = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (useSimpleEditor ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FG.UseSimpleEditor }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (patternName ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FG.UsedPattern + ":" }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FG.Patterns[patternName] }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (pattern ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FG.RegExPattern + ":" }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: pattern }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (placeholder ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FG.Placeholder + ":" }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: placeholder }]
                                }
                            ]
                        }
                    ], container);
                }

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            fill: function (params) {
                params = params || {};
                var info = params.Info || {};

                var patternObj = FormElementTypes.Text.get_pattern(info.PatternName) || {};

                var pattern = patternObj.Pattern || Base64.decode(info.Pattern);
                if (pattern && (pattern.indexOf("^") != 0)) pattern = "^" + pattern;
                if (pattern && (pattern.lastIndexOf("$") != (pattern.length - 1))) pattern += "$";
                if (!GlobalUtilities.is_valid_regexp(pattern)) pattern = null;
                
                var placeHolder = Base64.decode(info.PlaceHolder) || (!info.PatternName ? "" :
                    RVDic.FG.Patterns[info.PatternName] + " (" + RVDic.Example + ": " + patternObj.Sample + ")");
                
                var useSimpleInput = !!pattern || !!info.UseSimpleEditor;
                
                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                var ata = null, simpleInput = null;

                var is_valid_input = function () {
                    if (simpleInput && (GlobalUtilities.get_type(params.Validator) == "function") &&
                        !params.Validator({ TextValue: simpleInput.value })) return false;
                    else if (uniqueDic[get_data()]) return false;
                    else if (!simpleInput || !pattern) return true;
                    else return !simpleInput.value || (new RegExp(pattern)).test(simpleInput.value);
                };

                var set_background = function () {
                    var theInput = ata ? ata.textarea() : simpleInput;
                    if (theInput && !ata) theInput.style.backgroundColor = !is_valid_input() ? "#fcddfb" : "white";
                };

                var get_data = function () {
                    return GlobalUtilities.trim(ata ? ata.get_data() : (simpleInput ? simpleInput.value : ""));
                };

                var uniqueDic = { "": false };

                var check_unique_constraint = function () {
                    var theValue = get_data();
                    
                    if (GlobalUtilities.get_type(uniqueDic[theValue]) == "boolean") return set_background();
                    
                    FGAPI.MeetsUniqueConstraint({
                        InstanceID: params.InstanceID, ElementID: params.ElementID,
                        TextValue: Base64.encode(theValue), ParseResults: true,
                        ResponseHandler: function (result) {
                            uniqueDic[theValue] = !result.Value;
                            var theInput = ata ? ata.textarea() : simpleInput;
                            if (theValue == get_data()) set_background();
                        }
                    });
                };

                if (useSimpleInput) {
                    simpleInput = GlobalUtilities.create_nested_elements([
                        { Type: "input", Class: "rv-input", Style: "width:100%;", Name: "_input", InnerTitle: placeHolder }
                    ], elems["container"])["_input"];

                    if (pattern) {
                        jQuery(simpleInput).keyup(function () { set_background(); });
                        jQuery(simpleInput).blur(function () { set_background(); });
                    }

                    if (params.UniqueValue && simpleInput)
                        GlobalUtilities.set_onchange(simpleInput, function () { check_unique_constraint(); });
                }
                else {
                    ata = new AdvancedTextArea({
                        ContainerDiv: container, DefaultText: placeHolder || (RVDic.Description + "..."),
                        QueryTemplate: "RelatedThings",
                        ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
                    });

                    if (params.UniqueValue && ata.textarea())
                        GlobalUtilities.set_onchange(ata.textarea(), function () { check_unique_constraint(); });
                }

                return {
                    Container: container,
                    Refresh: function () { if (ata) ata.set_data(ata.get_data()); },
                    Set: function (p) {
                        if (simpleInput) simpleInput.value = (p || {}).TextValue;
                        else if (ata) ata.set_data((p || {}).TextValue);

                        set_background();
                    },
                    Get: function () {
                        var val = get_data();
                        if (!val) val = null;

                        if (!is_valid_input()) {
                            return {
                                Result: false,
                                Message: val && uniqueDic[val] ? RVDic.MSG.UniqueConstriantHasNotBeenMet :
                                    (!params.Necessary ? RVDic.InputDataIsNotValid : null)
                            };
                        }

                        return !val ? (params.Necessary === true ? false : null) : { TextValue: val };
                    }
                }
            },

            dataview: function (params) {
                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                return {
                    Container: container,
                    Set: function (p) {
                        container.innerHTML = "";

                        if ((p || {}).TextValue) {
                            var _div = GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half", Name: "_div",
                                    Style: "text-align:justify; background-color:white; padding:0.5rem;" +
                                        "font-size:0.95rem; line-height:1.5rem;"
                                }
                            ], container)["_div"];

                            GlobalUtilities.append_markup_text(_div, (p || {}).TextValue, { ReadMore: 1000 });
                        }
                        else FormElementTypes.Text.nothing2display(container);
                    }
                }
            },

            searchfilters: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "margin:0rem;",
                        Childs: [
                            {
                                Type: "div", Class: "small-7 medium-7 large-7", Name: "selectArea",
                                Style: "padding-" + RV_RevFloat + ":1rem;"
                            },
                            {
                                Type: "div", Class: "small-2 medium-2 large-2", Name: "andOrArea",
                                Style: "padding-" + RV_RevFloat + ":1rem;"
                            },
                            {
                                Type: "div", Class: "small-3 medium-3 large-3", Style: "padding-top:0.3rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                        Childs: [{ Type: "checkbox", Name: "exactCheckbox" }]
                                    },
                                    {
                                        Type: "div", Style: "display:inline-block;",
                                        Childs: [{ Type: "text", TextValue: RVDic.ExactSearch }]
                                    }
                                ]
                            }
                        ]
                    }
                ]);

                var slct = __CreateSelect(elems["andOrArea"], { Options: [{ ID: "or", Title: RVDic.Or }, { ID: "and", Title: RVDic.And }] });

                var itemSelect = null;

                GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                    OnLoad: function () {
                        itemSelect = new NewSingleDataContainer(elems["selectArea"], {
                            EnableTextItem: true,
                            NoButtons: true,
                            InputClass: "rv-input",
                            InputStyle: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.SearchText + " (" + RVDic.PressEnterAfterEachPhrase + ")..."
                        });
                    }
                });
                
                return {
                    Container: elems["container"],
                    Get: function (params) {
                        var delimiter = (params || {}).Delimiter || "|";

                        var searchItems = itemSelect == null ? null : itemSelect.get_items_string(delimiter);
                        var exact = elems["exactCheckbox"].Checked === true;
                        var or = slct.Get() === "or";

                        var textItems = searchItems ? searchItems.split(delimiter) : null;
                        for (var i = 0; i < (textItems || []).length; ++i)
                            textItems[i] = Base64.encode(GlobalUtilities.trim(textItems[i]));

                        return {
                            TextItems: searchItems, Exact: exact, Or: or,
                            Data: itemSelect == null ? null : itemSelect.get_items(),
                            JSONValue: !(textItems || []).length ? null : { TextItems: textItems, Exact: exact, Or: or }
                        };
                    },
                    Set: function (params) {
                        if (itemSelect) {
                            var data = (params || {}).Data || [];
                            for (var i = 0, lnt = params.Data.length; i < lnt; ++i)
                                itemSelect.add_item(params.Data[i].Title, params.Data[i].ID);
                        }

                        slct.Set((params || {}).Or === true ? "or" : "and");

                        if ((params || {}).Exact === true) elems["exactCheckbox"].check();
                        else elems["exactCheckbox"].uncheck();
                    },
                    Clear: function () {
                        if (itemSelect) itemSelect.clear();
                        slct.Clear();
                        elems["exactCheckbox"].uncheck();
                    }
                }
            }
        },

        Date: {
            isempty: function (params) { return !(params || {}).DateValue; },

            fill: function (params) {
                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                GlobalUtilities.loading(container);

                var retJson = { Container: container, Get: null, Set: null };

                GlobalUtilities.append_calendar(container, {
                    ClearButton: true,
                    OnLoad: function () { container.innerHTML = ""; }
                }, function (cal) {
                    retJson.Set = function (p) {
                        cal.Set({
                            Value: (p || {}).DateValue || "",
                            Label: !(p || {}).TextValue ? RVDic.DateSelect : p.DateValue_Jalali || p.TextValue
                        });
                    }

                    retJson.Get = function () {
                        var _date = cal ? cal.Get() : {};
                        return !_date.Value ? (params.Necessary === true ? false : null) : {
                            TextValue: _date.Label,
                            DateValue: _date.Value
                        };
                    }

                    retJson.Set(params);
                });

                return retJson;
            },

            dataview: function (params) {
                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                return {
                    Container: container,
                    Set: function (p) {
                        container.innerHTML = "";

                        if ((p || {}).DateValue || (p || {}).TextValue) {
                            GlobalUtilities.create_nested_elements([
                                    {
                                        Type: "div", Style: "cursor:default;",
                                        Class: "small-12 medium-9 large-6 rv-white-button rv-circle",
                                        Childs: [{ Type: "text", TextValue: (p || {}).TextValue || (p || {}).DateValue_Jalali }]
                                    }
                            ], container);
                        }
                        else FormElementTypes.Text.nothing2display(container);
                    }
                }
            },

            searchfilters: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":2rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.CreationDate + ":" }]
                            },
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                            },
                            { Type: "div", Name: "from", Style: "display:inline-block; margin-" + RV_RevFloat + ":2rem;" },
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                            },
                            { Type: "div", Name: "to", Style: "display:inline-block;" }
                        ]
                    }
                ]);

                var fromDate = null;
                var toDate = null;

                GlobalUtilities.append_calendar(elems["from"], { ClearButton: true }, function (cal) { fromDate = cal; });
                GlobalUtilities.append_calendar(elems["to"], { ClearButton: true }, function (cal) { toDate = cal; });

                return {
                    Container: elems["container"],
                    Get: function () {
                        var _dateFrom = fromDate ? fromDate.Get().Value : null;
                        var _dateTo = toDate ? toDate.Get().Value : null;

                        return {
                            DateFrom: _dateFrom, DateTo: _dateTo,
                            Data: { From: fromDate ? fromDate.Get() : null, To: toDate ? toDate.Get() : null },
                            JSONValue: !_dateFrom && !_dateTo ? null : { DateFrom: _dateFrom, DateTo: _dateTo }
                        };
                    },
                    Set: function (data) {
                        data = (data || {}).Data || data;
                        if (fromDate) fromDate.Set(data.From);
                        if (fromDate) toDate.Set(data.To);
                    },
                    Clear: function () {
                        if (fromDate) fromDate.Clear();
                        if (toDate) toDate.Clear();
                    }
                }
            }
        },

        Select: {
            isempty: function (params) { return !(params || {}).TextValue; },

            edit: function (info, params) { return FormElementTypes.Checkbox.edit(info, params); },

            view: function (params) { return FormElementTypes.Checkbox.view(params); },

            fill: function (params) {
                if ((params || {}).Abstract) return FormElementTypes.Checkbox._fill_poll(params);

                var options = [];

                for (var i = 0, lnt = (((params || {}).Info || {}).Options || []).length; i < lnt; ++i)
                    options.push(Base64.decode(params.Info.Options[i]));

                var container = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ])["container"];

                var _obj = __CreateRadiosCheckboxes(container,
                    GlobalUtilities.extend({}, (params || {}).Info || {}, { IsCheckbox: false, Options: options }));

                return {
                    Container: container,
                    Set: function (p) {
                        _obj.Set(String(((p || {}).TextValue || "")));
                    },
                    Get: function () {
                        var retStr = _obj.Get();
                        var floatValue = _obj.GetFloatValue();

                        if (retStr) return { TextValue: retStr, FloatValue: floatValue };
                        else return params.Necessary === true ? false : null;
                    }
                }
            },

            dataview: function (params) {
                return FormElementTypes.Checkbox.dataview(params);
            },

            searchfilters: function (params) {
                params = params || {};
                params.IsCheckbox = false;
                return FormElementTypes.Checkbox.searchfilters(params);
            }
        },

        Checkbox: {
            isempty: function (params) { return !(params || {}).TextValue; },

            edit: function (info, params) {
                params = params || {};

                var isCheckbox = params.Type == "Checkbox";
                var weight = params.Weight;

                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        {
                            Type: "div", Style: "display:flex; flex-flow:row; align-items:center;",
                            Childs: [
                                (true ? null : {
                                    Type: "div", Class: "rv-flat-label",
                                    Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                        "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Options + ":" }]
                                }),
                                {
                                    Type: "div", Style: "flex:1 1 auto; display:flex; flex-flow:row;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Class: "rv-border-radius-quarter rv-ignore-" + RV_RevFloat.toLowerCase() + "-radius SoftBackgroundColor",
                                            Style: "flex:0 0 auto; padding-" + RV_Float + ":0.3rem;"
                                        },
                                        {
                                            Type: "div", Name: "items",
                                            Style: "flex:1 1 auto; display:flex; flex-flow:column;" +
                                                "padding:0.5rem; padding-" + RV_RevFloat + ":0rem;"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: FormElementTypeSettings.SmallOptionClass,
                            Style: "display:flex; flex-flow:row; align-items:center; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label", Style: "flex:1 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.FG.UseAutoSuggestInsteadOfListingAllTheOptions + ":" }]
                                },
                                {
                                    Type: "switch", Name: "autosuggestMode",
                                    Style: "flex:0 0 auto; margin-top:0.2rem;",
                                    Params: FormElementTypeSettings.SwitchParams
                                }
                            ]
                        },
                        (isCheckbox ? null : {
                            Type: "div", Class: FormElementTypeSettings.SmallOptionClass,
                            Style: "display:flex; flex-flow:row; align-items:center; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label",
                                    Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                        "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Weight + ":" }]
                                },
                                {
                                    Type: "div", Style: "flex:1 1 auto; text-align:left; direction:ltr;",
                                    Childs: [{
                                        Type: "input", Class: "rv-input-simple rv-placeholder-align-left",
                                        Style: "width:100%; font-size:0.7rem;", Name: "weight", InnerTitle: "e.g. 2"
                                    }]
                                }
                            ]
                        })
                    ]
                }]);

                var container = elems["container"];
                var autosuggestMode = elems["autosuggestMode"].Checkbox;

                var obj = new NewSingleDataContainer(elems["items"], {
                    EnableTextItem: true, Sortable: true, UseInlineInput: true, Necessary: true,
                    InputStyle: "width:100%; font-size:0.8rem;",
                    InnerTitle: RVDic.NewOption + "...",
                    CustomData: isCheckbox ? null : function (con, p, done) {
                        var _el = GlobalUtilities.create_nested_elements([{
                            Type: "div", Style: "padding-" + RV_Float + ":1rem; display:flex; align-items:center; height:100%;",
                            Childs: [
                                {
                                    Type: "number", Params: { Float: false }, Name: "min", InnerTitle: RVDic.Min,
                                    Class: "rv-input rv-placeholder-align-center",
                                    Style: "width:4rem; text-align:center; font-size:0.7rem;"
                                },
                                {
                                    Type: "number", Params: { Float: false }, Name: "max", InnerTitle: RVDic.Max,
                                    Class: "rv-input rv-placeholder-align-center",
                                    Style: "width:4rem; text-align:center; font-size:0.7rem; margin-" + RV_Float + ":0.5rem;"
                                }
                            ]
                        }], con);

                        if (GlobalUtilities.get_type(((p || {}).Data || {}).Min) == "number") _el["min"].value = p.Data.Min;
                        if (GlobalUtilities.get_type(((p || {}).Data || {}).Max) == "number") _el["max"].value = p.Data.Max;

                        done({
                            Get: function () {
                                return {
                                    Min: !_el["min"].value || isNaN(+_el["min"].value) ? null : +_el["min"].value,
                                    Max: !_el["max"].value || isNaN(+_el["max"].value) ? null : +_el["max"].value
                                };
                            }
                        });
                    }
                });

                var _set = function (p, w) {
                    for (var i = 0, lnt = ((p || {}).Options || []).length; i < lnt; ++i) {
                        var val = Base64.decode(p.Options[i]);
                        obj.add_item(val, val, (p.Data || []).length >= (i + 1) ? p.Data[i] : null);
                    }

                    if (elems["weight"]) {
                        if ((GlobalUtilities.get_type(w) == "number")) elems["weight"].value = w;
                        else elems["weight"].value = "";
                    }
                    
                    autosuggestMode.checked = (p || {}).AutoSuggestMode === true;
                };

                _set(info, weight);

                return {
                    Container: container, Clear: function () { if (obj) obj.clear(); },
                    Set: function (info, _weight) { _set(info, _weight); },
                    Get: function () {
                        var items = !obj ? [] : (obj.get_items() || []);
                        var retVal = { Options: [], AutoSuggestMode: autosuggestMode.checked === true };
                        if (!isCheckbox) retVal.Data = [];
                        for (var i = 0, lnt = items.length; i < lnt; ++i) {
                            retVal.Options.push(Base64.encode(items[i].Title || ""));
                            if (!isCheckbox) retVal.Data.push(items[i].Data || {});
                        }
                        return items.length == 0 ? false : retVal;
                    },
                    Weight: function () {
                        var _weight = !elems["weight"] ? null : elems["weight"].value;
                        return isCheckbox || !_weight || (GlobalUtilities.get_type(+_weight) != "number") ? null : +_weight;
                    }
                };
            },

            view: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "weight", Style: "margin-bottom:0.5rem;" },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "autosuggestMode", Style: "margin-bottom:0.5rem;" },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" }
                        ]
                    }
                ]);

                var container = elems["container"];

                var _set = function (p) {
                    elems["weight"].innerHTML = "";
                    elems["items"].innerHTML = "";

                    if (+(p || {}).Weight) elems["weight"].innerHTML = "<span style='font-weight:bold;'>(" +
                        RVDic.Weight + ": " + GlobalUtilities.convert_numbers_to_persian(p.Weight) + ")</span>";

                    if (((p || {}).Info || {}).AutoSuggestMode === true)
                        elems["autosuggestMode"].innerHTML = "<span style='font-weight:bold;'>(" +
                        RVDic.FG.AutoSuggestMode + ")</span>";

                    var options = ((p || {}).Info || {}).Options || [];
                    for (var i = 0, lnt = options.length; i < lnt; ++i) {
                        var _el = GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Childs: [
                                    {
                                        Type: "div",
                                        Style: "display:inline-block; color:red; font-size:0.9rem; margin-" + RV_RevFloat + ":0.4rem;",
                                        Childs: [{ Type: "text", TextValue: "-  " }]
                                    },
                                    { Type: "div", Style: "display:inline-block;", Name: "lbl" }
                                ]
                            }
                        ], elems["items"]);

                        var ttl = GlobalUtilities.convert_numbers_to_persian(Base64.decode(options[i]));
                        if ((p.Info.Data || []).length >= (i + 1)) {
                            if (GlobalUtilities.get_type((p.Info.Data[i] || {}).Min) == "number")
                                ttl += "<span style='margin-" + RV_Float + ":0.4rem; font-size:0.6rem; font-weight:bold;" +
                                    "color:gray;'>(" + RVDic.Min + ": " +
                                    GlobalUtilities.convert_numbers_to_persian(p.Info.Data[i].Min) + ")</span>";

                            if (GlobalUtilities.get_type((p.Info.Data[i] || {}).Max) == "number")
                                ttl += "<span style='margin-" + RV_Float + ":0.4rem; font-size:0.6rem; font-weight:bold;" +
                                    "color:gray;'>(" + RVDic.Max + ": " +
                                    GlobalUtilities.convert_numbers_to_persian(p.Info.Data[i].Max) + ")</span>";
                        }

                        _el["lbl"].innerHTML = "";

                        GlobalUtilities.create_nested_elements([{ Type: "text", TextValue: ttl }], _el["lbl"]);
                    }
                }

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            _get_poll_options_dic: function (params) {
                var options = [];

                for (var i = 0, lnt = (((params || {}).Info || {}).Options || []).length; i < lnt; ++i)
                    options.push(Base64.decode(params.Info.Options[i]));

                var vals = (params.Abstract || {}).Values || [];
                var valsDic = {};
                var totalCount = 0;

                for (var i = 0; i < options.length; ++i) {
                    var op = GlobalUtilities.trim(options[i] || "");
                    if (op && !valsDic[op]) valsDic[op] = { Count: 0, Selected: false };

                    if ((params.Info.Data || []).length >= (i + 1)) {
                        if (GlobalUtilities.get_type((params.Info.Data[i] || {}).Min) == "number")
                            valsDic[op].Min = params.Info.Data[i].Min;
                        if (GlobalUtilities.get_type((params.Info.Data[i] || {}).Max) == "number")
                            valsDic[op].Max = params.Info.Data[i].Max;
                    }
                }

                for (var i = 0; i < vals.length; ++i) {
                    var op = GlobalUtilities.trim(Base64.decode(vals[i].Value));
                    if (!op) continue;

                    if (valsDic[op]) valsDic[op].Count = vals[i].Count;
                    else valsDic[op] = { Count: vals[i].Count, Selected: false };

                    totalCount += vals[i].Count;
                }

                var items = String((params || {}).TextValue || "").split("~");

                for (var i = 0, lnt = items.length; i < lnt; ++i) {
                    items[i] = GlobalUtilities.trim(items[i] || "");
                    if (!items[i]) continue;

                    if (valsDic[items[i]]) valsDic[items[i]].Selected = true;
                    else valsDic[items[i]] = { Count: 0, Selected: true };
                }

                return { Dic: valsDic, TotalCount: totalCount };
            },

            _fill_poll: function (params) {
                var container = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ])["container"];

                var ret = FormElementTypes.Checkbox._get_poll_options_dic(params);

                for (var i = 0, lnt = (((params || {}).Info || {}).Options || []).length; i < lnt; ++i) {
                    var op = Base64.decode(params.Info.Options[i]);

                    __CreatePollItem(container, {
                        Value: op,
                        Min: params.Type == "Checkbox" ? null : ret.Dic[op].Min,
                        Max: params.Type == "Checkbox" ? null : ret.Dic[op].Max,
                        Count: ret.Dic[op].Count,
                        Percent: !ret.TotalCount ? 0 : (ret.Dic[op].Count / ret.TotalCount) * 100,
                        Selected: ret.Dic[op].Selected,
                        Editable: true,
                        MultiSelect: params.Type == "Checkbox"
                    });
                }

                return {
                    Container: container,
                    Set: function (p) {
                        var selectedOptions = String(((p || {}).TextValue || "")).split("~");

                        var _dic = {};

                        for (var i = 0, lnt = selectedOptions.length; i < lnt; ++i) {
                            selectedOptions[i] = GlobalUtilities.trim(selectedOptions[i]);
                            _dic[selectedOptions[i]] = true;
                        }

                        var firstChild = container.firstChild;
                        while (firstChild) {
                            if (_dic[firstChild.TheValue] && firstChild.Select) firstChild.Select();
                            firstChild = firstChild.nextSibling;
                        }
                    },
                    Get: function () {
                        var retStr = "";
                        var firstChild = container.firstChild;
                        var floatValue = undefined;
                        while (firstChild) {
                            if (firstChild.Selected) {
                                retStr += (retStr == "" ? "" : " ~ ") + firstChild.TheValue;
                                floatValue = firstChild.FloatValue;
                            }
                            firstChild = firstChild.nextSibling;
                        }
                        return !retStr ? (params.Necessary === true ? false : null) :
                            GlobalUtilities.extend({ TextValue: retStr }, { FloatValue: floatValue });
                    }
                };
            },

            fill: function (params) {
                if ((params || {}).Abstract) return FormElementTypes.Checkbox._fill_poll(params);

                var options = [];

                for (var i = 0, lnt = (((params || {}).Info || {}).Options || []).length; i < lnt; ++i)
                    options.push(Base64.decode(params.Info.Options[i]));

                var container = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ])["container"];

                var _obj = __CreateRadiosCheckboxes(container,
                    GlobalUtilities.extend({}, (params || {}).Info || {}, { IsCheckbox: true, Options: options }));

                return {
                    Container: container,
                    Set: function (p) {
                        _obj.Set(String(((p || {}).TextValue || "")));
                    },
                    Get: function () {
                        var retStr = _obj.Get();
                        return !retStr ? (params.Necessary === true ? false : null) : { TextValue: retStr };
                    }
                };
            },

            dataview: function (params) {
                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container"
                }]);

                var container = elems["container"];

                var options = [];

                for (var i = 0, lnt = (((params || {}).Info || {}).Options || []).length; i < lnt; ++i)
                    options.push(Base64.decode(params.Info.Options[i]));

                var _add_normal = function (val) {
                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Style: "margin-top:0.2rem; cursor:default;",
                        Class: "small-12 medium-12 large-12 rv-air-button rv-border-radius-quarter",
                        Childs: [{ Type: "text", TextValue: val }]
                    }], container);
                };

                return {
                    Container: container,
                    Set: function (p) {
                        container.innerHTML = "";

                        if (!p.Abstract) {
                            var items = String((p || {}).TextValue || "").split("~");

                            var hasData = false;

                            for (var i = 0, lnt = items.length; i < lnt; ++i) {
                                items[i] = GlobalUtilities.trim(items[i] || "");
                                if (!items[i]) continue;
                                hasData = true;
                                _add_normal(items[i]);
                            }

                            if (!hasData) FormElementTypes.Text.nothing2display(container);
                        }
                        else {
                            var ret = FormElementTypes.Checkbox._get_poll_options_dic(params);

                            for (var v in ret.Dic) {
                                __CreatePollItem(container, {
                                    Value: v,
                                    Count: ret.Dic[v].Count,
                                    Percent: !ret.TotalCount ? 0 : (ret.Dic[v].Count / ret.TotalCount) * 100,
                                    Selected: ret.Dic[v].Selected
                                });
                            }
                        }
                    }
                };
            },

            searchfilters: function (params) {
                params = params || {};

                var isCheckbox = params.IsCheckbox !== false;

                var _cls = isCheckbox ? "small-7 medium-7 large-7" : "small-9 medium-9 large-9";

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "margin:0rem;",
                        Childs: [
                            {
                                Type: "div", Class: _cls, Style: "padding-" + RV_RevFloat + ":1rem;",
                                Childs: [
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "optionsArea" },
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "inputArea", Style: "margin-top:0.5rem;" }
                                ]
                            },
                            {
                                Type: "div", Class: "small-2 medium-2 large-2", Name: "andOrArea",
                                Style: "padding-" + RV_RevFloat + ":1rem;" + (isCheckbox ? "" : "display:none;")
                            },
                            {
                                Type: "div", Class: "small-3 medium-3 large-3", Style: "padding-top:0.3rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                        Childs: [{ Type: "checkbox", Name: "exactCheckbox" }]
                                    },
                                    {
                                        Type: "div", Style: "display:inline-block;",
                                        Childs: [{ Type: "text", TextValue: RVDic.ExactSearch }]
                                    }
                                ]
                            }
                        ]
                    }
                ]);

                var itemSelect = null;

                GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                    OnLoad: function () {
                        itemSelect = new NewSingleDataContainer(elems["inputArea"], {
                            EnableTextItem: true,
                            NoButtons: true,
                            InputClass: "rv-input",
                            InputStyle: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.SearchText + " (" + RVDic.PressEnterAfterEachPhrase + ")..."
                        });
                    }
                });

                for (var i = 0, lnt = (((params || {}).Info || {}).Options || []).length; i < lnt; ++i)
                    params.Info.Options[i] = Base64.decode(params.Info.Options[i]);

                var _obj = __CreateRadiosCheckboxes(elems["optionsArea"],
                    GlobalUtilities.extend((params || {}).Info || {}, { IsCheckbox: true }));

                var slct = __CreateSelect(elems["andOrArea"], { Options: [{ ID: "or", Title: RVDic.Or }, { ID: "and", Title: RVDic.And }] });

                return {
                    Container: elems["container"],
                    Get: function (params) {
                        var delimiter = (params || {}).Delimiter || "|";

                        var _val = _obj.Get();
                        var exact = elems["exactCheckbox"].Checked === true;
                        var or = !isCheckbox || (slct.Get() === "or");

                        var textItems = _val ? _val.split("~") : null;
                        for (var i = 0; i < (textItems || []).length; ++i)
                            textItems[i] = Base64.encode(GlobalUtilities.trim(textItems[i]));

                        var searchItems = itemSelect == null ? null : itemSelect.get_items_string(delimiter);
                        if(searchItems) searchItems = searchItems.split(delimiter);
                        for (var i = 0; i < (searchItems || []).length; ++i) {
                            textItems = textItems || [];
                            textItems.push(Base64.encode(GlobalUtilities.trim(searchItems[i])));
                        }
                        
                        return {
                            TextItems: _val == null ? null : _val, Exact: exact, Or: or,
                            JSONValue: !(textItems || []).length ? null : { TextItems: textItems, Exact: exact, Or: or }
                        };
                    },
                    Set: function (data) {
                        _obj.Set((params || {}).TextItems);
                        if (isCheckbox) slct.Set((params || {}).Or === true ? "or" : "and");

                        if ((params || {}).Exact === true) elems["exactCheckbox"].check();
                        else elems["exactCheckbox"].uncheck();
                    },
                    Clear: function () {
                        _obj.Clear();
                        slct.Clear();
                        if (itemSelect) itemSelect.clear();
                    }
                }
            }
        },

        MultiLevel: {
            isempty: function (params) { return !(params || {}).TextValue; },

            _parse_tree: function (items, params) {
                if (!(items || []).length) return { Items: [], FlatItems: [], MaxLevel: 0 };

                params = params || {};

                params.Level = params.Level || 1;
                params.MaxLevel = Math.max(params.Level, params.MaxLevel || 1);
                params.FlatItems = params.FlatItems || [];

                var arr = [];

                for (var i = 0; i < (items || []).length; ++i) {
                    var json = { Value: items[i].Name ? Base64.encode(items[i].Name) : items[i].Value };
                    arr.push(json);

                    var flatItem = { ID: GlobalUtilities.generate_new_guid(), Title: Base64.decode(items[i].Value) };
                    if (params.ParentID) flatItem.ParentID = params.ParentID;
                    params.FlatItems.push(flatItem);

                    var newData = FormElementTypes.MultiLevel._parse_tree(items[i].Childs || items[i].Items, {
                        Level: params.Level + 1,
                        MaxLevel: params.MaxLevel,
                        ParentID: flatItem.ID,
                        FlatItems: params.FlatItems
                    });

                    params.MaxLevel = Math.max(params.MaxLevel, newData.MaxLevel);

                    if (newData.Items.length) json.Items = newData.Items;
                }

                return { Items: arr, FlatItems: params.FlatItems, MaxLevel: params.MaxLevel };
            },

            _edit_tree_dialog: function (info, callback) {
                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "margin-bottom:1rem; font-weight:bold; text-align:center;",
                                Childs: [{ Type: "text", TextValue: RVDic.EditTree }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                                Style: "border-color:black; padding:0.5rem;",
                                Childs: [
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12", Name: "nothing",
                                        Style: "font-weight:bold; text-align:center;" +
                                            (((info || {}).Tree || []).length ? "display:none" : ""),
                                        Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                                    },
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "treeContainer", Style: "overflow:hidden;" }
                                ]
                            },
                            {
                                Type: "div", Class: "small-10 medium-8 large-6 rv-air-button rv-circle",
                                Style: "margin:1.5rem auto 0rem auto;", Name: "confirmButton",
                                Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                            }
                        ]
                    }
                ]);

                var tree = null;
                var confirmed = false;
                var changed = false;

                var treeData = FormElementTypes.MultiLevel._parse_tree((info || {}).Tree);
                var initiaNodes = treeData.FlatItems;

                GlobalUtilities.load_files([{ Root: "TreeViewContainer/", Ext: "js", Childs: ["TreeViewContainer", "TreeMaker"] }], {
                    OnLoad: function () {
                        tree = new TreeMaker({
                            ContainerDiv: elems["treeContainer"],
                            NewNodeDefaultTitle: RVDic.NewTitle,
                            DeleteConfirmation: true,
                            RemoveHierarchyConfirmation: false,
                            InitialGet: false,
                            Options: { AjaxLoading: false, Nodes: initiaNodes },
                            DeleteConfirmationAlert: RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Title),
                            OnAdd: function () {
                                changed = true;
                                if (elems["nothing"].style.display != "none")
                                    jQuery(elems["nothing"]).animate({ height: "toggle" }, 500);
                            },
                            OnRemove: function () {
                                changed = true;
                                tree.TreeViewObject.get_childs(null, function (childs) {
                                    if (!(childs || []).length && (elems["nothing"].style.display == "none"))
                                        jQuery(elems["nothing"]).animate({ height: "toggle" }, 500);
                                });
                            },
                            OnRename: function () { changed = true; },
                            OnPaste: function () { changed = true; },
                            OnSort: function (sortedItems, callback) { changed = true; callback(true); }
                        });
                    }
                });

                var confirm = elems["confirmButton"].onclick = function () {
                    if (confirmed) return;
                    confirmed = true;

                    if ((tree || {}).TreeViewObject) tree.TreeViewObject.get_all_nodes(function (items) {
                        callback({ Tree: FormElementTypes.MultiLevel._parse_tree(items).Items });
                    });

                    showed.Close();
                };

                var showed = GlobalUtilities.show(elems["_div"], {
                    OnClose: function () {
                        if (confirmed || !changed) return;

                        GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveTheChanges, function (r) {
                            if (r) confirm();
                        });
                    }
                });
            },

            edit: function (info, params) {
                params = params || {};
                info = info || {};

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "margin:0rem;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-7 large-6", Style: "margin-bottom:1rem;",
                                Childs: [
                                    {
                                        Type: "select", Class: "rv-input",
                                        Style: "width:100%; font-size:0.7rem;", Name: "tpSelect",
                                        Childs: [
                                            {
                                                Type: "option",
                                                Attributes: [{ Name: "title", Value: "Inline" }],
                                                Childs: [{ Type: "text", TextValue: RVDic.TreeEdit }]
                                            },
                                            {
                                                Type: "option",
                                                Attributes: [{ Name: "title", Value: "NodeType" }],
                                                Childs: [{ Type: "text", TextValue: RVDic.NodeTypeSelect }]
                                            }
                                        ]
                                    }
                                ]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12" },
                            { Type: "div", Class: "small-12 medium-7 large-6", Name: "nodeTypeArea", Style: "display:none;" },
                            {
                                Type: "div", Class: "small-12 medium-7 large-6", Name: "treeArea", Style: "display:none;",
                                Childs: [
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.5rem;",
                                        Childs: [
                                            {
                                                Type: "div", Class: "small-8 medium-8 large-8 rv-air-button rv-circle",
                                                Style: "margin:0rem auto; font-weight:bold; font-size:0.8rem;", Name: "editTree",
                                                Childs: [
                                                    {
                                                        Type: "i", Class: "fa fa-pencil", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                                    },
                                                    { Type: "text", TextValue: RVDic.EditTree }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        Type: "div", Name: "tree",
                                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                                        Style: "overflow:hidden; padding:0.5rem; border-color:black;"
                                    }
                                ]
                            },
                            { Type: "div", Name: "levelNames", Class: "small-12 medium-5 large-6", Style: "padding:0rem 0.5rem;" }
                        ]
                    }
                ]);

                var container = elems["container"];
                var tpSelect = elems["tpSelect"];

                var set_display = function () {
                    var val = tpSelect[tpSelect.selectedIndex].title;
                    elems["nodeTypeArea"].style.display = val == "NodeType" ? "block" : "none";
                    elems["treeArea"].style.display = val == "Inline" ? "block" : "none";
                };
                
                if ((info.NodeType || {}).ID) tpSelect.selectedIndex = 1;

                set_display();
                tpSelect.onchange = set_display;

                var depthDic = {};

                var ntSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeArea"], {
                    InputClass: "rv-input",
                    InputStyle: "width:100%;",
                    InnerTitle: RVDic.NodeTypeSelect,
                    AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                    ResponseParser: function (responseText) {
                        var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                        var arr = [];
                        for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                            arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID || ""]);
                        return arr;
                    },
                    OnSelect: function () {
                        var index = ntSelect.selectedIndex;
                        var id = ntSelect.values[index], name = ntSelect.keywords[index];

                        info.NodeType = { ID: id, Name: Base64.encode(name) };

                        if (!depthDic[id]) {
                            CNAPI.GetTreeDepth({
                                NodeTypeID: id, ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.Depth) { set_level_inputs(depthDic[id] = result.Depth); }
                                }
                            });
                        }
                        else set_level_inputs(depthDic[id]);
                    }
                });

                var _add_level = function (index) {
                    var txt = GlobalUtilities.convert_numbers_to_persian(RVDic.LevelTitleN.replace("[n]", index));

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "input", Class: "rv-input", InnerTitle: txt, Tooltip: txt,
                            Style: "width:100%; margin-bottom:0.5rem;"
                        }
                    ], elems["levelNames"]);
                };

                var set_level_inputs = function (count) {
                    var levelInputs = elems["levelNames"].getElementsByTagName("input") || [];
                    var curCount = levelInputs.length;

                    for (var i = 0, lnt = Math.min(count, curCount) ; i < lnt; ++i)
                        jQuery(levelInputs[i]).fadeIn(0);

                    if (count > curCount) {
                        for (var i = curCount; i < count; ++i) _add_level(i + 1);
                    }
                    else if (count < curCount) {
                        for (var i = count; i < curCount; ++i) jQuery(levelInputs[i]).fadeOut(0);
                    }
                };

                elems["editTree"].onclick = function () {
                    FormElementTypes.MultiLevel._edit_tree_dialog(info, function (data) {
                        info.Tree = data.Tree;
                        _set(info);
                    });
                };

                var _set = function (p) {
                    var val = tpSelect[tpSelect.selectedIndex].title;
                    var isNodeType = val == "NodeType";
                    var parsed = isNodeType ? null : FormElementTypes.MultiLevel._parse_tree(p.Tree || []);
                    var levelInputs = elems["levelNames"].getElementsByTagName("input") || [];
                    var maxLevel = isNodeType ? levelInputs.length || (p.Levels || []).length : parsed.MaxLevel;
                    
                    set_level_inputs(maxLevel);
                    
                    for (var i = 0, lnt = Math.min(maxLevel, ((p || {}).Levels || []).length) ; i < lnt; ++i)
                        levelInputs[i].value = Base64.decode(p.Levels[i]);

                    if (isNodeType)
                        ntSelect.set_item((p.NodeType || {}).ID, Base64.decode((p.NodeType || {}).Name));
                    else {
                        if (!((p || {}).Tree || {}).length) {
                            elems["tree"].innerHTML = "<div style='text-align:center; font-weight:bold;'>" +
                                RVDic.NothingToDisplay + "</div>";
                        }
                        else {
                            elems["tree"].innerHTML = "";

                            GlobalUtilities.load_files(["TreeViewContainer/TreeViewContainer.js"], {
                                OnLoad: function () {
                                    new TreeViewContainer(elems["tree"], {
                                        Nodes: parsed.FlatItems, Hotkeys: false, Checkbox: false, Modifiable: false,
                                        DefaultRemove: false, DefaultAdd: false, DefaultPaste: false,
                                        ProgressiveRender: false, AjaxLoading: false, AjaxURL: null
                                    });
                                }
                            });
                        }
                    }
                };

                _set(info);

                return {
                    Container: container,
                    Clear: function () {
                        info.Tree = info.Levels = info.NodeType = null;
                        _set(info);
                    },
                    Set: function (info) { _set(info); },
                    Get: function () {
                        var levelInputs = elems["levelNames"].getElementsByTagName("input") || [];

                        var val = tpSelect[tpSelect.selectedIndex].title;

                        var tree = val == "NodeType" ? [] : info.Tree || [];
                        var nodeType = tree.length || !(info.NodeType || {}).ID ? null : info.NodeType;
                        var levels = [];

                        var maxLevel = nodeType ? 1000 : FormElementTypes.MultiLevel._parse_tree(tree).MaxLevel;

                        for (var i = 0, lnt = Math.min(maxLevel, levelInputs.length) ; i < lnt; ++i) {
                            var val = GlobalUtilities.trim(levelInputs[i].value);
                            if (!val) break;
                            levels.push(Base64.encode(val));
                        }

                        return nodeType && levels.length ? { NodeType: nodeType, Levels: levels } :
                            (maxLevel && (maxLevel == levels.length) ? { Tree: tree, Levels: levels } : false);
                    }
                };
            },

            view: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "margin:0rem;",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-7 large-6", Name: "nodeType", Style: "display:none; padding:0.5rem;" },
                            {
                                Type: "div", Name: "tree",
                                Class: "small-12 medium-7 large-6 rv-border-radius-quarter SoftBorder",
                                Style: "display:none; overflow:hidden; padding:0.5rem; border-color:black;"
                            },
                            { Type: "div", Name: "levelNames", Class: "small-12 medium-5 large-6", Style: "padding:0rem 0.5rem;" }
                        ]
                    }
                ]);

                var container = elems["container"];

                var _set = function (p) {
                    var info = (p || {}).Info || {};

                    var isNodeType = !!(info.NodeType || {}).ID;
                    var parsed = isNodeType ? {} : FormElementTypes.MultiLevel._parse_tree(info.Tree || []);
                    var maxLevel = isNodeType ? ((info || {}).Levels || []).length : parsed.MaxLevel;

                    elems["levelNames"].innerHTML = "";

                    for (var i = 0, lnt = Math.min(maxLevel, ((info || {}).Levels || []).length) ; i < lnt; ++i) {
                        var txt = GlobalUtilities.convert_numbers_to_persian(RVDic.LevelTitleN.replace("[n]", i + 1));

                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftBorder SoftShadow",
                                Style: "margin-bottom:0.5rem; padding:0.5rem; border-color:rgb(200,200,200);",
                                Childs: [
                                    {
                                        Type: "div",
                                        Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-weight:bold;",
                                        Childs: [{ Type: "text", TextValue: txt + ":" }]
                                    },
                                    { Type: "text", TextValue: Base64.decode(info.Levels[i]) }
                                ]
                            }
                        ], elems["levelNames"]);
                    }

                    elems["nodeType"].style.display = isNodeType ? "flex" : "none";
                    elems["tree"].style.display = isNodeType ? "none" : "flex";

                    if (isNodeType) {
                        elems["nodeType"].innerHTML = "";

                        GlobalUtilities.create_nested_elements([{
                            Type: "text", TextValue: Base64.decode((info.NodeType || {}).Name)
                        }], elems["nodeType"]);
                    }
                    else {
                        if (!((info || {}).Tree || {}).length) {
                            elems["tree"].innerHTML = "<div style='text-align:center; font-weight:bold;'>" +
                                RVDic.NothingToDisplay + "</div>";
                        }
                        else {
                            GlobalUtilities.load_files(["TreeViewContainer/TreeViewContainer.js"], {
                                OnLoad: function () {
                                    elems["tree"].innerHTML = "";

                                    new TreeViewContainer(elems["tree"], {
                                        Nodes: parsed.FlatItems, Hotkeys: false, Checkbox: false, Modifiable: false,
                                        DefaultRemove: false, DefaultAdd: false, DefaultPaste: false,
                                        ProgressiveRender: false, AjaxLoading: false, AjaxURL: null
                                    });
                                }
                            });
                        }
                    }
                };

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            fill: function (params) {
                params = params || {};
                var info = params.Info || {};

                var nodeTypeId = (info.NodeType || {}).ID;
                
                var container = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "margin:0rem;"
                }])["container"];

                var inputs = [];

                var hasChildDic = {};

                var _add_input = function (text, level) {
                    var elems = GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "small-6 medium-6 large-6", Name: "_div",
                        Style: "padding:0.5rem; display:none;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "padding:0rem 0.3rem 0.2rem 0.3rem; font-weight:bold; color:rgb(100,100,100); font-size:0.8rem;",
                                Childs: [{ Type: "text", TextValue: text }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: nodeTypeId ? "display:none;" : "",
                                Childs: [{ Type: "select", Class: "rv-input", Style: "width:100%;", Name: "slct" }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "ndSlct",
                                Style: nodeTypeId ? "" : "display:none;"
                            }
                        ]
                    }], container);
                    
                    var nodeSelect = null;

                    if (nodeTypeId) {
                        nodeSelect = GlobalUtilities.append_autosuggest(elems["ndSlct"], {
                            InputClass: "rv-input",
                            InputStyle: "width:100%;",
                            AjaxDataSource: CNAPI.GetChildNodes({ NodeTypeID: nodeTypeId }),
                            ResponseParser: function (responseText) {
                                var nodes = JSON.parse(responseText).Nodes || [];
                                var arr = [];
                                for (var i = 0, lnt = nodes.length; i < lnt; ++i) {
                                    hasChildDic[nodes[i].NodeID] = !!nodes[i].HasChild;
                                    arr.push([Base64.decode(nodes[i].Name), nodes[i].NodeID]);
                                }
                                return arr;
                            },
                            OnSelect: function () {
                                if (inputs.length > (level + 1))
                                    inputs[level + 1].Fill(nodeSelect.values[nodeSelect.selectedIndex]);
                            }
                        });
                    }

                    var _change = function () {
                        if (!nodeTypeId && ((level + 1) < inputs.length))
                            inputs[level + 1].Fill(elems["slct"].options[elems["slct"].selectedIndex].theItems);
                    };

                    elems["slct"].onchange = _change;

                    var get_tags = function (value, callback) {
                        if (!value) callback([]);
                        else AdvancedTextArea.get_tags(value, function (arr) { callback(arr || []); });
                    };

                    var obj = {
                        Set: function (value, parentValue) {
                            if (nodeTypeId) {
                                get_tags(parentValue, function (parentArr) {
                                    if (parentArr.length) obj.Fill(parentArr[0].ID);

                                    get_tags(value, function (arr) {
                                        if (arr.length) nodeSelect.set_item(arr[0].ID, arr[0].Value, { IgnoreOnSelect: true });
                                    });
                                });

                                obj.Show();
                            }
                            else {
                                var options = elems["slct"].options;

                                for (var i = 0; i < options.length; ++i) {
                                    if (GlobalUtilities.trim(options[i].value) != GlobalUtilities.trim(value)) continue;
                                    elems["slct"].selectedIndex = i;
                                    _change();
                                    obj.Show();
                                    break;
                                }
                            }
                        },
                        Get: function (full) {
                            var curValue = "";
                            var nodeId = null;

                            var guidItems = [];

                            if (nodeTypeId) {
                                var index = nodeSelect.selectedIndex;
                                
                                if (index >= 0 && GlobalUtilities.trim(nodeSelect.InputElement.value)) {
                                    nodeId = nodeSelect.values[index];

                                    curValue = AdvancedTextArea.get_markup({
                                        ID: nodeId, Type: "Node", Value: nodeSelect.keywords[index]
                                    });

                                    guidItems.push({ ID: nodeId, Name: nodeSelect.keywords[index] });
                                }
                            }
                            else curValue = elems["slct"].options[elems["slct"].selectedIndex].value;

                            curValue = { TextValue: curValue, GuidItems: guidItems };
                            
                            var hasChildren = nodeTypeId ? true :
                                !!(elems["slct"].options[elems["slct"].selectedIndex].theItems || []).length;

                            if (!full || !hasChildren || (inputs.length == level + 1) || !curValue.TextValue) return curValue;
                            else {
                                var subValue = inputs[level + 1].Get(full);

                                if ((subValue || {}).TextValue) {
                                    curValue.TextValue += " ~ " + subValue.TextValue;
                                    (subValue.GuidItems || []).forEach(function (itm) { curValue.GuidItems.push(itm); });

                                    return curValue;
                                }
                                else
                                    return !nodeTypeId || (nodeId && hasChildDic[nodeId]) ? false : curValue;
                            }
                        },
                        Show: function () { jQuery(elems["_div"]).fadeIn(500); },
                        Hide: function () {
                            jQuery(elems["_div"]).fadeOut(500);
                            elems["slct"].selectedIndex = 0;
                            if (nodeSelect) nodeSelect.clear();
                        },
                        AddOption: function (item) {
                            if (nodeTypeId) return;

                            var title = Base64.decode((item || {}).Value);
                            var value = GlobalUtilities.trim(title);

                            if (!title) title = RVDic.SelectN.replace("[n]", text) + "...";

                            GlobalUtilities.create_nested_elements([
                                {
                                    Type: "option",
                                    Properties: [{ Name: "value", Value: value }, { Name: "theItems", Value: (item || []).Items }],
                                    Childs: [{ Type: "text", TextValue: title }]
                                }
                            ], elems["slct"]);
                        },
                        Fill: function (itemsOrNodeId) {
                            if (nodeTypeId) {
                                if (nodeSelect) {
                                    nodeSelect.empty();
                                    nodeSelect.bindURL(CNAPI.GetChildNodes({ NodeTypeID: nodeTypeId, NodeID: itemsOrNodeId }));
                                }
                            }
                            else {
                                elems["slct"].innerHTML = ""

                                obj.AddOption(null);

                                for (var i = 0; i < (itemsOrNodeId || []).length; ++i)
                                    obj.AddOption(itemsOrNodeId[i]);
                            }

                            if ((!nodeTypeId && !(itemsOrNodeId || []).length) ||
                                (nodeTypeId && itemsOrNodeId && !hasChildDic[itemsOrNodeId])) obj.Hide();
                            else obj.Show();

                            for (var i = level + 1; i < inputs.length; ++i)
                                inputs[i].Hide();
                        }
                    };

                    inputs.push(obj);
                };
                
                for (var i = 0, lnt = (info.Levels || []).length; i < lnt; ++i)
                    _add_input(Base64.decode(info.Levels[i]), i);
                
                if (inputs.length) inputs[0].Fill(info.Tree);

                return {
                    Container: container,
                    Set: function (p) {
                        var selectedOptions = String(((p || {}).TextValue || "")).split("~");
                        if (selectedOptions.length && !selectedOptions[0]) return;
                        
                        var _set = function (ind) {
                            setTimeout(function () {
                                var parentOption = ind > 0 ? selectedOptions[ind - 1] : null;
                                inputs[ind].Set(selectedOptions[ind], parentOption);
                            }, i * 100);
                        };

                        for (var i = 0, lnt = selectedOptions.length; i < lnt; ++i)
                            if ((inputs[i] || {}).Set) _set(i);
                    },
                    Get: function () {
                        var retValue = !inputs.length ? "" : inputs[0].Get(true);
                        if ((retValue === false) && !params.Necessary)
                            return { Result: false, Message: RVDic.PleaseFillNecessaryFields };
                        
                        return !(retValue || {}).TextValue ? (params.Necessary === true ? false : null) : retValue;
                    }
                };
            },

            dataview: function (params) {
                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container"
                }]);

                var container = elems["container"];

                var levels = [];
                
                for (var i = 0, lnt = (((params || {}).Info || {}).Levels || []).length; i < lnt; ++i)
                    levels.push(Base64.decode(params.Info.Levels[i]));
                
                var _add_normal = function (title, val, isFirst) {
                    var itmElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div",
                            Style: "display:" + (isFirst ? "none" : "inline-block") + "; margin:0rem 0.4rem;",
                            Childs: [{
                                Type: "i", Class: "fa " + (RV_RTL ? "fa-angle-double-left" : "fa-angle-double-right") + " fa-lg",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                            Style: "display:inline-block; margin:0.2rem; cursor:default;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.7rem; font-weight:bold;" +
                                        "margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: title + ":" }]
                                },
                                { Type: "div", Style: "display:inline-block;", Name: "theVal" }
                            ]
                        }
                    ], container);

                    GlobalUtilities.append_markup_text(itmElems["theVal"], val);
                };

                return {
                    Container: container,
                    Set: function (p) {
                        container.innerHTML = "";

                        var items = String((p || {}).TextValue || "").split("~");

                        var isFirst = true;
                        
                        for (var i = 0, lnt = items.length; i < lnt; ++i) {
                            items[i] = GlobalUtilities.trim(items[i] || "");
                            if (!items[i]) continue;
                            _add_normal(levels[i] || RVDic.LevelN.replace("[n]", i + 1), items[i], isFirst);
                            isFirst = false;
                        }

                        if (isFirst) FormElementTypes.Text.nothing2display(container);
                    }
                };
            },

            searchfilters: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "margin:0rem;",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" },
                            {
                                Type: "div", Class: "ActionButton rv-border-radius-quarter", Name: "addButton",
                                Style: "display:inline-block; padding-left:2rem; padding-right:2rem;" +
                                    "margin-top:0.5rem; font-weight:bold; font-size:0.7rem;",
                                Childs: [{ Type: "text", TextValue: "+ " + RVDic.Add }]
                            }
                        ]
                    }
                ]);

                var _value_exist = function (textValue) {
                    var first = elems["itemsArea"].firstChild;
                    while (first) {
                        if (first.TextValue == textValue) return true;
                        first = first.nextSibling;
                    };
                    return false;
                };

                var _add_selected_text = function (dt) {
                    if (!(dt || {}).TextValue || _value_exist(dt.TextValue)) return;

                    dt = GlobalUtilities.extend({}, params, dt || {});

                    var viewElem = FormElementTypes.MultiLevel.dataview(dt);
                    viewElem.Set(dt);
                    
                    var newElems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                            Style: "position:relative; padding-" + RV_Float + ":1.5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "remove", Tooltip: RVDic.Remove,
                                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "item" }
                            ]
                        }
                    ], elems["itemsArea"]);

                    var removing = false;

                    var _remove = function () {
                        if (removing) return;
                        removing = true;

                        jQuery(newElems["container"]).animate({ height: "toggle" }, 500, function () {
                            jQuery(newElems["container"]).remove();
                        });
                    };

                    newElems["container"].TextValue = dt.TextValue;
                    newElems["container"].Remove = newElems["remove"].onclick = _remove;

                    newElems["item"].appendChild(viewElem.Container);
                };

                elems["addButton"].onclick = function () {
                    var _el = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                            Childs: [
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "item" },
                                {
                                    Type: "div", Class: "small-8 medium-6 large-4 rv-air-button rv-circle",
                                    Style: "margin:1rem auto 0rem auto;", Name: "confirmButton",
                                    Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                                }
                            ]
                        }
                    ]);

                    var fillElem = FormElementTypes.MultiLevel.fill(params);
                    if (!fillElem) return;

                    _el["item"].appendChild(fillElem.Container);

                    var showed = GlobalUtilities.show(_el["_div"]);

                    _el["confirmButton"].onclick = function () {
                        var dt = fillElem.Get();
                        if (!(dt || {}).TextValue) return;
                        _add_selected_text(dt);
                        showed.Close();
                    };
                };

                return {
                    Container: elems["container"],
                    Get: function (params) {
                        var delimiter = (params || {}).Delimiter || "|";

                        var textItems = [], first = elems["itemsArea"].firstChild;
                        while (first) {
                            if (first.TextValue) textItems.push(Base64.encode(GlobalUtilities.trim(first.TextValue)));
                            first = first.nextSibling;
                        };
                        
                        return {
                            TextItems: textItems.join(delimiter), Exact: true, Or: true,
                            JSONValue: !(textItems || []).length ? null : { TextItems: textItems, Exact: true, Or: true }
                        };
                    },
                    Set: function (data) {
                        jQuery.each((params || {}).TextItems || [], function (ind, val) {
                            _add_selected_text({ TextValue: val });
                        });
                    },
                    Clear: function () {
                        var first = elems["itemsArea"].firstChild;
                        while (first) {
                            if (first.Remove) first.Remove();
                            first = first.nextSibling;
                        };
                    }
                }
            }
        },

        Binary: {
            isempty: function (params) { return !((params || {}).BitValue === true || (params || {}).BitValue === false); },

            edit: function (info) {
                var optionItems = [
                    { Name: "yes", Title: RVDic.Yes },
                    { Name: "no", Title: RVDic.No }
                ];

                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "container",
                    Childs: optionItems.map(itm => {
                        return {
                            Type: "div", Class: FormElementTypeSettings.SmallOptionClass,
                            Style: "display:flex; flex-flow:row; align-items:center; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label",
                                    Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                        "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                    Childs: [{ Type: "text", TextValue: itm.Title + ":" }]
                                },
                                {
                                    Type: "div", Style: "flex:1 1 auto;",
                                    Childs: [{
                                        Type: "input", Class: "rv-input-simple",
                                        Style: "width:100%; font-size:0.7rem;", Name: itm.Name
                                    }]
                                }
                            ]
                        };
                    })
                }]);

                var container = elems["container"];
                var yesInput = elems["yes"];
                var noInput = elems["no"];

                var get_value = function (input) {
                    return GlobalUtilities.trim(input.value);
                };

                var validate = function (input) {
                    input.classList[!!get_value(input) ? "remove" : "add"]("rv-input-simple-invalid");
                };

                optionItems.forEach(itm => {
                    jQuery(elems[itm.Name]).on("keyup", function () {
                        validate(elems[itm.Name]);
                        jQuery(elems[itm.Name]).css({ 'direction': GlobalUtilities.textdirection(get_value(elems[itm.Name])) });
                    });

                    validate(elems[itm.Name]);
                });

                var _set = function (p) {
                    yesInput.value = (p || {}).Yes ? Base64.decode(p.Yes) : "";
                    noInput.value = (p || {}).No ? Base64.decode(p.No) : "";
                };

                _set(info);

                return {
                    Container: container,
                    Clear: function () {
                        yesInput.value = noInput.value = "";
                    },
                    Set: function (p) { _set(p); },
                    Get: function () {
                        var yes = GlobalUtilities.trim(yesInput.value);
                        var no = GlobalUtilities.trim(noInput.value);
                        return (!yes || !no) ? false : { Yes: Base64.encode(yes), No: Base64.encode(no) };
                    }
                };
            },

            view: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);
                var container = elems["container"];

                var _set = function (p) {
                    container.innerHTML = "";

                    var options = [];
                    if ((((p || {}).Info || {}).Yes || "") != "") options.push(p.Info.Yes);
                    if ((((p || {}).Info || {}).No || "") != "") options.push(p.Info.No);
                    for (var i = 0, lnt = options.length; i < lnt; ++i) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div",
                                Childs: [
                                    {
                                        Type: "div",
                                        Style: "display:inline-block; color:red; margin-" + RV_RevFloat + ":0.4rem; font-size:0.9rem;",
                                        Childs: [{ Type: "text", TextValue: "-  " }]
                                    },
                                    {
                                        Type: "div", Style: "display:inline-block;",
                                        Childs: [{ Type: "text", TextValue: Base64.decode(options[i]) }]
                                    }
                                ]
                            }
                        ], container);
                    }
                }

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            _get_poll_options_dic: function (params) {
                var _dic = { true: { Count: 0, Selected: false }, false: { Count: 0, Selected: false } };
                var totalCount = 0;

                for (var i = 0; i < (params.Abstract.Values || []).length ; ++i) {
                    if (_dic[params.Abstract.Values[i].Value]) {
                        _dic[params.Abstract.Values[i].Value].Count = params.Abstract.Values[i].Count;
                        totalCount += params.Abstract.Values[i].Count;
                    }
                }

                if (GlobalUtilities.get_type((params || {}).BitValue) == "boolean")
                    _dic[params.BitValue].Selected = true;

                return { Dic: _dic, TotalCount: totalCount };
            },

            _fill_poll: function (params) {
                var container = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ])["container"];

                var ret = FormElementTypes.Binary._get_poll_options_dic(params);

                for (var v in ret.Dic) {
                    var ttl = v == "true" ? Base64.decode(params.Info.Yes || "") || RVDic.Yes :
                        Base64.decode(params.Info.No || "") || RVDic.No;

                    __CreatePollItem(container, {
                        Value: String(v) == "true",
                        Title: ttl,
                        Count: ret.Dic[v].Count,
                        Percent: !ret.TotalCount ? 0 : (ret.Dic[v].Count / ret.TotalCount) * 100,
                        Selected: ret.Dic[v].Selected,
                        Editable: true,
                        MultiSelect: false
                    });
                }

                return {
                    Container: container,
                    Set: function (p) {
                        var val = (p || {}).BitValue;

                        var firstChild = container.firstChild;
                        while (firstChild) {
                            if ((firstChild.TheValue === val) && firstChild.Select) firstChild.Select();
                            firstChild = firstChild.nextSibling;
                        }
                    },
                    Get: function () {
                        var val = null;

                        var firstChild = container.firstChild;
                        while (firstChild) {
                            if (firstChild.Selected) val = firstChild.TheValue;
                            firstChild = firstChild.nextSibling;
                        }

                        if (GlobalUtilities.get_type(val) == "boolean") {
                            return {
                                TextValue: val ? Base64.decode(params.Info.Yes || "") : Base64.decode(params.Info.No || ""),
                                BitValue: val
                            };
                        }

                        return params.Necessary === true ? false : null;
                    }
                };
            },

            fill: function (params) {
                if ((params || {}).Abstract) return FormElementTypes.Binary._fill_poll(params);

                var radioElems = [];

                var options = [];
                if (((params || {}).Info || {}).Yes) options.push(Base64.decode(params.Info.Yes || ""));
                if (((params || {}).Info || {}).No) options.push(Base64.decode(params.Info.No || ""));

                if (options.length < 2) return;

                var _add = function (index) {
                    var normalClass = index ? "rv-air-button-soft-green" : "rv-air-button-soft-red";
                    var selectedClass = index ? "rv-air-button-green" : "rv-air-button-red";
                    var buttonName = index ? "yesButton" : "noButton";
                    var otherButton = index ? "noButton" : "yesButton";

                    var selected = false;

                    var _set_value = function (val) {
                        selected = !!val;
                        elems[buttonName].classList.remove(val ? normalClass : selectedClass);
                        elems[buttonName].classList.add(val ? selectedClass : normalClass);
                        elems[buttonName].style.fontWeight = val ? "bold" : "normal";
                        elems[buttonName + "Check"].style.display = val ? "inline-block" : "none";
                    };

                    radioElems.push({
                        Type: "div", Class: "small-6 medium-6 large-6",
                        Style: "padding-" + (index ? RV_RevFloat : RV_Float) + ":0.5rem;",
                        Properties: [
                            {
                                Name: "onclick",
                                Value: function (value) {
                                    if (!selected) elems[otherButton].setValue(false);
                                    _set_value(!selected);
                                }
                            }
                        ],
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 rv-circle",
                                Style: "cursor:pointer; background-color:white; padding:0.2rem; text-align:center; height:100%;",
                                Childs: [
                                    {
                                        Type: "div", Style: "padding:0.3rem 1rem; height:100%;", Name: buttonName,
                                        Class: "small-12 medium-12 large-12 rv-circle rv-air-button-base " + normalClass,
                                        Properties: [
                                            { Name: "setValue", Value: function (val) { _set_value(val); } },
                                            { Name: "getValue", Value: function () { return selected; } }
                                        ],
                                        Childs: [
                                            {
                                                Type: "middle",
                                                Childs: [
                                                    { Type: "text", TextValue: options[index == 0 ? 1 : 0] },
                                                    {
                                                        Type: "div", Class: "rv-circle", Name: buttonName + "Check",
                                                        Style: "display:none; width:1rem; height:1rem; background-color:white;" +
                                                            "margin-" + RV_Float + ":0.4rem;",
                                                        Childs: [
                                                            {
                                                                Type: "i", Class: "fa fa-check", Style: "color:green;",
                                                                Attributes: [{ Name: "aria-hidden", Value: true }]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    });
                };

                _add(1);
                _add(0);

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row", Name: "container", Style: "margin:0rem;",
                        Childs: radioElems
                    }
                ]);
                var container = elems["container"];

                var radios = [elems["yesButton"], elems["noButton"]];

                return {
                    Container: container,
                    Set: function (p) {
                        p = p || {};
                        if ((p.BitValue !== true && p.BitValue !== false) || radios.length < 2) return;
                        var stat = (p || {}).BitValue === true;
                        radios[stat ? 0 : 1].setValue(true);
                        radios[stat ? 1 : 0].setValue(false);
                    },
                    Get: function () {
                        if (radios.length < 2) return null;

                        for (var i = 0, lnt = radios.length; i < lnt; ++i) {
                            if (radios[i].getValue()) {
                                return {
                                    TextValue: i == 0 ? options[0] : options[1],
                                    BitValue: i == 0 ? true : false
                                };
                            }
                        }

                        return params.Necessary === true ? false : null;
                    }
                }
            },

            dataview: function (params) {
                var container = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ])["container"];

                return {
                    Container: container,
                    Set: function (p) {
                        container.innerHTML = "";

                        if (!p.Abstract) {
                            if (GlobalUtilities.get_type((p || {}).BitValue) == "boolean") {
                                var text = p.TextValue ||
                                    ((p || {}).BitValue ? Base64.decode((p.Info || {}).Yes || "") || RVDic.Yes :
                                    Base64.decode((p.Info || {}).No || "") || RVDic.No);

                                GlobalUtilities.create_nested_elements([
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12 rv-circle",
                                        Style: "padding:0.2rem; background-color:white;",
                                        Childs: [
                                            {
                                                Type: "div", Style: "cursor:default; font-weight:bold;",
                                                Class: "small-12 medium-12 large-12 rv-circle rv-air-button-base " +
                                                    (p.BitValue ? "rv-air-button-green" : "rv-air-button-red"),
                                                Childs: [{ Type: "text", TextValue: text }]
                                            }
                                        ]
                                    }
                                ], container);
                            }
                            else FormElementTypes.Text.nothing2display(container);
                        }
                        else {
                            var ret = FormElementTypes.Binary._get_poll_options_dic(p);

                            for (var v in ret.Dic) {
                                var ttl = v == "true" ? Base64.decode(p.Info.Yes || "") || RVDic.Yes :
                                    Base64.decode(p.Info.No || "") || RVDic.No;

                                __CreatePollItem(container, {
                                    Value: String(v) == "true",
                                    Title: ttl,
                                    Count: ret.Dic[v].Count,
                                    Percent: !ret.TotalCount ? 0 : (ret.Dic[v].Count / ret.TotalCount) * 100,
                                    Selected: ret.Dic[v].Selected
                                });
                            }
                        }
                    }
                }
            },

            searchfilters: function (params) {
                params = params || {};

                var yesValue = Base64.decode(((params || {}).Info || {}).Yes || "");
                var noValue = Base64.decode(((params || {}).Info || {}).No || "");

                var container = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ])["container"];

                var _obj = __CreateRadiosCheckboxes(container, { Options: [yesValue, noValue], IsCheckbox: false });

                return {
                    Container: container,
                    Get: function () {
                        var _val = _obj.Get();
                        var bitValue = _val == null ? null : _val == yesValue;

                        return {
                            Bit: bitValue, Data: _val,
                            JSONValue: bitValue === null ? null : { Bit: bitValue }
                        };
                    },
                    Set: function (data) { _obj.Set((data || {}).Data); },
                    Clear: function () { _obj.Clear(); }
                }
            }
        },

        Numeric: {
            isempty: function (params) { return !((params || {}).FloatValue || (params || {}).FloatValue === 0); },

            edit: function () {
                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-align", Name: "container",
                    Childs: [
                        { Name: "naturalOnly", Title: RVDic.NaturalNumbersOnly },
                        { Name: "commaSeparator", Title: RVDic.CommaSeparator }
                    ].map(itm => {
                        return {
                            Type: "div", Class: FormElementTypeSettings.SmallOptionClass,
                            Style: "display:flex; flex-flow:row; align-items:center; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label", Style: "flex:1 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: itm.Title + ":" }]
                                },
                                {
                                    Type: "switch", Name: itm.Name, Style: "flex:0 0 auto; margin-top:0.2rem;",
                                    Params: FormElementTypeSettings.SwitchParams
                                }
                            ]
                        };
                    }).concat([
                        { Name: "min", Title: RVDic.Min, Placeholder: "e.g. 1" },
                        { Name: "max", Title: RVDic.Max, Placeholder: "e.g. 1000" },
                        { Name: "weight", Title: RVDic.Weight, Placeholder: "e.g. 2"}
                    ].map(itm => {
                        return {
                            Type: "div", Class: FormElementTypeSettings.SmallOptionClass,
                            Style: "display:flex; flex-flow:row; align-items:center; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label",
                                    Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                        "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                    Childs: [{ Type: "text", TextValue: itm.Title + ":" }]
                                },
                                {
                                    Type: "div", Style: "flex:1 1 auto; text-align:left; direction:ltr;",
                                    Childs: [{
                                        Type: "number", Class: "rv-input-simple rv-placeholder-align-left",
                                        Style: "width:100%; font-size:0.7rem;", Name: itm.Name, InnerTitle: itm.Placeholder
                                    }]
                                }
                            ]
                        };
                    }))
                }]);

                var container = elems["container"];
                var minInput = elems["min"];
                var maxInput = elems["max"];
                var naturalOnly = elems["naturalOnly"].Checkbox;
                var commaSeparator = elems["commaSeparator"].Checkbox;

                var _set = function (p, w) {
                    p = p || {};

                    if (GlobalUtilities.get_type(w) == "number") elems["weight"].value = w;
                    else elems["weight"].value = "";
                    
                    if (p.Min || (p.Min === 0)) minInput.value = p.Min;
                    else minInput.value = "";

                    if (p.Max || (p.Max === 0)) maxInput.value = p.Max;
                    else maxInput.value = "";

                    naturalOnly.checked = p.NaturalNumbersOnly === true;
                    commaSeparator.checked = p.CommaSeparator === true;
                };

                return {
                    Container: container,
                    Clear: function () {
                        naturalOnly.checked = false;
                        commaSeparator.checked = false;
                        minInput.value = maxInput.value = "";
                    },
                    Set: function (p, _weight) { _set(p, _weight); },
                    Get: function () {
                        var min = GlobalUtilities.trim(minInput.value);
                        var max = GlobalUtilities.trim(maxInput.value);

                        min = !min.length || isNaN(+min) ? null : +min;
                        max = !max.length || isNaN(+max) ? null : +max;

                        if ((min !== null) && (max !== null) && (min > max)) {
                            var tt = min;
                            min = max;
                            max = tt;
                        }

                        return {
                            Min: min, Max: max,
                            NaturalNumbersOnly: naturalOnly.checked === true,
                            CommaSeparator: commaSeparator.checked === true
                        };
                    },
                    Weight: function () {
                        var _weight = elems["weight"].value;
                        return !_weight || GlobalUtilities.get_type(+_weight) != "number" ? null : +_weight;
                    }
                };
            },

            view: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                var _set = function (p) {
                    container.innerHTML = "";
                    
                    var min = ((p || {}).Info || {}).Min;
                    var max = ((p || {}).Info || {}).Max;
                    if (min !== null) min = +min;
                    if (max !== null) max = +max;
                    if (isNaN(min)) min = null;
                    if (isNaN(max)) max = null;
                    
                    var naturalOnly = ((p || {}).Info || {}).NaturalNumbersOnly === true;
                    var commaSeparator = ((p || {}).Info || {}).CommaSeparator === true;

                    var _el = GlobalUtilities.create_nested_elements([
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "weight" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (min !== null ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Min + ":" }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: String(min) }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (max !== null ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Max + ":" }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: String(max) }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (naturalOnly ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.NaturalNumbersOnly }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (commaSeparator ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.9rem; color:red; margin-" + RV_RevFloat + ":0.4rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.CommaSeparator }]
                                }
                            ]
                        }
                    ], container);

                    if (+(p || {}).Weight) _el["weight"].innerHTML = "<span style='font-weight:bold;'>(" +
                        RVDic.Weight + ": " + GlobalUtilities.convert_numbers_to_persian(p.Weight) + ")</span>";
                }

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            fill: function (params) {
                params = params || {};
                var info = params.Info || {};
                
                var naturalOnly = info.NaturalNumbersOnly === true;
                var min = +info.Min;
                var max = +info.Max;
                if (isNaN(min)) min = 0;
                if (isNaN(max)) max = 0;
                
                if ((min > 0) && (max > 0)) {
                    min = Math.min(min, max);
                    max = Math.max(min, max);
                }
                
                var _innerTitle = (naturalOnly ? RVDic.NaturalNumber : RVDic.Number) +
                    (min > 0 && !max ? " " + RVDic.GreaterThanOrEqualTo + " " + min :
                    (min == 0 && max > 0 ? " " + RVDic.SmallerThanOrEqualTo + " " + max :
                    (min > 0 ? " " + RVDic.Between + " " + min + " " + RVDic.And + " " + max : "")));
                _innerTitle = GlobalUtilities.convert_numbers_to_persian(_innerTitle);

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-6 large-4", Name: "container",
                        Childs: [
                            {
                                Type: "number", Class: "rv-input", Tooltip: _innerTitle,
                                Style: "width:100%;", Name: "_input", InnerTitle: _innerTitle,
                                Params: { Float: !naturalOnly }
                            }
                        ]
                    }
                ]);

                var container = elems["container"];
                var _input = elems["_input"];

                var _empty = function () { _input.value = ""; };

                var _is_valid_input = function () {
                    var val = GlobalUtilities.trim(_input.value);
                    
                    if ((GlobalUtilities.get_type(params.Validator) == "function") &&
                        !params.Validator({ FloatValue: val })) return false;

                    return (val === "") || (!isNaN(+val) && !(naturalOnly && (val.indexOf(".") >= 0)) &&
                        !(+val < min) && !(max && (+val > max)));
                };

                //Check unique constraint
                var uniqueDic = { "": false };

                var set_background = function () {
                    _input.style.backgroundColor =
                        !_is_valid_input() || uniqueDic[GlobalUtilities.trim(_input.value)] ? "#fcddfb" : "white";
                };

                GlobalUtilities.set_onchange(_input, function () {
                    if (!params.UniqueValue) set_background();
                    else {
                        var theValue = GlobalUtilities.trim(_input.value);

                        if (isNaN(theValue)) return;
                        else if (GlobalUtilities.get_type(uniqueDic[theValue]) == "boolean") return set_background();

                        FGAPI.MeetsUniqueConstraint({
                            InstanceID: params.InstanceID, ElementID: params.ElementID,
                            FloatValue: theValue, ParseResults: true,
                            ResponseHandler: function (result) {
                                uniqueDic[theValue] = !result.Value;
                                if (theValue == GlobalUtilities.trim(_input.value)) set_background();
                            }
                        });
                    }
                });
                //end of Check unique constraint

                return {
                    Container: container,
                    Set: function (p) {
                        if ((p || {}).FloatValue == null) _empty();
                        else _input.value = +(p || {}).FloatValue;

                        set_background();
                    },
                    Get: function () {
                        var val = GlobalUtilities.trim(_input.value);

                        var notValid = !_is_valid_input();

                        if (notValid || (val && uniqueDic[val])) {
                            return {
                                Result: false,
                                Message: val && uniqueDic[val] ? RVDic.MSG.UniqueConstriantHasNotBeenMet :
                                    (!params.Necessary ? RVDic.InputDataIsNotValid : null)
                            };
                        }

                        return !String(val) ? (params.Necessary === true ? false : null) : { FloatValue: +val };
                    }
                }
            },

            dataview: function (params) {
                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                return {
                    Container: container,
                    Set: function (p) {
                        p = p || {};

                        container.innerHTML = "";

                        if (GlobalUtilities.get_type(p.FloatValue) == "number") {
                            var val = !(p.Info || {}).CommaSeparator ? p.FloatValue || "0" :
                                GlobalUtilities.get_comma_separated_number(p.FloatValue);

                            GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Style: "cursor:default;",
                                    Class: "small-12 medium-9 large-6 rv-white-button rv-circle",
                                    Childs: [{ Type: "text", TextValue: val }]
                                }
                            ], container);
                        }
                        else FormElementTypes.Text.nothing2display(container);
                    }
                }
            },

            searchfilters: function (params) {
                params = params || {};

                var naturalOnly = ((params || {}).Info).NaturalNumbersOnly === true;

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                            },
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":2rem;",
                                Childs: [
                                    {
                                        Type: "number", Class: "rv-input", Name: "from", Params: { Float: !naturalOnly },
                                        Style: "width:14rem; font-size:0.7rem;",
                                    }
                                ]
                            },
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                            },
                            {
                                Type: "div", Style: "display:inline-block;",
                                Childs: [
                                    {
                                        Type: "number", Class: "rv-input", Name: "to", Params: { Float: !naturalOnly },
                                        Style: "width:14rem; font-size:0.7rem;",
                                    }
                                ]
                            }
                        ]
                    }
                ]);

                var fromInput = elems["from"];
                var toInput = elems["to"];

                return {
                    Container: elems["container"],
                    Get: function () {
                        var from = isNaN(+fromInput.value) || !GlobalUtilities.trim(fromInput.value) ? null : +fromInput.value;
                        var to = isNaN(+toInput.value) || !GlobalUtilities.trim(toInput.value) ? null : +toInput.value;

                        return {
                            FloatFrom: from, FloatTo: to,
                            JSONValue: (from === null) && (to === null) ? null : { FloatFrom: from, FloatTo: to }
                        };
                    },
                    Set: function (data) {
                        data = data || {};
                        if (!isNaN(data.FloatFrom)) fromInput.value = data.FloatFrom;
                        if (!isNaN(data.FloatTo)) toInput.value = data.FloatTo;
                    },
                    Clear: function () { fromInput.value = toInput.value = ""; }
                }
            }
        },

        Node: {
            isempty: function (params) { return !((params || {}).GuidItems || []).length && !(params || {}).TextValue; },

            _edit: function (info, params, itemType) {
                var isNode = itemType == "Node";

                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Name: "container",
                    Childs: [
                        (!isNode ? null : {
                            Type: "div", Class: "small-12 medium-10 large-8", Style: "margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "flex:1 1 auto; display:flex; flex-flow:row;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Class: "rv-border-radius-quarter rv-ignore-" + RV_RevFloat.toLowerCase() + "-radius SoftBackgroundColor",
                                            Style: "flex:0 0 auto; padding-" + RV_Float + ":0.3rem;"
                                        },
                                        {
                                            Type: "div", Name: "nodeType",
                                            Style: "flex:1 1 auto; display:flex; flex-flow:column;" +
                                                "padding:0.5rem; padding-" + RV_RevFloat + ":0;"
                                        }
                                    ]
                                }
                            ]
                        }),
                        {
                            Type: "div", Class: FormElementTypeSettings.SmallOptionClass,
                            Style: "display:flex; flex-flow:row; align-items:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label", Style: "flex:1 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.MultiSelect + ":" }]
                                },
                                {
                                    Type: "switch", Name: "multiSelect",
                                    Style: "flex:0 0 auto; margin-top:0.2rem;",
                                    Params: FormElementTypeSettings.SwitchParams
                                }
                            ]
                        },
                    ]
                }]);

                var container = elems["container"];
                var multiSelect = elems["multiSelect"].Checkbox;

                var as = null;

                if (isNode) {
                    GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                        OnLoad: function () {
                            as = new NewSingleDataContainer(elems["nodeType"], {
                                InputClass: "rv-input",
                                InputStyle: "width:100%; font-size:0.7rem;",
                                InnerTitle: RVDic.NodeTypeSelect + "...",
                                NoButtons: true,
                                Necessary: true,
                                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                                ResponseParser: function (responseText) {
                                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                                    var arr = [];
                                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                                        arr.push([Base64.decode(nodeTypes[i].TypeName), nodeTypes[i].NodeTypeID]);
                                    return arr;
                                }
                            });
                        }
                    });
                }

                var _set = function (p) {
                    var nodeTypes = (!p ? [] : (p || {}).NodeTypes || [p]).filter(function (val) { return !!val.NodeTypeID; });
                    
                    if (as) {
                        as.clear();
                        
                        jQuery.each(nodeTypes, function (ind, val) {
                            as.add_item(Base64.decode(val.NodeType), val.NodeTypeID);
                        });
                    }

                    multiSelect.checked = !!(p || {}).MultiSelect;
                };

                return {
                    Container: container,
                    Clear: function () {
                        if (as) as.clear();
                        multiSelect.checked = false;
                    },
                    Set: function (p) { _set(p); },
                    Get: function () {
                        var nodeTypes = (!as ? null : as.get_items()) || [];

                        if (!isNode) return { MultiSelect: multiSelect.checked };
                        else {
                            return !nodeTypes.length ? false : {
                                NodeTypes: nodeTypes.map(function (val) {
                                    return { NodeTypeID: val.ID, NodeType: Base64.encode(val.Title) };
                                }),
                                MultiSelect: multiSelect.checked
                            };
                        }
                    }
                };
            },

            edit: function (info, params) { return FormElementTypes.Node._edit(info, params, "Node"); },

            _view: function (params, itemType) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                var _set = function (p) {
                    container.innerHTML = "";

                    var info = (p || {}).Info || {};

                    var nodeTypes = ((itemType == "Node" ? info.NodeTypes || [info] : null) || []).filter(function (val) {
                        return !!val.NodeTypeID;
                    });
                    
                    var _div = GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [
                            {
                                Type: "div", Name: "nodeTypes",
                                Style: "display:" + (nodeTypes.length ? "inline-block" : "none") + "; margin-" + RV_RevFloat + ":0.5rem;"
                            },
                            {
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                Style: "display:" + (info.MultiSelect ? "inline-block" : "none") +
                                    "; font-size:0.7rem; cursor:default;",
                                Childs: [{ Type: "text", TextValue: RVDic.MultiSelect }]
                            }
                        ]
                    }], container)["nodeTypes"];

                    jQuery.each(nodeTypes, function (ind, val) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Class: "rv-bg-color-white-softer rv-border-radius-quarter SoftShadow",
                                Style: "display:inline-block; padding:0.3rem; margin-" + RV_RevFloat + ":0.4rem; font-size:0.7rem;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(val.NodeType) }]
                            }
                        ], _div);
                    });
                };

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            view: function (params) { return FormElementTypes.Node._view(params, "Node"); },

            _node_select: function (params, nodeTypes, onSelect) {
                if (params.__NodeListContainer) {
                    params.__ShowedNodeList = GlobalUtilities.show(params.__NodeListContainer);
                    return;
                }

                var _div = params.__NodeListContainer = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0 auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                params.__ShowedNodeList = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);

                var _init_node_select = function (nodeTypesArray) {
                    var multiSelect = ((params || {}).Info || {}).MultiSelect === true;

                    var ns = new NodeSelect(_div, {
                        Options: {
                            Title: RVDic.NodeSelect,
                            NodeTypeSearchBox: false,
                            TreeCheckbox: multiSelect,
                            HideSelectedItems: !multiSelect,
                            Filters: true,
                            Limits: { NodeTypes: nodeTypesArray },
                            ShowBottomBar: multiSelect,
                            OnSelect: (multiSelect ? null : function (node) {
                                params.__ShowedNodeList.Close();
                                onSelect(node);
                            }),
                            OnConfirm: function () {
                                params.__ShowedNodeList.Close();

                                jQuery.each(ns.get_items({ Check: true }) || [], function (ind, val) {
                                    onSelect(val);
                                });
                            },
                            OnCancel: function () { params.__ShowedNodeList.Close(); }
                        }
                    });
                };

                var _precheck = function () {
                    var ntIds = (nodeTypes || []).map(function (val) { return val.NodeTypeID; });
                    
                    if (!ntIds.length) _init_node_select(nodeTypes);
                    else {
                        CNAPI.GetNodeTypes({
                            NodeTypeIDs: ntIds.join("|"), GrabSubNodeTypes: true, ParseResults: true,
                            ResponseHandler: function (result) {
                                _init_node_select(result.NodeTypes || nodeTypes);
                            }
                        });
                    }
                };

                GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                    OnLoad: function () { _precheck(); }
                });
            },

            _user_select: function (params, onSelect) {
                if (params.__UserListContainer) {
                    params.__ShowedUserList = GlobalUtilities.show(params.__UserListContainer);
                    return;
                }

                var _div = params.__UserListContainer = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0 auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                params.__ShowedUserList = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);

                GlobalUtilities.load_files(["USR/UserSelect.js"], {
                    OnLoad: function () {
                        var us = new UserSelect(_div, {
                            Options: {
                                HideSelectedItems: true,
                                OnSelect: function (user) {
                                    params.__ShowedUserList.Close();
                                    onSelect(user);
                                }
                            }
                        });
                    }
                });
            },

            _fill: function (params, itemType) {
                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-10 large-8 row", Name: "container", Style: "margin:0rem;" }
                ]);

                var container = elems["container"];
                
                var info = (params || {}).Info || {};
                var multiSelect = info.MultiSelect === true;

                var dataSource = "", innerTitle = "", parserInfo = {};
                var onSelectButtonClick = null;

                switch (itemType) {
                    case "Node":
                        var nodeTypes = (info.NodeTypes || [info]).filter(function (val) { return !!val.NodeTypeID; })
                            .map(function (x) { return { NodeTypeID: x.NodeTypeID, NodeType: Base64.decode(x.NodeType) }; });
                        innerTitle = RVDic.NodeSelect + "...";
                        if (nodeTypes.length == 1) innerTitle = RVDic.SelectN.replace("[n]", Base64.decode(nodeTypes[0].NodeType)) + "...";
                        dataSource = CNAPI.GetNodesDataSource({
                            NodeTypeIDs: nodeTypes.map(function (val) { return val.NodeTypeID; }).join("|"),
                            UseNodeTypeHierarchy: true
                        });
                        parserInfo = { Items: "Nodes", ID: "NodeID", Name: "Name" };
                        onSelectButtonClick = function () {
                            FormElementTypes.Node._node_select(params, nodeTypes, function (nd) {
                                if ((as || {}).add_item) as.add_item(nd.Name, nd.NodeID, nd);
                                else if ((as || {}).set_item) as.set_item(nd.NodeID, nd.Name, { IgnoreOnSelect: true });
                            });
                        };
                        break;
                    case "User":
                        innerTitle = RVDic.UserSelect + "...";
                        dataSource = UsersAPI.GetUsersDataSource();
                        parserInfo = { Items: "Users", ID: "UserID", Name: "FullName" };
                        onSelectButtonClick = function () {
                            FormElementTypes.Node._user_select(params, function (usr) {
                                var fullname = GlobalUtilities.trim(Base64.decode(usr.FirstName) + " " + Base64.decode(usr.LastName));

                                if ((as || {}).add_item) as.add_item(fullname, usr.UserID, usr);
                                else if ((as || {}).set_item) as.set_item(usr.UserID, fullname, { IgnoreOnSelect: true });
                            });
                        };
                        break;
                };

                var as = null, get = function () { return null; }, set = function () { };

                var parser = function (responseText) {
                    var arr = [];
                    jQuery.each(JSON.parse(responseText)[parserInfo.Items] || [], function (ind, val) {
                        arr.push([Base64.decode(val[parserInfo.Name]), val[parserInfo.ID]]);
                    });
                    return arr;
                };
                
                var objParams = {
                    InputClass: "rv-input",
                    InputStyle: "width:100%; font-size:0.7rem;",
                    InnerTitle: innerTitle,
                    NoButtons: true,
                    AjaxDataSource: dataSource,
                    ResponseParser: parser,
                    OnSelectButtonClick: onSelectButtonClick
                };

                var get_markup = function (id, name) {
                    if (window.AdvancedTextArea && ((itemType == "Node") || (itemType == "User")))
                        return AdvancedTextArea.get_markup({ ID: id, Type: itemType, Value: name });
                    return null;
                };

                if (!multiSelect) {
                    as = GlobalUtilities.append_autosuggest(container, objParams);

                    get = function () {
                        var index = as.selectedIndex;
                        var id = index >= 0 ? as.values[index] : "";
                        var name = index >= 0 ? as.keywords[index] : "";
                        var inputValue = GlobalUtilities.trim(as.InputElement.value);
                        return !inputValue || !id || !name ? null : {
                            TextValue: get_markup(id, name) || name,
                            GuidItems: [{ ID: id, Name: name }]
                        };
                    };
                }
                else {
                    GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                        OnLoad: function () {
                            as = new NewSingleDataContainer(container, objParams);

                            get = function () {
                                var items = [], name = [];
                                var refArr = (as.get_items() || []).sort(function (a, b) { return a.ID < b.ID ? 1 : -1 });

                                jQuery.each(refArr, function (ind, val) {
                                    items.push({ ID: val.ID, Name: val.Title });
                                    name.push(get_markup(val.ID, val.Title) || val.Title);
                                });

                                return !items.length ? null : { TextValue: name.join(" ~ "), GuidItems: items };
                            };
                        }
                    });
                }

                return {
                    Container: container,
                    Set: function (p) {
                        var items = (p || {}).GuidItems || [];
                        
                        if (items.length) {
                            if (!multiSelect && as) as.set_item(items[0].ID, items[0].Name);
                            else if (multiSelect && as)
                                jQuery.each(items, function (ind, val) { as.add_item(val.Name, val.ID); });
                        }
                        else if (as) as.clear();
                    },
                    Get: function () {
                        var ret = get();
                        return (ret == null) && (params.Necessary === true) ? false : ret;
                    }
                }
            },

            fill: function (params) { return FormElementTypes.Node._fill(params, "Node"); },

            _dataview: function (params, itemType) {
                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                var urlFunc = null;

                switch (itemType) {
                    case "Node":
                        urlFunc = function (itm) { return RVAPI.NodePageURL({ NodeID: itm.ID }) };
                        break;
                    case "User":
                        urlFunc = function (itm) { return RVAPI.UserPageURL({ UserID: itm.ID }) };
                        break;
                }

                var _do_add = function (item) {
                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:inline-block; margin-bottom:0.3rem; margin-" + RV_RevFloat + ":0.3rem;" +
                            (!item.ID ? "cursor:default;" : ""),
                        Link: !item.ID || !urlFunc ? null : urlFunc(item),
                        Childs: [
                            itemType != "User" ? { Type: "text", TextValue: "" } : {
                                Type: "i", Class: "fa fa-user", Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            },
                            { Type: "text", TextValue: item.Name }
                        ]
                    }], container);
                };

                var _add_item = function (item) {
                    if (item.ID) _do_add(item);
                    else {
                        GlobalUtilities.get_tags(item.Name, function (tags) {
                            if (!(tags || []).length) _do_add(item);
                            else jQuery.each(tags, function (ind, val) { _do_add({ ID: val.ID, Name: val.Value }); });
                        });
                    }
                };

                return {
                    Container: container,
                    Set: function (p) {
                        p = p || {};
                        container.innerHTML = "";
                        
                        if ((p.GuidItems || []).length) jQuery.each(p.GuidItems, function (ind, val) { _add_item(val); });
                        else if (p.TextValue) {
                            jQuery.each(p.TextValue.split("~"), function (ind, val) {
                                _add_item({ Name: GlobalUtilities.trim(val) });
                            });
                        }
                        else FormElementTypes.Text.nothing2display(container);
                    }
                };
            },

            dataview: function (params) { return FormElementTypes.Node._dataview(params, "Node"); },

            _searchfilters: function (params, itemType) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-7 medium-7 large-7", Name: "container",
                    Style: "padding-" + RV_RevFloat + ":1rem;"
                }]);

                var info = (params || {}).Info || {};

                var dataSource = "", innerTitle = "", parserInfo = {};
                var itemSelect = null;
                var onSelectButtonClick = null;

                switch (itemType) {
                    case "Node":
                        var nodeTypes = (info.NodeTypes || [info]).filter(function (val) { return !!val.NodeTypeID; });
                        //var nodeTypeId = info.NodeTypeID, nodeType = Base64.decode(info.NodeType);
                        innerTitle = RVDic.NodeSelect + "...";
                        if (nodeTypes.length == 1) innerTitle = RVDic.SelectN.replace("[n]", Base64.decode(nodeTypes[0].NodeType)) + "...";

                        dataSource = CNAPI.GetNodesDataSource({
                            NodeTypeIDs: nodeTypes.map(function (val) { return val.NodeTypeID; }).join("|"),
                            UseNodeTypeHierarchy: true
                        });

                        parserInfo = { Items: "Nodes", ID: "NodeID", Name: "Name" };

                        onSelectButtonClick = function () {
                            var prms = GlobalUtilities.extend({}, params || {}, { Info: { MultiSelect: true } });

                            FormElementTypes.Node._node_select(prms, nodeTypes, function (nd) {
                                if ((itemSelect || {}).add_item) itemSelect.add_item(nd.Name, nd.NodeID, nd);
                            });
                        };

                        break;
                    case "User":
                        innerTitle = RVDic.UserSelect + "...";
                        dataSource = UsersAPI.GetUsersDataSource();
                        parserInfo = { Items: "Users", ID: "UserID", Name: "FullName" };

                        onSelectButtonClick = function () {
                            var prms = GlobalUtilities.extend({}, params || {}, { Info: { MultiSelect: true } });

                            FormElementTypes.Node._user_select(prms, function (usr) {
                                var fullname = GlobalUtilities.trim(Base64.decode(usr.FirstName) + " " + Base64.decode(usr.LastName));
                                if ((itemSelect || {}).add_item) itemSelect.add_item(fullname, usr.UserID, usr);
                            });
                        };

                        break;
                };

                var parser = function (responseText) {
                    var items = JSON.parse(responseText)[parserInfo.Items] || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i][parserInfo.Name] || ""), items[i][parserInfo.ID] || ""]);
                    return arr;
                };

                GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                    OnLoad: function () {
                        itemSelect = new NewSingleDataContainer(elems["container"], {
                            NoButtons: true,
                            InputClass: "rv-input",
                            InputStyle: "width:100%; font-size:0.7rem;",
                            InnerTitle: innerTitle,
                            AjaxDataSource: dataSource,
                            ResponseParser: parser,
                            OnSelectButtonClick: onSelectButtonClick
                        });
                    }
                });

                return {
                    Container: elems["container"],
                    Get: function () {
                        var delimiter = (params || {}).Delimiter || "|";
                        var strItems = itemSelect == null ? null : itemSelect.get_items_string(delimiter);
                        
                        return {
                            GuidItems: strItems,
                            Data: itemSelect == null ? null : itemSelect.get_items(),
                            JSONValue: !strItems ? null : { GuidItems: strItems.split(delimiter) }
                        };
                    },
                    Set: function (data) {
                        if (!itemSelect) return;
                        data = (data || {}).Data || data || [];

                        for (var i = 0, lnt = data.length; i < lnt; ++i)
                            itemSelect.add_item(data[i].Title, data[i].ID);
                    },
                    Clear: function () { if (itemSelect) itemSelect.clear(); }
                }
            },

            searchfilters: function (params) { return FormElementTypes.Node._searchfilters(params, "Node"); }
        },

        User: {
            isempty: function (params) { return FormElementTypes.Node.isempty(params); },

            edit: function (info, params) { return FormElementTypes.Node._edit(info, params, "User"); },

            view: function (params) { return FormElementTypes.Node._view(params, "User"); },

            fill: function (params) { return FormElementTypes.Node._fill(params, "User"); },

            dataview: function (params) { return FormElementTypes.Node._dataview(params, "User"); },

            searchfilters: function (params) { return FormElementTypes.Node._searchfilters(params, "User"); }
        },

        File: {
            isempty: function (params) { return !((params || {}).Files || []).length; },

            edit: function (info) {
                var maxCountInnerTitle = RVDic.MaxCount;
                var maxSizeInnerTitle = RVDic.MaxFileSize + " (MB)";
                var totalSizeInnerTitle = RVDic.MaxUploadSize + " (MB)";

                var imagesOnlyExts = ["jpg", "jpeg", "png", "gif", "bmp"];

                var _create_input = function (values) {
                    values = values || {};

                    return {
                        Type: "div", Style: "display:flex; flex-flow:row; align-items:center; margin-bottom:1rem; width:15rem;",
                        Childs: [
                            {
                                Type: "div", Class: "rv-flat-label",
                                Style: "flex:1 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: values.Title + ":" }]
                            },
                            {
                                Type: "div", Style: "flex:0 0 auto; width:4rem;",
                                Childs: [{
                                    Type: "number", Name: values.Name, InnerTitle: values.Placeholder,
                                    Class: "rv-input-simple rv-placeholder-align-center",
                                    Style: "width:100%; font-size:0.7rem; text-align:center;"
                                }]
                            }
                        ]
                    };
                };

                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        _create_input({ Title: maxCountInnerTitle, Name: "count", Placeholder: "e.g. 2" }),
                        _create_input({ Title: maxSizeInnerTitle, Name: "size", Placeholder: "e.g. 20" }),
                        _create_input({ Title: totalSizeInnerTitle, Name: "totalSize", Placeholder: "e.g. 20" }),
                        {
                            Type: "div", Name: "extSelectContainer",
                            Style: "flex:0 0 auto; display:flex; flex-flow:row; align-items:center; margin-bottom:1rem; width:15rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label",
                                    Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                        "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.AllowedExtensions + ":" }]
                                },
                                {
                                    Type: "div", Style: "flex:1 1 auto; display:flex; flex-flow:row;",
                                    Childs: [
                                        {
                                            Type: "div",
                                            Class: "rv-border-radius-quarter rv-ignore-" + RV_RevFloat.toLowerCase() + "-radius SoftBackgroundColor",
                                            Style: "flex:0 0 auto; padding-" + RV_Float + ":0.3rem;"
                                        },
                                        {
                                            Type: "div", Name: "types",
                                            Style: "flex:1 1 auto; display:flex; flex-flow:column; padding:0.5rem;"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: FormElementTypeSettings.SmallOptionClass,
                            Style: "display:flex; flex-flow:row; align-items:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-flat-label", Style: "flex:1 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.ImageOnly + ":" }]
                                },
                                {
                                    Type: "switch", Name: "imageOnly", Style: "flex:0 0 auto; margin-top:0.2rem;",
                                    Params: GlobalUtilities.extend(FormElementTypeSettings.SwitchParams, {
                                        OnChange: function () { image_only_change(); }
                                    })
                                }
                            ]
                        }
                    ]
                }]);

                var container = elems["container"];
                var countInput = elems["count"];
                var sizeInput = elems["size"];
                var totalSizeInput = elems["totalSize"];
                var imageOnly = elems["imageOnly"].Checkbox;

                var obj = new NewSingleDataContainer(elems["types"], {
                    EnableTextItem: true, UseInlineInput: true, 
                    InputStyle: "width:100%; font-size:0.7rem;",
                    InnerTitle: "e.g. pdf, docx"
                });

                var image_only_change = function () {
                    jQuery(elems["extSelectContainer"])[imageOnly.checked ? "fadeOut" : "fadeIn"](200);
                };

                var _set = function (p) {
                    p = p || {};

                    countInput.value = p.MaxCount ? p.MaxCount : "";
                    sizeInput.value = p.MaxSize ? p.MaxSize : "";
                    totalSizeInput.value = p.TotalSize ? p.TotalSize : "";

                    imageOnly.checked = p.ImageOnly === true;
                    image_only_change();

                    if (obj) (p.AllowedExtensions || [])
                        .map(ext => Base64.decode(ext))
                        .forEach(ext => obj.add_item(ext, ext));
                };

                return {
                    Container: container,
                    Clear: function () {
                        imageOnly.checked = false;
                        image_only_change();
                        countInput.value = sizeInput.value = "";
                        if (obj) obj.clear();
                    },
                    Set: function (p) { _set(p); },
                    Get: function () {
                        var maxCount = +GlobalUtilities.trim(countInput.value);
                        var maxSize = +GlobalUtilities.trim(sizeInput.value);
                        var totalSize = +GlobalUtilities.trim(totalSizeInput.value);
                        if (isNaN(maxCount)) maxCount = 0;
                        if (isNaN(maxSize)) maxSize = 0;
                        if (isNaN(totalSize)) totalSize = 0;

                        var retVal = {
                            MaxCount: maxCount,
                            MaxSize: maxSize,
                            TotalSize: totalSize,
                            ImageOnly: imageOnly.checked === true,
                            AllowedExtensions: []
                        };

                        retVal.AllowedExtensions = (retVal.ImageOnly ? imagesOnlyExts :
                            (!obj ? [] : (obj.get_items() || [])).map(itm => itm.Title))
                            .map(itm => Base64.encode(itm))
                            .filter(itm => !!itm);

                        return retVal;
                    }
                };
            },

            view: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);

                var container = elems["container"];

                var _set = function (p) {
                    container.innerHTML = "";

                    var maxSize = +((p || {}).Info || {}).MaxSize;
                    var totalSize = +((p || {}).Info || {}).TotalSize;
                    var maxCount = +((p || {}).Info || {}).MaxCount;
                    if (isNaN(maxSize)) maxSize = 0;
                    if (isNaN(totalSize)) totalSize = 0;
                    if (isNaN(maxCount)) maxCount = 0;

                    var exts = ((p || {}).Info || {}).AllowedExtensions || [];

                    var _create_item = function (values) {
                        values = values || {};

                        return {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (values.Count > 0 ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; color:red; margin-" + RV_RevFloat + ":0.4rem; font-size:0.9rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block;",
                                            Childs: [{ Type: "text", TextValue: values.Title + ":" }]
                                        },
                                        {
                                            Type: "div", Name: values.Name,
                                            Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-weight:bold;",
                                            Childs: values.Name ? null : [{ Type: "text", TextValue: values.Count }]
                                        }
                                    ]
                                }
                            ]
                        }
                    };

                    var _el = GlobalUtilities.create_nested_elements([
                        _create_item({ Count: maxCount, Title: RVDic.MaxCount }),
                        _create_item({ Count: maxSize, Title: RVDic.MaxFileSize + " (MB)" }),
                        _create_item({ Count: totalSize, Title: RVDic.MaxUploadSize + " (MB)" }),
                        _create_item({ Count: exts.length, Title: RVDic.AllowedExtensions, Name: "exts" })
                    ], container);

                    var extsArea = _el["exts"];

                    for (var i = 0, lnt = exts.length; i < lnt; ++i) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(exts[i]) + (lnt > i + 1 ? " ," : "") }]
                            }
                        ], extsArea);
                    }
                }

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            fill: function (params) {
                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                        Style: "padding:0.3rem; border-style:dashed;", Name: "container", Tooltip: RVDic.UploadFile
                    }
                ]);

                var container = elems["container"];

                var acceptedFiles = ((params || {}).Info || {}).AllowedExtensions || [];
                
                for (var i = 0; i < acceptedFiles.length; ++i) {
                    acceptedFiles[i] = Base64.decode(acceptedFiles[i]);
                    if (acceptedFiles[i][0] != ".") acceptedFiles[i] = "." + acceptedFiles[i];
                }

                var uploader = null;

                var maxSize = +((params || {}).Info || {}).MaxSize;
                maxSize = isNaN(maxSize) || (Math.floor(maxSize) <= 0) ? null : Math.floor(maxSize);

                var totalSize = +((params || {}).Info || {}).TotalSize;
                totalSize = isNaN(totalSize) || (Math.floor(totalSize) <= 0) ? null : Math.floor(totalSize);

                var maxCount = +((params || {}).Info || {}).MaxCount;
                maxCount = isNaN(maxCount) || (Math.floor(maxCount) <= 0) ? null : Math.floor(maxCount);
                
                var _uploadParams = {
                    UploadDataSource: DocsAPI.GetUploadLink(),
                    Removable: true,
                    MaxSize: maxSize,
                    TotalSize: totalSize,
                    MaxCount: maxCount,
                    AcceptedFiles: acceptedFiles.length ? acceptedFiles : null,
                    OnUpload: function (file, jsonResponse) { },
                    OnRemove: function (p) { uploader.remove(p); }
                };

                GlobalUtilities.uploader(container, _uploadParams, function (au) { uploader = au; });

                return {
                    Container: container,
                    Set: function (p) {
                        if (uploader) uploader.clear();

                        var files = (p || {}).Files;

                        if (!files) return;
                        else if ((GlobalUtilities.get_type(files) == "array") && uploader) {
                            for (var i = 0; i < files.length; ++i)
                                uploader.add(files[i]);
                        }
                    },
                    Get: function () {
                        var files = !uploader ? null : uploader.get_items(true);
                        return !(files || []).length ? (params.Necessary === true ? false : null) : { Files: files };
                    }
                }
            },

            dataview: function (params, options) {
                options = options || {};

                var container = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ])["container"];
                
                return {
                    Container: container,
                    Set: function (p) {
                        container.innerHTML = "";

                        var files = [];

                        for (var i = 0; i < ((p || {}).Files || []).length; ++i) {
                            files.push(GlobalUtilities.extend({}, p.Files[i], {
                                FileName: Base64.decode(p.Files[i].FileName || ""),
                                DownloadLink: DocsAPI.GetDownloadLink({ FileID: p.Files[i].FileID, Download: true }),
                                ImageDownloadLink: DocsAPI.GetDownloadLink({ FileID: p.Files[i].FileID, Download: false }),
                                Extension: Base64.decode(p.Files[i].Extension || "")
                            }));
                        }

                        if (files.length) {
                            GlobalUtilities.load_files(["MediaManager/MediaManager.js"], {
                                OnLoad: function () {
                                    container.innerHTML = "";

                                    (new MediaManager({
                                        ContainerDiv: container,
                                        UnlimitedDownloadAccess: options.UnlimitedDownloadAccess,
                                        PDFCovers: options.PDFCovers || []
                                    })).add_items(files, {
                                        Removable: false, Acceptable: false
                                    });
                                }
                            });
                        }
                        else FormElementTypes.Text.nothing2display(container);
                    }
                }
            },

            searchfilters: function (params) {
                params = params || {};
                return FormElementTypes.Text.searchfilters(params);
            }
        },

        Form: {
            isempty: function (params) { return !((params || {}).FormInstanceIDs || []).length; },

            edit: function () {
                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-10 large-8", Name: "container",
                    Childs: [{
                        Type: "div", Style: "flex:0 0 auto; display:flex; flex-flow:row; align-items:center;",
                        Childs: [
                            {
                                Type: "div", Class: "rv-flat-label",
                                Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                    "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.FormSelect + ":" }]
                            },
                            {
                                Type: "div", Style: "flex:1 1 auto; display:flex; flex-flow:row;",
                                Childs: [
                                    {
                                        Type: "div", Style: "flex:0 0 auto; padding-" + RV_Float + ":0.3rem;",
                                        Class: "rv-border-radius-quarter rv-ignore-" + RV_RevFloat.toLowerCase() + "-radius SoftBackgroundColor"
                                    },
                                    {
                                        Type: "div", Name: "form",
                                        Style: "flex:1 1 auto; padding:0.5rem; padding-" + RV_RevFloat + ":0;"
                                    }
                                ]
                            }
                        ]
                    },]
                }]);

                var container = elems["container"];

                var as = GlobalUtilities.append_autosuggest(elems["form"], {
                    InputClass: "rv-input",
                    InputStyle: "width:100%;",
                    InnerTitle: RVDic.Select + "...",
                    AjaxDataSource: FGAPI.GetForms(),
                    ResponseParser: function (responseText) {
                        var items = JSON.parse(responseText).Forms || [];
                        var arr = [];
                        for (var i = 0, lnt = items.length; i < lnt; ++i)
                            arr.push([Base64.decode(items[i].Title || ""), items[i].FormID]);
                        return arr;
                    },
                    OnSelect: function () { validate(); }
                });

                var get_selected_form = function () {
                    var index = as.selectedIndex;
                    var formId = index >= 0 ? as.values[index] : "";
                    var formName = index >= 0 ? as.keywords[index] : "";

                    return !formId || !formName ||
                        (GlobalUtilities.trim(as.InputElement.value) != GlobalUtilities.trim(formName)) ? null :
                        { FormID: formId, FormName: Base64.encode(formName) };
                };

                var validate = function () {
                    as.InputElement.classList[get_selected_form() ? "remove" : "add"]("rv-input-invalid");
                };

                jQuery(as.InputElement).on("keyup", function () { validate(); });

                var _set = function (p) {
                    if ((p || {}).FormID && (p || {}).FormName)
                        as.set_item(p.FormID, Base64.decode(p.FormName));
                    else as.clear();

                    validate();
                };

                return {
                    Container: container, Clear: function () { as.clear(); },
                    Set: function (p) { _set(p); },
                    Get: function () {
                        var frm = get_selected_form();

                        return !frm ? false : frm;
                    }
                };
            },

            view: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" }
                ]);
                var container = elems["container"];

                var _set = function (p) {
                    container.innerHTML = "";

                    var formId = ((p || {}).Info || {}).FormID || "";
                    var formName = Base64.decode(((p || {}).Info || {}).FormName || "");

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: (formId ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "display:inline-block; color:red; margin-" + RV_RevFloat + ":0.4rem; font-size:0.9rem;",
                                    Childs: [{ Type: "text", TextValue: "-  " }]
                                },
                                { Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: formName }] }
                            ]
                        }
                    ], container);
                }

                _set(params);

                return { Container: container, Set: function (p) { _set(p); } }
            },

            fill_and_dataview: function (params, options) {
                options = options || {};
                
                var editable = !!params.Editable;

                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder", Name: "items",
                            Style: "overflow-x:auto; overflow-y:hidden; font-size:0.7rem; border-color:rgb(150,150,150);"
                        },
                        {
                            Type: "div", Class: "ActionButton", Name: "addButton",
                            Style: "display:none; margin-top:0.3rem; width:8rem; padding:0.2rem 0rem;" +
                                "font-size:0.7rem; font-weight:bold;",
                            Properties: [{ Name: "onclick", Value: function () { _new_record(); } }],
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-plus", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.Add }
                            ]
                        },
                        {
                            Type: "div", Class: "ActionButton", Name: "removeButton",
                            Style: "display:none; margin-top:0.3rem; width:8rem; padding:0.2rem 0rem;" +
                                "font-size:0.7rem; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                            Properties: [{ Name: "onclick", Value: function () { _remove_all(); } }],
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.RemoveAll }
                            ]
                        }
                    ]
                }]);

                var formId = (params.Info || {}).FormID;

                var container = elems["container"];
                var itemsContainer = elems["items"];
                
                var theTable = null;
                var theColumns = !editable ? [] : [
                    {
                        data: "remove", title: "", orderable: false, width: "0.2rem",
                        render: function (data, type, full, meta) {
                            return '<i class="fa fa-times fa-lg rv-icon-button" aria-hidden=true></i>';
                        }
                    },
                    {
                        data: "edit", title: "", orderable: false, width: "0.2rem",
                        render: function (data, type, full, meta) {
                            return '<i class="fa fa-pencil fa-lg rv-icon-button" aria-hidden=true></i>';
                        }
                    }
                ];

                theColumns.push({ data: "CreationDate_Jalali", title: RVDic.CreationDate });

                var has_inited = function () {
                    return !!(params.ElementID && params.RefElementID && (params.ElementID != params.RefElementID));
                };

                var _show_empty = function () {
                    container.innerHTML = "";
                    FormElementTypes.Text.nothing2display(container);
                };

                var _processing = false;

                var _create_table = function (done) {
                    GlobalUtilities.load_files([
                        { Root: "Datatables/", Childs: ["css/jquery.dataTables.css", "js/jquery.dataTables.js"] }
                    ], {
                        OnLoad: function () {
                            var tbl = GlobalUtilities.create_nested_elements([
                                { Type: "table", Class: "display cell-border", Style: "width:100%;", Name: "tbl" }
                            ], itemsContainer)["tbl"];

                            theTable = jQuery(tbl).DataTable({
                                searching: false,
                                paging: true,
                                bFilter: false,
                                bLengthChange: false, /* disables page size select input */
                                order: [[editable ? 2 : 0, "desc"]], /* column with index:2 is CreationDate_Jalali */
                                //language: { url: GlobalUtilities.js({ Name: "DataTables/Persian.json" }) },
                                language: {
                                    sEmptyTable: RVDic.NothingToDisplay,
                                    sInfo: RVDic.ShowMToNOfRRecords.replace("[m]", "_START_")
                                        .replace("[n]", "_END_").replace("[r]", "_TOTAL_"),
                                    sInfoEmpty: RVDic.ShowMToNOfRRecords.replace("[m]", "0")
                                        .replace("[n]", "0").replace("[r]", "0"),
                                    sInfoPostFix: "",
                                    sInfoThousands: ",",
                                    oPaginate: {
                                        sFirst: RVDic.Begining,
                                        sLast: RVDic.End,
                                        sNext: RVDic.Next,
                                        sPrevious: RVDic.Previous
                                    }
                                },
                                columns: theColumns
                            });

                            jQuery(tbl).on('click', 'td', function () {
                                var cell = theTable.cell(this);
                                var row = theTable.row(cell.index().row);
                                var data = cell.data();
                                var tr = jQuery(this).closest("tr");

                                if ((data || {}).action == "edit") {
                                    _show_instance(data.id, row.data(), function (d) {
                                        row.data(_extract_data(d, false)).draw();
                                    });
                                }
                                else if ((data || {}).action == "remove") {
                                    _remove(data.id, function (result) {
                                        if (result) tr.fadeOut(500, function () {
                                            row.remove().draw();
                                            _set_remove_button_visibility();
                                        });
                                    });
                                }
                                else _show_instance(row.data().InstanceID, false);
                            });

                            done();
                        }
                    });
                };

                var elementTypesDic = {};
                
                var _init_table = function (done) {
                    if (!editable && !has_inited()) return _show_empty();
                    else if (!has_inited()) jQuery(elems["addButton"]).fadeIn(500).css("display", "inline-block");
                    
                    if (!has_inited() || _processing) return;
                    else if (theTable) return done ? done() : null;
                    _processing = true;
                    
                    GlobalUtilities.loading(itemsContainer);
                    
                    FGAPI.GetFormRecords({
                        FormID: formId, OwnerID: params.ElementID, ParseResults: true,
                        ResponseHandler: function (result) {
                            var elements = result.Elements || [];
                            var records = result.Records || [];
                            
                            itemsContainer.innerHTML = "";
                            
                            if (!records.length && !editable) {
                                _processing = false;
                                return _show_empty();
                            }
                            else if (editable) jQuery(elems["addButton"]).fadeIn(500).css("display", "inline-block");

                            (elements || []).forEach(function (elm) {
                                elementTypesDic[elm.ElementID] = elm.Type;

                                theColumns.push(GlobalUtilities.extend({
                                    data: elm.ElementID, title: _get_value(Base64.decode(elm.Title))
                                }, (elm.Type == "Numeric" ? { type: 'num' } : {})));
                            });
                            
                            _create_table(function () {
                                (records || []).forEach(function (r) { _add_row(r); });

                                _processing = false;
                                if (done) done();
                            });
                        }
                    });
                };

                var _get_value = function (value, isNotNumber) {
                    if (value && !isNaN(+value) && !isNotNumber) value = GlobalUtilities.get_comma_separated_number(+value);
                    if (value) value = GlobalUtilities.get_text_begining(value, 60, "...");
                    if (value) value = value.replace(/~/ig, " - ");
                    value = GlobalUtilities.convert_numbers_to_persian(value);
                    return value ? value : "";
                };

                var _row_count = function () {
                    return !theTable ? 0 : theTable.data().count();
                };

                var _set_remove_button_visibility = function () {
                    if (editable && (_row_count() > 0))
                        jQuery(elems["removeButton"]).fadeIn(500).css("display", "inline-block");
                    else jQuery(elems["removeButton"]).fadeOut(500);
                };

                var _extract_data = function (instance, base64Encoded) {
                    var data = { InstanceID: instance.InstanceID };

                    for (var i = 0; i < theColumns.length; ++i) {
                        if ((theColumns[i].data == "edit") || (theColumns[i].data == "remove"))
                            data[theColumns[i].data] = { id: instance.InstanceID, action: theColumns[i].data };
                        else {
                            var isNotNumber = elementTypesDic[theColumns[i].data] &&
                                (elementTypesDic[theColumns[i].data] != "Numeric");

                            var str = base64Encoded ?
                                Base64.decode(instance[theColumns[i].data]) : instance[theColumns[i].data];

                            data[theColumns[i].data] = _get_value(str, isNotNumber);
                        }
                    }

                    return data;
                };

                var _add_row = function (instance, callback) {
                    if (!theTable || !(theColumns || []).length) return;

                    var data = _extract_data(instance, true);
                    
                    if (theTable) {
                        var addedRow = theTable.row.add(data);
                        addedRow.draw();
                        _set_remove_button_visibility();
                        if (callback) callback(data, function (d) { addedRow.data(_extract_data(d, false)).draw(); });
                    }
                };

                var _init = function (callback) {
                    if (has_inited()) return callback();

                    FGAPI.SaveFormInstanceElements({
                        Elements: [{
                            ElementID: params.ElementID, InstanceID: params.InstanceID,
                            RefElementID: params.RefElementID, Title: Base64.encode(params.Title),
                            SequenceNumber: params.SequenceNumber, Type: params.Type, Info: params.Info
                        }],
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed && (result.FilledElements || []).length) {
                                params.ElementID = result.FilledElements[0].NewElementID;
                                params.RefElementID = result.FilledElements[0].ElementID;

                                callback();
                            }
                        }
                    });
                };

                var _addingNewRow = false;

                var _new_record = function () {
                    if (_addingNewRow || !formId) return;
                    _addingNewRow = true;
                    
                    _init(function () {
                        _init_table(function () {
                            FGAPI.CreateFormInstance({
                                FormID: formId, OwnerID: params.ElementID, ParseResults: true,
                                ResponseHandler: function (result) {
                                    _addingNewRow = false;
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    else if (result.Succeed) {
                                        _add_row(result.Instance, function (rowData, done) {
                                            _show_instance(result.Instance.InstanceID, rowData, function (d) {
                                                done(GlobalUtilities.extend({}, result.Instance || {}, d));
                                            });
                                        });
                                    }
                                }
                            });
                        });
                    });
                };

                _init_table();

                var _show_instance = function (id, rowData, done) {
                    var isEditable = editable && !!rowData;

                    var frmDiv = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-11 medium-10 large-9 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                        }
                    ])["_div"];

                    GlobalUtilities.loading(frmDiv);
                    GlobalUtilities.show(frmDiv);

                    var _on_save = function (elements) {
                        var dic = {};

                        jQuery.each(elements || [], function (ind, val) {
                            if (((val || {}).Data || {}).ElementID) dic[val.Data.ElementID] = val;
                            if (((val || {}).Data || {}).RefElementID) dic[val.Data.RefElementID] = val;
                        });

                        jQuery.each(theColumns, function (ind, val) {
                            if (!val.data || !dic[val.data]) return;
                            var dt = dic[val.data].Value || {};
                            var newValue = dt.TextValue || dt.FloatValue || ((dt.Files || []).length ? dt.Files.length : "");
                            rowData[val.data] = _get_value(newValue);
                        });

                        done(rowData);
                    };

                    new FormViewer(frmDiv, {
                        InstanceID: id, Editable: isEditable, ElementsEditable: isEditable,
                        HideDescription: true, FillButton: false, HasWorkFlowEditPermission: false,
                        UnlimitedDownloadAccess: options.UnlimitedDownloadAccess,
                        PDFCovers: options.PDFCovers || [],
                        CheckUniqueConstraints: true,
                        OnAfterSave: function (elements) { _on_save(elements); },
                        OnAfterElementSave: function (elements) { _on_save(elements); }
                    });
                };

                var _removing = false;

                var _remove = function (id, done) {
                    if (_removing) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Row), function (r) {
                        if (!r) return;
                        _removing = true;

                        FGAPI.RemoveFormInstance({
                            InstanceID: id, ParseResults: true,
                            ResponseHandler: function (result) {
                                _removing = false;
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) done(true);
                            }
                        });
                    });
                };

                var _remove_all = function () {
                    if (!has_inited() || _removing) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveAllOfTheRecords, function (r) {
                        if (!r) return;
                        _removing = true;

                        FGAPI.RemoveOwnerFormInstances({
                            OwnerID: params.ElementID, FormID: formId, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) {
                                    alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    _removing = false;
                                }
                                else if (result.Succeed) {
                                    jQuery(theTable.table().body()).fadeOut(500, function () {
                                        theTable.clear().draw();
                                        jQuery(theTable.table().body()).fadeIn(500, function () { _removing = false; });
                                    });
                                }
                            }
                        });
                    });
                };

                return {
                    BothFillAndView: true,
                    Container: container
                }
            },

            searchfilters: function (params) {
                params = params || {};

                var elems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-12 large-12 rv-air-button", Name: "container",
                    Childs: [{ Type: "text", TextValue: "click me!" }]
                }]);

                var formId = (params.Info || {}).FormID;
                var formName = Base64.decode((params.Info || {}).FormName);
                
                var dtValue = null;
                var jsValue = null;

                var filters_count = function () {
                    var cnt = 0;
                    for (var id in (jsValue || {}))++cnt;
                    return cnt;
                };

                var set_button_text = function () {
                    var cnt = filters_count();
                    var str = (cnt ? RVDic.NFiltersSelected.replace("[n]", cnt) : RVDic.NoFiltersSelected) +
                        ". " + RVDic.ClickToEditFilters;
                    elems["container"].innerHTML = GlobalUtilities.convert_numbers_to_persian(str);
                };

                set_button_text();

                var formContainer = null, showed = null;

                elems["container"].onclick = function () {
                    if (formContainer) return (showed = GlobalUtilities.show(formContainer));

                    formContainer = GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }])["_div"];

                    GlobalUtilities.loading(formContainer);
                    showed = GlobalUtilities.show(formContainer);

                    GlobalUtilities.load_files(["FormsManager/FormSearchFilters.js"], {
                        OnLoad: function () {
                            var fsf = new FormSearchFilters(formContainer, {
                                Delimiter: "~", FormID: formId,
                                OnConfirm: function () {
                                    showed.Close();
                                    dtValue = fsf.get();
                                    jsValue = fsf.get({ JSON: true });
                                    set_button_text();
                                }
                            });
                        }
                    });
                };

                return {
                    Container: elems["container"],
                    Get: function () {
                        return {
                            Data: dtValue,
                            JSONValue: !filters_count() ? null : jsValue
                        };
                    },
                    Clear: function () {
                        dtValue = jsValue = null;
                        set_button_text();
                    }
                };
            }
        },

        Separator: {
            isempty: function (params) { return true; }
        }
    }
})();