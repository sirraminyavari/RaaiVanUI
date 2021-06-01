(function () {
    if (window.CNImportFromExcel) return;

    window.CNImportFromExcel = function (container, params) {
        this.ContainerDiv = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.ContainerDiv) return;

        this.Objects = {
            NodeTypeID: params.NodeTypeID,
            Uploader: null,
        };

        this.Options = {
            OnFinish: params.OnFinish
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js", "API/DocsAPI.js"], {
            OnLoad: function () { that._initialize(); }
        });
    }

    CNImportFromExcel.prototype = {
        _initialize: function (m) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

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
                        }
                    ]
                }
            ], that.ContainerDiv);

            GlobalUtilities.loading(elems["uploadArea"]);

            var _uploadParams = {
                UploadDataSource: DocsAPI.GetUploadLink(),
                Removable: true,
                MaxCount: 1,
                AcceptedFiles: [".xlsx"],
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
                if (processing || !file) return;

                processing = true;
                elems["actionButton"].innerHTML = "";
                GlobalUtilities.loading(elems["actionButton"]);

                CNAPI.ImportNodesFromExcel({
                    NodeTypeID: that.Objects.NodeTypeID, Uploaded: Base64.encode(file.toString()), SheetNo: 1, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) { if (that.Options.OnFinish) that.Options.OnFinish(); }

                        elems["actionButton"].innerHTML = RVDic.Confirm;
                        processing = false;
                    }
                });
            };
        },

        get_uploaded_file: function () {
            var that = this;
            var files = !that.Objects.Uploader ? null : that.Objects.Uploader.get_items(true);
            return (files || []).length == 1 ? files[0] : null;
        }
    };
})();