(function () {
    if (window.KnowledgeEvaluation) return;

    window.KnowledgeEvaluation = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = GlobalUtilities.extend({
            NodeID: null,
            Evaluators: null,
            NodeSelectType: null,
            Nodes: {},
            CurrentNode: null
        }, params);
        
        this.Options = {
            SelectMode: params.SelectMode === true,
            OnUserExist: params.OnUserExist
        };
        
        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["KnowledgeAPI", "UsersAPI"]}], {
            OnLoad: function () { that._initialize(); }
        });
    }

    KnowledgeEvaluation.prototype = {
        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            switch (that.Objects.Evaluators) {
                case "KnowledgeAdmin":
                    return that.Options.SelectMode ? null : that.send();
                case "Experts":
                    return that.get_related_nodes("GetExperts", { Hierarchy: true });
                case "AdminMembers":
                    return that.get_related_nodes("GetMembers", { Admin: true });
                case "Members":
                    return that.get_related_nodes("GetMembers");
                case "ExpertsAndMembers":
                    return that.get_related_nodes(["GetExperts", "GetMembers"], { Hierarchy: true });
                default:
                    return that.Options.SelectMode ? null : that.default_buttons();
            }
        },

        default_buttons: function () {
            var that = this;

            var _send_request = function (apiFunc) {
                GlobalUtilities.block(that.ContainerDiv);

                KnowledgeAPI[apiFunc]({ NodeID: that.Objects.NodeID, Description: that.Objects.Description,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        GlobalUtilities.unblock(that.ContainerDiv);

                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (that.Objects.Succeed) that.Objects.Succeed(result);
                    }
                });
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-7", Style: "margin:0rem auto;",
                    Childs: [
                        {
                            Type: "div", Class: "small-5 medium-5 large-5 ActionButton", Style: "font-weight:bold;",
                            Properties: [{ Name: "onclick", Value: function () { _send_request("AcceptKnowledge"); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.Accept }]
                        },
                        { Type: "div", Class: "small-2 medium-2 large-2" },
                        {
                            Type: "div", Class: "small-5 medium-5 large-5 ActionButton", Style: "font-weight:bold;",
                            Properties: [{ Name: "onclick", Value: function () { _send_request("RejectKnowledge"); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.Reject }]
                        }
                    ]
                }
            ], that.ContainerDiv);
        },

        send: function (userIds, users) {
            var that = this;

            var onBeforeSave = that.Objects.OnBeforeSave || function (ids, callback) { callback(ids); }

            onBeforeSave(userIds, function (uIds) {
                if (uIds === false) return;

                KnowledgeAPI.SendToEvaluators({ NodeID: that.Objects.NodeID, Description: that.Objects.Description,
                    UserIDs: (uIds || userIds || []).join("|"), ParseResults: true,
                    ResponseHandler: function (result) {
                        GlobalUtilities.unblock(that.ContainerDiv);

                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (that.Objects.Succeed) that.Objects.Succeed(result);
                    }
                })
            }, users);
        },

        get_related_nodes: function (apiFunc, requestData) {
            var that = this;

            var USERS = {};

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodesArea" },
                { Type: "hr", Class: "small-12 medium-12 large-12" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "usersArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", 
                    Style: "text-align:center; display:none;", Name: "actionButtonContainer",
                    Childs: [{
                        Type: "div", Class: "rv-air-button rv-circle", Name: "actionButton",
                        Style: "display:inline-block; padding:0.3rem 2rem; margin-top:1rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.SendToSelectedUsers }]
                    }]
                }
            ], that.ContainerDiv);

            elems["actionButton"].onclick = function () {
                var uids = {};
                
                for (var nid in USERS) {
                    (USERS[nid] || []).filter(function (f) { return !!f.Selected; })
                        .forEach(function (x) { uids[x.UserID] = x; });
                }

                var arrUserIds = [];
                for (var _uid in uids) arrUserIds.push(_uid);

                if (arrUserIds.length == 0) return alert(RVDic.NoUserSelected);

                that.send(arrUserIds, uids);
            };

            var _add_node = function (nd) {
                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter SoftBorder", Name: "container",
                        Style: "display:inline-block; padding:0.3rem; margin:0.3rem;" +
                            "margin-" + RV_Float + ":0rem; cursor:pointer;",
                        Properties: [{ Name: "onclick", Value: function () { _show_users(nd.NodeID); } }],
                        Childs: [{ Type: "text", TextValue: nd.Name }]
                    }
                ], elems["nodesArea"]);

                that.Objects.Nodes[nd.NodeID] = _el["container"];
            };

            var _select_user = function (userDiv, usr, select) {
                usr.Selected = select;
            };

            var _add_user = function (usr, nid) {
                var fullname = usr.FirstName + " " + usr.LastName;
                var trimedFullname = GlobalUtilities.trim2pix(fullname, 100, { Postfix: "..." });

                var navigateUrl = UsersAPI.UserPageURL({ UserID: usr.UserID });

                var el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow", Name: "container",
                        Style: "padding:0.5rem; display:inline-block; margin:0.3rem; margin-" + RV_Float + ":0rem;",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; width:1.5rem;",
                                Childs: [
                                    {
                                        Type: "checkbox", Name: "chb",
                                        Params: {
                                            Width: 16, Height: 16, Checked: usr.Selected === true,
                                            OnClick: function (e, done) { _select_user(el["container"], usr, !this.checked); }
                                        }
                                    }
                                ]
                            },
                            {
                                Type: "div", Style: "display:inline-block; width:3.5rem;",
                                Childs: [
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter",
                                        Style: "width:3rem; height:3rem;", Link: navigateUrl,
                                        Attributes: [{ Name: "src", Value: usr.ImageURL }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Style: "display:inline-block; cursor:pointer;",
                                Tooltip: (fullname == trimedFullname ? null : fullname),
                                Properties: [
                                    {
                                        Name: "onclick",
                                        Value: function () {
                                            _select_user(el["container"], usr, true);
                                            el["chb"].check();
                                        }
                                    }
                                ],
                                Childs: [{ Type: "text", TextValue: trimedFullname }]
                            }
                        ]
                    }
                ], elems["usersArea"]);
            };

            var _show_users = function (nid) {
                if (nid == that.Objects.CurrentNode) return;

                var _curNode = that.Objects.CurrentNode ? that.Objects.Nodes[that.Objects.CurrentNode] : null;
                var _newNode = that.Objects.Nodes[nid];

                that.Objects.CurrentNode = nid;

                elems["usersArea"].innerHTML = "";

                for (var i = 0, lnt = (USERS[nid] || []).length; i < lnt; ++i)
                    _add_user(USERS[nid][i], nid);

                if ((USERS[nid] || []).length == 0)
                    elems["usersArea"].innerHTML = "<div class='small-12 medium-12 large-12' " +
                        "style='text-align:center; font-weight:bold;'>" + RVDic.NoUserFound + "</div>";
            };

            var _done = function (relatedNodes) {
                if (GlobalUtilities.get_type(apiFunc) != "array") apiFunc = [apiFunc];

                apiFunc = apiFunc.reverse();

                var callMethod = function () {
                    if (!apiFunc.length) return;

                    var funcName = apiFunc.pop();

                    CNAPI[funcName](GlobalUtilities.extend(requestData || {}, {
                        NodeIDs: (relatedNodes || []).map(function (x) { return x.NodeID; }).join("|"), ParseResults: true,
                        ResponseHandler: function (result) {
                            (result || []).forEach(function (x) {
                                USERS[x.NodeID] = USERS[x.NodeID] || [];

                                (x.Experts || x.Members || []).filter(function (usr) {
                                    return !USERS[x.NodeID].some(function (a) { return a.UserID == usr.UserID; });
                                }).forEach(function (usr) { USERS[x.NodeID].push(usr); });
                            });

                            if (apiFunc.length) return callMethod();

                            var userExists = false;

                            for (var id in USERS) {
                                if (USERS[id].length) userExists = true;

                                USERS[id].forEach(function (u) {
                                    u = GlobalUtilities.extend(u, {
                                        FirstName: Base64.decode(u.FirstName),
                                        LastName: Base64.decode(u.LastName),
                                        UserName: Base64.decode(u.UserName)
                                    });
                                });
                            }

                            if (userExists && that.Options.OnUserExist) that.Options.OnUserExist();

                            elems["nodesArea"].innerHTML = "";

                            (relatedNodes || []).forEach(function (x) { _add_node(x); });

                            if ((relatedNodes || []).length > 0) _show_users(relatedNodes[0].NodeID);

                            elems["actionButtonContainer"].style.display = "block";
                        }
                    }));
                };

                callMethod();
            };

            GlobalUtilities.loading(elems["nodesArea"]);

            var _parse_nodes = function (nds) {
                var arr = [];

                for (var i = 0, lnt = (nds || []).length; i < lnt; ++i) {
                    arr.push({
                        NodeID: nds[i].NodeID,
                        Name: Base64.decode(nds[i].NodeName || nds[i].Name),
                        NodeType: Base64.decode(nds[i].NodeType)
                    });
                }

                _done(arr);
            };
            
            if (that.Objects.NodeSelectType == "Fixed") {
                KnowledgeAPI.GetCandidateRelations({
                    KnowledgeID: that.Objects.NodeID, ParseResults: true,
                    ResponseHandler: function (result) { _parse_nodes(result.Nodes); }
                });
            }
            else {
                GlobalUtilities.load_files(["API/CNAPI.js"], {
                    OnLoad: function () {
                        var outTags = (that.Objects.NodeSelectType != "Single") && (that.Objects.NodeSelectType != "Limited");
                        
                        new CNAPI.GetRelatedNodes({
                            NodeID: that.Objects.NodeID, Out: true, OutTags: outTags, ParseResults: true,
                            ResponseHandler: function (result) { _parse_nodes(result.Nodes); }
                        });
                    }
                });
            }
        }
    }
})();