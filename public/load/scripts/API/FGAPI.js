if (!window.FGAPI) window.FGAPI = {
    ResponseURL: "/api/forms",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    GetFormsDataSource: function (params) {
        if ((params || {}).ResponseHandler) params.ResponseHandler = null;
        return FGAPI.GetForms(params);
    },

    _GetFormElementsQueryString: function (elements) {
        var retVal = { Elements: [] };

        for (var i = 0, lnt = (elements || []).length; i < lnt; ++i) {
            var guidItems = (elements[i].GuidItems || []).map(g => ({ ID: g.ID, Name: Base64.encode(g.Name) }));

            var files = (elements[i].Files || []).map(f => {
                if (GlobalUtilities.get_type(f) == "json") {
                    return JSON.stringify({
                        FileID: f.FileID,
                        FileName: f.FileName,
                        OwnerID: f.OwnerID,
                        Extension: f.Extension,
                        MIME: f.MIME,
                        Size: f.Size
                    });
                }
                else if (f.toString) return f.toString();
                else return null;
            }).filter(f => !!f);

            retVal.Elements.push({
                ElementID: elements[i].ElementID ? elements[i].ElementID : "",
                InstanceID: elements[i].InstanceID ? elements[i].InstanceID : "",
                RefElementID: elements[i].RefElementID ? elements[i].RefElementID : "",
                Title: elements[i].Title ? Base64.encode(elements[i].Title) : "",
                SequenceNumber: elements[i].SequenceNumber ? elements[i].SequenceNumber : "",
                Filled: elements[i].Filled === true,
                Type: elements[i].Type ? elements[i].Type : "",
                Info: elements[i].Info ? Base64.encode(JSON.stringify(elements[i].Info)) : "",
                TextValue: elements[i].TextValue ? Base64.encode(elements[i].TextValue) : "",
                FloatValue: !isNaN(+elements[i].FloatValue) ? +elements[i].FloatValue : "",
                BitValue: GlobalUtilities.get_type(elements[i].BitValue) == "boolean" ? elements[i].BitValue : "",
                DateValue: elements[i].DateValue ? elements[i].DateValue : "",
                GuidItems: guidItems,
                Files: Base64.encode(JSON.stringify(files))
            });
        }
        
        return Base64.encode(JSON.stringify(retVal));
    },

    SetOnFormFill: function (instanceId, func) {
        if (!FGAPI.__OnFormsFill) FGAPI.__OnFormsFill = [];
        FGAPI.__OnFormsFill[instanceId] = func;
    },

    OnFormFill: function (instanceId, params) {
        if (!instanceId) return;
        var on_fill = (FGAPI.__OnFormsFill || [])[instanceId];
        var on_opener_fill = (((window.opener || {}).FGAPI || {}).__OnFormsFill || [])[instanceId];
        if (on_fill) on_fill(params);
        if (on_opener_fill) on_opener_fill(params);
    },

    CreateForm: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/CreateForm?timeStamp=" + new Date().getTime();
        var queryString = (params.Title ? "&Title=" + params.Title : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormTitle: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormName: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormName?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormDescription: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return FGAPI._send(url, params, queryString);
    },

    RemoveForm: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemoveForm?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "");
        return FGAPI._send(url, params, queryString);
    },

    RecycleForm: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RecycleForm?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetForms: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetForms?timeStamp=" + new Date().getTime();
        var queryString = (params.Archive ? "&Archive=" + params.Archive : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") + "&text=";

        return FGAPI._send(url, params, queryString);
    },

    AddFormElement: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/AddFormElement?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.Help ? "&Help=" + params.Help : "") +
            (params.Type ? "&Type=" + params.Type : "") +
            (params.SequenceNumber ? "&SequenceNumber=" + params.SequenceNumber : "") +
            (params.Info ? "&Info=" + params.Info : "");
        return FGAPI._send(url, params, queryString);
    },

    ModifyFormElement: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/ModifyFormElement?timeStamp=" + new Date().getTime();
        var queryString = (params.ElementID ? "&ElementID=" + params.ElementID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.Help ? "&Help=" + params.Help : "") +
            (params.Info ? "&Info=" + params.Info : "") +
            (params.Weight ? "&Weight=" + params.Weight : "");
        return FGAPI._send(url, params, queryString);
    },

    SetElementsOrder: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetElementsOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.ElementIDs ? "&ElementIDs=" + params.ElementIDs : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormElementNecessity: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormElementNecessity?timeStamp=" + new Date().getTime();
        var queryString = (params.ElementID ? "&ElementID=" + params.ElementID : "") +
            (params.Necessary ? "&Necessary=" + params.Necessary : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormElementUniqueness: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormElementUniqueness?timeStamp=" + new Date().getTime();
        var queryString = (params.ElementID ? "&ElementID=" + params.ElementID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return FGAPI._send(url, params, queryString);
    },

    RemoveFormElement: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemoveFormElement?timeStamp=" + new Date().getTime();
        var queryString = (params.ElementID ? "&ElementID=" + params.ElementID : "");
        return FGAPI._send(url, params, queryString);
    },

    SaveFormElements: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SaveFormElements?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.Title ? "&Title=" + params.Title : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.Elements ? "&Elements=" + params.Elements : "");
        return FGAPI._send(url, params, queryString);
    },

    GetFormElements: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetFormElements?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Type ? "&Type=" + params.Type : "") +
            (params.ConsiderElementLimits ? "&ConsiderElementLimits=" + params.ConsiderElementLimits : "");
        return FGAPI._send(url, params, queryString);
    },

    CreateFormInstance: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/CreateFormInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.DirectorID ? "&DirectorID=" + params.DirectorID : "") +
            (params.Admin ? "&Admin=" + params.Admin : "") +
            (params.IsTemporary ? "&IsTemporary=" + params.IsTemporary : "");
        return FGAPI._send(url, params, queryString);
    },

    RemoveFormInstance: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemoveFormInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return FGAPI._send(url, params, queryString);
    },

    RemoveOwnerFormInstances: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemoveOwnerFormInstances?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return FGAPI._send(url, params, queryString);
    },

    RecoverFormInstance: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RecoverFormInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetFormInstance: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetFormInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "") +
            (params.LimitOwnerID ? "&LimitOwnerID=" + params.LimitOwnerID : "") +
            (params.ShowAllIfNoLimit ? "&ShowAllIfNoLimit=" + params.ShowAllIfNoLimit : "") +
            (params.EnforceLimits ? "&EnforceLimits=" + params.EnforceLimits : "") +
            (params.PollAbstract ? "&PollAbstract=" + params.PollAbstract : "");
        return FGAPI._send(url, params, queryString);
    },

    GetOwnerFormInstances: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetOwnerFormInstances?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return FGAPI._send(url, params, queryString);
    },

    ValidateNewName: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/ValidateNewName?timeStamp=" + new Date().getTime();
        var queryString = (params.ObjectID ? "&ObjectID=" + params.ObjectID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return FGAPI._send(url, params, queryString);
    },

    MeetsUniqueConstraint: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/MeetsUniqueConstraint?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "") +
            (params.ElementID ? "&ElementID=" + params.ElementID : "") +
            (params.TextValue ? "&TextValue=" + params.TextValue : "") +
            (params.FloatValue ? "&FloatValue=" + params.FloatValue : "");
        return FGAPI._send(url, params, queryString);
    },

    SaveFormInstanceElements: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SaveFormInstanceElements?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.PollOwnerType ? "&PollOwnerType=" + params.PollOwnerType : "") +
            (params.ElementsToClear ? "&ElementsToClear=" + params.ElementsToClear : "") +
            (params.Elements ? "&Elements=" + FGAPI._GetFormElementsQueryString(params.Elements || []) : "");
        return FGAPI._send(url, params, queryString);
    },

    GetElementChanges: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetElementChanges?timeStamp=" + new Date().getTime();
        var queryString = (params.ElementID ? "&ElementID=" + params.ElementID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return FGAPI._send(url, params, queryString);
    },

    ImportForm: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/ImportForm?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "") +
            (params.Uploaded ? "&Uploaded=" + params.Uploaded : "") +
            (params.Map ? "&Map=" + params.Map : "");
        return FGAPI._send(url, params, queryString);
    },

    ExportAsPDF: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/ExportAsPDF?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "") +
            (params.LimitOwnerID ? "&LimitOwnerID=" + params.LimitOwnerID : "") +
            (params.CoverID ? "&CoverID=" + params.CoverID : "") +
            (params.Password ? "&PS=" + params.Password : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormInstanceAsFilled: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormInstanceAsFilled?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormInstanceAsNotFilled: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormInstanceAsNotFilled?timeStamp=" + new Date().getTime();
        var queryString = (params.InstanceID ? "&InstanceID=" + params.InstanceID : "");
        return FGAPI._send(url, params, queryString);
    },

    SetFormOwner: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetFormOwner?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return FGAPI._send(url, params, queryString);
    },

    RemoveFormOwner: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemoveFormOwner?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetOwnerForm: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetOwnerForm?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetFormRecords: function (params) {
        params = params || {};

        if (params.ElementID && !params.ElementIDs) params.ElementIDs = params.ElementID;
        if (params.InstanceID && !params.InstanceIDs) params.InstanceIDs = params.InstanceID;
        if (params.OwnerID && !params.OwnerIDs) params.OwnerIDs = params.OwnerID;

        var url = FGAPI.ResponseURL + "/GetFormRecords?timeStamp=" + new Date().getTime();
        var queryString = (params.FormID ? "&FormID=" + params.FormID : "") +
            (params.ElementIDs ? "&ElementIDs=" + params.ElementIDs : "") +
            (params.InstanceIDs ? "&InstanceIDs=" + params.InstanceIDs : "") +
            (params.OwnerIDs ? "&OwnerIDs=" + params.OwnerIDs : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.SortByElementID ? "&SortByElementID=" + params.SortByElementID : "") +
            (params.DESC ? "&DESC=" + params.DESC : "");
        return FGAPI._send(url, params, queryString);
    },

    InitializeTemplateForm: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/InitializeTemplateForm?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return FGAPI._send(url, params, queryString);
    },

    InitializeOwnerFormInstance: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/InitializeOwnerFormInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.FormID ? "&FormID=" + params.FormID : "");
        return FGAPI._send(url, params, queryString);
    },

    SetElementLimits: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetElementLimits?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.ElementIDs ? "&ElementIDs=" + params.ElementIDs : "");
        return FGAPI._send(url, params, queryString);
    },

    GetElementLimits: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetElementLimits?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return FGAPI._send(url, params, queryString);
    },

    SetElementLimitNecessity: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetElementLimitNecessity?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.ElementID ? "&ElementID=" + params.ElementID : "") +
            (params.Necessary ? "&Necessary=" + params.Necessary : "");
        return FGAPI._send(url, params, queryString);
    },

    RemoveElementLimit: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemoveElementLimit?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.ElementID ? "&ElementID=" + params.ElementID : "");
        return FGAPI._send(url, params, queryString);
    },

    //Polls

    GetPolls: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetPolls?timeStamp=" + new Date().getTime();
        var queryString = (params.IsCopyOfPollID ? "&IsCopyOfPollID=" + params.IsCopyOfPollID : "") +
            (params.Archive ? "&Archive=" + params.Archive : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") + "&text=";
        return FGAPI._send(url, params, queryString);
    },

    AddPoll: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/AddPoll?timeStamp=" + new Date().getTime();
        var queryString = (params.CopyFromPollID ? "&CopyFromPollID=" + params.CopyFromPollID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return FGAPI._send(url, params, queryString);
    },

    GetPollInstance: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetPollInstance?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.CopyFromPollID ? "&CopyFromPollID=" + params.CopyFromPollID : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.UseExistingPoll ? "&UseExistingPoll=" + params.UseExistingPoll : "");
        return FGAPI._send(url, params, queryString);
    },

    RenamePoll: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RenamePoll?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return FGAPI._send(url, params, queryString);
    },

    SetPollDescription: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetPollDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return FGAPI._send(url, params, queryString);
    },

    SetPollBeginDate: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetPollBeginDate?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return FGAPI._send(url, params, queryString);
    },

    SetPollFinishDate: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetPollFinishDate?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return FGAPI._send(url, params, queryString);
    },

    SetPollShowSummary: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetPollShowSummary?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return FGAPI._send(url, params, queryString);
    },

    SetPollHideContributors: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/SetPollHideContributors?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.Value ? "&Value=" + params.Value : "");
        return FGAPI._send(url, params, queryString);
    },

    RemovePoll: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemovePoll?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "");
        return FGAPI._send(url, params, queryString);
    },

    RecyclePoll: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RecyclePoll?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetPollStatus: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetPollStatus?timeStamp=" + new Date().getTime();
        var queryString = (params.IsCopyOfPollID ? "&IsCopyOfPollID=" + params.IsCopyOfPollID : "") +
            (params.PollID ? "&PollID=" + params.PollID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetPollAbstract: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetPollAbstract?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetPollElementInstances: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetPollElementInstances?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.ElementID ? "&ElementID=" + params.ElementID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return FGAPI._send(url, params, queryString);
    },

    GetCurrentPollsCount: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetCurrentPollsCount?timeStamp=" + new Date().getTime();
        return FGAPI._send(url, params, "");
    },

    GetCurrentPolls: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetCurrentPolls?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return FGAPI._send(url, params, queryString);
    },

    //end of Polls


    //APO Maturity Assessment

    GetAPOMaturityAssessmentStatus: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetAPOMaturityAssessmentStatus?timeStamp=" + new Date().getTime();
        var queryString = "";
        return FGAPI._send(url, params, queryString);
    },

    NewAPOMaturityAssessment: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/NewAPOMaturityAssessment?timeStamp=" + new Date().getTime();
        var queryString = (params.Period ? "&Period=" + params.Period : "");
        return FGAPI._send(url, params, queryString);
    },

    EditAPOMaturityAssessmentPeriod: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/EditAPOMaturityAssessmentPeriod?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") +
            (params.Period ? "&Period=" + params.Period : "");
        return FGAPI._send(url, params, queryString);
    },

    RemoveAPOMaturityAssessment: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/RemoveAPOMaturityAssessment?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "");
        return FGAPI._send(url, params, queryString);
    },

    GetAPOMaturityAssessmentForm: function (params) {
        params = params || {};

        var url = FGAPI.ResponseURL + "/GetAPOMaturityAssessmentForm?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "");
        return FGAPI._send(url, params, queryString);
    },

    SaveAPOMaturityAssessmentForm: function (params) {
        params = params || {};

        (params.Elements || []).forEach(e => e.InstanceID = e.InstanceID || params.InstanceID);

        var url = FGAPI.ResponseURL + "/SaveAPOMaturityAssessmentForm?timeStamp=" + new Date().getTime();
        var queryString = (params.PollID ? "&PollID=" + params.PollID : "") + 
            (params.Elements ? "&Elements=" + FGAPI._GetFormElementsQueryString(params.Elements || []) : "");
        return FGAPI._send(url, params, queryString);
    }

    //end of API Maturity Assessment
};