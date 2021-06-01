(function () {
    if (window.ReportOptions && window.ReportOptions.USR && window.ReportOptions.USR.ProfileFilledPercentageReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.ProfileFilledPercentageReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        that._initialize(params, done);
    }

    ReportOptions.USR.ProfileFilledPercentageReport.prototype = {
        _initialize: function (params, done) {
            params = params || {};
            var that = this;

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            params = params || {};
        },

        get_data: function () {
            return {};
        },

        clear: function () {
        }
    }
})();