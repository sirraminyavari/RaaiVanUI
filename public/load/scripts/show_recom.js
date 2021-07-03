(function () {
    var isNode = /\/node/gi.test(window.location.href.toLowerCase());
    if (!isNode && !/\/home/gi.test(window.location.href.toLowerCase())) return;

    GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["RVAAPI", "CNAPI"] }], {
        OnLoad: function () {
            var show_nodes = function (nodeIds) {
                if (!nodeIds || (nodeIds.length == 0)) return;

                CNAPI.GetNodes({
                    NodeIDs: nodeIds.join('|'), ParseResults: true,
                    ResponseHandler: function (result) {
                        var nodes = result.Nodes || [];

                        var elems = GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Class: "BorderRadius4 SoftBackgroundColor NormalPadding",
                                Style: "width:400px; margin:0px auto 0px auto", Name: "container",
                                Childs: [
                                    {
                                        Type: "div", Style: "text-align:center; font-weight:bold;",
                                        Childs: [{ Type: "text", TextValue: "Suggestions :)" }]
                                    },
                                    { Type: "hr" },
                                    { Type: "div", Name: "items" }
                                ]
                            }
                        ]);

                        var add_node = function (nd) {
                            var name = Base64.decode(nd.Name);
                            var nodeType = Base64.decode(nd.NodeType);

                            var trimedName = GlobalUtilities.trim2pix(name, 250, { Postfix: "..." });
                            var trimedType = GlobalUtilities.trim2pix(nodeType, 60, { Postfix: "..." });

                            GlobalUtilities.create_nested_elements([
                                {
                                    Type: "div", Class: "NormalPadding BorderRadius3 SoftBorder",
                                    Style: "margin:4px 0px 4px 0px;",
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.style.backgroundColor = "white"; } },
                                        { Name: "onmouseout", Value: function () { this.style.backgroundColor = "transparent"; } }
                                    ],
                                    Childs: [
                                        {
                                            Type: "div", Class: "Float", Style: "width:20px; margin-" + window.RV_RevFloat + ":4px;",
                                            Childs: [
                                                {
                                                    Type: "img", Style: "width:20px; height:20px;",
                                                    Attributes: [{ Name: "src", Value: nd.IconURL }]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "Float", Style: "max-width:270px;",
                                            Tooltip: name == trimedName ? null : name,
                                            Link: CNAPI.NodePageURL({ NodeID: nd.NodeID }),
                                            Childs: [{ Type: "text", TextValue: trimedName }]
                                        },
                                        {
                                            Type: "div", Class: "Float", Tooltip: nodeType == trimedType ? null : nodeType,
                                            Style: "width:80px; margin-" + window.RV_Float + ":4px; color:gray; font-wight:bold; font-size:small;",
                                            Childs: [{ Type: "text", TextValue: "(" + trimedType + ")" }]
                                        },
                                        { Type: "div", Style: "clear:both;" }
                                    ]
                                }
                            ], elems["items"]);
                        }

                        for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                            add_node(nodes[i]);

                        GlobalUtilities.show(elems["container"]);
                    }
                });
            }

            var initialJson = JSON.parse((document.getElementById("initialJson") || {}).value || "{}");

            var node_id = initialJson.NodeID || RVGlobal.CurrentUserID;
            var node_type = initialJson.NodeID ? 2 : 1;
            var contextId = initialJson.NodeID ? 1 : 2;

            RVAAPI.Initialize({
                username: "ramin",
                password: "589db5595f194c9b258e7fd484fea07912280c5e",
                baseURL: "http://94.232.172.89:44321"
            });
            
            RVAAPI[node_type == 2 ? "GetTopRelations" : "GetTopDirectRelations"]({
                node_id: String(node_id).toLowerCase(), node_type: node_type, context: contextId, start: 0, num: 20
            }, function (jsonResponse) {
                var recommendeds = jsonResponse.recommendeds || [];

                var nodeIds = [];

                for (var i = 0, lnt = recommendeds.length; i < lnt; ++i)
                    if (recommendeds[i].type == 2) nodeIds.push(recommendeds[i].id);

                show_nodes(nodeIds);
            });
        }
    });
})();