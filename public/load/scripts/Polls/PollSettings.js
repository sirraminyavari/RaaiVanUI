(function () {
    if (window.PollSettings) return;

    window.PollSettings = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            Poll: params.Poll || {}
        };

        this.Options = {
            OnInit: params.OnInit
        };

        this.initialize();
    };

    PollSettings.prototype = {
        initialize: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; font-size:1.5rem; text-align:center;",
                            Childs: [{Type: "text", TextValue: that.Objects.Poll.Name}]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;", Name: "description" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "form",
                            Style: "margin-top:1rem; display:none;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-top:1rem; display:none;", Name: "audienceTitle",
                            Childs: [{Type: "text", TextValue: RVDic.Audiences + ":"}]
                        },
                        {
                            Type: "div", Style: "margin-top:0.5rem; padding:0.5rem; display:none;", Name: "audience",
                            Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBackgroundColor"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-6",
                            Style: "margin-top:1rem; display:none;", Name: "beginDate"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-6",
                            Style: "margin-top:1rem; display:none;", Name: "finishDate"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;", Name: "showSummary" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;", Name: "hideContributors" },
                        {
                            Type: "div", Name: "pollsAreaTitle",
                            Class: "small-12 medium-12 large-12 row rv-border-radius-half SoftBorder WarmBackgroundColor",
                            Style: "margin:0rem; margin-top:1rem; padding:0.5rem 1rem;" + 
                                (that.Objects.Poll.IsCopyOfPollID ? "display:none;": ""), 
                            Childs: [
                                {
                                    Type: "div", Class: "small-6 medium-6 large-6",
                                    Style: "height:100%; color:white; font-weight:bold;",
                                    Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RVDic.Versions }] }]
                                },
                                {
                                    Type: "div", Class: "small-6 medium-6 large-6 RevDirection RevTextAlign",
                                    Childs: [
                                        {
                                            Type: "div", Class: "rv-circle Direction TextAlign",
                                            Style: "display:inline-block; padding:0.2rem; background-color:white;",
                                            Childs: [
                                                {
                                                    Type: "div", Class: "rv-air-button rv-circle",
                                                    Style: "display:inline-block; padding:0.2rem 1rem;", Name: "newPoll",
                                                    Childs: [
                                                        {
                                                            Type: "i", Class: "fa fa-plus",
                                                            Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                                        },
                                                        { Type: "text", TextValue: RVDic.NewRun }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "polls",
                            Style: "margin-top:1rem;" + (that.Objects.Poll.IsCopyOfPollID ? "display:none;" : "")
                        }
                    ]
                }
            ], that.Container);

            that.set_description(elems["description"]);

            if (!that.Objects.Poll.IsCopyOfPollID) {
                jQuery(elems["form"]).fadeIn(0);

                GlobalUtilities.load_files(["FormsManager/FormOwner.js"], {
                    OnLoad: function () {
                        new FormOwner(elems["form"], {
                            OwnerID: that.Objects.Poll.PollID,
                            TitleWidth: 3,
                            DisableElementLimits: true
                        });
                    }
                });
            }

            if (that.Objects.Poll.IsCopyOfPollID) {
                jQuery(elems["audienceTitle"]).fadeIn(0);
                jQuery(elems["audience"]).fadeIn(0);
                jQuery(elems["beginDate"]).fadeIn(0);
                jQuery(elems["finishDate"]).fadeIn(0);

                GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                    OnLoad: function () {
                        var pv = new PermissionSetting(elems["audience"], {
                            ObjectID: that.Objects.Poll.PollID,
                            Options: { ConfidentialitySelect: false, PermissionTypes: ["View"], ObjectType: "Poll" }
                        });
                    }
                });

                that.set_date(elems["beginDate"], {
                    APIFunction: "SetPollBeginDate",
                    Title: RVDic.StartDate,
                    Value: that.Objects.Poll.BeginDate
                });

                that.set_date(elems["finishDate"], {
                    APIFunction: "SetPollFinishDate",
                    Title: RVDic.EndDate,
                    Value: that.Objects.Poll.FinishDate
                });
            }

            that.add_check_box(elems["showSummary"], {
                APIFunction: "SetPollShowSummary",
                Title: RVDic.FG.Poll.ShowSummary,
                Value: that.Objects.Poll.ShowSummary
            });

            that.add_check_box(elems["hideContributors"], {
                APIFunction: "SetPollHideContributors",
                Title: RVDic.FG.Poll.HideContributors,
                Value: that.Objects.Poll.HideContributors
            });

            if (!that.Objects.Poll.IsCopyOfPollID) {
                elems["pollsAreaTitle"].style.display = "flex";
                elems["polls"].style.display = "flex";

                var slv = null;

                GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                    OnLoad: function () {
                        GlobalUtilities.load_files(["SimpleListViewer/NewSimpleListViewer.js"], {
                            OnLoad: function () {
                                slv = new NewSimpleListViewer(elems["polls"], {
                                    Options: {
                                        Count: 10,
                                        OnDataRequest: function (options, done) {
                                            FGAPI.GetPolls(GlobalUtilities.extend(options || {}, {
                                                IsCopyOfPollID: that.Objects.Poll.PollID, ParseResults: true,
                                                ResponseHandler: function (result) { done(result.Polls || []); }
                                            }));
                                        },
                                        ItemBuilder: function (container, item, params) {
                                            var _div = GlobalUtilities.create_nested_elements([
                                                {
                                                    Type: "div", Name: "_div",
                                                    Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder SoftShadow", 
                                                    Style: "padding:1rem; margin-bottom:1rem; overflow:hidden;" +
                                                        (item.Add2Top ? "display:none;" : "")
                                                }
                                            ])["_div"];

                                            if (item.Add2Top) container.insertBefore(_div, container.firstChild);
                                            else container.appendChild(_div);

                                            new PollSettings(_div, {
                                                Poll: item,
                                                OnInit: !item.Add2Top ? null : function () {
                                                    jQuery(_div).fadeIn(500, function () { GlobalUtilities.scroll_into_view(_div); });
                                                }
                                            });

                                            params.OnAfterAdd();
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                var creatingNewPoll = false;

                elems["newPoll"].onclick = function () {
                    if (creatingNewPoll) return;
                    creatingNewPoll = true;

                    FGAPI.AddPoll({
                        CopyFromPollID: that.Objects.Poll.PollID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed && result.Poll && slv)
                                slv.add_item(GlobalUtilities.extend(result.Poll, { Add2Top: true }));

                            creatingNewPoll = false;
                        }
                    });
                };
            }

            if (that.Options.OnInit) that.Options.OnInit();
        },

        set_description: function (container) {
            var that = this;

            var description = Base64.decode(that.Objects.Poll.Description);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "position:relative; min-height:2.5rem; padding-" + RV_Float + ":2.5rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:justify;", Name: "descValue"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:none;", Name: "descInput"
                        }
                    ]
                }
            ], container);

            var descValue = elems["descValue"];
            var editButton = elems["editButton"];
            var descInput = null;

            var _set_desc = function () {
                var desc = GlobalUtilities.get_text_begining(description, 3000, "", { RichText: false });

                descValue.innerHTML = "";

                if (desc) GlobalUtilities.append_markup_text(descValue, desc);
                else descValue.innerHTML = "<span style='color:gray; font-weight:bold;'>" + RVDic.NotSet + "</span>";

                if (descInput) descInput.set_data(description);
            }

            var _on_edit = function () {
                var set_things = function () {
                    elems["descInput"].style.display = editButton.__Editing ? "block" : "none";
                    descValue.style.display = editButton.__Editing ? "none" : "block";

                    if (editButton.__Editing && !descInput) {
                        descInput = new AdvancedTextArea({
                            ContainerDiv: elems["descInput"], DefaultText: RVDic.Description,
                            QueryTemplate: "RelatedThings",
                            ItemTemplate: {
                                ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL"
                            }
                        });
                    }

                    _set_desc();

                    editButton.setAttribute("class",
                        "fa fa-" + (editButton.__Editing ? "save" : "pencil") + " fa-2x rv-icon-button");
                };

                if (editButton.__Editing === true) {
                    var newDescription = GlobalUtilities.trim(descInput.get_data());

                    GlobalUtilities.block(elems["container"]);

                    FGAPI.SetPollDescription({
                        PollID: that.Objects.Poll.PollID, Description: Base64.encode(newDescription), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                description = newDescription;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(elems["container"]);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;
            if (!description) _on_edit();
            _set_desc();
        },

        set_date: function (container, params) {
            var that = this;
            params = params || {};
            
            var apiFunction = params.APIFunction;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "display:inline-block;",
                    Childs: [{ Type: "text", TextValue: params.Title + ":" }]
                },
                { Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;", Name: "date" },
                {
                    Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "remove",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                }
            ], container);

            var cal = null;

            GlobalUtilities.append_calendar(elems["date"], {
                OnSelect: function () {
                    FGAPI[apiFunction]({
                        PollID: that.Objects.Poll.PollID, Value: cal.Get().Value, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                cal.Clear();
                            }
                        }
                    });
                }
            }, function (c) {
                cal = c;
                cal.Set({ Label: params.Value });
            });

            var removing = false;

            elems["remove"].onclick = function () {
                if (removing) return;
                removing = true;

                FGAPI[apiFunction]({
                    PollID: that.Objects.Poll.PollID, Value: "", ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Succeed) cal.Clear();
                        else alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        removing = false;
                    }
                });
            };
        },

        add_check_box: function (container, params) {
            var that = this;
            params = params || {};

            var apiFunction = params.APIFunction;
            var value = params.Value === true;
            var title = params.Title;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "position:relative; padding-" + RV_Float + ":2.5rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0rem; bottom:0rem; " + RV_Float + ":0rem; width:2.5rem;",
                            Childs: [
                                {
                                    Type: "checkbox",
                                    Params: {
                                        Checked: value,
                                        OnClick: function (e, done) {
                                            e.preventDefault();

                                            FGAPI[apiFunction]({
                                                PollID: that.Objects.Poll.PollID, Value: !this.Checked,
                                                ParseResults: true,
                                                ResponseHandler: function (result) { done(!result.ErrorText); }
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [{ Type: "text", TextValue: title }]
                        }
                    ]
                }
            ], container);
        }
    };
})();