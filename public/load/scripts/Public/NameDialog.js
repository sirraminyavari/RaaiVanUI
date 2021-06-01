(function () {
    if (window.NameDialog) return;

    window.NameDialog = function (params) {
        var that = this;

        var title = params.Title;
        var innerTitle = params.InnerTitle;
        var descMode = params.DescriptionMode;
        var initialValue = params.InitialValue;
        var onActionCall = params.OnActionCall;
        var confirmMessage = params.ConfirmMessage || RVDic.Confirms.DoYouWantToSaveTheChanges;
        var modificationDetection = params.ModificationDetection !== false;

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                        Childs: [{ Type: "text", TextValue: title || RVDic.Title }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "inputArea",
                        Childs: descMode ? null : [{
                            Type: "input", Class: "rv-input", InnerTitle: innerTitle || RVDic.Title,
                            Style: "width:100%;", Name: "nameInput"
                        }]
                    },
                    { Type: "div", Class: "small-12 medium-1 large-1" },
                    {
                        Type: "div", Class: "small-6 medium-4 large-4 rv-air-button rv-circle",
                        Style: "margin-top:1rem; padding:0.2rem 1rem;", Name: "confirm",
                        Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                    },
                    { Type: "div", Class: "small-12 medium-2 large-2" },
                    {
                        Type: "div", Class: "small-6 medium-4 large-4 rv-air-button rv-circle",
                        Style: "margin-top:1rem; padding:0.2rem 1rem;", Name: "cancel",
                        Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                    },
                    { Type: "div", Class: "small-12 medium-1 large-1" }
                ]
            }
        ]);

        var canceled = false;
        var processing = false;

        var textArea = !descMode ? null : new AdvancedTextArea({
            ContainerDiv: elems["inputArea"], DefaultText: (innerTitle || RVDic.Description) + "...", QueryTemplate: "RelatedThings",
            ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
        });

        var input = descMode ? textArea.textarea() : elems["nameInput"];

        var _get_value = function () {
            return GlobalUtilities.trim(textArea ? textArea.get_data() : elems["nameInput"].value);
        };

        var _do = function () {
            var nm = _get_value();

            if (processing || !nm) return;

            if (initialValue && (nm == initialValue)) {
                canceled = true;
                showed.Close();
            }

            processing = true;

            onActionCall(nm, function (succeed) {
                if (succeed) {
                    canceled = true;
                    showed.Close();
                }

                processing = false;
            });
        };

        if (!descMode) GlobalUtilities.set_onenter(input, function () { _do(); });

        elems["confirm"].onclick = function () { _do(); };

        elems["cancel"].onclick = function () {
            canceled = true;
            showed.Close();
            onActionCall(false, function () { });
        };

        var showed = GlobalUtilities.show(elems["container"], {
            OnShow: function () {
                if (initialValue) {
                    if (descMode) textArea.set_data(initialValue);
                    else input.value = initialValue;

                    jQuery(input).focus().select();
                }
                else jQuery(input).focus();
            },
            OnClose: function () {
                if (canceled) return;
                var nm = _get_value();
                
                if (modificationDetection && ((initialValue && nm && (nm != initialValue)) || (!initialValue && nm))) {
                    var msg = GlobalUtilities.get_type(confirmMessage) == "function" ? confirmMessage(nm) : confirmMessage;
                    GlobalUtilities.confirm(msg, function (r) {
                        if (r) _do();
                        else onActionCall(false, function () { });
                    });
                }
                else onActionCall(false, function () { });
            }
        });
    }
})();