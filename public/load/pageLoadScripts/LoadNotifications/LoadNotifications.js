window.loadNotifications = () => {
  var _div = document.getElementById("notmsgAdmin");

  GlobalUtilities.loading(_div);

  GlobalUtilities.load_files(["Notifications/SendMessageAdminSetting.js"], {
    OnLoad: function () {
      new SendMessageAdminSetting(_div);
    },
  });
};
