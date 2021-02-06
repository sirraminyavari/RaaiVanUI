window.loadRemoteServers = () => {
  GlobalUtilities.load_files(["RemoteServers/RemoteServerSettings.js"], {
    OnLoad: function () {
      new RemoteServerSettings("remoteServers");
    },
  });
};
