window.loadDataImport = () => {
  GlobalUtilities.load_files(["RVAdmin/DataImportManager.js"], {
    OnLoad: function () {
      new DataImportManager(document.getElementById("dataimport"));
    },
  });
};
