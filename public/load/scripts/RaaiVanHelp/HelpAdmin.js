(function () {
    if (window.HelpAdmin) return;

    window.HelpAdmin = function (container) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;

        this.Interface = {
            HelpContent: null
        };

        var that = this;

        GlobalUtilities.load_files(["TreeView/TreeView.js", "RaaiVanHelp/HelpUtils.js"], {
            OnLoad: function () { that.initialize(); }
        });
    }

    HelpAdmin.prototype = {
        initialize: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-4 large-3",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding:0.5rem; padding-" + RV_RevFloat + ":0.7rem; position:relative;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-circle SoftBackgroundColor",
                                    Style: "position:absolute; top:0rem; " + RV_RevFloat + ":0rem; bottom:0rem;" +
                                        "padding-" + RV_RevFloat + ":0.2rem;"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "index" }
                            ]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-8 large-9",
                    Style: "padding:0.5rem; line-height:1.8rem;", Name: "content"
                }
            ], that.Container);

            that.Interface.HelpContent = elems["content"];

            var index = that.architecture();
            that.set_paths(null, index);

            new TreeView(elems["index"], {
                Items: index,
                Item: function (itm) {
                    var titleArr = that._title(itm.Name);

                    return {
                        Name: Base64.encode(itm.Name),
                        Title: Base64.encode(titleArr[titleArr.length - 1]),
                        Childs: itm.Sub
                    };
                },
                OnClick: function (e, item, done) {
                    that.show(item, function () { done(); });
                }
            });
        },

        show: function (item, done) {
            var that = this;

            that.HelpContent = that.HelpContent || {};

            if (!that.HelpContent[item.Name]) {
                var _div = that.HelpContent[item.Name] = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:justify;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);

                RVAPI.GetHelpIndexEntry({
                    Name: Base64.encode(item.Name), ParseResults: true,
                    ResponseHandler: function (r) {
                        _div.BodyContent = Base64.decode(((r || {}).Entry || {}).Content);
                    }
                });
            }

            that._show(that.HelpContent[item.Name], item, done);
        },

        _show: function (content, item, done) {
            var that = this;

            if (that.__Showing) return;
            that.__Showing = true;

            done();

            content.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                    Style: "margin:0rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-8 medium-6 large-4 ActionButton",
                            Style: "display:none;", Name: "editButton",
                            Childs: [{ Type: "text", TextValue: RVDic.Edit }]
                        },
                        {
                            Type: "div", Class: "small-8 medium-6 large-4 ActionButton",
                            Style: "display:none;", Name: "saveButton",
                            Childs: [{ Type: "text", TextValue: RVDic.Save }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea" }
            ], content);

            var _set_view_content = function () {
                jQuery(elems["editButton"]).fadeIn(500);

                GlobalUtilities.append_markup_text(elems["viewArea"], content.BodyContent || "", {
                    Done: function () { GlobalUtilities.remove_empty_tags(elems["viewArea"]); }
                });
            };

            var editor = null;

            elems["editButton"].onclick = function () {
                var btn = this;

                if (btn.Processing) return;
                btn.Processing = true;

                jQuery(btn).fadeOut(500, function () { jQuery(elems["saveButton"]).fadeIn(500); });

                jQuery(elems["viewArea"]).fadeOut(500, function () {
                    jQuery(elems["editArea"]).fadeIn(500, function () {
                        GlobalUtilities.append_rich_text_editor(elems["editArea"], {
                            EnableHelpItemSelect: true,
                            EnableMediaSelect: true,
                            MediaSelect: {
                                MediaRequest: function (callback) {
                                    RVAPI.GetHelpMediaFiles({
                                        ParseResults: true,
                                        ResponseHandler: function (result) {
                                            var files = result.Files || [];
                                            var arr = [];

                                            for (var i = 0, lnt = files.length; i < lnt; ++i)
                                                arr.push({ Name: files[i], URL: "../../Help/fa/media/" + files[i] });

                                            callback(arr);
                                        }
                                    });
                                }
                            }
                        }, function (edtr) {
                            editor = edtr;

                            AdvancedTextArea.replace_markups(content.BodyContent, {
                                IgnoreBreaks: true, IgnoreURLs: true, Options: { EditorMode: true },
                                Done: function (text) { editor.set_data(text); }
                            });
                        });
                    });
                });
            };

            elems["saveButton"].onclick = function () {
                var btn = this;

                if (!editor || btn.Saving) return;
                btn.Saving = true;

                var newData = editor.get_data();

                RVAPI.SaveHelpIndexEntry({
                    Lang: "fa", Path: Base64.encode(item.Path),
                    Content: Base64.encode(newData), ParseResults: true,
                    ResponseHandler: function (r) {
                        if (r.Succeed) {
                            content.BodyContent = newData;

                            jQuery(btn).fadeOut(500, function () { jQuery(elems["editButton"]).fadeIn(500); });

                            jQuery(elems["editArea"]).fadeOut(500, function () {
                                editor = null;
                                elems["editArea"].innerHTML = "";

                                jQuery(elems["viewArea"]).fadeIn(500, function () { _set_view_content(); });
                            });
                        }
                        else {
                            if (r.ErrorText) alert(RVDic.MSG[r.ErrorText] || r.ErrorText);
                            btn.Saving = false;
                        }
                    }
                });
            };

            jQuery(that.Interface.HelpContent).fadeOut(250, function () {
                that.Interface.HelpContent.innerHTML = "";
                that.Interface.HelpContent.appendChild(content);
                that.__Showing = false;

                jQuery(that.Interface.HelpContent).fadeIn(500, function () {
                    if (GlobalUtilities.is_empty_text(content.BodyContent)) jQuery(elems["editButton"]).click();
                    else _set_view_content();
                });
            });
        },

        set_paths: function (path, arr) {
            var that = this;

            (arr || []).forEach(itm => {
                var folderPath = (path ? path + "/" : "") +
                    itm.PureName + (itm.ModuleIdentifier ? " - " + itm.ModuleIdentifier : "");
                itm.Path = folderPath + "/" + itm.PureName + ".rvhlp";
                if ((itm.Sub || []).length > 0) that.set_paths(folderPath + "/sub", itm.Sub);
            });
        },

        _title: function (name) {
            return (HelpUtils.get_title || function (nm) { return nm; })(name);
        },

        architecture: function () {
            return (HelpUtils.get_architecture || function () { return []; })();
        }
    }
})();