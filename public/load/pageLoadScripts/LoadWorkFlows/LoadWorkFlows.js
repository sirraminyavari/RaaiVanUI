window.loadWorkFlows = () => {
  var _div = document.getElementById("workflowsArea");

  GlobalUtilities.loading(_div);

  GlobalUtilities.load_files(["WorkFlowManager/WorkFlowsManager.js"], {
    OnLoad: function () {
      new WorkFlowsManager(_div);
    },
  });
};
