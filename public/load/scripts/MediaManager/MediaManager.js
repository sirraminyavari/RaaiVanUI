(function () {
    if (window.MediaManager) return;

    window.MediaManager = function (params) {
        params = params || {};

        this.ContainerDiv = typeof (params.ContainerDiv) == "object" ? params.ContainerDiv : document.getElementById(params.ContainerDiv || "");
        if (this.ContainerDiv == null) return;

        this.Options = {
            NoInlineMedia: params.NoInlineMedia === true,
            UnlimitedDownloadAccess: params.UnlimitedDownloadAccess === true,
            PDFCovers: params.PDFCovers || [],
            EnableFileRename: params.EnableFileRename
        };
        
        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "margin:0.5rem 0rem; display:none;", Name: "audiosContainerId"
            },
            {
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "margin:0.5rem 0rem; display:none;", Name: "videoesContainerId"
            },
            {
                Type: "div", Class: "small-12 medium-12 large-12",
                Style: "margin:0.5rem 0rem; display:none;", Name: "imagesContainerId"
            },
            {
                Type: "div", Class: "small-12 medium-12 large-12 row",
                Style: "margin:0.5rem 0rem; display:none;", Name: "linksContainerId"
            }
        ], this.ContainerDiv);

        this.AudiosArea = elems["audiosContainerId"];
        this.VideoesArea = elems["videoesContainerId"];
        this.ImagesArea = elems["imagesContainerId"];
        this.LinksArea = elems["linksContainerId"];
    }

    MediaManager.prototype = {
        is_image: function (item) {
            return /^(jpg|gif|jpeg|png)$/.test(String(item.Extension || "").toLowerCase());
        },

        is_video: function (item) {
            return /^(mp4|ogg|webm)$/.test(String(item.Extension || "").toLowerCase());
        },

        is_audio: function (item) {
            return /^(mp3|ogg|wav)$/.test(String(item.Extension || "").toLowerCase());
        },

        is_downloadable: function (item, params) {
            return item.Downloadable || (params || {}).Downloadable || this.Options.UnlimitedDownloadAccess;
        },

        get_full_file_name: function (item) {
            return item.FullFileName ||
                (this.get_file_name(item) + (item.Extension == "" ? "" : "." + item.Extension));
        },

        get_file_name: function (item) {
            return item.FileName || item.FileID;
        },

        add_items: function (items, params) {
            items = items || [];
            for (var i = 0, lnt = items.length; i < lnt; ++i)
                this.add_item(items[i], items[i].Options || params);
        },

        add_item: function (item, params) {
            var that = this;
            
            if (that.Options.NoInlineMedia) that.add_link(item, params);
            else if (that.is_video(item)) that.add_video(item, params);
            else if (that.is_audio(item)) that.add_audio(item, params);
            else if (that.is_image(item)) that.add_image(item, params);
            else that.add_link(item, params);

            if (params.OnAdd) params.OnAdd({ File: item });
        },

        _get_options: function (params, inline) {
            params = params || {};

            var options = [];

            if (params.Removable === true) {
                options.push({
                    Type: "div", Style: inline ? "display:inline-block;" : "",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButtonId", Tooltip: RVDic.Remove,
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                });
            }

            if (params.Acceptable === true) {
                options.push({
                    Type: "div", Style: inline ? "display:inline-block;" : "",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-check fa-lg rv-icon-button", Name: "acceptButtonId", Tooltip: RVDic.Confirm,
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                });
            }

            return options;
        },

        _initialize_options: function (item, nestedElems, params) {
            params = params || {};

            var removeButton = nestedElems["removeButtonId"];
            if (removeButton && params.OnRemove)
                removeButton.onclick = function () { params.OnRemove({ File: item, ContainerDiv: nestedElems["containerId"] }); }

            var acceptButton = nestedElems["acceptButtonId"];
            if (acceptButton && params.OnAccept)
                acceptButton.onclick = function () { params.OnAccept({ File: item, ContainerDiv: nestedElems["containerId"] }); }
        },

        add_image: function (item, params) {
            //////////
            this.ImagesArea.style.display = "block";
            //////////

            var downloadLink = item.DownloadLink;
            var imageDownloadLink = item.ImageDownloadLink;

            var options = this._get_options(params, false);

            var _fileArea = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "containerId",
                    Style: "display:inline-block; position:relative; padding:0.2rem; width:8rem; height:8rem; margin:0.2rem;",
                    Childs: [
                        {
                            Type: "div", Class: "SoftBorder rv-circle SurroundingShadow",
                            Style: "position:absolute; top:-0.4rem;" + RV_Float + ":-0.4rem; padding:0.2rem;" +
                                "background-color:white; width:1.6rem; height:1.6rem; text-align:center; border-color:rgb(200,200,200);" +
                                ((options || []).length ? "" : "display:none;"),
                            Childs: options
                        },
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder SurroundingShadow",
                            Style: "background-image:url(" + downloadLink + "); background-repeat:no-repeat;" +
                                "background-position:center top; background-size:cover; height:8rem; cursor:pointer;" +
                                "border-color:rgb(200,200,200);",
                            Properties: [{ Name: "onclick", Value: function (e) { GlobalUtilities.show_image(downloadLink, e); } }]
                        },
                        (!imageDownloadLink || !downloadLink ? null : {
                            Type: "div", Style: "position:absolute; bottom:0.2rem;" + RV_Float + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-circle",
                                    Style: "display:inline-block; padding:0.1rem; width:1.5rem; height:1.5rem;",
                                    Properties: [{ Name: "onclick", Value: function () { GlobalUtilities.submit_form({ URL: downloadLink, Method: "post" }); } }],
                                    Childs: [{ Type: "i", Class: "fa fa-download" }]
                                },
                                {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-circle",
                                    Style: "display:inline-block; padding:0.1rem; width:1.5rem; height:1.5rem; margin-" + RV_Float + ":0.3rem;",
                                    Properties: [{ Name: "onclick", Value: function () { window.open(imageDownloadLink); } }],
                                    Childs: [{ Type: "i", Class: "fa fa-arrows-alt" }]
                                }
                            ]
                        })
                    ]
                }
            ], this.ImagesArea);

            this._initialize_options(item, _fileArea, params);
        },

        add_video: function (item, params) {
            //////////
            this.VideoesArea.style.display = "block";
            //////////

            var downloadLink = item.DownloadLink || "";
            var fullFileName = this.get_full_file_name(item);

            var options = this._get_options(params, false);

            var _fileArea = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "containerId",
                    Style: "display:inline-block; position:relative; padding:0.2rem; margin:0.2rem;",
                    Childs: [
                        {
                            Type: "div", Class: "SoftBorder rv-circle",
                            Style: "position:absolute; top:-0.4rem;" + RV_Float + ":-0.4rem; padding:0.2rem;" +
                                "background-color:white; width:1.6rem; height:1.6rem; text-align:center;" +
                                ((options || []).length ? "" : "display:none;"),
                            Childs: options
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "video", Tooltip: fullFileName }
                    ]
                }
            ], this.VideoesArea);

            _fileArea["video"].innerHTML = '<video width="320" height="240" controls>' +
                '<source src="' + downloadLink + '" type="video/' + item.Extension.toLowerCase() + '"></video>';

            this._initialize_options(item, _fileArea, params);
        },

        add_audio: function (item, params) {
            //////////
            this.AudiosArea.style.display = "block";
            //////////

            var downloadLink = item.DownloadLink || "";
            var fullFileName = this.get_full_file_name(item);

            var options = this._get_options(params, false);

            var _fileArea = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "containerId",
                    Style: "position:relative; padding:0.2rem; margin:0rem 0.2rem;",
                    Childs: [
                        {
                            Type: "div", Class: "SoftBorder rv-circle",
                            Style: "position:absolute; top:-0.4rem;" + RV_Float + ":-0.4rem; padding:0.2rem;" +
                                "background-color:white; width:1.6rem; height:1.6rem; text-align:center;" +
                                ((options || []).length ? "" : "display:none;"),
                            Childs: options
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "audio", Tooltip: fullFileName },
                        {
                            Type: "div", Style: "display:inline-block; height:2rem; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: fullFileName }] }]
                        }
                    ]
                }
            ], this.AudiosArea);

            var tp = item.Extension.toLowerCase();
            if (tp == "mp3") tp = "mpeg";

            _fileArea["audio"].innerHTML = '<audio controls>' +
                '<source src="' + downloadLink + '" type="audio/' + tp + '"></audio>';

            this._initialize_options(item, _fileArea, params);
        },

        add_link: function (item, params) {
            params = params || {};
            var that = this;

            //////////
            this.LinksArea.style.display = "block";
            //////////
            
            var downloadLink = item.DownloadLink;
            var fileName = this.get_file_name(item);
            var iconUrl = item.IconURL;

            var extension = String(item.Extension).toLowerCase();
            
            var isViewablePDF = (extension == "pdf") && ((window.RVGlobal || {}).Modules || {}).PDFViewer;
				//&& item.Size && ((item.Size / (1024 * 1024)) < 5);

            var actionButtonsCount = 0;
            var containerSidePadding = 0;

            var action_button = function (p) {
                p = p || {};

                if (!p.Hide)++actionButtonsCount;

                var btnWidth = 6;
                var internalPadding = 0.15;
                var btnEfficientWidth = btnWidth + (2 * internalPadding);
                var sideMargin = (0.5 * actionButtonsCount) + (btnEfficientWidth * (actionButtonsCount - 1));

                containerSidePadding = sideMargin + btnEfficientWidth + 0.5;
                
                return {
                    Type: "div",
                    Style: "position:absolute; top:0rem; bottom:0rem;" + RV_RevFloat + ":" + sideMargin + "rem;" + 
                        (p.Hide ? "display:none;" : "") + "font-size:0.7rem;",
                    Childs: [
                        {
                            Type: "middle", Class: "rv-circle",
                            Style: "display:inline-block; background-color:white; padding:" + internalPadding + "rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-air-button rv-circle", Name: p.Name,
                                    Style: "display:inline-block; width:" + btnWidth + "rem; text-align:center;",
                                    Childs: [
                                        { Type: "i", Class: "fa " + p.Icon, Style: "margin-" + RV_RevFloat + ":0.3rem;" },
                                        { Type: "text", TextValue: p.Title }
                                    ]
                                }
                            ]
                        }
                    ]
                };
            };

            var _fileArea = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "containerId",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-softer-soft TextAlign",
                    Style: "position:relative; margin:0.3rem 0rem; padding:0.5rem; cursor:default;",
                    Childs: [
                        /* Remove button's name must be 'removeButtonId' */
                        action_button({
                            Name: "removeButtonId", Title: RVDic.Remove, Icon: "fa-times",
                            Hide: !params.Removable
                        }),
                        (!that.Options.EnableFileRename ? null : action_button({
                            Name: "renameButtonId", Title: RVDic.Rename, Icon: "fa-pencil"
                        })),
                        action_button({
                            Name: "download", Title: RVDic.Download, Icon: "fa-download",
                            Hide: !that.is_downloadable(item, params)
                        }),
                        action_button({
                            Name: "showPDF", Title: RVDic.View, Icon: "fa-arrows-alt",
                            Hide: !isViewablePDF
                        }),
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "img",
                                    Style: "display:" + (iconUrl ? "inline-block" : "none") + ";" +
                                        "width:1.5rem; height:1.5rem; margin-" + RV_RevFloat + ":0.5rem;",
                                    Attributes: [{ Name: "src", Value: iconUrl }]
                                },
                                { Type: "text", Name: "fileName", TextValue: fileName },
                                {
                                    Type: "span", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:" + (item.Extension ? "inline-block" : "none") + ";" + 
                                        "margin-" + RV_Float + ":0.5rem; font-size:0.7rem; cursor:default;",
                                    Childs: [{ Type: "text", TextValue: String(item.Extension).toLowerCase() }]
                                }
                            ]
                        }
                    ]
                }
            ], that.LinksArea);
            
            if (containerSidePadding)
                _fileArea["containerId"].style["padding" + (RV_RTL ? "Left" : "Right")] = containerSidePadding + "rem";

            if (isViewablePDF) _fileArea["showPDF"].onclick = function () { that.show_pdf(item); };

            if (that.is_downloadable(item, params)) _fileArea["download"].onclick = function () {
                that.select_cover(function (cover) {
                    cover = cover || {};

                    if (!cover.FileID) return window.open(downloadLink);

                    that.get_password(item, null, function (pass) {
                        if (pass === false) return;

                        var dlUrl = RVAPI.DownloadURL({
                            FileID: item.FileID, CoverID: cover.FileID, Meta: !!cover.FileID, Password: Base64.encode(pass)
                        });

                        GlobalUtilities.submit_form({ URL: dlUrl, Method: "post" });
                    });
                });
            };

            item.RenameProcessing = false;

            if (_fileArea["renameButtonId"]) _fileArea["renameButtonId"].onclick = function () {
                if (item.RenameProcessing) return;
                item.RenameProcessing = true;

                GlobalUtilities.load_files(["Public/NameDialog.js"], {
                    OnLoad: function () {
                        new NameDialog({
                            Title: RVDic.Name, InitialValue: fileName, InnerTitle: RVDic.Name,
                            OnActionCall: function (name, callback) {
                                if (!name) return callback(!(item.RenameProcessing = false));

                                DocsAPI.RenameFile({
                                    FileID: item.FileID, Name: Base64.encode(name), ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                        else _fileArea["fileName"].data = fileName = name;

                                        callback(!!(result || {}).Succeed);

                                        item.RenameProcessing = false;
                                    }
                                });
                            }
                        });
                    }
                });
            };

            this._initialize_options(item, _fileArea, params);
        },

        show_pdf: function (file) {
            var that = this;

            var viewers = window.__PDFViewers = window.__PDFViewers || {};

            GlobalUtilities.load_files([{ Root: "PDFViewer/", Childs: ["PDFViewer.css", "PDFViewer.js"] }], {
                OnLoad: function () {
                    if (viewers[file.FileID]) viewers[file.FileID].show();
                    else viewers[file.FileID] = new PDFViewer({
                        FileID: file.FileID,
                        Options: { Downloadable: file.Downloadable || that.Options.UnlimitedDownloadAccess }
                    });
                }
            });
        },

        select_cover: function (callback) {
            var that = this;

            if (!(that.Options.PDFCovers || []).length) return callback(null);

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold; margin-bottom:1rem; text-align:center;",
                        Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.DownloadMethod) }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                        Childs: [{}].concat(that.Options.PDFCovers).map(function (cvr) {
                            return {
                                Type: "div", Style: "margin:0.5rem 0; padding:0.5rem; text-align:center; cursor:pointer;",
                                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                                Properties: [{ Name: "onclick", Value: function () { showed.Close(); callback(cvr); } }],
                                Childs: [
                                    { Type: "text", TextValue: (cvr || {}).FileName ? RVDic.DownloadWithCover : RVDic.Download },
                                    (!(cvr || {}).FileName ? null : {
                                        Type: "div", Class: "rv-border-radius-quarter rv-air-button-base rv-air-button-black",
                                        Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.6rem;",
                                        Childs: [{ Type: "text", TextValue: Base64.decode(cvr.FileName) }]
                                    })
                                ]
                            };
                        })
                    }
                ]
            }]);

            var showed = GlobalUtilities.show(elems["container"]);
        },

        get_password: function (file, password, callback) {
            var that = this;

            if (GlobalUtilities.get_type(file.Password) == "undefined") file.Password = false;

            if (file.Password !== false) return callback(file.Password);

            if (file.PasswordProcessing) return;
            file.PasswordProcessing = true;

            GlobalUtilities.load_files(["API/PDFAPI.js", "Public/NameDialog.js"], {
                OnLoad: function () {
                    PDFAPI.GetPagesCount({
                        FileID: file.FileID, Password: Base64.encode(password), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (!result.InvalidPassword) {
                                file.PasswordProcessing = false;
                                file.Password = !password ? null : password;
                                callback(file.Password);
                            }
                            else {
                                if (password) alert(RVDic.MSG.PasswordIsNotValid);

                                var msg = RVDic.MSG.TheFileIsPasswordProtected + ". " + RVDic.MSG.EnterPasswordToOpenTheFile;

                                new NameDialog({
                                    Title: msg, InnerTitle: RVDic.Password, ModificationDetection: false,
                                    OnActionCall: function (value, done) {
                                        file.PasswordProcessing = false;
                                        done(!!value);

                                        if (value) that.get_password(file, value, callback);
                                        else callback(false);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    }
})();