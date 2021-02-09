window.loadAdvancedSearch = (params) => {
  var initialJson = params || {};

  var nodeTypes = (initialJson || {}).NodeTypes;

  GlobalUtilities.loading("classesArea");

  GlobalUtilities.load_files(["CN/AllNodesList.js"], {
    OnLoad: function () {
      var anl = new AllNodesList("classesArea", {
        InitialNodeTypes: nodeTypes,
        InitialRelatedItem: initialJson.RelatedItem,
        ShowAllNodeTypes: true,
        SortByName: true,
      });

      GlobalUtilities.onscrollend(document, { Offset: 50 }, function () {
        anl.more();
      });
    },
  });
};
