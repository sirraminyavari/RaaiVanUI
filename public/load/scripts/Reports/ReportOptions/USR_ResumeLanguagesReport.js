(function () {
    if (window.ReportOptions && window.ReportOptions.USR && window.ReportOptions.USR.ResumeLanguagesReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.ResumeLanguagesReport = function (containerDiv, params, done) {
        var that = this;

        GlobalUtilities.load_files(["Reports/ReportOptions/USR_ResumeReportParameters.js"], {
            OnLoad: function () {
                var x = new ResumeReportParameters(containerDiv, GlobalUtilities.extend(params || {}, { IgnoreDate: true }), done);
                for (var key in x) that[key] = x[key];
            }
        });
    }

    ReportOptions.USR.ResumeLanguagesReport.prototype = {
        set_data: function () { },

        get_data: function () { },

        clear: function () { }
    }
})();