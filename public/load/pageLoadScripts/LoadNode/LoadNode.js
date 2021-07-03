window.loadNode = (params) => {
  var initialJson = params;
  var container = document.getElementById('nodeView');

  var modules = (window.RVGlobal || {}).Modules || {};

  var nodeId = initialJson.NodeID;
  var showWorkFlow = initialJson.ShowWorkFlow === true;
  var showKnowledgeOptions = initialJson.ShowKnowledgeOptions === true;
  var hideContributors = initialJson.HideContributors === true;

  GlobalUtilities.loading(container);

  var loadArr = [
    { Root: 'jQuery/highlight/styles/', Childs: ['vs.css'] },
    'CN/NodeViewer.js',
    'CN/NodeAccessDeniedResponse.js',
  ];

  GlobalUtilities.load_files(loadArr, {
    OnLoad: function () {
      if (initialJson.NodeAccessDenied)
        return new NodeAccessDeniedResponse(container, initialJson);

      new NodeViewer(container, {
        NodeID: nodeId,
        Modules: modules,
        ShowWorkFlow: showWorkFlow,
        ShowKnowledgeOptions: showKnowledgeOptions,
        HideContributors: hideContributors,
      });
    },
  });

  GlobalUtilities.append_goto_top_button();
};
