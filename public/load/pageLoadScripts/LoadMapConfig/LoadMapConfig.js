window.loadMapConfig = () => {
  GlobalUtilities.load_files(["CN/MapManager.js"], {
    OnLoad: function () {
      new MapManager("mapArea");
    },
  });
};
