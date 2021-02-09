window.loadHelp = () => {
  GlobalUtilities.load_files(
    ["RaaiVanHelp/HelpAdmin.js", "TreeView/TreeView.js"],
    {
      OnLoad: function () {
        new HelpAdmin("helpArea");
      },
    }
  );
};
