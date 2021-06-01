(function () {
    if (window.ReportOptions && window.ReportOptions.CN && window.ReportOptions.CN.DownloadedFilesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    window.ReportOptions.CN.DownloadedFilesReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            NodeTypeSelect: null,
            UserSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        GlobalUtilities.load_files(["API/CNAPI.js", "API/UsersAPI.js", "SingleDataContainer/NewSingleDataContainer.js"], {
            OnLoad: function () { that._initialize(params, done); }
        });
    }

    ReportOptions.CN.DownloadedFilesReport.prototype = {
        _initialize: function (params, done) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-8 large-6", Name: "nodeTypeSelect" },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                { Type: "div", Class: "small-12 medium-8 large-6", Name: "userSelect", Style: "margin-top:1rem;" },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                {
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
                }
            ], that.ContainerDiv);

            that.Objects.NodeTypeSelect = new NewSingleDataContainer(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                NoButtons: true,
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            that.Objects.UserSelect = new NewSingleDataContainer(elems["userSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                NoButtons: true,
                AjaxDataSource: UsersAPI.GetUsers(),
                ResponseParser: function (responseText) {
                    var users = JSON.parse(responseText).Users || [];
                    var arr = [];
                    for (var i = 0, lnt = users.length; i < lnt; ++i)
                        arr.push([Base64.decode(users[i].FullName), users[i].UserID]);
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

            if (params.BeginDate && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.BeginDate.Value, Label: params.BeginDate.Title });

            if (params.FinishDate && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.FinishDate.Value, Label: params.FinishDate.Title });
        },

        get_data: function () {
            var that = this;

            var nodeTypeIds = that.Objects.NodeTypeSelect ? that.Objects.NodeTypeSelect.get_items_string("|") : "";
            var userIds = that.Objects.UserSelect ? that.Objects.UserSelect.get_items_string("|") : "";

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return {
                NodeTypeIDs: nodeTypeIds,
                UserIDs: userIds,
                BeginDate: beginDate.Value,
                _Title_BeginDate: beginDate.Label,
                FinishDate: finishDate.Value,
                _Title_FinishDate: finishDate.Label
            };
        },

        clear: function () {
            var that = this;

            if (that.Objects.NodeTypeSelect) that.Objects.NodeTypeSelect.clear();
            if (that.Objects.UserSelect) that.Objects.UserSelect.clear();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();