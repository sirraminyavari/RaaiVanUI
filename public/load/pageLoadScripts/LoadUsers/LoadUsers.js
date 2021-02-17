window.loadUsers = (params) => {
  var initialJson = params || {};

  var _do = function () {
    GlobalUtilities.loading(document.getElementById("usersArea"));
    GlobalUtilities.load_files(["USR/UsersManager.js"], {
      OnLoad: function () {
        new UsersManager("usersArea");
      },
    });
  };

  if (!initialJson.Reauthenticate) return _do();

  var processing = false;

  var promptObj = GlobalUtilities.prompt(
    RVDic.Checks.PleaseEnterYourPassword,
    {
      Placeholder: RVDic.Password,
      Center: true,
      Stick: true,
      HideCancelButton: true,
      DoNotClose: true,
      IsPassword: true,
    },
    function (value) {
      value = value === false ? value : GlobalUtilities.trim(value);

      if (processing || !value) return;
      processing = true;

      UsersAPI.ValidatePassword({
        Password: Base64.encode(value),
        ParseResults: true,
        ResponseHandler: function (result) {
          if ((result || {}).Result === true) {
            promptObj.Close();
            _do();
          } else
            alert(RVDic.MSG.PasswordIsNotValid, null, function () {
              promptObj.Clear();
            });

          processing = false;
        },
      });
    }
  );
};