(function () {
    if (window.ResumeReportParameters) return;

    window.ResumeReportParameters = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            UsersRadio: null,
            GroupsRadio: null,
            UsersList: null,
            GroupSelect: null,
            HierarchyCheckbox: null,
            BeginDate: null,
            FinishDate: null,
            Config: GlobalUtilities.extend({
                Groups: [],
                FullAccess: false,
                GroupAdminAccess: false
            }, params.Config)
        };
        
        this.Options = {
            IgnoreDate: params.IgnoreDate
        };

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI"] },
            "SingleDataContainer/NewSingleDataContainer.js",
            "Reports/ReportGroupSelect.js"
        ], { OnLoad: function () { that._initialize(params, done); } });
    }

    ResumeReportParameters.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var radioName = GlobalUtilities.random_str(10);
            var usersId = GlobalUtilities.random_str(20);
            var groupsId = GlobalUtilities.random_str(20);
            var usersRadioName = usersId + "_radio";
            var groupsRadioName = groupsId + "_radio";

            var radio_section = function (options) {
                return {
                    Type: "div", Style: "display:flex; flex-flow:row; margin-bottom:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "input", Name: options.RadioName,
                                Attributes: [
                                    { Name: "type", Value: "radio" },
                                    { Name: "name", Value: radioName },
                                    { Name: "value", Value: (options || {}).Value },
                                    (!(options || {}).Selected ? null : { Name: "checked", Value: true })
                                ],
                                Properties: [{ Name: "onchange", Value: function () { options.OnChange(this.checked); } }]
                            }]
                        },
                        {
                            Type: "div", Style: "flex:0 0 auto;",
                            Properties: [{ Name: "onclick", Value: () => jQuery(elems[options.RadioName]).click() }],
                            Childs: [{ Type: "text", TextValue: (options || {}).Title }]
                        }
                    ]
                };
            };

            var show = function (id) {
                jQuery("#" + id + " *").attr("disabled", false).on('click').css({ 'pointer-events': '', 'opacity': 1 });
            };

            var hide = function (id) {
                jQuery("#" + id + " *").attr("disabled", "disabled").off('click').css({ 'pointer-events': 'none', 'opacity': 0.8 });
            };

            var elems = GlobalUtilities.create_nested_elements([
                (!that.Objects.Config.FullAccess ? null : radio_section({
                    Title: RVDic.BasedOnUsers,
                    Value: "Users", Selected: true,
                    RadioName: usersRadioName,
                    OnChange: () => (show(usersId), hide(groupsId))
                })),
                (!that.Objects.Config.FullAccess ? null : {
                    Type: "div", ID: usersId, Class: "small-12 medium-10 large-7", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.Users) + ":" }]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "usersList" }
                    ]
                }),
                { Type: "div", Class: "small-12 medium-12 large-12" },
                (!that.Objects.Config.FullAccess ? null : radio_section({
                    Title: RVDic.BasedOnGroups,
                    Value: "Groups",
                    RadioName: groupsRadioName,
                    OnChange: () => (show(groupsId), hide(usersId))
                })),
                {
                    Type: "div", ID: groupsId, Style: "margin-bottom:2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "margin-bottom:1rem; display:flex; flex-flow:row;",
                            Childs: [
                                {
                                    Type: "div", Style: "flex:0 0 auto; width:7rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.Groups) + ":" }]
                                },
                                { Type: "div", Style: "flex:1 1 auto;", Name: "groups" }
                            ]
                        },
                        (!that.Objects.Config.FullAccess ? null : {
                            Type: "div", Style: "display:flex; flex-flow:row;",
                            Childs: [
                                {
                                    Type: "div", Style: "flex:0 0 auto;",
                                    Childs: [{Type: "checkbox", Style: "width:1.2rem; height:1.2rem;", Name: "hierarchy"}]
                                },
                                {
                                    Type: "div", Style: "flex:1 0 auto; padding-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.ConsideringTheSubGroups }]
                                }
                            ]
                        })
                    ]
                },
                (that.Options.IgnoreDate ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
                    ]
                })
            ], that.ContainerDiv);

            if (that.Objects.Config.FullAccess) setTimeout(() => hide(groupsId), 100);

            that.Objects.UsersRadio = elems[usersRadioName];
            that.Objects.GroupsRadio = elems[groupsRadioName];
            that.Objects.HierarchyCheckbox = elems["hierarchy"];

            that.Objects.UsersList = !that.Objects.Config.FullAccess ? null : new NewSingleDataContainer(elems["usersList"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                NoButtons: true,
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    var users = JSON.parse(responseText).Users || [];
                    var arr = [];
                    for (var i = 0, lnt = users.length; i < lnt; ++i) {
                        var fullname = Base64.decode(users[i].FirstName) + " " + Base64.decode(users[i].LastName);
                        arr.push([fullname + " - " + Base64.decode(users[i].UserName), users[i].UserID]);
                    }
                    return arr;
                }
            });

            that.Objects.GroupSelect = new ReportGroupSelect(elems["groups"], {
                Groups: that.Objects.Config.Groups,
                MultiSelect: true,
                AdminMode: that.Objects.Config.FullAccess,
                NodeTypesSelectable: false
            });

            if (!that.Options.IgnoreDate) {
                GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) {
                    that.Objects.BeginDate = cal;
                });

                GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) {
                    that.Objects.FinishDate = cal;
                });
            }

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (that.Objects.HierarchyCheckbox)
                that.Objects.HierarchyCheckbox[!!params.Hierarchy ? "check" : "uncheck"]();

            if (!that.Options.IgnoreDate) {
                if (params.DateFrom && that.Objects.BeginDate)
                    that.Objects.BeginDate.Set({ Value: params.DateFrom.Value, Label: params.DateFrom.Title });

                if (params.DateTo && that.Objects.FinishDate)
                    that.Objects.FinishDate.Set({ Value: params.DateTo.Value, Label: params.DateTo.Title });
            }
        },

        get_data: function () {
            var that = this;

            var itemType = (that.Objects.UsersRadio || {}).checked ? "Users" : "Groups";
            var items = !that.Objects.GroupSelect ? {} : that.Objects.GroupSelect.get_items() || {};

            if ((itemType == "Groups") && !that.Objects.Config.FullAccess && !(items.Nodes || []).length) {
                alert(RVDic.Checks.PleaseSelectTheGroups);
                return false;
            }

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return GlobalUtilities.extend({
                UserIDs: itemType == "Users" && that.Objects.UsersList ? that.Objects.UsersList.get_items_string("|") : "",
                GroupIDs: itemType == "Groups" ? (items.Nodes || []).map(itm => itm.NodeID).join("|") : "",
                Hierarchy: !that.Objects.HierarchyCheckbox ? null : that.Objects.HierarchyCheckbox.Checked
            }, that.Options.IgnoreDate ? {} : {
                DateFrom: beginDate.Value,
                _Title_DateFrom: beginDate.Label,
                DateTo: finishDate.Value,
                _Title_DateTo: finishDate.Label
            });
        },

        clear: function () {
            var that = this;

            if (that.Objects.UsersRadio) jQuery(that.Objects.UsersRadio).click();
            if (that.Objects.UsersList) that.Objects.UsersList.clear();
            if (that.Objects.GroupSelect) that.Objects.GroupSelect.clear();
            if (that.Objects.HierarchyCheckbox) that.Objects.HierarchyCheckbox.uncheck();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();