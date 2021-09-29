(function () {
    if (window.FormOwner) return;

    window.FormOwner = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID || ""
        };

        this.Options = {
            TitleWidth: params.TitleWidth || 5, //rem unit
            TitleMargin: params.TitleMargin || 2.5,//rem unit
            ButtonSize: params.ButtonSize || "fa-2x",
            DisableElementLimits: !!params.DisableElementLimits
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js"], { OnLoad: function () { that._initialize(params); } });
    }

    FormOwner.prototype = {
        _initialize: function (params) {
            var that = this;

            FGAPI.GetOwnerForm({
                OwnerID: that.Objects.OwnerID, ParseResults: true,
                ResponseHandler: function (result) {
                    that.set_form(that.ContainerDiv, result);
                }
            });
        },

        set_form: function (container, params) {
            params = params || {};
            var that = this;

            var formId = params.FormID || "";
            var formTitle = Base64.decode(params.Title || "");

            var formInputInnerTitle = RVDic.FormSelect + "...";

            container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "position:relative; min-height:2.5rem;" +
                        "padding-" + RV_Float + ":" + (2.5 + that.Options.TitleWidth) + "rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "i", Name: "editButton",
                                    Class: "fa fa-pencil " + that.Options.ButtonSize + " rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":" + that.Options.TitleMargin + "rem;" +
                                "width:" + that.Options.TitleWidth + "rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Form + ":" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                            Childs: [
                                {
                                    Type: "div", Name: "formName",
                                    Style: "display:inline-block; color:green; font-weight:bold;"
                                },
                                {
                                    Type: "div", Class: "ActionButton", Name: "elementLimits",
                                    Style: "display:" + (that.Options.DisableElementLimits ? "none" : "inline-block") + ";" +
                                        "margin-" + RV_Float + ":0.5rem;" + "font-size:0.7rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.LimitFieldsTo }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:none;", Name: "formSelect"
                        }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var formView = elems["formName"];
            var editArea = elems["formSelect"];
            var editButton = elems["editButton"];
            var elementLimits = elems["elementLimits"];

            elementLimits.onclick = function () {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container"
                    }
                ])["container"];

                GlobalUtilities.loading(_div);
                var showedDiv = GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["FormsManager/FormElementsSelect.js"], {
                    OnLoad: function () {
                        new FormElementsSelect(_div, {
                            OwnerID: that.Objects.OwnerID, FormID: formId,
                            OnCancel: function () { showedDiv.Close(); }
                        });
                    }
                });
            }

            var formSelect = GlobalUtilities.append_autosuggest(elems["formSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.8rem;",
                InnerTitle: formInputInnerTitle,
                AjaxDataSource: FGAPI.GetFormsDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Forms || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i].Title || ""), items[i].FormID]);
                    return arr;
                }
            });

            var _set_data = function () {
                GlobalUtilities.set_text(formView, !formTitle ? RVDic.NotSet : formTitle);
                elementLimits.style.display = !formId || that.Options.DisableElementLimits ? "none" : "inline-block";
                if (formId) formSelect.set_item(formId, formTitle);
            }

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class", editButton.__Editing ?
                        "fa fa-floppy-o " + that.Options.ButtonSize + " rv-icon-button" :
                        "fa fa-pencil " + that.Options.ButtonSize + " rv-icon-button");
                }

                if (editButton.__Editing === true) {
                    var index = formSelect.selectedIndex;
                    var newFormId = index >= 0 ? formSelect.values[index] : "";
                    var newFormTitle = index >= 0 ? formSelect.keywords[index] : "";

                    var _val = GlobalUtilities.trim(formSelect.InputElement.value);
                    if ((_val == formInputInnerTitle) || !_val) {
                        newFormId = "";
                        newFormTitle = "";
                    }

                    GlobalUtilities.block(container);

                    FGAPI[newFormId ? "SetFormOwner" : "RemoveFormOwner"]({
                        OwnerID: that.Objects.OwnerID, FormID: newFormId || formId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                formId = newFormId;
                                formTitle = newFormTitle;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            if (!formId) _on_edit();
            _set_data();
        }
    }
})();