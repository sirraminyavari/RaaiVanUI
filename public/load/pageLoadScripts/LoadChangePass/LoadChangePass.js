window.loadChangePass = (params) => {
  var settings = params || {};

  GlobalUtilities.load_files(["USR/ChangePasswordDialog.js"], {
    OnLoad: function () {
      new ChangePasswordDialog(
        "contentArea",
        GlobalUtilities.extend(settings || {}, {
          OnPasswordChange: function () {
            window.location.href = RVAPI.HomePageURL();
          },
        })
      );
    },
  });
};
