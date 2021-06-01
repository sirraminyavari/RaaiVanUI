(function () {
    if (window.ReportOptions && window.ReportOptions.RV && window.ReportOptions.RV.ErrorLogsReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.RV = window.ReportOptions.RV || {};

    window.ReportOptions.RV.ErrorLogsReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            LevelSelect: null,
            BeginDate: null,
            FinishDate: null
        };

        that._initialize(params, done);
    }

    ReportOptions.RV.ErrorLogsReport.prototype = {
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
            add_level_option("Debug");
            add_level_option("Fatal");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
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
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":2rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Date + ":" }]
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
                }
            ], that.ContainerDiv);

            that.Objects.LevelSelect = elems["levelSelect"];

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

            if (params.Level) {
                for (var i = 0, lnt = that.Objects.LevelSelect.length; i < lnt; ++i)
                    if (that.Objects.LevelSelect[i].title == params.Level) that.Objects.LevelSelect.selectedIndex = i;
            }

            if (params.BeginDate && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.BeginDate.Value, Label: params.BeginDate.Title });

            if (params.FinishDate && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.FinishDate.Value, Label: params.FinishDate.Title });
        },

        get_data: function () {
            var that = this;

            var beginDate = (that.Objects.BeginDate || { Get: function () { return {} } }).Get();
            var finishDate = (that.Objects.FinishDate || { Get: function () { return {} } }).Get();

            return {
                Level: that.Objects.LevelSelect[that.Objects.LevelSelect.selectedIndex].title || "",
                BeginDate: beginDate.Value || "",
                _Title_BeginDate: beginDate.Label || "",
                FinishDate: finishDate.Value || "",
                _Title_FinishDate: finishDate.Label || ""
            };
        },

        clear: function () {
            var that = this;

            this.Objects.LevelSelect.selectedIndex = 0;
            if (this.Objects.BeginDate) this.Objects.BeginDate.Clear();
            if (this.Objects.FinishDate) this.Objects.FinishDate.Clear();
        }
    }
})();