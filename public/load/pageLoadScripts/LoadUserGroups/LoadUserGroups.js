window.loadUserGroups = () => {
  GlobalUtilities.load_files(["USR/UserGroupsManager.js"], {
    OnLoad: function () {
      new UserGroupsManager("userGroupsArea");
    },
  });
};
