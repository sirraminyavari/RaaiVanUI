(function () {
    if (window.PersonalPageInitializer) return;

    window.PersonalPageInitializer = function (params) {
        params = params || {};

        this.Objects = {
            CurrentPage: null,
            SharingManager: null,
            EmploymentTypes: params.EmploymentTypes,
            PhoneNumberTypes: params.PhoneNumberTypes
        };

        this.Options = {
            ActiveTab: String(params.ActiveTab).toLowerCase()
        };

        var modules = params.Modules;

        var that = this;

        GlobalUtilities.load_files(["TabsManager/TabsManager.js"], {
            OnLoad: function () {
                //Initialize tabs
                var tabs = [];

                var resumeNo = 0;

                if (modules.SocialNetwork) {
                    tabs.push({ Page: "socialArea", Title: RVDic.Social, FixedPage: true,
                        OnActive: function () { that.Objects.CurrentPage = "Social"; that._init_social(); }
                    });

                    ++resumeNo;
                }

                tabs.push({ Page: "resumeArea", Title: RVDic.Resume, FixedPage: true,
                    OnActive: function () { that.Objects.CurrentPage = "Resume"; that._init_resume(); }
                });

                tabs.push({ Page: "wikiArea", Title: RVDic.AboutMe, FixedPage: true,
                    OnActive: function () { that.Objects.CurrentPage = "Wiki"; that._init_wiki(); }
                });

                tabs.push({
                    Page: "relatedArea", Title: RVDic.RelatedNodes, FixedPage: true,
                    OnActive: function () { that.Objects.CurrentPage = "Related"; that._init_related_nodes(); }
                });

                new TabsManager({ ContainerDiv: "tabsArea", Pages: tabs }).goto_page(tabs[that.Options.ActiveTab == "resume" ? resumeNo : 0].Page);
                //end of tabs initialization

                GlobalUtilities.onscrollend(document, { Offset: 10 }, function () {
                    if (that.Objects.CurrentPage == "Social" && (that.Objects.SharingManager || {}).__Loaded)
                        that.Objects.SharingManager.get_posts();
                });
            }
        });
    }

    PersonalPageInitializer.prototype = {
        _init_social: function () {
            var that = this;

            if (that.__SocialInited) return;
            that.__SocialInited = true;

            GlobalUtilities.loading("socialArea");

            GlobalUtilities.load_files(["SharingManager/SharingManager.js"], {
                OnLoad: function () {
                    that.Objects.SharingManager = new SharingManager({
                        Container: "socialArea",
                        OwnerObjectID: RVGlobal.UserID || RVGlobal.CurrentUserID, InitialFill: true,
                        OwnerType: "User", NewPostArea: "Advanced", Permissions: { AddPost: true },
                        EnableImageUpload: true, HidePrivacyOptions: true,
                        OnLoad: function () { that.Objects.SharingManager.__Loaded = true; }
                    });
                }
            });
        },

        _init_resume: function () {
            var that = this;

            if (that.__ResumeInited) return;
            that.__ResumeInited = true;

            GlobalUtilities.loading("resumeArea");

            GlobalUtilities.load_files(["USR/Resume.js"], {
                OnLoad: function () {
                    var rs = new Resume("resumeArea", {
                        UserID: RVGlobal.UserID,
                        CurrentUserID: RVGlobal.CurrentUserID,
                        IsSystemAdmin: RVGlobal.IsSystemAdmin === true,
                        Editable: RVGlobal.UserID == RVGlobal.CurrentUserID || RVGlobal.IsSystemAdmin === true,
                        EnableProfileImage: !RVGlobal.Modules.SocialNetwork,
                        EmploymentTypes: that.Objects.EmploymentTypes,
                        PhoneNumberTypes: that.Objects.PhoneNumberTypes
                    });
                }
            });
        },
        
        _init_wiki: function () {
            var that = this;

            if (that.__WikiInited) return;
            that.__WikiInited = true;

            GlobalUtilities.loading("wikiContent");

            GlobalUtilities.load_files(["Wiki/WikiManager.js", ], {
                OnLoad: function () {
                    var wm = new WikiManager("wikiContent", {
                        OwnerID: RVGlobal.UserID || RVGlobal.CurrentUserID, OwnerType: "User", Downloadable: true
                    });
                }
            });
        },

        _init_related_nodes: function () {
            var that = this;

            if (that.__RelatedInited) return;
            that.__RelatedInited = true;

            var container = document.getElementById("relatedArea");

            GlobalUtilities.loading(container);

            GlobalUtilities.load_files(["CN/RelatedNodesViewer.js"], {
                OnLoad: function () {
                    new RelatedNodesViewer(container, {
                        ObjectID: RVGlobal.UserID || RVGlobal.CurrentUserID, Editable: false
                    });
                }
            });
        }
    }
})();