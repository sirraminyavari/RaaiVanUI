window.loadForms = () => {
  GlobalUtilities.load_files(["FormsManager/FormsManager.js"], {
    OnLoad: function () {
      new FormsManager("formsArea");
    },
  });
};
