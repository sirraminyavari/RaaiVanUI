
///////////////////////////////////////////
//////////--> GlobalUtilities <--//////////
///////////////////////////////////////////

if (!window.GlobalUtilities) window.GlobalUtilities = {
    ScriptsFolder: "Script",
    AccessTokenParameterName: "acstkn",

    generate_new_guid: (function () {
        var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).toUpperCase().substring(1); }
        return function () { return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()); }
    })(),

    generate_color: function (id) {
        //prepare id
        var str = String("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
        var numbers = [2, 35, 23, 6, 9, 4, 274, 742, 45, 565, 456, 34, 798, 12, 56, 776, 665];
        id = String(!id ? GlobalUtilities.generate_new_guid() : id);
        var initialLength = id.length;
        while (id.length < 15)
            id += str.charAt((id.charCodeAt(id.length % initialLength) * numbers[id.length]) % str.length);
        //end of prepare id

        var hue = 1, saturation = 1, lightness = 1;

        for (var i = 0; i < 8; ++i) hue = (10 * hue) + String(id).charCodeAt(i);
        for (var i = 9; i < 13; ++i) saturation = (10 * saturation) + String(id).charCodeAt(i);
        //for (var i = 14; i < 18; ++i) lightness = (10 * lightness) + String(id).charCodeAt(i);

        var bright = "hsl(" + (hue % 360) + "," + ((saturation % 80) + 20) + "%,92%)";
        var color = "hsl(" + (hue % 360) + "," + ((saturation % 80) + 20) + "%,85%)";
        var hover = "hsl(" + (hue % 360) + "," + ((saturation % 80) + 20) + "%,60%)";
        var dark = "hsl(" + (hue % 360) + "," + ((saturation % 80) + 20) + "%,30%)";

        return { Color: color, Hover: hover, Dark: dark, Bright: bright };
    },

    browser_version: function () {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { Name: 'msie', Version: tem[1] || '' };
        }

        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem != null) return { Name: 'Opera', Version: tem[1] || '' };
        }

        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return { Name: String(M[0]).toLowerCase(), Version: M[1] };
    },

    get_csrf_token: function (restTicket) {
        var arr = restTicket ? (window.__RestCSRFTokens || {})[restTicket] : (window.RVGlobal || {}).AccessToken;
        if (!!arr && (GlobalUtilities.get_type(arr) == "string")) arr = [arr];

        if ((GlobalUtilities.get_type(arr) == "array") && arr.length) {
            var retVal = arr.pop();

            if (restTicket)
                __RestCSRFTokens[restTicket] = arr;
            else
                RVGlobal.AccessToken = arr;
            
            return retVal;
        }
        else return "";
    },

    add_csrf_token: function (token, restTicket) {
        window.__RestCSRFTokens = window.__RestCSRFTokens || {};

        var refArray = restTicket ? __RestCSRFTokens[restTicket] || [] : RVGlobal.AccessToken || [];

        if (!!token && (GlobalUtilities.get_type(token) == "string")) token = [token];

        if ((GlobalUtilities.get_type(token) == "array") && (GlobalUtilities.get_type(refArray) == "array")) {
            refArray = token
                .filter(t => !!t && (GlobalUtilities.get_type(t) == "string"))
                .concat(refArray);

            if (restTicket)
                __RestCSRFTokens[restTicket] = refArray;
            else
                RVGlobal.AccessToken = refArray;
            
            return refArray.length ? refArray : null;
        }
        else return null;
    },

    to_json: function (str) {
        try { return JSON.parse(str); }
        catch (e) { return null; }
    },

    uri_encode: (str) => {
        try { return encodeURIComponent(str); }
        catch (e) { return str; }
    },

    uri_decode: (str) => {
        try { return decodeURIComponent(str); }
        catch (e) { return str; }
    },

    request_params: function () {
        var params = { get_value: function (str) { } };
        var loc = window.location.toString();
        if (loc.indexOf("?") < 0) return params;
        var parameters = loc.substr((loc.indexOf("?") + 1)).split("&");

        for (var i = 0; i < parameters.length; i++) {
            var index = parameters[i].indexOf("=");
            if (index < 0 || index == parameters[i].length - 1) continue;

            var key = parameters[i].substr(0, index);
            params[key] = params[key.toLowerCase()] = parameters[i].substr(index + 1);
        }

        params.get_value = function (str) { return params[String(str).toLowerCase()]; }

        return params;
    },

    random: function (min, max) {
        if (!min || isNaN(min)) min = 0;
        if ((max !== 0) && (!max || isNaN(max))) max = 9999999999;
        if (max < min) { var t = min; min = max; max = t; }
        if (min == max) return min;
        var lnt = String(max).length;
        return (Number((Math.random() * Math.pow(10, lnt + 1)).toFixed(0)) % (max - min + 1)) + min;
    },

    random_str: function (length) {
        var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        if ((GlobalUtilities.get_type(length) != "number") || (length <= 0)) length = 10;
        var ret = "";
        for (var i = 0; i < length; ++i)
            ret += str[GlobalUtilities.random(0, str.length - 1)];
        return ret;
    },

    zindex: (function () {
        var _z = function (p) { return p * 10000; }

        return {
            alert: (function () { var z = _z(3); return function () { return ++z; } })(),
            tooltip: (function () { var z = _z(2); return function () { return ++z; } })(),
            dialog: (function () { var z = _z(1); return function () { return ++z; } })()
        }
    })(),

    border_radius: (function () {
        var str = String("border-radius:VALUE; -webkit-border-radius:VALUE; -moz-border-radius:VALUE; -op-border-radius:VALUE;");
        var regExp = new RegExp("VALUE", 'g');
        return function (value) { return str.replace(regExp, (isNaN(+value) ? value : String(value) + "px")); }
    })(),

    transform_rotate: (function () {
        var str = String("-ms-transform: rotate(VALUEdeg); -webkit-transform: rotate(VALUEdeg); -moz-transform: rotate(VALUEdeg);" +
            "-op-transform: rotate(VALUEdeg); transform: rotate(VALUEdeg);")
        var regExp = new RegExp("VALUE", 'g');
        return function (value) { return str.replace(regExp, String(value)); }
    })(),

    linear_background_gradient: (function () {
        var _base = String("background: [x]linear-gradient(Degree Top Bottom);");
        var str = _base.replace("[x]", "") + _base.replace("[x]", "-moz-") + _base.replace("[x]", "-webkit-") + _base.replace("[x]", "-o-");
        var topRegExp = new RegExp("Top", 'g'), bottomRegExp = new RegExp("Bottom", 'g'), degRegExp = new RegExp("Degree", 'g');
        return function (topColor, bottomColor, params) {
            var params = params || {};
            return str.replace(degRegExp, params.Degree ? String(params.Degree) + "," : "").replace(topRegExp, String(topColor) + ",").replace(bottomRegExp, String(bottomColor));
        }
    })(),

    add_to_escape_queue: (function () {
        var arr = [];

        var wait = false;

        var tools = {
            wait: function () { wait = true; },
            go: function () { wait = false; },
            has_more: function () {
                return !arr.length ? false : arr.some(function (a) {
                    return a.Element && GlobalUtilities.is_visible(a.Element);
                });
            }
        };

        var _init = function () {
            if (!window.jQuery) setTimeout(function () { _init(); }, 100);

            jQuery(document).keydown(function (e) {
                if (wait || (e.which != 27)) return;

                while (arr.length > 0) {
                    var itm = arr[arr.length - 1];

                    if (GlobalUtilities.is_visible(itm.Element) && itm.Stick) return;

                    arr.pop();

                    if (GlobalUtilities.is_element_in_document(itm.Element)) {
                        itm.Done(tools); return;
                    }
                }
            });
        }

        _init();

        return function (element, done, params) {
            params = params || {};
            arr.push({ Element: element, Done: done, Stick: params.Stick });
            return tools;
        };
    })(),

    is_element_in_document: function (element) {
        while (element = (element || {}).parentNode)
            if (element == document) return true;
        return false;
    },

    is_visible: (function () {
        var _check = function (elem) {
            try {
                return String((jQuery(elem) || { css: function () { } }).css("display") || "_").toLowerCase().indexOf("none") < 0;
            } catch (e) {
                return String(((elem || {}).style || {}).display || "_").toLowerCase().indexOf("none") < 0;
            }
        }

        return function (element) {
            var elem = element;
            if (!_check(element)) return false;
            while (element = (element || {}).parentNode) if (!_check(element)) return false;
            return GlobalUtilities.is_element_in_document(elem);
        }
    })(),

    after_fade_out: function (callback) {
        if (GlobalUtilities.get_type(callback) == "function")
            setTimeout(callback, 200);
    },

    get_fixed_parent: function (element) {
        while (element) {
            if (((element.style || {}).position || "_").toLowerCase() == "fixed") return element;
            element = element.parentNode;
        }
    },

    cheat_code: (function () {
        var codes = {};
        var str = String("");

        jQuery(document).ready(function () {
            jQuery(document.body).on("keydown", function (e) {
                var char = String.fromCharCode(e.which) || "";

                if (char != "") str += String(char == "4" && e.shiftKey ? "$" : char).toLowerCase();
                for (var c in codes) {
                    if (!codes[c]) continue;
                    if (str.length > c.length && str.substr(str.length - c.length) == c &&
                        str[str.length - c.length - 1] == "$") codes[c]();
                }
            });
        });

        return function (cheatCode, done) {
            codes[String(cheatCode).toLowerCase()] = done;
        }
    })(),

    cheadget: (function () {
        var _names = {};

        var _add = function (item) {
            var name = String(item.Name || item).toLowerCase();
            var alias = String(item.Alias || name).toLowerCase();

            GlobalUtilities.cheat_code(alias, function () {
                if (_names[name]) {
                    if (((window.RVCheadget || {})[name] || {}).show) RVCheadget[name].show();
                    return;
                }
                _names[name] = true;

                GlobalUtilities.load_files(["Cheadget/" + name + "/" + name + ".js"]);
            });
        }

        return function () {
            for (var i = 0, lnt = (arguments || []).length; i < lnt; ++i) _add(arguments[i]);
        }
    })(),

    icon: function (params) { return "/Images/" + ((params || {}).Name || params || "") + ((params || {}).NoCache ? "?timeStamp=" + new Date().getTime() : ""); },
    js: function (params) { return "/Script/" + ((params || {}).Name || params || ""); },
    css: function (params) { return "/CSS/" + ((params || {}).Name || params || ""); },

    append_clear_div: function (_div) {
        var clearDiv = document.createElement("div");
        clearDiv.style.clear = "both";
        if (_div == null) return clearDiv;
        _div.appendChild(clearDiv);
    },

    escape_html: (function () {
        var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
        return function (str) { return String(str).replace(/[&<>"'\/]/g, function (s) { return map[s]; }); }
    })(),

    get_css_property: function (selector, attribute) {
        var value;

        [].some.call(document.styleSheets || [], function (sheet) {
            return [].some.call(sheet.cssRules || sheet.rules || [], function (rule) {
                if (selector !== rule.selectorText) return false;

                var index = rule.cssText.indexOf(attribute);
                if (index < 0) return false;

                var cssText = rule.cssText.substr(index + attribute.length + 2);
                value = cssText.substr(0, cssText.indexOf(";"));

                return true;
            });
        });

        return value;
    },

    shake: function (div, options) {
        if (!(div || {}).classList) return;
        options = options || {};
        div.classList.add("rv-shake");
        setTimeout(() => { div.classList.remove("rv-shake"); }, options.Duration || 1000);
    },

    request_param: function (paramName) {
        if (paramName = (new RegExp('[?&]' + encodeURIComponent(paramName) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(paramName[1]);
    },

    append_tooltip: function (_obj, value, params) {
        params = params || {};
        if (!GlobalUtilities.trim(value || " ")) return;
        if (typeof (_obj) != "object") _obj = document.getElementById(_obj);
        if (_obj) _obj.title = "<div style='" + (params.Direction ? "direction:" + params.Direction + ";" : "") + "'>" +
            (params.HTML ? value : GlobalUtilities.convert_numbers_to_persian(GlobalUtilities.secure_string(value))) + "</div>";
        try { jQuery(_obj).tooltip({ align: (params.Align ? String(params.Align).toLowerCase() : 'autoTop'), html: true, fade: true }); }
        catch (e) { }
    },

    stick: function (elem, sticker, params) {
        params = params || {};
        elem = jQuery(elem);
        sticker = jQuery(sticker);
        var align = String(params.Align || "bottom").toLowerCase().charAt(0);

        var pos = jQuery.extend({}, elem.offset(), { width: elem[0].offsetWidth, height: elem[0].offsetHeight });

        var _css = GlobalUtilities.extend({ position: 'absolute', zIndex: GlobalUtilities.zindex.dialog() },
            (params.Fit === true ? { width: pos.width } : {}));

        sticker.css(_css);

        sticker.appendTo(document.body);

        var actualWidth = sticker[0].offsetWidth;
        var actualHeight = sticker[0].offsetHeight;
        var dir = align == 'a' ? (pos.top > (jQuery(document).scrollTop() + jQuery(window).height() / 2) ? 't' : 'b') :
            (pos.left > (jQuery(document).scrollLeft() + jQuery(window).width() / 2) ? 'l' : 'r');

        sticker.css({ top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 });

        var _newTop = 0;
        var _newLeft = 0;
        var _leftOffset = 0, _topOffset = 0;

        var stickeePosition = {};

        switch (align === 'a' ? dir : align) {
            case 'b':
                _newTop = pos.top + pos.height;
                _leftOffset = params.LeftOffset ? params.LeftOffset : 0;
                _newLeft = pos.left + pos.width / 2 - actualWidth / 2 + _leftOffset;
                stickeePosition = { Top: _newTop, Left: pos.left + pos.width / 2, Dir: "bottom" };
                break;
            case 't':
                _newTop = pos.top - actualHeight;
                _leftOffset = params.LeftOffset ? params.LeftOffset : 0;
                _newLeft = pos.left + pos.width / 2 - actualWidth / 2 + _leftOffset;
                stickeePosition = { Top: pos.top, Left: pos.left + pos.width / 2, Dir: "top" };
                break;
            case 'l':
                _topOffset = params.TopOffset ? params.TopOffset : 0;
                _newTop = pos.top + pos.height / 2 - actualHeight / 2 + _topOffset;
                _newLeft = pos.left - actualWidth;
                stickeePosition = { Top: pos.top + pos.height / 2, Left: pos.left, Dir: "left" };
                break;
            case 'r':
                _topOffset = params.TopOffset ? params.TopOffset : 0;
                _newTop = pos.top + pos.height / 2 - actualHeight / 2 + _topOffset;
                _newLeft = pos.left + pos.width;
                stickeePosition = { Top: pos.top + pos.height / 2, Left: _newLeft, Dir: "right" };
                break;
        }

        var scrollTop = 0;
        if (align == 'l' || align == 'r') {
            var obj = elem.get(0);
            while (obj) {
                if (((obj.style || {}).position || "").toLowerCase() == "fixed" || (scrollTop = jQuery(obj).scrollTop())) break;
                obj = obj.parentNode;
            }
        }

        var windowWidth = jQuery(window).width();
        var windowHeight = jQuery(window).height();
        var rightOut = _newLeft + actualWidth - windowWidth;
        var bottomOut = _newTop + actualHeight - (windowHeight + scrollTop);
        var browserBorderMargin = 4; //Minimum distance to browser window borders

        var computedLeft = 0;
        var computedTop = 0;

        if (rightOut > 0) computedLeft = _newLeft - rightOut - browserBorderMargin;
        else computedLeft = _newLeft <= browserBorderMargin ? browserBorderMargin : _newLeft;

        if (bottomOut > 0) computedTop = _newTop - bottomOut - browserBorderMargin;
        else computedTop = _newTop <= browserBorderMargin ? browserBorderMargin : _newTop;

        sticker.PositionInfo = {
            Width: actualWidth, Height: actualHeight,
            Left: computedLeft, Top: _newTop, LeftMovement: computedLeft - _newLeft + _leftOffset,
            TopMovement: computedTop - _newTop + _topOffset, StickeePosition: stickeePosition, Dir: stickeePosition.Dir
        };

        return sticker.css({
            top: align == 't' || align == 'b' ? _newTop : computedTop,
            left: align == 'l' || align == 'r' ? _newLeft : computedLeft
        });
    },

    popup_menu: function (container, content, params) {
        params = params || {};
        var align = String(params.Align || "bottom").toLowerCase().charAt(0);

        var contentDiv = null;
        var isOpen = false;

        var containerStyle = "";
        var arrowDivStyle = "";
        var contentDivStyle = "";

        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Name: "container", Style: "position:relative; display:inline-block;",
            Childs: [
                {
                    Type: "div", Name: "arrow", Style: params.Style,
                    Class: params.ArrowClass || params.Class || "SoftBackgroundColor SoftBorder"
                },
                {
                    Type: "div", Name: "content", Style: "padding:0.7rem;" + params.Style, //padding will be set, but for positioning reasons, it must be set here too
                    Class: "rv-border-radius-half " + (params.ContentClass || params.Class || "SoftBackgroundColor SoftBorder")
                }
            ]
        }], document.body);

        contentDiv = elems["content"];

        if (content) contentDiv.appendChild(content);

        var _reposition = function () {
            var contentWidth = jQuery(contentDiv)[0].offsetWidth;
            var contentHeight = jQuery(contentDiv)[0].offsetHeight;

            switch (align) {
                case 't':
                    {
                        arrowDivStyle = "position:absolute; bottom:0.2rem; border-top-width:0rem; border-left-width:0rem;" +
                            "margin:0px " + ((contentWidth / 2) - 7) + "px;";
                        contentDivStyle = "margin-bottom:0.55rem;";
                    }
                    break;
                case 'r':
                    {
                        arrowDivStyle = "position:absolute; border-right-width:0rem; border-top-width:0rem;" +
                            "left:0.1rem; margin-top:" + ((contentHeight / 2) - 7) + "px;";
                        contentDivStyle = "margin-left:0.5rem;";
                    }
                    break;
                case 'b':
                    {
                        arrowDivStyle = "position:absolute; top:0.2rem; border-bottom-width:0rem; border-right-width:0rem;" +
                            "margin:0px " + ((contentWidth / 2) - 7) + "px;";
                        contentDivStyle = "margin-top:0.55rem;";
                    }
                    break;
                case 'l':
                    {
                        arrowDivStyle = "position:absolute; border-left-width:0rem; border-bottom-width:0rem;" +
                            "right:0.1rem; margin-top:" + ((contentHeight / 2) - 7) + "px;";
                        contentDivStyle = "margin-right:0.5rem;";
                    }
                    break;
            }

            elems["container"].setAttribute("style", containerStyle);

            elems["arrow"].setAttribute("style", "width:0.8rem; height:0.8rem; opacity:1;" +
                GlobalUtilities.transform_rotate(45) + arrowDivStyle + params.Style);

            contentDiv.setAttribute("style", "padding:0.7rem; opacity:1;" + contentDivStyle + params.Style);

            var stk = GlobalUtilities.stick(container, elems["container"], params);

            var _moveOffset = 6, _movement = 0;

            if ((stk.PositionInfo.LeftMovement != 0) && ((align == 't') || (align == 'b'))) {
                var movedRight = stk.PositionInfo.LeftMovement > 0;
                _movement = stk.PositionInfo.LeftMovement + ((movedRight ? 1 : -1) * _moveOffset);
                sideMargin = (contentWidth / 2) - _movement;
                if (!movedRight) sideMargin = stk.PositionInfo.Width - sideMargin - 1;

                elems["container"].style.direction = movedRight ? "ltr" : "rtl";

                if (align == 'b') {
                    elems["arrow"].style.margin = "0px " + (movedRight ? 0 : sideMargin) + "px 0px " + (movedRight ? sideMargin : 0) + "px";
                } else {
                    var curLeft = String(jQuery(elems["arrow"]).css("left"));
                    curLeft = curLeft.length ? Number(curLeft.substr(0, curLeft.length - 2)) : 0;
                    elems["arrow"].style.left = (curLeft - stk.PositionInfo.LeftMovement) + "px";
                }
            }

            if ((stk.PositionInfo.TopMovement != 0) && ((align == 'l') || (align == 'r'))) {
                var curTopMargin = String(jQuery(elems["arrow"]).css("marginTop"));
                curTopMargin = curTopMargin.length ? Number(curTopMargin.substr(0, curTopMargin.length - 2)) : 0;

                elems["arrow"].style.marginTop = (curTopMargin - stk.PositionInfo.TopMovement) + "px";
            }

            if (params.OnAfterShow) params.OnAfterShow(retVal);

            isOpen = true;
        }

        var interval = setInterval(function () {
            if (!GlobalUtilities.is_visible(container)) {
                clearInterval(interval);
                retVal.Hide();
            }
        }, 1000);

        var retVal = {
            Container: elems["container"], Arrow: elems["arrow"],
            Content: contentDiv, Reposition: _reposition,
            IsOpen: function () { return isOpen; },
            Reposition: function () { _reposition(); },
            Show: function (done) {
                jQuery(elems["container"]).fadeIn(0, function () { _reposition(); if (done) done(); });
                _on();
            },
            Hide: function (done) {
                isOpen = false;
                jQuery(elems["container"]).fadeOut(0, done);
                if (interval) clearInterval(interval);
                _off();
            }
        }

        _reposition();

        var _on = function () {
            jQuery(window).on("resize", retVal.Hide);
            jQuery(window).on("scroll", retVal.Hide);
        };

        var _off = function () {
            jQuery(window).off("resize", retVal.Hide);
            jQuery(window).off("scroll", retVal.Hide);
        };

        _on();

        return retVal;
    },

    enable_by_mouse_over: function (target, content, params) {
        if (!(params || {}).OnStart || !(params || {}).OnEnd) return;
        var jqTarget = (target ? jQuery(target) : null), jqContent = (content ? jQuery(content) : null);
        var started = params.Started === true;
        var ended = !started;
        var start = function () { started = true; if (ended) { params.OnStart(function () { ended = false; }); } }
        var end = function () {
            started = false;
            setTimeout(function () { if (!started) { params.OnEnd(function () { ended = true; }); } }, isNaN(params.Delay) ? 500 : params.Delay);
        }
        if (jqTarget) jqTarget.mouseover(start);
        if (jqTarget) jqTarget.mouseout(end);
        if (jqContent) jqContent.mouseover(start);
        if (jqContent) jqContent.mouseout(end);
        return { Start: start, End: end };
    },

    total_height: function (element) {
        if (typeof (element) != "object") element = document.getElementById(element);
        return jQuery(element)[0].scrollHeight + parseInt(jQuery(element).css('padding-top'), 10) + parseInt(jQuery(element).css('padding-bottom'), 10) +
            parseInt(jQuery(element).css('border-top-width'), 10) + parseInt(jQuery(element).css('border-bottom-width'), 10);
    },

    scrolltop: function (element, value) {
        var isTopElem = !element || (element == window) || (element == document) || (element == document.body);
        var obj = jQuery(isTopElem ? 'html, body' : element);

        if (GlobalUtilities.get_type(value) == "number") obj.animate({ scrollTop: isNaN(value) ? 0 : value }, 'slow');
        else return obj.scrollTop();
    },

    scroll: function (element, params) {
        if (typeof (element) != "object") element = document.getElementById(element);
        params = params || {};

        var divTotalHeight = GlobalUtilities.total_height(element);

        jQuery(element == window || element == document || element == document.body ? 'html, body' : element).animate({
            scrollTop: params.Value ? (params.Value < 0 ? "-=" : "+=") + Math.abs(params.Value) :
                (params.Top ? jQuery(element).offset().top : divTotalHeight)
        }, params.Animate === false ? 0 : 'slow');
    },

    onscrollend: function (element, params, done) {
        if (typeof (element) != "object") element = document.getElementById(element);
        params = params || {};
        if (GlobalUtilities.get_type(done) != "function") return;

        var _offset = +(params.Offset ? params.Offset : 0);
        if (isNaN(_offset) || _offset < 0) _offset = 0;

        if (element === document || element === window || element === document.body)
            return jQuery(window).scroll(function () { if (jQuery(window).scrollTop() + jQuery(window).height() >= jQuery(document).height() - _offset) done(); });

        jQuery(element).bind('scroll', function () {
            var scrollTop = jQuery(this).scrollTop();
            var scrollPosition = scrollTop + jQuery(this).outerHeight();
            var divTotalHeight = GlobalUtilities.total_height(element);

            if ((params.Top && scrollTop >= 0 && scrollTop <= _offset) || (!params.Top && scrollPosition >= (divTotalHeight - _offset))) done();
        });
    },

    scroll_into_view: function (_elem, params) {
        params = params || {};
        if (typeof (_elem) != "object") _elem = document.getElementById(_elem);

        params.Container = params.Container || GlobalUtilities.get_fixed_parent(_elem);

        //A: This part works well when params.Container's position is fixed specially in PDFViewer
        var scrollTop = 0;
        if (params.Container) scrollTop = jQuery(params.Container).scrollTop() - jQuery('html, body').scrollTop();
        //A: end

        var offset = params.Offset === 0 ? 0 : params.Offset || 100;
        var containerOffset = params.ConsiderContainerOffset ? jQuery(params.Container).offset().top : 0;

        scrollTop = scrollTop + jQuery(_elem).offset().top - offset - containerOffset;

        jQuery(params.Container || 'html, body').animate({ scrollTop: scrollTop }, 'slow', params.Done);
    },

    append_scrollbar: function (divObj, params) {
        if (typeof (divObj) != "object" && !(divObj = document.getElementById(divObj))) return;
        params = params || {};

        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Class: "nano has-scrollbar", Name: "main",
            Childs: [{
                Type: "div", Class: "overthrow nano-content", Style: "overflow-y:hidden;", Name: "container",
                Childs: [{
                    Type: "div", Name: "__", Style: "height:100%;",
                    Childs: [{ Type: "div", Class: "small-12 medium-12 large-12 clearfix", Name: "content" }]
                }]
            }]
        }]);

        jQuery(elems["main"]).on("mousewheel", function (event) {
            event.stopPropagation();
            GlobalUtilities.scroll(elems["container"], { Value: -1 * event.deltaY * event.deltaFactor, Animate: false });
            return false;
        });

        while (divObj.firstChild) elems["content"].appendChild(divObj.firstChild);

        elems["__"].style.paddingTop = window.getComputedStyle(divObj, null).getPropertyValue('padding-top');
        elems["__"].style.paddingRight = window.getComputedStyle(divObj, null).getPropertyValue('padding-right');
        elems["__"].style.paddingBottom = window.getComputedStyle(divObj, null).getPropertyValue('padding-bottom');
        elems["__"].style.paddingLeft = window.getComputedStyle(divObj, null).getPropertyValue('padding-left');
        divObj.style.padding = "0px";

        divObj.appendChild(elems["main"]);

        var maxHeight = parseInt(divObj.style.maxHeight || "0");
        var containerHeight = parseInt(divObj.style.height || divObj.style.maxHeight || "0");

        var get_height = params.GetHeight || function () { return parseInt(jQuery(elems["__"])["0"].scrollHeight || "0"); }

        var height = get_height();

        setInterval(function () {
            if (params.AutoHeight === false) return jQuery(elems["main"]).nanoScroller();

            var newHeight = get_height();
            
            if ((height == newHeight) || !GlobalUtilities.is_visible(elems["__"])) return;
            height = newHeight;

            var computedNewHeight = containerHeight > height ? height : containerHeight;
            computedNewHeight = maxHeight == 0 ? computedNewHeight : Math.min(computedNewHeight, maxHeight);
            jQuery(divObj).animate({ height: computedNewHeight }, null, function () { jQuery(elems["main"]).nanoScroller(); });
        }, 1000);

        jQuery(elems["main"]).nanoScroller();

        if (params.Done) params.Done({ Scrollee: elems["container"] });

        return elems["content"];
    },

    sidebox: function (container, params) {
        params = params || {};

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SurroundingShadow",
                Style: "margin-top:1rem; position:relative; background-color:white;",
                Childs: [
                    (!params.Title ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-ignore-bottom-radius WarmBackgroundColor",
                        Style: "padding:0.3rem 0; color:white; text-align:center;",
                        Childs: [{ Type: "text", TextValue: params.Title }]
                    }),
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "content", Style: "padding:0.3rem;" }
                ]
            }
        ], container);

        return { Content: elems["content"], Button: params.Button ? elems["button"] : null }
    },

    append_goto_top_button: function () {
        GlobalUtilities.get_side_panel(function (panel) {
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Style: "display:inline-block; padding-bottom:0.6rem; padding-" + RV_Float + ":0.6rem; z-index:1000;",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-chevron-circle-up fa-3x rv-icon-button", Name: "btn", Style: "display:none;",
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [{ Name: "onclick", Value: function () { GlobalUtilities.scrolltop(document, 0); } }]
                        }
                    ]
                }
            ]);

            panel.insertBefore(elems["container"], panel.firstChild);

            jQuery(window).scroll(function () {
                var scrollTop = jQuery(window).scrollTop();
                jQuery(elems["btn"])[scrollTop >= 200 ? "fadeIn" : "fadeOut"](500);
            });
        });
    },

    submit_form: function (params) {
        params = params || {};

        var url = params.URL || "";
        var requestParams = params.RequestParams || {};
        var method = params.Method || "post";

        var form = GlobalUtilities.create_nested_elements([
            {
                Type: "form", Name: "form",
                Attributes: [{ Name: "method", Value: method }, { Name: "action", Value: url }]
            }
        ], document.body)["form"];

        var _add_param = function (name, value) {
            if (!name || (value == undefined)) return;

            GlobalUtilities.create_nested_elements([{
                Type: "input",
                Attributes: [{ Name: "type", Value: "hidden" }, { Name: "name", Value: name }, { Name: "value", Value: value }]
            }], form);
        }

        for (var p in requestParams) _add_param(p, requestParams[p]);

        var token = GlobalUtilities.get_csrf_token();
        if (token) _add_param(GlobalUtilities.AccessTokenParameterName, token);
        
        form.submit();
    },

    open_window: function (params) {
        params = params || {};

        var url = params.URL || "";
        var requestParams = params.RequestParams || {};
        var method = params.Method || "post";

        var _target = GlobalUtilities.generate_new_guid();

        var form = GlobalUtilities.create_nested_elements([
            {
                Type: "form", Name: "form",
                Attributes: [{ Name: "method", Value: method }, { Name: "action", Value: url }, { Name: "target", Value: _target }]
            }
        ], document.body)["form"];

        var _add_param = function (name, value) {
            if ((name || "") == "" || value == undefined) return;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "input",
                    Attributes: [{ Name: "type", Value: "hidden" }, { Name: "name", Value: name }, { Name: "value", Value: value }]
                }
            ], form);
        }

        for (var p in requestParams) _add_param(p, requestParams[p]);

        var token = GlobalUtilities.get_csrf_token();
        if (token) _add_param(GlobalUtilities.AccessTokenParameterName, token);

        var newWin = window.open("", _target);

        form.submit();

        return newWin;
    },

    toggle: function (elem) {
        if (typeof (elem) != "object") elem = document.getElementById(elem);
        elem.style.display = elem.style.display == "none" ? "block" : "none";
    },

    confirm: function (message, callback) {
        var result = confirm(message);
        if (callback) callback(result);
    },

    prompt: function (title, params, callback) {
        params = params || {};

        var hideCancelButton = params.HideCancelButton;

        var sideClass = hideCancelButton ? "small-4 medium-4 large-4" : "small-1 medium-1 large-1";

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:center; margin-bottom:1rem; font-weight:bold; font-size:1rem;",
                        Childs: [{ Type: "text", TextValue: title }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                        Childs: [{
                            Type: "input", Class: "rv-input " + (!params.Center ? "" : "rv-placeholder-align-center"),
                            InnerTitle: params.Placeholder, Name: "_input",
                            Style: "width:100%;" + (!params.Center ? "" : "text-align:center;"),
                            Attributes: !params.IsPassword ? null : [{ Name: "type", Value: "password" }]
                        }]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;", Name: "content" },
                    { Type: "div", Class: sideClass },
                    {
                        Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle", Name: "confirm",
                        Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                    },
                    { Type: "div", Class: "small-2 medium-2 large-2", Style: (hideCancelButton ? "display:none;" : "") },
                    {
                        Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle", Name: "cancel",
                        Style: (hideCancelButton ? "display:none;" : ""),
                        Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                    },
                    { Type: "div", Class: sideClass }
                ]
            }
        ]);

        GlobalUtilities.set_onenter(elems["_input"], function () { jQuery(elems["confirm"]).click(); });

        var closed = false;

        var _close = function () { closed = true; showed.Close(); };

        var showed = GlobalUtilities.show(elems["_div"], {
            Stick: params.Stick !== false,
            OnClose: function () { if (!closed && callback) callback(false); }
        });

        elems["confirm"].onclick = function () {
            if (callback) callback(elems["_input"].value);
            if (!params.DoNotClose) _close();
        };

        if (!hideCancelButton) {
            elems["cancel"].onclick = function () {
                if (callback) callback(false);
                if (!params.DoNotClose) _close();
            };
        }

        jQuery(elems["_input"]).focus();

        return {
            Content: elems["content"],
            Close: function () { _close(); },
            Clear: function () { elems["_input"].value = ""; jQuery(elems["_input"]).focus(); }
        };
    },

    dialog: null, //It will be created using jAlerts after loading the page

    login_dialog: (function () {
        var _div = null;
        var _obj = null;
        var showedDiv = null;

        return function (params) {
            params = params || {};

            if (_div) {
                if (GlobalUtilities.is_element_in_document(_div)) return;

                showedDiv = GlobalUtilities.show(_div, {
                    OnShow: function () { if ((_obj || {}).clear) _obj.clear(); }
                });

                return;
            }

            _div = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1", Name: "_div",
                Style: "margin:0rem auto; padding:1rem; background-color:" +
                    (RVGlobal.SAASBasedMultiTenancy ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)") + ";"
            }])["_div"];

            GlobalUtilities.loading(_div);
            showedDiv = GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["USR/LoginControl.js"], {
                OnLoad: function () {
                    _obj = new LoginControl(_div, {
                        Title: RVDic.Checks.PleaseLogin,
                        ReloadAfterLogin: params.ReloadAfterLogin,
                        ReturnURL: params.ReturnURL,
                        OnLogin: function () { showedDiv.Close(); }
                    });
                }
            });
        }
    })(),

    sortable: function (container, options) {
        options = options || {};

        GlobalUtilities.load_files(["jQuery/jquery.dad.js"], {
            OnLoad: function () {
                var counter = 0;

                var _interval = setInterval(() => {
                    if (!jQuery(container).get(0)) {
                        if (counter >= 100) clearInterval(_interval);
                        return counter++;
                    }
                    else clearInterval(_interval);

                    jQuery(container).dad({
                        exchangeable: !!options.Exchangeable,
                        targetFilters: options.Filters,
                        draggable: '.' + (options.DraggableClass || 'draggable'),
                        placeholderTarget: options.PlaceholderTarget ? '.' + options.PlaceholderTarget : null,
                        placeholderTemplate: '<div class="rv-border-radius-half SoftBorder" ' +
                            'style="border-width:3px; border-style:dashed; border-color:rgb(230,230,230);"></div>'
                    });

                    if (GlobalUtilities.get_type(options.OnDrop) == "function") {
                        jQuery(container).on("dadDropEnd", function (e, targetElement) {
                            options.OnDrop(e, targetElement);
                        });
                    }
                }, 100);
            }
        });
    },

    show: function (_div, params) {
        params = params || {};

        var bodyScroll = window.BODYSCROLL = GlobalUtilities.get_type(window.BODYSCROLL) == "undefined" ?
            document.body.style.overflow : window.BODYSCROLL;
        document.body.style.overflow = "hidden";

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "RevDirection", Name: "container",
                Style: " position:fixed; top:0; bottom:0; left:0; right:0; margin:auto; width:100%;" +
                    "overflow:auto; z-index: " + GlobalUtilities.zindex.dialog() + ";" +
                    (params.NoBackground === true ? "" : "background: rgba(0, 0, 0, 0.75);"),
                Childs: [
                    {
                        Type: "div", Name: "exit", Class: "rv-circle RevTextAlign",
                        Style: "position:fixed; display:inline-block; cursor:pointer; " + RV_RevFloat + ":-2.5rem; top:-2.5rem;" +
                            "font-weight:bolder; color:white;" + (params.NoBackground || params.Stick ? "display:none;" : "") +
                            "width:5rem; height:5rem; background-color:red;",
                        Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); hide(); } }],
                        Childs: [{
                            Type: "div", Style: "position:fixed; top:0.4rem;" + RV_RevFloat + ":0.4rem;",
                            Childs: [{
                                Type: "i", Class: "fa fa-times fa-lg",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }]
                        }]
                    },
                    {
                        Type: "div", Class: "Direction", Name: "content",
                        Style: "margin-top:5vw; margin-bottom:5vw;" + (params.Style ? params.Style : "")
                    }
                ]
            }
        ], document.body);

        if (_div) {
            if (typeof (_div) != "object") _div = document.getElementById(_div);
            _div.style.display = "none";
            _div.style.opacity = 1;
            elems["content"].appendChild(_div);

            jQuery(_div).fadeIn(500, function () { if (params.OnShow) params.OnShow(); });

            if (!params.Stick && !params.DisableCloseOnClick) {
                jQuery(elems["container"]).bind('click', function (event) {
                    if (!jQuery(event.target).closest(_div).length && GlobalUtilities.is_visible(event.target)) hide(tls);
                });
            }
        }

        var _dispose = function (tools) {
            if (elems["container"].parentNode) elems["container"].parentNode.removeChild(elems["container"]);
            if (!tools.has_more()) document.body.style.overflow = bodyScroll;
            tools.go();
            if (params.OnClose) params.OnClose();
        };

        var hide = function (tools) {
            tools = GlobalUtilities.extend({ wait: function () { }, go: function () { }, has_more: function () { } }, tools || {});

            if (!GlobalUtilities.is_element_in_document(elems["container"])) return;

            tools.wait();

            if (_div) jQuery(_div).fadeOut(500, function () { _dispose(tools); });
            else _dispose(tools);
        };

        var tls = GlobalUtilities.add_to_escape_queue(elems["container"], function (tools) { hide(tools); }, { Stick: params.Stick });

        return { Close: function () { hide(tls); } }
    },

    show_image: function (url, event) {
        event = event || {};

        if (event.ctrlKey) return window.open(url);

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "label", Class: "rv-border-radius-half SoftBackgroundColor", Name: "_div",
                Style: "text-align:center; padding:1rem; margin:0rem 10%;",
                Childs: [
                    {
                        Type: "i", Class: "fa fa-spinner fa-spin fa-pulse fa-3x", Name: "loading",
                        Attributes: [{ Name: "aria-hidden", Value: true }]
                    },
                    {
                        Type: "img", Class: "rv-border-radius-half", Name: "image",
                        Style: "max-width:100%; display:none;",
                        Attributes: [{ Name: "src", Value: url }],
                        Properties: [
                            {
                                Name: "onload",
                                Value: function () {
                                    jQuery(elems["loading"]).fadeOut(0, function () {
                                        jQuery(elems["image"]).toggle(500);
                                    });
                                }
                            }
                        ]
                    }
                ]
            }
        ]);

        GlobalUtilities.show(elems["_div"], { Style: "text-align:center;" });

        elems["_div"].style.display = "inline-block";
    },

    verification_code_dialog: function (data, params) {
        var that = this;

        data = data || {};
        params = params || {};

        var callback = params.Callback || function (d, done) { done(true); };

        var msg = params.Message || RVDic.MSG.AVerificationCodeHasBeenSentToYourNWithValueM;

        switch (data.Media) {
            case "Email":
                msg = msg.replace("[n]", RVDic.EmailAddress).replace("[m]", Base64.decode(data.EmailAddress));
                break;
            case "SMS":
                msg = msg.replace("[n]", RVDic.PhoneNumber).replace("[m]", Base64.decode(data.PhoneNumber));
                break;
        }

        var sendingCode = false, timeIsUp = false;

        var promptObj = GlobalUtilities.prompt(msg, {
            Placeholder: RVDic.Code, Center: true, Stick: !!params.HideCancelButton,
            HideCancelButton: !!params.HideCancelButton, DoNotClose: !!params.HideCancelButton
        }, function (value) {
            value = value === false ? value : GlobalUtilities.trim(value);

            if (sendingCode || timeIsUp || !value) return callback(false);
            sendingCode = true;

            callback({ Token: data.Token, Code: value }, function (result) {
                sendingCode = false;

                if (!result) promptObj.Clear();
                else { clearInterval(totalInterval); promptObj.Close(); }
            });
        });

        var _set_seconds = function (seconds) {
            promptObj.Content.innerHTML = GlobalUtilities.convert_numbers_to_persian(
                RVDic.RemainingTime + ": " + RVDic.NSeconds.replace("[n]", seconds));
        };

        var _set_retry_button = function () {
            timeIsUp = true;

            promptObj.Content.innerHTML = "";

            var btn = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "ActionButton", Name: "btn", Style: "display:inline-block; font-size:0.6rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.Resend }]
                }
            ], promptObj.Content)["btn"];

            var processing = false;

            btn.onclick = function () {
                if (processing) return;
                processing = true;

                RVAPI.ResendVerificationCode({
                    Token: data.Token, ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        _start_clock();
                    }
                });
            };
        };

        var _start_clock = function () {
            var remaining = data.Timeout - 1;
            timeIsUp = false;

            var si = setInterval(function () {
                --remaining;

                if (remaining <= 0) { clearInterval(si); return _set_retry_button(); }
                else _set_seconds(remaining);
            }, 1000);

            _set_seconds(remaining);
        };

        _start_clock();

        var totalTimeout = data.TotalTimeout - 1;
        var totalInterval = setInterval(function () { if (--totalTimeout <= 0) promptObj.Close(); }, 1000);

        return { Close: function () { promptObj.Close(); } };
    },

    find_path: function (value, data) {
        var result = null;

        if (data == value) return [data];
        else if (GlobalUtilities.get_type(data) == "array") {
            for (var i = 0, lnt = data.length; i < lnt; ++i) if (result = find(value, data[i])) { result.push(i); return result; }
        }
        else if (GlobalUtilities.get_type(data) == "json") {
            for (var i in data) if (result = find(value, data[i])) { result.push(i); return result; }
        }
    },

    get_type: (function () {
        var f = (function () { }).constructor;
        var j = ({}).constructor;
        var a = ([]).constructor;
        var s = ("gesi").constructor;
        var n = (2).constructor;
        var b = (true).constructor;
        var t = (new Date()).constructor;

        return function (value) {
            if (value === null) return "null";
            else if (value === undefined) return "undefined";

            switch (value.constructor) {
                case f:
                    return "function";
                case j:
                    return "json";
                case a:
                    return "array";
                case s:
                    return "string";
                case n:
                    return "number";
                case b:
                    return "boolean";
                case t:
                    return "datetime";
                default:
                    return String(typeof (value));
            }
        }
    })(),

    extend: function (jsonValue) {
        var hasLevel = (arguments.length > 0) && (GlobalUtilities.get_type(arguments[arguments.length - 1]) == "number");
        var level = hasLevel ? arguments[arguments.length - 1] : 3;

        var args = arguments.length == (hasLevel ? 2 : 1) && GlobalUtilities.get_type(jsonValue) == "array" ? jsonValue : arguments;

        var first = args.length > 0 ? args[0] : null;
        var second = args.length > 1 ? args[1] : null;

        if ((GlobalUtilities.get_type(first) != "json") || (GlobalUtilities.get_type(second) != "json")) return first;

        for (var o in second) {
            var type = GlobalUtilities.get_type(second[o]);
            if (type == "undefined") continue;

            if ((GlobalUtilities.get_type(first[o]) == "json") && (GlobalUtilities.get_type(second[o]) == "json") && (level > 0))
                first[o] = GlobalUtilities.extend((first[o] || {}), second[o], level - 1);
            else
                first[o] = second[o];
        }

        var newArgs = [first];
        for (var i = 2, lnt = args.length; i < lnt; ++i)
            newArgs.push(args[i]);

        return GlobalUtilities.extend(newArgs, level);
    },

    any: function (arrayOrJson, func) {
        if (GlobalUtilities.get_type(func) != "function") return false;

        if (GlobalUtilities.get_type(arrayOrJson) == "array") {
            for (var i = 0, lnt = arrayOrJson.length; i < lnt; ++i) if (func(arrayOrJson[i])) return true;
        }
        else if (GlobalUtilities.get_type(arrayOrJson) == "json") {
            for (var id in arrayOrJson) if (func(arrayOrJson[id])) return true;
        }

        return false;
    },

    array2tree: function (arr, options) {
        arr = arr || [];
        options = options || {};

        var strId = (options.Str || {}).ID;
        var strParentId = (options.Str || {}).ParentID;
        var strChilds = (options.Str || {}).Childs;

        if (!strId || !strParentId || !strChilds) return arr;

        var _add_items = function (parentId, theArray) {
            for (var i = 0, lnt = arr.length; i < lnt; ++i) {
                if (!(!parentId && !arr[i][strParentId]) && (parentId != arr[i][strParentId])) continue;

                var tmp = {};
                tmp[strChilds] = [];

                theArray.push(GlobalUtilities.extend(arr[i] || {}, tmp));

                _add_items(theItem[String], theItem[strChilds]);
            }
        };

        var newArr = []
        _add_items(null, newArr);

        return newArr;
    },

    secure_string: function (str) {
        if (!str) return "";
        else str = String(str);

        var _dic = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#x27;" /* "&#039;" */ /*, "/": "&#x2F;" */ }; //the last one is incompatible with @ tags because of base64

        for (var k in _dic) str = str.replace(k, _dic[k]);

        return str;
    },

    verify_string: function (str) {
        return str == null ? str : String(str).replace(/ي/g, "ی").replace(/ك/g, "ک");
    },

    is_search_match: function (text, searchText) {
        if ((GlobalUtilities.get_type(text) != "string") || (GlobalUtilities.get_type(searchText) != "string")) return false;

        text = GlobalUtilities.trim(text).toLowerCase();
        searchText = GlobalUtilities.trim(searchText).toLowerCase();

        if (!searchText) return true;

        searchText = searchText.split(" ").filter(val => !!val);

        return text.split(" ")
            .filter(val => !!val)
            .some(val => searchText.some(x => val.indexOf(x) >= 0));
    },

    diff: function (newStr, oldStr) {
        var newLen = !newStr ? 0 : String(newStr).length;
        var oldLen = !oldStr ? 0 : String(oldStr).length;
        var dif = "";

        for (var i = 0, pos = 0; i < newLen; ++i) {
            if ((pos < oldLen) && (newStr[i] == oldStr[pos]))++pos;
            else dif += newStr[i];
        }

        return dif;
    },

    escape4regexp: function (str) { return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"); },

    is_url: function (str) { return /((([hH][tT][tT][pP][sS]?)|([fF][tT][pP])):\/\/[^\s<>]+)/g.test(str); },

    is_js: function (url) {
        if (!url) return false;
        else url = String(url);

        var qi = url.indexOf('?');
        var hi = url.indexOf('#');
        
        if (qi > 0) url = url.substr(0, qi);
        if (hi > 0) url = url.substr(0, hi);
        
        var extension = url.substring(url.lastIndexOf(".") + 1, url.length);
        return extension.toLowerCase() !== String("css");
    },

    add_timestamp: function (url) {
        var ts = window.__TIMESTAMP = window.__TIMESTAMP || (new Date()).getTime();

        if (((new Date()).getTime() - ts) > (1000 * 5))
            ts = window.__TIMESTAMP = (new Date()).getTime();
        
        if (!url) return "";
        return url + (url.indexOf("?") >= 0 ? "&" : "?") + "timeStamp=" + ts;
    },

    is_base64: function (str) {
        return (new RegExp("^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$", "g")).test(str);
    },

    password_score: function (strPass) {
        strPass = GlobalUtilities.trim(String(strPass || " "));

        var scoreDic = {
            HasLower: /[a-z]/g.test(strPass),
            HasUpper: /[A-Z]/g.test(strPass),
            HasNonAlphabetic: !/^[a-zA-Z]+$/g.test(strPass) && (strPass.length > 0),
            HasNonAlphaNumeric: !/^[a-zA-Z0-9]+$/g.test(strPass) && (strPass.length > 0)
        };

        var cnt = 0, passed = 0, score = 0;
        for (var k in scoreDic) { ++cnt; if (scoreDic[k])++passed; }
        score = passed / cnt;

        if ((strPass.length >= 8) && (score >= 0.75)) return { Score: 1, Color: "rgb(22,188,31)" };
        else if ((strPass.length >= 5) && (score >= 0.5)) return { Score: 0.5, Color: "#00f" };
        else if (strPass.length > 0) return { Score: 0.1, Color: "#f00" };
        else return { Score: 0, Color: "transparent" };
    },

    rem2px: function () {
        var _div = GlobalUtilities.create_nested_elements([{
            Type: "div", Style: "position:fixed; width:1rem; left:-1000px; top:-1000px;", Name: "_div"
        }], document.body)["_div"];

        return jQuery(_div).width();
    },

    vw2px: function () {
        var _div = GlobalUtilities.create_nested_elements([{
            Type: "div", Style: "position:fixed; width:1vw; left:-1000px; top:-1000px;", Name: "_div"
        }], document.body)["_div"];

        return jQuery(_div).width();
    },

    trim: function (str) {
        if (!str) return str;
        str = str ? str.replace(/^\s+/, '') : "";
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    },

    trim_punctuations: function (str) {
        str = GlobalUtilities.trim(str);
        return str ? str.replace(/[\.\?؟\:,،؛;]*$/g, "") : str;
    },

    trim2pix: (function () {
        var _getSpan = function () {
            return GlobalUtilities.create_nested_elements([{ Type: "span", Style: "visibility:hidden;", Name: "spn" }], document.body)["spn"];
        }

        String.prototype.visualLength = function (style) {
            var _span = _getSpan();
            _span.setAttribute("style", "visibility:hidden; " + (style ? style : ""));
            _span.innerHTML = this;
            var retVal = _span.offsetWidth;
            _span.parentNode.removeChild(_span);
            return retVal;
        }

        String.prototype.trim2pix = function (length, params) {
            params = params || {};
            var postfix = params.Postfix || "";
            var tmp = this;
            var trimmed = this;

            if (tmp.visualLength(params.Style) <= length) return tmp;

            var blockSize = (tmp.length / 2).toFixed(0), pos = (tmp.length / 2).toFixed(0) - 1;

            while (true) {
                trimmed = tmp.substring(0, pos + 1) + postfix;
                var newVLength = trimmed.visualLength(params.Style);

                if (newVLength == length || blockSize <= 1) return trimmed;

                blockSize = Number((blockSize / 2).toFixed(0));
                pos += newVLength < length ? blockSize : -1 * blockSize;
            }

            return trimmed;
        }

        return function (str, length, params) {
            return String(str).trim2pix(length, params)
        }
    })(),

    remove_empty_tags: function (container) {
        jQuery(container).children('p,div,span,pre').each(function () {
            var $this = jQuery(this);
            if ($this.html().replace(/\s|&nbsp;/g, '').length == 0) $this.remove();
        });

        jQuery(container).children('br').each(function () {
            var br = jQuery(this).get(0);
            if (!br.nextSibling || !br.previousSibling || ((br.nextSibling || {}).tagName || " ").toLowerCase() == "br" ||
                ((br.previousSibling || {}).tagName || " ").toLowerCase() == "br") jQuery(br).remove();
        });
    },

    inner_text: function (element, params) {
        params = params || {};

        var text = "";

        if (((element || {}).nodeName || " ").toLowerCase() == "#text")
            text = element.data;
        else {
            var firstChild = (element || {}).firstChild;

            while (firstChild) {
                text += " " + GlobalUtilities.inner_text(firstChild) + (params.DontTrim ? " " : "");
                firstChild = firstChild.nextSibling;
            }
        }

        return params.DontTrim ? text : GlobalUtilities.trim(text);
    },

    show_text_changes: (function () {
        var loaded = false;

        var _do = function (container, newText, oldText) {
            container.innerHTML = "";

            var d = document.createElement("div");

            d.innerHTML = newText || " ";
            newText = GlobalUtilities.inner_text(d, { DontTrim: true });

            d.innerHTML = oldText || " ";
            oldText = GlobalUtilities.inner_text(d, { DontTrim: true });

            var diff = diffString(oldText, newText);

            GlobalUtilities.append_markup_text(container, diff, {
                RichText: true, IgnoreBreaks: true,
                Done: function () {
                    var els = container.getElementsByTagName("del");
                    for (var i = 0, lnt = els.length; i < lnt; ++i) els[i].style.color = "red";

                    els = container.getElementsByTagName("ins");
                    for (var i = 0, lnt = els.length; i < lnt; ++i) els[i].style.color = "green";
                }
            });
        }

        return function (container, newText, oldText) {
            if (loaded) return _do(container, newText, oldText);

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["Lib/jsDiff.js"], {
                OnLoad: function () { _do(container, newText, oldText); loaded = true; }
            });
        }
    })(),

    textdirection: (function () {
        //Arabic - Range: 0600–06FF, Arabic Supplement - Range: 0750–077F, Arabic Presentation Forms-A - Range: FB50–FDFF, Arabic Presentation Forms-B - Range: FE70–FEFF
        var rtlChars = '\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF';

        //ASCII Punctuation - Range: 0000-0020, General Punctuation - Range: 2000-200D
        var controlChars = '\u0000-\u0020\u2000-\u200D*"\'.0-9()$%^&@!#,=?/\\+-:<>|;';

        var reRTL = new RegExp('^[' + controlChars + ']*[' + rtlChars + ']');
        var reControl = new RegExp('^[' + controlChars + ']*$');

        return function (input) {
            if (!input) return window.RV_RTL ? "rtl" : "ltr";
            else return input.match(reRTL) ? 'rtl' : (input.match(reControl) ? false : 'ltr');
        }
    })(),

    is_empty_text: function (content) {
        var _div = document.createElement("div");
        _div.innerHTML = content;

        var text = _div.innerText || _div.textContent;
        return GlobalUtilities.trim(text) == "" ? true : false;
    },

    get_text_begining: function (text, length, postfix, params) {
        params = params || {};
        if (!text) return "";
        postfix = String(postfix || "");
        var _testDiv = document.createElement("div");
        if (params.RichText === false) _testDiv.innerHTML = text;
        else GlobalUtilities.append_markup_text(_testDiv, text, { RichText: true });
        var _desc = GlobalUtilities.secure_string(String(_testDiv.innerText || _testDiv.textContent || ""));
        if (_desc.length > length) _desc = _desc.substr(0, length - postfix.length) + postfix;
        return _desc;
    },

    set_text: function (container, text) {
        container.innerHTML = "";
        GlobalUtilities.create_nested_elements([{ Type: "text", TextValue: text }], container);
    },

    is_valid_email: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    is_valid_regexp: function (input) {
        try { return !!input && !!(new RegExp(String(input))); }
        catch (e) { return false; }
    },

    help_request: function (e, name) {
        var helpEntries = window.HELPENTRIES = window.HELPENTRIES || {};

        if (helpEntries[name]) {
            if (helpEntries[name].Showed) helpEntries[name].Showed.Close();
            return (helpEntries[name].Showed = GlobalUtilities.show(helpEntries[name]));
        }

        var _div = helpEntries[name] = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-10 medium-10 large-10 row rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "_div"
            }
        ])["_div"];

        GlobalUtilities.loading(_div);
        _div.Showed = GlobalUtilities.show(_div);

        GlobalUtilities.load_files(["Lang/Help/" + RV_Lang + ".js", "RaaiVanHelp/HelpUtils.js", "RaaiVanHelp/RaaiVanHelp.js"], {
            OnLoad: function () { new RaaiVanHelp(_div, { Index: HelpUtils.get_architecture(name) }); }
        });
    },

    append_autosuggest: function (_div, params) {
        if (typeof (_div) != "object") _div = document.getElementById(_div);
        if (_div == null) return;

        params = params || {};

        var hasFunctionDataSource = GlobalUtilities.get_type(params.AjaxDataSource) == "function";
        var hasAjaxDataSource = !hasFunctionDataSource && params.AjaxDataSource &&
            params.ResponseParser && !(params.ArrayDataSource || []).length;
        var hasArrayDataSource = !hasAjaxDataSource && (params.ArrayDataSource || []).length;
        var hasSelectOptions = (hasAjaxDataSource || hasArrayDataSource) && (params.SelectOptions !== false);
        var removeButton = !!params.OnRemove;

        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Class: "small-12 medium-12 large-12", Style: "position:relative;",
            Childs: [
                {
                    Type: "input", Class: "rv-input", Name: "inputId", InnerTitle: params.InnerTitle,
                    Style: params.InputStyle + "; width:100%;" +
                        (hasSelectOptions ? "padding-" + RV_RevFloat + ":2.4rem;" : "")
                },
                (!hasSelectOptions && !removeButton ? null : {
                    Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0.5rem;",
                    Childs: [
                        (!hasSelectOptions ? null : {
                            Type: "middle", Class: "rv-air-button rv-circle", Name: "expandButton",
                            Style: "width:1.4rem; height:1rem; text-align:center; padding:0rem;",
                            Childs: [{ Type: "div", Style: "margin-top:-0.3rem;", Childs: [{ Type: "text", TextValue: "..." }] }]
                        }),
                        (!removeButton || hasSelectOptions ? null : {
                            Type: "middle", Name: "removeButton", Style: "text-align:center; padding:0rem;",
                            Childs: [{
                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                Properties: [{ Name: "onclick", Value: params.OnRemove }],
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }]
                        })
                    ]
                })
            ]
        }], _div);

        var inputElem = elems["inputId"];

        var dialog = null, showed = null, suggestUrl = params.AjaxDataSource, lastUsedUrl = null, listViewer = null;

        if (!params.OnSelectButtonClick && ((params.SelectOptions || {}).Mode == "Node")) {
            var slctObj = {};

            params.OnSelectButtonClick = function () {
                if (slctObj.__NodeListContainer)
                    return (slctObj.__ShowedNodeList = GlobalUtilities.show(slctObj.__NodeListContainer));

                var _div = slctObj.__NodeListContainer = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "_div"
                }])["_div"];

                slctObj.__ShowedNodeList = GlobalUtilities.show(_div);
                GlobalUtilities.loading(_div);

                GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                    OnLoad: function () {
                        var nodeTypes = params.SelectOptions.NodeTypes || [];

                        new NodeSelect(_div, {
                            Options: {
                                Title: RVDic.NodeSelect, NodeTypeSearchBox: !nodeTypes.length, TreeCheckbox: false, HideSelectedItems: true,
                                Filters: true, ShowBottomBar: false,
                                Limits: !nodeTypes.length ? null : { NodeTypes: nodeTypes },
                                OnSelect: function (node) {
                                    slctObj.__ShowedNodeList.Close();
                                    objAutoSuggest.set_item(node.NodeID, node.Name);
                                }
                            }
                        });
                    }
                });
            }
        }

        if (elems["expandButton"]) elems["expandButton"].onclick = params.OnSelectButtonClick || function () {
            if (suggestUrl && (lastUsedUrl != suggestUrl) && listViewer) {
                listViewer.clear();
                listViewer.data_request();
            }

            lastUsedUrl = suggestUrl;

            if (dialog) return (showed = GlobalUtilities.show(dialog));

            dialog = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "_div"
            }])["_div"];

            GlobalUtilities.loading(dialog);
            showed = GlobalUtilities.show(dialog);

            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                OnLoad: function () {
                    listViewer = new NewSimpleListViewer(dialog, {
                        AutoGrow: false,
                        Options: {
                            InnerWidthOffset: 0, Width: null, SearchInput: true,
                            OnDataRequest: function (options, done) {
                                if (!suggestUrl && hasArrayDataSource) {
                                    var retArr = [];

                                    jQuery.each(params.ArrayDataSource || [], function (ind, val) {
                                        if (!options.SearchText || val[0].indexOf(options.SearchText) >= 0) retArr.push(val);
                                    });

                                    return done(retArr);
                                }

                                var ds = suggestUrl + Base64.encode(options.SearchText) +
                                    "&Count=" + options.Count + "&LowerBoundary=" + options.LowerBoundary +
                                    "&timeStamp=" + (new Date().getTime());

                                RVAPI.PostRequest(ds, null, function (result) {
                                    done(params.ResponseParser(JSON.stringify(result)) || []);
                                });
                            },
                            ItemBuilder: function (container, item, params) {
                                item = item || {};

                                var name = item[0], id = item[1];

                                var elems = GlobalUtilities.create_nested_elements([
                                    {
                                        Type: "div", Name: "_div",
                                        Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                                        Style: "display:inline-block; margin:0.3rem; padding:0.3rem; cursor:pointer;",
                                        Childs: [{ Type: "text", TextValue: name }]
                                    }
                                ], container);

                                elems["_div"].onclick = function () {
                                    showed.Close();
                                    if (objAutoSuggest) objAutoSuggest.set_item(id, name);
                                };

                                params.OnAfterAdd();
                            }
                        }
                    });
                }
            });
        };

        var objAutoSuggest = new autosuggest(inputElem, params.ArrayDataSource || "", params.AjaxDataSource || "", params.OnSelect);

        initialize_autosuggest(objAutoSuggest, {
            ResponseParser: params.ResponseParser,
            OnEnter: params.OnEnter,
            OnBindURL: function (url) { suggestUrl = url; }
        });

        objAutoSuggest.InputElement = inputElem;
        if (params.InnerTitle) {
            GlobalUtilities.set_inner_title(inputElem, params.InnerTitle);
            objAutoSuggest.InnerTitle = params.InnerTitle;
        }
        return objAutoSuggest;
    },

    _load_editor: (function () {
        var loading = false, loaded = false;

        window.CKE_VERSION = "4.5.6";

        return function (done) {
            if (loaded) return done();
            else if (loading) {
                var x = setInterval(function () { if (!loaded) return; clearInterval(x); done(); }, 100);
                return;
            }

            loading = true;

            GlobalUtilities.load_files(["CK_Editor_" + window.CKE_VERSION + "/ckeditor.js"], {
                OnLoad: function () {
                    var y = setInterval(function () {
                        if (String((window.CKEDITOR || {}).status || " ").toLowerCase() != "loaded") return;
                        clearInterval(y);
                        loaded = !(loading = false);
                        done();

                        //if (!(window.CKEDITOR || {}).on) return;
                        //clearInterval(y);
                        //CKEDITOR.on("loaded", function (evt) { loaded = !(loading = false); done(); });
                    }, 50);
                }
            });
        }
    })(),

    _append_rich_text_editor: function (_div, params, done) {
        params = params || {};

        var rvButtons = [], editor;

        if (params.EnableTagging === true) rvButtons.push('RVTag');
        if (params.EnableUploader === true) rvButtons.push('RVUploader');
        if (params.EnableCodeHighlighter === true) rvButtons.push('RVCodeHighlighter');
        if (params.EnableMediaSelect === true) rvButtons.push('RVMediaSelect');
        if (params.EnableHelpItemSelect === true) rvButtons.push('RVHelpItemSelect');

        var toolbar = [
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', 'pastefromexcel', '-', 'Undo', 'Redo'],
            ['Find', 'Replace', '-', 'SelectAll'], ['Link', 'Unlink'], ['Bold', 'Italic', 'Underline', 'Strike'],
            ['TextColor', 'BGColor', '-', 'SpecialChar', '-', 'Maximize'], rvButtons,
            ['NumberedList', 'BulletedList', 'Outdent', 'Indent', '-', 'Blockquote', '-',
                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'
            ],
            ["Table"]
        ];

        if (window.RV_RTL) {
            for (var i = 0, lnt = toolbar.length; i < lnt; ++i) toolbar[i] = toolbar[i].reverse();
        }

        //Config
        CKEDITOR.config.plugins = 'bbcode,dialogui,dialog,dialogadvtab,basicstyles,' +
            'bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,' +
            'templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,' +
            'find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,' +
            'horizontalrule,htmlwriter,iframe,wysiwygarea,indent,indentblock,indentlist,smiley,justify,' +
            'menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,pastefromexcel,' +
            'preview,removeformat,selectall,showblocks,showborders,specialchar,scayt,' +
            'tab,table,tabletools,tableresize,undo,wsc,autogrow';
        CKEDITOR.config.allowedContent = { a: { attributes: 'href' }, img: { attributes: 'src', styles: 'width,height' } };
        CKEDITOR.config.skin = 'moono';
        //end of Config

        var _get_editor = function (data) {
            return CKEDITOR.appendTo(_div, {
                on: { instanceReady: function (evt) { _onInstanceReady(); if (data) editor.set_data(data); done(editor); } },
                language: 'fa', extraPlugins: 'RVCodeHighlighter,RVMediaSelect,RVHelpItemSelect,colorbutton,colordialog,RVTag,RVUploader,autogrow,pastefromexcel',
                toolbar: toolbar, startupFocus: params.Focus === false ? false : true
            }, "");
        }

        var editor = _get_editor();

        var _onInstanceReady = function () {
            editor.rebuild = function (data) { editor = _get_editor(data); }

            if (params.EnableTagging === true) {
                GlobalUtilities.load_files(["CK_Editor_" + window.CKE_VERSION + "/RaaivanPlugins/CKE_RVTag.js"], {
                    OnLoad: function () { new CKE_RVTag(_div, { Editor: editor }); }
                });
            }

            if (!(params.EnableUploader === false)) {
                GlobalUtilities.load_files(["CK_Editor_" + window.CKE_VERSION + "/RaaivanPlugins/CKE_RVUploader.js"], {
                    OnLoad: function () {
                        new CKE_RVUploader(_div, {
                            Editor: editor,
                            Removable: !!(params.Upload || {}).Removable,
                            OwnerID: (params.Upload || {}).OwnerID,
                            OwnerType: (params.Upload || {}).OwnerType,
                            AttachedFiles: (params.Upload || {}).AttachedFiles || [],
                            OnUpload: (params.Upload || {}).OnUpload,
                            OnRemove: (params.Upload || {}).OnRemove
                        });
                    }
                });
            }

            if (!(params.EnableCodeHighlighter === false)) {
                GlobalUtilities.load_files(["CK_Editor_" + window.CKE_VERSION + "/RaaivanPlugins/CKE_RVCodeHighlighter.js"], {
                    OnLoad: function () { new CKE_RVCodeHighlighter(_div, { Editor: editor }); }
                });
            }

            if (params.EnableMediaSelect === true) {
                GlobalUtilities.load_files(["CK_Editor_" + window.CKE_VERSION + "/RaaivanPlugins/CKE_RVMediaSelect.js"], {
                    OnLoad: function () { new CKE_RVMediaSelect(_div, { Editor: editor, GetMedia: (params.MediaSelect || {}).MediaRequest }); }
                });
            }

            if (params.EnableHelpItemSelect === true) {
                GlobalUtilities.load_files(["CK_Editor_" + window.CKE_VERSION + "/RaaivanPlugins/CKE_RVHelpItemSelect.js"], {
                    OnLoad: function () { new CKE_RVHelpItemSelect(_div, { Editor: editor, OnItemSelect: (params.HelpItemSelect || {}).OnItemSelect }); }
                });
            }

            editor.insert_data = function (_htmlText) {
                editor.insertHtml(_htmlText);
            };

            editor._setData = editor.set_data = function (_htmlText) {
                editor.editable().setHtml(_htmlText);
                //editor.setData('', function () { editor.insertHtml(_htmlText); });
                //setTimeout(function () { editor.insertHtml(_htmlText); }, 1000);
            };

            editor._getData = editor.get_data = function () {
                var _div = GlobalUtilities.create_nested_elements([{ Type: "div", Name: "_div" }])["_div"];
                _div.innerHTML = editor.document.getBody().getHtml();

                jQuery(_div).contents().filter(function () {
                    //Hazf tag haye commenti ke editor ezafe karde ast
                    return this.nodeType == 8;
                }).remove();

                jQuery(_div).find("[data-rv_tagid][data-rv_tagtype][data-rv_tagvalue]").each(function (index) {
                    var _text = jQuery(this).text(), _info = null, _type = jQuery(this).attr("data-rv_tagtype").split("_")[0] || "", count = 0;

                    if (jQuery(this).attr("data-rv_taginfo")) {
                        _info = JSON.parse(Base64.decode(jQuery(this).attr("data-rv_taginfo")));
                        var _ext = (_info.Extension || "").toString().toLowerCase();

                        if (_type == "File" && (_ext == 'jpg' || _ext == 'jpeg' || _ext == 'png' || _ext == 'gif')) {
                            if (jQuery(this).width() || jQuery(this).attr("width"))
                                _info.W = jQuery(this).width() || jQuery(this).attr("width");
                            if (jQuery(this).height() || jQuery(this).attr("height"))
                                _info.H = jQuery(this).height() || jQuery(this).attr("height");
                            //_info.W = jQuery(this).width() || jQuery(this).attr("width") || 100;
                            //_info.H = jQuery(this).height() || jQuery(this).attr("height") || 100;
                        }
                        else if (_type == "Link")
                            _info.href = Base64.encode(jQuery(this).attr("href"));

                        for (var key in _info) if (_info[key] != null || _info[key] != "") count++;
                    }

                    var _tag_text = "@[[" + jQuery(this).attr("data-rv_tagid") + ":" + _type + ":" +
                        (_text == "" ? jQuery(this).attr("data-rv_tagvalue") : Base64.encode(_text)) +
                        (count == 0 ? "" : ":" + Base64.encode(JSON.stringify(_info))) + "]]";

                    jQuery(this).before(_tag_text);
                    jQuery(this).remove();
                });

                var re = new RegExp("((([hH][tT][tT][pP][sS]?)|([fF][tT][pP])):\/\/[^\s<>]+)");
                jQuery(_div).find("a[data-cke-saved-href]").each(
                    function (index) {
                        if (re.test(jQuery(this).attr("href"))) {
                            var _tag_text = "@[[Link:Link:" + Base64.encode(jQuery(this).text()) + ":" +
                                Base64.encode("{\"href\":\"" + Base64.encode(jQuery(this).attr("href")) + "\"}") + "]]";

                            jQuery(this).before(_tag_text);
                            jQuery(this).remove();
                        }
                    }
                );

                jQuery(_div).find('pre code').each(
                    function () {
                        var _codeText = GlobalUtilities.trim(jQuery(this).text());
                        if (_codeText == "") { jQuery(this).remove(); }
                    }
                );

                return _div.innerHTML;
            }; //end of 'editor._getData = editor.get_data = function () {'
        }
    },

    append_rich_text_editor: function (_div, params, done) {
        if (typeof (_div) != "object") _div = document.getElementById(_div);

        GlobalUtilities.loading(_div);

        GlobalUtilities._load_editor(function () {
            _div.innerHTML = "";
            GlobalUtilities._append_rich_text_editor(_div, params, done);
        });
    },

    append_checkbox: function (element, params) {
        params = params || {};

        var threeState = params.ThreeState === true;

        params.Checked = params.checked = (threeState && (GlobalUtilities.get_type(params.checked) != "boolean") &&
            (GlobalUtilities.get_type(params.Checked) != "boolean")) ? null :
            (params.checked === true) || (params.Checked === true);

        var width = GlobalUtilities.get_type(params.Width) == "string" ? params.Width : (params.Width || 20) + "px";
        var height = GlobalUtilities.get_type(params.Height) == "string" ? params.Height : (params.Height || 20) + "px";

        var img = GlobalUtilities.create_nested_elements([{
            Type: "img", Name: "image", Style: params.Style || ("width:" + width + "; height:" + height + "; cursor:pointer;")
        }])["image"];

        if (element) element.appendChild(img);
        img.Checked = img.checked = params.Checked;

        var _set_icon = function () {
            var icn = threeState && (img.Checked === false) ? "False" : (img.Checked ? "Checked" : "Unchecked");
            img.setAttribute("src", GlobalUtilities.icon("Checkbox-" + icn + ".png"));
        };

        _set_icon();

        var onClick = params.OnClick || function (e, d) { };
        var processing = false;

        var onchange = function (e) {
            if (params.OnChange) params.OnChange.call(img, e);
            else if (params.onchange) params.onchange.call(img, e);
            else if (params.onChange) params.onChange.call(img, e);
        };

        var succeed = function (result, e) {
            if (processing === false) return;
            processing = false;
            if (result === false) return;

            img.Checked = img.checked = img.Checked === null ? true :
                (img.Checked === true ? false : (threeState ? null : true));
            _set_icon();

            onchange(e);
        };

        var _change = function (p, e, value) {
            p = p || {};

            if (processing) return;

            img.Checked = img.checked = threeState && (value === null) ? null : !!value;
            _set_icon();

            if (!p.StopOnChange) onchange(e);
        };

        img.check = img.Check = function (p, e) { _change(p, e, true); };
        img.uncheck = img.Uncheck = img.UnCheck = function (p, e) { _change(p, e, false); };
        img.clear = img.Clear = img.UnCheck = function (p, e) { _change(p, e, null); };

        img.onclick = function (e) {
            e.stopPropagation();

            if (processing) return;
            processing = true;

            var prevented = false;

            if (onClick.call(img, { preventDefault: function () { prevented = true } }, succeed) === false) succeed(false, e);
            else if (processing === true && !prevented) succeed(true, e);
        };

        return img;
    },

    append_switch: function (element, params) {
        params = params || {};

        var width = params.Width;
        var height = params.Height;

        if (!width && !height) width = 3;

        var margin = params.MiniMode ? 2 : 4;

        if (width && !height) {
            height = "calc(" + (width / 2) + "rem + " + margin + "px)";
            width = width + "rem";
        }
        else if (!width && height) {
            width = "calc(" + (height * 2) + "rem - " + (margin * 2) + "px)";
            height = height + "rem";
        }

        var elems = GlobalUtilities.create_nested_elements([{
            Type: "label", Name: "container",
            Childs: [{
                Type: "label", Class: "rv-switch", Style: "width:" + width + "; height:" + height + ";",
                Childs: [
                    {
                        Type: "input", Class: "rv-switch-input", Name: "chb",
                        Attributes: [
                            { Name: "type", Value: "checkbox" },
                            (!params.Checked ? null : { Name: "checked", Value: true })
                        ],
                        Properties: [!params.OnChange ? null : { Name: "onchange", Value: function (e) { params.OnChange.call(this, e); } }]
                    },
                    { Type: "span", Class: "rv-switch-slider rv-switch-round " + (!params.MiniMode ? "" : "rv-switch-slider-mini") }
                ]
            }]
        }], element);

        elems["container"].Checkbox = elems["chb"];

        return elems["container"];
    },

    _append_typed_input: function (element, params, options) {
        params = params || {};
        options = options || {};

        var allowed_specials = {
            8: "backspace", 27: "escape", 9: "tab", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "delete"
        }

        var _regex = function () {
            if (options.AlphaNumeric) return /[A-Za-z0-9]/;
            else if (options.Number) return params.Float ? /[0-9]|\./ : /[0-9]/;
        };

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "input", Class: "TextInput", Name: "_input", Style: params.Style || "", InnerTitle: params.InnerTitle,
                Attributes: [{ Name: "type", Value: "text" }],
                Properties: [
                    {
                        Name: "onkeypress",
                        Value: function (evt) {
                            var theEvent = evt || window.event;
                            var key = theEvent.keyCode || theEvent.which;
                            if (key == 27 && params.OnEscape) params.OnEscape.call(this);
                            if (allowed_specials[key]) return;
                            key = String.fromCharCode(key);
                            var regex = _regex();
                            var val = GlobalUtilities.trim(elems["_input"].value);
                            if (!regex.test(key) || (key == "." && (val.indexOf(".") >= 0 || val == "")) ||
                                (params.MaxLength > 0 && val.length >= params.MaxLength)) {
                                theEvent.returnValue = false;
                                if (theEvent.preventDefault) theEvent.preventDefault();
                            }
                        }
                    }
                ]
            }
        ], element);

        return elems["_input"];
    },

    append_number_input: function (element, params) {
        return GlobalUtilities._append_typed_input(element, params, { Number: true });
    },

    append_alphanumeric_input: function (element, params) {
        return GlobalUtilities._append_typed_input(element, params, { AlphaNumeric: true });
    },

    necessary_input: (function () {
        var _check = function (item) {
            var obj = item.Input || item;

            if (obj.value.length == 0) obj.style.backgroundColor = "rgba(255, 231, 231, 1)";
            else obj.style.backgroundColor = "white";
        }

        var func = function (item) {
            jQuery(item.Input || item).focus(function () { _check(item); });
            jQuery(item.Input || item).blur(function () { _check(item); });

            _check(item);
        }

        return function (items) {
            items = GlobalUtilities.get_type(arguments) == "array" ? arguments : (GlobalUtilities.get_type(items) != "array" ? [items] : items);
            for (var i = 0, lnt = (items || []).length; i < lnt; i++) func(items[i]);
        }
    })(),

    append_animated_input: function (container, params) {
        params = params || {};

        var placeholderBGColor = (params.PlaceholderStyle || {}).BackgroundColor || { Default: null, Inactive: null, Active: null };
        var placeholderColor = (params.PlaceholderStyle || {}).Color || { Default: null, Inactive: null, Active: null };
        var placeholderFontSize = (params.PlaceholderStyle || {}).FontSize || { Default: null, Active: null };

        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Class: "input-anim-label-container", Name: "container",
            Childs: [{
                Type: "label", Class: "input-anim-label", Name: "inputLabel",
                Childs: [
                    {
                        Type: "input", Name: "input",
                        Class: "rv-input input-anim-label-input " + (params.Class ? params.Class : ""),
                        Style: (params.BackgroundColor ? "background-color:" + params.BackgroundColor + ";" : "") +
                            "padding:0.3rem 0.5rem;" + (params.Style ? params.Style : ""),
                        Attributes: [
                            { Name: "type", Value: params.Type || "text" },
                            { Name: "autocomplete", Value: "off" }
                        ],
                        Properties: [{ Name: "onmousedown", Value: function (e) { e.stopImmediatePropagation(); } }]
                    },
                    {
                        Type: "span", Class: "rv-border-radius-quarter input-anim-label-input-placeholder", Name: "placeholder",
                        Style: RV_Float + ":0.8rem;",
                        Childs: [{ Type: "text", TextValue: params.Placeholder }]
                    }
                ]
            }]
        }], container);

        var inputItem = jQuery(elems["inputLabel"]);
        var input = jQuery(elems["input"]);
        var placeholder = jQuery(elems["placeholder"]);

        var set_state = function (value) {
            if (GlobalUtilities.get_type(value) != "boolean") value = !!input.val().length;

            if (value) {
                inputItem.addClass("active");
                placeholder.addClass("WarmColor");
                placeholder.css({
                    "background-color": placeholderBGColor.Active ? placeholderBGColor.Active : "",
                    "color": placeholderColor.Active ? placeholderColor.Active : "",
                    "font-size": placeholderFontSize.Active ? placeholderFontSize.Active : ""
                });
            }
            else {
                inputItem.removeClass("active");
                placeholder.removeClass("WarmColor");
                placeholder.css({
                    "background-color": placeholderBGColor.Default ? placeholderBGColor.Default : "",
                    "color": placeholderColor.Default || "rgb(150,150,150)",
                    "font-size": placeholderFontSize.Default ? placeholderFontSize.Default : ""
                });
            }
        };

        setTimeout(function () { set_state() }, 100);

        input.on("focus", function () { set_state(true); })
            .on("focusout", function () { set_state(); });

        if ((window.Object || {}).getOwnPropertyDescriptor) {
            var descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
            var originalSet = descriptor.set;

            descriptor.set = function (val) {
                originalSet.apply(this, arguments);
                set_state();
            };

            Object.defineProperty(elems["input"], "value", descriptor);
        }

        elems["container"].Input = elems["input"];

        if (params.Value) elems["input"].value = params.Value;

        return elems["container"];
    },

    append_editable_title: function (container, params) {
        params = params || {};

        var editable = params.Editable !== false;

        var title = GlobalUtilities.get_type(params.Title) == "string" ? { Value: params.Title } : params.Title || {};
        var input = params.Input || {};

        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Class: (params.Container || {}).Class, Style: (params.Container || {}).Style, Name: "container",
            Childs: [
                {
                    Type: "div", Name: "titleArea", Class: title.Class,
                    Style: (title.Style || " ") + (title.Value ? "" : "display:none;")
                },
                (!editable ? null : {
                    Type: "div", Style: (title.Value ? "display:none;" : "") + "width:100%;", Name: "inputArea",
                    Properties: [{ Name: "onclick", Value: function (e) { e.stopImmediatePropagation(); } }],
                    Childs: [{
                        Type: "input", Class: "rv-input", Name: "input",
                        Style: (input.Style || " ") + "width:100%;", InnerTitle: input.Placeholder || RVDic.Name,
                        Attributes: [{ Name: "value", Value: title.Value }],
                        Properties: [{ Name: "onmousedown", Value: function (e) { e.stopImmediatePropagation(); } }]
                    }]
                })
            ]
        }], container);

        var show_title = function () {
            var arr = GlobalUtilities.get_type(title.Builder) == "function" ?
                title.Builder(title) : { Type: "text", TextValue: title.Value };
            if (GlobalUtilities.get_type(arr) == "json") arr = [arr];

            elems["titleArea"].innerHTML = "";
            GlobalUtilities.create_nested_elements(arr, elems["titleArea"]);
        };

        show_title();

        var isEditMode = false;

        var retJson = {
            is_edit_mode: () => isEditMode,
            to_edit_mode: () => {
                if (editable) jQuery(elems["titleArea"]).fadeOut(0, () => jQuery(elems["inputArea"]).fadeIn(0, () => isEditMode = true));
            },
            to_view_mode: () => {
                if (editable) {
                    jQuery(elems["inputArea"]).fadeOut(0, () => {
                        show_title();
                        jQuery(elems["titleArea"]).fadeIn(0, () => { setTimeout(() => isEditMode = false, 100); });
                    });
                }
            }
        };

        var goingOut = false;

        if (editable) elems["titleArea"].onmouseover = () => { if (!goingOut) retJson.to_edit_mode(); };

        var save = () => {
            title.Value = elems["input"].value || title.Value;
            retJson.to_view_mode();
            if (GlobalUtilities.get_type(params.Save) == "function") params.Save(title);
        };

        if (editable) {
            jQuery(elems["input"]).on('blur', save);

            GlobalUtilities.set_onenter(elems["input"], save);

            jQuery(elems["input"]).on('mouseout', () => {
                if (!jQuery(elems["input"]).is(':focus')) {
                    goingOut = true;
                    retJson.to_view_mode();
                    setTimeout(() => { goingOut = false; }, 20);
                }
            });
        }

        return retJson;
    },

    append_circular_progress: function (container, params) {
        params = params || {};

        var size = params.Size || 8;

        var minValue = params.MinValue;
        var maxValue = params.MaxValue || 100;

        minValue = !minValue || isNaN(minValue) ? 0 : +minValue;
        maxValue = isNaN(maxValue) ? 100 : +maxValue;

        if (minValue > maxValue) {
            minValue = 0;
            maxValue = 100;
        }

        if (!window.CIRBULAR_PROGRESS_KEYFRAME) {
            window.CIRBULAR_PROGRESS_KEYFRAME = true;

            var stl = document.createElement("style");
            stl.setAttribute("type", "text/css");
            stl.innerHTML = "@keyframes progress { 0% { stroke-dasharray: 0 100; } }";
            document.head.appendChild(stl);
        }

        var get_value = function (val) {
            var ret = isNaN(+val) || (val < minValue) ? minValue : (val > maxValue ? maxValue : val);
            return Math.round(((ret - minValue) / (maxValue - minValue)) * 100);
        };

        var lineId = GlobalUtilities.random_str(10);
        var labelId = GlobalUtilities.random_str(10);

        var lbl = GlobalUtilities.convert_numbers_to_persian(!params.Label ? '' : params.Label);

        container.innerHTML = '<div style="width:' + size + 'rem; height:' + size + 'rem; justify-content:space-around;">' +
            '<svg viewbox="0 0 36 36" style="width: 100%; height: 100%;">' +
            (params.HideChannel ? '' : '<path style="fill:none; stroke:' + (params.ChannelColor || '#eee') + '; stroke-width:3.8;" ' +
                'd="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />') +
            '<path id="' + lineId + '" style="fill:none; stroke-width:2.8; stroke-linecap:round; stroke:' + (params.Color || "#ff9f00") + ';' +
            (params.Animate ? 'animation: progress ' + (params.Duration || '1') + 's ease-out forwards;' : '') + '" ' +
            'd="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" ' +
            'stroke-dasharray="' + get_value(params.Value || "0") + ', 100" />' +
            '<text id="' + labelId + '" x="18" y="' + (RV_RTL ? '22' : '20.35') + '" ' +
            'style="fill:' + (params.TextColor || '#666') + '; ' +
            'font-size:' + (params.TextSize) + 'rem; text-anchor: middle;">' + lbl + '</text>' +
            '</svg></div>';

        return {
            Update: function (value, label) {
                jQuery("#" + lineId).attr("stroke-dasharray", get_value(value || "0") + ", 100");
                jQuery("#" + labelId).html(GlobalUtilities.convert_numbers_to_persian(label));
            }
        };
    },

    append_google_login_button: function (container, options) {
        options = options || {};

        if (!(RVGlobal || {}).GoogleSignInClientID) return;

        var doSignIn = function (idToken, captchaToken) {
            UsersAPI.SignInWithGoogle({
                GoogleToken: idToken, Captcha: captchaToken, InvitationID: options.InvitationID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else {
                        GlobalUtilities.logged_in(result);
                        window.location.href = window.location.href;
                    }
                }
            });
        };

        var processing = false;

        var onLoad = function (recaptchaObj) {
            var btn = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "rv-action-button-base rv-action-button-o rv-border-radius-quarter rv-red",
                Style: "height:3rem;", Name: "btn",
                Childs: [
                    {
                        Type: "i", Class: "fa fa-google", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                        Attributes: [{ Name: "aria-hidden", Value: true }]
                    },
                    { Type: "text", TextValue: RVDic.SignInWithGoogle }
                ]
            }], container)["btn"];

            btn.onclick = function () {
                if (processing) return;
                processing = true;

                var settings = {
                    client_id: RVGlobal.GoogleSignInClientID,
                    scope: 'email profile',
                    response_type: 'id_token permission'
                };

                gapi.auth2.authorize(settings, function (result) {
                    if (result.error)
                        alert(RVDic.MSG.LoginFailed);
                    else {
                        if ((recaptchaObj || {}).getToken)
                            recaptchaObj.getToken(token => doSignIn(result.id_token, token));
                        else doSignIn(result.id_token);
                    }

                    processing = false;
                });
            };
        };

        GlobalUtilities.load_files(["API/UsersAPI.js", "https://apis.google.com/js/platform.js"], {
            OnLoad: () => gapi.load('auth2', () => GlobalUtilities.init_recaptcha(onLoad))
        });
    },

    init_recaptcha: function (callback) {
        if (GlobalUtilities.get_type(callback) != "function") callback = function () { };

        if (!(window.RVGlobal || {}).CaptchaSiteKey || !(window.RVGlobal || {}).CaptchaURL)
            return callback(null);

        GlobalUtilities.load_files([RVGlobal.CaptchaURL], {
            OnLoad: function () {
                var arr = document.getElementsByClassName('grecaptcha-badge');
                if (arr.length) arr[0].style.visibility = "visible";

                callback({
                    getToken: function (done) {
                        if (GlobalUtilities.get_type(done) != "function") done = function () { };

                        grecaptcha.ready(function () {
                            grecaptcha.execute(RVGlobal.CaptchaSiteKey, { action: 'submit' })
                                .then(token => done(token));
                        });
                    }
                });
            }
        });
    },

    hide_recaptcha: function () {
        var arr2 = document.getElementsByClassName('grecaptcha-badge');
        if (arr2.length) arr2[0].style.visibility = "hidden";
    },

    get_side_panel: function (rev, done) {
        if (GlobalUtilities.get_type(rev) == "function") {
            done = rev;
            rev = null;
        }

        var sidePanel = window.MasterPageHandler ? window.MasterPageHandler.get_side_panel(rev) : null;

        if (sidePanel) {
            if (GlobalUtilities.get_type(done) == "function") done(sidePanel);
            return sidePanel;
        }
        else setTimeout(function () { GlobalUtilities.get_side_panel(rev, done); }, 1000);
    },

    append_header: function (element, params) {
        if (!element) return;
        params = params || {};

        GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "rv-border-radius-quarter rv-ignore-bottom-radius WarmBackgroundColor",
                Style: "display:inline-block; margin:0rem 0.2rem; padding:0.4rem 1rem; color:white; font-weight:bold;" +
                    (params.FontSize ? "font-size:" + params.FontSize + ";" : ""),
                Childs: [{ Type: "text", TextValue: params.Title }]
            },
            {
                Type: "div", Class: "small-12 medium-12 large-12 WarmBackgroundColor",
                Style: "margin-bottom:0.5rem; padding-top:1px;"
            }
        ], element);

        return element;
    },

    move_element: function (element, moveDown, predicate) {
        moveDown = moveDown === true ? true : false;

        var parentNode = element.parentNode;
        var nextItem = moveDown === true ? element.nextSibling : element.previousSibling;
        if (nextItem == null) return false;

        while (nextItem.parentNode == parentNode) {
            if (predicate === undefined || predicate(nextItem)) {
                if (moveDown === true) {
                    nextItem.parentNode.replaceChild(element, nextItem);
                    element.parentNode.insertBefore(nextItem, element);
                }
                else {
                    element.parentNode.replaceChild(nextItem, element);
                    nextItem.parentNode.insertBefore(element, nextItem);
                }
                return true;
            }

            nextItem = moveDown === true ? nextItem.nextSibling : nextItem.previousSibling;
        }

        return false;
    },

    get_next_element: function (element, moveDown, predicate) {
        moveDown = moveDown === true;

        var nextItem = moveDown === true ? element.nextSibling : element.previousSibling;
        if (nextItem == null) return null;

        while (nextItem.parentNode == element.parentNode) {
            if (predicate === undefined || predicate(nextItem)) return nextItem;
            nextItem = moveDown === true ? nextItem.nextSibling : nextItem.previousSibling;
        }

        return null;
    },

    create_nested_elements: function (elements, parent) {
        var retJSON = arguments.length > 2 ? arguments[2] || {} : {};

        for (var i = 0, lnt = elements.length; i < lnt; ++i) {
            var _elem = elements[i];
            if (!_elem || !_elem.Type) continue;
            if (parent && typeof (parent) != "object") parent = document.getElementById(parent);

            var newElement = null;
            var _elemType = String(_elem.Type).toLowerCase();

            switch (_elemType) {
                case "text":
                    var val = _elem.ConvertNumbers === false ? _elem.TextValue || "" :
                        GlobalUtilities.convert_numbers_to_persian(_elem.TextValue || "");
                    newElement = document.createTextNode(val);
                    break;
                case "checkbox":
                    newElement = GlobalUtilities.append_checkbox(document.createElement("div"), _elem.Params);
                    break;
                case "switch":
                    newElement = GlobalUtilities.append_switch(document.createElement("div"), _elem.Params);
                    break;
                case "number":
                    newElement = GlobalUtilities.append_number_input(document.createElement("div"), _elem.Params);
                    break;
                case "alphanumeric":
                    newElement = GlobalUtilities.append_alphanumeric_input(document.createElement("div"), _elem.Params);
                    break;
                case "animated_input":
                    newElement = GlobalUtilities.append_animated_input(null, _elem.Params);
                    break;
                case "middle":
                case "bottom":
                    _elem = {
                        Type: "div", Class: _elem.OuterClass || " ",
                        Style: "display:table; width:100%; height:100%;" + (_elem.OuterStyle || " "),
                        Childs: [{
                            Type: "div", Class: _elem.InnerClass || " ",
                            Style: "display:table-cell; vertical-align:" + _elemType + ";" + (_elem.InnerStyle || " "),
                            Childs: [GlobalUtilities.extend(_elem, { Type: "div" })]
                        }]
                    };

                    newElement = document.createElement(_elem.Type);
                    break;
                case "help":
                    var helpName = (_elem.Params || {}).Name;

                    _elem = {
                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-circle", Tooltip: RVDic.Help,
                        Style: _elem.Style + "; display:inline-block; text-align:center; width:1.8rem; height:1.8rem;" +
                            "font-weight:bold; font-size:1rem; margin-bottom:0.2rem;",
                        Properties: [{ Name: "onclick", Value: !helpName ? null : function (e) { GlobalUtilities.help_request(e, helpName); } }],
                        Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RV_Lang == "fa" ? "؟" : "?" }] }]
                    };

                    newElement = document.createElement(_elem.Type);
                    break;
                case "header":
                    newElement = GlobalUtilities.append_header(document.createElement("div"), _elem.Params);
                    break;
                default:
                    newElement = document.createElement(_elem.Type);
                    break;
            }

            if (_elem.Link) {
                if (!(_elem.Params || {}).IgnoreMouseEvents)
                    _elem.Class = "rv-link" + (_elem.Class ? " " + _elem.Class : "");
                newElement.__RVLink = _elem.Link;
                var prms = _elem.Params;
                newElement.onclick = function (e) {
                    e.stopPropagation();
                    GlobalUtilities.link_click(e, this.__RVLink, prms);
                };
            }

            if (_elem.ID) newElement.id = _elem.ID;
            if (_elem.Class) newElement.setAttribute("class", _elem.Class);
            if (_elem.Style) newElement.setAttribute("style", _elem.Style);

            (_elem.Attributes || []).filter(f => !!f).forEach(f => newElement.setAttribute(f.Name, f.Value));
            (_elem.Properties || []).filter(f => !!f).forEach(f => { newElement[f.Name] = f.Value; });

            if (parent != null) parent.appendChild(newElement);

            var elemName = _elem.Name || _elem.ID;
            if (elemName) retJSON[elemName] = newElement;
            
            if (_elem.Tooltip) GlobalUtilities.append_tooltip(newElement, _elem.Tooltip, { Align: _elem.TooltipAlign });
            if (_elem.InnerTitle || _elem.Placeholder)
                GlobalUtilities.set_inner_title(newElement, _elem.InnerTitle || _elem.Placeholder, { LatinNumbers: _elem.LatinNumbers });
            if (_elem.Childs) GlobalUtilities.create_nested_elements(_elem.Childs, newElement, retJSON);
        }

        return retJSON;
    },

    block: function (_elem, params) {
        params = params || {};

        if (typeof (_elem) != "object") _elem = document.getElementById(_elem);
        if (!_elem) return;

        try {
            var newParams = GlobalUtilities.extend({}, jQuery.blockUI.defaults, {
                title: '', css: { cursor: 'default' }, overlayCSS: { cursor: 'default', opacity: 0.6 }, message: ''
            });

            if (GlobalUtilities.get_type(params.Opacity) == "number") newParams.overlayCSS.opacity = params.Opacity;

            jQuery(_elem).block(newParams);
        }
        catch (e) { }
    },

    unblock: function (_elem) {
        if (typeof (_elem) != "object") _elem = document.getElementById(_elem);
        try { jQuery(_elem).unblock(); } catch (e) { }
    },

    set_onenter: function (input, onenter) {
        var _onkeydown = function (event) {
            event = event || window.event;
            if (event.keyCode == 13) onenter.call(input);
        }

        jQuery(input).keypress(_onkeydown);
    },

    set_onchange: function (input, callback, params) {
        var _do = (function () {
            var _timeout = null;

            return function (p) {
                if (_timeout) clearTimeout(_timeout);

                _timeout = setTimeout(function () {
                    _timeout = null;
                    callback();
                }, (p || {}).Timeout || 2000);
            }
        })();

        jQuery(input).on("keydown", function (e) {
            if ((e.which == 13) || (e.which == 17)) return; //13: enter, 17: ctrl
            _do({ Timeout: (params || {}).Timeout || 1000 });
        });
    },

    set_onchangeorenter: function (input, callback, params) {
        var _do = (function () {
            var _timeout = null;

            return function (p) {
                if (_timeout) clearTimeout(_timeout);

                if ((params || {}).OnKeyDown && (params.OnKeyDown() === true)) return;

                _timeout = setTimeout(function () {
                    _timeout = null;
                    callback({ Enter: p.Enter });
                }, (p || {}).Timeout || 2000);
            }
        })();

        jQuery(input).on("keydown", function (e) {
            if (e.which == 17) return; //13: enter, 17: ctrl
            _do({ Timeout: e.which == 13 ? 1 : (params || {}).Timeout || 1000, Enter: e.which == 13 });
        });
    },

    set_inner_title: function (input, title, options) {
        options = options || {};
        //title = title.replace(/\.\.\.+/ig, "");
        if ((input || {}).setAttribute) input.setAttribute("placeholder",
            (options.LatinNumbers ? title : GlobalUtilities.convert_numbers_to_persian(title)));
    },

    convert_numbers_to_persian: (function () {
        var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };

        var latin = {};
        for (var k in persian) latin[persian[k]] = k;

        var _do = function (text, reverse) {
            if (!text) return text;
            while (true) {
                var list = reverse ? text.match(/[۰۱۲۳۴۵۶۷۸۹]/) : text.match(/[0-9]/g);
                if (!(list || []).length) break;

                list.forEach(function (l) { text = text.replace(l, reverse ? latin[l] : persian[l]); });
            }
            return text;
        };

        var traverse = function (el, reverse) {
            if ((el || {}).nodeType == 3) el.data = _do(el.data, reverse);
            for (var i = 0; i < ((el || {}).childNodes || []).length; i++) traverse(el.childNodes[i], reverse);
        };

        return function (elem, reverse) {
            return elem; //this matter is handled by font

            if ((window.RV_Lang || "_").toLowerCase() != "fa") return elem;

            if (GlobalUtilities.get_type(elem) == "number") elem = String(elem);
            return !elem ? elem : (GlobalUtilities.get_type(elem) == "string" ? _do(elem, reverse) : traverse(elem, reverse));
        }
    })(),

    get_comma_separated_number: function (number) {
        var num = +number;
        if (GlobalUtilities.get_type(num) != "number") return number;
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    trim_the_rest_elements: function (element) {
        if (element) {
            GlobalUtilities.trim_the_rest_elements(element.nextSibling);
            jQuery(element).remove();
        }
    },

    append_read_more_button: function (element, maxLength, onMoreRequest) {
        var obj = (element || {}).firstChild;

        var computedLength = 0;

        while (obj) {
            var isATag = (obj.tagName || "_").toLowerCase() == "a";
            var isAllowedTag = ["br", "img"].some(function (x) { return x == (obj.tagName || "_").toLowerCase(); });
            var text = obj.firstChild ? obj.textContent || obj.innerText : obj.data || obj.outerHTML || obj;
            var length = isAllowedTag ? 0 : text.length;

            if ((length + computedLength) > maxLength) {
                if (!isATag) {
                    var newText = GlobalUtilities.convert_numbers_to_persian(text.substr(0, maxLength - computedLength));

                    if (obj.tagName) obj.innerHTML = newText;
                    else if (obj.data) obj.data = newText;
                }

                GlobalUtilities.trim_the_rest_elements(obj.nextSibling);

                GlobalUtilities.create_nested_elements([{
                    Type: "label", Class: "_rv-air-button-base _rv-air-button-black rv-border-radius-quarter",
                    Style: "font-size:0.7rem; padding:0 0.3rem; margin:0 0.3rem; cursor:pointer; color:blue; font-weight:bold;",
                    Properties: [{ Name: "onclick", Value: onMoreRequest }],
                    Childs: [{ Type: "text", TextValue: "... " + RVDic.More }]
                }], element);

                break;
            }
            else computedLength += length;

            obj = obj.nextSibling;
        }
    },

    append_markup_text: function (_div, text, params) {
        params = params || {};

        _div.classList.remove("clearfix");
        _div.classList.add("clearfix");

        //this code is necessary for Security Certificate
        if ((params.IsHTML !== true) && !!text && false)
            text = GlobalUtilities.secure_string(text);

        var richText = new RegExp("<.*?>", "g").test(text || " ");

        AdvancedTextArea.replace_markups(text, {
            IgnoreBreaks: richText, IgnoreURLs: false, // params.RichText,
            Done: function (txt, p) {
                if (!richText) {
                    var d = document.createElement("div");
                    d.innerHTML = txt;
                    var tt = d.innerText || d.textContent;
                    _div.style.direction = GlobalUtilities.textdirection(tt);
                }

                _div.innerHTML = txt;

                setTimeout(function () {
                    var elems = _div.getElementsByClassName("RV_EventFunc");
                    
                    for (var i = 0, lnt = elems.length; i < lnt; ++i) {
                        var evName = elems[i].getAttribute("RV_EventName");
                        var fnName = elems[i].getAttribute("RV_EventFuncName");
                        
                        if (evName && fnName && GlobalUtilities.get_type(window[fnName]) == "function")
                            elems[i][evName] = window[fnName];
                    }
                }, 10);

                if (window.RV_Lang == "fa") GlobalUtilities.convert_numbers_to_persian(_div);

                if (params.Done) params.Done(txt, p);

                if ((GlobalUtilities.get_type(params.ReadMore) == "number") && (params.ReadMore > 0)) {
                    GlobalUtilities.append_read_more_button(_div, params.ReadMore, function () {
                        GlobalUtilities.append_markup_text(_div, text, GlobalUtilities.extend(params, { ReadMore: 0 }));
                    });
                }
            }
        });
    },

    get_tags: function (text, callback) {
        AdvancedTextArea.get_tags(text, function (tags) { if (callback) callback(tags); });
    },

    link_click: function (e, url, params) {
        e.stopPropagation();

        if (e.ctrlKey || (params || {}).Open) window.open(url);
        else if ((params || {}).Confirmation === true) {
            GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToLeaveThePage, function (r) {
                if (r) window.location.href = url;
                else if ((params || {}).ForceOpen && (1 > 2)) window.open(url);
            });
        }
        else window.location.href = url;
    },

    goto_page: function (page, params) {
        params = params || {};

        var requestParams = "";

        var isFirst = true;
        for (var item in params) {
            requestParams += isFirst ? "?" : "&";
            isFirst = false;

            requestParams += item + "=" + params[item];
        }

        window.open(page + requestParams);
    },

    logged_in: function (data) {
        window.IsAuthenticated = true;
        RVAPI.LoggedIn();
        GlobalUtilities.set_auth_cookie((data || {}).AuthCookie);
    },

    set_auth_cookie: function (authCookie) {
        var name = Base64.decode((authCookie || {}).Name);
        var value = Base64.decode((authCookie || {}).Value);

        if (!name || !value || GlobalUtilities.get_cookie(name)) return;
        else GlobalUtilities.set_cookie(name, value, authCookie.Expires, Base64.decode(authCookie.Path), authCookie.Secure);
    },

    set_cookie: function (c_name, value, expires, path, secure) {
        if (!c_name || !value) return;

        if (GlobalUtilities.get_type(expires) == "number") { 
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expires); //expires is the number of days
            expires = exdate.toUTCString();
        }
        
        var c_value = escape(value) +
            (!expires ? "" : "; expires=" + expires) +
            (secure === true ? "; secure" : "") + 
            "; path=" + (path || "/");
        document.cookie = c_name + "=" + c_value;
    },

    get_cookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },

    get_local_storage: function (key, id) {
        if (!key || !window.localStorage || !localStorage[key]) return null;
        return id ? (GlobalUtilities.to_json(localStorage[key]) || {})[id] : localStorage[key];
    },

    set_local_storage: function (key, id, value) {
        if (!key || !window.localStorage) return null;

        if (!id) localStorage[key] = value;
        else {
            var obj = GlobalUtilities.to_json(GlobalUtilities.get_local_storage(key)) || {};
            obj[id] = value;
            localStorage[key] = JSON.stringify(obj);
        }
    },

    add_to_recent_items: function (id, jsonValue, idKey) {
        return;
        if (!id || !jsonValue) return;
        var arr = GlobalUtilities.get_local_storage("recents", id);
        if (GlobalUtilities.get_type(arr) != "array") arr = [];
        var maxCount = 20;
        arr = [jsonValue].concat(arr.filter(function (itm) { return !idKey || (itm[idKey] != jsonValue[idKey]); })
            .filter(function (itm, ind) { return ind < (maxCount - 1) }));
        GlobalUtilities.set_local_storage("recents", id, arr);
    },

    get_recent_items: function (id, count) {
        return [];
        var arr = GlobalUtilities.get_local_storage("recents", id);
        return (GlobalUtilities.get_type(arr) == "array" ? arr : []).filter(function (itm, ind) {
            return !isNaN(count) && (count > 0) ? ind < count : true;
        });
    },

    window: function (containerDiv, params, done) {
        GlobalUtilities.load_files([
            "WindowsManager/WindowsManager.js",
            { Root: "jQuery/", Childs: ["jquery-ui.css", "jquery-ui.js", "jquery.dialogextend.js"] }
        ], {
            LoadSequential: true,
            OnLoad: function () {
                var wm = new WindowsManager(containerDiv, params);
                if (done) done(wm);
            }
        });
    },

    uploader: function (containerDiv, params, done) {
        GlobalUtilities.load_files([
            { Root: "Dropzone/", Childs: ["dropzone.js", { Root: "css/", Ext: "css", Childs: ["basic", "dropzone"] }] },
            "AjaxUploader/AjaxUploader.js"
        ], {
            OnLoad: function () {
                var au = new AjaxUploader(containerDiv, params);
                if (done) done(au);
            }
        });
    },

    has_jalali_calendar: function () {
        return window.RV_Lang == "fa";
    },

    load_calendar: function (done) {
        var _lang = "calendar-" + (window.RV_Lang == "fa" ? "fa" : "en");

        GlobalUtilities.load_files([{
            Root: "JalaliJSCalendar-1.4/", Ext: "js",
            Childs: [{ Root: "skins/", Ext: "css", Childs: ["calendar-blue"] }, "jalali.js", "calendar", "calendar-setup", _lang]
        }], { LoadSequential: true, OnLoad: done });
    },

    append_calendar: function (element, params, done) {
        params = params || {};

        GlobalUtilities.load_calendar(function () {
            if (params.OnLoad) params.OnLoad();

            var _width = params.Width || 120;

            var emptyLabel = params.Label || RVDic.Select;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-quarter WarmBorder", Tooltip: RVDic.ClickToEdit,
                    Style: "display:inline-block; background-color:white; padding:" + (params.Padding || "0.3rem") + ";" +
                        "width:" + (params.Width || "10rem") + "; height:" + (params.Height || "1.8rem") + ";",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                            Style: "cursor:pointer;" +
                                "text-align:center; padding-" + RV_Float + ":1rem;" +
                                "background-image:url('" + GlobalUtilities.icon("Calendar.png") + "'); " +
                                "background-position:" + RV_Float + "; " +
                                "background-repeat:no-repeat; background-size:0.8rem 1rem;",
                            Childs: [{ Type: "text", TextValue: emptyLabel }]
                        }
                    ]
                },
                {
                    Type: "div",
                    Style: "display:" + (params.ClearButton ? "inline-block" : "none") + "; margin-" + RV_Float + ":0.5rem;",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-trash fa-lg rv-icon-button", Tooltip: RVDic.Clean,
                            Attributes: [{ Name: "aria-hidden", Value: true }],
                            Properties: [{ Name: "onclick", Value: function () { ret.Clear(); if (params.OnSelect) params.OnSelect(); }}]
                        }
                    ]
                },
                { Type: "input", Name: "hiddenArea", Attributes: [{ Name: "type", Value: "hidden" }, { Name: "name", Value: "date" }] }
            ], element);

            Calendar.setup({
                inputField: elems["hiddenArea"], displayArea: elems["viewArea"],
                ifFormat: "%Y-%m-%d", dateType: GlobalUtilities.has_jalali_calendar() ? 'jalali' : 'gregorian',
                showOthers: true, ifDateType: 'gregorian', weekNumbers: false, onUpdate: params.OnSelect
            });

            var ret = {
                ViewArea: elems["viewArea"], Hidden: elems["hiddenArea"],
                Clear: function () {
                    elems["hiddenArea"].value = "";
                    elems["viewArea"].innerHTML = emptyLabel;
                },
                Get: function () {
                    var label = elems["viewArea"].innerText || elems["viewArea"].textContent;
                    return { Value: elems["hiddenArea"].value || "", Label: label == emptyLabel ? "" : label }
                },
                Set: function (params) {
                    if ((params || {}).Value) elems["hiddenArea"].value = params.Value;
                    if ((params || {}).Label) elems["viewArea"].innerHTML =
                        GlobalUtilities.convert_numbers_to_persian(String(params.Label));
                }
            };

            done(ret);
        });
    },

    loading: function (element, params) {
        if (typeof (element) != "object") element = document.getElementById(element);
        if (!element) return;
        params = params || {};

        var isSaaS = (window.RVGlobal || {}).SAASBasedMultiTenancy;
        var iconName = isSaaS ? "loading.json" : "loading_progress_bar.gif";
        
        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Name: "container",
            Style: (GlobalUtilities.get_type(params.Style) == "string" ? params.Style : "margin:0.5rem auto;"),
            Childs: isSaaS ? [] : [{
                Type: "div", Style: "text-align:center;",
                Childs: [{
                    Type: "img", Style: (isSaaS ? "max-width:60px;" : ""),
                    Attributes: [{ Name: "src", Value: GlobalUtilities.icon(iconName) }]
                }]
            }]
        }], element);

        if (isSaaS) {
            elems["container"].innerHTML = '<lottie-player src="' + GlobalUtilities.icon(iconName) + '" background="transparent" ' +
                'speed="1" style="width: 5rem; height: 5rem; margin:0 auto;" loop autoplay></lottie-player>';
        }

        return { Destroy: function () { jQuery(elems["container"]).remove(); } };
    },

    load_files: function (files, params) {
        params = params || {};

        files = (GlobalUtilities.get_type(files) == "string" ? [files] : files || [])
            .map(f => (f || {}).File || f).filter(f => !!f);
        
        if (!files.length) return;

        var _prefixRegExp = function () {
            return new RegExp("^((" + GlobalUtilities.escape4regexp(GlobalUtilities.js().toLowerCase()) + ")|(" +
                GlobalUtilities.escape4regexp("../") + "))", "g");
        };


        //clarify files
        var _newFiles = [];

        var _tree2array = function (obj, prefix, ext) {
            var root = (prefix ? prefix : "") + (obj || {}).Root, ext = (obj || {}).Ext || ext;

            if (root && !_prefixRegExp().test(root.toLowerCase())) root = GlobalUtilities.js(root);
            if (ext && ext.length && (ext[0] == ".")) ext = ext.substr(1);

            ((obj || {}).Childs || []).forEach(ch => {
                if (ch.Root) _tree2array(ch, root, ext);
                else {
                    var _isUrl = GlobalUtilities.is_url(ch);
                    ch += (_isUrl ? "" : ((new RegExp("(\.css)|(\.js)$", "g")).test(ch.toLowerCase()) ? "" : (ext ? "." + ext : "")));
                    _newFiles.push((_isUrl ? "" : root) + ch);
                }
            });
        };
        
        files.forEach(f => GlobalUtilities.get_type(f) == "json" ? _tree2array(f) : _newFiles.push(f));
        
        files = _newFiles.map(f => {
            var _fname = String(f).toLowerCase();
            
            if (!GlobalUtilities.is_url(_fname) && !_prefixRegExp().test(_fname))
                return GlobalUtilities.is_js(_fname) ? GlobalUtilities.js(f) : GlobalUtilities.css(f);
            else return f;
        });
        //end of clarify files
        
        if (params.LoadSequential && (files.length > 1)) {
            return GlobalUtilities.load_files([files[0]], GlobalUtilities.extend({}, params || {}, {
                LoadSequential: false,
                OnLoad: function () { GlobalUtilities.load_files(files.filter((f, ind) => ind > 0), params); }
            }));
        }
        
        var onLoadCalled = false;

        var check_file = function (file, loaded) {
            if ((DynamicFileUtilities.files_exist(files) === true)) {
                if (params.OnLoad && !onLoadCalled) {
                    onLoadCalled = true;
                    params.Timeout ? setTimeout(() => params.OnLoad(), params.Timeout) : params.OnLoad();
                }

                return true;
            }

            if (file && !loaded) console.error("Loading file '" + file + "' failed!");
            return false;
        };
        
        if (check_file()) return;
        
        files.map(f => (f || {}).File || f).forEach(f => {
            if (GlobalUtilities.is_js(f)) DynamicFileUtilities.load_js(f, (r) => check_file(f, r));
            else DynamicFileUtilities.load_css(f, (r) => check_file(f, r));
        });
    }
};

//////////////////////////////////////////////////
//////////--> end of GlobalUtilities <--//////////
//////////////////////////////////////////////////




////////////////////////////////////////////////
//////////--> DynamicFileUtilities <--//////////
////////////////////////////////////////////////

if (!window.DynamicFileUtilities) window.DynamicFileUtilities = {
    AddedFiles: {},

    _create_js_file_object: function (fileName, data, callback) {
        callback = callback || function () { };

        var scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");

        if (data) scriptTag.innerHTML = data;
        else {
            scriptTag.onload = scriptTag.onreadystatechange = function () { callback(true); };
            scriptTag.onerror = function () { callback(false); };
            scriptTag.setAttribute("src", GlobalUtilities.add_timestamp(fileName));
        }

        return scriptTag;
    },

    _create_css_file_object: function (fileName, data) {
        var linkTag = document.createElement("link");
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("type", "text/css");
        linkTag.setAttribute("href", fileName + "?timeStamp=" + new Date().getTime());

        return linkTag;
    },

    load_js: function (fileName, callback) {
        callback = callback || function () { };

        fileName = String(fileName).toLowerCase();

        if (DynamicFileUtilities.AddedFiles[fileName]) {
            var fl = DynamicFileUtilities.AddedFiles[fileName];
            if (fl.Exists) return callback(true);

            var _interval = setInterval(() => {
                if (!fl.Exists && !fl.Error) return;
                clearInterval(_interval);
                callback(fl.Exists);
            }, 50);

            return;
        }

        DynamicFileUtilities.AddedFiles[fileName] = { Exists: false, Error: false };

        document.getElementsByTagName("head")[0]
            .appendChild(DynamicFileUtilities._create_js_file_object(fileName, null, function (loaded) {
                if (loaded) DynamicFileUtilities.AddedFiles[fileName].Exists = true;
                else DynamicFileUtilities.AddedFiles[fileName].Error = true;

                callback(loaded);
            }));
    },

    load_css: function (fileName, callback) {
        callback = callback || function () { };

        fileName = String(fileName).toLowerCase();
        if (DynamicFileUtilities.AddedFiles[fileName]) return callback(true);
        DynamicFileUtilities.AddedFiles[fileName] = { Exists: false };

        document.getElementsByTagName("head")[0].appendChild(DynamicFileUtilities._create_css_file_object(fileName));

        DynamicFileUtilities.AddedFiles[fileName] = { Exists: true };
        callback(true);
    },

    remove_css: function (fileName) {
        var linkTags = document.getElementsByTagName("link");
        for (var i = 0; i < linkTags.length; ++i)
            if (linkTags[i].getAttribute("href") == fileName) linkTags[i].parentNode.removeChild(linkTags[i]);
    },

    replace_css: function (oldFileName, newFileName) {
        oldFileName = oldFileName.toLowerCase();
        var linkTags = document.getElementsByTagName("link");
        for (var i = 0; i < linkTags.length; ++i) {
            var href = String(linkTags[i].getAttribute("href")).toLowerCase();
            if (href.indexOf("?") >= 0) href = href.substr(0, href.indexOf("?"));
            if (href.indexOf(oldFileName) >= 0 || oldFileName.indexOf(href) >= 0)
                linkTags[i].parentNode.replaceChild(DynamicFileUtilities._create_css_file_object(newFileName), linkTags[i]);
        }
    },

    _init_added_items: (function () {
        var inited = false;

        return function () {
            if (inited) return;
            inited = true;

            var _scripts = document.getElementsByTagName("script");
            for (var i = 0; i < _scripts.length; ++i) {
                var _attr = _scripts.item(i).getAttribute("src");
                if (_attr) _attr = String(_attr).toLowerCase();
                if (_attr && !DynamicFileUtilities.AddedFiles[_attr]) DynamicFileUtilities.AddedFiles[_attr] = { Exists: true };
            }

            var _links = document.getElementsByTagName("link");
            for (var i = 0; i < _links.length; ++i) {
                var _attr = _links.item(i).getAttribute("href");
                if (_attr) _attr = String(_attr).toLowerCase();
                if (_attr && !DynamicFileUtilities.AddedFiles[_attr]) DynamicFileUtilities.AddedFiles[_attr] = { Exists: true };
            }
        }
    })(),

    files_exist: function (files) {
        DynamicFileUtilities._init_added_items();

        if (GlobalUtilities.get_type(files) != "array") files = [files];

        for (var i = 0, lnt = files.length; i < lnt; ++i) {
            var fileName = String(files[i].File || files[i] || "").toLowerCase();

            if (!DynamicFileUtilities.AddedFiles[fileName]) return false;
            else if (DynamicFileUtilities.AddedFiles[fileName].Exists) continue;
            else if (GlobalUtilities.get_type(DynamicFileUtilities.AddedFiles[fileName].Exists) == "boolean" &&
                !DynamicFileUtilities.AddedFiles[fileName].Exists) return false;
        }

        return true;
    }
};

///////////////////////////////////////////////////////
//////////--> end of DynamicFileUtilities <--//////////
///////////////////////////////////////////////////////