(function () {
    if (window.FormImport) return;

    window.FormImport = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        this.Objects = {
            FormID: params.FormID,
            InstanceID: params.InstanceID,
            Elements: params.Elements,
            MapVariableName: "ImportMap",
            Uploader: null,
            Maps: {}
        };

        this.Options = {
            OnFinish: params.OnFinish
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js", "API/DocsAPI.js"], {
            OnLoad: function () {
                that._preinit();
            }
        });
    }

    FormImport.prototype = {
        _preinit: function () {
            var that = this;

            RVAPI.GetOwnerVariables({
                OwnerID: that.Objects.FormID, Name: that.Objects.MapVariableName, ParseResults: true,
                ResponseHandler: function (result) {
                    that._initialize(result.Variables || []);
                }
            });
        },

        _initialize: function (maps) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            that.import_dialog(maps);
        },

        import_dialog: function (maps) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "padding:0.3rem; border-style:dashed;", Name: "uploadArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem; margin-top:1rem; display:none;", Name: "buttonsArea",
                    Childs: [
                        {
                            Type: "div", Name: "actionButton", Style: "margin:0rem auto;",
                            Class: "small-6 medium-6 large-6 rv-air-button rv-border-radius-quarter",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding:0rem 0.5rem; font-size:0.7rem; font-weight:bold; margin-top:0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Maps }]
                        },
                        { Type: "hr", Class: "small-12 medium-12 large-12" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "maps" }
                    ]
                }
            ], that.ContainerDiv);

            GlobalUtilities.loading(elems["uploadArea"]);

            var _uploadParams = {
                UploadDataSource: DocsAPI.GetUploadLink(),
                Removable: true,
                MaxCount: 1,
                AcceptedFiles: [".xml"],
                OnUpload: function (file, jsonResponse) {
                    jQuery(elems["buttonsArea"]).fadeIn(500);
                },
                OnRemove: function (p) {
                    that.Objects.Uploader.remove(p);
                    jQuery(elems["buttonsArea"]).fadeOut(500);
                }
            }

            GlobalUtilities.uploader(elems["uploadArea"], _uploadParams, function (au) { that.Objects.Uploader = au; });

            var processing = false;

            elems["actionButton"].onclick = function () {
                var file = that.get_uploaded_file();
                var selectedMap = that.get_selected_map();
                if (processing || !file) return;

                if (!selectedMap) return alert(RVDic.Checks.PleaseSelectAMap);

                processing = true;
                elems["actionButton"].innerHTML = "";
                GlobalUtilities.loading(elems["actionButton"]);

                FGAPI.ImportForm({
                    InstanceID: that.Objects.InstanceID,
                    Uploaded: Base64.encode(file.toString()),
                    Map: Base64.encode(JSON.stringify((selectedMap || {}).Value || {})),
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) { if (that.Options.OnFinish) that.Options.OnFinish(result); }

                        elems["actionButton"].innerHTML = RVDic.Confirm;
                        processing = false;
                    }
                });
            };

            var _show_dialog = function (map) {
                var file = that.get_uploaded_file();
                if (!file) return;

                var isNew = !(map || {}).ID;

                that.map_dialog(file, map, function (m) {
                    if (isNew) that.add_map_item(elems["maps"], newMapBtn, m);
                    else m.SetName();
                });
            };

            var newMapBtn = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "btn",
                    Style: "display:inline-block; font-size:0.7rem; margin:0.2rem; padding:0.2rem 0.4rem;",
                    Childs: [{ Type: "text", TextValue: "+ " + RVDic.New }]
                }
            ], elems["maps"])["btn"];

            for (var i = 0; i < (maps || []).length; ++i)
                that.add_map_item(elems["maps"], newMapBtn, maps[i]);

            newMapBtn.onclick = function () { _show_dialog(null); };
        },

        get_uploaded_file: function () {
            var that = this;
            var files = !that.Objects.Uploader ? null : that.Objects.Uploader.get_items(true);
            return (files || []).length == 1 ? files[0] : null;
        },

        get_selected_map: function () {
            var that = this;
            for (var k in (that.Objects.Maps || {}))
                if (that.Objects.Maps[k] && that.Objects.Maps[k].IsSelected()) return that.Objects.Maps[k];
            return null;
        },

        add_map_item: function (container, beforeItem, map) {
            var that = this;
            map = map || {};

            try {
                if (map.Value) map.Value = JSON.parse(Base64.decode(map.Value));
            } catch (e) { return; }

            if (!(map.Value || {}).MapName) return;

            var editable = map.Editable === true;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-tab-selected rv-border-radius-quarter", Name: "container",
                    Style: "display:inline-block; font-size:0.7rem; margin:0.2rem; padding:0.2rem 0.4rem;",
                    Childs: [
                        {
                            Type: "checkbox", Name: "checkbox",
                            Style: "display:inline-block; width:1rem; height:1rem; margin-" + RV_RevFloat + ":0.5rem; cursor:pointer;",
                            Params: { OnChange: function (e) { _onchange.call(this, e); } }
                        },
                        {
                            Type: "div", Class: "SoftBackgroundColor rv-circle",
                            Style: "display:" + (editable ? "inline-block" : "none") + "; margin-" + RV_RevFloat + ":0.3rem;" +
                                "width:1rem; height:1rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove, Name: "remove",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "SoftBackgroundColor rv-circle",
                            Style: "display:" + (editable ? "inline-block" : "none") + "; margin-" + RV_RevFloat + ":0.3rem;" +
                                "width:1rem; height:1rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil rv-icon-button", Tooltip: RVDic.Edit, Name: "edit",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "name" }
                    ]
                }
            ]);

            if (!beforeItem) container.appendChild(elems["container"]);
            else container.insertBefore(elems["container"], beforeItem);

            var _onchange = function (e) {
                var chb = elems["checkbox"];
                if (!chb.checked) return;

                for (var k in (that.Objects.Maps || {}))
                    if (that.Objects.Maps[k] && (k != map.ID)) that.Objects.Maps[k].UnSelect();
            };

            elems["container"].onclick = function () {
                var file = that.get_uploaded_file();
                if (file) that.map_dialog(file, map, function () { }, true);
            };

            elems["edit"].onclick = function (e) {
                e.stopPropagation();
                var file = that.get_uploaded_file();
                if (file) that.map_dialog(file, map, function (m) { m.SetName(); });
            };

            var removing = false;

            elems["remove"].onclick = function (e) {
                e.stopPropagation();
                if (removing) return;

                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" +
                    GlobalUtilities.convert_numbers_to_persian(Base64.decode(map.Value.MapName)) + "'");

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;
                    removing = true;

                    RVAPI.RemoveOwnerVariable({
                        ID: map.ID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                jQuery(elems["container"]).fadeOut(500, function () {
                                    this.remove();
                                    that.Objects.Maps[map.ID] = null;
                                });
                            }

                            removing = false;
                        }
                    });
                });
            };

            map.SetName = function () {
                GlobalUtilities.set_text(elems["name"], GlobalUtilities.convert_numbers_to_persian(Base64.decode(map.Value.MapName)));
            };

            map.UnSelect = function () { elems["checkbox"].uncheck({ StopOnChange: true }); };

            map.IsSelected = function () { return elems["checkbox"].checked; };

            map.SetName();

            that.Objects.Maps[map.ID] = map;
        },

        json2tree: function (jsonData) {
            var that = this;

            var arr = [];

            for (var k in jsonData) {
                var data = { Name: GlobalUtilities.generate_new_guid(), Title: k };
                arr.push(data);

                if (GlobalUtilities.get_type(jsonData[k]) == "json") data.Childs = that.json2tree(jsonData[k]);
                else {
                    data.Value = jsonData[k];

                    if ((GlobalUtilities.get_type(jsonData[k]) == "array") && jsonData[k].length) {
                        var hasTreeContent = false;
                        var dic = {};
                        var sub = [];

                        for (var i = 0; i < jsonData[k].length; ++i) {
                            if (GlobalUtilities.get_type(jsonData[k][i]) == "json") {
                                hasTreeContent = true;
                                var newSub = that.json2tree(jsonData[k][i]);

                                for (var x = 0; x < newSub.length; ++x) {
                                    if (!dic[newSub[x].Title]) {
                                        dic[newSub[x].Title] = true;
                                        sub.push(newSub[x]);
                                    }
                                }
                            }
                        }

                        if (hasTreeContent) data.Childs = sub;
                    }
                }
            }

            return arr;
        },

        map_dialog: function (file, map, callback, readOnly) {
            if (!file) return;
            var that = this;
            map = map || {};

            readOnly = !!readOnly;

            if (((map.EditDialog || {})[readOnly] || {}).Container)
                return (map.EditDialog[readOnly].Showed = GlobalUtilities.show(map.EditDialog[readOnly].Container));

            map.EditDialog = map.EditDialog || {};
            map.EditDialog[readOnly] = map.EditDialog[readOnly] || { Container: null, Showed: null };

            var _div = map.EditDialog[readOnly].Container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 row rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            map.EditDialog[readOnly].Showed = GlobalUtilities.show(_div);

            var _show_settings = function () {
                GlobalUtilities.load_files(["TreeView/TreeView.js"], {
                    OnLoad: function () {
                        that.map_settings(_div, file.__TreeData, map, function (m) {
                            if (m && !(m.EditDialog || {})[readOnly]) {
                                m.EditDialog = m.EditDialog || map.EditDialog || {};
                                m.EditDialog[readOnly] = map.EditDialog[readOnly];
                            }
                            map.EditDialog[readOnly].Showed.Close();
                            if(m) callback(m);
                        }, readOnly);
                    }
                });
            };

            if (file.__TreeData) return _show_settings();

            DocsAPI.XML2JSON({
                Uploaded: Base64.encode(file.toString()), ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else {
                        file.__TreeData = that.json2tree(result.Converted || {});
                        _show_settings();
                    }
                }
            });
        },

        find_tree_item: function (name, treeData) {
            for (var i = 0; i < (treeData || []).length; ++i)
                if (String(treeData[i].Title).toLowerCase() == String(name).toLowerCase()) return treeData[i];
        },

        find_path: function (name, map, treeData) {
            var that = this;
            map = map || {};
            
            if (map.target && (String(map.target).toLowerCase()) == String(name).toLowerCase()) return true;
            else if (map.sub) {
                for (var k in map.sub) {
                    var treeItem = that.find_tree_item(k, treeData);

                    var result = that.find_path(name, map.sub[k], (treeItem || {}).Childs);

                    if (result === true) return treeItem ? [treeItem] : [{ Title: k }];
                    else if (GlobalUtilities.get_type(result) == "array") {
                        result.push(treeItem ? treeItem : { Title: k });
                        return result;
                    }
                }
            }

            return false;
        },

        add_map_elements: function (container, elements, map, treeData, params, callback) {
            var that = this;
            params = params || {};
            callback = callback || function () { };

            var count = (elements || []).length;
            if (!count) return callback();
        
            jQuery.each(elements, function (ind, val) {
                that.add_map_element(container, val, map, treeData, params, function () { if (!(--count)) callback(); });
            });
        },

        add_map_element: function (container, element, map, treeData, params, callback) {
            var that = this;
            callback = callback || function () { };
            if (!(element || {}).Name) {
                callback();
                return null;
            }
            map = map || {};
            params = params || {};

            var classTemplate = "small-12 medium-12 large-12 rv-border-radius-quarter TextAlign [cls]";

            var get_class = function (selected) {
                return element.IsNodeElement ?
                    classTemplate.replace("[cls]", selected ? "rv-air-button-base rv-air-button-black" : "rv-bg-color-softer-soft") :
                    classTemplate.replace("[cls]", selected ? "rv-air-button" : "rv-white-button rv-bg-color-trans-soft");
            };

            var title = element.Title;
            if (title.length > 60) title = title.substr(0, 60) + "...";

            /* find the path */
            var parentPath = params.ParentPath || [];
            var theMap = map.Value;
            var theTree = treeData;

            for (var i = 0; i < parentPath.length; ++i) {
                theMap = (theMap.sub || {})[parentPath[i].Title];
                theTree = (that.find_tree_item(parentPath[i].Title, theTree) || {}).Childs;
            }

            var curPath = that.find_path(element.Name, theMap, theTree);
            
            if (GlobalUtilities.get_type(curPath) == "array") curPath = [].concat(parentPath, curPath.reverse());
            else curPath = null;
            /* end of find the path */

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: get_class(false), Name: "container",
                    Style: "margin-bottom:" + (element.MarginBottom || "0.2") + "rem; padding:0.3rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "checkbox", Name: "checkbox",
                                    Style: "margin-" + RV_RevFloat + ":0.5rem; width:1rem; height:1rem;",
                                    Params: { OnChange: function (e) { _onchange.call(this, e); } }
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: element.Name }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; font-size:0.7rem; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: title }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block; font-size:0.7rem; color:rgb(150,150,150);",
                                    Childs: [{ Type: "text", TextValue: "(" + RVDic.FG.ElementTypes[element.Type] + ")" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter", Name: "path",
                            Style: "background-color:white; padding:0.3rem; margin-top:0.3rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "subTreeContainer",
                            Style: "padding-" + RV_Float + ":1.5rem; margin-top:0.5rem; display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                                    Style: "font-size:0.7rem;", Name: "subTreeButton",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-angle-down fa-lg", Name: "stIcon",
                                            Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.SubCategory }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                                    Style: "margin-top:0.5rem; display:none;", Name: "subTree"
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var hasSubForm = (element.Type == "Form") && (element.Info || {}).FormID;
            var isDate = element.Type == "Date";

            if (hasSubForm) {
                FGAPI.GetFormElements({
                    FormID: element.Info.FormID, ParseResults: true,
                    ResponseHandler: function (result) {
                        for (var i = 0; i < (result.Elements || []).length; ++i) {
                            if (result.Elements[i].Name) jQuery(elems["subTreeContainer"]).fadeIn(500);

                            result.Elements[i].Title = Base64.decode(result.Elements[i].Title);
                            result.Elements[i].Name = Base64.decode(result.Elements[i].Name);
                            result.Elements[i].Info = JSON.parse(Base64.decode(result.Elements[i].Info) || "{}");
                        }

                        that.add_map_elements(elems["subTree"], result.Elements, map, treeData, {
                            ParentPath: curPath
                        }, function () { callback(); });
                    }
                });
            }
            else if (isDate) {
                jQuery(elems["subTreeContainer"]).fadeIn(500);

                var arr = [
                    { Title: RVDic.Month, Name: element.Name + "_month", Type: "Numeric", ElementID: GlobalUtilities.generate_new_guid() },
                    { Title: RVDic.Day, Name:element.Name + "_day", Type: "Numeric", ElementID: GlobalUtilities.generate_new_guid() }
                ];

                that.add_map_elements(elems["subTree"], arr, map, treeData, params, function () { callback(); });
            }

            var _onchange = function (e) {
                var chb = elems["checkbox"];
                elems["container"].setAttribute("class", get_class(chb.checked));
                if (!chb.checked) return;

                for (var i = 0; i < (map.NamedElements || []).length; ++i) {
                    var obj = map.NamedElements[i];

                    if (obj.Container != elems["container"]) {
                        obj.UnSelect();
                        obj.SetClass(false);
                    }
                }
            };

            elems["subTreeButton"].onclick = function () {
                elems["stIcon"].setAttribute("class", "fa " +
                    (elems["subTree"].style.display == "none" ? "fa-angle-up" : "fa-angle-down") + " fa-lg");
                jQuery(elems["subTree"]).animate({ height: "toggle" }, 500);
            };

            var _add_path_item = function (itm) {
                var notExist = !itm.Name;
                var isFirstChild = !elems["path"].firstChild;

                GlobalUtilities.create_nested_elements([
                    (!isFirstChild ? null : {
                        Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                        Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Attributes: [{ Name: "aria-hidden", Value: true }],
                        Properties: [{ Name: "onclick", Value: function () { theObject.ClearAssigned(); }}]
                    }),
                    (isFirstChild ? null : {
                        Type: "i", Class: "fa " + (RV_RTL ? "fa-angle-double-left" : "fa-angle-double-right"),
                        Style: "margin:0rem 0.3rem; color:black; display:inline-block;",
                        Attributes: [{ Name: "aria-hidden", Value: true }]
                    }),
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:inline-block; padding:0.2rem; font-size:0.6rem; margin:0.2rem;" +
                            (notExist ? "color:red;" : ""),
                        Childs: [{ Type: "text", TextValue: itm.Title }]
                    }
                ], elems["path"]);
            };

            var assignedId = null, assignedPath = null;

            var theObject = elems["container"].TheObject = {
                Container: elems["container"],
                Element: element,
                UnSelect: function () { elems["checkbox"].uncheck({ StopOnChange: true }); },
                SetClass: function (selected) { elems["container"].setAttribute("class", get_class(selected)); },
                Selected: function () { return elems["checkbox"].checked; },
                GetAssignedID: function () { return assignedId; },
                GetAssignedPath: function () { return assignedPath },
                ClearAssigned: function () {
                    elems["path"].innerHTML = "";
                    jQuery(elems["path"]).fadeOut(0);
                    assignedPath = assignedId = null;
                },
                SetPath: function (path) {
                    assignedId = path[path.length - 1].Name;
                    assignedPath = path;
                    elems["path"].innerHTML = "";
                    jQuery(elems["path"]).fadeIn(500);
                    jQuery.each(path || [], function (ind, val) { _add_path_item(val); });
                }
            };

            map.NamedElements = map.NamedElements || [];
            map.NamedElements.push(theObject);

            if (curPath) {
                var pathId = curPath[curPath.length - 1].Name;
                var dicItem = (map.AssignmentDic || {})[pathId];
                var theSame = String(((dicItem || {}).Element || {}).Name).toLowerCase() == String(element.Name).toLowerCase();

                if (!dicItem || theSame) {
                    map.AssignmentDic = map.AssignmentDic || {};
                    if (dicItem && dicItem.TitleElement) theObject.TitleElement = dicItem.TitleElement;
                    if (pathId) map.AssignmentDic[pathId] = theObject;
                    theObject.SetPath(curPath);
                }
            }

            if (!hasSubForm && !isDate) callback();

            return theObject;
        },

        map_settings: function (container, treeData, map, onSave, readOnly) {
            var that = this;
            map = map || {};

            container.innerHTML = "";

            var mapName = Base64.decode(((map || {}).Value || {}).MapName);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-title", Name: "title",
                    Style: (mapName ? "" : "display:none;"),
                    Childs: [{ Type: "text", TextValue: mapName }]
                },
                {
                    Type: "div", Name: "elements",
                    Class: "small-12 medium-6 large-6 rv-border-radius-half rv-trim-vertical-margins",
                    Style: "background-color:white; margin-bottom:0.5rem; padding:0.5rem;"
                },
                { Type: "div", Class: "small-12 medium-1 large-1", Style: "padding:0.25rem 0rem;" },
                {
                    Type: "div", Class: "small-12 medium-5 large-5 rv-border-radius-1", Name: "tree",
                    Style: "background-color:white; padding:1rem;"
                },
                { Type: "div", Class: "small-12 medium-12 large-1" },
                {
                    Type: "div", Class: "small-5 medium-5 large-4 rv-tab-disabled rv-circle",
                    Style: "margin-top:1rem;" + (readOnly ? "display:none;" : ""), Name: "saveButton",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-floppy-o fa-lg", Style: "margin-" + RV_RevFloat + ":0.4rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        },
                        { Type: "text", TextValue: RVDic.Save }
                    ]
                },
                { Type: "div", Class: "small-2 medium-2 large-2" },
                {
                    Type: "div", Class: "small-5 medium-5 large-4 rv-air-button rv-circle", 
                    Style: "margin-top:1rem;" + (readOnly ? "display:none;" : ""),
                    Properties: [{ Name: "onclick", Value: function () { onSave(false); } }],
                    Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                },
                { Type: "div", Class: "small-12 medium-12 large-1" }
            ], container);

            var saveButtonDisabled = true;

            elems["saveButton"].onclick = function () {
                if (saveButtonDisabled) return;

                that.save_map(map, function (m) {
                    jQuery(elems["title"]).fadeIn(0);

                    GlobalUtilities.set_text(elems["title"],
                        GlobalUtilities.convert_numbers_to_persian(Base64.decode(((m || {}).Value || {}).MapName)));

                    onSave(m);
                });
            };

            that.add_map_elements(elems["elements"], [
                {
                    ElementID: GlobalUtilities.generate_new_guid(), IsNodeElement: true,
                    Title: RVDic.Name, Name: "node_name", Type: "Text"
                },
                {
                    ElementID: GlobalUtilities.generate_new_guid(), IsNodeElement: true,
                    Title: RVDic.Logo, Name: "node_logo", Type: "File", MarginBottom: 1
                }
            ], map, treeData, null);

            that.add_map_elements(elems["elements"], that.Objects.Elements, map, treeData, null, function () {
                saveButtonDisabled = false;
                elems["saveButton"].classList.remove("rv-tab-disabled");
                elems["saveButton"].classList.add("rv-air-button");
            });

            var _get_selected = function () {
                for (var i = 0; i < (map.NamedElements || []).length; ++i)
                    if (map.NamedElements[i].Selected()) return map.NamedElements[i];
                return null;
            };

            var dic = map.AssignmentDic = map.AssignmentDic || {};

            new TreeView(elems["tree"], {
                PathVariableName: "Path",
                Items: treeData,
                Item: function (itm) { return itm; },
                TitleBuilder: function (item) {
                    var strHint = GlobalUtilities.get_type(item.Value) == "string" ? item.Value : "";
                    
                    if ((GlobalUtilities.get_type(item.Value) == "array") && item.Value.length) {
                        strHint = GlobalUtilities.get_type(item.Value[0]) == "string" ?
                            item.Value.join(", ") : item.Value.length;
                    }

                    if (strHint && (strHint.length > 30) && (strHint.indexOf(" ") < 0))
                        strHint = strHint.substr(0, 30) + "...";

                    return GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: item.Title }]
                                },
                                {
                                    Type: "div",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;" +
                                        "font-size:0.6rem; color:rgb(150,150,150);",
                                    Childs: [{ Type: "text", TextValue: strHint }]
                                }
                            ]
                        }
                    ])["_div"];
                },
                OnItemAdd: function (p, item) {
                    var compareDic = (map.Value || {}).sub || {};

                    for (var i = 0; i < (item.Path || []).length; ++i) {
                        if (i < (item.Path.length - 1)) compareDic = (compareDic[item.Path[i].Title] || {}).sub || {};
                        else if ((compareDic[item.Title] || {}).target) {
                            p.TitleElement.style.fontWeight = "bold";

                            if (!dic[item.Name]) {
                                dic[item.Name] = {
                                    TitleElement: p.TitleElement,
                                    Element: { Name: compareDic[item.Title].target }
                                };
                            }
                        }
                    }
                },
                OnClick: function (e, item, done) {
                    var selected = _get_selected();
                    if (readOnly || !selected) return;
                    
                    if (selected.TitleElement) selected.TitleElement.style.fontWeight = "normal";
                    selected.TitleElement = e.TitleElement;
                    selected.TitleElement.style.fontWeight = "bold";

                    dic[selected.GetAssignedID()] = null;
                    if (dic[item.Name]) {
                        if (dic[item.Name].ClearAssigned) dic[item.Name].ClearAssigned();
                        dic[item.Name].TitleElement = null;
                    }
                    dic[item.Name] = selected;
                    selected.SetPath(item.Path);
                }
            });
        },

        save_map: function (map, done) {
            var that = this;
            map = map || {};

            if (that._SavingMap) return;
            that._SavingMap = true;

            var dic = { sub: {} };

            for (var i = 0; i < (map.NamedElements || []).length; ++i) {
                var element = map.NamedElements[i];
                
                var path = element.GetAssignedPath();
                if (!(path || []).length) continue;

                var curDic = dic.sub;

                for (var x = 0; x < path.length; ++x) {
                    curDic[path[x].Title] = curDic[path[x].Title] || {};

                    if (x == (path.length - 1)) curDic[path[x].Title].target = element.Element.Name;
                    else curDic = (curDic[path[x].Title].sub = curDic[path[x].Title].sub || {});
                }
            }

            GlobalUtilities.load_files(["Public/NameDialog.js"], {
                OnLoad: function () {
                    var msg = RVDic.Confirms.DoYouWantToRenameN.replace("[n]", RVDic.Map);

                    new NameDialog({
                        Title: RVDic.Rename, InnerTitle: RVDic.Title,
                        InitialValue: Base64.decode((map.Value || {}).MapName), ConfirmMessage: msg,
                        OnActionCall: function (name, callback) {
                            if (!name) return callback(!(that._SavingMap = false));

                            dic.MapName = Base64.encode(name);

                            RVAPI.SetOwnerVariable({
                                ID: map.ID, OwnerID: that.Objects.FormID, Name: "ImportMap",
                                Value: Base64.encode(JSON.stringify(dic)), ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    else if (result.Succeed) {
                                        map.Value = dic;
                                        if (done) done(map.ID ? map : result.Variable);
                                    }

                                    callback(!!(result || {}).Succeed);

                                    that._SavingMap = false;
                                }
                            });
                        }
                    });
                }
            });
        }
    }
})();