(function () {
    if (window.InlineImageCrop) return;

    window.InlineImageCrop = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            Image: null,
            HighQualityImage: null,
            ZoomInButton: null,
            ZoomOutButton: null,
            UploadArea: GlobalUtilities.create_nested_elements([{ Type: "div", Style: "display:none;", Name: "_div" }], document.body)["_div"]
        };

        this.Objects = {
            ObjectID: params.ObjectID || "",
            ImageURL: params.ImageURL || "",
            HighQualityImageURL: params.HighQualityImageURL || "",
            Dimensions: {},
            Uploader: null,
            Zoom: 1,
            Processing: false
        };
        
        this.Options = {
            Editable: params.Editable === true,
            DisableImageCrop: params.DisableImageCrop === true,
            IconType: params.IconType,
            HighQualityIconType: params.HighQualityIconType,
            DimensionsVariableName: params.DimensionsVariableName + "_" + this.Objects.ObjectID,
            ContainerWidth: jQuery(this.ContainerDiv).width(),
            ContainerHeight: jQuery(this.ContainerDiv).height(),
            ZoomInCoeff: 1.1,
            ZoomOutCoeff: 0.9,
            OnSave: params.OnSave || function (d, callback) { callback(); }
        };
        
        this.Objects.Dimensions.Width = this.Options.ContainerWidth;
        this.Objects.Dimensions.Height = this.Options.ContainerHeight;

        this.ContainerDiv.style.direction = "ltr";
        this.ContainerDiv.style.backgroundRepeat = "no-repeat";
        this.ContainerDiv.style.backgroundSize = "cover"; // this.Options.ContainerWidth + "px " + this.Options.ContainerHeight + "px";
        this.ContainerDiv.style.backgroundPosition = "center";

        var that = this;

        if (that.Options.Editable) that._create_uploader();

        that._initialize();
    }

    InlineImageCrop.prototype = {
        _initialize: function () {
            var that = this;

            RVAPI.GetVariable({
                Name: that.Options.DimensionsVariableName, ParseResults: true,
                ResponseHandler: function (result) {
                    that.Objects.Dimensions = result.Value ? JSON.parse(Base64.decode(result.Value)) : {};
                    that.Objects.Zoom = that.Options.ContainerWidth / that.Objects.Dimensions.Width;
                    
                    that.goto_view_mode();
                }
            });
        },

        _loading: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-1", Name: "_div",
                    Style: "width:20rem; margin:4rem auto 0rem auto; padding:1rem; background-color:white;"
                }
            ], that.ContainerDiv)["_div"];

            GlobalUtilities.loading(_div);
        },

        _button: function (params) {
            params = params || {};
            var that = this;

            var _set_info_style = function (_div) {
                _div.style.background = "#e1e6ff"; _div.style.border = "1px dotted #C0C0C0";
                _div.style.opacity = "0.60"; _div.style.opacity = "filter:alpha(opacity=60)";
            }

            var _set_info_style_over = function (_div) {
                _div.style.background = "#e1e6df"; _div.style.border = "1px double  #999999";
                _div.style.opacity = "1.0"; _div.style.opacity = "filter:alpha(opacity=100)";
            }

            var _style = "width:24px; background:#e1e6ff; border:1px dotted #C0C0C0; padding:4px;" +
                "opacity:0.60; opacity:filter:alpha(opacity=60);";

            return {
                Type: "div", Class: "rv-border-radius-quarter",
                Style: "text-align:center; cursor:pointer; width:1.8rem; height:1.8rem;" + _style + (params.Style || ""),
                Tooltip: params.Tooltip, TooltipAlign: params.TooltipAlign,
                Properties: [
                    { Name: "onmouseover", Value: function () { _set_info_style_over(this); } },
                    { Name: "onmouseout", Value: function () { _set_info_style(this); } },
                    { Name: "onclick", Value: params.OnClick }
                ],
                Childs: [{ Type: "img", Attributes: [{ Name: "src", Value: GlobalUtilities.icon(params.Icon) }] }]
            }
        },

        set: function () {
            var that = this;

            var image = that.Interface.Image;
            var dimensions = that.Objects.Dimensions;

            image.style.marginLeft = (-1 * dimensions.X * that.Objects.Zoom) + "px";
            image.style.marginTop = (-1 * dimensions.Y * that.Objects.Zoom) + "px";
            image.style.width = image.style.maxWidth = (dimensions.HighQualityImageWidth * that.Objects.Zoom) + "px";
            image.style.height = image.style.maxHeight = (dimensions.HighQualityImageHeight * that.Objects.Zoom) + "px";
        },

        goto_view_mode: function () {
            var that = this;

            if (that.Objects.Processing) return;
            that.Objects.Processing = true;
            
            that.ContainerDiv.innerHTML = "";

            that.ContainerDiv.style.zIndex = null;

            that.ContainerDiv.onmouseup = that.ContainerDiv.onmousedown = that.ContainerDiv.onmousemove = null;
            that.ContainerDiv.mousewheel = that.ContainerDiv.DOMMouseScroll = that.ContainerDiv.onmousewheel = null;

            that.Objects.Dimensions.HighQualityImageWidth = null;
            that.Objects.Dimensions.HighQualityImageHeight = null;

            that.ContainerDiv.style.overflow = "";

            var imageUrl = GlobalUtilities.add_timestamp(that.Objects.ImageURL);
            
            var imgObj = GlobalUtilities.create_nested_elements([{
                Type: "img", Name: "imgObj", Attributes: [{ Name: "src", Value: imageUrl }],
                Properties: [{
                    Name: "onload",
                    Value: function () {
                        that.ContainerDiv.style.backgroundImage = "url('" + imageUrl + "')";
                        that.Objects.Processing = false;
                    }
                }]
            }])["imgObj"];

            if (that.Options.Editable) {
                var btns = [];
                
                var hasNavigationButton = that.Objects.HighQualityImageURL && !that.Options.DisableImageCrop;

                if (hasNavigationButton) {
                    btns.push(that._button({
                        Icon: "Move20.png",
                        OnClick: function () { that.goto_crop_mode(); },
                    }));
                }

                //var tltp = RVDic.Checks.ImageDimensionsMusteBeAtLeastNPixels
                //    .replace("[n]", that.Options.ContainerWidth).replace("[m]", that.Options.ContainerHeight);
                var tltp = RVDic.Checks.ImageDimensionsMusteBeAtLeastNPixels.replace("[n]", 900).replace("[m]", 220);

                btns.push(that._button({
                    Icon: "Photos20.png", TooltipAlign: RV_RevFloat,
                    Tooltip: tltp,
                    OnClick: function () { if (that.Objects.Uploader) that.Objects.Uploader.browse(); },
                    Style: (hasNavigationButton ? "margin-top:0.3rem;" : "")
                }));

                GlobalUtilities.create_nested_elements([{
                    Type: "div",
                    Style: "position:absolute; z-index:1;" + RV_Float + ":1rem; top:2.5rem;",
                    Childs: btns
                }], that.ContainerDiv);
            }
        },

        _create_crop_options: function () {
            var that = this;

            var btns = [];

            btns.push(that._button({ Icon: "Save20.png", OnClick: function () { that.save(); } }));
            btns.push(that._button({ Icon: "Cancel20.png", OnClick: function () { that._loading(); that.goto_view_mode(); }, Style: "margin-top:0.3rem;" }));
            btns.push(that._button({ Icon: "ZoomIn20.png", OnClick: function () { that.zoom(true); }, Style: "margin-top:3.5rem;" }));
            btns.push(that._button({ Icon: "ZoomOut20.png", OnClick: function () { that.zoom(false); }, Style: "margin-top:0.3rem;" }));

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "position:absolute; z-index:1;" + RV_Float + ":1rem; top:2.5rem;",
                    Childs: btns
                }
            ], that.ContainerDiv);
        },

        _goto_crop_mode: function (image) {
            var that = this;

            that.Interface.Image = image;

            var nn6 = !!(document.getElementById && !document.all);

            //setting things
            that.ContainerDiv.style.overflow = "hidden";

            that.set();
            //end of setting things

            var width = that.Options.ContainerWidth;
            var height = that.Options.ContainerHeight;

            that.ContainerDiv.onmouseup = function () { that.ContainerDiv.onmousemove = null; }

            that.ContainerDiv.onmousedown = function (e) {
                var fobj = e.target || event.srcElement;

                while (fobj.tagName != "HTML" && fobj.tagName != "BODY" && fobj != image)
                    fobj = fobj.parentNode || fobj.parentElement;

                if (fobj == image) {
                    tx = parseInt(fobj.style.marginLeft + 0, 10);
                    ty = parseInt(fobj.style.marginTop + 0, 10);
                    x = nn6 ? e.clientX : event.clientX;
                    y = nn6 ? e.clientY : event.clientY;

                    that.ContainerDiv.onmousemove = function (ev) {
                        var imageWidth = jQuery(image).width();
                        var imageHeight = jQuery(image).height();

                        var widthDiff = width - imageWidth;
                        var heightDiff = height - imageHeight;

                        var marginLeft = tx + (ev.clientX || event.clientX) - x;
                        var marginTop = ty + (ev.clientY || event.clientY) - y;

                        if (marginLeft > 0) marginLeft = 0;
                        else if (marginLeft < widthDiff) marginLeft = widthDiff;

                        if (marginTop > 0) marginTop = 0;
                        else if (marginTop < heightDiff) marginTop = heightDiff;

                        //computing dimensions
                        that.Objects.Dimensions.X = Math.floor(Math.abs(marginLeft) / that.Objects.Zoom);
                        that.Objects.Dimensions.Y = Math.floor(Math.abs(marginTop) / that.Objects.Zoom);

                        that.set();
                        //end of computing dimensions

                        return false;
                    };

                    return false;
                }
            } //end of that.ContainerDiv.onmousedown

            //set mouse wheel zoom
            var onMouseWheel = function (e) {
                // cross-browser wheel delta
                e = window.event || e; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                that.zoom(delta < 0 ? false : true);
                return false;
            }

            if (that.ContainerDiv.addEventListener) {
                that.ContainerDiv.addEventListener("mousewheel", onMouseWheel, false); // IE9, Chrome, Safari, Opera
                that.ContainerDiv.addEventListener("DOMMouseScroll", onMouseWheel, false); // Firefox
            }
            else that.ContainerDiv.attachEvent("onmousewheel", onMouseWheel); // IE 6/7/8
            //end of set mouse wheel zoom
        },

        goto_crop_mode: function () {
            var that = this;

            if (that.Objects.Processing) return;
            that.Objects.Processing = true;

            that.ContainerDiv.innerHTML = "";

            that.ContainerDiv.style.overflow = "hidden";
            that.ContainerDiv.style.zIndex = 1;

            var imageUrl = GlobalUtilities.add_timestamp(that.Objects.HighQualityImageURL);

            var imgObj = GlobalUtilities.create_nested_elements([
                {
                    Type: "img", Name: "imgObj", Style: "cursor:move; position:relative;",
                    Attributes: [{ Name: "src", Value: imageUrl }],
                    Properties: [
                        {
                            Name: "onload",
                            Value: function () {
                                that._create_crop_options();
                                that.ContainerDiv.appendChild(imgObj);

                                that.Objects.Dimensions.HighQualityImageWidth = jQuery(imgObj).width();
                                that.Objects.Dimensions.HighQualityImageHeight = jQuery(imgObj).height();

                                that._goto_crop_mode(imgObj);
                                that.Objects.Processing = false;
                            }
                        }
                    ]
                }
            ])["imgObj"];
        },

        zoom: function (zoomIn) {
            var that = this;

            var image = that.Interface.Image;
            var coEff = zoomIn ? that.Options.ZoomInCoeff : that.Options.ZoomOutCoeff;

            var width = that.Options.ContainerWidth;
            var height = that.Options.ContainerHeight;

            //computing width & height
            var imageWidth = jQuery(image).width();
            var imageHeight = jQuery(image).height();
            var newWidth = imageWidth * coEff;
            var newHeight = imageHeight * coEff;
            //end of computing width & height

            //fixing width & height
            if (newWidth < width || newHeight < height) {
                var scale = Math.max((newWidth < width ? width / newWidth : 1), (newHeight < height ? height / newHeight : 1));
                newWidth *= scale;
                newHeight *= scale;
            }
            //end of fixing width & height

            //computing margins
            var widthDiff = newWidth - imageWidth;
            var heightDiff = newHeight - imageHeight;

            var marginLeft = parseInt(image.style.marginLeft + 0, 10);
            var marginTop = parseInt(image.style.marginTop + 0, 10);

            var newMarginLeft = marginLeft - (widthDiff / 2);
            var newMarginTop = marginTop - (heightDiff / 2);
            //end of computing margins

            //fixing margins
            widthDiff = width - newWidth;
            heightDiff = height - newHeight;

            if (newMarginLeft > 0) newMarginLeft = 0;
            else if (newMarginLeft < widthDiff) newMarginLeft = widthDiff;

            if (newMarginTop > 0) newMarginTop = 0;
            else if (newMarginTop < heightDiff) newMarginTop = heightDiff;
            //end of fixing margins

            //computing dimensions
            that.Objects.Zoom *= newWidth / imageWidth;

            that.Objects.Dimensions = {
                X: Math.floor(Math.abs(newMarginLeft) / that.Objects.Zoom),
                Y: Math.floor(Math.abs(newMarginTop) / that.Objects.Zoom),
                Width: +Number(width / that.Objects.Zoom).toFixed(0),
                Height: +Number(height / that.Objects.Zoom).toFixed(0),
                HighQualityImageWidth: newWidth / that.Objects.Zoom,
                HighQualityImageHeight: newHeight / that.Objects.Zoom
            };

            that.set();
            //end of computing dimensions
        },

        _save_dimensions_variable: function (newDimensions, callback) {
            var that = this;

            RVAPI.SetVariable({
                Name: that.Options.DimensionsVariableName, Value: Base64.encode(JSON.stringify(newDimensions)),
                ParseResults: true,
                ResponseHandler: function (result) {
                    if (GlobalUtilities.get_type(callback) == "function") callback();
                }
            });
        },

        _create_uploader: function () {
            var that = this;

            GlobalUtilities.load_files(["API/DocsAPI.js"], {
                OnLoad: function () {
                    var uploadParams = {
                        UploadDataSource: DocsAPI.UploadIcon({ IconID: that.Objects.ObjectID, Type: that.Options.IconType }),
                        OnFileAdd: function () { that._loading(); },
                        OnUpload: function (file, jsonResponse) {
                            if (jsonResponse.succeess === false || (jsonResponse.Message || {}).ErrorText) {
                                alert(RVDic.MSG[(jsonResponse.Message || {}).ErrorText || "OperationFailed"]);
                                that.goto_view_mode();
                                return;
                            }

                            that.Objects.Uploader.remove(file);

                            that.Objects.ImageURL = jsonResponse.Message.ImageURL;
                            that.Objects.HighQualityImageURL = jsonResponse.Message.HighQualityImageURL;

                            var _newDimensions = {
                                X: jsonResponse.Message.X, Y: jsonResponse.Message.Y,
                                Width: jsonResponse.Message.Width, Height: jsonResponse.Message.Height
                            };

                            that._save_dimensions_variable(_newDimensions, function () {
                                that.Objects.Dimensions = _newDimensions;
                                that.Objects.Zoom = that.Options.ContainerWidth / that.Objects.Dimensions.Width;
                                that._loading();

                                if (!that.Options.DisableImageCrop) that.goto_crop_mode();
                                else that.goto_view_mode();
                            });
                        }
                    };

                    GlobalUtilities.uploader(that.Interface.UploadArea, uploadParams, function (up) { that.Objects.Uploader = up; });
                }
            });
        },

        save: function () {
            var that = this;

            that.Objects.Processing = true;
            that._loading();

            DocsAPI.CropIcon(GlobalUtilities.extend({}, that.Objects.Dimensions, {
                IconID: that.Objects.ObjectID, Type: that.Options.IconType,
                ParseResults: true,
                ResponseHandler: function (result) {
                    that._save_dimensions_variable(that.Objects.Dimensions, function () {
                        that.Objects.Processing = false;
                        that.goto_view_mode();
                    });
                }
            }));
        }
    }
})();