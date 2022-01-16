if (!window.PDFAPI) window.PDFAPI = {
    ResponseURL: "/api/pdf",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    Convert2Image: function (params) {
        params = params || {};
        var url = PDFAPI.ResponseURL + "/Convert2Image?timeStamp=" + new Date().getTime();
        var queryString = (params.FileID ? "&FileID=" + params.FileID : "") +
            (params.Password ? "&PS=" + params.Password : "") +
            (params.Category ? "&Category=" + params.Category : "") +
            (params.Repair ? "&Repair=" + params.Repair : "");
        return PDFAPI._send(url, params, queryString);
    },

    GetPagesCount: function (params) {
        params = params || {};
        var url = PDFAPI.ResponseURL + "/GetPagesCount?timeStamp=" + new Date().getTime();
        var queryString = (params.FileID ? "&FileID=" + params.FileID : "") +
            (params.Password ? "&PS=" + params.Password : "") +
            (params.Category ? "&Category=" + params.Category : "");
        return PDFAPI._send(url, params, queryString);
    },

    GetPageURL: function (params) {
        params = params || {};
        return PDFAPI.ResponseURL + "/GetPage?timeStamp=" + new Date().getTime() +
            "&A=b" + (params.FileID ? "&FileID=" + params.FileID : "") +
            (params.Page ? "&Page=" + params.Page : "") +
            (params.Category ? "&Category=" + params.Category : "");
    },

    GetThumbnail: function (params) {
        params = params || {};

        //to be removed
        var pages = [];
        for (var i = 0, lnt = (params.Pages || []).length; i < lnt; ++i) pages.push(params.Pages[i]);
        if (params.Page) pages.push(params.Page);

        var json = "";
        for (var i = 0, lnt = pages.length; i < lnt; ++i)
            json += (json == "" ? "" : ",") + "\"" + pages[i] + "\":{\"URL\":\"../../PDFImages/" + pages[i] + ".jpg\"}";

        params.ResponseHandler("{" + json + "}");
        //end of to be removed
    }
};