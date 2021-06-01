(function () {
    if (window.ContributionEnabler) return;

    window.ContributionEnabler = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {}

        this.Objects = {
            NodeTypeID: params.NodeTypeID,
            NodeTypeSelect: null
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params); } });
    };

    ContributionEnabler.prototype = {
        _initialize: function (params) {
            params = params || {};
            var that = this;

            var limits = params.ContributionLimits || [];
            for (var i = 0, lnt = limits.length; i < lnt; ++i)
                limits[i].Name = Base64.decode(limits[i].Name);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [
                                {
                                    Type: "checkbox",
                                    Params: {
                                        Checked: params.EnableContribution === true, Width: 18, Height: 18,
                                        OnClick: function (e, done) {
                                            e.preventDefault();

                                            var _enable = !this.Checked;

                                            CNAPI.EnableContribution({
                                                NodeTypeID: that.Objects.NodeTypeID, Enable: _enable, ParseResults: true,
                                                ResponseHandler: function (result) {
                                                    done(!result.ErrorText);

                                                    if (!result.ErrorText)
                                                        elems["limitsDiv"].style.display = _enable === true ? "block" : "none";
                                                }
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CN.Service.EnableContribution }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "limitsDiv",
                    Style: "position:relative; margin-top:0.5rem; padding-" + RV_Float + ":12rem; min-height:1.5rem;" +
                        (params.EnableContribution === true ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Style: "width:1.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "div", Style: "display:inline-block;",
                                    Childs: [{ Type: "text", TextValue: RVDic.CN.Service.LimitOwnerNodeTo + ":" }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;" }
                    ]
                }
            ], that.ContainerDiv);

            var editButton = elems["editButton"];
            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];

            var areaLimitItems = null;

            GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    areaLimitItems = new NewSingleDataContainer(editArea, {
                        InputClass: "rv-input",
                        InputStyle: "width:100%; font-size:0.7rem;",
                        InnerTitle: RVDic.NodeTypeSelect + "...",
                        NoButtons: true,
                        AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                        ResponseParser: function (responseText) {
                            var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                            var arr = [];
                            for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                                arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                            return arr;
                        }
                    });

                    for (var i = 0, lnt = limits.length; i < lnt; ++i)
                        areaLimitItems.add_item(limits[i].Name, limits[i].NodeTypeID);
                }
            });
            
            var _set_data = function () {
                viewArea.innerHTML = "";
                
                jQuery.each(limits || [], function (ind, val) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                { Type: "div", Style: "display:inline-block; padding:1px; background-color:red; width:0.5rem;" },
                                {
                                    Type: "div", Style: "display:inline-block; font-size:0.7rem; margin:0 0.5rem;",
                                    Childs: [{ Type: "text", TextValue: val.Name }]
                                }
                            ]
                        }
                    ], viewArea);
                });
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class", editButton.__Editing ?
                        "fa fa-floppy-o fa-lg rv-icon-button" : "fa fa-pencil fa-lg rv-icon-button");
                };

                if (editButton.__Editing === true) {
                    var newLimits = areaLimitItems.get_items({ TitleAlso: true });

                    var strLimits = "";
                    var _jsonLimits = [];
                    for (var i = 0, lnt = newLimits.length; i < lnt; ++i) {
                        strLimits += (i == 0 ? "" : "|") + newLimits[i].ID;
                        _jsonLimits.push({ NodeTypeID: newLimits[i].ID, Name: newLimits[i].Title });
                    }

                    GlobalUtilities.block(that.ContainerDiv);

                    CNAPI.SetContributionLimits({
                        NodeTypeID: that.Objects.NodeTypeID, Limits: strLimits, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                limits = _jsonLimits;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(that.ContainerDiv);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;

            if (limits.length == 0) _on_edit();
            _set_data();
        }
    };
})();