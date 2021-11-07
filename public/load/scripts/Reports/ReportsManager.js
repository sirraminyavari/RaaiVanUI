(function () {
    if (window.ReportsManager) return;

    window.ReportsManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        var that = this;
        params = params || {};

        this.Interface = {
            PagesArea: null,
            FirstPage: null
        };

        this.Objects = {
            TabsManager: null,
            Reports: params.Reports,
            GroupLimitsForAdmins: params.GroupLimitsForAdmins || [],
            Groups: params.Groups || []
        };
        
        this.Options = {
            Modules: params.Modules
        };
        
        GlobalUtilities.load_files([
            "TabsManager/TabsManager.js", "API/ReportsAPI.js", "API/PrivacyAPI.js", "Public/NameDialog.js"
        ], {
            OnLoad: function () { that._initialize(params); }
        });
    }

    ReportsManager.prototype = {
        _initialize: function (params) {
            params = params || {};
            var modules = params.Modules || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center;",
                    Childs: [
                        { Type: "div", Style: "flex:1 1 auto;", Name: "tabsArea" },
                        (!(window.RVGlobal || {}).IsSystemAdmin ? null : {
                            Type: "div", Name: "settingsButton",
                            Class: "rv-action-button rv-border-radius-quarter SoftShadow",
                            Style: "flex:0 0 auto; padding:0.3rem 0; padding-" + RV_Float + ":1rem;" +
                                "padding-" + RV_RevFloat + ":0.5rem; cursor:pointer;",
                            Childs: [
                                { Type: "text", TextValue: RVDic.Settings },
                                { Type: "i", Class: "fa fa-chevron-down", Style: "margin-" + RV_Float + ":0.3rem;" }
                            ]
                        })
                    ]
                },
                {
                    Type: "div", Name: "pagesArea", Style: "padding:1rem;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor"
                }
            ], this.ContainerDiv);

            that.Interface.PagesArea = elems["pagesArea"];

            that.Objects.TabsManager = new TabsManager({ ContainerDiv: elems["tabsArea"], Pages: [] });

            that.Interface.FirstPage = that.add_tab(RVDic.ReportSelect, true).Page;

            that.init_settings_menu(elems["settingsButton"]);

            var _add_report_item = function (container, _moduleIdentifier, _reportName) {
                var reportId = that.has_report(_moduleIdentifier, _reportName);
                if (!reportId) return;

                var config = that.get_report_config(_moduleIdentifier, _reportName) || {};

                var reportTitle = (((RVDic.RPT || {})[_moduleIdentifier] || {})[_reportName] || {})._Title || _reportName;
                var reportDescription = (((RVDic.RPT || {})[_moduleIdentifier] || {})[_reportName] || {})._Description;
                
                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.3rem;",
                    Childs: [{
                        Type: "div",
                        Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow SoftBorder",
                        Style: "cursor:pointer; padding:1rem; margin-bottom:0.2rem; min-height:4rem; text-align:center;" +
                            "display:flex; flex-flow:column; align-items:center; justify-content:center; height:100%;" +
                            "border-color:rgb(220,220,220); position:relative;",
                        Properties: [{
                            Name: "onclick",
                            Value: function () { that.show_report({ ID: reportId, ModuleIdentifier: _moduleIdentifier, ReportName: _reportName }); }
                        }],
                        Childs: [
                            (!config.HasChart && !config.HasGroupAdminMode ? null : {
                                Type: "div", Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0;",
                                Childs: [
                                    (!config.HasPersonalMode ? null : {
                                        Type: "i", Class: "fa fa-user",
                                        Style: "color:rgb(80,80,80); margin-" + RV_RevFloat + ":0.5rem; font-size:0.8rem;"
                                    }),
                                    (!config.HasGroupAdminMode ? null : {
                                        Type: "i", Class: "fa fa-users",
                                        Style: "color:rgb(80,80,80); margin-" + RV_RevFloat + ":0.5rem; font-size:0.8rem;"
                                    }),
                                    (!config.HasChart ? null : {
                                        Type: "i", Class: "fa fa-bar-chart-o",
                                        Style: "color:rgb(80,80,80); margin-" + RV_RevFloat + ":0.5rem;"
                                    })
                                ]
                            }),
                            { Type: "div", Childs: [{ Type: "text", TextValue: reportTitle }] },
                            (!reportDescription ? null : {
                                Type: "div", Style: "margin-top:0.5rem; color:rgb(120,120,120); font-size:0.7rem;",
                                Childs: [{ Type: "text", TextValue: reportDescription }]
                            })
                        ]
                    }]
                }], container);
            }

            for (var moduleIdentifier in ReportsAPI.Reports) {
                if ((modules[moduleIdentifier] === false) || !that.has_report(moduleIdentifier)) continue;

                var headerTitle = ((RVDic.RPT && RVDic.RPT[moduleIdentifier] &&
                    RVDic.RPT[moduleIdentifier]._Title) ? RVDic.RPT[moduleIdentifier]._Title : moduleIdentifier);

                var itemsArea = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1.4rem;",
                        Childs: [
                            { Type: "header", Params: { Title: headerTitle } },
                            { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "itemsArea", Style: "margin:0;" }
                        ]
                    }
                ], that.Interface.FirstPage)["itemsArea"];

                for (var reportName in ReportsAPI.Reports[moduleIdentifier]) {
                    if ((new RegExp(/^_/g)).test(reportName)) continue;
                    _add_report_item(itemsArea, moduleIdentifier, reportName);
                }
            }
        },

        init_settings_menu: function (menuButton) {
            var that = this;

            if (!menuButton) return;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "_div",
                Childs: [
                    {
                        Type: "div", Class: "rv-bg-color-white-softer rv-border-radius-quarter",
                        Style: "cursor:pointer; padding:0.5rem;",
                        Properties: [{ Name: "onclick", Value: function () { that.group_limits_for_admins(); } }],
                        Childs: [{ Type: "text", TextValue: RVDic.Groups }]
                    },
                    {
                        Type: "div", Class: "rv-bg-color-white-softer rv-border-radius-quarter",
                        Style: "cursor:pointer; padding:0.5rem;",
                        Properties: [{ Name: "onclick", Value: function () { that.access_settings(); } }],
                        Childs: [{ Type: "text", TextValue: RVDic.AccessSettings }]
                    }
                ]
            }]);

            var menu = elems["_div"];

            var popupMenu = null;
            var ebmoObj = null;

            var _init_mouse_over = function () {
                popupMenu = GlobalUtilities.popup_menu(menuButton, menu, {
                    Align: "bottom", Style: "background-color:white; border-color:rgb(200,200,200);"
                });

                ebmoObj = GlobalUtilities.enable_by_mouse_over(menuButton, popupMenu.Container, {
                    Started: true, Delay: 100,
                    OnStart: function (d) { popupMenu.Show(d); }, OnEnd: function (d) { popupMenu.Hide(d); }
                });
            }

            menuButton.onmouseover = function () { this.onmouseover = null; _init_mouse_over(); }
        },

        get_report_config: function (moduleIdentifier, reportName) {
            var that = this;
            if (!reportName) return null;
            var fullReportName = String(moduleIdentifier + "_" + reportName).toLowerCase();

            for (name in that.Objects.Reports) if (name.toLowerCase() == fullReportName) return that.Objects.Reports[name];

            return null;
        },

        has_report: function (moduleIdentifier, reportName) {
            var that = this;

            var fullReportName = reportName ? String(moduleIdentifier + "_" + reportName).toLowerCase() : "";

            for (name in that.Objects.Reports) {
                if (!reportName && (name.toLowerCase().indexOf(moduleIdentifier.toLowerCase() + "_") == 0)) return true;
                else if (name.toLowerCase() == fullReportName) return (that.Objects.Reports[name] || {}).ID;
            }

            return false;
        },

        add_tab: function (title, show, removable) {
            var newPage = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "firstPage" }
            ], this.Interface.PagesArea)["firstPage"];

            var newItem = this.Objects.TabsManager.add_tab({ Page: newPage, Title: title, FixedPage: true, Removable: removable });
            if (show === true) this.Objects.TabsManager.goto_page(newItem.Page);
            return newItem;
        },

        _determine_link_url: function (type, data) {
            data = data || {};
            var _url = null;

            switch (type) {
                case "User":
                    data.UserID = data.UserID || data.UID || data.ID;
                    if (data.UserID) _url = RVAPI.UserPageURL(data);
                    break;
                case "Node":
                    data.NodeID = data.NodeID || data.ID;
                    if (data.NodeID) _url = RVAPI.NodePageURL(data);
                    break;
            }

            /*
            if (_url) {
                for (var d in data)
                    _url += ((new RegExp(/\?/g)).test(String(_url)) ? "&" : "?") + d + "=" + data[d];
            }
            */

            return _url;
        },

        _get_new_report_params: function (row, action) {
            var retParams = {};
            if (!row) return retParams;

            for (var r in ((action || {}).Requires || {})) {
                var p = { Value: row[action.Requires[r].Value], Title: String(action.Requires[r].Title || "") };
                if ((p.Value || "") == "") continue;
                retParams[r] = p;

                var mts = retParams[r].Title.match(new RegExp(/(~)\[\[([\w\s]+)\]\]/g)) || [];

                if (mts.length == 0)
                    retParams[r].Title = row[retParams[r].Title];
                else {
                    for (var i = 0, lnt = mts.length; i < lnt; ++i)
                        retParams[r].Title = retParams[r].Title.replace(mts[i], row[mts[i].substr(3, mts[i].length - 5)]);
                }
            }

            for (var p in ((action || {}).Params || {})) {
                if (retParams[p]) retParams[p].Value = action.Params[p];
                else retParams[p] = { Value: action.Params[p], Title: "" };
            }

            return retParams;
        },

        process_options: function (options) {
            var that = this;

            var ret = {};

            for (var k in (options || {})) {
                if ((k.substr(0, 7) == "_Title_") || (!options[k] && (options[k] !== false))) continue;
                else if (GlobalUtilities.get_type(options["_Title_" + k]) != "undefined")
                    ret[k] = { Value: options[k], Title: options["_Title_" + k] || "" };
                else ret[k] = options[k];
            }

            return ret;
        },

        show_report: function (params) {
            params = params || {};
            var that = this;

            var id = params.ID;
            var moduleIdentifier = params.ModuleIdentifier || "";
            var reportName = params.ReportName || "";
            var showAtStart = params.ShowAtStart === true;
            var reportConfig = that.get_report_config(moduleIdentifier, reportName) || {};
            var hasChart = !!reportConfig.HasChart;
            
            var initialParams = GlobalUtilities.extend({ Modules: that.Options.Modules }, (params.InitialParams || {}), {
                Config: GlobalUtilities.extend({}, reportConfig, { Groups: that.Objects.Groups })
            });
            
            GlobalUtilities.load_files(["Reports/ReportOptions/" + moduleIdentifier + "_" + reportName + ".js"], {
                OnLoad: function () {
                    var reportTitle = (RVDic.RPT && RVDic.RPT[moduleIdentifier] &&
                        RVDic.RPT[moduleIdentifier][reportName] && RVDic.RPT[moduleIdentifier][reportName]._Title) ?
                        RVDic.RPT[moduleIdentifier][reportName]._Title : reportName;

                    var newPage = that.add_tab(reportTitle, true, true).Page;

                    var elems = GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "optionsArea" },
                            { Type: "hr", Class: "small-12 medium-12 large-12", Style: "margin:1rem 0rem;" },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 row",
                                Style: "margin:0rem; margin-bottom:1rem;", Name: "actionArea",
                                Childs: [
                                    {
                                        Type: "div", Class: "small-8 medium-8 large-8",
                                        Childs: [
                                            {
                                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                                Style: "display:inline-block; font-weight:bold; margin-top:0.5rem; width:9rem;",
                                                Properties: [{ Name: "onclick", Value: function () { newPage.ShowReport(); } }],
                                                Childs: [{ Type: "text", TextValue: RVDic.ShowReport }]
                                            },
                                            {
                                                Type: "div", Name: "clearButton",
                                                Class: "rv-air-button rv-border-radius-quarter",
                                                Style: "display:inline-block; margin-top:1rem;" +
                                                    "width:9rem; margin-" + RV_Float + ":1rem;",
                                                Childs: [{ Type: "text", TextValue: RVDic.ClearForm }]
                                            },
                                            {
                                                Type: "div", Name: "parametersButton",
                                                Class: "rv-air-button rv-border-radius-quarter",
                                                Style: "display:inline-block; margin-top:1rem;" +
                                                    "width:9rem; margin-" + RV_Float + ":1rem;",
                                                Childs: [{ Type: "text", TextValue: RVDic.StoredParameters }]
                                            }
                                        ]
                                    },
                                    {
                                        Type: "div", Class: "small-4 medium-4 large-4 RevDirection RevTextAlign",
                                        Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;",
                                        Childs: [
                                            {
                                                Type: "div", Style: "flex:0 0 auto; display:flex; align-items:center; justify-content:center;",
                                                Childs: [{
                                                    Type: "i", Class: "fa fa-file-excel-o fa-2x rv-icon-button",
                                                    Tooltip: RVDic.ExportToExcel,
                                                    Attributes: [{ Name: "src", Value: GlobalUtilities.icon("extensions/xlsx.png") }],
                                                    Properties: [{ Name: "onclick", Value: function () { newPage.ShowReport(true); } }]
                                                }]
                                            },
                                            (!hasChart ? null : {
                                                Type: "div",
                                                Style: "flex:0 0 auto; display:flex; align-items:center; justify-content:center;" +
                                                    "padding-" + RV_RevFloat + ":1rem;",
                                                Childs: [{
                                                    Type: "i", Class: "fa fa-bar-chart fa-2x rv-icon-button",
                                                    Tooltip: RVDic.Chart,
                                                    Properties: [{ Name: "onclick", Value: function () { newPage.ShowReport(null, null, true); } }]
                                                }]
                                            }),
                                            {
                                                Type: "div", Name: "countArea",
                                                Style: "flex:0 0 auto; display:flex; align-items:center; justify-content:center;" +
                                                    "color:green; font-weight:bold; margin-" + RV_RevFloat + ":3rem;"
                                            },
                                            { Type: "div", Style: "flex:1 1 auto;" }
                                        ]
                                    },
                                ]
                            },
                            { Type: "div", Name: "pagesArea", Style: "margin:0px 4px 8px 4px;" },
                            { Type: "div", Class: "small-12 medium-12 large-12", Style: "height:400px;", Name: "reportArea" }
                        ]
                    }], newPage);

                    elems["parametersButton"].onclick = function () {
                        that.saved_parameters(id, (rop || {}).get_data ? rop.get_data() : null, function (op) {
                            if ((rop || {}).set_data) {
                                if (rop.clear) rop.clear();
                                rop.set_data(op || {});
                            }
                        });
                    };

                    var _interfaceLoaded = false;

                    var rop = new ReportOptions[moduleIdentifier][reportName](elems["optionsArea"], initialParams, function () {
                        if (!showAtStart) return;
                        if (!newPage.ShowReport) _interfaceLoaded = true;
                        else newPage.ShowReport();
                    });
                    
                    var reportArea = elems["reportArea"];
                    var clearButton = elems["clearButton"];
                    var countArea = elems["countArea"];
                    var pagesArea = elems["pagesArea"];

                    if (rop.clear) clearButton.onclick = function () { rop.clear(); }
                    else clearButton.style.display = "none";

                    var _oldOptions = null;

                    var _show = async function (excel, pageNumber, chartMode, password) {
                        var _options = _oldOptions = (pageNumber ? _oldOptions : (rop.get_data ? rop.get_data() : {}));
                        if (_options === false) return;
                        _options = _options || {};

                        _options.PageNumber = pageNumber;
                        _options.PageSize = 100;

                        if (chartMode && (rop.ChartContainer || {}).Container) {
                            rop.ChartContainer.Showed = GlobalUtilities.show(rop.ChartContainer.Container);
                            return;
                        }

                        var chartDateFrom = rop.chart_date_from ? rop.chart_date_from() : null;
                        var chartDateTo = rop.chart_date_to ? rop.chart_date_to() : null;
                        
                        if (chartMode && (!(chartDateFrom || {}).Value || !(chartDateTo || {}).Value))
                            return alert(RVDic.Checks.PleaseSelectDateBoundaries);
                        
                        var chartPeriod = !chartMode ? null : await that.select_bar_chart_period();

                        if (chartMode && !chartPeriod) return;

                        var requestParams = {
                            ModuleIdentifier: moduleIdentifier, ReportName: reportName,
                            Excel: excel, Password: Base64.encode(password),
                            ChartMode: chartMode, ChartPeriod: chartPeriod,
                            ChartDateFrom: (chartDateFrom || {}).Value, ChartDateTo: (chartDateTo || {}).Value, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) {
                                    alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    if (!excel && !chartMode) {
                                        reportArea.innerHTML = "";
                                        GlobalUtilities.unblock(newPage);
                                    }
                                    return;
                                }

                                if (chartMode) {
                                    GlobalUtilities.unblock(newPage);

                                    that.show_bar_chart(rop, result, {
                                        ModuleIdentifier: moduleIdentifier,
                                        ReportName: reportName,
                                        Title: reportTitle,
                                        Period: chartPeriod,
                                        DateFrom: chartDateFrom,
                                        DateTo: chartDateTo,
                                        ShowReport: () => _preshow()
                                    });

                                    return;
                                }
                                
                                var columns = result.Columns || [];
                                var rows = result.Rows || [];
                                var actions = result.Actions || {};
                                var totalCount = result.Total || rows.length;

                                pagesArea.innerHTML = "";

                                if (totalCount > rows.length) {
                                    that._create_pages(pagesArea,
                                        { SelectedPage: pageNumber, PagesCount: Math.ceil(totalCount / _options.PageSize), Size: rows.length },
                                        function (pg) { newPage.ShowReport(false, pg); });
                                }

                                countArea.innerHTML = RVDic.Count + ": " + GlobalUtilities.convert_numbers_to_persian(totalCount);

                                for (var i = 0, lnt = columns.length; i < lnt; ++i) {
                                    var newId = "";

                                    if (String(columns[i].ID).indexOf("_Dic") >= 0) {
                                        newId = String(columns[i].ID).replace("_Dic", "");

                                        for (var r = 0; r < rows.length; ++r) {
                                            var val = Base64.decode(rows[r][columns[i].ID]);

                                            rows[r][columns[i].ID] = Base64.encode(((((RVDic.RPT || {})[moduleIdentifier] ||
                                                {})[reportName] || {})[columns[i].ID] || {})[val] || val);
                                        }
                                    }

                                    var hasNumber = /^[A-Za-z][A-Za-z0-9_]+_[0-9]+$/ig.test(columns[i].ID);
                                    var theID = !hasNumber ? columns[i].ID :
                                        columns[i].ID.substr(0, columns[i].ID.lastIndexOf("_"));
                                    var theNumber = !hasNumber ? "" : columns[i].ID.substr(columns[i].ID.lastIndexOf("_"));

                                    if ((((RVDic.RPT || {})[moduleIdentifier] || {})[reportName] || {})[newId || theID])
                                        columns[i].Title = Base64.encode(RVDic.RPT[moduleIdentifier][reportName][newId || theID] + theNumber);

                                    var _action = actions[theID];
                                    if (!_action) continue;

                                    if (_action.Action == "Link" || _action.Action == "Report" ||
                                        _action.Action == "JSON" || _action.Action == "Show") {
                                        for (var j = 0, _ln = rows.length; j < _ln; ++j) {
                                            if (!ReportsManager.__OnCellClick) ReportsManager.__OnCellClick = [];
                                            if (!ReportsManager.__ClickParams) ReportsManager.__ClickParams = [];

                                            var _uidFieldName = "UID__" + (columns[i].ID || "");
                                            var _uid = rows[j][_uidFieldName] = GlobalUtilities.generate_new_guid();

                                            ReportsManager.__ClickParams[_uid] = { Action: _action, RowNumber: j, ColNumber: theNumber };

                                            ReportsManager.__OnCellClick[_uid] = function (uniqueid) {
                                                var acn = ReportsManager.__ClickParams[uniqueid].Action;
                                                var rowNum = ReportsManager.__ClickParams[uniqueid].RowNumber;
                                                var colNumber = ReportsManager.__ClickParams[uniqueid].ColNumber;

                                                var _data = {};

                                                if (acn.Action == "Report") {
                                                    _data.InitialParams = that.process_options(_options);

                                                    for (var rn in (acn.Rename || {})) {
                                                        if (_data.InitialParams[rn])
                                                            _data.InitialParams[acn.Rename[rn]] = _data.InitialParams[rn];
                                                        _data.InitialParams[rn] = undefined;
                                                    }

                                                    var newPms = that._get_new_report_params(rows[rowNum], acn);
                                                    for (var op in (newPms || {}))
                                                        _data.InitialParams[op] = newPms[op];
                                                    _data.ShowAtStart = true;

                                                    var reportId = that.has_report(acn.ModuleIdentifier, acn.ReportName);
                                                    _data.ID = reportId;
                                                    _data.ModuleIdentifier = acn.ModuleIdentifier;
                                                    _data.ReportName = acn.ReportName;

                                                    if (reportId) that.show_report(_data);
                                                }
                                                else if (acn.Action == "Link") {
                                                    for (var r in (acn.Requires || {})) {
                                                        _data[r] = Base64.decode(!colNumber ? rows[rowNum][acn.Requires[r]] :
                                                            rows[rowNum][acn.Requires[r]] || rows[rowNum][acn.Requires[r] + colNumber]);
                                                    }
                                                    var type = acn.Type;
                                                    if ((/\[\[/ig).test(type || "_")) {
                                                        type = type.substr(2).substr(0, type.length - 4);
                                                        type = rows[rowNum][type];
                                                    }
                                                    var linkUrl = that._determine_link_url(type || "", _data);
                                                    if (linkUrl) window.open(linkUrl);
                                                }
                                                else if (acn.Action == "JSON") {
                                                    if (rows[rowNum][acn.Shows]) that.show_json(rows[rowNum][acn.Shows]);
                                                }
                                                else if (acn.Action == "Show") {
                                                    if (rows[rowNum][acn.Shows]) that.show_data(rows[rowNum][acn.Shows]);
                                                }
                                            }

                                            var color = _action.Action == "Link" ? "blue" :
                                                (_action.Action == "JSON" ? "gray" : "green");

                                            columns[i].Template = "<label style='cursor:pointer; color:" +
                                                color + ";' " +
                                                " onclick='ReportsManager.__OnCellClick[\"#: " +
                                                _uidFieldName + "#\"](\"#: " + _uidFieldName + "#\");'>#: " +
                                                (columns[i].ID || "") + "#</label>";
                                        }
                                    } //end of 'if (_action.Action == "Link" || _action.Actions == "Report") {'
                                }

                                reportArea.innerHTML = "";

                                new GridManager(reportArea, {
                                    Options: {
                                        DataSource: rows, Columns: columns,
                                        DataType: "json", PageSize: 5, GridName: "Users", Paging: false, RowsDraggable: false,
                                        Consts: {
                                            PageSize: "PageSize", PageIndex: "PageIndex", SortBy: "SortBy", ASC: "ASC", Width: "Width",
                                            Items: "Rows", ColumnID: "ID", ColumnTitle: "Title", IsNumber: "IsNumber", Total: "Total",
                                            Filters: "Filters", Columns: "Columns", PersianDatePostFix: "_fa", PrimaryKey: "UserID"
                                        }
                                    }
                                });

                                GlobalUtilities.convert_numbers_to_persian(reportArea);

                                if (!excel) GlobalUtilities.unblock(newPage);
                            }
                        } //end of 'var requestParams = ...'

                        for (var _op in _options) requestParams[_op] = _options[_op];

                        if (!excel && !chartMode)
                            reportArea.innerHTML = "<div style='text-align:center;'>" + RVDic.CreatingReport + "..." + "</div>";

                        if (!excel) GlobalUtilities.block(newPage);
                        
                        ReportsAPI.Reports[moduleIdentifier][reportName].Get(requestParams);
                    }; //end of 'var _show = function...'

                    var _do = function (excel, pageNumber, chartMode, hasConfidentiality, done) {
                        if (!excel || !hasConfidentiality) _show(excel, pageNumber, chartMode);
                        else {
                            new NameDialog({
                                Title: RVDic.MSG.PasswordNeededToExportFile, InnerTitle: RVDic.Code, ModificationDetection: false,
                                OnActionCall: function (name, callback) {
                                    if (name) _show(excel, pageNumber, chartMode, name);
                                    callback(true);
                                }
                            });
                        }

                        done();
                    };

                    var processing = false;

                    var _preshow = function (excel, pageNumber, chartMode) {
                        if (processing) return;
                        processing = true;

                        if (!excel) return _do(excel, pageNumber, chartMode, null, function () { processing = false; });

                        PrivacyAPI.GetConfidentialityLevel({
                            ObjectID: id, ParseResults: true,
                            ResponseHandler: function (result) {
                                var hasConfidentiality = (result || {}).LevelID && (result.LevelID > 1);
                                _do(excel, pageNumber, chartMode, hasConfidentiality, function () { processing = false; });
                            }
                        });
                    };

                    newPage.ShowReport = _preshow;
                    if (_interfaceLoaded === true) _preshow();
                } //end of 'OnLoad'
            });
        },

        _create_pages: function (container, params, onPageSelect) {
            params = params || {};

            var selectedPage = params.SelectedPage || 1;
            var pagesCount = params.PagesCount;

            var pagesArr = [];

            var _add = function (pageNumber) {
                pagesArr.push({
                    Type: "div", Class: "rv-circle SoftBorder",
                    Style: "display:inline-block; width:2rem; height:2rem; margin:0.3rem; line-height:2rem;" +
                        "text-align:center; cursor:pointer;" + (pageNumber == selectedPage ? "background-color:white;" : ""),
                    Tooltip: (pageNumber == selectedPage ? String(params.Size) : null),
                    Properties: [{ Name: "onclick", Value: function () { onPageSelect(pageNumber); } }],
                    Childs: [{ Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(String(pageNumber)) }]
                });
            }

            for (var i = 1; i <= pagesCount; ++i) _add(i);

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Childs: pagesArr }
            ], container);
        },

        _decode_json: function (jsonObj) {
            var that = this;

            for (var k in jsonObj) {
                if (GlobalUtilities.get_type(jsonObj[k]) == "json") jsonObj[k] = that._decode_json(jsonObj[k]);
                else if (GlobalUtilities.get_type(jsonObj[k]) == "string" && GlobalUtilities.is_base64(jsonObj[k]))
                    jsonObj[k + "_decoded"] = Base64.decode(jsonObj[k]);
            }

            return jsonObj;
        },

        show_json: function (jsonObj) {
            if (GlobalUtilities.get_type(jsonObj) != "json") {
                try { jsonObj = JSON.parse(jsonObj); }
                catch (e) { jsonObj = { Value: jsonObj }; }
            }

            jsonObj = this._decode_json(jsonObj);

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem; direction:ltr; text-align:left;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.show(_div);
            GlobalUtilities.loading(_div);

            GlobalUtilities.load_files([{ Root: "jQuery/jsonview/", Childs: ["jquery.jsonview.css", "jquery.jsonview.js"] }], {
                OnLoad: function () {
                    _div.innerHTML = "";
                    jQuery(_div).JSONView(jsonObj);
                }
            });
        },

        show_data: function (data) {
            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem; direction:ltr; text-align:left;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.show(_div);

            _div.innerHTML = data;
        },

        saved_parameters: function (reportId, options, onSelect) {
            var that = this;

            var variableName = "Params";
            
            that.RPTParameters = that.RPTParameters || {};

            var theObj = that.RPTParameters[reportId] = that.RPTParameters[reportId] || {
                Container: null,
                Showed: null,
                Options: null,
                OnSelect: null
            };

            theObj.Options = options;
            theObj.OnSelect = onSelect;

            if (theObj.Container) return (theObj.Showed = GlobalUtilities.show(theObj.Container));

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6 rv-air-button rv-circle", Name: "new",
                            Style: "margin:0rem auto; display:none;",
                            Childs: [{ Type: "text", TextValue: "+ " + RVDic.SaveSelectedParameters }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "items",
                            Style: "margin-top:1rem; display:none;"
                        }
                    ]
                }
            ]);

            theObj.Container = elems["container"];

            GlobalUtilities.loading(elems["_div"]);
            theObj.Showed = GlobalUtilities.show(elems["container"]);
            
            RVAPI.GetOwnerVariables({
                OwnerID: reportId, Name: variableName, CurrentUserOnly: true, ParseResults: true,
                ResponseHandler: function (result) {
                    elems["_div"].innerHTML = "";
                    elems["_div"].parentNode.removeChild(elems["_div"]);
                    
                    for (var i = 0, lnt = (result.Variables || []).length; i < lnt; ++i)
                        _add(result.Variables[i]);

                    jQuery(elems["new"]).fadeIn(500);
                }
            });

            var _add = function (variable) {
                jQuery(elems["items"]).fadeIn(500);
                
                var theId = variable.ID;
                var data = variable.Value = JSON.parse(Base64.decode(variable.Value));
                
                var name = Base64.decode(data.Name);
                
                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-air-button-base rv-air-button-white rv-border-radius-quarter SoftBorder",
                        Style: "display:inline-block; margin:0.2rem;", Name: "container",
                        Childs: [
                            {
                                Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                                Style: "margin-" + RV_RevFloat + ":0.5rem;", Name: "removeButton",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            },
                            { Type: "text", TextValue: name }
                        ]
                    }
                ], elems["items"]);

                _el["container"].TheVariable = variable;

                var removing = false;

                _el["removeButton"].onclick = function (e) {
                    e.stopPropagation();
                    if (removing) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "«" + name + "»"), function (r) {
                        if (!r) return;

                        removing = true;

                        RVAPI.RemoveOwnerVariable({
                            ID: theId, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) {
                                    jQuery(_el["container"]).fadeOut(500, function () {
                                        this.remove();
                                        if (!elems["items"].firstChild) jQuery(elems["items"]).fadeOut(0);
                                    });
                                }

                                removing = false;
                            }
                        });
                    });
                };

                _el["container"].onclick = function () {
                    theObj.OnSelect(variable.Value.Options || {});
                    theObj.Showed.Close();
                };
            };

            var saving = false;

            elems["new"].onclick = function () {
                if (saving) return;

                //store options
                var op = { Name: null, Options: that.process_options(theObj.Options) };

                var refStr = JSON.stringify(op.Options);

                var firstChild = elems["items"].firstChild;

                while (firstChild) {
                    if (JSON.stringify(((firstChild.TheVariable || {}).Value || {}).Options) == refStr) {
                        firstChild.classList.remove("rv-air-button-white");
                        firstChild.classList.add("rv-air-button-red");

                        return alert(RVDic.MSG.YouHaveAlreadySavedSimilarParameters, null, function () {
                            setTimeout(function () {
                                firstChild.classList.remove("rv-air-button-red");
                                firstChild.classList.add("rv-air-button-white");
                            }, 2000);
                        });
                    }

                    firstChild = firstChild.nextSibling;
                }
                //end of store options

                saving = true;

                GlobalUtilities.load_files(["Public/NameDialog.js"], {
                    OnLoad: function () {
                        new NameDialog({
                            Title: RVDic.Name, InnerTitle: RVDic.Name, 
                            OnActionCall: function (name, callback) {
                                if (!name) return callback(!(saving = false));

                                op.Name = Base64.encode(name);

                                RVAPI.SetOwnerVariable({
                                    OwnerID: reportId, Name: variableName,
                                    Value: Base64.encode(JSON.stringify(op)), ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                        else if (result.Succeed) _add(result.Variable);

                                        callback(!!(result || {}).Succeed);

                                        saving = false;
                                    }
                                });
                            }
                        });
                    }
                });
            };
        },

        select_bar_chart_period: async () => {
            var that = this;

            var period = null;

            return new Promise((resolve, reject) => {
                var _div = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Class: "rv-title",
                            Childs: [{ Type: "text", TextValue: RVDic.BasedOn + ":" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin-top:1rem;",
                            Childs: ["Year", "Season", "Month"].map(itm => ({
                                Type: "div", Class: "small-4 medium-4 large-4 rv-border-radius-half rv-bg-color-trans-white",
                                Style: "height:4rem; display:flex; align-items:center; justify-content:center; cursor:pointer;",
                                Properties: [{ Name: "onclick", Value: function () { period = itm; showed.Close(); } }],
                                Childs: [{ Type: "text", TextValue: RVDic[itm] || itm }]
                            }))
                        }
                    ]
                }])["_div"];

                var showed = GlobalUtilities.show(_div, { OnClose: () => resolve(period) });
            });
        },

        get_bar_label: function (periodType, value) {
            if (isNaN(+value) || (GlobalUtilities.get_type(periodType) != "string") || (value.length < 4)) return value;

            var year = value.substr(0, 4);
            var datePart = value.length <= 4 ? 0 : +value.substr(4);

            switch (periodType.toLowerCase()) {
                case "year":
                    return year;
                case "season":
                    return (datePart >= 1) && (datePart <= 4) ? RVDic.X.Season[String(datePart)] + " " + year : value;
                case "month":
                    return (datePart >= 1) && (datePart <= 12) ? RVDic.X.Month[String(datePart)] + " " + year : value;
                default:
                    return value;
            }
        },

        show_bar_chart: function (reportObject, data, options) {
            var that = this;
            reportObject = reportObject || {};

            reportObject.ChartContainer = reportObject.ChartContainer || { Container: null, Showed: null };

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem; position:relative;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "rv-circle",
                        Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.5rem; color:white; width:1.5rem; height:1.5rem;" + 
                            "background-color:red; display:flex; align-items:center; justify-content:center; cursor:pointer;",
                        Properties: [{
                            Name: "onclick", Value: () => {
                                reportObject.ChartContainer.Showed.Close();
                                reportObject.ChartContainer = null;
                            }
                        }],
                        Childs: [{Type: "i", Class: "fa fa-times"}]
                    },
                    { Type: "div", Name: "_div" }
                ]
            }]);

            var _div = elems["_div"];

            GlobalUtilities.loading(_div);

            reportObject.ChartContainer.Container = elems["container"];
            reportObject.ChartContainer.Showed = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["Lib/chart.min.js"], {
                OnLoad: () => that._show_bar_chart(_div, reportObject, data, GlobalUtilities.extend(options || {}, {
                    Close: () => reportObject.ChartContainer.Showed.Close()
                }))
            });
        },

        _show_bar_chart: function (container, reportObject, data, options) {
            var that = this;
            options = options || {};
            data = data || {};
            reportObject = reportObject || {};

            container.innerHTML = "";
            
            var period = options.Period;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-title",
                    Childs: [{ Type: "text", TextValue: options.Title }]
                },
                {
                    Type: "div", Class: "rv-border-radius-1", Style: "padding:1rem; background-color:white;",
                    Childs: [{ Type: "canvas", Name: "chart" }]
                }
            ], container);

            var colNames = (data.Columns || []).filter(c => c.ID != "Period").map(c => c.ID);
            var rowPeriods = (data.Rows || []).map(r => Base64.decode(r.Period));
            var rowLabels = (data.Rows || []).map(r => that.get_bar_label(period, Base64.decode(r.Period)));
            var rowColors = (data.Rows || []).map(r => GlobalUtilities.generate_color(Base64.decode(r.Period)));

            var datasets = colNames.map(col => {
                var dicEntry = (RVDic.RPT[options.ModuleIdentifier] || {})[options.ReportName] || {};
                
                return {
                    label: (dicEntry.BarChart || {})[col] || dicEntry[col] || col,
                    data: (data.Rows || []).map(r => GlobalUtilities.get_type(r[col]) == "number" ? r[col] : + Base64.decode(r[col])),
                    backgroundColor: colNames.length == 1 ? rowColors.map(c => c.Color) :
                        GlobalUtilities.generate_color(Base64.encode(col)).Color,
                    borderColor: colNames.length == 1 ? rowColors.map(c => c.Dark) :
                        GlobalUtilities.generate_color(Base64.encode(col)).Dark,
                    borderWidth: 1
                };
            });

            new Chart(elems["chart"].getContext("2d"), {
                type: 'bar',
                data: {
                    labels: rowLabels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: datasets.length > 1 } },
                    //events: ['click'],
                    onClick: (e, bar) => {
                        if (((bar || []).length < 1)) return;

                        var selectedIndex = bar[0].index;
                        var periodObj = data.ChartPeriods[rowPeriods[selectedIndex]];

                        if (!!periodObj && reportObject.chart_date_from) {
                            var fromVal = selectedIndex > 0 ? (periodObj.From || {}).Value : (options.DateFrom || {}).Value;
                            var fromLbl = selectedIndex > 0 ? (periodObj.From || {}).Label : (options.DateFrom || {}).Label;

                            reportObject.chart_date_from(fromVal, fromLbl);
                        }

                        if (!!periodObj && reportObject.chart_date_to) {
                            var toVal = selectedIndex < (rowPeriods.length - 1) ?
                                (periodObj.To || {}).Value : (options.DateTo || {}).Value;
                            var toLbl = selectedIndex < (rowPeriods.length - 1) ?
                                (periodObj.To || {}).Label : (options.DateTo || {}).Label;
                            
                            reportObject.chart_date_to(toVal, toLbl);
                        }

                        if (options.Close) options.Close();

                        if (options.ShowReport) options.ShowReport();
                    }
                }
            });
        },

        group_limits_for_admins: function () {
            var that = this;

            var nodeTypesList = null;

            var processing = false;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "padding:1rem; margin:0 auto;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "rv-title",
                        Childs: [{Type: "text", TextValue: "گروه هایی که مدیران آنها میتوانند گزارشات مربوط به گروه تحت نظارت خود را مشاهده کنند"}]
                    },
                    {
                        Type: "div", Style: "display:flex; flex-flow:row; padding-top:1rem;",
                        Childs: [
                            {
                                Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":1rem;",
                                Childs: [{Type: "text", TextValue: "انتخاب گروه ها" + ":"}]
                            },
                            { Type: "div", Style: "flex:1 1 auto;", Name: "groups" }
                        ]
                    },
                    {
                        Type: "div", Style: "display:flex; flex-flow:row; justify-content:center; padding-top:2rem; ",
                        Childs: [
                            {
                                Type: "div", Class: "rv-air-button rv-circle",
                                Style: "flex:0 0 auto; width:8rem; margin:0 1rem;",
                                Properties: [{ Name: "onclick", Value: () => showed.Close() }],
                                Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                            },
                            {
                                Type: "div", Class: "rv-air-button rv-circle",
                                Style: "flex:0 0 auto; width:8rem; margin:0 1rem;",
                                Properties: [{
                                    Name: "onclick",
                                    Value: () => {
                                        if (processing) return;
                                        processing = true;

                                        var nodeTypes = !nodeTypesList ? null : nodeTypesList.get_items();

                                        ReportsAPI.SetGroupLimitsForAdmins({
                                            NodeTypeIDs: (nodeTypes || []).map(x => x.ID).join("|"),
                                            ParseResults: true,
                                            ResponseHandler: function (result) {
                                                processing = false;

                                                if ((result || {}).ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                                else {
                                                    that.Objects.GroupLimitsForAdmins = (nodeTypes || []).map(x => ({
                                                        NodeTypeID: x.ID,
                                                        TypeName: Base64.encode(x.Title)
                                                    }));

                                                    showed.Close();
                                                }
                                            }
                                        });
                                    }
                                }],
                                Childs: [{ Type: "text", TextValue: RVDic.Save }]
                            }
                        ]
                    }
                ]
            }]);

            GlobalUtilities.loading(elems["groups"]);
            var showed = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    elems["groups"].innerHTML = "";

                    nodeTypesList = new NewSingleDataContainer(elems["groups"], {
                        InputClass: "rv-input",
                        InputStyle: "width:100%; font-size:0.7rem;",
                        InnerTitle: RVDic.NodeTypeSelect + "...",
                        NoButtons: true,
                        AjaxDataSource: CNAPI.GetNodeTypesDataSource({ Extensions: ["Members", "Group", "Experts"].join(",") }),
                        ResponseParser: function (responseText) {
                            return (GlobalUtilities.to_json(responseText).NodeTypes || [])
                                .map(itm => [Base64.decode(itm.TypeName), itm.NodeTypeID]);
                        }
                    });

                    (that.Objects.GroupLimitsForAdmins || [])
                        .forEach(g => nodeTypesList.add_item(Base64.decode(g.TypeName), g.NodeTypeID));
                }
            });
        },

        access_settings: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                Style: "padding:1rem; margin:0 auto; height:calc(100vh - 10vw);", Name: "container"
            }]);

            var sections = [];
            
            Object.keys(ReportsAPI.Reports || {})
                .filter(key => ((that.Options.Modules || {})[key] !== false) && that.has_report(key))
                .forEach(moduleIdentifier => {
                    var items = Object.keys(ReportsAPI.Reports[moduleIdentifier])
                        .filter(rptName => !(new RegExp(/^_/g)).test(rptName))
                        .map(reportName => {
                            var fullRptName = (moduleIdentifier + "_" + reportName).toLowerCase();
                            
                            return {
                                ID: (that.Objects.Reports[fullRptName] || {}).ID,
                                Title: (((RVDic.RPT || {})[moduleIdentifier] || {})[reportName] || {})._Title || reportName
                            };
                        })
                        .filter(itm => !!itm.ID);

                    sections.push({
                        Name: moduleIdentifier,
                        Title: ((RVDic.RPT || {})[moduleIdentifier] || {})._Title || moduleIdentifier,
                        Items: items
                    });
                });

            GlobalUtilities.loading(elems["container"]);
            var showed = GlobalUtilities.show(elems["container"]);
            
            GlobalUtilities.load_files(["PrivacyManager/BatchPermissionSettings.js"], {
                OnLoad: function () {
                    new BatchPermissionSettings(elems["container"], {
                        Sections: sections,
                        Options: {
                            ObjectType: "Report",
                            PermissionType: "View",
                            OnCancel: () => showed.Close(),
                            OnSave: () => showed.Close()
                        }
                    });
                }
            });
        }
    }
})();