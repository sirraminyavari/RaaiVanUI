(function () {
    if (window.ResumeReportParameters) return;

    window.ResumeReportParameters = function (containerDiv, params, done) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        var that = this;

        this.Objects = {
            ItemTypeSelect: null,
            UsersList: null,
            NodeTypeSelect: null,
            NodesList: null,
            HierarchyCheckbox: null,
            BeginDate: null,
            FinishDate: null
        };

        this.Options = {
            IgnoreDate: params.IgnoreDate
        };

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI"] },
            "SingleDataContainer/NewSingleDataContainer.js"
        ], { OnLoad: function () { that._initialize(params, done); } });
    }

    ResumeReportParameters.prototype = {
        _initialize: function (params, done) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-6 medium-6 large-6", Style: "margin-bottom:1rem;",
                    Childs: [{
                        Type: "select", Class: "rv-input", Name: "itemTypeSelect",
                        Style: "max-width:12rem; font-size:0.7rem;",
                        Childs: [{ Name: "User", Title: RVDic.User }, { Name: "Node", Title: RVDic.Group }].map(function (key) {
                            return {
                                Type: "option", Attributes: [{ Name: "title", Value: key.Name }],
                                Childs: [{ Type: "text", TextValue: key.Title }]
                            };
                        })
                    }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                {
                    Type: "div", Class: "small-6 medium-6 large-6", Name: "userDiv",
                    Style: "padding-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "div", Name: "usersList" }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "nodeDiv", Style: "margin:0rem; display:none;",
                    Childs: [
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "nodeTypeSelect",
                            Style: "padding-" + RV_RevFloat + ":0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6", Name: "nodesList",
                            Style: "padding-" + RV_Float + ":0.5rem;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:0.5rem; display:flex; flex-flow:row;",
                            Childs: [
                                {
                                    Type: "div", Style: "flex:0 0 auto;",
                                    Childs: [{Type: "checkbox", Style: "width:1.2rem; height:1.2rem;", Name: "hierarchy"}]
                                },
                                {
                                    Type: "div", Style: "flex:1 0 auto; padding-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.PRVC.CalculateHierarchy }]
                                }
                            ]
                        }
                    ]
                },
                (that.Options.IgnoreDate ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
                    ]
                })
            ], that.ContainerDiv);

            var usersDiv = elems["userDiv"];
            var nodeDiv = elems["nodeDiv"];
            that.Objects.ItemTypeSelect = elems["itemTypeSelect"];
            that.Objects.HierarchyCheckbox = elems["hierarchy"];

            that.Objects.ItemTypeSelect.onchange = function () {
                var itemType = this[this.selectedIndex].title;
                jQuery(usersDiv)[itemType == "User" ? "fadeIn" : "fadeOut"](0);
                jQuery(nodeDiv)[itemType == "Node" || itemType == "Complex" ? "fadeIn" : "fadeOut"](0);
                jQuery(elems["nodesList"])[itemType == "Node" ? "fadeIn" : "fadeOut"](0);
                jQuery(elems["listsList"])[itemType == "Complex" ? "fadeIn" : "fadeOut"](0);
            };

            that.Objects.UsersList = new NewSingleDataContainer(elems["usersList"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                NoButtons: true,
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    var users = JSON.parse(responseText).Users || [];
                    var arr = [];
                    for (var i = 0, lnt = users.length; i < lnt; ++i) {
                        var fullname = Base64.decode(users[i].FirstName) + " " + Base64.decode(users[i].LastName);
                        arr.push([fullname + " - " + Base64.decode(users[i].UserName), users[i].UserID]);
                    }
                    return arr;
                }
            });

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID || ""]);
                    return arr;
                },
                OnSelect: function () {
                    var index = this.selectedIndex;
                    var nodeTypeId = this.values[index];
                    var nodeType = this.keywords[index];

                    that.Objects.NodesList.bind_data_source(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.NodesList.Objects.Autosuggest.InputElement, RVDic.SelectN.replace("[n]", nodeType) + "...");

                    that.Objects.ListsList.bind_data_source(CNAPI.GetLists({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.ListsList.Objects.Autosuggest.InputElement, RVDic.ComplexSelect + "...");
                }
            });

            that.Objects.NodesList = new NewSingleDataContainer(elems["nodesList"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + "...",
                NoButtons: true,
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name), nodes[i].NodeID]);
                    return arr;
                }
            });

            if (!that.Options.IgnoreDate) {
                GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) {
                    that.Objects.BeginDate = cal;
                });

                GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) {
                    that.Objects.FinishDate = cal;
                });
            }

            that.set_data(params);

            done();
        },

        set_data: function (params) {
            var that = this;
            params = params || {};

            if (that.Objects.HierarchyCheckbox)
                that.Objects.HierarchyCheckbox[!!params.Hierarchy ? "check" : "uncheck"]();

            if (!that.Options.IgnoreDate) {
                if (params.DateFrom && that.Objects.BeginDate)
                    that.Objects.BeginDate.Set({ Value: params.DateFrom.Value, Label: params.DateFrom.Title });

                if (params.DateTo && that.Objects.FinishDate)
                    that.Objects.FinishDate.Set({ Value: params.DateTo.Value, Label: params.DateTo.Title });
            }
        },

        get_data: function () {
            var that = this;

            var itemType = that.Objects.ItemTypeSelect[that.Objects.ItemTypeSelect.selectedIndex].title;

            var beginDate = !that.Objects.BeginDate ? {} : that.Objects.BeginDate.Get();
            var finishDate = !that.Objects.FinishDate ? {} : that.Objects.FinishDate.Get();

            return GlobalUtilities.extend({
                UserIDs: itemType == "User" ? that.Objects.UsersList.get_items_string("|") : "",
                GroupIDs: itemType == "Node" ? that.Objects.NodesList.get_items_string("|") : "",
                Hierarchy: !that.Objects.HierarchyCheckbox ? null : that.Objects.HierarchyCheckbox.Checked
            }, that.Options.IgnoreDate ? {} : {
                DateFrom: beginDate.Value,
                _Title_DateFrom: beginDate.Label,
                DateTo: finishDate.Value,
                _Title_DateTo: finishDate.Label
            });
        },

        clear: function () {
            var that = this;

            that.Objects.ItemTypeSelect.selectedIndex = 0;
            that.Objects.ItemTypeSelect.onchange();
            that.Objects.UsersList.clear();
            that.Objects.NodeTypeSelect.clear();
            that.Objects.NodesList.clear();
            if (that.Objects.HierarchyCheckbox) that.Objects.HierarchyCheckbox.uncheck();
            if (that.Objects.BeginDate) that.Objects.BeginDate.Clear();
            if (that.Objects.FinishDate) that.Objects.FinishDate.Clear();
        }
    }
})();