(function () {
    if (window.ApplicationsManager) return;

    window.ApplicationsManager = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        params = params || {};
        if (!this.Container) return;

        this.Interface = {
            Items: null,
            Archived: null,
            NewTeamButton: null
        };

        this.Options = {
            SortVariableName: "ApplicationsOrder_" + ((window.RVGlobal || {}).CurrentUser || {}).UserID
        };
        
        var that = this;
        
        GlobalUtilities.load_files(["API/UsersAPI.js", "Public/NameDialog.js", "Multimedia/IconSelect.js"], {
            OnLoad: function () { that.initialize(); }
        });
    };

    ApplicationsManager.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center; font-weight:bold;" +
                        "margin-bottom:1rem; padding:0 1rem; font-size:1.2rem; color:rgb(100,100,100);",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Teams }]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                            Style: "flex:0 0 auto; font-weight:normal; font-size:0.8rem;", Name: "newTeam",
                            Childs: [
                                { Type: "i", Class: "fa fa-plus-circle", Style: "margin-" + RV_RevFloat + ":0.3rem;" },
                                { Type: "text", TextValue: RVDic.NewN.replace("[n]", RVDic.Team) }
                            ]
                        },
                        { Type: "div", Style: "flex:1 1 auto;", Name: "swh" },
                        {
                            Type: "div", Style: "display:flex; flex-flow:row; flex:0 0 auto;" +
                                "font-weight:normal; color:black; font-size:0.8rem; justify-content:center; align-items:center;",
                            Childs: [
                                {
                                    Type: "switch", Style: "flex:0 0 auto; margin-" + RV_RevFloat + ":0.5rem;", Name: "swh",
                                    Params: { OnChange: function () { that.reset(this.checked); } }
                                },
                                { Type: "div", Style: "flex:0 0 auto;", Childs: [{ Type: "text", TextValue: RVDic.Archive }]}
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "items" },
                { Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; display:none;", Name: "archived" }
            ], that.Container);

            that.Interface.Items = elems["items"];
            that.Interface.Archived = elems["archived"];
            that.Interface.NewTeamButton = elems["newTeam"];

            GlobalUtilities.sortable(elems["items"], {
                DraggableClass: "draggable",
                PlaceholderTarget: "draggable",
                OnDrop: function (e, targetElement) { that.save_order(); }
            });

            //new team button
            var saving = false;

            that.Interface.NewTeamButton.onclick = function () {
                if (saving) return;
                saving = true;

                new NameDialog({
                    Title: RVDic.Name, InnerTitle: RVDic.Name,
                    OnActionCall: function (name, callback) {
                        if (!name) return callback(!(saving = false));

                        RVAPI.CreateApplication({
                            Title: Base64.encode(name), ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Application) {
                                    result.Application.UsersCount = result.ApplicationUsers.TotalCount;
                                    result.Application.Users = result.ApplicationUsers.Users;

                                    that.add_item(that.Interface.Items, result.Application, true);
                                    that.save_order();
                                }

                                callback(!!(result || {}).Application);

                                saving = false;
                            }
                        });
                    }
                });
            };
            //end of new team button
            
            that.reset();
        },

        reset: function (archive) {
            var that = this;

            var container = archive ? that.Interface.Archived : that.Interface.Items;

            jQuery(archive ? that.Interface.Items : that.Interface.Archived).fadeOut(0, function () {
                jQuery(container).fadeIn(0);
            });

            jQuery(that.Interface.NewTeamButton)[archive ? "fadeOut" : "fadeIn"](200);

            container.innerHTML = "";
            GlobalUtilities.loading(container);

            RVAPI.GetApplications({
                Archive: !!archive, ParseResults: true,
                ResponseHandler: function (result) {
                    that.get_order(archive, function (order) {
                        container.innerHTML = "";

                        var applications = (result || {}).Applications || [];

                        applications.forEach(app => {
                            app.UsersCount = ((result.ApplicationUsers || {})[app.ApplicationID] || {}).TotalCount;
                            app.Users = ((result.ApplicationUsers || {})[app.ApplicationID] || {}).Users;
                        });

                        order = (order || []).filter(id => applications.some(a => a.ApplicationID == id))
                            .map(id => applications.filter(a => a.ApplicationID == id)[0]);

                        order.concat(applications.filter(a => !order.some(o => o.ApplicationID == a.ApplicationID)))
                            .forEach(app => that.add_item(container, app, null, archive));

                        if (archive && !((result || {}).Applications || []).length)
                            that.nothing_to_display(container);
                    });
                }
            });
        },

        get_order: function (archive, callback) {
            var that = this;

            if (archive) return callback([]);

            RVAPI.GetVariable({
                Name: that.Options.SortVariableName, ApplicationIndependent: true,  ParseResults: true,
                ResponseHandler(result) {
                    callback((GlobalUtilities.to_json(Base64.decode(result.Value)) || {}).Order || []);
                }
            });
        },

        save_order: function () {
            var that = this;

            var appIds = [];

            var firstChild = that.Interface.Items.firstChild;
            while (firstChild) {
                if (firstChild.ApplicationID) appIds.push(firstChild.ApplicationID);
                firstChild = firstChild.nextSibling;
            }

            if (appIds.length) RVAPI.SetVariable({
                Name: that.Options.SortVariableName, Value: Base64.encode(JSON.stringify({ Order: appIds })),
                ApplicationIndependent: true, ParseResults: true,
                ResponseHandler(result) {  }
            });
        },

        nothing_to_display: function (container) {
            container.innerHTML = "";

            GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1 SoftBackgroundColor",
                Style: "font-weight:500; font-size:1.2rem; text-align:center; color:rgb(100,100,100); padding:1rem;",
                Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
            }], container);
        },

        add_item: function (container, item, add2top, isArchive) {
            var that = this;

            var isActive = (window.RVGlobal || {}).ApplicationID == item.ApplicationID;
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-6 large-4",
                Style: "padding:1rem; opacity:0;", Name: "container",
                Properties: [{ Name: "ApplicationID", Value: item.ApplicationID }],
                Childs: [{
                    Type: "div", Name: "selectButton",
                    Class: "small-12 medium-12 large-12 draggable rv-border-radius-half " +
                        (isActive ? "rv-bg-color-softer-soft" : "rv-air-button-base rv-air-button-gray"),
                    Style: "position:relative; height:100%; padding:1.5rem; display:flex; flex-flow:column;" +
                        (isArchive ? "cursor:default;" : "cursor:pointer;"),
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;",
                            Childs: [1, 2].map(i => {
                                return {
                                    Type: "i", Class: "fa fa-ellipsis-v", Style: "margin:0 1px; color:rgb(200,200,200);",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                };
                            })
                        },
                        {
                            Type: "div", Style: "position:relative; flex:0 0 auto; min-height:60px; padding-" + RV_Float + ":70px;",
                            Childs: [
                                { Type: "div", Name: "iconArea", Style: "position:absolute; top:0;" + RV_Float + ":0;" },
                                { Type: "div", Name: "editableTitle", Style: "height:100%;" }
                            ]
                        },
                        {
                            Type: "div", Class: "rv-border-radius-quarter", Name: "members",
                            Style: "flex:0 0 auto; display:flex; flex-flow:row; justify-content:center; margin-top:2.5rem;"
                        },
                        {
                            Type: "div", Class: "rv-border-radius-quarter", Name: "otherMembers",
                            Style: "flex:0 0 auto; display:none; flex-flow:row; justify-content:center; margin-top:0.5rem;"
                        },
                        {Type: "div", Style: "flex:1 1 auto;"},
                        {
                            Type: "div", Style: "display:flex; flex-flow:row; padding-top:2.5rem;",
                            Childs: [
                                { Type: "div", Style: "flex:1 1 auto;" },
                                (isArchive ? null : {
                                    Type: "div",
                                    Class: "rv-border-radius-quarter " + (isActive ? "rv-air-button" : "rv-air-button-base rv-air-button-black"),
                                    Style: "flex:0 0 auto; font-size:0.7rem;", Name: item.Removable ? "remove" : "quit",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa " + (item.Removable ? "fa-trash" : "fa-sign-out"),
                                            Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: item.Removable ? RVDic.RemoveN.replace("[n]", RVDic.Team) : RVDic.LeaveN.replace("[n]", RVDic.Team) }
                                    ]
                                }),
                                (!item.Removable || !isArchive ? null : {
                                    Type: "div", Class: "rv-border-radius-quarter rv-air-button-base rv-air-button-black",
                                    Style: "flex:0 0 auto; font-size:0.7rem;", Name: "remove",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-recycle", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        },
                                        { Type: "text", TextValue: RVDic.Recycle }
                                    ]
                                })
                            ]
                        }
                    ]
                }]
            }]);

            if (!add2top) container.appendChild(elems["container"]);
            else container.insertBefore(elems["container"], container.firstChild);

            //Append title
            var editableTitle = GlobalUtilities.append_editable_title(elems["editableTitle"], {
                Editable: item.Removable && !isArchive,
                Container: { Style: "display:flex; flex-flow:row; justify-content:center; align-items:center; height:100%;" },
                Title: {
                    Value: Base64.decode(item.Title),
                    Class: "WarmColor TextAlign",
                    Style: "display:flex; flex:1 1 auto; font-size:1.1rem; font-weight:bold; align-items:center; padding:0.4rem;",
                    Builder: (title) => [{ Type: "text", TextValue: title.Value }]
                },
                Input: { Placeholder: RVDic.TeamName, Style: "font-size:1.1rem;" },
                Save: (title) => {
                    RVAPI.ModifyApplication({
                        ApplicationID: item.ApplicationID, Title: Base64.encode(title.Value), ParseResults: true,
                        ResponseHandler: function (result) { }
                    });
                }
            });
            //end of Append title

            //Faces
            var imgSize = 3;
            var overSize = 0.5;
            var showedFaces = (item.Users || []).filter((u, ind) => ind < 4);
            var showedUsersCount = showedFaces.length;

            if (item.Removable && !isArchive)
                showedFaces = showedFaces.concat([{ Type: "add" }]).filter(u => !!u);

            showedFaces.forEach((u, ind) => {
                var fullname = GlobalUtilities.trim((Base64.decode(u.FirstName) || " ") + " " + (Base64.decode(u.LastName) || " "));

                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "rv-hover-zindex",
                    Style: "flex:0 0 auto; margin-" + RV_Float + ":-" + overSize + "rem;",
                    Childs: [{
                        Type: "middle",
                        Childs: [
                            (u.Type == "add" ? null : {
                                Type: "img", Class: "rv-circle SoftBorder", Tooltip: fullname,
                                Style: "width:" + imgSize + "rem; height:" + imgSize + "rem; border-color:white; border-width:2px;",
                                Attributes: [{ Name: "src", Value: u.ImageURL || u.ProfileImageURL }],
                                Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); that.show_members(item, isArchive); } }]
                            }),
                            (!u.Type ? null : {
                                Type: "div", Class: "rv-circle rv-bg-color-white-softer rv-icon-button SoftBorder", Tooltip: RVDic.Add,
                                Style: "width:" + imgSize + "rem; height:" + imgSize + "rem; border-width:2px; font-weight:bold;" +
                                    "display:flex; align-items:center; justify-content:center; border-color:rgb(200,200,200);",
                                Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); that.invite(item); } }],
                                Childs: [{Type: "i", Class: "fa fa-plus"}]
                            })
                        ]
                    }]
                }], elems["members"]);
            });
            
            if (item.UsersCount - showedUsersCount) {
                elems["otherMembers"].style.display = "flex";

                var facesTitle = RVDic.AndNOthers.replace("[n]", item.UsersCount - showedUsersCount);

                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "rv-link SoftTextShadow", Style: "font-size:0.7rem;",
                    Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); that.show_members(item, isArchive);  } }],
                    Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: facesTitle }] }]
                }], elems["otherMembers"]);
            }
            //end of Faces

            jQuery(elems["container"]).animate({ opacity: 1 }, 500);

            if (elems["selectButton"]) elems["selectButton"].onclick = function () {
                if (that.__SelectProcessing || editableTitle.is_edit_mode()) return;
                that.__SelectProcessing = true;

                RVAPI.SelectApplication({
                    ApplicationID: item.ApplicationID, ParseResults: true,
                    ResponseHandler: function (result) {
                        that.__SelectProcessing = false;
                        if (result.Succeed) window.location.href = RVAPI.HomePageURL();
                    }
                });
            };

            if (elems["remove"]) elems["remove"].onclick = function (e) {
                e.stopPropagation();

                that[isArchive ? "recycle" : "remove"](item, function () {
                    if (item.ApplicationID == (window.RVGlobal || {}).ApplicationID) window.location.href = window.location.href;

                    jQuery(elems["container"]).fadeOut(500, function () {
                        jQuery(elems["container"]).remove();

                        if (!GlobalUtilities.trim(container.innerHTML || " "))
                            that.nothing_to_display(container);
                    });
                });
            };

            if (elems["quit"]) elems["quit"].onclick = function (e) {
                e.stopPropagation();

                that.quit(item, function () {
                    jQuery(elems["container"]).fadeOut(500, function () { jQuery(elems["container"]).remove(); });
                });
            };

            if (elems["invite"]) elems["invite"].onclick = function () { that.invite(item); };

            //Set Icon
            new IconSelect(elems["iconArea"], {
                ObjectID: item.ApplicationID, Editable: item.Removable && !isArchive,
                IconURL: item.IconURL, HighQualityIconURL: item.HighQualityIconURL, Circular: true,
                IconType: "ApplicationIcon", HighQualityIconType: "HighQualityApplicationIcon", DimensionsVariableName: "IconDimensions",
                ImageWidth: 60, ImageHeight: 60, SaveWidth: 100, SaveHeight: 100, AspectRatio: 1,
                ImageClass: "SoftBorder", ImageStyle: "border-width:2px; border-color:white; background-color:white;"
            });
            //end of Set Icon
        },

        remove: function (item, done) {
            var that = this;

            if (that.Removing) return;
            that.Removing = true;

            var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + Base64.decode(item.Title) + "'");

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return (that.Removing = false);

                RVAPI.RemoveApplication({
                    ApplicationID: item.ApplicationID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) done();

                        that.Removing = false;
                    }
                });
            });
        },

        recycle: function (item, done) {
            var that = this;

            if (that.Recycling) return;
            that.Recycling = true;

            var msg = RVDic.Confirms.DoYouWantToRecycleTheN.replace("[n]", "'" + Base64.decode(item.Title) + "'");

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return (that.Recycling = false);

                RVAPI.RecycleApplication({
                    ApplicationID: item.ApplicationID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) done();

                        that.Recycling = false;
                    }
                });
            });
        },

        quit: function (item, done) {
            var that = this;

            if (that.Leaving) return;
            that.Leaving = true;

            var msg = RVDic.Confirms.DoYouWantToLeaveN.replace("[n]", "'" + Base64.decode(item.Title) + "'");

            GlobalUtilities.confirm(msg, function (r) {
                if (!r) return (that.Leaving = false);

                RVAPI.UnsubscribeFromApplication({
                    ApplicationID: item.ApplicationID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) done();

                        that.Leaving = false;
                    }
                });
            });
        },

        invite: function (item) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-9 medium-7 large-5 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container"
            }]);

            GlobalUtilities.loading(elems["container"]);
            GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["USR/Invitation.js"], {
                OnLoad: function () {
                    new Invitation(elems["container"], {
                        Application: item,
                        UserID: ((window.RVGlobal || {}).CurrentUser || {}).UserID
                    });
                }
            });
        },

        show_members: function (item, isArchive) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-9 large-7 rv-border-radius-1 SoftBackgroundColor",
                Style: "position:relative; margin:0 auto; padding:1rem;", Name: "container",
                Childs: [
                    { Type: "div", Style: "position:absolute; top:1rem;" + RV_RevFloat + ":1rem;", Name: "totalCount" },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "font-weight:500; text-align:center; font-size:1.2rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.Members }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:center; padding-bottom:1rem; color:rgb(100,100,100);",
                        Childs: [{ Type: "text", TextValue: Base64.decode(item.Title) }]
                    },
                    {
                        Type: "div", Class: "small-10 medium-8 large-6", Name: "searchContainer",
                        Style: "display:none; margin:0 auto 0.8rem auto;",
                        Childs: [{
                            Type: "input", Class: "rv-input", Name: "searchInput",
                            Style: "width:100%;", InnerTitle: RVDic.SearchText + "..."
                        }]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "items"}
                ]
            }]);

            GlobalUtilities.set_onchangeorenter(elems["searchInput"], function () { if (listViewer) listViewer.reset(); });

            var set_total_count = function (count) {
                elems["totalCount"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div",
                        Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem; font-weight:bold; color:rgb(100,100,100)",
                        Childs: [{ Type: "text", TextValue: RVDic.Count + ":" }]
                    },
                    {
                        Type: "div", Style: "display:inline-block; color:red; font-weight:bold;",
                        Childs: [{ Type: "text", TextValue: count || "0" }]
                    }
                ], elems["totalCount"]);
            };

            GlobalUtilities.loading(elems["items"]);
            GlobalUtilities.show(elems["container"]);

            var count = 10;
            var editable = !!item.Removable && !isArchive;
            
            var listViewer = null;
            
            GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                OnLoad: function () {
                    listViewer = new NewSimpleListViewer(elems["items"], {
                        AutoGrow: false,
                        Options: {
                            Count: count,
                            OnDataRequest: function (options, done, setTotalCount) {
                                var searchText = GlobalUtilities.trim(elems["searchInput"].value);
                                
                                UsersAPI.GetApplicationUsers(GlobalUtilities.extend(options || {}, {
                                    ApplicationID: item.ApplicationID, SearchText: Base64.encode(searchText), ParseResults: true,
                                    ResponseHandler: function (result) {
                                        setTotalCount(result.TotalCount);
                                        set_total_count(result.TotalCount);

                                        done({ Items: result.Users });

                                        jQuery(elems["searchContainer"])[
                                            !searchText && (result.TotalCount <= count) ? "fadeOut" : "fadeIn"](0);
                                    }
                                }));
                            },
                            ItemBuilder: function (container, user, params) {
                                that.create_user(container, user, editable, item, function () {
                                    params.OnAfterRemove();
                                });

                                params.OnAfterAdd();
                            },
                            OnNothingFound: function (itemsArea) {
                                itemsArea.innerHTML = "<div class='small-12 medium-12 large-12' style='text-align:center; color:rgb(100,100,100);" +
                                    "font-weight:bold; font-size:1rem; padding:1rem;'>" + RVDic.NoUserFound + "</div>";
                            }
                        }
                    });
                }
            });
        },

        create_user: function (container, item, editable, application, onRemove) {
            var that = this;

            item = item || {};
            
            if (item.UserID == ((window.RVGlobal || {}).CurrentUser || {}).UserID) editable = false;
            
            var fullname = GlobalUtilities.trim((Base64.decode(item.FirstName) || " ") + " " +
                (Base64.decode(item.LastName) || " ")) || RVDic.Anonymous;
            var isActiveApplication = RVGlobal.ApplicationID == application.ApplicationID;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-6 large-6", Name: "containerDiv", Style: "padding:0.3rem;",
                Childs: [{
                    Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                    Style: "display:flex; flex-flow:row; padding:0.3rem; height:100%;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 0 auto; width:3.5rem;",
                            Childs: [{
                                Type: "img", Class: "rv-border-radius-quarter", Style: "width:3rem; height:3rem;;",
                                Attributes: [{ Name: "src", Value: item.ImageURL || item.ProfileImageURL }]
                            }]
                        },
                        {
                            Type: "div",
                            Style: "flex:1 1 auto; font-size:0.7rem;" + (isActiveApplication ? "cursor:pointer;" : ""),
                            Link: isActiveApplication ? RVAPI.UserPageURL({ UserID: item.UserID }) : null,
                            Childs: [
                                { Type: "text", TextValue: fullname },
                                (!item.UserName ? null : {
                                    Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.3rem; padding:0 0.3rem; font-size:0.6rem;" +
                                        (isActiveApplication ? "" : "cursor:default;"),
                                    Childs: [{ Type: "text", TextValue: Base64.decode(item.UserName) }]
                                })
                            ]
                        },
                        (!editable ? null : {
                            Type: "div", Class: "RevDirection RevTextAlign", Style: "flex:0 0 auto; width:1.5rem;",
                            Childs: [{
                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove, Name: "remove",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }]
                        })
                    ]
                }]
            }], container);

            if (elems["remove"]) elems["remove"].onclick = function () {
                var btn = this;

                if (btn.Removing) return;
                that.Removing = true;

                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + fullname + "'");

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return (that.Removing = false);

                    RVAPI.RemoveUserFromApplication({
                        ApplicationID: application.ApplicationID, UserID: item.UserID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                jQuery(elems["containerDiv"]).fadeOut(500, function () { this.remove(); });
                                onRemove();
                            }

                            that.Removing = false;
                        }
                    });
                });
            };
        }
    };
})();