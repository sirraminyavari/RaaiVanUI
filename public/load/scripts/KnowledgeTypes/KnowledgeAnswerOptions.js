(function () {
    if (window.KnowledgeAnswerOptions) return;

    window.KnowledgeAnswerOptions = function (containerDiv, question, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        question = question || {};
        params = params || {};

        this.Interface = {
            OptionsArea: null
        };

        this.Options = {
            OnAfterAdd: params.OnAfterAdd,
            OnAfterRemove: params.OnAfterRemove
        };

        var that = this;

        GlobalUtilities.load_files(["API/KnowledgeAPI.js"], {
            OnLoad: function () { that._initialize(question); }
        });
    }

    KnowledgeAnswerOptions.prototype = {
        _initialize: function (params) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "titleArea",
                            Style: "margin-bottom:0.5rem; font-weight:bold; text-align:center;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(params.QuestionBody) }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:1rem; text-align:center; color:rgb(80,80,80); font-size:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.KW.ValueMustBeANumberBetweenZeroAndTen }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "optionsArea" },
                        {
                            Type: "div", Class: "small-4 medium-3 large-2",
                            Style: "margin-top:1rem; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "number", Class: "rv-input rv-placeholder-align-center", Name: "valueInput",
                                    Style: "width:100%; font-size:0.7rem; text-align:center;", InnerTitle: RVDic.Value + "..."
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-8 medium-9 large-10", Style: "margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "newOptionInput",
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.NewOption + "..."
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "margin-top:1rem;", Name: "sortButton",
                            Class: "small-4 medium-4 large-4 rv-air-button-base rv-air-button-white rv-circle SoftBorder",
                            Properties: [{ Name: "onclick", Value: function () { that.sort_dialog(); } }],
                            Childs: [{ Type: "text", TextValue: RVDic.Sort }]

                        },
                        { Type: "div", Class: "small-3 medium-3 large-3" },
                        {
                            Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                            Style: "margin:1rem auto 0 auto;",
                            Properties: [{ Name: "onclick", Value: function () { _onenter(); }}],
                            Childs: [{ Type: "text", TextValue: RVDic.AddN.replace("[n]", RVDic.NewOption) }]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.OptionsArea = elems["optionsArea"];

            GlobalUtilities.append_markup_text(elems["titleArea"], params.QuestionBody);

            var _editing = false;

            var _onenter = function () {
                if (_editing) return;

                var val = elems["valueInput"].value;
                var title = GlobalUtilities.trim(elems["newOptionInput"].value);

                if (!title || !val || isNaN(val) || (val < 0) || (val > 10))
                    return alert(RVDic.MSG.AnswerOptionValueIsNotValid);

                _editing = true;

                KnowledgeAPI.AddAnswerOption({
                    TypeQuestionID: params.ID, Title: Base64.encode(title), Value: String(+val), ParseResults: true,
                    ResponseHandler: function (result) {
                        _editing = false;

                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        elems["valueInput"].value = "";
                        elems["newOptionInput"].value = "";

                        that.add_item(elems["optionsArea"], result.Option);

                        if (that.Options.OnAfterAdd) that.Options.OnAfterAdd();
                    }
                });
            }

            GlobalUtilities.set_onenter(elems["valueInput"], _onenter);
            GlobalUtilities.set_onenter(elems["newOptionInput"], _onenter);

            for (var i = 0, lnt = (params.Options || []).length; i < lnt; ++i)
                that.add_item(elems["optionsArea"], params.Options[i]);
        },

        _remove_option: function (option, containerDiv) {
            option = option || {};
            var that = this;

            GlobalUtilities.confirm(RVDic.Confirms.RemoveOption, function (r) {
                if (!r) return;

                KnowledgeAPI.RemoveAnswerOption({
                    ID: option.ID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else jQuery(containerDiv).fadeOut(500, function () { this.remove(); });

                        if (that.Options.OnAfterRemove) that.Options.OnAfterRemove();
                    }
                });
            });
        },

        add_item: function (container, option) {
            option = option || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 row rv-bg-color-white-softer rv-border-radius-quarter SoftBorder",
                    Style: "position:relative; padding:0.3rem; margin:0.2rem 0rem; padding-" + RV_Float + ":3.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { that._remove_option(option, elems["container"]); } }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":1.8rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: "editArea", Style: "margin:0rem; display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-4 medium-3 large-2", Style: "padding-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [
                                        {
                                            Type: "number", Class: "rv-input rv-placeholder-align-center", Name: "valueInput",
                                            Style: "width:100%; font-size:0.7rem; text-align:center;", Tooltip: RVDic.Value + "..."
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-8 medium-9 large-10",
                                    Childs: [
                                        {
                                            Type: "input", Class: "rv-input", Name: "titleInput", Tooltip: RVDic.Title + "...",
                                            Style: "width:100%; font-size:0.7rem;"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var editButton = elems["editButton"];
            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];

            elems["container"].OptionObject = option;

            var valueInput = elems["valueInput"];
            var titleInput = elems["titleInput"];

            var set_data = function () {
                var value = option.Value;
                var title = Base64.decode(option.Title);

                viewArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "span", Style: "font-weight:bold; margin-" + window.RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: "(" + GlobalUtilities.convert_numbers_to_persian(String(value)) + ")" }]
                    },
                    { Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(title) }
                ], viewArea);

                valueInput.value = value;
                titleInput.value = title;
            };

            set_data();

            editButton.onclick = function () {
                var set_things = function () {
                    set_data();

                    editArea.style.display = editButton.__Editing ? "flex" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "flex";

                    editButton.setAttribute("class", editButton.__Editing ?
                        "fa fa-floppy-o fa-lg rv-icon-button" : "fa fa-pencil falg rv-icon-button");
                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (this.__Editing === true) {
                    var newValue = GlobalUtilities.trim(valueInput.value);
                    var newTitle = GlobalUtilities.trim(titleInput.value);

                    if (!newTitle || !newValue || isNaN(newValue) ||
                        (newValue < 0) || (newValue > 10)) return alert(RVDic.MSG.AnswerOptionValueIsNotValid);

                    GlobalUtilities.block(elems["container"]);

                    KnowledgeAPI.ModifyAnswerOption({
                        ID: option.ID, Title: Base64.encode(newTitle), Value: String(+newValue), ParseResults: true,
                        ResponseHandler: function (result) {
                            GlobalUtilities.unblock(elems["container"]);

                            if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                            option.Title = Base64.encode(newTitle);
                            option.Value = newValue;

                            editButton.__Editing = false;
                            set_things();
                        }
                    });
                }
                else this.__Editing = true;

                set_things();
            };
        },

        sort_dialog: function () {
            var that = this;

            var firstChild = that.Interface.OptionsArea.firstChild;
            if (!(firstChild || {}).nextSibling) return;

            if (that.LoadingSortDialog) return;
            that.LoadingSortDialog = true;

            GlobalUtilities.load_files(["Public/SortDialog.js"], {
                OnLoad: function () {
                    new SortDialog({
                        Container: that.Interface.OptionsArea,
                        Title: RVDic._HelpSortQuestions,
                        CheckContainerItemValidity: function (item) { return !!item.OptionObject; },
                        GetItemID: function (item) { return item.OptionObject.ID; },
                        GetItemTitle: function (item) { return Base64.decode(item.OptionObject.Title); },
                        APIFunction: function (data, done) {
                            KnowledgeAPI.SetAnswerOptionsOrder({
                                IDs: (data.SortedIDs || []).join("|"), ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    done(!result.ErrorText);
                                }
                            });
                        }
                    });


                    that.LoadingSortDialog = false;
                }
            });
        }
    }
})();