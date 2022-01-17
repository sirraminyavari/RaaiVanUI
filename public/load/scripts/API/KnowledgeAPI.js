if (!window.KnowledgeAPI) window.KnowledgeAPI = {
    RequestHandler: "/api/knowledge",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    GetKnowledge: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetKnowledge?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },


    //Knowledge WorkFlow APIs

    AddKnowledgeType: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/AddKnowledgeType?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RemoveKnowledgeType: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RemoveKnowledgeType?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetKnowledgeTypes: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetKnowledgeTypes?timeStamp=" + new Date().getTime();
        var queryString = "";
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetKnowledgeType: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetKnowledgeType?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Detail ? "&Detail=" + params.Detail : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetEvaluationType: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetEvaluationType?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.EvaluationType ? "&EvaluationType=" + params.EvaluationType : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetEvaluators: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetEvaluators?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Evaluators ? "&Evaluators=" + params.Evaluators : "") +
            (params.MinEvaluationsCount ? "&MinEvaluationsCount=" + params.MinEvaluationsCount : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetPreEvaluateByOwner: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetPreEvaluateByOwner?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetForceEvaluatorsDescribe: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetForceEvaluatorsDescribe?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetNodeSelectType: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetNodeSelectType?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.NodeSelectType ? "&NodeSelectType=" + params.NodeSelectType : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetSearchabilityType: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetSearchabilityType?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.SearchableAfter ? "&SearchableAfter=" + params.SearchableAfter : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetScoreScale: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetScoreScale?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.ScoreScale ? "&ScoreScale=" + params.ScoreScale : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetMinAcceptableScore: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetMinAcceptableScore?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.MinAcceptableScore ? "&MinAcceptableScore=" + params.MinAcceptableScore : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetConvertEvaluatorsToExperts: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetConvertEvaluatorsToExperts?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetEvaluationsEditable: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetEvaluationsEditable?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetEvaluationsEditableForAdmin: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetEvaluationsEditableForAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetEvaluationsRemovable: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetEvaluationsRemovable?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetUnhideEvaluators: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetUnhideEvaluators?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetUnhideEvaluations: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetUnhideEvaluations?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetUnhideNodeCreators: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetUnhideNodeCreators?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetTextOptions: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetTextOptions?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetCandidateRelations: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetCandidateRelations?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetCandidateRelations: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetCandidateRelations?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    AddQuestion: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/AddQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.QuestionBody ? "&QuestionBody=" + params.QuestionBody : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    ModifyQuestion: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/ModifyQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.QuestionBody ? "&QuestionBody=" + params.QuestionBody : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetQuestionsOrder: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetQuestionsOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetQuestionWeight: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetQuestionWeight?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.Weight ? "&Weight=" + params.Weight : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RemoveQuestion: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RemoveQuestion?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RemoveRelatedNodeQuestions: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RemoveRelatedNodeQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    AddAnswerOption: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/AddAnswerOption?timeStamp=" + new Date().getTime();
        var queryString = (params.TypeQuestionID ? "&TypeQuestionID=" + params.TypeQuestionID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    ModifyAnswerOption: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/ModifyAnswerOption?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SetAnswerOptionsOrder: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SetAnswerOptionsOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RemoveAnswerOption: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RemoveAnswerOption?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetQuestions: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SearchQuestions: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SearchQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            "&SearchText=" + (params.SearchText || "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetEvaluations: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetEvaluations?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "") +
            (typeof (params.Done) != "undefined" ? "&Done=" + params.Done : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetEvaluationFormQuestions: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetEvaluationFormQuestions?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetFilledEvaluationForm: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetFilledEvaluationForm?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.WFVersionID ? "&WFVersionID=" + params.WFVersionID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    AcceptKnowledge: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/AcceptKnowledge?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RejectKnowledge: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RejectKnowledge?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.TextOptions ? "&TextOptions=" + params.TextOptions : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SendToAdmin: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SendToAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SendBackForRevision: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SendBackForRevision?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.TextOptions ? "&TextOptions=" + params.TextOptions : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SendToEvaluators: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SendToEvaluators?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.UserIDs ? "&UserIDs=" + params.UserIDs : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SendKnowledgeComment: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SendKnowledgeComment?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.ReplyToHistoryID ? "&ReplyToHistoryID=" + params.ReplyToHistoryID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    EditKnowledgeComment: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/EditKnowledgeComment?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    SaveEvaluationForm: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/SaveEvaluationForm?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.Answers ? "&Answers=" + params.Answers : "") +
            (params.Score ? "&Score=" + params.Score : "") +
            (params.TextOptions ? "&TextOptions=" + params.TextOptions : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RemoveEvaluator: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RemoveEvaluator?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RefuseEvaluation: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RefuseEvaluation?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    TerminateEvaluation: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/TerminateEvaluation?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    NewEvaluators: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/NewEvaluators?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserIDs ? "&UserIDs=" + params.UserIDs : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    EditHistoryDescription: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/EditHistoryDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetHistory: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetHistory?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    //end of Knowledge WorkFlow APIs

    //Feedback APIs

    FinancialFeedBack: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/AddFeedBack?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "") +
            "&FeedBackType=Financial" + (params.Value ? "&Value=" + params.Value : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    TemporalFeedBack: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/AddFeedBack?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "") +
            "&FeedBackType=Temporal" + (params.Value ? "&Value=" + params.Value : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    ModifyFeedBack: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/ModifyFeedBack?timeStamp=" + new Date().getTime();
        var queryString = (params.FeedBackID ? "&FeedBackID=" + params.FeedBackID : "") +
            (params.Value ? "&Value=" + params.Value : "") + (params.Description ? "&Description=" + params.Description : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    RemoveFeedBack: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/RemoveFeedBack?timeStamp=" + new Date().getTime();
        var queryString = (params.FeedBackID ? "&FeedBackID=" + params.FeedBackID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetFinancialFeedBacks: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetKnowledgeFeedBacks?timeStamp=" + new Date().getTime();
        var queryString = "FeedBackType=Financial" +
            (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetTemporalFeedBacks: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetKnowledgeFeedBacks?timeStamp=" + new Date().getTime();
        var queryString = "FeedBackType=Temporal" +
            (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    GetFeedBacks: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/GetKnowledgeFeedBacks?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeID ? "&KnowledgeID=" + params.KnowledgeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    //end of Feedback APIs

    //Necessary Items

    ActivateNecessaryItem: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/ActivateNecessaryItem?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.ItemName ? "&ItemName=" + params.ItemName : "");
        return KnowledgeAPI._send(url, params, queryString);
    },

    DeactiveNecessaryItem: function (params) {
        params = params || {};

        var url = KnowledgeAPI.RequestHandler + "/DeactiveNecessaryItem?timeStamp=" + new Date().getTime();
        var queryString = (params.KnowledgeTypeID ? "&KnowledgeTypeID=" + params.KnowledgeTypeID : "") +
            (params.ItemName ? "&ItemName=" + params.ItemName : "");
        return KnowledgeAPI._send(url, params, queryString);
    }

    //end of Necessary Items
};