(function () {
    if (window.ImageCrop) return;

    window.ImageCrop = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        params = params || {};
        if (!this.ContainerDiv) return;

        this.Objects = {
            ImageURL: params.ImageURL,
            Dimensions: GlobalUtilities.extend({ X: 0, Y: 0, Width: 100, Height: 100 }, params.Dimensions || {})
        };
        
        this.Options = {
            MaxWidth: 600,
            MaxHeight: 600,
            PreviewWidth: 120,
            PreviewHeight: 120,
            AspectRatio: params.AspectRatio || 1,
            OnSave: params.OnSave || function () { }
        }

        this._preinit();
    }

    ImageCrop.prototype = {
        _preinit: function () {
            var that = this;

            GlobalUtilities.load_files([
                { Root: "jQuery/jCrop/", Childs: ["jquery.Jcrop.css", "jquery.Jcrop.js"] }
            ], {
                OnLoad: function () {
                    GlobalUtilities.create_nested_elements([
                        { Type: "img", Attributes: [{ Name: "src", Value: that.Objects.ImageURL}],
                            Properties: [{ Name: "onload", Value: function () { that._initialize(); } }]
                        }
                    ]);
                }
            });
        },

        _initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Style: "direction:ltr; width:" + (that.Options.MaxWidth + that.Options.PreviewWidth + 40) + "px;",
                    Childs: [
                        { Type: "div", Style: "margin:4px; float:right;",
                            Childs: [
                                { Type: "div", Class: "BorderRadius4", Name: "previewPane",
                                    Style: "background-color: #fff; padding: 6px; border: 1px solid #bcbcbc;",
                                    Childs: [
                                        { Type: "div", Class: "BorderRadius4", Name: "previewContainer",
                                            Style: "overflow: hidden; width:" + that.Options.PreviewWidth +
                                                "px; height:" + that.Options.PreviewHeight + "px;",
                                            Childs: [
                                                { Type: "img", Style: "max-width:none;", Name: "previewImage",
                                                    Attributes: [{ Name: "src", Value: that.Objects.ImageURL}]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { Type: "div", Class: "ActionButton", Name: "saveButton",
                                    Style: "margin-top:40px; font-weight:bold; width:" + (that.Options.PreviewWidth + 4) + "px; margin-right:-4px;",
                                    Properties: [{ Name: "onclick", Value: function () { that.Options.OnSave(that.Objects.Dimensions); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Save}]
                                }
                            ]
                        },
                        { Type: "div", Class: "BorderRadius4 NormalPadding",
                            Style: "background-color:white; width:" + (that.Options.MaxWidth) + "px; text-align:center;" +
                                "border: 1px solid rgb(188, 188, 188); margin:4px 0px 4px 0px; float:right;",
                            Childs: [
                                { Type: "img", Name: "targetImage",
                                    Style: "max-width:" + that.Options.MaxWidth + "px; max-height:" + that.Options.MaxHeight + "px;",
                                    Attributes: [{ Name: "src", Value: that.Objects.ImageURL}]
                                }
                            ]
                        },
                        { Type: "div", Style: "clear:both;" }
                    ]
                }
            ], that.ContainerDiv);

            var jcrop_api, boundx, boundy;

            var previewPane = elems["previewPane"];
            var previewContainer = elems["previewContainer"];
            var previewImage = elems["previewImage"];

            $(elems["targetImage"]).Jcrop({
                onChange: updatePreview,
                onSelect: updatePreview,
                bgOpacity: 0.5,
                aspectRatio: that.Options.AspectRatio,
                dimensions: [that.Objects.Dimensions.X, that.Objects.Dimensions.Y, that.Objects.Dimensions.Width, that.Objects.Dimensions.Height]
            }, function () {
                // Use the API to get the real image size
                var bounds = this.getBounds();
                boundx = bounds[0];
                boundy = bounds[1];

                jcrop_api = this; // Store the API in the jcrop_api variable

                // Move the preview into the jcrop container for css positioning
                //$(previewPane).appendTo(jcrop_api.ui.holder);
            });

            var xsize = $(previewContainer).width();
            var ysize = $(previewContainer).height();

            function updatePreview(c) {
                if (parseInt(c.w) > 0) {
                    var rx = xsize / c.w;
                    var ry = ysize / c.h;

                    that.Objects.Dimensions = { X: c.x, Y: c.y, Width: c.w, Height: c.h };
                    
                    $(previewImage).css({
                        width: Math.round(rx * boundx) + 'px',
                        height: Math.round(ry * boundy) + 'px',
                        marginLeft: '-' + Math.round(rx * c.x) + 'px',
                        marginTop: '-' + Math.round(ry * c.y) + 'px'
                    });
                }
            }

            updatePreview({ x: that.Objects.Dimensions.X, y: that.Objects.Dimensions.Y,
                w: that.Objects.Dimensions.Width, h: that.Objects.Dimensions.Height
            });
        }
    }
})();