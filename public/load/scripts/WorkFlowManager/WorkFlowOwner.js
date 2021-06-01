(function () {
    if (window.WorkFlowOwner) return;

    window.WorkFlowOwner = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID || "",
            SelectedWorkFlows: {}
        }

        var that = this;

        GlobalUtilities.load_files(["API/WFAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    WorkFlowOwner.prototype = {
        _preinit: function () {
            var that = this;

            WFAPI.GetOwnerWorkFlows({
                NodeTypeID: that.Objects.OwnerID, ParseResults: true,
                ResponseHandler: function (workflowsArr) {
                    that._initialize(workflowsArr);
                }
            });
        },

        _initialize: function (workflowsArr) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":12rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem;" + RV_Float + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CN.Service.WorkFlows + ":" }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "workflowInput" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" }
                    ]
                }
            ], that.ContainerDiv);

            var _input = GlobalUtilities.append_autosuggest(elems["workflowInput"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.WorkFlowSelect + "...",
                OnSelect: function () {
                    var workflowId = this.values[this.selectedIndex];
                    var workflowName = this.keywords[this.selectedIndex];

                    if (that.Objects.SelectedWorkFlows[workflowId]) return;

                    GlobalUtilities.block(elems["workflowInput"]);

                    WFAPI.AddOwnerWorkFlow({
                        NodeTypeID: that.Objects.OwnerID, WorkFlowID: workflowId,
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (!result.ErrorText) {
                                that.add_item(elems["itemsArea"], { WorkFlowID: workflowId, Name: workflowName });
                                _input.empty();
                            }

                            GlobalUtilities.unblock(elems["workflowInput"]);
                        }
                    });
                }
            });

            WFAPI.GetWorkFlows({
                ParseResults: true,
                ResponseHandler: function (result) {
                    var workflows = result.WorkFlows || [];
                    var arr = [];
                    for (var i = 0, lnt = workflows.length; i < lnt; ++i)
                        arr.push([Base64.decode(workflows[i].Name || ""), workflows[i].WorkFlowID]);
                    _input.bindArray(arr);
                }
            });

            for (var i = 0, lnt = (workflowsArr || []).length; i < lnt; ++i)
                that.add_item(elems["itemsArea"], workflowsArr[i]);
        },

        add_item: function (container, params) {
            params = params || {};
            var that = this;

            var workflowId = params.WorkFlowID || "";
            var workflowName = Base64.decode(params.Name || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder", Name: "itemDiv",
                    Style: "position:relative; padding:0.3rem; margin-top:0.3rem; font-size:0.6rem;" +
                        "padding-" + RV_Float + ":1.5rem; padding-" + RV_RevFloat + ":4rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton", Tooltip: RVDic.Remove,
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                var btn = this;
                                                if (btn.Processing) return;

                                                WFAPI.RemoveOwnerWorkFlow({
                                                    NodeTypeID: that.Objects.OwnerID, WorkFlowID: workflowId, ParseResults: true,
                                                    ResponseHandler: function (result) {
                                                        if (result.ErrorText)
                                                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                                        else {
                                                            elems["itemDiv"].parentNode.removeChild(elems["itemDiv"]);
                                                            that.Objects.SelectedWorkFlows[workflowId] = false;
                                                        }

                                                        btn.Processing = false;
                                                    }
                                                });
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem; color:blue; cursor:pointer;",
                            Properties: [{ Name: "onclick", Value: function () { that.show_messages(that.Objects.OwnerID, workflowId); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.Messages }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: workflowName }]
                        }
                    ]
                }
            ], container);

            that.Objects.SelectedWorkFlows[workflowId] = true;
        },

        show_messages: (function () {
            var _PrimaryKeys = {};

            return function (nodeTypeId, workflowId) {
                var that = this;

                var complexId = String(nodeTypeId) + String(workflowId);
                var pk = (_PrimaryKeys[complexId] || {}).Key;

                if (pk) {
                    GlobalUtilities.show(_PrimaryKeys[complexId].Div);
                    return;
                }

                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                WFAPI.GetOwnerWorkFlowPrimaryKey({
                    NodeTypeID: nodeTypeId, WorkFlowID: workflowId, ParseResults: true,
                    ResponseHandler: function (pk) {
                        _PrimaryKeys[complexId] = { Key: pk, Div: _div };

                        GlobalUtilities.load_files(["Notifications/MessageTemplates.js"], {
                            OnLoad: function () {
                                new MessageTemplates(_div, {
                                    OwnerID: pk,
                                    Options: { AudienceTypes: ["Creator", "Contributor", "SpecificNode"] }
                                });
                            }
                        });
                    }
                });
            }
        })()
    }
})();