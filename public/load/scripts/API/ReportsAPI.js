if (!window.ReportsAPI) window.ReportsAPI = {
    ResponseURL: "/api/report",

    _send: function (url, params, queryString) {
        params = params || {};

        if (queryString && (queryString[0] == "&")) queryString = queryString.substring(1);

        if (!params.ResponseHandler) return url + (!queryString ? "" : "&" + queryString);
        else (params.RequestHandler || RVRequest).post_request(url, queryString, params.ResponseHandler, params, params.ParseResults);
    },

    Reports: {
        RV: {
            _IconURL: "",

            OveralReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        BeginDate: params.BeginDate || "", FinishDate: params.FinishDate || "",
                        ParamsOrder: "BeginDate:DateTime|FinishDate:DateTime"
                    };

                    ReportsAPI.GetReport(params);
                }
            },

            LogsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        UserID: params.UserID || "", Actions: params.Actions || "",
                        IPAddresses: params.IPAddresses || "", Level: params.Level || "",
                        NotAuthorized: params.NotAuthorized || "", Anonymous: params.Anonymous || "",
                        BeginDate: params.BeginDate || "", FinishDate: params.FinishDate || "",
                        ParamsOrder: "UserID:Guid|Actions:Structure|IPAddresses:Structure|Level:String|NotAuthorized:Bool|Anonymous:Bool" +
                            "|BeginDate:DateTime|FinishDate:DateTime|Count:Int|LowerBoundary:Double"
                    };

                    ReportsAPI.GetReport(params);
                }
            },

            ErrorLogsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        Level: params.Level || "", BeginDate: params.BeginDate || "", FinishDate: params.FinishDate || "",
                        ParamsOrder: "Level:String|BeginDate:DateTime|FinishDate:DateTime|Count:Int|LowerBoundary:Double"
                    };

                    ReportsAPI.GetReport(params);
                }
            },

            KnowledgeSupplyIndicatorsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeIDs: params.NodeTypeIDs || "", CreatorNodeTypeID: params.CreatorNodeTypeID || "",
                        CreatorNodeIDs: params.CreatorNodeIDs || "",
                        BeginDate: params.BeginDate || "", FinishDate: params.FinishDate || "",
                        ParamsOrder: "NodeTypeIDs:Structure|CreatorNodeTypeID:Guid|CreatorNodeIDs:Structure" +
                            "|BeginDate:DateTime|FinishDate:DateTime"
                    };
                    
                    ReportsAPI.GetReport(params);
                }
            },

            KnowledgeDemandIndicatorsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeIDs: params.NodeTypeIDs || "", CreatorNodeTypeID: params.CreatorNodeTypeID || "",
                        CreatorNodeIDs: params.CreatorNodeIDs || "",
                        BeginDate: params.BeginDate || "", FinishDate: params.FinishDate || "",
                        ParamsOrder: "NodeTypeIDs:Structure|CreatorNodeTypeID:Guid|CreatorNodeIDs:Structure" +
                            "|BeginDate:DateTime|FinishDate:DateTime"
                    };

                    ReportsAPI.GetReport(params);
                }
            },

            SocialContributionIndicatorsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        CreatorNodeTypeID: params.CreatorNodeTypeID || "", CreatorNodeIDs: params.CreatorNodeIDs || "",
                        BeginDate: params.BeginDate || "", FinishDate: params.FinishDate || "",
                        ParamsOrder: "CreatorNodeTypeID:Guid|CreatorNodeIDs:Structure" +
                            "|BeginDate:DateTime|FinishDate:DateTime"
                    };

                    ReportsAPI.GetReport(params);
                }
            },

            ApplicationsPerformanceReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        TeamIDs: params.TeamIDs || "",
                        Delimiter: "|",
                        DateFrom: params.DateFrom || "",
                        DateMiddle: params.DateMiddle || "",
                        DateTo: params.DateTo || "",
                        ParamsOrder: "TeamIDs:String|Delimiter:Char|DateFrom:DateTime|DateMiddle:DateTime|DateTo:DateTime"
                    };

                    ReportsAPI.GetReport(params);
                }
            }
        },
        USR: {
            _IconURL: "",

            UsersListReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        EmploymentType: params.EmploymentType || "", SearchText: params.SearchText || "", IsApproved: params.IsApproved,
                        LowerBirthDateLimit: params.LowerBirthDateLimit || "", UpperBirthDateLimit: params.UpperBirthDateLimit || "",
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "EmploymentType:String|SearchText:Base64|IsApproved:bool|LowerBirthDateLimit:Datetime" +
                            "|UpperBirthDateLimit:Datetime|LowerCreationDateLimit:Datetime|UpperCreationDateLimit:Datetime"
                    };
                    
                    ReportsAPI.GetReport(params);
                }
            },

            ActiveUsersReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        DateFrom: params.DateFrom || "",
                        DateTo: params.DateTo || "",
                        ParamsOrder: "DateFrom:Datetime|DateTo:Datetime"
                    };

                    ReportsAPI.GetReport(params);
                }
            },

            MostVisitedItemsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        ItemType: params.ItemType || "", NodeTypeID: params.NodeTypeID || "",
                        Count: params.Count || "", BeginDate: params.BeginDate || "", FinishDate: params.FinishDate || "",
                        ParamsOrder: "ItemType:String|NodeTypeID:Guid|Count:int|BeginDate:DateTime|FinishDate:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            ProfileFilledPercentageReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {};
                    ReportsAPI.GetReport(params);
                }
            },

            UsersWithSpecificPercentageOfFilledProfileReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        FilledPercentage: params.FilledPercentage,
                        ParamsOrder: "FilledPercentage:int"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            ResumeJobExperienceReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        UserIDs: params.UserIDs, GroupIDs: params.GroupIDs, Hierarchy: params.Hierarchy,
                        Delimiter: "|", DateFrom: params.DateFrom, DateTo: params.DateTo,
                        ParamsOrder: "UserIDs:String|GroupIDs:String|Delimiter:Char|Hierarchy:bool|" +
                            "DateFrom:DateTime|DateTo:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            ResumeEducationReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        UserIDs: params.UserIDs, GroupIDs: params.GroupIDs, Hierarchy: params.Hierarchy,
                        Delimiter: "|", DateFrom: params.DateFrom, DateTo: params.DateTo,
                        ParamsOrder: "UserIDs:String|GroupIDs:String|Delimiter:Char|Hierarchy:bool|" +
                            "DateFrom:DateTime|DateTo:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            ResumeCoursesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        UserIDs: params.UserIDs, GroupIDs: params.GroupIDs, Hierarchy: params.Hierarchy,
                        Delimiter: "|", DateFrom: params.DateFrom, DateTo: params.DateTo,
                        ParamsOrder: "UserIDs:String|GroupIDs:String|Delimiter:Char|Hierarchy:bool|" +
                            "DateFrom:DateTime|DateTo:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            ResumeHonorsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        UserIDs: params.UserIDs, GroupIDs: params.GroupIDs, Hierarchy: params.Hierarchy,
                        Delimiter: "|", DateFrom: params.DateFrom, DateTo: params.DateTo,
                        ParamsOrder: "UserIDs:String|GroupIDs:String|Delimiter:Char|Hierarchy:bool|" +
                            "DateFrom:DateTime|DateTo:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            ResumeLanguagesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        UserIDs: params.UserIDs, GroupIDs: params.GroupIDs, Hierarchy: params.Hierarchy, Delimiter: "|",
                        ParamsOrder: "UserIDs:String|GroupIDs:String|Delimiter:Char|Hierarchy:bool"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            UsersPerformanceReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        UserIDs: params.UserIDs || "", NodeIDs: params.NodeIDs || "",
                        ListIDs: params.ListIDs || "", KnowledgeTypeIDs: params.KnowledgeTypeIDs || "",
                        Delimiter: "|", BeginDate: params.BeginDate, FinishDate: params.FinishDate,
                        CompensatePerScore: params.CompensatePerScore || "", CompensationVolume: params.CompensationVolume || "",
                        ScoreItems: params.ScoreItems || "", InnerDelimiter: ":",
                        ParamsOrder: "UserIDs:String|NodeIDs:String|ListIDs:String|KnowledgeTypeIDs:String|Delimiter:Char|" +
                            "BeginDate:DateTime|FinishDate:DateTime|CompensatePerScore:bool|CompensationVolume:Double|" +
                            "ScoreItems:String|InnerDelimiter:Char"
                    };
                    ReportsAPI.GetReport(params);
                }
            }
        }, //end of USR
        CN: {
            _IconURL: "",

            NodesListReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "",
                        SearchText: params.SearchText || "",
                        Status: params.Status || "",
                        MinContributorsCount: params.MinContributorsCount || "0",
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        FormFilters: params.FormFilters || "", Delimiter: "~",
                        ParamsOrder: "NodeTypeID:Guid|SearchText:Base64|Status:String|MinContributorsCount:int" +
                            "|LowerCreationDateLimit:Datetime|UpperCreationDateLimit:Datetime|FormFilters:Structure|Delimiter:char"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            MostFavoriteNodesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        Count: params.Count || "",
                        NodeTypeID: params.NodeTypeID || "",
                        BeginDate: params.BeginDate || "",
                        FinishDate: params.FinishDate || "",
                        ParamsOrder: "Count:int|NodeTypeID:Guid|BeginDate:datetime|FinishDate:datetime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            NodeVisitDetailsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID,
                        NodeIDs: params.NodeIDs,
                        GrabSubNodeTypes: params.GrabSubNodeTypes,
                        CreatorGroupIDs: params.CreatorGroupIDs,
                        CreatorUserIDs: params.CreatorUserIDs,
                        UniqueVisitors: params.UniqueVisitors,
                        DateFrom: params.DateFrom,
                        DateTo: params.DateTo,
                        ParamsOrder: "NodeTypeID:Guid|NodeIDs:Structure|GrabSubNodeTypes:bool|CreatorGroupIDs:Structure" +
                            "|CreatorUserIDs:Structure|UniqueVisitors:bool|DateFrom:datetime|DateTo:datetime"
                    };
                    
                    ReportsAPI.GetReport(params);
                }
            },

            CreatorUsersReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeID: params.NodeID || "",
                        MembershipNodeTypeID: params.MembershipNodeTypeID || "",
                        MembershipNodeID: params.MembershipNodeID || "",
                        ParamsOrder: "NodeID:Guid|MembershipNodeTypeID:Guid|MembershipNodeID:Guid"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            NodeCreatorsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "", UserIDs: params.UserIDs || "",
                        NodeIDs: params.NodeIDs || "", Delimiter: '|', ShowPersonalItems: params.ShowPersonalItems,
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "NodeTypeID:Guid|UserIDs:String|NodeIDs:String|Delimiter:Char|" +
                            "ShowPersonalItems:bool|LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            UserCreatedNodesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "", UserID: params.UserID || "",
                        ShowPersonalItems: params.ShowPersonalItems,
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "NodeTypeID:Guid|UserID:Guid|ShowPersonalItems:bool|" +
                            "LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            NodesCreatedNodesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "",
                        CreatorNodeTypeID: params.CreatorNodeTypeID || "",
                        NodeIDs: params.NodeIDs || "", Delimiter: '|',
                        ShowPersonalItems: params.ShowPersonalItems,
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "NodeTypeID:Guid|CreatorNodeTypeID:Guid|NodeIDs:String|Delimiter:Char|" +
                            "ShowPersonalItems:bool|LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            NodeCreatedNodesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "",
                        CreatorNodeID: params.CreatorNodeID || "",
                        Status: params.Status,
                        ShowPersonalItems: params.ShowPersonalItems,
                        Published: params.Published,
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "NodeTypeID:Guid|CreatorNodeID:Guid|Status:String|" +
                            "ShowPersonalItems:bool|Published:bool|LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            NodesOwnNodesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "",
                        CreatorNodeTypeID: params.CreatorNodeTypeID || "",
                        NodeIDs: params.NodeIDs || "", Delimiter: '|',
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "NodeTypeID:Guid|CreatorNodeTypeID:Guid|NodeIDs:String|Delimiter:Char|" +
                            "LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            NodeOwnNodesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "",
                        CreatorNodeID: params.CreatorNodeID || "",
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "NodeTypeID:Guid|CreatorNodeID:Guid|" +
                            "LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            RelatedNodesCountReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID,
                        RelatedNodeTypeID: params.RelatedNodeTypeID,
                        CreationDateFrom: params.CreationDateFrom,
                        CreationDateTo: params.CreationDateTo,
                        In: params.In,
                        Out: params.Out,
                        InTags: params.InTags,
                        OutTags: params.OutTags,
                        ParamsOrder: "NodeTypeID:Guid|RelatedNodeTypeID:Guid|CreationDateFrom:DateTime|CreationDateTo:DateTime|" +
                            "In:Bool|Out:Bool|InTags:Bool|OutTags:Bool"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            RelatedNodesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeID: params.NodeID,
                        RelatedNodeTypeID: params.RelatedNodeTypeID,
                        CreationDateFrom: params.CreationDateFrom,
                        CreationDateTo: params.CreationDateTo,
                        In: params.In,
                        Out: params.Out,
                        InTags: params.InTags,
                        OutTags: params.OutTags,
                        ParamsOrder: "NodeID:Guid|RelatedNodeTypeID:Guid|CreationDateFrom:DateTime|CreationDateTo:DateTime|" +
                            "In:Bool|Out:Bool|InTags:Bool|OutTags:Bool"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            DownloadedFilesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeIDs: params.NodeTypeIDs,
                        UserIDs: params.UserIDs,
                        Delimiter: "|",
                        BeginDate: params.BeginDate,
                        FinishDate: params.FinishDate,
                        ParamsOrder: "NodeTypeIDs:String|UserIDs:String|Delimiter:Char|BeginDate:DateTime|FinishDate:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            }
        }, //end of CN
        KW: {
            _IconURL: "",

            KnowledgeAdminsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        Now: "1",
                        KnowledgeTypeID: params.KnowledgeTypeID || "",
                        UserIDs: params.UserIDs || "",
                        Delimiter: "~",
                        MemberInNodeTypeID: params.MemberInNodeTypeID || "",
                        CreatorGroupID: params.CreatorGroupID || "",
                        SendDateFrom: params.SendDateFrom || "",
                        SendDateTo: params.SendDateTo || "",
                        ActionDateFrom: params.ActionDateFrom || "",
                        ActionDateTo: params.ActionDateTo || "",
                        DelayFrom: params.DelayFrom || "",
                        DelayTo: params.DelayTo || "",
                        Seen: params.Seen,
                        Done: params.Done,
                        ParamsOrder: "Now:Now|KnowledgeTypeID:Guid|UserIDs:String|Delimiter:Char|MemberInNodeTypeID:Guid" +
                            "|CreatorGroupID:Guid|SendDateFrom:Datetime|SendDateTo:Datetime|ActionDateFrom:Datetime" +
                            "|ActionDateTo:Datetime|DelayFrom:Int|DelayTo:Int|Seen:Bool|Done:Bool"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            KnowledgeAdminsDetailReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        Now: "1",
                        KnowledgeID: params.KnowledgeID || "",
                        KnowledgeTypeID: params.KnowledgeTypeID || "",
                        UserIDs: params.UserIDs || "",
                        Delimiter: "~",
                        MemberInNodeTypeID: params.MemberInNodeTypeID || "",
                        CreatorGroupID: params.CreatorGroupID || "",
                        SendDateFrom: params.SendDateFrom || "",
                        SendDateTo: params.SendDateTo || "",
                        ActionDateFrom: params.ActionDateFrom || "",
                        ActionDateTo: params.ActionDateTo || "",
                        DelayFrom: params.DelayFrom || "",
                        DelayTo: params.DelayTo || "",
                        Seen: params.Seen,
                        Done: params.Done,
                        ParamsOrder: "Now:Now|KnowledgeID:Guid|KnowledgeTypeID:Guid|UserIDs:String|Delimiter:Char" +
                            "|MemberInNodeTypeID:Guid|CreatorGroupID:Guid|SendDateFrom:Datetime|SendDateTo:Datetime" +
                            "|ActionDateFrom:Datetime|ActionDateTo:Datetime|DelayFrom:Int|DelayTo:Int|Seen:Bool|Done:Bool"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            KnowledgeEvaluationsReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        Now: "1",
                        KnowledgeTypeID: params.KnowledgeTypeID || "",
                        UserIDs: params.UserIDs || "",
                        Delimiter: "~",
                        MemberInNodeTypeID: params.MemberInNodeTypeID || "",
                        CreatorGroupID: params.CreatorGroupID || "",
                        SendDateFrom: params.SendDateFrom || "",
                        SendDateTo: params.SendDateTo || "",
                        ActionDateFrom: params.ActionDateFrom || "",
                        ActionDateTo: params.ActionDateTo || "",
                        DelayFrom: params.DelayFrom || "",
                        DelayTo: params.DelayTo || "",
                        Seen: params.Seen,
                        Done: params.Done,
                        Canceled: params.Canceled,
                        ParamsOrder: "Now:Now|KnowledgeTypeID:Guid|UserIDs:String|Delimiter:Char|MemberInNodeTypeID:Guid" +
                            "|CreatorGroupID:Guid|SendDateFrom:Datetime|SendDateTo:Datetime|ActionDateFrom:Datetime" +
                            "|ActionDateTo:Datetime|DelayFrom:Int|DelayTo:Int|Seen:Bool|Done:Bool|Canceled:Bool"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            KnowledgeEvaluationsDetailReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        Now: "1",
                        KnowledgeID: params.KnowledgeID || "",
                        KnowledgeTypeID: params.KnowledgeTypeID || "",
                        UserIDs: params.UserIDs || "",
                        Delimiter: "~",
                        MemberInNodeTypeID: params.MemberInNodeTypeID || "",
                        CreatorGroupID: params.CreatorGroupID || "",
                        SendDateFrom: params.SendDateFrom || "",
                        SendDateTo: params.SendDateTo || "",
                        ActionDateFrom: params.ActionDateFrom || "",
                        ActionDateTo: params.ActionDateTo || "",
                        DelayFrom: params.DelayFrom || "",
                        DelayTo: params.DelayTo || "",
                        Seen: params.Seen,
                        Done: params.Done,
                        Canceled: params.Canceled,
                        ParamsOrder: "Now:Now|KnowledgeID:Guid|KnowledgeTypeID:Guid|UserIDs:String|Delimiter:Char" +
                            "|MemberInNodeTypeID:Guid|CreatorGroupID:Guid|SendDateFrom:Datetime|SendDateTo:Datetime" +
                            "|ActionDateFrom:Datetime|ActionDateTo:Datetime|DelayFrom:Int|DelayTo:Int|Seen:Bool|Done:Bool|Canceled:Bool"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            KnowledgeEvaluationsHistoryReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        KnowledgeTypeID: params.KnowledgeTypeID || "",
                        KnowledgeID: params.KnowledgeID || "",
                        UserIDs: params.UserIDs || "",
                        Delimiter: "~",
                        CreatorGroupID: params.CreatorGroupID || "",
                        DateFrom: params.DateFrom || "",
                        DateTo: params.DateTo || "",
                        ParamsOrder: "KnowledgeTypeID:Guid|KnowledgeID:Guid|UserIDs:String|Delimiter:Char" +
                            "|CreatorGroupID:Guid|DateFrom:Datetime|DateTo:Datetime"
                    };
                    ReportsAPI.GetReport(params);
                }
            }
        }, //end of KW
        FG: {
            _IconURL: "",

            FormsListReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        FormID: params.FormID || "",
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        FormFilters: params.FormFilters || "", Delimiter: "~",
                        ParamsOrder: "FormID:Guid|LowerCreationDateLimit:Datetime|UpperCreationDateLimit:Datetime" +
                            "|FormFilters:Structure|Delimiter:char"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            PollDetailReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        PollID: params.PollID || "",
                        NodeTypeID: params.NodeTypeID || "",
                        ParamsOrder: "PollID:Guid|NodeTypeID:Guid"
                    };
                    ReportsAPI.GetReport(params);
                }
            }
        }, //end of FG
        WF: {
            _IconURL: "",

            StateNodesCountReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "", WorkFlowID: params.WorkFlowID || "",
                        LowerCreationDateLimit: params.LowerCreationDateLimit, UpperCreationDateLimit: params.UpperCreationDateLimit,
                        ParamsOrder: "NodeTypeID:Guid|WorkFlowID:Guid|LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            },

            NodesWorkFlowStatesReport: {
                _IconURL: "",

                Get: function (params) {
                    params = params || {};
                    params.Parameters = {
                        NodeTypeID: params.NodeTypeID || "",
                        WorkFlowID: params.WorkFlowID || "", StateID: params.StateID,
                        TagID: params.TagID, CurrentState: params.CurrentState || "",
                        LowerCreationDateLimit: params.LowerCreationDateLimit || "",
                        UpperCreationDateLimit: params.UpperCreationDateLimit || "",
                        ParamsOrder: "NodeTypeID:Guid|WorkFlowID:Guid|StateID:Guid|TagID:Guid|" +
                            "CurrentState:bool|LowerCreationDateLimit:DateTime|UpperCreationDateLimit:DateTime"
                    };
                    ReportsAPI.GetReport(params);
                }
            }
        } //end of WF
    },

    SetGroupLimitsForAdmins: function (params) {
        params = params || {};

        var url = ReportsAPI.ResponseURL + "/SetGroupLimitsForAdmins?timeStamp=" + new Date().getTime();
        var queryString = (params.NodeTypeIDs ? "&NodeTypeIDs=" + params.NodeTypeIDs : "");
        return ReportsAPI._send(url, params, queryString);
    },

    _create_dictionary: function (json, delimiter, innerDelimiter) {
    },

    GetReport: function (params) {
        params = params || {};
        params.Parameters = params.Parameters || {};

        params.Parameters.ModuleIdentifier = params.ModuleIdentifier;
        params.Parameters.ReportName = params.ReportName;
        params.Parameters.Excel = params.Excel;
        //params.Parameters.RTL = RV_RTL;
        //params.Parameters.Lang = RV_Lang;
        params.Parameters.PageNumber = params.PageNumber;
        params.Parameters.PageSize = params.PageSize;
        params.Parameters.PS = params.Password;
        params.Parameters.ChartMode = params.ChartMode;
        params.Parameters.ChartDateFrom = params.ChartDateFrom;
        params.Parameters.ChartDateTo = params.ChartDateTo;
        params.Parameters.ChartPeriod = params.ChartPeriod;

        var url = ReportsAPI.ResponseURL + "/GetReport?timeStamp=" + new Date().getTime();
        var queryString = "";

        var isFirst = true;
        for (var p in (params.Parameters || {})) {
            queryString += (isFirst ? "" : "&") + p + "=" +
                (GlobalUtilities.get_type(params.Parameters[p]) == "boolean" ? params.Parameters[p] : params.Parameters[p] || "");
            isFirst = false;
        }

        if (params.Excel === true) {
            var dic = "";
            if (((RVDic.RPT || {})[params.Parameters.ModuleIdentifier] || {})[params.Parameters.ReportName]) {
                var _rvdic = RVDic.RPT[params.Parameters.ModuleIdentifier][params.Parameters.ReportName];

                for (var o in _rvdic) {
                    if (!(new RegExp(/^_/g)).test(o)) {
                        if (GlobalUtilities.get_type(_rvdic[o]) == "json") {
                            var _innerDic = "";
                            for (var _in in _rvdic[o])
                                _innerDic += (_innerDic == "" ? "" : "|") + Base64.encode(_in) + ":" + Base64.encode(_rvdic[o][_in]);
                            params.Parameters[o] = _innerDic;
                        }
                        else
                            dic += (dic == "" ? "" : "|") + Base64.encode(o) + ":" + Base64.encode(_rvdic[o]);
                    }
                }
            }

            params.Parameters.Dictionary = dic;
            GlobalUtilities.submit_form({ URL: url, Method: "post", RequestParams: params.Parameters });
        }
        else
            return ReportsAPI._send(url, params, queryString);
    }
};