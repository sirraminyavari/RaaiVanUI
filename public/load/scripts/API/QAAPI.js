if (!window.QAAPI) window.QAAPI = {
    ResponseURL: "/api/qa",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    QuestionPageURL: function (params) {
        return "../../question/" + ((params || {}).QuestionID);
    },

    TagPageURL: function (params) {
        return "../../qatag/" + ((params || {}).TagID);
    },

    AddNewWorkFlow: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddNewWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "");
        return QAAPI._send(url, params, queryString);
    },

    RenameWorkFlow: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RenameWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowDescription: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowsOrder: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowsOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowIDs ? "&WorkFlowIDs=" + params.WorkFlowIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowInitialCheckNeeded: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowInitialCheckNeeded?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowFinalConfirmationNeeded: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowFinalConfirmationNeeded?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowActionDeadline: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowActionDeadline?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowAnswerBy: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowAnswerBy?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowPublishAfter: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowPublishAfter?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowRemovableAfterConfirmation: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowRemovableAfterConfirmation?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowNodeSelectType: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowNodeSelectType?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowDisableComments: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowDisableComments?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowDisableQuestionLikes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowDisableQuestionLikes?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowDisableAnswerLikes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowDisableAnswerLikes?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowDisableCommentLikes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowDisableCommentLikes?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    SetWorkFlowDisableBestAnswer: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetWorkFlowDisableBestAnswer?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveWorkFlow: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return QAAPI._send(url, params, queryString);
    },

    RecycleWorkFlow: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RecycleWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return QAAPI._send(url, params, queryString);
    },

    GetWorkFlows: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetWorkFlows?timeStamp=" + new Date().getTime();
        var queryString = (params.Archive ? "&Archive=" + params.Archive : "");
        return QAAPI._send(url, params, queryString);
    },

    AddWorkFlowAdmin: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddWorkFlowAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveWorkFlowAdmin: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveWorkFlowAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return QAAPI._send(url, params, queryString);
    },

    GetWorkFlowAdmins: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetWorkFlowAdmins?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return QAAPI._send(url, params, queryString);
    },

    SetCandidateRelations: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetCandidateRelations?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    GetCandidateRelations: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetCandidateRelations?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "");
        return QAAPI._send(url, params, queryString);
    },

    CreateFAQCategory: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/CreateFAQCategory?timeStamp=" + new Date().getTime();
        var queryString = (params.ParentID ? "&ParentID=" + params.ParentID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return QAAPI._send(url, params, queryString);
    },

    RenameFAQCategory: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RenameFAQCategory?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryID ? "&CategoryID=" + params.CategoryID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return QAAPI._send(url, params, queryString);
    },

    MoveFAQCategories: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/MoveFAQCategories?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryIDs ? "&CategoryIDs=" + params.CategoryIDs : "") +
            (params.ParentID ? "&ParentID=" + params.ParentID : "");
        return QAAPI._send(url, params, queryString);
    },

    SetFAQCategoriesOrder: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetFAQCategoriesOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryIDs ? "&CategoryIDs=" + params.CategoryIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveFAQCategories: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveFAQCategories?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryIDs ? "&CategoryIDs=" + params.CategoryIDs : "") +
            (params.RemoveHierarchy ? "&RemoveHierarchy=" + params.RemoveHierarchy : "");
        return QAAPI._send(url, params, queryString);
    },

    GetChildFAQCategories: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetChildFAQCategories?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryID ? "&CategoryID=" + params.CategoryID : "");
        return QAAPI._send(url, params, queryString);
    },

    AddFAQItems: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddFAQItems?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryID ? "&CategoryID=" + params.CategoryID : "") +
            (params.QuestionIDs ? "&QuestionIDs=" + params.QuestionIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    AddQuestionToFAQCategories: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddQuestionToFAQCategories?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.CategoryIDs ? "&CategoryIDs=" + params.CategoryIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveFAQItem: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveFAQItem?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryID ? "&CategoryID=" + params.CategoryID : "") +
            (params.QuestionID ? "&QuestionID=" + params.QuestionID : "");
        return QAAPI._send(url, params, queryString);
    },

    SetFAQItemsOrder: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetFAQItemsOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryID ? "&CategoryID=" + params.CategoryID : "") +
            (params.QuestionIDs ? "&QuestionIDs=" + params.QuestionIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    AddQuestion: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.Title ? "&Title=" + params.Title : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.UserIDs ? "&UserIDs=" + params.UserIDs : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    EditQuestionTitle: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/EditQuestionTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return QAAPI._send(url, params, queryString);
    },

    EditQuestionDescription: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/EditQuestionDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return QAAPI._send(url, params, queryString);
    },

    InitialConfirmQuestion: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/InitialConfirmQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "");
        return QAAPI._send(url, params, queryString);
    },

    ConfirmQuestion: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/ConfirmQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "");
        return QAAPI._send(url, params, queryString);
    },

    SetTheBestAnswer: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SetTheBestAnswer?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.AnswerID ? "&AnswerID=" + params.AnswerID : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveQuestion: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "");
        return QAAPI._send(url, params, queryString);
    },

    GetQuestion: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "");
        return QAAPI._send(url, params, queryString);
    },

    GetQuestions: function (params) {
        params = params || {};

        if (params.StartWithSearch !== false) params.StartWithSearch = true;

        var url = QAAPI.ResponseURL + "/GetQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.StartWithSearch ? "&StartWithSearch=" + params.StartWithSearch : "") +
            (params.DateFrom ? "&DateFrom=" + params.DateFrom : "") +
            (params.DateTo ? "&DateTo=" + params.DateTo : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    FindRelatedQuestions: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/FindRelatedQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    GetRelatedQuestions: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetRelatedQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.Groups ? "&Groups=" + params.Groups : "") +
            (params.ExpertiseDomains ? "&ExpertiseDomains=" + params.ExpertiseDomains : "") +
            (params.Favorites ? "&Favorites=" + params.Favorites : "") +
            (params.Properties ? "&Properties=" + params.Properties : "") +
            (params.FromFriends ? "&FromFriends=" + params.FromFriends : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    MyFavoriteQuestions: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/MyFavoriteQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    MyAskedQuestions: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/MyAskedQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    QuestionsAskedOfMe: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/QuestionsAskedOfMe?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    GetFAQItems: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetFAQItems?timeStamp=" + new Date().getTime();
        var queryString = (params.CategoryID ? "&CategoryID=" + params.CategoryID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    GroupQuestionsByRelatedNodes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GroupQuestionsByRelatedNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") + 
            (params.SearchText ? "&SearchText=" + params.SearchText : "");
        return QAAPI._send(url, params, queryString);
    },

    GetRelatedTags: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetRelatedTags?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    FindRelatedTags: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/FindRelatedTags?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    CheckNodes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/CheckNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    SearchNodes: function (params) {
        params = params || {};

        if (params.StartWithSearch !== false) params.StartWithSearch = true;

        var url = QAAPI.ResponseURL + "/SearchNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.StartWithSearch ? "&StartWithSearch=" + params.StartWithSearch : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return QAAPI._send(url, params, queryString);
    },

    AddQuestionTag: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddQuestionTag?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.Tag ? "&Tag=" + params.Tag : "") +
            (params.IsNewQuestion ? "&IsNewQuestion=" + params.IsNewQuestion : "");
        return QAAPI._send(url, params, queryString);
    },

    SaveRelatedNodes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SaveRelatedNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    AddRelatedNodes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddRelatedNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveRelatedNodes: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveRelatedNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return QAAPI._send(url, params, queryString);
    },

    SendAnswer: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SendAnswer?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.AnswerBody ? "&AnswerBody=" + params.AnswerBody : "");
        return QAAPI._send(url, params, queryString);
    },

    EditAnswer: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/EditAnswer?timeStamp=" + new Date().getTime();
        var queryString = (params.AnswerID ? "&AnswerID=" + params.AnswerID : "") +
            (params.AnswerBody ? "&AnswerBody=" + params.AnswerBody : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveAnswer: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveAnswer?timeStamp=" + new Date().getTime();
        var queryString = (params.AnswerID ? "&AnswerID=" + params.AnswerID : "");
        return QAAPI._send(url, params, queryString);
    },

    GetAnswers: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetAnswers?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "");
        return QAAPI._send(url, params, queryString);
    },

    SendComment: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/SendComment?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.ReplyToCommentID ? "&ReplyToCommentID=" + params.ReplyToCommentID : "") +
            (params.BodyText ? "&BodyText=" + params.BodyText : "");
        return QAAPI._send(url, params, queryString);
    },

    EditComment: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/EditComment?timeStamp=" + new Date().getTime();
        var queryString = (params.CommentID ? "&CommentID=" + params.CommentID : "") +
            (params.BodyText ? "&BodyText=" + params.BodyText : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveComment: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveComment?timeStamp=" + new Date().getTime();
        var queryString = (params.CommentID ? "&CommentID=" + params.CommentID : "");
        return QAAPI._send(url, params, queryString);
    },

    AddKnowledgableUser: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/AddKnowledgableUser?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return QAAPI._send(url, params, queryString);
    },

    RemoveKnowledgableUser: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/RemoveKnowledgableUser?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return QAAPI._send(url, params, queryString);
    },

    GetKnowledgableUsers: function (params) {
        params = params || {};

        var url = QAAPI.ResponseURL + "/GetKnowledgableUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.QuestionID ? "&QuestionID=" + params.QuestionID : "") +
            (params.Suggestions ? "&Suggestions=" + params.Suggestions : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return QAAPI._send(url, params, queryString);
    }
};