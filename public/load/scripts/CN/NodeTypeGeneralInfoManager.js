(function () {
    if (window.NodeTypeGeneralInfoManager) return;

    window.NodeTypeGeneralInfoManager = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            NodeType: params.NodeType || {},
            Files: params.PDFCovers || []
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js", "API/DocsAPI.js", "CN/IDPattern.js", "MediaManager/MediaManager.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    NodeTypeGeneralInfoManager.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "iconArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter", 
                    Style: "margin-top:1.5rem; background-color:white; padding:0.5rem;", Name: "additionalIdArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter",
                    Style: "margin-top:0.5rem; background-color:white; padding:0.5rem;", Name: "patternArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter",
                    Style: "margin-top:1.5rem; background-color:white; padding:0.5rem;", 
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:1rem; font-weight:500; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic.PDFCoverTemplates }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "pdfCoversArea" }
                    ]
                }
            ], that.Container);

            that.set_icon(elems["iconArea"]);
            that.set_additional_id(elems["additionalIdArea"]);
            that.set_additional_id_pattern(elems["patternArea"]);
            that.set_pdf_covers(elems["pdfCoversArea"]);
        },

        set_icon: function (container) {
            var that = this;

            GlobalUtilities.load_files(["API/DocsAPI.js"], {
                OnLoad: function () {
                    DocsAPI.Icon({
                        IconID: that.Objects.NodeType.NodeTypeID, Type: "icon", HighQuality: true, ParseResults: true,
                        ResponseHandler: function (result) {
                            GlobalUtilities.load_files(["Multimedia/IconSelect.js"], {
                                OnLoad: function () {
                                    var ic = new IconSelect(container, {
                                        ObjectID: that.Objects.NodeType.NodeTypeID, Editable: true,
                                        IconURL: result.IconURL, HighQualityIconURL: result.HighQualityIconURL,
                                        IconType: "icon", HighQualityIconType: "HighQualityIcon", DimensionsVariableName: "IconDimensions",
                                        ImageWidth: 84, ImageHeight: 84, SaveWidth: 100, SaveHeight: 100, AspectRatio: 1
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },

        set_additional_id: function (container) {
            var that = this;

            var nodeType = that.Objects.NodeType;
            var additionalId = Base64.decode(nodeType.AdditionalID);

            var editable = additionalId != "6"; //6: AdditionalID of Department NodeType

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":8rem; padding-" + RV_RevFloat + ":5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Code + ":" }]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:-0.05rem;" + RV_RevFloat + ":0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-air-button rv-circle", Name: "editButton",
                                    Style: "font-size:0.6rem; width:4rem;" + (editable ? "" : "display:none;"),
                                    Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                                    Childs: [{ Type: "text", TextValue: additionalId }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea",
                                    Style: "display:none;",
                                    Childs: [
                                        {
                                            Type: "input", Class: "rv-input", Name: "_input",
                                            Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.Code
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var input = _el["_input"];

            var _set_data = function () {
                viewArea.innerHTML = "<span style='color:gray;'>" +
                    GlobalUtilities.convert_numbers_to_persian((!additionalId ? RVDic.NotSet : additionalId)) + "</span>";
                input.value = !additionalId ? "" : additionalId;
            };

            var __Editing = false;

            var _on_edit = function () {
                var set_things = function () {
                    _set_data();
                    viewArea.style.display = __Editing ? "none" : "block";
                    editArea.style.display = __Editing ? "block" : "none";

                    _el["editButton"].innerHTML = __Editing ? RVDic.Save : RVDic.Edit;

                    if (__Editing) {
                        jQuery(input).focus();
                        jQuery(input).select();
                    }
                };

                if (__Editing === true) {
                    var newAddId = GlobalUtilities.trim(input.value);

                    GlobalUtilities.block(container);

                    CNAPI.SetNodeTypeAdditionalID({
                        NodeTypeID: nodeType.NodeTypeID, AdditionalID: Base64.encode(newAddId), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                additionalId = newAddId;

                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            }; //end of _on_edit

            if (editable) _el["editButton"].onclick = _on_edit;
            GlobalUtilities.set_onenter(input, _on_edit);
            _set_data();
        },

        set_additional_id_pattern: function (container) {
            var that = this;

            var nodeType = that.Objects.NodeType;
            var additionalIdPattern = nodeType.AdditionalIDPattern;

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":8rem; padding-" + RV_RevFloat + ":5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.AdditionalIDPattern + ":" }]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:-0.05rem;" + RV_RevFloat + ":0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-air-button rv-circle", Name: "editButton",
                                    Style: "font-size:0.6rem; width:4rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                                    Style: "direction:ltr; text-align:left;",
                                    Childs: [{ Type: "text", TextValue: additionalIdPattern }]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];

            var _set_data = function () {
                viewArea.innerHTML = "<span style='color:gray;'>" +
                    (additionalIdPattern == "" ? that.Objects.DefaultAdditionalIDPattern : additionalIdPattern) + "</span>";
            };

            _set_data();

            _el["editButton"].onclick = function () {
                new IDPattern({
                    NodeTypeID: nodeType.NodeTypeID, InitialValue: additionalIdPattern,
                    OnSave: function (d) {
                        if (d.Pattern && !CNAPI.TestAdditionalIDPattern(d.Pattern))
                            return alert(RVDic.Checks.PatternDoesntMatch);

                        CNAPI.SetAdditionalIDPattern({
                            NodeTypeID: nodeType.NodeTypeID, AdditionalIDPattern: d.Pattern, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else {
                                    additionalIdPattern = !d.Pattern ? that.Objects.DefaultAdditionalIDPattern : d.Pattern;
                                    hasDefaultPattern = !d.Pattern;

                                    _set_data();
                                }
                            }
                        });
                    }
                });
            };
        },

        set_pdf_covers: function (container) {
            var that = this;

            GlobalUtilities.loading(container);

            DocsAPI.GetPDFCovers({
                OwnerID: that.Objects.NodeType.NodeTypeID, ParseResults: true,
                ResponseHandler: function (result) {
                    that.Objects.Files = result.Files || [];
                    that._set_pdf_covers(container);
                }
            });
        },

        _set_pdf_covers: function (container) {
            var that = this;

            container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "uploadArea", Tooltip: RVDic.UploadFile,
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "padding:0.3rem; border-style:dashed; margin-bottom:0.5rem;"
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachedFiles" }
            ], container);

            var mediaManager = new MediaManager({
                ContainerDiv: elems["attachedFiles"], UnlimitedDownloadAccess: true, EnableFileRename: true
            });

            var _clarify = function (_attachedFile) {
                _attachedFile.FileName = Base64.decode(_attachedFile.FileName);
                _attachedFile.DownloadLink = DocsAPI.GetDownloadLink({ FileID: _attachedFile.FileID });
                _attachedFile.Extension = Base64.decode(_attachedFile.Extension);
                return _attachedFile;
            };

            that.Objects.Files = (that.Objects.Files || []).map(function (f) { return _clarify(f); }) || [];

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

            mediaManager.add_items(that.Objects.Files, mediaManagerParams);

            var uploader = null;

            GlobalUtilities.uploader(elems["uploadArea"], {
                UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: that.Objects.NodeType.NodeTypeID, OwnerType: "PDFCover" }),
                Removable: true,
                AcceptedFiles: [".pdf"],
                OnUpload: function (file, jsonResponse) {
                    var attachedFile = jsonResponse.AttachedFile;
                    if (attachedFile) mediaManager.add_item(_clarify(attachedFile), mediaManagerParams);
                    uploader.remove(file);
                },
                OnRemove: function (p) { }
            }, function (au) { uploader = au; });
        }
    };
})();