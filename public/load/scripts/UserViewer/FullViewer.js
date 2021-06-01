(function () {
    window.UserViewer = window.UserViewer || {};
    if (window.UserViewer.FullViewer) return;

    window.UserViewer.FullViewer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) this.Container = GlobalUtilities.create_nested_elements([{ Type: "div", Name: "_div" }])["_div"];
        params = params || {};

        var that = this;

        var user = params.User || {};
        var options = params.Options || {};

        var isIconsDivHidden = options.IsIconsDivHidden === true;
        var showCloseButton = options.ShowCloseButton === true;

        var pending = user.IsPending === true;

        var fullName = GlobalUtilities.trim((Base64.decode(user.FirstName) || " ") + " " + (Base64.decode(user.LastName) || " "));
        var userImgUrl = user.ImageURL || user.ProfileImageURL;

        var mutualFriends = (user.MutualFriendsCount || 0) == 0 ? "0" : user.MutualFriendsCount;

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Name: "MainDiv", Class: "small-12 medium-6 large-3", Style: "padding:0.3rem;",
                Childs: [
                    {
                        Type: "div", Style: "padding:0.3rem; height:100%;", Tooltip: fullName,
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "position:relative;" + (showCloseButton ? "padding-" + RV_RevFloat + ":1.5rem;" : "") +
                                    "padding-" + RV_Float + ":5rem; min-height:4rem;",
                                Childs: [
                                    (!showCloseButton ? null : {
                                        Type: "div", Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;",
                                        Childs: [{
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "closeButton", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }]
                                    }),
                                    {
                                        Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                        Childs: [{
                                            Type: "img", Class: "rv-border-radius-quarter", Style: "width:4rem; height:4rem;",
                                            Link: RVAPI.UserPageURL({ UserID: user.UserID }),
                                            Attributes: [{ Name: "src", Value: userImgUrl }]
                                        }]
                                    },
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12 Ellipsis",
                                        Link: RVAPI.UserPageURL({ UserID: user.UserID }),
                                        Childs: [{ Type: "text", TextValue: fullName }]
                                    },
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.7rem;",
                                        Childs: [
                                            (!user.JobTitle ? null : {
                                                Type: "div",
                                                Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem; color:rgb(100,100,100);",
                                                Childs: [{ Type: "text", TextValue: Base64.decode(user.JobTitle) }]
                                            }),
                                            (!user.JobTitle || !user.GroupName ? null : {
                                                Type: "div",
                                                Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem; color:rgb(100,100,100);",
                                                Childs: [{Type: "text", TextValue: RVDic.In}]
                                            }),
                                            (!user.GroupName ? null : {
                                                Type: "div", Style: "display:inline-block;",
                                                Link: user.GroupID ? RVAPI.NodePageURL({ NodeID: user.GroupID }) : null,
                                                Childs: [{ Type: "text", TextValue: Base64.decode(user.GroupName) }]
                                            })
                                        ]
                                    }
                                ]
                            },
                            (isIconsDivHidden ? null : {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "position:relative; padding-" + RV_Float + ":4rem; margin-top:0.5rem;",
                                Childs: [
                                    (mutualFriends <= 0 ? null : {
                                        Type: "div", Tooltip: RVDic.NMutualCoworkers.replace("[n]", mutualFriends),
                                        Style: "position:absolute; top:0rem;" + RV_Float + ":0rem; color:rgb(51, 135, 185);",
                                        Childs: [
                                            { Type: "text", TextValue: mutualFriends },
                                            {
                                                Type: "img", Style: "width:32px; height:32px; margin-" + RV_Float + ":0.5rem;",
                                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon("ColCount.png") }]
                                            }
                                        ]
                                    }),
                                    {
                                        Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                                        Childs: [
                                            (!pending ? null : {
                                                Type: "img", Name: "rejectRequest", Tooltip: RVDic.Reject,
                                                Style: "width:32px; height:32px; cursor:pointer; margin-" + RV_Float + ":0.3rem;",
                                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Cancel32.png") }],
                                                Properties: [
                                                    { Name: "onmouseover", Value: function () { this.setAttribute("src", GlobalUtilities.icon("Cancel32-Over.png")) } },
                                                    { Name: "onmouseout", Value: function () { this.setAttribute("src", GlobalUtilities.icon("Cancel32.png")) } }
                                                ]
                                            }),
                                            (!pending ? null : {
                                                Type: "img", Name: "acceptRequest", Tooltip: RVDic.Confirm,
                                                Style: "width:32px; height:32px; cursor:pointer; margin-" + RV_Float + ":0.3rem;",
                                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon("Accept32.png") }],
                                                Properties: [
                                                    { Name: "onmouseover", Value: function () { this.setAttribute("src", GlobalUtilities.icon("Accept32-Over.png")) } },
                                                    { Name: "onmouseout", Value: function () { this.setAttribute("src", GlobalUtilities.icon("Accept32.png")) } }
                                                ]
                                            }),
                                            (pending ? null : {
                                                Type: "img", Name: "sendRequest", 
                                                Style: "width:32px; height:32px; cursor:pointer; margin-" + RV_Float + ":0.3rem;",
                                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon("CAdd32.png") }],
                                                Properties: [
                                                    { Name: "onmouseover", Value: function () { this.setAttribute("src", GlobalUtilities.icon("CAdd32-Over.png")) } },
                                                    { Name: "onmouseout", Value: function () { this.setAttribute("src", GlobalUtilities.icon("CAdd32.png")) } }
                                                ]
                                            })
                                        ]
                                    }
                                ]
                            })
                        ]
                    }
                ]
            }
        ], this.Container);

        this.MainDiv = elems["MainDiv"];

        if (elems["closeButton"]) elems["closeButton"].onclick = function (e) {
            jQuery(elems["MainDiv"]).fadeOut(500, function () { this.remove(); });
            if (params.OnClose) params.OnClose({ UserID: user.UserID });
        };

        if (elems["sendRequest"]) elems["sendRequest"].onclick = function () {
            GlobalUtilities.block(elems["sendRequest"]);

            UsersAPI.SendFriendRequest({
                UserID: user.UserID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.Succeed) {
                        jQuery(elems["MainDiv"]).fadeOut(500, function () {
                            if (params.OnSendRequest) params.OnSendRequest({ UserID: user.UserID });
                            if (params.OnHide) params.OnHide();

                            this.remove();
                        });
                    }

                    GlobalUtilities.unblock(elems["sendRequest"]);
                }
            });
        };

        if (elems["acceptRequest"]) elems["acceptRequest"].onclick = function () {
            GlobalUtilities.block(elems["acceptRequest"]);

            UsersAPI.AcceptFriend({
                UserID: user.UserID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.Succeed) {
                        jQuery(elems["MainDiv"]).fadeOut(500, function () {
                            if (params.OnAcceptRequest) params.OnAcceptRequest({ UserID: user.UserID, UserImageURL: userImgUrl });
                            if (params.OnHide) params.OnHide();

                            this.remove();
                        });
                    }

                    GlobalUtilities.unblock(elems["acceptRequest"]);
                }
            });
        };

        if (elems["rejectRequest"]) elems["rejectRequest"].onclick = function () {
            GlobalUtilities.block(elems["rejectRequest"]);

            UsersAPI.RejectFriend({
                UserID: user.UserID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.Succeed) {
                        jQuery(elems["MainDiv"]).fadeOut(500, function () {
                            if (params.OnHide) params.OnHide();
                            this.remove();
                        });
                    }

                    GlobalUtilities.unblock(elems["rejectRequest"]);
                }
            });
        };

        return elems;
    }
})();