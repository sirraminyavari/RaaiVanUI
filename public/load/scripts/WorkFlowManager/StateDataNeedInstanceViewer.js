(function () {
    if (window.StateDataNeedInstanceViewer) return;

    window.StateDataNeedInstanceViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;
        params = params || {};

        this.ShowFormArea = null;

        this.Objects = {
            InstanceID: params.InstanceID,
            AttachmentID: null,
            Filled: false,
            Form: null,
            FormViewer: null
        };

        this.Options = {
            OnFill: params.OnFill
        };

        this._initialize();
    };

    StateDataNeedInstanceViewer.prototype = {
        _initialize: function () {
            var that = this;

            GlobalUtilities.load_files([
                { Root: "API/", Childs: ["WFAPI", "FGAPI", "DocsAPI"], Ext: "js" },
                "MediaManager/MediaManager.js", "FormsManager/FormViewer.js"], {
                OnLoad: function () {
                    WFAPI.GetStateDataNeedInstance({
                        InstanceID: that.Objects.InstanceID, ParseResults: true,
                        ResponseHandler: function (result) { that.create_interface(result); }
                    });
                }
            });
        },

        create_interface: function (params) {
            params = params || {};
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var instanceId = params.InstanceID;
            var filled = params.Filled === true;
            var fillingDate = params.FillingDate;
            var nodeId = params.NodeID;
            var nodeName = Base64.decode(params.NodeName);
            var nodeType = Base64.decode(params.NodeType);
            var description = Base64.decode(params.Description);
            var form = params.Form || {};
            var attachmentId = params.AttachmentID;
            var attachedFiles = params.PreAttachedFiles || [];
            var attachments = params.Attachments || [];
            var necessary = params.Necessary === true;

            this.Objects.AttachmentID = attachmentId;
            this.Objects.Filled = filled;
            this.Objects.Form = form;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "SoftBackgroundColor", Style: "padding:4px; font-size:x-small; margin-bottom:10px;",
                    Childs: [
                        { Type: "div", Style: "text-align:justify; text-indent:12px; margin-bottom:8px;", Name: "descriptionArea" },
                        {
                            Type: "div", Style: "margin-bottom:10px;",
                            Childs: [
                                {
                                    Type: "div", Style: "font-weight:bold; float:right; margin-left:5px;",
                                    Childs: [{ Type: "text", TextValue: "موضوع مرتبط:" }]
                                },
                                {
                                    Type: "div", Style: "cursor:pointer; float:right;",
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                                        { Name: "onmouseout", Value: function () { this.style.color = "black"; } },
                                        { Name: "onclick", Value: function () { GlobalUtilities.goto_page(globalPageNode, { id: nodeId }); } }
                                    ],
                                    Childs: [{ Type: "text", TextValue: nodeName + " (" + nodeType + ")" }]
                                },
                                { Type: "div", Style: "clear:both;" }
                            ]
                        },
                        {
                            Type: "div", Style: "margin-bottom:10px; display:" + (attachedFiles.length > 0 ? "block" : "none") + ";",
                            Childs: [
                                {
                                    Type: "div", Style: "font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: "فایل های ارسال شده برای شما:" }]
                                },
                                { Type: "div", Name: "preAttachedFilesArea" }
                            ]
                        },
                        { Type: "div", Name: "formArea" },
                        { Type: "div", Name: "attachmentArea" },
                        {
                            Type: "div", Style: "text-align:center; cursor:pointer; font-weight:bold; font-size:small; margin-top:10px;",
                            Name: "actionArea"
                        }
                    ]
                },
                { Type: "div", Name: "showFormArea" }
            ], this.ContainerDiv);

            var preFilesArea = elems["preAttachedFilesArea"];

            var _create_att_area = function (att) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "cursor:pointer; font-size:small; color:green; margin:4px;",
                        Properties: [
                            { Name: "onmouseover", Value: function () { this.style.fontWeight = "bold"; } },
                            { Name: "onmouseout", Value: function () { this.style.fontWeight = "normal"; } },
                            { Name: "onclick", Value: function () { window.open(DocsAPI.GetDownloadLink({ FileID: att.FileID })); } }
                        ],
                        Childs: [
                            {
                                Type: "text",
                                TextValue: Base64.decode(att.FileName) + (!att.Extension ? "" : "." + Base64.decode(att.Extension))
                            }
                        ]
                    }
                ], preFilesArea);
            }

            for (var i = 0, lnt = attachedFiles.length; i < lnt; ++i) _create_att_area(attachedFiles[i]);

            var actionArea = elems["actionArea"];
            this.ShowFormArea = elems["showFormArea"];

            actionArea.innerHTML = filled ? "" : "تایید";

            GlobalUtilities.append_markup_text(elems["descriptionArea"], description);

            if (form.InstanceID != "") this.create_form_area(elems["formArea"], form);
            this.create_attachments_area(elems["attachmentArea"], attachments);

            actionArea.onclick = function () {
                if (params.Filled === true || actionArea.__Processing) return;

                GlobalUtilities.confirm("در صورت تایید، این صفحه قابل ویرایش نخواهد بود. آیا مایلید ادامه دهید؟", function (result) {
                    if (!result) return;

                    actionArea.__Processing = true;

                    WFAPI.SetStateDataNeedInstanceAsFilled({
                        InstanceID: instanceId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Filled = true;
                                if (that.Objects.FormViewer) that.Objects.FormViewer.set_as_filled();
                                actionArea.innerHTML = "";
                            }

                            actionArea.__Processing = false;
                        }
                    });
                });
            }
        },

        show_form: function (params) {
            params = params || {};

            var that = this;

            var instanceId = params.InstanceID || "";
            var formArea = this.ShowFormArea;

            if (this.Objects.FormViewer) {
                GlobalUtilities.scroll_into_view(formArea);
                return;
            }

            var descriptionArea = params.DescriptionArea;
            var actionArea = params.ActionArea;

            var on_fill = function () {
                that.Objects.Form.Filled = true;
                descriptionArea.innerHTML = "تکمیل شده در تاریخ" + " (" + (that.Objects.Form.FillingDate || "") + ") ";
                actionArea.innerHTML = "به بازبینی نیاز دارد";

                if (that.Options.OnFill) that.Options.OnFill();
            };

            var on_unfill = function () {
                that.Objects.Form.Filled = false;
                descriptionArea.innerHTML = "تکمیل نشده";
                actionArea.innerHTML = "";
            };

            if (!this.Objects.FormViewer) {
                this.Objects.FormViewer = new FormViewer(formArea, {
                    InstanceID: instanceId, OnFill: on_fill, OnUnfill: on_unfill, FillButton: false, CloseOnFill: false
                });
            }

            GlobalUtilities.scroll_into_view(formArea);
        },

        create_form_area: function (_div, form) {
            form = form || {};

            var that = this;

            var formId = form.FormID;
            var instanceId = form.InstanceID;
            var title = Base64.decode(form.Title);
            var filled = form.Filled === true;
            var fillingDate = form.FillingDate;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "float:right; font-weight:bold; margin-left:5px;",
                            Childs: [{ Type: "text", TextValue: "فرم مرتبط:" }]
                        },
                        {
                            Type: "div", Style: "float:right;", Name: "formTitle",
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.color = "blue"; } },
                                { Name: "onmouseout", Value: function () { this.style.color = "black"; } }
                            ],
                            Childs: [{ Type: "text", TextValue: title }]
                        },
                        { Type: "div", Style: "float:right; margin-right:15px; color:green", Name: "descriptionArea" },
                        {
                            Type: "div", Style: "float:right; color:blue; margin-right:15px; cursor:pointer;", Name: "actionArea",
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.color = "red"; } },
                                { Name: "onmouseout", Value: function () { this.style.color = "blue"; } }
                            ]
                        },
                        { Type: "div", Style: "clear:both;" }
                    ]
                }
            ], _div);

            var descriptionArea = elems["descriptionArea"];
            var actionArea = elems["actionArea"];

            descriptionArea.innerHTML = filled ? "تکمیل شده در تاریخ" + " (" + fillingDate + ") " : "تکمیل نشده";
            actionArea.innerHTML = filled ? "به بازبینی نیاز دارد" : "";

            var _show_form = function () {
                that.show_form({ InstanceID: instanceId, DescriptionArea: descriptionArea, ActionArea: actionArea });
            };

            elems["formTitle"].onclick = _show_form;
            _show_form();

            actionArea.onclick = function () {
                if (form.Filled !== true) return that.show_form({ InstanceID: instanceId });

                if (actionArea.__Processing) return;
                if (that.Objects.Filled === true) return alert("محتوای این صفحه تایید شده است");

                GlobalUtilities.confirm("در صورت ادامه، فرم از حالت تکمیل شده، خارج می شود. آیا مایلید ادامه دهید؟", function (result) {
                    if (!result) return;

                    actionArea.__Processing = true;

                    FGAPI.SetFormInstanceAsNotFilled({
                        InstanceID: instanceId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErroText] || result.ErrorText);
                                actionArea.__Processing = false;
                                return;
                            }

                            actionArea.__Processing = false;

                            form.Filled = false;
                            descriptionArea.innerHTML = "تکمیل نشده";

                            if (that.Objects.FormViewer) that.Objects.FormViewer.set_as_not_filled();
                        }
                    });
                });
            } //end of actionArea.onclick
        },

        create_attachments_area: function (container, attachments) {
            var that = this;
            attachments = attachments || [];

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
                _attachedFile.FileName = Base64.decode(_attachedFile.FileName);
                _attachedFile.DownloadLink = DocsAPI.GetDownloadLink({ FileID: _attachedFile.FileID });
                _attachedFile.Extension = Base64.decode(_attachedFile.Extension);
                return _attachedFile;
            };

            for (var i = 0, lnt = attachments.length; i < lnt; ++i)
                attachments[i] = _clarify(attachments[i]);

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

            mediaManager.add_items(attachments, mediaManagerParams);

            var uploader = null;

            var _uploadParams = {
                UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: that.Objects.AttachmentID, OwnerType: "WorkFlow" }),
                Removable: true,
                OnUpload: function (file, jsonResponse) {
                    var attachedFile = jsonResponse.AttachedFile;
                    if (attachedFile) mediaManager.add_item(_clarify(attachedFile), mediaManagerParams);
                    uploader.remove(file);
                },
                OnRemove: function (p) { }
            }

            GlobalUtilities.uploader(elems["uploadArea"], _uploadParams, function (au) { uploader = au; });
        }
    };
})();