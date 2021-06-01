(function () {
    if (window.Invitation) return;

    window.Invitation = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        var that = this;

        that.Objects = {
            Application: params.Application
        };

        GlobalUtilities.load_files(["API/UsersAPI.js"], {
            OnLoad: function () { that.initialize(that.ContainerDiv); }
        });
    }

    Invitation.prototype = {
        initialize: function (containerDiv) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var title = RVDic.InviteYourFriendsToRaaiVan.replace("[RaaiVan]", "«" +
                (Base64.decode((that.Objects.Application || {}).Title) || Base64.decode(RVGlobal.SystemName) || RVDic.RaaiVan) + "»");

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 row", Style: "padding:0.3rem; margin:0rem;",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "margin-bottom:1rem; text-align:center; font-weight:500;",
                        Childs: [{ Type: "text", TextValue: title }]
                    },
                    {
                        Type: "div", Name: "name", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                        Childs: [{
                            Type: "input", Name: "nameInput", Class: "rv-input", Style: "width:100%;", InnerTitle: RVDic.Name + "...",
                            Properties: [{ Name: "onkeyup", Value: function () { this.style.direction = GlobalUtilities.textdirection(this.value); } }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "email", Style: "margin-bottom:1rem;",
                        Childs: [{
                            Type: "input", Name: "emailInput", Class: "rv-input", Style: "width:100%;", InnerTitle: RVDic.Email + "...",
                            Properties: [{ Name: "onkeyup", Value: function () { this.style.direction = GlobalUtilities.textdirection(this.value); } }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                        Childs: [{
                            Type: "textarea", Name: "emailBody", Class: "rv-input", Style: "width:100%; height:4rem; resize:none;",
                            Attributes: [{ Name: "type", Value: "text" }, { Name: "maxlength", Value: 256 }], InnerTitle: RVDic.MessageText + "...",
                            Properties: [{ Name: "onkeyup", Value: function () { this.style.direction = GlobalUtilities.textdirection(this.value); } }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Style: "position:relative; text-align:center;",
                        Childs: [
                            {
                                Type: "div", Name: "reportButton", Class: "SoftTextShadow",
                                Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0;" +
                                    "display:flex; align-items:center; color:blue; cursor:pointer;",
                                Childs: [{ Type: "text", TextValue: RVDic.InvitationsReport }]
                            },
                            {
                                Type: "div", Name: "sendButton", Class: "rv-air-button rv-circle",
                                Style: "display:inline-block;  padding:0.2rem 1.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.Send }]
                            }
                        ]
                    }
                ]
            }], containerDiv);

            var emailInput = elems["emailInput"];
            var nameInput = elems["nameInput"];
            var emailBody = elems["emailBody"];
            var sendButton = elems["sendButton"];

            elems["reportButton"].onclick = function () {
                GlobalUtilities.load_files(["USR/UserInvitations.js"], {
                    OnLoad: function () {
                        var _div = GlobalUtilities.create_nested_elements([{
                            Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                        }])["_div"];

                        GlobalUtilities.show(_div);

                        new UserInvitations(_div, { Application: that.Objects.Application });
                    }
                });
            };

            var _sending = false;

            sendButton.onclick = function () {
                if (_sending) return;

                if (!emailInput.value || !nameInput.value) return alert(RVDic.PleaseFillNecessaryFields);
                if (!GlobalUtilities.is_valid_email(emailInput.value)) return alert(RVDic.Checks.EmailIsNotValid);

                _sending = true;

                var _invite = function () {
                    UsersAPI.InviteUser({
                        ApplicationID: that.Objects.Application.ApplicationID,
                        Email: Base64.encode(GlobalUtilities.secure_string(emailInput.value)),
                        FullName: Base64.encode(GlobalUtilities.secure_string(nameInput.value)),
                        MessageText: Base64.encode(GlobalUtilities.secure_string(emailBody.value)),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            _sending = false;

                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                emailInput.value = nameInput.value = emailBody.value = "";
                                alert(RVDic.MSG.YourMessageSentSuccessfully);
                            }

                            GlobalUtilities.unblock(sendButton);
                        }
                    });
                }

                GlobalUtilities.block(sendButton);

                UsersAPI.IsInvited({
                    ApplicationID: that.Objects.Application.ApplicationID,
                    Email: Base64.encode(GlobalUtilities.secure_string(emailInput.value)), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Invited) {
                            var confirmMsg = RVDic.MSG.ThisEmailIsAlreadyInvited + ". " + RVDic.Confirms.DoYouWantToContinue;

                            GlobalUtilities.confirm(confirmMsg, function (r) {
                                if (r) return _invite();

                                _sending = false;
                                emailInput.value = nameInput.value = emailBody.value = "";
                                GlobalUtilities.unblock(sendButton);
                            });
                        }
                        else _invite();
                    }
                });
            }
        }
    }
})();