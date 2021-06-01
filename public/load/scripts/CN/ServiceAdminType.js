(function () {
    if (window.ServiceAdminType) return;

    window.ServiceAdminType = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {}

        this.Objects = {
            NodeTypeID: params.NodeTypeID || "",
            NodeSelect: null,
            NodeTypeSelect: null
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._initialize(params); } });
    };

    ServiceAdminType.prototype = {
        _initialize: function (params) {
            params = params || {};
            var that = this;

            var serviceAdminType = params.AdminType || "";

            var adminNode = params.AdminNode || {};
            if (adminNode.Name) adminNode.Name = Base64.decode(adminNode.Name);
            if (adminNode.NodeType) adminNode.NodeType = Base64.decode(adminNode.NodeType);

            var limits = params.AdminLimits || [];
            for (var i = 0, lnt = limits.length; i < lnt; ++i)
                limits[i].Name = Base64.decode(limits[i].Name || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":12rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button",
                                    Tooltip: RVDic.Edit, Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem;" + RV_Float + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CN.Service.AdminType.AdminType + ":" }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "serviceAdminType",
                                    Style: "color:green; font-size:0.7rem; font-weight:bold;"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "limitsView", Style: "margin-top:0.5rem;" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [
                                        {
                                            Type: "select", Class: "rv-input", Name: "typeSelect", Style: "width:100%; font-size:0.7rem;",
                                            Childs: [
                                                {
                                                    Type: "option",
                                                    Properties: [{ Name: "etype", Value: "AreaAdmin" }],
                                                    Childs: [{ Type: "text", TextValue: RVDic.CN.Service.AdminType.AreaAdmin }]
                                                },
                                                {
                                                    Type: "option",
                                                    Properties: [{ Name: "etype", Value: "ComplexAdmin" }],
                                                    Childs: [{ Type: "text", TextValue: RVDic.CN.Service.AdminType.ComplexAdmin }]
                                                },
                                                {
                                                    Type: "option",
                                                    Properties: [{ Name: "etype", Value: "SpecificNode" }],
                                                    Childs: [{ Type: "text", TextValue: RVDic.CN.Service.AdminType.SpecificNode }]
                                                },
                                                {
                                                    Type: "option",
                                                    Properties: [{ Name: "etype", Value: "Registerer" }],
                                                    Childs: [{ Type: "text", TextValue: RVDic.CN.Service.AdminType.Registerer }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "areaLimit",
                                    Style: "position:relative; margin-top:0.5rem; padding-" + RV_Float + ":8rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.CN.Service.AdminType.LimitAreaTo + ":" }]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "areaLimitItems" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeSelectArea",
                                    Style: "position:relative; margin-top:0.5rem; padding-" + RV_Float + ":8rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.CN.Service.AdminType.NodeSelect + ":" }]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeTypeSelect" },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeSelect", Style: "margin-top:0.5rem;" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            var viewArea = elems["viewArea"];
            var serviceAdminTypeView = elems["serviceAdminType"];
            var limitsView = elems["limitsView"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];
            var typeSelect = elems["typeSelect"];

            var areaLimit = elems["areaLimit"];
            var nodeSelectArea = elems["nodeSelectArea"];

            var areaLimitItems = null;

            GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    areaLimitItems = new NewSingleDataContainer(elems["areaLimitItems"], {
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
                        areaLimitItems.add_item(limits[i].Name, limits[i].NodeTypeID || "");
                }
            });

            that.Objects.NodeSelect = GlobalUtilities.append_autosuggest(elems["nodeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + "...",
                AjaxDataSource: CNAPI.GetNodes(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        var tt = Base64.decode(items[i].Name || "");
                        if ((items[i].AdditionalID || "") == "") tt += " - " + Base64.decode(items[i].AdditionalID || "");
                        arr.push([tt, items[i].NodeID]);
                    }
                    return arr;
                }
            });

            that.Objects.NodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeTypeSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex];
                    var nodeType = this.keywords[this.selectedIndex];
                    that.Objects.NodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(that.Objects.NodeSelect.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });

            if (adminNode.NodeID) {
                that.Objects.NodeSelect.set_item(adminNode.NodeID, adminNode.Name || "");
                that.Objects.NodeTypeSelect.set_item(adminNode.NodeTypeID, adminNode.NodeType || "");
            }

            var _set_display = function (_aType) {
                var _type = _aType || typeSelect[typeSelect.selectedIndex]["etype"];
                areaLimit.style.display = _type == "AreaAdmin" || _type == "ComplexAdmin" ? "block" : "none";
                nodeSelectArea.style.display = _type == "SpecificNode" ? "block" : "none";
            };

            _set_display(serviceAdminType);

            typeSelect.onchange = function () { _set_display(); }

            var _set_data = function () {
                serviceAdminTypeView.innerHTML = serviceAdminType ? RVDic.CN.Service.AdminType[serviceAdminType] : RVDic.NotSet;

                limitsView.innerHTML = "";

                if ((serviceAdminType == "AreaAdmin") || (serviceAdminType == "ComplexAdmin")) {
                    for (var i = 0, lnt = limits.length; i < lnt; ++i) {
                        GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", 
                                Style: "display:inline-block; padding:1px; background-color:red; width:0.6rem; text-align:center; margin:0.4rem 0.6rem 0rem 0.6rem;"
                            },
                            {
                                Type: "div", Style: "display:inline-block; font-size:0.7rem;",
                                Childs: [{ Type: "text", TextValue: limits[i].Name }]
                            }
                        ], limitsView);
                    }
                }
                else if (serviceAdminType == "SpecificNode") {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div",
                            Style: "display:inline-block; padding:1px; background-color:red; width:0.6rem; text-align:center; margin:0.4rem 0.6rem 0rem 0.6rem;"
                        },
                        {
                            Type: "div", Style: "display:inline-block; font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: adminNode.Name }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; font-size:0.7rem; margin:0rem 0.3rem; color:gray;",
                            Childs: [{ Type: "text", TextValue: "(" + adminNode.NodeType + ")" }]
                        }
                    ], limitsView);
                }

                for (var i = 0, lnt = typeSelect.length; i < lnt; ++i) {
                    if (typeSelect[i]["etype"] == serviceAdminType) {
                        typeSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class",
                        editButton.__Editing ? "fa fa-floppy-o fa-lg rv-icon-button" : "fa fa-pencil fa-lg rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newType = typeSelect[typeSelect.selectedIndex]["etype"];
                    var newLimits = areaLimitItems.get_items({ TitleAlso: true });

                    var strLimits = "";
                    var _jsonLimits = [];
                    for (var i = 0, lnt = newLimits.length; i < lnt; ++i) {
                        strLimits += (i == 0 ? "" : "|") + newLimits[i].ID;
                        _jsonLimits.push({ NodeTypeID: newLimits[i].ID, Name: newLimits[i].Title });
                    }

                    var index = that.Objects.NodeSelect.selectedIndex;
                    var nodeId = index >= 0 ? that.Objects.NodeSelect.values[index] : "";
                    var nodeName = index >= 0 ? that.Objects.NodeSelect.keywords[index] : "";

                    index = that.Objects.NodeTypeSelect.selectedIndex;
                    var nodeTypeId = index >= 0 ? that.Objects.NodeTypeSelect.values[index] : "";
                    var nodeType = index >= 0 ? that.Objects.NodeTypeSelect.keywords[index] : "";

                    if ((newType == "SpecificNode") && !nodeId) return;

                    GlobalUtilities.block(that.ContainerDiv);

                    CNAPI.SetServiceAdminType({
                        NodeTypeID: that.Objects.NodeTypeID, AdminType: newType, AdminNodeID: nodeId, Limits: strLimits,
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                serviceAdminType = newType;
                                adminNode = { NodeID: nodeId, Name: nodeName, NodeTypeID: nodeTypeId, NodeType: nodeType };
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
            } //end of _on_edit

            editButton.onclick = _on_edit;

            if (!serviceAdminType) _on_edit();
            _set_data();
        }
    };
})();