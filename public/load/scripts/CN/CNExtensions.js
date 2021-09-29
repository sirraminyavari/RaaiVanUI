(function () {
    if (window.CNExtensions) return;

    window.CNExtensions = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            InitedArea: null,
            NotInitedArea: null
        };

        this.Objects = {
            NodeTypeID: params.NodeTypeID || "",
            NodeType: params.NodeType || ""
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    CNExtensions.prototype = {
        _preinit: function () {
            var that = this;

            CNAPI.GetExtensions({
                OwnerID: that.Objects.NodeTypeID, Initialize: true, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                    var extensions = result.Extensions || [];
                    that._initialize(extensions);
                }
            });
        },

        _initialize: function (extensions) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "inited" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "notInited" }
            ], that.ContainerDiv);

            that.Interface.InitedArea = elems["inited"];
            that.Interface.NotInitedArea = elems["notInited"];

            for (var i = 0, lnt = extensions.length; i < lnt; ++i)
                that.add_item(extensions[i]);
        },

        check_module: function (extension) {
            var that = this;

            var modules = (window.RVGlobal || {}).Modules || {};

            switch (extension.Extension) {
                case "Form": return !!modules.FG;
                case "Documents": return !!modules.DCT;
                case "Posts": return !!modules.SocialNetwork;
                case "Events": return !!modules.EVT;
                case "Browser": return !!modules.Explorer;
                default: return true;
            }

            return true;
        },

        add_item: function (extension) {
            extension = extension || {};
            var that = this;

            if (!that.check_module(extension)) return;

            var container = extension.Initialized === true ? that.Interface.InitedArea : that.Interface.NotInitedArea;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftBorder",
                    Style: "position:relative; margin-bottom:0.5rem; padding:0.3rem; padding-" + RV_Float + ":12rem; height:2.7rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.6rem;" + RV_Float + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [
                                        {
                                            Type: "checkbox", Style: "width:1.1rem; height:1.1rem; cursor:pointer;",
                                            Params: {
                                                Checked: extension.Disabled === false,
                                                OnClick: function (e, done) {
                                                    e.preventDefault();

                                                    var _checkbox = this;

                                                    CNAPI[_checkbox.Checked ? "DisableExtension" : "EnableExtension"]({
                                                        OwnerID: that.Objects.NodeTypeID, Extension: extension.Extension, ParseResults: true,
                                                        ResponseHandler: function (result) {
                                                            var succeed = result.ErrorText ? false : true;
                                                            done(succeed);
                                                            elems["titleArea"].style.display = _checkbox.Checked ? "block" : "none";
                                                            if (succeed && container == that.Interface.NotInitedArea) {
                                                                that.Interface.InitedArea.appendChild(elems["container"]);
                                                                elems["moveArea"].style.display = "block";
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Name: "moveArea",
                                    Style: "display:" + (extension.Initialized !== true ? "none" : "inline-block") + ";" +
                                        "margin-" + RV_Float + ":1rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block; text-align:center;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-long-arrow-up fa-lg rv-icon-button",
                                                    Tooltip: RVDic.MoveUp,
                                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                                    Properties: [
                                                        {
                                                            Name: "onclick",
                                                            Value: function () {
                                                                that._move(extension, false, elems["container"]);
                                                                jQuery(this).mouseout();
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div",
                                            Style: "display:inline-block; text-align:center; margin-" + RV_Float + ":0.3rem;",
                                            Childs: [
                                                {
                                                    Type: "i", Class: "fa fa-long-arrow-down fa-lg rv-icon-button",
                                                    Tooltip: RVDic.MoveDown,
                                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                                    Properties: [
                                                        {
                                                            Name: "onclick",
                                                            Value: function () {
                                                                that._move(extension, true, elems["container"]);
                                                                jQuery(this).mouseout();
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":1rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic[extension.Extension] || extension.Extension }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "titleArea",
                            Style: (extension.Disabled === false ? "" : "display:none;")
                        }
                    ]
                }
            ], container);

            that._set_title(elems["titleArea"], extension);
        },

        _move: function (extension, moveDown, containerDiv) {
            moveDown = moveDown === true;
            var that = this;

            if (!GlobalUtilities.get_next_element(containerDiv, moveDown)) return;

            CNAPI.MoveExtension({
                OwnerID: that.Objects.NodeTypeID, Extension: extension.Extension, MoveDown: moveDown, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) return;
                    GlobalUtilities.move_element(containerDiv, moveDown);
                }
            });
        },

        _set_title: function (container, extension) {
            var that = this;
            var title = Base64.decode((extension || {}).Title || "");

            var _innerTitle = RVDic.Title + "...";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                    Style: "font-weight:bold; cursor:pointer;", Tooltip: RVDic.DoubleClickToEdit,
                    Childs: [{ Type: "text", TextValue: title }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "titleInput", InnerTitle: _innerTitle,
                            Style: "width:100%; font-size:0.7rem;",
                            Attributes: [{ Name: "type", Value: "text" }]
                        }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var titleInput = elems["titleInput"];

            var _set_data = function () {
                GlobalUtilities.set_text(viewArea, GlobalUtilities.get_text_begining(title, 2000) || RVDic.NotSet);
                titleInput.value = title;
            };

            var __Editing = false;

            var _on_edit = function () {
                var set_things = function () {
                    _set_data();
                    viewArea.style.display = __Editing ? "none" : "block";
                    editArea.style.display = __Editing ? "block" : "none";
                };

                if (__Editing === true) {
                    var newTitle = GlobalUtilities.trim(titleInput.value);
                    if (newTitle == _innerTitle) newTitle = "";

                    GlobalUtilities.block(container);

                    CNAPI.SetExtensionTitle({
                        OwnerID: that.Objects.NodeTypeID, Extension: extension.Extension,
                        Title: Base64.encode(newTitle), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                title = newTitle;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            }; //end of _on_edit

            viewArea.ondblclick = _on_edit;
            if (!title) _on_edit();
            GlobalUtilities.set_onenter(titleInput, _on_edit);
            _set_data();
        }
    }
})();