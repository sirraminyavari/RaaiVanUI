(function () {
    if (window.RegisterNewNode) return;

    window.RegisterNewNode = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            Buttons: null,
            ImportButton: null,
            FormXMLImportButton: null,
            ExcelImportButton: null,
            BottomTabTitle: null,
            TitleContainer: null,
            WorkflowArea: null
        };

        this.Objects = {
            NodeID: null,
            Name: null,
            Logo: null,
            FormInstanceID: null,
            Service: params.Service || {},
            Extensions: params.Extensions || {},
            AdminAreaID: null,
            DocumentTreeNodeID: null,
            PreviousVersionSelect: null,
            TitleAutosuggest: null,
            ParentAutosuggest: null,
            CreationDateSelect: null,
            DescriptionInput: null,
            TagsInput: null,
            FormViewer: null,
            NodeSelect: null,
            ButtonsArea: null,
            TabsManager: null,
            SingleTab: false
        };

        this.Options = GlobalUtilities.extend({
            Modules: {},
            IsSystemAdmin: false,
            IsServiceAdmin: false,
            NodeSelectType: null,
            ParentNode: null,
            PreviousVersion: null,
            DocumentTreeNode: null,
            OnFinish: params.OnFinish
        }, params.Options || {}, {
                Modules: (window.RVGlobal || {}).Modules || {},
                IsSystemAdmin: (window.RVGlobal || {}).IsSystemAdmin
            });

        var that = this;
        
        GlobalUtilities.load_files(["API/CNAPI.js", "TeamSelect/TeamSelect.js", "TabsManager/TabsManager.js"], {
            OnLoad: function () { that._init(); }
        });
    }

    RegisterNewNode.prototype = {
        _init: function () {
            var that = this;

            that.Container.innerHTML = "";

            var contribution = that.Objects.Service.EnableContribution === true;
            var isNoContentService = that.Objects.Service.NoContent === true;
            var enableDateSelect = !isNoContentService && (that.Options.IsSystemAdmin || that.Options.IsServiceAdmin);
            
            var buttonNamesDic = {};

            var _action_button = function (params) {
                var _get_inner = function (p) {
                    var items = [];
                    if (p.Icon) items.push({ Type: "i", Class: "fa " + p.Icon, Style: "margin-" + RV_RevFloat + ":0.4rem;" });
                    items.push({ Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: p.Title }] });
                    return items;
                };
                
                buttonNamesDic[params.Name] = true;

                return {
                    Type: "div", Class: params.Class || "rv-air-button rv-circle", Name: params.Name,
                    Style: "display:inline-block; width:10rem; font-size:1rem; margin:0rem 0.5rem;" + (params.Style  || " "),
                    Properties: [
                        {
                            Name: "Deactive", Value: function () {
                                jQuery(elems[params.Name]).fadeOut(500);
                                elems[params.Name].IsDeactive = true;
                            }
                        },
                        {
                            Name: "Active", Value: function () {
                                jQuery(elems[params.Name]).fadeIn(500);
                                elems[params.Name].IsDeactive = false;
                            }
                        },
                        {
                            Name: "Redraw", Value: function (p) {
                                this.innerHTML = "";
                                GlobalUtilities.create_nested_elements(_get_inner(p), this);
                            }
                        }
                    ],
                    Childs: _get_inner(params)
                };
            };

            var hasFixedParent = !!GlobalUtilities.get_fixed_parent(that.Container);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; text-align:center; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.Service.Title) }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea",
                            Style: "text-align:justify; margin-bottom:1rem;" +
                                (!that.Objects.Service.Description ? "display:none;" : "")
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "tabs" },
                        {
                            Type: "div", Name: "titleContainer",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBackgroundColor",
                            Style: "position:relative; padding:0.5rem; margin:0.5rem 0rem 1rem 0rem;" +
                                (enableDateSelect ? "padding-" + RV_RevFloat + ":20rem;" : "") +
                                (isNoContentService ? "display:none;" : ""),
                            Childs: [
                                {
                                    Type: "div", Class: "RevTextAlign RevDirection",
                                    Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.5rem;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "TextAlign Direction",
                                            Style: "display:" + (enableDateSelect ? "inline-block" : "none") + ";",
                                            Childs: [
                                                { Type: "text", TextValue: RVDic.CreationDate + ":" },
                                                { Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;", Name: "creationDate" }
                                            ]
                                        }
                                    ]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "titleArea", Style: "margin:0 auto;" },
                                (!that.Objects.Service.IsTree || (that.Options.ParentNode || {}).NodeID ? null : {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "parentArea", Style: "margin:1rem auto 0 auto;"
                                }),
                                (!that.Objects.Service.IsTree || (that.Options.ParentNode || {}).NodeID ? null : {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "parentAreaView",
                                    Style: "margin:1rem auto 0 auto; display:none;"
                                })
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "form", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "info", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "preversion", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "doctreenode", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "wiki", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachments", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "relatednodes", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "adminarea", Style: "display:none;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "wfarea", Style: "display:none;" },
                        {
                            Type: "div", Class: "rv-border-radius-quarter", Name: "buttonsArea",
                            Style: "position:fixed; bottom:0rem; left:6vw; " + (hasFixedParent ? "right:6vw;" : "") +
                                "padding:1rem 10rem; text-align:center;" +
                                "background-color:rgb(245,245,245); box-shadow:0px 0px 10px; height:4rem; display:none;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.5rem; font-weight:bold;",
                                    Childs: [{
                                        Type: "div", Name: "bottomTabTitle",
                                        Style: "height:100%; display:flex; flex-flow:row; align-items:center;"
                                    }]
                                },
                                {
                                    Type: "div", Name: "navigateButtons",
                                    Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":0.5rem; font-weight:bold;",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "ActionButton", Name: "previous",
                                                    Style: "display:inline-block; width:4rem; margin-" + RV_RevFloat + ":0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.Previous }]
                                                },
                                                {
                                                    Type: "div", Class: "ActionButton", Name: "next",
                                                    Style: "display:inline-block; width:4rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.Next }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                _action_button({
                                    Name: "importButton", Title: RVDic.Import, Class: " ",
                                    Style: "font-size:0.8rem; color:blue; cursor:pointer;"
                                }),
                                _action_button({ Name: "frmTmpSave", Title: RVDic.TemporarilySave }),
                                _action_button({
                                    Name: "frmSave",
                                    Title: isNoContentService ? RVDic.SaveAndSend :
                                        (contribution ? RVDic.PersonalRegistration : RVDic.Save),
                                    Icon: "fa-floppy-o"
                                }),
                                _action_button({ Name: "frmGroupSave", Title: RVDic.GroupRegistration, Icon: "fa-floppy-o" }),
                                _action_button({
                                    Name: "absSave",
                                    Title: !that.Objects.Extensions.Form && contribution ?
                                        RVDic.PersonalRegistration : RVDic.Save,
                                    Icon: "fa-floppy-o"
                                }),
                                _action_button({ Name: "groupSave", Title: RVDic.GroupRegistration, Icon: "fa-floppy-o" }),
                                _action_button({ Name: "pvSave", Title: RVDic.Save, Icon: "fa-floppy-o" }),
                                _action_button({ Name: "dtnSave", Title: RVDic.Save, Icon: "fa-floppy-o" }),
                                _action_button({ Name: "relSave", Title: RVDic.Save, Icon: "fa-floppy-o" })
                            ]
                        }
                    ]
                }
            ], that.Container);

            if (!hasFixedParent) {
                var widthInterval = setInterval(() => {
                    if (!GlobalUtilities.is_element_in_document(elems["buttonsArea"])) return clearInterval(widthInterval);

                    var cw = jQuery(that.Container).width();
                    //var windowWidth = window.innerWidth;
                    jQuery(elems["buttonsArea"]).animate({ width: cw + "px" });
                }, 1000);
            }
            
            that.Interface.Buttons = elems["buttonsArea"];
            that.Interface.BottomTabTitle = elems["bottomTabTitle"];
            that.Interface.TitleContainer = elems["titleContainer"];
            that.Interface.WorkflowArea = elems["wfarea"];

            if (enableDateSelect) {
                GlobalUtilities.append_calendar(elems["creationDate"], {
                    Label: RVDic.CreationDate, ClearButton: true
                }, function (cal) { that.Objects.CreationDateSelect = cal; });
            }

            if (that.Objects.Service.Description)
                GlobalUtilities.append_markup_text(elems["descriptionArea"], Base64.decode(that.Objects.Service.Description));

            jQuery(elems["previous"]).fadeOut(0);
            jQuery(elems["next"]).fadeOut(0);

            elems["previous"].onclick = function () { tabsManager.previous(); };
            elems["next"].onclick = function () { tabsManager.next(); };
            
            //Initialize tabs
            var tabs = [];
            
            var _add_tab = function (name, title, buttonNames, hidden, helpEntryName) {
                var bdic = {};
                jQuery.each(buttonNames || [], function (ind, val) { bdic[val] = true; });

                tabs.push({
                    Page: elems[name], Title: title, FixedPage: true, Hidden: hidden,  ButtonNames: bdic,
                    OnActive: function (ind, tab) {
                        jQuery(elems["previous"])[tab.Previous && !tab.Previous.Disabled ? "fadeIn" : "fadeOut"](500);
                        jQuery(elems["next"])[tab.Next && !tab.Next.Disabled ? "fadeIn" : "fadeOut"](500);

                        that.Interface.BottomTabTitle.innerHTML = "";
                        GlobalUtilities.create_nested_elements([
                            { Type: "text", TextValue: tabs[ind].Title },
                            (!helpEntryName ? null : {
                                Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: helpEntryName }
                            })
                        ], that.Interface.BottomTabTitle);

                        that._InitedPagesDic = that._InitedPagesDic || {};

                        if (!that._InitedPagesDic[name] && that["_init_" + name]) {
                            that._InitedPagesDic[name] = true;
                            that["_init_" + name](elems[name]);
                        }

                        for (var n in buttonNamesDic)
                            jQuery(elems[n])[bdic[n] && !elems[n].IsDeactive ? "fadeIn" : "fadeOut"](0);
                    }
                });
            };
            
            if (that.Objects.Extensions.Form) {
                var frmBtns = ["importButton", "frmTmpSave", "frmSave"];
                if (!isNoContentService && contribution) frmBtns.push("frmGroupSave");
                
                _add_tab("form", Base64.decode(that.Objects.Extensions.Form.Title) || RVDic.FillTheForm, frmBtns);
            }
            
            if (!isNoContentService) {
                var infoBtns = ["absSave"];
                if (!that.Objects.Extensions.Form && contribution) infoBtns.push("groupSave");
                
                if (!that.Objects.Service.DisableAbstractAndKeywords)
                    _add_tab("info", RVDic.Abstract + " " + RVDic.And + " " + RVDic.Keywords, infoBtns);
                if (that.Objects.Service.EnablePreviousVersionSelect) _add_tab("preversion", RVDic.PreviousVersion, ["pvSave"]);
                if (that.Objects.Service.IsDocument) _add_tab("doctreenode", RVDic.DocumentTree, ["dtnSave"]);
                if (that.Objects.Extensions.Wiki)
                    _add_tab("wiki", Base64.decode(that.Objects.Extensions.Wiki.Title) || RVDic.Wiki);
                if (!that.Objects.Service.DisableFileUpload) _add_tab("attachments", RVDic.AttachFiles);
                if (!that.Objects.Service.DisableRelatedNodesSelect)
                    _add_tab("relatednodes", RVDic.RelatedNodes, ["relSave"], null, "nodeselectdialog");
                if (that.needs_admin_area()) _add_tab("adminarea", RVDic.AdminArea);
                _add_tab("wfarea", RVDic.Send, null, true);
            }
            
            for (var i = 1; i < tabs.length; ++i) tabs[i].Disabled = true;
            
            that.Objects.SingleTab = tabs.filter(function (val) { return !val.Hidden; }).length == 1;
            
            if (that.Objects.SingleTab) {
                jQuery(elems["tabs"]).fadeOut(0);
                jQuery(that.Interface.BottomTabTitle).fadeOut(0);
                jQuery(elems["navigateButtons"]).fadeOut(0);
            }
            
            var tabsManager = that.Objects.TabsManager = new TabsManager({ ContainerDiv: elems["tabs"], Pages: tabs })
            tabsManager.goto_page(tabs[0].Page);
            //end of Initialize tabs
            
            setTimeout(function () { jQuery(elems["buttonsArea"]).fadeIn(500); }, 1000);

            that.Objects.TitleAutosuggest = GlobalUtilities.append_autosuggest(elems["titleArea"], {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.Title + (that.Objects.Service.TypeName ? " " + Base64.decode(that.Objects.Service.TypeName) : ""),
                SelectOptions: false,
                AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: that.Objects.Service.NodeTypeID }),
                ResponseParser: function (responseText) {
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name), nodes[i].NodeID]);
                    return arr;
                }
            });

            if (elems["parentArea"]) that.Objects.ParentAutosuggest = GlobalUtilities.append_autosuggest(elems["parentArea"], {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.ParentNodeSelect,
                SelectOptions: { Mode: "Node", NodeTypes: [that.Objects.Service] },
                AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: that.Objects.Service.NodeTypeID }),
                ResponseParser: function (responseText) {
                    return (JSON.parse(responseText).Nodes || []).map(function (itm) {
                        return [Base64.decode(itm.Name), itm.NodeID];
                    });
                },
                OnSelect: function () {
                    var asObj = that.Objects.ParentAutosuggest;
                    var index = asObj.selectedIndex;
                    that.Options.ParentNode = { NodeID: asObj.values[index], Name: asObj.keywords[index] };
                    asObj.clear();

                    elems["parentAreaView"].innerHTML = "";

                    GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                        Style: "display:flex; flow-flow:row; align-items:center; padding:0.3rem;" +
                            "background-color:white; border-color:rgb(240,240,240);",
                        Childs: [
                            {
                                Type: "div", Style: "flex:0 0 auto;",
                                Childs: [{
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{
                                        Name: "onclick", Value: function () {
                                            that.Options.ParentNode = null;

                                            jQuery(elems["parentAreaView"]).fadeOut(100, function () {
                                                jQuery(elems["parentArea"]).fadeIn(500); 
                                            });
                                        }
                                    }]
                                }]
                            },
                            {
                                Type: "div", Style: "flex:0 0 auto; padding-" + RV_Float + ":0.5rem; color:rgb(100,100,100);",
                                Childs: [{ Type: "text", TextValue: RVDic.ParentNode + ": " }]
                            },
                            {
                                Type: "div", Style: "flex:1 1 auto; padding-" + RV_Float + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: that.Options.ParentNode.Name }]
                            }
                        ]
                    }], elems["parentAreaView"]);

                    jQuery(elems["parentArea"]).fadeOut(100, function () {
                        jQuery(elems["parentAreaView"]).fadeIn(500);
                    });
                }
            });

            var _on_new_node_created = function (dt) {
                if (!that.Objects.NodeID) return;

                elems["frmTmpSave"].Redraw({ Title: RVDic.Save, Icon: "fa-floppy-o" });
                elems["frmSave"].Deactive();
                elems["frmGroupSave"].Deactive();
                elems["absSave"].Redraw({ Title: RVDic.Save, Icon: "fa-floppy-o" });
                elems["groupSave"].Deactive();

                if (!that.Objects.SingleTab) {
                    jQuery(elems["tabs"]).fadeIn(500);
                    jQuery(that.Interface.BottomTabTitle).fadeIn(500);
                    jQuery(elems["navigateButtons"]).fadeIn(500);
                }
            };

            //Add import buttons
            that.Interface.ImportButton = elems["importButton"];
            that.Interface.ImportButton.Deactive();

            that.init_import_menu();
            that.check_create_bulk_permission(function (v) { if (v) that.activate_excel_button(); })
            //end of Add import buttons

            elems["frmTmpSave"].onclick = function () {
                if (that.Objects.FormViewer) that.Objects.FormViewer.onedit({ IsTemporary: true }, { IgnoreInvalidInputs: true });
            };

            elems["frmSave"].onclick = function () {
                if (that.Objects.FormViewer) that.Objects.FormViewer.onedit({
                    IsTemporary: false, IsGroup: false, Callback: function () { _on_new_node_created(); }
                });
            };

            elems["frmGroupSave"].onclick = function () {
                if (that.Objects.FormViewer) that.Objects.FormViewer.onedit({
                    IsTemporary: false, IsGroup: true, Callback: function () { _on_new_node_created(); }
                });
            };

            elems["absSave"].onclick = function () {
                if (!that.Objects.NodeID) that.register(false, function () { _on_new_node_created(); });
                else {
                    that._preregister_check(function (dt) {
                        if (GlobalUtilities.get_type(dt) != "json") return;
                        
                        if (that.__ModifyingNode) return;
                        that.__ModifyingNode = true;
                        
                        CNAPI.ModifyNode({
                            NodeID: that.Objects.NodeID, Description: Base64.encode(dt.Description),
                            Tags: (dt.Tags || []).join("|"), ParseResults: true,
                            ResponseHandler: function (result) {
                                that.__ModifyingNode = false;
                                
                                var msg = result.Succeed || result.ErrorText;
                                alert(RVDic.MSG[msg] || msg);
                            }
                        });
                    });
                }
            };

            elems["groupSave"].onclick = function () {
                if (!that.Objects.NodeID) that.register(true, function () { _on_new_node_created(); });
            };

            elems["pvSave"].onclick = function () {
                var index = !that.Objects.PreviousVersionSelect ? -1 : that.Objects.PreviousVersionSelect.selectedIndex;
                var pVersionId = index >= 0 ? that.Objects.PreviousVersionSelect.values[index] : null;

                if (!pVersionId || that.__SavingPreVersion) return;
                that.__SavingPreVersion = true;
                
                CNAPI.SetPreviousVersion({
                    NodeID: that.Objects.NodeID, PreviousVersionID: pVersionId,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        that.__SavingPreVersion = false;

                        var msg = result.Succeed || result.ErrorText;
                        alert(RVDic.MSG[msg] || msg);
                    }
                });
            };

            elems["dtnSave"].onclick = function () {
                if (that.__SavingDocTreeNode) return;
                that.__SavingDocTreeNode = true;

                CNAPI.SetDocumentTreeNodeID({
                    NodeID: that.Objects.NodeID, DocumentTreeNodeID: that.Objects.DocumentTreeNodeID,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        that.__SavingDocTreeNode = false;

                        var msg = result.Succeed || result.ErrorText;
                        alert(RVDic.MSG[msg] || msg);
                    }
                });
            };

            elems["relSave"].onclick = function () { that.save_related_nodes(); };
        },

        needs_admin_area: function () {
            var that = this;
            return "AreaAdmin,ComplexAdmin".indexOf(that.Objects.Service.AdminType || "_") >= 0;
        },

        check_create_bulk_permission: function (callback) {
            var that = this;

            if (that.Options.IsSystemAdmin || that.Options.IsServiceAdmin) return callback(true);

            GlobalUtilities.load_files(["API/PrivacyAPI.js"], {
                OnLoad: function () {
                    PrivacyAPI.CheckAccess({
                        ObjectIDs: that.Objects.Service.NodeTypeID, Permissions: ["CreateBulk"], Type: "NodeType",
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            var hasPermission =
                                (result[that.Objects.Service.NodeTypeID] || []).some(function (x) { return x == "CreateBulk"; });
                            callback(hasPermission);
                        }
                    });
                }
            });
        },

        init_import_menu: function () {
            var that = this;

            var options = [
                {
                    Name: "xml",
                    Title: RVDic.FillTheFormViaXML,
                    OnClick: function () {
                    }
                },
                {
                    Name: "excel",
                    Title: RVDic.ImportViaExcel,
                    OnClick: function () {
                    }
                }
            ];

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "WarmBackgroundColor", Name: "_div", Style: "font-size:0.7rem;",
                Childs: options.map(function (op) {
                    return {
                        Type: "div", Name: op.Name,
                        Class: "rv-bg-color-trans-white-opaque rv-border-radius-quarter",
                        Style: "padding:0.3rem 0.5rem; color:rgba(255,255,255,0.8); cursor:pointer; display:none;",
                        Properties: [{ Name: "onclick", Value: op.OnClick }],
                        Childs: [{ Type: "text", TextValue: op.Title }]
                    };
                })
            }]);

            that.Interface.FormXMLImportButton = elems["xml"];
            that.Interface.ExcelImportButton = elems["excel"];

            var menu = elems["_div"];

            var popupMenu = null;

            var _init_mouse_over = function () {
                popupMenu = GlobalUtilities.popup_menu(that.Interface.ImportButton, menu, {
                    Align: "top", Class: "WarmBackgroundColor"
                });

                GlobalUtilities.enable_by_mouse_over(that.Interface.ImportButton, popupMenu.Container, {
                    Started: true,
                    Delay: 0,
                    OnStart: function (d) { popupMenu.Show(d); },
                    OnEnd: function (d) { popupMenu.Hide(d); }
                });
            };

            that.Interface.ImportButton.onmouseover = function () { this.onmouseover = null; _init_mouse_over(); }
        },

        activate_xml_button: function (data) {
            var that = this;
            
            that.Interface.ImportButton.Active();
            jQuery(that.Interface.FormXMLImportButton).fadeIn();

            that.Interface.FormXMLImportButton.onclick = function () {
                if (that.Objects.FormViewer) that.Objects.FormViewer.import_dialog(data);
            };
        },

        activate_excel_button: function () {
            var that = this;

            that.Interface.ImportButton.Active();
            jQuery(that.Interface.ExcelImportButton).fadeIn();

            that.Interface.ExcelImportButton.onclick = function () {
                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "display:flex; flex-flow:row; align-items:center; justify-content:center;" +
                                    "font-weight:bold; margin-bottom:1rem; font-size:1rem; color:rgb(100,100,100); text-align:center;",
                                Childs: [
                                    { Type: "text", TextValue: RVDic.ImportViaExcel },
                                    { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_map_nodes_manynodesviaexcel" } }
                                ]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "text-align:center; text-align:center; margin-bottom:1rem;",
                                Childs: [{
                                    Type: "div", Class: "rv-air-button rv-circle", Name: "templateButton",
                                    Style: "display:inline-block; padding:0.3rem 1.5rem; font-size:0.7rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.GetTemplateFile }]
                                }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Name: "_div"
                            }
                        ]
                    }
                ]);

                elems["templateButton"].onclick = function () {
                    GlobalUtilities.submit_form({
                        URL: CNAPI.ExcelHeaders({ NodeTypeID: that.Objects.Service.NodeTypeID }),
                        RequestParams: {
                            Dic: Base64.encode(JSON.stringify({
                                node_name: Base64.encode(RVDic.Title),
                                node_id: Base64.encode(RVDic.AdditionalID),
                                node_parent_id: Base64.encode(RVDic.ParentNodeID),
                                node_tags: Base64.encode(RVDic.Keywords),
                                node_abstract: Base64.encode(RVDic.Abstract)
                            }))
                        }
                    });
                };

                GlobalUtilities.loading(elems["_div"]);
                var showed = GlobalUtilities.show(elems["container"]);

                GlobalUtilities.load_files(["CN/CNImportFromExcel.js"], {
                    OnLoad: function () {
                        new CNImportFromExcel(elems["_div"], {
                            NodeTypeID: that.Objects.Service.NodeTypeID,
                            OnFinish: function (elements) {
                                showed.Close();
                                alert(RVDic.MSG.OperationCompletedSuccessfully);
                            }
                        });
                    }
                });
            };
        },

        _init_form: function (container) {
            var that = this;

            GlobalUtilities.loading(container);

            var _create_form_instance = function (formId) {
                FGAPI.CreateFormInstance({
                    FormID: formId, OwnerID: that.Objects.Service.NodeTypeID, IsTemporary: true, ParseResults: true,
                    ResponseHandler: function (result) {
                        var instance = result.Instance || {};

                        that.Objects.FormInstanceID = instance.InstanceID;

                        if (result.ErrorText) {
                            container.innerHTML = "<div style='text-align:center; color:red; font-weight:bold; margin-top:0.5rem;'" +
                                 ">" + (RVDic.MSG[result.ErrorText] || result.ErrorText) + "</div>";
                        }
                        else {
                            GlobalUtilities.load_files(["FormsManager/FormViewer.js"], {
                                OnLoad: function () {
                                    var fv = that.Objects.FormViewer = new FormViewer(container, {
                                        InstanceID: instance.InstanceID, CheckUniqueConstraints: true,
                                        LimitOwnerID: that.Objects.Service.NodeTypeID,
                                        ShowAllIfNoLimit: true, Editable: true, HideHeader: true,
                                        OnInit: function (data) {
                                            fv.goto_edit_mode();
                                            
                                            if (fv.import_enabled(data.Elements)) that.activate_xml_button(data);
                                        },
                                        OnEditStateChange: function (p) { },
                                        OnNoElementDetect: function () {
                                            //that.Objects.ButtonGroups.Form.innerHTML = "";
                                            //that.Objects.ButtonGroups.Form.setAttribute("style", "");
                                            //that.Objects.ButtonGroups.Form.setAttribute("class", "");
                                        },
                                        OnAfterSave: function (elements, dt) {
                                            fv.goto_edit_mode();
                                            
                                            if (dt.IsTemporary) alert(RVDic.MSG.OperationCompletedSuccessfully);
                                            else that.register(dt.IsGroup, dt.Callback);
                                        },
                                        OnFormImport: function (data) {
                                            if ((that.Objects.TitleAutosuggest || {}).InputElement)
                                                that.Objects.TitleAutosuggest.InputElement.value = Base64.decode(data.NodeName);

                                            that.Objects.Logo = data.NodeLogo;
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            };

            GlobalUtilities.load_files(["API/FGAPI.js"], {
                OnLoad: function () {
                    FGAPI.GetOwnerForm({
                        OwnerID: that.Objects.Service.NodeTypeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            var form = result || {};
                            _create_form_instance(form.FormID);
                        }
                    });
                }
            });
        },

        _init_info: function (container) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor",
                    Style: "padding:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", 
                            Style: "position:relative; padding-" + RV_Float + ":5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Abstract + ":" }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large=12", Name: "descriptionInput" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-top:1rem; position:relative; padding-" + RV_Float + ":5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Keywords + ":" }]
                                },
                                { Type: "div", Class: "small-12 medium-10 large-10", Name: "tagsInput" }
                            ]
                        }
                    ]
                }
            ], container);
            
            that.Objects.DescriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["descriptionInput"], DefaultText: RVDic.Abstract + "...", QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    that.Objects.TagsInput = new NewSingleDataContainer(elems["tagsInput"], {
                        EnableTextItem: true,
                        InputClass: "rv-input",
                        InputStyle: "width:100%;",
                        AjaxDataSource: CNAPI.GetTagsDataSource(),
                        ResponseParser: function (responseText) {
                            var tags = JSON.parse(responseText).Tags || [];
                            var arr = [];
                            for (var i = 0, lnt = tags.length; i < lnt; ++i)
                                arr.push([Base64.decode(tags[i].Tag || ""), tags[i].TagID || ""]);
                            return arr;
                        }
                    });
                }
            });

        },

        _init_preversion: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor",
                    Style: "position:relative; padding:1rem; padding-" + RV_Float + ":7rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:1.3rem;" + RV_Float + ":1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.PreviousVersion + ":" }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "previousVersionSelect" }
                    ]
                }
            ], container);

            var pvSelect = that.Objects.PreviousVersionSelect = GlobalUtilities.append_autosuggest(elems["previousVersionSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%;",
                InnerTitle: RVDic.PreviousVersionSelect + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: that.Objects.Service.NodeTypeID }),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].Name);
                        if (!items[i].AdditionalID) tt += " - " + Base64.decode(items[i].AdditionalID);
                        arr.push([tt, items[i].NodeID]);
                    }
                    return arr;
                },
                OnSelectButtonClick: function () {
                    if (that.__NodeListContainer)
                        return (that.__ShowedNodeList = GlobalUtilities.show(that.__NodeListContainer));

                    var _div = that.__NodeListContainer = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0 auto; padding:1rem;", Name: "_div"
                        }
                    ])["_div"];

                    that.__ShowedNodeList = GlobalUtilities.show(_div);
                    GlobalUtilities.loading(_div);

                    GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                        OnLoad: function () {
                            new NodeSelect(_div, {
                                Options: {
                                    Title: RVDic.NodeSelect, NodeTypeSearchBox: false, TreeCheckbox: false,
                                    HideSelectedItems: true, Filters: true, ShowBottomBar: false,
                                    Limits: { NodeTypes: [that.Objects.Service] },
                                    OnSelect: function (node) {
                                        that.__ShowedNodeList.Close();
                                        pvSelect.set_item(node.NodeID, node.Name, { IgnoreOnSelect: true });
                                    },
                                    OnCancel: function () { that.__ShowedNodeList.Close(); }
                                }
                            });
                        }
                    });
                }
            });

            if ((that.Options.PreviousVersion || {}).ID)
                pvSelect.set_item(that.Options.PreviousVersion.ID, that.Options.PreviousVersion.Name);
        },

        _init_doctreenode: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor",
                    Style: "padding:1rem;",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea", Style: "margin-bottom:1rem;" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "treesArea" }
                    ]
                }
            ], container);

            if (that.Options.DocumentTreeNode) that._set_document_tree(elems["viewArea"], that.Options.DocumentTreeNode);

            GlobalUtilities.loading(elems["treesArea"]);

            GlobalUtilities.load_files(["DCT/DocTreeNodeSelect.js"], {
                OnLoad: function () {
                    new DocTreeNodeSelect(elems["treesArea"], {
                        OnClose: function () { that.DocTreeNodeSelect.ShowedDiv.Close(); },
                        OnSelect: function (nd) {
                            that._set_document_tree(elems["viewArea"], nd);
                        }
                    });
                }
            });
        },

        _init_wiki: function (container) {
            var that = this;

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["Wiki/WikiManager.js", ], {
                OnLoad: function () {
                    var wm = new WikiManager(container, {
                        OwnerID: that.Objects.NodeID, OwnerType: "Node",
                        Options: { History: false, AutoScroll: false }
                    });
                }
            });
        },

        _init_attachments: function (container) {
            var that = this;

            container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor", Style: "padding:1rem;",
                    Childs: [
                        {
                            Type: "div", Name: "uploadArea", Tooltip: RVDic.UploadFile,
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                            Style: "padding:0.3rem; border-style:dashed;"
                        }
                    ]
                }
            ], container)["uploadArea"];

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["API/DocsAPI.js"], {
                OnLoad: function () {
                    GlobalUtilities.uploader(container, {
                        UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: that.Objects.NodeID, OwnerType: "Node" }),
                        Removable: true,
                        OnUpload: function (file, jsonResponse) { },
                        OnRemove: function (p, uploadResponse, done) {
                            GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveAttachedFile, function (r) {
                                if (!r) return;

                                DocsAPI.RemoveFile({
                                    FileID: uploadResponse.AttachedFile.FileID || "", OwnerID: that.Objects.NodeID || "",
                                    ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) alert(result.ErrorText);
                                        else if (result.Succeed) done();
                                    }
                                });
                            });
                        }
                    });
                }
            });
        },

        _init_relatednodes: function (container) {
            var that = this;

            container = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor", Name: "_div", Style: "padding:1rem;" }
            ], container)["_div"];

            GlobalUtilities.loading(container);

            var _free_node_select = function (p) {
                GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                    OnLoad: function () {
                        that.Objects.NodeSelect = new NodeSelect(container, GlobalUtilities.extend({
                            Options: { NodeTypeSearchBox: true, Filters: true }
                        }, p || {}));
                    }
                });
            }

            if (that.Objects.Service.IsKnowledge &&
                ((that.Options.NodeSelectType == "Single") || (that.Options.NodeSelectType == "Limited"))) {
                GlobalUtilities.load_files(["API/KnowledgeAPI.js"], {
                    OnLoad: function () {
                        KnowledgeAPI.GetCandidateRelations({
                            KnowledgeID: that.Objects.NodeID, ParseResults: true,
                            ResponseHandler: function (result) {
                                var nodes = result.Nodes || [], nodeTypes = result.NodeTypes || [];
                                var hasCandidateRelation = nodes.length > 0 || nodeTypes.length > 0;

                                _free_node_select({
                                    Options: {
                                        Limits: {
                                            Count: that.Options.NodeSelectType == "Single" ? 1 : -1,
                                            Nodes: hasCandidateRelation ? nodes : null, NodeTypes: hasCandidateRelation ? nodeTypes : null
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else _free_node_select();
        },

        _init_adminarea: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "padding:1rem;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;", Name: "selected" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                    ]
                }
            ], container);

            var _set_admin_area = function (node) {
                elems["selected"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1rem; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: RVDic.SelectedArea + ":" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: node.Name }]
                    },
                    {
                        Type: "div", Class: "rv-air-button-base rv-air-button-white rv-border-radius-quarter SoftBorder",
                        Style: "display:inline-block; font-size:0.7rem; cursor:default;",
                        Childs: [{ Type: "text", TextValue: node.NodeType }]
                    }
                ], elems["selected"]);
            };
            
            that.get_admin_area(elems["_div"], function (node) {
                _set_admin_area(node);
                that.Objects.AdminAreaID = (node || {}).NodeID;
            });
        },

        _preregister_check: function (callback) {
            var that = this;

            var name = !(that.Objects.TitleAutosuggest || {}).InputElement ? "" :
                GlobalUtilities.trim(that.Objects.TitleAutosuggest.InputElement.value);

            if (!name && !that.Objects.NodeID && !that.Objects.Service.NoContent)
                return alert(RVDic.Checks.PleaseEnterTitle);

            var description = !that.Objects.DescriptionInput ? "" : that.Objects.DescriptionInput.get_data();
            
            var newTagValue = ((((that.Objects.TagsInput || {}).Objects || {}).Autosuggest || {}).InputElement || {}).value;
            if (newTagValue) that.Objects.TagsInput.add_item(newTagValue, newTagValue);

            var _tagItems = !that.Objects.TagsInput ? [] : that.Objects.TagsInput.get_items();
            var tags = [];
            for (var i = 0, lnt = _tagItems.length; i < lnt; ++i)
                tags.push(Base64.encode(_tagItems[i].Title || ""));

            var index = !that.Objects.TitleAutosuggest ? -1 : that.Objects.TitleAutosuggest.selectedIndex;

            if (!that.Objects.NodeID && (index >= 0) && (that.Objects.TitleAutosuggest.keywords[index] == name)) {
                GlobalUtilities.confirm(RVDic.Confirms.ThereIsNodeWithSameTitle, function (result) {
                    if (!result) callback(null);
                    else callback({ Name: name, Description: description, Tags: tags });
                });
            }
            else
                callback({ Name: name, Description: description, Tags: tags });
        },

        register: function (isGroup, callback) {
            callback = callback || function () { };
            var that = this;

            if (that.Objects.NodeID) return callback(true);

            var isNoContentService = that.Objects.Service.NoContent === true;

            var _reg = function (params, workflowId, adminAreaId) {
                that._register(GlobalUtilities.extend(params, {
                    WorkFlowID: workflowId, AdminAreaID: adminAreaId
                }), callback);
            };

            var _do = function (params) {
                that.get_workflow(function (workflowId) {
                    if (!isNoContentService) _reg(params, workflowId);
                    else that.get_admin_area(null, function (adminArea) { _reg(params, workflowId, (adminArea || {}).NodeID); });
                });
            };

            that._preregister_check(function (params) {
                if (!isGroup) _do(params);
                else if (that.__TeamSelect) that.__TeamSelect.show();
                else {
                    that.__TeamSelect = new TeamSelect({
                        NodeTypeID: that.Objects.Service.NodeTypeID,
                        Options: {
                            OnSelect: function (items, owner, done) {
                                _do(GlobalUtilities.extend(params, { Contributors: items, Owner: owner }));
                                done();
                            }
                        }
                    });
                }
            });
        },

        _register: function (params, callback) {
            params = params || {};
            var that = this;

            var name = params.Name;
            var description = params.Description;
            var tags = params.Tags || [];
            var contributors = params.Contributors || [];
            var owner = params.Owner || {};

            var collaborationShares = "";
            for (var i = 0, lnt = contributors.length; i < lnt; ++i)
                collaborationShares += (collaborationShares == "" ? "" : "|") + contributors[i].UserID + ":" + contributors[i].Share;

            var creationDate = that.Objects.CreationDateSelect ? that.Objects.CreationDateSelect.Get().Value : "";

            if (that.__RegisteringNode) return;
            that.__RegisteringNode = true;
            
            CNAPI.RegisterNewNode({
                NodeTypeID: that.Objects.Service.NodeTypeID,
                Name: Base64.encode(name),
                Tags: tags.join("|"),
                Description: Base64.encode(description),
                Contributors: collaborationShares,
                OwnerID: owner.NodeID,
                FormInstanceID: that.Objects.FormInstanceID,
                WorkFlowID: params.WorkFlowID,
                CreationDate: creationDate,
                ParentNodeID: (that.Options.ParentNode || {}).NodeID,
                PreviousVersionID: (that.Options.PreviousVersion || {}).ID,
                DocumentTreeNodeID: (that.Options.DocumentTreeNode || {}).ID,
                AdminAreaID: params.AdminAreaID,
                Logo: that.Objects.Logo ? Base64.encode(JSON.stringify(that.Objects.Logo)) : null,
                GetExtendInfo: false, GetWorkFlowInfo: true, ParseResults: true,
                ResponseHandler: function (result) {
                    that.__RegisteringNode = false;

                    if (result.ErrorText) {
                        alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        callback(false);
                    }
                    else if (result.Succeed) {
                        result.AdditionalID = Base64.decode(result.AdditionalID);

                        var successMessage = Base64.decode(result.SuccessMessage);
                        if (!successMessage) successMessage =
                            RVDic.MSG.RegistrationCompletedSuccessfully.replace("[n]", "'" + result.AdditionalID + "'");

                        alert(successMessage, { Timeout: 20000 });

                        that.Objects.NodeID = result.NodeID || "";
                        that.Objects.Name = name || Base64.decode(result.Name);

                        that.Interface.TitleContainer.innerHTML = "";
                        that.Interface.TitleContainer.style.padding = "0.5rem";

                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white",
                                Style: "font-size:1.2rem; text-align:center; padding:0.5rem;",
                                Link: CNAPI.NodePageURL({ NodeID: that.Objects.NodeID }), Params: { Confirmation: true },
                                Childs: [
                                    {
                                        Type: "div", Style: "display:inline-block;",
                                        Childs: [{ Type: "text", TextValue: that.Objects.Name }]
                                    },
                                    {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; font-size:0.7rem; margin:0rem 0.5rem;",
                                        Childs: [{ Type: "text", TextValue: result.AdditionalID }]
                                    }
                                ]
                            },
                            (!that.Objects.Service.IsKnowledge ? null : {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "display:flex; flex-flow:row; align-items:center; padding-top:0.5rem;" + 
                                    "justify-content:center; font-size:0.7rem;",
                                Childs: [{
                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                                    Style: "flex:0 0 auto; padding:0.2rem 1rem;", Name: "permissionsButton",
                                    Properties: [{ Name: "onclick", Value: () => that.permissions() }],
                                    Childs: [
                                        { Type: "i", Class: "fa fa-pencil", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                                        { Type: "text", TextValue: RVDic.PRVC.EditConfidentialityAndPermissions }
                                    ]
                                }]
                            })
                        ], that.Interface.TitleContainer);

                        //Wofkflow
                        if (result.ShowKnowledgeOptions || result.ShowWorkFlow) {
                            that.Objects.TabsManager.unhide(that.Interface.WorkflowArea);
                            that.Objects.SingleTab = false;

                            if (result.ShowKnowledgeOptions) that._initialize_knowledge_options();
                            else if (result.ShowWorkFlow) that._initialize_workflow();
                        }
                        //end of Workflow

                        if (!that.Objects.SingleTab) {
                            var curTab = that.Objects.TabsManager.get();
                            while (curTab) {
                                that.Objects.TabsManager.enable(curTab.Page);
                                curTab = curTab.Next;
                            }

                            that.Objects.TabsManager.next();
                        }

                        callback({ NodeID: result.NodeID, AdditionalID: result.AdditionalID });
                        
                        if (that.Options.OnFinish && that.Objects.Service.NoContent) that.Options.OnFinish();
                    } //end of 'else if (result.Succeed) {'
                }
            });
        },

        permissions: function () {
            var that = this;

            if (that.__PermissionsButton) return (showed = GlobalUtilities.show(that.__PermissionsButton));

            var _div = that.__PermissionsButton = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "container"
            }])["container"];

            GlobalUtilities.loading(_div);
            showed = GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                OnLoad: function () {
                    new PermissionSetting(_div, {
                        ObjectID: that.Objects.NodeID,
                        Options: {
                            ConfidentialitySelect: true,
                            PermissionTypes: ["View", "ViewAbstract", "ViewRelatedItems", "Modify", "Delete", "Download"],
                            ObjectType: "Node",
                            OnSave: function (data) { showed.Close(); }
                        }
                    });
                }
            });
        },

        get_workflow: function (callback) {
            var that = this;

            if (that.Objects.NodeID || that.Objects.Service.IsKnowledge || !that.Options.Modules.WF) return callback();

            GlobalUtilities.load_files(["API/WFAPI.js"], { OnLoad: function () { that._get_workflow(callback); } });
        },

        _get_workflow: function (callbalck) {
            var that = this;

            WFAPI.GetOwnerWorkFlows({
                NodeTypeID: that.Objects.Service.NodeTypeID, ParseResults: true,
                ResponseHandler: function (arr) {
                    if ((arr || []).length == 0) return callbalck();
                    else if ((arr || []).length == 1) return callbalck(arr[0].WorkFlowID);

                    var elems = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-10 medium-6 large-4 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "container",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:1rem; text-align:center; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.WorkFlowSelect }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                            ]
                        }
                    ]);

                    var _add = function (item) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div",
                                Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white SoftBorder",
                                Style: "margin:0.3rem 0rem; padding:0.5rem; font-weight:bold; cursor:pointer;",
                                Properties: [
                                    {
                                        Name: "onclick",
                                        Value: function () {
                                            callbalck(item.WorkFlowID);
                                            showed.Close();
                                        }
                                    }
                                ],
                                Childs: [{ Type: "text", TextValue: Base64.decode(item.Name || "") }]
                            }
                        ], elems["_div"]);
                    }

                    for (var i = 0, lnt = arr.length; i < lnt; ++i) _add(arr[i]);

                    var showed = GlobalUtilities.show(elems["container"]);
                }
            });
        },

        get_admin_area: function (container, callback) {
            var that = this;

            if (!that.needs_admin_area()) return callback();

            var _div = container || GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            var showed = container ? null : GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["CN/AdminAreaSelect.js"], {
                OnLoad: function () {
                    new AdminAreaSelect(_div, {
                        NodeID: that.Objects.NodeID,
                        NodeTypeID: that.Objects.Service.NodeTypeID,
                        AdminType: that.Objects.Service.AdminType,
                        Confirmation: !container,
                        OnSelect: function (node) {
                            if (showed) showed.Close();
                            callback(node);
                        },
                        OnSingleNodeFound: function () { container.innerHTML = ""; },
                        OnCancel: function () {
                            container.innerHTML =
                                "<div style='text-align:center; font-size:1.2rem; color:rgb(100,100,100);'>" +
                                RVDic.NothingToDisplay + "</div>";
                        }
                    });
                }
            });
        },

        _set_document_tree: function (container, treeNode) {
            var that = this;

            container.innerHTML = RVDic.DocumentTreeSelect;

            var tree = treeNode.Tree;
            var childs = treeNode.Path;

            that.Objects.DocumentTreeNodeID = (treeNode || {}).ID || "";

            if (!tree || !childs) return;

            container.innerHTML = "";

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "color:black; font-weight:normal; font-size:0.8rem; position:relative; padding-" + RV_Float + ":6rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic.DocumentTree + ":" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "div", Name: "treeTitle",
                                    Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;"
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: "(" }]
                                },
                                { Type: "div", Name: "treeChilds", Style: "display:inline-block; font-weight:bold;" },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: ")" }]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            GlobalUtilities.set_text(_el["treeTitle"], tree.Name);

            var iconName = RV_RTL ? "fa-angle-double-left" : "fa-angle-double-right";

            for (var i = 0, lnt = childs.length; i < lnt; ++i) {
                if (i > 0) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:inline-block; margin:0rem 0.5rem;",
                            Childs: [{ Type: "i", Class: "fa " + iconName, Attributes: [{ Name: "aria-hidden", Value: true }] }]
                        }
                    ], _el["treeChilds"]);
                }

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; color:gray; font-size:0.8rem;",
                        Childs: [{ Type: "text", TextValue: childs[i].Name }]
                    }
                ], _el["treeChilds"]);
            }
        },

        save_related_nodes: function () {
            var that = this;

            if (!that.Objects.NodeSelect) return;

            var nodes = that.Objects.NodeSelect.get_items();
            var nodeIds = [];
            for (var i = 0, lnt = (nodes || []).length; i < lnt; ++i) nodeIds.push(nodes[i].NodeID);

            if (that.__SavingRelatedNodes) return;
            that.__SavingRelatedNodes = true;

            CNAPI.SaveRelations({
                NodeID: that.Objects.NodeID, RelatedNodeIDs: nodeIds.join("|"), ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else if (result.Succeed) alert(RVDic.MSG[result.Succeed] || result.Succeed);

                    that.__SavingRelatedNodes = false;
                }
            });
        },

        _initialize_workflow: function () {
            var that = this;

            var container = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor", Name: "_div", Style: "padding:1rem;" }
            ], that.Interface.WorkflowArea)["_div"];

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["WorkFlowManager/WorkFlowViewer.js"], {
                OnLoad: function () {
                    container.innerHTML = "";
                    var wfv = new WorkFlowViewer(container, { OwnerID: that.Objects.NodeID, OnInit: function () { wfv.show(); } });
                }
            });
        },

        _initialize_knowledge_options: function () {
            var that = this;

            var container = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor", Name: "_div", Style: "padding:1rem;" }
            ], that.Interface.WorkflowArea)["_div"];

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["KW/KnowledgeWorkFlow.js"], {
                OnLoad: function () {
                    CNAPI.GetNode({
                        NodeID: that.Objects.NodeID, ParseResults: true,
                        ResponseHandler: function (node) {
                            container.innerHTML = "";
                            var wfv = new KnowledgeWorkFlow(container, GlobalUtilities.extend(node || {}, {
                                HasAdminArea: function () { return !!that.Objects.AdminAreaID; }
                            }));
                        }
                    });
                }
            });
        }
    }
})();