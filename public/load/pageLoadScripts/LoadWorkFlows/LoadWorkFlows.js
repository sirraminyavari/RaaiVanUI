window.loadWorkFlows = (params) => {
  var initialJson = params || {};

  var _div = document.getElementById("workflowsArea");

  GlobalUtilities.loading(_div);

  GlobalUtilities.load_files(["WorkFlowManager/WorkFlowsManager.js"], {
    OnLoad: function () {
      new WorkFlowsManager(_div, {
        ActionTypes: initialJson.ActionTypes,
        VariableTypes: initialJson.VariableTypes
    });
    },
  });
};
