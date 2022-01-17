if (!window.SearchAPI) window.SearchAPI = {
    ResponseURL: "/api/search",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    Search: function (params) {
        params = params || {};

        var parameters = GlobalUtilities.extend({}, {
            SearchText: params.SearchText,
            ItemTypes: params.ItemTypes,
            LowerBoundary: params.LowerBoundary,
            Title: params.Title,
            Description: params.Description,
            Content: params.Content,
            Tags: params.Tags,
            FileContent: params.FileContent,
            ForceHasContent: params.ForceHasContent,
            TypeIDs: params.TypeIDs,
            Types: params.Types,
            ShowExactItems: params.ShowExactItems,
            SuggestNodeTypes: params.SuggestNodeTypes,
            Count: params.Count,
            Excel: params.Excel,
            FormDetails: params.FormDetails,
            ColumnNames: Base64.encode(JSON.stringify({
                Name: Base64.encode(RVDic.Title),
                AdditionalID: Base64.encode(RVDic.AdditionalID),
                NodeType: Base64.encode(RVDic.NodeType),
                CreationDate: Base64.encode(RVDic.CreationDate),
                Creator: Base64.encode(RVDic.Creator)
            }))
        });

        var url = SearchAPI.ResponseURL + "/Search?timeStamp=" + new Date().getTime();
        var queryString = "";

        var isFirst = true;
        for (var p in parameters) {
            queryString += (isFirst ? "" : "&") + p + "=" + (parameters[p] ? parameters[p] : "");
            isFirst = false;
        }

        if (params.Excel === true)
            GlobalUtilities.submit_form({ URL: url, Method: "post", RequestParams: parameters });
        else
            return SearchAPI._send(url, params, queryString);
    }
};