window.loadNewNode = (params) => {
    var options = params || {};
    var container = document.getElementById("nodeArea");
    
    setTimeout(function () {
        document.title = Base64.decode((options.Service || {}).Title) + (!document.title ? "" : " - " + document.title);
    }, 1000);

    if (options.DocumentTreeNode) {
        var nd = options.DocumentTreeNode;

        var dic = { ID: null, Tree: null, Path: [] };

        if ((nd.Path || []).length) {
            nd.Path = nd.Path.reverse();

            dic.ID = nd.Path[nd.Path.length - 1].NodeID;

            jQuery.each(nd.Path, function (ind, val) {
                dic.Path.push({ ID: val.NodeID, Name: Base64.decode(val.Name) });
            });
        }

        if (nd.Tree) dic.Tree = { ID: nd.Tree.ID, Name: Base64.decode(nd.Tree.Title) };

        options.DocumentTreeNode = dic;
    }

    if ((options.PreviousVersion || {}).NodeID) {
        options.PreviousVersion = {
            ID: options.PreviousVersion.NodeID,
            Name: Base64.decode(options.PreviousVersion.Name)
        };
    }

    GlobalUtilities.load_files(["CN/RegisterNewNode.js"], {
        OnLoad: function () {
            new RegisterNewNode(container, GlobalUtilities.extend(options || {}, {
                Options: {
                    IsServiceAdmin: options.IsServiceAdmin,
                    NodeSelectType: (options.KnowledgeType || {}).NodeSelectType,
                    PreviousVersion: options.PreviousVersion,
                    ParentNode: options.ParentNode,
                    DocumentTreeNode: options.DocumentTreeNode
                }
            }));
        }
    });

    GlobalUtilities.append_goto_top_button();
};