(function () {
    if (window.CoverPhoto) return;

    window.CoverPhoto = function (container, params) {
        this.ContainerDiv = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            UserID: params.UserID
        };

        this.Options = {
            Modules: params.Modules
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI"] }], {
            OnLoad: function () { that._initialize(params); }
        });
    };

    CoverPhoto.prototype = {
        _initialize: function (params) {
            var that = this;

            //initialize variables
            var isOwnPage = params.IsOwnPage === true;
            var areFriends = params.AreFriends === true;
            var friendRequestSenderUserId = params.FriendRequestSenderUserID;

            var userId = params.UserID;
            var currentUserId = params.CurrentUserID;
            var isSystemAdmin = params.IsSystemAdmin === true;

            var fullName = Base64.decode(params.User.FirstName) + " " + Base64.decode(params.User.LastName);
            var jobTitle = Base64.decode(params.User.JobTitle);

            var groupId = params.User.GroupID || "";
            var groupName = Base64.decode(params.User.GroupName);
            //end of variables initialization

            var bgColor = "background-color:rgba(255,255,255,0.6);";

            var _count_box = function (p) {
                return {
                    Type: "div", Class: "rv-border-radius-half show-for-large",
                    Style: "position:absolute; top:" + p.Top + "rem;" + RV_RevFloat + ":" + p.Side + "rem;" +
                        "width:6rem; height:6rem; text-align:center; color:#902020;" + bgColor,
                    Childs: [
                        {
                            Type: "div", Style: "font-weight:bold; margin-top:0.5rem; margin-bottom:1.5rem;",
                            Childs: [{ Type: "text", TextValue: p.Title }]
                        },
                        { Type: "div", Style: "font-weight:bold; font-size:1.5rem;", Name: p.Name }
                    ]
                };
            };

            var hasSocialModule = (that.Options.Modules || {}).SH;
            var coverImageName = hasSocialModule ? "Cover-Front.png" : "Cover-Front-Simple.png";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "coverPhoto",
                    Style: "position:absolute; top:0rem; bottom:0rem; left:0rem; right:0rem;"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "position:relative;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:3.5rem; left:0rem; right:0rem; text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; width:221px; height:2.5px; position:relative;",
                                    Childs: [
                                        { Type: "img", Attributes: [{ Name: "src", Value: GlobalUtilities.icon(coverImageName) }] },
                                        {
                                            Type: "div", Class: "rv-circle", Name: "personalImage",
                                            Style: "position:absolute; top:21px; left:85px; width:100px; height:100px; cursor:pointer;"
                                        },
                                        {
                                            Type: "div", Class: "rv-circle", Name: "friend1",
                                            Style: "position:absolute; top:48px; left:6px; width:50px; height:50px;" +
                                                "cursor:pointer;" + (hasSocialModule ? "" : "display:none;") +
                                                "background-image:url('" + GlobalUtilities.icon("Unspecified.png") + "'); background-size: 50px;"
                                        },
                                        {
                                            Type: "div", Class: "rv-circle", Name: "friend2",
                                            Style: "position:absolute; top:111px; left:30px; width:50px; height:50px;" +
                                                "cursor:pointer;" + (hasSocialModule ? "" : "display:none;") +
                                                "background-image:url('" + GlobalUtilities.icon("Unspecified.png") + "'); background-size: 50px;"
                                        },
                                        {
                                            Type: "div", Type: "div", Class: "rv-circle", Name: "friend3",
                                            Style: "position:absolute; top:149px; left:91px; width:50px; height:50px;" +
                                                "cursor:pointer;" + (hasSocialModule ? "" : "display:none;") +
                                                "background-image:url('" + GlobalUtilities.icon("Unspecified.png") + "'); background-size: 50px;"
                                        },
                                        {
                                            Type: "div", Class: "rv-circle", Name: "addfrndBtn", Tooltip: RVDic.ExpandFriendsNetwork,
                                            Style: "position:absolute; top:5px; left:41px; width:30px; height:30px;" +
                                                "cursor:pointer;" + (hasSocialModule ? "" : "display:none;") +
                                                "cursor:pointer; background-size:30px 30px;" +
                                                "background-image: url('" + GlobalUtilities.icon("CAdd32.png") + "');",
                                            Properties: [
                                                { Name: "onmouseover", Value: function () { this.style.backgroundImage = "url('" + GlobalUtilities.icon("CAdd32-Over.png") + "')"; } },
                                                { Name: "onmouseout", Value: function () { this.style.backgroundImage = "url('" + GlobalUtilities.icon("CAdd32.png") + "')"; } },
                                                { Name: "onclick", Value: function (e) { GlobalUtilities.link_click(e, RVAPI.NetworkPageURL({ Tab: "ExpandNetworkTab" }), { Open: true }); } }
                                            ]
                                        },
                                        {
                                            Type: "div", Name: "friendsCount",
                                            Style: "position:absolute; top:141px; left:171px; width:30px; height:20px;" +
                                                "cursor:pointer;" + (hasSocialModule ? "" : "display:none;") +
                                                "cursor:pointer; font-size:18px; text-align:center;"
                                        }
                                    ]
                                }
                            ]
                        },
                        _count_box({ Top: 2.5, Side: 2.5, Name: "likesCount", Title: RVDic.Interest }),
                        _count_box({ Top: 2.5, Side: 9.5, Name: "knowledgeCount", Title: RVDic.IntellectualProperties }),
                        _count_box({ Top: 9.5, Side: 2.5, Name: "groupsCount", Title: RVDic.Groups }),
                        _count_box({ Top: 9.5, Side: 9.5, Name: "expertiseCount", Title: RVDic.Expertise }),
                        {
                            Type: "div", Class: "rv-border-radius-half show-for-large",
                            Style: "position:absolute; padding:0.5rem; top:6rem;" + RV_Float + ":6rem;" +
                                "width:16rem; height:5.3rem;" + bgColor,
                            Childs: [
                                {
                                    Type: "div", Class: "WarmColor Ellipsis", Name: "fullName",
                                    Style: "width:100%; font-size:1.2rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: fullName }]
                                },
                                {
                                    Type: "div", Class: "Ellipsis", Name: "jobTitle",
                                    Style: "width:100%; font-size:0.8rem;",
                                    Childs: [{ Type: "text", TextValue: jobTitle }]
                                },
                                {
                                    Type: "div", Class: "Ellipsis", Name: "_in",
                                    Style: "display:inline-block; font-size:0.8rem; margin-" + RV_RevFloat + ":0.5rem;",
                                    Childs: [{ Type: "text", TextValue: groupId && groupName ? RVDic.In : null }]
                                },
                                {
                                    Type: "div", Class: "Ellipsis", Name: "organizationTitle",
                                    Style: "display:inline-block; width:13rem; font-size:0.8rem;",
                                    Link: RVAPI.NodePageURL({ NodeID: groupId }),
                                    Childs: [{ Type: "text", TextValue: groupId && groupName ? groupName : null }]
                                }
                            ]
                        },
                        {
                            Type: "div", Name: "friendship",
                            Style: "position:absolute; top:14rem;" + RV_Float + ":6rem; width:12rem; height:2rem;" +
                                (hasSocialModule ? "" : "display:none;")
                        }
                    ]
                }
            ], that.ContainerDiv);
            
            GlobalUtilities.load_files(["Multimedia/InlineImageCrop.js"], {
                OnLoad: function () {
                    new InlineImageCrop(elems["coverPhoto"], {
                        ObjectID: userId, DisableImageCrop: true,
                        ImageURL: params.User.CoverPhotoURL || GlobalUtilities.icon("DefaultCoverPhoto.jpg"),
                        HighQualityImageURL: params.User.HighQualityCoverPhotoURL,
                        Editable: currentUserId == userId || isSystemAdmin,
                        IconType: "CoverPhoto",
                        HighQualityIconType: "HighQualityCoverPhoto",
                        DimensionsVariableName: "CoverDimensions"
                    });
                }
            });

            GlobalUtilities.load_files(["Multimedia/IconSelect.js"], {
                OnLoad: function () {
                    var ic = new IconSelect(elems["personalImage"], {
                        ObjectID: userId || currentUserId,
                        Editable: currentUserId == userId || isSystemAdmin,
                        IconURL: params.User.ProfileImageURL || "", HighQualityIconURL: params.User.HighQualityImageURL || "",
                        IconType: "ProfileImage", HighQualityIconType: "HighQualityProfileImage", DimensionsVariableName: "ImageDimensions",
                        ImageWidth: 100, ImageHeight: 100, SaveWidth: 100, SaveHeight: 100, AspectRatio: 1, Circular: true
                    });
                }
            });

            UsersAPI.GetFriends({
                UserID: userId, Count: 3, ParseResults: true,
                ResponseHandler: function (result) {
                    var friends = result.Friends;
                    var frndCount = isNaN(+result.TotalCount) ? 0 : +result.TotalCount;

                    var _set_img_onclick = function (elem, _url) { elem.onclick = function (e) { GlobalUtilities.link_click(e, _url); } }

                    for (var i = 0; i < friends.length && i < 3; i++) {
                        var friend = friends[i];
                        var frndDiv = elems["friend" + (i + 1)];

                        frndDiv.style.backgroundImage = "url('" + friend.ImageURL + "')" || "";
                        frndDiv.style.cursor = "pointer";

                        _set_img_onclick(frndDiv, UsersAPI.UserPageURL({ UserID: friend.UserID }));

                        GlobalUtilities.append_tooltip(frndDiv,
                                Base64.decode(friend.FirstName || "") + " " + Base64.decode(friend.LastName || ""));
                    }

                    elems["friendsCount"].innerHTML = GlobalUtilities.convert_numbers_to_persian(frndCount);
                    elems["friendsCount"].style.cursor = "pointer";
                    elems["friendsCount"].onclick = frndCount == 0 ? null : function () {
                        var __div = GlobalUtilities.create_nested_elements([{ Type: "div", Name: "_div" }])["_div"];
                        GlobalUtilities.show(__div);

                        GlobalUtilities.load_files(["Social/RelatedUsersViewer.js"], {
                            OnLoad: function () {
                                new RelatedUsersViewer(__div, { SubjectID: userId, SubjectType: "friends", Mode: "Friends" });
                            }
                        });
                    }
                }
            });

            CNAPI.GetIntellectualPropertiesCount({
                UserID: userId, ParseResults: true,
                ResponseHandler: function (result) {
                    that._set_count(elems["knowledgeCount"], result, RVDic.IntellectualProperties,
                        "GetIntellectualProperties", "intellectualproperties");
                }
            });

            CNAPI.GetFavoriteNodesCount({
                UserID: userId, ParseResults: true,
                ResponseHandler: function (result) {
                    that._set_count(elems["likesCount"], result, RVDic.Interest, "GetFavoriteNodes", "GetFavoriteNodes");
                }
            });

            CNAPI.GetExpertiseDomainsCount({
                UserID: userId, ParseResults: true,
                ResponseHandler: function (result) {
                    that._set_count(elems["expertiseCount"], result, RVDic.Expertise, "GetExpertiseDomains", "expertisedomains");
                }
            });

            CNAPI.GetMembershipDomainsCount({
                UserID: userId, ParseResults: true,
                ResponseHandler: function (result) {
                    that._set_count(elems["groupsCount"], result, RVDic.Groups, "GetMembershipDomains", "groups");
                }
            });

            if (!isOwnPage) {
                var fsElem = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "rv-circle", Name: "MainDiv",
                        Style: "display:inline-block; cursor:pointer; height:2rem; padding-" + RV_RevFloat + ":1rem;" + bgColor,
                        Childs: [
                            {
                                Type: "div", Name: "ImageDiv", Class: "rv-circle",
                                Style: "display:inline-block; width:2rem; height:2rem; background-color:white;" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [
                                    {
                                        Type: "img", Name: "Image", Style: "width:2rem; height:2rem;",
                                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(areFriends ? "Cancel32.png" : (!friendRequestSenderUserId ? "CAdd32.png" : (friendRequestSenderUserId == currentUserId ? "Accept32.png" : "Cancel32.png"))) }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Name: "TextDiv", Class: "rv-circle",
                                Style: "display:inline-block; color:black; line-height:2rem; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: areFriends ? RVDic.Unfriend : (!friendRequestSenderUserId ? RVDic.FriendRequest : (friendRequestSenderUserId == currentUserId ? RVDic.AcceptRequest : RVDic.CancelRequest)) }]
                            }
                        ]
                    }
                ], elems["friendship"]);

                var imageOverName = areFriends ? "Cancel32-Over.png" : (!friendRequestSenderUserId ? "CAdd32-Over.png" :
                    (friendRequestSenderUserId == currentUserId ? "Accept32-Over.png" : "Cancel32-Over.png"));

                var imageName = areFriends ? "Cancel32.png" : (!friendRequestSenderUserId ? "CAdd32.png" :
                    (friendRequestSenderUserId == currentUserId ? "Accept32.png" : "Cancel32.png"));

                fsElem["MainDiv"].onmouseover = function () { fsElem["Image"].setAttribute("src", GlobalUtilities.icon(imageOverName)); }
                fsElem["MainDiv"].onmouseout = function () { fsElem["Image"].setAttribute("src", GlobalUtilities.icon(imageName)); }

                fsElem["MainDiv"].onclick = function (e) {
                    var set_title = function () {
                        fsElem["TextDiv"].innerHTML = areFriends ? RVDic.Unfriend : (!friendRequestSenderUserId ? RVDic.FriendRequest :
                            (friendRequestSenderUserId == currentUserId ? RVDic.AcceptRequest : RVDic.CancelRequest));

                        var newImage = areFriends ? "Cancel32.png" : (!friendRequestSenderUserId ? "CAdd32.png" :
                            (friendRequestSenderUserId == currentUserId ? "Accept32.png" : "Cancel32.png"));

                        var newImageOver = areFriends ? "Cancel32-Over.png" : (!friendRequestSenderUserId ? "CAdd32-Over.png" :
                            (friendRequestSenderUserId == currentUserId ? "Accept32-Over.png" : "Cancel32-Over.png"));

                        fsElem["Image"].setAttribute("src", GlobalUtilities.icon(newImage));
                        fsElem["MainDiv"].onmouseover = function () { fsElem["Image"].setAttribute("src", GlobalUtilities.icon(newImageOver)); }
                        fsElem["MainDiv"].onmouseout = function () { fsElem["Image"].setAttribute("src", GlobalUtilities.icon(newImage)); }
                    }

                    GlobalUtilities.block(fsElem["MainDiv"]);

                    if (areFriends || (!!friendRequestSenderUserId && (friendRequestSenderUserId != currentUserId))) {
                        UsersAPI.RejectFriend({
                            UserID: userId, ParseResults: true,
                            ResponseHandler: function (result) {
                                GlobalUtilities.unblock(fsElem["MainDiv"]);

                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) {
                                    friendRequestSenderUserId = "";
                                    areFriends = false;
                                    set_title();
                                }
                            }
                        });
                    }
                    else if (!friendRequestSenderUserId) {
                        UsersAPI.SendFriendRequest({
                            UserID: userId, ParseResults: true,
                            ResponseHandler: function (result) {
                                GlobalUtilities.unblock(fsElem["MainDiv"]);

                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) {
                                    friendRequestSenderUserId = GlobalUtilities.generate_new_guid();
                                    set_title();
                                }
                            }
                        });
                    }
                    else {
                        UsersAPI.AcceptFriend({
                            UserID: userId, ParseResults: true,
                            ResponseHandler: function (result) {
                                GlobalUtilities.unblock(fsElem["MainDiv"]);

                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) {
                                    areFriends = true;
                                    set_title();
                                }
                            }
                        });
                    }
                };
            }
        },

        _set_count: function (container, result, title, apiFunction, helpEntryName) {
            var that = this;

            var nodeTypes = result.NodeTypes || [];
            var cnt = 0;
            for (var i = 0; i < nodeTypes.length; i++) cnt += nodeTypes[i].Count;
            container.innerHTML = GlobalUtilities.convert_numbers_to_persian(cnt);

            if (cnt > 0) {
                container.style.cursor = "pointer";
                container.onmouseover = function () { this.style.color = "blue"; }
                container.onmouseout = function () { this.style.color = "#902020"; }
            }

            container.onclick = cnt == 0 ? null : function () {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-11 medium-10 large-9 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["CN/NodesListViewer.js"], {
                    OnLoad: function () {
                        new NodesListViewer(_div, {
                            Title: title,
                            APIFunc: apiFunction,
                            NodeTypes: nodeTypes,
                            Constraints: { UserID: that.Objects.UserID },
                            HelpEntryName: helpEntryName
                        });
                    }
                });
            }
        }
    };
})();