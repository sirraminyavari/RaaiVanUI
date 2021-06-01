(function () {
    if (window.RVEditor) return;

    window.RVEditor = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID,
            UploadOwnerType: params.UploadOwnerType,
            Editor: null
        };

        this.Options = {
            MentionSelectID: "select",
            OnInit: params.OnInit
        };

        var that = this;

        GlobalUtilities.load_files(["API/DocsAPI.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    RVEditor.prototype = {
        initialize: function () {
            var that = this;

            var uploadPlugin = that.upload_plugin();

            var specialCharPlugins = BalloonBlockEditor.builtinPlugins.filter(f => !f.pluginName);

            BalloonBlockEditor.create(that.Container, {
                language: RV_Lang,
                plugins: [
                    "Mention", function (editor) { that.mention_customization(editor); }, uploadPlugin,
                    "Alignment", "Autoformat", "AutoLink", "BlockQuote", "BlockToolbar", "Bold", "Code", "CodeBlock", "Essentials",
                    "FontColor", "FontBackgroundColor", "Heading", "HorizontalLine", "Image", "ImageCaption", "ImageResize",
                    "ImageStyle", "ImageToolbar", "ImageUpload", "SimpleUploadAdapter", /*"FontFamily", "FontSize",*/
                    "Indent", "IndentBlock", "Italic", "Link", "List", "ListStyle", /*"Markdown",*/ "MediaEmbed", "MediaEmbedToolbar",
                    "Paragraph", "PasteFromOffice", "RemoveFormat", "SpecialCharacters", "Strikethrough", "Subscript",
                    "Superscript", "Table", "TableCellProperties", "TableProperties", "TableToolbar", "TextTransformation",
                    "Underline"
                ].concat(specialCharPlugins),
                toolbar: {
                    items: [
                        'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'removeFormat', '|',
                        'alignment', 'indent', 'outdent', 'numberedList', 'bulletedList', '|',
                        'fontColor', 'fontBackgroundColor', '|',
                        'heading', '|',
                        'blockQuote', 'code', 'codeBlock'
                    ]
                },
                blockToolbar: [
                    'undo', 'redo', '|',
                    'link', 'imageUpload', 'mediaEmbed', 'insertTable', '|',
                    'horizontalLine', 'specialCharacters', '|',
                    'blockQuote', 'code', 'codeBlock', 'rv_upload'
                ],
                image: { toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'] },
                table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties'] },
                mention: { feeds: [that.mention_feed_builder()] },
                simpleUpload: {
                    uploadUrl: DocsAPI.GetUploadLink({
                        OwnerID: that.Objects.OwnerID,
                        OwnerType: that.Objects.UploadOwnerType
                    })
                },
                licenseKey: ''
            }).then(editor => {
                that.Objects.Editor = editor;
                if (GlobalUtilities.get_type(that.Options.OnInit) == "function") that.Options.OnInit(that);
            }).catch(error => {
                console.error('Oops, something went wrong!');
                console.warn('Build id: m2fpq4y476yd-tztidyamkjna');
                console.error(error);
            });
        },

        create_plugin: function (options) {
            var that = this;
            options = options || {};

            var pluginBase = BalloonBlockEditor.builtinPlugins.filter(f => f.pluginName == "RVPluginBase");

            if (!pluginBase.length) return;
            else pluginBase = pluginBase[0];

            return class extends pluginBase.PluginClass {
                init() {
                    const editor = this.editor;

                    if ((options.Button || {}).Name) {
                        editor.ui.componentFactory.add(options.Button.Name, locale => {
                            const view = new pluginBase.ButtonViewClass(locale);

                            view.set({ label: options.Button.Title, icon: options.Button.SVG, tooltip: true });

                            if (GlobalUtilities.get_type(options.Button.OnClick) == "function") {
                                view.on('execute', () => {
                                    options.Button.OnClick(view, view.element);
                                });
                            }

                            return view;
                        });
                    }

                    if (GlobalUtilities.get_type(options.OnInit) == "function") options.OnInit();
                }
            }
        },

        upload_plugin: function () {
            var that = this;

            var uploader = null;
            var container = null;

            return that.create_plugin({
                OnInit: function () { console.log("RVUpload Plugin Loaded! :)"); },
                Button: {
                    Name: "rv_upload",
                    Title: RVDic.UploadFile,
                    SVG: '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 197.696 197.696" style="enable-background:new 0 0 197.696 197.696;" xml:space="preserve"><g><path style="fill:#010002;" d="M179.546,73.358L73.111,179.783c-13.095,13.095-34.4,13.095-47.481,0.007c-13.095-13.095-13.095-34.396,0-47.495l13.725-13.739l92.696-92.689l11.166-11.159c8.829-8.833,23.195-8.833,32.038,0c8.829,8.836,8.829,23.209,0,32.041L145.79,76.221l-74.383,74.383l-1.714,1.714c-4.42,4.413-11.606,4.42-16.026,0c-4.42-4.413-4.42-11.599,0-16.019l76.101-76.097c1.582-1.578,1.582-4.141,0-5.723c-1.585-1.582-4.134-1.582-5.723,0l-76.097,76.101c-7.58,7.573-7.58,19.895,0,27.464c7.566,7.573,19.884,7.566,27.464,0l1.714-1.714l74.383-74.383l29.465-29.472c11.989-11.989,12-31.494,0-43.487c-11.986-11.986-31.49-11.986-43.487,0l-11.152,11.159L33.64,112.84l-13.725,13.732c-16.252,16.244-16.252,42.685,0,58.937c16.241,16.252,42.678,16.248,58.929,0L185.265,79.081c1.585-1.578,1.585-4.137,0-5.719C183.68,71.777,181.131,71.777,179.546,73.358z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>',
                    OnClick: function (view, element) {
                        if (uploader) return uploader.browse();

                        container = GlobalUtilities.create_nested_elements([{
                            Type: "div", Name: "_div"
                        }])["_div"];

                        GlobalUtilities.uploader(container, {
                            UploadDataSource: DocsAPI.GetUploadLink({
                                OwnerID: that.Objects.OwnerID,
                                OwnerType: that.Objects.UploadOwnerType
                            }),
                            Removable: false,
                            OnRemove: function (file) { },
                            OnUpload: function (file, result) {
                                if (result.success) {
                                    var extension = Base64.decode(result.AttachedFile.Extension).toLowerCase();
                                    var fileName = Base64.decode(result.AttachedFile.FileName);

                                    that.insert_tag({
                                        ID: result.AttachedFile.FileID, Type: "File",
                                        Value: Base64.encode(fileName + "." + extension),
                                        Info: { Extension: extension.toLowerCase() }
                                    });

                                    uploader.remove(file);
                                }
                            },
                            OnFileAdd: function (file) { }
                        }, function (au) {
                            uploader = au;
                            uploader.browse();
                        });
                    }
                }
            })
        },

        is_image: function (fileExtension) {
            return ["jpg", "png", "gif", "jpeg"].some(ext => fileExtension == ext);
        },

        insert_tag: function (tag) {
            var that = this;

            if (!that.Objects.Editor) return;

            var _ext = tag.Info.Extension.toString().toLowerCase();
            var html = "";

            if (that.is_image(_ext)) {
                tag.Info = GlobalUtilities.extend({}, tag.Info);

                html = '<img style="max-width:100%;' + (tag.Info.W ? 'width:' + tag.Info.W + 'px;' : "") +
                    (tag.Info.H ? 'height:' + tag.Info.H + 'px;' : "") + '" ' +
                    'data-RV_TagID="' + tag.ID + '" ' +
                    'data-RV_TagType="' + tag.Type + '" ' +
                    'data-RV_TagValue="' + tag.Value + '" ' +
                    'data-RV_TagInfo="' + Base64.encode(JSON.stringify(tag.Info)) + '" ' +
                    'src="' + DocsAPI.GetDownloadLink({ FileID: tag.ID || "" }) + '"/><span>&nbsp;</span>';
            }
            else {
                html = '<a data-RV_TagID="' + tag.ID + '" ' +
                    'data-RV_TagType="' + tag.Type + '" ' +
                    'data-RV_TagValue="' + tag.Value + '" ' +
                    'data-RV_TagInfo="' + Base64.encode(JSON.stringify(tag.Info)) + '" ' +
                    'href="' + AdvancedTextArea.get_url(tag) + '" ' +
                    '>' + Base64.decode(tag.Value) + '</a><span>&nbsp;</span>';
            }

            const viewFragment = that.Objects.Editor.data.processor.toView(html);
            const modelFragment = that.Objects.Editor.data.toModel(viewFragment);
            that.Objects.Editor.model.insertContent(modelFragment);
        },

        mention_feed_builder: function () {
            var that = this;

            return that.mention_feed({
                Marker: "@",
                MinimumCharacters: 1,
                SelectDialog: true,
                DataRequest: function (searchText, callback) {
                    RVAPI.SuggestTags({
                        SearchText: Base64.encode(searchText), ParseResults: true,
                        ResponseHandler: function (result) {
                            var arr = (result.Items || []).map(itm => {
                                return {
                                    id: "@" + itm.ItemID.replace(/\-/ig, ""),
                                    text: Base64.decode(itm.Name),
                                    link: itm.Type == "Node" ? RVAPI.NodePageURL({ NodeID: itm.ItemID }) : RVAPI.UserPageURL({ UserID: itm.ItemID }),
                                    markup: "@[[" + itm.ItemID + ":" + itm.Type + ":" + itm.Name + "]]",
                                    obj: itm
                                };
                            });

                            callback(arr);
                        }
                    });
                },
                SelectBuilder: function (item, onSelect) {
                    return GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "TextAlign Direction", Name: "_div",
                        Style: "display:flex; flex-flow:row; justify-content:center;",
                        Childs: [{ Name: "user", Title: RVDic.User }, { Name: "node", Title: RVDic.Node }].map(x => {
                            return {
                                Type: "div", Style: "flex:0 0 auto; width:6rem; padding:0.5rem;",
                                Childs: [{
                                    Type: "div", Class: "rv-border-radius-quarter",
                                    Style: "background-color:white; text-align:center; cursor:pointer;" +
                                        "font-family:IRANSans; background-color:rgb(240,240,240);",
                                    Properties: [{
                                        Name: "onclick",
                                        Value: function (e) {
                                            e.stopImmediatePropagation();

                                            that.show_mention_dialog({ IsNode: x.Name == "node" }, function (selectedItem) {
                                                onSelect(selectedItem);
                                            });
                                        }
                                    }],
                                    Childs: [{ Type: "text", TextValue: x.Title }]
                                }]
                            };
                        })
                    }])["_div"];
                },
                ItemBuilder: function (item) {
                    var name = item.text;
                    var trimmed = item.text.length > 50 ? item.text.substr(0, 60) + "..." : null;

                    return GlobalUtilities.create_nested_elements([{
                        Type: "div", Class: "TextAlign Direction", Name: "_div", Tooltip: trimmed ? name : null,
                        Style: "display:flex; flex-flow:row; align-items:center; font-size:0.7rem;" +
                            "border-bottom-width:1px; border-style:solid; border-color:rgb(240,240,240);",
                        Childs: [
                            {
                                Type: "div", Style: "flex:1 1 auto; width:26rem;",
                                Childs: [
                                    {
                                        Type: "div", Style: "text-align:" + RV_Float + " !important; font-family:IRANSans;",
                                        Childs: [{ Type: "text", TextValue: trimmed || name }]
                                    },
                                    {
                                        Type: "div", Style: "display:flex; flex-flow:row;",
                                        Childs: ["AdditionalID", "NodeType"].filter(x => !!item.obj[x]).map(x => {
                                            return {
                                                Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.3rem;",
                                                Childs: [{
                                                    Type: "div",
                                                    Style: "text-align:" + RV_Float + " !important; color:rgb(100,100,100);" +
                                                        "font-family:IRANSans; font-size:0.6rem; padding:0.1rem 0.3rem;",
                                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.obj[x]) }]
                                                }]
                                            }
                                        })
                                    }
                                ]
                            },
                            {
                                Type: "div", Style: "flex:0 0 auto;",
                                Childs: [{
                                    Type: "img", Class: "rv-border-radius-quarter", Style: "width:1.5rem; height:1.5rem;",
                                    Attributes: [{ Name: "src", Value: item.obj.ImageURL }]
                                }]
                            }
                        ]
                    }])["_div"];
                }
            });
        },

        mention_feed: function (options) {
            var that = this;
            options = options || {};

            var selectId = options.Marker + that.Options.MentionSelectID;

            return {
                marker: options.Marker,
                minimumCharacters: options.MinimumCharacters,
                feed: function (searchText) {
                    return new Promise(resolve => {
                        options.DataRequest(searchText, function (arr) {
                            if (options.SelectDialog) resolve([{ id: selectId, text: "clicked" }].concat(arr));
                            else resolve(arr);
                        });
                    });
                },
                itemRenderer: function (item) {
                    return item.id != selectId ? options.ItemBuilder(item) : options.SelectBuilder(item, function (selectedItem) {
                        let editor = that.Objects.Editor;
                        let model = editor.model;

                        for (let i = 0; i < 10; i++) {
                            let pos = model.document.selection.getFirstPosition();
                            let range = model.createRange(pos.getShiftedBy(-1), pos);
                            let walker = range.getWalker({ singleCharacters: true });
                            let chr = walker.next().value.item.data;

                            editor.execute('delete', { direction: 'backward' });

                            if (chr == options.Marker) break;
                        }

                        that.add_mentioned(selectedItem);
                    });
                }
            };
        },

        mention_customization: function (editor) {
            var that = this;

            var removing = false;

            var defaultSelected = function (text) {
                if (removing) return;
                removing = true
                setTimeout(() => { removing = false }, 500);

                setTimeout(() => {
                    for (let i = 0; i < (text.length + 1); i++)
                        editor.execute('delete', { direction: 'backward' });

                    that.show_mention_dialog({}, function (selectedItem) {
                        that.add_mentioned(selectedItem);
                    });
                }, 50);
            };

            // The upcast converter will convert view <a class="mention" href="" data-user-id="">
            // elements to the model 'mention' text attribute.
            editor.conversion.for('upcast').elementToAttribute({
                view: {
                    name: 'a', key: 'data-mention', classes: 'mention',
                    attributes: { id: true, href: true, 'data-rv-tag': true }
                },
                model: {
                    key: 'mention',
                    value: viewItem => {
                        // The mention feature expects that the mention attribute value
                        // in the model is a plain object with a set of additional attributes.
                        // In order to create a proper object use the toMentionAttribute() helper method:
                        const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
                            // Add any other properties that you need.
                            link: viewItem.getAttribute('href'),
                            markup: viewItem.getAttribute('data-rv-tag')
                        });

                        return mentionAttribute;
                    }
                },
                converterPriority: 'high'
            });

            // Downcast the model 'mention' text attribute to a view <a> element.
            editor.conversion.for('downcast').attributeToElement({
                model: 'mention',
                view: (modelAttributeValue, { writer }) => {
                    // Do not convert empty attributes (lack of value means no mention).
                    if (!modelAttributeValue) {
                        return;
                    }

                    if (modelAttributeValue.id.substr(1) == that.Options.MentionSelectID) {
                        defaultSelected(modelAttributeValue.text);
                        return writer.createAttributeElement('a');
                    }

                    return writer.createAttributeElement('a', {
                        class: 'mention',
                        'data-mention': modelAttributeValue.id,
                        'data-rv-tag': modelAttributeValue.markup,
                        'href': modelAttributeValue.link
                    }, {
                            // Make mention attribute to be wrapped by other attribute elements.
                            priority: 20,
                            // Prevent merging mentions together.
                            id: modelAttributeValue.uid
                        });
                },
                converterPriority: 'high'
            });
        },

        show_mention_dialog: function (options, onSelect) {
            var that = this;
            options = options || {};

            var isNode = options.IsNode !== false;

            var fileName = isNode ? "NodeSelect" : "UserSelect";
            var fileAddress = (isNode ? "Ontology/" : "USR/") + fileName + ".js";

            var _div = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 larg-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "_div"
            }])["_div"];

            showed = GlobalUtilities.show(_div);
            GlobalUtilities.loading(_div);

            GlobalUtilities.load_files([fileAddress], {
                OnLoad: function () {
                    new window[fileName](_div, {
                        Options: {
                            Title: RVDic.NodeSelect,
                            NodeTypeSearchBox: true, TreeCheckbox: false, HideSelectedItems: true, Filters: true,
                            OnSelect: function (item) {
                                showed.Close();

                                var id = item.NodeID || item.UserID;
                                var name = isNode ? item.Name : Base64.decode(item.FirstName) + " " + Base64.decode(item.LastName);

                                onSelect({
                                    marker: '@',
                                    mention: {
                                        id: "@" + id.replace(/\-/ig, ""),
                                        text: name,
                                        markup: "@[[" + id + ":" + (isNode ? "Node" : "User") + ":" + Base64.encode(name) + "]]",
                                        link: isNode ? RVAPI.NodePageURL({ NodeID: id }) : RVAPI.UserPageURL({ UserID: id })
                                    },
                                    text: name
                                });
                            }
                        }
                    });
                }
            });
        },

        add_mentioned: function (mentioned) {
            var that = this;
            that.Objects.Editor.execute('mention', mentioned);
            that.Objects.Editor.editing.view.focus();
        },

        get_data: function () {
            var that = this;
            return (!that.Objects.Editor ? null : that.Objects.Editor.getData());
        },

        getData: function () {
            return this.get_data();
        },

        set_data: function () {
        },

        setData: function () {
            return this.set_data();
        }
    };
})();