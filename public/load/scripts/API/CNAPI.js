if (!window.CNAPI) window.CNAPI = {
    ResponseURL: "/api/network",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    TestAdditionalIDPattern: function (pattern) {
        return /^([A-Za-z0-9_\-\/]|(~\[\[(((RND|(NCountS?(PY|GY)?))\d?)|[PG](Year|YearS|Month|Day)|(FormField:[A-Za-z0-9\-]{36})|(AreaID)|(FVersionID)|(PVersionID)|(VersionCounter))\]\]))+$/.test(pattern);
    },

    NodePageURL: function (params) {
        params = params || {};
        return "../../node/" + (params.NodeID || params.ID || "_") + (params.QRCode ? "?qrcode=true" : "");
    },

    GetNodesDataSource: function (params) {
        if ((params || {}).ResponseHandler) params.ResponseHandler = null;
        return CNAPI.GetNodes(params);
    },

    GetNodeTypesDataSource: function (params) {
        if ((params || {}).ResponseHandler) params.ResponseHandler = null;
        return CNAPI.GetNodeTypes(params) + "&text=";
    },

    GetRelationTypesDataSource: function (params) {
        return CNAPI.ResponseURL + "/GetRelationTypes?timeStamp=" + new Date().getTime();
    },

    GetTagsDataSource: function (params) {
        params = params || {};
        return CNAPI.ResponseURL + "/SearchTags?timeStamp=" + new Date().getTime() +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") + "&SearchText=";
    },

    ParseTreeNodes: function (responseText) {
        return (JSON.parse(responseText).Nodes || []).map(function (itm) {
            return { ID: itm.NodeID, Title: Base64.decode(itm.Name), HasChild: itm.HasChild };
        });
    },

    AddNodeType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddNodeType?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "") +
            (params.ParentID ? "&ParentID=" + params.ParentID : "") +
            (params.IsCategory ? "&IsCategory=" + params.IsCategory : "");
        return CNAPI._send(url, params, queryString);
    },

    RenameNodeType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RenameNodeType?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return CNAPI._send(url, params, queryString);
    },

    SetNodeTypeAdditionalID: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetNodeTypeAdditionalID?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.AdditionalID ? "&AdditionalID=" + params.AdditionalID : "");
        return CNAPI._send(url, params, queryString);
    },

    SetAdditionalIDPattern: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetAdditionalIDPattern?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.AdditionalIDPattern ? "&AdditionalIDPattern=" + params.AdditionalIDPattern : "");
        return CNAPI._send(url, params, queryString);
    },

    GenerateAdditionalID: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GenerateAdditionalID?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.AdditionalIDPattern ? "&AdditionalIDPattern=" + params.AdditionalIDPattern : "");
        return CNAPI._send(url, params, queryString);
    },

    MoveNodeType: function (params) {
        params = params || {};

        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/MoveNodeType?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.ParentID ? "&ParentID=" + params.ParentID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveNodeType: function (params) {
        params = params || {};

        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/RemoveNodeType?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.RemoveHierarchy ? "&RemoveHierarchy=" + params.RemoveHierarchy : "");
        return CNAPI._send(url, params, queryString);
    },

    RecoverNodeType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RecoverNodeType?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetNodeTypes: function (params) {
        params = params || {};

        if (typeof (params.Archive) == "undefined") params.Archive = false;

        var url = CNAPI.ResponseURL + "/GetNodeTypes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (GlobalUtilities.get_type(params.GrabSubNodeTypes) == "boolean" ? "&GrabSubNodeTypes=" + params.GrabSubNodeTypes : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (GlobalUtilities.get_type(params.IsKnowledge) == "boolean" ? "&IsKnowledge=" + params.IsKnowledge : "") +
            (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "") +
            (params.Archive ? "&Archive=" + params.Archive : "") +
            (params.Icon ? "&Icon=" + params.Icon : "") +
            (params.Extensions ? "&Extensions=" + params.Extensions : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.HasChild ? "&HasChild=" + params.HasChild : "") +
            (params.Tree ? "&Tree=" + params.Tree : "") +
            (params.CheckAccess ? "&CheckAccess=" + params.CheckAccess : "");
        return CNAPI._send(url, params, queryString);
    },

    GetChildNodeTypes: function (params) {
        params = params || {};

        if (typeof (params.Archive) == "undefined") params.Archive = false;

        var url = CNAPI.ResponseURL + "/GetChildNodeTypes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (GlobalUtilities.get_type(params.Archive) == "boolean" ? "&Archive=" + params.Archive : "");
        return CNAPI._send(url, params, queryString);
    },

    AddRelationType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddRelationType?timeStamp=" + new Date().getTime();
        var queryString = (params.Name ? "&Name=" + params.Name : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return CNAPI._send(url, params, queryString);
    },

    ModifyRelationType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ModifyRelationType?timeStamp=" + new Date().getTime();
        var queryString = (params.RelationTypeID ? "&RelationTypeID=" + params.RelationTypeID : "") +
            (params.Name ? "&Name=" + params.Name : "") + (params.Description ? "&Description=" + params.Description : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveRelationType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveRelationType?timeStamp=" + new Date().getTime();
        var queryString = (params.RelationTypeID ? "&RelationTypeID=" + params.RelationTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetRelationTypes: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetRelationTypes?timeStamp=" + new Date().getTime();
        return CNAPI._send(url, params, "");
    },

    AddNode: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.ParentNodeID ? "&ParentNodeID=" + params.ParentNodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    ModifyNode: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ModifyNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.Tags ? "&Tags=" + params.Tags : "");
        return CNAPI._send(url, params, queryString);
    },

    ChangeNodeType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ChangeNodeType?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SetDocumentTreeNodeID: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetDocumentTreeNodeID?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.DocumentTreeNodeID ? "&DocumentTreeNodeID=" + params.DocumentTreeNodeID : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return CNAPI._send(url, params, queryString);
    },

    ModifyNodeName: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ModifyNodeName?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return CNAPI._send(url, params, queryString);
    },

    ModifyNodeDescription: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ModifyNodeDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return CNAPI._send(url, params, queryString);
    },

    ModifyNodePublicDescription: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ModifyNodePublicDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return CNAPI._send(url, params, queryString);
    },

    SetNodeExpirationDate: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetNodeExpirationDate?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.ExpirationDate ? "&ExpirationDate=" + params.ExpirationDate : "");
        return CNAPI._send(url, params, queryString);
    },

    SetPreviousVersion: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetPreviousVersion?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.PreviousVersionID ? "&PreviousVersionID=" + params.PreviousVersionID : "");
        return CNAPI._send(url, params, queryString);
    },

    ModifyNodeTags: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ModifyNodeTags?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Tags ? "&Tags=" + params.Tags : "") +
            (params.CheckWorkFlowEditPermission ? "&CheckWorkFlowEditPermission=" + params.CheckWorkFlowEditPermission : "");
        return CNAPI._send(url, params, queryString);
    },

    GetNodeDescription: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetNodeDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SetNodeSearchability: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetNodesSearchability?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Searchable ? "&Searchable=" + params.Searchable : "");
        return CNAPI._send(url, params, queryString);
    },

    MoveNode: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/MoveNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.ParentNodeID ? "&ParentNodeID=" + params.ParentNodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveNode: function (params) {
        params = params || {};

        params.NodeIDs = params.NodeIDs || params.NodeID;

        var url = CNAPI.ResponseURL + "/RemoveNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.RemoveHierarchy ? "&RemoveHierarchy=" + params.RemoveHierarchy : "");
        return CNAPI._send(url, params, queryString);
    },

    RecycleNode: function (params) {
        params = params || {};

        params.NodeIDs = params.NodeIDs || params.NodeID;

        var url = CNAPI.ResponseURL + "/RecycleNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return CNAPI._send(url, params, queryString);
    },

    GetNodeIcon: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetNodeIcon?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetNode: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetNodes: function (params) {
        params = params || {};
        
        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;
        params.RelatedToIDs = params.RelatedToIDs || params.RelatedToNodeID;
        params.CreatorUserIDs = params.CreatorUserIDs || params.CreatorUserID;

        var url = CNAPI.ResponseURL + "/GetNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (GlobalUtilities.get_type(params.UseNodeTypeHierarchy) == "boolean" ?
                "&UseNodeTypeHierarchy=" + params.UseNodeTypeHierarchy : "") +
            (params.RelatedToIDs ? "&RelatedToIDs=" + params.RelatedToIDs : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "") +
            (GlobalUtilities.get_type(params.IsKnowledge) == "boolean" ? "&IsKnowledge=" + params.IsKnowledge : "") +
            (GlobalUtilities.get_type(params.IsMine) == "boolean" ? "&IsMine=" + params.IsMine : "") +
            (params.CreatorUserIDs ? "&CreatorUserIDs=" + params.CreatorUserIDs : "") +
            (GlobalUtilities.get_type(params.Archive) == "boolean" ? "&Archive=" + params.Archive : "") +
            (GlobalUtilities.get_type(params.Searchable) == "boolean" ? "&Searchable=" + params.Searchable : "") +
            (params.CreatedFromNDaysAgo ? "&CreatedFromNDaysAgo=" + params.CreatedFromNDaysAgo : "") +
            (params.CreatedToNDaysAgo ? "&CreatedToNDaysAgo=" + params.CreatedToNDaysAgo : "") +
            (params.CreationDateFrom ? "&CreationDateFrom=" + params.CreationDateFrom : "") +
            (params.CreationDateTo ? "&CreationDateTo=" + params.CreationDateTo : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (GlobalUtilities.get_type(params.IsFavorite) == "boolean" ? "&IsFavorite=" + params.IsFavorite : "") +
            (GlobalUtilities.get_type(params.IsGroup) == "boolean" ? "&IsGroup=" + params.IsGroup : "") +
            (GlobalUtilities.get_type(params.IsExpertiseDomain) == "boolean" ? "&IsExpertiseDomain=" + params.IsExpertiseDomain : "") +
            (params.FormFilters ? "&FormFilters=" + params.FormFilters : "") +
            (params.MatchAllFilters ? "&MatchAllFilters=" + params.MatchAllFilters : "") +
            (params.FetchCounts ? "&FetchCounts=" + params.FetchCounts : "") +
            (params.GroupByElementID ? "&GroupByElementID=" + params.GroupByElementID : "") +
            (params.HasChild ? "&HasChild=" + params.HasChild : "") + "&text=";
        return CNAPI._send(url, params, queryString);
    },

    GetMostPopularNodes: function (params) {
        params = params || {};

        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/GetMostPopularNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.ParentNodeID ? "&ParentNodeID=" + params.ParentNodeID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    SetNodeTypesOrder: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetNodeTypesOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "");
        return CNAPI._send(url, params, queryString);
    },

    SetNodesOrder: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetNodesOrder?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return CNAPI._send(url, params, queryString);
    },

    AddRelation: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddRelation?timeStamp=" + new Date().getTime();
        var queryString = (params.SourceNodeID ? "&SourceNodeID=" + params.SourceNodeID : "") +
            (params.DestinationNodeID ? "&DestinationNodeID=" + params.DestinationNodeID : "") +
            (params.DestinationNodeIDs ? "&DestinationNodeIDs=" + params.DestinationNodeIDs : "") +
            (params.RelationTypeID ? "&RelationTypeID=" + params.RelationTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SaveRelations: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SaveRelations?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.RelatedNodeIDs ? "&RelatedNodeIDs=" + params.RelatedNodeIDs : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveRelation: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveRelation?timeStamp=" + new Date().getTime();
        var queryString = (params.SourceNodeID ? "&SourceNodeID=" + params.SourceNodeID : "") +
            (params.DestinationNodeID ? "&DestinationNodeID=" + params.DestinationNodeID : "") +
            (params.RelationTypeID ? "&RelationTypeID=" + params.RelationTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    Like: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/Like?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    Unlike: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/Unlike?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetFans: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetFans?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    RelationExists: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RelationExists?timeStamp=" + new Date().getTime();
        var queryString = (params.SourceNodeID ? "&SourceNodeID=" + params.SourceNodeID : "") +
            (params.DestinationNodeID ? "&DestinationNodeID=" + params.DestinationNodeID : "") +
            (params.RelationTypeID ? "&RelationTypeID=" + params.RelationTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    AddMember: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddMember?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveMember: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveMember?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    AcceptMember: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AcceptMember?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    SaveMembers: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SaveMembers?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserIDs ? "&UserIDs=" + params.UserIDs : "");
        return CNAPI._send(url, params, queryString);  
    },

    AddExpert: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddExpert?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveExpert: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveExpert?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetExperts: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetExperts?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Hierarchy ? "&Hierarchy=" + params.Hierarchy : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetMembers: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetMembers?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (typeof (params.Admin) == "undefined" ? "" : "&Admin=" + params.Admin) +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetPendingMembers: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetPendingMembers?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetChildHierarchyMembers: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetChildHierarchyMembers?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetChildHierarchyExperts: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetChildHierarchyExperts?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetExpertiseDomainsCount: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetExpertiseDomainsCount?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetExpertiseDomains: function (params) {
        params = params || {};

        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/GetExpertiseDomains?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.AdditionalID ? "&AdditionalID=" + params.AdditionalID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.HasChild ? "&HasChild=" + params.HasChild : "") +
            (params.LowerDateLimit ? "&LowerDateLimit=" + params.LowerDateLimit : "") +
            (params.UpperDateLimit ? "&UpperDateLimit=" + params.UpperDateLimit : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") + "&text=";
        return CNAPI._send(url, params, queryString);
    },

    GetMembershipDomainsCount: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetMembershipDomainsCount?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetMembershipDomains: function (params) {
        params = params || {};

        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/GetMembershipDomains?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.AdditionalID ? "&AdditionalID=" + params.AdditionalID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.HasChild ? "&HasChild=" + params.HasChild : "") +
            (params.LowerDateLimit ? "&LowerDateLimit=" + params.LowerDateLimit : "") +
            (params.UpperDateLimit ? "&UpperDateLimit=" + params.UpperDateLimit : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") + "&text=";
        return CNAPI._send(url, params, queryString);
    },

    GetMemberNodes: function (params) {
        params = params || {};

        if (!params.NodeTypeIDs) params.NodeTypeIDs = params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/GetMemberNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeType ? "&NodeType=" + params.NodeType : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "");
        return CNAPI._send(url, params, queryString);
    },

    GetGroupsAll: function (params) {
        params = params || {};

        if (!params.NodeTypeIDs) params.NodeTypeIDs = params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/GetGroupsAll?timeStamp=" + new Date().getTime();
        var queryString = "";
        return CNAPI._send(url, params, queryString);
    },

    MakeAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/MakeAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    UnAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/UnAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetFavoriteNodesCount: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetFavoriteNodesCount?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "");
        return CNAPI._send(url, params, queryString);
    },

    GetFavoriteNodes: function (params) {
        params = params || {};

        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;

        params.LowerDateLimit = params.LowerDateLimit || params.CreationDateFrom;
        params.UpperDateLimit = params.UpperDateLimit || params.CreationDateTo;

        var url = CNAPI.ResponseURL + "/GetFavoriteNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.AdditionalID ? "&AdditionalID=" + params.AdditionalID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "") +
            (params.HasChild ? "&HasChild=" + params.HasChild : "") +
            (params.LowerDateLimit ? "&LowerDateLimit=" + params.LowerDateLimit : "") +
            (params.UpperDateLimit ? "&UpperDateLimit=" + params.UpperDateLimit : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") + "&text=";
        return CNAPI._send(url, params, queryString);
    },

    IsFan: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/IsFan?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "");
        return CNAPI._send(url, params, queryString);
    },

    GetRelatedNodes: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetRelatedNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.RelatedNodeTypeID ? "&RelatedNodeTypeID=" + params.RelatedNodeTypeID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.In ? "&In=" + params.In : "") +
            (params.Out ? "&Out=" + params.Out : "") +
            (params.InTags ? "&InTags=" + params.InTags : "") +
            (params.OutTags ? "&OutTags=" + params.OutTags : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetRelatedNodesAbstract: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetRelatedNodesAbstract?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.In ? "&In=" + params.In : "") +
            (params.Out ? "&Out=" + params.Out : "") +
            (params.InTags ? "&InTags=" + params.InTags : "") +
            (params.OutTags ? "&OutTags=" + params.OutTags : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return CNAPI._send(url, params, queryString);
    },

    AddComplex: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddComplex?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return CNAPI._send(url, params, queryString);
    },

    ModifyComplex: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ModifyComplex?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "") +
            (params.Name ? "&Name=" + params.Name : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveComplex: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveComplex?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "");
        return CNAPI._send(url, params, queryString);
    },

    AddNodeToComplex: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddNodeToComplex?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveComplexNode: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveComplexNode?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    AddComplexAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddComplexAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveComplexAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveComplexAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetComplexAdmins: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetComplexAdmins?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetLists: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetLists?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") + "&text=";
        return CNAPI._send(url, params, queryString);
    },

    GetListNodes: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetListNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.ListID ? "&ListID=" + params.ListID : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetMapItems: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetMapItems?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            "&Members=" + (params.Members ? "true" : "false") +
            "&Admins=" + (params.Admins ? "true" : "false") +
            "&Experts=" + (params.Experts ? "true" : "false") +
            "&Fans=" + (params.Fans ? "true" : "false") +
            "&Creators=" + (params.Creators ? "true" : "false") +
            "&Friends=" + (params.Friends ? "true" : "false") +
            "&Hierarchy=" + (params.Hierarchy ? "true" : "false") +
            "&RelatedNodes=" + (params.RelatedNodes ? "true" : "false") +
            (params.RelatedNodesTypeID ? "&RelatedNodesTypeID=" + params.RelatedNodesTypeID : "") +
            (params.MembersNodeTypeID ? "&MembersNodeTypeID=" + params.MembersNodeTypeID : "") +
            (params.CreatorsNodeTypeID ? "&CreatorsNodeTypeID=" + params.CreatorsNodeTypeID : "") +
            (params.ExpertsNodeTypeID ? "&ExpertsNodeTypeID=" + params.ExpertsNodeTypeID : "") +
            (params.FansNodeTypeID ? "&FansNodeTypeID=" + params.FansNodeTypeID : "");

        return CNAPI._send(url, params, queryString);
    },

    GetNodesCount: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetNodesCount?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.LowerCreationDateLimit ? "&LowerCreationDateLimit=" + params.LowerCreationDateLimit : "") +
            (params.UpperCreationDateLimit ? "&UpperCreationDateLimit=" + params.UpperCreationDateLimit : "") +
            (params.Root == null ? "" : "&Root=" + params.Root) +
            (params.Archive == null ? "" : "&Archive=" + params.Archive);
        return CNAPI._send(url, params, queryString);
    },

    GetMostPopulatedNodeTypes: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetMostPopulatedNodeTypes?timeStamp=" + new Date().getTime();
        var queryString = (params.Count ? "&Count=" + params.Count : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "");
        return CNAPI._send(url, params, queryString);
    },

    GetParentNodes: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetParentNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetChildNodes: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetChildNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeTypeAdditionalID ? "&NodeTypeAdditionalID=" + params.NodeTypeAdditionalID : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.OrderBy ? "&OrderBy=" + params.OrderBy : "") +
            (params.OrderByDesc ? "&OrderByDesc=" + params.OrderByDesc : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") + "&text=";
        return CNAPI._send(url, params, queryString);
    },

    GetTreeDepth: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetTreeDepth?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SuggestNodeRelations: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SuggestNodeRelations?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.RelatedNodeTypeID ? "&RelatedNodeTypeID=" + params.RelatedNodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SuggestNodeTypesForRelations: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SuggestNodeTypesForRelations?timeStamp=" + new Date().getTime();
        return CNAPI._send(url, params, "");
    },

    SuggestSimilarNodes: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SuggestSimilarNodes?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return CNAPI._send(url, params, queryString);
    },

    SuggestKnowledgableUsers: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SuggestKnowledgableUsers?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return CNAPI._send(url, params, queryString);
    },

    GetNodeInfo: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetNodeInfo?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeIDs ? "&NodeIDs=" + params.NodeIDs : "") +
            (params.Keywords ? "&Keywords=" + params.Keywords : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.Attachments ? "&Attachments=" + params.Attachments : "") +
            (params.Creator ? "&Creator=" + params.Creator : "") +
            (params.ContributorsCount ? "&ContributorsCount=" + params.ContributorsCount : "") +
            (params.LikesCount ? "&LikesCount=" + params.LikesCount : "") +
            (params.VisitsCount ? "&VisitsCount=" + params.VisitsCount : "") +
            (params.ExpertsCount ? "&ExpertsCount=" + params.ExpertsCount : "") +
            (params.MembersCount ? "&MembersCount=" + params.MembersCount : "") +
            (params.ChildsCount ? "&ChildsCount=" + params.ChildsCount : "") +
            (params.HasChild ? "&HasChild=" + params.HasChild : "") +
            (params.RelatedNodesCount ? "&RelatedNodesCount=" + params.RelatedNodesCount : "") +
            (params.LikeStatus ? "&LikeStatus=" + params.LikeStatus : "") +
            (params.CoverPhotoURL ? "&CoverPhotoURL=" + params.CoverPhotoURL : "") +
            (params.Extensions ? "&Extensions=" + params.Extensions : "") +
            (params.Service ? "&Service=" + params.Service : "") +
            (params.UserStatus ? "&UserStatus=" + params.UserStatus : "");
        return CNAPI._send(url, params, queryString);
    },

    EnableExtension: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EnableExtension?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Extension ? "&Extension=" + params.Extension : "");
        return CNAPI._send(url, params, queryString);
    },

    DisableExtension: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/DisableExtension?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Extension ? "&Extension=" + params.Extension : "");
        return CNAPI._send(url, params, queryString);
    },

    SetExtensionTitle: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetExtensionTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Extension ? "&Extension=" + params.Extension : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return CNAPI._send(url, params, queryString);
    },

    MoveExtension: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/MoveExtension?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Extension ? "&Extension=" + params.Extension : "") +
            (params.MoveDown ? "&MoveDown=" + params.MoveDown : "");
        return CNAPI._send(url, params, queryString);
    },

    GetExtensions: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetExtensions?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Initialize ? "&Initialize=" + params.Initialize : "");
        return CNAPI._send(url, params, queryString);
    },

    HasExtension: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/HasExtension?timeStamp=" + new Date().getTime();
        var queryString = (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.Extension ? "&Extension=" + params.Extension : "");
        return CNAPI._send(url, params, queryString);
    },

    GetIntellectualPropertiesCount: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetIntellectualPropertiesCount?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "") +
            (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "");
        return CNAPI._send(url, params, queryString);
    },

    GetIntellectualProperties: function (params) {
        params = params || {};

        params.NodeTypeIDs = params.NodeTypeIDs || params.NodeTypeID;

        var url = CNAPI.ResponseURL + "/GetIntellectualProperties?timeStamp=" + new Date().getTime();
        var queryString = (params.UserID ? "&UserID=" + params.UserID : "") +
            (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.AdditionalID ? "&AdditionalID=" + params.AdditionalID : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "") +
            (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "") +
            (params.HasChild ? "&HasChild=" + params.HasChild : "") +
            (params.LowerDateLimit ? "&LowerDateLimit=" + params.LowerDateLimit : "") +
            (params.UpperDateLimit ? "&UpperDateLimit=" + params.UpperDateLimit : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") + "&text=";
        return CNAPI._send(url, params, queryString);
    },

    GetIntellectualPropertiesOfFriends: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetIntellectualPropertiesOfFriends?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.CreatorInfo ? "&CreatorInfo=" + params.CreatorInfo : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "");
        return CNAPI._send(url, params, queryString);
    },

    Explore: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/Explore?timeStamp=" + new Date().getTime();
        var queryString = (params.BaseID ? "&BaseID=" + params.BaseID : "") +
            (params.RelatedID ? "&RelatedID=" + params.RelatedID : "") +
            (params.BaseTypeIDs ? "&BaseTypeIDs=" + params.BaseTypeIDs : "") +
            (params.RelatedTypeIDs ? "&RelatedTypeIDs=" + params.RelatedTypeIDs : "") +
            (params.SecondLevelNodeID ? "&SecondLevelNodeID=" + params.SecondLevelNodeID : "") +
            (params.RegistrationArea ? "&RegistrationArea=" + params.RegistrationArea : "") +
            (params.Tags ? "&Tags=" + params.Tags : "") +
            (params.Relations ? "&Relations=" + params.Relations : "") +
            (params.LowerBoundary ? "&LowerBoundary=" + params.LowerBoundary : "") +
            (params.Count ? "&Count=" + params.Count : "") +
            (params.OrderBy ? "&OrderBy=" + params.OrderBy : "") +
            (params.OrderByDesc ? "&OrderByDesc=" + params.OrderByDesc : "") +
            (params.SearchText ? "&SearchText=" + params.SearchText : "");
        return CNAPI._send(url, params, queryString);
    },

    ExcelHeaders: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ExcelHeaders?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Dic ? "&Dic=" + params.Dic : "");
        return CNAPI._send(url, params, queryString);
    },

    ImportNodesFromExcel: function (params) {
        params = params || {};

        params.Timeout = 120000;

        var url = CNAPI.ResponseURL + "/ImportNodesFromExcel?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Uploaded ? "&Uploaded=" + params.Uploaded : "") +
            (params.SheetNo ? "&SheetNo=" + params.SheetNo : "");
        return CNAPI._send(url, params, queryString);
    },

    XML2Node: function (params) {
        params = params || {};

        params.Timeout = 120000;

        var url = CNAPI.ResponseURL + "/XML2Node?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Uploaded ? "&Uploaded=" + params.Uploaded : "") +
            (params.Map ? "&Map=" + params.Map : "") +
            (params.AttachUploadedFile ? "&AttachUploadedFile=" + params.AttachUploadedFile : "");
        return CNAPI._send(url, params, queryString);
    },

    SetAvatar: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetAvatar?timeStamp=" + new Date().getTime();
        var queryString = (params.ID ? "&ID=" + params.ID : "") +
            (params.AvatarName ? "&AvatarName=" + params.AvatarName : "");
        return CNAPI._send(url, params, queryString);
    },

    /* Service */

    GetService: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetService?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetServices: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetServices?timeStamp=" + new Date().getTime();
        var queryString = (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "") +
            (GlobalUtilities.get_type(params.IsKnowledge) == "boolean" ? "&IsKnowledge=" + params.IsKnowledge : "") +
            (GlobalUtilities.get_type(params.All) == "boolean" ? "&All=" + params.All : "");
        return CNAPI._send(url, params, queryString);
    },

    GetServiceRegistrationInfo: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetServiceRegistrationInfo?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SetServiceTitle: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetServiceTitle?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Title ? "&Title=" + params.Title : "");
        return CNAPI._send(url, params, queryString);
    },

    SetServiceDescription: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetServiceDescription?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Description ? "&Description=" + params.Description : "");
        return CNAPI._send(url, params, queryString);
    },

    SetServiceSuccessMessage: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetServiceSuccessMessage?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Message ? "&Message=" + params.Message : "");
        return CNAPI._send(url, params, queryString);
    },

    GetServiceSuccessMessage: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetServiceSuccessMessage?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SetServiceAdminType: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetServiceAdminType?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.AdminType ? "&AdminType=" + params.AdminType : "") +
            (params.AdminNodeID ? "&AdminNodeID=" + params.AdminNodeID : "") +
            (params.Limits ? "&Limits=" + params.Limits : "");
        return CNAPI._send(url, params, queryString);
    },

    SetMaxAcceptableAdminLevel: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetMaxAcceptableAdminLevel?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.MaxAcceptableAdminLevel ? "&MaxAcceptableAdminLevel=" + params.MaxAcceptableAdminLevel : "");
        return CNAPI._send(url, params, queryString);
    },

    SetContributionLimits: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetContributionLimits?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Limits ? "&Limits=" + params.Limits : "");
        return CNAPI._send(url, params, queryString);
    },

    GetContributionLimits: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetContributionLimits?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    EnableContribution: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EnableContribution?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Enable ? "&Enable=" + params.Enable : "");
        return CNAPI._send(url, params, queryString);
    },

    NoContentService: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/NoContentService?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    IsKnowledge: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/IsKnowledge?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (GlobalUtilities.get_type(params.IsKnowledge) == "boolean" ? "&IsKnowledge=" + params.IsKnowledge : "");
        return CNAPI._send(url, params, queryString);
    },

    IsDocument: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/IsDocument?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (GlobalUtilities.get_type(params.IsDocument) == "boolean" ? "&IsDocument=" + params.IsDocument : "");
        return CNAPI._send(url, params, queryString);
    },

    IsCommunityPage: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/IsCommunityPage?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    EnableComments: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EnableComments?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    EnablePreviousVersionSelect: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EnablePreviousVersionSelect?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    IsTree: function (params) {
        params = params || {};

        params.IDs = params.IDs || params.NodeTypeID || params.NodeID;

        var url = CNAPI.ResponseURL + "/IsTree?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "") +
            (GlobalUtilities.get_type(params.IsTree) == "boolean" ? "&IsTree=" + params.IsTree : "");
        return CNAPI._send(url, params, queryString);
    },

    HasUniqueMembership: function (params) {
        params = params || {};

        params.IDs = params.IDs || params.NodeTypeID || params.NodeID;

        var url = CNAPI.ResponseURL + "/HasUniqueMembership?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    HasUniqueAdminMember: function (params) {
        params = params || {};

        params.IDs = params.IDs || params.NodeTypeID || params.NodeID;

        var url = CNAPI.ResponseURL + "/HasUniqueAdminMember?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    AbstractAndKeywordsDisabled: function (params) {
        params = params || {};

        params.IDs = params.IDs || params.NodeTypeID || params.NodeID;

        var url = CNAPI.ResponseURL + "/AbstractAndKeywordsDisabled?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    FileUploadDisabled: function (params) {
        params = params || {};

        params.IDs = params.IDs || params.NodeTypeID || params.NodeID;

        var url = CNAPI.ResponseURL + "/FileUploadDisabled?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    RelatedNodesSelectDisabled: function (params) {
        params = params || {};

        params.IDs = params.IDs || params.NodeTypeID || params.NodeID;

        var url = CNAPI.ResponseURL + "/RelatedNodesSelectDisabled?timeStamp=" + new Date().getTime();
        var queryString = (params.IDs ? "&IDs=" + params.IDs : "") +
            (GlobalUtilities.get_type(params.Value) == "boolean" ? "&Value=" + params.Value : "");
        return CNAPI._send(url, params, queryString);
    },

    EditableForAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EditableForAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Editable ? "&Editable=" + params.Editable : "");
        return CNAPI._send(url, params, queryString);
    },

    EditableForCreator: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EditableForCreator?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Editable ? "&Editable=" + params.Editable : "");
        return CNAPI._send(url, params, queryString);
    },

    EditableForOwners: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EditableForOwners?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Editable ? "&Editable=" + params.Editable : "");
        return CNAPI._send(url, params, queryString);
    },

    EditableForExperts: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EditableForExperts?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Editable ? "&Editable=" + params.Editable : "");
        return CNAPI._send(url, params, queryString);
    },

    EditableForMembers: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EditableForMembers?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Editable ? "&Editable=" + params.Editable : "");
        return CNAPI._send(url, params, queryString);
    },

    EditSuggestion: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/EditSuggestion?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.Enable ? "&Enable=" + params.Enable : "");
        return CNAPI._send(url, params, queryString);
    },

    AddFreeUser: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddFreeUser?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveFreeUser: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveFreeUser?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetServiceAdmins: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetServiceAdmins?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    AddServiceAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/AddServiceAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    RemoveServiceAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RemoveServiceAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.UserID ? "&UserID=" + params.UserID : "");
        return CNAPI._send(url, params, queryString);
    },

    IsServiceAdmin: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/IsServiceAdmin?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    CheckNodeCreationAccess: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/CheckNodeCreationAccess?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    RegisterNewNode: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/RegisterNewNode?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.ParentNodeID ? "&ParentNodeID=" + params.ParentNodeID : "") +
            (params.DocumentTreeNodeID ? "&DocumentTreeNodeID=" + params.DocumentTreeNodeID : "") +
            (params.PreviousVersionID ? "&PreviousVersionID=" + params.PreviousVersionID : "") +
            (params.Name ? "&Name=" + params.Name : "") +
            (params.Description ? "&Description=" + params.Description : "") +
            (params.Tags ? "&Tags=" + params.Tags : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "") +
            (params.WorkFlowID ? "&WorkFlowID=" + params.WorkFlowID : "") +
            (params.AdminAreaID ? "&AdminAreaID=" + params.AdminAreaID : "") +
            (params.FormInstanceID ? "&FormInstanceID=" + params.FormInstanceID : "") +
            (params.Contributors ? "&Contributors=" + params.Contributors : "") +
            (params.CreationDate ? "&CreationDate=" + params.CreationDate : "") +
            (params.GetExtendInfo ? "&GetExtendInfo=" + params.GetExtendInfo : "") +
            (params.GetWorkFlowInfo ? "&GetWorkFlowInfo=" + params.GetWorkFlowInfo : "") +
            (params.Logo ? "&Logo=" + params.Logo : "");
        return CNAPI._send(url, params, queryString);
    },

    GetAdminAreaLimits: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetAdminAreaLimits?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "") +
            (params.NodeID ? "&NodeID=" + params.NodeID : "");
        return CNAPI._send(url, params, queryString);
    },

    SetAdminArea: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetAdminArea?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.AreaID ? "&AreaID=" + params.AreaID : "");
        return CNAPI._send(url, params, queryString);
    },

    SetContributors: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/SetContributors?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeID ? "&NodeID=" + params.NodeID : "") +
            (params.Contributors ? "&Contributors=" + params.Contributors : "") +
            (params.OwnerID ? "&OwnerID=" + params.OwnerID : "");
        return CNAPI._send(url, params, queryString);
    },

    /* end of Service */

    GetAllFieldsOfActivity: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetAllFieldsOfActivity?timeStamp=" + new Date().getTime();
        var queryString = "";
        return CNAPI._send(url, params, queryString);
    },

    GetTemplateTags: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetTemplateTags?timeStamp=" + new Date().getTime();
        var queryString = "";
        return CNAPI._send(url, params, queryString);
    },

    GetTemplates: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetTemplates?timeStamp=" + new Date().getTime();
        var queryString = (params.TagID ? "&TagID=" + params.TagID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetTemplateJSON: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetTemplateJSON?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    },

    GetTemplateStatus: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetTemplateStatus?timeStamp=" + new Date().getTime();
        var queryString = (params.Template ? "&Template=" + params.Template : "");
        return CNAPI._send(url, params, queryString);
    },

    ActivateTemplate: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/ActivateTemplate?timeStamp=" + new Date().getTime();
        var queryString = (params.Template ? "&Template=" + params.Template : "");
        return CNAPI._send(url, params, queryString);
    },

    GetTemplatePreview: function (params) {
        params = params || {};

        var url = CNAPI.ResponseURL + "/GetTemplatePreview?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeID ? "&NodeTypeID=" + params.NodeTypeID : "");
        return CNAPI._send(url, params, queryString);
    }
};