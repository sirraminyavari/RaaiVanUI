(function () {
    var initialJson = JSON.parse(document.getElementById("initialJson").value);
    var modules = (window.RVGlobal || {}).Modules || {};

    //Set document title
    var userFullname = initialJson.User ?
        Base64.decode(initialJson.User.FirstName) + " " + Base64.decode(initialJson.User.LastName) :
        Base64.decode(window.RVGlobal.CurrentUser.FirstName) + " " + Base64.decode(window.RVGlobal.CurrentUser.LastName);

    document.title = userFullname + " - " + document.title;
    //end of Set document title

    //Fill first & last name alert
    if ((initialJson.User.UserID == window.RVGlobal.CurrentUserID) &&
        (!initialJson.User.FirstName || !initialJson.User.LastName)) {
        var showed = GlobalUtilities.show(GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-8 medium-7 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center;",
                        Childs: [{ Type: "text", TextValue: RVDic.MSG.FillYourFirstAndLastName }]
                    },
                    {
                        Type: "div", Class: "small-6 medium-6 large-6 rv-air-button rv-circle",
                        Style: "margin:1rem auto 0 auto;",
                        Properties: [{ Name: "onclick", Value: function () { showed.Close(); } }],
                        Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                    }
                ]
            }
        ])["container"]);
    }
    //end of Fill first & last name alert

    GlobalUtilities.load_files(["USR/CoverPhoto.js"], {
        OnLoad: function () {
            new CoverPhoto("coverContainer", {
                UserID: RVGlobal.UserID,
                CurrentUserID: RVGlobal.CurrentUserID,
                IsSystemAdmin: RVGlobal.IsSystemAdmin === true,
                IsOwnPage: initialJson.IsOwnPage === true,
                FriendRequestSenderUserID: initialJson.FriendRequestSenderUserID,
                AreFriends: initialJson.AreFriends === true,
                User: initialJson.User,
                Modules: modules
            });
        }
    });
})();