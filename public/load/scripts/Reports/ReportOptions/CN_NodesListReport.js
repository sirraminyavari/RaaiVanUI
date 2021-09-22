(function () {
    if (((window.ReportOptions || {}).CN || {}).NodesListReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.CN = window.ReportOptions.CN || {};

    var __FilterForms = {};
    var __FormOwners = {};

    window.ReportOptions.CN.NodesListReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            FormSelectButton: null
        };

        this.Objects = {
            NodeTypeSelect: null,
            SearchTextInput: null,
            MinContributorsInput: null,
            StatusSelect: null,
            BeginDate: null,
            FinishDate: null,
            FormFilters: null,
            FinalJSONFilters: null
        };

        this.Options = {
            Modules: params.Modules || {},
            SearchTextInnerTitle: RVDic.SearchText + "...",
            MinContributorsInnerTitle: RVDic.MinContributorsCount + "..."
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params, done); } });
    }

    ReportOptions.CN.NodesListReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        { Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeTypeSelect", Style: "margin-bottom:1rem;" },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "padding-" + RV_Float + ":1rem; margin:0.3rem 0rem 1rem 0rem;", Name: "formName"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "searchTextInput",
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: that.Options.SearchTextInnerTitle,
                                    Attributes: [{ Name: "type", Value: "text" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-3 medium-3 large-3", Style: "padding-" + RV_Float + ":1rem;",
                            Childs: [
                                {
                                    Type: "number", Class: "rv-input", Name: "minContributorsInput",
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: that.Options.MinContributorsInnerTitle
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-3 medium-3 large-3",
                            Style: "padding-" + RV_Float + ":1rem;" + (that.Options.Modules.KW ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "select", Class: "rv-input", Name: "statusSelect",
                                    Style: "width:100%; font-size:0.7rem;",
                                    Childs: [
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Status + "..." }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CreationDate + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.From + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.To + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.FormSelectButton = elems["formName"];

            that.Objects.SearchTextInput = elems["searchTextInput"];
            that.Objects.MinContributorsInput = elems["minContributorsInput"];
            that.Objects.StatusSelect = elems["statusSelect"];

            var _statuses = ["Personal", "Accepted", "Rejected", "SentToAdmin", "SentBackForRevision", "SentToEvaluators"];

            for (var i = 0, lnt = _statuses.length; i < lnt; ++i) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "option", Attributes: [{ Name: "title", Value: _statuses[i] }],
                        Childs: [{ Type: "text", TextValue: RVDic.CN[_statuses[i]] || _statuses[i] }]
                    }
                ], that.Objects.StatusSelect);
            }

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    that._show_related_form(that.Interface.FormSelectButton, this.values[this.selectedIndex]);
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

        _show_related_form: (function () {
            var that = this;

            var formButtons = {};

            return function (nameArea, nodeTypeId) {
                var that = this;
                nameArea.innerHTML = "";
                if (!that.Options.Modules.FG || formButtons[nodeTypeId] === false) return;
                if (formButtons[nodeTypeId]) return nameArea.appendChild(formButtons[nodeTypeId]);

                var _div = formButtons[nodeTypeId] = document.createElement("div");
                nameArea.appendChild(_div);

                GlobalUtilities.loading(_div, { Style: "margin-top:0.5rem;" });

                GlobalUtilities.load_files(["API/FGAPI.js"], {
                    OnLoad: function () {
                        FGAPI.GetOwnerForm({
                            OwnerID: nodeTypeId,
                            ParseResults: true,
                            ResponseHandler: function (result) {
                                _div.innerHTML = "";

                                var formId = result.FormID || "";
                                var formTitle = Base64.decode(result.Title || "");

                                if (formId == "") {
                                    formButtons[nodeTypeId] = false;
                                    return;
                                }
                                else
                                    __FormOwners[nodeTypeId] = formId;

                                GlobalUtilities.create_nested_elements([
                                    {
                                        Type: "span", Style: "font-weight:bold; color:gray;",
                                        Childs: [{ Type: "text", TextValue: RVDic.SetFormFilters + ":" }]
                                    },
                                    {
                                        Type: "span", Style: "margin:0px 8px 0px 8px; font-weight:bold; cursor:pointer;",
                                        Properties: [
                                            { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                                            { Name: "onmouseout", Value: function () { this.style.color = "black"; } },
                                            {
                                                Name: "onclick",
                                                Value: function () {
                                                    that._set_form_filters({
                                                        NodeTypeID: nodeTypeId,
                                                        FormID: formId, FormTitle: formTitle
                                                    });
                                                }
                                            }
                                        ],
                                        Childs: [{ Type: "text", TextValue: GlobalUtilities.secure_string(formTitle) }]
                                    }
                                ], _div);
                            }
                        });
                    }
                });
            }
        })(),

        _set_form_filters: function (params) {
            params = params || {};
            var that = this;
            
            var nodeTypeId = params.NodeTypeID || "";
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

            if (params.NodeTypeID) {
                this.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value || "", params.NodeTypeID.Title || "");
                that._show_related_form(that.Interface.FormSelectButton, params.NodeTypeID.Value);
            }

            if (params.SearchText) that.Objects.SearchTextInput.value = params.SearchText;

            if (params.MinContributorsCount) that.Objects.MinContributorsInput.value = params.MinContributorsCount;

            if (params.Status) {
                for (var i = 0, lnt = that.Objects.StatusSelect.length; i < lnt; ++i) {
                    if (that.Objects.StatusSelect[i].title == params.Status)
                        that.Objects.StatusSelect.selectedIndex = i;
                }
            }

            if (params.LowerCreationDateLimit && that.Objects.BeginDate)
                that.Objects.BeginDate.Set({ Value: params.LowerCreationDateLimit.Value, Label: params.LowerCreationDateLimit.Title });

            if (params.UpperCreationDateLimit && that.Objects.FinishDate)
                that.Objects.FinishDate.Set({ Value: params.UpperCreationDateLimit.Value, Label: params.UpperCreationDateLimit.Title });

            if (params.FormFilters) that.Objects.FinalJSONFilters = params.FormFilters;
        },

        get_data: function () {
            var that = this;

            var index = that.Objects.NodeTypeSelect.selectedIndex;
            var nodeTypeId = index < 0 ? "" : that.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : that.Objects.NodeTypeSelect.keywords[index];

            var searchText = GlobalUtilities.trim(that.Objects.SearchTextInput.value);
            if (searchText == that.Options.SearchTextInnerTitle) searchText = "";

            var minContributors = GlobalUtilities.trim(that.Objects.MinContributorsInput.value);
            if (minContributors == that.Options.MinContributorsInnerTitle) minContributors = "";

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

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
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType,
                SearchText: Base64.encode(searchText),
                MinContributorsCount: minContributors,
                Status: that.Objects.StatusSelect[that.Objects.StatusSelect.selectedIndex].title || "",
                LowerCreationDateLimit: beginDate.Value,
                _Title_LowerCreationDateLimit: beginDate.Label,
                UpperCreationDateLimit: finishDate.Value,
                _Title_UpperCreationDateLimit: finishDate.Label,
                FormFilters: that.Objects.FinalJSONFilters || Base64.encode(JSON.stringify(formFilters))
            };
        },

        clear: function () {
            var that = this;

            this.Objects.NodeTypeSelect.empty();
            this.Objects.SearchTextInput.value = "";
            GlobalUtilities.set_inner_title(this.Objects.SearchTextInput, this.Options.SearchTextInnerTitle);
            this.Objects.MinContributorsInput.value = "";
            GlobalUtilities.set_inner_title(this.Objects.MinContributorsInput, this.Options.MinContributorsInnerTitle);
            this.Objects.StatusSelect.selectedIndex = 0;
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
            that.Objects.FormFilters = that.Objects.FinalJSONFilters = null;
        }
    }
})();