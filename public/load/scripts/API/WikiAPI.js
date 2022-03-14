if (!window.WikiAPI) window.WikiAPI = {
    ResponseURL: "/api/wiki",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    AddTitle: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/AddTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Title ? "&Title=" + params.Title : "") + (params.SequenceNumber ? "&SequenceNumber=" + params.SequenceNumber : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    ModifyTitle: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/ModifyTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.TitleID ? "&TitleID=" + params.TitleID : "") +
            (params.Title ? "&Title=" + params.Title : "") + (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    RemoveTitle: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/RemoveTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.TitleID ? "&TitleID=" + params.TitleID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    RecycleTitle: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/RecycleTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.TitleID ? "&TitleID=" + params.TitleID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    SetTitlesOrder: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/SetTitlesOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.TitleIDs ? "&TitleIDs=" + params.TitleIDs : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    AddParagraph: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/AddParagraph?timeStamp=" + new Date().getTime();
        var queryString = (params.TitleID ? "&TitleID=" + params.TitleID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Title ? "&Title=" + params.Title : "") + (params.BodyText ? "&BodyText=" + params.BodyText : "") +
            (params.AttachedFiles ? "&AttachedFiles=" + params.AttachedFiles : "") +
            (params.SequenceNumber ? "&SequenceNumber=" + params.SequenceNumber : "") +
            (params.IsRichText ? "&IsRichText=" + params.IsRichText : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    ModifyParagraph: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/ModifyParagraph?timeStamp=" + new Date().getTime();
        var queryString = (params.ParagraphID ? "&ParagraphID=" + params.ParagraphID : "") +
            (params.ChangeID ? "&ChangeID=" + params.ChangeID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.BodyText ? "&BodyText=" + params.BodyText : "") +
            (params.AttachedFiles ? "&AttachedFiles=" + params.AttachedFiles : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    RemoveParagraph: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/RemoveParagraph?timeStamp=" + new Date().getTime();
        var queryString = (params.ParagraphID ? "&ParagraphID=" + params.ParagraphID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    RecycleParagraph: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/RecycleParagraph?timeStamp=" + new Date().getTime();
        var queryString = (params.ParagraphID ? "&ParagraphID=" + params.ParagraphID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    SetParagraphsOrder: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/SetParagraphsOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.ParagraphIDs ? "&ParagraphIDs=" + params.ParagraphIDs : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    AcceptChange: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/AcceptChange?timeStamp=" + new Date().getTime();
        var queryString = (params.ChangeID ? "&ChangeID=" + params.ChangeID : "") +
            (params.Apply ? "&Apply=" + params.Apply : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "");
        return WikiAPI._send(url, params, queryString);
    },

    RejectChange: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/RejectChange?timeStamp=" + new Date().getTime();
        var queryString = (params.ChangeID ? "&ChangeID=" + params.ChangeID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "");
        return WikiAPI._send(url, params, queryString);
    },

    RemoveChange: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/RemoveChange?timeStamp=" + new Date().getTime();
        var queryString = (params.ChangeID ? "&ChangeID=" + params.ChangeID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "");
        return WikiAPI._send(url, params, queryString);
    },

    GetWiki: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/GetWiki?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.Removed ? "&Removed=" + params.Removed : "");
        return WikiAPI._send(url, params, queryString);
    },

    GetParagraphRelatedUsers: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/GetParagraphRelatedUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.ParagraphID ? "&ParagraphID=" + params.ParagraphID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "");
        return WikiAPI._send(url, params, queryString);
    },

    GetParagraphs: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/GetParagraphs?timeStamp=" + new Date().getTime();
        var queryString = (params.TitleID ? "&TitleID=" + params.TitleID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.Removed ? "&Removed=" + params.Removed : "");
        return WikiAPI._send(url, params, queryString);
    },

    GetParagraphChanges: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/GetParagraphChanges?timeStamp=" + new Date().getTime();
        var queryString = (params.ParagraphID ? "&ParagraphID=" + params.ParagraphID : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return WikiAPI._send(url, params, queryString);
    },

    ExportAsPDF: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/ExportAsPDF?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.CoverID ? "&CoverID=" + params.CoverID : "") +
            (params.Password ? "&PS=" + params.Password : "");
        return WikiAPI._send(url, params, queryString);
    },

    GetWikiBlocks: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/GetWikiBlocks?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return WikiAPI._send(url, params, queryString);
    },

    SaveBlocks: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/SaveBlocks?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Content ? "&Content=" + params.Content : "") +
            (params.InsertAfterKey ? "&InsertAfterKey=" + params.InsertAfterKey : "") +
            (params.RemoveBlocks ? "&RemoveBlocks=" + params.RemoveBlocks : "");
        return WikiAPI._send(url, params, queryString);
    },

    RemoveBlocks: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/RemoveBlocks?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Content ? "&Content=" + params.Content : "");
        return WikiAPI._send(url, params, queryString);
    },

    SortBlocks: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/SortBlocks?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Content ? "&Content=" + params.Content : "");
        return WikiAPI._send(url, params, queryString);
    },

    SaveHTMLContent: function (params) {
        params = params || {};

        var url = WikiAPI.ResponseURL + "/SaveHTMLContent?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.HTML ? "&HTML=" + params.HTML : "") +
            (params.CSS ? "&CSS=" + params.CSS : "");
        return WikiAPI._send(url, params, queryString);
    }
};