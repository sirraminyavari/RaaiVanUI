(function () {
    if (window.IconSelect) return;

    window.IconSelect = function (container, params) {
        var that = this;

        GlobalUtilities.load_files(["API/DocsAPI.js"], { OnLoad: function () { that._initialize(container, params); } });
    }

    IconSelect.prototype = {
        _initialize: function (container, params) {
            var that = this;
            params = params || {};

            var editable = params.Editable === true;
            var imageUrl = params.IconURL;
            var highQualityImageUrl = params.HighQualityIconURL;
            var iconType = params.IconType;
            var saveWidth = params.SaveWidth || 120;
            var saveHeight = params.SaveHeight || 120;
            var imageWidth = params.ImageWidth || 120;
            var imageHeight = params.ImageHeight || 120;
            var aspectRatio = params.AspectRatio || (imageWidth / imageHeight);
            var circular = params.Circular === true;

            var objectId = params.ObjectID || "";

            var imageDimensions = null;
            var dimensionsVariableName = params.DimensionsVariableName + "_" + objectId;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "width:" + imageWidth + "px; margin:0px auto 0px auto; text-align:center;",
                Childs: [
                    { Type: "div", Name: "uploadArea" },
                    { Type: "div", Name: "imageArea" }
                ]
            }], container);

            var uploadArea = elems["uploadArea"];
            var imageArea = elems["imageArea"];

            var _set_image = function (newUrl, maxWidth, maxHeight) {
                uploadArea.style.display = "none";
                imageArea.style.display = "block";
                imageArea.innerHTML = "";

                var imageOut = true;

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "text-align:center; width:" + imageWidth + "px; position:relative;",
                        Properties: [{ Name: "onclick", Value: function (e) { e.stopImmediatePropagation(); } }],
                        Childs: [
                            {
                                Type: "div", Style: (editable && highQualityImageUrl ? "" : "display:none;"),
                                Childs: [
                                    {
                                        Type: "div", Class: "rv-circle", Name: "moveDiv",
                                        Style: "position:absolute; " + RV_Float + ":2px; top:2px; z-index:1; display:none;" +
                                            "background-color:rgba(0,0,0,0.5); width:1.5rem; height:1.5rem; text-align:center;" +
                                            "color:white; line-height:1.5rem; padding-top:1px; cursor:pointer;",
                                        Properties: [
                                            { Name: "onmouseover", Value: function () { this.style.display = elems["changeButton"].style.display = elems["removeDiv"].style.display = "inline-block"; } },
                                            { Name: "onmouseout", Value: function () { if (imageOut) this.style.display = elems["changeButton"].style.display = elems["removeDiv"].style.display = "none"; } },
                                            { Name: "onclick", Value: function () { _move_image(); } }
                                        ],
                                        Childs: [{ Type: "i", Class: "fa fa-arrows fa-lg" }]
                                    },
                                    {
                                        Type: "div", Class: "rv-circle", Name: "removeDiv",
                                        Style: "position:absolute; " + RV_RevFloat + ":2px; top:2px; z-index:1; display:none;" + 
                                            "background-color:rgba(255,0,0,0.8); width:1.5rem; height:1.5rem; text-align:center;" +
                                            "color:white; line-height:1.5rem; padding-top:1px; cursor:pointer;",
                                        Properties: [
                                            { Name: "onmouseover", Value: function () { this.style.display = elems["changeButton"].style.display = elems["moveDiv"].style.display = "inline-block"; } },
                                            { Name: "onmouseout", Value: function () { if (imageOut) this.style.display = elems["changeButton"].style.display = elems["moveDiv"].style.display = "none"; } },
                                            { Name: "onclick", Value: function () { _remove_image(); } }
                                        ],
                                        Childs: [{ Type: "i", Class: "fa fa-times fa-lg" }]
                                    }
                                ]
                            },
                            {
                                Type: "div",
                                Childs: [{
                                    Type: "img",
                                    Class: (circular ? "rv-circle" : "rv-border-radius-quarter") + " " +
                                        (params.ImageClass || " "),
                                    Style: "width:" + imageWidth + "px; height:" + imageHeight + "px; cursor:default;" + (params.ImageStyle || " "),
                                    Attributes: [{ Name: "src", Value: GlobalUtilities.add_timestamp(newUrl || imageUrl) }],
                                    Properties: [
                                        {
                                            Name: "onmouseover",
                                            Value: function () {
                                                elems["changeButton"].style.display = "inline-block";
                                                elems["moveDiv"].style.display = "inline-block";
                                                elems["removeDiv"].style.display = "inline-block";
                                                imageOut = false;
                                            }
                                        },
                                        {
                                            Name: "onmouseout",
                                            Value: function () {
                                                elems["changeButton"].style.display = "none";
                                                elems["moveDiv"].style.display = "none";
                                                elems["removeDiv"].style.display = "none";
                                                imageOut = true;
                                            }
                                        }
                                    ]
                                }]
                            },
                            {
                                Type: "div", Style: (editable ? "" : "display:none;"),
                                Childs: [{
                                    Type: "div", Class: "NormalBorder rv-border-radius-quarter", Name: "changeButton",
                                    Style: "display:none; position:absolute; bottom:-14px; left:0; right:0; cursor:pointer; padding:4px; font-size:x-small; font-weight:bold;" +
                                        "color:white; background: rgba(0, 0, 0, 0.5);",
                                    Tooltip: RVDic.Checks.ImageDimensionsMusteBeAtLeastNPixels.replace("[n]", saveWidth).replace("[m]", saveHeight),
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.display = elems["moveDiv"].style.display = elems["removeDiv"].style.display = "inline-block"; } },
                                        { Name: "onmouseout", Value: function () { if (imageOut) this.style.display = elems["moveDiv"].style.display = elems["removeDiv"].style.display = "none"; } },
                                        { Name: "onclick", Value: function (e) { e.stopPropagation(); if (uploader) uploader.browse(); } }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.NewImage }]
                                }]
                            }
                        ]
                    }
                ], imageArea);
            }

            _set_image();

            var _saveDimensionsVariable = function (newDimensions, callback) {
                RVAPI.SetVariable({
                    Name: dimensionsVariableName, Value: Base64.encode(JSON.stringify(newDimensions)),
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (GlobalUtilities.get_type(callback) == "function") callback();
                    }
                });
            }

            var _move_image = function () {
                var _div = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "SoftBackgroundColor BorderRadius4 NormalPadding", Name: "_div",
                    Style: "width:756px; margin:0px auto 0px auto;"
                }])["_div"];

                GlobalUtilities.loading(_div);
                var showedDiv = GlobalUtilities.show(_div, { OnClose: function () { if (_imageCrop) delete _imageCrop; } });

                var _imageCrop = null;

                var _create_crop_object = function () {
                    _imageCrop = new ImageCrop(_div, {
                        ImageURL: GlobalUtilities.add_timestamp(highQualityImageUrl),
                        Dimensions: imageDimensions,
                        AspectRatio: aspectRatio,
                        OnSave: function (dimensions) {
                            _set_image(GlobalUtilities.icon("Loading-Circle.gif"));

                            var _newDimensions = {
                                X: dimensions.X, Y: dimensions.Y,
                                Width: dimensions.Width, Height: dimensions.Height
                            };

                            DocsAPI.CropIcon(GlobalUtilities.extend({}, _newDimensions, {
                                IconID: objectId, Type: iconType,
                                ParseResults: true,
                                ResponseHandler: function (result) {
                                    _saveDimensionsVariable(_newDimensions, function () {
                                        imageDimensions = _newDimensions;
                                        showedDiv.Close();
                                        _set_image();
                                    });
                                }
                            }));
                        }
                    });
                }

                var _get_high_quality_image = function () {
                    if (highQualityImageUrl)
                        _create_crop_object();
                    else {
                        DocsAPI.Icon({
                            IconID: objectId, Type: params.HighQualityIconType, ParseResults: true,
                            ResponseHandler: function (result) {
                                highQualityImageUrl = result.IconURL;
                                _create_crop_object();
                            }
                        });
                    }
                }

                GlobalUtilities.load_files(["Multimedia/ImageCrop.js"], {
                    OnLoad: function () {
                        if (imageDimensions)
                            _get_high_quality_image();
                        else {
                            RVAPI.GetVariable({
                                Name: dimensionsVariableName, ParseResults: true,
                                ResponseHandler: function (result) {
                                    imageDimensions = result.Value ? JSON.parse(Base64.decode(result.Value)) : null;
                                    _get_high_quality_image();
                                }
                            });
                        }
                    }
                });
            };

            var _remove_image = function () {
                if (that.__REMOVING_ICON) return;
                that.__REMOVING_ICON = true;

                DocsAPI.DeleteIcon({
                    IconID: objectId, Type: iconType, ParseResults: true,
                    ResponseHandler: function (result) {
                        that.__REMOVING_ICON = false;

                        if ((result || {}).DefaultIconURL) {
                            imageUrl = result.DefaultIconURL;
                            highQualityImageUrl = "";

                            _set_image(result.DefaultIconURL);
                        }
                    }
                });
            };

            var uploader = null;
            
            var uploadParams = {
                UploadDataSource: DocsAPI.UploadIcon({ IconID: objectId, Type: iconType }),
                OnFileAdd: function () { _set_image(GlobalUtilities.icon("Loading-Circle.gif")); },
                OnUpload: function (file, jsonResponse) {
                    if (jsonResponse.succeess === false || (jsonResponse.Message || {}).ErrorText) {
                        alert(RVDic.MSG[(jsonResponse.Message || {}).ErrorText || "OperationFailed"]);
                        _set_image();
                        return;
                    }

                    uploader.remove(file);

                    imageUrl = jsonResponse.Message.ImageURL;
                    highQualityImageUrl = jsonResponse.Message.HighQualityImageURL;

                    var _newDimensions = {
                        X: jsonResponse.Message.X, Y: jsonResponse.Message.Y,
                        Width: jsonResponse.Message.Width, Height: jsonResponse.Message.Height
                    };

                    _saveDimensionsVariable(_newDimensions, function () {
                        imageDimensions = _newDimensions;
                        _set_image();
                    });
                }
            };

            GlobalUtilities.uploader(uploadArea, uploadParams, function (up) { uploader = up; });
        }
    }
})();