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
            GetStates: params.GetStates || function () { }
        };

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["WFAPI", "DocsAPI"] },
            { Root: "WorkFlowManager/", Ext: "js", Childs: ["NeededFormsManager", "AutoMessageManager"] },
            "MediaManager/MediaManager.js",
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
                                                            Childs: [{ Type: "text", TextValue: RVDic.Necessary }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypeSelect" }
                                    ]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea" }
                            ]
                        }
                    ]
                }
            ], container);

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

            var get_action = () => {
                return ((that.Objects.Edge || {}).Actions || []).length ? that.Objects.Edge.Actions[0] : null;
            };
            
            var elems = GlobalUtilities.create_nested_elements([
                {
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
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea",
                            Style: "display:none; flex-flow:row;", 
                            Childs: [
                                {
                                    Type: "div", Style: "flex:0 0 auto; width:3rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Action + ":" }]
                                },
                                {
                                    Type: "div", Style: "flex:0 0 auto;",
                                    Childs: [{
                                        Type: "select", Class: "rv-input", Name: "actionSelect",
                                        Childs: [{
                                            Type: "option", Childs: [{ Type: "text", TextValue: RVDic.Select + "..." }]
                                        }].concat(["Publish", "Unpublish"].map(itm => {
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
                        }
                    ]
                }
            ], container);
            console.log(elems["actionSelect"]);
            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];

            var _set_data = function () {
                var label = get_action();
                if (label) label = RVDic.WF.Actions[label];

                viewArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Action + ": " }]
                    },
                    {
                        Type: "div",
                        Style: "display:inline-block;" + (label ? "font-weight:bold;" : "color:rgb(100,100,100);"),
                        Childs: [{ Type: "text", TextValue: label || ("(" + RVDic.NotSet + ")") }]
                    }
                ], viewArea);
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "flex" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    GlobalUtilities.block(container);

                    var index = elems["actionSelect"].selectedIndex;
                    var action = index < 0 ? null : elems["actionSelect"][index].value;
                    
                    WFAPI.SetWorkFlowAction({
                        ConnectionID: that.Objects.Edge.ID, Action: action, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Edge.Actions = !action ? [] : [action];
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

            if (!get_action()) _on_edit();
            _set_data();
        },
    }
})();