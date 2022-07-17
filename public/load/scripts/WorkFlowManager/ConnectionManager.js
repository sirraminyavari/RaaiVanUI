(function () {
    if (window.ConnectionManager) return;

    window.ConnectionManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            WorkFlowID: params.WorkFlowID,
            State: params.State || {},
            Edge: params.Edge || {}
        };

        this.Options = {
            GetStates: params.GetStates || function () { },
            ActionTypes: params.ActionTypes || [],
            VariableTypes: params.VariableTypes || []
        };
        
        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["WFAPI", "DocsAPI"] },
            { Root: "WorkFlowManager/", Ext: "js", Childs: ["NeededFormsManager", "AutoMessageManager"] },
            "MediaManager/MediaManager.js",
            "Formula/RVFormula.js"
        ], { OnLoad: function () { that.initialize(); } });
    }

    ConnectionManager.prototype = {
        initialize: function () {
            var that = this;
            
            that.ContainerDiv.innerHTML = "";
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "margin-bottom:1rem; font-size:1.2rem; text-align:center;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: RVDic.State + ": " }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.State.Title) }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Option + ": " }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.Edge.OutStateTitle) }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "labelArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "attachmentArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "directorArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "actionArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "formsArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white",
                    Style: "padding:0.5rem;", Name: "audienceArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white", Style: "padding:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.3rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.TemplateFiles }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "templateFilesArea" }
                    ]
                }
            ], that.ContainerDiv);

            that.create_connection_label_area(elems["labelArea"]);
            that.create_attachment_area(elems["attachmentArea"]);
            that.create_director_area(elems["directorArea"]);
            that.create_template_files_area(elems["templateFilesArea"]);
            that.create_action_area(elems["actionArea"]);
            
            new NeededFormsManager(elems["formsArea"], {
                WorkFlowID: that.Objects.WorkFlowID, InStateID: that.Objects.State.StateID,
                OutStateID: that.Objects.Edge.OutStateID, Forms: that.Objects.Edge.Forms || []
            });
            
            new AutoMessageManager(elems["audienceArea"], {
                OwnerID: that.Objects.Edge.ID, AutoMessages: that.Objects.Edge.Audience || [],
                GetStates: that.Options.GetStates
            });
        },
        
        create_connection_label_area: function (container) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":2.5rem; min-height:2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "labelInput",
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.WF.OptionTitle
                                }
                            ]
                        }
                    ]
                }
            ], container);
            
            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var labelInput = elems["labelInput"];
            var editButton = elems["editButton"];

            var _set_data = function () {
                var label = Base64.decode(that.Objects.Edge.ConnectionLabel);

                viewArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.WF.OptionTitle + ": " }]
                    },
                    {
                        Type: "div",
                        Style: "display:inline-block;" + (label ? "font-weight:bold;" : "color:rgb(100,100,100);"),
                        Childs: [{ Type: "text", TextValue: label ? label : "(" + RVDic.NotSet + ")" }]
                    }
                ], viewArea);

                labelInput.value = label;
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newLabel = GlobalUtilities.trim(labelInput.value);
                    if (!newLabel) return;

                    GlobalUtilities.block(container);

                    WFAPI.SetStateConnectionLabel({
                        WorkFlowID: that.Objects.WorkFlowID, InStateID: that.Objects.State.StateID,
                        OutStateID: that.Objects.Edge.OutStateID, Label: Base64.encode(newLabel), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Edge.ConnectionLabel = Base64.encode(newLabel);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;

            if (!that.Objects.Edge.ConnectionLabel) _on_edit();
            _set_data();
        },

        create_attachment_area: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":2.5rem; min-height:2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea",
                            Style: "position:relative; display:none; padding-" + RV_RevFloat + ":15rem;",
                            Childs: [
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; bottom:0rem; width:14rem;",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "checkbox", Name: "necessaryCheckbox",
                                                    Style: "width:1.2rem; height:1.2rem; cursor:pointer;"
                                                },
                                                {
                                                    Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.WF.CompulsoryAttachment }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "input", Class: "rv-input", Name: "titleInput",
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.WF.OptionAttachmentSubject
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var titleInput = elems["titleInput"];
            var necessaryCheckbox = elems["necessaryCheckbox"];
            var editButton = elems["editButton"];

            var _set_data = function () {
                var title = Base64.decode(that.Objects.Edge.AttachmentTitle);
                var necessary = that.Objects.Edge.AttachmentRequired === true;

                viewArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.WF.OptionAttachmentSubject + ": " }]
                    },
                    {
                        Type: "div",
                        Style: "display:inline-block;" + (title ? "font-weight:bold;" : "color:rgb(100,100,100);"),
                        Childs: [{ Type: "text", TextValue: title ? title : "(" + RVDic.NotSet + ")" }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:" + (title && necessary ? "inline-block" : "none") + ";" +
                            "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Necessary }]
                    }
                ], viewArea);

                titleInput.value = title;

                if (necessary) necessaryCheckbox.Check({ StopOnChange: true });
                else necessaryCheckbox.Uncheck({ StopOnChange: true });
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newTitle = GlobalUtilities.trim(titleInput.value);
                    var _nc = necessaryCheckbox.Checked;

                    GlobalUtilities.block(container);

                    WFAPI.SetStateConnectionAttachmentStatus({
                        WorkFlowID: that.Objects.WorkFlowID, InStateID: that.Objects.State.StateID,
                        OutStateID: that.Objects.Edge.OutStateID, AttachmentRequired: _nc, AttachmentTitle: newTitle,
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Edge.AttachmentTitle = Base64.encode(newTitle);
                                that.Objects.Edge.AttachmentRequired = _nc;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;
            
            if (!that.Objects.Edge.AttachmentTitle) _on_edit();
            _set_data();
        },

        create_director_area: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "position:relative; padding-" + RV_Float + ":2.5rem; min-height:2rem;",
                Childs: [
                    {
                        Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                        Childs: [{
                            Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "info", Style: "margin-bottom:0.5rem;" },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyTextArea" }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "position:relative; padding-" + RV_RevFloat + ":10rem; margin-bottom:0.5rem;",
                                Childs: [
                                    {
                                        Type: "div",
                                        Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem; bottom:0rem; width:9rem;",
                                        Childs: [{
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "checkbox", Name: "necessaryCheckbox",
                                                    Style: "width:1.2rem; height:1.2rem; cursor:pointer;"
                                                },
                                                {
                                                    Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.Necessary }]
                                                }
                                            ]
                                        }]
                                    },
                                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypeSelect" }
                                ]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea" }
                        ]
                    }
                ]
            }], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];
            var necessaryCheckbox = elems["necessaryCheckbox"];
            var infoArea = elems["info"];
            var bodyTextArea = elems["bodyTextArea"];

            var nodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + " (" + RVDic.WF.Director + ")" + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName), nodeTypes[i].NodeTypeID]);
                    return arr;
                }
            });

            var descriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["descriptionArea"], DefaultText: RVDic.Description + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            var _set_info_desc = function () {
                var nodeRequired = that.Objects.Edge.NodeRequired === true;
                var desc = Base64.decode(that.Objects.Edge.NodeTypeDescription);

                infoArea.innerHTML = bodyTextArea.innerHTML = "";

                //Desc Area
                var descElems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "span",
                        Childs: [{ Type: "text", TextValue: RVDic.WF.DescriptionForTheDirectorOfTheNextState + ": " }]
                    },
                    { Type: "span", Style: "color:rgb(80,80,80);", Name: "desc" }
                ], bodyTextArea);

                if (!desc) descElems["desc"].innerHTML = "(" + RVDic.DescriptionIsEmpty + ")";
                else GlobalUtilities.append_markup_text(descElems["desc"], desc);

                descElems["desc"].setAttribute("class", "_"); //this is necessary!!!
                //end of Desc Area

                if (!that.Objects.Edge.NodeTypeID) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: RVDic.RoleType + " (" + RVDic.WF.Director + "): " }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; color:rgb(80,80,80);",
                            Childs: [{ Type: "text", TextValue: "(" + RVDic.NotSet + ")" }]
                        }
                    ], infoArea);
                }
                else {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: RVDic.RoleType + " (" + RVDic.WF.Director + "): " }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.Edge.NodeTypeName) }]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                            Style: "display:" + (nodeRequired ? "inline-block" : "none") + ";" +
                                "margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Necessary }]
                        }
                    ], infoArea);
                }

                descriptionInput.set_data(desc);

                if (nodeRequired) necessaryCheckbox.Check({ StopOnChange: true });
                else necessaryCheckbox.Uncheck({ StopOnChange: true });

                if (that.Objects.Edge.NodeTypeID)
                    nodeTypeSelect.set_item(that.Objects.Edge.NodeTypeID, Base64.decode(that.Objects.Edge.NodeTypeName));
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_info_desc();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newDescription = GlobalUtilities.trim(descriptionInput.get_data());

                    var index = nodeTypeSelect.selectedIndex;
                    var _ntid = index < 0 ? that.Objects.Edge.NodeTypeID : nodeTypeSelect.values[index];

                    var _inputValue = GlobalUtilities.trim(nodeTypeSelect.InputElement.value);
                    if (!_inputValue) _ntid = "";

                    var _ntName = !_ntid || (index < 0) ? "" : nodeTypeSelect.keywords[index];
                    var _nc = necessaryCheckbox.Checked;

                    GlobalUtilities.block(container);

                    WFAPI.SetStateConnectionDirector({
                        WorkFlowID: that.Objects.WorkFlowID, InStateID: that.Objects.State.StateID,
                        OutStateID: that.Objects.Edge.OutStateID, NodeTypeID: _ntid,
                        NodeRequired: _nc, Description: Base64.encode(newDescription), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Edge.NodeTypeID = _ntid;
                                that.Objects.Edge.NodeTypeDescription = Base64.encode(newDescription);
                                that.Objects.Edge.NodeTypeName = Base64.encode(_ntName);
                                that.Objects.Edge.NodeRequired = _nc;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;

            if (!that.Objects.Edge.NodeTypeID) _on_edit();
            _set_info_desc();
        },

        create_template_files_area: function (container) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "uploadArea", Tooltip: RVDic.UploadFile,
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "padding:0.3rem; border-style:dashed; margin-bottom:0.5rem;"
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachedFiles" }
            ], container);

            var mediaManager = new MediaManager({ ContainerDiv: elems["attachedFiles"], UnlimitedDownloadAccess: true });

            var _clarify = function (_attachedFile) {
                _attachedFile.FileName = Base64.decode(_attachedFile.FileName || "");
                _attachedFile.DownloadLink = DocsAPI.GetDownloadLink({ FileID: _attachedFile.FileID || "" });
                _attachedFile.Extension = Base64.decode(_attachedFile.Extension || "");
                return _attachedFile;
            }

            for (var i = 0, lnt = (that.Objects.Edge.AttachedFiles || []).length; i < lnt; ++i)
                that.Objects.Edge.AttachedFiles[i] = _clarify(that.Objects.Edge.AttachedFiles[i]);

            var mediaManagerParams = {
                Removable: true, Acceptable: false,
                OnRemove: function (p) {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveAttachedFile, function (result) {
                        if (!result) return;
                        p = p || {};
                        var file = p.File || {};

                        DocsAPI.RemoveFile({
                            FileID: file.FileID, OwnerID: file.OwnerID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (p.ContainerDiv) p.ContainerDiv.parentNode.removeChild(p.ContainerDiv);
                            }
                        });
                    });
                },
                OnAccept: function () { }
            };

            mediaManager.add_items(that.Objects.Edge.AttachedFiles || [], mediaManagerParams);

            var uploader = null;
            
            GlobalUtilities.uploader(elems["uploadArea"], {
                UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: that.Objects.Edge.ID, OwnerType: "WorkFlow" }),
                Removable: true,
                OnUpload: function (file, jsonResponse) {
                    var attachedFile = jsonResponse.AttachedFile;
                    if (attachedFile) mediaManager.add_item(_clarify(attachedFile), mediaManagerParams);
                    uploader.remove(file);
                },
                OnRemove: function (p) { }
            }, function (au) { uploader = au; });
        },

        create_action_area: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom: 0.5rem;",
                        Childs: [
                            {
                                Type: "div", Style: "display:inline-block; color:green; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: RVDic.Actions }]
                            },
                            {
                                Type: "div", Class: "rv-air-button rv-circle", Name: "addButton",
                                Style: "display:inline-block; margin-" + RV_Float + ":1rem; font-size:0.7rem;",
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-plus", Style: "margin-" + RV_RevFloat + ":0.4rem;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    },
                                    { Type: "text", TextValue: RVDic.Add }
                                ]
                            }
                        ]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" }
                ]
            }], container);
            
            var viewArea = elems["viewArea"];
            
            var refresh_actions = function () {
                viewArea.innerHTML = "";
                that.show_actions(viewArea, that.Objects.Edge.Actions, {
                    OnEdit: () => refresh_actions()
                });
            };
            
            refresh_actions();

            elems["addButton"].onclick = function () {
                that.new_action_area(null, { Done: () => refresh_actions() });
            };
        },

        new_action_area: function (action, options) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                Style: "padding: 1rem; margin: 0 auto;", Name: "_div"
            }]);

            var showed = GlobalUtilities.show(elems["_div"]);

            that._new_action_area(elems["_div"], action, GlobalUtilities.extend({}, options, {
                CloseModal: () => showed.Close()
            }));
        },

        _new_action_area: function (container, action, op) {
            var that = this;
            action = action || {};
            op = op || {};

            var optionsObj = null;

            var get_action = () => {
                return ((that.Objects.Edge || {}).Actions || []).length ? that.Objects.Edge.Actions[0] : null;
            };

            var selectedAction = null;

            var render_action_options = function () {
                elems["actionOptions"].innerHTML = "";

                if (selectedAction == "SetVariable") {
                    jQuery(elems["actionOptions"]).fadeIn(0);
                    optionsObj = that.render_action_variable(elems["actionOptions"], action);
                }
                else if (selectedAction == "SetScore") {
                    jQuery(elems["actionOptions"]).fadeIn(0);

                    optionsObj = that.render_formula_input(elems["actionOptions"], {
                        IsVariable: false,
                        Formula: Base64.decode(action.Formula),
                        IgnoreVariableID: action.ActionID
                    });
                }
                else if (selectedAction == "SaveNumberToFormField") {
                    jQuery(elems["actionOptions"]).fadeIn(0);

                    optionsObj = that.render_action_number_form_field(elems["actionOptions"], {
                        IsVariable: false,
                        SaveToFormElement: action.SaveToFormElement,
                        Formula: Base64.decode(action.Formula),
                    });
                }
                else if (selectedAction == "SaveTextToFormField") {
                    jQuery(elems["actionOptions"]).fadeIn(0);

                    optionsObj = that.render_action_text_form_field(elems["actionOptions"], {
                        IsVariable: false,
                        SaveToFormElement: action.SaveToFormElement,
                        VariableDefaultValue: Base64.decode(action.VariableDefaultValue)
                    });
                }
                else {
                    jQuery(elems["actionOptions"]).fadeOut(0);
                    optionsObj = null;
                }
            };

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "display: flex; flex-flow:column; margin-top: 1rem;",
                Childs: [
                    {
                        Type: "div", Style: "flex: 0 0 auto; display: flex; flex-flow:row;",
                        Childs: [
                            {
                                Type: "div", Style: "flex:0 0 auto; width:3rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.Action + ":" }]
                            },
                            {
                                Type: "div", Style: "flex:0 0 auto;",
                                Childs: [{
                                    Type: "select", Class: "rv-input", Name: "actionSelect",
                                    Properties: [{
                                        Name: "onchange",
                                        Value: (e) => {
                                            selectedAction = action.ActionType = !e.target.selectedIndex ? null :
                                                e.target[e.target.selectedIndex].value;
                                            render_action_options();
                                        }
                                    }],
                                    Childs: [{
                                        Type: "option", Childs: [{ Type: "text", TextValue: RVDic.Select + "..." }]
                                    }].concat((that.Options.ActionTypes || []).map(itm => {
                                        return {
                                            Type: "option",
                                            Attributes: [
                                                { Name: "value", Value: itm },
                                                (get_action() == itm ? { Name: "selected", Value: true } : null)
                                            ],
                                            Childs: [{ Type: "text", TextValue: RVDic.WF.Actions[itm] }]
                                        };
                                    }))
                                }]
                            }
                        ]
                    },
                    {
                        Type: "div", Name: "actionOptions",
                        Style: "flex: 0 0 auto; margin-top: 1rem; display: none;"
                    },
                    {
                        Type: "div", Style: "flex: 0 0 auto; padding-top: 1rem;",
                        Childs: [{
                            Type: "div", Class: "rv-air-button rv-circle",
                            Style: "margin: 0 auto; width: 8rem;", Name: "addButton",
                            Childs: [{ Type: "text", TextValue: !!action.ActionID ? RVDic.Save : RVDic.Add }]
                        }]
                    }
                ]
            }], container);

            if (action.ActionType) {
                elems["actionSelect"].selectedIndex = Array.from(elems["actionSelect"]).findIndex(o => o.value == action.ActionType);
                jQuery(elems["actionSelect"]).change();
            }

            var adding = false;

            elems["addButton"].onclick = function () {
                if (adding) return;

                var index = elems["actionSelect"].selectedIndex;
                var actionType = index < 0 ? null : elems["actionSelect"][index].value;

                var options = !(optionsObj || {}).get_data ? {} : optionsObj.get_data();

                if (options === false) return;
                else {
                    adding = true;
                    GlobalUtilities.block(container);
                }

                var apiName = !!action.ActionID ? "ModifyWorkFlowAction" : "AddWorkFlowAction";
                
                WFAPI[apiName]({
                    ActionID: action.ActionID, ConnectionID: that.Objects.Edge.ID, Action: actionType,
                    VariableType: options.VariableType, VariableName: Base64.encode(options.VariableName),
                    VariableDefaultValue: Base64.encode(options.VariableDefaultValue),
                    SaveToFormElementID: (options.SaveToFormElement || {}).ElementID,
                    SaveToFormElementTitle: (options.SaveToFormElement || {}).Title,
                    Formula: Base64.encode(options.Formula), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            that.Objects.Edge.Actions = that.Objects.Edge.Actions || [];

                            if (!!action.ActionID) {
                                that.Objects.Edge.Actions = (that.Objects.Edge.Actions || [])
                                    .map(a => a.ActionID == action.ActionID ? result.Action : a);
                            }
                            else that.Objects.Edge.Actions.push(result.Action);

                            if (op.Done) op.Done();
                            if (op.CloseModal) op.CloseModal();
                        }

                        adding = false;
                        GlobalUtilities.unblock(container);
                    }
                });
            };
        },

        show_actions: function (container, actions, options) {
            var that = this;

            that.get_workflow_variables(function (variables) {
                (actions || []).forEach(ac => that.show_action(container, ac, variables, options));
            });
        },

        show_action: function (container, action, variables, options) {
            var that = this;
            action = action || {};
            options = options || {};

            var isVariable = action.ActionType == "SetVariable";
            var hasFormula = (action.ActionType == "SetScore") || (action.VariableType == "Formula");
            var hasNumberValue = (action.ActionType == "SetVariable") && (action.VariableType == "Number")

            var create_item = function (data) {
                return {
                    Type: "div", Class: "small-12 medium-6 large-4", Style: "padding: 0.5rem;",
                    Childs: [{
                        Type: "div", Class: "rv-border-radius-half",
                        Style: "background-color:white; outline: 1px solid rgb(240, 240, 240);" +
                            "padding: 0.5rem; height: 100%; text-align: center;",
                        Childs: [
                            {
                                Type: "div",
                                Style: "font-style: italic; font-size: 0.7rem; color: rgb(100, 100, 100);",
                                Childs: [{ Type: "text", TextValue: data.label }]
                            },
                            {
                                Type: "div",
                                Childs: [{ Type: "text", TextValue: data.value }]
                            }
                        ]
                    }]
                };
            };
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "SoftBackgroundColor rv-border-radius-half", Name: "container",
                Style: "padding: 0.5rem; margin-bottom: 0.5rem; border-inline-start: 2px solid var(--rv-color-warm);" +
                    "display: flex; flex-flow: row;",
                Childs: [
                    {
                        Type: "div", Style: "flex: 1 1 auto;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin: 0;",
                                Childs: [
                                    create_item({
                                        label: RVDic.Action,
                                        value: RVDic.WF.Actions[action.ActionType]
                                    }),
                                    (!isVariable ? null : create_item({
                                        label: RVDic.VariableType,
                                        value: RVDic.WF.VariableTypes[action.VariableType]
                                    })),
                                    (!isVariable ? null : create_item({
                                        label: RVDic.VariableName,
                                        value: Base64.decode(action.VariableName)
                                    })),
                                    (!hasNumberValue ? null : create_item({
                                        label: RVDic.NumberValue,
                                        value: Base64.decode(action.VariableDefaultValue)
                                    }))
                                ]
                            },
                            (!hasFormula ? null : {
                                Type: "div",
                                Style: "display: flex; flex-flow: row; padding: 0.5rem; padding-bottom: 0; padding-inline-end:0.3rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "flex: 0 0 auto; width: 6rem; color: rgb(100, 100, 100);",
                                        Childs: [{ Type: "text", TextValue: RVDic.Formula + ":" }]
                                    },
                                    {
                                        Type: "div", Name: "formula",
                                        Style: "flex: 1 1 auto; direction: ltr; text-align: left;"
                                    }
                                ]
                            })
                        ]
                    },
                    {
                        Type: "div", Style: "flex: 0 0 auto; display: flex; flex-flow: column; gap: 0.2rem;",
                        Childs: [
                            {
                                Type: "div", Class: "rv-icon-button rv-circle",
                                Style: "width: 1rem; text-align:center;", Name: "removeButton",
                                Childs: [{Type: "i", Class: "fa fa-times"}]
                            },
                            {
                                Type: "div", Class: "rv-icon-button rv-circle",
                                Style: "width: 1rem; text-align:center;", Name: "editButton",
                                Childs: [{ Type: "i", Class: "fa fa-pencil" }]
                            }
                        ]
                    }
                ]
            }], container);

            if (hasFormula) RVFormula.show_formula(elems["formula"], Base64.decode(action.Formula), {
                Variables: variables
            });

            elems["editButton"].onclick = function () {
                that.new_action_area(action, {
                    Variables: variables,
                    Done: function () {
                        if (options.OnEdit) options.OnEdit();
                    }
                });
            };

            var removing = false;

            elems["removeButton"].onclick = function () {
                if (removing) return;

                var message = isVariable ? RVDic.Confirms.RemoveWorkFlowVariable : RVDic.Confirms.RemoveWorkFlowAction;

                GlobalUtilities.confirm(message, (r) => {
                    if (!r) return;
                    else removing = true;

                    WFAPI.RemoveWorkFlowAction({
                        ActionID: action.ActionID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                that.Objects.Edge.Actions = (that.Objects.Edge.Actions || [])
                                    .filter(a => a.ActionID != action.ActionID);

                                jQuery(elems["container"]).animate({ height: "toggle" }, 500, () => {
                                    jQuery(elems["container"]).remove();
                                });
                            }

                            removing = false;
                        }
                    });
                });
            };
        },

        render_action_variable: function (container, action) {
            var that = this;
            action = action || {};

            var formulaObj = null;

            var handle_type_change = function (selectedType) {
                elems["valueContainer"].style.display = selectedType == "Number" ? "flex" : "none";

                if (selectedType == "Formula") {
                    elems["formulaContainer"].innerHTML = "";
                    elems["formulaContainer"].style.display = "flex";

                    var fDiv = GlobalUtilities.create_nested_elements([{
                        Type: "div", Name: "_div", Style: "width: 100%;",
                    }], elems["formulaContainer"])["_div"];
                    
                    formulaObj = that.render_formula_input(fDiv, {
                        IsVariable: true,
                        Formula: Base64.decode(action.Formula),
                        IgnoreVariableID: action.ActionID
                    });
                }
                else {
                    formulaObj = null;
                    elems["formulaContainer"].style.display = "none";
                }
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-9 large-6",
                    Style: "display: flex; flex-flow: row; align-items: center; justify-content: center;",
                    Childs: [
                        {
                            Type: "div", Style: "flex: 0 0 auto; width: 8rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.VariableType + ":" }]
                        },
                        {
                            Type: "div", Style: "flex: 1 1 auto;",
                            Childs: [{
                                Type: "select", Class: "rv-input", Name: "typeSelect",
                                Properties: [{
                                    Name: "onchange",
                                    Value: (e) => {
                                        var selectedType = action.VariableType = !e.target.selectedIndex ? null :
                                            jQuery(e.target[e.target.selectedIndex]).attr("data-value");
                                        handle_type_change(selectedType);
                                    }
                                }],
                                Childs: [{
                                    Type: "option", Childs: [{ Type: "text", TextValue: RVDic.Select + "..." }]
                                }].concat((that.Options.VariableTypes || []).map(itm => {
                                    return {
                                        Type: "option",
                                        Attributes: [{ Name: "data-value", Value: itm }],
                                        Childs: [{ Type: "text", TextValue: RVDic.WF.VariableTypes[itm] }]
                                    };
                                }))
                            }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-9 large-6",
                    Style: "display: flex; flex-flow: row; align-items: center; justify-content: center; margin-top: 0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex: 0 0 auto; width: 8rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.VariableName + ":" }]
                        },
                        {
                            Type: "div", Style: "flex: 1 1 auto;",
                            Childs: [{ Type: "input", Class: "rv-input", Name: "nameInput", Style: "width: 100%;" }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-9 large-6", Name: "valueContainer",
                    Style: "display: none; flex-flow: row; align-items: center; justify-content: center; margin-top: 0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "flex: 0 0 auto; width: 8rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.NumberValue + ":" }]
                        },
                        {
                            Type: "div", Style: "flex: 1 1 auto;",
                            Childs: [{ Type: "number", Class: "rv-input", Name: "valueInput", Style: "width: 100%;" }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "formulaContainer",
                    Style: "display: none; margin-top: 0.5rem;"
                }
            ], container);
            
            if (action.VariableType) {
                elems["typeSelect"].selectedIndex = Array.from(elems["typeSelect"])
                    .findIndex(o => jQuery(o).attr("data-value") == action.VariableType);
                jQuery(elems["typeSelect"]).change();
            }

            if (action.VariableName)
                elems["nameInput"].value = Base64.decode(action.VariableName);

            if (action.VariableDefaultValue)
                elems["valueInput"].value = Base64.decode(action.VariableDefaultValue);
            
            return {
                get_data: function () {
                    var index = elems["typeSelect"].selectedIndex;
                    var type = index < 0 ? null : jQuery(elems["typeSelect"][index]).attr("data-value");

                    var name = elems["nameInput"].value.trim();
                    var numberValue = type == "Number" ? elems["valueInput"].value.trim() : "";

                    var formula = formulaObj ? formulaObj.get_data() : null;
                    if (formula) formula = formula.Formula;

                    if (formula === false) return false;

                    return !type || !name || ((type == "Number") && (!numberValue.length || isNaN(+numberValue))) ?
                        false : {
                            VariableType: type,
                            VariableName: name,
                            VariableDefaultValue: type == "Number" ? String(+ numberValue) : undefined,
                            Formula: !formula ? undefined : formula
                        };
                }
            };
        },

        render_formula_input: function (container, options) {
            var that = this;
            options = options || {};
            var formulaObj = null;

            var ignoreVariableId = options.IgnoreVariableID;
            var variableMode = options.IsVariable;

            container.innerHTML = "";

            GlobalUtilities.loading(container);

            that.get_workflow_variables(function (variables) {
                container.innerHTML = "";
                
                var _div = GlobalUtilities.create_nested_elements([{
                    Type: "div", Style: "display: flex; flex-flow: row; align-items: center;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "flex: 0 0 auto;" + (variableMode ? "width: 8rem;" : "padding-inline-end: 1rem;"),
                            Childs: [{ Type: "text", TextValue: RVDic.Formula + ":" }]
                        },
                        {
                            Type: "div", Style: "flex: 1 1 auto; direction: ltr; text-align: left;",
                            Childs: [{ Type: "div", Name: "_div" }]
                        }
                    ]
                }], container)["_div"];

                formulaObj = new RVFormula(_div, { Formula: options.Formula, Variables: variables });
            }, ignoreVariableId);

            return {
                get_data: function () {
                    var formula = !formulaObj ? false : formulaObj.get_formula();

                    return !formula || !(formula || []).length ? false : {
                        Formula: formula.join(" ")
                    };
                }
            };
        },

        render_action_number_form_field: function (container, options) {
            var that = this;

            var retObj = null;

            GlobalUtilities.load_files(["API/FGAPI.js"], {
                OnLoad: () => retObj = that._render_action_number_form_field(container, options)
            });

            return {
                get_data: () => !retObj ? false : retObj.get_data()
            };
        },

        render_action_text_form_field: function (container, options) {
            var that = this;

            var retObj = null;

            GlobalUtilities.load_files(["API/FGAPI.js"], {
                OnLoad: () => retObj = that._render_action_text_form_field(container, options)
            });

            return {
                get_data: () => !retObj ? false : retObj.get_data()
            };
        },

        _render_action_number_form_field: function (container, options) {
            var that = this;
            options = options || {};

            container.innerHTML = "";

            var elementId = (options.SaveToFormElement || {}).ElementID;
            var elementTitle = (options.SaveToFormElement || {}).Title;

            var setFormField = (element) => {
                elementId = element.ElementID;
                elementTitle = element.Title;

                elems["formField"].innerHTML = "";

                GlobalUtilities.create_nested_elements([{
                    Type: "text", TextValue: Base64.decode(element.Title)
                }], elems["formField"]);
            };

            var handleFormFieldClick = () =>
                that.select_field_of_form(false, (element => setFormField(element)));

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "display: flex; flex-flow: row; padding: 1rem 0;",
                    Childs: [
                        {
                            Type: "div", Style: "flex: 0 0 auto; width: 3.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Field + ":" }]
                        },
                        {
                            Type: "div", Style: "flex: 1 1 auto; cursor: pointer;", Name: "formField",
                            Properties: [{ Name: "onclick", Value: handleFormFieldClick }],
                            Childs: [{ Type: "text", TextValue: RVDic.Select }]
                        }
                    ]
                },
                { Type: "div", Name: "formula" }
            ], container);

            if (options.SaveToFormElement) setFormField(options.SaveToFormElement);

            var formulaObj = that.render_formula_input(elems["formula"], options);

            return {
                get_data: function () {
                    var formula = formulaObj.get_data();

                    return (formula === false) || !elementId ? false : {
                        Formula: formula.Formula,
                        SaveToFormElement: {
                            ElementID: elementId,
                            Title: elementTitle
                        }
                    };
                }
            };
        },

        _render_action_text_form_field: function (container, options) {
            var that = this;
            options = options || {};

            container.innerHTML = "";

            var elementId = (options.SaveToFormElement || {}).ElementID;
            var elementTitle = (options.SaveToFormElement || {}).Title;

            var setFormField = (element) => {
                elementId = element.ElementID;
                elementTitle = element.Title;

                elems["formField"].innerHTML = "";

                GlobalUtilities.create_nested_elements([{
                    Type: "text", TextValue: Base64.decode(element.Title)
                }], elems["formField"]);
            };

            var handleFormFieldClick = () =>
                that.select_field_of_form(true, (element => setFormField(element)));

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "display: flex; flex-flow: row; padding: 1rem 0;",
                    Childs: [
                        {
                            Type: "div", Style: "flex: 0 0 auto; width: 3.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Field + ":" }]
                        },
                        {
                            Type: "div", Style: "flex: 1 1 auto; cursor: pointer;", Name: "formField",
                            Properties: [{ Name: "onclick", Value: handleFormFieldClick }],
                            Childs: [{ Type: "text", TextValue: RVDic.Select }]
                        }
                    ]
                },
                {
                    Type: "div", Style: "display: flex; flex-flow: row;",
                    Childs: [
                        {
                            Type: "div", Style: "flex: 0 0 auto; width: 3.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Text + ":" }]
                        },
                        {
                            Type: "div", Style: "flex: 1 1 auto; cursor: pointer;",
                            Childs: [{ Type: "input", Class: "rv-input", Style: "width: 100%;", Name: "textInput" }]
                        }
                    ]
                }
            ], container);

            if (options.SaveToFormElement) setFormField(options.SaveToFormElement);

            if (options.VariableDefaultValue) elems["textInput"].value = options.VariableDefaultValue;

            return {
                get_data: function () {
                    return !elementId ? false : {
                        VariableDefaultValue: elems["textInput"].value.trim(),
                        SaveToFormElement: {
                            ElementID: elementId,
                            Title: elementTitle
                        }
                    };
                }
            };
        },

        select_field_of_form: function (textOnly, onSelect) {
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin: 0 auto; padding: 1rem;", Name: "container",
                Childs: [
                    { Type: "div", Name: "formSelect" },
                    {
                        Type: "div", Name: "elements",
                        Style: "display: flex; flex-flow:column; gap: 0.5rem; padding-top: 1rem;"
                    }
                ]
            }]);

            var add_elements = (elements) => {
                GlobalUtilities.create_nested_elements(elements.map(elem => ({
                    Type: "div", Style: "padding: 0.5rem; cursor: pointer;",
                    Class: "rv-border-radius-quarter SoftShadow rv-bg-color-white-softer",
                    Properties: [{
                        Name: "onclick",
                        Value: () => {
                            showed.Close();
                            !!onSelect && onSelect(elem);
                        }
                    }],
                    Childs: [{ Type: "text", TextValue: Base64.decode(elem.Title) }]
                })), elems["elements"]);
            };

            var formSelect = GlobalUtilities.append_autosuggest(elems["formSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.Form + "...",
                AjaxDataSource: FGAPI.GetForms(),
                ResponseParser: responseText =>
                    (JSON.parse(responseText).Forms || []).map(f => [Base64.decode(f.Title), f.FormID]),
                OnSelect: () => {
                    var formId = formSelect.values[formSelect.selectedIndex];

                    elems["elements"].innerHTML = "";
                    GlobalUtilities.loading(elems["elements"]);

                    var types = (textOnly ? ["Text"] : ["Text", "Numeric"]).join(",");

                    FGAPI.GetFormElements({
                        FormID: formId, Type: types, ParseResults: true,
                        ResponseHandler: result => {
                            elems["elements"].innerHTML = "";
                            add_elements(result.Elements || []);
                        }
                    });
                }
            });

            var showed = GlobalUtilities.show(elems["container"]);
        },

        get_workflow_variables: function (callback, ignoreVariableId) {
            var that = this;

            callback = callback || function () { };

            WFAPI.GetWorkFlowVariables({
                WorkFlowID: that.Objects.WorkFlowID, ParseResults: true,
                ResponseHandler: function (result) {
                    callback(((result || {}).Variables || []).filter(v => v.ActionID != ignoreVariableId).map(v => ({
                        ID: v.ActionID,
                        Name: v.ActionID,
                        Label: Base64.decode(v.VariableName)
                    })));
                }
            });
        }
    }
})();