(function () {
    if (window.ResponsibleManager) return;

    window.ResponsibleManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        
        this.Interface = {
            InfoItems: {}
        };
        
        this.Objects = {
            WorkFlowID: params.WorkFlowID,
            State: params.State || {}
        };

        this.Options = {
            GetStates: params.GetStates || function () { }
        };
        
        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI", "WFAPI", "UsersAPI"] }], {
            OnLoad: function () { that.initialize(); }
        });
    }

    ResponsibleManager.prototype = {
        initialize: function () {
            var that = this;

            that.Objects.State.Director = that.Objects.State.Director || {};

            var types = ["SendToOwner", "ContentAdmin", "SpecificNode", "RefState", "SpecificUser", "None"];

            var options = [];

            var add_option = function (p) {
                p = p || {};

                options.push({
                    Type: "option", Attributes: !p.Name ? null : [{ Name: "value", Value: p.Name }],
                    Childs: [{ Type: "text", TextValue: p.Title }]
                });
            };

            add_option({ Title: RVDic.WF.DirectorTypeSelect + "..." });
            jQuery.each(types, function (ind, val) { add_option({ Name: val, Title: RVDic.WF.DirectorTypes[val] }); });
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":7.5rem; min-height:2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":2.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.WF.Director + ":" }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [{
                                        Type: "select", Class: "rv-input", Name: "directorTypeSelect",
                                        Style: "width:100%; font-size:0.7rem;",
                                        Childs: options
                                    }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "info", Style: "margin-top:0.5rem;" }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            jQuery.each(types, function (ind, val) { that.responsible_info_create(elems["info"], val); });

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];
            var directorTypeSelect = elems["directorTypeSelect"];

            var get_selected_type = function () {
                return directorTypeSelect[directorTypeSelect.selectedIndex].getAttribute("value");
            };

            var on_director_select_change = function () {
                var tp = get_selected_type();

                for (var i in that.Interface.InfoItems) {
                    if ((i == tp) && that.Interface.InfoItems[i]) that.Interface.InfoItems[i].style.display = "flex";
                    else if (that.Interface.InfoItems[i]) that.Interface.InfoItems[i].style.display = "none";
                }
            };

            directorTypeSelect.onchange = on_director_select_change;

            for (var i = 0; i < directorTypeSelect.length; ++i) {
                if (directorTypeSelect[i].getAttribute("value") == (that.Objects.State.Director || {}).ResponseType) {
                    directorTypeSelect.selectedIndex = i;
                    on_director_select_change();
                    break;
                }
            }

            var _set_data = function () {
                viewArea.innerHTML = "";

                var dr = that.Objects.State.Director || {};
                var dType = dr.ResponseType;
                
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Style: "display:inline-block; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: RVDic.WF.DirectorTypes[dType] }]
                    },
                    ((dType != "SpecificUser") || !dr.FullName ? null : {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:inline-block; font-size:0.7rem; font-weight:bold; margin-" + RV_Float + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.RoleType + ": " + Base64.decode(dr.FullName) }]
                    }),
                    ((dType != "SpecificNode") || !dr.NodeType ? null : {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:inline-block; font-size:0.7rem; font-weight:bold; margin-" + RV_Float + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.RoleType + ": " + Base64.decode(dr.NodeType) }]
                    }),
                    ((dType != "SpecificNode") || !dr.NodeName ? null : {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:inline-block; font-size:0.7rem; font-weight:bold; margin-" + RV_Float + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Role + ": " + Base64.decode(dr.NodeName) }]
                    }),
                    (((dType != "SpecificNode") && (dType != "None")) || !dr.Admin ? null : {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:inline-block; font-size:0.7rem; font-weight:bold; margin-" + RV_Float + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Admin }]
                    }),
                    ((dType != "RefState") || !dr.RefStateTitle ? null : {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                        Style: "display:inline-block; font-size:0.7rem; font-weight:bold; margin-" + RV_Float + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.State + ": " + Base64.decode(dr.RefStateTitle) }]
                    })
                ], viewArea);
                
                for (var i in that.Interface.InfoItems) {
                    if ((that.Interface.InfoItems[i].InfoObject || {}).set_data)
                        that.Interface.InfoItems[i].InfoObject.set_data();
                }
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class", "fa " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-2x rv-icon-button");

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newResponseType = get_selected_type();
                    
                    var infoObj = (that.Interface.InfoItems[newResponseType] || {}).InfoObject || {};
                    var data = infoObj.get_data ? infoObj.get_data() || {} : {};

                    if (!newResponseType) return;
                    else if ((newResponseType == "RefState") && !data.RefStateID)
                        return alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.State));
                    else if (newResponseType == "SpecificNode") {
                        if (!data.NodeTypeID) return alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.RoleType));
                        else if (!data.NodeID) return alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.Role));
                    }
                    else if (newResponseType == "SpecificUser") {
                        if (!data.UserID) return alert(RVDic.Checks.PleaseSelectN.replace("[n]", RVDic.User));
                    }
                    
                    GlobalUtilities.block(that.ContainerDiv);

                    var dr = that.Objects.State.Director || {};

                    WFAPI.SetStateDirector({
                        WorkFlowID: that.Objects.WorkFlowID, StateID: that.Objects.State.StateID, ResponseType: newResponseType,
                        RefStateID: GlobalUtilities.get_type(data.RefStateID) == "undefined" ? dr.RefStateID : data.RefStateID,
                        DirectorNodeID: GlobalUtilities.get_type(data.NodeID) == "undefined" ? dr.NodeID : data.NodeID,
                        Admin: GlobalUtilities.get_type(data.Admin) == "undefined" ? dr.Admin : data.Admin,
                        DirectorUserID: GlobalUtilities.get_type(data.UserID) == "undefined" ? dr.UserID : data.UserID,
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.State.Director.ResponseType = newResponseType;

                                for (var i in data)
                                    that.Objects.State.Director[i] = data[i];

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

            if (!(that.Objects.State.Director || {}).ResponseType) _on_edit();
            _set_data();
        },

        info_method_name: function (directorType) {
            return "responsible_info_" + String(directorType).toLowerCase();
        },

        has_info: function(directorType){
            return !!this[this.info_method_name(directorType)];
        },

        responsible_info_create: function (container, directorType) {
            var that = this;

            if (!that.has_info(directorType) || that.Interface.InfoItems[directorType]) return;

            var _div = that.Interface.InfoItems[directorType] = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12 row", Name: "_div", Style: "margin:0rem; display:none;" }
            ], container)["_div"];

            _div.InfoObject = that[that.info_method_name(directorType)](_div);
        },

        responsible_info_refstate: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 meium-12 large-12", Name: "stateSelect" }
            ], container);

            var stateSelect = GlobalUtilities.append_autosuggest(elems["stateSelect"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.StateSelect + "...",
                AjaxDataSource: function (text, callback) {
                    that.Options.GetStates(function (states) {
                        var arr = [];
                        for (var i = 0, lnt = states.length; i < lnt; ++i)
                            arr.push([Base64.decode(states[i].Title), states[i].StateID]);
                        callback(arr);
                    });
                }
            });

            return {
                get_data: function () {
                    var index = stateSelect.selectedIndex;

                    return {
                        RefStateID: index >= 0 ? stateSelect.values[index] : null,
                        RefStateTitle: index >= 0 ? Base64.encode(stateSelect.keywords[index]) : null
                    };
                },
                set_data: function () {
                    var dr = that.Objects.State.Director || {};
                    if (dr.RefStateID) stateSelect.set_item(dr.RefStateID, Base64.decode(dr.RefStateTitle));
                }
            };

        },

        responsible_info_specificnode: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 meium-12 large-4", Name: "nodeType" },
                { Type: "div", Class: "small-12 meium-12 large-6", Name: "node", Style: "padding-" + RV_Float + ":0.5rem;" },
                {
                    Type: "div", Class: "small-12 meium-12 large-2", Style: "padding-" + RV_Float + ":1rem;",
                    Childs: [
                        {
                            Type: "middle",
                            Childs: [
                                {
                                    Type: "checkbox", Name: "chbAdmin",
                                    Style: "width:1.2rem; height:1.2rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;"
                                },
                                { Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: RVDic.BeAdmin }] }
                            ]
                        }
                    ]
                }
            ], container);

            var nodeTypeSelect = GlobalUtilities.append_autosuggest(elems["nodeType"], {
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
                    nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(nodeSelect.InputElement, RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });

            var nodeSelect = GlobalUtilities.append_autosuggest(elems["node"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeSelect + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource(),
                ResponseParser: function (responseText) {
                    var items = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = items.length; i < lnt; ++i)
                        arr.push([Base64.decode(items[i].Name), items[i].NodeID]);
                    return arr;
                }
            });

            return {
                get_data: function () {
                    var ntIndex = nodeTypeSelect.selectedIndex;
                    var nIndex = nodeSelect.selectedIndex;

                    return {
                        NodeTypeID: ntIndex >= 0 ? nodeTypeSelect.values[ntIndex] : null,
                        NodeType: ntIndex >= 0 ? Base64.encode(nodeTypeSelect.keywords[ntIndex]) : null,
                        NodeID: nIndex >= 0 ? nodeSelect.values[nIndex] : null,
                        NodeName: nIndex >= 0 ? Base64.encode(nodeSelect.keywords[nIndex]) : null,
                        Admin: elems["chbAdmin"].Checked
                    };
                },
                set_data: function () {
                    var dr = that.Objects.State.Director || {};

                    if (dr.NodeID) nodeSelect.set_item(dr.NodeID, Base64.decode(dr.NodeName));

                    if (dr.NodeTypeID) {
                        nodeTypeSelect.set_item(dr.NodeTypeID, Base64.decode(dr.NodeType));

                        nodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: dr.NodeTypeID }));

                        GlobalUtilities.set_inner_title(nodeSelect.InputElement,
                            RVDic.SelectN.replace("[n]", Base64.decode(dr.NodeType)) + "...");
                    }

                    if (dr.Admin) elems["chbAdmin"].Check({ StopOnChange: true });
                    else elems["chbAdmin"].Uncheck({ StopOnChange: true });
                }
            };
        },

        responsible_info_specificuser: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 meium-12 large-4", Name: "user"
            }], container);

            var userSelect = GlobalUtilities.append_autosuggest(elems["user"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    return (JSON.parse(responseText).Users || []).map(usr => {
                        var fullname = GlobalUtilities.trim((Base64.decode(usr.FirstName) || " ") + " " +
                            (Base64.decode(usr.LastName) || " "));

                        return [fullname, usr.UserID];
                    });
                }
            });

            return {
                get_data: function () {
                    var index = userSelect.selectedIndex;

                    return {
                        UserID: index >= 0 ? userSelect.values[index] : null,
                        FullName: index >= 0 ? Base64.encode(userSelect.keywords[index]) : null
                    };
                },
                set_data: function () {
                    var dr = that.Objects.State.Director || {};
                    if (dr.UserID) userSelect.set_item(dr.UserID, Base64.decode(dr.FullName));
                }
            };
        },

        responsible_info_none: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "checkbox", Name: "chbAdmin",
                    Style: "width:1.2rem; height:1.2rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;"
                },
                { Type: "div", Style: "display:inline-block;", Childs: [{ Type: "text", TextValue: RVDic.BeAdmin }] }
            ], container);

            return {
                get_data: function () {
                    return { Admin: elems["chbAdmin"].Checked };
                },
                set_data: function () {
                    var dr = that.Objects.State.Director || {};
                    
                    if (dr.Admin) elems["chbAdmin"].Check({ StopOnChange: true });
                    else elems["chbAdmin"].Uncheck({ StopOnChange: true });
                }
            };
        }
    }

})();