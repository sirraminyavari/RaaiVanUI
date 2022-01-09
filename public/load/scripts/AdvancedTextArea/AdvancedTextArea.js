(function () {
    if (window.AdvancedTextArea) return;

    var TagTemplates = {
        get_url: function (tag) {
            var type = String(tag.Type).toLowerCase();
            if (type == "get_url" || !(TagTemplates[type] || {}).get_url) return false;
            else return TagTemplates[type].get_url(tag);
        },

        jiva: {
            Labels: { ID: "", Title: "" },
            get_url: function (tag) {
                //var str1 = Base64.decode("2K/Ys9iq2YjYsdin2YTYudmF2YQg2YfYp9uMINis2KfZhdi5");
                var str1 = Base64.decode("2K/Ys9iq2YjYsdin2YTYudmF2YQg2YfYpw==");
                var str2 = Base64.decode("2LPYsdmK2KfZhA==");
                //var str3 = Base64.decode("2YXYqtmGINiv2LPYqtmI2LHYp9mE2LnZhdmEINmG2YfYp9mK2Yo=");
                var str3 = Base64.decode("2YXYqtmGINiv2LPYqtmI2LHYp9mE2LnZhdmE");
                return "http://172.50.251.172/jiva-ws-client/showattachments?container=" + str1 + "&fields=" + str2 + "&values=" + tag.ID + "&category=" + str3;
            }
        }
    }

    window.AdvancedTextArea = function (params) {
        params = params || {};

        this.ContainerDiv = typeof (params.ContainerDiv) == "object" ? params.ContainerDiv : document.getElementById(params.ContainerDiv || "");
        if (this.ContainerDiv == null) return;

        //This Fake Code Works!
        this.__MainContainer = this.ContainerDiv;
        this.__FakeContainer = document.createElement("div");
        this.ContainerDiv = this.__FakeContainer;
        //end of Fake Code

        //Initialize Instance
        this.InstanceID = this.generate_new_guid();
        if (!AdvancedTextArea.Instances) AdvancedTextArea.Instanses = [];
        AdvancedTextArea.Instanses[this.InstanceID] = this;
        //end of Instance Initialization

        this.DefaultTagType = params.DefaultTagType;

        this.Objects = {
            TextArea: null
        };

        //Interface Initialization
        var elems = GlobalUtilities.create_nested_elements([{
            Type: "div", Class: "textntags-wrapper", Style: params.Style,
            Childs: [
                {
                    Type: "textarea", ID: "t" + this.generate_new_guid(), Class: params.InputClass || "rv-input",
                    Style: "min-height: 37px;", InnerTitle: params.DefaultText ? params.DefaultText : "", Name: "textInput"
                },
                { Type: "div", Class: "textntags-tag-list" }
            ]
        }], this.ContainerDiv);

        this.Objects.TextArea = elems["textInput"];
        //end of Interface Initialization

        this.initialize(params);
    }

    AdvancedTextArea.prototype = {
        generate_new_guid: function () {
            var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).toUpperCase().substring(1); }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        initialize: function (params) {
            params = params || {};

            var that = this;

            var init = function () {
                var itemTemplate = params.ItemTemplate || {};
                var strItemsTitle = itemTemplate.ItemsTitle;
                var strId = itemTemplate.ID;
                var strName = itemTemplate.Name;
                var strImageURL = itemTemplate.ImageURL;
                var strType = itemTemplate.Type;
                var strNodeType = "NodeType";

                var queryTemplate = params.QueryTemplate || {};
                if ((GlobalUtilities.get_type(queryTemplate) == "string") && (queryTemplate.toLowerCase() == "relatedthings"))
                    queryTemplate = { RequestURL: RVAPI.SuggestTags(), SearchText: "SearchText" };

                var requestURL = queryTemplate.RequestURL || "";
                var strSearchText = queryTemplate.SearchText || "";

                var defaultTagType = that.DefaultTagType;

                var __searchedItems = [];
                var __previousResults = [];

                var minChars = +params.MinChars;
                if (isNaN(minChars)) minChars = 2;
                
                jQuery(that.Objects.TextArea).textntags({
                    triggers: { '@': { uniqueTags: false, minChars: minChars } },
                    onDataRequest: function (mode, query, triggerChar, callback) {
                        query = query.toLowerCase();
                        var queryParams = jQuery.parseJSON('{"' + strSearchText + '":"' + Base64.encode(query) + '"}');

                        var _pr = __previousResults[query];

                        for (var i = 0, lnt = __searchedItems.length; i < lnt; ++i) {
                            var _si = __searchedItems[i];
                            if (String(query).match(new RegExp('^' + _si))) {
                                _pr = __previousResults[__searchedItems[i]] || [];
                                if (_pr.length > 9 && query != _si) _pr = null;
                            }
                        }

                        if (_pr) {
                            var __data = _.filter(_pr, function (item) { return item.name.toLowerCase().indexOf(query) > -1; });
                            callback.call(this, __data);
                            return;
                        }
                        
                        jQuery.getJSON(requestURL, queryParams, function (responseData) {
                            var resultsArray = responseData[strItemsTitle] || [];

                            var items = resultsArray.map(function (val) {
                                var nt = Base64.decode(val[strNodeType]);

                                return {
                                    id: val[strId],
                                    name: Base64.decode(val[strName]) + (nt ? " (" + nt + ")" : ""),
                                    avatar: val[strImageURL],
                                    type: val[strType] || defaultTagType
                                };
                            });

                            __searchedItems.push(query);
                            __previousResults[query] = items;
                            
                            responseData = _.filter(items, function (item) { return item.name.toLowerCase().indexOf(query) > -1; });
                            callback.call(this, responseData);
                        });
                    }
                });

                //This Fake Code Works!
                that.__MainContainer.appendChild(that.ContainerDiv);
                that.ContainerDiv = that.__MainContainer;
                that.set_data(that.get_data());
                //end of Fake Code

                if (params.OnKeyDown) {
                    jQuery(that.Objects.TextArea).bind('keydown.textntags', function (e) {
                        setTimeout(function () { params.OnKeyDown(e); }, 0);
                        return true;
                    });
                }

                if (params.OnLoad) params.OnLoad.call(that, params.LoadParams);
            } //end of init

            GlobalUtilities.load_files([
                "API/CNAPI.js"
                //the files below are already included in the page
                //,"Lib/underscore.min.js",
                //{ Root: "jQuery/", Childs: ["jquery.min.js", { Root: "TextNTags/", Childs: ["jquery-textntags.css", "jquery-textntags.min.js"] }] }
            ], { OnLoad: init, LoadSequential: true });
        },

        textarea: function () {
            return this.Objects.TextArea;
        },

        clear: function () {
            try { jQuery(this.Objects.TextArea).textntags('reset'); } catch (e) { }
        },

        get_data: function () {
            var _text = null;
            jQuery(this.Objects.TextArea).textntags('val', function (txt) { _text = txt; });
            return _text;
        },

        set_data: function (data) {
            jQuery(this.Objects.TextArea).textntags('val', data);
        },

        get_plain_text: function () {
            var _text = null;
            jQuery(this.Objects.TextArea).textntags('parseTaggedText', this.get_data(), function (data) { _text = data.plain_text; });
            return _text;
        },

        urlify: function (text) {
            var reg = /((([hH][tT][tT][pP][sS]?)|([fF][tT][pP])):\/\/[^\s<>]+)(?=[<>\s\t\b\r]+)/g;

            return GlobalUtilities.trim(String((text || " ") + " ").replace(reg, function (url) {
                return "@[[Link:Link:" + Base64.encode(url) + ":" + Base64.encode("{\"href\":\"" + Base64.encode(url) + "\"}") + "]]";
            }));
        },

        emotify: function (text) {
            text = (text || " ") + " ";

            for (var em in RVEmoticons) {
                if (!(RVEmoticons[em] || {}).Tag) continue;

                var isOdd = /^:[A-Za-z0-9]/gi.test(em.substr(0, 2));

                var reg = new RegExp(GlobalUtilities.escape4regexp(em) + (isOdd ? "(?=[\\s\\t\\b\\r]+)" : ""), "gi");
                text = text.replace(reg, RVEmoticons[em].Tag);
            }

            return GlobalUtilities.trim(text);
        },

        replace_markups: function (params) {
            params = params || {};

            var ignoreBreaks = params.IgnoreBreaks === true;
            var ignoreUrls = params.IgnoreURLs === true;
            var options = params.Options || {};

            var _text = null;

            var _t = ignoreUrls ? params.MarkedUpText || this.get_data() : this.urlify(params.MarkedUpText || this.get_data());
            if (_t) _t = this.emotify(_t);
            _t = ignoreBreaks ? String(_t || "") : GlobalUtilities.secure_string(_t || "");

            var tagsArr = [];
            
            jQuery(this.Objects.TextArea).textntags('parseTaggedText', _t, function (data) {
                var plainText = String(data.plain_text);
                var _tags = data.tagsCollection || [];

                for (var i = _tags.length - 1; i >= 0; --i) {
                    var startIndex = _tags[i][0];
                    var _lnt = _tags[i][1];
                    var _id = (_tags[i][3] || {}).id || "";
                    var _type = (_tags[i][3] || {}).type || "";
                    var _info = Base64.decode((_tags[i][3] || {}).info || Base64.encode("{}"));
                    _info = !_info || _info[0] != "{" ? {} : JSON.parse(_info);
                    var _name = (_tags[i][3] || {}).name || "";

                    if (_tags[i][3]) tagsArr.push(_tags[i][3]);

                    var _preText = plainText.substr(0, startIndex);
                    var taggedItem = plainText.substr(startIndex, _lnt);
                    var _postText = plainText.substring(startIndex + _lnt, plainText.length);

                    plainText = _preText + AdvancedTextArea.tag2plainhtml(_id, _type, taggedItem, _info, options) + _postText;
                }

                while (plainText.indexOf("\n") >= 0 && ignoreBreaks !== true)
                    plainText = plainText.replace("\n", "<br/>");

                _text = plainText;
            });

            if (params.Done) params.Done(_text, { Tags: tagsArr });

            return _text;
        },

        get_text_dom: function (params) {
            params = params || {};

            var ignoreBreaks = params.IgnoreBreaks === true;

            var _text = null;

            jQuery(this.Objects.TextArea).textntags('parseTaggedText', this.emotify(this.urlify(params.MarkedUpText || this.get_data())), function (data) {
                var plainText = String(data.plain_text || "");
                var _tags = data.tagsCollection || [];

                var elements = [];

                var _parseText = function (preText) {
                    var preItems = [];
                    while (true) {
                        var _brIndex = preText.indexOf("\n");
                        if (_brIndex < 0 || ignoreBreaks === true) {
                            preItems.push(document.createTextNode(preText));
                            break;
                        }

                        if (_brIndex > 0) preItems.push(document.createTextNode(preText.substr(0, _brIndex)));
                        preItems.push(document.createElement("br"));

                        var endIndex = preText.length;
                        if (_brIndex == endIndex - 1) break;

                        preText = preText.substring(_brIndex + 1, endIndex);
                    }

                    for (var j = 0, count = preItems.length; j < count; ++j)
                        elements.push(preItems[j]);
                }

                var startIndex = 0;
                for (var i = 0, lnt = _tags.length; i < lnt; ++i) {
                    var _tagStart = _tags[i][0];
                    var _tagLength = _tags[i][1];
                    var _tagId = (_tags[i][3] || {}).id || "";
                    var _tagType = (_tags[i][3] || {}).type || "";

                    var preText = plainText.substr(startIndex, _tagStart - startIndex);
                    var taggedString = plainText.substr(_tagStart, _tagLength);

                    var taggedItem = AdvancedTextArea.tag2htmldom(_tagId, _tagType, taggedString);

                    _parseText(preText);
                    elements.push(taggedItem);

                    startIndex = _tagStart + _tagLength;
                }

                _parseText(plainText.substr(startIndex, plainText.length - startIndex));

                _text = document.createElement("div");
                for (var i = 0, lnt = elements.length; i < lnt; ++i)
                    _text.appendChild(elements[i]);
            });

            return _text;
        }
    }

    AdvancedTextArea.replace_markups = function (markedUpText, params) {
        if (!AdvancedTextArea.RelatedTextArea) AdvancedTextArea.RelatedTextArea =
            new AdvancedTextArea({ ContainerDiv: document.createElement("div") });
        params = params || {};
        params.MarkedUpText = markedUpText;
        return AdvancedTextArea.RelatedTextArea.replace_markups(params);
    }

    AdvancedTextArea.get_text_dom = function (markedUpText, params) {
        if (!AdvancedTextArea.RelatedTextArea) AdvancedTextArea.RelatedTextArea =
            new AdvancedTextArea({ ContainerDiv: document.createElement("div") });
        params = params || {};
        params.MarkedUpText = markedUpText;
        return AdvancedTextArea.RelatedTextArea.get_text_dom(params);
    }

    AdvancedTextArea.get_markup = function (tag) {
        tag = tag || {};
        return "@[[" + (tag.ID || "") + ":" + (tag.Type || "") + ":" + (Base64.encode(tag.Value || "")) + (tag.Info ? ":" + tag.Info : "") + "]]";
    }

    AdvancedTextArea.get_tags = function (text, callback) {
        if (!AdvancedTextArea.RelatedTextArea) AdvancedTextArea.RelatedTextArea =
            new AdvancedTextArea({ ContainerDiv: document.createElement("div") });
        
        var arr = [];

        jQuery(AdvancedTextArea.RelatedTextArea).textntags('parseTaggedText', text, function (data) {
            jQuery.each(data.tagsCollection || [], function (ind, val) {
                var id = (val[3] || {}).id || "";
                var type = (val[3] || {}).type || "";
                var info = Base64.decode((val[3] || {}).info || Base64.encode("{}"));
                info = !info || (info[0] != "{") ? {} : JSON.parse(info);
                var name = (val[3] || {}).name || "";

                arr.push({ ID: id, Type: type, Value: Base64.decode(name), Info: info });
            });

            callback(arr);
        });
    }

    AdvancedTextArea.get_url = function (tag) {
        tag = tag || {};

        var _type = String(tag.Type).toLowerCase();

        var turl = TagTemplates.get_url(tag);
        if (turl) return turl;
        
        switch (_type) {
            case "user":
                return RVAPI.UserPageURL({ UserID: tag.ID });
            case "node":
            case "knowledge":
                return RVAPI.NodePageURL({ NodeID: tag.ID });
            case "question":
                return RVAPI.QuestionPageURL({ QuestionID: tag.ID });
            case "link":
                return GlobalUtilities.uri_decode(tag.Value);
            default:
                return "";
        }
    }

    var __RV_PDF_VIEWER_OBJECTS = {
        Processing: false,
        FileViewers: {}
    }

    var __RV_PDF_VIEWER = function (e, fileId) {
        if (__RV_PDF_VIEWER_OBJECTS.Processing) return;
        __RV_PDF_VIEWER_OBJECTS.Processing = true;

        GlobalUtilities.load_files([{ Root: "PDFViewer/", Childs: ["PDFViewer.css", "PDFViewer.js"] }], {
            OnLoad: function () {
                __RV_PDF_VIEWER_OBJECTS.Processing = false;

                if (__RV_PDF_VIEWER_OBJECTS.FileViewers[fileId])
                    __RV_PDF_VIEWER_OBJECTS.FileViewers[fileId].show();
                else __RV_PDF_VIEWER_OBJECTS.FileViewers[fileId] = new PDFViewer({
                    FileID: fileId, Options: { Downloadable: true }
                });
            }
        });
    };

    var __RV_IMG_VIEWER = function (e, fileId) {
        GlobalUtilities.show_image(DocsAPI.GetDownloadLink({ FileID: fileId || "" }), e);
    };

    AdvancedTextArea.tag2plainhtml = function (id, type, value, info, options) {
        info = info || {};
        options = options || {};

        var _ele = null;
        
        switch (type.toLowerCase()) {
            case "dic":
                return RVDic[value] || value;
            case "helpitem":
                var titleArr = HelpUtils.get_title(id);

                var str = "";

                for (var i = 0; i < titleArr.length; ++i) {
                    str += titleArr[i] + (i == titleArr.length - 1 ? "" :
                        "<span style='margin:0.4rem;'>" + (RV_RTL ? ">" : "<") + "</span>");
                }

                var eventFuncName = "r" + GlobalUtilities.generate_new_guid();
                window[eventFuncName] = function (e) { GlobalUtilities.help_request(e, id); };
                
                if (options.EditorMode) {
                    return '<span class="rv-border-radius-quarter" data-RV_TagID="' + id + '" ' +
                            'data-RV_TagType="HelpItem" data-RV_TagValue="val" style="background-color:rgb(220,220,220); ' +
                            'padding:0.3rem; font-size:0.7rem; font-weight:bold;">' + str + '</span><span>&nbsp;</span>';
                }

                _ele = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "_div",
                        Childs: [
                            {
                                Type: "span", Class: "rv-border-radius-quarter rv-air-button RV_EventFunc", Name: "spn",
                                Style: "font-size:0.7rem; font-weight:bold;",
                                Attributes: [
                                    { Name: "RV_EventName", Value: "onclick" },
                                    { Name: "RV_EventFuncName", Value: eventFuncName },
                                    { Name: "data-RV_TagID", Value: id },
                                    { Name: "data-RV_TagType", Value: type },
                                    { Name: "data-RV_TagValue", Value: Base64.encode(value) }
                                ]
                            }
                        ]
                    }
                ]);

                _ele["spn"].innerHTML = str;

                return _ele["_div"].innerHTML;
            case "file":
                var _fileExt = (info.Extension || "").toString().toLowerCase();

                if (_fileExt == 'jpg' || _fileExt == 'jpeg' || _fileExt == 'png' || _fileExt == 'gif') {
                    var eventFuncName = "r" + GlobalUtilities.generate_new_guid();
                    window[eventFuncName] = function (e) { __RV_IMG_VIEWER(e, id); };

                    _ele = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Name: "_div",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-half RV_EventFunc",
                                    Style: "max-width:100%;" +  (info.W ? "width:" + info.W + "px;" : "") +
                                        (info.H ? "height:" + info.H + "px;" : "") + "margin-top:0.5rem; cursor:pointer;",
                                    //Style: "width:" + (info.W || 100) + "px; height:" + (info.H || 100) + "px;" +
                                    //    "margin-top:0.5rem;",
                                    Attributes: [
                                        { Name: "src", Value: DocsAPI.GetDownloadLink({ FileID: id || "" }) },
                                        { Name: "RV_EventName", Value: "onclick" },
                                        { Name: "RV_EventFuncName", Value: eventFuncName },
                                        { Name: "data-RV_TagID", Value: id },
                                        { Name: "data-RV_TagType", Value: type },
                                        { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                        { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                    ]
                                }
                            ]
                        }
                    ]);
                }
                else if (_fileExt == "pdf" && ((window.RVGlobal || {}).Modules || {}).PDFViewer) {
                    var eventFuncName = "r" + GlobalUtilities.generate_new_guid();
                    window[eventFuncName] = function (e) { __RV_PDF_VIEWER(e, id); }

                    _ele = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Name: "_div",
                            Childs: [
                                {
                                    Type: "label", Class: "RV_EventFunc", Name: "fileTag", Style: "color:blue; cursor:pointer;",
                                    Attributes: [
                                        { Name: "RV_EventName", Value: "onclick" },
                                        { Name: "RV_EventFuncName", Value: eventFuncName },
                                        { Name: "data-RV_TagID", Value: id },
                                        { Name: "data-RV_TagType", Value: type },
                                        { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                        { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                    ]
                                },
                                { Type: "span", Name: "_whiteSpace" }
                            ]
                        }
                    ]);

                    _ele["_whiteSpace"].innerHTML = "&nbsp;";
                    _ele["fileTag"].innerHTML = GlobalUtilities.uri_decode(value);
                }
                else {
                    _ele = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Name: "_div",
                            Childs: [
                                {
                                    Type: "a", Name: "fileTag", Style: "color:blue; cursor:pointer;",
                                    Attributes: [
                                        { Name: "href", Value: DocsAPI.GetDownloadLink({ FileID: id || "" }) },
                                        { Name: "data-RV_TagID", Value: id },
                                        { Name: "data-RV_TagType", Value: type },
                                        { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                        { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                    ]
                                },
                                { Type: "span", Name: "_whiteSpace" }
                            ]
                        }
                    ]);

                    _ele["_whiteSpace"].innerHTML = "&nbsp;";
                    _ele["fileTag"].innerHTML = GlobalUtilities.uri_decode(value);
                }

                return _ele["_div"].innerHTML;
            case "emoticon":
                return "<img style='width:1rem; height:1rem;' alt='((" + value +
                    "))' src='" + GlobalUtilities.icon("Emoticons/" + value + ".png") + "'/>";
            default:
                var lbl = GlobalUtilities.uri_decode(value) || (type == "Link" ? Base64.decode(info.href) : "");
                var link = type == "Link" ? Base64.decode(info.href) || GlobalUtilities.uri_decode(value) :
                    AdvancedTextArea.get_url({ ID: id, Type: type, Value: value });

                var eventFuncName = type != "Link" ? null : "r" + GlobalUtilities.random_str(20);
                if (eventFuncName) window[eventFuncName] = function (e) { window.open(link); return false; };

                _ele = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "_div",
                        Childs: [
                            {
                                Type: "a", Class: (!eventFuncName ? "" : "RV_EventFunc"), Name: "_aTag",
                                Style: "color:blue; cursor:pointer;",
                                Attributes: [
                                    { Name: "href", Value: link },
                                    { Name: "RV_EventName", Value: "onclick" },
                                    { Name: "RV_EventFuncName", Value: eventFuncName },
                                    { Name: "data-RV_TagID", Value: id },
                                    { Name: "data-RV_TagType", Value: type },
                                    { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                    { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                ],
                                Childs: [{ Type: "text", TextValue: " " + lbl + " " }]
                            }
                        ]
                    }
                ]);

                return _ele["_div"].innerHTML;
        }
    }

    AdvancedTextArea.tag2htmldom = function (id, type, value, info) {
        info = info || {};
        
        switch (type.toLowerCase()) {
            case "dic":
                return document.createTextNode(value);
            case "file":
                var _ele = null;
                var _fileExt = (info.Extension || "").toString().toLowerCase();

                if (_fileExt == 'jpg' || _fileExt == 'jpeg' || _fileExt == 'png' || _fileExt == 'gif') {
                    _ele = GlobalUtilities.create_nested_elements([
                        {
                            Type: "label", Name: "_div",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-half",
                                    Style: "max-width:100%;" +  (info.W ? "width:" + info.W + "px;" : "") +
                                        (info.H ? "height:" + info.H + "px;" : "") + "margin-top:0.5rem; cursor:pointer;",
                                    //Style: "width:" + (info.W || 100) + "px; height:" + (info.H || 100) + "px;" +
                                    //    "margin-top:0.5rem;",
                                    Attributes: [
                                        { Name: "src", Value: DocsAPI.GetDownloadLink({ FileID: id || "" }) },
                                        { Name: "data-RV_TagID", Value: id },
                                        { Name: "data-RV_TagType", Value: type },
                                        { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                        { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                    ],
                                    Properties: [{ Name: "onclick", Value: function (e) { __RV_IMG_VIEWER(e, id); } }]
                                }
                            ]
                        }
                    ]);
                }
                else if (_fileExt == "pdf" && ((window.RVGlobal || {}).Modules || {}).PDFViewer) {
                    _ele = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Name: "_div",
                            Childs: [
                                {
                                    Type: "label", Name: "fileTag", Style: "color:blue; cursor:pointer;",
                                    Attributes: [
                                        { Name: "data-RV_TagID", Value: id },
                                        { Name: "data-RV_TagType", Value: type },
                                        { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                        { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                    ],
                                    Properties: [{ Name: "onclick", Value: function (e) { __RV_PDF_VIEWER(e, id); } }]
                                },
                                { Type: "span", Name: "_whiteSpace" }
                            ]
                        }
                    ]);

                    _ele["_whiteSpace"].innerHTML = "&nbsp;";
                    _ele["fileTag"].innerHTML = GlobalUtilities.uri_decode(value);
                }
                else {
                    _ele = GlobalUtilities.create_nested_elements([
                        {
                            Type: "label", Name: "_div",
                            Childs: [
                                {
                                    Type: "a", Name: "fileTag", Style: "color:blue; cursor:pointer;",
                                    Attributes: [
                                        { Name: "href", Value: DocsAPI.GetDownloadLink({ FileID: id || "" }) },
                                        { Name: "data-RV_TagID", Value: id },
                                        { Name: "data-RV_TagType", Value: type },
                                        { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                        { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                    ]
                                },
                                { Type: "span", Name: "_whiteSpace" }
                            ]
                        }
                    ]);

                    _ele["_whiteSpace"].innerHTML = "&nbsp;";
                    _ele["fileTag"].innerHTML = GlobalUtilities.uri_decode(value);
                }

                return _ele["_div"];
            case "emoticon":
                return GlobalUtilities.create_nested_elements([
                    {
                        Type: "img", Name: "_img", Style: "width:1rem; height:1rem;",
                        Attributes: [
                            { Name: "alt", Value: "((" + value + "))" },
                            { Name: "src", Value: GlobalUtilities.icon("Emoticons/" + value + ".png") }
                        ]
                    }
                ])["_img"];
            default:
                var lbl = GlobalUtilities.uri_decode(value) || (type == "Link" ? Base64.decode(info.href) : "");
                var link = type == "Link" ? Base64.decode(info.href) || GlobalUtilities.uri_decode(value) :
                    AdvancedTextArea.get_url({ ID: id, Type: type, Value: value });

                var eventFuncName = type != "Link" ? null : "r" + GlobalUtilities.random_str(20);
                if (eventFuncName) window[eventFuncName] = function (e) { window.open(link); return false; };

                return GlobalUtilities.create_nested_elements([
                    {
                        Type: "label", Name: "_div",
                        Childs: [
                            {
                                Type: "a", Class: (!eventFuncName ? "" : "RV_EventFunc"), Name: "_aTag",
                                Style: "color:blue; cursor:pointer;",
                                Attributes: [
                                    { Name: "href", Value: link },
                                    { Name: "RV_EventName", Value: "onclick" },
                                    { Name: "RV_EventFuncName", Value: eventFuncName },
                                    { Name: "data-RV_TagID", Value: id },
                                    { Name: "data-RV_TagType", Value: type },
                                    { Name: "data-RV_TagValue", Value: Base64.encode(value) },
                                    { Name: "data-RV_TagInfo", Value: Base64.encode(JSON.stringify(info)) }
                                ],
                                Childs: [{ Type: "text", TextValue: " " + lbl + " " }]
                            }
                        ]
                    }
                ])["_div"];
        }
    }

    window.RVEmoticons = {
        "((smiley))": "smiley", "((smile))": "smiley", //":)": "smiley", ":-)": "smiley",
        "((happy))": "happy",
        "((laugh))": "laugh",
        "((teeth))": "teeth", "((bigsmile))": "teeth", //":d": "teeth", ":D": "teeth", ":-d": "teeth", ":-D": "teeth",
        "((sad))": "sad", //":(": "sad", ":-(": "sad",
        "((depressed))": "depressed",
        "((cry))": "cry", "((crying))": "cry", //";-(": "cry", ";(": "cry", ":'-(": "cry", ":'(": "cry", ";-(": "cry",
        "((wink))": "wink", //";)": "wink", ";-)": "wink",
        "((clap))": "clap", "((clapping))": "clap",
        "((nerd))": "nerd",
        "((mad))": "mad",
        "((shy))": "shy",
        "((yummi))": "yummi", //":p": "yummi", ":P": "yummi", ":-p": "yummi", ":-P": "yummi",
        "((tongue))": "tongue",
        "((cool))": "cool", //"8=)": "cool", "8-)": "cool", "B-)": "cool", "B=)": "cool",
        "((not_sure))": "not_sure",
        "((surprised))": "surprised", //":o": "surprised",
        "((confused))": "confused",
        "((facepalm))": "facepalm",
        "((crazy))": "crazy",
        "((angry))": "angry", //":@": "angry", ":-@": "angry",
        "((scream))": "scream",
        "((moa))": "moa", "((kiss))": "moa", //":-*": "moa", ":*": "moa",
        "((inlove))": "inlove",
        "((heart))": "heart", "((love))": "heart", //"<3": "heart",
        "((heart_break))": "heart_break", "((brokenheart))": "heart_break", //"((u))": "heart_break",
        "((sleeping))": "sleeping", "((sleepy))": "sleeping", //"|-)": "sleepy",
        "((zzz))": "zzz",
        "((sick))": "sick",
        "((money))": "money",
        "(($))": "$",
        "((like))": "like", //"(y)": "like",
        "((unlike))": "unlike", //"(n)": "unlike",
        "((victory))": "v", //"(v)": "v",
        "((devil))": "devil",
        "((angel))": "angel",
        "((cigarette))": "cigarette", "((smoking))": "cigarette",
        "((football))": "football",
        "((basketball))": "basketball",
        "((baseball))": "baseball",
        "((soccer))": "soccer",
        "((run))": "run",
        "((bicycle))": "bicycle",
        "((car))": "car",
        "((airplane))": "airplane",
        "((time))": "time",
        "((tv))": "tv",
        "((phone))": "phone",
        "((tape))": "tape",
        "((music))": "music",
        "((console))": "console",
        "((cloud))": "cloud",
        "((rain))": "rain",
        "((coffee))": "coffee",
        "((cupcake))": "cupcake",
        "((ice_cream))": "ice_cream",
        "((burger))": "burger",
        "((pizza))": "pizza",
        "((soda))": "soda",
        "((relax))": "relax",
        "((chick))": "chick",
        "((cat))": "cat",
        "((dog))": "dog",
        "((sheep))": "sheep",
        "((monkey))": "monkey",
        "((kangaroo))": "kangaroo",
        "((koala))": "koala",
        "((panda))": "panda",
        "((skull))": "skull", "((danger))": "skull",
        "((sun))": "sun",
        "((moon))": "moon",
        "((gesi))": "gesi", "((khers))": "gesi",
        "((nogesi))": "nogesi",
        "((bobi))": "bobi"
    }
    
    for (var k in RVEmoticons)
        RVEmoticons[k] = { Name: RVEmoticons[k], Tag: "@[[Emoticon:Emoticon:" + Base64.encode(RVEmoticons[k]) + "]]" };
})();