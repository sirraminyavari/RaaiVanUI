window.loadMapConfig = (params) => {
  GlobalUtilities.load_files(["CN/MapManager.js"], {
    OnLoad: function () {
      new MapManager("mapArea", { IdentityFormID: params?.IdentityFormID });
    },
  });
};
