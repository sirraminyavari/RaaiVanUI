(function () {
    if (window.Resume) return;

    window.Resume = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;

        params = params || {};
        var that = this;

        //Agar Education i bedoone Pishvande "School" ya "Institute" bood pishvand "School" farz shavad.

        that.Interface = {
            JobExperiencesArea: null,
            EducationExperiencesArea: null,
            InstituteEducationExperiencesArea: null,
            HonorsAndAwardsArea: null,
            LanguagesArea: null,
            AddJobButton: null,
            AddEducationButton: null,
            AddInstituteEducationButton: null,
            AddHonorButton: null,
            AddLanguageButton: null,
            PersonalImageArea: null,
            IdentificationMenu: null,
            JobExperienceMenu: null,
            EducationalExperienceMenu: null,
            TrainingsMenu: null,
            HonorsAndAwardsMenu: null,
            LanguageMenu: null
        };

        that.Objects = {
            UserID: params.UserID,
            CurrentUserID: params.CurrentUserID,
            IsSystemAdmin: params.IsSystemAdmin,
            Editable: params.Editable === true,
            GraduateDegrees: null,
            EducationalLevels: null,
            LanguageLevels: null,
            JobExperiences: null,
            Publications: null,
            EducationExperiences: null,
            InstituteExperiences: null,
            HonorsAndAwards: null,
            Languages: null,
            LanguageSelect: null, ///new
            CurrentUser: null,
            User: null,
            UserProfileObject: null
        };
        
        this.Options = {
            ProfileImage: params.EnableProfileImage === true
        };
        
        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["UsersAPI", "CNAPI"] }, "USR/UserProfile.js"], {
            OnLoad:
            function () { that._preinit(params); }
        });
    }

    Resume.prototype = {
        _preinit: function (params) {
            var that = this;

            UsersAPI.GetResumeConstantInfo({
                ResponseHandler: function (responseText) {
                    var result = JSON.parse(responseText);

                    UsersAPI.GetUser({
                        UserID: that.Objects.UserID,
                        ParseResults: true,
                        ResponseHandler: function (_result) {
                            that.Objects.User = _result;
                            that._initialize(params);
                        }
                    });

                    var _graduateDegrees = result.GraduateDegrees;
                    var _educationalLevels = result.EducationalLevels;
                    var _languageLevels = result.LanguageLevels;

                    that.Objects.GraduateDegrees = [{ Type: "option", Style: "color:gray;", Childs: [{ Type: "text", TextValue: (RVDic["Select"] || "Select") + "..." }] }];

                    for (var i = 0; i < _graduateDegrees.length; i++) {
                        that.Objects.GraduateDegrees.push({
                            Type: "option",
                            Properties: [{ Name: "title", Value: _graduateDegrees[i] }],
                            Childs: [{ Type: "text", TextValue: RVDic.USR.GraduateDegree[_graduateDegrees[i]] || _graduateDegrees[i] }]
                        });
                    }

                    that.Objects.EducationalLevels = [{ Type: "option", Style: "color:gray;", Childs: [{ Type: "text", TextValue: (RVDic["Select"] || "Select") + "..." }] }];

                    for (var i = 0; i < _educationalLevels.length; i++) {
                        that.Objects.EducationalLevels.push({
                            Type: "option",
                            Properties: [{ Name: "title", Value: _educationalLevels[i] }],
                            Childs: [{ Type: "text", TextValue: RVDic.USR.EducationalLevel[_educationalLevels[i]] || _educationalLevels[i] }]
                        });
                    }

                    that.Objects.LanguageLevels = [{ Type: "option", Style: "color:gray;", Childs: [{ Type: "text", TextValue: (RVDic["Select"] || "Select") + "..." }] }];

                    for (var i = 0; i < _languageLevels.length; i++) {
                        that.Objects.LanguageLevels.push({
                            Type: "option",
                            Properties: [{ Name: "title", Value: _languageLevels[i] }],
                            Childs: [{ Type: "text", TextValue: RVDic[_languageLevels[i]] || _languageLevels[i] }]
                        });
                    }
                }
            });
        },

        _initialize: function (params) {
            var that = this;
            that.ContainerDiv.innerHTML = "";
            
            var selectedItemColor = "rgb(90, 90, 90)";
            var notSelectedItemColor = "rgb(190, 190, 190)";

            var _menu_item = function (p) {
                return {
                    Type: "div", Name: p.Name, Class: "rv-border-radius-1 menuItem",
                    Style: "cursor:pointer; padding:0.3rem 1rem;",
                    Childs: [
                        { Type: "a", Attributes: [{ Name: "href", Value: "#" + p.HashTag }] },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":1rem;",
                            Childs: [{ Type: "img", Attributes: [{ Name: "src", Value: GlobalUtilities.icon(p.Icon) }] }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; color:Gray;",
                            Childs: [{ Type: "text", TextValue: p.Title }]
                        }
                    ]
                };
            };

            var _section_header = function (p) {
                return {
                    Type: "section", Name: p.SectionName, Style: "margin-bottom:2rem;",
                    Childs: [
                        {
                            Type: "div", Name: p.HeaderName,
                            Class: "rv-border-radius-1 SoftBackgroundColor SoftBorder",
                            Style: "font-weight:bold; font-size:2rem; text-align:center; position:relative;" +
                                "color:" + notSelectedItemColor + "; padding:1rem 3rem; margin-bottom:1rem;",
                            Childs: [
                                {
                                    Type: "div", Name: p.AddButtonName,
                                    Style: "position:absolute; cursor:pointer; top:0rem; bottom:0rem;" +
                                        (!p.AddButtonName ? "display:none;" : "") + RV_RevFloat + ":1rem;",
                                    Childs: [
                                        {
                                            Type: "middle",
                                            Childs: [
                                                {
                                                    Type: "img", Tooltip: RVDic.Add,
                                                    Attributes: [{ Name: "src", Value: GlobalUtilities.icon("CAdd32.png") }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Childs: [{ Type: "text", TextValue: p.Title }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Name: p.ItemsContainerName,
                            Style: "margin:0rem;"
                        }
                    ]
                }
            };

            var containerElems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":16rem;",
                    Childs: [
                        {
                            Type: "div", Name: "FIRSTCOLUMN", ID: "profileMenu",
                            Style: "position:absolute; width:15rem; top:0rem;" + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-border-radius-1 SoftBackgroundColor WarmBorder", Name: "MENU",
                                    Childs: [
                                        _menu_item({
                                            Name: "identificationMenu", HashTag: "Identification",
                                            Icon: "Identity30.png", Title: RVDic.PersonalIdentity
                                        }),
                                        { Type: "hr", Class: "small-12 medium-12 large-12", Style: "color:rgb(221,221,221); margin:0rem;", },
                                        _menu_item({
                                            Name: "jobExperienceMenu", HashTag: "JobExperience",
                                            Icon: "Job30.png", Title: RVDic.JobExperience
                                        }),
                                        { Type: "hr", Class: "small-12 medium-12 large-12", Style: "color:rgb(221,221,221); margin:0rem;", },
                                        _menu_item({
                                            Name: "educationalExperienceMenu", HashTag: "EducationalExperience",
                                            Icon: "Academy30.png", Title: RVDic.EducationalExperience
                                        }),
                                        { Type: "hr", Class: "small-12 medium-12 large-12", Style: "color:rgb(221,221,221); margin:0rem;", },
                                        _menu_item({
                                            Name: "trainingsMenu", HashTag: "Trainings",
                                            Icon: "Training30.png", Title: RVDic.TrainingCourses
                                        }),
                                        { Type: "hr", Class: "small-12 medium-12 large-12", Style: "color:rgb(221,221,221); margin:0rem;", },
                                        _menu_item({
                                            Name: "honorsAndAwardsMenu", HashTag: "HonorsAndAwards",
                                            Icon: "Honor30.png", Title: RVDic.HonorsAndAwards
                                        }),
                                        { Type: "hr", Class: "small-12 medium-12 large-12", Style: "color:rgb(221,221,221); margin:0rem;", },
                                        _menu_item({
                                            Name: "languageMenu", HashTag: "Language",
                                            Icon: "Language30.png", Title: RVDic.Language
                                        })
                                    ]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "secondColumn" }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.IdentificationMenu = containerElems["identificationMenu"];
            that.Interface.JobExperienceMenu = containerElems["jobExperienceMenu"];
            that.Interface.EducationalExperienceMenu = containerElems["educationalExperienceMenu"];
            that.Interface.TrainingsMenu = containerElems["trainingsMenu"];
            that.Interface.HonorsAndAwardsMenu = containerElems["honorsAndAwardsMenu"];
            that.Interface.LanguageMenu = containerElems["languageMenu"];

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                Childs: [
                    _section_header({
                        SectionName: "IDENTIFICATION", HeaderName: "identificationHEADER",
                        Title: RVDic.PersonalIdentity,
                        ItemsContainerName: "profileDiv"
                    }),
                    _section_header({
                        SectionName: "JOBEXPERIENCES", HeaderName: "JobHEADER",
                        AddButtonName: "addJobButton", Title: RVDic.JobExperience,
                        ItemsContainerName: "JobExperiencesArea"
                    }),
                    _section_header({
                        SectionName: "SCHOOLEJUCATIONEXPERIENCES", HeaderName: "EducationHEADER",
                        AddButtonName: "addEducationButton", Title: RVDic.EducationalExperience,
                        ItemsContainerName: "EducationExperiencesArea"
                    }),
                    _section_header({
                        SectionName: "INSTITUTEJUCATIONEXPERIENCES", HeaderName: "InstituteHEADER",
                        AddButtonName: "addInstituteEducationButton", Title: RVDic.TrainingCourses,
                        ItemsContainerName: "InstituteEducationExperiencesArea"
                    }),
                    _section_header({
                        SectionName: "HONORSANDAWARDS", HeaderName: "HonorHEADER",
                        AddButtonName: "addHonorButton", Title: RVDic.HonorsAndAwards,
                        ItemsContainerName: "HonorsAndAwardsArea"
                    }),
                    _section_header({
                        SectionName: "LANGUAGES", HeaderName: "LanguageHEADER",
                        AddButtonName: "addLanguageButton", Title: RVDic.Language,
                        ItemsContainerName: "LanguagesArea"
                    })
                ]
            }], containerElems["secondColumn"]);

            that.Objects.UserProfileObject = new UserProfile(elems["profileDiv"], params);

            that.Interface.JobExperiencesArea = elems["JobExperiencesArea"];
            that.Interface.EducationExperiencesArea = elems["EducationExperiencesArea"];
            that.Interface.InstituteEducationExperiencesArea = elems["InstituteEducationExperiencesArea"];
            that.Interface.HonorsAndAwardsArea = elems["HonorsAndAwardsArea"];
            that.Interface.LanguagesArea = elems["LanguagesArea"];

            that.Interface.AddJobButton = elems["addJobButton"];
            that.Interface.AddEducationButton = elems["addEducationButton"];
            that.Interface.AddInstituteEducationButton = elems["addInstituteEducationButton"];
            that.Interface.AddHonorButton = elems["addHonorButton"];
            that.Interface.AddLanguageButton = elems["addLanguageButton"];

            that.Interface.AddJobButton.onclick = function () {
                that.set_job_experiences(that.Interface.JobExperiencesArea, null, true);
            };

            that.Interface.AddEducationButton.onclick = function () {
                that.set_school_education_experiences(that.Interface.EducationExperiencesArea, null, true);
            };

            that.Interface.AddInstituteEducationButton.onclick = function () {
                that.set_institute_education_experiences(that.Interface.InstituteEducationExperiencesArea, null, true);
            };

            that.Interface.AddHonorButton.onclick = function () {
                that.set_honors_and_awards(that.Interface.HonorsAndAwardsArea, null, true);
            };

            that.Interface.AddLanguageButton.onclick = function () {
                that.set_languages(that.Interface.LanguagesArea, null, true);
            };

            that.reset(null, {
                jobDiv: elems["JOBEXPERIENCES"], honorDiv: elems["HONORSANDAWARDS"], languageDiv: elems["LANGUAGES"],
                instituteEducationDiv: elems["INSTITUTEJUCATIONEXPERIENCES"], educationDiv: elems["SCHOOLEJUCATIONEXPERIENCES"]
            });
            ////////////////////////////////////////////////////////

            var iface = that.Interface;

            var scrollees = [
                { Menu: iface.IdentificationMenu, Container: elems["IDENTIFICATION"], Header: elems["identificationHEADER"] },
                { Menu: iface.JobExperienceMenu, Container: elems["JOBEXPERIENCES"], Header: elems["JobHEADER"] },
                { Menu: iface.EducationalExperienceMenu, Container: elems["SCHOOLEJUCATIONEXPERIENCES"], Header: elems["EducationHEADER"] },
                { Menu: iface.TrainingsMenu, Container: elems["INSTITUTEJUCATIONEXPERIENCES"], Header: elems["InstituteHEADER"] },
                { Menu: iface.HonorsAndAwardsMenu, Container: elems["HONORSANDAWARDS"], Header: elems["HonorHEADER"] },
                { Menu: iface.LanguageMenu, Container: elems["LANGUAGES"], Header: elems["LanguageHEADER"] }
            ];

            var menuContainer = containerElems["FIRSTCOLUMN"];
            var menuContent = menuContainer.getElementsByTagName("div")[0];

            var find_selected_menu = function () {
                if (!GlobalUtilities.is_visible(elems["container"])) return;

                var scrollTop = jQuery(window).scrollTop();
                
                if (scrollTop > 340) {
                    GlobalUtilities.get_side_panel(function (panel) {
                        panel.style.top = "4rem";
                        
                        panel.appendChild(menuContent);
                        menuContent.setAttribute("style", "position:absolute; width:15rem; top:0.6rem;" + RV_Float + ":6vw;");
                    });
                }
                else {
                    GlobalUtilities.get_side_panel(function (panel) { panel.style.top = null; });

                    menuContainer.appendChild(menuContent);
                    menuContent.setAttribute("style", "");
                }

                for (var i = 0, lnt = scrollees.length; i < lnt; ++i) {
                    var sectionPos = jQuery(scrollees[i].Container).offset().top - scrollTop
                    var menuPos = jQuery(scrollees[i].Menu).offset().top - scrollTop;

                    if (sectionPos <= menuPos && sectionPos + jQuery(scrollees[i].Container).outerHeight() >= menuPos + 24) {
                        scrollees[i].Menu.style.backgroundColor = "white";
                        scrollees[i].Header.style.color = selectedItemColor;
                    }
                    else {
                        scrollees[i].Header.style.color = notSelectedItemColor;
                        scrollees[i].Menu.style.backgroundColor = "transparent";
                    }
                }
            };

            find_selected_menu();
            jQuery(document).scroll(find_selected_menu);

            that.Interface.IdentificationMenu.onclick = function () {
                GlobalUtilities.scroll_into_view(elems["IDENTIFICATION"]);
            };

            that.Interface.JobExperienceMenu.onclick = function () {
                GlobalUtilities.scroll_into_view(elems["JOBEXPERIENCES"]);
            };

            that.Interface.EducationalExperienceMenu.onclick = function () {
                GlobalUtilities.scroll_into_view(elems["SCHOOLEJUCATIONEXPERIENCES"]);
            };

            that.Interface.TrainingsMenu.onclick = function () {
                GlobalUtilities.scroll_into_view(elems["INSTITUTEJUCATIONEXPERIENCES"]);
            };

            that.Interface.HonorsAndAwardsMenu.onclick = function () {
                GlobalUtilities.scroll_into_view(elems["HONORSANDAWARDS"]);
            };

            that.Interface.LanguageMenu.onclick = function () {
                GlobalUtilities.scroll_into_view(elems["LANGUAGES"]);
            };
        },

        reset: function (userId, Divs) {
            var that = this;
            
            that.__InterfaceDivs = Divs || that.__InterfaceDivs;
            Divs = that.__InterfaceDivs;

            if ((that.Objects.UserID || "") != "" && that.Objects.UserID == userId) return;
            that.Objects.UserID = userId || that.Objects.UserID;
            
            that.Objects.Editable = that.Objects.IsSystemAdmin === true ||
                (String(that.Objects.CurrentUserID || "").toLowerCase() == String(that.Objects.UserID || "").toLowerCase());

            that.set_personal_image(that.Interface.PersonalImageArea, that.Objects.User);

            //Edited
            if (!that.Objects.Editable) {
                that.Interface.AddJobButton.style.display = "none";
                that.Interface.AddEducationButton.style.display = "none";
                that.Interface.AddInstituteEducationButton.style.display = "none";
                that.Interface.AddHonorButton.style.display = "none";
                that.Interface.AddLanguageButton.style.display = "none";
            }
            else {
                that.Interface.AddJobButton.style.display = "block";
                that.Interface.AddEducationButton.style.display = "block";
                that.Interface.AddInstituteEducationButton.style.display = "block";
                that.Interface.AddHonorButton.style.display = "block";
                that.Interface.AddLanguageButton.style.display = "block";
            }
            //end of edited
            
            that.Interface.JobExperiencesArea.innerHTML = "";
            that.Interface.EducationExperiencesArea.innerHTML = "";
            that.Interface.InstituteEducationExperiencesArea.innerHTML = "";
            that.Interface.HonorsAndAwardsArea.innerHTML = "";
            that.Interface.LanguagesArea.innerHTML = "";

            UsersAPI.GetResumeInfo({
                UserID: that.Objects.UserID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (!that.Objects.Editable && result.JobExperiences.length == 0) {
                        Divs.jobDiv.style.display = "none";
                        that.Interface.JobExperienceMenu.style.display = "none";
                    }
                    else {
                        Divs.jobDiv.style.display = "block";
                        for (var i = 0; i < result.JobExperiences.length; i++)
                            that.set_job_experiences(that.Interface.JobExperiencesArea, result.JobExperiences[i], false);
                    }
                    
                    if (!that.Objects.Editable && result.SchoolEducationCount == 0) {
                        Divs.educationDiv.style.display = "none";
                        that.Interface.EducationalExperienceMenu.style.display = "none";
                    }
                    else {
                        Divs.educationDiv.style.display = "block";
                        for (var i = 0, lnt = result.EducationalExperiences.length; i < lnt; i++)
                            if (result.EducationalExperiences[i].IsSchool)
                                that.set_school_education_experiences(that.Interface.EducationExperiencesArea, result.EducationalExperiences[i], false);
                    }

                    if (!that.Objects.Editable && result.InstituteEducationCount == 0) {
                        Divs.instituteEducationDiv.style.display = "none";
                        that.Interface.TrainingsMenu.style.display = "none";
                    }
                    else {
                        Divs.instituteEducationDiv.style.display = "block";
                        for (var i = 0, lnt = result.EducationalExperiences.length; i < lnt; i++) {
                            if (!result.EducationalExperiences[i].IsSchool)
                                that.set_institute_education_experiences(that.Interface.InstituteEducationExperiencesArea, result.EducationalExperiences[i], false);
                        }
                    }
                    
                    if (!that.Objects.Editable && result.HonorsAndAwards.length == 0) {
                        Divs.honorDiv.style.display = "none";
                        that.Interface.HonorsAndAwardsMenu.style.display = "none";
                    }
                    else {
                        Divs.honorDiv.style.display = "block";
                        for (var i = 0; i < result.HonorsAndAwards.length; i++)
                            that.set_honors_and_awards(that.Interface.HonorsAndAwardsArea, result.HonorsAndAwards[i], false);
                    }

                    if (!that.Objects.Editable && result.Languages.length == 0) {
                        Divs.languageDiv.style.display = "none";
                        that.Interface.LanguageMenu.style.display = "none";
                    }
                    else {
                        Divs.languageDiv.style.display = "block";
                        for (var i = 0; i < result.Languages.length; i++)
                            that.set_languages(that.Interface.LanguagesArea, result.Languages[i], false);
                    }
                }
            });
        },

        item_builder: function (container, object, params) {
            var that = this;
            params = params || {};

            var isNewItem = params.IsNewItem === true;
            var add2Top = params.Add2Top === true;

            var showed = null;

            if (isNewItem) {
                container = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                showed = GlobalUtilities.show(container);
            }

            var editable = that.Objects.Editable && !isNewItem;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "itemDiv",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-soft rv-border-radius-quarter",
                            Style: "padding:0.5rem; position:relative;" + (!editable ? "" : "padding-" + RV_RevFloat + ":3.5rem;"),
                            Childs: [
                                {
                                    Type: "div", Class: "RevDirection RevTextAlign", Name: "editAndDeleteDiv",
                                    Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;" + (editable ? "" : "display:none;"),
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                            Tooltip: RVDic.Remove, Name: "deleteButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton",
                                            Style: "margin-" + RV_RevFloat + ":0.5rem;", Tooltip: RVDic.Edit,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "viewArea",
                                    Style: "margin:0rem;" + (isNewItem ? "display:none;" : ""),
                                    Childs: params.ViewArea ? params.ViewArea() : null
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "editArea",
                                    Style: "margin:0rem;" + (isNewItem ? "" : "display:none;"),
                                    Childs: params.EditArea ? params.EditArea() : null
                                },
                                {
                                    Type: "div", Class: "small-6 medium-5 large-4 rv-air-button rv-circle", Name: "confirmButton",
                                    Style: "margin:2rem auto 0rem auto;" + (isNewItem ? "" : "display:none;"),
                                    Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-6 medium-6 large-6",
                            Style: "margin:0.5rem auto; background-color:rgb(220,220,220);" +
                                "padding-top:1px;" + (isNewItem ? "display:none;" : "")
                        }
                    ]
                }
            ]);

            if (add2Top) container.insertBefore(elems["itemDiv"], container.firstChild);
            else container.appendChild(elems["itemDiv"]);

            if (params.OnInterfaceCreated) params.OnInterfaceCreated(elems);

            var itemDiv = elems["itemDiv"];
            var editAndDeleteDiv = elems["editAndDeleteDiv"];
            var deleteButton = elems["deleteButton"];
            var editButton = elems["editButton"];
            var editArea = elems["editArea"];
            var viewArea = elems["viewArea"];
            var confirmButton = elems["confirmButton"];

            var processing = false;

            var _set_data = function () { if (params.SetData) params.SetData(elems, object); };

            _set_data();

            /////////////   Edit Button   //////////////
            var _on_edit = function () {
                if ((!editable && !isNewItem) || processing) return;

                var set_things = function () {
                    jQuery(editArea)[editButton.__Editing ? "fadeIn" : "fadeOut"](0);
                    jQuery(viewArea)[editButton.__Editing ? "fadeOut" : "fadeIn"](0);

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);

                    _set_data();

                    editButton.setAttribute("class",
                        "fa fa-lg rv-icon-button " + (editButton.__Editing ? "fa-floppy-o" : "fa-pencil"));
                };

                if (editButton.__Editing === true) {
                    params.OnSave = params.OnSave || function () { return false; };

                    if (params.OnSave(elems, object, function (r) {
                        if (!r) return;

                        editButton.__Editing = false;
                        set_things();

                        if (showed) showed.Close();

                        ret.Processing(false);
                    }) === false) return;
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            //////////////  Add Button   //////////////
            confirmButton.onclick = function () {
                editButton.__Editing = true;
                _on_edit();
            };

            /////////////  Delete Button   ///////////
            deleteButton.onclick = function () {
                var that = this;

                if (!params.OnRemove || processing) return;

                GlobalUtilities.confirm(params.RemoveConfirmMessage, function (r) {
                    if (!r) return;

                    params.OnRemove(elems, object, function () {
                        jQuery(itemDiv).animate({ height: "toggle" }, 500, function () { this.remove(); });
                    });
                }
                );
            };

            var ret = {
                ViewArea: viewArea,
                EditArea: editArea,
                Processing: function (value) { processing = value; }
            };

            return ret;
        },

        set_job_experiences: function (container, job, isNewItem, add2Top) {
            var that = this;
            job = job || {};

            job.Title = Base64.decode(job.Title);
            job.Employer = Base64.decode(job.Employer);

            var beginDate = null;
            var finishDate = null;

            var _set_data = function (elems) {
                elems["viewArea"].innerHTML = "";
                
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [
                            {
                                Type: "div", Name: "jobTitle",
                                Style: "display:inline-block; font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: job.Title }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (job.Employer ? "inline-block" : "none") + ";" + 
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.In }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (job.Employer ? "inline-block" : "none") + "; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: job.Employer }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "margin-top:0.5rem;" + (!job.JStartDate && !job.JEndDate ? "display:none;" : ""),
                        Childs: [
                            {
                                Type: "div",
                                Style: "display:" + (job.JStartDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (job.JStartDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":1.5rem; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: job.JStartDate }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (job.JEndDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (job.JEndDate ? "inline-block" : "none") + "; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: job.JEndDate }]
                            }
                        ]
                    }
                ], elems["viewArea"]);

                elems["title"].value = job.Title ? job.Title : "";
                elems["employer"].value = job.Employer ? job.Employer : "";

                if (beginDate && job.JStartDate && job.GStartDate)
                    beginDate.Set({ Value: job.GStartDate, Label: job.JStartDate });
                else if (beginDate) beginDate.Clear();

                if (finishDate && job.JEndDate && job.GEndDate)
                    finishDate.Set({ Value: job.GEndDate, Label: job.JEndDate });
                else if (finishDate) finishDate.Clear();
            };

            var _edit_area = [
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_RevFloat + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "title", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.JobTitle, Tooltip: RVDic.JobTitle
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_Float + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "employer", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.Employer, Tooltip: RVDic.Employer
                        }
                    ]
                },
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                {
                    Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
            ];

            var _create_interface_objects = function (elems) {
                GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) { beginDate = cal; });
                GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) { finishDate = cal; });

                GlobalUtilities.necessary_input([
                    { Input: elems["title"], InnerTitle: RVDic.JobTitle },
                    { Input: elems["employer"], InnerTitle: RVDic.Employer }
                ]);
            };

            var itm = that.item_builder(container, job, {
                IsNewItem: isNewItem,
                Add2Top: add2Top,
                RemoveConfirmMessage: RVDic.Confirms.DoYouWantToRemoveJobExperience,
                ViewArea: function () { return null },
                EditArea: function () { return _edit_area; },
                OnInterfaceCreated: function (elems) { _create_interface_objects(elems); },
                SetData: function (elems, object) { _set_data(elems); },
                OnSave: function (elems, object, callback) {
                    var newTitle = GlobalUtilities.trim(elems["title"].value);
                    var newEmployer = GlobalUtilities.trim(elems["employer"].value);

                    var newGStartDate = !beginDate ? null : beginDate.Get().Value;
                    var newGEndDate = !finishDate ? null : finishDate.Get().Value;
                    var newJStartDate = !beginDate ? null : beginDate.Get().Label;
                    var newJEndDate = !finishDate ? null : finishDate.Get().Label;

                    if (!newTitle || !newEmployer) {
                        alert(RVDic.PleaseFillNecessaryFields);
                        return false;
                    }

                    itm.Processing(true);

                    UsersAPI.SetJobExperience({
                        JobID: job.JobID, UserID: that.Objects.UserID, Title: Base64.encode(newTitle),
                        Employer: Base64.encode(newEmployer), StartDate: newGStartDate, EndDate: newGEndDate,
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                callback(false);
                            }
                            else {
                                job.JobID = result.JobID;
                                job.Title = newTitle;
                                job.Employer = newEmployer;
                                job.GStartDate = newGStartDate;
                                job.GEndDate = newGEndDate;
                                job.JStartDate = newJStartDate;
                                job.JEndDate = newJEndDate;

                                callback(true);

                                if (isNewItem) that.set_job_experiences(container, job, false, true);
                            }

                            itm.Processing(false);
                        }
                    });
                },
                OnRemove: function (elems, object, callback) {
                    itm.Processing(true);

                    UsersAPI.RemoveJobExperience({
                        JobID: job.JobID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else callback();

                            itm.Processing(false);
                        }
                    });
                }
            });
        },

        set_school_education_experiences: function (container, education, isNewItem, add2Top) {
            var that = this;

            education = education || {};

            var isInstitute = education.IsInstitute === true;
            
            education.School = Base64.decode(education.School);
            education.StudyField = Base64.decode(education.StudyField);

            var schoolInnerTitle = isInstitute ? RVDic.Institute : RVDic.University;
            var branchInnerTitle = isInstitute ? RVDic.CourseTitle : RVDic.Branch;

            var beginDate = null;
            var finishDate = null;

            var _set_data = function (elems) {
                elems["viewArea"].innerHTML = "";

                var degree = RVDic.USR.EducationalLevel[education.Level];
                
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: (education.School || education.StudyField || degree ? "" : "display:none;"),
                        Childs: [
                            {
                                Type: "div",
                                Style: "display:" + (degree ? "inline-block" : "none") + "; font-weight:bold;" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: degree }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (education.StudyField ? "inline-block" : "") + ";" +
                                    "font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: education.StudyField }]
                            },
                            {
                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: isInstitute ? RVDic.In : RVDic.From }]
                            },
                            {
                                Type: "div", Style: "display:inline-block; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: education.School }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "margin-top:0.5rem;" + (!education.JStartDate && !education.JEndDate ? "display:none;" : ""),
                        Childs: [
                            {
                                Type: "div",
                                Style: "display:" + (education.JStartDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (education.JStartDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":1.5rem; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: education.JStartDate }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (education.JEndDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (education.JEndDate ? "inline-block" : "none") + "; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: education.JEndDate }]
                            }
                        ]
                    }
                ], elems["viewArea"]);

                elems["school"].value = education.School ? education.School : "";
                elems["branch"].value = education.StudyField ? education.StudyField : "";

                for (var i = 0; i < elems["degree"].length; i++) {
                    if (elems["degree"][i].title == education.Level) {
                        elems["degree"].selectedIndex = i;
                        break;
                    }
                }
                
                if (beginDate && education.JStartDate && education.GStartDate)
                    beginDate.Set({ Value: education.GStartDate, Label: education.JStartDate });
                else if (beginDate) beginDate.Clear();

                if (finishDate && education.JEndDate && education.GEndDate)
                    finishDate.Set({ Value: education.GEndDate, Label: education.JEndDate });
                else if (finishDate) finishDate.Clear();
            };

            var _edit_area = [
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_RevFloat + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "school", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: schoolInnerTitle, Tooltip: schoolInnerTitle
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_Float + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "branch", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: branchInnerTitle, Tooltip: branchInnerTitle
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_RevFloat + ":0.5rem; margin-bottom:1rem;" + (isInstitute ? "display:none;" : ""),
                    Childs: [
                        {
                            Type: "select", Class: "rv-input", Name: "degree", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.DegreeSelect, Tooltip: RVDic.DegreeSelect,
                            Childs: that.Objects.EducationalLevels
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12" },
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.FromDate + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "beginDate" },
                {
                    Type: "div", Style: "display:inline-block; margin:0rem 2rem; margin-" + RV_RevFloat + ":0.5rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.ToDate + ":" }]
                },
                { Type: "div", Style: "display:inline-block;", Name: "finishDate" }
            ];

            var _create_interface_objects = function (elems) {
                GlobalUtilities.append_calendar(elems["beginDate"], { ClearButton: true }, function (cal) { beginDate = cal; });
                GlobalUtilities.append_calendar(elems["finishDate"], { ClearButton: true }, function (cal) { finishDate = cal; });

                GlobalUtilities.necessary_input([
                    { Input: elems["school"], InnerTitle: RVDic.University },
                    { Input: elems["branch"], InnerTitle: RVDic.Branch }
                ]);

                if (!isInstitute) {
                    elems["degree"].onchange = function () {
                        if (elems["degree"].selectedIndex == 0)
                            elems["degree"].style.backgroundColor = "rgba(255, 231, 231, 1)";
                        else elems["degree"].style.backgroundColor = "white";
                    };

                    elems["degree"].onchange();
                }
            };

            var msg = isInstitute ? RVDic.Confirms.DoYouWantToRemoveEducationalCourse :
                RVDic.Confirms.DoYouWantToRemoveEducationalExperience;

            var itm = that.item_builder(container, education, {
                IsNewItem: isNewItem,
                Add2Top: add2Top,
                RemoveConfirmMessage: msg,
                ViewArea: function () { return null },
                EditArea: function () { return _edit_area; },
                OnInterfaceCreated: function (elems) { _create_interface_objects(elems); },
                SetData: function (elems, object) { _set_data(elems); },
                OnSave: function (elems, object, callback) {
                    var newSchool = GlobalUtilities.trim(elems["school"].value);
                    var newStudyField = GlobalUtilities.trim(elems["branch"].value);
                    var newDegree = isInstitute ? null : elems["degree"][elems["degree"].selectedIndex].title;

                    var newGStartDate = !beginDate ? null : beginDate.Get().Value;
                    var newGEndDate = !finishDate ? null : finishDate.Get().Value;
                    var newJStartDate = !beginDate ? null : beginDate.Get().Label;
                    var newJEndDate = !finishDate ? null : finishDate.Get().Label;

                    if (!newSchool || !newStudyField || (!isInstitute && !newDegree)) {
                        alert(RVDic.PleaseFillNecessaryFields);
                        return false;
                    }

                    itm.Processing(true);

                    UsersAPI[isInstitute ? "SetInstituteEducationalExperience" : "SetEducationalExperience"]({
                        EducationID: education.EducationID, School: Base64.encode(newSchool),
                        StudyField: Base64.encode(newStudyField), StartDate: newGStartDate,
                        EndDate: newGEndDate, Level: newDegree, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                callback(false);
                            }
                            else {
                                education.EducationID = result.EducationID;
                                education.School = newSchool;
                                education.StudyField = newStudyField;
                                education.Level = newDegree;
                                education.GStartDate = newGStartDate;
                                education.GEndDate = newGEndDate;
                                education.JStartDate = newJStartDate;
                                education.JEndDate = newJEndDate;

                                callback(true);

                                if (isNewItem) that.set_school_education_experiences(container, education, false, true);
                            }

                            itm.Processing(false);
                        }
                    });
                },
                OnRemove: function (elems, object, callback) {
                    itm.Processing(true);

                    UsersAPI.RemoveEducationalExperience({
                        EducationID: education.EducationID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else callback();

                            itm.Processing(false);
                        }
                    });
                }
            });
        },

        set_institute_education_experiences: function (container, education, isNewItem, add2Top) {
            var that = this;

            education = education || {};
            education.IsInstitute = true;

            that.set_school_education_experiences(container, education, isNewItem, add2Top);
        },

        set_honors_and_awards: function (container, honor, isNewItem, add2Top) {
            var that = this;

            honor = honor || {};

            honor.Title = Base64.decode(honor.Title);
            honor.Issuer = Base64.decode(honor.Issuer);
            honor.Occupation = Base64.decode(honor.Occupation);
            honor.Description = Base64.decode(honor.Description);

            var issueDate = null;
            var descInput = null;
            
            var _set_data = function (elems) {
                elems["viewArea"].innerHTML = "";

                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "margin-bottom:0.5rem;" + (honor.Title || honor.Occupation ? "" : "display:none;"),
                        Childs: [
                            {
                                Type: "div",
                                Style: "display:" + (honor.Title ? "inline-block" : "none") + "; font-weight:bold;" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: honor.Title }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (honor.Occupation ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.InTheFieldOf }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (honor.Occupation ? "inline-block" : "") + ";" +
                                    "font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: honor.Occupation }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "margin-bottom:0.5rem;" +
                            (honor.Issuer || honor.Occupation || honor.JIssueDate ? "" : "display:none;"),
                        Childs: [
                            {
                                Type: "div",
                                Style: "display:" + (honor.Issuer ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.From }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (honor.Issuer ? "inline-block" : "") + ";" +
                                    "font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: honor.Issuer }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (honor.JIssueDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.OnDate }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (honor.JIssueDate ? "inline-block" : "none") + ";" +
                                    "margin-" + RV_RevFloat + ":1.5rem; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: honor.JIssueDate }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "description",
                        Style: "margin-bottom:0.5rem; text-align:justify;" + (honor.Description ? "" : "display:none;")
                    }
                ], elems["viewArea"]);

                var desc = GlobalUtilities.get_text_begining(honor.Description, 3000, "", { RichText: false });
                GlobalUtilities.append_markup_text(_el["description"], desc);

                elems["title"].value = honor.Title ? honor.Title : "";
                elems["issuer"].value = honor.Issuer ? honor.Issuer : "";
                elems["occupation"].value = honor.Occupation ? honor.Occupation : "";

                if (issueDate && honor.JIssueDate && honor.GIssueDate)
                    issueDate.Set({ Value: honor.GIssueDate, Label: honor.JIssueDate });
                else if (issueDate) issueDate.Clear();

                if (descInput) descInput.set_data(honor.Description);
            };

            var _edit_area = [
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_RevFloat + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "title", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.Title, Tooltip: RVDic.Title
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_Float + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "occupation", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.Occupation, Tooltip: RVDic.Occupation
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_RevFloat + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "issuer", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.Issuer, Tooltip: RVDic.Issuer
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-6 medium-6 large-6",
                    Style: "padding-" + RV_Float + ":0.5rem; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.IssueDate + ":" }]
                        },
                        { Type: "div", Style: "display:inline-block;", Name: "issueDate" }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "description", Tooltip: RVDic.Description }
            ];

            var _create_interface_objects = function (elems) {
                GlobalUtilities.append_calendar(elems["issueDate"], { ClearButton: true }, function (cal) { issueDate = cal; });

                descInput = new AdvancedTextArea({
                    ContainerDiv: elems["description"],
                    DefaultText: RVDic.Description + "...",
                    QueryTemplate: "RelatedThings",
                    ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
                });

                GlobalUtilities.necessary_input([
                    { Input: elems["title"], InnerTitle: RVDic.Title },
                    { Input: elems["issuer"], InnerTitle: RVDic.Issuer },
                    { Input: elems["occupation"], InnerTitle: RVDic.Occupation }
                ]);
            };

            var itm = that.item_builder(container, honor, {
                IsNewItem: isNewItem,
                Add2Top: add2Top,
                RemoveConfirmMessage: RVDic.Confirms.DoYouWantToRemoveHonorOrAward,
                ViewArea: function () { return null },
                EditArea: function () { return _edit_area; },
                OnInterfaceCreated: function (elems) { _create_interface_objects(elems); },
                SetData: function (elems, object) { _set_data(elems); },
                OnSave: function (elems, object, callback) {
                    var newTitle = GlobalUtilities.trim(elems["title"].value);
                    var newOccupation = GlobalUtilities.trim(elems["occupation"].value);
                    var newIssuer = GlobalUtilities.trim(elems["issuer"].value);

                    var newGIssueDate = !issueDate ? null : issueDate.Get().Value;
                    var newJIssueDate = !issueDate ? null : issueDate.Get().Label;
                    var newDescription = !descInput ? null : GlobalUtilities.trim(descInput.get_data());

                    if (!newTitle || !newOccupation || !newIssuer) {
                        alert(RVDic.PleaseFillNecessaryFields);
                        return false;
                    }

                    itm.Processing(true);

                    UsersAPI.SetHonorAndAward({
                        HonorID: honor.HonorID, UserID: that.Objects.UserID, Title: Base64.encode(newTitle),
                        Occupation: Base64.encode(newOccupation), Issuer: Base64.encode(newIssuer), IssueDate: newGIssueDate,
                        Description: Base64.encode(newDescription), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                callback(false);
                            }
                            else {
                                honor.HonorID = result.HonorID;
                                honor.Title = newTitle;
                                honor.Issuer = newIssuer;
                                honor.Occupation = newOccupation;
                                honor.Description = newDescription;
                                honor.GIssueDate = newGIssueDate;
                                honor.JIssueDate = newJIssueDate;

                                callback(true);

                                if (isNewItem) that.set_honors_and_awards(container, honor, false, true);
                            }

                            itm.Processing(false);
                        }
                    });
                },
                OnRemove: function (elems, object, callback) {
                    itm.Processing(true);

                    UsersAPI.RemoveHonorAndAward({
                        HonorID: honor.HonorID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else callback();

                            itm.Processing(false);
                        }
                    });
                }
            });
        },

        set_languages: function (container, language, isNewItem, add2Top) {
            var that = this;

            language = language || {};

            language.LanguageName = Base64.decode(language.LanguageName);

            var langSelect = null;
            var lastLangSelected = null;

            var _set_data = function (elems) {
                elems["viewArea"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: (language.LanguageName || language.Level ? "" : "display:none;"),
                        Childs: [
                            {
                                Type: "div",
                                Style: "display:" + (language.LanguageName ? "inline-block" : "none") + "; font-weight:bold;" +
                                    "margin-" + RV_RevFloat + ":0.5rem;",
                                Childs: [{ Type: "text", TextValue: language.LanguageName }]
                            },
                            {
                                Type: "div",
                                Style: "display:" + (language.Level ? "inline-block" : "") + "; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: RVDic[language.Level] || language.Level }]
                            }
                        ]
                    }
                ], elems["viewArea"]);

                if(langSelect) langSelect.set_item(language.LanguageID, language.LanguageName);

                elems["level"].selectedIndex = 0;

                for (var i = 0; i < elems["level"].length; i++) {
                    if (elems["level"][i].title == language.Level) {
                        elems["level"].selectedIndex = i;
                        break;
                    }
                }
            };

            var _edit_area = [
                {
                    Type: "div", Class: "small-6 medium-6 large-6", Name: "language",
                    Style: "padding-" + RV_RevFloat + ":0.5rem;"
                },
                {
                    Type: "div", Class: "small-6 medium-6 large-6", Style: "padding-" + RV_Float + ":0.5rem;",
                    Childs: [
                        {
                            Type: "select", Class: "rv-input", Name: "level", Style: "width:100%; font-size:0.7rem;",
                            InnerTitle: RVDic.LevelSelect, Tooltip: RVDic.LevelSelect,
                            Childs: that.Objects.LanguageLevels
                        }
                    ]
                }
            ];

            var _create_interface_objects = function (elems) {
                langSelect = GlobalUtilities.append_autosuggest(elems["language"], {
                    InputClass: "rv-input",
                    InputStyle: "width:100%; font-size:0.7rem;",
                    InnerTitle: RVDic.LanguageSelect + "...",
                    AjaxDataSource: UsersAPI.GetLanguages(),
                    ResponseParser: function (responseText) {
                        var langs = JSON.parse(responseText).Languages || [];
                        var arr = [];
                        for (var i = 0, lnt = langs.length; i < lnt; ++i) {
                            langs[i].LanguageName = Base64.decode(langs[i].LanguageName || "");
                            arr.push([langs[i].LanguageName, langs[i].LanguageID]);
                        }
                        return arr;
                    },
                    OnSelect: function () { lastLangSelected = this.keywords[this.selectedIndex]; }
                });

                GlobalUtilities.necessary_input([{ Input: langSelect.InputElement, InnerTitle: RVDic.LanguageSelect }]);

                elems["level"].onchange = function () {
                    if (elems["level"].selectedIndex == 0) elems["level"].style.backgroundColor = "rgba(255,231,231,1)";
                    else elems["level"].style.backgroundColor = "white";
                };

                elems["level"].onchange();
            };

            var itm = that.item_builder(container, language, {
                IsNewItem: isNewItem,
                Add2Top: add2Top,
                RemoveConfirmMessage: RVDic.Confirms.DoYouWantToRemoveLanguage,
                ViewArea: function () { return null },
                EditArea: function () { return _edit_area; },
                OnInterfaceCreated: function (elems) { _create_interface_objects(elems); },
                SetData: function (elems, object) { _set_data(elems); },
                OnSave: function (elems, object, callback) {
                    var newLangName = lastLangSelected ? GlobalUtilities.trim(lastLangSelected) :
                        (langSelect ? GlobalUtilities.trim(langSelect.InputElement.value) : null);

                    var newLevel = elems["level"][elems["level"].selectedIndex].title || "";
                    if (elems["level"].selectedIndex == 0) newLevel = "";

                    if (!newLangName || !newLevel) {
                        alert(RVDic.PleaseFillNecessaryFields);
                        return false;
                    }

                    itm.Processing(true);

                    UsersAPI.SetLanguage({
                        ID: language.ID, LanguageName: Base64.encode(newLangName), LanguageLevel: newLevel,
                        UserID: that.Objects.UserID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                callback(false);
                            }
                            else {
                                language.ID = result.ID;
                                language.LanguageName = newLangName;
                                language.Level = newLevel;

                                callback(true);

                                if (isNewItem) that.set_languages(container, language, false, true);
                            }

                            itm.Processing(false);
                        }
                    });
                },
                OnRemove: function (elems, object, callback) {
                    itm.Processing(true);

                    UsersAPI.RemoveLanguage({
                        ID: language.ID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else callback();

                            itm.Processing(false);
                        }
                    });
                }
            });
        },

        set_personal_image: function (container, params) {
            params = params || {};
            var that = this;

            if (!that.Options.ProfileImage) return;

            var userId = that.Objects.UserID || that.Objects.CurrentUserID;

            GlobalUtilities.load_files(["Multimedia/IconSelect.js"], {
                OnLoad: function () {
                    var ic = new IconSelect(container, {
                        ObjectID: userId, Editable: that.Objects.Editable === true,
                        IconURL: params.ProfileImageURL || "", HighQualityIconURL: params.HighQualityImageURL || "",
                        IconType: "ProfileImage", HighQualityIconType: "HighQualityProfileImage", DimensionsVariableName: "ImageDimensions",
                        ImageWidth: 100, ImageHeight: 100, SaveWidth: 100, SaveHeight: 100, AspectRatio: 1, Circular: true
                    });
                }
            });
        }
    }
})();