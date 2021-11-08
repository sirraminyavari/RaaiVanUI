(function () {
    if (window.SystemSettings) return;

    window.SystemSettings = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            Accordion: null,
            Modules: params.Modules || {},
            Settings: null
        };

        this.Options = {
            EnforceSecurity: true
        };

        var that = this;

        GlobalUtilities.load_files(["Public/RVAccordion.js", "FormsManager/FormElementTypes.js"], {
            OnLoad: function () { that.preinit(); }
        });
    };

    SystemSettings.prototype = {
        preinit: function () {
            var that = this;

            that.Container.innerHTML = "";

            that.Container = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:flex; flex-flow:row; align-items:center; font-weight:bold; margin-bottom:1.5rem;" +
                        "font-size:1.2rem; color:rgb(100,100,100);",
                    Childs: [
                        { Type: "text", TextValue: RVDic.SystemSettings },
                        { Type: "help", Style: "margin-" + RV_Float + ":0.5rem;", Params: { Name: "systemsettings_settings" } }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
            ], that.Container)["_div"];

            GlobalUtilities.loading(that.Container);

            RVAPI.GetSystemSettingsValues({
                ParseResults: true,
                ResponseHandler: function (dic) {
                    for (var n in (dic || {}))
                        dic[n] = Base64.decode(dic[n]);

                    that.Objects.Settings = dic || {};

                    that.initialize();
                }
            });
        },

        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var acc = that.Objects.Accordion = new RVAccordion(that.Container);

            var _create_title = function (name, title, options) {
                options = options || {};

                var elems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                        Style: "font-weight:bold; font-size:1rem;",
                        Childs: [
                            { Type: "text", TextValue: title },
                            {
                                Type: "div", Name: "editButton",
                                Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                Style: "display:inline-block; font-size:0.7rem; margin-" + RV_Float + ":0.5rem;",
                                Childs: [
                                    {
                                        Type: "i", Class: "fa fa-pencil fa-lg",
                                        Style: "margin-" + RV_RevFloat + ":0.4rem;"
                                    },
                                    { Type: "text", TextValue: RVDic.Edit }
                                ]
                            }
                        ]
                    }
                ]);

                elems["editButton"].onclick = function (e) {
                    e.stopPropagation();
                    if (options.OnEdit) options.OnEdit.call(this);
                };

                return elems["_div"];
            };

            var genSection = acc.add_item({
                Title: function () {
                    return _create_title("General", RVDic.General, {
                        OnEdit: function () { genSection.OnEdit.call(this); }
                    });
                }
            });

            var displaySection = acc.add_item({
                Title: function () {
                    return _create_title("Display", RVDic.Display, {
                        OnEdit: function () { displaySection.OnEdit.call(this); }
                    });
                }
            });

            var secSection = acc.add_item({
                Title: function () {
                    return _create_title("Security", RVDic.RV.Settings.LoginAndSessionManagement, {
                        OnEdit: function () { secSection.OnEdit.call(this); }
                    });
                }
            });

            var spSection = acc.add_item({ /* sp: Sensitive Pages */
                Title: function () {
                    return _create_title("SensitivePages", RVDic.RV.Settings.ReautheticationForSensitivePages, {
                        OnEdit: function () { spSection.OnEdit.call(this); }
                    });
                }
            });

            var pwdSection = acc.add_item({
                Title: function () {
                    return _create_title("PasswordPolicy", RVDic.PasswordPolicy, {
                        OnEdit: function () { pwdSection.OnEdit.call(this); }
                    });
                }
            });

            var tsaSection = acc.add_item({
                Title: function () {
                    return _create_title("TwoStepAuthentication", RVDic.TwoStepAuthentication, {
                        OnEdit: function () { tsaSection.OnEdit.call(this); }
                    });
                }
            });

            var emailSection = acc.add_item({
                Title: function () {
                    return _create_title("Email", RVDic.Email, {
                        OnEdit: function () { emailSection.OnEdit.call(this); }
                    });
                }
            });

            if (!((window.RVGlobal || {}).Modules || {}).SMSEMailNotifier) emailSection.hide(1);

            var ssoSection = acc.add_item({
                Title: function () {
                    return _create_title("SSO", RVDic.SSO, {
                        OnEdit: function () { ssoSection.OnEdit.call(this); }
                    });
                }
            });

            var sections = [
                genSection, displaySection, secSection, spSection,
                pwdSection, tsaSection, emailSection, ssoSection
            ];

            //General
            that.add_element(genSection.items_section(), {
                Name: "OrganizationName", Title: RVDic.RV.Settings.OrganizationName, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(genSection.items_section(), {
                Name: "SystemName", Title: RVDic.RV.Settings.SystemName, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(genSection.items_section(), {
                Name: "SystemTitle", Title: RVDic.RV.Settings.SystemTitle, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(genSection.items_section(), {
                Name: "HideUserNames", Title: RVDic.RV.Settings.HideUserNames, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });
            //end of General

            //Display
            that.add_element(displaySection.items_section(), {
                Name: "DefaultTheme", Title: RVDic.RV.Settings.DefaultTheme, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(displaySection.items_section(), {
                Name: "BackgroundColor", Title: RVDic.RV.Settings.BackgroundColor, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(displaySection.items_section(), {
                Name: "ColorfulBubbles", Title: RVDic.RV.Settings.ColorfulBubbles, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });
            //end of Display

            //Security
            that.add_element(secSection.items_section(), {
                Name: "UserSignUp", Title: RVDic.RV.Settings.UserSignUp, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(secSection.items_section(), {
                Name: "SignUpViaInvitation", Title: RVDic.RV.Settings.SignUpViaInvitation, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(secSection.items_section(), {
                Name: "AllowNotAuthenticatedUsers", Title: RVDic.RV.Settings.AllowNotAuthenticatedUsers, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(secSection.items_section(), {
                Name: "LoginMessage", Title: RVDic.RV.Settings.LoginMessage, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(secSection.items_section(), {
                Name: "InformLastLogins", Title: RVDic.RV.Settings.InformLastLogins, Type: "Numeric",
                Info: { NaturalNumbersOnly: true, Min: 1 },
                Validator: !that.Options.EnforceSecurity ? null : function (dt) { return !!(dt || {}).FloatValue === true; }
            });

            that.add_element(secSection.items_section(), {
                Name: "AllowedConsecutiveFailedLoginAttempts",
                Title: RVDic.RV.Settings.AllowedConsecutiveFailedLoginAttempts, Type: "Numeric",
                Info: { NaturalNumbersOnly: true, Min: 1 },
                Validator: !that.Options.EnforceSecurity ? null : function (dt) { return !!(dt || {}).FloatValue === true; }
            });

            that.add_element(secSection.items_section(), {
                Name: "LoginLockoutDuration", Title: RVDic.RV.Settings.LoginLockoutDuration, Type: "Text",
                Info: { PatternName: "hhmmss", UseSimpleEditor: true },
                Validator: !that.Options.EnforceSecurity ? null :
                    function (dt) { return !!(dt || {}).TextValue && ((dt || {}).TextValue != "00:00:00"); }
            });

            that.add_element(secSection.items_section(), {
                Name: "PreventConcurrentSessions", Title: RVDic.RV.Settings.PreventConcurrentSessions, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(secSection.items_section(), {
                Name: "AuthCookieLifeTime", Title: RVDic.RV.Settings.AuthCookieLifeTime, Type: "Text",
                Info: { PatternName: "hhmmss", UseSimpleEditor: true },
                Validator: !that.Options.EnforceSecurity ? null :
                    function (dt) { return !!(dt || {}).TextValue && ((dt || {}).TextValue != "00:00:00"); }
            });

            that.add_element(secSection.items_section(), {
                Name: "AuthCookieLifeTimeForAdmin", Title: RVDic.RV.Settings.AuthCookieLifeTimeForAdmin, Type: "Text",
                Info: { PatternName: "hhmmss", UseSimpleEditor: true },
                Validator: !that.Options.EnforceSecurity ? null :
                    function (dt) { return !!(dt || {}).TextValue && ((dt || {}).TextValue != "00:00:00"); }
            });

            that.add_element(secSection.items_section(), {
                Name: "MaxAllowedInactiveTime", Title: RVDic.RV.Settings.MaxAllowedInactiveTime, Type: "Text",
                Info: { PatternName: "hhmmss", UseSimpleEditor: true },
                Validator: !that.Options.EnforceSecurity ? null :
                    function (dt) { return !!(dt || {}).TextValue && ((dt || {}).TextValue != "00:00:00"); }
            });
            //end of Security

            //Sensitive pages
            that.add_element(spSection.items_section(), {
                Name: "ReauthenticationForSettingsAdminPage", Title: RVDic.RV.Settings.ReauthenticationForSettingsAdminPage,
                Type: "Binary", Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(spSection.items_section(), {
                Name: "ReauthenticationForUsersAdminPage", Title: RVDic.RV.Settings.ReauthenticationForUsersAdminPage,
                Type: "Binary", Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });
            //end of Sensitive pages

            //Password policy
            that.add_element(pwdSection.items_section(), {
                Name: "RestrictPasswordsToActiveDirectory", Title: RVDic.RV.Settings.RestrictPasswordsToActiveDirectory,
                Type: "Binary", Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "ForceChangeFirstPassword", Title: RVDic.RV.Settings.ForceChangeFirstPassword, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "PasswordLifeTimeInDays", Title: RVDic.RV.Settings.PasswordLifeTimeInDays, Type: "Numeric",
                Info: { NaturalNumbersOnly: true, Min: 1 },
                Validator: !that.Options.EnforceSecurity ? null : function (dt) { return !!(dt || {}).FloatValue === true; }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "NotAvailablePreviousPasswordsCount", Title: RVDic.RV.Settings.NotAvailablePreviousPasswordsCount,
                Type: "Numeric", Info: { NaturalNumbersOnly: true, Min: 1 }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "PasswordPolicyMinLength", Title: RVDic.RV.Settings.PasswordPolicyMinLength, Type: "Numeric",
                Info: { NaturalNumbersOnly: true, Min: 4 },
                Validator: !that.Options.EnforceSecurity ? null : function (dt) { return !!(dt || {}).FloatValue === true; }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "PasswordPolicyNewCharacters", Title: RVDic.RV.Settings.PasswordPolicyNewCharacters, Type: "Numeric",
                Info: { NaturalNumbersOnly: true, Min: 1 },
                Validator: !that.Options.EnforceSecurity ? null : function (dt) { return !!(dt || {}).FloatValue === true; }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "PasswordPolicyUpperLower", Title: RVDic.RV.Settings.PasswordPolicyUpperLower, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "PasswordPolicyNonAlphabetic", Title: RVDic.RV.Settings.PasswordPolicyNonAlphabetic, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "PasswordPolicyNumber", Title: RVDic.RV.Settings.PasswordPolicyNumber, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(pwdSection.items_section(), {
                Name: "PasswordPolicyNonAlphaNumeric", Title: RVDic.RV.Settings.PasswordPolicyNonAlphaNumeric,
                Type: "Binary", Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });
            //end of Password policy

            //Two step authentication
            that.add_element(tsaSection.items_section(), {
                Name: "EnableTwoStepAuthenticationViaEmail", Title: RVDic.RV.Settings.EnableTwoStepAuthenticationViaEmail,
                Type: "Binary", Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(tsaSection.items_section(), {
                Name: "EnableTwoStepAuthenticationViaSMS", Title: RVDic.RV.Settings.EnableTwoStepAuthenticationViaSMS,
                Type: "Binary", Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(tsaSection.items_section(), {
                Name: "TwoStepAuthenticationTimeoutInSeconds", Title: RVDic.RV.Settings.TwoStepAuthenticationTimeoutInSeconds,
                Type: "Numeric", Info: { NaturalNumbersOnly: true, Min: 0 }
            });
            //end of Two step authentication

            //Email
            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailAddress", Title: RVDic.RV.Settings.SystemEmailAddress, Type: "Text",
                Info: { PatternName: "email", PlaceHolder: "example@site.com", UseSimpleEditor: true }
            });

            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailPassword", Title: RVDic.RV.Settings.SystemEmailPassword, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailDisplayName", Title: RVDic.RV.Settings.SystemEmailDisplayName, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailSubject", Title: RVDic.RV.Settings.SystemEmailSubject, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailSMTPAddress", Title: RVDic.RV.Settings.SystemEmailSMTPAddress, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailSMTPPort", Title: RVDic.RV.Settings.SystemEmailSMTPPort, Type: "Numeric",
                Info: { NaturalNumbersOnly: true, Min: 0 }
            });

            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailUseSSL", Title: RVDic.RV.Settings.SystemEmailUseSSL, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(emailSection.items_section(), {
                Name: "SystemEmailTimeout", Title: RVDic.RV.Settings.SystemEmailTimeout, Type: "Numeric",
                Info: { NaturalNumbersOnly: true, Min: 0, CommaSeparator: true }
            });
            //end of Email

            //SSO
            that.add_element(ssoSection.items_section(), {
                Name: "SSOEnabled", Title: RVDic.RV.Settings.SSOEnabled, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOAutoRedirect", Title: RVDic.RV.Settings.SSOAutoRedirect, Type: "Binary",
                Info: { Yes: Base64.encode(RVDic.Yes), No: Base64.encode(RVDic.No) }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOLoginTitle", Title: RVDic.RV.Settings.SSOLoginTitle, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOTicketVariableName", Title: RVDic.RV.Settings.SSOTicketVariableName, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOLoginURL", Title: RVDic.RV.Settings.SSOLoginURL, Type: "Text",
                Info: { PatternName: "url", UseSimpleEditor: true }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOValidateURL", Title: RVDic.RV.Settings.SSOValidateURL, Type: "Text",
                Info: { PatternName: "url", UseSimpleEditor: true }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOXMLUserNameTag", Title: RVDic.RV.Settings.SSOXMLUserNameTag, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOJSONUserNamePath", Title: RVDic.RV.Settings.SSOJSONUserNamePath, Type: "Text",
                Info: { UseSimpleEditor: true }
            });

            that.add_element(ssoSection.items_section(), {
                Name: "SSOInvalidTicketCode", Title: RVDic.RV.Settings.SSOInvalidTicketCode, Type: "Text",
                Info: { UseSimpleEditor: true }
            });
            //end of SSO

            for (var i = 0; i < sections.length; ++i) that.create_buttons(sections[i]);
        },

        create_buttons: function (section) {
            var that = this;

            var editButton = null;

            section.OnEdit = function () {
                editButton = this;

                section.expand();
                jQuery(editButton).fadeOut(500);

                var elItems = section.items_section().Elements || [];

                for (var i = 0, lnt = elItems.length; i < lnt; ++i)
                    elItems[i].goto_edit_mode();

                jQuery(elems["container"]).fadeIn(500);
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:1rem 0rem 0rem 0rem; display:none;", Name: "container",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-1 large-2" },
                        {
                            Type: "div", Class: "small-5 medium-4 large-3 rv-air-button rv-circle",
                            Style: "font-weight:bold;", Name: "saveButton",
                            Childs: [
                                { Type: "i", Class: "fa fa-floppy-o fa-lg", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                                { Type: "text", TextValue: RVDic.Save }
                            ]
                        },
                        { Type: "div", Class: "small-2 medium-2 large-2" },
                        {
                            Type: "div", Class: "small-5 medium-4 large-3 rv-air-button rv-circle",
                            Style: "font-weight:bold;", Name: "cancelButton",
                            Childs: [
                                { Type: "i", Class: "fa fa-times fa-lg", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                                { Type: "text", TextValue: RVDic.Cancel }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-1 large-2" }
                    ]
                }
            ], section.items_section());

            var processing = false;

            var cancel = function () {
                if (processing) return;
                processing = true;

                if (editButton) jQuery(editButton).fadeIn(500);
                jQuery(elems["container"]).fadeOut(500, function () { processing = false; });

                var elItems = section.items_section().Elements || [];

                for (var i = 0, lnt = elItems.length; i < lnt; ++i) {
                    elItems[i].set_data();
                    elItems[i].goto_view_mode();
                }
            };

            elems["cancelButton"].onclick = function () { cancel(); };

            elems["saveButton"].onclick = function () {
                if (processing) return;

                var elItems = section.items_section().Elements || [];
                var dic = {};

                for (var i = 0, lnt = elItems.length; i < lnt; ++i) {
                    var val = elItems[i].get_value();

                    if (val === false) return;
                    else if (val) dic[elItems[i].Element.Name] = Base64.encode(val);
                    else if (val === null) dic[elItems[i].Element.Name] = "";
                }

                processing = true;

                RVAPI.SaveSystemSettingsValues({
                    Settings: JSON.stringify(dic), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            processing = false;
                        }
                        else if (result.Succeed) {
                            for (var i in dic) that.Objects.Settings[i] = Base64.decode(dic[i]);

                            processing = false;
                            cancel();
                        }
                    }
                });
            };
        },

        add_element: function (container, element) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "padding:0.5rem; margin-bottom:0.5rem;", Name: "elementDiv",
                    Class: "small-12 medium-12 large-12 rv-bg-color-trans-soft rv-border-radius-quarter",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-text-shadow",
                            Style: "margin-bottom:0.5rem; text-align:justify; font-size:1rem;" +
                                "font-weight:bold; color:rgb(100,100,100);",
                            Childs: [{ Type: "text", TextValue: element.Title }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyTextArea" }
                    ]
                }
            ], container);

            container.Elements = container.Elements || [];

            container.Elements.push(that.create_body_text_area(elems["bodyTextArea"], element));
        },

        create_body_text_area: function (_div, element, params) {
            params = params || {};
            var that = this;

            var retJson = {
                Element: element,
                get_value: null,
                get_data: null,
                set_data: null,
                editing_done: null,
                is_edit_mode: null,
                goto_edit_mode: null,
                goto_view_mode: null
            };

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyTextArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea" }
            ], _div);

            var bodyTextArea = elems["bodyTextArea"];
            var editArea = elems["editArea"];

            var fillElement = ((FormElementTypes[element.Type || ""] || {}).fill || function () { })(element) || {};
            if (fillElement.Container) editArea.appendChild(fillElement.Container);

            var viewElement = ((FormElementTypes[element.Type || ""] || {}).dataview || function () { })(element) || {};
            if (viewElement.Container) bodyTextArea.appendChild(viewElement.Container);

            var sync_value = function () {
                var strVal = that.Objects.Settings[element.Name];
                var valDic = {};

                switch (element.Type) {
                    case "Text":
                        valDic.TextValue = strVal;
                        break;
                    case "Binary":
                        if ((strVal.toLowerCase() == "true") || (strVal.toLowerCase() == "false"))
                            valDic.BitValue = strVal.toLowerCase() == "true";
                        else valDic.BitValue = null;
                        break;
                    case "Numeric":
                        if (strVal && !isNaN(+strVal)) valDic.FloatValue = +strVal;
                        else valDic.FloatValue = null;
                        break;
                }

                element = GlobalUtilities.extend(element, valDic);
            };

            retJson.get_value = function () {
                var dt = retJson.get_data();

                if (GlobalUtilities.get_type(dt) != "json") return dt;
                else if (dt.Result === false) {
                    if (dt.Message) alert(dt.Message);
                    return false;
                }

                switch (element.Type) {
                    case "Text":
                        return GlobalUtilities.get_type(dt.TextValue) == "string" ? dt.TextValue : null;
                    case "Binary":
                        return GlobalUtilities.get_type(dt.BitValue) == "boolean" ? String(dt.BitValue) : null;
                    case "Numeric":
                        return GlobalUtilities.get_type(dt.FloatValue) == "number" ? String(dt.FloatValue) : null;
                    default:
                        return null;
                }
            };

            retJson.is_edit_mode = function () {
                return !!bodyTextArea.__IsEditMode;
            };

            retJson.goto_edit_mode = function () {
                bodyTextArea.__IsEditMode = true;
                bodyTextArea.style.display = "none";
                editArea.style.display = "block";

                sync_value();

                if (fillElement.Set) fillElement.Set(element);
                if ((fillElement || {}).Refresh) fillElement.Refresh();
            };

            retJson.goto_view_mode = function () {
                bodyTextArea.__IsEditMode = false;
                bodyTextArea.style.display = "block";
                editArea.style.display = "none";
            };

            retJson.editing_done = function () {
                if (bodyTextArea.__IsEditMode !== true) return;
                var _data = retJson.get_data() || {
                    TextValue: null, GuidValue: null, BitValue: null, DateValue: null, FloatValue: null
                };
                for (var d in _data) element[d] = _data[d];
                retJson.set_data();
                retJson.goto_view_mode();
            };

            retJson.get_data = function () {
                return (bodyTextArea.__IsEditMode !== true) ? null : ((fillElement || {}).Get || function () { })();
            };

            retJson.set_data = function () {
                sync_value();

                if ((fillElement || {}).Set) fillElement.Set(element);
                if ((viewElement || {}).Set) viewElement.Set(element);
            };

            retJson.set_data();

            return retJson;
        }
    };
})();