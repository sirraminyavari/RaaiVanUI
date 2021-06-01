(function () {
    if (window.DashboardTypes) return;

    window.DashboardTypes = {
        Lib: {
            info_item: function (options) {
                options = options || {};

                return {
                    Type: "div", Class: "rv-border-radius-quarter SoftShadow", Tooltip: options.Tooltip,
                    Style: "display:inline-block; margin-top:0.5rem; margin-" + RV_RevFloat + ":0.3rem;" +
                        "background-color:white; padding:0.1rem 0.3rem; font-size:0.7rem;" + options.Style,
                    Childs: [
                        (!options.Title ? null : {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem; color:rgb(80,80,80);",
                            Childs: [{ Type: "text", TextValue: options.Title + ":" }]
                        }),
                        (!options.Icon ? null : {
                            Type: "i", Class: "fa " + options.Icon, Style: "margin-" + RV_RevFloat + ":0.3rem; color:rgb(120,120,120);",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }),
                        {
                            Type: "div", Style: "display:inline-block; color:rgb(120,120,120);",
                            Childs: [{ Type: "text", TextValue: options.Value }]
                        }
                    ]
                };
            }
        },

        Knowledge: {
            view: function (item) {
                var info = (item || {}).Info || {};

                var subType = (item || {}).SubType || "";
                var transSubtype = RVDic.NTFN.DashboardSubTypes[subType];

                var isComment = subType == "KnowledgeComment";

                var fullname = isComment ? "" : GlobalUtilities.trim(Base64.decode(info.FirstName, { UTF: 16 }) + " " +
                    Base64.decode(info.LastName, { UTF: 16 }));
                var trFullname = GlobalUtilities.trim2pix(fullname, 150, { Postfix: "..." });
                var fnTip = fullname == trFullname ? null : fullname;

                var notify = ["EvaluationDone", "KnowledgeComment"].some(function (x) { return x == subType; });
                
                return [
                    DashboardTypes.Lib.info_item({ Title: RVDic.State + "/" + RVDic.Event, Value: transSubtype }),
                    (!item.NodeAdditionalID ? null : DashboardTypes.Lib.info_item({ Title: RVDic.Code, Value: Base64.decode(item.NodeAdditionalID) })),
                    (!fullname ? null : DashboardTypes.Lib.info_item({ Icon: "fa-user", Value: trFullname, Tooltip: fnTip })),
                    (!notify ? null : DashboardTypes.Lib.info_item({ Value: RVDic.ToNotify, Style: "color:green;" })),
                    (!item.SendDate ? null : DashboardTypes.Lib.info_item({ Value: item.SendDate })),
                    (isNaN(+info.WFVersionID || "_") || (+info.WFVersionID <= 1) ? null :
                        DashboardTypes.Lib.info_item({ Value: RVDic.ReEvaluation }))
                ];
            }
        },

        WorkFlow: {
            get_action: function (item) {
                var info = (item || {}).Info || {};

                return true || !info.DataNeedInstanceID ? null : function (e) {
                    e.stopPropagation();
                    GlobalUtilities.link_click(e, RVAPI.DataNeedInstancePageURL({ InstanceID: info.DataNeedInstanceID }));
                };
            },

            removable: function (item) {
                return ((item || {}).Removable === true) || ((item || {}).Done === true);
            },

            view: function (item) {
                var info = (item || {}).Info || {};

                var _wfname = Base64.decode(info.WorkFlowName, { UTF: 16 });
                var _trwfname = GlobalUtilities.trim2pix(_wfname, 150, { Postfix: "..." });
                var _wfnametip = _wfname == _trwfname ? null : _wfname;

                var _wfstate = Base64.decode(info.WorkFlowState, { UTF: 16 });
                var _trwfstate = GlobalUtilities.trim2pix(_wfstate, 150, { Postfix: "..." });
                var _wfstatetip = _wfstate == _trwfstate ? null : _wfstate;

                return [
                    DashboardTypes.Lib.info_item({ Title: RVDic.WorkFlow, Value: _trwfname, Tooltip: _wfnametip }),
                    DashboardTypes.Lib.info_item({ Title: RVDic.State, Value: _trwfstate, Tooltip: _wfstatetip }),
                    (!item.NodeAdditionalID ? null : DashboardTypes.Lib.info_item({ Title: RVDic.Code, Value: Base64.decode(item.NodeAdditionalID) })),
                    (!item.Removable ? null : DashboardTypes.Lib.info_item({ Value: RVDic.CommentNeeded, Style: "color:green;" })),
                    (!info.DataNeedInstanceID ? null : DashboardTypes.Lib.info_item({ Value: RVDic.DataNeed, Style: "color:green;" })),
                    (!item.SendDate ? null : DashboardTypes.Lib.info_item({ Value: item.SendDate }))
                ];
            }
        }
    }
})();