(function () {
    if (window.RejectionSettings) return;

    window.RejectionSettings = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!containerDiv) return;
        params = params || {};

        this.Objects = {
            WorkFlowID: params.WorkFlowID,
            State: params.State || {},
        };

        this.Options = {
            GetStates: params.GetStates || function () { }
        };

        var that = this;

        GlobalUtilities.load_files(["API/WFAPI.js"], { OnLoad: function () { that.initialize(); }});
    };

    RejectionSettings.prototype = {
        initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "checkbox",
                            Style: "width:1.2rem; height:1.2rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;",
                            Params: {
                                Checked: that.Objects.State.MaxAllowedRejections > 0,
                                OnChange: function () {
                                    var __this = this;
                                    var checked = __this.Checked;
                                    GlobalUtilities.block(that.ContainerDiv);

                                    WFAPI.SetMaxAllowedRejections({
                                        WorkFlowID: that.Objects.WorkFlowID,
                                        StateID: that.Objects.State.StateID,
                                        MaxAllowedRejections: (checked ? 1000 : 0), ParseResults: true,
                                        ResponseHandler: function (result) {
                                            if (result.ErrorText) {
                                                if (!checked) __this.Check({ StopOnChange: true });
                                                else __this.Uncheck({ StopOnChange: true });
                                            }

                                            elems["detailArea"].style.display = checked ? "block" : "none";

                                            GlobalUtilities.unblock(that.ContainerDiv);
                                        }
                                    });
                                }
                            }
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: RVDic.WF.RejectionAllowable }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "detailArea",
                    Style: "margin-top:1rem; display:" + (that.Objects.State.MaxAllowedRejections ? "block" : "none") + ";"
                }
            ], that.ContainerDiv);

            that.create_detail_area(elems["detailArea"]);
        },

        create_detail_area: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "itemContainer",
                    Style: "position:relative; padding-" + RV_Float + ":2.5rem; min-height:2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; margin-bottom:0.5rem; padding-" + RV_Float + ":10rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.WF.RejectionTitle + ":" }]
                                        },
                                        {
                                            Type: "input", Class: "rv-input", Name: "titleInput",
                                            Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.WF.RejectionTitle
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; margin-bottom:0.5rem; padding-" + RV_Float + ":10rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.WF.MaxAllowedRejections + ":" }]
                                        },
                                        {
                                            Type: "input", Class: "rv-input", Name: "maxInput",
                                            Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.WF.MaxAllowedRejections
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "position:relative; margin-bottom:0.5rem; padding-" + RV_Float + ":10rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.StateSelect + " (" + RVDic.Optional + ")" + ":" }]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "stateSelect" }
                                    ]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" }
                    ]
                }
            ], container);

            var editButton = elems["editButton"];
            var itemContainer = elems["itemContainer"];
            var editArea = elems["editArea"];
            var viewArea = elems["viewArea"];
            var titleInput = elems["titleInput"];
            var maxInput = elems["maxInput"];

            var stateSelect = GlobalUtilities.append_autosuggest(elems["stateSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.StateSelect + " (" + RVDic.Optional + ")",
                AjaxDataSource: function (text, callback) {
                    that.Options.GetStates(function (states) {
                        var arr = [];
                        for (var i = 0, lnt = states.length; i < lnt; ++i)
                            arr.push([Base64.decode(states[i].Title), states[i].StateID]);
                        callback(arr);
                    });
                }
            });

            var _set_info = function () {
                var _ttl = Base64.decode(that.Objects.State.RejectionTitle);
                var _rrstt = Base64.decode(that.Objects.State.RejectionRefStateTitle);
                var _mx = +that.Objects.State.MaxAllowedRejections;

                if (isNaN(_mx) || (_mx <= 0) || (_mx >= 1000)) _mx = "";

                var hasSomething = _mx || _ttl || _rrstt;

                viewArea.innerHTML = hasSomething ? "" : "(" + RVDic.NotSet + ")";

                if (hasSomething) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:" + (_ttl ? "inline-block" : "none") + ";",
                            Childs: [{ Type: "text", TextValue: RVDic.WF.RejectionTitle + ": " }]
                        },
                        {
                            Type: "div",
                            Style: "display:" + (_ttl ? "inline-block" : "none") + "; font-weight:bold;" +
                                "margin-" + RV_Float + ":0.5rem; margin-" + RV_RevFloat + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: _ttl }]
                        },
                        {
                            Type: "div", Style: "display:" + (_mx ? "inline-block" : "none") + ";",
                            Childs: [{ Type: "text", TextValue: RVDic.WF.MaxAllowedRejections + ": " }]
                        },
                        {
                            Type: "div",
                            Style: "display:" + (_mx ? "inline-block" : "none") + "; font-weight:bold;" +
                                "margin-" + RV_Float + ":0.5rem; margin-" + RV_RevFloat + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: _mx }]
                        },
                        {
                            Type: "div", Style: "display:" + (_rrstt ? "inline-block" : "none") + ";",
                            Childs: [{ Type: "text", TextValue: RVDic.State + ": " }]
                        },
                        {
                            Type: "div",
                            Style: "display:" + (_rrstt ? "inline-block" : "none") + "; font-weight:bold;" +
                                "margin-" + RV_Float + ":0.5rem; margin-" + RV_RevFloat + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: _rrstt }]
                        }
                    ], viewArea);
                }
                
                titleInput.value = Base64.decode(that.Objects.State.RejectionTitle);
                maxInput.value = _mx;

                if (that.Objects.State.RejectionRefStateID && that.Objects.State.RejectionRefStateTitle)
                    stateSelect.set_item(that.Objects.State.RejectionRefStateID, Base64.decode(that.Objects.State.RejectionRefStateTitle));
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_info();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                }

                if (editButton.__Editing === true) {
                    var _mar = GlobalUtilities.trim(maxInput.value);
                    if (!_mar) _mar = 1000;

                    if (!(new RegExp("^[1-9][0-9]*$")).test(_mar))
                        return alert(RVDic.Checks.MaxAllowedRejectionsMustBePositiveInteger);

                    var _rt = GlobalUtilities.trim(titleInput.value);

                    var index = stateSelect.selectedIndex;
                    var _rrstid = index < 0 ? "" : stateSelect.values[index];
                    var _rrsttt = index < 0 ? "" : stateSelect.keywords[index];

                    if (!GlobalUtilities.trim(stateSelect.InputElement.value)) _rrstid = _rrsttt = "";

                    GlobalUtilities.block(that.ContainerDiv);

                    WFAPI.SetRejectionSettings({
                        WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID,
                        MaxAllowedRejections: _mar, RejectionTitle: Base64.encode(_rt), RejectionRefStateID: _rrstid,
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.State.MaxAllowedRejections = _mar;
                                that.Objects.State.RejectionTitle = Base64.encode(_rt);
                                that.Objects.State.RejectionRefStateID = _rrstid;
                                that.Objects.State.RejectionRefStateTitle = Base64.encode(_rrsttt);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(that.ContainerDiv);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            if (!that.Objects.State.RejectionTitle) _on_edit();
            _set_info();
        }
    }
})();