(function () {
    if (window.PersonalPageInitializer) return;

    window.PersonalPageInitializer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            TabsArea: null,
            SocialArea: null,
            ResumeArea: null,
            WikiArea: null,
            WikiContent: null,
            RelatedArea: null
        };

        this.Objects = {
            CurrentPage: null,
            SharingManager: null,
            EmploymentTypes: params.EmploymentTypes,
            PhoneNumberTypes: params.PhoneNumberTypes
        };

        this.Options = {
            User: params.User,
            ActiveTab: String(params.ActiveTab).toLowerCase()
        };

        var that = this;

        GlobalUtilities.load_files(["TabsManager/TabsManager.js"], {
            OnLoad: function () { that.initialize(params); }
        });
    }

    PersonalPageInitializer.prototype = {
        initialize: function (params) {
            var that = this;

            var modules = params.Modules;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "tabsArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "socialArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "resumeArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "wikiArea", Style: "margin-top:1rem;",
                    Childs: [{ Type: "div", Class: "small-12 medium-12 large-12", Name: "wikiContent" }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "relatedArea" }
            ], that.Container);

            that.Interface.TabsArea = elems["tabsArea"];
            that.Interface.SocialArea = elems["socialArea"];
            that.Interface.ResumeArea = elems["resumeArea"];
            that.Interface.WikiArea = elems["wikiArea"];
            that.Interface.WikiContent = elems["wikiContent"];
            that.Interface.RelatedArea = elems["relatedArea"];

            //Initialize tabs
            var tabs = [];

            var resumeNo = 0;

            if (modules.SocialNetwork) {
                tabs.push({
                    Page: that.Interface.SocialArea, Title: RVDic.Social, FixedPage: true,
                    OnActive: function () { that.Objects.CurrentPage = "Social"; that._init_social(); }
                });

                ++resumeNo;
            }

            tabs.push({
                Page: that.Interface.ResumeArea, Title: RVDic.Resume, FixedPage: true,
                OnActive: function () { that.Objects.CurrentPage = "Resume"; that._init_resume(); }
            });

            tabs.push({
                Page: that.Interface.WikiArea, Title: RVDic.AboutMe, FixedPage: true,
                OnActive: function () { that.Objects.CurrentPage = "Wiki"; that._init_wiki(); }
            });

            tabs.push({
                Page: that.Interface.RelatedArea, Title: RVDic.RelatedNodes, FixedPage: true,
                OnActive: function () { that.Objects.CurrentPage = "Related"; that._init_related_nodes(); }
            });

            new TabsManager({ ContainerDiv: that.Interface.TabsArea, Pages: tabs })
                .goto_page(tabs[that.Options.ActiveTab == "resume" ? resumeNo : 0].Page);
            //end of tabs initialization

            GlobalUtilities.onscrollend(document, { Offset: 10 }, function () {
                if (that.Objects.CurrentPage == "Social" && (that.Objects.SharingManager || {}).__Loaded)
                    that.Objects.SharingManager.get_posts();
            });
        },

        _init_social: function () {
            var that = this;

            if (that.__SocialInited) return;
            that.__SocialInited = true;

            GlobalUtilities.loading(that.Interface.SocialArea);

            GlobalUtilities.load_files(["SharingManager/SharingManager.js"], {
                OnLoad: function () {
                    that.Objects.SharingManager = new SharingManager({
                        Container: that.Interface.SocialArea,
                        OwnerObjectID: (that.Options.User || {}).UserID || RVGlobal.CurrentUserID, InitialFill: true,
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

            GlobalUtilities.loading(that.Interface.ResumeArea);

            GlobalUtilities.load_files(["USR/Resume.js"], {
                OnLoad: function () {
                    var rs = new Resume(that.Interface.ResumeArea, {
                        UserID: (that.Options.User || {}).UserID,
                        CurrentUserID: RVGlobal.CurrentUserID,
                        IsSystemAdmin: RVGlobal.IsSystemAdmin === true,
                        Editable: ((that.Options.User || {}).UserID == RVGlobal.CurrentUserID) || RVGlobal.IsSystemAdmin === true,
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

            GlobalUtilities.loading(that.Interface.WikiContent);

            GlobalUtilities.load_files(["Wiki/WikiManager.js",], {
                OnLoad: function () {
                    var wm = new WikiManager(that.Interface.WikiContent, {
                        OwnerID: (that.Options.User || {}).UserID || RVGlobal.CurrentUserID, OwnerType: "User", Downloadable: true
                    });
                }
            });
        },

        _init_related_nodes: function () {
            var that = this;

            if (that.__RelatedInited) return;
            that.__RelatedInited = true;

            GlobalUtilities.loading(that.Interface.RelatedArea);
            
            GlobalUtilities.load_files(["CN/RelatedNodesViewer.js"], {
                OnLoad: function () {
                    new RelatedNodesViewer(that.Interface.RelatedArea, {
                        ObjectID: (that.Options.User || {}).UserID || RVGlobal.CurrentUserID, Editable: false
                    });
                }
            });
        }
    }
})();