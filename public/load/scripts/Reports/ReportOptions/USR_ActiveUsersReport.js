(function () {
    if (((window.ReportOptions || {}).USR || {}).ActiveUsersReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.ActiveUsersReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Objects = {
            DateFrom: null,
            DateTo: null
        };

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.USR.ActiveUsersReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "display:inline-block; width:7rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.Date + ":" }]
                },
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "dateFrom" },
                {
                    Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "dateTo" }
            ], that.ContainerDiv);

            GlobalUtilities.append_calendar(elems["dateFrom"], { ClearButton: true }, function (cal) {
                that.Objects.DateFrom = cal;
            });

            GlobalUtilities.append_calendar(elems["dateTo"], { ClearButton: true }, function (cal) {
                that.Objects.DateTo = cal;
            });

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.DateFrom) {
                that.Objects.DateFrom.Set({
                    Value: params.DateFrom.Value, Label: params.DateFrom.Title
                });
            }

            if (params.DateTo) {
                that.Objects.DateTo.Set({
                    Value: params.DateTo.Value, Label: params.DateTo.Title
                });
            }
        },

        get_data: function () {
            var that = this;

            var dateFrom = (that.Objects.DateFrom || { Get: function () { return {} } }).Get();
            var dateTo = (that.Objects.DateTo || { Get: function () { return {} } }).Get();
            
            return {
                DateFrom: dateFrom.Value || "",
                _Title_DateFrom: dateFrom.Label || "",
                DateTo: dateTo.Value || "",
                _Title_DateTo: dateTo.Label || ""
            };
        },

        clear: function () {
            var that = this;

            if (this.Objects.DateFrom) this.Objects.DateFrom.Clear();
            if (this.Objects.DateTo) this.Objects.DateTo.Clear();
        },

        chart_date_from: function (value, title) {
            if (value && title) {
                if (this.Objects.DateFrom)
                    this.Objects.DateFrom.Set({ Value: value, Label: title });
            }
            else
                return (this.Objects.DateFrom || { Get: function () { return {} } }).Get();
        },

        chart_date_to: function (value, title) {
            if (value && title) {
                if (this.Objects.DateTo)
                    this.Objects.DateTo.Set({ Value: value, Label: title });
            }
            else
                return (this.Objects.DateTo || { Get: function () { return {} } }).Get();
        }
    }
})();