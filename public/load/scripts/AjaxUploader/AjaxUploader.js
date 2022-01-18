(function () {
    if (window.AjaxUploader) return;

    window.AjaxUploader = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!containerDiv) return;
        params = params || {};

        this.Interface = {
            UploadArea: null
        };

        this.Objects = {
            Dropzone: null,
            Files: [],
            OnGoingUploads: []
        };

        this.Options = {
            UploadDataSource: params.UploadDataSource,
            MinWidth: params.MinWidth,
            MinHeight: params.MinHeight,
            Width: params.Width,
            Height: params.Height,
            Removable: params.Removable === true,
            MaxSize: params.MaxSize,
            TotalSize: params.TotalSize,
            MaxCount: params.MaxCount,
            AcceptedFiles: params.AcceptedFiles,
            OnFileAccept: params.OnFileAccept,
            OnFileAdd: params.OnFileAdd,
            OnUpload: params.OnUpload,
            OnRemove: params.OnRemove,
            InnerDiv: params.InnerDiv
        };
        
        this._initialize();
    }

    AjaxUploader.prototype = {
        _has_file_in_upload_area: function () {
            var that = this;
            var firstChild = (that.Interface.UploadArea || {}).firstChild;
            while (firstChild) {
                if (firstChild.IsFile) return true;
                firstChild = firstChild.nextSibling;
            }
            return false;
        },

        _set_inner: function () {
            var that = this;

            if (!that.__InnerDiv) {
                var strExts = "";
                if ((that.Options.AcceptedFiles || []).length) {
                    var arr = [];
                    jQuery.each(that.Options.AcceptedFiles, function (ind, val) {
                        arr.push(val[0] == '.' ? val.substr(1) : val);
                    });
                    strExts = " (" + arr.join(", ") + ")";
                }

                var strMeta = "";

                if (!isNaN(+that.Options.MaxSize) && (Math.floor(+that.Options.MaxSize) > 0))
                    strMeta += RVDic.MaxFileSize + " (MB): " + Math.floor(+that.Options.MaxSize);
                if (!isNaN(+that.Options.TotalSize) && (Math.floor(+that.Options.TotalSize) > 0))
                    strMeta += (strMeta ? " - " : "") + RVDic.MaxUploadSize + " (MB): " + Math.floor(+that.Options.TotalSize);
                if (!isNaN(+that.Options.MaxCount) && (Math.floor(+that.Options.MaxCount) > 0))
                    strMeta += (strMeta ? " - " : "") + RVDic.MaxCount + ": " + Math.floor(+that.Options.MaxCount);
                if (strMeta) strMeta = "<span style='color:rgb(150, 150, 150); margin-" + RV_Float + ":0.3rem;'>" +
                    GlobalUtilities.convert_numbers_to_persian(strMeta) + "</span>";
                
                if (that.Options.InnerDiv)
                    that.__InnerDiv = that.Options.InnerDiv;
                else {
                    that.__InnerDiv = GlobalUtilities.create_nested_elements([
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div", Style: "text-align:center;" }
                    ])["_div"];

                    that.__InnerDiv.innerHTML =
                        "<div style='display:inline-block;'>" + RVDic.UploadFile + "</div>" + strExts + strMeta;
                }

                that.__InnerDiv.onclick = function () { that.browse(); }
            }

            if (!that.__InnerDiv.parentNode) that.Interface.UploadArea.appendChild(that.__InnerDiv);

            var hasFile = that._has_file_in_upload_area();

            if (!that.Options.InnerDiv) {
                that.__InnerDiv.style.fontSize = hasFile ? "0.7rem" : "0.8rem";
                that.__InnerDiv.style.marginBottom = hasFile ? "0.5rem" : "0rem";
                that.__InnerDiv.style.fontWeight = hasFile ? "normal" : "bold";
                that.__InnerDiv.setAttribute("class", hasFile ? "rv-air-button rv-circle" : "rv-icon-button");
            }
        },

        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var uploadContainer = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "rv-border-radius-quarter", Name: "uploadContainer",
                Style: "font-size:0.7rem; border-style:dashed; border-color:transparent; padding:0.3rem; cursor:pointer;" +
                    (that.Options.MinWidth > 0 ? "min-width:" + that.Options.MinWidth + "px;" : "") +
                    (that.Options.MinHeight > 0 ? "min-height:" + that.Options.MinHeight + "px;" : "") +
                    (that.Options.Width > 0 ? "width:" + that.Options.Width + "px;" : "") +
                    (that.Options.Height > 0 ? "height:" + that.Options.Height + "px;" : "") // +
                //"background-image:url('../../images/DragDrop.png'); background-repeat:no-repeat; background-position:center;"
            }], that.ContainerDiv)["uploadContainer"];

            that.Interface.UploadArea = uploadContainer;

            that._set_inner();
            
            var dpz = that.Objects.Dropzone = new Dropzone(uploadContainer, {
                url: that.Options.UploadDataSource,
                parallelUploads: 1, maxFileSize: 3000 /* MB */,
                thumbnailWidth: 20, thumbnailHeight: 20, maxFiles: 1000,
                //acceptedFiles: ["image", "application/pdf", ".psd"],
                acceptedFiles: that.Options.AcceptedFiles,
                autoProcessQueue: true, createImageThumbnails: false,
                dictInvalidFileType: RVDic.MSG.ThisFileTypeIsNotAllowed,
                accept: function (file, done) {
                    if (file.__LastCheckMessage) return done(file.__LastCheckMessage.MSG);

                    var err = null;

                    if (((RVGlobal || {}).PotentiallyHarmfulFileExtensions || [])
                        .some(x => file.name.toLowerCase().endsWith("." + x))) {
                        err = RVDic.MSG.ThisFileTypeIsNotAllowed;
                    }
                    else if ((GlobalUtilities.get_type(that.Options.MaxSize) == "number") &&
                        (that.Options.MaxSize > 0) && (that.size(file) > that.Options.MaxSize)) {
                        err = RVDic.MSG.MaxAllowedFileSizeIsNMBs.replace("[n]", that.Options.MaxSize);
                    }
                    else if ((GlobalUtilities.get_type(that.Options.TotalSize) == "number") &&
                        (that.Options.TotalSize > 0) && (that.total_size() + that.size(file) > that.Options.TotalSize)) {
                        err = RVDic.MSG.MaxAllowedUploadSizeIsNMBs.replace("[n]", that.Options.TotalSize);
                    }
                    else if ((GlobalUtilities.get_type(that.Options.MaxCount) == "number") &&
                        (that.Options.MaxCount > 0) && (that.files_count() >= that.Options.MaxCount)) {
                        err = RVDic.MSG.MaxAllowedUploadableFilesIsN.replace("[n]", that.Options.MaxCount);
                    }

                    file.__LastCheckMessage = { MSG: err };

                    if (!err && that.Options.OnFileAccept) that.Options.OnFileAccept(file);

                    return err ? done(err) : done();
                },
                drop: function () {
                    uploadContainer.style.borderColor = "transparent";
                },
                dragenter: function () {
                    uploadContainer.style.borderColor = "gray";
                },
                dragover: function () {
                    uploadContainer.style.borderColor = "gray";
                },
                dragleave: function () {
                    uploadContainer.style.borderColor = "transparent";
                },
                uploadprogress: function (file, percentage, bytesSent) {
                    if ((file || {}).__ProgressBar) {
                        file.__ProgressBar.Percentage.style.width = percentage + "%";
                        file.__ProgressBar.PercentageLabel.innerHTML = GlobalUtilities.convert_numbers_to_persian(percentage.toFixed(0)) + "%";
                    }
                },
                addedfile: function (file) {
                    //Necessary!
                    file.previewElement = Dropzone.createElement(this.options.previewTemplate);
                    //end of Necessary!

                    //Check if Accepted
                    var isAccepted = true;
                    dpz.accept(file, function (err) { if (err) { isAccepted = false; alert(err, { Timeout: 15000 }); } });
                    if (!isAccepted) return;
                    //end of Check if Accepted

                    file.IsLocal = true;
                    
                    that.add(file, {
                        ProgressBar: true,
                        OnRemove: function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (file.status === Dropzone.UPLOADING) that.remove(file);
                            else if (that.Options.OnRemove) that.Options.OnRemove(file, file.UploadResponse, function () { that.remove(file); });
                        }
                    });

                    return this._updateMaxFilesReachedClass();
                },
                sending: function (file, xhr, formData) {
                    xhr.setRequestHeader("X-File-Name", "Encoded__" + Base64.encode(file.name));
                },
                complete: function (file) {
                    if ((file || {}).__ProgressBar) {
                        file.__ProgressBar.Container.parentNode.removeChild(file.__ProgressBar.Container);
                        file.__ProgressBar.PercentageLabel.parentNode.removeChild(file.__ProgressBar.PercentageLabel);
                    }
                },
                success: function (file, responseText, e) {
                    var result = GlobalUtilities.to_json(responseText) || {};

                    if (!result.AttachedFile) return file.error();

                    file.UploadResponse = result;
                    that.Objects.Files.push(file);
                    if (that.Options.OnUpload) that.Options.OnUpload(file, result);
                },
                thumbnail: function (obj, b64Image) { }
            });
        }, //end of '_initialize'

        browse: function () {
            this.Objects.Dropzone.browse();
        },

        size: function (file) {
            file = file || {};
            var size = (file.upload || {}).total || file.Size;
            return +size && (+size > 0) ? +size / 1024 / 1024 : 0;
        },

        total_size: function () {
            var that = this;
            var ts = 0;
            for (var i = 0; i < (that.Objects.Files || []).length; ++i)
                ts += that.size(that.Objects.Files[i]);
            return ts;
        },

        files_count: function () {
            var that = this;
            var count = (that.Objects.Files || []).length;
            for (var i = 0; i < (that.Objects.OnGoingUploads || []).length; ++i) {
                var exists = false;
                for (var x = 0; x < (that.Objects.Files || []).length; ++x)
                    if (that.Objects.OnGoingUploads[i] == that.Objects.Files[x]) exists = true;
                if (!exists)++count;
            }
            return count;
        },

        add: function (file, params) {
            var that = this;
            params = params || {};

            that.Objects.OnGoingUploads.push(file);

            var name = file.name;
            if (!name && file.FileName)
                name = Base64.decode(file.FileName) + (file.Extension ? "." + Base64.decode(file.Extension) : "");
            if (!name) name = file.FileID;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "item",
                Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                Style: "padding:0.3rem; border-width:0.1rem; margin-bottom:0.3rem; background-color:white; cursor:default;",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "position:relative; padding-" + RV_RevFloat + ":4rem;",
                        Childs: [
                            {
                                Type: "div",
                                Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;" +
                                    "width:1.5rem; text-align:center;" +
                                    "display:" + (that.Options.Removable ? "block" : "none") + ";",
                                Childs: [{
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                    Name: "removeButton", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }]
                            },
                            {
                                Type: "div", Name: "percentageLabel",
                                Style: "position:absolute; text-align:center; width:2rem; color:green; top:0rem;" +
                                    RV_RevFloat + ":" + (that.Options.Removable ? "1.5" : "0") + "rem;"
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 TextAlign",
                                Attributes: [{ Name: "title", Value: name }],
                                Childs: [{ Type: "text", TextValue: name }]
                            }
                        ]
                    },
                    {
                        Type: "div", Name: "progressArea",
                        Class: "small-12 medium-12 large-12 rv-circle WarmBorder",
                        Style: "padding:0.1rem; height:0.9rem; border-width:0.1rem; margin-top:0.3rem;" +
                            "direction:ltr; text-align:left;" + (params.ProgressBar ? "" : "display:none;"),
                        Childs: [{
                            Type: "span", Class: "rv-circle WarmBackgroundColor", Name: "percentage",
                            Style: "display:block; padding:0.1rem; height:100%; width:0%;"
                        }]
                    }
                ]
            }], that.Interface.UploadArea);

            elems["item"].IsFile = true;
            elems["item"].FileObject = file;

            file.__Container = elems["item"];

            file.__ProgressBar = {
                Container: elems["progressArea"],
                Percentage: elems["percentage"],
                PercentageLabel: elems["percentageLabel"]
            };

            file.error = function () {
                elems["item"].style.borderColor = "red";
                elems["item"].style.backgroundColor = "rgba(255,0,0,0.1)";
            };

            elems["removeButton"].addEventListener("click", function (e) {
                if (params.OnRemove) params.OnRemove(e);
                else that.remove(file);
            });

            if (that.Options.OnFileAdd) that.Options.OnFileAdd(file);

            that._set_inner();

            if (!file.IsLocal) that.Objects.Files.push(file);
        },

        remove: function (file) {
            if (!file) return;

            var newFiles = [];
            for (var i = 0, lnt = this.Objects.Files.length; i < lnt; ++i)
                if (this.Objects.Files[i] != file) newFiles.push(this.Objects.Files[i]);
            this.Objects.Files = newFiles;

            newFiles = [];
            for (var i = 0, lnt = (this.Objects.OnGoingUploads || []).length; i < lnt; ++i)
                if (this.Objects.OnGoingUploads[i] != file) newFiles.push(this.Objects.OnGoingUploads[i]);
            this.Objects.OnGoingUploads = newFiles;

            this.Objects.Dropzone.removeFile(file);
            file.__Container.parentNode.removeChild(file.__Container);
            this._set_inner();
        },

        clear: function () {
            while ((this.Objects.Files || []).length) {
                this.remove(this.Objects.Files[0]);
            }
        },

        get_file_json: function (file) {
            return {
                FileID: file.FileID,
                OwnerID: file.OwnerID,
                OwnerType: file.OwnerType,
                FileName: file.FileName,
                Extension: file.Extension,
                Size: file.Size
            };
        },

        get_items: function (standard) {
            var that = this;

            if (!standard) return that.Objects.Files;

            var ret = [];

            var _add = function (theFile) {
                var file = theFile.AttachedFile || theFile;

                ret.push(GlobalUtilities.extend({}, file, {
                    toString: function (delimiter) {
                        return JSON.stringify(that.get_file_json(file));
                    }
                }));
            };
            
            for (var i = 0; i < (that.Objects.Files || []).length; ++i) {
                if (!that.Objects.Files[i].UploadResponse) _add(that.Objects.Files[i]);
                else _add(that.Objects.Files[i].UploadResponse);
            }

            return ret;
        },

        get_items_string: function () {
            var that = this;

            var ret = (this.Objects.Files || []).map(function (val) {
                return that.get_file_json((val.UploadResponse || {}).AttachedFile || val);
            });

            return Base64.encode(JSON.stringify(ret));
        }
    }
})();