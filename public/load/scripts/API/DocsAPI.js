if (!window.DocsAPI) window.DocsAPI = {
    DocsHandler: "/api/docs",
    UploadHandler: "/upload",
    DownloadHandler: "/download",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    GetUploadLink: function (params) {
        params = params || {};
        return DocsAPI.UploadHandler + "/UploadFile?timeStamp=" + new Date().getTime() +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") + "&aa=2"; //aa=2 fixes the problem!!!!!! because clicking on the link, a string appends to it and cause OwnerType not to be valid
    },

    GetDownloadLink: function (params) {
        params = params || {};
        return DocsAPI.DownloadHandler + "/" + (params.FileID || "_") +
            (params.Extension ? "&Extension=" + params.Extension : "") +
            (params.Category ? "&Category=" + params.Category : "") +
            (params.CoverID ? "&CoverID=" + params.CoverID : "") +
            (params.Meta ? "&Meta=" + params.Meta : "") +
            (params.Password ? "&PS=" + params.Password : "") +
            (params.Download === false ? "&dl=false" : "");
    },

    UploadPicture: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/UploadPicture?timeStamp=" + new Date().getTime();
        var queryString = (params.PictureID ? "&PictureID=" + params.PictureID : "") +
            (params.Type ? "&Type=" + params.Type : "");
        return DocsAPI._send(url, params, queryString);
    },

    UploadProfileImage: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/UploadProfileImage?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "");
        return DocsAPI._send(url, params, queryString);
    },

    CropProfileImage: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/CropProfileImage?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (GlobalUtilities.get_type(params.X) == "number" ? "&X=" + params.X : "") +
            (GlobalUtilities.get_type(params.Y) == "number" ? "&Y=" + params.Y : "") +
            (GlobalUtilities.get_type(params.Width) == "number" ? "&Width=" + params.Width : "") +
            (GlobalUtilities.get_type(params.Height) == "number" ? "&Height=" + params.Height : "");
        return DocsAPI._send(url, params, queryString);
    },

    UploadIcon: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/UploadIcon?timeStamp=" + new Date().getTime();
        var queryString = (params.IconID ? "&IconID=" + params.IconID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Type ? "&Type=" + params.Type : "");
        return DocsAPI._send(url, params, queryString);
    },

    DeleteIcon: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/DeleteIcon?timeStamp=" + new Date().getTime();
        var queryString = (params.IconID ? "&IconID=" + params.IconID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Type ? "&Type=" + params.Type : "");
        return DocsAPI._send(url, params, queryString);
    },

    CropIcon: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/CropIcon?timeStamp=" + new Date().getTime();
        var queryString = (params.IconID ? "&IconID=" + params.IconID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Type ? "&Type=" + params.Type : "") +
            (GlobalUtilities.get_type(params.X) == "number" ? "&X=" + params.X : "") +
            (GlobalUtilities.get_type(params.Y) == "number" ? "&Y=" + params.Y : "") +
            (GlobalUtilities.get_type(+params.Width) == "number" ? "&Width=" + params.Width : "") +
            (GlobalUtilities.get_type(+params.Height) == "number" ? "&Height=" + params.Height : "");
        return DocsAPI._send(url, params, queryString);
    },

    UploadAndCropIcon: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/UploadAndCropIcon?timeStamp=" + new Date().getTime();
        var queryString = (params.IconID ? "&IconID=" + params.IconID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Type ? "&Type=" + params.Type : "") +
            (GlobalUtilities.get_type(params.X) == "number" ? "&X=" + params.X : "") +
            (GlobalUtilities.get_type(params.Y) == "number" ? "&Y=" + params.Y : "") +
            (GlobalUtilities.get_type(+params.Width) == "number" ? "&Width=" + params.Width : "") +
            (GlobalUtilities.get_type(+params.Height) == "number" ? "&Height=" + params.Height : "");
        return DocsAPI._send(url, params, queryString);
    },

    CreateTree: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/CreateTree?timeStamp=" + new Date().getTime();
        var queryString = (params.Title ? "&Title=" + params.Title : "") +
            (params.TemplateTreeID ? "&TemplateTreeID=" + params.TemplateTreeID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return DocsAPI._send(url, params, queryString);
    },

    RenameTree: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/RenameTree?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeID ? "&TreeID=" + params.TreeID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return DocsAPI._send(url, params, queryString);
    },

    RemoveTree: function (params) {
        params = params || {};

        if (!params.TreeIDs) params.TreeIDs = params.TreeID;

        var url = DocsAPI.DocsHandler + "/RemoveTree?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeIDs ? "&TreeIDs=" + params.TreeIDs : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return DocsAPI._send(url, params, queryString);
    },

    RecycleTree: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/RecycleTree?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeID ? "&TreeID=" + params.TreeID : "");
        return DocsAPI._send(url, params, queryString);
    },

    GetTrees: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetTrees?timeStamp=" + new Date().getTime();
        var queryString = (params.Archive ? "&Archive=" + params.Archive : "");
        return DocsAPI._send(url, params, queryString);
    },

    CreateTreeNode: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/CreateTreeNode?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeID ? "&TreeID=" + params.TreeID : "") +
            (params.ParentID ? "&ParentID=" + params.ParentID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return DocsAPI._send(url, params, queryString);
    },

    RenameTreeNode: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/RenameTreeNode?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeNodeID ? "&TreeNodeID=" + params.TreeNodeID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return DocsAPI._send(url, params, queryString);
    },

    RemoveTreeNode: function (params) {
        params = params || {};

        if (!params.NodeIDs) params.NodeIDs = params.NodeID;

        var url = DocsAPI.DocsHandler + "/RemoveTreeNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.TreeOwnerID ? "&TreeOwnerID=" + params.TreeOwnerID : "") +
            (params.RemoveHierarchy ? "&RemoveHierarchy=" + params.RemoveHierarchy : "");
        return DocsAPI._send(url, params, queryString);
    },

    CopyTreeNodes: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/CopyTreeNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.DestinationID ? "&DestinationID=" + params.DestinationID : "") +
            (params.CopiedIDs ? "&CopiedIDs=" + params.CopiedIDs : "");
        return DocsAPI._send(url, params, queryString);
    },

    MoveTreeNodes: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/MoveTreeNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.DestinationID ? "&DestinationID=" + params.DestinationID : "") +
            (params.MovedIDs ? "&MovedIDs=" + params.MovedIDs : "");
        return DocsAPI._send(url, params, queryString);
    },

    GetTreeNodes: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetTreeNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeID ? "&TreeID=" + params.TreeID : "");
        return DocsAPI._send(url, params, queryString);
    },

    GetChildNodes: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetChildNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeID ? "&TreeID=" + params.TreeID : "") +
            (params.TreeNodeID ? "&TreeNodeID=" + params.TreeNodeID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "");
        return DocsAPI._send(url, params, queryString);
    },

    GetParentNodes: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetParentNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeNodeID ? "&TreeNodeID=" + params.TreeNodeID : "");
        return DocsAPI._send(url, params, queryString);
    },

    RenameFile: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/RenameFile?timeStamp=" + new Date().getTime();
        var queryString = (params.FileID ? "&FileID=" + params.FileID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return DocsAPI._send(url, params, queryString);
    },

    RemoveFile: function (params) {
        params = params || {};

        var url = DocsAPI.UploadHandler + "/RemoveFile?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.FileID ? "&FileID=" + params.FileID : "");
        return DocsAPI._send(url, params, queryString);
    },

    GetTreeNodeDocs: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetTreeNodeDocs?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeNodeID ? "&TreeNodeID=" + params.TreeNodeID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "");
        return DocsAPI._send(url, params, queryString);
    },

    RenameDoc: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/RenameDoc?timeStamp=" + new Date().getTime();
        var queryString = (params.DocID ? "&DocID=" + params.DocID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return DocsAPI._send(url, params, queryString);
    },

    MoveDocs: function (params) {
        params = params || {};

        var docIds = params.DocIDs || [];
        var strDocIds = "";
        for (var i = 0, lnt = docIds.length; i < lnt; ++i)
            strDocIds += (i == 0 ? "" : "|") + docIds[i];

        var url = DocsAPI.DocsHandler + "/MoveDocs?timeStamp=" + new Date().getTime();
        var queryString = "DocIDs=" + strDocIds + (params.TreeNodeID ? "&TreeNodeID=" + params.TreeNodeID : "");
        return DocsAPI._send(url, params, queryString);
    },

    RemoveDocs: function (params) {
        params = params || {};

        var docIds = params.DocIDs || [];
        var strDocIds = "";
        for (var i = 0, lnt = docIds.length; i < lnt; ++i)
            strDocIds += (i == 0 ? "" : "|") + docIds[i];

        var url = DocsAPI.DocsHandler + "/RemoveDocs?timeStamp=" + new Date().getTime();
        var queryString = "DocIDs=" + strDocIds;
        return DocsAPI._send(url, params, queryString);
    },

    Like: function (params) {
        params = params || {};

        var docIds = params.DocIDs || [];
        if (params.DocID) docIds.push(params.DocID);
        var strDocIds = "";
        for (var i = 0, lnt = docIds.length; i < lnt; ++i)
            strDocIds += (i == 0 ? "" : "|") + docIds[i];

        var url = DocsAPI.DocsHandler + "/Like?timeStamp=" + new Date().getTime();
        var queryString = "DocIDs=" + strDocIds;
        return DocsAPI._send(url, params, queryString);
    },

    Unlike: function (params) {
        params = params || {};

        var docIds = params.DocIDs || [];
        if (params.DocID) docIds.push(params.DocID);
        var strDocIds = "";
        for (var i = 0, lnt = docIds.length; i < lnt; ++i)
            strDocIds += (i == 0 ? "" : "|") + docIds[i];

        var url = DocsAPI.DocsHandler + "/Unlike?timeStamp=" + new Date().getTime();
        var queryString = "DocIDs=" + strDocIds;
        return DocsAPI._send(url, params, queryString);
    },

    GetPreviousVersions: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetPreviousVersions?timeStamp=" + new Date().getTime();
        var queryString = (params.DocID ? "&DocID=" + params.DocID : "");
        return DocsAPI._send(url, params, queryString);
    },

    SetFileConstraints: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/SetFileConstraints?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.FileTypes ? "&FileTypes=" + params.FileTypes : "") +
            (params.SizeLimit ? "&SizeLimit=" + params.SizeLimit : "") +
            (params.CountLimit ? "&CountLimit=" + params.CountLimit : "");
        return DocsAPI._send(url, params, queryString);
    },

    Icon: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/Icon?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.IconID ? "&IconID=" + params.IconID : "") +
            (params.Type ? "&Type=" + params.Type : "") +
            (params.HighQuality ? "&HighQuality=" + params.HighQuality : "");
        return DocsAPI._send(url, params, queryString);
    },

    SetTreeNodesOrder: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/SetTreeNodesOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeNodeIDs ? "&TreeNodeIDs=" + params.TreeNodeIDs : "");
        return DocsAPI._send(url, params, queryString);
    },

    AddOwnerTree: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/AddOwnerTree?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.TreeID ? "&TreeID=" + params.TreeID : "");
        return DocsAPI._send(url, params, queryString);
    },

    RemoveOwnerTree: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/RemoveOwnerTree?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.TreeID ? "&TreeID=" + params.TreeID : "");
        return DocsAPI._send(url, params, queryString);
    },

    GetOwnerTrees: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetOwnerTrees?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return DocsAPI._send(url, params, queryString);
    },

    AddTreeNodeContents: function (params) {
        params = params || {};

        if (!params.NodeIDs) params.NodeIDs = params.NodeID;

        var url = DocsAPI.DocsHandler + "/AddTreeNodeContents?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeNodeID ? "&TreeNodeID=" + params.TreeNodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.RemoveFrom ? "&RemoveFrom=" + params.RemoveFrom : "");
        return DocsAPI._send(url, params, queryString);
    },

    RemoveTreeNodeContents: function (params) {
        params = params || {};

        if (!params.NodeIDs) params.NodeIDs = params.NodeID;

        var url = DocsAPI.DocsHandler + "/RemoveTreeNodeContents?timeStamp=" + new Date().getTime();
        var queryString = (params.TreeNodeID ? "&TreeNodeID=" + params.TreeNodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return DocsAPI._send(url, params, queryString);
    },

    XML2JSON: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/XML2JSON?timeStamp=" + new Date().getTime();
        var queryString = (params.Uploaded ? "&Uploaded=" + params.Uploaded : "");
        return DocsAPI._send(url, params, queryString);
    },

    GetPDFCovers: function (params) {
        params = params || {};

        var url = DocsAPI.DocsHandler + "/GetPDFCovers?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return DocsAPI._send(url, params, queryString);
    }
};