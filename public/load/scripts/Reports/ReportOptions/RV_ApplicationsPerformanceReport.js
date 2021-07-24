(function () {
    if (window.ReportOptions && window.ReportOptions.RV && window.ReportOptions.RV.ApplicationsPerformanceReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.RV = window.ReportOptions.RV || {};

    window.ReportOptions.RV.ApplicationsPerformanceReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            DateFrom: null,
            DateMiddle: null,
            DateTo: null
        };

        that._initialize(params, done);
    }

    ReportOptions.RV.ApplicationsPerformanceReport.prototype = {
        _initialize: function (params, done) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "middleDate" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
                    ]
                }
            ], that.ContainerDiv);

            GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) {
                that.Objects.DateFrom = cal;
            });

            GlobalUtilities.append_calendar(elems["middleDate"], { ClearButton: true }, function (cal) {
                that.Objects.DateMiddle = cal;
            });

            GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) {
                that.Objects.DateTo = cal;
            });

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};
            
            if (params.DateFrom && that.Objects.DateFrom)
                that.Objects.DateFrom.Set({ Value: params.DateFrom.Value, Label: params.DateFrom.Title });

            if (params.DateMiddle && that.Objects.DateMiddle)
                that.Objects.DateMiddle.Set({ Value: params.DateMiddle.Value, Label: params.DateMiddle.Title });

            if (params.DateTo && that.Objects.DateTo)
                that.Objects.DateTo.Set({ Value: params.DateTo.Value, Label: params.DateTo.Title });
        },

        get_data: function () {
            var that = this;

            var dateFrom = !that.Objects.DateFrom ? {} : that.Objects.DateFrom.Get();
            var dateMiddle = !that.Objects.DateMiddle ? {} : that.Objects.DateMiddle.Get();
            var dateTo = !that.Objects.DateTo ? {} : that.Objects.DateTo.Get();

            return {
                DateFrom: dateFrom.Value,
                _Title_DateFrom: dateFrom.Label,
                DateMiddle: dateMiddle.Value,
                _Title_DateMiddle: dateMiddle.Label,
                DateTo: dateTo.Value,
                _Title_DateTo: dateTo.Label
            };
        },

        clear: function () {
            var that = this;

            if (that.Objects.DateFrom) that.Objects.DateFrom.Clear();
            if (that.Objects.DateMiddle) that.Objects.DateMiddle.Clear();
            if (that.Objects.DateTo) that.Objects.DateTo.Clear();
        }
    }
})();