(function () {
    if (window.ReportOptions && window.ReportOptions.USR && window.ReportOptions.USR.ResumeEducationReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.ResumeEducationReport = function (containerDiv, params, done) {
        var that = this;

        GlobalUtilities.load_files(["Reports/ReportOptions/USR_ResumeReportParameters.js"], {
            OnLoad: function () {
                var x = new ResumeReportParameters(containerDiv, params, done);
                for (var key in x) that[key] = x[key];
            }
        });
    }

    ReportOptions.USR.ResumeEducationReport.prototype = {
        set_data: function () { },

        get_data: function () { },

        clear: function () { }
    }
})();