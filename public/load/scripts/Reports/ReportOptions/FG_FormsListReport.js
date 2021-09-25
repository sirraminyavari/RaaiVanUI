(function () {
    if (((window.ReportOptions || {}).FG || {}).FormsListReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.FG = window.ReportOptions.FG || {};

    var __FilterForms = {};

    window.ReportOptions.FG.FormsListReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            FormSelectButton: null
        };

        this.Objects = {
            FormSelect: null,
            LowerCreationDateLimit: null,
            UpperCreationDateLimit: null,
            FormFilters: null,
            FinalJSONFilters: null
        };

        this.Options = {
            Modules: params.Modules || {}
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.FG.FormsListReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-bottom:1rem;",
                    Childs: [
                        { Type: "div", Class: "small-6 medium-6 large-6", Name: "formSelect" },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "formFilters",
                            Style: "padding-" + RV_Float + ":1rem;"
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1.5rem;",
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

            that.Interface.FormSelectButton = elems["formFilters"];

            that.Objects.FormSelect = GlobalUtilities.append_autosuggest(elems["formSelect"], {
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.FormSelect + "...",
                AjaxDataSource: FGAPI.GetFormsDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Forms || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i].Title || ""), items[i].FormID]);
                    return arr;
                },
                OnSelect: function () {
                    that._show_related_form(that.Interface.FormSelectButton, this.values[this.selectedIndex], this.keywords[this.selectedIndex]);
                }
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

        _show_related_form: function (nameArea, formId, formTitle) {
            var that = this;

            nameArea.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "ActionButton", Style: "display:inline-block; font-weight:bold;",
                    Properties: [{ Name: "onclick", Value: function () { that._set_form_filters({ FormID: formId, FormTitle: formTitle }); } }],
                    Childs: [{ Type: "text", TextValue: RVDic.SetFormFilters }]
                }
            ], nameArea);
        },

        _set_form_filters: function (params) {
            params = params || {};
            var that = this;

            var formId = params.FormID || "";

            if (!that.__FilterShowparams) {
                that.__FilterShowparams = {
                    OnClose: function () {
                        if (__FilterForms[formId].FormSearchFilters) {
                            that.Objects.FormFilters = __FilterForms[formId].FormSearchFilters.get();
                            that.Objects.FinalJSONFilters = Base64.encode(that._get_form_filters());
                        }
                    }
                }
            }

            that.__FormShowedDiv = null;

            if (__FilterForms[formId]) {
                if (__FilterForms[formId].FormSearchFilters) __FilterForms[formId].FormSearchFilters.set(that.Objects.FormFilters);
                if (__FilterForms[formId].Container)
                    that.__FormShowedDiv = GlobalUtilities.show(__FilterForms[formId].Container, that.__FilterShowparams);
                return;
            }

            var _obj = __FilterForms[formId] = { Container: null, FormSearchFilters: null };

            _obj.Container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_obj.Container);
            that.__FormShowedDiv = GlobalUtilities.show(_obj.Container, that.__FilterShowparams);

            GlobalUtilities.load_files(["FormsManager/FormSearchFilters.js"], {
                OnLoad: function () {
                    _obj.FormSearchFilters = new FormSearchFilters(_obj.Container, {
                        Delimiter: "~",
                        FormID: formId, OnConfirm: function () { that.__FormShowedDiv.Close(); }
                    });
                }
            });
        },

        _get_form_filters: function (jsonValue, ownerId) {
            var that = this;

            var arr = [];
            var delimiter = "~";

            for (elementId in (jsonValue || {})) {
                var fltr = (jsonValue[elementId] || {}).JSONValue;
                var type = (jsonValue[elementId] || {}).Type;

                if (!fltr) continue;

                var theFilter = {
                    ElementID: elementId,
                    OwnerID: ownerId,
                    Text: Base64.encode(fltr.Text),
                    TextItems: Base64.encode((fltr.TextItems || []).map(i => Base64.decode(i)).join(delimiter)),
                    Or: GlobalUtilities.get_type(fltr.Or) == "boolean" ? fltr.Or : null,
                    Exact: GlobalUtilities.get_type(fltr.Exact) == "boolean" ? fltr.Exact : null,
                    DateFrom: fltr.DateFrom,
                    DateTo: fltr.DateTo,
                    FloatFrom: GlobalUtilities.get_type(fltr.FloatFrom) == "number" ? fltr.FloatFrom : null,
                    FloatTo: GlobalUtilities.get_type(fltr.FloatTo) == "number" ? fltr.FloatTo : null,
                    Bit: GlobalUtilities.get_type(fltr.Bit) == "boolean" ? fltr.Bit : null,
                    Guid: fltr.Guid,
                    GuidItems: (fltr.GuidItems || []).join(delimiter),
                    Compulsory: GlobalUtilities.get_type(fltr.Compulsory) == "boolean" ? fltr.Compulsory : null
                };

                if (String(type).toLowerCase() == "form") {
                    var subArr = that._get_form_filters((jsonValue[elementId] || {}).Data, elementId);

                    if ((subArr || []).length) {
                        arr.push(theFilter);
                        jQuery.each(subArr, function (ind, val) { arr.push(val); });
                    }
                }
                else if (theFilter.Text || theFilter.TextItems || theFilter.DateFrom || theFilter.DateTo || theFilter.FloatFrom ||
                    theFilter.FloatTo || theFilter.Bit || (theFilter.Bit === false) || theFilter.Guid || theFilter.GuidItems) {
                    arr.push(theFilter);
                }
            }

            return arr;
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.FormID) {
                this.Objects.FormSelect.set_item(params.FormID.Value || "", params.FormID.Title || "");
                that._show_related_form(that.Interface.FormSelectButton, params.FormID.Value, params.FormID.Title);
            }

            if (params.LowerCreationDateLimit && that.Objects.LowerCreationDateLimit) {
                that.Objects.LowerCreationDateLimit.Set({
                    Value: params.LowerCreationDateLimit.Value, Label: params.LowerCreationDateLimit.Title
                });
            }

            if (params.UpperCreationDateLimit && that.Objects.UpperCreationDateLimit) {
                that.Objects.UpperCreationDateLimit.Set({
                    Value: params.UpperCreationDateLimit.Value, Label: params.UpperCreationDateLimit.Title
                });
            }

            if (params.FormFilters) that.Objects.FinalJSONFilters = params.FormFilters;
        },

        get_data: function () {
            var that = this;

            var index = that.Objects.FormSelect.selectedIndex;
            var formId = index < 0 ? "" : that.Objects.FormSelect.values[index];
            var formName = index < 0 ? "" : that.Objects.FormSelect.keywords[index];

            if (!formId) {
                alert(RVDic.Checks.PleaseSelectForm);
                return false;
            }

            var lowerCreationDateLimit = (that.Objects.LowerCreationDateLimit || { Get: function () { return {} } }).Get();
            var upperCreationDateLimit = (that.Objects.UpperCreationDateLimit || { Get: function () { return {} } }).Get();

            var formFilters = {
                Name: "FormFilterTableType",
                Types: {
                    ElementID: "Guid",
                    OwnerID: "Guid",
                    Text: "Base64",
                    TextItems: "Base64",
                    Or: "Bool",
                    Exact: "Bool",
                    DateFrom: "DateTime",
                    DateTo: "DateTime",
                    FloatFrom: "Double",
                    FloatTo: "Double",
                    Bit: "Bool",
                    Guid: "Guid",
                    GuidItems: "String",
                    Compulsory: "Bool"
                },
                Items: that._get_form_filters(that.Objects.FormFilters) || []
            };
            
            return {
                FormID: formId, _Title_FormID: formName,
                LowerCreationDateLimit: lowerCreationDateLimit.Value || "",
                _Title_LowerCreationDateLimit: lowerCreationDateLimit.Label || "",
                UpperCreationDateLimit: upperCreationDateLimit.Value || "",
                _Title_UpperCreationDateLimit: upperCreationDateLimit.Label || "",
                FormFilters: that.Objects.FinalJSONFilters || Base64.encode(JSON.stringify(formFilters))
            };
        },

        clear: function () {
            var that = this;

            this.Objects.FormSelect.empty();
            if (this.Objects.LowerCreationDateLimit) this.Objects.LowerCreationDateLimit.Clear();
            if (this.Objects.UpperCreationDateLimit) this.Objects.UpperCreationDateLimit.Clear();
            that.Objects.FormFilters = that.Objects.FinalJSONFilters = null;
        }
    }
})();