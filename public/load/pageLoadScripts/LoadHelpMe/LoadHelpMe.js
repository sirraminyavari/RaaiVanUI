window.loadHelpMe = () => {
  GlobalUtilities.load_files(['RaaiVanHelp/RaaiVanHelp.js'], {
    OnLoad: function () {
      new RaaiVanHelp('helpArea');
    },
  });
};
