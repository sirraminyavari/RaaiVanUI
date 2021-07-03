(function () {
    window.RVCheadget = window.RVCheadget || {};
    if (RVCheadget.tag) return;

    var tag = function () {
        var that = this;

        var labelInnerTitle = RVDic.Title + "...";

        var elems = GlobalUtilities.create_nested_elements([
            { Type: "div", Name: "_div",
                Style: "position: fixed; z-index: " + GlobalUtilities.zindex.dialog() + "; padding: 0px; margin: 0px; font-family: tahoma; " +
                    "min-width: 500px; max-width:500px; width:500px; top: 0px; left: 395.5px;" +
                    "border: 5px solid rgb(153, 153, 153); border-radius: 5px; background-color:white;",
                Childs: [
                    { Type: "div", Class: "NormalPadding", Name: "tagInput" },
                    { Type: "div", Class: "NormalPadding",
                        Childs: [
                            { Type: "input", Class: "TextInput", Style: "width:488px;", InnerTitle: labelInnerTitle,
                                Attributes: [{ Name: "type", Value: "text"}],
                                Properties: [
                                    { Name: "onkeyup",
                                        Value: function () {
                                            this.style.direction = (GlobalUtilities.textdirection(this.value) || '');
                                            var _v = GlobalUtilities.trim(this.value);
                                            if (_v == labelInnerTitle) _v = "";
                                            _set(_v);
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    { Type: "div", Class: "NormalPadding TextInput", Name: "viewArea",
                        Style: "width:482px; direction:ltr; margin:4px;"
                    }
                ]
            }
        ], document.body);

        var selectedItem = { ID: null, Value: null, Type: null };

        var _set = function (_val) {
            if (!selectedItem.ID) return;

            elems["viewArea"].innerHTML = AdvancedTextArea.get_markup(GlobalUtilities.extend({}, selectedItem, {
                Value: Base64.encode(_val || selectedItem.Value)
            }));
        }

        var as = GlobalUtilities.append_autosuggest(elems["tagInput"], {
            InputStyle: "width:488px; margin:0px;", InnerTitle: RVDic.TagSelect + "...",
            AjaxDataSource: RVAPI.SuggestTags(),
            ResponseParser: function (responseText) {
                var items = JSON.parse(responseText).Items || [];
                var arr = [];
                for (var i = 0, lnt = items.length; i < lnt; ++i)
                    arr.push([Base64.decode(items[i].Name || ""), (items[i].ItemID || "") + "_" + (items[i].Type || "")]);
                return arr;
            },
            OnSelect: function () {
                var index = as.selectedIndex;
                var _idtype = as.values[index].split("_");

                selectedItem.ID = _idtype[0];
                selectedItem.Value = as.keywords[index];
                selectedItem.Type = _idtype[1];

                _set();
            }
        });

        this.Interface = {
            EditInput: elems["_edit"],
            ViewInput: elems["viewArea"]
        }

        this.ContainerDiv = elems["_div"];

        that.show();
    }

    tag.prototype = {
        show: function () {
            var that = this;

            that.ContainerDiv.style.top = (($(window).height() / 2) - ($(that.ContainerDiv).outerHeight() / 2)) + "px";
            that.ContainerDiv.style.left = (($(window).width() / 2) - ($(that.ContainerDiv).outerWidth() / 2)) + "px";

            that.ContainerDiv.style.display = "block";
            that.ContainerDiv.zIndex = GlobalUtilities.zindex.dialog();

            GlobalUtilities.add_to_escape_queue(that.ContainerDiv, function () { that.ContainerDiv.style.display = "none"; });
        },

        _flip: function (aString) {
            aString = String(aString);
            var last = aString.length - 1;
            var result = "";
            for (var i = last; i >= 0; --i)
                result += this._flipChar(aString.charAt(i));
            return result;
        },

        _flipChar: (function () {
            var dic = { '3': '\u0190', '4': '\u152d', '6': '9', '7': '\u2c62', '9': '6',
                'A': '\u2200', 'C': '\u2183', 'D': '\u25d6', 'E': '\u018e', 'F': '\u2132', 'G': '\u2141', 'H': 'H', 'I': 'I',
                'J': '\u017f', 'K': '\u22ca', 'L': '\u2142', 'M': '\u0057', 'N': '\u1d0e', 'O': 'O', 'P': '\u0500', 'Q': '\u038c',
                'R': '\u1d1a', 'T': '\u22a5', 'U': '\u2229', 'V': '\u1d27', 'W': 'M', 'X': 'X', 'Y': '\u2144', 'Z': 'Z',
                'a': '\u0250', 'b': 'q', 'c': '\u0254', 'd': 'p', 'e': '\u01DD', 'f': '\u025F', 'g': 'b', 'h': '\u0265',
                'i': '\u0131', 'j': '\u017f', 'k': '\u029E', 'l': '\u0283' /* '\u05DF' */, 'm': '\u026F', 'n': 'u', 'o': 'o', 'p': 'd',
                'q': 'b', 'r': '\u0279', 's': 's', 't': '\u0287', 'u': 'n', 'v': '\u028C', 'w': '\u028D', 'x': 'x', 'y': '\u028E', 'z': 'z',
                '[': ']', ']': '[', '(': ')', ')': '(', '{': '}', '}': '{', '?': '\u00BF', '\u00BF': '?', '!': '\u00A1', "\'": ',',
                ',': "\'", '\"': '\u201e', '.': '\u02D9', '_': '\u203E', ';': '\u061B', '<': '>', '&': '\u214b'
            }

            for (var i in dic) dic[dic[i]] = dic[dic[i]] || i;

            return function (char) {
                return dic[char] || dic[char.toLowerCase()] || char;
            }
        })()
    }

    RVCheadget.tag = new tag();
})();