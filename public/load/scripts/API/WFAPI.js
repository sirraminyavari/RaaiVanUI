if (!window.WFAPI) window.WFAPI = {
    ResponseURL: "/api/workflow",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    GetStatesDataSource: function (params) {
        params = params || {};
        return WFAPI.ResponseURL + "/GetStates?timeStamp=" + new Date().getTime() +
            (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") + "&Text=";
    },

    GetTagsDataSource: function (params) {
        params = params || {};
        return WFAPI.ResponseURL + "/GetWorkFlowTags?timeStamp=" + new Date().getTime() +
            (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") + "&Text=";
    },

    CreateState: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/CreateState?timeStamp=" + new Date().getTime();
        var queryString = (params.Title ? "&Title=" + params.Title : "");
        return WFAPI._send(url, params, queryString);
    },

    ModifyState: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/ModifyState?timeStamp=" + new Date().getTime();
        var queryString = (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveState: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveState?timeStamp=" + new Date().getTime();
        var queryString = (params.StateID ? "&StateID=" + params.StateID : "");
        return WFAPI._send(url, params, queryString);
    },

    GetStates: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetStates?timeStamp=" + new Date().getTime();
        return WFAPI._send(url, params, "");
    },

    CreateWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/CreateWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return WFAPI._send(url, params, queryString);
    },

    ModifyWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/ModifyWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.Name ? "&Name=" + params.Name : "") + (params.Description ? "&Description=" + params.Description : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return WFAPI._send(url, params, queryString);
    },

    GetWorkFlows: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetWorkFlows?timeStamp=" + new Date().getTime();
        return WFAPI._send(url, params, "");
    },

    GetWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return WFAPI._send(url, params, queryString);
    },

    AddWorkFlowState: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/AddWorkFlowState?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveWorkFlowState: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveWorkFlowState?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetWorkFlowStateDescription: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetWorkFlowStateDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") + (params.Description ? "&Description=" + params.Description : "");
        return WFAPI._send(url, params, queryString);
    },

    SetWorkFlowStateTag: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetWorkFlowStateTag?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") + (params.Tag ? "&Tag=" + params.Tag : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveWorkFlowStateTag: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveWorkFlowStateTag?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetWorkFlowAction: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetWorkFlowAction?timeStamp=" + new Date().getTime();
        var queryString = (params.ConnectionID ? "&ConnectionID=" + params.ConnectionID : "") +
            (params.Action ? "&Action=" + params.Action : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateDirector: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateDirector?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.ResponseType ? "&ResponseType=" + params.ResponseType : "") +
            (params.RefStateID ? "&RefStateID=" + params.RefStateID : "") +
            (params.DirectorNodeID ? "&DirectorNodeID=" + params.DirectorNodeID : "") +
            (params.Admin ? "&Admin=" + params.Admin : "") + 
            (params.DirectorUserID ? "&DirectorUserID=" + params.DirectorUserID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStatePoll: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStatePoll?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.PollID ? "&PollID=" + params.PollID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateDataNeedsType: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateDataNeedsType?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.DataNeedsType ? "&DataNeedsType=" + params.DataNeedsType : "") +
            (params.RefStateID ? "&RefStateID=" + params.RefStateID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateDataNeedsDescription: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateDataNeedsDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateDescriptionNeeded: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateDescriptionNeeded?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            ("&DescriptionNeeded=" + (params.DescriptionNeeded === false ? "false" : "true"));
        return WFAPI._send(url, params, queryString);
    },

    SetStateHideOwnerName: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateHideOwnerName?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.HideOwnerName ? "&HideOwnerName=" + params.HideOwnerName : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateEditPermission: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateEditPermission?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.EditPermission ? "&EditPermission=" + params.EditPermission : "");
        return WFAPI._send(url, params, queryString);
    },

    SetFreeDataNeedRequests: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetFreeDataNeedRequests?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.FreeDataNeedRequests ? "&FreeDataNeedRequests=" + params.FreeDataNeedRequests : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateDataNeed: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateDataNeed?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.PreviousNodeTypeID ? "&PreviousNodeTypeID=" + params.PreviousNodeTypeID : "") +
            (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.MultiSelect ? "&MultiSelect=" + params.MultiSelect : "") +
            (params.Admin ? "&Admin=" + params.Admin : "") +
            (params.Necessary ? "&Necessary=" + params.Necessary : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveStateDataNeed: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveStateDataNeed?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") + (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetRejectionSettings: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetRejectionSettings?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.MaxAllowedRejections ? "&MaxAllowedRejections=" + params.MaxAllowedRejections : "") +
            (params.RejectionTitle ? "&RejectionTitle=" + params.RejectionTitle : "") +
            (params.RejectionRefStateID ? "&RejectionRefStateID=" + params.RejectionRefStateID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetMaxAllowedRejections: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetMaxAllowedRejections?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.MaxAllowedRejections ? "&MaxAllowedRejections=" + params.MaxAllowedRejections : "");
        return WFAPI._send(url, params, queryString);
    },

    CreateStateDataNeedInstance: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/CreateStateDataNeedInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.HistoryID ? "&HistoryID=" + params.HistoryID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") + (params.Admin ? "&Admin=" + params.Admin : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return WFAPI._send(url, params, queryString);
    },

    GetStateDataNeedInstance: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetStateDataNeedInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateDataNeedInstanceAsFilled: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateDataNeedInstanceAsFilled?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateDataNeedInstanceAsNotFilled: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateDataNeedInstanceAsNotFilled?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveStateDataNeedInstance: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveStateDataNeedInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return WFAPI._send(url, params, queryString);
    },

    AddStateConnection: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/AddStateConnection?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "");
        return WFAPI._send(url, params, queryString);
    },

    SortStateConnections: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SortStateConnections?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "");
        return WFAPI._send(url, params, queryString);
    },

    MoveStateConnection: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/MoveStateConnection?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "") +
            (params.MoveDown ? "&MoveDown=" + params.MoveDown : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveStateConnection: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveStateConnection?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateConnectionLabel: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateConnectionLabel?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "") +
            (params.Label ? "&Label=" + params.Label : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateConnectionAttachmentStatus: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateConnectionAttachmentStatus?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "") +
            (params.AttachmentRequired ? "&AttachmentRequired=" + params.AttachmentRequired : "") +
            (params.AttachmentTitle ? "&AttachmentTitle=" + params.AttachmentTitle : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateConnectionDirector: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateConnectionDirector?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "") +
            (params.NodeRequired ? "&NodeRequired=" + params.NodeRequired : "") +
            (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return WFAPI._send(url, params, queryString);
    },

    SetStateConnectionForm: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetStateConnectionForm?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.Necessary ? "&Necessary=" + params.Necessary : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveStateConnectionForm: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveStateConnectionForm?timeStamp=" + new Date().getTime();
        var queryString = (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.InStateID ? "&InStateID=" + params.InStateID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return WFAPI._send(url, params, queryString);
    },

    SetAutoMessage: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SetAutoMessage?timeStamp=" + new Date().getTime();
        var queryString = (params.AutoMessageID ? "&AutoMessageID=" + params.AutoMessageID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.BodyText ? "&BodyText=" + params.BodyText : "") +
            (params.AudienceType ? "&AudienceType=" + params.AudienceType : "") +
            (params.RefStateID ? "&RefStateID=" + params.RefStateID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Admin ? "&Admin=" + params.Admin : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveAutoMessage: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveAutoMessage?timeStamp=" + new Date().getTime();
        var queryString = (params.AutoMessageID ? "&AutoMessageID=" + params.AutoMessageID : "");
        return WFAPI._send(url, params, queryString);
    },

    GetOwnerHistory: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetOwnerHistory?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.LastOnly ? "&LastOnly=" + params.LastOnly : "") +
            (GlobalUtilities.get_type(params.Done) == "boolean" ? "&Done=" + params.Done : "");
        return WFAPI._send(url, params, queryString);
    },

    GetWorkFlowOptions: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetWorkFlowOptions?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return WFAPI._send(url, params, queryString);
    },

    CreateHistoryFormInstance: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/CreateHistoryFormInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.HistoryID ? "&HistoryID=" + params.HistoryID : "") +
            (params.OutStateID ? "&OutStateID=" + params.OutStateID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return WFAPI._send(url, params, queryString);
    },

    SendToNextState: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/SendToNextState?timeStamp=" + new Date().getTime();
        var queryString = (params.HistoryID ? "&HistoryID=" + params.HistoryID : "") +
            (params.StateID ? "&StateID=" + params.StateID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.Reject ? "&Reject=" + params.Reject : "") +
            (params.AttachedFiles ? "&AttachedFiles=" + params.AttachedFiles : "");
        return WFAPI._send(url, params, queryString);
    },

    TerminateWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/TerminateWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.HistoryID ? "&HistoryID=" + params.HistoryID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return WFAPI._send(url, params, queryString);
    },

    RestartWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RestartWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return WFAPI._send(url, params, queryString);
    },

    GetWorkFlowOwners: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetWorkFlowOwners?timeStamp=" + new Date().getTime();
        return WFAPI._send(url, params, "");
    },

    GetServiceAbstract: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetServiceAbstract?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.EmptyTagLabel ? "&EmptyTagLabel=" + params.EmptyTagLabel : "");
        return WFAPI._send(url, params, queryString);
    },

    AddOwnerWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/AddOwnerWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return WFAPI._send(url, params, queryString);
    },

    RemoveOwnerWorkFlow: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/RemoveOwnerWorkFlow?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return WFAPI._send(url, params, queryString);
    },

    GetOwnerWorkFlows: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetOwnerWorkFlows?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return WFAPI._send(url, params, queryString);
    },

    GetOwnerWorkFlowPrimaryKey: function (params) {
        params = params || {};

        var url = WFAPI.ResponseURL + "/GetOwnerWorkFlowPrimaryKey?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "");
        return WFAPI._send(url, params, queryString);
    }
};