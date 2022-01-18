(function () {
    if (window.RelatedUsersViewer) return;

    window.RelatedUsersViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            SubjectID: params.SubjectID
        }

        this.Options = GlobalUtilities.extend({
            Constraints: null,
            HideScroll: false,
            MaxHeight: 0
        }, (params || {}).Options || {});

        var that = this;

        var _jsFiles = ["API/UsersAPI.js", "SimpleListViewer/NewSimpleListViewer.js"]

        switch (String(params.SubjectType).toLowerCase()) {
            case "node":
                _jsFiles.push("API/CNAPI.js");
                break;
            case "post":
            case "comment":
                _jsFiles.push("API/SharingAPI.js");
                break;
            case "question":
            case "answer":
                _jsFiles.push("API/RVAPI.js");
                break;
            case "wiki":
            case "wikititle":
            case "wikiparagraph":
                _jsFiles.push("API/WikiAPI.js");
                break;
        }

        GlobalUtilities.load_files(_jsFiles, { OnLoad: function () { that._initialize(params); } });
    }

    RelatedUsersViewer.prototype = {
        _get_api: function (params) {
            var that = this;

            switch (String((params || {}).SubjectType).toLowerCase()) {
                case "node":
                    return { APIFunction: CNAPI["Get" + params.Mode], Constraints: { NodeID: that.Objects.SubjectID} };
                case "post":
                    return { APIFunction: SharingAPI.GetFans, Constraints: { PostID: that.Objects.SubjectID, LikeStatus: params.LikeStatus} };
                case "comment":
                    return { APIFunction: SharingAPI.GetFans, Constraints: { CommentID: that.Objects.SubjectID, LikeStatus: params.LikeStatus} };
                case "question":
                case "answer":
                    return { APIFunction: RVAPI.GetFans, Constraints: { LikedID: that.Objects.SubjectID } };
                    break;
                case "wikiparagraph":
                    return { APIFunction: WikiAPI.GetParagraphRelatedUsers, Constraints: { ParagraphID: that.Objects.SubjectID} };
                case "friends":
                    return { APIFunction: UsersAPI["Get" + (params.Mode || "Friends")], Constraints: { UserID: that.Objects.SubjectID} };
                    break;
            }

            return null;
        },

        _initialize: function (params) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var _api = that._get_api(params);
            if (!_api) return;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                    Name: "_div",
                    Style: "margin:0rem auto; padding:1rem;" +
                        (!that.Options.MaxHeight ? "" : "max-height:" + that.Options.MaxHeight + "; overflow-y:auto;")
                }
            ], that.ContainerDiv)["_div"];

            GlobalUtilities.loading(_div);

            new NewSimpleListViewer(_div, {
                Options: {
                    OnDataRequest: function (options, done, setTotalCount) {
                        _api.APIFunction(GlobalUtilities.extend(options || {}, that.Options.Constraints || {}, _api.Constraints || {}, {
                            ParseResults: true,
                            ResponseHandler: function (result) {
                                done(result.Users || result.Experts || result.Members || result.Friends || []);
                                setTotalCount(result.TotalCount);
                            }
                        }));
                    },
                    ItemBuilder: function (container, item, params) {
                        that.create_user(container, item);
                        params.OnAfterAdd();
                    }
                }
            });
        },

        create_user: function (container, user) {
            var that = this;

            user = user || {};

            var fullname = GlobalUtilities.trim((Base64.decode(user.FirstName) || " ") + " " + (Base64.decode(user.LastName) || " "));

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.3rem;", Name: "container", 
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                            Style: "position:relative; padding:0.3rem; height:100%; min-height:4rem; padding-" + RV_Float + ":3.8rem;",
                            Link: RVAPI.UserPageURL({ UserID: user.UserID }),
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0; bottom:0;" + RV_Float + ":0.3rem;",
                                    Childs: [{
                                        Type: "middle",
                                        Childs: [{
                                            Type: "img", Class: "rv-border-radius-quarter", Style: "width:3rem; height:3rem;",
                                            Attributes: [{ Name: "src", Value: user.ProfileImageURL || user.ImageURL }]
                                        }]
                                    }]
                                },
                                {
                                    Type: "div", Class: "small-12 meidum-12 large-12", Style: "font-size:0.8rem;",
                                    Link: RVAPI.UserPageURL({ UserID: user.UserID }),
                                    Childs: [
                                        { Type: "text", TextValue: fullname },
                                        (!user.UserName || RVGlobal.HideUserNames ? null : {
                                            Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                            Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; font-size:0.6rem; padding:0.1rem 0.3rem;",
                                            Childs: [{ Type: "text", TextValue: Base64.decode(user.UserName) }]
                                        })
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);
        }
    }
})();