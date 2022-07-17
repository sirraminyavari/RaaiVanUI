(function () {
    if (window.FormElementsManager) return;

    window.FormElementsManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;

        params = params || {};

        this.Interface = {
            PreviewButton: null,
            ElementsContainer: null,
            ElementsScrollee: null
        };

        this.Objects = {
            Form: params.Form || {},
            FormID: params.FormID
        };
        
        this.Options = {
            OnReturn: params.OnReturn,
            TopMargin: params.TopMargin || "0",
            CssClass: {
                TypesContainer: "r" + GlobalUtilities.random_str(10),
                ElementsContainer: "r" + GlobalUtilities.random_str(10),
                Elements: "r" + GlobalUtilities.random_str(10),
                Placeholder: "r" + GlobalUtilities.random_str(10),
                DraggableItem: "r" + GlobalUtilities.random_str(10),
                Draggable: "r" + GlobalUtilities.random_str(10)
            },
            Icons: {
                Text: "textbox",
                Paragraph: "text-area",
                Date: "date",
                Select: "radio-button",
                Checkbox: "checkbox",
                Binary: "toggle-on-off",
                File: "file-upload",
                Separator: "divider",
                User: "user",
                Node: "at-sign",
                Form: "table",
                MultiLevel: "multilevel",
                Numeric: "numeric"
            }
        };

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["FGAPI", "CNAPI", "UsersAPI", "PrivacyAPI"] },
            "SingleDataContainer/NewSingleDataContainer.js",
            "AdvancedTextArea/AdvancedTextArea.js",
            "FormsManager/FormElementTypes.js"
        ], { OnLoad: function () { that._preinit(); } });
    }

    FormElementsManager.prototype = {
        _preinit: function () {
            var that = this;

            FGAPI.GetFormElements({
                FormID: that.Objects.FormID, ParseResults: true,
                ResponseHandler: function (result) { that.initialize(result); }
            });
        },

        initialize: function (params) {
            var that = this;
            params = params || {};

            that.ContainerDiv.innerHTML = "";

            //Populate Types
            var elemTypes = [];
            
            for (var tp in FormElementTypes) {
                elemTypes.push({
                    ID: tp,
                    Name: tp,
                    Title: RVDic.FG.ElementTypes[tp] || RVDic[tp] || tp,
                    Icon: that.icon(tp)
                });

                if (tp == "Text") {
                    elemTypes.push({
                        ID: "Paragraph", Name: "Text", Title: RVDic.Paragraph,
                        Icon: that.icon("Paragraph")
                    });
                }
            }
            //end of Populate Types
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "display:flex; flex-flow:row; height:calc(100vh - " + that.Options.TopMargin + "rem);",
                Childs: [
                    {
                        Type: "div", Class: "rv-border-radius-quarter SurroundingShadow",
                        Style: "flex:0 0 auto; padding:1rem 0; background-color:white;" +
                            "margin-" + RV_RevFloat + ":1rem; min-width:12rem; display:flex; flex-flow:column;",
                        Childs: [
                            {
                                Type: "div", Class: "WarmColor",
                                Style: "flex:0 0 auto; text-align:center; font-weight:bold; padding-bottom:1.2rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.FieldTypes }]
                            },
                            { Type: "div", Style: "flex:1 1 auto;", Name: "typesContainer" }
                        ]
                    },
                    {
                        Type: "div", Name: "formContent",
                        Class: "rv-border-radius-quarter rv-trim-vertical-margins SurroundingShadow",
                        Style: "flex:1 1 auto; padding:1rem 0; background-color:rgb(250,250,250);" +
                            "display:flex; flex-flow:column; position:relative;",
                        Childs: [
                            (!that.Options.OnReturn ? null : {
                                Type: "div", Class: "rv-text-button",
                                Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":0.5rem; font-size:0.7rem;",
                                Properties: [{ Name: "onclick", Value: function (e) { e.stopImmediatePropagation(); that.Options.OnReturn(); } }],
                                Childs: [
                                    { Type: "text", TextValue: RVDic.Return },
                                    {
                                        Type: "i", Class: "fa " + (RV_RTL ? "fa-chevron-left" : "fa-chevron-right"),
                                        Style: "margin-" + RV_Float + ":0.3rem; font-size:0.6rem;",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    }
                                ]
                            }),
                            {
                                Type: "div", Class: "WarmColor",
                                Style: "flex:0 0 auto; text-align:center; font-weight:500; font-size:1rem;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.Form.Title) }]
                            },
                            {
                                Type: "div",
                                Style: "flex:0 0 auto; display:flex; flex-flow:row; align-items:center; margin:1rem 0; padding:0 1rem;",
                                Childs: [
                                    {
                                        Type: "div", Class: "rv-flat-label",
                                        Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                            "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.ID + ":" }]
                                    },
                                    {
                                        Type: "div", Style: "flex:1 1 auto;",
                                        Childs: [{
                                            Type: "div", Class: "small-12 medium-8 large-4", Style: "text-align:left; direction:ltr;",
                                            Childs: [{
                                                Type: "input", Class: "rv-input-simple rv-placeholder-align-left",
                                                Style: "width:100%; font-size:0.7rem;", Name: "nameInput", InnerTitle: "e.g. form_id",
                                                Attributes: !params.FormName ? null :
                                                    [{ Name: "value", Value: Base64.decode(params.FormName) }]
                                            }]
                                        }]
                                    }
                                ]
                            },
                            {
                                Type: "div",
                                Style: "flex:0 0 auto; display:flex; flex-flow:row; align-items:center; padding:0 1rem 1rem 1rem;",
                                Childs: [
                                    {
                                        Type: "div", Class: "rv-flat-label",
                                        Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                            "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.Description + ":" }]
                                    },
                                    { Type: "div", Style: "flex:1 1 auto;", Name: "description" }
                                ]
                            },
                            { Type: "div", Style: "flex:1 1 auto;", Name: "elementsContainer" }
                        ]
                    },
                    {
                        Type: "div", 
                        Style: "flex:0 0 auto; display:flex; flex-flow:column;" +
                            "margin-" + RV_Float + ":1rem; min-width:12rem;",
                        Childs: [{
                            Type: "div", Style: "flex:0 0 auto;",
                            Childs: [
                                (true ? null : {
                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter SoftShadow", Style: "margin-bottom:0.5rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Archive }]
                                }),
                                {
                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter SoftShadow SoftBorder", Name: "previewButton",
                                    Style: "margin-bottom:0.5rem;",
                                    Properties: [{ Name: "onclick", Value: function () { that.preview(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Preview }]
                                },
                                (!that.Options.OnReturn ? null : {
                                    Type: "div", Name: "cancelButton",
                                    Class: "rv-border-radius-quarter rv-air-button-base RedBorder RedColor SoftShadow",
                                    Style: "display:flex; flex-flow:row; margin-bottom:0.5rem; background-color:white;", 
                                    Properties: [{ Name: "onclick", Value: function () { that.Options.OnReturn({ Destroy: true }); } }],
                                    Childs: [
                                        {
                                            Type: "div", Style: "flex:0 0 auto; width:1.6rem; text-align:center;",
                                            Childs: [{ Type: "i", Class: "fa fa-trash fa-lg" }]
                                        },
                                        {
                                            Type: "div", Style: "flex:1 1 auto; text-align:cetner;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                                        }
                                    ]
                                }),
                                {
                                    Type: "div", Class: "rv-border-radius-quarter ActionButton SoftShadow", Name: "saveButton",
                                    Style: "display:flex; flex-flow:row;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "flex:0 0 auto; width:1.6rem; text-align:center;",
                                            Childs: [{ Type: "i", Class: "fa fa-floppy-o fa-lg" }]
                                        },
                                        {
                                            Type: "div", Style: "flex:1 1 auto; text-align:cetner;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Save }]
                                        }
                                    ]
                                }
                            ]
                        }]
                    }
                ]
            }], that.ContainerDiv);

            that.Interface.PreviewButton = elems["previewButton"];


            //init elements container
            that.Interface.ElementsContainer = GlobalUtilities.append_scrollbar(elems["elementsContainer"], {
                AutoHeight: false,
                Done: function (dt) { that.Interface.ElementsScrollee = dt.Scrollee }
            });

            jQuery(that.Interface.ElementsContainer).css({ 'padding': '1rem', 'height': '100%' });
            jQuery(that.Interface.ElementsContainer).css({ [RV_RTL ? 'padding-left' : 'padding-right']: '1.2rem' });

            ["rv-trim-vertical-margins", that.Options.CssClass.ElementsContainer]
                .forEach(cls => that.Interface.ElementsContainer.classList.add(cls));
            //end of init elements container


            //init types container
            var typesContainer = GlobalUtilities.append_scrollbar(elems["typesContainer"], { AutoHeight: false });

            jQuery(typesContainer).css({ 'padding': '0 1.2rem' });

            ["rv-trim-vertical-margins", that.Options.CssClass.TypesContainer]
                .forEach(cls => typesContainer.classList.add(cls));
            //end of init types container


            var nameValidationObj = that.initialize_name_validation(elems["nameInput"], { ObjectID: that.Objects.FormID });

            var descriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["description"], InputClass: "rv-input-simple", QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" },
                OnLoad: function () {
                    if (params.FormDescription)
                        this.set_data(Base64.decode(params.FormDescription));
                }
            });

            var rebuild_types = function () {
                typesContainer.innerHTML = "";

                GlobalUtilities.create_nested_elements(elemTypes.map(options => {
                    return {
                        Type: "div", Class: that.Options.CssClass.DraggableItem, Style: "margin-top:0.6rem;",
                        Properties: [{ Name: "TPData", Value: options }],
                        Childs: [{
                            Type: "div",
                            Class: "rv-border-radius-quarter " + that.Options.CssClass.Draggable + " " +
                                that.Options.CssClass.Placeholder,
                            Style: "display:flex; flex-flow:row; cursor:all-scroll;",
                            Childs: [
                                {
                                    Type: "div",
                                    Class: "rv-border-radius-quarter WarmBackgroundColor rv-ignore-" + RV_RevFloat.toLowerCase() + "-radius",
                                    Style: "flex:0 0 auto; display:flex; align-items:center; justify-content:center;" +
                                        "width:2.5rem; padding:0.5rem;",
                                    Childs: [{
                                        Type: "img", Style: "width:1.2rem; height:1.2rem; fill:white;",
                                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(options.Icon) }]
                                    }]
                                },
                                {
                                    Type: "div",
                                    Class: "rv-border-radius-quarter SoftBackgroundColor rv-ignore-" + RV_Float.toLowerCase() + "-radius",
                                    Style: "flex:1 1 auto; display:flex; align-items:center; justify-content:center;" +
                                        "padding:0.3rem 1rem; font-size:0.8rem;",
                                    Childs: [{ Type: "text", TextValue: options.Title }]
                                }
                            ]
                        }]
                    };
                }), typesContainer);
            };

            rebuild_types();

            (params.Elements || []).forEach(itm => that.add_element(that.new_element_container(), itm));

            GlobalUtilities.sortable("." + that.Options.CssClass.TypesContainer + ", ." + that.Options.CssClass.ElementsContainer, {
                Exchangeable: true,
                Filters: [{ draggable: that.Options.CssClass.DraggableItem, droppable: that.Options.CssClass.ElementsContainer }],
                DraggableClass: that.Options.CssClass.Draggable,
                PlaceholderTarget: that.Options.CssClass.Placeholder,
                OnDrop: function (e, targetElement) {
                    if (targetElement.parentNode != that.Interface.ElementsContainer) return;
                    
                    rebuild_types();

                    if (targetElement.TPData) {
                        that.add_element(targetElement, {
                            Type: targetElement.TPData.Name,
                            IsTextInput: targetElement.TPData.ID == "Text"
                        });

                        targetElement.TPData = null; //if TPData remains, the element will reset after the next drop
                    }
                }
            });

            elems["saveButton"].onclick = function () {
                var newName = GlobalUtilities.trim((elems["nameInput"] || {}).value || " ").toLowerCase();
                var isValidName = !nameValidationObj || nameValidationObj.Check();

                var allItems = that.get_elements_dom().map(nd => {
                    return { Dom: nd, Data: nd.GetData(true) };
                });

                var arr = allItems.filter(itm => itm.Data !== false).map(itm => itm.Data);
                var invalid = allItems.filter(itm => itm.Data === false).map(itm => itm.Dom);

                var privacyData = null;

                arr.filter(itm => itm.Privacy)
                    .forEach(itm => { privacyData = GlobalUtilities.extend(privacyData || {}, itm.Privacy) });

                if (invalid.length || !isValidName) {
                    var _do_proc = function () {
                        var _do_shake = () => {
                            if (!isValidName) GlobalUtilities.shake(elems["formContent"]);

                            invalid.forEach((iv, ind) => {
                                iv.Validate();
                                GlobalUtilities.shake(iv);
                            });
                        };

                        if (!isValidName) _do_shake();
                        else GlobalUtilities.scroll_into_view(invalid[0], {
                            Container: that.Interface.ElementsScrollee,
                            Offset: GlobalUtilities.rem2px(),
                            ConsiderContainerOffset: true,
                            Done: function () { _do_shake(); }
                        });
                    };

                    if (isValidName) return invalid[0].Activate(true, _do_proc);
                    else return _do_proc();
                }

                FGAPI.SaveFormElements({
                    FormID: that.Objects.FormID,
                    Name: Base64.encode(newName),
                    Description: !descriptionInput ? null : Base64.encode(descriptionInput.get_data()),
                    Elements: Base64.encode(JSON.stringify({ Elements: arr })),
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            if (privacyData) PrivacyAPI.SetAudience({
                                ObjectType: "FormElement",
                                Data: Base64.encode(JSON.stringify(privacyData)),
                                ParseResults: true,
                                ResponseHandler: function (dt) {
                                    alert(RVDic.MSG[result.Succeed] || result.Succeed);
                                }
                            });
                            else alert(RVDic.MSG[result.Succeed] || result.Succeed);
                        }
                    }
                });
            };
        },

        new_element_container: function () {
            var that = this;

            return GlobalUtilities.create_nested_elements([{
                Type: "div", Class: that.Options.CssClass.DraggableItem, Style: "margin-top:0.5rem;", Name: "_div"
            }])["_div"];
        },

        icon: function (iconName) {
            var that = this;
            return !that.Options.Icons[iconName] ? "" : "svg/" + that.Options.Icons[iconName] + ".svg"
        },

        initialize_name_validation: function (input, params) {
            var that = this;
            params = params || {};

            if (!input) return;

            that.__InvalidFormNames = that.__InvalidFormNames || {};

            if (!params.FormID && !!params.ObjectID) GlobalUtilities.set_onchange(input, () => {
                var val = GlobalUtilities.trim(input.value).toLowerCase();
                
                if (val && FormElementTypeSettings.validate_name(val) &&
                    GlobalUtilities.get_type(that.__InvalidFormNames[val]) !== "boolean") {
                    FGAPI.ValidateNewName({
                        ObjectID: params.ObjectID, Name: Base64.encode(val), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (GlobalUtilities.get_type((result || {}).Valid) == "boolean") {
                                that.__InvalidFormNames[val] = !result.Valid;
                                that.validate_name(input, params);
                            }
                        }
                    });
                }
            });

            jQuery(input).on("keyup", function () {
                that.validate_name(input, params);
            });

            that.validate_name(input, params);

            return { Check: function () { return that.validate_name(input, params); } };
        },

        validate_name: function (input, params) {
            var that = this;
            params = params || {};

            var value = GlobalUtilities.trim(input.value).toLowerCase();
            var isValid = FormElementTypeSettings.validate_name(input.value) &&
                (!value || !!params.FormID || !(that.__InvalidFormNames || {})[value]);

            if (params.FormID && value && isValid) {
                var domArr = that.get_elements_dom();

                for (var i = 0; i < domArr.length; i++) {
                    if (domArr[i].NameInput == input) break;
                    else if (GlobalUtilities.trim((domArr[i].NameInput || {}).value || " ").toLowerCase() == value) {
                        isValid = false;
                        break;
                    }
                }
            }

            input.classList[isValid ? "remove" : "add"]("rv-input-simple-invalid");

            return isValid;
        },

        get_elements_dom: function () {
            return [].filter.call(this.Interface.ElementsContainer.childNodes || [], (nd) => !!nd.GetData && !nd.Removed) || [];
        },

        clear: function () {
            this.ContainerDiv.innerHTML = "";
        },

        add_element: function (container, params, insertAfter) {
            var that = this;
            params = params || {};

            params.ElementID = params.ElementID || GlobalUtilities.generate_new_guid();

            container.innerHTML = "";
            container.style.marginTop = "1rem";

            params.Title = Base64.decode(params.Title);
            params.Name = Base64.decode(params.Name);
            params.Help = Base64.decode(params.Help);

            var elementId = params.ElementID;
            var title = params.Title;
            var name = params.Name;
            var help = params.Help;
            var type = params.Type;
            var info = GlobalUtilities.to_json(Base64.decode(params.Info) || "{}") || {};
            var weight = params.Weight;
            var sequenceNumber = +params.SequenceNumber;
            if (isNaN(sequenceNumber)) sequenceNumber = 0;
            
            var necessary = params.Necessary === true;
            var uniqueValue = params.UniqueValue === true;
            var isWorkFlowField = params.IsWorkFlowField === true;
            
            var isParagraph = (type == "Text") && !params.IsTextInput &&
                !info.UseSimpleEditor && !info.PatternName && !info.Pattern;
            var hasUniqueCheckbox = !isParagraph && ["Text", "Numeric"].some(t => type == t);
            
            var typeName = isParagraph ? RVDic.Paragraph : (RVDic.FG.ElementTypes[type] || RVDic.FG.ElementTypes.Text);
            var iconUrl = that.icon(isParagraph ? "Paragraph" : type);
            
            var _create_checkbox = function (p) {
                p = p || {};
                
                return {
                    Type: "div",
                    Style: "display:flex; flex-flow:row; align-items:center; margin-bottom:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Class: "rv-flat-label",
                            Style: "flex:1 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: p.Title + ":" }]
                        },
                        {
                            Type: "switch", Name: p.Name,
                            Style: "flex:0 0 auto; margin-top:0.2rem;",
                            Params: GlobalUtilities.extend({}, FormElementTypeSettings.SwitchParams, { Checked: p.Value })
                        }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: that.Options.CssClass.Placeholder, Name: "elementDiv",
                Style: "display:flex; flex-flow:row;", 
                Childs: [
                    {
                        Type: "div", Class: "rv-color-soft-warm " + that.Options.CssClass.Draggable,
                        Style: "flex:0 0 auto; display:flex; align-items:center; justify-content:center;" +
                            "cursor:all-scroll; padding:0 0.5rem; padding-" + RV_Float + ":0;",
                        Properties: [{
                            Name: "onclick", Value: function (e) {
                                e.stopPropagation();
                                if (elems["settings"].style.display != "none") elementDiv.Deactive();
                                else elementDiv.Activate(true);
                            }
                        }],
                        Childs: [1, 2].map(() => {
                            return {
                                Type: "i", Class: "fa fa-ellipsis-v", Style: "margin:0 1px;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            };
                        })
                    },
                    {
                        Type: "div", Class: "rv-border-radius-quarter SoftBorder", Name: "mainContent",
                        Style: "flex:1 1 auto; display:flex; flex-flow:row; border-color:rgb(240,240,240); background-color:white;", 
                        Childs: [
                            {
                                Type: "div", Name: "sideColor",
                                Class: "rv-border-radius-quarter rv-ignore-" + RV_RevFloat.toLowerCase() + "-radius SoftBackgroundColor",
                                Style: "flex:0 0 auto; padding-" + RV_Float + ":0.3rem; margin-" + RV_RevFloat + ":0.8rem;"
                            },
                            {
                                Type: "div", Style: "flex:1 1 auto; padding-" + RV_Float + ":0;",
                                Childs: [
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12",
                                        Style: "display:flex; flex-flow:row;",
                                        Childs: [
                                            {
                                                Type: "div", Name: "titleEditArea",
                                                Style: "flex:1 1 auto; padding:1rem; padding-" + RV_Float + ":0;"
                                            },
                                            { Type: "div", Style: "flex:1 1 auto; display:none;", Name: "removedArea" },
                                            {
                                                Type: "div", Style: "flex:0 0 auto;",
                                                Childs: [{
                                                    Type: "div", Tooltip: typeName,
                                                    Class: "rv-border-radius-quarter WarmBackgroundColor " +
                                                        "rv-ignore-top-" + RV_Float.toLowerCase() + "-radius " +
                                                        "rv-ignore-bottom-" + RV_RevFloat.toLowerCase() + "-radius",
                                                    Style: "flex:0 0 auto; display:flex; align-items:center;" +
                                                        "justify-content:center; padding:0.3rem 0.5rem; opacity:0.8;",
                                                    Childs: [{
                                                        Type: "img", Style: "width:0.8rem; height:0.8rem;",
                                                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(iconUrl) }]
                                                    }]
                                                }]
                                            }
                                        ]
                                    },
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "settings",
                                        Style: "display:none; padding:1rem; padding-top:0; padding-" + RV_Float + ":0;" +
                                            "padding-" + RV_RevFloat + ":2.8rem;",
                                        Childs: [
                                            { Type: "div", Name: "optionsEdit", Style: "margin-bottom:2.5rem;" },
                                            {
                                                Type: "div", Class: FormElementTypeSettings.SmallOptionClass, 
                                                Style: "display:flex; flex-flow:row; align-items:center; justify-content:center; margin-bottom:1rem;",
                                                Childs: [
                                                    {
                                                        Type: "div", Class: "rv-flat-label",
                                                        Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" +
                                                            "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                                        Childs: [{ Type: "text", TextValue: RVDic.ID + ":" }]
                                                    },
                                                    {
                                                        Type: "div", Style: "flex:1 1 auto; text-align:left; direction:ltr;",
                                                        Childs: [{
                                                            Type: "input", Class: "rv-input-simple rv-placeholder-align-left",
                                                            Style: "width:100%; font-size:0.7rem;", Name: "nameInput", InnerTitle: "e.g. field_id"
                                                        }]
                                                    }
                                                ]
                                            },
                                            { Type: "div", Class: "small-12 medium-12 large-12" },
                                            {
                                                Type: "div", Class: FormElementTypeSettings.SmallOptionClass, Style: "margin-bottom:1rem;",
                                                Childs: [
                                                    (type == "Separator" ? null : _create_checkbox({
                                                        Value: necessary, Title: RVDic.NecessaryField, Name: "necessaryCheckbox"
                                                    })),
                                                    (!hasUniqueCheckbox ? null : _create_checkbox({
                                                        Value: uniqueValue, Title: RVDic.UniqueValue, Name: "uniqueCheckbox"
                                                    })),
                                                    (!["Text", "Numeric"].some(t => t === type) ? null : _create_checkbox({
                                                        Value: isWorkFlowField, Title: RVDic.FG.IsWorkFlowField, Name: "isWorkFlowField"
                                                    }))
                                                ]
                                            },
                                            { Type: "div", Class: "small-12 medium-12 large-12" },
                                            (type == "Separator" ? null : {
                                                Type: "div", Style: "display:flex; flex-flow:row; align-items:center; margin-bottom:1rem;",
                                                Childs: [
                                                    {
                                                        Type: "div", Class: "rv-flat-label",
                                                        Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;" + 
                                                            "min-width:" + FormElementTypeSettings.SmallOptionLabelWidth + "rem;",
                                                        Childs: [{ Type: "text", TextValue: RVDic.Help + ":" }]
                                                    },
                                                    { Type: "div", Style: "flex:1 1 auto;", Name: "helpEditArea" }
                                                ]
                                            }),
                                            {
                                                Type: "div", Class: "small-12 medium-12 large-12",
                                                Style: "display:flex; flex-flow:row; margin-top:2rem;",
                                                Childs: [
                                                    {
                                                        Type: "div", Style: "flex:1 1 auto;",
                                                        Childs: [{
                                                            Type: "div", Class: "WarmColor", Name: "privacyButton",
                                                            Style: "flex:0 0 auto; cursor:pointer; font-size:0.7rem;",
                                                            Childs: [
                                                                { Type: "i", Class: "fa fa-key fa-lg", Style: "margin-" + RV_RevFloat + ":0.3rem;" },
                                                                { Type: "text", TextValue: RVDic.Privacy }
                                                            ]
                                                        }]
                                                    },
                                                    {
                                                        Type: "div", Name: "duplicateButton",
                                                        Style: "flex:0 0 auto; color:rgb(43,123,228); cursor:pointer;" +
                                                            "font-size:0.7rem; margin-" + RV_RevFloat + ":0.7rem;",
                                                        Childs: [
                                                            {
                                                                Type: "i", Class: "fa fa-clone fa-lg",
                                                                Style: "margin-" + RV_RevFloat + ":0.3rem;"
                                                            },
                                                            { Type: "text", TextValue: RVDic.Duplicate }
                                                        ]
                                                    },
                                                    { Type: "div", Style: "flex:0 0 auto; padding-left:1px; background-color:rgb(240,240,240);" },
                                                    {
                                                        Type: "div", Class: "RedColor", Name: "removeButton",
                                                        Style: "flex:0 0 auto; cursor:pointer;" +
                                                            "font-size:0.7rem; margin-" + RV_Float + ":0.7rem;",
                                                        Childs: [
                                                            {
                                                                Type: "i", Class: "fa fa-trash fa-lg",
                                                                Style: "margin-" + RV_RevFloat + ":0.3rem;"
                                                            },
                                                            { Type: "text", TextValue: RVDic.Remove }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }], container);

            if (!container.parentNode) that.Interface.ElementsContainer.appendChild(container);

            if ((insertAfter || {}).after) insertAfter.after(container);

            var elementDiv = elems["elementDiv"];

            elementDiv.ElementObject = params;

            var removeButton = elems["removeButton"];
            var duplicateButton = elems["duplicateButton"];
            var titleEditArea = elems["titleEditArea"];
            var helpEditArea = elems["helpEditArea"];
            var optionsEditArea = elems["optionsEdit"];

            var optionsExt = {};

            if (isParagraph) optionsExt.IsParagraph = true;
            else if (!isParagraph && (type == "Text")) optionsExt.IsSimpleText = true;

            var optionsEdit = (FormElementTypes[type] || {}).edit ?
                FormElementTypes[type].edit(info, GlobalUtilities.extend(params, optionsExt)) : null;

            if (optionsEdit) optionsEditArea.appendChild(optionsEdit.Container);
            else optionsEditArea.style.display = "none";

            var element = {
                ElementID: elementId, Type: type, Title: title, Name: name, Help: help,
                SequenceNumber: sequenceNumber, Info: info, ContainerDiv: elementDiv,
                TitleInput: null, NameInput: elems["nameInput"], HelpInput: null, SelectOptionsContainer: null
            };

            container.NameInput = element.NameInput;

            var nameValidationObj = that.initialize_name_validation(element.NameInput, {
                ObjectID: element.ElementID,
                FormID: that.Objects.FormID
            });

            element.TitleInput = new AdvancedTextArea({
                ContainerDiv: titleEditArea, DefaultText: RVDic.FieldTitle + ' "' + typeName + '"' + '...',
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" },
                OnLoad: function () {
                    var obj = this;

                    obj.set_data(title);

                    var txtArea = obj.textarea();

                    jQuery(txtArea).on("keyup", function () {
                        var dt = GlobalUtilities.trim(obj.get_data());

                        txtArea.classList[!dt ? "add" : "remove"]("rv-input-invalid");

                        jQuery(txtArea).css({ 'direction': GlobalUtilities.textdirection(dt) });
                    });
                }
            });

            element.HelpInput = !helpEditArea ? null : new AdvancedTextArea({
                ContainerDiv: helpEditArea, InputClass: "rv-input-simple", QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" },
                OnLoad: function () { this.set_data(help); }
            });

            element.NameInput.value = name;

            container.Activate = elementDiv.Activate = function (collapseOthers, callback) {
                if (container.Removed) return;

                var _do_callback = function () {
                    _do_callback = function () { };
                    if (GlobalUtilities.get_type(callback) == "function") callback();
                };

                var otherItems = !collapseOthers ? [] :
                    [].filter.call(that.Interface.ElementsContainer.getElementsByClassName(that.Options.CssClass.Placeholder),
                        obj => (obj != elementDiv) && !!obj.Deactive);

                jQuery(elementDiv).css({ 'border-color': 'rgb(200,200,200)' });
                elems["sideColor"].classList.remove("SoftBackgroundColor");
                elems["sideColor"].classList.add("WarmBackgroundColor");

                if (elems["settings"].style.display == "none")
                    jQuery(elems["settings"]).animate({ height: 'toggle' }, _do_callback);

                otherItems.forEach((obj, ind) => obj.Deactive(() => {
                    if (ind == (otherItems.length - 1)) _do_callback();
                }));

                _do_callback();
            };

            container.Deactive = elementDiv.Deactive = function (callback) {
                callback = GlobalUtilities.get_type(callback) == "function" ? callback : function () { };

                jQuery(elementDiv).css({ 'border-color': 'rgb(240,240,240)' });
                elems["sideColor"].classList.remove("WarmBackgroundColor");
                elems["sideColor"].classList.add("SoftBackgroundColor");

                if (elems["settings"].style.display != "none") jQuery(elems["settings"]).animate({ height: 'toggle' }, callback);
                else callback();
            };

            elementDiv.onclick = function () { elementDiv.Activate(true); };

            if (optionsEdit && optionsEdit.Set) optionsEdit.Set(info, weight);

            removeButton.onclick = function (e) {
                e.stopImmediatePropagation();

                container.Removed = true;

                elems["removedArea"].innerHTML = "";

                GlobalUtilities.scroll_into_view(container, {
                    Container: that.Interface.ElementsContainer,
                    Done: () => {
                        elementDiv.Deactive();

                        jQuery(elems["mainContent"]).css({ 'background-color': '', 'border-color': 'red' });
                        elems["mainContent"].classList.add("SoftBackgroundColor");

                        var rmElems = GlobalUtilities.create_nested_elements([{
                            Type: "div",
                            Style: "display:flex; flex-flow:row; align-items:center; padding:1rem; padding-" + RV_Float + ":0;",
                            Childs: [
                                { Type: "div", Style: "flex:0 0 auto;", Name: "timer" },
                                {
                                    Type: "div", Style: "flex:1 1 auto; padding:0 1rem; color:rgb(120,120,120);",
                                    Childs: [{ Type: "text", TextValue: RVDic.MSG.YourSelectedFieldDeleted }]
                                },
                                {
                                    Type: "div", Style: "flex:0 0 auto; color:blue; cursor:pointer;",
                                    Properties: [{
                                        Name: "onclick",
                                        Value: function () {
                                            container.Removed = false;
                                            clearInterval(_int);

                                            jQuery(elems["removedArea"]).fadeOut(100, function () { jQuery(titleEditArea).fadeIn(200); });

                                            jQuery(elems["mainContent"]).css({ 'background-color': 'white', 'border-color': 'rgb(240,240,240)' });
                                            elems["mainContent"].classList.remove("SoftBackgroundColor");

                                            elementDiv.Activate(true);
                                        }
                                    }],
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-undo fa-lg", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.Undo }
                                    ]
                                }
                            ]
                        }], elems["removedArea"]);

                        var counter = 10;

                        var cirObj = GlobalUtilities.append_circular_progress(rmElems["timer"], {
                            Size: 2,
                            Animate: true,
                            Duration: 0.2,
                            MinValue: 0,
                            MaxValue: counter,
                            Value: counter,
                            Label: counter,
                            Color: 'rgb(226,35,79)'
                        });

                        var _int = setInterval(() => {
                            if (counter <= 0) {
                                clearInterval(_int);
                                jQuery(container).animate({ height: 'toggle' }, 500, function () { jQuery(container).remove(); });
                            }
                            else {
                                --counter;
                                cirObj.Update(counter, counter);
                            }
                        }, 1000);

                        jQuery(titleEditArea).fadeOut(200, function () { jQuery(elems["removedArea"]).fadeIn(0); });
                    }
                });
            };

            duplicateButton.onclick = function (e) {
                var dt = container.GetData(true);

                if (dt === false) {
                    container.Validate();
                    GlobalUtilities.shake(container);
                    return;
                }

                dt.ElementID = dt.Name = null;
                console.log(dt);
                that.add_element(that.new_element_container(), dt, container);
            };

            var privacyButton = elems["privacyButton"];
            var showed = null;

            var privacyObj = null;

            privacyButton.onclick = function () {
                if (privacyButton.__Div) return (showed = GlobalUtilities.show(privacyButton.__Div));

                var _div = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }])["container"];

                privacyButton.__Div = _div;

                GlobalUtilities.loading(_div);
                showed = GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                    OnLoad: function () {
                        privacyObj = new PermissionSetting(_div, {
                            ObjectID: elementId,
                            Options: {
                                ConfidentialitySelect: true,
                                PermissionTypes: ["View"],
                                ObjectType: "FormElement",
                                OnSave: function (data) { showed.Close(); },
                                DontSave: true
                            }
                        });
                    }
                });
            };

            container.Validate = function () {
                if ((element.TitleInput || {}).textarea)
                    jQuery(element.TitleInput.textarea()).keyup();

                if ((nameValidationObj || {}).Check) nameValidationObj.Check();
            };

            container.Validate();

            container.GetData = function (encode) {
                var newTitle = GlobalUtilities.trim(element.TitleInput.get_data());
                var newName = GlobalUtilities.trim(element.NameInput.value);
                var newHelp = !element.HelpInput ? null : GlobalUtilities.trim(element.HelpInput.get_data());
                var newInfo = optionsEdit && optionsEdit.Get ? optionsEdit.Get() : null;
                var newWeight = optionsEdit && optionsEdit.Weight ? optionsEdit.Weight() : null;
                
                if (!newTitle || (newInfo === false) || (nameValidationObj && !nameValidationObj.Check())) return false;
                
                return {
                    ElementID: elementId,
                    Type: element.Type,
                    Title: encode ? Base64.encode(newTitle) : newTitle,
                    Name: encode ? Base64.encode(newName) : newName,
                    Help: encode ? Base64.encode(newHelp) : newHelp,
                    Info: !newInfo ? null : (encode ? Base64.encode(JSON.stringify(newInfo)) : JSON.stringify(newInfo)),
                    Weight: newWeight,
                    Necessary: elems["necessaryCheckbox"] ? elems["necessaryCheckbox"].Checkbox.checked : null,
                    UniqueValue: elems["uniqueCheckbox"] ? elems["uniqueCheckbox"].Checkbox.checked : null,
                    IsWorkFlowField: elems["isWorkFlowField"] ? elems["isWorkFlowField"].Checkbox.checked : null,
                    Privacy: (privacyObj || {}).get_data ? privacyObj.get_data() : null
                };
            };
        },

        preview: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "container"
            }]);

            GlobalUtilities.loading(elems["container"]);
            GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["FormsManager/FormViewer.js",], {
                OnLoad: function () {
                    var items = that.get_elements_dom().map(nd => nd.GetData());

                    items.forEach(i => {
                        ["Info", "Title", "Name", "Help"].filter(k => !!i[k]).forEach(k => { i[k] = Base64.encode(i[k]); });
                    });
                    
                    new FormViewer(elems["container"], {
                        FormID: that.Objects.FormID,
                        Elements: items,
                        Editable: true, ElementsEditable: false, HideDescription: true,
                        FillButton: false, Exportable: false, HasConfidentiality: false
                    });
                }
            });
        }
    }
})();