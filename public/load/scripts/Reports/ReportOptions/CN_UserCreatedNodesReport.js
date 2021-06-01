(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.UserCreatedNodesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.UserCreatedNodesReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            UserSelect: null,
            ShowPersonalItemsSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.CN.UserCreatedNodesReport.prototype = {
        _initialize: function (params, done) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;", Name: "nodeTypeSelect"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_Float + ":0.5rem;", Name: "userSelect"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":3rem;",
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Name: "piSelect", Style: "width:100%; font-size:0.7rem;",
                                    Childs: [
                                        { Type: "option", Childs: [{ Type: "text", TextValue: RVDic.ShowAll }] },
                                        {
                                            Type: "option",
                                            Attributes: [{ Name: "title", Value: "true" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.ShowPersonalItems }]
                                        },
                                        {
                                            Type: "option",
                                            Attributes: [{ Name: "title", Value: "false" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.ShowGroupItems }]
                                        }
                                    ]
                                }
                            ]
                        },
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
                }
            ], that.ContainerDiv);

            that.Objects.ShowPersonalItemsSelect = elems["piSelect"];

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            that.Objects.UserSelect = GlobalUtilities.append_autosuggest(elems["userSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
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

            GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) {
                that.Objects.BeginDate = cal;
            });

            GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) {
                that.Objects.FinishDate = cal;
            });

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.UserID) this.Objects.UserSelect.set_item(params.UserID.Value || "", params.UserID.Title || "");
            if (params.NodeTypeID) this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value || "", params.NodeTypeID.Title || "");
            if (params.ShowPersonalItems) {
                switch (String(params.ShowPersonalItems.Value).toLowerCase()) {
                    case "true":
                        this.Objects.ShowPersonalItemsSelect.selectedIndex = 1;
                        break;
                    case "false":
                        this.Objects.ShowPersonalItemsSelect.selectedIndex = 2;
                        break;
                }
            }

            if (params.LowerCreationDateLimit && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.LowerCreationDateLimit.Value, Label: params.LowerCreationDateLimit.Title });

            if (params.UpperCreationDateLimit && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.UpperCreationDateLimit.Value, Label: params.UpperCreationDateLimit.Title });
        },

        get_data: function () {
            var that = this;

            var index = this.Objects.NodeTypeSelect.selectedIndex;
            var nodeTypeId = index < 0 ? "" : this.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : this.Objects.NodeTypeSelect.keywords[index];

            index = this.Objects.UserSelect.selectedIndex;
            var userId = this.Objects.UserSelect.values[index];
            var _user = index < 0 ? "" : this.Objects.UserSelect.keywords[index];

            var slct = this.Objects.ShowPersonalItemsSelect;

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType, UserID: userId, _Title_UserID: _user,
                ShowPersonalItems: slct[slct.selectedIndex].title,
                LowerCreationDateLimit: beginDate.Value,
                _Title_LowerCreationDateLimit: beginDate.Label,
                UpperCreationDateLimit: finishDate.Value,
                _Title_UpperCreationDateLimit: finishDate.Label
            };
        },

        clear: function () {
            var that = this;

            this.Objects.NodeTypeSelect.empty();
            this.Objects.UserSelect.empty();
            this.Objects.ShowPersonalItemsSelect.selectedIndex = 0;
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();