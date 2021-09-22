(function () {
    if (window.ReportOptions && window.ReportOptions.RV && window.ReportOptions.RV.LogsReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.RV = window.ReportOptions.RV || {};

    window.ReportOptions.RV.LogsReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Objects = {
            BeginDate: null,
            FinishDate: null,
            NotAuthorizedCheckbox: null,
            AnonymousCheckbox: null,
            UserSelect: null,
            LevelSelect: null,
            ActionsContainer: null,
            IPsContainer: null,
            VariableName: "LogReportTemplates" + "_" + String(window.RVGlobal.CurrentUserID).toLowerCase(),
            Templates: {}
        };

        var that = this;

        GlobalUtilities.load_files([
            "Lang/Log/fa.js",
            "SingleDataContainer/NewSingleDataContainer.js"
        ], { OnLoad: function () { that._preinit(params, done); } });
    }

    ReportOptions.RV.LogsReport.prototype = {
        _preinit: function (params, done) {
            var that = this;

            RVAPI.GetVariable({
                Name: that.Objects.VariableName, ParseResults: true,
                ResponseHandler: function (r) {
                    that.Objects.Templates = r.Value ? JSON.parse(Base64.decode(r.Value || {})) : {};
                    that._initialize(params, done);
                }
            });
        },

        _initialize: function (params, done) {
            params = params || {};
            var that = this;

            var levelOptions = [];

            var add_level_option = function (name) {
                levelOptions.push({
                    Type: "option",
                    Attributes: [{ Name: "title", Value: name }],
                    Childs: [{ Type: "text", TextValue: ((((RVDic.RPT || {}).RV || {}).LogsReport || {}).Level_Dic || {})[name] || name }]
                });
            };

            add_level_option("");
            add_level_option("Info");
            add_level_option("Warn");
            add_level_option("Error");
            add_level_option("Trace");

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Childs: [
                    {
                        Type: "div", Style: "display:inline-block;",
                        Childs: [{ Type: "text", TextValue: RVDic.NotAuthorizedRequest + ":" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin:0rem 0.5rem;",
                        Childs: [{ Type: "checkbox", Name: "notAuthorized" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":1.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Anonymous + ":" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin:0rem 0.5rem;",
                        Childs: [{ Type: "checkbox", Name: "anonymous" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":2rem;",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.UserSelect + ":" }]
                            },
                            { Type: "div", Style: "display:inline-block; width:15rem;", Name: "userSelect" }
                        ]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":2rem;",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.LevelSelect + ":" }]
                            },
                            {
                                Type: "select", Class: "rv-input", Name: "levelSelect",
                                Style: "display:inline-block; width:15rem; font-size:0.7rem;",
                                Childs: levelOptions
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-8 large-6", Name: "logActionsContainer",
                        Style: "display:none; margin:1rem 0rem; position:relative; padding-" + RV_Float + ":10rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.LimitActionsTo + ":" }]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "logActions" }
                        ]
                    },
                    {Type: "div", Class: "small-12 medium-12 large-12"},
                    {
                        Type: "div", Class: "small-12 medium-8 large-6", Name: "ipsContainer",
                        Style: "display:none; margin:1rem 0rem; position:relative; padding-" + RV_Float + ":10rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.RPT.RV.LogsReport.HostAddress + ":" }]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "ipAddresses" }
                        ]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":2rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.ActionDate + ":" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                    },
                    { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                    {
                        Type: "div", Style: "display:inline-block; margin:0rem 1.5rem; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                    },
                    { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
                ]
            }], that.ContainerDiv);

            that.Objects.UserSelect = GlobalUtilities.append_autosuggest(elems["userSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
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

            elems["logActionsContainer"].style.display = "block";
            elems["ipsContainer"].style.display = "block";

            GlobalUtilities.loading(elems["logActions"]);

            RVAPI.GetLogActions({
                ParseResults: true,
                ResponseHandler: function (arr) {
                    if (GlobalUtilities.get_type(arr) != "array") return;

                    var ds = [];
                    for (var i = 0, lnt = arr.length; i < lnt; ++i) {
                        var title = ((window.RaaiVanDic || {}).Log || {})[arr[i]] || arr[i];
                        ds.push([title, arr[i]]);
                    }

                    that.Objects.ActionsContainer = new NewSingleDataContainer(elems["logActions"], {
                        InputClass: "rv-input",
                        InputStyle: "width:100%; font-size:0.7rem;",
                        ArrayDataSource: ds,
                        NoButtons: true
                    });
                }
            });

            that.Objects.IPsContainer = new NewSingleDataContainer(elems["ipAddresses"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                EnableTextItem: true,
                NoButtons: true
            });

            GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) {
                that.Objects.BeginDate = cal;
            });

            GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) {
                that.Objects.FinishDate = cal;
            });

            that.Objects.NotAuthorizedCheckbox = elems["notAuthorized"];
            that.Objects.AnonymousCheckbox = elems["anonymous"];

            that.Objects.LevelSelect = elems["levelSelect"];
            
            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.BeginDate && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.BeginDate.Value, Label: params.BeginDate.Title });

            if (params.FinishDate && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.FinishDate.Value, Label: params.FinishDate.Title });

            if (params.NotAuthorized) that.Objects.NotAuthorizedCheckbox.check();
            if (params.Anonymous) that.Objects.AnonymousCheckbox.check();

            if (params.UserID) this.Objects.UserSelect.set_item(params.UserID.Value || "", params.UserID.Title || "");

            if (params.Level) {
                for (var i = 0, lnt = that.Objects.LevelSelect.length; i < lnt; ++i)
                    if (that.Objects.LevelSelect[i].title == params.Level) that.Objects.LevelSelect.selectedIndex = i;
            }

            if ((GlobalUtilities.get_type(params.Actions) == "array") && that.Objects.ActionsContainer) {
                for (var i = 0, lnt = params.Actions.length; i < lnt; ++i)
                    that.Objects.ActionsContainer.add_item(params.Actions[i], params.Actions[i]);
            }

            if ((GlobalUtilities.get_type(params.IPAddresses) == "array") && that.Objects.IPsContainer) {
                for (var i = 0, lnt = params.IPAddresses.length; i < lnt; ++i)
                    that.Objects.IPsContainer.add_item(params.IPAddresses[i], params.IPAddresses[i]);
            }
        },

        get_data: function () {
            var that = this;

            var index = !this.Objects.UserSelect ? -1 : this.Objects.UserSelect.selectedIndex;
            var userId = index < 0 ? "" : this.Objects.UserSelect.values[index];
            var fullname = GlobalUtilities.trim(index < 0 ? "" : this.Objects.UserSelect.keywords[index]);

            if (userId && (GlobalUtilities.trim(this.Objects.UserSelect.InputElement.value) != fullname))
                userId = fullname = "";

            var beginDate = (that.Objects.BeginDate || { Get: function () { return {} } }).Get();
            var finishDate = (that.Objects.FinishDate || { Get: function () { return {} } }).Get();

            var actions = !that.Objects.ActionsContainer ? [] : that.Objects.ActionsContainer.get_items();
            var ipAddresses = !that.Objects.IPsContainer ? [] : that.Objects.IPsContainer.get_items();

            return {
                UserID: userId, _Title_UserID: fullname,
                Actions: Base64.encode(JSON.stringify({
                    Name: "StringTableType",
                    Types: { Value: "Base64" },
                    Items: actions.map(itm => ({ Value: Base64.encode(itm.ID) }))
                })),
                IPAddresses: Base64.encode(JSON.stringify({
                    Name: "StringTableType",
                    Types: { Value: "Base64" },
                    Items: ipAddresses.map(itm => ({ Value: Base64.encode(itm.ID) }))
                })),
                Level: that.Objects.LevelSelect[that.Objects.LevelSelect.selectedIndex].title || "",
                NotAuthorized: that.Objects.NotAuthorizedCheckbox.checked,
                Anonymous: that.Objects.AnonymousCheckbox.checked,
                BeginDate: beginDate.Value || "",
                _Title_BeginDate: beginDate.Label || "",
                FinishDate: finishDate.Value || "",
                _Title_FinishDate: finishDate.Label || ""
            };
        },

        clear: function () {
            var that = this;

            if (this.Objects.BeginDate) this.Objects.BeginDate.Clear();
            if (this.Objects.FinishDate) this.Objects.FinishDate.Clear();
            this.Objects.NotAuthorizedCheckbox.uncheck();
            this.Objects.AnonymousCheckbox.uncheck();
            if (this.Objects.UserSelect) this.Objects.UserSelect.empty();
            this.Objects.LevelSelect.selectedIndex = 0;
            if (this.Objects.ActionsContainer) this.Objects.ActionsContainer.clear();
            if (this.Objects.IPsContainer) this.Objects.IPsContainer.clear();
        }
    }
})();