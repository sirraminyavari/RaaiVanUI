(function () {
    if (window.ListNodesManager) return;

    window.ListNodesManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null
        };

        this.Objects = {
            ListID: params.ListID,
            NodeTypeID: params.NodeTypeID,
            NodeType: params.NodeType,
            FoundNodes: [],
            Nodes: []
        };

        this.Options = GlobalUtilities.extend({
            Editable: false
        }, params.Options || {});

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI"] }], {
            OnLoad: function () { that._preinit(params); }
        });
    }

    ListNodesManager.prototype = {
        _preinit: function () {
            var that = this;

            CNAPI.GetListNodes({
                ListID: that.Objects.ListID,
                ParseResults: true,
                ResponseHandler: function (result) { that._initialize(result.Nodes || []); }
            });
        },

        _initialize: function (nodes) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeSelect" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0.5rem 0rem 0rem 0rem;", Name: "itemsArea"
                }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];

            var as = GlobalUtilities.append_autosuggest(elems["nodeSelect"], {
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.SelectN.replace("[n]", that.Objects.NodeType) + "...",
                AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: that.Objects.NodeTypeID }),
                ResponseParser: function (responseText) {
                    var _nds = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = _nds.length; i < lnt; ++i) {
                        arr.push([Base64.decode(_nds[i].Name), _nds[i].NodeID]);
                        that.Objects.FoundNodes[_nds[i].NodeID] = _nds[i];
                    }
                    return arr;
                },
                OnSelect: function () {
                    var nodeId = as.values[as.selectedIndex];

                    CNAPI.AddNodeToComplex({
                        ListID: that.Objects.ListID, NodeID: nodeId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                that.add_node(that.Objects.FoundNodes[nodeId]);
                                as.clear();
                            }
                        }
                    });
                }
            });

            for (var i = 0, lnt = (nodes || []).length; i < lnt; ++i)
                that.add_node(nodes[i]);
        },

        add_node: function (node) {
            var that = this;

            if (!node) return;

            var name = Base64.decode(node.Name);

            that.Objects.Nodes[node.NodeID] = node;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "containerDiv",
                    Class: "small-12 medium-12 large-6 rv-bg-color-trans-white rv-border-radius-quarter",
                    Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{
                                        Name: "onclick",
                                        Value: function () { that.remove_node(node.NodeID, elems["containerDiv"]); }
                                    }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Link: CNAPI.NodePageURL({ NodeID: node.NodeID }),
                            Childs: [{ Type: "text", TextValue: name }]
                        }
                    ]
                }
            ], that.Interface.ItemsArea);
        },

        remove_node: function (nodeId, containerDiv) {
            var that = this;

            GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveTheComplexNode, function (result) {
                if (!result) return;

                CNAPI.RemoveComplexNode({
                    ListID: that.Objects.ListID, NodeID: nodeId,
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            that.Objects.Nodes[nodeId] = null;
                            containerDiv.parentNode.removeChild(containerDiv);
                        }
                    }
                });
            });
        }
    }
})();