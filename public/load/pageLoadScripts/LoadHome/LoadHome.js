(function () {
    var initialJson = JSON.parse(document.getElementById("initialJson").value) || {};
    var currentUser = initialJson.User || {};

    var modules = (window.RVGlobal || {}).Modules || {};
    
    GlobalUtilities.set_cookie("ck_theme", (window.RVGlobal || {}).Theme, 1000);

    GlobalUtilities.load_files(["USR/HomePageSideInfo.js"], {
        OnLoad: function () { new HomePageSideInfo("sideInfo", { User: currentUser, Modules: modules }); }
    });

    if (modules.FG) {
        GlobalUtilities.load_files(["Polls/PollInitializer.js"], {
            OnLoad: function () {
                new PollInitializer("pollsArea", {
                    OnInit: function (data) { if ((data || {}).TotalCount) jQuery("#pollsArea").fadeIn(500); }
                });
            }
        });
    }
    
    GlobalUtilities.load_files(["USR/HomePageMainContent.js"], {
        OnLoad: function () {
            new HomePageMainContent("centerArea", {
                User: currentUser,
                Priorities: initialJson.PersonalPagePriorities || {}
            });
        }
    });
})();