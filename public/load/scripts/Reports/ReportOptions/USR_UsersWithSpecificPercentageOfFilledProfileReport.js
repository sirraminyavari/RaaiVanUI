(function () {
    if (window.ReportOptions && window.ReportOptions.USR && window.ReportOptions.USR.UsersWithSpecificPercentageOfFilledProfileReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.UsersWithSpecificPercentageOfFilledProfileReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Objects = {
            PercentageSelect: null
        };

        var that = this;

        that._initialize(params, done);
    }

    ReportOptions.USR.UsersWithSpecificPercentageOfFilledProfileReport.prototype = {
        _initialize: function (params, done) {
            params = params || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.ProfileFilledPercentage + ":" }]
                },
                {
                    Type: "div", Style: "display:inline-block;",
                    Childs: [
                        {
                            Type: "select", Class: "rv-input", Name: "percentageSelect", Style: "font-size:0.7rem;",
                            Childs: [
                                {
                                    Type: "option", Attributes: [{ Name: "title", Value: "" }],
                                    Childs: [{ Type: "text", TextValue: RVDic.FilledPercentage + "..." }]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Objects.PercentageSelect = elems["percentageSelect"];
            
            var _percentages = ["0", "16", "33", "50", "66", "83", "100"];
            for (var i = 0, lnt = _percentages.length; i < lnt; ++i) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "option", Attributes: [{ Name: "title", Value: _percentages[i] }],
                        Childs: [{ Type: "text", TextValue: _percentages[i] }]
                    }
                ], that.Objects.PercentageSelect);
            }

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};
            
            if (params.FilledPercentage) {
                for (var i = 0, lnt = that.Objects.PercentageSelect.length; i < lnt; ++i) {
                    if (that.Objects.PercentageSelect[i].title == ((params.FilledPercentage || {}).Value || params.FilledPercentage))
                        that.Objects.PercentageSelect.selectedIndex = i;
                }
            }
        },

        get_data: function () {
            var that = this;
            return {
                FilledPercentage: this.Objects.PercentageSelect[this.Objects.PercentageSelect.selectedIndex].title || ""
            };
        },

        clear: function () {
            var that = this;
            this.Objects.PercentageSelect.selectedIndex = 0;
        }
    }
})();