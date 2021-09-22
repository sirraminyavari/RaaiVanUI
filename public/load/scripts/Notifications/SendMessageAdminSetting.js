(function () {
    if (window.SendMessageAdminSetting) return;

    window.SendMessageAdminSetting = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            MessageTemplates: {},
            USDiv: null,
            LastSelectedAction: null
        };

        var that = this;

        GlobalUtilities.load_files(["API/NotificationsAPI.js", "Public/RVAccordion.js"], {
            OnLoad: function () { that._preinit(params); }
        });
    };

    SendMessageAdminSetting.prototype = {
        _preinit: function (params) {
            var that = this;

            NotificationsAPI.GetNotificationMessageTemplatesInfo({
                ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else {
                        that.Objects.MessageTemplates = result.MessageTemplatesInfo;
                        that.initialize(params);
                    }
                }
            });
        },

        initialize: function (params) {
            var that = this;
            params = params || {};

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "font-weight:bold; margin-bottom:1rem; font-size:1.2rem; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.PRVC.SMSEMailNotifier }]
                },
                /*
                {
                    Type: "div", Class: "small-10 medium-9 large-8 row", Style: "margin:0rem auto;",
                    Childs: [
                        {
                            Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                            Childs: [{Type: "text", TextValue : RVDic.SendTestN.replace("[n]", RVDic.SMS)}]
                        },
                        { Type: "div", Class: "small-2 medium-2 large-2" },
                        {
                            Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                            Childs: [{ Type: "text", TextValue: RVDic.SendTestN.replace("[n]", RVDic.Email) }]
                        }
                    ]
                },
                */
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" }
            ], that.ContainerDiv);

            var acc = new RVAccordion(elems["items"]);

            jQuery.each(that.Objects.MessageTemplates || [], function (ind, template) {
                jQuery.each(template.Actions || [], function (i, action) {
                    var entry = RVDic.NTFN.SubjectType_Action[template.SubjectType + "_" + action.ActionName];
                    if (!entry || (entry.Module && !((window.RVGlobal || {}).Modules || {})[entry.Module])) return;
                    
                    var section = acc.add_item({ Title: entry.Title });
                    that.set_template_actions(section.items_section(), template, action);
                });
            });
        },

        set_template_actions: function (container, template, action) {
            var that = this;
            template = template || {};
            action = action || {};

            var subjectType = template.SubjectType;
            
            var entry = RVDic.NTFN.SubjectType_Action[subjectType + "_" + action.ActionName];

            for (var i = 0; i < (action.Audience || []).length; ++i) {
                if (!(entry.Audience || {})[(action.Audience[i] || {}).Name]) continue;
                that.set_template_audience(container, subjectType, action, action.Audience[i]);
            }
        },

        set_template_audience: function (container, subjectType, action, status) {
            var that = this;
            action = action || {};
            status = status || {};

            var entry = RVDic.NTFN.SubjectType_Action[subjectType + "_" + action.ActionName];

            var create_part = function (name) {
                return {
                    Type: "div", Class: "small-12 medium-6 large-6", Style: "padding:0.5rem; margin-top:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "padding:0.5rem; height:100%;", Name: name,
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow", 
                        }
                    ]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row rv-border-radius-quarter",
                    Style: "margin:0rem; margin-bottom:0.5rem; padding:0.5rem; background-color:white;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-circle SoftBorder WarmBackgroundColor",
                                    Style: "display:inline-block; color:white; padding:0.3rem 2rem;",
                                    Childs: [{ Type: "text", TextValue: entry.Audience[status.Name].Admin }]
                                }
                            ]
                        },
                        create_part("one"),
                        create_part("two")
                    ]
                }
            ], container);

            that.create_media(elems["one"], subjectType, action, status, status.Media[0]);
            that.create_media(elems["two"], subjectType, action, status, status.Media[1]);
        },

        create_media: function (container, subjectType, action, status, media) {
            var that = this;
            actoin = action || {};
            status = status || {};
            media = media || {};
            
            media.MessageSubject = Base64.decode(media.MessageSubject);
            media.MessageText = Base64.decode(media.MessageText);

            var mediaName = (media.Name || "_").toLowerCase();
            var mediaTitle = mediaName == "sms" ? RVDic.SMS : RVDic.Email;
            var isSMS = mediaName == "sms";

            if ((mediaName != "sms") && (mediaName != "email")) return;

            var enable_click = function (obj, contentDiv, e, done) {
                e.preventDefault();
                var _th = this;

                if (_th._Processing) return;
                _th._Processing = true;

                NotificationsAPI.SetAdminMessagingActivation({
                    TemplateID: obj.TemplateID, SubjectType: subjectType, Action: action.ActionName, Media: obj.Name,
                    UserStatus: status.Name, Language: obj.Language, Enable: !_th.Checked, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            done(false);
                        }
                        else {
                            done();
                            obj.Enabled = _th.Checked;
                            obj.TemplateID = result.TemplateID;

                            jQuery(contentDiv)[obj.Enabled ? "fadeIn" : "fadeOut"](500);
                        }

                        _th._Processing = false;
                    }
                });
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        {
                            Type: "checkbox",
                            Style: "width:1rem; height:1rem; cursor:pointer; margin-" + RV_RevFloat + ":0.5rem;",
                            Params: {
                                Checked: !!media.Enabled,
                                OnClick: function (e, done) { enable_click.call(this, media, elems["options"], e, done); }
                            }
                        },
                        { Type: "text", TextValue: mediaTitle }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "options",
                    Style: "margin-top:0.5rem;" + (media.Enabled ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_Float + ":1.5rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button",
                                            Tooltip: RVDic.Edit, Name: "editButton",
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12", Name: "title",
                                            Style: (isSMS ? "display:none;" : "")
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "body" }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12", Style: (isSMS ? "display:none;" : ""),
                                            Childs: [
                                                {
                                                    Type: "input", Class: "rv-input", Name: "titleInput", InnerTitle: RVDic.Title,
                                                    Style: "width:100%; font-size:0.7rem; margin-bottom:0.5rem;"
                                                }
                                            ]
                                        },
                                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyInput" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);
            
            var bodyInput = new AdvancedTextArea({ ContainerDiv: elems["bodyInput"], DefaultText: RVDic.MessageText });

            var editButton = elems["editButton"];

            var _set_data = function () {
                GlobalUtilities.set_text(elems["title"], RVDic.Title + ": " + (!media.MessageSubject ? RVDic.NotSet :
                    GlobalUtilities.convert_numbers_to_persian(media.MessageSubject)));

                GlobalUtilities.append_markup_text(elems["body"], RVDic.MessageText + ": " + (media.MessageText || RVDic.NotSet));

                elems["titleInput"].value = media.MessageSubject;
                bodyInput.set_data(media.MessageText);
            };

            var _on_edit = function () {
                var set_things = function () {
                    elems["viewArea"].style.display = editButton.__Editing ? "none" : "block";
                    elems["editArea"].style.display = editButton.__Editing ? "block" : "none";

                    _set_data();

                    editButton.setAttribute("class",
                        "fa " + (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-lg rv-icon-button");
                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    GlobalUtilities.block(elems["container"]);

                    var newTitle = GlobalUtilities.trim(elems["titleInput"].value);
                    var newBody = GlobalUtilities.trim(bodyInput.get_data());

                    NotificationsAPI.SetNotificationMessageTemplateText({
                        TemplateID: media.TemplateID, Subject: Base64.encode(newTitle), Text: Base64.encode(newBody), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                media.MessageSubject = newTitle;
                                media.MessageText = newBody;
                                
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
            if (!media.MessageSubject || !media.MessageText) _on_edit();
            _set_data();
        }
    }
})();