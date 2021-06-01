(function () {
    if (window.NetworkGraph) return;

    window.NetworkGraph = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            Network: null,
            Nodes: null,
            Edges: null,
            CTX: null
        };

        this.Options = {
            DataRequest: params.DataRequest,
            OnInit: params.OnInit,
            EnablePhysics: true,
            OnNodeSelect: params.OnNodeSelect,
            OnEdgeSelect: params.OnEdgeSelect
        };

        var that = this;

        GlobalUtilities.load_files([
            { Root: "Vis/", Childs: ["vis.css", "vis-network.min.css", "vis.js", "vis-network.min.js"] }
        ], {
            OnLoad: function () {
                that.initialize();
            }
        });
    };

    NetworkGraph.prototype = {
        network_options: function () {
            var that = this;

            return {
                edges: {
                    smooth: false,// { forceDirection: "none" },
                    arrows: { to: true }
                },
                physics: {
                    enabled: that.Options.EnablePhysics !== false,
                    barnesHut: { avoidOverlap: 0.5 },
                    minVelocity: 3,
                    maxVelocity: 50,
                    stabilization: { iterations: 1200 }
                },
                interaction: {
                    navigationButtons: true,
                    keyboard: false
                }
            };
        },

        initialize: function () {
            var that = this;

            that.Options.DataRequest(function (data) {
                data = data || {};

                var ndArr = [];
                var egArr = [];

                jQuery.each(data.Nodes || [], function (ind, val) {
                    ndArr.push(GlobalUtilities.extend({
                        id: val.ID, label: GlobalUtilities.convert_numbers_to_persian(val.Title),
                        font: { face: "IRANSans", strokeWidth: 0.2, strokeColor: "#000000" }
                    }, val.Options || {}));
                });

                jQuery.each(data.Edges || [], function (ind, val) {
                    egArr.push(GlobalUtilities.extend({
                        id: val.ID, from: val.FromID, to: val.ToID, arrows: 'to'
                    }, val.Options || {}));
                });

                that.Objects.Nodes = new vis.DataSet(ndArr);
                that.Objects.Edges = new vis.DataSet(egArr);

                that.Objects.Network = new vis.Network(that.Container, {
                    nodes: that.Objects.Nodes, edges: that.Objects.Edges
                }, that.network_options());

                //that.Objects.Network.stabilize(1200);

                var inited = false;

                that.Objects.Network.on("afterDrawing", function (ctx) {
                    if (inited) return;
                    inited = true;

                    that.Objects.CTX = ctx;
                    if (GlobalUtilities.get_type(that.Options.OnInit)) that.Options.OnInit.call(that);
                });
                
                that.Objects.Network.on("select", function (obj) {
                    var nodeIds = obj.nodes, edgeIds = obj.edges;

                    if (nodeIds.length == 1) {
                        if (GlobalUtilities.get_type(that.Options.OnNodeSelect) == "function") that.Options.OnNodeSelect(nodeIds[0]);
                    }
                    else if (edgeIds.length == 1) {
                        if (GlobalUtilities.get_type(that.Options.OnEdgeSelect) == "function") that.Options.OnEdgeSelect(edgeIds[0]);
                    }
                });
            });
        },

        _enable_disable_physics: function (value) {
            var that = this;
            if (!that.Objects.Network) return;
            that.Options.EnablePhysics = !!value;
            that.Objects.Network.setOptions(that.network_options());
        },

        enable_physics: function () { this._enable_disable_physics(true); },

        disable_physics: function () { this._enable_disable_physics(false); },

        get_image: function () {
            var that = this;
            if (that.Objects.CTX) return that.Objects.CTX.canvas.toDataURL();
        },

        show_image: function () {
            var that = this;
            var dataUrl = that.get_image();
            if (dataUrl) GlobalUtilities.show_image(dataUrl);
        },

        add_node: function (id, title, options) {
            var that = this;

            if (!that.Objects.Network || !that.Objects.Nodes) return false;

            try {
                that.Objects.Nodes.add(GlobalUtilities.extend(options || {}, {
                    id: id, label: GlobalUtilities.convert_numbers_to_persian(title),
                    font: { face: "IRANSans", strokeWidth: 0.2, strokeColor: "#000000" }
                }));

                return true;
            } catch (e) { return false; }
        },

        rename_node: function (id, title) {
            var that = this;

            if (!that.Objects.Network || !that.Objects.Nodes) return false;

            try {
                that.Objects.Nodes.update({ id: id, label: GlobalUtilities.convert_numbers_to_persian(title) });
                return true;
            } catch (e) { return false; }
        },

        remove_node: function (id) {
            var that = this;

            if (!that.Objects.Network || !that.Objects.Nodes) return false;

            try {
                that.Objects.Nodes.remove({ id: id });
                return true;
            } catch (e) { return false; }
        },

        set_node_options: function (id, options) {
            var that = this;

            if (!that.Objects.Network || !that.Objects.Nodes) return false;

            try {
                var node = that.Objects.Nodes.get(id);
                if (!node) return false;
                GlobalUtilities.extend(node, options || {});
                that.Objects.Nodes.update(node);
                return true;
            } catch (e) { return false; }
        },

        add_edge: function (id, sourceId, destId) {
            var that = this;

            if (!that.Objects.Network || !that.Objects.Edges) return false;

            try {
                that.Objects.Edges.add({ id: id, from: sourceId, to: destId });
                return true;
            } catch (e) { return false; }
        },

        remove_edge: function (id) {
            var that = this;

            if (!that.Objects.Network || !that.Objects.Edges) return false;

            try {
                that.Objects.Edges.remove({ id: id });
                return true;
            } catch (e) { return false; }
        },

        zoom_on_node: function (id) {
            var that = this;

            if (!that.Objects.Network) return;

            try {
                that.Objects.Network.focus(id, {
                    position: { x: 0, y: 0 },
                    scale: 1,
                    offset: { x: 0, y: 0 },
                    animation: {
                        duration: 1000, //ms
                        easingFunction: "easeInOutQuad"
                    }
                });
            } catch (e) { }
        },

        fit: function () {
            var that = this;

            try {
                that.Objects.Network.fit({
                    animation: { offset: { x: 0, y: 0 }, duration: 1000, easingFunction: "easeInOutQuad" }
                });
            } catch (e) { }
        }
    };
})();