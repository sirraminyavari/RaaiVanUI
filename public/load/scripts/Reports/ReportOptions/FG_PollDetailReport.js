(function () {
    if (((window.ReportOptions || {}).FG || {}).PollDetailReport) return;
    window.ReportOptions = window.ReportOptions || {};
    window.ReportOptions.FG = window.ReportOptions.FG || {};

    var __FilterForms = {};

    window.ReportOptions.FG.PollDetailReport = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            PollSelect: null,
            RunningVersion: null,
            NodeTypeSelect: null
        };

        this.Options = {
            Modules: params.Modules || {}
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js", "API/CNAPI.js"], {
            OnLoad: function () { that._initialize(params, done); }
        });
    }

    ReportOptions.FG.PollDetailReport.prototype = {
        _initialize: function (params, done) {
            var that = this;

            var selectedPollId = null;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "pollSelect",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "runSelect",
                            Style: "padding-" + RV_Float + ":0.5rem; display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-air-button rv-circle Ellipsis", Name: "runButton",
                                    Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.RunningVersion) }]
                                }
                            ]
                        },
                        {Type: "div", Class: "small-12 medium-12 large-12"},
                        { Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeTypeSelect", Style: "padding-" + RV_RevFloat + ":0.5rem; margin-top:0.5rem;" },
                    ]
                }
            ], that.ContainerDiv);

            elems["runButton"].onclick = function () {
                that.select_running_version(selectedPollId, function () {
                    var pl = that.Objects.RunningVersion || {};
                    
                    var txt = "";
                    if (pl.PollID) {
                        if (pl.Name) txt += "<span>" + GlobalUtilities.convert_numbers_to_persian(pl.Name) + "</span>";

                        if (pl.BeginDate) {
                            txt += "<span class='rv-border-radius-quarter' " +
                                "style='background-color:white; padding:0rem 0.2rem; font-size:0.6rem;" +
                                "margin-" + RV_Float + ":" + (txt ? "0.5rem" : "0rem") + "; color:black;'>" +
                                RVDic.From + ": " + GlobalUtilities.convert_numbers_to_persian(pl.BeginDate) + "</span>";
                        }

                        if (pl.FinishDate) {
                            txt += "<span class='rv-border-radius-quarter' " +
                                "style='background-color:white; padding:0rem 0.2rem; font-size:0.6rem;" +
                                "margin-" + RV_Float + ":" + (txt ? "0.5rem" : "0rem") + "; color:black;'>" +
                                RVDic.To + ": " + GlobalUtilities.convert_numbers_to_persian(pl.FinishDate) + "</span>";
                        }
                    }

                    elems["runButton"].innerHTML = RVDic.SelectN.replace("[n]", RVDic.RunningVersion) + 
                        (txt ? " (" + txt + ")" : "");
                });
            };

            that.Objects.PollSelect = GlobalUtilities.append_autosuggest(elems["pollSelect"], {
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.PollSelect + "...",
                AjaxDataSource: FGAPI.GetPolls(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Polls || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i].Name || ""), items[i].PollID]);
                    return arr;
                },
                OnSelect: function () {
                    selectedPollId = this.values[this.selectedIndex];
                    jQuery(elems["runSelect"]).fadeIn(500);
                }
            });

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.OwnerNodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i].TypeName || ""), items[i].NodeTypeID]);
                    return arr;
                }
            });

            that.set_data(params);

            done();
        },

        select_running_version: function (pollId, callback) {
            var that = this;

            that.__SelectDialog = that.__SelectDialog || {};

            if (that.__SelectDialog[pollId])
                return (that.__SelectDialog[pollId].Showed = GlobalUtilities.show(that.__SelectDialog[pollId]));

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                }
            ]);

            that.__SelectDialog[pollId] = elems["_div"];

            GlobalUtilities.loading(elems["_div"]);
            that.__SelectDialog[pollId].Showed = GlobalUtilities.show(elems["_div"]);

            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                OnLoad: function () {
                    that._select_running_version(elems["_div"], pollId, function () {
                        that.__SelectDialog[pollId].Showed.Close();
                        callback();
                    });
                }
            });
        },

        _select_running_version: function (container, pollId, callback) {
            var that = this;

            new NewSimpleListViewer(container, {
                AutoGrow: false,
                Options: {
                    InnerWidthOffset: 0, Width: null,
                    OnDataRequest: function (options, done) {
                        FGAPI.GetPolls(GlobalUtilities.extend(options || {}, {
                            IsCopyOfPollID: pollId, ParseResults: true,
                            ResponseHandler: function (result) { done(result.Polls || []); }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        item = item || {};
                        
                        var id = item.PollID;
                        var name = Base64.decode(item.Name || item.RefName);
                        var beginDate = item.BeginDate;
                        var finishDate = item.FinishDate;

                        var elems = GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Name: "_div",
                                Class: "WarmBorder rv-border-radius-quarter rv-bg-color-trans-white",
                                Style: "display:inline-block; margin:0.3rem; padding:0.3rem; cursor:pointer;",
                                Childs: [
                                    {
                                        Type: "div", Style: "display:inline-block;",
                                        Childs: [{ Type: "text", TextValue: name }]
                                    },
                                    {
                                        Type: "div",
                                        Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:" + (beginDate ? "inline-block" : "none") + ";" +
                                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.From + ": " + beginDate }]
                                    },
                                    {
                                        Type: "div",
                                        Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:" + (finishDate ? "inline-block" : "none") + ";" +
                                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.To + ": " + finishDate }]
                                    }
                                ]
                            }
                        ], container);

                        elems["_div"].onclick = function () {
                            that.Objects.RunningVersion = { PollID: id, Name: name, BeginDate: beginDate, FinishDate: finishDate };
                            callback();
                        };

                        params.OnAfterAdd();
                    }
                }
            });
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (params.PollID)
                that.Objects.RunningVersion = { PollID: params.PollID.Value, Name: params.PollID.Title };

            if (params.NodeTypeID)
                that.Objects.NodeTypeSelect.set_item(params.NodeTypeID.Value || "", params.NodeTypeID.Title || "");
        },

        get_data: function () {
            var that = this;

            var pollId = (that.Objects.RunningVersion || {}).PollID;
            var pollName = (that.Objects.RunningVersion || {}).Name;

            if (!pollId) {
                alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.Poll));
                return false;
            }

            var index = that.Objects.NodeTypeSelect.selectedIndex;
            var nodeTypeId = index < 0 ? "" : that.Objects.NodeTypeSelect.values[index];
            var nodeType = index < 0 ? "" : that.Objects.NodeTypeSelect.keywords[index];

            return {
                PollID: pollId, _Title_PollID: pollName,
                NodeTypeID: nodeTypeId, _Title_NodeTypeID: nodeType
            };
        },

        clear: function () {
            var that = this;

            that.Objects.PollSelect.empty();
            that.Objects.NodeTypeSelect.empty();
        }
    }
})();