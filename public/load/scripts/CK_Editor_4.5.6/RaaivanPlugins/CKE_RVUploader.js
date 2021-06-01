(function () {
    if (window.CKE_RVUploader) return;

    window.CKE_RVUploader = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);

        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID,
            Editor: params.Editor
        };

        this.Options = {
            Removable: !!params.Removable,
            OnUpload: params.OnUpload,
            OnRemove: params.OnRemove
        };

        var that = this;

        that._init(params);
    };

    CKE_RVUploader.prototype = {
        _init: function (params) {
            params = params || {};
            var that = this;

            var uploadButton = null;
            var uploadContainer = null;
            var uploadedFilesArea = null;
            var uploader = null;
            var popupMenu = null;
            var files = null;

            var _add_attached_files = function (attachedFiles) {
                if (!uploadedFilesArea) return;

                uploadedFilesArea.innerHTML = "";

                for (var i = 0; i < (attachedFiles || []).length; i++) {
                    if (!(attachedFiles[i] || {}).FileID) continue;
                    _create_uploaded_file(attachedFiles[i], !!attachedFiles[attachedFiles[i].FileID]);
                }

                if (uploader && (attachedFiles || []).length == 0) {
                    uploader.browse();
                    _hide();
                }
            };

            var _stick = function () {
                if (!uploadButton || !uploadContainer) return;

                if (popupMenu) popupMenu.Show();
                else popupMenu = GlobalUtilities.popup_menu(uploadButton, uploadContainer, { Align: "bottom" });

                popupMenu.Container.style.zIndex = GlobalUtilities.zindex.dialog();

                jQuery(uploadButton).removeClass("cke_button_off").addClass("cke_button_on");

                var attachedFiles = params.AttachedFiles;

                if (GlobalUtilities.get_type(attachedFiles) == "array")
                    _add_attached_files(attachedFiles);
                else if (GlobalUtilities.get_type(attachedFiles) == "function")
                    attachedFiles(function (arr) { _add_attached_files(arr); });
            };

            var _hide = function () {
                popupMenu.Hide();
                jQuery(uploadButton).removeClass("cke_button_on").addClass("cke_button_off");
            };

            var _insert_tag = function (tag) {
                if (!uploadedFilesArea) return;

                var _ext = tag.Info.Extension.toString().toLowerCase();

                if (_ext == 'jpg' || _ext == 'jpeg' || _ext == 'png' || _ext == 'gif') {
                    tag.Info = GlobalUtilities.extend({}, tag.Info);
                    //tag.Info = GlobalUtilities.extend({ H: 100, W: 100 }, tag.Info);

                    that.Objects.Editor.insertHtml('<img ' +
                        'style="max-width:100%;' + (tag.Info.W ? 'width:' + tag.Info.W + 'px;' : "") +
                            (tag.Info.H ? 'height:' + tag.Info.H + 'px;' : "") + '"' +
                        'data-RV_TagID="' + tag.ID + '"' +
                        'data-RV_TagType="' + tag.Type + '"' +
                        'data-RV_TagValue="' + tag.Value + '"' +
                        'data-RV_TagInfo="' + Base64.encode(JSON.stringify(tag.Info)) + '"' +
                        'src="' + DocsAPI.GetDownloadLink({ FileID: tag.ID || "" }) + '"/><span>&nbsp;</span>');
                }
                else {
                    that.Objects.Editor.insertHtml('<a data-RV_TagID="' + tag.ID + '"' +
                        'data-RV_TagType="' + tag.Type + '"' +
                        'data-RV_TagValue="' + tag.Value + '"' +
                        'data-RV_TagInfo="' + Base64.encode(JSON.stringify(tag.Info)) + '"' +
                        'href="' + AdvancedTextArea.get_url(tag) + '"' +
                    '>' + Base64.decode(tag.Value) + '</a><span>&nbsp;</span>');
                }

                _hide();
            };

            var _create_uploaded_file = function (file, exists) {
                if (!uploadedFilesArea) return;

                var extension = Base64.decode(file.Extension).toLowerCase();
                var fileName = Base64.decode(file.FileName);
                var trimedName = GlobalUtilities.trim2pix(fileName, 160, { Postfix: "..." });

                var fullname = trimedName + (extension ? "." + extension : "");

                var isImage = extension == "jpg" || extension == "png" || extension == "gif" || extension == "jpeg";
                var imageWidth = isImage ? 40 : 0;
                var imageUrl = !isImage ? "" : DocsAPI.GetDownloadLink({ FileID: file.FileID || "" });

                var removable = !exists && (that.Options.Removable || file.Removable);

                var item = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "mainDiv", Class: "NormalPadding SoftBorder BorderRadius3",
                        Style: "background-color:white; margin-top:4px;" +
                            "padding-" + window.RV_RevFloat + ":12px;" + (exists ? "" : "background-color:rgb(230, 230, 230);"),
                        Childs: [
                            {
                                Type: "div", Class: (isImage ? "RevFloat " : "") + "TextAlign",
                                Style: "width:" + (imageWidth + 4) + "px;",
                                Childs: !isImage ? null : [
                                    {
                                        Type: "img", Class: "BorderRadius3",
                                        Style: "width:" + imageWidth + "px; height:" + imageWidth + "px;",
                                        Attributes: [{ Name: "src", Value: imageUrl }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: (isImage ? "Float" : ""),
                                Childs: [
                                    {
                                        Type: "div", Tooltip: fileName == trimedName ? null : fileName,
                                        Style: "margin:0px 12px 4px 12px; direction:" + GlobalUtilities.textdirection(fileName),
                                        Childs: [{ Type: "text", TextValue: fullname }]
                                    },
                                    {
                                        Type: "div", Class: "Float ActionButton", Style: "width:40px;", Name: "insertButton",
                                        Childs: [{ Type: "text", TextValue: RVDic.Insert }]
                                    },
                                    {
                                        Type: "div", Class: "Float ActionButton", Name: "removeButton",
                                        Style: "width:40px; margin:0px 4px 0px 4px;" + (removable ? "" : "display:none;"),
                                        Childs: [{ Type: "text", TextValue: RVDic.Remove }]
                                    },
                                    { Type: "div", Style: "clear:both;" }
                                ]
                            },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    }
                ], uploadedFilesArea);

                var _insert = function () {
                    _insert_tag({
                        ID: file.FileID, Type: "File", Value: Base64.encode(fileName + "." + extension),
                        Info: { Extension: extension.toLowerCase() }
                    });
                }

                item["insertButton"].onclick = _insert;

                item["removeButton"].onclick = function () {
                    if (item["removeButton"].__Removing) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveFile, function (r) {
                        if (!r) return;

                        item["removeButton"].__Removing = true;

                        DocsAPI.RemoveFile({
                            FileID: file.FileID, OwnerID: that.Objects.OwnerID, ParseResults: true,
                            ResponseHandler: function (result) {
                                item["removeButton"].__Removing = false;
                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                if ((item["mainDiv"] || {}).parentNode) item["mainDiv"].parentNode.removeChild(item["mainDiv"]);
                                if (that.Options.OnRemove) that.Options.OnRemove(file);
                            }
                        });
                    });
                }

                return { Insert: _insert };
            };

            jQuery(that.Container).on('click', '.cke_button__rvuploader', function (event) {
                if (!uploadButton) uploadButton = this;
                
                if (uploadContainer) return !GlobalUtilities.is_visible(uploadContainer) ? _stick() : _hide();
                
                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "uploadDiv", Class: "NormalPadding", Style: "width:300px; padding-top:8px;",
                        Childs: [
                            {
                                Type: "div", Style: "border:dashed 1px gray;", Tooltip: RVDic.ClickToUploadFile,
                                Childs: [{ Type: "div", Name: "uploadArea" }]
                            },
                            { Type: "div", Name: "uploadedFiles", Style: "margin-top:4px; max-height:160px;" }
                        ]
                    }
                ]);
                
                uploadContainer = elems["uploadDiv"];
                uploadedFilesArea = GlobalUtilities.append_scrollbar(elems["uploadedFiles"]);
                var uploadArea = elems["uploadArea"];

                GlobalUtilities.loading(uploadArea);

                _stick();
                
                GlobalUtilities.load_files(["API/DocsAPI.js"], {
                    OnLoad: function () {
                        var _uploadParams = {
                            UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: params.OwnerID, OwnerType: params.OwnerType }),
                            Removable: true,
                            OnRemove: function (file) { uploader.remove(file); },
                            OnUpload: function (file, result) {
                                if (result.success) {
                                    _create_uploaded_file(result.AttachedFile).Insert();
                                    uploader.remove(file);
                                    if (that.Options.OnUpload) that.Options.OnUpload(result.AttachedFile);
                                }
                            },
                            OnFileAdd: function (file) { }
                        };

                        GlobalUtilities.uploader(uploadArea, _uploadParams, function (au) { _stick(uploader = au); });

                        jQuery(document).bind('click', function (event) {
                            if (!jQuery(event.target).closest(uploadContainer).length &&
                                !jQuery(event.target).closest(uploadButton).length && GlobalUtilities.is_visible(uploadContainer)) _hide();
                        });

                        that.Objects.Editor.document.on('click', function (e) { _hide(); });
                    }
                });
            });
        }
    }
})();