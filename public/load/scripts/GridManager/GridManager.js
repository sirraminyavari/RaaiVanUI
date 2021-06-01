(function () {
    if (window.GridManager) return;

    window.GridManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;
        params = params || {};

        this.Objects = { Grid: null, Base64Columns: [], Filters: [] };

        this.Options = {
            OnChange: null, OnDataBinding: null, OnDataBound: null, Paging: true, PageSize: 10,
            Sortable: true, Scrollable: true, Columns: [], DataType: "json", GridName: "TableName", ServerSorting: true,
            DataSource: null, AjaxDataSource: null, DeniedColsDataSource: null, RowsDraggable: false,
            Consts: {
                PageSize: "PageSize", PageIndex: "PageIndex", SortBy: "SortBy", ASC: "ASC", Width: "Width",
                Items: "Items", ColumnID: "ID", ColumnTitle: "Title", IsNumber: "IsNumber", Total: "Total", Filters: "Filters",
                Columns: "Columns", PersianDatePostFix: "_fa", PrimaryKey: "ItemID"
            }
        }

        params.Options = params.Options || {};
        for (var op in params.Options) this.Options[op] = params.Options[op];

        this.Options.Columns = []; //Column: {ColumnID: String, ColumnTitle: Base64_String, IsImage: bool, Encoded: bool}
        var cols = params.Options.Columns || [];

        var that = this;

        var _init = function (deniedCols) {
            var dCols = deniedCols ? (deniedCols[that.Options.Consts.Columns] || []) : [];

            var _add_col = function (colsArr, col) {
                if (col.Encoded === true) that.Objects.Base64Columns.push(col[that.Options.Consts.ColumnID]);

                if (String(col[that.Options.Consts.ColumnID] || "").indexOf("_Hide") >= 0) return;

                for (var i = 0, lnt = dCols.length; i < lnt; ++i)
                    if (dCols[i] == (col[that.Options.Consts.ColumnID] || "")) return;

                colsArr.push({
                    field: col[that.Options.Consts.ColumnID] || "", encoded: col.EncodeData === false ? false : true,
                    width: (col[that.Options.Consts.Width] > 0 ? col[that.Options.Consts.Width] : 200) + "px",
                    title: Base64.decode(col[that.Options.Consts.ColumnTitle] || ""),
                    type: (col[that.Options.Consts.IsNumber] === true ? "number" : undefined),
                    template: col.Template
                });
            }

            for (var i = 0, lnt = cols.length; i < lnt; ++i) _add_col(that.Options.Columns, cols[i]);

            that._create_grid();
        }

        if (window.RV_RTL) {
            GlobalUtilities.load_files(["kendo.rtl.css", "KendoRTLRepair.css"]);
            document.body.setAttribute("class", document.body.getAttribute("class") + " k-rtl");
        }

        if (that.Options.DeniedColsDataSource && that.Options.DeniedColsDataSource != "")
            $.getJSON(that.Options.DeniedColsDataSource, null, function (d) { _init(d); });
        else
            _init();
    }

    GridManager.prototype = {
        _parse_items: function (d) {
            var that = this;
            var _postFix = that.Options.Consts.PersianDatePostFix || "";

            var items = d[that.Options.Consts.Items] || d || [];
            for (var i = 0, lnt = that.Objects.Base64Columns.length; i < lnt; ++i) {
                for (var j = 0, _ln = items.length; j < _ln; ++j) {
                    items[j][that.Objects.Base64Columns[i]] = Base64.decode(items[j][that.Objects.Base64Columns[i]] || "");
                    if (items[j][that.Objects.Base64Columns[i] + _postFix]) items[j][that.Objects.Base64Columns[i] + _postFix] =
                        Base64.decode(items[j][that.Objects.Base64Columns[i] + _postFix] || "");
                }
            }

            if (window.RV_RTL === true && items.length > 0) {
                for (var i = 0, lnt = that.Options.Columns.length; i < lnt; ++i) {
                    if (items[0][that.Options.Columns[i].field + _postFix]) {
                        for (var j = 0, _ln = items.length; j < _ln; ++j)
                            items[j][that.Options.Columns[i].field] = items[j][that.Options.Columns[i].field + _postFix];
                    }
                }
            }

            return items;
        },

        _create_grid: function () {
            var that = this;

            var dataSource = that.Options.DataSource ? that._parse_items(that.Options.DataSource) : {
                serverSorting: that.Options.ServerSorting,
                serverPaging: true,
                transport: {
                    read: {
                        url: that.Options.AjaxDataSource || "",
                        data: function () {
                            var filters = that.Objects.Filters || [];
                            var filtersJson = "";
                            for (var i = 0, lnt = filters.length; i < lnt; ++i)
                                filtersJson += (i == 0 ? "" : "|") + filters[i].Filter + ":" + Base64.encode(filters[i].Value);

                            var _srt = that.get_sort();
                            var _data = '{' +
                                    (String(that.Options.Consts.PageSize).toLowerCase() == "pagesize" ? '' :
                                        '"' + that.Options.Consts.PageSize + '":"' + that.get_page_size() + '",') +
                                    '"' + that.Options.Consts.PageIndex + '":"' + that.get_page_index() + '"' +
                                    ',"' + that.Options.Consts.SortBy + '":"' + (_srt.ID || '') + '"' +
                                    ',"' + that.Options.Consts.ASC + '":' + (_srt.ASC ? 'true' : 'false') +
                                    ',"' + that.Options.Consts.Filters + '":"' + Base64.encode(filtersJson) + '"}';

                            return JSON.parse(_data);
                        },
                        dataType: that.Options.DataType || "json"
                    }
                },
                pageSize: !isNaN(that.Options.PageSize) && that.Options.PageSize > 0 ? that.Options.PageSize : 10,
                schema: {
                    data: function (d) {
                        var items = that._parse_items(d);

                        setTimeout(function () {
                            var rows = that.Objects.Grid.table.get(0).getElementsByTagName("tr");
                            for (var i = 0, lnt = rows.length; i < lnt; ++i) {
                                rows[i].GridName = that.Options.GridName || "";
                                rows[i].PrimaryKey = items[i][that.Options.Consts.PrimaryKey] || "";
                            }
                        }, 10);

                        return items;
                    },
                    total: function (response) {
                        return isNaN(+response[that.Options.Consts.Total]) ? 0 : +response[that.Options.Consts.Total];
                    }
                }
            };

            $(that.ContainerDiv).kendoGrid({
                dataSource: dataSource,
                dataBound: that.Options.OnDataBound,
                dataBinding: function (e) { if (that.Options.OnDataBinding) that.Options.OnDataBinding(e); },
                selectable: false, // "row", // "multiple row" OR "multiple, cell",
                pageable: that.Options.Paging === false ? false : true,
                sortable: that.Options.Sortable === false ? false : true,
                scrollable: that.Options.Scrollable === false ? false : true, //{ virtual: true }
                groupable: false,
                reorderable: true,
                resizable: true,
                columns: that.Options.Columns
            });

            that.Objects.Grid = $(that.ContainerDiv).data("kendoGrid");

            //dar morurgare google chrome va dar halate farsi, tavazone anavine field ha va record ha be ham mirizad
            //code zir, in be ham rikhtegi ra eslah mikonad
            if (!/firefox/i.test(navigator.userAgent.toLowerCase())) {
                var itm = (that.ContainerDiv.getElementsByClassName("k-grid-header") || [{}])[0];
                if ((itm.style || {}).paddingLeft) { itm.style.paddingLeft = "35px"; }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (that.Options.RowsDraggable === true) {
                that.Objects.Grid.table.kendoDraggable({
                    filter: "tbody > tr", // "tbody > tr:not(.k-grid-edit-row)",
                    group: "gridGroup",
                    cursorOffset: { top: 10, left: 10 },
                    hint: function (e) {
                        var htmlElement = e.get(0);

                        var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "k-grid k-widget", Name: "container",
                        Childs: [{ Type: "table", Childs: [{ Type: "tbody", Childs: [{ Type: "tr", Name: "data" }] }] }]
                    }
                        ]);

                        elems["data"].innerHTML = e.html();

                        elems["container"].GridName = htmlElement.GridName;
                        elems["container"].PrimaryKey = htmlElement.PrimaryKey;

                        return $(elems["container"]);
                    }
                });
            }
        },

        set_filters: function (filters) {
            this.Objects.Filters = filters || [];
            this.Objects.Grid.dataSource.page(1);
        },

        drop_filters: function () {
            if (this.Objects.Filters.length == 0) return;
            this.Objects.Filters = [];
            this.Objects.Grid.dataSource.page(1);
        },

        get_page_index: function () {
            return this.Objects.Grid ? this.Objects.Grid.pager.page() - 1 : 0;
        },

        get_page_size: function () {
            return this.Objects.Grid ? this.Objects.Grid.dataSource.take() || this.Objects.Grid.pager.pageSize() : 0;
        },

        get_sort: function () {
            if (!this.Objects.Grid) return {};
            var sorts = this.Objects.Grid.dataSource.sort() || [];
            return sorts.length > 0 ? { ID: sorts[0].field || "", ASC: sorts[0].dir === "asc" } : {};
        },

        get_filters: function () {
            return this.Objects.Grid ? this.Objects.Grid.dataSource.filter() : "";
        },

        get_column_id: function (title) {
            for (var i = 0, lnt = (this.Options.Columns || []).length; i < lnt; ++i)
                if (this.Options.Columns[i] && this.Options.Columns[i].title == title) return this.Options.Columns[i].field;
            return null;
        },

        get_column_widths: function () {
            var grid = this.Objects.Grid;
            var widths = [];
            for (var i = 0, lnt = grid.columns.length; i < lnt; ++i)
                widths.push({ ID: grid.columns[i].field, Width: String(grid.columns[i].width).replace("px", "") });
            return widths;
        }
    }
})();