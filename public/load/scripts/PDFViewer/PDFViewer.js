(function () {
    if (window.PDFViewer) return;

    window.PDFViewer = function (params) {
        params = params || {};

        this.Objects = {
            FileID: params.FileID,
            PagesCount: null,
            Container: null,
            BodyScroll: document.body.style.overflow,
            Password: false
        };
        
        var options = params.Options || {};

        this.Options = {
            Downloadable: options.Downloadable === true
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["PDFAPI", "DocsAPI"] }], {
            OnLoad: function () { that._preinit(); }
        });
    }

    PDFViewer.prototype = {
        show: function () {
            if (!this.Objects.Container) return this._preinit();

            if (this.Objects.PagesCount == 0) return;
            setTimeout(function () { document.body.style.overflow = "hidden" }, 1000);
            document.body.appendChild(this.Objects.Container["pdfViewerCover"]);
        },

        _preinit: function () {
            var that = this;

            var elems = that.__InitialLoading = that.__InitialLoading || GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-4 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:1rem; text-align:center; font-size:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Preparing + "..." }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "loading" }
                    ]
                }
            ]);

            elems["loading"].innerHTML = "";
            GlobalUtilities.loading(elems["loading"]);

            if (!GlobalUtilities.is_visible(elems["_div"])) {
                that.__InitialLoading.Showed = GlobalUtilities.show(elems["_div"], {
                    OnClose: function () { that.__InitialLoading.Closed = true; }
                });

                that.__InitialLoading.Closed = false;
            }

            that.get_password(null, function (dt) {
                if (dt === false) that.__InitialLoading.Showed.Close();
                else {
                    that.start_convert({
                        OnShow: function () {
                            var show = GlobalUtilities.is_visible(elems["_div"]);
                            that.__InitialLoading.Showed.Close();
                            that._initialize({ Show: show });
                        },
                        DoWait: function () {
                            setTimeout(function () { if (!that.__InitialLoading.Closed) that._preinit(); }, 3000);
                        },
                        OnFail: function () {
                            alert(RVDic.MSG.OperationFailed);
                            that.__InitialLoading.Showed.Close();
                        }
                    });
                }
            });
        },

        start_convert: function (options) {
            var that = this;
            options = options || {};

            var password = !that.Objects.Password ? "" : that.Objects.Password;

            if (that.ConvertProcessing) return;
            that.ConvertProcessing = true;

            var _do_wait = function () {
                that.ConvertProcessing = false;
                options.DoWait();
            };

            PDFAPI.Convert2Image({
                FileID: that.Objects.FileID, Password: Base64.encode(password), ParseResults: true,
                Options: {
                    OnTimeout: _do_wait,
                    Timeout: 10000
                },
                ResponseHandler: function (r) {
                    if ((r || {}).Status == "Ready") {
                        PDFAPI.GetPagesCount({
                            FileID: that.Objects.FileID, Password: Base64.encode(password), ParseResults: true,
                            ResponseHandler: function (result) {
                                that.Objects.PagesCount = +result.Count;
                                
                                if ((that.Objects.PagesCount > 0) && (that.Objects.PagesCount > result.ConvertedCount)) {
                                    PDFAPI.Convert2Image({
                                        FileID: that.Objects.FileID, Password: Base64.encode(password),
                                        Repair: true, ParseResults: true,
                                        ResponseHandler: function (x) { }
                                    });
                                }
                                
                                if (isNaN(that.Objects.PagesCount)) that.Objects.PagesCount = 0;
                                if (that.Objects.PagesCount > 0) {
                                    if (result.ConvertedCount) options.OnShow();
                                    else _do_wait();
                                }
                            }
                        });
                    }
                    else if ((r || {}).Status == "Processing") _do_wait();
                    else {
                        that.ConvertProcessing = false;
                        options.OnFail();
                    }
                }
            });
        },

        get_password: function (password, callback) {
            var that = this;

            if (that.Objects.Password !== false) return callback(true);

            if (that.PasswordProcessing) return;
            that.PasswordProcessing = true;

            PDFAPI.GetPagesCount({
                FileID: that.Objects.FileID, Password: Base64.encode(password), ParseResults: true,
                ResponseHandler: function (result) {
                    if (!result.InvalidPassword) {
                        that.PasswordProcessing = false;
                        that.Objects.Password = !password ? null : password;
                        callback(true);
                    }
                    else {
                        if (password) alert(RVDic.MSG.PasswordIsNotValid);
                        
                        GlobalUtilities.load_files(["Public/NameDialog.js"], {
                            OnLoad: function () {
                                var msg = RVDic.MSG.TheFileIsPasswordProtected + ". " + RVDic.MSG.EnterPasswordToOpenTheFile;

                                new NameDialog({
                                    Title: msg, InnerTitle: RVDic.Password, ModificationDetection: false,
                                    OnActionCall: function (value, done) {
                                        that.PasswordProcessing = false;
                                        done(!!value);

                                        if (value) that.get_password(value, callback);
                                        else callback(false);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        _initialize: function (options) {
            options = options || {};
            var that = this;
            var downloadAllow = that.Options.Downloadable;
            var pageNo = 1;
            var pagesCount = that.Objects.PagesCount;
            var load_first_page = false;
            //
            //**************************** Functions ***************************//
            //image_default
            var wHeight = jQuery(window).height();
            var wWidth = jQuery(window).width();
            var naturalW;
            var naturalH;
            var fitVer = wWidth - 100;
            
            //FitVertical
            function setFitVertical() {
                zoom_change(fitVer);
                var NNZR = W_to_NNZR(fitVer);
                var ZR = NNZR_to_ZR(NNZR);
                coverElems["zoomRange"].value = ZR;
                go_to_page_lazy(pageNo);
            };

            function set100Percent() {
                coverElems["zoomText"].data = GlobalUtilities.convert_numbers_to_persian("100%");
                coverElems["zoomRange"].value = 100;
                zoom_change(naturalW);
                go_to_page_lazy(pageNo);
            };

            //Image_Default
            function image_default() {
                var image = pagesElems["pdfImg1"];
                naturalW = image.naturalWidth;
                naturalH = image.naturalHeight;
                naturalW > fitVer ? setFitVertical() : set100Percent();
            };

            //set_file_path
            var set_Image_def = false;

            function set_file_path(pageNumber, imgElement) {
                imgElement.onload = function () {
                    if (!set_Image_def) {
                        image_default();
                        set_Image_def = true;
                    }
                    load_first_page = true;
                    loading = false;
                    coverElems["loadingText"].data = "";
                    if (loadingArr[0]) pagesElems["loadingImg" + loadingArr[0]].style.display = "none";
                    loadingArr.shift();
                    if (loadingArr.length > 0) {
                        loading = true;
                        coverElems["loadingText"].data = RVDic.LoadingPage + " " + loadingArr[0] + "..."; //"Loading page " + loadingArr[0] + "...";
                        set_file_path(loadingArr[0], pagesElems["pdfImg" + loadingArr[0]]);
                    }
                }
                coverElems["loadingText"].data = RVDic.LoadingPage + " " + pageNumber + "..."; //"Loading page" + pageNumber + "...";

                imgElement.setAttribute('src', PDFAPI.GetPageURL({ FileID: that.Objects.FileID, Page: pageNumber }));
            };

            // loading_img_src --> queue for loading
            var loadingArr = [];
            var loading = false;

            function loading_img_src(input) {
                if (load_first_page) {
                    if (pagesElems["pdfImg" + input].getAttribute('src') == null) {
                        if (loadingArr.length == 0) {
                            loadingArr.push(input);
                            pagesElems["loadingImg" + input].setAttribute('src', '../../images/loading_progress_bar.gif');
                        }
                        else {
                            var isExist = false;
                            for (var i = 0; i < loadingArr.length; i++) {
                                if (loadingArr[i] == input) isExist = true;
                            }
                            if (!isExist) {
                                loadingArr.push(input);
                                pagesElems["loadingImg" + input].setAttribute('src', '../../images/loading_progress_bar.gif');
                            }
                        }

                        if (!loading) {
                            set_file_path(loadingArr[0], pagesElems["pdfImg" + loadingArr[0]]);
                            loading = true;
                        }
                    }
                }
            };

            // get StyleSheet
            var sheet = (function () {
                var regexp = /pdfviewer.css/g;
                var cssArr = document.styleSheets;
                for (var i = 0; i < cssArr.length; i++) {
                    if (regexp.test(String(cssArr[i].href).toLowerCase())) return cssArr[i];
                }
                return null;
            })();

            //zoom calculation
            //ZR = coverElems["zoomRange"].value;
            //NZR = ZR dar moadele dayere
            //NNZR = NZR dar moadele sakhte shode ba maxZoom
            //W = NNZR darsade toole vaghei ax
            var maxZoom = 2000;
            var a = (maxZoom - 100) / 100;
            var b = a * 100 - 100;

            var NZR_to_NNZR = function (NZR) { return (a * NZR) - b; };
            var NNZR_to_NZR = function (NNZR) { return (NNZR + b) / a; };

            //ZR to NNZR
            var ZR_to_NNZR = function (zoomValue) {
                var zoomMax = coverElems["zoomRange"].max;
                var newZoomValue = 0;

                if (zoomValue <= 100)
                    newZoomValue = Math.pow(Math.pow(100, 2) - Math.pow(zoomValue - 100, 2), 0.5);
                else {
                    newZoomValue = zoomMax - Math.pow(Math.pow(zoomMax - 100, 2) - Math.pow(zoomValue - 100, 2), 0.5);
                    newZoomValue = NZR_to_NNZR(newZoomValue);
                }

                coverElems["zoomText"].data = GlobalUtilities.convert_numbers_to_persian(Number(newZoomValue).toFixed(0) + "%");
                return newZoomValue;
            };

            //NNZR to ZR
            var NNZR_to_ZR = function (newZoomValue) {
                var zoomMax = coverElems["zoomRange"].max;
                var zoomValue = 0;
                if (newZoomValue <= 100)
                    zoomValue = 100 - Math.pow(Math.pow(100, 2) - Math.pow(newZoomValue, 2), 0.5);
                else {
                    newZoomValue = NNZR_to_NZR(newZoomValue);
                    zoomValue = 100 + Math.pow(Math.pow(100, 2) - Math.pow(newZoomValue - zoomMax, 2), 0.5);
                }
                return zoomValue;
            };

            //NNZR to W
            var NNZR_to_W = function (newZoomValue) { return (newZoomValue / 100) * naturalW; };
            //W to NNZR
            var W_to_NNZR = function (width) {
                var NNZR = (width * 100) / naturalW;
                coverElems["zoomText"].data = GlobalUtilities.convert_numbers_to_persian(Number(NNZR).toFixed(0) + "%");
                return NNZR;
            };
            // zoom_change
            var zoomRangeValue;
            var zoomTextValue;
            function zoom_change(newWidth) {
                try {
                    sheet.cssRules[0].style.width = newWidth + "px";
                    sheet.cssRules[0].style.height = newWidth * (naturalH / naturalW) + "px";
                }
                catch (e) {
                    sheet.rules[0].style.width = newWidth + "px";
                    sheet.rules[0].style.height = newWidth * (naturalH / naturalW) + "px";
                }
            };

            function go_to_page(page) {
                if (!page) page = +coverElems["pageNo"].value;

                if (isNaN(page)) return;
                
                jQuery(coverElems["pageNo"]).blur();

                if (page <= 1) page = 1;
                else if (page > pagesCount) page = pagesCount;
                
                pageNo = page;

                coverElems["pageNo"].value = page;
                GlobalUtilities.scroll_into_view(pagesElems["imgDiv" + page], { Container: coverElems["pdfViewerCover"] });
                loading_img_src(page);
            };

            var lazyTO = null;

            function go_to_page_lazy(page) {
                if(lazyTO) clearTimeout(lazyTO);

                lazyTO = setTimeout(function () {
                    lazyTO = null;
                    if (pageNo != page) go_to_page(page);
                }, 1500);
            };

            //
            //****************   Create Elems  **************//
            // PdfViewer Cover
            var coverElems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "pdfViewerCover", Class: "PdfV_pdfViewerCover small-12-medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Name: "exit", Class: "PdfV_inputs",
                            Style: "position:fixed; cursor:pointer; " + RV_RevFloat + ":1.5rem; top:0.5rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: "X" }]
                        },
                        {
                            Type: "div", Style: "width:16rem; position:fixed;" + RV_Float + ":0px; margin-top:0px;", Class: "PdfV_inputs TextAlign Direction",
                            Childs: [{ Type: "text", Name: "loadingText", TextValue: "" }]
                        },
                        {
                            Type: "div", Name: "toolbarContainer", Class: "PdfV_toolbarContainer",
                            Childs: [
                                {
                                    Type: "div", Name: "tools", Class: "PdfV_toolbarDiv",
                                    Childs: [
                                        {
                                            Type: "div", Name: "downloadArea", Class: "PdfV_inputs",
                                            Style: "display:none; margin-" + RV_RevFloat + ":1.5rem;"
                                        },
                                        {
                                            Type: "div", Name: "100percent", Style: "cursor:pointer;", Class: "PdfV_inputs",
                                            Childs: [{ Type: "text", TextValue: "100%" }]
                                        },
                                        {
                                            Type: "div", Name: "fitVertical", Style: "cursor:pointer;", Class: "PdfV_inputs",
                                            Childs: [{ Type: "text", TextValue: "|↔|" }]
                                        },
                                        {
                                            Type: "div", Class: "PdfV_inputs",
                                            Style: "text-shadow:0rem 0rem 0rem; cursor:default; margin-" + RV_Float + ":1rem;",
                                            Childs: [{ Type: "text", Name: "zoomText" }]
                                        },
                                        {
                                            Type: "div", Name: "zoomRangeDiv", Class: "PdfV_inputs", Style: "width:10rem;",
                                            Childs: [
                                                {
                                                    Type: "input", Name: "zoomRange", Style: "width:100%; cursor:pointer;",
                                                    Attributes: [
                                                        { Name: "type", Value: "range" },
                                                        { Name: "id", Value: "zoomRange" },
                                                        { Name: "min", Value: "1" },
                                                        { Name: "max", Value: "200" },
                                                        { Name: "step", Value: "0.1" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Name: "previous", Class: "PdfV_inputs",
                                            Style: "cursor:pointer; margin-" + RV_Float + ":2rem;",
                                            Childs: [{ Type: "text", TextValue: (RV_RTL ? "►" : "◄") }]
                                        },
                                        {
                                            Type: "div", Name: "pageNoDiv", Class: "PdfV_inputs",
                                            Childs: [
                                                {
                                                    Type: "number", Class: "rv-input", Name: "pageNo",
                                                    Style: "text-align:center; width:4rem; padding:0.1rem 0rem; font-size:0.6rem;",
                                                    Properties: [{ Name: "value", Value: "1" }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "PdfV_inputs",
                                            Style: "text-shadow: 0px 0px 0px; cursor:default;",
                                            Childs: [{ Type: "text", TextValue: RVDic.From }]
                                        },
                                        {
                                            Type: "div", Class: "PdfV_inputs",
                                            Style: "text-shadow: 0px 0px 0px; cursor:default;",
                                            Childs: [{ Type: "text", Name: "of" }]
                                        },
                                        {
                                            Type: "div", Name: "next", Class: "PdfV_inputs", Style: "cursor:pointer;",
                                            Childs: [{ Type: "text", TextValue: (RV_RTL ? "◄" : "►") }]
                                        },
                                        {
                                            Type: "div", Name: "go", Class: "PdfV_inputs",
                                            Style: "cursor:pointer; margin-" + RV_Float + ":1rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Go }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]);

            that.Objects.Container = coverElems;

            // Create Pages Elems
            var pages = [];
            for (var i = 1; i <= pagesCount; i++) {
                pages.push({
                    Type: "div", Name: "imgDiv" + i, Class: "PdfV_imgDiv",
                    Childs: [
                        {
                            Type: "div", Name: "pdfImgDiv" + i,
                            Childs: [{
                                Type: "img", Name: "pdfImg" + i, Class: "PdfV_pdfImg",
                                Properties: [{ Name: "onload", Value: i == 1 ? function () { image_default(); } : null }]
                            }]
                        },
                        {
                            Type: "div", Name: "loadingImgDiv" + i, Class: "PdfV_loadingImgDiv",
                            Childs: [{ Type: "img", Name: "loadingImg" + i }]
                        }
                    ]
                });
            }

            var pagesElems = GlobalUtilities.create_nested_elements(pages, coverElems["pdfViewerCover"]);

            // Download Link
            if (downloadAllow) {
                coverElems["downloadArea"].style.display = "inline-block";

                var downloadElem = GlobalUtilities.create_nested_elements([
                    {
                        Type: "i", Class: "fa fa-download fa-lg", Style: "cursor:pointer; color:#cccc",
                        Link: DocsAPI.GetDownloadLink({ FileID: that.Objects.FileID }),
                        Attributes: [{ Name: "aria-hidden", Value: true }]
                    }
                ], coverElems["downloadArea"]);
            }

            //*********************** Default ***********************//
            coverElems["of"].data = GlobalUtilities.convert_numbers_to_persian(pagesCount);
            
            go_to_page(1);
            set_file_path(1, pagesElems["pdfImg1"]);

            try { sheet.rules[1].style.cursor = "url(cursor/openhand.cur), auto"; }
            catch (e) { sheet.cssRules[1].style.cursor = "url(cursor/openhand.cur), auto"; }

            //
            //********************  Events  ************************//
            //close
            coverElems["exit"].onclick = function () {
                pageNo = 1;
                coverElems["pageNo"].value = pageNo;
                document.body.style.overflow = that.Objects.BodyScroll;
                coverElems["pdfViewerCover"].parentNode.removeChild(coverElems["pdfViewerCover"]);
            };

            // next page
            coverElems["next"].onclick = function () {
                pageNo = pageNo < pagesCount ? pageNo + 1 : pagesCount;
                go_to_page(pageNo);
            };

            // previous page
            coverElems["previous"].onclick = function () {
                pageNo = pageNo > 1 ? pageNo - 1 : 1;
                go_to_page(pageNo);
            };

            // Go to page
            coverElems["go"].onclick = go_to_page;
            GlobalUtilities.set_onenter(coverElems["pageNo"], go_to_page);
            jQuery(coverElems["pageNo"]).focus(function () { jQuery(coverElems["pageNo"]).select(); });

            //zoomRange
            coverElems["zoomRange"].onchange = coverElems["zoomRange"].oninput = function () {
                var NNZR = ZR_to_NNZR(coverElems["zoomRange"].value);
                var W = NNZR_to_W(NNZR);
                zoom_change(W);
                go_to_page_lazy(pageNo);
            };

            //FitVertical
            coverElems["fitVertical"].onclick = setFitVertical;

            //100percent
            coverElems["100percent"].onclick = set100Percent;
            jQuery(coverElems["pageNoDiv"]).mousedown(function (e) {
                e.stopImmediatePropagation();
            });

            jQuery(coverElems["zoomRangeDiv"]).mousedown(function (e) {
                e.stopImmediatePropagation();
            });

            //Load pages & Change pages number on Scrolling
            var previousScroll = 0;

            jQuery(coverElems["pdfViewerCover"]).scroll(function () {
                var docScrollTop = GlobalUtilities.scrolltop(document.body);
                var currentScroll = GlobalUtilities.scrolltop(coverElems["pdfViewerCover"]);
                var wHeight = jQuery(window).height();

                //container.sTop = container.sTop - doc.sTop + elem.offsetTop

                for (var p = 1; p <= pagesCount; p++) {
                    var imgDivX = "imgDiv" + p;
                    var offsetTop = jQuery(pagesElems[imgDivX]).offset().top - docScrollTop;
                    var pageHeight = jQuery(pagesElems[imgDivX]).height();
                    var movedDown = currentScroll >= previousScroll;

                    if (movedDown) {
                        if ((offsetTop <= wHeight) && (offsetTop >= 0) && (pageNo != p)) loading_img_src(p);

                        if ((offsetTop <= wHeight) && ((offsetTop < (wHeight / 2)) || (pageHeight < (wHeight / 2))) &&
                            (offsetTop >= 0) && (pageNo != p)) {
                            pageNo = p;
                            coverElems["pageNo"].value = pageNo;
                        }
                    }
                    else {
                        if ((offsetTop > 0) && (offsetTop < wHeight) && (pageNo != (p - 1)) && (p > 1)) loading_img_src(pageNo);

                        if ((offsetTop > 0) && ((offsetTop > (wHeight / 2)) || (pageHeight < (wHeight / 2))) &&
                            (offsetTop < wHeight) && (pageNo != (p - 1)) && (p > 1)) {
                            pageNo = p - 1;
                            coverElems["pageNo"].value = pageNo;
                        }
                    }
                }

                previousScroll = currentScroll;
            });

            // move pages with hand 
            var draged = false;
            var lastMouseY = 0;
            var lastMouseX = 0;

            jQuery(coverElems["pdfViewerCover"]).mousedown(function (event) {
                event.preventDefault();
                draged = true;
                lastMouseY = event.pageY;
                lastMouseX = event.pageX;
                try {
                    sheet.rules[1].style.cursor = "url(cursor/closedhand.cur), move";
                }
                catch (e) {
                    sheet.cssRules[1].style.cursor = "url(cursor/closedhand.cur), move";
                }
            });

            jQuery(coverElems["pdfViewerCover"]).mouseup(function (event) {
                draged = false;
                lastMouseY = event.pageY;
                lastMouseX = event.pageX;
                try { sheet.rules[1].style.cursor = "url(cursor/openhand.cur), auto"; }
                catch (e) { sheet.cssRules[1].style.cursor = "url(cursor/openhand.cur), auto"; }
            });

            function drag(event) {
                event.preventDefault();
                if (draged) {
                    var offset = jQuery(coverElems["pdfViewerCover"]).offset();
                    var currentMouseY = event.pageY;
                    var currentMouseX = event.pageX;
                    var coverPositionTop = jQuery(coverElems["pdfViewerCover"]).scrollTop();
                    var coverPositionLeft = jQuery(coverElems["pdfViewerCover"]).scrollLeft();
                    var coverCurrentPosY = coverPositionTop - (currentMouseY - lastMouseY);
                    var coverCurrentPosX = coverPositionLeft - (currentMouseX - lastMouseX);
                    jQuery(coverElems["pdfViewerCover"]).scrollTop(coverCurrentPosY);
                    jQuery(coverElems["pdfViewerCover"]).scrollLeft(coverCurrentPosX);
                    lastMouseY = currentMouseY;
                    lastMouseX = currentMouseX;
                    try { sheet.rules[1].style.cursor = "url(cursor/closedhand.cur), move"; }
                    catch (e) { sheet.cssRules[1].style.cursor = "url(cursor/closedhand.cur), move"; }
                }
            }
            for (var p = 1; p <= pagesCount; p++) {
                pagesElems["pdfImg" + p].onmousemove = function (e) { drag(e); }
            }

            //*********************   shortcuts!!! :)   **************//
            document.onkeyup = function (e) {
                e.preventDefault();
                switch (e.which) {
                    case 34: // next (e.which == Page down)
                        pageNo++;
                        pageNo <= pagesCount ? go_to_page(pageNo) : pageNo--;
                        break;
                    case 33: // previous (e.which == Page up)
                        pageNo--;
                        pageNo >= 1 ? go_to_page(pageNo) : pageNo++;
                        break;
                    case 35: //(e.which == End)
                        pageNo = pagesCount;
                        go_to_page(pageNo);
                        break;
                    case 36: //(e.which == Home)
                        pageNo = 1;
                        go_to_page(pageNo);
                        break;
                    case 27: //(e.which == Esc)
                        pageNo = 1;
                        coverElems["pageNo"].value = pageNo;
                        document.body.style.overflow = that.Objects.BodyScroll;
                        coverElems["pdfViewerCover"].parentNode.removeChild(coverElems["pdfViewerCover"]);
                        break;
                }
            };

            if (options.Show) that.show();
        }
    }
})();
;