(function () {
    if (window.DataImportManager) return;

    window.DataImportManager = function (container) {
        var that = this;

        GlobalUtilities.load_files(["API/DocsAPI.js", "API/DIAPI.js"], {
            OnLoad: function () { that.initialize(container); }
        });
    };

    DataImportManager.prototype = {
        initialize: function (container) {
            var _create_template_container = function (fileName, title) {
                return {
                    Type: "div", Class: "small-12 medium-4 large-3", Style: "padding:0.2rem;",
                    Childs: [{
                        Type: "div", Style: "text-align:center; cursor:pointer;",
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-air-button rv-link",
                        Properties: [{ Name: "onclick", Value: function () { window.open(RVAPI.DataImportTemplateURL({ Name: fileName })); } }],
                        Childs: [{ Type: "text", TextValue: title }]
                    }]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center; font-weight:bold; margin-bottom:2rem;" +
                        "font-size:1.2rem; color:rgb(100,100,100);",
                    Childs: [
                        { Type: "text", TextValue: RVDic.XMLDataImport },
                        { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_dataimport" } }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "font-weight:bold; text-align:center; margin-bottom:0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.DI.TemplatesTitle }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center", Style: "margin:0rem;",
                    Childs: [
                        _create_template_container("users", RVDic.Users),
                        _create_template_container("nodes", RVDic.Nodes),
                        _create_template_container("node_ids", RVDic.ModifyNodeAdditionalIDs),
                        _create_template_container("remove_nodes", RVDic.RemoveNodes),
                        _create_template_container("members", RVDic.Members),
                        _create_template_container("experts", RVDic.Experts),
                        _create_template_container("relations", RVDic.RelatedNodes),
                        _create_template_container("authors", RVDic.IntellectualProperties),
                        _create_template_container("user_confidentialities", RVDic.UserConfidentialities),
                        _create_template_container("permissions", RVDic.Permissions)
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "font-weight:bold; text-align:center; margin-bottom:0.5rem; margin-top:3rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.DI.FileUploadTitle }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "padding:0.3rem; border-style:dashed;", Name: "uploadArea"
                },
                {
                    Type: "div", Class: "small-9 medium-6 large-3 rv-air-button rv-circle",
                    Style: "margin:0rem auto; margin-top:1rem; display:none;", Name: "actionButton",
                    Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                }
            ], container);

            GlobalUtilities.loading(elems["uploadArea"]);

            var uploaderObject = null;

            GlobalUtilities.uploader(elems["uploadArea"], {
                UploadDataSource: DocsAPI.GetUploadLink(),
                Removable: true,
                MaxCount: 1,
                AcceptedFiles: [".xml"],
                OnUpload: function (file, jsonResponse) {
                    jQuery(elems["actionButton"]).fadeIn(500);
                },
                OnRemove: function (p) {
                    uploaderObject.remove(p);
                    jQuery(elems["actionButton"]).fadeOut(500);
                }
            }, function (au) { uploaderObject = au; });

            var get_uploaded_file = function () {
                var files = !uploaderObject ? null : uploaderObject.get_items(true);
                return (files || []).length == 1 ? files[0] : null;
            };

            var processing = false;

            elems["actionButton"].onclick = function () {
                var file = get_uploaded_file();
                if (processing || !file) return;

                processing = true;
                elems["actionButton"].innerHTML = "";
                GlobalUtilities.loading(elems["actionButton"]);

                DIAPI.ImportData({
                    AttachedFile: Base64.encode(file.toString()), ParseResults: true,
                    ResponseHandler: function (result) {
                        var msg = result.ErrorText || result.Succeed;
                        if (msg) alert(RVDic.MSG[msg] || msg, { Timeout: 100000 });

                        elems["actionButton"].innerHTML = RVDic.Confirm;
                        processing = false;
                    }
                });
            };
        }
    };
})();