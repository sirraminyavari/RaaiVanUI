(function () {
    if (window.WorkFlowsManager) return;

    window.WorkFlowsManager = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Options = {
            ActionTypes: params.ActionTypes,
            VariableTypes: params.VariableTypes
        };

        var that = this;

        GlobalUtilities.load_files(["API/WFAPI.js", "Public/NameDialog.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    WorkFlowsManager.prototype = {
        initialize: function () {
            var that = this;

            WFAPI.GetWorkFlows({
                ParseResults: true,
                ResponseHandler: function (result) {
                    that.Container.innerHTML = "";

                    var elems = GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "container"
                    }], that.Container);

                    that.new_item(elems["container"]);

                    jQuery.each((result || {}).WorkFlows || [], function (ind, val) {
                        that.add_item(elems["container"], val);
                    });
                }
            });
        },

        new_item: function (container) {
            var that = this;

            var btn = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.5rem;",
                Childs: [{
                    Type: "div", Style: "height:100%; font-size:1.2rem;", Name: "btn",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-air-button",
                    Childs: [{
                        Type: "middle", Style: "display:inline-block;",
                        Childs: [
                            {
                                Type: "i", Class: "fa fa-plus-circle fa-lg",
                                Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            },
                            { Type: "text", TextValue: RVDic.NewN.replace("[n]", RVDic.WorkFlow) }
                        ]
                    }]
                }]
            }], container)["btn"];

            var saving = false;

            btn.onclick = function () {
                if (saving) return;
                saving = true;

                new NameDialog({
                    Title: RVDic.Name, InnerTitle: RVDic.Name,
                    OnActionCall: function (name, callback) {
                        if (!name) return callback(!(saving = false));

                        WFAPI.CreateWorkFlow({
                            Name: Base64.encode(name), ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.WorkFlow) that.add_item(container, result.WorkFlow, true);

                                callback(!!(result || {}).WorkFlow);

                                saving = false;
                            }
                        });
                    }
                });
            };
        },

        add_item: function (container, item, add2top) {
            var that = this;

            var id = item.WorkFlowID;

            var action_button = function (p) {
                p = p || {};

                return {
                    Type: "div", Class: "small-4 medium-4 large-4", Style: "padding:0rem 0.25rem;",
                    Childs: [{
                        Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle", Name: p.Name,
                        Childs: [
                            {
                                Type: "i", Class: "fa " + p.Icon, Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            },
                            { Type: "text", TextValue: p.Title }
                        ]
                    }]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-6 large-4",
                Style: "padding:0.5rem; opacity:0;", Name: "container",
                Childs: [{
                    Type: "div",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-softer-soft",
                    Style: "position:relative; height:100%; padding:0.4rem; padding-bottom:3.5rem; text-align:center;",
                    Childs: [
                        {
                            Type: "div", Class: "rv-border-radius-quarter",
                            Style: "position:absolute; bottom:0.5rem; left:0.5rem; right:0.5rem;" +
                                "padding:0.3rem; background-color:white;",
                            Childs: [{
                                Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                                Childs: [
                                    action_button({ Name: "rename", Title: RVDic.Rename, Icon: "fa-i-cursor" }),
                                    action_button({ Name: "edit", Title: RVDic.Edit, Icon: "fa-pencil" }),
                                    action_button({ Name: "remove", Title: RVDic.Remove, Icon: "fa-times" })
                                ]
                            }]
                        },
                        {
                            Type: "middle", Style: "display:inline-block; font-size:1rem;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(item.Name), Name: "wfName" }]
                        }
                    ]
                }]
            }]);

            if (!add2top) container.appendChild(elems["container"]);
            else container.insertBefore(elems["container"], (container.firstChild || {}).nextSibling);

            jQuery(elems["container"]).animate({ opacity: 1 }, 500);

            elems["rename"].onclick = function () {
                that.rename(item, function (name) {
                    item.Name = Base64.encode(name);
                    elems["wfName"].data = GlobalUtilities.convert_numbers_to_persian(name);
                });
            };

            elems["edit"].onclick = function () { that.edit(item); }

            elems["remove"].onclick = function () {
                that.remove(item, function () {
                    jQuery(elems["container"]).fadeOut(500, function () { jQuery(elems["container"]).remove(); });
                });
            };
        },

        rename: function (item, done) {
            var that = this;

            if (that.SavingName) return;
            that.SavingName = true;
            
            new NameDialog({
                Title: RVDic.NewN.replace("[n]", RVDic.Name), InitialValue: Base64.decode(item.Name), InnerTitle: RVDic.Name,
                OnActionCall: function (name, callback) {
                    if (!name) return callback(!(that.SavingName = false));

                    WFAPI.ModifyWorkFlow({
                        WorkFlowID: item.WorkFlowID, Name: Base64.encode(name), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) done(name);

                            callback(!!(result || {}).Succeed);

                            that.SavingName = false;
                        }
                    });
                }
            });
        },

        edit: function (item) {
            var that = this;

            var showOptions = { Style: "margin-top:1rem; height:calc(100vh - 2rem);" };

            that.WFManagers = that.WFManagers || [];

            if (that.WFManagers[item.WorkFlowID]) return GlobalUtilities.show(that.WFManagers[item.WorkFlowID], showOptions);

            var _div = that.WFManagers[item.WorkFlowID] = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-11 large-11 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem; height:100%;", Name: "_div"
            }])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div, showOptions);

            GlobalUtilities.load_files(["WorkFlowManager/WorkFlowManager.js"], {
                OnLoad: function () {
                    new WorkFlowManager(_div, {
                        WorkFlowID: item.WorkFlowID,
                        ActionTypes: that.Options.ActionTypes,
                        VariableTypes: that.Options.VariableTypes
                    });
                }
            });
        },

        remove: function (item, done) {
            var that = this;

            if (that.Removing) return;
            that.Removing = true;

            var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + Base64.decode(item.Name) + "'");

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return (that.Removing = false);

                WFAPI.RemoveWorkFlow({
                    WorkFlowID: item.WorkFlowID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            var err = RVDic.MSG[result.ErrorText] || result.ErrorText;
                            if (String(err).indexOf("[n]") >= 0)
                                err = RVDic.Error + ": " + err.replace("[n]", "'" + result.ItemsCount + "'")

                            alert(err);
                        }
                        else if (result.Succeed) done();

                        that.Removing = false;
                    }
                });
            });
        }
    };
})();