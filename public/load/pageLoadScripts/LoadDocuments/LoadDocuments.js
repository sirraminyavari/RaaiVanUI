window.loadDocuments = () => {
  var _div = document.getElementById("treesArea");

  GlobalUtilities.loading(_div);

  GlobalUtilities.load_files(["DCT/DocumentTreesManager.js"], {
    OnLoad: function () {
      new DocumentTreesManager(_div);
    },
  });
};
