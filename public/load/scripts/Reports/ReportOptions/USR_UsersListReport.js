(function () {
    if (((window.ReportOptions || {}).USR || {}).UsersListReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.USR = window.ReportOptions.USR || {};

    window.ReportOptions.USR.UsersListReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Objects = {
            SearchTextInput: null,
            IsApprovedCheckbox: null,
            LowerBirthDateLimit: null,
            UpperBirthDateLimit: null,
            LowerCreationDateLimit: null,
            UpperCreationDateLimit: null
        };

        this.Options = {
            SearchTextInnerTitle: RVDic.SearchText + "..."
        };

        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.USR.UsersListReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [{
                        Type: "input", Class: "rv-input", Name: "searchTextInput",
                        Style: "width:50%; font-size:0.7rem;", InnerTitle: that.Options.SearchTextInnerTitle,
                        Attributes: [{ Name: "type", Value: "text" }]
                    }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "checkbox", Name: "activeChb",
                            Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;",
                            Params: { Checked: true }
                        },
                        { Type: "text", TextValue: RVDic.Active }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Birthday + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "lowerBirthDateLimit" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "upperBirthDateLimit" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CreationDate + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "lowerCreationDateLimit" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "upperCreationDateLimit" }
                    ]
                }
            ], that.ContainerDiv);

            that.Objects.SearchTextInput = elems["searchTextInput"];
            that.Objects.IsApprovedCheckbox = elems["activeChb"];

            GlobalUtilities.append_calendar(elems["lowerBirthDateLimit"], { ClearButton: true }, function (cal) {
                that.Objects.LowerBirthDateLimit = cal;
            });

            GlobalUtilities.append_calendar(elems["upperBirthDateLimit"], { ClearButton: true }, function (cal) {
                that.Objects.UpperBirthDateLimit = cal;
            });

            GlobalUtilities.append_calendar(elems["lowerCreationDateLimit"], { ClearButton: true }, function (cal) {
                that.Objects.LowerCreationDateLimit = cal;
            });

            GlobalUtilities.append_calendar(elems["upperCreationDateLimit"], { ClearButton: true }, function (cal) {
                that.Objects.UpperCreationDateLimit = cal;
            });

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.SearchText) that.Objects.SearchTextInput.value = params.SearchText;

            that.Objects.IsApprovedCheckbox[params.IsApproved === false ? "uncheck" : "check"]();

            if (params.LowerBirthDateLimit) {
                that.Objects.LowerBirthDateLimit.Set({
                    Value: params.LowerBirthDateLimit.Value, Label: params.LowerBirthDateLimit.Title
                });
            }

            if (params.UpperBirthDateLimit) {
                that.Objects.UpperBirthDateLimit.Set({
                    Value: params.UpperBirthDateLimit.Value, Label: params.UpperBirthDateLimit.Title
                });
            }

            if (params.LowerCreationDateLimit) {
                that.Objects.LowerCreationDateLimit.Set({
                    Value: params.LowerCreationDateLimit.Value, Label: params.LowerCreationDateLimit.Title
                });
            }

            if (params.UpperCreationDateLimit) {
                that.Objects.UpperCreationDateLimit.Set({
                    Value: params.UpperCreationDateLimit.Value, Label: params.UpperCreationDateLimit.Title
                });
            }
        },

        get_data: function () {
            var that = this;

            var searchText = GlobalUtilities.trim(that.Objects.SearchTextInput.value);
            if (searchText == that.Options.SearchTextInnerTitle) searchText = "";

            var lowerBirthDateLimit = (that.Objects.LowerBirthDateLimit || { Get: function () { return {} } }).Get();
            var upperBirthDateLimit = (that.Objects.UpperBirthDateLimit || { Get: function () { return {} } }).Get();

            var lowerCreationDateLimit = (that.Objects.LowerCreationDateLimit || { Get: function () { return {} } }).Get();
            var upperCreationDateLimit = (that.Objects.UpperCreationDateLimit || { Get: function () { return {} } }).Get();
            
            return {
                SearchText: Base64.encode(searchText),
                IsApproved: that.Objects.IsApprovedCheckbox.Checked,
                LowerBirthDateLimit: lowerBirthDateLimit.Value || "",
                _Title_LowerBirthDateLimit: lowerBirthDateLimit.Label || "",
                UpperBirthDateLimit: upperBirthDateLimit.Value || "",
                _Title_UpperBirthDateLimit: upperBirthDateLimit.Label || "",
                LowerCreationDateLimit: lowerCreationDateLimit.Value || "",
                _Title_LowerCreationDateLimit: lowerCreationDateLimit.Label || "",
                UpperCreationDateLimit: upperCreationDateLimit.Value || "",
                _Title_UpperCreationDateLimit: upperCreationDateLimit.Label || ""
            };
        },

        clear: function () {
            var that = this;

            this.Objects.SearchTextInput.value = "";
            this.Objects.IsApprovedCheckbox.check();
            GlobalUtilities.set_inner_title(this.Objects.SearchTextInput, this.Options.SearchTextInnerTitle);
            if (this.Objects.LowerBirthDateLimit) this.Objects.LowerBirthDateLimit.Clear();
            if (this.Objects.UpperBirthDateLimit) this.Objects.UpperBirthDateLimit.Clear();
            if (this.Objects.LowerCreationDateLimit) this.Objects.LowerCreationDateLimit.Clear();
            if (this.Objects.UpperCreationDateLimit) this.Objects.UpperCreationDateLimit.Clear();
        }
    }
})();