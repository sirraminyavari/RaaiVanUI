(function () {
    if (window.ChangePasswordDialog) return;

    window.ChangePasswordDialog = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Options = {
            OnPasswordChange: params.OnPasswordChange
        };

        var that = this;
        
        GlobalUtilities.load_files(["API/UsersAPI.js", "CaptchaImage.js"], {
            OnLoad: function () { that.preinit(params); }
        });
    };

    ChangePasswordDialog.prototype = {
        preinit: function (params) {
            var that = this;
            
            UsersAPI.GetPasswordPolicy({
                ParseResults: true,
                ResponseHandler: function (result) {
                    result = result || {};
                    
                    var hasPolicy = !!result.MinLength || (result.NewCharacters && (result.NewCharacters > 1)) ||
                        result.UpperLower || result.NonAlphabetic || result.Number || result.NonAlphaNumeric;

                    that.initialize(GlobalUtilities.extend(params || {}, { HasPolicy: hasPolicy, Policy: result }));
                }
            });
        },

        initialize: function (settings) {
            var that = this;
            settings = settings || {};

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Style: "margin:0rem;",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-title",
                        Childs: [{ Type: "text", TextValue: RVDic.ChangePassword }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Childs: [
                            { Name: "curPassInput", Title: RVDic.CurrentPassword },
                            { Name: "newPassInput", Title: RVDic.NewPassword },
                            { Name: "repNewPassInput", Title: RVDic.RepeatNewPassword }
                        ].map(itm => {
                            return {
                                Type: "div", Class: "small-12 medium-12 large-12 row",
                                Style: "margin:0rem; margin-bottom:0.5rem;",
                                Childs: [
                                    {
                                        Type: "div", Class: "small-6 medium-4 large-3", Style: "font-weight:bold;",
                                        Childs: [{ Type: "text", TextValue: itm.Title + ":" }]
                                    },
                                    {
                                        Type: "div", Class: "small-6 medium-8 large-9",
                                        Childs: [{
                                            Type: "input", Class: "rv-input", Name: itm.Name, Style: "width:100%;",
                                            Attributes: [
                                                { Name: "type", Value: "password" },
                                                { Name: "autocomplete", Value: "off" }
                                            ]
                                        }]
                                    }
                                ]
                            };
                        })
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "captcha", Style: "margin-top:1rem;" },
                    {
                        Type: "div", Class: "small-8 medium-6 large-4 rv-air-button rv-circle",
                        Style: "margin:1rem auto 0.6rem auto;",
                        Properties: [
                            {
                                Name: "onclick",
                                Value: function () {
                                    var btn = this;

                                    if (btn.Processing) return;
                                    var curPass = elems["curPassInput"].value;
                                    var newPass = elems["newPassInput"].value;
                                    var repNewPass = elems["repNewPassInput"].value;

                                    if (!curPass) return alert(RVDic.PleaseEnterYourCurrentPassword, { Timeout: 20000 });
                                    else if (!policyChecker.check(elems["newPassInput"].value, elems["curPassInput"].value))
                                        return alert(RVDic.MSG.PasswordPolicyDidntMeet, { Timeout: 20000 });
                                    else if (newPass != repNewPass) return alert(RVDic.Checks.PasswordsDoesntMatch, { Timeout: 20000 });

                                    btn.Processing = true;

                                    UsersAPI.ChangePassword({
                                        CurrentPassword: Base64.encode(curPass),
                                        NewPassword: Base64.encode(newPass),
                                        Captcha: captchaObj ? captchaObj.get() : null,
                                        ParseResults: true,
                                        ResponseHandler: function (results) {
                                            btn.Processing = false;
                                            var msg = results.ErrorText || results.Succeed;

                                            if (results.Succeed) {
                                                if (GlobalUtilities.get_type(that.Options.OnPasswordChange) == "function")
                                                    that.Options.OnPasswordChange();
                                            }

                                            if (!results.ResetSession)
                                                alert(RVDic.MSG[msg] || msg, { Timeout: results.ErrorText ? 20000 : null });
                                        }
                                    });
                                }
                            }
                        ],
                        Childs: [{ Type: "text", TextValue: RVDic.Save }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "reason",
                        Style: "text-align:center; font-weight:bold; margin:2rem 0 1rem 0; display:none;"
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "policyArea", Style: "margin-top:1rem;" }
                ]
            }], that.Container);

            var captchaObj = new CaptchaImage(elems["captcha"]);

            var policyChecker = settings.HasPolicy ? that.password_policy_checker(elems["policyArea"], settings.Policy) : null;

            if (settings.PasswordChangeReason) {
                jQuery(elems["reason"]).fadeIn(0);

                elems["reason"].innerHTML =
                    settings.PasswordChangeReason == "FirstPassword" ? RVDic.MSG.YouHaveToChangeYourFirstPassword :
                        (settings.PasswordChangeReason == "PasswordExpired" ? RVDic.MSG.YouHaveToChangeYourExpiredPassword :
                            RVDic.MSG.YouHaveToChangeYourPassword);
            }

            var check_repeat = function () {
                var pass = elems["newPassInput"].value, passRepeat = elems["repNewPassInput"].value;
                elems["repNewPassInput"].style.backgroundColor = !passRepeat ? "white" :
                    (passRepeat == pass ? "rgba(160, 251, 160, 0.47)" : "#FCDDFB");
            };

            var check_pass = function () {
                var pass = elems["newPassInput"].value;
                var result = !(policyChecker || {}).check ? true : policyChecker.check(pass, elems["curPassInput"].value);
                elems["newPassInput"].style.backgroundColor = !pass ? "white" :
                    (result ? "rgba(160, 251, 160, 0.47)" : "#FCDDFB");
                check_repeat();
            };

            jQuery(elems["curPassInput"]).keyup(check_pass);
            jQuery(elems["newPassInput"]).keyup(check_pass);
            jQuery(elems["repNewPassInput"]).keyup(check_repeat);
        },

        password_policy_checker: function (container, settings, isFirstPassword) {
            var that = this;
            settings = settings || {};
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12",
                Name: "pwdPolicy", Style: "margin-bottom:0.25rem;",
                Childs: [{ Type: "text", TextValue: RVDic.PasswordPolicyIsAsFollows + ":" }]
            }].concat([
                (!settings.MinLength ? null : {
                    Name: "pwdMinLength",
                    Title: RVDic.PasswordPolicyMinLength.replace("[n]", settings.MinLength || "0")
                }),
                (isFirstPassword || !settings.NewCharacters || (settings.NewCharacters < 2) ? null : {
                    Name: "pwdNewCharacters",
                    Title: RVDic.PasswordPolicyNewCharacters.replace("[n]", settings.NewCharacters || "0")
                }),
                (!settings.UpperLower ? null : { Name: "pwdUpperLower", Title: RVDic.PasswordPolicyUpperLower }),
                (!settings.NonAlphabetic ? null : { Name: "pwdNonAlphabetic", Title: RVDic.PasswordPolicyNonAlphabetic }),
                (!settings.Number ? null : { Name: "pwdNumber", Title: RVDic.PasswordPolicyNumber }),
                (!settings.NonAlphaNumeric ? null : { Name: "pwdNonAlphaNumeric", Title: RVDic.PasswordPolicyNonAlphaNumeric })
            ].filter(x => !!x).map(lbl => {
                return {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: lbl.Name, Style: "color:#f00;",
                    Childs: [{ Type: "text", TextValue: "- " + lbl.Title }]
                };
            })), container);

            return {
                check: function (pass, oldPass) {
                    pass = String(pass);

                    var result = {
                        MinLength: pass && (!settings.MinLength || (pass.length >= settings.MinLength)),
                        NewCharacters: isFirstPassword || !oldPass || (pass && settings.NewCharacters &&
                            (GlobalUtilities.diff(pass, oldPass).length >= settings.NewCharacters)),
                        UpperLower: pass && (!settings.UpperLower || (/[a-z]/g.test(pass) && /[A-Z]/g.test(pass))),
                        NonAlphabetic: pass && (!settings.NonAlphabetic || !/^[a-zA-Z]+$/g.test(pass)),
                        Number: pass && (!settings.Number || /[0-9]/g.test(pass)),
                        NonAlphaNumeric: pass && (!settings.NonAlphaNumeric || !/^[a-zA-Z0-9]+$/g.test(pass))
                    };
                    
                    if (elems["pwdMinLength"]) jQuery(elems["pwdMinLength"]).css({ color: result.MinLength ? "rgb(22,188,31)" : "#f00" });
                    if (elems["pwdNewCharacters"]) jQuery(elems["pwdNewCharacters"]).css({ color: result.NewCharacters ? "rgb(22,188,31)" : "#f00" });
                    if (elems["pwdUpperLower"]) jQuery(elems["pwdUpperLower"]).css({ color: result.UpperLower ? "rgb(22,188,31)" : "#f00" });
                    if (elems["pwdNonAlphabetic"]) jQuery(elems["pwdNonAlphabetic"]).css({ color: result.NonAlphabetic ? "rgb(22,188,31)" : "#f00" });
                    if (elems["pwdNumber"]) jQuery(elems["pwdNumber"]).css({ color: result.Number ? "rgb(22,188,31)" : "#f00" });
                    if (elems["pwdNonAlphaNumeric"]) jQuery(elems["pwdNonAlphaNumeric"]).css({ color: result.NonAlphaNumeric ? "rgb(22,188,31)" : "#f00" });

                    for (var k in result)
                        if (!result[k]) return false;

                    return true;
                }
            };
        },
    };
})();