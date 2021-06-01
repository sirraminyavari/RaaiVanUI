(function () {
    if (window.UserSignUp) return;

    window.UserSignUp = function () {
        var that = this;

        this.Objects = {
            ReCaptcha: null
        };

        GlobalUtilities.load_files(["API/UsersAPI.js", "API/CNAPI.js", "USR/ChangePasswordDialog.js"], {
            OnLoad: function () {
                UsersAPI.GetPasswordPolicy({
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        GlobalUtilities.init_recaptcha(function (obj) {
                            that.Objects.ReCaptcha = obj;
                            that.initialize(result);
                        });
                    }
                });
            }
        });
    }

    UserSignUp.prototype = {
        initialize: function (passwordPolicy) {
            var that = this;

            var confirmationToken = null;
            var confirmationCodeLength = null;
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "container", Style: "margin:0 auto; padding:1rem",
                Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "font-weight:500; margin-bottom:0.5rem; text-align:center; font-size:1.2rem;",
                        Childs: [{Type: "text", TextValue: RVDic.SignUp}]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "dataSection",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0;",
                                Childs: [
                                    { Name: "firstNameInput", Placeholder: RVDic.FirstName, AutoDir: true },
                                    { Name: "lastNameInput", Placeholder: RVDic.LastName, AutoDir: true },
                                    { Name: "emailInput", Placeholder: RVDic.Email, Style: "direction:ltr; text-align:left;" },
                                    { Name: "passwordInput", Placeholder: RVDic.Password, Type: "password", Style: "direction:ltr; text-align:left;" }
                                ].map((itm, ind) => {
                                    var isRev = (ind % 2) == 1;

                                    return {
                                        Type: "div", Class: "small-6 medium-6 large-6",
                                        Style: "margin-top:0.5rem; padding-" + (isRev ? RV_Float : RV_RevFloat) + ":0.5rem;",
                                        Childs: [{
                                            Type: "input", Class: "rv-input", InnerTitle: itm.Placeholder, Name: itm.Name,
                                            Style: "width:100%;" + (itm.Style || " "),
                                            Attributes: [{ Name: "type", Value: itm.Type || "text" }],
                                            Properties: !itm.AutoDir ? null : [{
                                                Name: "onkeyup",
                                                Value: function () { this.style.direction = (GlobalUtilities.textdirection(this.value) || ''); }
                                            }]
                                        }]
                                    };
                                })
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 row", Name: "policyContainer",
                                Style: "margin:0.5rem 0 0 0; display:none;",
                                Childs: [
                                    { Type: "div", Class: "small-6 medium-6 large-6" },
                                    { Type: "div", Class: "small-6 medium-6 large-6", Name: "passPolicy", Style: "padding-" + RV_Float + ":0.5rem;" },
                                ]
                            },
                            {
                                Type: "div", Class: "small-10 medium-6 large-4 ActionButton", Name: "signUpButton",
                                Style: "margin:1.5rem auto 0rem auto;",
                                Childs: [{ Type: "text", TextValue: RVDic.GetConfirmationCode }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "codeSection", Style: "display:none;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "margin-top:0.5rem; text-align:center;",
                                Childs: [{
                                    Type: "number", Class: "rv-input rv-placeholder-align-center", Name: "verificationCode",
                                    Style: "width:50%; text-align:center;", InnerTitle: RVDic.ConfirmationCode
                                }]
                            },
                            {
                                Type: "div", Class: "small-10 medium-6 large-4 ActionButton", Name: "confirmButton",
                                Style: "margin:1.5rem auto 0rem auto;",
                                Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                            }
                        ]
                    }
                ]
            }]);

            var showedDiv = GlobalUtilities.show(elems["container"]);

            jQuery(elems["emailInput"]).keyup(function () {
                var val = elems["emailInput"].value;
                var isValid = GlobalUtilities.is_valid_email(val);

                elems["emailInput"].classList[isValid ? "remove" : "add"]("rv-input-invalid");
            });

            var policyChecker = (new ChangePasswordDialog()).password_policy_checker(elems["passPolicy"], passwordPolicy, true);
            
            jQuery(elems["passwordInput"]).focus(function () {
                if (elems["policyContainer"].style.display == "none")
                    jQuery(elems["policyContainer"]).animate({ 'height': 'toggle' }, 500);
            });

            jQuery(elems["passwordInput"]).focusout(function () {
                if (elems["policyContainer"].style.display != "none")
                    jQuery(elems["policyContainer"]).animate({ 'height': 'toggle' }, 500);
            });

            jQuery(elems["passwordInput"]).keyup(function () {
                var val = elems["passwordInput"].value;
                var isValid = policyChecker.check(val);

                elems["passwordInput"].classList[isValid ? "remove" : "add"]("rv-input-invalid");
            });

            var _processing = false;

            elems["signUpButton"].onclick = function () {
                if (_processing) return;

                var firstname = GlobalUtilities.trim(elems["firstNameInput"].value);
                var lastname = GlobalUtilities.trim(elems["lastNameInput"].value);
                var password = elems["passwordInput"].value;
                var email = elems["emailInput"].value;

                if (!firstname) return alert(RVDic.Checks.PleaseEnterYourFirstName);
                else if (!lastname) return alert(RVDic.Checks.PleaseEnterYourLastName);
                else if (!email || !GlobalUtilities.is_valid_email(email)) return alert(RVDic.Checks.EmailIsNotValid);
                else if (!password || !policyChecker.check(password)) return alert(RVDic.Checks.PleaseEnterYourPassword);

                GlobalUtilities.block(elems["signUpButton"]);
                _processing = true;

                var _do_get_token = function (captchaToken) {
                    var reqParams = GlobalUtilities.request_params();
                    
                    UsersAPI.CreateUserToken({
                        FirstName: Base64.encode(firstname),
                        LastName: Base64.encode(lastname),
                        Contact: email,
                        Password: Base64.encode(password),
                        Captcha: captchaToken,
                        InvitationID: reqParams.get_value("inv"),
                        ParseResults: true,
                        ResponseHandler: function (results) {
                            if (results.ErrorText) alert(RVDic.MSG[results.ErrorText] || results.ErrorText, { Timeout: 20000 });
                            else if (results.VerificationCode) {
                                confirmationToken = results.VerificationCode.Token;
                                confirmationCodeLength = results.VerificationCode.Length;

                                jQuery(elems["dataSection"]).fadeOut(200, function () { jQuery(elems["codeSection"]).fadeIn(500); });
                            }

                            GlobalUtilities.unblock(elems["signUpButton"]);
                            _processing = false;
                        }
                    });
                };

                if (!that.Objects.ReCaptcha) _do_get_token();
                else that.Objects.ReCaptcha.getToken(token => _do_get_token(token));
            };

            elems["confirmButton"].onclick = function () {
                if (_processing) return;

                var code = elems["verificationCode"].value;

                if (!code || (code.length != confirmationCodeLength)) return;

                _processing = true;

                UsersAPI.ValidateUserCreation({
                    VerificationToken: confirmationToken, Code: code, Login: true, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.AuthCookie) {
                            GlobalUtilities.logged_in(result);
                            window.location.href = window.location.href;
                        }
                    }
                });
            };
        }
    }
})();