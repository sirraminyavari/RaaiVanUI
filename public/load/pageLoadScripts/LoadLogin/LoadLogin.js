(function () {
    var ind = GlobalUtilities.random(6, 28);
    var bgUrl = GlobalUtilities.icon(
      "background/RV-BG-" + (ind < 10 ? "0" : "") + ind + ".jpg"
    );
    document.getElementById("mainContent").style.backgroundImage =
      "url(" + bgUrl + ")";
  
    var firstPage = document.getElementById("mainContent");
    var secondPage = document.getElementById("loginPageContent");
  
    document.getElementById("pageDownButton").onclick = function () {
      GlobalUtilities.scroll_into_view(secondPage, { Offset: 0 });
    };
  
    document.getElementById("pageUpButton").onclick = function () {
      GlobalUtilities.scroll_into_view(firstPage, { Offset: 0 });
    };
  
    if (RVGlobal.LoggedIn) {
      var msg = RVGlobal.LoginMessage
        ? Base64.decode(RVGlobal.LoginMessage)
        : null;
  
      GlobalUtilities.set_auth_cookie(RVGlobal.AuthCookie);
  
      if (msg || (RVGlobal.LastLogins || []).length > 0)
        new LoginControl().show_last_logins(
          msg,
          RVGlobal.LastLogins,
          function () {
            window.location.href = "../../home";
          }
        );
      else window.location.href = "../../home";
  
      return;
    }
  
    document.title = RVDic.Login + " - " + document.title;
  
    if ((window.RVGlobal || {}).NoApplicationFound)
      return alert(RVDic.MSG.NoApplicationFound);
  
    if (RVGlobal.SysID) {
      var sysElems = GlobalUtilities.create_nested_elements([
        {
          Type: "div",
          Class:
            "small-10, medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
          Style: "margin:0 auto; padding:1rem;",
          Name: "container",
          Childs: [
            {
              Type: "div",
              Class: "small-12 medium-12 large-12",
              Style: "text-align:center; font-size:1rem;",
              Childs: [
                { Type: "text", TextValue: RVDic.MSG.InvalidSystemIDMessage },
              ],
            },
            {
              Type: "div",
              Class: "small-12 medium-12 large-12",
              Style: "text-align:center; margin-top:1rem;",
              Childs: [
                {
                  Type: "div",
                  Class: "rv-border-radius-half WarmTextShadow",
                  Name: "sysId",
                  Style:
                    "display:inline-block; font-size:1rem; padding:0.5rem; background-color:white; color:rgb(80,80,80);",
                },
              ],
            },
            {
              Type: "div",
              Class: "small-4 medium-4 large-4 rv-air-button rv-circle",
              Style: "margin:1rem auto 0 auto;",
              Properties: [
                {
                  Name: "onclick",
                  Value: function () {
                    sysShowed.Close();
                  },
                },
              ],
              Childs: [{ Type: "text", TextValue: RVDic.GotIt + "!" }],
            },
          ],
        },
      ]);
  
      sysElems["sysId"].innerHTML = RVGlobal.SysID;
  
      var sysShowed = GlobalUtilities.show(sysElems["container"]);
    }
  
    GlobalUtilities.cheadget(
      "sudoku",
      "gesi",
      "ramin",
      "fliptext",
      "instaprofile"
    );
  
    var loginPageModel = RVGlobal.LoginPageModel || "";
  
    if (loginPageModel) {
      var _jsFileName = "lp_" + loginPageModel;
      var statistics = window.RVGlobal[loginPageModel];
  
      if (statistics) {
        GlobalUtilities.load_files(["LoginPage/" + _jsFileName + ".js"], {
          OnLoad: function () {
            new window[_jsFileName]("loginPageContent", statistics);
          },
        });
      } else {
        jQuery("#pageDownButton").fadeOut(0);
        jQuery("#statisticsArea").fadeOut(0);
      }
    }
  
    document.getElementById(
      "loginContainer"
    ).style.backgroundColor = RVGlobal.SAASBasedMultiTenancy
      ? "rgba(255,255,255,0.7)"
      : "rgba(0,0,0,0.7)";
  
    new LoginControl("loginArea", {
      ReloadAfterLogin: false,
      ContainerClass: false,
      IgnoreSSO: true,
      InitialFocus: false,
      ReturnURL: (window.RVGlobal || {}).ReturnURL
        ? Base64.decode(window.RVGlobal.ReturnURL)
        : null,
      OnLogin: function (d) {},
    });
  })();  