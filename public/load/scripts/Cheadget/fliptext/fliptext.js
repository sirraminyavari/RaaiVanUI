(function () {
    window.RVCheadget = window.RVCheadget || {};
    if (RVCheadget.fliptext) return;

    var fliptext = function () {
        var that = this;

        var elems = GlobalUtilities.create_nested_elements([
            { Type: "div", Name: "_div",
                Style: "position: fixed; z-index: " + GlobalUtilities.zindex.dialog() + "; padding: 0px; margin: 0px; font-family: tahoma; " +
                    "min-width: 500px; max-width:500px; width:500px; top: 0px; left: 395.5px;" +
                    "border: 5px solid rgb(153, 153, 153); border-radius: 5px; background-color:white;",
                Childs: [
                    { Type: "div", Class: "NormalPadding",
                        Childs: [
                            { Type: "textarea", Class: "TextInput", Style: "width:488px; height:50px; resize: none;", Name: "_edit",
                                Properties: [
                                    { Name: "onkeyup",
                                        Value: function () {
                                            elems["viewArea"].value = that._flip(this.value);
                                            this.style.direction = elems["viewArea"].style.direction =
                                                (GlobalUtilities.textdirection(this.value) || '');
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    { Type: "div", Class: "NormalPadding",
                        Childs: [{ Type: "textarea", Class: "TextInput", Name: "viewArea", Style: "width:488px; height:50px; resize: none;"}]
                    }
                ]
            }
        ], document.body);

        this.Interface = {
            EditInput: elems["_edit"],
            ViewInput: elems["viewArea"]
        }

        this.ContainerDiv = elems["_div"];

        that.show();
    }

    fliptext.prototype = {
        show: function () {
            var that = this;

            that.ContainerDiv.style.top = (($(window).height() / 2) - ($(that.ContainerDiv).outerHeight() / 2)) + "px";
            that.ContainerDiv.style.left = (($(window).width() / 2) - ($(that.ContainerDiv).outerWidth() / 2)) + "px";

            setTimeout(function () { that.Interface.EditInput.value = that.Interface.ViewInput.value = ""; }, 100);

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

    RVCheadget.fliptext = new fliptext();
})();