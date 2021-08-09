var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    //Ramin's -- Only for UTF16 case
    _get_utf16_unicode_char: (function () {
        var get_hex = function (num) { var retVal = Number(num).toString(16); return retVal.length == 2 ? retVal : String(0) + retVal; }
        return function (charCode1, charCode2) { return String.fromCharCode(parseInt(get_hex(charCode2) + get_hex(charCode1), 16)) }
    })(),
    //end of Ramin's

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = UTF8.encode(input || "");

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
			    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input, params) {
        params = params || {};

        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input ? input : "";
        if (input.length < 2000 && !GlobalUtilities.is_base64(input)) return input;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        //Ramin's  -- Only for UTF16 case
        var utf16CharCodeArray = [];
        //end of Ramin's

        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            //Ramin's -- Only for UTF16 case
            if (params.UTF === 16) utf16CharCodeArray.push(chr1, chr2, chr3);
            //end of Ramin's
        }

        //Ramin's -- Only for UTF16 case
        if (params.UTF === 16) {
            output = "";
            for (var i = 0, lnt = utf16CharCodeArray.length; i < lnt; i += 2)
                output += Base64._get_utf16_unicode_char(utf16CharCodeArray[i], utf16CharCodeArray[i + 1]);
            return parseInt(output.charCodeAt(output.length - 1), 16) == 91136 ? output.substr(0, output.length - 1) : output; //91136 is an unknown character!!!!
        }
        //end of Ramin's

        return UTF8.decode(output);
    }
}

var UTF8 = {
    //public method for UTF-8 encoding
    encode: function (string) {
        if (GlobalUtilities.get_type(string) != "string") return string;

        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    //public method for UTF-8 decoding
    decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
};