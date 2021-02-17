window.loadConfidentiality = () => {
  GlobalUtilities.load_files(
    ["Confidentiality/ConfidentialityLevelsManager.js"],
    {
      OnLoad: function () {
        new ConfidentialityLevelsManager("confidentialityLevels");
      },
    }
  );
};
