(function () {
    if (window.TreeNodeViewer) return;

    window.TreeNodeViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;

        this.ContainerDiv.innerHTML = "";

        this.InnerContainer = GlobalUtilities.create_nested_elements([
            { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div", Style: "overflow:hidden;" }
        ], this.ContainerDiv)["_div"];

        params = params || {};
        
        this.TVCParams = { Nodes: [], Hotkeys: false, Checkbox: params.Checkbox == false ? false : true, TreeStateCheckbox: false,
            Modifiable: false, ProgressiveRender: true, AjaxLoading: true, AjaxURL: CNAPI.ResponseURL,
            AjaxParams: { NodeTypeID: params.NodeTypeID || "", NodeID: params.NodeID || "", IsTreeView: "true" },
            AjaxResponseParser: function (result) { return CNAPI.ParseTreeNodes(result); }, StringConsts: { Command: "GetChildNodes" },
            OnNodeSelect: params.OnNodeSelect
        };

        this.LoadParams = params.LoadParams || { OnLoad: null, Params: null };

        this._initialize();
    }

    TreeNodeViewer.prototype = {
        _initialize: function () {
            var that = this;

            GlobalUtilities.load_files(["API/CNAPI.js", "TreeViewContainer/TreeViewContainer.js"], {
                OnLoad: function () {
                    that.TVCParams.OnLoad = function () { if ((that.LoadParams || {}).OnLoad) that.LoadParams.OnLoad(that.LoadParams.Params); }
                    that.TVC = new TreeViewContainer(that.InnerContainer, that.TVCParams);
                }
            });
        },

        reset: function (params) {
            params = params || {};

            this.TVCParams.Checkbox = params.Checkbox == false ? false : true;
            this.TVCParams.OnNodeSelect = params.OnNodeSelect;
            this.TVCParams.OnDoubleClick = params.OnDoubleClick;
            this.TVCParams.AjaxParams.NodeTypeID = params.NodeTypeID;
            this.TVCParams.AjaxParams.NodeID = params.NodeID || "";

            this.TVC.reset(this.TVCParams);
        },

        get_checked_items: function () {
            return this.TVC.get_checked_items(true);
        }
    }
})();