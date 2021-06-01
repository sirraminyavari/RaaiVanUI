(function () {
    if (window.FormElementsSelect) return;

    window.FormElementsSelect = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID,
            FormID: params.FormID,
            SelectedElements: {},
            OnCancel: params.OnCancel
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js", "FormsManager/FormElementTypes.js"], {
            OnLoad: function () { that._preinit(); }
        });
    }

    FormElementsSelect.prototype = {
        _preinit: function (oncancel) {
            var that = this;

            FGAPI.GetElementLimits({
                OwnerID: that.Objects.OwnerID, ParseResults: true,
                ResponseHandler: function (result) {
                    var elements = result.Elements || [];
                    that._initialize(elements);
                }
            });
        },

        _reset: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            GlobalUtilities.loading(that.ContainerDiv);

            that._preinit();
        },

        _initialize: function (elements) {
            var that = this;

            that.ContainerDiv.innerHTML = "";
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "elementsArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle", 
                                    Properties: [{ Name: "onclick", Value: function () { that.Objects.OnCancel(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                                },
                                { Type: "div", Class: "small-2 medium-2 large-2" },
                                {
                                    Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                                    Properties: [{ Name: "onclick", Value: function () { that.select_elements(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.SelectFields }]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            var elementsArea = elems["elementsArea"];

            for (var i = 0, lnt = (elements || []).length; i < lnt; ++i)
                that.add_limit_element(elementsArea, elements[i]);
        },

        add_limit_element: function (container, element) {
            var that = this;

            var elementId = element.ElementID || "";
            var title = Base64.decode(element.Title || "");
            var type = RVDic.FG.ElementTypes[element.Type] || RVDic.FG.ElementTypes.Text;
            element.Info = JSON.parse(Base64.decode(element.Info || "") || "{}");

            that.Objects.SelectedElements[elementId] = true;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "cursor:pointer; padding:0.3rem;", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton",
                                    Style: "margin-" + RV_RevFloat + ":0.5rem;", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "checkbox", Tooltip: RVDic.Necessity,
                                    Params: {
                                        Checked: element.Necessary == true, Width: 16, Height: 16,
                                        OnClick: function (e, done) {
                                            e.preventDefault();

                                            FGAPI.SetElementLimitNecessity({
                                                OwnerID: that.Objects.OwnerID,
                                                ElementID: elementId, Necessary: !this.Checked,
                                                ResponseHandler: function (responseText) { if (!JSON.parse(responseText).ErrorText) done(); }
                                            });
                                        }
                                    }
                                },
                                {
                                    Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: title + " (" + type + ")" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "infoArea",
                            Style: "font-size:0.7rem; margin-top:0.3rem; color:gray; padding-" + RV_Float + ":1rem;"
                        }
                    ]
                }
            ], container);

            var viewElement = ((FormElementTypes[element.Type || ""] || {}).view || function () { })(element);
            if ((viewElement || {}).Container) elems["infoArea"].appendChild(viewElement.Container);

            elems["removeButton"].onclick = function () {
                GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveTheField, function (r) {
                    if (!r) return;

                    GlobalUtilities.block(elems["container"]);

                    FGAPI.RemoveElementLimit({
                        OwnerID: that.Objects.OwnerID, ElementID: elementId, ParseResults: true,
                        ResponseHandler: function (result) {
                            GlobalUtilities.unblock(elems["container"]);

                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.SelectedElements[elementId] = false;
                                elems["container"].parentNode.removeChild(elems["container"]);
                            }
                        }
                    });
                });
            };
        },

        select_elements: function () {
            var that = this;

            that.___FormElements = that.___FormElements || {};
            that.___FormElements[that.Objects.FormID] = null;
            that.___FormElementsDiv = null;
            that.___FormElementsShowedDiv = null;

            if (that.___FormElementsDiv && that.___FormElements[that.Objects.FormID]) {
                that.___FormElementsShowedDiv = GlobalUtilities.show(that.___FormElementsDiv);
                return;
            }

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "elementsArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                                    Properties: [{ Name: "onclick", Value: function () { that.___FormElementsShowedDiv.Close(); } }],
                                    Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                                },
                                { Type: "div", Class: "small-2 medium-2 large-2" },
                                {
                                    Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                                    Properties: [
                                        {
                                            Name: "onclick",
                                            Value: function () {
                                                var elementIds = [];
                                                for (var i = 0, lnt = that.___FormElements[that.Objects.FormID].length; i < lnt; ++i) {
                                                    if (that.___FormElements[that.Objects.FormID][i].Checked)
                                                        elementIds.push(that.___FormElements[that.Objects.FormID][i].ElementID);
                                                }

                                                FGAPI.SetElementLimits({
                                                    OwnerID: that.Objects.OwnerID, ElementIDs: elementIds.join("|"),
                                                    ParseResults: true,
                                                    ResponseHandler: function (result) {
                                                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                                        else {
                                                            that.___FormElementsShowedDiv.Close();
                                                            that._reset();
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    ],
                                    Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["elementsArea"]);

            var container = that.___FormElementsDiv = elems["container"];
            var elementsArea = elems["elementsArea"];

            that.___FormElementsShowedDiv = GlobalUtilities.show(container);

            FGAPI.GetFormElements({
                FormID: that.Objects.FormID, ParseResults: true,
                ResponseHandler: function (result) {
                    var elements = that.___FormElements[that.Objects.FormID] = result.Elements || [];

                    elementsArea.innerHTML = "";

                    for (var i = 0, lnt = (elements || []).length; i < lnt; ++i)
                        that.add_form_element(elementsArea, elements[i]);
                }
            });
        },

        add_form_element: function (container, element) {
            var that = this;

            var elementId = element.ElementID || "";
            var title = Base64.decode(element.Title || "");
            var type = RVDic.FG.ElementTypes[element.Type] || RVDic.FG.ElementTypes.Text;
            element.Info = JSON.parse(Base64.decode(element.Info || "") || "{}");

            element.Checked = that.Objects.SelectedElements[elementId] ? true : false;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-quarter",
                    Style: "cursor:pointer; padding:0.3rem;", Name: "_div",
                    Properties: [
                        {
                            Name: "onclick",
                            Value: function () {
                                element.Checked = !element.Checked;
                                _set_view();
                            }
                        }
                    ],
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: title + " (" + type + ")" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "infoArea",
                            Style: "font-size:0.7rem; margin-top:0.3rem; color:gray; padding-" + RV_Float + ":1rem;"
                        }
                    ]
                }
            ], container);

            var _div = elems["_div"];

            var viewElement = ((FormElementTypes[element.Type || ""] || {}).view || function () { })(element);
            if ((viewElement || {}).Container) elems["infoArea"].appendChild(viewElement.Container);

            var _set_view = function () {
                _div.style.fontWeight = element.Checked ? "bold" : "normal";
                _div.style.color = element.Checked ? "black" : "gray";
            }

            _set_view();
        }
    }
})();