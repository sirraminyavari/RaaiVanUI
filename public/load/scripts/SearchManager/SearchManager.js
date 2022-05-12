(function () {
    if (window.SearchManager) return;

    window.SearchManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null,
            NodeTypesArea: null,
            ServicesArea: null,
            ExportToExcelButton: null
        };

        this.Objects = {
            SearchInput: params.SearchInput,
            SearchButton: params.SearchButton,
            LastItem: null,
            MoreButton: null,
            MustHaveContentCheckbox: null,
            NodesCheckbox: null,
            QuestionsCheckbox: null,
            UsersCheckbox: null,
            FilesCheckbox: null,
            InitialSearch: params.InitialSearch,
            CurrentItems: {},
            NodeTypes: {},
            Trees: {},
            NodeOptions: {
                NodeTypesContainer: null, TitleCheckbox: null, DescriptionCheckbox: null,
                ContentCheckbox: null, TagsCheckbox: null, FileContentCheckbox: null
            },
            QuestionOptions: { TitleCheckbox: null, DescriptionCheckbox: null, ContentCheckbox: null },
            FileOptions: {
                PDFCheckbox: null, DOCCheckbox: null, XLSCheckbox: null, PPTCheckbox: null,
                TXTCheckbox: null, XMLCheckbox: null, HTMLCheckbox: null
            },
            ItemsToShow: {},
            FileViewers: {},
            Services: null
        };

        this.Options = GlobalUtilities.extend({
            Modules: null,
            HideOptions: null,
            SuggestServices: null,
            OnBeforeSearch: null,
            OnSearchEnd: null,
            ShowExactItems: true,
            ItemBuilder: null
        }, params.Options || {});

        this.Options.Modules = this.Options.Modules || {};
        this.Options.Modules.USR = GlobalUtilities.get_type(((params.Options || {}).Modules || {}).USR) != "boolean" ||
            params.Options.Modules.USR === true;
        this.Options.Modules.CN = GlobalUtilities.get_type(((params.Options || {}).Modules || {}).CN) != "boolean" ||
            params.Options.Modules.CN === true;
        
        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["SearchAPI", "DocsAPI", "CNAPI", "UsersAPI"] }], {
            OnLoad: function () { that._preinit(); }
        });
    }

    SearchManager.prototype = {
        _preinit: function () {
            var that = this;

            if (!that.Options.SuggestServices) that._initialize();
            else {
                CNAPI.GetServices({
                    ParseResults: true, All: true,
                    ResponseHandler: function (result) {
                        that.Objects.Services = result.Services || [];
                        that._initialize();
                    }
                });
            }

        },

        _initialize: function () {
            var that = this;

            var checkboxParams = {
                Checked: true,
                OnClick: function (event, done) {
                    event.preventDefault();
                    done();
                    that._set_options_view(event, done);

                    that.reset_search();
                }
            };

            var _itemTypeProperties = function (checkbox) {
                return [
                    {
                        Name: "onclick",
                        Value: function () {
                            for (var itm in that.Objects)
                                if ((that.Objects[itm] || {}).uncheck) that.Objects[itm].uncheck();

                            if (that.Objects[checkbox]) that.Objects[checkbox].check();

                            that._set_options_view();
                            that.reset_search({ Timeout: 1 });
                        }
                    }
                ]
            }

            var modulesCount = 0;
            if (that.Options.Modules.CN)++modulesCount;
            if (that.Options.Modules.USR)++modulesCount;
            if (that.Options.Modules.QA)++modulesCount;
            if (that.Options.Modules.FileContents)++modulesCount;
            
            var elems = GlobalUtilities.create_nested_elements([
                (that.Objects.SearchInput ? null : {
                    Type: "div", Class: "small-10 medium-8 large-6", Name: "inputDiv",
                    Style: "position:relative; margin:0 auto 1.5rem auto;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "searchInput", InnerTitle: RVDic.Search,
                            Style: "width:100%; padding-" + RV_RevFloat + ":2rem;"
                        },
                        (that.Objects.SearchButton ? null : {
                            Type: "div",
                            Style: "position:absolute; top:0; bottom:0; " + RV_RevFloat + ":0.4rem;",
                            Childs: [{
                                Type: "middle", Childs: [{
                                    Type: "i", Class: "fa fa-search fa-lg rv-icon-button", Name: "searchButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }]
                            }]
                        })
                    ]
                }),
                {
                    Type: "div", Name: "services",
                    Class: "small-12 medium-12 large-12 row rv-border-radius-quarter SoftBackgroundColor", 
                    Style: "margin:0rem; margin-bottom:1rem; padding:0.3rem; display:none;"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_RevFloat + ":15rem; min-height:2.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-border-radius-quarter rv-air-button",
                                    Style: "display:inline-block; padding:0.2rem 0.3rem; font-size:0.7rem;" +
                                        "margin-" + RV_RevFloat + ":0.5rem;", Name: "exportToExcel",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-file-excel-o",
                                            Style: "margin-" + RV_RevFloat + ":0.3rem; font-size:0.8rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.ExportToExcel }
                                    ]
                                },
                                {
                                    Type: "div", Class: "rv-border-radius-quarter SoftBackgroundColor",
                                    Style: "display:inline-block; padding:0.3rem; font-size:0.7rem;",
                                    Childs: [
                                        {
                                            Type: "checkbox", Name: "forceContentChb",
                                            Style: "width:1rem; height:1rem; cursor:pointer",
                                            Params: GlobalUtilities.extend({}, checkboxParams, { Checked: false })
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.MustHaveContent }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "margin-bottom:1rem; margin-" + RV_RevFloat + ":1.5rem; display:" +
                                (that.Options.Modules.CN && (modulesCount > 1) ? "inline-block" : "none") + ";",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "checkbox", Name: "nodesCheckbox", Params: GlobalUtilities.extend({}, checkboxParams, { Checked: !!that.Options.Modules.CN }) }]
                                },
                                {
                                    Type: "div", Class: "rv-link",
                                    Style: "margin:0 0.3rem; margin-" + RV_RevFloat + ":0.9rem; display:inline-block;",
                                    Properties: _itemTypeProperties("NodesCheckbox"),
                                    Childs: [{ Type: "text", TextValue: RVDic.Nodes }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "margin-bottom:1rem; margin-" + RV_RevFloat + ":1.5rem; display:" +
                                (that.Options.Modules.QA && (modulesCount > 1) ? "inline-block" : "none") + ";",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "checkbox", Name: "questionsCheckbox", Params: GlobalUtilities.extend({}, checkboxParams, { Checked: !!that.Options.Modules.QA }) }]
                                },
                                {
                                    Type: "div", Class: "rv-link",
                                    Style: "margin:0 0.3rem; margin-" + RV_RevFloat + ":0.9rem; display:inline-block;",
                                    Properties: _itemTypeProperties("QuestionsCheckbox"),
                                    Childs: [{ Type: "text", TextValue: RVDic.Questions }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "margin-bottom:1rem; margin-" + RV_RevFloat + ":1.5rem; display:" +
                                (that.Options.Modules.USR && (modulesCount > 1) ? "inline-block" : "none") + ";",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "checkbox", Name: "usersCheckbox", Params: GlobalUtilities.extend({}, checkboxParams, { Checked: !!that.Options.Modules.USR }) }]
                                },
                                {
                                    Type: "div", Class: "rv-link",
                                    Style: "margin:0 0.3rem; margin-" + RV_RevFloat + ":0.9rem; display:inline-block;",
                                    Properties: _itemTypeProperties("UsersCheckbox"),
                                    Childs: [{ Type: "text", TextValue: RVDic.Users }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "margin-bottom:1rem; margin-" + RV_RevFloat + ":1.5rem; display:" +
                                (that.Options.Modules.FileContents && (modulesCount > 1) ? "inline-block" : "none") + ";",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "checkbox", Name: "filesCheckbox", Params: GlobalUtilities.extend({}, checkboxParams, { Checked: !!that.Options.Modules.FileContents }) }]
                                },
                                {
                                    Type: "div", Class: "rv-link",
                                    Style: "margin:0 0.3rem; margin-" + RV_RevFloat + ":0.9rem; display:inline-block;",
                                    Properties: _itemTypeProperties("FilesCheckbox"),
                                    Childs: [{ Type: "text", TextValue: RVDic.Files }]
                                }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: (that.Options.HideOptions ? "display:none;" : ""),
                    Childs: ["nodeOptions", "questionOptions", "fileOptions"].map(function (nm) {
                        return {
                            Type: "div", Style: "display:none; margin-bottom:1rem; padding:0.3rem;", Name: nm,
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder"
                        };
                    })
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypesArea",
                    Style: (that.Options.HideOptions ? "display:none;" : "")
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea",
                    Style: (that.Options.HideOptions && modulesCount == 1 ? "" : "margin-top:0.5rem;")
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                    Style: "margin-top:0.5rem; display:none;", Name: "moreButton",
                    Properties: [{ Name: "onclick", Value: function () { that.search(); } }],
                    Childs: [{ Type: "text", TextValue: RVDic.More }]
                }
            ], that.ContainerDiv);

            that.Objects.SearchInput = that.Objects.SearchInput || elems["searchInput"];
            that.Objects.SearchButton = that.Objects.SearchButton || elems["searchButton"];
            
            GlobalUtilities.set_onchangeorenter(that.Objects.SearchInput, function () { that.reset_search({ Timeout: 1 }); });
            if (that.Objects.SearchButton) that.Objects.SearchButton.onclick = function () { that.reset_search({ Timeout: 1 }); };

            that.Interface.NodeTypesArea = elems["nodeTypesArea"];
            that.Interface.ItemsArea = elems["itemsArea"];
            that.Interface.ServicesArea = elems["services"];
            that.Interface.ExportToExcelButton = elems["exportToExcel"];

            that.Objects.MoreButton = elems["moreButton"];

            that.Objects.MustHaveContentCheckbox = elems["forceContentChb"];
            that.Objects.NodesCheckbox = elems["nodesCheckbox"];
            that.Objects.QuestionsCheckbox = elems["questionsCheckbox"];
            that.Objects.UsersCheckbox = elems["usersCheckbox"];
            that.Objects.FilesCheckbox = elems["filesCheckbox"];

            that.Objects.NodesCheckbox.OptionsDiv = elems["nodeOptions"];
            that.Objects.QuestionsCheckbox.OptionsDiv = elems["questionOptions"];
            that.Objects.FilesCheckbox.OptionsDiv = elems["fileOptions"];

            that._initialize_node_options();
            that._initialize_question_options();
            that._initialize_file_options();

            that._set_options_view();

            if (that.Objects.InitialSearch) {
                that.Objects.SearchInput.value = that.Objects.InitialSearch;
                that.search({ Reset: true });
            }

            jQuery(that.Objects.SearchInput).focus();

            if (that.Options.SuggestServices && (that.Objects.Services || []).length) {
                for (var i = 0; i < that.Objects.Services.length; ++i)
                    that.add_service(elems["services"], that.Objects.Services[i]);

                jQuery(elems["services"]).fadeIn();
            }
            else jQuery(elems["services"]).fadeOut(0);

            elems["exportToExcel"].onclick = function () {
                if (GlobalUtilities.trim(that.Objects.SearchInput.value)) that.search({ Excel: true });
            };
        },

        add_service: function (container, service) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-6 medium-6 large-4", Style: "padding:0.2rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "chbContainer",
                            Class: "small-12 medium-12 large-12 rv-bg-color-white-softer" +
                                " rv-border-radius-quarter TextAlign SoftShadow SoftBorder",
                            Style: "position:relative; padding:0.3rem; display:flex; flex-flow:row; align-items:center;" +
                                "font-size:0.7rem; height:100%; border-color:rgb(220,220,220); cursor:pointer;",
                            Childs: [
                                {
                                    Type: "div", Style: "flex:0 0 auto;",
                                    Childs: [{
                                        Type: "checkbox", Name: "chb", Style: "width:1rem; height:1rem; cursor:pointer;",
                                        Params: { OnChange: function () { that.reset_search(); } }
                                    }]
                                },
                                {
                                    Type: "div", Style: "flex:1 1 auto; padding-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: Base64.decode(service.TypeName) }]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            elems["container"].set_value = function (value) {
                elems["chb"][value ? "check" : "uncheck"]({ StopOnChange: true });
            };

            elems["container"].get_node_type_id = function () {
                return elems["chb"].checked ? service.NodeTypeID : null;
            };

            elems["chbContainer"].onclick = function () {
                elems["container"].set_value(true);

                var firstChild = container.firstChild;

                while (firstChild) {
                    if ((firstChild != elems["container"]) && firstChild.set_value) firstChild.set_value(false);
                    firstChild = firstChild.nextSibling;
                }

                that.reset_search();
            };
        },

        get_selected_service_ids: function () {
            var that = this;

            var firstChild = (that.Interface.ServicesArea || {}).firstChild;
            var arr = []  ;

            while (firstChild) {
                var nodeTypeId = firstChild.get_node_type_id ? firstChild.get_node_type_id() : null;
                if (nodeTypeId) arr.push(nodeTypeId);
                firstChild = firstChild.nextSibling;
            }

            return arr.join("|");
        },

        _set_options_view: function () {
            var that = this;

            var nodesChecked = that.Objects.NodesCheckbox.Checked;
            var questionsChecked = that.Objects.QuestionsCheckbox.Checked;
            var usersChecked = that.Objects.UsersCheckbox.Checked;
            var filesChecked = that.Objects.FilesCheckbox.Checked;

            var cnt = (nodesChecked ? 1 : 0) + (questionsChecked ? 1 : 0) + (usersChecked ? 1 : 0) + (filesChecked ? 1 : 0);

            that.Objects.NodesCheckbox.OptionsDiv.style.display = "none";
            that.Objects.QuestionsCheckbox.OptionsDiv.style.display = "none";
            that.Objects.FilesCheckbox.OptionsDiv.style.display = "none";

            if (cnt == 1 && usersChecked == false)
                that.Objects[(nodesChecked ? "Nodes" : (questionsChecked ? "Questions" : "Files")) + "Checkbox"].OptionsDiv.style.display = "block";

            jQuery(that.Interface.ExportToExcelButton)[nodesChecked ? "fadeIn" : "fadeOut"](500);
        },

        _initialize_node_options: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements(that.create_options(that.Objects.NodeOptions, [
                { Name: "titleCheckbox", Title: RVDic.Title, CheckBoxName: "TitleCheckbox" },
                { Name: "descriptionCheckbox", Title: RVDic.Abstract, CheckBoxName: "DescriptionCheckbox" },
                { Name: "contentCheckbox", Title: RVDic.Content, CheckBoxName: "ContentCheckbox" },
                { Name: "tagsCheckbox", Title: RVDic.Keywords, CheckBoxName: "TagsCheckbox" },
                { Name: "fileContentCheckbox", Title: RVDic.FileContents, CheckBoxName: "FileContentCheckbox" }
            ]).concat([{
                Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypes", Style: "margin:0.5rem 0rem;"
            }]), that.Objects.NodesCheckbox.OptionsDiv);

            GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    that.Objects.NodeOptions.NodeTypesContainer = new NewSingleDataContainer(elems["nodeTypes"], {
                        InputClass: "rv-input",
                        InputStyle: "width:100%;",
                        InnerTitle: RVDic.LimitToClasses + "...",
                        AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                        ResponseParser: function (responseText) {
                            var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                            var arr = [];
                            for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                                arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                            return arr;
                        },
                        OnItemAdd: function () { that.reset_search(); },
                        OnItemRemove: function () { that.reset_search(); }
                    });
                }
            });

            that.Objects.NodeOptions.TitleCheckbox = elems["titleCheckbox"];
            that.Objects.NodeOptions.DescriptionCheckbox = elems["descriptionCheckbox"];
            that.Objects.NodeOptions.ContentCheckbox = elems["contentCheckbox"];
            that.Objects.NodeOptions.TagsCheckbox = elems["tagsCheckbox"];
            that.Objects.NodeOptions.FileContentCheckbox = elems["fileContentCheckbox"];
        },

        _initialize_question_options: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements(that.create_options(that.Objects.QuestionOptions, [
                { Name: "titleCheckbox", Title: RVDic.Title, CheckBoxName: "TitleCheckbox" },
                { Name: "descriptionCheckbox", Title: RVDic.Description, CheckBoxName: "DescriptionCheckbox" },
                { Name: "contentCheckbox", Title: RVDic.Answers, CheckBoxName: "ContentCheckbox" }
            ]), that.Objects.QuestionsCheckbox.OptionsDiv);

            that.Objects.QuestionOptions.TitleCheckbox = elems["titleCheckbox"];
            that.Objects.QuestionOptions.DescriptionCheckbox = elems["descriptionCheckbox"];
            that.Objects.QuestionOptions.ContentCheckbox = elems["contentCheckbox"];
        },

        _initialize_file_options: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements(that.create_options(that.Objects.FileOptions, [
                { Name: "pdfCheckbox", Title: "PDF", CheckBoxName: "PDFCheckbox" },
                { Name: "docCheckbox", Title: "DOC/DOCX", CheckBoxName: "DOCCheckbox" },
                { Name: "xlsCheckbox", Title: "XLS", CheckBoxName: "XLSCheckbox" },
                { Name: "pptCheckbox", Title: "PPT/PPTX", CheckBoxName: "PPTCheckbox" },
                { Name: "txtCheckbox", Title: "TXT", CheckBoxName: "TXTCheckbox" },
                { Name: "xmlCheckbox", Title: "XML", CheckBoxName: "XMLCheckbox" },
                { Name: "htmlCheckbox", Title: "HTM/HTML", CheckBoxName: "HTMLCheckbox" }
            ]), that.Objects.FilesCheckbox.OptionsDiv);

            that.Objects.FileOptions.PDFCheckbox = elems["pdfCheckbox"];
            that.Objects.FileOptions.DOCCheckbox = elems["docCheckbox"];
            that.Objects.FileOptions.XLSCheckbox = elems["xlsCheckbox"];
            that.Objects.FileOptions.PPTCheckbox = elems["pptCheckbox"];
            that.Objects.FileOptions.TXTCheckbox = elems["txtCheckbox"];
            that.Objects.FileOptions.XMLCheckbox = elems["xmlCheckbox"];
            that.Objects.FileOptions.HTMLCheckbox = elems["htmlCheckbox"];
        },

        create_options: function (options, arr) {
            var that = this;

            var ret = [];

            (arr || []).forEach(function (itm) {
                ret = ret.concat([
                    {
                        Type: "div", Style: "display:inline-block;",
                        Childs: [{
                            Type: "checkbox", Name: itm.Name,
                            Params: { Checked: true, OnClick: function (event, done) { event.preventDefault(); done(); that.reset_search(); } }
                        }]
                    },
                    {
                        Type: "div", Class: "rv-link",
                        Style: "display:inline-block; margin:0 0.3rem; margin-" + RV_RevFloat + ":2.5rem;",
                        Properties: [{
                            Name: "onclick",
                            Value: function () {
                                for (var key in options)
                                    if ((options[key] || {}).uncheck) options[key].uncheck();

                                if (options[itm.CheckBoxName]) options[itm.CheckBoxName].check();

                                that.reset_search({ Timeout: 1 });
                            }
                        }],
                        Childs: [{ Type: "text", TextValue: itm.Title }]
                    }
                ]);
            });

            return ret;
        },

        clear: function () {
            var that = this;

            that.Interface.ItemsArea.innerHTML = "";

            that.Interface.NodeTypesArea.innerHTML = "";
            that.Objects.CurrentItems = {};
            that.Objects.LastItem = null;

            that.Objects.MoreButton.style.display = "none"

            that.Objects.Trees = {};
            that.Objects.ItemsToShow = {};
        },

        reset_search: (function () {
            var _timeout = null;

            return function (params) {
                params = params || {};
                var that = this;
                if (_timeout) clearTimeout(_timeout);

                _timeout = setTimeout(function () {
                    _timeout = null;
                    that.search({ Reset: true });
                }, params.Timeout || 2000);
            }
        })(),

        search: function (params) {
            params = params || {};
            var that = this;

            var isExcel = params.Excel === true;

            var searchText = GlobalUtilities.trim(that.Objects.SearchInput.value);

            if (!isExcel && !searchText) {
                if (that.Options.OnSearchEnd) that.Options.OnSearchEnd.call(that);
                return;
            }

            if (!isExcel && that.Options.OnBeforeSearch) that.Options.OnBeforeSearch.call(that);

            if (params.Reset == true) {
                that.clear();
                GlobalUtilities.loading(that.Interface.ItemsArea);
            }

            var forceHasContent = that.Objects.MustHaveContentCheckbox.Checked;
            var nodesChecked = that.Objects.NodesCheckbox.Checked;
            var questionsChecked = that.Objects.QuestionsCheckbox.Checked;
            var usersChecked = that.Objects.UsersCheckbox.Checked;
            var filesChecked = that.Objects.FilesCheckbox.Checked;

            var itemTypes = "";
            if (nodesChecked) itemTypes += (itemTypes == "" ? "" : "|") + "Node";
            if (questionsChecked) itemTypes += (itemTypes == "" ? "" : "|") + "Question";
            if (usersChecked) itemTypes += (itemTypes == "" ? "" : "|") + "User";
            if (filesChecked) itemTypes += (itemTypes == "" ? "" : "|") + "File";

            var cnt = (nodesChecked ? 1 : 0) + (questionsChecked ? 1 : 0) + (usersChecked ? 1 : 0) + (filesChecked ? 1 : 0);

            var _title = true, _description = true, _content = true, _tags = true, _fileContent = true;
            var _typeIds = "";
            var _types = "";

            if (cnt == 1) {
                if (!filesChecked) {
                    _title = that.Objects[(nodesChecked ? "Node" : "Question") + "Options"].TitleCheckbox.Checked;
                    _description = that.Objects[(nodesChecked ? "Node" : "Question") + "Options"].DescriptionCheckbox.Checked;
                    _content = that.Objects[(nodesChecked ? "Node" : "Question") + "Options"].ContentCheckbox.Checked;
                }

                if (nodesChecked) {
                    _tags = that.Objects.NodeOptions.TagsCheckbox.Checked;
                    _fileContent = that.Objects.NodeOptions.FileContentCheckbox.Checked;
                    _typeIds = that.Objects.NodeOptions.NodeTypesContainer.get_items_string("|");
                }

                if (filesChecked) {
                    if (that.Objects.FileOptions.PDFCheckbox.Checked) _types += (_types == "" ? "" : "|") + "pdf";
                    if (that.Objects.FileOptions.DOCCheckbox.Checked) _types += (_types == "" ? "" : "|") + "doc|docx";
                    if (that.Objects.FileOptions.XLSCheckbox.Checked) _types += (_types == "" ? "" : "|") + "xlsx";
                    if (that.Objects.FileOptions.PPTCheckbox.Checked) _types += (_types == "" ? "" : "|") + "ppt|pptx";
                    if (that.Objects.FileOptions.TXTCheckbox.Checked) _types += (_types == "" ? "" : "|") + "txt";
                    if (that.Objects.FileOptions.XMLCheckbox.Checked) _types += (_types == "" ? "" : "|") + "xml";
                    if (that.Objects.FileOptions.HTMLCheckbox.Checked) _types += (_types == "" ? "" : "|") + "htm|html";
                }
            }

            if (!_typeIds && that.Options.SuggestServices) _typeIds = that.get_selected_service_ids();

            if (!isExcel) {
                that.Objects.MoreButton.innerHTML = "";
                GlobalUtilities.loading(that.Objects.MoreButton);
            }

            SearchAPI.Search({
                SearchText: Base64.encode(searchText), LowerBoundary: that.Objects.LastItem, ItemTypes: itemTypes,
                Title: _title, Description: _description, Content: _content, Tags: _tags, FileContent: _fileContent,
                ForceHasContent: forceHasContent, TypeIDs: _typeIds, Types: _types,
                ShowExactItems: that.Options.ShowExactItems, SuggestNodeTypes: !that.Options.HideOptions,
                Excel: isExcel, FormDetails: isExcel, ParseResults: true,
                ResponseHandler: function (result) {
                    if (params.Reset === true) that.Interface.ItemsArea.innerHTML = "";
                    
                    var nodeTypeIds = [];
                    for (var i = 0, lnt = (result.NodeTypes || []).length; i < lnt; ++i) {
                        that.add_node_type(result.NodeTypes[i]);
                        nodeTypeIds.push(result.NodeTypes[i].ID);
                    }
                    that.check_trees(nodeTypeIds);

                    if (that.Options.ShowExactItems) {
                        for (var i = 0, lnt = (result.ExactItems || []).length; i < lnt; ++i) that.add_item(result.ExactItems[i]);
                    }

                    for (var i = 0, lnt = (result.Items || []).length; i < lnt; ++i)
                        that.Options.ItemBuilder ? that.Options.ItemBuilder.call(that, that.Interface.ItemsArea, result.Items[i]) : that.add_item(result.Items[i]);

                    that.Objects.LastItem = result.LastItem ? result.LastItem : 0;
                    if (result.NoMore) that.Objects.MoreButton.style.display = "none";
                    that.Objects.MoreButton.innerHTML = RVDic.More;

                    if (params.Reset === true) {
                        if (!that.Objects.LastItem || (!(result.Items || []).length &&
                            !(result.ExactItems || []).length && !(result.NodeTypes || []).length)) {
                            that.Interface.ItemsArea.innerHTML = "<div style='text-align:center; font-weight:bold;'>" +
                                RVDic.NothingToDisplay + "</div>";
                        }
                    }
                }
            });
        },

        check_trees: (function () {
            var _set_tree_icon = function (that, nodeTypeId) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "img", Tooltip: RVDic.TreeView,
                        Style: "cursor:pointer; width:1rem; height:1rem; margin-" + RV_Float + ":0.5rem;",
                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon("TreeView.png") }],
                        Properties: [
                            {
                                Name: "onclick",
                                Value: function () {
                                    that.show_tree({ NodeTypeID: nodeTypeId, NodeType: that.Objects.NodeTypes[nodeTypeId].Title });
                                }
                            }
                        ]
                    }
                ], that.Objects.NodeTypes[nodeTypeId].TreeIconDiv);
            }

            return function (nodeTypeIds) {
                var that = this;

                var strIds = "";
                for (var i = 0, _ln = nodeTypeIds.length; i < _ln; ++i) {
                    if (typeof (that.Objects.NodeTypes[nodeTypeIds[i]].IsTree) == "undefined")
                        strIds += (strIds == "" ? "" : "|") + nodeTypeIds[i];
                }

                if (strIds == "") return;

                CNAPI.GetNodesCount({
                    NodeTypeIDs: strIds, Root: true, ParseResults: true,
                    ResponseHandler: function (result) {
                        var nodeTypes = result.NodeTypes || [];
                        for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i) {
                            that.Objects.NodeTypes[nodeTypes[i].NodeTypeID].IsTree = nodeTypes[i].Count <= 100;
                            if (nodeTypes[i].Count <= 100) _set_tree_icon(that, nodeTypes[i].NodeTypeID);
                        }
                    }
                });
            }
        })(),

        show_tree: function (params) {
            params = params || {};
            var that = this;

            var nodeTypeId = params.NodeTypeID || "";
            var nodeId = params.NodeID || "";
            var id = params.NodeID || params.NodeTypeID || "";

            if (that.Objects.Trees[id]) {
                that.Objects.Trees[id].ShowedDiv = GlobalUtilities.show(that.Objects.Trees[id].Container);
                return;
            }

            var obj = that.Objects.Trees[id] = { ShowedDiv: null, Container: null };

            var _div = obj.Container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            obj.ShowedDiv = GlobalUtilities.show(_div);

            GlobalUtilities.load_files([
                "jQuery/jsTree/jquery.jstree.js",
                "TreeViewContainer/TreeViewContainer.js",
                "TreeNodeViewer/TreeNodeViewer.js"
            ], {
                LoadSequential: true,
                OnLoad: function () {
                    var tnv = new TreeNodeViewer(_div, {
                        NodeTypeID: nodeTypeId, NodeID: nodeId, Checkbox: false,
                        OnNodeSelect: function (p) {
                            var _nodePageUrl = CNAPI.NodePageURL({ NodeID: p.ID });
                            GlobalUtilities.link_click(p.Event || {}, _nodePageUrl);
                        }
                    });
                }
            });
        },

        add_node_type: (function () {
            var _ondblclick = function (that, item) {
                that.Objects.NodesCheckbox.check();
                that.Objects.QuestionsCheckbox.uncheck();
                that.Objects.UsersCheckbox.uncheck();
                that.Objects.FilesCheckbox.uncheck();

                that._set_options_view();

                that.Objects.NodeOptions.NodeTypesContainer.add_item(item.Title, item.ID);

                that.reset_search();
            }

            return function (item) {
                var that = this;

                var id = item.ID || "";

                if ((that.Objects.NodeTypes[id] || {}).ContainerDiv)
                    return that.Interface.NodeTypesArea.appendChild(that.Objects.NodeTypes[id].ContainerDiv);

                item.Title = Base64.decode(item.Title);
                
                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-border-radius-quarter SoftBorder SoftShadow", Name: "container",
                        Style: "display:inline-block; padding:0.3rem; margin-" + RV_RevFloat + ":0.4rem; margin-bottom:0.3rem;",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; cursor:pointer;", Tooltip: RVDic.DoubleClickToFilter,
                                Properties: [{ Name: "ondblclick", Value: function () { _ondblclick(that, item); } }],
                                Childs: [{ Type: "text", TextValue: item.Title }]
                            },
                            { Type: "div", Style: "display:inline-block;", Name: "treeIcon" },
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                                Childs: [
                                    {
                                        Type: "img", Style: "width:1rem; height:1rem; cursor:pointer;", Tooltip: RVDic.ListView,
                                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Grid.png") }],
                                        Properties: [{ Name: "onclick", Value: function () { window.open(RVAPI.ClassesPageURL({ NodeTypeID: id })); } }]
                                    }
                                ]
                            }
                        ]
                    }
                ], that.Interface.NodeTypesArea);

                item.ContainerDiv = elems["container"];
                item.TreeIconDiv = elems["treeIcon"];

                that.Objects.NodeTypes[id] = item;
            }
        })(),

        show_users: (function () {
            var got = { Experts: {}, Members: {}, Fans: {} };

            return function (nodeId, mode) {
                if (got[mode][nodeId]) return GlobalUtilities.show(got[mode][nodeId]);

                var _div = got[mode][nodeId] = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                ])["_div"];

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["Social/RelatedUsersViewer.js"], {
                    OnLoad: function () { new RelatedUsersViewer(_div, { SubjectID: nodeId, SubjectType: "Node", Mode: mode }); }
                });
            }
        })(),

        show_relations: function (node) {
            var that = this;

            that.__RelationsContainer = that.__RelationsContainer || { Container: null, Obj: null };

            if (that.__RelationsContainer.Container) {
                if (that.__RelationsContainer.Obj) that.__RelationsContainer.Obj.reset({ NodeID: node.ID });
                return GlobalUtilities.show(that.__RelationsContainer.Container);
            }

            var _div = that.__RelationsContainer.Container = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                Class: "small-10 medium-8 large-6 rv-border-radius-1 rv-trim-vertical-margins SoftBackgroundColor"
            }])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["API/CNAPI.js"], {
                OnLoad: function () {
                    CNAPI.GetRelatedNodes({
                        NodeID: node.ID, In: true, Out: true, ParseResults: true,
                        ResponseHandler: function (result) {
                            _div.innerHTML = "";
                            jQuery.each(result.Nodes || [], function (ind, val) { _add_node(val); });
                        }
                    });
                }
            });

            var _add_node = function (nd) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "margin:0.3rem 0rem; padding:0.3rem; cursor:pointer;",
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftBorder",
                        Link: RVAPI.NodePageURL({ NodeID: nd.NodeID }), Params: { IgnoreMouseEvents: true },
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(nd.Name) }]
                            },
                            {
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.6rem;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(nd.NodeType || nd.TypeName) }]
                            }
                        ]
                    }
                ], _div);
            };
        },

        _node_mouse_over: function (id, infoDiv) {
            var that = this;

            that.Objects.ItemsToShow[id] = true;

            CNAPI.GetNodeInfo({
                NodeID: id, HasChild: true, LikesCount: true, ExpertsCount: true,
                MembersCount: true, RelatedNodesCount: true, ParseResults: true,
                ResponseHandler: function (result) {
                    var hasChild = result.HasChild === true;
                    var likesCount = result.LikesCount;
                    var expertsCount = result.ExpertsCount;
                    var membersCount = result.MembersCount;
                    var relatedNodesCount = result.RelatedNodesCount;

                    var show = true; // hasChild || likesCount > 0 || expertsCount > 0 || membersCount > 0 || relatedNodesCount > 0;

                    infoDiv.innerHTML = "";

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftShadow",
                            Style: "margin-top:0.4rem; padding:0.3rem 0.5rem; background-color:white;" +
                                "display:" + (show ? "block" : "none") + "; margin-bottom:0.1rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:" + (hasChild ? "inline-block" : "none") + ";",
                                    Childs: [
                                        {
                                            Type: "img", Tooltip: RVDic.TreeView,
                                            Style: "cursor:pointer; width:1rem; height:1rem;",
                                            Attributes: [{ Name: "src", Value: GlobalUtilities.icon("TreeView.png") }],
                                            Properties: [{ Name: "onclick", Value: function () { that.show_tree({ NodeID: id }); } }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin:0rem 0.5rem; color:gray; font-size:0.7rem;" +
                                        "margin-" + RV_Float + ":" + (hasChild ? "1" : "0") + "rem;" +
                                        (likesCount > 0 ? "cursor:pointer;" : ""),
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                        { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                        { Name: "onclick", Value: likesCount > 0 ? function () { that.show_users(id, "Fans"); } : null }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.LikesCount + ": " + likesCount }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin:0rem 0.5rem; color:gray; font-size:0.7rem;" +
                                        (expertsCount > 0 ? "cursor:pointer;" : ""),
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                        { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                        { Name: "onclick", Value: expertsCount > 0 ? function () { that.show_users(id, "Experts"); } : null }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.ExpertsCount + ": " + expertsCount }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin:0rem 0.5rem; color:gray; font-size:0.7rem;" +
                                        (membersCount > 0 ? "cursor:pointer;" : ""),
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                        { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                        { Name: "onclick", Value: membersCount > 0 ? function () { that.show_users(id, "Members"); } : null }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.MembersCount + ": " + membersCount }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin:0rem 0.5rem; color:gray; font-size:0.7rem;" +
                                        (relatedNodesCount > 0 ? "cursor:pointer;" : ""),
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.color = "black"; } },
                                        { Name: "onmouseout", Value: function () { this.style.color = "gray"; } },
                                        { Name: "onclick", Value: relatedNodesCount > 0 ? function () { that.show_relations({ ID: id }); } : null }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.RelatedNodesCount + ": " + relatedNodesCount }]
                                }
                            ]
                        }
                    ], infoDiv);
                }
            });
        },

        add_item: function (item) {
            var that = this;

            that.Objects.MoreButton.style.display = "block";

            var id = item.ID || "";

            if (that.Objects.CurrentItems[id]) return;
            that.Objects.CurrentItems[id] = true;

            var itemType = item.ItemType;
            var title = Base64.decode(item.Title);
            var type = Base64.decode(item.Type);
            var additionalId = (itemType == "User") && RVGlobal.HideUserNames ? "" : Base64.decode(item.AdditionalID);
            var description = Base64.decode(item.Description);
            var iconUrl = item.IconURL;
            var exact = item.Exact === true;
            var accessIsDenied = item.AccessIsDenied === true;
            
            var navigateUrl = "";

            var _timeout = null;

            var infoDiv = null;

            var _onmouseover = accessIsDenied || (itemType != "Node") ? null : function () {
                if (that.Objects.ItemsToShow[id]) return;

                infoDiv.innerHTML = "";
                GlobalUtilities.loading(infoDiv);

                if (_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(function () { infoDiv.Loaded = true; that._node_mouse_over(id, infoDiv); }, 1500);
            };

            var _onmouseout = _onmouseover == null ? null : function () {
                if (_timeout) clearTimeout(_timeout);
                _timeout = null;
                if (infoDiv.Loaded !== true) infoDiv.innerHTML = "";
            };

            switch (itemType) {
                case "Node":
                    navigateUrl = CNAPI.NodePageURL({ NodeID: id });
                    break;
                case "User":
                    navigateUrl = UsersAPI.UserPageURL({ UserID: id });
                    type = RVDic.User;
                    break;
                case "Question":
                    navigateUrl = RVAPI.QuestionPageURL({ QuestionID: id });
                    if (!iconUrl) iconUrl = GlobalUtilities.icon("FAQ-Over.png");
                    break;
                case "File":
                    navigateUrl = accessIsDenied ? "" : DocsAPI.GetDownloadLink({ FileID: id });
                    additionalId = type;
                    type = RVDic.File;
                    iconUrl = iconUrl || GlobalUtilities.icon("extensions/default.png");
                    break;
            }

            var fileOwnerInfo = (itemType == "File") && (item.FileOwnerNode || {}).NodeID ? item.FileOwnerNode : null;
            var noLink = accessIsDenied && (itemType == "File");
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftShadow SoftBorder " +
                        (exact ? "SoftBackgroundColor" : "rv-bg-color-white-softer"),
                    Style: "margin-bottom:0.4rem; padding:0.3rem; border-width:" + (exact ? 2 : 1) + "px;" +
                        "position:relative; min-height:3.25rem; display:flex; flex-flow:row;" +
                        (accessIsDenied ? "border-color:red; background-color:rgba(255, 0, 0, 0.05);" : "border-color:rgb(220,220,220);"),
                    //Properties: [{ Name: "onmouseover", Value: _onmouseover }, { Name: "onmouseout", Value: _onmouseout }],
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; padding:0.5rem; padding-" + RV_Float + ":0; width:3.5rem; text-align:center;",
                            Childs: [
                                (!accessIsDenied ? null : {
                                    Type: "i", Class: "fa fa-ban fa-3x", Style: "color:red;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }),
                                (accessIsDenied ? null : {
                                    Type: "img", Class: "rv-border-radius-quarter", Style: "width:2.5rem; height:2.5rem;",
                                    Attributes: [{ Name: "src", Value: GlobalUtilities.add_timestamp(iconUrl) }]
                                })
                            ]
                        },
                        {
                            Type: "div", Style: "flex:1 1 auto;",
                            Childs: [
                                {
                                    Type: "div",
                                    Class: "small-12 medium-12 large-12 " + (noLink ? "" : "rv-link"),
                                    Style: "margin-bottom:0.3rem; font-weight:" + (exact ? "bold" : "normal") + ";" +
                                        (noLink ? "" : "cursor:pointer;"),
                                    Properties: [{
                                        Name: "onclick",
                                        Value: function (e) {
                                            if (itemType == "File") {
                                                if (accessIsDenied) return;

                                                if (additionalId.toLowerCase() == "pdf" &&
                                                    ((window.RVGlobal || {}).Modules || {}).PDFViewer) {
                                                    GlobalUtilities.block(elems["container"]);

                                                    GlobalUtilities.load_files([{
                                                        Root: "PDFViewer/", Childs: ["PDFViewer.css", "PDFViewer.js"]
                                                    }], {
                                                            OnLoad: function () {
                                                                GlobalUtilities.unblock(elems["container"]);

                                                                if (that.Objects.FileViewers[id]) that.Objects.FileViewers[id].show();
                                                                else that.Objects.FileViewers[id] =
                                                                    new PDFViewer({ FileID: id, Options: { Downloadable: true } });
                                                            }
                                                        });
                                                }
                                                else GlobalUtilities.open_window({ URL: navigateUrl });
                                            }
                                            else if ((e || window.event).ctrlKey) window.open(navigateUrl);
                                            else window.location.href = navigateUrl;
                                        }
                                    }],
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block;",
                                            Childs: [{
                                                Type: "a", Class: "rv-link",
                                                Attributes: noLink ? null : [{ Name: "href", Value: navigateUrl }],
                                                Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); } }],
                                                Childs: [{ Type: "text", TextValue: title }]
                                            }]
                                        },
                                        {
                                            Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                            Style: "display:" + (fileOwnerInfo ? "inline-block" : "none") + ";" +
                                                "margin-" + RV_Float + ":0.5rem; font-size:0.6rem;",
                                            Link: RVAPI.NodePageURL({ NodeID: (fileOwnerInfo || {}).NodeID }),
                                            Childs: [{ Type: "text", TextValue: Base64.decode((fileOwnerInfo || {}).Name) + " (" + Base64.decode((fileOwnerInfo || {}).NodeType) + ")" }]
                                        }
                                    ]
                                },
                                (accessIsDenied ? null : {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "font-size:0.65rem; color:gray;", Name: "desc"
                                }),
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "infoDiv" }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "flex:0 0 auto; display:flex; align-items:center; padding:0.3rem; width:9rem; text-align:center;",
                            Childs: [{
                                Type: "div", Style: "width:9rem;",
                                Childs: [
                                    (!type ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "font-size:0.6rem; margin:0.2rem 0; cursor:default;",
                                        Childs: [{ Type: "text", TextValue: type }]
                                    }),
                                    (!additionalId ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter Ellipsis",
                                        Style: "font-size:0.6rem; margin:0.2rem 0; cursor:default;",
                                        Childs: [{ Type: "text", TextValue: additionalId }]
                                    })
                                ]
                            }]
                        }
                    ]
                }
            ], that.Interface.ItemsArea);

            if (elems["desc"]) {
                //GlobalUtilities.set_text(elems["desc"], description);
                elems["desc"].innerHTML = description;
            }

            infoDiv = elems["infoDiv"];
        }
    }
})();