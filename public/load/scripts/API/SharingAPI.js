if (!window.SharingAPI) window.SharingAPI = {
    ResponseURL: "/api/social",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    PostPageURL: function (params) {
        return "../../posts/" + ((params || {}).PostID);
    },

    GetPostsViewURL: function (params) {
        params = params || {};
        return "../../posts/?" + (params.OwnerID ? "OwnerID=" + params.OwnerID : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "");
    },

    AddPost: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/AddPost?timeStamp=" + new Date().getTime();
        var queryString = (params.PostType ? "&PostType=" + params.PostType : "") +
            (params.Privacy ? "&Privacy=" + params.Privacy : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.OwnerType ? "&OwnerType=" + params.OwnerType : "") +
            (params.AttachedFile ? "&AttachedFile=" + params.AttachedFile : "");
        return SharingAPI._send(url, params, queryString);
    },

    GetPost: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/GetPost?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "") +
            (params.OwnerInfo ? "&OwnerInfo=" + params.OwnerInfo : "");
        return SharingAPI._send(url, params, queryString);
    },

    GetPosts: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/GetPosts?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.News ? "&News=" + params.News : "") +
            (params.MaxDate ? "&MaxDate=" + params.MaxDate : "") +
            (params.MinDate ? "&MinDate=" + params.MinDate : "") +
            (params.OwnerInfo ? "&OwnerInfo=" + params.OwnerInfo : "");
        return SharingAPI._send(url, params, queryString);
    },

    RemovePost: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/RemovePost?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "");
        return SharingAPI._send(url, params, queryString);
    },

    ModifyPost: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/UpdatePost?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return SharingAPI._send(url, params, queryString);
    },

    LikeDislike: function (params) {
        params = params || {};

        var strLike = params.Like === null ? "Unlike" : "LikeDislike";
        var objectType = params.CommentID ? "Comment" : "Post";

        var url = SharingAPI.ResponseURL + "/" + (strLike + objectType) + "?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "") +
            (params.CommentID ? "&CommentID=" + params.CommentID : "") + "&Like=" + (params.Like === false ? "false" : "true");
        return SharingAPI._send(url, params, queryString);
    },

    GetFans: function (params) {
        params = params || "";

        if (typeof (params.LikeStatus) == "undefined") params.LikeStatus = true;

        var url = SharingAPI.ResponseURL + "/GetFans?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "") +
            (params.CommentID ? "&CommentID=" + params.CommentID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.LikeStatus ? "&LikeStatus=" + params.LikeStatus : "");
        return SharingAPI._send(url, params, queryString);
    },

    GetPostsCount: function (params) {
        params = params || "";

        if (typeof (params.LikeStatus) == "undefined") params.LikeStatus = true;

        var url = SharingAPI.ResponseURL + "/GetPostsCount?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.SenderUserID ? "&SenderUserID=" + params.SenderUserID : "");
        return SharingAPI._send(url, params, queryString);
    },

    GetCommentsCount: function (params) {
        params = params || "";

        if (typeof (params.LikeStatus) == "undefined") params.LikeStatus = true;

        var url = SharingAPI.ResponseURL + "/GetCommentsCount?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "") +
            (params.SenderUserID ? "&SenderUserID=" + params.SenderUserID : "");
        return SharingAPI._send(url, params, queryString);
    },

    Share: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/Share?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "") +
            (params.Privacy ? "&Privacy=" + params.Privacy : "") + (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Description ? "&Description=" + params.Description : "") + (params.OwnerType ? "&OwnerType=" + params.OwnerType : "");
        return SharingAPI._send(url, params, queryString);
    },

    AddComment: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/AddComment?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return SharingAPI._send(url, params, queryString);
    },

    ModifyComment: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/ModifyComment?timeStamp=" + new Date().getTime();
        var queryString = (params.CommentID ? "&CommentID=" + params.CommentID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return SharingAPI._send(url, params, queryString);
    },

    RemoveComment: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/RemoveComment?timeStamp=" + new Date().getTime();
        var queryString = (params.CommentID ? "&CommentID=" + params.CommentID : "");
        return SharingAPI._send(url, params, queryString);
    },

    GetComments: function (params) {
        params = params || "";

        var url = SharingAPI.ResponseURL + "/GetComments?timeStamp=" + new Date().getTime();
        var queryString = (params.PostID ? "&PostID=" + params.PostID : "");
        return SharingAPI._send(url, params, queryString);
    }
};