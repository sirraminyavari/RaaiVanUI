(function () {
    if (window.CNImportFromXML) return;

    window.CNImportFromXML = function (container, params) {
        this.ContainerDiv = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.ContainerDiv) return;

        this.Interface = {
            AttachFileCheckbox: null,
            Items: null
        };

        this.Objects = {
            NodeTypeID: params.NodeTypeID,
            SelectedMap: null,
            Uploader: null,
            MapVariableName: "ImportMap"
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Childs: ["RVAPI", "CNAPI", "FGAPI", "DocsAPI"], Ext: "js" }], {
            OnLoad: function () { that._preinit(); }
        });
    }

    CNImportFromXML.prototype = {
        _preinit: function () {
            var that = this;

            var no_form_response = function () {
                that.ContainerDiv.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:center; font-weight:bold; color:gray; font-size:1rem; padding:2rem 0;",
                        Childs: [{ Type: "text", TextValue: RVDic.CN.XMLImportFormDataCannotBeFound }]
                    }
                ], that.ContainerDiv);
            };

            FGAPI.GetOwnerForm({
                OwnerID: that.Objects.NodeTypeID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (!result.FormID) return no_form_response();

                    CNAPI.HasExtension({
                        OwnerID: that.Objects.NodeTypeID, Extension: "Form", ParseResults: true,
                        ResponseHandler: function (value) {
                            if (value !== true) return no_form_response();

                            RVAPI.GetOwnerVariables({
                                OwnerID: result.FormID, Name: that.Objects.MapVariableName, ParseResults: true,
                                ResponseHandler: function (data) {
                                    if (!(data.Variables || []).length) return no_form_response();

                                    that._initialize(data.Variables || []);
                                }
                            });
                        }
                    });
                }
            });
        },

        _initialize: function (maps) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-title", Name: "mapsTitle",
                    Childs: [{ Type: "text", TextValue: RVDic.SelectOneOfTheMaps }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "checkboxArea", Style: "margin-bottom:0.5rem;",
                    Childs: [
                        { Type: "checkbox", Params: { Width: 18, Height: 18 }, Name: "chb" },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CN.AttachUploadedXMLFile }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "mapsArea", Style: "margin:0 0 1rem 0;" },
                {
                    Type: "div", Class: "small-10 medium-9 large-8", Name: "selectedMapArea",
                    Style: "margin:0 auto 1rem auto; text-align:center; display:none;"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "padding:0.3rem; margin-bottom:1rem; border-style:dashed; display:none;", Name: "uploadArea"
                },
                { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "queueArea" }
            ], that.ContainerDiv);

            that.Interface.AttachFileCheckbox = elems["chb"];
            that.Interface.Items = elems["queueArea"];

            var set_visibility = function () {
                var hasSelected = !!that.Objects.SelectedMap;

                jQuery(elems["mapsArea"])[hasSelected ? "fadeOut" : "fadeIn"](0);
                jQuery(elems["mapsTitle"])[hasSelected ? "fadeOut" : "fadeIn"](0);
                jQuery(elems["checkboxArea"])[hasSelected ? "fadeOut" : "fadeIn"](0);
                jQuery(elems["selectedMapArea"])[hasSelected ? "fadeIn" : "fadeOut"](0);
                jQuery(elems["uploadArea"])[hasSelected ? "fadeIn" : "fadeOut"](0);
            };

            jQuery.each(maps || [], function (ind, val) {
                var map = JSON.parse(Base64.decode(val.Value || "{}"));

                that.add_map(elems["mapsArea"], map, function () {
                    that.Objects.SelectedMap = map;
                    set_visibility();

                    that.set_selected_map(elems["selectedMapArea"], map, function () {
                        that.Objects.SelectedMap = null;
                        set_visibility();
                    });

                    that.process();
                });
            });

            GlobalUtilities.loading(elems["uploadArea"]);

            GlobalUtilities.uploader(elems["uploadArea"], {
                UploadDataSource: DocsAPI.GetUploadLink(),
                AcceptedFiles: [".xml"],
                OnUpload: function (file, jsonResponse) {
                    if (jsonResponse.AttachedFile) that.add_file(elems["queueArea"], jsonResponse.AttachedFile);
                    that.Objects.Uploader.remove(file);
                    that.process();
                }
            }, function (au) { that.Objects.Uploader = au; });

        },

        add_map: function (container, map, onSelect) {
            var that = this;

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 mediu-6 large-4", Style: "padding:0.3rem;",
                    Childs: [
                        {
                            Type: "div", Style: "height:100%; cursor:pointer; text-align:center; padding:0.5rem;",
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                            Properties: [{ Name: "onclick", Value: onSelect }],
                            Childs: [{ Type: "text", TextValue: Base64.decode(map.MapName) }]
                        }
                    ]
                }
            ], container);
        },

        set_selected_map: function (container, map, onRemove) {
            var that = this;

            container.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-white-button rv-border-radius-quarter TextAlign",
                    Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":2rem; cursor:default;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [{
                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                Attributes: [{ Name: "aria-hidden", Value: true }],
                                Properties: [{ Name: "onclick", Value: onRemove }]
                            }]
                        },
                        { Type: "text", TextValue: Base64.decode(map.MapName) },
                        (!that.Interface.AttachFileCheckbox.checked ? null : {
                            Type: "span", Style: "margin-" + RV_Float + ":0.5rem; color:rgb(100,100,100);",
                            Childs: [{ Type: "text", TextValue: "(" + RVDic.CN.AttachUploadedXMLFile + ")" }]
                        })
                    ]
                }
            ], container);
        },

        add_file: function (container, file) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container", Tooltip: Base64.decode(file.FileName),
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow", 
                    Style: "position:relative; padding:0.3rem 2rem; margin-top:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "remove", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { jQuery(elems["container"]).fadeOut(200, function () { this.remove(); }); }}]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Style: "display:none;", Name: "status",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "title",
                            Childs: [{ Type: "text", TextValue: Base64.decode(file.FileName) }]
                        }
                    ]
                }
            ], container);

            var set_data = function (data) {
                elems["title"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-link", Style: "display:inline-block;",
                        Properties: [{ Name: "onclick", Value: function () { window.open(RVAPI.NodePageURL({ NodeID: data.NodeID })); } }],
                        Childs: [{ Type: "text", TextValue: Base64.decode(data.Name) }]
                    },
                    (!data.AdditionalID ? null : {
                        Type: "div", Class: "rv-white-button rv-border-radius-quarter",
                        Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.6rem; padding:0.1rem 0.5rem;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(data.AdditionalID) }]
                    })
                ], elems["title"]);
            };

            var processed = false;

            elems["container"].FileObject = {
                Container: elems["container"],
                File: file,
                Processing: function () {
                    jQuery(elems["remove"]).fadeOut(0);
                    jQuery(elems["status"]).fadeIn(0);

                    elems["status"].setAttribute("class", "fa fa-spinner fa-lg fa-pulse");
                },
                Processed: function (result, data) {
                    processed = true;
                    if (result) set_data(data);

                    elems["status"].style.color = result ? "green" : "red";
                    elems["status"].setAttribute("class", result ? "fa fa-check-circle-o fa-lg" : "fa fa-times fa-lg");
                },
                HasProcessed: function () { return processed; }
            };
        },

        import_node: function (fileObject, map) {
            var that = this;

            if (that.__Processing) return;
            that.__Processing = true;

            fileObject.Processing();

            var fl = {
                FileID: fileObject.File.FileID,
                OwnerID: fileObject.File.OwnerID,
                OwnerType: fileObject.File.OwnerType,
                FileName: fileObject.File.FileName,
                Extension: fileObject.File.Extension,
                Size: fileObject.File.Size
            };
            
            CNAPI.XML2Node({
                NodeTypeID: that.Objects.NodeTypeID,
                Uploaded: Base64.encode(JSON.stringify(fl)),
                Map: Base64.encode(JSON.stringify(map)),
                AttachUploadedFile: that.Interface.AttachFileCheckbox.checked,
                ParseResults: true,
                ResponseHandler: function (result) {
                    that.__Processing = false;
                    fileObject.Processed(!!result.Succeed, result);
                    that.process();
                }
            });
        },

        process: function () {
            var that = this;

            if (!that.Objects.SelectedMap) return;

            var firstChild = that.Interface.Items.firstChild;
            while (firstChild) {
                if (firstChild.FileObject && !firstChild.FileObject.HasProcessed() &&
                    GlobalUtilities.is_visible(firstChild.FileObject.Container)) {
                    return that.import_node(firstChild.FileObject, that.Objects.SelectedMap);
                }
                firstChild = firstChild.nextSibling;
            }
        }
    };
})();