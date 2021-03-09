window.loadNetwork = () => {
  var container = document.getElementById('pageContainer');

  var rvGlobal = window.RVGlobal || {};

  var loc = window.location.toString();
  var parameters = loc.substr(loc.indexOf('?') + 1).split('&');
  var openTab = null;

  jQuery.each(parameters, function (ind, val) {
    var index = val.indexOf('=');
    var parameter = val.substr(0, index);
    var pValue = val.substr(index + 1);
    if (parameter == 'OpenTab') openTab = pValue;
  });

  GlobalUtilities.load_files(['USR/UserConnections.js'], {
    OnLoad: function () {
      new UserConnections(container, {
        UserID: rvGlobal.CurrentUserID,
        ProfileImageURL: (rvGlobal.CurrentUser || {}).ImageURL,
        OpenTab: openTab,
        Modules: rvGlobal.Modules || {},
      });
    },
  });
};
