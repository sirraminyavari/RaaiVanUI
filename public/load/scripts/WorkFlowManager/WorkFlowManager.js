(function () {
    if (window.WorkFlowManager) return;

    window.WorkFlowManager = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            Info: null,
            Options: null,
            Buttons: {
                RenameState: null, StateSettings: null, RemoveState: null, AddEdge: null,
                NewEdge: null, SortEdges: null, EdgeSettings: null, RemoveEdge: null
            },
            ToOption: null
        };

        this.Objects = {
            WorkFlowID: params.WorkFlowID,
            Network: null,
            NetworkInitialized: false,
            Nodes: {},
            Edges: {},
            StateSelect: null,
            SelectedID: null,
            IsAddEdgeMode: false,
            BeginningID: "begin"
        };

        var that = this;

        GlobalUtilities.load_files(["NetworkGraph/NetworkGraph.js", "Public/NameDialog.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    WorkFlowManager.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var create_button = function (p) {
                p = p || {};

                return {
                    Type: "div", Class: "rv-air-button rv-circle", Name: p.Name,
                    Style: "display:inline-block; margin:0.2rem; font-size:0.7rem;",
                    Childs: [
                        {
                            Type: "i", Class: "fa " + (p.Icon || " "),
                            Style: "margin-" + RV_RevFloat + ":0.4rem;" + (p.Icon ? "" : "display:none;"),
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        },
                        { Type: "text", TextValue: p.Title }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; height:100%; padding-top:5rem; text-align:center;",
                    Childs: [
                        {
                            Type: "div", Class: "rv-border-radius-half",
                            Style: "position:absolute; background-color:white; top:0rem; left:0rem; right:0rem;" +
                                "padding:0.3rem; height:4.3rem; overflow:hidden;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "optionsArea", Style: "display:none;",
                                    Childs: [
                                        create_button({ Name: "editNode", Title: RVDic.SettingsOfN.replace("[n]", RVDic.State), Icon: "fa-cog" }),
                                        create_button({ Name: "editEdge", Title: RVDic.SettingsOfN.replace("[n]", RVDic.Option), Icon: "fa-cog" }),
                                        create_button({ Name: "addNode", Title: RVDic.AddN.replace("[n]", RVDic.State) }),
                                        create_button({ Name: "renameNode", Title: RVDic.RenameN.replace("[n]", RVDic.State) }),
                                        create_button({ Name: "removeNode", Title: RVDic.RemoveN.replace("[n]", RVDic.State) }),
                                        create_button({ Name: "newEdge", Title: RVDic.AddN.replace("[n]", RVDic.Option) }),
                                        create_button({ Name: "sortEdges", Title: RVDic.SortOptions }),
                                        create_button({ Name: "removeEdge", Title: RVDic.RemoveN.replace("[n]", RVDic.Option) }),
                                        create_button({ Name: "imgBtn", Title: RVDic.ConvertToImage }),
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":1.5rem;",
                                            Childs: [
                                                {
                                                    Type: "checkbox", Name: "enablePhysics",
                                                    Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;",
                                                    Params: {
                                                        Checked: true,
                                                        OnChange: function () {
                                                            if (!that.Objects.NetworkInitialized) return;

                                                            if (this.Checked) that.Objects.Network.enable_physics();
                                                            else that.Objects.Network.disable_physics();
                                                        }
                                                    }
                                                },
                                                {
                                                    Type: "div", Style: "display:inline-block;",
                                                    Childs: [{ Type: "text", TextValue: RVDic.AutoPositioning }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-top:0.5rem; text-align:center;", Name: "info"
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "newEdgeArea",
                                    Style: "display:none; padding:0.5rem;",
                                    Childs: [
                                        {
                                            Type: "div", Name: "reservedState",
                                            Class: "rv-border-radius-quarter rv-bg-color-softer-soft SoftBorder",
                                            Style: "display:inline-block; padding:0.1rem 0.5rem; font-size:0.8rem; font-weight:bold;"
                                        },
                                        {
                                            Type: "div", Name: "reservedOption",
                                            Class: "rv-border-radius-quarter rv-bg-color-softer-soft SoftBorder",
                                            Style: "display:inline-block; padding:0.1rem 0.5rem; font-size:0.8rem;" +
                                                "font-weight:bold; margin-" + RV_Float + ":0.5rem;"
                                        },
                                        {
                                            Type: "div", Class: "rv-air-button rv-circle", Name: "cancelEdge",
                                            Style: "display:inline-block; font-size:0.7rem;" +
                                                "margin-" + RV_Float + ":1rem; width:6rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                                        },
                                        {
                                            Type: "div", Class: "rv-air-button rv-circle", Name: "addEdge",
                                            Style: "display:inline-block; font-size:0.7rem;" +
                                                "margin-" + RV_Float + ":0.5rem; width:6rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Add }]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "font-size:0.7rem; margin-top:0.5rem; text-align:center;",
                                            Childs: [{ Type: "text", TextValue: RVDic.WF.OptionSelectForNewEdgeInfo }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBorder HardShadow",
                            Style: "position:relative; height:100%; border-color:rgb(200,200,200); overflow:hidden;" +
                                "background-color:rgba(255,255,255,0.5);",
                            Childs: [
                                {
                                    Type: "div", Name: "state",
                                    Style: "position:absolute; display:none; top:0.5rem;" + RV_Float + ":0.5rem; width:30rem; z-index:1;"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1",
                                    Style: "height:100%;", Name: "wfArea"
                                }
                            ]
                        }
                    ]
                }
            ], that.Container);

            that.Interface.Options = elems["optionsArea"];
            that.Interface.Buttons.RenameState = elems["renameNode"];
            that.Interface.Buttons.StateSettings = elems["editNode"];
            that.Interface.Buttons.RemoveState = elems["removeNode"];
            that.Interface.Buttons.NewEdge = elems["newEdge"];
            that.Interface.Buttons.AddEdge = elems["addEdge"];
            that.Interface.Buttons.SortEdges = elems["sortEdges"];
            that.Interface.Buttons.EdgeSettings = elems["editEdge"];
            that.Interface.Buttons.RemoveEdge = elems["removeEdge"];
            that.Interface.ToOption = elems["reservedOption"];
            that.Interface.Info = elems["info"];

            jQuery(that.Interface.Buttons.AddEdge).fadeOut(0);

            var edge_added = function () {
                if (that.FadingFromNewEdge) return;
                that.FadingFromNewEdge = true;
                that.Objects.IsAddEdgeMode = false;

                jQuery(elems["newEdgeArea"]).fadeOut(500, function () {
                    jQuery(elems["optionsArea"]).fadeIn(500, function () { that.FadingFromNewEdge = false; });
                });
            };

            elems["cancelEdge"].onclick = edge_added;

            var new_edge = function () {
                var stateId = that.Objects.SelectedID;
                if (!that.Objects.Nodes[stateId]) return;

                if (that.FadingToNewEdge) return;
                that.FadingToNewEdge = true;
                that.Objects.IsAddEdgeMode = true;

                jQuery(elems["optionsArea"]).fadeOut(500, function () {
                    elems["reservedState"].innerHTML = "";

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "span", Style: "color:rgb(80,80,80); font-weight:normal; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.State + ":" }]
                        },
                        { Type: "text", TextValue: GlobalUtilities.secure_string(Base64.decode(that.Objects.Nodes[stateId].Title)) }
                    ], elems["reservedState"]);

                    that.set_to_option();
                    jQuery(elems["newEdgeArea"]).fadeIn(500, function () { that.FadingToNewEdge = false; });
                });
            };

            elems["addNode"].onclick = function () { that.add_state(); };
            elems["renameNode"].onclick = function () { that.rename_state(); };
            elems["editNode"].onclick = function () { that.state_settings(); };
            elems["removeNode"].onclick = function () { that.remove_state(); };
            elems["newEdge"].onclick = function () { new_edge(); };
            elems["sortEdges"].onclick = function () { that.sort_edges(); };
            elems["editEdge"].onclick = function () { that.edge_settings(); };
            elems["removeEdge"].onclick = function () { that.remove_edge(); };
            elems["addEdge"].onclick = function () {
                var stId = that.Interface.Buttons.AddEdge.StateID, opId = that.Interface.Buttons.AddEdge.OptionID;
                if (stId && opId) that.add_edge(stId, opId, function () { edge_added(); });
            };

            that.Objects.StateSelect = GlobalUtilities.append_autosuggest(elems["state"], {
                InputClass: "rv-input", InputStyle: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.StateSelect,
                OnSelect: function (index) {
                    var id = that.Objects.StateSelect.values[index];
                    that.Objects.Network.zoom_on_node(id);
                    that.on_node_select(id);
                }
            });

            elems["imgBtn"].onclick = function () {
                if (!that.Objects.NetworkInitialized) return;
                that.show_image({
                    OnStart: function () {
                        elems["wfArea"].style.width = "150rem";
                        elems["wfArea"].style.height = "150rem";
                        elems["wfArea"].setAttribute("class", "rv-border-radius-1");
                    },
                    OnEnd: function () {
                        elems["wfArea"].style.width = "";
                        elems["wfArea"].style.height = "100%";
                        elems["wfArea"].setAttribute("class", "small-12 medium-12 large-12 rv-border-radius-1");
                    }
                });
            };
            
            that.Objects.Network = new NetworkGraph(elems["wfArea"], {
                OnInit: function () {
                    that.Objects.NetworkInitialized = true;
                    jQuery(elems["state"]).fadeIn(500);
                    that.set_state_select_datasource();
                },
                DataRequest: function (callback) {
                    WFAPI.GetWorkFlow({
                        WorkFlowID: that.Objects.WorkFlowID, ParseResults: true,
                        ResponseHandler: function (result) {
                            var states = result.States || [];
                            var statesArr = [], connectionsArr = [];

                            jQuery.each(result.States || [], function (ind, val) {
                                that.Objects.Nodes[val.StateID] = val;

                                statesArr.push({ ID: val.StateID, Title: Base64.decode(val.Title), Options: that.default_state_options() });

                                jQuery.each(val.Connections || [], function (i, v) {
                                    v.StateID = val.StateID;
                                    that.Objects.Edges[v.ID] = v;

                                    connectionsArr.push({ ID: v.ID, FromID: val.StateID, ToID: v.OutStateID });
                                });
                            });

                            //Set beginning and ending states
                            var beginning = that.get_beginning_states();
                            var ending = that.get_ending_states();

                            var beginning = that.get_beginning_states();
                            var ending = that.get_ending_states();

                            statesArr.push({
                                ID: that.Objects.BeginningID, Title: RVDic.Start, Options: that.beginning_state_options()
                            });

                            jQuery.each(beginning || [], function (ind, val) {
                                connectionsArr.push({
                                    ID: that.beginning_edge_id(val), FromID: that.Objects.BeginningID, ToID: val
                                });
                            });

                            jQuery.each(statesArr, function (ind, val) {
                                if ((val.ID != that.Objects.BeginningID) && !that.has_output(val.ID))
                                    val.Options = that.ending_state_options();
                            });
                            //end of Set beginning and ending states
                            
                            callback({ Nodes: statesArr, Edges: connectionsArr });

                            that.auto_show_buttons();
                        }
                    });
                },
                OnNodeSelect: function (nodeId) { that.on_node_select(nodeId); },
                OnEdgeSelect: function (edgeId) { that.on_edge_select(edgeId); }
            });
        },

        set_state_select_datasource: function () {
            var that = this;

            var ds = [];

            for (var id in (that.Objects.Nodes || {})) {
                if (that.Objects.Nodes[id])
                    ds.push([Base64.decode(that.Objects.Nodes[id].Title), that.Objects.Nodes[id].StateID]);
            }

            that.Objects.StateSelect.bindArray(ds);
        },

        set_to_option: function (nodeId) {
            var that = this;

            if (!that.Objects.IsAddEdgeMode) return;

            if (!nodeId && that.Objects.SelectedID && that.Objects.Nodes[that.Objects.SelectedID]) {
                that.Interface.Buttons.AddEdge.StateID = that.Objects.SelectedID;
                that.Interface.Buttons.AddEdge.OptionID = null;
            }
            else if (nodeId) that.Interface.Buttons.AddEdge.OptionID = nodeId;

            var stateTitle = Base64.decode((that.Objects.Nodes[nodeId] || {}).Title);
            if (stateTitle) stateTitle = GlobalUtilities.convert_numbers_to_persian(GlobalUtilities.secure_string(stateTitle));

            that.Interface.ToOption.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "span", Style: "color:rgb(80,80,80); font-weight:normal; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.Option + ":" }]
                },
                {
                    Type: "span", Style: stateTitle ? "" : "color:red;",
                    Childs: [{ Type: "text", TextValue: stateTitle || RVDic.NotSet }]
                }
            ], that.Interface.ToOption);


            jQuery(that.Interface.Buttons.AddEdge)[nodeId ? "fadeIn" : "fadeOut"](nodeId ? 500 : 0);
        },

        auto_show_buttons: function () {
            var that = this;

            if (that.Objects.IsAddEdgeMode) return;

            var id = that.Objects.SelectedID;
            var isState = !!that.Objects.Nodes[id];
            var isEdge = !!that.Objects.Edges[id];

            var outputsCount = !isState ? 0 : that.outputs_count(id);

            var duration = 0;

            jQuery(that.Interface.Options).fadeOut(500, function () {
                jQuery(that.Interface.Buttons.RenameState)[isState ? "fadeIn" : "fadeOut"](duration);
                jQuery(that.Interface.Buttons.StateSettings)[isState ? "fadeIn" : "fadeOut"](duration);
                jQuery(that.Interface.Buttons.RemoveState)[isState ? "fadeIn" : "fadeOut"](duration);
                jQuery(that.Interface.Buttons.NewEdge)[isState ? "fadeIn" : "fadeOut"](duration);
                jQuery(that.Interface.Buttons.SortEdges)[isState && (outputsCount > 1) ? "fadeIn" : "fadeOut"](duration);
                jQuery(that.Interface.Buttons.EdgeSettings)[isEdge ? "fadeIn" : "fadeOut"](duration);
                jQuery(that.Interface.Buttons.RemoveEdge)[isEdge ? "fadeIn" : "fadeOut"](duration);

                jQuery(that.Interface.Options).fadeIn(500);
            });
        },

        on_node_select: function (nodeId) {
            var that = this;
            if (!that.Interface.Info) return;

            that.Objects.SelectedID = nodeId;

            that.auto_show_buttons();
            that.set_to_option(nodeId);

            that.Interface.Info.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.SelectedN.replace("[n]", RVDic.State) + ":" }]
                },
                {
                    Type: "div", Style: "display:inline-block; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.Nodes[nodeId].Title) }]
                }
            ], that.Interface.Info);
        },

        on_edge_select: function (edgeId) {
            var that = this;
            if (!that.Interface.Info) return;

            that.Objects.SelectedID = edgeId;

            that.auto_show_buttons();

            var nodeId = that.Objects.Edges[edgeId].StateID;
            var outStateId = that.Objects.Edges[edgeId].OutStateID;

            that.Interface.Info.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.State + ":" }]
                },
                {
                    Type: "div", Style: "display:inline-block; font-weight:bold; margin-" + RV_RevFloat + ":1.5rem",
                    Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.Nodes[nodeId].Title) }]
                },
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.SelectedN.replace("[n]", RVDic.Option) + ":" }]
                },
                {
                    Type: "div", Style: "display:inline-block; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: Base64.decode(that.Objects.Nodes[outStateId].Title) }]
                }
            ], that.Interface.Info);
        },

        has_input: function (nodeId) {
            var that = this;
            for (var id in that.Objects.Edges) {
                if (((that.Objects.Edges[id] || {}).OutStateID == (nodeId || "__")) &&
                    (that.Objects.Edges[id].StateID != that.Objects.Edges[id].OutStateID)) return true;
            }
            return false;
        },

        has_output: function (nodeId) {
            var that = this;
            for (var id in that.Objects.Edges) {
                if (((that.Objects.Edges[id] || {}).StateID == (nodeId || "__")) &&
                    (that.Objects.Edges[id].StateID != that.Objects.Edges[id].OutStateID)) return true;
            }
            return false;
        },

        outputs_count: function (nodeId) {
            var that = this;
            var cnt = 0;
            for (var id in that.Objects.Edges)
                if (that.Objects.Edges[id] && (that.Objects.Edges[id].StateID == nodeId))++cnt;
            return cnt;
        },

        get_beginning_states: function () {
            var that = this;
            var arr = [];
            for (var id in that.Objects.Nodes)
                if (that.Objects.Nodes[id] && !that.has_input(id)) arr.push(id);
            return arr;
        },

        get_ending_states: function () {
            var that = this;
            var arr = [];
            for (var id in that.Objects.Nodes)
                if (that.Objects.Nodes[id] && !that.has_output(id)) arr.push(id);
            return arr;
        },

        default_state_options: function () {
            return {
                color: {
                    border: 'rgb(43,124,233)', background: 'rgb(151,194,252)',
                    highlight: { border: 'rgb(43,124,233)', background: 'rgb(210,229,255)' }
                }
            };
        },

        beginning_state_options: function () {
            return {
                color: {
                    border: '#9FBD1E', background: '#EEF7C9',
                    highlight: { border: '#9FBD1E', background: '#EEF7C9' }
                }
            };
        },

        ending_state_options: function () {
            return {
                color: {
                    border: '#F50000', background: '#FFCCCC',
                    highlight: { border: '#F50000', background: '#FFCCCC' }
                }
            };
        },

        beginning_edge_id: function (stateId) {
            var that = this;
            return that.Objects.BeginningID + "_" + stateId;
        },

        set_state_as_beginning: function (nodeId) {
            var that = this;
            that.Objects.Network.add_edge(that.beginning_edge_id(nodeId), that.Objects.BeginningID, nodeId);
        },

        set_state_as_ending: function (nodeId) {
            var that = this;
            that.Objects.Network.set_node_options(nodeId, that.ending_state_options());
        },

        add_state: function () {
            var that = this;

            new NameDialog({
                Title: RVDic.Name, InnerTitle: RVDic.Name,
                OnActionCall: function (name, callback) {
                    if (!name) return callback(true);

                    WFAPI.CreateState({
                        Title: Base64.encode(name), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                callback(false);
                            }
                            else {
                                var stateId = (result.State || {}).StateID;
                                
                                WFAPI.AddWorkFlowState({
                                    WorkFlowID: that.Objects.WorkFlowID, StateID: stateId, ParseResults: true,
                                    ResponseHandler: function (r) {
                                        if (r.ErrorText) alert(RVDic.MSG[r.ErrorText] || r.ErrorText);
                                        else {
                                            that.Objects.Nodes[stateId] = {
                                                ID: r.ID, StateID: stateId, Title: Base64.encode(name)
                                            };

                                            that.Objects.Network.add_node(stateId, name, that.ending_state_options());
                                            that.Objects.Network.add_edge(that.beginning_edge_id(stateId), that.Objects.BeginningID, stateId);

                                            that.set_state_select_datasource();
                                        }

                                        callback(!!(r || {}).ID);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        },

        rename_state: function () {
            var that = this;

            var stateId = that.Objects.SelectedID;
            if (!stateId || !that.Objects.Nodes[stateId]) return;

            new NameDialog({
                Title: RVDic.NewN.replace("[n]", RVDic.Name),
                InitialValue: Base64.decode(that.Objects.Nodes[stateId].Title),
                InnerTitle: RVDic.Name,
                OnActionCall: function (name, callback) {
                    if (!name) return callback(true);

                    WFAPI.ModifyState({
                        StateID: stateId, Title: Base64.encode(name), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.Objects.Nodes[stateId].Title = Base64.encode(name);
                                that.Objects.Network.rename_node(stateId, name);
                                that.on_node_select(stateId);
                            }

                            callback(!!(result || {}).Succeed);
                        }
                    });
                }
            });
        },

        state_settings: function () {
            var that = this;

            var stateId = that.Objects.SelectedID;
            if (!stateId || !that.Objects.Nodes[stateId]) return;

            that.StateSettingsContainers = that.StateSettingsContainers || {};

            if (that.StateSettingsContainers[stateId]) return GlobalUtilities.show(that.StateSettingsContainers[stateId]);

            var _div = that.StateSettingsContainers[stateId] = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-10 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto 20rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["WorkFlowManager/StateManager.js"], {
                OnLoad: function () {
                    new StateManager(_div, {
                        WorkFlowID: that.Objects.WorkFlowID,
                        State: that.Objects.Nodes[stateId],
                        GetStates: function (callback) {
                            var arr = [];
                            for (var i in that.Objects.Nodes)
                                if (that.Objects.Nodes[i]) arr.push(that.Objects.Nodes[i]);
                            callback(arr);
                        }
                    });
                }
            });
        },

        remove_state: function () {
            var that = this;

            var stateId = that.Objects.SelectedID;
            if (that.RemovingState || !stateId || !that.Objects.Nodes[stateId]) return;

            var msg = RVDic.Confirms.DoYouWantToRemoveN
                .replace("[n]", "'" + Base64.decode(that.Objects.Nodes[stateId].Title) + "'");

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return;
                that.RemovingState = true;

                WFAPI.RemoveWorkFlowState({
                    WorkFlowID: that.Objects.WorkFlowID, StateID: stateId, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            var err = RVDic.MSG[result.ErrorText] || result.ErrorText;
                            if (String(err).indexOf("[n]") >= 0)
                                err = RVDic.Error + ": " + err.replace("[n]", "'" + result.ItemsCount + "'")

                            alert(err);
                        }
                        else if (result.Succeed) {
                            that.Objects.Nodes[stateId] = null;
                            that.Objects.Network.remove_node(stateId);

                            that.Interface.Info.innerHTML = "";
                            that.Objects.SelectedID = null;

                            for (var id in that.Objects.Edges) {
                                var eg = that.Objects.Edges[id];
                                if (!eg) continue;

                                if ((eg.StateID == stateId) || (eg.OutStateID == stateId)) {
                                    that.Objects.Edges[id] = null;

                                    var isBeginning = (eg.StateID != eg.OutStateID) && !that.has_input(eg.OutStateID);
                                    var isEnding = (eg.StateID != eg.OutStateID) && !that.has_output(eg.StateID);

                                    if (isBeginning) that.Objects.Network.add_edge(that.beginning_edge_id(), 
                                        that.Objects.BeginningID, eg.OutStateID);
                                    if (isEnding) that.Objects.Network.set_node_options(eg.StateID, that.ending_state_options());
                                }
                            }

                            that.set_state_select_datasource();
                        }

                        that.RemovingState = false;
                    }
                });
            });
        },

        add_edge: function (stateId, optionId, callback) {
            var that = this;

            if (that.AddingEdge || !stateId || !optionId) return;
            that.AddingEdge = true;

            WFAPI.AddStateConnection({
                WorkFlowID: that.Objects.WorkFlowID, InStateID: stateId, OutStateID: optionId, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else if (result.Succeed) {
                        that.Objects.Edges[result.ID] = {
                            ID: result.ID,
                            OutStateID: optionId,
                            StateID: stateId,
                            OutStateTitle: that.Objects.Nodes[optionId].Title
                        };

                        that.Objects.Network.add_edge(result.ID, stateId, optionId);

                        if (that.has_output(stateId)) that.Objects.Network.set_node_options(stateId, that.default_state_options());
                        if (that.has_input(optionId)) that.Objects.Network.remove_edge(that.beginning_edge_id(optionId));

                        callback();
                    }

                    that.AddingEdge = false;
                }
            });
        },

        sort_edges: function () {
            var that = this;

            var stateId = that.Objects.SelectedID;
            if (!stateId || !that.Objects.Nodes[stateId] || (that.outputs_count(stateId) <= 1)) return;

            if (that.LoadingSortDialog) return;
            that.LoadingSortDialog = true;
            
            GlobalUtilities.load_files(["Public/SortDialog.js"], {
                OnLoad: function () {
                    new SortDialog({
                        Title: RVDic._HelpSortWikiTitles,
                        Items: that.Objects.Nodes[stateId].Connections || [],
                        GetItemID: function (item) { return item.ID; },
                        GetItemTitle: function (item) { return Base64.decode(that.Objects.Nodes[item.OutStateID].Title); },
                        APIFunction: function (data, done) {
                            WFAPI.SortStateConnections({
                                IDs: (data.SortedIDs || []).join("|"), ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    else that.Objects.Nodes[stateId].Connections = data.SortedItems;

                                    done(!result.ErrorText);
                                }
                            });
                        }
                    });

                    that.LoadingSortDialog = false;
                }
            });
        },

        edge_settings: function () {
            var that = this;

            var edgeId = that.Objects.SelectedID;
            if (!edgeId || !that.Objects.Edges[edgeId]) return;

            var stateId = that.Objects.Edges[edgeId].StateID;

            that.EdgeSettingsContainers = that.EdgeSettingsContainers || {};

            if (that.EdgeSettingsContainers[edgeId]) return GlobalUtilities.show(that.EdgeSettingsContainers[edgeId]);

            var _div = that.EdgeSettingsContainers[edgeId] = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-11 medium-10 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto 20rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);
            
            GlobalUtilities.load_files(["WorkFlowManager/ConnectionManager.js"], {
                OnLoad: function () {
                    new ConnectionManager(_div, {
                        WorkFlowID: that.Objects.WorkFlowID,
                        State: that.Objects.Nodes[(that.Objects.Edges[edgeId] || {}).StateID],
                        Edge: that.Objects.Edges[edgeId],
                        GetStates: function (callback) {
                            var arr = [];
                            for (var i in that.Objects.Nodes)
                                if (that.Objects.Nodes[i]) arr.push(that.Objects.Nodes[i]);
                            callback(arr);
                        }
                    });
                }
            });
        },

        remove_edge: function () {
            var that = this;

            var edgeId = that.Objects.SelectedID;
            if (that.RemovingEdge || !edgeId || !that.Objects.Edges[edgeId]) return;

            var stateId = that.Objects.Edges[edgeId].StateID;
            var optionId = that.Objects.Edges[edgeId].OutStateID;

            var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Option);

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return;
                that.RemovingEdge = true;

                WFAPI.RemoveStateConnection({
                    WorkFlowID: that.Objects.WorkFlowID, InStateID: that.Objects.Edges[edgeId].StateID,
                    OutStateID: that.Objects.Edges[edgeId].OutStateID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText)
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            that.Objects.Edges[edgeId] = null;
                            that.Objects.Network.remove_edge(edgeId);

                            if (!that.has_output(stateId)) that.Objects.Network.set_node_options(stateId, that.ending_state_options());
                            if (!that.has_input(optionId)) that.Objects.Network.add_edge(that.beginning_edge_id(optionId),
                                that.Objects.BeginningID, optionId);

                            that.Interface.Info.innerHTML = "";
                            that.Objects.SelectedID = null;
                        }

                        that.RemovingEdge = false;
                    }
                });
            });
        },

        show_image: function (params) {
            var that = this;
            params = params || {};

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-7 large-4 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; font-size:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Preparing + "..." }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "loading", Style: "margin-top:1rem;" }
                    ]
                }
            ]);

            GlobalUtilities.loading(elems["loading"]);
            var preparingShowed = GlobalUtilities.show(elems["container"], { Stick: true });

            params.OnStart();
            that.Objects.Network.fit();

            setTimeout(function () {
                var img = that.Objects.Network.get_image();

                params.OnEnd();
                that.Objects.Network.fit();

                setTimeout(function () {
                    preparingShowed.Close();

                    if (!img) return alert(RVDic.MSG.OperationFailed);

                    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

                    var _div = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Name: "_div",
                            Class: "small-10 medium-8 large-6 rv-border-radius-1 rv-bg-color-softer-soft",
                            Style: "position:relative; margin:0rem auto; padding:1rem; text-align:center;" +
                                "cursor:pointer; padding-" + RV_Float + ":10rem; height:10rem;",
                            Properties: [{
                                Name: "onclick",
                                Value: function () {
                                    if (!isChrome) window.open(img, '_blank');
                                    else window.open().document.write('<img src="' + img + '" style="max-width:100vw; max-height:100vh;" />');

                                    showed.Close();
                                }
                            }],
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:1rem;" + RV_Float + ":2rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "SoftBorder rv-border-radius-half", Style: "width:8rem; height:8rem;",
                                            Attributes: [{ Name: "src", Value: img }]
                                        }
                                    ]
                                },
                                {
                                    Type: "middle", Style: "font-size:1.2rem; padding:0rem 1rem;",
                                    Childs: [{ Type: "text", TextValue: RVDic.WF.ClickToViewWorkFlowInFullSize }]
                                }
                            ]
                        }
                    ])["_div"];

                    var showed = GlobalUtilities.show(_div);
                }, 3000);
            }, 3000);
        }
    };
})();